# Webhook delivery UX correction

Review date: 2026-10-19. User task: create a webhook or rotate its signing
secret, save the one-time value at the intended receiver, and understand delivery
outcomes. Scope: the live Webhooks view in PR #15, not adjacent workspace screens.

Applied the repository's [Laws of UX skill](../.agents/skills/laws-of-ux/SKILL.md),
its evidence checks, and the established
[Stream interface patterns](stream-oauth-interface-review.md). The owner explicitly
requested correction of the implementation. Findings below group observed root
causes; they are not a claim of product-wide UX compliance or a user study.

## Findings and fixes

| Severity | Law / principle | Before evidence, state and user impact | Implemented correction |
| --- | --- | --- | --- |
| High | Cognitive load / Gestalt grouping | The one-time panel followed the entire webhook list and identified neither the event nor destination. A user managing multiple receivers had to remember which hook produced the value. | Put the save task before the list, retain the event and receiver context from the response, and focus/scroll to its heading. Long URLs retain a visible host and disclose the full path without pushing the save action down. |
| High | Goal completion / keyboard focus | Browser evidence recorded `body` as the focused element after rotation at all four widths. Dismissal removed the panel without returning focus. Another creation/rotation could replace unfinished one-time work. | Focus the next task after the editor closes, restore the current trigger after dismissal, block additional mutations while a secret awaits saving, and retain confirmed secrets through failed verification and same-project view changes. Project/session and authorization boundaries still clear them. |
| Medium | Hick's Law / Von Restorff effect | Reveal, Copy and Done had equal button weight, alongside raw verification instructions. Copy was difficult to identify as the next step. | Use one primary Copy action with Copied feedback, a labeled reveal icon and secondary completion action. Keep verification instructions in a native disclosure. Clipboard failure explains manual recovery. |
| Medium | Jakob's Law / Doherty feedback | Every configured row prominently offered rotation, followed by a browser confirmation outside the workspace. Rotation had no local pending state; verification failure could obscure a successful one-time response. | Use a contextual native disclosure with overlap consequences, Cancel/Escape and a disabled Creating secret action. Conflicts stay beside the action. A confirmed response advances to saving even when subsequent refresh fails, with one shared refresh error. |
| Medium | Fitts's Law / readable, truthful state | The original live authentication label measured 10px in `#74878b`; delivery rows showed raw states and a future next-at time even for a terminal delivery. Narrow views required precision and interpretation. | Use readable scoped labels and 44px signing controls, enable/delete targets. Put delivery outcomes first, translate deferrals, show next attempt only for pending deliveries, and make the horizontally scrolling report keyboard focusable. Distinguish loading, no reports, failed refresh and retained reports. |

## Verification

- Local production-preview fixture at 1440 × 1000, 768 × 1024,
  390 × 844 and 320 × 740. All nonlocal browser requests are intercepted.
- `scripts/stream/webhook-ux-qa.cjs` exercises keyboard disclosure and Escape,
  conflict recovery, immediate progress, one-time secret focus and context,
  clipboard/reveal, post-write verification failure, explicit refresh, trigger
  restoration, signing setup, creation, long destination disclosure and
  same-project navigation. It checks no horizontal page overflow, at least 44px
  save-panel controls, unclipped horizontal targets, helper text size/contrast,
  terminal retry display and absence of the secret from browser storage.
- `scripts/stream/check-workspace.cjs` covers the existing Explorer, complete
  export, shared filters, dashboards, owner/member boundaries, project creation,
  setup views and webhook integration. Its usage fixture follows the credits
  response already merged on `master`; credits behavior is outside this change.
- Component tests additionally cover clipboard denial and a confirmed signing
  response followed by failed metadata verification.

Before and after captures are kept locally under
`docs/redesign/evidence/webhook-delivery/` (the existing ignored evidence area).
Selected review screenshots are committed in
[webhook-delivery-qa](webhook-delivery-qa/):
[desktop save](webhook-delivery-qa/webhook-signing-desktop.png),
[mobile save](webhook-delivery-qa/webhook-signing-mobile.png),
[tablet list](webhook-delivery-qa/webhook-list-tablet.png),
[320px save](webhook-delivery-qa/webhook-secret-narrow.png), and
[mobile conflict](webhook-delivery-qa/webhook-conflict-mobile.png).
These five were opened for visual inspection, along with the before save state,
the after save viewports, and the collapsed/expanded long-destination states.
Detailed command results and limitations
are recorded in [webhook-delivery.md](webhook-delivery.md).

The delivery table intentionally scrolls horizontally on narrow screens, using
the existing workspace pattern. This review does not verify live receiver setup,
Cloudflare egress, screen-reader announcements across assistive technologies, or
real users' task completion. No deployment was performed.
