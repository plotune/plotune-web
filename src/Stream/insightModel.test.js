import { buildQuery, missingField, runCost, dashboardTiles, moveTile, withoutTile, withTile, coverageNote, duration, percent } from "./insightModel";

test("builds each insight kind's stored query from editor choices", () => {
  expect(buildQuery({ kind: "trends", range: "24h", event: "sample" })).toEqual({ kind: "trends", query: { range: "24h", name: "sample" }, metrics: [{ id: "count", operation: "count" }], bucketSeconds: 3600 });
  expect(buildQuery({ kind: "funnel", range: "7d", actor: "device", steps: ["boot", "", "ready"], windowHours: 2 })).toEqual({ kind: "funnel", actor: "device", query: { range: "7d" }, steps: [{ name: "boot" }, { name: "ready" }], windowSeconds: 7200 });
  expect(buildQuery({ kind: "retention", range: "7d", actor: "session", event: "use", returnEvent: "use" })).toEqual({ kind: "retention", actor: "session", query: { range: "7d" }, startEvent: { name: "use" }, interval: "day" });
  expect(buildQuery({ kind: "lifecycle", range: "24h", event: "hb" }).interval).toBe("hour");
  expect(buildQuery({ kind: "paths", range: "7d", event: "", depth: 3 })).toEqual({ kind: "paths", actor: "device", query: { range: "7d" }, depth: 3 });
});

test("save waits for a complete query and shows its cost", () => {
  expect(missingField({ kind: "funnel", steps: ["a", ""] })).toBe("Choose at least two steps");
  expect(missingField({ kind: "stickiness", event: "" })).toBe("Choose an event");
  expect(missingField({ kind: "paths", event: "" })).toBeNull();
  expect(runCost("trends", "7d")).toBe(140);
  expect(runCost("funnel", "7d")).toBe(280);
  expect(runCost("retention", "24h")).toBe(40);
});

test("tiles: legacy widgets become tiles; move, add and remove keep widgets consistent", () => {
  const legacy = { id: "d", widgets: [{ id: "w1" }, { id: "w2" }] };
  expect(dashboardTiles(legacy)).toEqual([{ id: "w1", type: "widget" }, { id: "w2", type: "widget" }]);
  const added = withTile(legacy, { id: "t", type: "text", text: "Hi" });
  expect(added.tiles.map((t) => t.id)).toEqual(["w1", "w2", "t"]);
  expect(moveTile(added.tiles, "t", -1).map((t) => t.id)).toEqual(["w1", "t", "w2"]);
  expect(moveTile(added.tiles, "w1", -1)).toBe(added.tiles);
  const removed = withoutTile(added, "w1");
  expect(removed.tiles.map((t) => t.id)).toEqual(["w2", "t"]);
  expect(removed.widgets).toEqual([{ id: "w2" }]);
});

test("coverage and number formatting", () => {
  expect(coverageNote({ coverage: { complete: true } })).toBe("");
  expect(coverageNote({ coverage: { complete: false, reason: "actor_limit" } })).toMatch(/too many devices/);
  expect(duration(5400)).toBe("1.5 h");
  expect(duration(null)).toBe("—");
  expect(percent(0.125)).toBe("12.5%");
});
