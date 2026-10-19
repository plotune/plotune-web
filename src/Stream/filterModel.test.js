import {
  discoverPropertyPaths,
  evaluateCondition,
  matchesConditions,
  queryEvents,
  readPropertyPath,
  resolveWidgetFilter,
  searchPropertyPaths,
} from "./filterModel";

const event = (id, timestamp, properties = {}, name = "motor.sample") => ({ id, event: name, timestamp, properties });

test("discovers searchable nested paths and records mixed/null types without coercion", () => {
  const events = [
    event("1", "2026-10-08T09:10:00Z", { motor: { temperature: 81, nullable: null }, sw_version: "v1" }),
    event("2", "2026-10-08T09:11:00Z", { motor: { temperature: "82", nullable: 2 }, sw_version: "v2" }),
  ];
  const properties = discoverPropertyPaths(events);
  expect(properties.find(({ path }) => path === "motor.temperature").type).toBe("mixed");
  expect(properties.find(({ path }) => path === "motor.nullable").type).toBe("mixed");
  expect(searchPropertyPaths(properties, "motor.temp").map(({ path }) => path)).toEqual(["motor.temperature"]);
  expect(readPropertyPath(events[0].properties, "motor.temperature")).toEqual({ exists: true, value: 81 });
  expect(readPropertyPath({}, "motor.temperature")).toEqual({ exists: false, value: undefined });
});

test("evaluates operators strictly across strings, numbers, booleans, null, and missing values", () => {
  const sample = event("1", "2026-10-08T09:10:00Z", { rpm: 1680, state: "running", enabled: true, nullable: null });
  expect(evaluateCondition(sample, { path: "rpm", operator: "greater_or_equal", value: 1680 })).toBe(true);
  expect(evaluateCondition(sample, { path: "rpm", operator: "greater_than", value: "1600" })).toBe(false);
  expect(evaluateCondition(sample, { path: "state", operator: "contains", value: "run" })).toBe(true);
  expect(evaluateCondition(sample, { path: "enabled", operator: "is_true" })).toBe(true);
  expect(evaluateCondition(sample, { path: "nullable", operator: "is_null" })).toBe(true);
  expect(evaluateCondition(sample, { path: "missing", operator: "not_exists" })).toBe(true);
  expect(evaluateCondition(sample, { path: "missing", operator: "equals", value: "x" })).toBe(false);
});

test("supports the remaining numeric, string, and false-boolean operators", () => {
  const sample = event("1", "2026-10-08T09:10:00Z", { rpm: 1680, note: "stable motor", enabled: false });
  expect(evaluateCondition(sample, { path: "rpm", operator: "equals", value: 1680 })).toBe(true);
  expect(evaluateCondition(sample, { path: "rpm", operator: "not_equals", value: 1600 })).toBe(true);
  expect(evaluateCondition(sample, { path: "rpm", operator: "less_than", value: 1700 })).toBe(true);
  expect(evaluateCondition(sample, { path: "rpm", operator: "less_or_equal", value: 1680 })).toBe(true);
  expect(evaluateCondition(sample, { path: "note", operator: "not_equals", value: "unstable" })).toBe(true);
  expect(evaluateCondition(sample, { path: "enabled", operator: "is_false" })).toBe(true);
  expect(evaluateCondition(sample, { path: "note", operator: "is_null" })).toBe(false);
});

test("combines conditions with AND and shares one query across consumers", () => {
  const events = [
    event("1", "2026-10-08T09:10:00Z", { environment: "real", rpm: 1680 }),
    event("2", "2026-10-08T09:11:00Z", { environment: "simulation", rpm: 1800 }),
  ];
  const conditions = [
    { path: "environment", operator: "equals", value: "real" },
    { path: "rpm", operator: "greater_than", value: 1500 },
  ];
  expect(matchesConditions(events[0], conditions)).toBe(true);
  expect(queryEvents(events, { range: "all", now: "2026-10-08T10:00:00Z", conditions })).toEqual([events[0]]);
});

test("native device, session, missing context, custom properties, and exact UTC boundaries combine", () => {
  const events = [
    { ...event("a", "2026-10-08T09:00:00Z", { sw_version: "v1.4" }, "motor.started"), device_id: "motor-003", session_id: "run-817" },
    { ...event("b", "2026-10-08T10:00:00Z", { sw_version: "v1.4" }, "motor.overtemp"), device_id: "motor-003", session_id: "run-817" },
    { ...event("c", "2026-10-08T11:30:00Z", { sw_version: "v1.4" }, "motor.shutdown"), device_id: "motor-003", session_id: "run-817" },
    { ...event("d", "2026-10-08T10:30:00Z", { sw_version: "v1.4" }), device_id: undefined, session_id: undefined },
  ];
  const query = { range: "all", startAt: "2026-10-08T04:00:00-05:00", endAt: "2026-10-08T11:30:00Z", deviceId: "motor-003", sessionId: "run-817", conditions: [{ path: "sw_version", operator: "equals", value: "v1.4" }] };
  expect(queryEvents(events, query).map(({ id }) => id)).toEqual(["b", "a"]);
  expect(queryEvents(events, { range: "all", deviceId: "unspecified", sessionId: "unspecified", now: "2026-10-09T00:00:00Z" }).map(({ id }) => id)).toEqual(["d"]);
  expect(queryEvents(events, { range: "all", startAt: "2026-10-08T11:30:00Z", endAt: "2026-10-08T12:00:00Z", now: "2026-10-09T00:00:00Z" }).map(({ id }) => id)).toEqual(["c"]);
  expect(queryEvents(events, { range: "all", startAt: "2026-10-08T12:00:00Z", endAt: "2026-10-08T11:00:00Z" })).toEqual([]);
});

test("widgets resolve current shared conditions by identifier and safely detect deletion", () => {
  const widget = { filterId: "shared-1" };
  const saved = [{ id: "shared-1", name: "Real system", conditions: [{ path: "environment", operator: "equals", value: "real" }] }];
  expect(resolveWidgetFilter(widget, saved).conditions[0].value).toBe("real");
  expect(resolveWidgetFilter(widget, [{ ...saved[0], conditions: [] }]).conditions).toEqual([]);
  expect(resolveWidgetFilter(widget, []).status).toBe("missing");
});
