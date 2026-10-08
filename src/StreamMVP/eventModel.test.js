import {
  initialProjects,
  filterEvents,
  previewValue,
  ingestionSnippet,
  mcpSnippet,
  SNAPSHOT,
  ONBOARDING_EVENT_NAME,
  createSimulatedFirstEvent,
} from "./eventModel";

const events = initialProjects[0].events;
test("event history searches arbitrary nested properties and orders timestamps newest first", () => {
  const nested = filterEvents(events, { search: "validation", range: "all" });
  expect(nested.map((e) => e.event)).toEqual(["calibration.loaded"]);
  const result = filterEvents([...events].reverse(), { range: "all" });
  expect(result[0].event).toBe("motor");
  expect(Date.parse(result[0].timestamp)).toBeGreaterThan(
    Date.parse(result[1].timestamp),
  );
  expect(result[result.length - 1].event).toBe("firmware.booted");
});
test("time and event-name filters combine without requiring a hardware schema", () => {
  expect(
    filterEvents(events, {
      name: "simulation.completed",
      range: "1h",
      now: SNAPSHOT,
    }),
  ).toHaveLength(1);
  expect(
    filterEvents(events, {
      name: "simulation.completed",
      range: "all",
      now: SNAPSHOT,
    }),
  ).toHaveLength(3);
  const generic = [
    {
      id: "arbitrary",
      event: "custom",
      timestamp: SNAPSHOT,
      properties: { arbitrary: { value: false } },
    },
  ];
  expect(filterEvents(generic, { search: "false" })).toEqual(generic);
});
test("property previews preserve scalar meaning while compacting nested JSON", () => {
  expect(previewValue(false)).toBe("false");
  expect(previewValue(null)).toBe("null");
  expect(previewValue({ a: 1 })).toBe("{1 keys}");
  expect(previewValue(["a", "b"])).toBe("[2 items]");
});
test("all setup examples use the current project key and remain illustrative", () => {
  for (const language of ["curl", "Python", "C/C++", "Arduino / ESP32", "MATLAB", "ROS 2", "CAPL"]) {
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain(
      "plt_demo_changed",
    );
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain(
      ONBOARDING_EVENT_NAME,
    );
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain("temperature");
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain("running");
  }
  const config = JSON.parse(mcpSnippet("plt_demo_changed"));
  expect(config.mcpServers["plotune-stream"].headers.Authorization).toBe(
    "Bearer plt_demo_changed",
  );
});

test("simulated first event matches the schemaless onboarding example", () => {
  expect(createSimulatedFirstEvent("preview-event", SNAPSHOT)).toEqual({
    id: "preview-event",
    event: "motor.sample",
    timestamp: SNAPSHOT,
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  });
});

test("engineering fixture dimensions remain ordinary custom properties with mixed, null, and nested values", () => {
  const motor = events.filter((event) => event.event === "motor");
  const droneErrors = events.filter((event) => event.event === "drone.error");
  expect(new Set(motor.map((event) => event.properties.environment))).toEqual(new Set(["real", "simulation"]));
  expect(new Set(motor.map((event) => event.properties.sw_version).filter(Boolean)).size).toBeGreaterThan(1);
  expect(motor.some((event) => event.properties.optional_sensor === null)).toBe(true);
  expect(new Set(droneErrors.map((event) => typeof event.properties.error_code))).toEqual(new Set(["number", "string"]));
  expect(droneErrors.some((event) => event.properties.diagnostics?.imu?.retry_count === 3)).toBe(true);
  expect(droneErrors.every((event) => !Object.hasOwn(event, "environment"))).toBe(true);
});
