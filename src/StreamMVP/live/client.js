// PR #44, finalized Redis/R2 event plane. No demo data or local persistence.
export const STREAM_ORIGIN =
  process.env.REACT_APP_STREAM_API_ORIGIN || "https://stream.plotune.net";
export const WORKSPACE_ENABLED =
  process.env.REACT_APP_STREAM_WORKSPACE_ENABLED === "true";
export class StreamFailure extends Error {
  constructor(status, code, message, retryAfter = null) {
    super(message);
    this.name = "StreamFailure";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}
export const wireConditions = (conditions = []) =>
  conditions.map(({ path, operator, value }) => ({
    path,
    operator,
    ...(value !== undefined ? { value } : {}),
  }));
export const uiConditions = (conditions = []) =>
  conditions.map((condition, index) => ({
    ...condition,
    id: `condition-${index}`,
    ...(condition.value !== undefined
      ? { valueType: typeof condition.value }
      : {}),
  }));
export const resourceData = (record) => ({
  ...record.data,
  revision: record.revision,
  updatedAt: record.updatedAt,
  createdAt: record.createdAt,
});
const encoded = (value) => encodeURIComponent(value);
const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));

function eventPage(page) {
  if (
    !page ||
    !Array.isArray(page.items) ||
    typeof page.now !== "string" ||
    !Number.isFinite(Date.parse(page.now)) ||
    !Number.isSafeInteger(page.snapshot) ||
    (page.nextCursor !== null &&
      (typeof page.nextCursor !== "string" || !page.nextCursor))
  )
    throw new StreamFailure(
      503,
      "invalid_response",
      "Stream returned an invalid event page.",
    );
  return page;
}

// Bound simultaneous full-history retrievals across charts, previews and exports.
function retrievalQueue(limit = 2) {
  let active = 0;
  const pending = [];
  const releaseSlot = () => {
    let released = false;
    return () => {
      if (!released) {
        released = true;
        active--;
        drain();
      }
    };
  };
  const drain = () => {
    while (active < limit && pending.length) {
      const job = pending.shift();
      job.signal?.removeEventListener("abort", job.cancel);
      if (job.signal?.aborted) {
        job.cancel();
        continue;
      }
      active++;
      job.resolve(releaseSlot());
    }
  };
  return (signal) =>
    new Promise((resolve, reject) => {
      const job = {
        signal,
        resolve,
        cancel: () => {
          const index = pending.indexOf(job);
          if (index >= 0) pending.splice(index, 1);
          signal?.removeEventListener("abort", job.cancel);
          reject(new DOMException("Cancelled", "AbortError"));
        },
      };
      if (signal?.aborted) {
        job.cancel();
        return;
      }
      pending.push(job);
      signal?.addEventListener("abort", job.cancel, { once: true });
      drain();
    });
}

