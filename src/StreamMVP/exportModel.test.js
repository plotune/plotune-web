import { createFilteredExport, escapeDelimited, flattenEvent, serializeExport } from "./exportModel";

const events = [
  { id: "evt_1", event: "drone.error", timestamp: "2026-10-08T09:00:00Z", properties: { message: 'motor, "overheat"\nstop', diagnostic: { reading: null, retry: 2 } } },
  { id: "evt_2", event: "motor.sample", timestamp: "2026-10-08T09:01:00Z", properties: { rpm: 1680 } },
];

const readBlob = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsText(blob);
});

test("JSON export preserves the full event envelope, nested properties, and original types", () => {
  const output = JSON.parse(serializeExport(events, "json"));
  expect(output).toEqual(events);
  expect(typeof output[0].properties.diagnostic.retry).toBe("number");
});

test("native identifiers are exported as envelope fields and separate delimited columns", () => {
  const rows = [
    { id: "ctx", event: "motor.started", timestamp: "2026-10-08T09:00:00Z", device_id: "motor-003", session_id: "run-817", properties: { rpm: 0 } },
    { id: "none", event: "motor.stopped", timestamp: "2026-10-08T09:01:00Z", properties: {} },
  ];
  expect(JSON.parse(serializeExport(rows, "json"))[0]).toHaveProperty("session_id", "run-817");
  const csv = serializeExport(rows, "csv");
  expect(csv.split("\r\n")[0]).toContain("device_id,session_id");
  expect(csv).toContain("motor-003,run-817");
});

test("CSV and TSV flatten nested paths and escape their delimiters and quotes", () => {
  const csv = serializeExport(events.slice(0, 1), "csv");
  const tsv = serializeExport(events.slice(0, 1), "tsv");
  expect(csv).toContain("properties.diagnostic.reading");
  expect(csv).toContain('"motor, ""overheat""\nstop"');
  expect(tsv).toContain("properties.diagnostic.retry");
  expect(escapeDelimited("a\tb", "\t")).toBe('"a\tb"');
  expect(flattenEvent(events[0])["properties.diagnostic.reading"]).toBeNull();
});

test("browser export applies the same conditions as Explorer across all matching events", async () => {
  let progress;
  const result = await createFilteredExport(events, {
    range: "all",
    deviceId: "unspecified",
    now: "2026-10-08T10:00:00Z",
    conditions: [{ path: "diagnostic.retry", operator: "greater_than", value: 1 }],
  }, "json", (done, total) => { progress = [done, total]; });
  expect(result.count).toBe(1);
  expect(JSON.parse(await readBlob(result.blob))[0].id).toBe("evt_1");
  expect(progress).toEqual([1, 1]);
});

test("browser export includes all matching rows across multiple retrieval pages", async () => {
  const many = Array.from({ length: 501 }, (_, index) => ({
    id: `evt_${index}`,
    event: "sample",
    timestamp: new Date(Date.parse("2026-10-08T09:00:00Z") + index).toISOString(),
    properties: { sequence: index },
  }));
  const result = await createFilteredExport(many, { range: "all", now: "2026-10-08T10:00:00Z" }, "json");
  expect(JSON.parse(await readBlob(result.blob))).toHaveLength(501);
});
