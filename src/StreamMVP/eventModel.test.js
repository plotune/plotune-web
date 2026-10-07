import {
  initialProjects,
  filterEvents,
  previewValue,
  ingestionSnippet,
  mcpSnippet,
  SNAPSHOT,
} from "./eventModel";

const events = initialProjects[0].events;
test("event history searches arbitrary nested properties and orders timestamps newest first", () => {
  const nested = filterEvents(events, { search: "validation", range: "all" });
  expect(nested.map((e) => e.event)).toEqual(["calibration.loaded"]);
  const result = filterEvents([...events].reverse(), { range: "all" });
  expect(result[0].event).toBe("test.failed");
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
  ).toHaveLength(2);
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
  for (const language of ["curl", "Python", "C", "CAPL"]) {
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain(
      "plt_demo_changed",
    );
    expect(ingestionSnippet(language, "plt_demo_changed")).toContain(
      "test.started",
    );
  }
  const config = JSON.parse(mcpSnippet("plt_demo_changed"));
  expect(config.mcpServers["plotune-stream"].headers.Authorization).toBe(
    "Bearer plt_demo_changed",
  );
});
