# Signed webhook delivery controls

Frontend companion to plotune-cloud PR #85, scoped to webhook delivery. The live
Webhooks screen now handles one-time signing secrets from webhook creation and
rotation. The save task identifies the event and destination, receives focus,
prioritizes clipboard copy and acknowledges completion. Show/hide and full long
URLs remain accessible; verification details are disclosed on demand. Existing
hooks offer Set up signing; configured hooks disclose contextual rotation with
Cancel/Escape, pending feedback and the prior key's 24-hour expiry. Values stay in React memory, outside cached
resource data, and clear on project/session change or authorization failure.

A successful one-time response is retained even if post-write metadata verification
fails. Further mutations wait until the current secret has been saved/dismissed;
same-project view changes retain it, while a page reload does not. Lost responses
require a new rotation: there is no reveal endpoint. Rotation
uses `POST /v1/projects/:project/webhooks/:hook/signing-key {revision}` and existing
conflict handling. Backend responses expose `signingSecret` once and only
`data.signingConfigured` on later reads. Deploy the reviewed backend before this UI.

Delivery reports put readable outcomes first, show receiver status, relay
unavailability/daily-budget deferral and explicitly selected direct egress. Only
pending deliveries show a next attempt. Loading, empty and failed-refresh states
remain distinct, with a focusable scrolling table on narrow screens.
Existing member permissions, shared refresh,
other workspace views, public demo behavior and marketing page remain intact.
No credits, MCP management tools, billing, new navigation or deployment is included.

Validation on 2026-10-19: 324 tests / 61 suites pass; affected-component ESLint has
zero errors/warnings; full production build passes with 47/47 prerenders and 44
public-content checks. Synthetic desktop/mobile browser integration passes,
including creation, one-time secret storage exclusion, rotation, retaining the new
secret across a simulated verification outage, explicit refresh and existing
Explorer/export/dashboard/member/project flows. Every external browser request is
intercepted. The QA script's stale MCP heading selector was updated to the already
merged setup heading; no MCP UI change was made here. The current fixture also
follows the credits response already merged on master. A separate
`scripts/stream/webhook-ux-qa.cjs` pass checks signing setup, creation, conflicts,
failed refresh, copy, keyboard/focus restoration and long URLs at 1440, 768, 390
and 320px. See the [evidence-backed UX review](webhook-delivery-ux-review.md).

Screenshots: [desktop](webhook-delivery-qa/webhook-signing-desktop.png),
[mobile](webhook-delivery-qa/webhook-signing-mobile.png). No production data, accounts,
webhooks or deployment were touched. Actual relay/signature delivery is tested in
the cloud PR's real Worker/runtime contract; Cloudflare egress and billed costs
still require owner-approved staging.
