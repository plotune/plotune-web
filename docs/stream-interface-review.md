# Stream demo and workspace interface review

Reviewed 2026-10-16 against local web commit `3e75019`.

## Reference and evidence

The product reference is `/stream/demo`, implemented in
`src/StreamMVP/StreamMVP.jsx`. The authenticated route is
`/stream/workspace`, implemented in `src/StreamMVP/live/StreamWorkspace.jsx`.
The integration brief explicitly requires preserving the frozen experience.
Sharing CSS alone has not preserved that experience.

The initial review compared source and committed screenshots. After the owner
changed permissions, Chromium successfully ran outside the sandbox. Fresh access
to the deployed demo and workspace entry page was verified; this isolated browser
has no account session, so the production workspace displays its sign-in screen.
No authenticated production-project inspection is claimed.

Fresh local desktop/mobile workspace captures were produced with the existing
synthetic browser fixture at `/tmp/plotune-interface-review-20261016`. Explorer
desktop/mobile and the widget editor were visually inspected and reproduce the
reported drift. The browser fixture passed complete export, capture staging,
typed/shared Filters, saved widgets, key rotation, cursor expiry, owner settings,
webhooks and member access checks. Remote API requests were intercepted by the
fixture; this is frontend evidence, not a production backend test. Fresh public
page screenshots are `/tmp/plotune-demo-access.png` and
`/tmp/plotune-workspace-access.png`. Full accessibility and contrast checks remain
pending. The owner independently confirmed events arriving in production.

The findings table records the initial baseline and distinguishes confirmed
source differences from design judgments. The implementation and verification
record below describes the subsequent local corrections. No deployment has been
performed.

## Findings and correction criteria

| Step | Confirmed difference or issue | Intended correction and acceptance |
| --- | --- | --- |
| 1. Workspace navigation | Live renders each destination as its own navigation group. Demo groups Events/Dashboards, labels SETUP, and separates Project Settings. | Restore the demo hierarchy, spacing, active state and project selector treatment. Keep destinations discoverable on mobile and support keyboard opening, closing and focus return. |
| 2. Create a project | Live creation takes users to API setup; demo takes them into Events with a first-event walkthrough. | Restore a coherent create → save key → send event → see event journey. Show the real one-time key prominently and explain saving it before refresh. No simulated events or fake listening/connection status in the real workspace. |
| 3. Empty Events | Live uses a generic “No matching events” state with text directing users elsewhere. Demo embeds integration examples and a first-event explanation. | Separate first-use guidance from an empty filtered result, unavailable data and empty continuation pages. Offer a direct setup action or inline example. Never infer that a project has no events merely from one empty filtered page. |
| 4. Event controls | Live uses large labeled inputs, a second filter/export row, and a collapsed “Envelope IDs” section. Demo uses a compact toolbar with visible Device/Session controls. Live defaults/reset to one hour; demo uses 24 hours. | Restore the compact demo arrangement and 24-hour default unless deliberately changed. Use “Device” and “Session,” expose active values, and keep filter/export actions together. Preserve custom UTC bounds, manual entry when discovery is incomplete, and authoritative query semantics. |
| 5. Event rows | Live prints an ISO timestamp and `JSON.stringify(event.properties)` as a truncated link. Demo has time/date hierarchy, property previews, device/session context, overflow count and an inspect affordance. | Restore readable event rows using the same presentation as the demo. Preview a bounded number of values, make nested values understandable, handle empty properties, and retain a clearly labeled inspection action. Arbitrary JSON remains supported as data; users should not need to parse its serialization to scan the list. |
| 6. Event inspection | Live drawer shows complete JSON and a Copy JSON button. Demo separates timestamp, event name, Device ID and Session ID, offers contextual navigation, and then shows properties JSON. | Restore the structured inspector and “View device/session events” actions, with full JSON available for technical inspection/copy. Keep dedicated full-event loading/error handling; do not copy a partial query row as a complete event. |
| 7. New events and paging | Live correctly stages new events and exposes cursor pagination, but its notice and footer differ from the demo. | Match the demo's explicit new-event indication without moving rows during inspection. Preserve snapshot paging, sparse-page continuation, expired-cursor recovery and honest counts; never invent a project total from a page length. |
| 8. API setup | Demo has visible curl, Python, C/C++, Arduino/ESP32, MATLAB, ROS 2 and CAPL choices. Live has a dropdown with only curl, Python and JavaScript. Live payload also omits device/session examples. | Restore all seven planned integrations as visible choices with copy actions, prerequisites and a consistent hardware event. JavaScript may remain supplementary. Present endpoint and key clearly, keep rotation visually separate from routine copy/setup, and retain real one-time key behavior. |
| 9. MCP setup | Demo introduces read-only event history and a concrete engineering question before configuration. Live reuses the API key panel and a generic configuration explanation. | Restore purpose → example question → endpoint/configuration → connection status. State that Stream MCP reads event history. Keep actual initialization checks and client-specific configuration caveats. |
| 10. Dashboards | Live reuses Dashboard and graph components; this is closer to the reference. Its global heading still adds refresh/caching copy. | Preserve the existing chart/editor layout. Check collection/empty states, chart legends, missing-filter recovery and last-successful data during refresh errors. Use engineering examples tied to the capture payload rather than a separate invented schema. |
| 11. Widget editor | Shared editor uses datalist inputs for live discovery instead of the demo's selects. Manual paths are necessary because discovery can be sampled. | Keep suggestions discoverable and manual entry available. Review whether changing an event leaves an inappropriate property selected. Verify preview, long names, nested paths, counts and numeric types, deleted filters, conflict recovery and mobile footer visibility. Source differences alone do not prove all these interactions are broken. |
| 12. Webhooks | Configuration shares the demo component; live adds a delivery table with raw event IDs and timestamps. | Keep configuration familiar and show understandable delivery states, attempts and times. Review empty/loading/error distinctions and long endpoint/identifier layout. Keep credentials masked and role restrictions intact. |
| 13. Project settings | Live correctly says adding a colleague grants access without sending an email. Demo uses invitation wording. | Keep the live behavior honest while matching form spacing and member presentation. Retain owner/admin permissions, removal confirmation, pending edits and concurrent-change protection. Do not copy unsupported invitation promises from the demo. |
| 14. Usage and account | Live reads real daily/monthly allowances; demo has illustrative usage. | Preserve backend-derived allowances and show them when relevant. Do not copy demo totals, limits or retention promises. Verify loading, unavailable usage and long account names. |
| 15. Cross-screen copy | Every live page has shared-settings refresh prose/button. Explorer always displays browser export caps and CSV escaping details. | Keep the page heading focused on the user's task. Put secondary refresh behavior in a consistent secondary action and export details in the export flow. Keep actionable limitations visible at the relevant decision point. |

