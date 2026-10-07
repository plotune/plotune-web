export const DASHBOARD_RANGES = [
  { id: "15m", label: "Last 15 minutes", durationMs: 15 * 60 * 1000, buckets: 15 },
  { id: "1h", label: "Last 1 hour", durationMs: 60 * 60 * 1000, buckets: 12 },
  { id: "6h", label: "Last 6 hours", durationMs: 6 * 60 * 60 * 1000, buckets: 12 },
  { id: "24h", label: "Last 24 hours", durationMs: 24 * 60 * 60 * 1000, buckets: 24 },
  { id: "7d", label: "Last 7 days", durationMs: 7 * 24 * 60 * 60 * 1000, buckets: 28 },
];

function visitNumbers(value, path, visit) {
  if (typeof value === "number" && Number.isFinite(value)) {
    visit(path);
    return;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  Object.entries(value).forEach(([key, child]) => {
    visitNumbers(child, path ? `${path}.${key}` : key, visit);
  });
}

export function getEventNames(events) {
  return [...new Set(events.map((event) => event.event))].sort();
}

export function searchEventNames(eventNames, query = "") {
  const normalized = query.trim().toLowerCase();
  return normalized
    ? eventNames.filter((name) => name.toLowerCase().includes(normalized))
    : eventNames;
}

export function getNumericProperties(events, eventName) {
  const properties = new Set();
  events.forEach((event) => {
    if (event.event === eventName) {
      visitNumbers(event.properties || {}, "", (property) => properties.add(property));
    }
  });
  return [...properties].sort((a, b) => a.localeCompare(b));
}

export function discoverNumericSeries(events) {
  return getEventNames(events).flatMap((eventName) =>
    getNumericProperties(events, eventName).map((property) => {
      const key = `${eventName}.${property}`;
      return { key, event: eventName, property, label: key };
    }),
  );
}

function readProperty(properties, path) {
  return path.split(".").reduce((value, key) => value?.[key], properties);
}

export function buildGraphSeries(events, graph, now) {
  const range = DASHBOARD_RANGES.find((item) => item.id === graph.range) || DASHBOARD_RANGES[1];
  const end = typeof now === "number" ? now : Date.parse(now);
  const start = end - range.durationMs;
  const bucketWidth = range.durationMs / range.buckets;
  const buckets = Array.from({ length: range.buckets }, (_, index) => ({
    timestamp: new Date(start + (index + 0.5) * bucketWidth).toISOString(),
    sum: 0,
    count: 0,
  }));
  const inRange = events.filter((event) => {
    const timestamp = Date.parse(event.timestamp);
    return timestamp >= start && timestamp <= end;
  });

  if (graph.kind === "count") {
    inRange.forEach((event) => {
      if (event.event !== graph.eventName) return;
      const index = Math.min(range.buckets - 1, Math.floor((Date.parse(event.timestamp) - start) / bucketWidth));
      buckets[index].sum += 1;
      buckets[index].count += 1;
    });
    return [{
      key: `${graph.eventName}.count`,
      label: `${graph.eventName} · count`,
      points: buckets.map((bucket) => ({ timestamp: bucket.timestamp, value: bucket.sum })),
    }];
  }

  const selectedKeys = graph.propertyNames
    ? graph.propertyNames.map((property) => `${graph.eventName}.${property}`)
    : graph.seriesKeys || [];
  const candidates = graph.eventName
    ? getNumericProperties(events, graph.eventName).map((property) => ({
        key: `${graph.eventName}.${property}`,
        event: graph.eventName,
        property,
      }))
    : discoverNumericSeries(events);
  const discovered = new Map(candidates.map((item) => [item.key, item]));
  return selectedKeys.flatMap((key) => {
    const selected = discovered.get(key);
    if (!selected) return [];
    const values = buckets.map((bucket) => ({ ...bucket, sum: 0, count: 0 }));
    inRange.forEach((event) => {
      if (event.event !== selected.event) return;
      const value = readProperty(event.properties || {}, selected.property);
      if (typeof value !== "number" || !Number.isFinite(value)) return;
      const index = Math.min(range.buckets - 1, Math.floor((Date.parse(event.timestamp) - start) / bucketWidth));
      values[index].sum += value;
      values[index].count += 1;
    });
    return [{
      key,
      label: key,
      points: values.map((bucket) => ({
        timestamp: bucket.timestamp,
        value: bucket.count ? bucket.sum / bucket.count : null,
      })),
    }];
  });
}

export function graphIsWide(graph) {
  const count = graph.propertyNames?.length ?? graph.seriesKeys?.length ?? 0;
  return graph.kind === "numeric" && count > 2;
}
