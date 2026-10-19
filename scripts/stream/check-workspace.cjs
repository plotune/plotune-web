/* Browser contract fixtures only: every non-local request is intercepted.
   Run against an enabled local frontend: REACT_APP_STREAM_WORKSPACE_ENABLED=true npm start. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const origin = process.env.STREAM_QA_ORIGIN || "http://localhost:3000";
const output = process.env.STREAM_QA_OUTPUT || "/tmp/plotune-stream-qa";
const now = new Date().toISOString();
const condition = { path: "environment", operator: "equals", value: "real" };
const wrap = (data, kind, revision = 1) => ({
  id: data.id,
  data,
  kind,
  generation: `g-${revision}`,
  revision,
  createdAt: now,
  updatedAt: now,
});
const project = {
  id: "robot-validation",
  name: "Robot validation",
  ownerId: "owner-fixture",
  revision: 1,
  keyPrefix: "plt_demo",
  createdAt: now,
  updatedAt: now,
};
const widgets = [
  {
    id: "rpm-real",
    title: "Real-system RPM",
    eventName: "motor.sample",
    visualization: "line",
    chartType: "line",
    measureProperty: "motor.rpm",
    filterId: "real",
    breakdownProperty: "sw_version",
    range: "1h",
  },
  {
    id: "rpm-sim",
    title: "Simulation RPM",
    eventName: "motor.sample",
    visualization: "line",
    chartType: "bar",
    measureProperty: "motor.rpm",
    filterId: "simulation",
    breakdownProperty: "sw_version",
    range: "1h",
  },
];
let filters = [
  wrap({ id: "real", name: "Real System", conditions: [condition] }, "filter"),
  wrap(
    {
      id: "simulation",
      name: "Simulation",
      conditions: [{ ...condition, value: "simulation" }],
    },
    "filter",
  ),
];
let dashboards = [
  wrap(
    {
      id: "validation",
      name: "Robot Validation Dashboard",
      description: "One robot across real and simulation.",
      widgets,
    },
    "dashboard",
  ),
];
let failWebhookRefresh = false;
let webhooks = [],
  members = [{ email: "owner@example.test", role: "Owner" }],
  key = "plt_synthetic-key",
  sequence = 1,
  expireNext = false;
const incoming = [];
let freshProject = null;
const freshEvents = [];
const freshKey = "plt_fresh-synthetic-key";
let deliveryUnavailable = false;
const events = Array.from({ length: 110 }, (_, i) => ({
  id: `event-${i}`,
  event: i % 11 === 0 ? "drone.error" : "motor.sample",
  timestamp: new Date(Date.now() - i * 10000).toISOString(),
  device_id: "motor-003",
  session_id: "test-run-817",
  properties: {
    robot_id: "R-001",
    environment: i % 2 ? "simulation" : "real",
    sw_version: i % 3 ? "v1.4" : "v1.3",
    test_date: i % 2 ? "2026-10-08" : "2026-10-09",
    motor: {
      rpm: i === 1 ? "1680" : 1500 + i * 3,
      temperature: i % 7 ? 72 + (i % 10) : null,
    },
    ...(i % 5 ? { bench: "B-01" } : {}),
    message: 'comma, tab\t "quoted"\nnext',
  },
}));
const snapshots = new Map();
let snapshot = 0;
const calls = [];
function read(e, p) {
  return p
    .split(".")
    .reduce(
      (v, k) => (v && Object.hasOwn(v, k) ? v[k] : undefined),
      e.properties,
    );
}
function matches(e, c) {
  const v = read(e, c.path);
  switch (c.operator) {
    case "equals":
      return v === c.value;
    case "greater_than":
      return typeof v === "number" && v > c.value;
    case "exists":
      return v !== undefined;
    default:
      throw new Error(`Unsupported fixture operator ${c.operator}`);
  }
}
function select(query) {
  let cs = query.conditions || [];
  if (query.filterId) {
    const f = filters.find((f) => f.id === query.filterId);
    if (!f) throw new Error("missing_filter");
    cs = [...cs, ...f.data.conditions];
  }
  return events.filter(
    (e) =>
      (!query.name || query.name === "All events" || e.event === query.name) &&
      (!query.search ||
        JSON.stringify(e).toLowerCase().includes(query.search.toLowerCase())) &&
      cs.every((c) => matches(e, c)),
  );
}
function getPage(query) {
  if (query.cursor) {
    if (expireNext) {
      expireNext = false;
      throw new Error("snapshot_expired");
    }
    const [id, offset] = query.cursor.split(":").map(Number);
    const s = snapshots.get(id);
    if (!s) throw new Error("snapshot_expired");
    const items = s.events.slice(offset, offset + (query.limit || 50));
    return {
      items,
      nextCursor:
        offset + items.length < s.events.length
          ? `${id}:${offset + items.length}`
          : null,
      snapshot: id,
      now: s.now,
    };
  }
  const items = select(query);
  const id = ++snapshot;
  snapshots.set(id, { events: items, now: query.now || now });
  const limit = query.limit || 50;
  return {
    items: items.slice(0, limit),
    nextCursor: items.length > limit ? `${id}:${limit}` : null,
    snapshot: id,
    now: query.now || now,
  };
}
async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await context.addCookies([
    {
      name: "auth_token",
      value: "Bearer synthetic-account-token",
      url: origin,
    },
  ]);
  const metadataCalls = [];
  await context.route("**/*", async (route) => {
    const req = route.request(),
      u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    if (req.method() !== "OPTIONS" && u.pathname.startsWith("/v1/projects")) metadataCalls.push(`${req.method()} ${u.pathname}`);
    const respond = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(data),
        headers: { "Access-Control-Allow-Origin": origin },
      });
    if (req.method() === "OPTIONS") return respond({}, 204);
    if (u.hostname === "api.plotune.net")
      return respond(
        u.pathname === "/auth/validate"
          ? { valid: true, username: "Fixture owner" }
          : {
              user_id: "owner-fixture",
              username: "Fixture owner",
              email: "owner@example.test",
              full_name: "Fixture Owner",
            },
      );
    if (u.hostname !== "stream.plotune.net") return route.abort();
    const q = req.postDataJSON() || {},
      parts = u.pathname.split("/").filter(Boolean);
    calls.push({ path: u.pathname, method: req.method(), body: q });
    try {
      if (u.pathname === "/capture" && q.api_key === freshKey) {
        const e = { id: "fresh-event", event: q.event, timestamp: new Date().toISOString(), device_id: q.device_id, session_id: q.session_id, properties: q.properties };
        freshEvents.push(e);
        return respond({ accepted: true, event: e, duplicate: false }, 201);
      }
      if (parts[2] === "fresh-project") {
        if (parts.length === 3) return respond({ project: freshProject, membership: members[0] });
        return respond({ items: [] });
      }
      if (parts[1] === "data" && parts[3] === "fresh-project") {
        const endpoint = parts.slice(4).join("/");
        if (endpoint === "discovery") return respond({ eventNames: freshEvents.length ? ["motor.sample"] : [], deviceIds: ["motor-003"], sessionIds: ["test-run-817"], properties: [], truncated: false });
        if (endpoint === "events/query") return respond({ items: freshEvents, nextCursor: null, now, snapshot: 1 });
        if (endpoint === "realtime") return respond({ ids: q.after ? freshEvents.map((event) => event.id) : [], cursor: String(freshEvents.length), reset: false });
        throw new Error(`Unexpected fresh-project endpoint ${endpoint}`);
      }
      if (u.pathname === "/capture") {
        if (q.api_key !== key)
          return respond(
            { error: { code: "invalid_key", message: "Invalid project key" } },
            401,
          );
        const e = {
          id: `incoming-${++sequence}`,
          event: q.event,
          timestamp: new Date().toISOString(),
          properties: q.properties,
        };
        events.unshift(e);
        incoming.push({ seq: sequence, id: e.id });
        return respond({ accepted: true, event: e, duplicate: false }, 201);
      }
      if (u.pathname === "/mcp")
        return respond({
          jsonrpc: "2.0",
          id: 1,
          result: { protocolVersion: "2025-06-18" },
        });
      if (u.pathname === "/v1/projects") {
        if (req.method() === "POST") {
          freshProject = { ...project, id: "fresh-project", name: q.name, revision: 1 };
          return respond({ project: freshProject, api_key: freshKey }, 201);
        }
        return respond({ items: freshProject ? [project, freshProject] : [project] });
      }
      if (parts[1] === "data") {
        const endpoint = parts.slice(4).join("/");
        if (endpoint === "usage")
          return respond({
            month: "2026-10",
            accepted: 110,
            allowance: 30000,
            day: "2026-10-13",
            acceptedToday: 110,
            dailyAllowance: 2000,
            scope: "project-owner-account",
          });
        if (endpoint === "discovery")
          return respond({
            eventNames: ["motor.sample", "drone.error"],
            properties: [
              {
                path: "environment",
                types: ["string"],
                values: ["real", "simulation"],
              },
              {
                path: "sw_version",
                types: ["string"],
                values: ["v1.3", "v1.4"],
              },
              {
                path: "motor.rpm",
                types: ["number", "string"],
                values: [1680, "1680"],
              },
              {
                path: "motor.temperature",
                types: ["number", "null"],
                values: [72, null],
              },
            ],
            deviceIds: [],
            sessionIds: [],
            truncated: false,
          });
        if (endpoint === "events/query") return respond(getPage(q));
        if (endpoint.startsWith("events/"))
          return respond(events.find((e) => e.id === parts[5]));
        if (endpoint === "realtime")
          return respond({
            ids: q.after
              ? incoming.filter((e) => e.seq > Number(q.after)).map((e) => e.id)
              : [],
            cursor: String(sequence),
            reset: false,
          });
        if (endpoint === "webhook-deliveries") return deliveryUnavailable
          ? respond({ error: { code: "service_unavailable", message: "Delivery status unavailable" } }, 503)
          : respond({ items: [] });
        if (endpoint.startsWith("dashboards/")) {
          const d = dashboards.find((d) => d.id === parts[5]),
            w = d.data.widgets.find((w) => w.id === parts[7]);
          if (w.filterId && !filters.some((f) => f.id === w.filterId))
            return respond({ status: "missing-filter", widget: w, page: null });
          return respond({
            status: "ready",
            widget: w,
            page: getPage({
              ...q,
              name: w.eventName,
              range: w.range,
              filterId: w.filterId,
            }),
          });
        }
      }
      if (parts.length === 3 && req.method() === "PATCH") {
        assert.equal(q.revision, project.revision);
        project.name = q.name;
        project.revision++;
        return respond({ project });
      }
      if (parts.length === 3 && req.method() === "GET" && failWebhookRefresh) { failWebhookRefresh = false; return respond({ error: { code: "service_unavailable", message: "Synthetic verification outage" } }, 503); }
      if (parts.length === 3)
        return respond({
          project,
          membership: req.headers().authorization.includes("synthetic-member")
            ? { email: "member@example.test", role: "Member" }
            : members[0],
        });
      const kind = parts[3];
      if (kind === "key") {
        assert.equal(q.revision, project.revision);
        project.revision++;
        key = "plt_rotated-synthetic-key";
        return respond({ project, api_key: key });
      }
      if (kind === "members") {
        if (req.method() !== "GET") {
          assert.equal(q.revision, project.revision);
          const email = decodeURIComponent(parts[4]);
          const previous = members.find((m) => m.email === email);
          if (req.method() === "DELETE")
            members = members.filter((m) => m.email !== email);
          else if (previous) previous.role = q.role;
          else members.push({ email, role: q.role });
          project.revision++;
        }
        return respond({ items: members });
      }
      const collections = { filters, dashboards, webhooks };
      const collection = collections[kind];
      if (!collection)
        throw new Error(`Unexpected fixture request ${u.pathname}`);
      if (req.method() === "GET")
        return respond({
          items:
            kind === "webhooks"
              ? collection.map((r) => ({
                  ...r,
                  data: {
                    ...r.data,
                    auth:
                      r.data.auth.type === "header"
                        ? { ...r.data.auth, value: "" }
                        : r.data.auth,
                  },
                }))
              : collection,
        });
      const existing = collection.find((r) => r.id === parts[4]);
      if (existing && existing.revision !== q.revision)
        return respond(
          {
            error: {
              code: "revision_conflict",
              message: "Resource changed; reload before saving",
            },
          },
          409,
        );
      if (kind === "webhooks" && parts[5] === "signing-key") {
        assert(existing); existing.revision++; project.revision++; existing.data.signingConfigured = true; failWebhookRefresh = true;
        return respond({ ...existing, signingSecret: "d0".repeat(32), previousExpiresAt: new Date(Date.now() + 86400000).toISOString() });
      }
      if (req.method() === "DELETE") {
        if (
          kind === "filters" &&
          dashboards.some((d) =>
            d.data.widgets.some((w) => w.filterId === existing.id),
          ) &&
          !q.confirmReferenced
        )
          return respond(
            {
              error: {
                code: "filter_referenced",
                message: "Widgets reference this Filter",
              },
            },
            409,
          );
        collection.splice(collection.indexOf(existing), 1);
        project.revision++;
        return respond({ deleted: true });
      }
      const result = wrap(
        q.data,
        kind.slice(0, -1),
        (existing?.revision || 0) + 1,
      );
      if (
        kind === "webhooks" &&
        existing?.data.auth.type === "header" &&
        result.data.auth.type === "header" &&
        result.data.auth.name === existing.data.auth.name &&
        !result.data.auth.value
      )
        result.data.auth.value = existing.data.auth.value;
      if (existing) collection.splice(collection.indexOf(existing), 1, result);
      else collection.push(result);
      project.revision++;
      if (kind === "webhooks") result.data.signingConfigured = true;
      return respond({ ...result, ...(kind === "webhooks" && !existing ? { signingSecret: "c0".repeat(32) } : {}) });
    } catch (error) {
      if (["missing_filter", "snapshot_expired"].includes(error.message))
        return respond(
          {
            error: { code: error.message, message: "Restart event retrieval" },
          },
          409,
        );
      throw error;
    }
  });
  const page = await context.newPage();
  await page.clock.install();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${origin}/stream/workspace?project=${project.id}`);
  await page
    .getByRole("button", { name: "motor.sample", exact: true })
    .first()
    .waitFor();
  console.log("QA: Cache-first metadata request counts");
  assert.equal(metadataCalls.length, 4, "Cold Events view loads no admin-only lists");
  const beforeReload = metadataCalls.length;
  await page.reload();
  await page.getByRole("button", { name: "motor.sample", exact: true }).first().waitFor();
  assert.equal(metadataCalls.length - beforeReload, 1, "Warm reload keeps a fresh permission check and reuses shared snapshots");
  const beforeRefresh = metadataCalls.length;
  await page.getByRole("button", { name: "Refresh shared settings", exact: true }).click();
  await page.getByRole("button", { name: "Refresh shared settings", exact: true }).waitFor();
  await page.waitForFunction(() => ![...document.querySelectorAll("button")].find((button) => button.textContent === "Refresh shared settings")?.disabled);
  assert.equal(metadataCalls.length - beforeRefresh, 4, "Explicit refresh bypasses shared metadata snapshots");
  await page.screenshot({
    path: path.join(output, "explorer-desktop.png"),
    fullPage: false,
  });
  assert.equal(await page.getByText("SETUP", { exact: true }).count(), 1);
  assert.equal(await page.locator("tbody tr").first().locator("td").nth(2).getByText("motor-003", { exact: true }).count(), 1);
  assert(!(await page.locator("tbody tr").first().locator("td").nth(2).innerText()).includes('"robot_id":'));
  console.log("QA: Complete export");
  // Every matching page, not merely the first 50, is exported.
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page.screenshot({ path: path.join(output, "export-desktop.png"), fullPage: false });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "JSON" }).click();
  const download = await downloadPromise;
  const file = await download.path();
  const exported = JSON.parse(await fs.readFile(file, "utf8"));
  assert.equal(exported.length, 110);
  assert.equal(
    typeof exported.find((e) => e.id === "event-1").properties.motor.rpm,
    "string",
  );
  console.log("QA: Capture staging");
  // Ingest into the synthetic event plane; the current snapshot must stay in place.
  const previousRows = await page.locator("tbody tr").count();
  await page.evaluate(async () => {
    await fetch("https://stream.plotune.net/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "plt_synthetic-key",
        event: "new.capture",
        properties: { arbitrary: { reading: 42 } },
      }),
    });
  });
  await page
    .getByText("New project events are available.", { exact: false })
    .waitFor({ timeout: 12000 });
  assert.equal(await page.locator("tbody tr").count(), previousRows);
  await page.getByRole("button", { name: "Load latest events" }).click();
  await page
    .getByRole("button", { name: "new.capture", exact: true })
    .waitFor();
  console.log("QA: Typed shared Filter");
  // Property discovery, manual path entry, strict numeric condition and shared save.
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Filter events" })
    .getByRole("searchbox")
    .fill("motor.rpm");
  await page.getByRole("option", { name: "motor.rpm mixed" }).click();
  await page.getByLabel("Value type", { exact: true }).selectOption("number");
  await page
    .getByLabel("Operator", { exact: true })
    .selectOption("greater_than");
  await page.getByLabel("Value", { exact: true }).fill("1700");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await page.getByRole("button", { name: "Save filter", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Saved filter name" })
    .fill("High RPM");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page
    .getByText("Shared Saved Filter: High RPM", { exact: true })
    .waitFor();
  assert.equal(filters.at(-1).data.conditions[0].value, 1700);
  const savedId = filters.at(-1).id;
  // Update the same shared definition twice without reselecting or reloading it.
  for (const value of [1750, 1800]) {
    await page.locator('[aria-label^="Edit motor.rpm"]').click();
    await page.getByLabel("Value", { exact: true }).fill(String(value));
    await page.getByRole("button", { name: "Apply", exact: true }).click();
    await page.getByRole("button", { name: "Filter", exact: true }).click();
    await page.locator(".st-filter-manage summary").click();
    await page
      .getByRole("button", { name: "Update conditions", exact: true })
      .click();
    await page
      .getByText("Shared Saved Filter: High RPM", { exact: true })
      .waitFor();
    assert.equal(filters.at(-1).data.conditions[0].value, value);
    await page
      .locator('.st-filter-popover-head [aria-label="Close filter menu"]')
      .click();
  }
  assert.deepEqual(
    calls
      .filter(
        (c) => c.method === "PUT" && c.path.endsWith(`/filters/${savedId}`),
      )
      .map((c) => c.body.revision),
    [1, 2],
  );
  await page.reload();
  await page
    .getByText("Shared Saved Filter: High RPM", { exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).searchParams.get("filter"), savedId);
  // Export must preserve the user's active Saved Filter, excluding other events.
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const exportOptions = page.getByRole("menu", { name: "Export matching events", exact: true });
  assert.deepEqual((await exportOptions.innerText()).trim().split(/\s+/), ["JSON", "CSV", "TSV"]);
  const filteredDownloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "JSON", exact: true }).click();
  const filteredDownload = await filteredDownloadPromise;
  const filteredEvents = JSON.parse(await fs.readFile(await filteredDownload.path(), "utf8"));
  assert(filteredEvents.length > 0 && filteredEvents.length < events.length);
  assert.equal(filteredEvents.length, select({ filterId: savedId }).length);
  assert(filteredEvents.every((event) => typeof event.properties.motor?.rpm === "number" && event.properties.motor.rpm > 1800));

  await page
    .getByRole("button", { name: "motor.sample", exact: true })
    .first()
    .click();
  await page.getByRole("dialog").waitFor();
  assert.match(await page.locator("dialog pre").textContent(), /"properties"/);
  await page.screenshot({ path: path.join(output, "event-detail-desktop.png"), fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "event-detail-mobile.png"), fullPage: false });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  console.log("QA: Independent saved widgets");
  // Each widget retrieves its own saved reference; Explorer's High RPM is unrelated.
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await page
    .getByRole("button", { name: "Open dashboard", exact: false })
    .first()
    .click();
  await page
    .getByRole("img", { name: "Time series:", exact: false })
    .first()
    .waitFor();
  await page.screenshot({
    path: path.join(output, "dashboard-desktop.png"),
    fullPage: true,
  });
  assert(calls.some((c) => c.path.endsWith("/widgets/rpm-real/data")));
  assert(calls.some((c) => c.path.endsWith("/widgets/rpm-sim/data")));
  await page.getByRole("button", { name: "Add widget", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Event", exact: true })
    .fill("motor.sample");
  await page
    .getByRole("combobox", { name: "Property", exact: true })
    .fill("motor.rpm");
  await page.locator(".st-widget-more summary").click();
  await page
    .getByLabel("Saved Filter", { exact: false })
    .selectOption("simulation");
  await page
    .getByRole("combobox", { name: "Event", exact: true })
    .fill("motor.sample");
  await page
    .getByRole("combobox", { name: "Property", exact: true })
    .fill("motor.rpm");
  await page
    .getByRole("combobox", { name: "Breakdown by", exact: false })
    .fill("sw_version");
  await page
    .getByRole("textbox", { name: "Widget title", exact: false })
    .fill("Configured simulation RPM");
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(output, "widget-editor-desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "widget-editor-mobile.png"), fullPage: false });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(300);
  await page
    .getByRole("button", { name: "Add widget", exact: true })
    .last()
    .click();
  await page
    .getByRole("heading", { name: "Configured simulation RPM" })
    .waitFor();
  assert.equal(dashboards[0].data.widgets.at(-1).filterId, "simulation");
  await page.reload();
  await page
    .getByRole("heading", { name: "Configured simulation RPM" })
    .waitFor();
  console.log("QA: Authoritative widget configuration during metadata lag");
  const originalWidget = { ...dashboards[0].data.widgets[0] };
  dashboards[0].data.widgets[0] = {
    ...originalWidget,
    title: "Drone failure events",
    eventName: "drone.error",
    visualization: "count",
    chartType: "bar",
    measureProperty: "",
    filterId: null,
    breakdownProperty: "environment",
    range: "24h",
  };
  dashboards[0].revision++;
  project.revision++;
  await page.clock.fastForward(60000);
  await page
    .getByRole("heading", { name: "Drone failure events", exact: true })
    .waitFor({ timeout: 25000 });
  const authoritativePanel = page
    .locator(".st-dashboard-graph")
    .filter({
      has: page.getByRole("heading", {
        name: "Drone failure events",
        exact: true,
      }),
    });
  assert((await authoritativePanel.textContent()).includes("Last 24 hours"));
  assert(
    !(await authoritativePanel.textContent()).includes("No matching events"),
  );
  dashboards[0].data.widgets[0] = originalWidget;
  dashboards[0].revision++;
  project.revision++;

  console.log("QA: Shared Filter updates");
  // Editing a shared Filter changes its referencing widgets on the next retrieval.
  filters[0] = wrap(
    { ...filters[0].data, conditions: [{ ...condition, value: "simulation" }] },
    "filter",
    2,
  );
  await page.reload();
  await page.getByRole("heading", { name: "Real-system RPM" }).waitFor();
  await page
    .getByRole("img", { name: "Time series:", exact: false })
    .first()
    .waitFor();
  console.log("QA: One-time key rotation");
  // Rotation: raw key is returned once and never stored in browser persistence.
  await page.getByRole("button", { name: "API setup", exact: true }).click();
  console.log("QA: Hardware integration choices and MCP presentation");
  for (const language of ["curl", "Python", "C/C++", "Arduino / ESP32", "MATLAB", "ROS 2", "CAPL", "JavaScript"]) {
    await page.getByRole("button", { name: language, exact: true }).click();
    assert(await page.getByLabel(`${language} integration snippet`, { exact: true }).isVisible());
    assert((await page.getByLabel(`${language} integration snippet`, { exact: true }).innerText()).includes("motor.sample"));
  }
  await page.getByRole("button", { name: "C/C++", exact: true }).click();
  await page.getByRole("button", { name: "Copy integration snippet", exact: true }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.getByLabel("C/C++ integration snippet", { exact: true }).innerText());
  await page.screenshot({ path: path.join(output, "api-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "api-mobile.png"), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "MCP setup", exact: true }).click();
  await page.getByRole("heading", { name: "Connect your AI client" }).waitFor();
  await page.screenshot({ path: path.join(output, "mcp-desktop.png"), fullPage: true });
  await page.getByRole("button", { name: "API setup", exact: true }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Rotate API key" }).click();
  await page.getByLabel("New project API key").waitFor();
  assert.equal(
    await page.getByLabel("New project API key").inputValue(),
    "plt_rotated-synthetic-key",
  );
  assert(
    !(
      await page.evaluate(() =>
        JSON.stringify({ local: localStorage, session: sessionStorage }),
      )
    ).includes("plt_rotated"),
  );
  console.log("QA: Inline setup for a project without visible events");
  const savedEvents = events.splice(0);
  await page.getByRole("button", { name: "Events", exact: true }).click();
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page.getByRole("heading", { name: "Send an event from your system", exact: true }).waitFor();
  await page.screenshot({ path: path.join(output, "first-event-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "first-event-mobile.png"), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 1000 });
  events.push(...savedEvents);
  await page.getByRole("button", { name: "API setup", exact: true }).click();
  await page.reload();
  await page
    .getByText("Existing keys cannot be recovered.", { exact: false })
    .waitFor();
  assert.equal(await page.getByLabel("New project API key").count(), 0);
  console.log("QA: Cursor expiry and mobile layout");
  // Expired continuation cannot be downloaded or silently mixed into the existing page.
  await page.getByRole("button", { name: "Events", exact: true }).click();
  await page.getByRole("button", { name: "Clear all" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).waitFor();
  await page.waitForTimeout(400);
  expireNext = true;
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Restart event retrieval" })
    .waitFor();
  await page
    .getByRole("button", { name: "Retry / refresh", exact: true })
    .click();
  await page
    .getByRole("button", { name: "new.capture", exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(output, "explorer-mobile.png"),
    fullPage: false,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Open workspace navigation" }).click();
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await page
    .getByRole("button", { name: "Open dashboard", exact: false })
    .first()
    .click();
  await page
    .getByRole("heading", { name: "Configured simulation RPM" })
    .waitFor();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(output, "dashboard-mobile.png"),
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Open workspace navigation", exact: true }).click();
  await page.getByRole("combobox", { name: "Project", exact: true }).focus();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Open workspace navigation", exact: true }).getAttribute("aria-expanded"), "false");
  assert(await page.getByRole("button", { name: "Open workspace navigation", exact: true }).evaluate((button) => button === document.activeElement));
  console.log("QA: Owner settings, webhooks and a shared member session");
  // Owner configuration and a separate member session reuse the same shared resource IDs.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(300);
  await page
    .getByRole("button", { name: "Project Settings", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Project name", exact: true })
    .fill("Shared robot validation");
  await page.getByRole("button", { name: "Save name", exact: true }).click();
  await page.getByText("Project name saved.", { exact: true }).waitFor();
  assert.equal(project.name, "Shared robot validation");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("member@example.test");
  await page
    .getByRole("button", { name: "Add colleague", exact: true })
    .click();
  await page
    .getByText("Project access added. No invitation email was sent.", {
      exact: true,
    })
    .waitFor();
  assert(members.some((m) => m.email === "member@example.test"));
  await page.screenshot({ path: path.join(output, "settings-desktop.png"), fullPage: true });
  await page.getByRole("button", { name: "Webhooks", exact: true }).click();
  await page.getByText("No queued deliveries reported.", { exact: true }).waitFor();
  await page.screenshot({ path: path.join(output, "webhooks-empty-desktop.png"), fullPage: true });
  deliveryUnavailable = true;
  await page.getByRole("button", { name: "Events", exact: true }).click();
  await page.getByRole("button", { name: "Webhooks", exact: true }).click();
  await page.getByText("Delivery status unavailable", { exact: true }).waitFor();
  assert.equal(await page.getByText("No queued deliveries reported.", { exact: true }).count(), 0);
  await page.screenshot({ path: path.join(output, "webhooks-error-desktop.png"), fullPage: true });
  deliveryUnavailable = false;
  await page.getByRole("button", { name: "Retry / refresh", exact: true }).click();
  await page.getByText("No queued deliveries reported.", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Add webhook", exact: true }).click();
  // Management screens no longer fetch event discovery just to populate suggestions.
  await page.getByRole("textbox", { name: "Custom event name", exact: true }).fill("motor.sample");
  await page
    .getByRole("textbox", { name: "Webhook URL", exact: true })
    .fill("https://automation.example.test/events");
  await page
    .getByRole("button", { name: "Add webhook", exact: true })
    .last()
    .click();
  await page.locator(".st-webhook-row").waitFor();
  assert.equal(await page.getByLabel("Webhook signing secret", { exact: true }).inputValue(), "c0".repeat(32));
  assert(!(await page.evaluate(() => JSON.stringify({ local: localStorage, session: sessionStorage }))).includes("c0".repeat(32)));
  await page.getByRole("button", { name: "I saved the secret", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Rotate signing secret", exact: true }).click();
  assert.equal(await page.getByLabel("Webhook signing secret", { exact: true }).inputValue(), "d0".repeat(32));
  await page.getByText("Synthetic verification outage", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Refresh shared settings", exact: true }).click();
  await page.waitForFunction(() => ![...document.querySelectorAll("button")].find(button => button.textContent === "Refresh shared settings")?.disabled);
  assert.equal(await page.getByLabel("Webhook signing secret", { exact: true }).inputValue(), "d0".repeat(32));
  await page.screenshot({ path: path.join(output, "webhook-signing-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(output, "webhook-signing-mobile.png"), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.getByRole("button", { name: "I saved the secret", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("checkbox", { name: "Enable webhook for motor.sample" })
    .click();
  await page.waitForTimeout(300);
  assert.equal(webhooks[0].data.enabled, false);
  await page.screenshot({ path: path.join(output, "webhooks-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "webhooks-mobile.png"), fullPage: true });
  for (const [label, name] of [["Project Settings", "settings"], ["MCP setup", "mcp"], ["API setup", "api"]]) {
    await page.getByRole("button", { name: "Open workspace navigation", exact: true }).click();
    await page.getByRole("navigation", { name: "Workspace navigation", exact: true }).getByRole("button", { name: label, exact: true }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(output, `${name}-mobile.png`), fullPage: true });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  }
  await page.getByRole("button", { name: "Account", exact: true }).click();
  await page.getByText("Project owner's account allowance", { exact: true }).waitFor();
  await page.screenshot({ path: path.join(output, "usage-mobile.png"), fullPage: false });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Webhooks", exact: true }).click();
  await context.addCookies([
    { name: "auth_token", value: "Bearer synthetic-member-token", url: origin },
  ]);
  const memberStart = calls.length;
  await page.reload();
  await page
    .getByText("Owner or admin access required", { exact: true })
    .waitFor();
  assert(
    !calls.slice(memberStart).some((c) => /\/(members|webhooks)$/.test(c.path)),
  );
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await page
    .getByRole("button", { name: "Open dashboard", exact: false })
    .first()
    .click();
  await page
    .getByRole("heading", { name: "Configured simulation RPM" })
    .waitFor();
  assert.equal(dashboards[0].data.widgets.at(-1).filterId, "simulation");
  console.log("QA: Create project → save key → capture → visible event");
  await context.addCookies([{ name: "auth_token", value: "Bearer synthetic-account-token", url: origin }]);
  await page.reload();
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  const createDialog = page.getByRole("dialog", { name: "Create a project", exact: true });
  await createDialog.getByLabel("Project name").fill("Motor bench quick start");
  await createDialog.getByRole("button", { name: "Create project", exact: true }).click();
  await page.getByRole("heading", { name: "Send an event from your system", exact: true }).waitFor();
  assert.equal(new URL(page.url()).searchParams.get("view"), "events");
  assert((await page.getByLabel("curl integration snippet", { exact: true }).innerText()).includes(freshKey));
  assert(!(await page.evaluate(() => JSON.stringify({ local: localStorage, session: sessionStorage }))).includes("plt_fresh"));
  await page.screenshot({ path: path.join(output, "created-project-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, "created-project-mobile.png"), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.evaluate(async (api_key) => {
    await fetch("https://stream.plotune.net/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key, event: "motor.sample", device_id: "motor-003", session_id: "test-run-817", properties: { temperature: 72.4, rpm: 1840, state: "running" } }) });
  }, freshKey);
  await page.getByRole("button", { name: "Load latest events", exact: true }).waitFor({ timeout: 12000 });
  await page.getByRole("button", { name: "Load latest events", exact: true }).click();
  await page.getByRole("button", { name: "motor.sample", exact: true }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Send an event from your system", exact: true }).count(), 0);
  await page.screenshot({ path: path.join(output, "first-capture-mobile.png"), fullPage: false });
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    `PASS: synthetic browser integration, desktop/mobile, 110-event complete export, capture staging, typed shared Filter, saved widget references, reload, rotation, cursor expiry, owner settings, webhooks and member access. Screenshots: ${output}`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
