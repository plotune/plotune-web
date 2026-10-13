import {
  collectEvents,
  createStreamClient,
  StreamFailure,
  wireConditions,
} from "./client";
import { createEventExport } from "../exportModel";
import { captureExample } from "./examples";
const now = "2026-10-13T10:00:00.000Z";
const event = (id, properties = {}) => ({
  id,
  event: "motor.sample",
  timestamp: now,
  properties,
});
const response = (body, status = 200) => ({
  ok: status < 400,
  status,
  headers: { get: () => null },
  json: async () => body,
});
const page = (items = [], nextCursor = null) => ({
  items,
  nextCursor,
  snapshot: 4,
  now,
});
const setup = (...results) => {
  const fetcher = jest.fn();
  results.forEach((r) => fetcher.mockResolvedValueOnce(r));
  return {
    client: createStreamClient("Bearer account-jwt", { fetcher }),
    fetcher,
  };
};

test("account authorization is normalized and UI condition metadata never reaches queries", async () => {
  const { client, fetcher } = setup(response(page()));
  await client.query("project/a", {
    filterId: "shared",
    conditions: [
      {
        id: "ui",
        valueType: "number",
        path: "motor.rpm",
        operator: "greater_than",
        value: 1200,
      },
    ],
  });
  const [url, options] = fetcher.mock.calls[0];
  expect(url).toContain("/projects/project%2Fa/events/query");
  expect(options.headers.Authorization).toBe("Bearer account-jwt");
  expect(options.credentials).toBe("omit");
  expect(JSON.parse(options.body).conditions).toEqual([
    { path: "motor.rpm", operator: "greater_than", value: 1200 },
  ]);
  expect(
    wireConditions([{ path: "missing", operator: "not_exists", id: "c" }]),
  ).toEqual([{ path: "missing", operator: "not_exists" }]);
});
test("metadata updates use resource CAS; project keys are distinct from account JWTs", async () => {
  const { client, fetcher } = setup(
    response({}),
    response({}),
    response({ result: { protocolVersion: "2025-06-18" } }),
  );
  await client.saveResource(
    "p",
    "filters",
    { id: "f", name: "real", conditions: [] },
    { revision: 7 },
  );
  await client.deleteResource("p", "filters", { id: "f", revision: 8 }, true);
  await client.mcp("project-secret");
  expect(JSON.parse(fetcher.mock.calls[0][1].body).revision).toBe(7);
  expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual({
    revision: 8,
    confirmReferenced: true,
  });
  expect(fetcher.mock.calls[2][1].headers.Authorization).toBe(
    "Bearer project-secret",
  );
});
test("all-page retrieval continues sparse empty pages and pins snapshot time", async () => {
  const { client, fetcher } = setup(
    response(page([event("hot")], "a")),
    response(page([], "b")),
    response(page([event("archived")])),
  );
  const result = await collectEvents(
    client.pages("p", { filterId: "real", name: "motor.sample", range: "24h" }),
  );
  expect(result.events.map((e) => e.id)).toEqual(["hot", "archived"]);
  expect(JSON.parse(fetcher.mock.calls[1][1].body)).toMatchObject({
    now,
    cursor: "a",
    filterId: "real",
    range: "24h",
    limit: 100,
  });
  expect(JSON.parse(fetcher.mock.calls[2][1].body).cursor).toBe("b");
});
test.each(["snapshot_expired", "query_changed", "missing_filter"])(
  "a %s continuation error fails complete retrieval instead of returning a partial export",
  async (code) => {
    const { client } = setup(
      response(page([event("hot")], "a")),
      response({ error: { code, message: "Restart" } }, 409),
    );
    await expect(collectEvents(client.pages("p", {}))).rejects.toMatchObject({
      code,
      status: 409,
    });
  },
);
test("repeated cursors, duplicate events and changed snapshots cannot silently duplicate results", async () => {
  for (const second of [
    page([event("other")], "a"),
    page([event("hot")]),
    { ...page([event("other")]), snapshot: 5 },
  ]) {
    const { client } = setup(
      response(page([event("hot")], "a")),
      response(second),
    );
    await expect(collectEvents(client.pages("p", {}))).rejects.toBeInstanceOf(
      StreamFailure,
    );
  }
});
test("numeric timestamp formatting normalization preserves explicit time anchors", async () => {
  const { client } = setup(response(page()));
  await expect(
    collectEvents(client.pages("p", { now: "2026-10-13T10:00:00Z" })),
  ).resolves.toMatchObject({ now });
});
test("browser record and byte caps reject rather than truncate; cancellation stops paging", async () => {
  async function* source() {
    yield page([event("a"), event("b")]);
  }
  await expect(collectEvents(source(), { maxEvents: 1 })).rejects.toMatchObject(
    { code: "browser_limit" },
  );
  await expect(collectEvents(source(), { maxBytes: 1 })).rejects.toMatchObject({
    code: "browser_limit",
  });
  const controller = new AbortController();
  controller.abort();
  await expect(
    collectEvents(source(), { signal: controller.signal }),
  ).rejects.toMatchObject({ name: "AbortError" });
});
test("widget retrieval uses saved dashboard references and handles deleted filters", async () => {
  const widget = {
    id: "w",
    filterId: "real",
    eventName: "motor.sample",
    range: "1h",
  };
  const { client, fetcher } = setup(
    response({ status: "ready", widget, page: page([event("a")], "next") }),
    response({ status: "missing-filter", widget, page: null }),
  );
  await expect(
    collectEvents(
      client.pages("p", {}, { widget: { dashboardId: "d", id: "w" } }),
    ),
  ).rejects.toMatchObject({ code: "missing_filter" });
  expect(fetcher.mock.calls[0][0]).toContain("/dashboards/d/widgets/w/data");
});
test("changed widget definitions cannot produce a chart from incompatible pages", async () => {
  const { client } = setup(
    response({
      status: "ready",
      widget: { filterId: "real" },
      page: page([event("a")], "next"),
    }),
    response({
      status: "ready",
      widget: { filterId: "simulation" },
      page: page([event("b")]),
    }),
  );
  await expect(
    collectEvents(
      client.pages("p", {}, { widget: { dashboardId: "d", id: "w" } }),
    ),
  ).rejects.toMatchObject({ code: "widget_changed" });
});
test.each([401, 403, 429, 503])(
  "status %s stays explicit without redirecting or clearing auth",
  async (status) => {
    const { client } = setup(
      response({ error: { code: "test", message: "Unavailable" } }, status),
    );
    await expect(client.projects()).rejects.toMatchObject({
      status,
      code: "test",
    });
  },
);
test("invalid insecure origins are rejected before sending credentials", () => {
  for (const origin of [
    "http://example.test",
    "https://user:pass@example.test",
    "https://example.test/other",
  ])
    expect(() => createStreamClient("secret", { origin })).toThrow(
      "HTTPS API origin",
    );
});
test("capture snippets escape manual keys and use the configured API origin", () => {
  const snippet = captureExample(
    "Python",
    'key"quoted',
    "https://local.example",
  );
  expect(snippet).toContain("https://local.example/capture");
  expect(snippet).not.toContain("device_id");
  expect(captureExample("cURL", "a'b", "https://local.example")).toContain(
    `'"'"'`,
  );
});
const exportFixtures = [
  event("a", {
    motor: { rpm: 1680 },
    text: 'comma, tab\t quote"\nnext',
    nullable: null,
    mixed: "1680",
  }),
  event("b", { motor: { rpm: 1500 }, mixed: 1680 }),
];
const blobText = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob);
  });
