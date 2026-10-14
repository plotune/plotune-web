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
