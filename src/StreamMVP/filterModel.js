import { DASHBOARD_RANGES } from "./dashboardModel";

export const PROPERTY_OPERATORS = {
  string: ["equals", "not_equals", "contains"],
  number: ["equals", "not_equals", "greater_than", "greater_or_equal", "less_than", "less_or_equal"],
  boolean: ["is_true", "is_false"],
  mixed: ["equals", "not_equals", "contains", "greater_than", "greater_or_equal", "less_than", "less_or_equal", "is_true", "is_false"],
  object: [],
  null: [],
};

export const UNIVERSAL_OPERATORS = ["exists", "not_exists", "is_null"];

export function readPropertyPath(value, path) {
  const parts = String(path || "").split(".").filter(Boolean);
  let current = value;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, part)) {
      return { exists: false, value: undefined };
    }
    current = current[part];
  }
  return { exists: parts.length > 0, value: current };
}

function visitProperties(value, prefix, visit) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  Object.entries(value).forEach(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    visit(path, child);
    visitProperties(child, path, visit);
  });
}

export function detectValueType(values) {
  const types = new Set(values.map((value) => value === null ? "null" : Array.isArray(value) ? "object" : typeof value));
  if (!types.size) return "unknown";
  if (types.size === 1) return [...types][0];
  return "mixed";
}

export function discoverPropertyPaths(events) {
  const valuesByPath = new Map();
  events.forEach((event) => {
    visitProperties(event.properties || {}, "", (path, value) => {
      if (!valuesByPath.has(path)) valuesByPath.set(path, []);
      valuesByPath.get(path).push(value);
    });
  });
  return [...valuesByPath.entries()]
    .map(([path, values]) => ({ path, type: detectValueType(values), values }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function searchPropertyPaths(properties, query = "") {
  const normalized = query.trim().toLowerCase();
  return normalized ? properties.filter(({ path }) => path.toLowerCase().includes(normalized)) : properties;
}

export function inferPropertyType(events, path) {
  const values = [];
  events.forEach((event) => {
    const result = readPropertyPath(event.properties || {}, path);
    if (result.exists) values.push(result.value);
  });
  return detectValueType(values);
}

export function evaluateCondition(event, condition) {
  const { exists, value } = readPropertyPath(event.properties || {}, condition.path);
  switch (condition.operator) {
    case "exists": return exists;
    case "not_exists": return !exists;
    case "is_null": return exists && value === null;
    case "equals": return exists && value !== null && typeof value === typeof condition.value && value === condition.value;
    case "not_equals": return exists && value !== null && typeof value === typeof condition.value && value !== condition.value;
    case "contains": return exists && typeof value === "string" && typeof condition.value === "string" && value.includes(condition.value);
    case "greater_than": return exists && typeof value === "number" && typeof condition.value === "number" && value > condition.value;
    case "greater_or_equal": return exists && typeof value === "number" && typeof condition.value === "number" && value >= condition.value;
    case "less_than": return exists && typeof value === "number" && typeof condition.value === "number" && value < condition.value;
    case "less_or_equal": return exists && typeof value === "number" && typeof condition.value === "number" && value <= condition.value;
    case "is_true": return exists && value === true;
    case "is_false": return exists && value === false;
    default: return false;
  }
}

export function matchesConditions(event, conditions = []) {
  return conditions.every((condition) => evaluateCondition(event, condition));
}

export function queryEvents(events, query = {}) {
  const {
    search = "",
    name = "All events",
    range = "24h",
    now,
    conditions = [],
  } = query;
  const current = typeof now === "number" ? now : Date.parse(now);
  const interval = DASHBOARD_RANGES.find((item) => item.id === range)?.durationMs;
  return events
    .filter((event) => {
      const timestamp = Date.parse(event.timestamp);
      const matchesTime = timestamp <= current
        && (range === "all" || interval === undefined || timestamp >= current - interval);
      const matchesSearch = !search || JSON.stringify({ event: event.event, properties: event.properties }).toLowerCase().includes(search.trim().toLowerCase());
      return matchesTime
        && matchesSearch
        && (name === "All events" || event.event === name)
        && matchesConditions(event, conditions);
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp) || String(a.id).localeCompare(String(b.id)));
}

export function resolveWidgetFilter(widget, savedFilters) {
  if (!widget.filterId) return { status: "none", conditions: [] };
  const filter = savedFilters.find((item) => item.id === widget.filterId);
  return filter
    ? { status: "resolved", filter, conditions: filter.conditions }
    : { status: "missing", filter: null, conditions: [] };
}
