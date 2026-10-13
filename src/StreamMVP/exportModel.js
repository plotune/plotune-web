import { getMatchingEventPages } from "./eventQueryService";

export const EXPORT_FORMATS = ["json", "tsv", "csv"];
export const MAX_MOCK_EXPORT_EVENTS = 10000;

function flattenValue(value, prefix, output) {
  if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length) {
    Object.entries(value).forEach(([key, child]) => {
      // Bracket paths keep literal dotted keys distinct from nested objects.
      const path = /^[A-Za-z_$][\w$-]*$/.test(key) ? `${prefix}.${key}` : `${prefix}[${JSON.stringify(key)}]`;
      flattenValue(child, path, output);
    });
    return;
  }
  output[prefix] = value;
}

export function flattenEvent(event) {
  const properties = {};
  flattenValue(event.properties || {}, "properties", properties);
  return { id: event.id, event: event.event, timestamp: event.timestamp, device_id: event.device_id ?? "", session_id: event.session_id ?? "", ...properties };
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
  const propertyColumns = [...new Set(rows.flatMap((row) => Object.keys(row).filter((key) => (key.startsWith("properties.") || key.startsWith("properties[")))))].sort();
  const columns = ["id", "event", "timestamp", "device_id", "session_id", ...propertyColumns];
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
  return createEventExport(matches, format, { onProgress });
}

export async function createEventExport(matches, format, { onProgress = () => {}, signal, maxBytes = 32 * 1024 * 1024 } = {}) {
  if (!EXPORT_FORMATS.includes(format)) throw new Error("Choose JSON, TSV, or CSV.");
  const chunks = []; let outputBytes = 0;
  const encoder = new TextEncoder();
  const append = (...parts) => {
    for (const part of parts) {
      outputBytes += encoder.encode(part).byteLength;
      if (outputBytes > maxBytes) throw new Error("The converted export exceeds the browser's 32 MB limit. Narrow your filters; no partial export was downloaded.");
      chunks.push(part);
    }
  };
  const pageSize = 250;
  if (format === "json") append("[");
  let columns;
  if (format === "csv" || format === "tsv") {
    const flattened = matches.map(flattenEvent);
    const properties = [...new Set(flattened.flatMap((row) => Object.keys(row).filter((key) => (key.startsWith("properties.") || key.startsWith("properties[")))))].sort();
    columns = ["id", "event", "timestamp", "device_id", "session_id", ...properties];
    const delimiter = format === "tsv" ? "\t" : ",";
    append(columns.map((column) => escapeDelimited(column, delimiter)).join(delimiter), "\r\n");
  }
  for (let start = 0; start < matches.length; start += pageSize) {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    const page = matches.slice(start, start + pageSize);
    if (format === "json") {
      page.forEach((event, index) => {
        if (start > 0 || index > 0) append(",\n");
        else append("\n");
        append(JSON.stringify(event));
      });
    } else {
      const delimiter = format === "tsv" ? "\t" : ",";
      page.forEach((event) => {
        const row = flattenEvent(event);
        append(columns.map((column) => escapeDelimited(row[column], delimiter)).join(delimiter), "\r\n");
      });
    }
    onProgress(Math.min(start + page.length, matches.length), matches.length);
    await yieldToBrowser();
  }
  if (format === "json") append(matches.length ? "\n]" : "]");
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  return { blob: new Blob(chunks, { type: format === "json" ? "application/json" : "text/plain;charset=utf-8" }), count: matches.length };
}
