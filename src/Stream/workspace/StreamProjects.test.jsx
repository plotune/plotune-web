import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Workspace } from "./StreamWorkspace";
import workspaceClient from "../../workspaces/client";
import { resetWorkspaceStore } from "../../workspaces/store";

jest.mock("../../workspaces/client", () => ({
  __esModule: true,
  default: { listWorkspaces: jest.fn(), getWorkspace: jest.fn(), forgetWorkspace: jest.fn(), requestClaim: jest.fn() },
  sessionAuthorization: () => "Bearer account-session",
}));

const detail = (projects) => ({ id: "w1", name: "Rig team", revision: 3, role: "Owner", members: [], invites: [], projects });
const projects = [
  { id: "p1", name: "ECU bench", revision: 1, services: ["stream", "rms"] },
  { id: "p2", name: "Brake rig", revision: 1, services: ["stream"] },
  { id: "p3", name: "Docs only", revision: 1, services: ["rms"] },
  { id: "p4", name: "Archive", revision: 1, services: [] },
];
let container, root, fetchMock, state;
const json = (body, status = 200) => ({ ok: status < 400, status, headers: { get: () => null }, json: async () => body });

beforeEach(() => {
  resetWorkspaceStore();
  window.localStorage.clear();
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  state = { role: "Owner", hasKey: false };
  workspaceClient.listWorkspaces.mockResolvedValue([{ id: "w1", name: "Rig team", role: "Owner", revision: 3, projectCount: 4, services: ["stream", "rms"] }]);
  workspaceClient.getWorkspace.mockResolvedValue(detail(projects));
  workspaceClient.requestClaim.mockImplementation(async () => ({ service: "stream", token: "stream-claim", expiresAt: new Date(Date.now() + 900000).toISOString(), role: state.role, projectRevision: 1 }));
  fetchMock = jest.spyOn(global, "fetch").mockImplementation(async (url, options) => {
    const { pathname } = new URL(url);
    if (/^\/v1\/projects\/p\d$/.test(pathname)) return json({ project: { id: pathname.split("/")[3], revision: 4, hasKey: state.hasKey, state: "active" } });
    if (pathname.endsWith("/key")) { state.hasKey = true; return json({ api_key: "plt_secret_once", project: { id: "p1", revision: 5, hasKey: true, state: "active" } }); }
    return json({ items: [], eventNames: [], properties: [], ids: [], cursor: "", reset: false });
  });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); fetchMock.mockRestore(); });

const mount = async (entry = "/stream/workspace?view=api") => {
  await act(async () => root.render(
    <MemoryRouter initialEntries={[entry]}><HelmetProvider><Workspace token="Bearer account-session" user={{ username: "ada" }} logout={() => {}} onUnauthorized={() => {}} /></HelmetProvider></MemoryRouter>,
  ));
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
};
const stream = () => fetchMock.mock.calls.filter(([url]) => url.startsWith("https://stream.plotune.net"));
const button = (text) => [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === text);

test("the picker lists only the workspace's projects with Stream on, and has no create or member screens", async () => {
  await mount();
  const options = [...container.querySelectorAll('select[aria-label="Project"] option')].map((o) => o.textContent);
  expect(options).toEqual(["Select a project", "ECU bench", "Brake rig"]);
  expect(container.textContent).not.toContain("Create project");
  expect(container.textContent).not.toContain("Docs only");
  const manage = [...container.querySelectorAll("a")].find((a) => a.textContent.includes("Manage in workspace"));
  expect(manage.getAttribute("href")).toBe("/workspaces/w1");
  expect(container.querySelector(".st-top-project").textContent).toBe("ECU bench");
});

test("every project call sends the Stream claim for that project; the claim is asked for once, for Stream only", async () => {
  await mount();
  const calls = stream();
  expect(calls.length).toBeGreaterThan(0);
  calls.forEach(([, options]) => expect(options.headers.Authorization).toBe("Bearer stream-claim"));
  expect(workspaceClient.requestClaim).toHaveBeenCalledTimes(1);
  expect(workspaceClient.requestClaim).toHaveBeenCalledWith("w1", "p1", "stream");
  expect(stream().some(([url]) => /\/v1\/projects(\?|$)/.test(url))).toBe(false);
});

test("an owner creates the first capture key, sees it once, and the button becomes a rotation", async () => {
  await mount();
  expect(container.textContent).toContain("no capture key yet");
  await act(async () => button("Create capture key").click());
  const call = stream().find(([url]) => url.endsWith("/v1/projects/p1/key"));
  expect(call[1].method).toBe("POST");
  expect(JSON.parse(call[1].body)).toEqual({ revision: 4 });
  expect(call[1].headers.Authorization).toBe("Bearer stream-claim");
  expect(container.querySelector('input[aria-label="New capture key"]').value).toBe("plt_secret_once");
  expect(button("Rotate capture key")).toBeTruthy();
});

test("a member sees no key button; a viewer sees no webhooks and no write controls", async () => {
  state.role = "Member";
  await mount();
  expect(button("Create capture key")).toBeUndefined();
  expect(container.textContent).toContain("An owner or admin can create it");
  act(() => root.unmount()); root = createRoot(container);
  state.role = "Viewer";
  await mount("/stream/workspace?view=dashboards");
  expect([...container.querySelectorAll("nav button")].map((b) => b.textContent)).not.toContain("Webhooks");
  expect(button("New dashboard")).toBeUndefined();
  expect(stream().some(([url]) => url.endsWith("/webhooks"))).toBe(false);
});

test("a viewer who opens the webhooks link lands on events instead", async () => {
  state.role = "Viewer";
  await mount("/stream/workspace?view=webhooks");
  expect(container.querySelector(".sw-page-head h1").textContent).toBe("Events");
  expect(stream().some(([url]) => url.endsWith("/webhooks"))).toBe(false);
});

test("a workspace without Stream projects points to the workspace page; no workspace points to creating one", async () => {
  workspaceClient.getWorkspace.mockResolvedValue(detail([projects[2], projects[3]]));
  await mount();
  expect(container.textContent).toContain("Turn on Stream for a project");
  expect(container.querySelector('a[href="/workspaces/w1"]')).not.toBeNull();
  expect(stream()).toHaveLength(0);
  act(() => root.unmount()); root = createRoot(container); resetWorkspaceStore();
  workspaceClient.listWorkspaces.mockResolvedValue([]);
  await mount();
  expect(container.textContent).toContain("Create your first workspace");
  expect(container.querySelector('a[href="/workspaces"]')).not.toBeNull();
});

test("a project without Stream in the link is unavailable rather than silently replaced", async () => {
  await mount("/stream/workspace?view=api&workspace=w1&project=p3");
  expect(container.textContent).toContain("Project unavailable");
  expect(stream()).toHaveLength(0);
});

test("a claim the service keeps rejecting is explained and does not sign the person out", async () => {
  const onUnauthorized = jest.fn();
  fetchMock.mockImplementation(async () => json({ error: { code: "claim_revoked", message: "raw" } }, 401));
  await act(async () => root.render(
    <MemoryRouter initialEntries={["/stream/workspace?view=api"]}><HelmetProvider><Workspace token="Bearer account-session" user={{}} logout={() => {}} onUnauthorized={onUnauthorized} /></HelmetProvider></MemoryRouter>,
  ));
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
  expect(container.textContent).toContain("Your access to this project changed");
  expect(onUnauthorized).not.toHaveBeenCalled();
  expect(workspaceClient.requestClaim).toHaveBeenCalledTimes(2);
});