test("complete JSON export retains structure and original types", async () => {
  const result = await createEventExport(exportFixtures, "json");
  expect(result.count).toBe(2);
  expect(JSON.parse(await blobText(result.blob))).toEqual(exportFixtures);
});
test.each(["csv", "tsv"])(
  "complete %s export escapes nested columns, delimiters, quotes and newlines",
  async (format) => {
    const result = await createEventExport(exportFixtures, format);
    const text = await blobText(result.blob);
    expect(result.count).toBe(2);
    expect(text).toContain("properties.motor.rpm");
    expect(text).toContain('quote""\nnext');
    expect(text).toContain("null");
    expect(text).toContain('"comma, tab\t quote""\nnext"');
  },
);

test("only an account 401 invalidates the workspace session; a project-key MCP failure does not", async () => {
  const onUnauthorized = jest.fn();
  const fetcher = jest
    .fn()
    .mockResolvedValue(
      response({ error: { code: "invalid_token", message: "Expired" } }, 401),
    );
  const client = createStreamClient("account", { fetcher, onUnauthorized });
  await expect(client.mcp("old-project-key")).rejects.toMatchObject({
    status: 401,
  });
  expect(onUnauthorized).not.toHaveBeenCalled();
  await expect(client.projects()).rejects.toMatchObject({ status: 401 });
  expect(onUnauthorized).toHaveBeenCalledTimes(1);
});

test("converted output also has a byte cap for sparse events with many different columns", async () => {
  await expect(
    createEventExport(exportFixtures, "csv", { maxBytes: 64 }),
  ).rejects.toThrow("converted export exceeds");
});
test("large retrievals share two slots, cancel queued work, and release slots on failure", async () => {
  const blocked = [];
  const fetcher = jest.fn(
    () => new Promise((resolve) => blocked.push(resolve)),
  );
  const client = createStreamClient("account", { fetcher });
  const a = client.pages("p", {}),
    b = client.pages("p", {}),
    abort = new AbortController();
  const c = client.pages("p", {}, { signal: abort.signal });
  const firstA = a.next(),
    firstB = b.next(),
    firstC = c.next();
  await Promise.resolve();
  await Promise.resolve();
  expect(fetcher).toHaveBeenCalledTimes(2);
  abort.abort();
  await expect(firstC).rejects.toMatchObject({ name: "AbortError" });
  expect(fetcher).toHaveBeenCalledTimes(2);
  blocked[0](response(page()));
  blocked[1](response(page()));
  await firstA;
  await firstB;
  await a.return();
  await b.return();
  const d = client.pages("p", {});
  const firstD = d.next();
  await Promise.resolve();
  expect(fetcher).toHaveBeenCalledTimes(3);
  blocked[2](response(page()));
  await firstD;
  await d.return();
});

test("malformed successful event pages become recoverable errors rather than a broken Explorer", async () => {
  for (const invalid of [
    { items: null },
    { ...page(), nextCursor: "" },
    { ...page(), now: "invalid" },
  ]) {
    const { client } = setup(response(invalid));
    await expect(client.query("p", {})).rejects.toMatchObject({
      code: "invalid_response",
      status: 503,
    });
  }
});

test("CSV distinguishes literal dotted keys, nested paths, Unicode keys and empty objects", async () => {
  const result = await createEventExport(
    [event("paths", { "a.b": 1, a: { b: 2 }, 温度: 81, empty: {} })],
    "csv",
  );
  const text = await blobText(result.blob);
  expect(text).toContain('"properties[""a.b""]"');
  expect(text).toContain("properties.a.b");
  expect(text).toContain('"properties[""温度""]"');
  expect(text).toContain("{}");
});
