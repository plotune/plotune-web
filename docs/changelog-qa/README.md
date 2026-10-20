# Weekly change selection and interface review

This edition was rebuilt from the completed week **12–18 October 2026**, before
selecting demonstrations. All three repositories were reviewed: eight Nexus,
eight Cloud and four Web merged PRs (20 total). Fifteen changes are grouped into
ten public technical items; five are omitted. Raw provenance and the complete
per-PR include/omit ledger remain private, ignored scratch data during generation.

| Product | Public selection | Media decision |
| --- | --- | --- |
| Nexus | Managed agents and runtime reliability; actionable connection errors; note/conversation formatting; OAuth renewal; complete updates and recovery | Text: describe changed behavior, trust and compatibility precisely. No unrelated footage. |
| Cloud | Compatible complete-release negotiation for old and new Nexus updaters | Text: publishing order and transport compatibility are clearer without a staged UI. |
| Stream | Authenticated workspace and shared resources; account MCP context; OAuth consent; bounded aggregation/jobs | One recording: actual shared selection and complete export in the real local workspace. Other changes stay text. |

Omissions: rental/purchase flow, minor brand-translation polish, two planning-only
changes and internal artifact-verification diagnostics. Companion PRs and runtime
follow-up fixes are combined rather than presented as separate announcements.

The title is **Plotune updates — 12–18 October 2026**. Each product section says
**Merged this week**: merged code is not evidence of deployment. No production
activation, measured billing savings or shipped release version is invented.

## Recording provenance and safeguards

The recording runs `npm start` from the selected workspace merge in an isolated
clean worktree at public Web merge `fd51b54`, at **/stream/workspace**. It never uses /stream/demo. A new browser
receives synthetic token inputs and API fixtures; all other external requests are
intercepted. The local auth cookie, raw video and receipts are never committed.
Product auth code is unchanged. Historical source excludes post-week features.

The scenario selects Real System, exports JSON and asserts **24 matching events**
in the actual browser download, all with environment=real, versus **20 displayed
rows**. Its poster and encoded frames pass text scanning. The edition identifies
local synthetic inputs in prose, with no decorative badges or caption overlays.
Scanning cannot certify confidentiality; owner review of complete footage remains
required before merge. Nothing was deployed.

## Verification

The release-note page was checked in Chromium at 1440×1000, 768×1024,
390×844 and 320×740. Checks cover all three product sections and ten technical
items, contents anchors, latest/dated/unknown routes, inline lazy media, real
autoplay and offscreen pause, reduced-motion manual playback, keyboard-accessible
written steps and horizontal overflow. Desktop/mobile screenshots, the poster
and sampled action/result frames were inspected. Complete-clip editorial review
remains an owner step before publication.
