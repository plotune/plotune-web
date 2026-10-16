import { createEventExport, createFilteredExport, escapeDelimited, flattenEvent, serializeExport } from "./exportModel";

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

test("spreadsheet formula markers after leading whitespace or controls are emitted as literal text", () => {
  for (const value of ["=1+1", "+SUM(A1:A2)", "-10", "@SUM(A1)", " \t=1+1", "\r=1+1", "\u0000=1+1"]) {
    for (const delimiter of [",", "\t"]) {
      const escaped = escapeDelimited(value, delimiter);
      expect(escaped.startsWith("'") || escaped.startsWith('"\'')).toBe(true);
    }
  }
  expect(escapeDelimited(-10, ",")).toBe("-10");
  expect(escapeDelimited(0, ",")).toBe("0");
  expect(escapeDelimited("ordinary text", ",")).toBe("ordinary text");
});

test("formula neutralization happens before delimiter and quote escaping", () => {
  expect(escapeDelimited('=HYPERLINK("https://example.com","open")', ","))
    .toBe('"\'=HYPERLINK(""https://example.com"",""open"")"');
});

test.each(["csv", "tsv"])("browser and synchronous %s exports neutralize event/property text while JSON retains original values", async (format) => {
  const rows = [{ id: "e", event: "=custom", timestamp: "2026-10-14T12:00:00Z", properties: { formula: "=1+1", negativeNumber: -10, negativeText: "-10" } }];
  const delimiter = format === "tsv" ? "\t" : ",";
  for (const output of [serializeExport(rows, format), await readBlob((await createEventExport(rows, format)).blob)]) {
    expect(output).toContain(`${delimiter}'=custom${delimiter}`);
    expect(output).toContain(`${delimiter}'=1+1${delimiter}-10${delimiter}'-10`);
  }
  expect(JSON.parse(await readBlob((await createEventExport(rows, "json")).blob))).toEqual(rows);
});