## UX priorities

These are design judgments grounded in the inspected layouts, not results from
user testing or measured accessibility conformance.

- **Recognition:** display Device/Session and integration choices rather than
  requiring users to discover “Envelope IDs” or remember supported languages.
- **Visual hierarchy:** make event content, the next setup action and primary
  buttons easy to find. In the saved mobile workspace capture, the controls and
  explanatory copy push the first event far down the screen.
- **Grouping:** restore navigation sections and keep related query actions
  together. Large gaps between control rows weaken their relationship.
- **Progressive disclosure:** summarize properties in rows and reveal full detail
  on inspection; explain export implementation limits in the export interaction.
- **Feedback and recovery:** distinguish waiting, loading, no matches, no access,
  stale/conflicting changes and service failure. Preserve drafts on failure.
- **Interaction:** verify real touch targets, focus visibility/order, Escape,
  focus return, screen-reader labels and horizontal overflow after rendering.
  Existing focus CSS and native dialogs are useful, but do not prove the entire
  journey is accessible.

## Hardware example contract

Use one recognizable fixture across setup, screenshots, filters, charts and MCP:

```json
{
  "event": "motor.sample",
  "device_id": "motor-003",
  "session_id": "test-run-817",
  "properties": { "temperature": 72.4, "rpm": 1840, "state": "running" }
}
```

This is an illustrative event, not a required schema. Capture snippets add the
project key and use the configured capture origin. Keep user-defined properties
and identifiers unrestricted under the actual API contract.

For each integration, review prerequisites, HTTPS certificate verification,
timeout/error behavior, escaping of inserted values and the actual capture
contract. Use placeholders when the original key is unavailable. Never substitute
an account token or suggest an existing raw key can be recovered.

The demo snippets are a starting point, not validated production examples. In
particular, Arduino's five-second loop and CAPL's one-second timer create recurring
traffic; they should not be presented as a harmless single-event quick start.
The ROS 2 example performs synchronous HTTP in a subscription callback; explain
its limitations or use an appropriate bounded sending pattern. Distinguish real
sensor/topic inputs from illustrative fixed RPM values. Do not claim compiled or
device-tested examples without running those checks in suitable environments.

