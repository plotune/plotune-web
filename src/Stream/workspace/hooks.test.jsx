import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useWorkspaceMetadata } from "./hooks";

test("a successful write followed by a failed reload rejects without claiming metadata was refreshed", async () => {
  const initial = { project: { id: "p", name: "Project", revision: 1 }, membership: { role: "Member" } };
  const failure = new Error("Metadata unavailable");
  const client = {
    projects: jest.fn().mockResolvedValue({ items: [initial.project] }),
    project: jest.fn().mockResolvedValue(initial),
    resources: jest.fn().mockResolvedValue({ items: [] }),
  };
  let state;
  function Probe() { state = useWorkspaceMetadata(client, "p"); return null; }
  const container = document.createElement("div"), root = createRoot(container);
  const mount = root.render.bind(root);
  await act(async () => mount(<Probe />));
  expect(state.project.revision).toBe(1);
  client.project.mockRejectedValueOnce(failure);
  const operation = jest.fn().mockResolvedValue({ revision: 2 });
  let caught;
  await act(async () => { try { await state.mutate(operation); } catch (error) { caught = error; } });
  expect(operation).toHaveBeenCalledTimes(1);
  expect(caught).toBe(failure);
  expect(state.error).toBe(failure);
  expect(state.busy).toBe(false);
  expect(state.project.revision).toBe(1);
  // Background refresh handles its own failure rather than leaking an unhandled rejection.
  client.project.mockRejectedValueOnce(failure);
  await act(async () => state.reload());
  client.project.mockResolvedValue({ ...initial, project: { ...initial.project, revision: 2 } });
  await act(async () => state.reload());
  expect(state.project.revision).toBe(2);
  expect(state.error).toBeNull();
  act(() => root.unmount());
});

test.each([false, true])("background refresh cannot invalidate a pending mutation verification (failure: %s)", async (fails) => {
  const initial = { project: { id: "p", name: "Project", revision: 1 }, membership: { role: "Member" } };
  const updated = { ...initial, project: { ...initial.project, revision: 2 } };
  const client = {
    projects: jest.fn().mockResolvedValue({ items: [initial.project] }),
    project: jest.fn().mockResolvedValue(initial),
    resources: jest.fn().mockResolvedValue({ items: [] }),
  };
  let state, finish, reject, pending, caught, resolved = false;
  function Probe() { state = useWorkspaceMetadata(client, "p"); return null; }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  await act(async () => mount(<Probe />));
  client.project.mockImplementationOnce(() => new Promise((resolve, fail) => { finish = resolve; reject = fail; }));
  await act(async () => { pending = state.mutate(async () => ({ revision: 2 })).then(() => { resolved = true; }).catch((error) => { caught = error; }); });
  expect(client.project).toHaveBeenCalledTimes(2);
  await act(async () => {
    await state.reload();
    window.dispatchEvent(new Event("focus"));
  });
  expect(client.project).toHaveBeenCalledTimes(2);
  expect(resolved).toBe(false);
  expect(state.busy).toBe(true);
  const failure = new Error("Verification unavailable");
  await act(async () => { if (fails) reject(failure); else finish(updated); await pending; });
  expect(resolved).toBe(!fails);
  expect(caught).toBe(fails ? failure : undefined);
  expect(state.project.revision).toBe(fails ? 1 : 2);
  expect(state.busy).toBe(false);
  act(() => root.unmount());
});

test("switching projects during verification loads the new project immediately and isolates old errors", async () => {
  const response = (id) => ({ project: { id, name: id, revision: 1 }, membership: { role: "Member" } });
  const client = {
    projects: jest.fn().mockResolvedValue({ items: [response("p").project, response("q").project] }),
    project: jest.fn(async (id) => response(id)),
    resources: jest.fn().mockResolvedValue({ items: [] }),
  };
  let state, finish, pending;
  function Probe({ id }) { state = useWorkspaceMetadata(client, id); return null; }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  await act(async () => mount(<Probe id="p" />));
  client.project.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  await act(async () => { pending = state.mutate(async () => ({})).catch(() => {}); });
  await act(async () => mount(<Probe id="q" />));
  expect(state.project.id).toBe("q");
  expect(state.loading).toBe(false);
  await act(async () => { finish(response("p")); await pending; });
  expect(state.project.id).toBe("q");
  expect(state.error).toBeNull();
  act(() => root.unmount());
});

test("one hour idle and window focus generate no recurring metadata reads; privileged lists load only on their view", async () => {
  jest.useFakeTimers();
  const client = {
    projects: jest.fn().mockResolvedValue({ items: [{ id: "p" }] }),
    project: jest.fn().mockResolvedValue({ project: { id: "p", name: "Shared", revision: 1 }, membership: { role: "Owner" } }),
    resources: jest.fn().mockResolvedValue({ items: [] }), members: jest.fn().mockResolvedValue({ items: [] }),
  };
  let state;
  function Probe({ view }) { state = useWorkspaceMetadata(client, "p", view); return null; }
  const container = document.createElement("div"), root = createRoot(container), mount = root.render.bind(root);
  try {
    await act(async () => mount(<Probe />));
    expect(client.resources).toHaveBeenCalledTimes(2); expect(client.members).not.toHaveBeenCalled();
    await act(async () => { jest.advanceTimersByTime(60 * 60000); window.dispatchEvent(new Event("focus")); });
    expect(client.project).toHaveBeenCalledTimes(1); expect(client.resources).toHaveBeenCalledTimes(2);
    await act(async () => mount(<Probe view="settings" />));
    expect(client.members).toHaveBeenCalledTimes(1);
    expect(client.resources.mock.calls.some((call) => call[1] === "webhooks")).toBe(false);
    await act(async () => mount(<Probe view="webhooks" />));
    expect(client.resources.mock.calls.filter((call) => call[1] === "webhooks")).toHaveLength(1);
    expect(client.members).toHaveBeenCalledTimes(1); expect(state.project.id).toBe("p");
  } finally { act(() => root.unmount()); jest.useRealTimers(); }
});

test("the project list carries the plan, and a created project counts toward it", async () => {
  const client = {
    projects: jest.fn().mockResolvedValue({ items: [{ id: "p" }], plan: { plan: "free", projectLimit: 2, ownedProjects: 1 } }),
    project: jest.fn().mockResolvedValue({ project: { id: "p", revision: 0 }, membership: { role: "Owner" } }),
    resources: jest.fn().mockResolvedValue({ items: [] }),
    createProject: jest.fn().mockResolvedValue({ project: { id: "q", name: "Q" }, api_key: "plt_x" }),
  };
  let state;
  function Probe() { state = useWorkspaceMetadata(client, "p"); return null; }
  const container = document.createElement("div"), root = createRoot(container);
  await act(async () => root.render(<Probe />));
  expect(state.plan).toEqual({ plan: "free", projectLimit: 2, ownedProjects: 1 });
  await act(async () => state.create("Q"));
  expect(state.plan.ownedProjects).toBe(2);
  // A Worker that predates plans sends no plan: nothing is limited in the UI.
  client.projects.mockResolvedValueOnce({ items: [{ id: "p" }] });
  await act(async () => state.loadProjects());
  expect(state.plan).toBeNull();
  act(() => root.unmount());
});
