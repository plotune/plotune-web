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

export function discoverNumericSeries(events) {
  const series = new Map();
  events.forEach((event) => {
    visitNumbers(event.properties || {}, "", (property) => {
      const key = `${event.event}.${property}`;
      series.set(key, { key, event: event.event, property, label: key });
    });
  });
  return [...series.values()].sort((a, b) => a.label.localeCompare(b.label));
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

  const discovered = new Map(discoverNumericSeries(events).map((item) => [item.key, item]));
  return (graph.seriesKeys || []).flatMap((key) => {
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
  return graph.kind === "numeric" && (graph.seriesKeys || []).length > 2;
}
