# Stream workspace backend integration

## Summary

Deliver the frontend integration for the real authenticated Plotune Stream workspace, targeting master. This PR owns the web side of [plotune-cloud PR #44](https://github.com/plotune/plotune-cloud/pull/44) once its backend contracts are finalized.

## Dependency and implementation approach

Inspect PR #44's final reviewed implementation, API contracts, auth, browser adapters and deployment readiness before finalizing integration. Earlier D1-event contracts have been superseded by Redis-buffer + R2-history; do not implement against stale PR descriptions or historical READMEs. Planning, repository inspection and isolated frontend preparation may start now; final wiring and acceptance depend on the finalized backend.

Use the frozen src/Stream experience and [web PR #4](https://github.com/plotune/plotune-web/pull/4) as the product reference. Preserve the public /stream/demo, its simulations, early-access wrapper, marketing pages and existing analytics behavior. Replace the reserved /stream/workspace redirect with the real authenticated experience when integration is ready. Do not redesign or expand into the richer future-product prototype.

## Intended experience

Connect project creation/selection, settings, membership, project keys, usage, Saved Filters, Dashboards/widgets, Webhooks, API setup and MCP setup to their final backend behavior. Real workspace state persists across refresh and users where the backend defines shared state.

Connect Explorer filtering, discovery, event inspection, cursor paging and complete export. Respect snapshots, sparse pages, expired cursors, changed/missing Saved Filters and errors; never present partial export as complete.

Show newly captured Redis-backed events without waiting for R2 flush. Preserve the explicit new-event indication rather than moving the list while users inspect it. Use the finalized realtime contract; do not add a WebSocket redesign to this scope.

Provide clear loading, empty, authorization, quota, unavailable/retry and retention states. Derive limits from backend responses rather than hardcoding provisional commercial allowances. Project keys are returned once by the backend: adapt the real-workspace copy/regeneration experience without promising recovery of an existing raw key.

## Design and validation

Keep interaction and visual design faithful to the frozen experience. Introduce only the changes necessary for real data, authentication and honest service states. Choose code structure after inspecting current components; this brief is outcome guidance, not a rigid file plan.

Always render and inspect UI updates on desktop and mobile, respect the Laws of UX, and verify navigation, keyboard/focus behavior, responsive layouts and URL query state. Test with synthetic fixtures and approved staging; never submit real customer data or production analytics/leads as tests.

## Acceptance

Deliver the complete web integration in this PR using PR #44's final contracts. Validate end-to-end capture-to-visible-event behavior, shared persistence, key rotation, filters/widgets, webhook status, realtime indications and full exports across Redis/R2 transitions and relevant errors.

Pass repository tests/build and visual checks. Document backend activation prerequisites and remaining owner deployment steps. Do not merge, publish or silently activate an unavailable backend.

This draft initially contains the integration brief only; frontend implementation and validation remain pending.
