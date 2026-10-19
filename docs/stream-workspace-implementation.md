# Stream workspace integration (web PR #6)

Implements the authenticated `/stream/workspace` against [cloud PR #44](https://github.com/plotune/plotune-cloud/pull/44), reviewed reference head `6cef6a4fab451bb5404c5861e908a6c9137093c8`. The Redis/R2 implementation supersedes the older D1 event API. No backend, infrastructure, marketing page or public demo was deployed or modified by this work.

## Screens and ownership

The live shell reuses the frozen demo (`src/Stream/DemoWorkspace.jsx`) styles, FilterPopover, Dashboard, WidgetEditor, DashboardGraph, Webhooks, ExportMenu and native dialog. `/stream/demo` continues using its own simulations, local state, early-access wrapper and analytics. The richer `/stream/prototypes/vision` is unchanged.

The live workspace uses the existing Plotune account JWT and supports projects, settings, membership, project keys, owner-account usage, shared Saved Filters, dashboards/widgets, Explorer, API/MCP setup and webhook configuration/status. No mock event or simulated capture is used on this route. Bounded local metadata snapshots accelerate reads; they do not replace authoritative shared resources. Raw project keys remain in React memory only and disappear on refresh/sign-out; existing keys cannot be recovered. Membership adds access for a verified account email; it sends no invitation mail. Only owners/admins see management controls and request management resources.

A confirmed account 401 closes the workspace session. Project-key MCP failures do not invalidate the account JWT. Auth service outages do not discard an otherwise unexpired cookie. Real workspace DOM is excluded from autocapture and session recording; credentials and event payloads are not emitted as analytics events.

## Cost and cache policy (owner comment on PR #6)

The frontend/backend were reviewed together against cloud PR #44 head `6cef6a4`. The backend already has a byte-bounded cache of decoded immutable R2 batches, shared in-flight object loads, hot-buffer mirrors and a signed control snapshot. Event/data routes bypass Worker and D1; its 30-second control poll and stale-snapshot fail-closed checks remain unchanged. No second backend cache or cached authorization grant is introduced.

Project lists and shared Filter/Dashboard definitions may be reused from account-session/API-origin scoped snapshots for 15 minutes. SessionStorage is bounded to 32 entries / 2 MiB per namespace, uses a SHA-256 session fingerprint rather than a bearer token, and falls back to memory if storage or WebCrypto is unavailable. Already displayed settings remain until explicit refresh; there is no background refresh timer. **Refresh shared settings** bypasses the snapshots. Own successful writes invalidate snapshots and retain uncached post-write verification / CAS behavior.

Each initial/project/privileged-view load checks the selected project against the Worker before reading cached resource definitions. Project detail, membership roles, member lists, raw keys and webhook credentials are not persisted in these snapshots. Member lists and webhook configuration are requested only on their management screens. Account 401/403 failures evict snapshots; scoped late denials cannot clear another currently authorized project. Logout, login/session changes and current-session invalidation clear cache storage and prevent pending reads from restoring it. A transient data-plane 403 can precede control propagation: the private UI is hidden, while a one-time key stays in React memory until fresh Worker authorization proves a Member downgrade or the session becomes invalid.

Application metadata request counts for an Owner on Events (excluding preflights and the existing account login/profile APIs):

| Case | Before | After |
| --- | --- | --- |
| Cold page load | 6 | 4; management lists deferred |
| Warm reload within TTL | 6 | 1 fresh project permission request |
| One hour open/idle, excluding initial load | 300 plus focus reloads | 0 recurring metadata reads |
| Explicit shared refresh | 5 plus a separately requested project list | 4, all fresh |

The remaining warm request is deliberately **not zero D1**: the existing Worker performs fresh project/member lookups (including its current repeated membership lookup). These are application request counts, not claims about billed SQL rows or CPU. With empty collections the old periodic reload still performed authorization lookups for five endpoints each minute; larger lists increased row reads further. Security-sensitive reads remain fresh rather than adding unsafe permission TTLs.

Visible widget refreshes move from 15 to 60 seconds (up to 4× fewer full-history refreshes). Delivery reports move from 10 to 30 seconds and pause while hidden. Usage loads on opening its menu or explicit refresh; discovery loads only for Events/Dashboards or explicit event refresh. Explorer realtime retains its five-second visible cadence but makes no hidden-tab requests. Runtime request reduction does not map directly to R2 operations: immutable-cache hits, eviction, query ranges and page counts determine actual GETs. Billed Worker/D1/R2/VPS savings still require staging measurements; capture durability, allowance enforcement and backend control synchronization are unchanged.

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

Saved Filters are shared project resources. Temporary property changes are passed directly as conditions. Unmodified Saved Filters are queried by ID without duplicating their conditions. Widgets store IDs rather than copying definitions. Shared settings refresh explicitly, after writes, or when a new load finds an expired 15-minute snapshot; they do not poll or refetch on focus. Charts query their saved configurations every 60 seconds while visible. New Explorer events are polled every five seconds while visible and staged until explicit refresh. Hidden tabs make no polling requests and refresh once on becoming visible. Project/filter changes discard incompatible staging and pending requests.

Deleting a referenced Filter requires an explicit warning/confirmation, including references detected by the server after a stale client check. References are preserved; affected widgets report missing-filter and offer editing rather than falling back to unfiltered data. CAS prevents concurrent dashboard/widget and Saved Filter edits from silently overwriting another member's changes.

Pagination fixes `now`, follows empty continuation pages and verifies snapshot stability for complete retrievals. Expired/changed/missing-filter cursors, repeated cursors and duplicate results are errors. The finalized backend returns bounded pages directly; there is no query-job API or invented 202 polling endpoint.

## Export and browser limits

JSON retains event structure/types. CSV/TSV flatten nested values to `properties.motor.rpm`-style columns; missing values are blank and explicit null is `null`. Arrays/empty objects at leaves use JSON text. Bracket-escaped columns such as `properties["a.b"]` distinguish literal dotted keys from nested `properties.a.b`. Delimiters, quotes and newlines are escaped. Filenames include a sanitized project name and UTC date.

Export starts a stable retrieval with the active conditions and the Explorer's time anchor, follows every page and converts in the browser. It does not export only the visible page or reuse an incomplete page list. New ingestion may be included in a fresh export snapshot if its timestamp falls inside that scope; every export continuation belongs to that export's own fixed ingestion snapshot.

The frontend deliberately caps complete exports, previews and widget retrievals at 10,000 matching events or 32 MiB of source JSON. Converted files also have a 32 MiB cap, preventing very wide sparse CSV/TSV expansion from exhausting memory. Conversion yields between 250-event chunks. Two simultaneous full-history retrievals are allowed per workspace; other retrievals wait and are cancellable. Charts retain aggregated series/counts rather than full raw datasets. A failed or oversized retrieval never produces a partial download or partial chart. These are browser implementation limits, not commercial account allowances.

Discovery can be sampled/truncated; manual property and event entry remains available. Nested path semantics match the backend's dot-path contract. Retention is described as the project's policy because `/usage` does not currently expose retention days. Account limits are read from `/usage`, never copied from provisional pricing.

## Verification

Recorded on 2026-10-14: **269 tests / 50 suites passed**; lint completed with zero errors and five existing warnings; the full default production build, all 46 prerenders and agent-content checks passed. An enabled production build also passed, and the complete synthetic desktop/mobile browser flow passed against that production bundle, including cold/warm/explicit-refresh metadata request assertions. No staging or production backend was contacted.

Review screenshots: [Explorer desktop](stream-workspace-qa/explorer-desktop.png), [Explorer mobile](stream-workspace-qa/explorer-mobile.png), [Dashboard desktop](stream-workspace-qa/dashboard-desktop.png), [Dashboard mobile](stream-workspace-qa/dashboard-mobile.png), [Widget editor](stream-workspace-qa/widget-editor-desktop.png).

- Repository Jest tests: `CI=true npm test -- --watchAll=false --runInBand`.
- ESLint: CRA `react-app` / `react-app/jest` configuration across changed code and Stream models. Existing warnings in App route regexes, demo effect and login OAuth effect are unrelated; new code has no lint errors.
- Full production build: `CI=true npm run build`, including all 46 prerendered routes and agent-content checks. Playwright Chromium must be installed. Third-party missing source-map warnings already exist in installed dependencies.
- Repeatable browser fixtures: run `BROWSER=none npm start`, then `node scripts/stream/check-workspace.cjs`. Optional `STREAM_QA_ORIGIN` and `STREAM_QA_OUTPUT` select the local frontend and screenshot directory. Every non-local request is intercepted; no production analytics, customer data, leads or webhooks are submitted.

The Codex P2 finding about consecutive Saved Filter updates was reproduced by a regression test that fails before the fix. Successful saves now reset the temporary draft and adopt the saved CAS revision. Consecutive updates are covered in unit and browser tests. Follow-up review findings about conflict refreshes and stale widget definitions are also corrected: a rejected draft can adopt a freshly loaded revision without losing its conditions, while an ordinary background refresh before a conflict retains its original CAS protection. Chart aggregation and rendering use the authoritative widget definition returned with the event pages, including when dashboard metadata is temporarily stale. Widget conflicts can refresh within the editor and retry without dropping the draft or another member's widgets; manual event/property entry also remains available if discovery is unavailable. Clear all resets custom UTC bounds, and editing an undiscovered Boolean condition retains its type and operator. Editing a remotely refreshed chart now opens the authoritative widget definition rather than stale dashboard metadata. Mutation promises propagate a failed post-write metadata reload, preserving editor drafts instead of reporting a false refresh success. The event detail dialog shows and copies JSON only after the dedicated full-event endpoint succeeds; partial query rows remain unavailable to copy during loading or failure. Later chart refresh failures and pending retries preserve the last authoritative widget for editing. Missing-filter responses validate and retain their returned widget, and retrieval/collection failures carry confirmed widget metadata without returning partial event data. Error panels use that definition for replacement editing; a changed definition clears previous chart results. Changes to the project or widget definition still invalidate prior chart state. Background refreshes cannot supersede post-write metadata verification, and a superseded verification rejects instead of claiming success. Project-name refreshes preserve the draft and adopt the returned revision after conflicts or post-write verification errors. Successful member additions, role changes and removals also advance the rename baseline without discarding a pending name. Pristine names follow authoritative metadata, while active drafts keep their original conflict protection until a rejected save or explicit refresh. A refreshed Saved Filter whose wire conditions match a retained draft confirms the save, adopts its new revision and resumes selection by ID even after failed write verification. UI condition IDs do not affect that comparison. Verification guards are scoped to the client/project, so switching projects immediately loads the new selection and late errors from the previous project cannot overwrite it. Creation drafts for dashboards, Saved Filters, webhooks and widgets keep one resource ID across verification-error retries. A committed create cannot produce a second resource on retry; if the backend reports that the ID already exists, refresh the shared metadata to confirm the resource. These concurrency/error and creation-identity regressions fail against the prior commit and pass after the fixes.

Browser coverage includes 110-event complete export, synthetic capture → staged indication → explicit refresh, discovered mixed-type numeric filtering, shared save/reload, full JSON/Escape, independent Saved Filters per widget, preview/breakdown/save/reopen, key rotation/recovery rules, expired cursor recovery, owner project/member/webhook changes, a separate member session and desktop/mobile overflow. Unit coverage also checks operators/type mismatches/null/missing/nested fields, reference updates/breakdowns, escaping, sparse pages, duplicate/repeated/changed pages, cancellation, stale requests, account status errors, resource CAS and memory limits.

These are synthetic frontend contract checks, not evidence of a deployed Redis/R2 system. Actual capture durability, Redis→R2 flush/compaction/recovery and billed infrastructure costs still require the cloud PR's staging acceptance before activation.

## Deployment and explicit disable override

Owner direction during the coordinated deployment: the authenticated workspace is
enabled by default. Deploy with `npm run deploy`; no activation environment variable
is required. An explicit `REACT_APP_STREAM_WORKSPACE_ENABLED=false` disables the
workspace and shows the existing demo link. This build-time override requires a
rebuild and deployment to take effect.

1. Complete the backend PR #44 runbook: private R2 bucket and scoped credentials, D1 metadata migration/bindings, runtime/Worker secrets, Redis AOF/fsync configuration, runtime/control synchronization and protected tunnel routing. The runtime must fail closed if its durability requirements are unavailable.
2. Configure the final Worker metadata/control/MCP routes and direct Go capture/data routes with the supported frontend origins and account JWKS. Enforce edge capture limits without inserting an event-conversion Worker hop.
3. On approved staging, verify synthetic ingestion before/after flush and compaction, stable complete exports, expiry/recovery, member boundaries, rotation and durable webhook retries. Measure billed Worker/R2/VPS cost and approve allowances/retention.
4. Deploy through the normal reviewed site release workflow with `npm run deploy`. `REACT_APP_STREAM_API_ORIGIN` defaults to `https://stream.plotune.net` and may point at an approved HTTPS origin; it cannot include credentials, query strings or a path.

Future datasets beyond browser limits will need backend-selected/aggregated widget results or a streaming/page source for complete export, retaining the same typed conditions, Saved Filter IDs, stable snapshot/time anchors, revision checks and tenant authorization. CSV/TSV prefix formula-like string cells (including markers after whitespace or controls) with an apostrophe before delimiter escaping; actual numeric values stay numeric and JSON preserves original values and types. Conversion remains a frontend responsibility. No new production conversion endpoint or MCP tool is introduced here.
