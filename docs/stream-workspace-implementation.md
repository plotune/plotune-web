# Stream workspace integration (web PR #6)

Implements the authenticated `/stream/workspace` against [cloud PR #44](https://github.com/plotune/plotune-cloud/pull/44), reviewed reference head `6cef6a4fab451bb5404c5861e908a6c9137093c8`. The Redis/R2 implementation supersedes the older D1 event API. No backend, infrastructure, marketing page or public demo was deployed or modified by this work.

## Screens and ownership

The live shell reuses the frozen `StreamMVP` styles, FilterPopover, Dashboard, WidgetEditor, DashboardGraph, Webhooks, ExportMenu and native dialog. `/stream/demo` continues using its own simulations, local state, early-access wrapper and analytics. The richer `/stream/prototypes/vision` is unchanged.

The live workspace uses the existing Plotune account JWT and supports projects, settings, membership, project keys, owner-account usage, shared Saved Filters, dashboards/widgets, Explorer, API/MCP setup and webhook configuration/status. No mock event, simulated capture or local resource persistence is used on this route. Raw project keys remain in React memory only and disappear on refresh/sign-out; existing keys cannot be recovered. Membership adds access for a verified account email; it sends no invitation mail. Only owners/admins see management controls and request management resources.

A confirmed account 401 closes the workspace session. Project-key MCP failures do not invalidate the account JWT. Auth service outages do not discard an otherwise unexpired cookie. Real workspace DOM is excluded from autocapture and session recording; credentials and event payloads are not emitted as analytics events.

## Query and resource contracts

| Action | Contract |
| --- | --- |
| Account authentication | Existing `api.plotune.net` login/validation; account Bearer JWT for project/event APIs |
| Shared metadata | `/v1/projects/:project/{filters,dashboards,webhooks}`; resource envelope `{id,kind,data,generation,revision,createdAt,updatedAt}` |
| Concurrent edits | Resource `revision` on update/delete; project `revision` on name, membership and key writes; 409 retains editor drafts and asks for refresh |
| Explorer/export | `POST /v1/data/projects/:project/events/query`; AND conditions, optional `filterId`, envelope selections, time scope, `now`, opaque `cursor`, `limit` |
| Discovery | `GET .../discovery`; sampled names/types/values independent of current pagination |
| Full event | `GET .../events/:eventId`, retaining complete JSON and original property types |
| Saved widget | `POST .../dashboards/:dashboard/widgets/:widget/data`; server resolves the current Saved Filter reference and widget event/time selection |
| Realtime | `POST .../realtime {after}`; baseline, staged IDs, explicit reset/refresh; no automatic Explorer reorder |
| Usage/status | `GET .../usage` and admin-only `GET .../webhook-deliveries` |
| Capture/MCP setup | Direct Go `/capture` examples; Worker `/mcp` initialize with the project key |

Saved Filters are shared project resources. Temporary property changes are passed directly as conditions. Unmodified Saved Filters are queried by ID without duplicating their conditions. Widgets store IDs rather than copying definitions. Metadata refreshes on focus and every 60 seconds while visible; charts query their own saved configurations every 15 seconds while visible. New Explorer events are polled every five seconds (30 seconds while hidden) and staged until explicit refresh. Project/filter changes discard incompatible staging and pending requests.

Deleting a referenced Filter requires an explicit warning/confirmation, including references detected by the server after a stale client check. References are preserved; affected widgets report missing-filter and offer editing rather than falling back to unfiltered data. CAS prevents concurrent dashboard/widget and Saved Filter edits from silently overwriting another member's changes.

Pagination fixes `now`, follows empty continuation pages and verifies snapshot stability for complete retrievals. Expired/changed/missing-filter cursors, repeated cursors and duplicate results are errors. The finalized backend returns bounded pages directly; there is no query-job API or invented 202 polling endpoint.

## Export and browser limits

JSON retains event structure/types. CSV/TSV flatten nested values to `properties.motor.rpm`-style columns; missing values are blank and explicit null is `null`. Arrays/empty objects at leaves use JSON text. Bracket-escaped columns such as `properties["a.b"]` distinguish literal dotted keys from nested `properties.a.b`. Delimiters, quotes and newlines are escaped. Filenames include a sanitized project name and UTC date.

Export starts a stable retrieval with the active conditions and the Explorer's time anchor, follows every page and converts in the browser. It does not export only the visible page or reuse an incomplete page list. New ingestion may be included in a fresh export snapshot if its timestamp falls inside that scope; every export continuation belongs to that export's own fixed ingestion snapshot.

The frontend deliberately caps complete exports, previews and widget retrievals at 10,000 matching events or 32 MiB of source JSON. Converted files also have a 32 MiB cap, preventing very wide sparse CSV/TSV expansion from exhausting memory. Conversion yields between 250-event chunks. Two simultaneous full-history retrievals are allowed per workspace; other retrievals wait and are cancellable. Charts retain aggregated series/counts rather than full raw datasets. A failed or oversized retrieval never produces a partial download or partial chart. These are browser implementation limits, not commercial account allowances.

Discovery can be sampled/truncated; manual property and event entry remains available. Nested path semantics match the backend's dot-path contract. Retention is described as the project's policy because `/usage` does not currently expose retention days. Account limits are read from `/usage`, never copied from provisional pricing.

## Verification

Recorded on 2026-10-13: **215 tests / 42 suites passed**; lint completed with zero errors and five existing warnings; the full default production build, all 46 prerenders and agent-content checks passed. An enabled production build also passed, and the complete synthetic browser flow passed against that production bundle (plus the local development bundle). No staging or production backend was contacted.

Review screenshots: [Explorer desktop](stream-workspace-qa/explorer-desktop.png), [Explorer mobile](stream-workspace-qa/explorer-mobile.png), [Dashboard desktop](stream-workspace-qa/dashboard-desktop.png), [Dashboard mobile](stream-workspace-qa/dashboard-mobile.png), [Widget editor](stream-workspace-qa/widget-editor-desktop.png).

- Repository Jest tests: `CI=true npm test -- --watchAll=false --runInBand`.
- ESLint: CRA `react-app` / `react-app/jest` configuration across changed code and Stream models. Existing warnings in App route regexes, demo effect and login OAuth effect are unrelated; new code has no lint errors.
- Full production build: `CI=true npm run build`, including all 46 prerendered routes and agent-content checks. Playwright Chromium must be installed. Third-party missing source-map warnings already exist in installed dependencies.
- Repeatable browser fixtures: run `REACT_APP_STREAM_WORKSPACE_ENABLED=true BROWSER=none npm start`, then `node scripts/stream/check-workspace.cjs`. Optional `STREAM_QA_ORIGIN` and `STREAM_QA_OUTPUT` select the local frontend and screenshot directory. Every non-local request is intercepted; no production analytics, customer data, leads or webhooks are submitted.

The Codex P2 finding about consecutive Saved Filter updates was reproduced by a regression test that fails before the fix. Successful saves now reset the temporary draft and adopt the saved CAS revision. Consecutive updates are covered in unit and browser tests.

Browser coverage includes 110-event complete export, synthetic capture → staged indication → explicit refresh, discovered mixed-type numeric filtering, shared save/reload, full JSON/Escape, independent Saved Filters per widget, preview/breakdown/save/reopen, key rotation/recovery rules, expired cursor recovery, owner project/member/webhook changes, a separate member session and desktop/mobile overflow. Unit coverage also checks operators/type mismatches/null/missing/nested fields, reference updates/breakdowns, escaping, sparse pages, duplicate/repeated/changed pages, cancellation, stale requests, account status errors, resource CAS and memory limits.

These are synthetic frontend contract checks, not evidence of a deployed Redis/R2 system. Actual capture durability, Redis→R2 flush/compaction/recovery and billed infrastructure costs still require the cloud PR's staging acceptance before activation.

## Activation remains an owner step

Default builds leave the authenticated workspace disabled with a demo link. Do not enable it simply because the frontend compiles.

1. Complete the backend PR #44 runbook: private R2 bucket and scoped credentials, D1 metadata migration/bindings, runtime/Worker secrets, Redis AOF/fsync configuration, runtime/control synchronization and protected tunnel routing. The runtime must fail closed if its durability requirements are unavailable.
2. Configure the final Worker metadata/control/MCP routes and direct Go capture/data routes with the supported frontend origins and account JWKS. Enforce edge capture limits without inserting an event-conversion Worker hop.
3. On approved staging, verify synthetic ingestion before/after flush and compaction, stable complete exports, expiry/recovery, member boundaries, rotation and durable webhook retries. Measure billed Worker/R2/VPS cost and approve allowances/retention.
4. Only after those checks and owner approval, build with `REACT_APP_STREAM_WORKSPACE_ENABLED=true`. `REACT_APP_STREAM_API_ORIGIN` defaults to `https://stream.plotune.net` and may point at an approved HTTPS origin; it cannot include credentials, query strings or a path. Deploy through the normal reviewed site release workflow.

Future datasets beyond browser limits will need backend-selected/aggregated widget results or a streaming/page source for complete export, retaining the same typed conditions, Saved Filter IDs, stable snapshot/time anchors, revision checks and tenant authorization. Conversion remains a frontend responsibility. No new production conversion endpoint or MCP tool is introduced here.
