# Signed webhook delivery controls

Frontend companion to plotune-cloud PR #85, scoped to webhook delivery. The live
Webhooks screen now handles one-time signing secrets from webhook creation and
rotation, with show/hide, clipboard copy, explicit dismissal and the prior key's
24-hour expiry. Existing hooks offer Set up signing; configured hooks offer Rotate
signing secret with confirmation. Values stay in React memory, outside cached
resource data, and clear on project/session change or authorization failure.

A successful one-time response is retained even if post-write metadata verification
fails. Lost responses require a new rotation: there is no reveal endpoint. Rotation
uses `POST /v1/projects/:project/webhooks/:hook/signing-key {revision}` and existing
conflict handling. Backend responses expose `signingSecret` once and only
`data.signingConfigured` on later reads. Deploy the reviewed backend before this UI.

Delivery reports show receiver status, relay unavailability/daily-budget deferral
and explicitly selected direct egress. Existing member permissions, shared refresh,
other workspace views, public demo behavior and marketing page remain intact.
No credits, MCP management tools, billing, new navigation or deployment is included.

Validation on 2026-10-19: 312 tests / 58 suites pass; affected-component ESLint has
zero errors/warnings; full production build passes with 47/47 prerenders and 44
public-content checks. Synthetic desktop/mobile browser integration passes,
including creation, one-time secret storage exclusion, rotation, retaining the new
secret across a simulated verification outage, explicit refresh and existing
Explorer/export/dashboard/member/project flows. Every external browser request is
intercepted. The QA script's stale MCP heading selector was updated to the already
merged setup heading; no MCP UI change was made here.

Screenshots: [desktop](webhook-delivery-qa/webhook-signing-desktop.png),
[mobile](webhook-delivery-qa/webhook-signing-mobile.png). No production data, accounts,
webhooks or deployment were touched. Actual relay/signature delivery is tested in
the cloud PR's real Worker/runtime contract; Cloudflare egress and billed costs
still require owner-approved staging.
