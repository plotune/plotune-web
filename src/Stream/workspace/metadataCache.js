// Data snapshots only. Project permission, members, keys and webhook credentials
// are never cached. A cached resource is used only after fresh project authorization.
export const METADATA_TTL = 15 * 60 * 1000;
const PREFIX = "plotune-stream-metadata:v1:";
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_ENTRIES = 32;
const stores = new Set();
const namespaces = new Map();
let resetEpoch = 0;
const storage = () => { try { return window.sessionStorage; } catch { return null; } };
const clone = (value) => JSON.parse(JSON.stringify(value));
const pick = (value, fields) => Object.fromEntries(fields.filter((field) => value[field] !== undefined).map((field) => [field, value[field]]));
const allowed = (path) => path === "/v1/projects" || /^\/v1\/projects\/[^/]+\/(filters|dashboards)$/.test(path);
function snapshot(path, value) {
  if (path === "/v1/projects") return { items: value.items.map((item) => pick(item, ["id", "name", "revision", "ownerId", "keyPrefix", "createdAt", "updatedAt"])),
    ...(value.plan ? { plan: pick(value.plan, ["plan", "projectLimit", "ownedProjects"]) } : {}) };
  return { items: value.items.map((item) => ({
    ...pick(item, ["id", "kind", "revision", "generation", "createdAt", "updatedAt"]),
    data: path.endsWith("/filters")
      ? { ...pick(item.data, ["id", "name"]), conditions: item.data.conditions.map((condition) => pick(condition, ["path", "operator", "value"])) }
      : { ...pick(item.data, ["id", "name", "description"]), widgets: item.data.widgets.map((widget) => pick(widget, ["id", "title", "eventName", "visualization", "chartType", "measureProperty", "filterId", "breakdownProperty", "range"])) },
  })) };
}

export function clearStreamMetadataCaches() {
  resetEpoch++;
  for (const store of stores) {
    store.epoch++; store.entries.clear();
    try { if (store.key) store.target?.removeItem(store.key); } catch { /* Restricted storage. */ }
  }
  namespaces.clear(); stores.clear();
  const target = storage();
  try {
    for (let index = (target?.length || 0) - 1; index >= 0; index--) {
      const key = target.key(index);
      if (key?.startsWith(PREFIX)) target.removeItem(key);
    }
  } catch { /* Restricted storage falls back to memory. */ }
}

export function createMetadataCache(origin, token, { target = storage(), crypto = typeof window === "undefined" ? undefined : window.crypto, now = Date.now } = {}) {
  const createdEpoch = resetEpoch;
  const ready = (async () => {
    let key = null;
    try {
      // Namespace the snapshot by origin and exact login session without storing
      // a bearer token or treating its hash as authorization.
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${origin}\n${token}`));
      key = PREFIX + [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    } catch { /* No WebCrypto: use a private, non-persistent cache for this client. */ }
    if (key && namespaces.has(key)) return namespaces.get(key);
    const store = { key, target, entries: new Map(), epoch: 0, listeners: new Set() };
    if (key && createdEpoch === resetEpoch) {
      try {
        const raw = target?.getItem(key);
        if (raw && raw.length <= MAX_BYTES) {
          const saved = JSON.parse(raw);
          if (saved.version === 1 && Array.isArray(saved.entries)) {
            for (const [path, entry] of saved.entries.slice(-MAX_ENTRIES)) {
              if (allowed(path) && entry.expires > now() && entry.expires <= now() + METADATA_TTL && Array.isArray(entry.value?.items)) store.entries.set(path, entry);
            }
          }
        }
      } catch { /* Corrupt or unavailable snapshots are cache misses. */ }
      namespaces.set(key, store);
    }
    stores.add(store);
    return store;
  })();
  const persist = (store) => {
    if (createdEpoch !== resetEpoch) return;
    for (const [path, entry] of store.entries) if (entry.expires <= now()) store.entries.delete(path);
    let encoded = JSON.stringify({ version: 1, entries: [...store.entries] });
    while (store.entries.size > MAX_ENTRIES || new TextEncoder().encode(encoded).byteLength > MAX_BYTES) {
      store.entries.delete(store.entries.keys().next().value);
      encoded = JSON.stringify({ version: 1, entries: [...store.entries] });
    }
    if (store.key) {
      try { target?.setItem(store.key, encoded); }
      catch { try { target?.removeItem(store.key); } catch { /* Memory cache remains bounded. */ } }
    }
  };
  return {
    async read(path, load, { useCache = false, signal } = {}) {
      if (!allowed(path)) return load();
      const epoch = resetEpoch, store = await ready, version = store.epoch;
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      const entry = store.entries.get(path);
      if (useCache && createdEpoch === resetEpoch && entry?.expires > now()) return clone(entry.value);
      const result = await load();
      if (!signal?.aborted && epoch === resetEpoch && createdEpoch === resetEpoch && version === store.epoch) {
        try {
          store.entries.delete(path);
          store.entries.set(path, { expires: now() + METADATA_TTL, value: clone(snapshot(path, result)) });
          persist(store);
        } catch { /* Caching must not turn a successful request into a failure. */ }
      }
      return result;
    },
    async invalidate() {
      const store = await ready;
      store.epoch++; store.entries.clear();
      try { if (store.key) target?.removeItem(store.key); } catch { /* Storage may be restricted. */ }
    },
    async authorizationFailed(error) {
      await this.invalidate();
      const store = await ready;
      for (const listener of store.listeners) listener(error);
    },
    subscribe(listener) {
      let disposed = false, store;
      ready.then((result) => { store = result; if (!disposed) store.listeners.add(listener); });
      return () => { disposed = true; store?.listeners.delete(listener); };
    },
  };
}
