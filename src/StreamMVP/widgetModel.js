import { DASHBOARD_RANGES } from "./dashboardModel";
import { queryEvents, readPropertyPath, resolveWidgetFilter } from "./filterModel";

function breakdownKey(event, property) {
  if (!property) return { key: "all", label: "All events" };
  const result = readPropertyPath(event.properties || {}, property);
  if (!result.exists) return { key: "missing", label: "(missing)" };
  if (result.value === null) return { key: "null", label: "(null)" };
  if (typeof result.value === "object") return { key: JSON.stringify(result.value), label: JSON.stringify(result.value) };
  return { key: `${typeof result.value}:${String(result.value)}`, label: String(result.value) };
}

export function getWidgetEventData(events, widget, savedFilters, now) {
  const filter = resolveWidgetFilter(widget, savedFilters);
  if (filter.status === "missing") return { status: "missing-filter", events: [], filter };
  const matched = queryEvents(events, {
    name: widget.eventName || "All events",
    range: widget.range || "1h",
    now,
    conditions: filter.conditions,
  });
  return { status: matched.length ? "ready" : "empty", events: matched, filter };
}

export function getWidgetChoices(events, widget, savedFilters, now) {
  const filter = resolveWidgetFilter(widget, savedFilters);
  if (filter.status === "missing") return { status: "missing-filter", events: [], eventNames: [], numericProperties: [], breakdownProperties: [], filter };
  const matchingEvents = queryEvents(events, {
    range: widget.range || "1h",
    now,
    conditions: filter.conditions,
  });
  const selectedEvents = widget.eventName ? matchingEvents.filter((event) => event.event === widget.eventName) : matchingEvents;
  const names = [...new Set(matchingEvents.map((event) => event.event))].sort();
  const props = new Map();
  selectedEvents.forEach((event) => {
    const visit = (value, prefix) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      Object.entries(value).forEach(([key, child]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof child === "number" && Number.isFinite(child)) props.set(path, "number");
        else if (!props.has(path)) props.set(path, child === null ? "null" : typeof child);
        visit(child, path);
      });
    };
    if (!widget.eventName || event.event === widget.eventName) visit(event.properties || {}, "");
  });
  return {
    status: selectedEvents.length ? "ready" : "empty",
    events: selectedEvents,
    filter,
    eventNames: names,
    numericProperties: [...props.entries()].filter(([, type]) => type === "number").map(([path]) => path).sort(),
    breakdownProperties: [...props.keys()].sort(),
  };
}

export function buildWidgetSeries(events, widget, savedFilters, now) {
  const result = getWidgetEventData(events, widget, savedFilters, now);
  if (result.status !== "ready") return { ...result, series: [] };
  const range = DASHBOARD_RANGES.find((item) => item.id === widget.range) || DASHBOARD_RANGES[1];
  const end = typeof now === "number" ? now : Date.parse(now);
  const start = end - range.durationMs;
  const bucketWidth = range.durationMs / range.buckets;
  const buckets = Array.from({ length: range.buckets }, (_, index) => new Date(start + (index + 0.5) * bucketWidth).toISOString());
  const categories = new Map();
  result.events.forEach((event) => {
    const category = breakdownKey(event, widget.breakdownProperty);
    if (!categories.has(category.key)) categories.set(category.key, category.label);
  });
  const orderedCategories = [...categories.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const visibleCategories = orderedCategories.length > 6 ? [...orderedCategories.slice(0, 5), ["__other__", "Other"]] : orderedCategories;
  const categoryMap = new Map(visibleCategories);
  const series = visibleCategories.map(([key, label]) => ({
    key: `${widget.id}:${key}`,
    label: widget.breakdownProperty
      ? `${widget.breakdownProperty}: ${label}`
      : widget.visualization === "count" ? `${widget.eventName} · count` : `${widget.eventName}.${widget.measureProperty}`,
    points: buckets.map((timestamp) => ({ timestamp, value: 0, total: 0 })),
  }));
  const seriesByKey = new Map(visibleCategories.map(([key], index) => [key, series[index]]));

  result.events.forEach((event) => {
    const original = breakdownKey(event, widget.breakdownProperty);
    const categoryKey = categoryMap.has(original.key) ? original.key : "__other__";
    const bucketIndex = Math.min(range.buckets - 1, Math.max(0, Math.floor((Date.parse(event.timestamp) - start) / bucketWidth)));
    const point = seriesByKey.get(categoryKey)?.points[bucketIndex];
    if (!point) return;
    if (widget.visualization === "count") {
      point.value += 1;
      point.total += 1;
      return;
    }
    const value = readPropertyPath(event.properties || {}, widget.measureProperty).value;
    if (typeof value === "number" && Number.isFinite(value)) {
      point.value += value;
      point.total += 1;
    }
  });

  series.forEach((item) => {
    item.points.forEach((point) => {
      point.value = widget.visualization === "count"
        ? point.total
        : point.total ? point.value / point.total : null;
      delete point.total;
    });
  });
  return { ...result, series };
}
