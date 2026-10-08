import { buildWidgetSeries, getWidgetChoices } from "./widgetModel";

const events = [
  { id: "1", event: "robot.sample", timestamp: "2026-10-08T09:59:00Z", properties: { robot_id: "R-01", environment: "real", sw_version: "2.8", rpm: 1600 } },
  { id: "2", event: "robot.sample", timestamp: "2026-10-08T09:58:00Z", properties: { robot_id: "R-01", environment: "simulation", sw_version: "2.7", rpm: 1800 } },
  { id: "3", event: "robot.error", timestamp: "2026-10-08T09:57:00Z", properties: { robot_id: "R-01", environment: "real", status: "error" } },
];
const real = { id: "real", name: "Real system", conditions: [{ id: "c", path: "environment", operator: "equals", value: "real" }] };

test("numeric widget series reference saved filters and break down by arbitrary properties", () => {
  const widget = { id: "w", filterId: "real", eventName: "robot.sample", visualization: "line", measureProperty: "rpm", breakdownProperty: "sw_version", range: "1h" };
  const result = buildWidgetSeries(events, widget, [real], "2026-10-08T10:00:00Z");
  expect(result.status).toBe("ready");
  expect(result.events.map(({ id }) => id)).toEqual(["1"]);
  expect(result.series[0].label).toBe("sw_version: 2.8");
  expect(result.series[0].points.some(({ value }) => value === 1600)).toBe(true);
  expect(getWidgetChoices(events, widget, [real], "2026-10-08T10:00:00Z").numericProperties).toContain("rpm");
});

test("event-count widgets group filtered occurrences and deleted references remain safely unresolved", () => {
  const widget = { id: "w", filterId: "real", eventName: "robot.error", visualization: "count", breakdownProperty: null, range: "1h" };
  const result = buildWidgetSeries(events, widget, [real], "2026-10-08T10:00:00Z");
  expect(result.series[0].points.reduce((sum, point) => sum + point.value, 0)).toBe(1);
  expect(buildWidgetSeries(events, widget, [], "2026-10-08T10:00:00Z").status).toBe("missing-filter");
});

test("editing a Saved Filter changes the effective conditions of widgets that reference its id", () => {
  const widget = { id: "w", filterId: "real", eventName: "robot.sample", visualization: "line", measureProperty: "rpm", range: "1h" };
  const updated = { ...real, conditions: [{ id: "c2", path: "environment", operator: "equals", value: "simulation" }] };
  const result = buildWidgetSeries(events, widget, [updated], "2026-10-08T10:00:00Z");
  expect(result.events.map(({ id }) => id)).toEqual(["2"]);
  expect(result.series[0].points.some(({ value }) => value === 1800)).toBe(true);
});
