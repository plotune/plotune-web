import { createMetadataCache, clearStreamMetadataCaches, METADATA_TTL } from "./metadataCache";
import { createStreamClient } from "./client";
const crypto = { subtle: { digest: async (_, bytes) => Uint8Array.from(require("crypto").createHash("sha256").update(bytes).digest()).buffer } };
const origin = "https://stream.plotune.net";
const project = { id: "p", name: "Shared", revision: 1 };
const filters = { items: [{ id: "f", kind: "filter", revision: 1, data: { id: "f", name: "Real", conditions: [{ path: "environment", operator: "equals", value: "real" }] } }] };
const response = (body, status = 200) => ({ ok: status < 400, status, json: async () => body, headers: { get: () => null } });
const make = (token = "Bearer account-a", options = {}) => createMetadataCache(origin, token, { target: sessionStorage, crypto, ...options });
beforeEach(() => { clearStreamMetadataCaches(); sessionStorage.clear(); });
afterEach(() => clearStreamMetadataCaches());

test("shared snapshots survive a new client in the same session, expire, and explicit refresh bypasses them", async () => {
  let now = 100;
  const cache = make(undefined, { now: () => now }), load = jest.fn().mockResolvedValue(filters);
  await cache.read("/v1/projects/p/filters", load, { useCache: true });
  expect(await make(undefined, { now: () => now }).read("/v1/projects/p/filters", load, { useCache: true })).toEqual(filters);
  expect(load).toHaveBeenCalledTimes(1);
  await cache.read("/v1/projects/p/filters", load);
  expect(load).toHaveBeenCalledTimes(2);
  now += METADATA_TTL + 1;
  await cache.read("/v1/projects/p/filters", load, { useCache: true });
  expect(load).toHaveBeenCalledTimes(3);
});

test("different login sessions and API origins never share snapshots", async () => {
  const load = jest.fn().mockResolvedValue({ items: [project] });
  await make().read("/v1/projects", load, { useCache: true });
  await make("Bearer account-b").read("/v1/projects", load, { useCache: true });
  await createMetadataCache("https://staging.plotune.net", "Bearer account-a", { crypto }).read("/v1/projects", load, { useCache: true });
  expect(load).toHaveBeenCalledTimes(3);
  expect(JSON.stringify(sessionStorage)).not.toContain("Bearer account-a");
});

test("permission data, member lists, raw keys and webhook credentials are never persisted", async () => {
  const cache = make();
  await cache.read("/v1/projects", async () => ({ items: [{ ...project, api_key: "raw-key", membership: { role: "Owner" } }] }));
  for (const path of ["/v1/projects/p", "/v1/projects/p/members", "/v1/projects/p/key", "/v1/projects/p/webhooks"]) {
    const load = jest.fn().mockResolvedValue({ secret: "private-header" });
    await cache.read(path, load, { useCache: true }); await cache.read(path, load, { useCache: true });
    expect(load).toHaveBeenCalledTimes(2);
  }
  const saved = JSON.stringify(sessionStorage);
  expect(saved).not.toContain("raw-key"); expect(saved).not.toContain("private-header"); expect(saved).not.toContain("Owner");
});

test.each(["invalidate", "authorizationFailed", "logout"])("%s invalidation prevents an old in-flight response from restoring snapshots", async (action) => {
  const cache = make(); let finish;
  const read = cache.read("/v1/projects/p/filters", () => new Promise((resolve) => { finish = resolve; }));
  // Wait for the asynchronous namespace, then for the loader to start.
  for (let i = 0; i < 10 && !finish; i++) await Promise.resolve();
  if (action === "logout") clearStreamMetadataCaches();
  else if (action === "authorizationFailed") await cache.authorizationFailed(new Error("Denied"));
  else await cache.invalidate();
  finish(filters); await read;
  const load = jest.fn().mockResolvedValue(filters);
  await make().read("/v1/projects/p/filters", load, { useCache: true });
  expect(load).toHaveBeenCalledTimes(1);
});

test("restricted storage or absent WebCrypto still allow fetching and bounded in-memory reuse", async () => {
  const target = { getItem: () => { throw new Error("Storage blocked"); }, setItem: () => { throw new Error("Storage blocked"); }, removeItem: () => {} };
  const cache = make("isolated", { crypto: {}, target });
  const load = jest.fn().mockResolvedValue(filters);
  await cache.read("/v1/projects/p/filters", load, { useCache: true });
  await cache.read("/v1/projects/p/filters", load, { useCache: true });
  expect(load).toHaveBeenCalledTimes(1);
});

test("cache capacity stays bounded and cached objects cannot mutate the saved definition", async () => {
  const cache = make();
  for (let i = 0; i < 40; i++) await cache.read(`/v1/projects/p${i}/filters`, async () => filters);
  const saved = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
  expect(saved.entries.length).toBeLessThanOrEqual(32);
  const result = await cache.read("/v1/projects/p39/filters", async () => filters, { useCache: true });
  result.items[0].data.conditions[0].value = "changed";
  const again = await cache.read("/v1/projects/p39/filters", async () => filters, { useCache: true });
  expect(again.items[0].data.conditions[0].value).toBe("real");
});

test.each([401, 403])("account status %s clears snapshots; project-key authentication failures do not", async (status) => {
  const fetcher = jest.fn().mockResolvedValueOnce(response(filters)).mockResolvedValueOnce(response({ error: { code: "denied", message: "Denied" } }, status)).mockResolvedValue(response(filters));
  const client = createStreamClient("Bearer actor", { fetcher, cacheOptions: { crypto } });
  await client.resources("p", "filters");
  await expect(client.project("p")).rejects.toMatchObject({ status });
  await client.resources("p", "filters", undefined, { useCache: true });
  expect(fetcher).toHaveBeenCalledTimes(3);
  fetcher.mockResolvedValueOnce(response({ error: { code: "invalid_key", message: "Invalid key" } }, 401));
  await expect(client.mcp("project-key")).rejects.toMatchObject({ status: 401 });
  await client.resources("p", "filters", undefined, { useCache: true });
  expect(fetcher).toHaveBeenCalledTimes(4);
});

test("successful metadata writes invalidate cached shared definitions", async () => {
  const fetcher = jest.fn().mockResolvedValue(response(filters));
  const client = createStreamClient("Bearer writer", { fetcher, cacheOptions: { crypto } });
  await client.resources("p", "filters");
  await client.saveResource("p", "filters", { id: "f", name: "Updated", conditions: [] }, { revision: 1 });
  await client.resources("p", "filters", undefined, { useCache: true });
  expect(fetcher).toHaveBeenCalledTimes(3);
});

test("the cached project list keeps the plan, and only its three fields", async () => {
  const load = jest.fn().mockResolvedValue({ items: [{ ...project, secret: "x" }], plan: { plan: "premium", projectLimit: 10, ownedProjects: 3, billingId: "b" } });
  await make().read("/v1/projects", load, { useCache: true });
  const cached = await make().read("/v1/projects", load, { useCache: true });
  expect(load).toHaveBeenCalledTimes(1);
  expect(cached).toEqual({ items: [project], plan: { plan: "premium", projectLimit: 10, ownedProjects: 3 } });
});
