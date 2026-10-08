import { getMatchingEventPages } from "./eventQueryService";

export const EXPORT_FORMATS = ["json", "tsv", "csv"];
export const MAX_MOCK_EXPORT_EVENTS = 10000;

function flattenValue(value, prefix, output) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    Object.entries(value).forEach(([key, child]) => flattenValue(child, `${prefix}.${key}`, output));
    return;
  }
  output[prefix] = value;
}

export function flattenEvent(event) {
  const properties = {};
  flattenValue(event.properties || {}, "properties", properties);
  return { id: event.id, event: event.event, timestamp: event.timestamp, ...properties };
}

function cellValue(value) {
  if (value === undefined) return "";
  if (value === null) return "null";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function escapeDelimited(value, delimiter) {
  const text = cellValue(value);
  return text.includes(delimiter) || /["\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}

export function serializeDelimited(events, format = "csv") {
  const delimiter = format === "tsv" ? "\t" : ",";
  const rows = events.map(flattenEvent);
  const propertyColumns = [...new Set(rows.flatMap((row) => Object.keys(row).filter((key) => key.startsWith("properties."))))].sort();
  const columns = ["id", "event", "timestamp", ...propertyColumns];
  return [
    columns.map((column) => escapeDelimited(column, delimiter)).join(delimiter),
    ...rows.map((row) => columns.map((column) => escapeDelimited(row[column], delimiter)).join(delimiter)),
  ].join("\r\n");
}

export function serializeExport(events, format = "json") {
  if (!EXPORT_FORMATS.includes(format)) throw new Error("Choose JSON, TSV, or CSV.");
  if (format === "json") return JSON.stringify(events, null, 2);
  return serializeDelimited(events, format);
}

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));

export async function createFilteredExport(events, query, format, onProgress = () => {}) {
  if (!["json", "tsv", "csv"].includes(format)) throw new Error("Choose JSON, TSV, or CSV.");
  const matches = [];
  for await (const page of getMatchingEventPages(events, query, { pageSize: 250 })) {
    if (matches.length + page.items.length > MAX_MOCK_EXPORT_EVENTS) {
      throw new Error(`This frontend preview can export up to ${MAX_MOCK_EXPORT_EVENTS.toLocaleString()} matching events at once.`);
    }
    matches.push(...page.items);
    onProgress(matches.length, page.total);
    await yieldToBrowser();
  }
  const chunks = [];
  const pageSize = 250;
  if (format === "json") chunks.push("[");
  let columns;
  if (format === "csv" || format === "tsv") {
    const flattened = matches.map(flattenEvent);
    columns = ["id", "event", "timestamp", ...new Set(flattened.flatMap((row) => Object.keys(row).filter((key) => key.startsWith("properties."))))].sort((a, b) => {
      const baseOrder = ["id", "event", "timestamp"];
      return (baseOrder.indexOf(a) < 0 ? 3 : baseOrder.indexOf(a)) - (baseOrder.indexOf(b) < 0 ? 3 : baseOrder.indexOf(b)) || a.localeCompare(b);
    });
    const delimiter = format === "tsv" ? "\t" : ",";
    chunks.push(columns.map((column) => escapeDelimited(column, delimiter)).join(delimiter), "\r\n");
  }
  for (let start = 0; start < matches.length; start += pageSize) {
    const page = matches.slice(start, start + pageSize);
    if (format === "json") {
      page.forEach((event, index) => {
        if (start > 0 || index > 0) chunks.push(",\n");
        else chunks.push("\n");
        chunks.push(JSON.stringify(event));
      });
    } else {
      const delimiter = format === "tsv" ? "\t" : ",";
      page.forEach((event) => {
        const row = flattenEvent(event);
        chunks.push(columns.map((column) => escapeDelimited(row[column], delimiter)).join(delimiter), "\r\n");
      });
    }
    onProgress(Math.min(start + page.length, matches.length), matches.length);
    await yieldToBrowser();
  }
  if (format === "json") chunks.push(matches.length ? "\n]" : "]");
  return { blob: new Blob(chunks, { type: format === "json" ? "application/json" : "text/plain;charset=utf-8" }), count: matches.length };
}
