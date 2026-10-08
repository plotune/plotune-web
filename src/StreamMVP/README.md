# Plotune Stream workspace preview

`/stream/workspace` is a frontend-only project event workspace. The MVP routes
cover Events, Dashboards, API Setup, MCP Setup, Webhooks, and Project Settings.
The richer future workspace remains separate at `/stream/prototypes/vision`.

## Events and shared filters

Events keep the generic envelope (`id`, `event`, `timestamp`, `properties`). The
Explorer combines event name, time range, search, and property conditions through
`filterModel.js`; its cursor pagination is applied after the common query. Filter
conditions support nested property paths and strict value types. Saved Filters are
project-scoped definitions referenced by ID from Dashboard widgets.

`FilterControls.jsx` manages temporary conditions and project Saved Filters.
`projectResourceStore.js` stores Saved Filter definitions and Dashboard widget
configuration in browser `localStorage`. This persistence is local to the current
browser profile, not shared server storage. Event fixtures and Explorer state remain
in-memory and reset on reload. If a referenced Saved Filter is deleted, the widget
shows an unavailable-filter state and does not broaden to unfiltered data.

`eventQueryService.js` is the mock retrieval boundary for filtered cursor pages.
Explorer and Dashboard queries use the pure evaluator in `filterModel.js`. Export
uses the same query, retrieves all mock matches rather than the current page, then
serializes JSON, CSV, or TSV in the browser. The mock exporter caps each export at
10,000 matches and yields between chunks; a production paginated source can replace
the mock retrieval adapter.

## Dashboard widgets

`WidgetEditor.jsx` configures a numeric-property line chart or event-count chart,
optional Saved Filter, custom-property breakdown, title, and bounded time range.
`widgetModel.js` evaluates the referenced Saved Filter by ID at render time, so
editing that definition updates its widgets. A widget whose filter was deleted
remains visible with a recovery action. The existing Plotune chart components render
bucketed frontend fixture data; there is no backend query, persistence, or live
transport.

## Prototype boundaries

API keys, ingestion, MCP, Webhooks, project members, event sources, Saved Filters,
Dashboard widgets, and exports are illustrative frontend behavior. Saved metadata
survives reloads only through browser `localStorage`; no server sharing or backend
event retrieval is connected. The seeded events include generic custom properties
for real/simulation contexts, versions, dates, nested values, nulls, mixed types,
and drone errors. These are example properties, not required Stream schema.

Run `CI=true npm test -- --watchAll=false --runInBand` and `npm run build`. The
production build prerender step binds a temporary local server and may require local
port permissions in a restricted environment.