The first setup action should send one event deliberately. Longer-running
sampling/bridging examples need an explicit cadence and stop behavior appropriate
to account allowances. Hardware integration must not imply that this cloud
workspace or Stream MCP controls hardware.

## Work sequence and review gate

1. Restore shell/navigation and event list/detail presentation together.
2. Restore hardware API setup and the real first-event journey.
3. Align filtering, new-event feedback, paging and export presentation.
4. Review dashboards/widgets, MCP, webhooks, settings and usage against the same
   visual language and engineering examples.

For every increment: compare the demo and live version of the same state; render
desktop and mobile with synthetic data; inspect screenshots; exercise keyboard
and touch-sized controls; check empty/loading/error states; run the relevant
existing behavior tests. Record what was actually observed. Browser rendering is
now available through the approved execution path; checks for future changes
still need to be performed rather than inferred from this baseline run.

The public demo remains the reference, with its simulated actions and marketing
wrapper confined to that route. Reuse presentation where practical to prevent
future drift while preserving live authentication, permissions, real queries,
one-time keys, pagination and concurrency handling.


## Implemented corrections and review evidence

The local workspace now restores grouped navigation, readable timestamp/date and
property-preview rows, device/session context, an inspect affordance and structured
full-event inspection. Device/session navigation uses the dedicated full event,
clears incompatible filters, and preserves a selected identifier when discovery
has not suggested it. Events default/reset to 24 hours. Query, export, snapshot,
permission and key handling still use the real client contracts.

The toolbar keeps device/session selection visible and puts filtering and export
in the same compact control area. The export menu contains only JSON, CSV and TSV choices, and exports preserve
the active Explorer filters; shared metadata refresh is a secondary link. Property text and helper text have
more readable sizing/contrast, and mobile actions use larger touch targets. These
changes do not constitute a full accessibility certification.

Project creation now opens Events with inline setup guidance and a one-time-key
reminder. It waits for real capture rather than offering a simulation or claiming
a connection is already listening. Filtered empty results, sparse continuation,
loading and failure keep their separate behavior. A project key in memory is the
condition for inline setup; this does not assert that all retained history is
empty. Refreshing the page still cannot recover an existing key.

API setup presents curl, Python, C/C++, Arduino/ESP32, MATLAB, ROS 2 and CAPL as
visible choices, with JavaScript supplementary. All examples include a project
key, `motor.sample`, Device/Session identifiers and recognizable engineering
properties. Each quick start sends deliberately once. ESP32 requires Wi-Fi and a
trusted root CA; ROS samples one topic message and sends outside the callback;
CAPL sends on a key press. Success copy uses the actual runtime's HTTP 201 capture
response rather than the previous synthetic fixture's incorrect 202 assumption.

MCP setup restores the event-history introduction, engineering question,
configuration and actual initialization check. Rotation is separated from the
routine endpoint/key controls. Widgets clear stale metric/breakdown selections
when changing their event; a transient chart refresh failure preserves the last
successful chart with an explicit notice. Webhook delivery loading and failure no
longer masquerade as an empty queue. Membership copy still describes granting
access without sending mail, and usage remains backend-derived.

### Screens inspected

Saved demo references: [desktop Events](stream-interface-qa/demo-events-desktop.png),
[mobile Events](stream-interface-qa/demo-events-mobile.png),
[API setup](stream-interface-qa/demo-api-desktop.png). Demo Events uses All time to
show its older fixed fixtures; the live workspace uses real query anchors.

All workspace captures use synthetic accounts, keys, identifiers and events.
They were rendered from the local production bundle, not an authenticated
production project. Reference captures use the demo in that same bundle with all
remote requests blocked. Compare the saved images alongside the source findings
above; the result preserves the demo's visual language while adapting real keys,
permissions, cursor pagination and service states.

