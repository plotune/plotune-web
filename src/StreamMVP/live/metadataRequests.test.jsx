import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { createStreamClient } from "./client";
import { useWorkspaceMetadata } from "./hooks";
import { clearStreamMetadataCaches } from "./metadataCache";
const crypto = { subtle: { digest: async (_, bytes) => Uint8Array.from(require("crypto").createHash("sha256").update(bytes).digest()).buffer } };
const project = { id: "p", name: "Shared", revision: 1 };
let server, fetcher, root, mount, state;
const reply = (body, status = 200) => ({ ok: status < 400, status, headers: { get: () => null }, json: async () => body });
beforeEach(() => {
  clearStreamMetadataCaches();
  server = { role: "Owner", allowed: true, revision: 1, value: "real" };
  fetcher = jest.fn(async (url) => {
    const path = new URL(url).pathname;
    if (!server.allowed) return reply({ error: { code: "forbidden", message: "Permission removed" } }, 403);
    if (path === "/v1/projects") return reply({ items: [project] });
    if (path === "/v1/projects/p") return reply({ project, membership: { role: server.role } });
    if (path.endsWith("/filters")) return reply({ items: [{ id: "f", kind: "filter", revision: server.revision, data: { id: "f", name: "Shared", conditions: [{ path: "environment", operator: "equals", value: server.value }] } }] });
    return reply({ items: [] });
  });
  root = createRoot(document.createElement("div")); mount = root.render.bind(root);
});
afterEach(() => { act(() => root.unmount()); clearStreamMetadataCaches(); });
function Probe({ client }) { state = useWorkspaceMetadata(client, "p"); return null; }
const client = (token = "Bearer cache-session") => createStreamClient(token, { fetcher, cacheOptions: { crypto } });

test("warm reload uses one fresh permission request, cached team resources, and the current role", async () => {
  await act(async () => mount(<Probe client={client()} />));
  expect(fetcher).toHaveBeenCalledTimes(4);
  act(() => root.unmount()); root = createRoot(document.createElement("div")); mount = root.render.bind(root);
  fetcher.mockClear(); server.role = "Member";
  await act(async () => mount(<Probe client={client()} />));
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(new URL(fetcher.mock.calls[0][0]).pathname).toBe("/v1/projects/p");
  expect(state.role).toBe("Member"); expect(state.members).toEqual([]); expect(state.webhooks).toEqual([]);
  expect(state.filters[0].conditions[0].value).toBe("real");
  server.value = "simulation"; server.revision = 2;
  await act(async () => state.reload());
  expect(state.filters[0].revision).toBe(2); expect(state.filters[0].conditions[0].value).toBe("simulation");
  expect(fetcher).toHaveBeenCalledTimes(4);
});

test("revoked project permission hides stored resources instead of rendering a cached grant", async () => {
  await act(async () => mount(<Probe client={client()} />));
  act(() => root.unmount()); root = createRoot(document.createElement("div")); mount = root.render.bind(root);
  server.allowed = false; fetcher.mockClear();
  await act(async () => mount(<Probe client={client()} />));
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(state.project).toBeNull(); expect(state.filters).toEqual([]); expect(state.projects).toEqual([]);
  expect(state.error.status).toBe(403);
  expect(Object.keys(sessionStorage).some((key) => key.startsWith("plotune-stream-metadata:"))).toBe(false);
});

test("a denied runtime read clears visible metadata and previously cached resource snapshots", async () => {
  const api = client();
  await act(async () => mount(<Probe client={api} />));
  expect(state.filters).toHaveLength(1);
  server.allowed = false;
  await act(async () => { await expect(api.query("p", { range: "all" })).rejects.toMatchObject({ status: 403 }); });
  expect(state.project).toBeNull(); expect(state.filters).toEqual([]); expect(state.keys).toEqual({});
});

test("a late forbidden response for another project does not hide the current authorized project", async () => {
  const api = client();
  await act(async () => mount(<Probe client={api} />));
  server.allowed = false;
  await act(async () => { await expect(api.query("old-project", { range: "all" })).rejects.toMatchObject({ status: 403, projectId: "old-project" }); });
  expect(state.project.id).toBe("p"); expect(state.filters).toHaveLength(1);
});

test("temporary runtime denial keeps a one-time key hidden in memory; fresh Member role removes it", async () => {
  const api = client();
  const original = fetcher.getMockImplementation();
  fetcher.mockImplementation((url, options) => {
    if (new URL(url).pathname.endsWith("/key")) return Promise.resolve(reply({ project, api_key: "raw-once" }));
    return original(url, options);
  });
  await act(async () => mount(<Probe client={api} />));
  await act(async () => state.rotate());
  expect(state.keys.p).toBe("raw-once");
  expect(JSON.stringify(sessionStorage)).not.toContain("raw-once");
  server.allowed = false;
  await act(async () => { await expect(api.query("p", { range: "all" })).rejects.toMatchObject({ status: 403 }); });
  expect(state.project).toBeNull();
  server.allowed = true;
  await act(async () => state.reload());
  expect(state.role).toBe("Owner"); expect(state.keys.p).toBe("raw-once");
  server.role = "Member";
  await act(async () => state.reload());
  expect(state.keys.p).toBeUndefined();
});

test("a fresh project list can recover other accessible projects after the selected scope is denied", async () => {
  const api = client();
  await act(async () => mount(<Probe client={api} />));
  const original = fetcher.getMockImplementation();
  fetcher.mockImplementation((url, options) => new URL(url).pathname === "/v1/projects"
    ? Promise.resolve(reply({ items: [{ ...project, id: "q", name: "Other accessible project" }] }))
    : original(url, options));
  server.allowed = false;
  await act(async () => state.reload());
  await act(async () => state.loadProjects());
  expect(state.project).toBeNull(); expect(state.projects.map((item) => item.id)).toEqual(["q"]);
});
