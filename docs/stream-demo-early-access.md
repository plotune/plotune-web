# Stream demo early access

`/stream` remains the public product landing page. `/stream/demo` composes the unchanged `StreamMVP` inside `StreamDemoWrapper`. `/stream/workspace` is reserved for the eventual real workspace: its temporary React `Navigate replace` compatibility route forwards existing query parameters and hashes to `/stream/demo`. There is no permanent HTTP redirect. Replace this one route when the real workspace ships.

## Invitation and frozen UX

The wrapper captures an explicit demo button/link click, then waits for a new React Router location key in a layout effect. A top-level workspace navigation action counts even if its destination is already selected: Events pushes a fresh history entry with the same URL. Other clicks count only if the committed route changes `view` or `dashboard`. Initial/deep-link rendering, project creation/selection and event filtering do not count. The dialog appears over the committed destination, without a timer or onboarding changes.

Dismissal through X, Not now or Escape is equivalent. A separate floating mail button reopens it. Native `dialog.showModal()` provides modal semantics, keyboard containment and an inert background. The wrapper focuses the email field, restores focus (including the mobile menu or replacement floating opener), and temporarily prevents background scrolling. CSS targets only wrapper overlay classes. A `:has(.sw-toast)` selector moves our floating opener and success feedback above the existing demo notification without changing that notification. No frozen component, data, typography, styling or simulation is edited; every feature remains usable without a lead.

Local storage key `plotune_stream_early_access_v1` holds only `invited`, `dismissed` or `submitted`. `invited` also prevents duplicate automatic presentations after a refresh; the floating opener remains available. `submitted` suppresses both invitation and opener. A storage listener synchronizes other open tabs. Blocked storage falls back to in-memory state, so persistence across refresh cannot be guaranteed when the browser disallows storage. Email and submission IDs are never written to browser storage. Retry IDs and input are held only in component memory.

## Contact contract

The existing `buildContactPayload` and `postLead` in `src/utils/leadSubmission.js` are reused unchanged. This sends JSON as `text/plain;charset=utf-8` to `REACT_APP_AI_READINESS_ENDPOINT`, with the existing abort timeout and success check: HTTP success **and** JSON `{ "ok": true }`. An unconfigured build explicitly says nothing was sent.

The visitor supplies only email. Automatically supplied fields are `kind: contact`, `topic: Plotune Stream Early Access`, a descriptive message, page, captured attribution, timestamp, retry-stable submission ID, and the existing `website` honeypot. The inspected Apps Script contact contract requires email and message, not a name; no placeholder identity is needed. It files these submissions in the existing Contact sheet and sends the existing owner notification with the recognizable topic in its subject. Normal Contact page behavior and server-side validation, size limits, rate limits, honeypot and deduplication are unchanged. No endpoint or database is added.

The existing attribution utility retains advertising arrival parameters even when frozen demo navigation replaces the search string. Personal data travels only through the existing contact transport. The email input disables PostHog autocapture; dedicated event properties contain no email or message.

## Analytics

Existing pageviews continue to track demo visits. No `stream_demo_opened` event exists.

| PostHog event | Trigger |
| --- | --- |
| `stream_early_access_shown` | First automatic presentation after a meaningful navigation |
| `stream_early_access_dismissed` | Explicit X, Not now or Escape dismissal |
| `stream_early_access_reopened` | Manual floating-opener click |
| `stream_early_access_submitted` | Existing contact backend confirms success |

Properties identify `source: stream_demo` and the current `view`. Submitted also records whether the configured Google Ads helper emitted its conversion. Refs guard overlapping actions/submissions; effects consume navigation intent once, including Strict Mode. Failures, retries before success, rerenders, refresh and route changes do not emit successful conversions. The same retry ID supports existing backend deduplication.

## Activate the independent Google Ads conversion

The existing Google tag in `public/index.html` and shared conversion utility are reused. Contact and AI Readiness conversion actions remain separate. Stream has **no default conversion destination**.

1. Create a dedicated Google Ads website conversion action for **Plotune Stream Early Access**. Choose lead counting (one); configure its value/primary status according to campaign reporting needs.
2. Obtain that action's Google tag `send_to` value (`AW-<conversion ID>/<conversion label>`). If it belongs to a different Ads account, configure that account's Google tag too.
3. Set `REACT_APP_GOOGLE_ADS_STREAM_EARLY_ACCESS_SEND_TO` to that exact value at **build time**, then rebuild and publish. Do not use the ordinary Contact or AI Readiness label. It is a public tag configuration, not a secret.
4. Verify the successful-submit action with Tag Assistant and Google Ads diagnostics. The helper emits `gtag('event', 'conversion', {send_to, transport_type: 'beacon', transaction_id: submissionId})` only after backend success. It independently deduplicates within the browser session; persisted submitted state prevents refresh re-emission.
5. Use this direct Google tag action as the single implementation for this conversion. Do not also configure a GTM submit trigger or import the same PostHog/GA event as an additional primary conversion. Ordinary Contact submissions should not qualify for the Stream action.

No Google Ads ID/label was invented, no external Ads action was created, and no email is sent to Ads. Until configured, backend lead capture and PostHog reporting work; the Ads helper is a safe no-op.

## Verification

Run `CI=true npm test -- --watchAll=false --runInBand`, `npm run build`, then `node scripts/stream-demo-qa.cjs`. The QA script uses the production bundle at localhost, intercepts all remote traffic, and simulates both success and failure. It never sends test leads or analytics to production. Screenshots and browser assertion results are written to ignored `docs/redesign/evidence/stream-early-access/`.

Tests cover initial/direct-query loads, selected Events and destination navigation, ignored onboarding/filtering, all dismissal actions, later feature access, reopening, persistence, Contact payload and retry ID, validation/unconfigured transport, failure input preservation, confirmed success, event privacy/deduplication, overlapping submissions, separate Google Ads configuration and legacy query/hash preservation. Routing checks also verify public CTA and static deep-link shim updates.

Desktop (1440×900) and mobile (390×844) QA includes landing CTA, initial view, project creation, Events/Dashboards invitations, dismissed floating opener, reopening, failure, success, refresh, Escape, keyboard focus and continued access to all six demo sections. Final results and inspected screenshots are recorded in the PR. `src/StreamMVP` and `src/StreamWorkspace` must remain byte-identical to the base branch.

### Completed local QA

- Node 24.19.0; `npm ci` completed.
- Full Jest suite: 36 suites / 174 tests passed.
- Production build includes all 46 prerendered routes and 43 verified public agent sources.
- 16 desktop/mobile screenshots were captured and opened for visual inspection, with zero page errors or horizontal overflows. The final run asserts that the floating opener and success feedback are unobscured.
- Visual fixes were limited to the wrapper: explicit initial email focus, sensible restored focus, and separation from the frozen demo toast. Landing layout, onboarding, view context and frozen workspace styling remain intact.
- Representative evidence is committed in `docs/stream-demo-early-access/`. The complete local capture set is reproducible with the QA script.

Browser tooling note: the standard Playwright browser artifact download failed in this environment. A locally installed Chromium 138 binary was used with Playwright, and the environment proxy was configured locally for the build's existing public GitHub release fetch. No browser workaround or proxy setting is included in application code or deployment configuration.
