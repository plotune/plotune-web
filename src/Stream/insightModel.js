// C04/C05 saved insights and dashboard tiles: pure helpers shared by the dashboard
// view, the insight editor and the result renderers.

export const INSIGHT_KINDS = [
  { id: "trends", label: "Trend", hint: "How often an event happens per interval." },
  { id: "funnel", label: "Funnel", hint: "How many devices go through steps in order." },
  { id: "retention", label: "Retention", hint: "Whether devices come back after their first day." },
  { id: "lifecycle", label: "Lifecycle", hint: "New, returning, resurrecting and dormant devices." },
  { id: "stickiness", label: "Stickiness", hint: "How many intervals each device was active." },
  { id: "paths", label: "Paths", hint: "What devices do after an event." },
];
export const kindLabel = (kind) => INSIGHT_KINDS.find((k) => k.id === kind)?.label || kind;

export const RANGES = [
  { id: "24h", label: "Last 24 hours", days: 1, interval: "hour" },
  { id: "7d", label: "Last 7 days", days: 7, interval: "day" },
];

// Credits: 1 per run, then per 1,000 events read; per-actor queries cost twice as much.
export const perThousand = (kind) => (kind === "trends" ? 20 : 40);
export const PRICE_NOTE = (kind) => `Each run costs 1 credit plus ${perThousand(kind)} per 1,000 events it reads. You see an estimate before each run.`;

const whole = (n) => Math.round(n).toLocaleString("en-GB");
// "About 3,200 events · ≈ 128 credits" from the free estimate.
export function estimateText(estimate) {
  if (!estimate) return "";
  const events = estimate.limited ? `${whole(estimate.eventLimit)}+ events (the most one run reads)` : `about ${whole(estimate.events)} events`;
  return `${events} · ≈ ${whole(Math.ceil(estimate.credits))} credit${Math.ceil(estimate.credits) === 1 ? "" : "s"}`;
}

export function queryRange(query) {
  return query?.query?.range || (query?.kind === "trends" ? "1h" : "7d");
}

// The stored query for the editor's choices. Event names come from discovery.
export function buildQuery({ kind, range, actor, event, steps, returnEvent, windowHours, depth }) {
  const r = RANGES.find((x) => x.id === range) || RANGES[1];
  const base = { query: { range: r.id } };
  if (kind === "trends") {
    return { kind, ...base, query: { ...base.query, name: event }, metrics: [{ id: "count", operation: "count" }], bucketSeconds: r.interval === "hour" ? 3600 : 86400 };
  }
  const who = { actor: actor === "session" ? "session" : "device" };
  if (kind === "funnel") {
    return { kind, ...who, ...base, steps: steps.filter(Boolean).map((name) => ({ name })), windowSeconds: Math.round(Number(windowHours || 24) * 3600) };
  }
  if (kind === "retention") {
    return { kind, ...who, ...base, startEvent: { name: event }, ...(returnEvent && returnEvent !== event ? { returnEvent: { name: returnEvent } } : {}), interval: r.interval };
  }
  if (kind === "paths") return { kind, ...who, ...base, ...(event ? { startEvent: { name: event } } : {}), depth: Number(depth || 4) };
  return { kind, ...who, ...base, event: { name: event }, interval: r.interval };
}

// What the editor needs before Save is enabled; null when the query is complete.
export function missingField({ kind, event, steps }) {
  if (kind === "funnel") return steps.filter(Boolean).length < 2 ? "Choose at least two steps" : null;
  if (kind === "paths") return null;
  return event ? null : "Choose an event";
}

// A dashboard's tiles in order; one saved before tiles shows its widgets.
export function dashboardTiles(dashboard) {
  if (!dashboard) return [];
  return Array.isArray(dashboard.tiles) ? dashboard.tiles : (dashboard.widgets || []).map((w) => ({ id: w.id, type: "widget" }));
}

export const tileId = () => `tile-${Math.random().toString(36).slice(2, 10)}`;

export function moveTile(tiles, id, step) {
  const from = tiles.findIndex((t) => t.id === id), to = from + step;
  if (from < 0 || to < 0 || to >= tiles.length) return tiles;
  const next = [...tiles];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

// Removing a widget tile removes the widget too, like dashboard_delete_tile.
export function withoutTile(dashboard, id) {
  return { ...dashboard, tiles: dashboardTiles(dashboard).filter((t) => t.id !== id), widgets: (dashboard.widgets || []).filter((w) => w.id !== id) };
}

export function withTile(dashboard, tile) {
  return { ...dashboard, tiles: [...dashboardTiles(dashboard), tile] };
}

export const TERMINAL = ["complete", "limited", "failed", "cancelled"];

// Plain-language note for a result that is not complete.
export function coverageNote(result) {
  const coverage = result?.coverage;
  if (!coverage || coverage.complete) return "";
  const reasons = {
    actor_event_limit: "Some devices had too many events to follow; their results may be cut short.",
    actor_limit: "There were too many devices to follow; the result covers the events read before the limit.",
    actor_list_limit: "Only the first 1,000 are listed.",
    candidate_limit: "The result covers the first 50,000 events in range.",
    decoded_byte_limit: "The result covers the events read before the size limit.",
    slice_limit: "The result covers the events read before the time limit.",
  };
  return reasons[coverage.reason] || "The result is partial.";
}

export const percent = (value) => (value === null || value === undefined ? "—" : `${Math.round(value * 1000) / 10}%`);

export function duration(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${Math.round(seconds)} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round((seconds / 3600) * 10) / 10} h`;
  return `${Math.round((seconds / 86400) * 10) / 10} d`;
}
