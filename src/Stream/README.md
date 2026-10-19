# Plotune Stream workspace

`/stream/demo` renders the frozen demo workspace (`DemoWorkspace.jsx`): a simulated engineering-event experience. Its early-access wrapper, sample data and existing analytics remain separate from the real workspace. Shared demo filters/dashboards use the existing frontend prototype storage. Demo keys, capture and MCP checks are illustrative.

`/stream/workspace` is the authenticated backend integration in `workspace/`, targeting the finalized Redis/R2 event contracts from plotune-cloud PR #44. It uses real project-scoped metadata, query/discovery/cursors, shared Saved Filter IDs, widget data, browser exports, member/key management and webhook status. It does not use the demo's authoritative local resource storage or simulated events. Shared metadata snapshots are cached for up to 15 minutes between loads, with a fresh project permission check before displaying cached definitions and an explicit refresh action. Roles, member lists, keys and webhook credentials remain uncached. See the implementation notes for request counts and security invalidation.

Default builds show an activation gate for the real route. Enable only for approved local/staging checks with `REACT_APP_STREAM_WORKSPACE_ENABLED=true`; production activation requires owner approval of the backend deployment, affordability and acceptance checks. No deployment is part of this PR.

The independent future-product prototype remains at `/stream/prototypes/vision`; public `/stream` marketing remains unchanged.

See [implementation, verification and owner activation notes](../../docs/stream-workspace-implementation.md) and [the original integration brief](../../docs/stream-workspace-integration-brief.md).
