import {
  buildGraphSeries,
  discoverNumericSeries,
} from "./dashboardModel";
import { cursorPage, EVENTS_PER_PAGE } from "./eventModel";

const event = (id, name, timestamp, properties) => ({
  id,
  event: name,
  timestamp,
  properties,
});

test("discovers numeric properties as event.property series and ignores strings and booleans", () => {
  const discovered = discoverNumericSeries([
    event("1", "motor", "2026-10-07T10:00:00.000Z", {
      temp: 94.2,
      oil_temp: 87.6,
      state: "running",
      active: true,
      nested: { vibration: 1.4 },
    }),
    event("2", "motor", "2026-10-07T10:01:00.000Z", { rpm: 4120, temp: 95.1 }),
  ]);

  expect(discovered.map(({ label }) => label)).toEqual([
    "motor.nested.vibration",
    "motor.oil_temp",
    "motor.rpm",
    "motor.temp",
  ]);
  expect(discovered.some(({ label }) => label === "motor.state")).toBe(false);
});

test("builds several numeric property series as bounded time buckets", () => {
  const events = [
    event("1", "motor", "2026-10-07T10:45:00.000Z", { temp: 82.1, oil_temp: 76.4 }),
    event("2", "motor", "2026-10-07T10:44:00.000Z", { temp: 84.1, oil_temp: 78.4 }),
    event("3", "motor", "2026-10-07T09:00:00.000Z", { temp: 100, oil_temp: 100 }),
  ];
  const graph = {
    kind: "numeric",
    range: "15m",
    seriesKeys: ["motor.temp", "motor.oil_temp"],
  };
  const result = buildGraphSeries(events, graph, "2026-10-07T10:46:00.000Z");

  expect(result).toHaveLength(2);
  expect(result.map(({ label }) => label)).toEqual(["motor.temp", "motor.oil_temp"]);
  expect(result[0].points).toHaveLength(15);
  expect(result[0].points.some(({ value }) => value === 100)).toBe(false);
  expect(result[0].points.some(({ value }) => value === 82.1 || value === 84.1)).toBe(true);
});

test("aggregates matching event counts into buckets separately from numeric series", () => {
  const events = [
    event("1", "test.failed", "2026-10-07T10:45:00.000Z", { result: "failed" }),
    event("2", "test.failed", "2026-10-07T10:44:00.000Z", { result: "failed" }),
    event("3", "test.started", "2026-10-07T10:44:00.000Z", {}),
  ];
  const result = buildGraphSeries(
    events,
    { kind: "count", range: "15m", eventName: "test.failed" },
    "2026-10-07T10:46:00.000Z",
  );

  expect(result).toHaveLength(1);
  expect(result[0].key).toBe("test.failed.count");
  expect(result[0].points.reduce((sum, point) => sum + point.value, 0)).toBe(2);
});

test("cursor pages are bounded to 20 and continue after the last event", () => {
  const events = Array.from({ length: 25 }, (_, index) => {
    const minute = String(59 - index).padStart(2, "0");
    return event(String(index).padStart(2, "0"), "sample", `2026-10-07T10:${minute}:00.000Z`, {});
  });
  const first = cursorPage(events);
  const second = cursorPage(events, first.nextCursor);

  expect(EVENTS_PER_PAGE).toBe(20);
  expect(first.items).toHaveLength(20);
  expect(first.nextCursor).toEqual({ id: "19", timestamp: "2026-10-07T10:40:00.000Z" });
  expect(second.items).toHaveLength(5);
  expect(second.nextCursor).toBeNull();
  expect(new Set([...first.items, ...second.items].map(({ id }) => id)).size).toBe(25);
});