| Journey | Desktop evidence | Mobile evidence |
| --- | --- | --- |
| Event browsing | [Events](stream-interface-qa/explorer-desktop.png) | [Events](stream-interface-qa/explorer-mobile.png) |
| Event inspection | [Inspector](stream-interface-qa/event-detail-desktop.png) | [Inspector](stream-interface-qa/event-detail-mobile.png) |
| Create/connect | [New project](stream-interface-qa/created-project-desktop.png) | [New project](stream-interface-qa/created-project-mobile.png), [captured event](stream-interface-qa/first-capture-mobile.png) |
| Hardware API setup | [API setup](stream-interface-qa/api-desktop.png) | [API setup](stream-interface-qa/api-mobile.png) |
| MCP setup | [MCP](stream-interface-qa/mcp-desktop.png) | [MCP](stream-interface-qa/mcp-mobile.png) |
| Dashboards | [Dashboard](stream-interface-qa/dashboard-desktop.png), [editor](stream-interface-qa/widget-editor-desktop.png) | [Dashboard](stream-interface-qa/dashboard-mobile.png), [editor](stream-interface-qa/widget-editor-mobile.png) |
| Webhooks | [Configured](stream-interface-qa/webhooks-desktop.png), [empty](stream-interface-qa/webhooks-empty-desktop.png), [failure](stream-interface-qa/webhooks-error-desktop.png) | [Webhooks](stream-interface-qa/webhooks-mobile.png) |
| Team settings | [Settings](stream-interface-qa/settings-desktop.png) | [Settings](stream-interface-qa/settings-mobile.png) |
| Usage | Existing account menu | [Actual contract fixture](stream-interface-qa/usage-mobile.png) |

### Verification and limits

- Repository tests: 282 tests in 52 suites passed, including new contextual
  navigation, inline setup, widget event changes and retained-chart assertions.
- Changed interface modules: ESLint reported zero errors and zero warnings.
- Production build: compilation, all 47 prerendered routes and agent-content
  checks passed on the final rebuilt bundle, including the helper-text/count
  refinements.
- Existing browser fixture, expanded in `scripts/stream/check-workspace.cjs`,
  passed against the production bundle. It covers complete 110-event export,
  capture staging, typed/shared Filters, independent widgets, authoritative
  definitions, key rotation/storage, cursor expiry, owner/member boundaries,
  example selection/copy, mobile layout/Escape/focus return, webhook failure and
  recovery, and create → one-time key → capture → visible event.
- Generated Python and ROS examples passed Python syntax checks; curl passed
  shell syntax checking; JavaScript passed Node syntax checking; C/C++ passed
  strict C and C++ syntax checks with libcurl headers. Generated Python and
  JavaScript were executed with mocked HTTP to verify the capture envelope and
  preservation of quoted/backslash/newline-containing manual keys.
- Arduino/ESP32, MATLAB, ROS middleware and CANoe/CAPL were not executed in their
  native runtimes or on hardware. Their prerequisites and illustrative readings
  are stated in the interface. No physical-device validation is claimed.
- Real deployed project inspection still requires an authenticated browser
  session. Local fixture success does not prove production capture durability or
  webhook delivery. No account credentials or production event data were used.

Example references reviewed: [ESP32 Wi-Fi API](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html),
[libcurl POST data](https://curl.se/libcurl/c/CURLOPT_POSTFIELDS.html). Existing
hardware examples in the frozen demo supplied the language/platform scope.


## Account dashboard and retired product entry points

`/dashboard` is the shared account landing page for Plotune's products. Ordinary
login opens it; a valid explicit Stream return link still opens that project or
workspace view after authentication. The dashboard offers Nexus setup, Stream
Workspace, Desktop downloads, Extensions and account management. It does not call
the retired account statistics API or display invented usage totals.

The main signed-in navigation exposes Dashboard and Stream workspace separately.
Research links back to Dashboard. Mirror and Storage remain unavailable and hidden
from navigation; their source files remain in the repository without route imports.
Their old URLs lead back to Dashboard. `/streams` and `/streams/connect` continue
to lead directly to Stream Workspace, with legacy query parameters discarded.

GitHub Pages output includes real static entry files for the old paths. Navigation
is performed client-side, not as server-side HTTP 301s. The old Streams page is
removed and the old stream-connection, Mirror and Storage implementations remain
outside the production bundle. The Stream landing page no longer advertises the
retired connection/management experience.

Verification is recorded by `scripts/stream/check-entry-routes.cjs`: it checks
ordinary login → account Dashboard, explicit Stream login → requested workspace
view, account/product navigation, desktop/mobile layouts, both slash forms, and
absence of retired API calls. All API responses use isolated synthetic fixtures.
No production account or customer data is used. The repository's 282 tests pass.
The production build passed all 47 prerenders and agent-content checks. The final
browser run passed all 40 account/product entry cases plus both login flows on
desktop and mobile. Dashboard screenshots were visually inspected at
`/tmp/plotune-account-dashboard-production`. Changes remain local until the owner
deploys them.
