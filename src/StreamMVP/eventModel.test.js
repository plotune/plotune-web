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
  const independent = [
    { id: "earlier", event: "arbitrary.first", timestamp: "2026-01-01T00:00:00Z", properties: {} },
    { id: "later", event: "arbitrary.second", timestamp: "2026-01-01T00:00:02Z", properties: {} },
  ];
  const result = filterEvents([...independent].reverse(), { range: "all" });
  expect(result.map((e) => e.id)).toEqual(["later", "earlier"]);
  expect(Date.parse(result[0].timestamp)).toBeGreaterThan(
    Date.parse(result[1].timestamp),
  );
  expect(result[result.length - 1].id).toBe("earlier");
});
test("time and event-name filters combine without requiring a hardware schema", () => {
  expect(
    filterEvents(events, {
      name: "simulation.completed",
      range: "1h",
      now: "2026-10-07T11:00:00.000Z",
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

test("event envelope context is optional and minimal payloads remain valid", () => {
  const project = initialProjects.find((item) => item.id === "battery");
  const run = project.events.filter((item) => item.id.startsWith("battery-run-817-"));
  expect(run.map((item) => item.event)).toEqual(["motor.started", "motor.speed_changed", "motor.overtemp", "motor.shutdown", "test.completed"]);
  expect(run.slice(0, 4).every((item) => item.device_id === "motor-003" && item.session_id === "run-817")).toBe(true);
  expect(run[4].device_id).toBe("test-controller-01");
  expect(project.events.some((item) => !item.device_id && !item.session_id)).toBe(true);
  expect(createSimulatedFirstEvent("minimal", SNAPSHOT)).not.toHaveProperty("device_id", "motor-003");
  expect(createSimulatedFirstEvent("minimal", SNAPSHOT)).not.toHaveProperty("session_id", "run-817");
});

test("robot and drone fixtures exercise arbitrary mixed engineering properties", () => {
  const robotEvents = initialProjects.find((project) => project.id === "robot").events;
  const robotSamples = robotEvents.filter((item) => item.event === "robot.sample");
  expect(new Set(robotSamples.map((item) => item.properties.robot_id))).toEqual(new Set(["R-01"]));
  expect(new Set(robotSamples.map((item) => item.properties.environment))).toEqual(new Set(["real", "simulation"]));
  expect(new Set(robotSamples.map((item) => item.properties.sw_version)).size).toBeGreaterThan(1);
  expect(new Set(robotSamples.map((item) => item.properties.test_date)).size).toBeGreaterThan(1);
  expect(robotSamples.some((item) => item.properties.motor.temperature === null)).toBe(true);
  expect(robotSamples.some((item) => typeof item.properties.rpm === "string")).toBe(true);
  expect(robotEvents.filter((item) => item.event === "drone.error")).toHaveLength(2);
});