export function createStreamClient(
  token,
  {
    origin = STREAM_ORIGIN,
    fetcher = fetch,
    timeout = 15000,
    onUnauthorized = () => {},
  } = {},
) {
  const url = new URL(origin);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error("Stream requires a HTTPS API origin.");
  const authorization = `Bearer ${String(token || "").replace(/^Bearer\s+/i, "")}`;
  const metadata = (projectId, suffix = "") =>
    `/v1/projects/${encoded(projectId)}${suffix}`;
  const data = (projectId, suffix) =>
    `/v1/data/projects/${encoded(projectId)}${suffix}`;
  async function request(path, { method = "GET", body, signal, key } = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(abort, timeout);
    try {
      const response = await fetcher(url.origin + path, {
        method,
        signal: controller.signal,
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        headers: {
          Authorization: key !== undefined ? `Bearer ${key}` : authorization,
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new StreamFailure(
          503,
          "invalid_response",
          "Stream returned an invalid response. Retry when the service is available.",
        );
      }
      if (!response.ok)
        throw new StreamFailure(
          response.status,
          result.error?.code || "request_failed",
          result.error?.message ||
            `Stream request failed (${response.status}).`,
          response.headers?.get("Retry-After"),
        );
      return result;
    } catch (error) {
      if (error instanceof StreamFailure) {
        if (error.status === 401 && key === undefined) onUnauthorized();
        throw error;
      }
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      throw new StreamFailure(
        503,
        "service_unavailable",
        controller.signal.aborted
          ? "Stream took too long to respond. Retry this request."
          : "Stream is unavailable. Check your connection and retry.",
      );
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }
  const acquireRetrieval = retrievalQueue();
  const pageRequest = async (id, query, options = {}) =>
    eventPage(
      await request(data(id, "/events/query"), {
        method: "POST",
        body: {
          ...query,
          conditions: wireConditions(query.conditions),
          limit: options.limit || 20,
        },
        signal: options.signal,
      }),
    );
  async function* pages(id, query, { signal, widget } = {}) {
    let cursor = null,
      now = query.now,
      snapshot,
      definition;
    const cursors = new Set();
    const release = await acquireRetrieval(signal);
    try {
      do {
        const payload = {
          ...query,
          ...(now ? { now } : {}),
          ...(cursor ? { cursor } : {}),
          limit: 100,
        };
        let page;
        if (widget) {
          const result = await request(
            data(
              id,
              `/dashboards/${encoded(widget.dashboardId)}/widgets/${encoded(widget.id)}/data`,
            ),
            { method: "POST", body: payload, signal },
          );
          if (result.status === "missing-filter")
            throw new StreamFailure(
              409,
              "missing_filter",
              "This widget's Saved Filter was deleted. Choose a replacement.",
            );
          const serialized = JSON.stringify(result.widget);
          if (definition !== undefined && definition !== serialized)
            throw new StreamFailure(
              409,
              "widget_changed",
              "Widget configuration changed. Refresh its chart.",
            );
          definition = serialized;
          page = result.page;
        } else page = await pageRequest(id, payload, { limit: 100, signal });
        eventPage(page);
        if (
          (snapshot !== undefined && snapshot !== page.snapshot) ||
          (now && new Date(now).getTime() !== new Date(page.now).getTime())
        )
          throw new StreamFailure(
            409,
            "query_changed",
            "Event snapshot changed. Restart this retrieval.",
          );
        snapshot = page.snapshot;
        now = page.now;
        cursor = page.nextCursor;
        if (cursor) {
          if (cursors.has(cursor))
            throw new StreamFailure(
              503,
              "invalid_response",
              "Event pagination did not advance. Retry the retrieval.",
            );
          cursors.add(cursor);
        }
        yield { ...page, total: null };
        await yieldToBrowser();
      } while (cursor);
    } finally {
      release();
    }
  }
  return {
    origin: url.origin,
    request,
    pages,
    query: pageRequest,
    projects: (signal) => request("/v1/projects", { signal }),
    project: (id, signal) => request(metadata(id), { signal }),
    createProject: (name) =>
      request("/v1/projects", { method: "POST", body: { name } }),
    renameProject: (id, name, revision) =>
      request(metadata(id), { method: "PATCH", body: { name, revision } }),
    rotateKey: (id, revision) =>
      request(metadata(id, "/key"), { method: "POST", body: { revision } }),
    members: (id, signal) => request(metadata(id, "/members"), { signal }),
    member: (id, email, role, revision, remove = false) =>
      request(metadata(id, `/members/${encoded(email)}`), {
        method: remove ? "DELETE" : "PUT",
        body: { revision, ...(!remove ? { role } : {}) },
      }),
    resources: (id, kind, signal) =>
      request(metadata(id, `/${kind}`), { signal }),
    saveResource: (id, kind, record, existing) =>
      request(
        metadata(id, `/${kind}${existing ? `/${encoded(record.id)}` : ""}`),
        {
          method: existing ? "PUT" : "POST",
          body: {
            data: record,
            ...(existing ? { revision: existing.revision } : {}),
          },
        },
      ),
    deleteResource: (id, kind, record, confirmReferenced = false) =>
      request(metadata(id, `/${kind}/${encoded(record.id)}`), {
        method: "DELETE",
        body: {
          revision: record.revision,
          ...(confirmReferenced ? { confirmReferenced: true } : {}),
        },
      }),
    discovery: (id, signal) => request(data(id, "/discovery"), { signal }),
    usage: (id, signal) => request(data(id, "/usage"), { signal }),
    event: (id, eventId, signal) =>
      request(data(id, `/events/${encoded(eventId)}`), { signal }),
    realtime: (id, after, signal) =>
      request(data(id, "/realtime"), {
        method: "POST",
        body: { after },
        signal,
      }),
    deliveries: (id, signal) =>
      request(data(id, "/webhook-deliveries"), { signal }),
    mcp: (key, signal) =>
      request("/mcp", {
        method: "POST",
        key,
        signal,
        body: {
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "plotune-workspace", version: "1.0" },
          },
        },
      }),
  };
}

export async function collectEvents(
  pages,
  {
    signal,
    maxEvents = 10000,
    maxBytes = 32 * 1024 * 1024,
    onProgress = () => {},
  } = {},
) {
  const events = [],
    ids = new Set();
  let bytes = 0,
    now;
  const encoder = new TextEncoder();
  for await (const page of pages) {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    now = page.now;
    for (const event of page.items) {
      if (ids.has(event.id))
        throw new StreamFailure(
          503,
          "invalid_response",
          "Duplicate events in a snapshot. Restart retrieval.",
        );
      ids.add(event.id);
      bytes += encoder.encode(JSON.stringify(event)).byteLength;
      if (events.length >= maxEvents || bytes > maxBytes)
        throw new StreamFailure(
          413,
          "browser_limit",
          `This browser can retrieve up to ${maxEvents.toLocaleString()} matching events or ${Math.round(maxBytes / 1024 / 1024)} MB. Narrow the event or time filters and try again; no partial result was used.`,
        );
      events.push(event);
    }
    onProgress(events.length, null);
  }
  return { events, now };
}
