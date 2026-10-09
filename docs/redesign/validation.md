# Validation

Run on 2026-10-10 against the final production build of `redesign/engineering-experience` (local, fixture-only; no live analytics, lead or backend writes).

| Check | Command | Result |
|---|---|---|
| Unit tests | `CI=true npx craco test --watchAll=false` | 34 suites, 156 tests passed (includes new `VerifyEmail.test.jsx`) |
| Production build + prerender + agent-content verification | `npm run build` | passed; 46/46 routes prerendered; 43 public sources verified |
| Route capture, 3 viewports | `node scripts/redesign/browser.cjs final3` (per device via `QA_DEVICE`) | 321/321 captured; 0 capture errors, 0 page errors, 0 horizontal overflow |
| Visual inspection | see [coverage.md](coverage.md), [visual-review.md](visual-review.md) | 321/321 images opened and reviewed |
| Analytics and funnels | `node scripts/redesign/analytics.cjs` | cta_impression, scroll_depth, nexus_assessment_clicked, both Nexus impression IDs, UTM/funnel propagation: all pass |
| Interactions | `node scripts/redesign/interactions.cjs` | 21/21 |
| Account states | `node scripts/redesign/account-interactions.cjs` | 12/12 |
| Auth flows (register → check email, verify, reset, login) | `node scripts/redesign/auth-success.cjs` | 12/12 |

Not verified: production OAuth, email delivery, lead delivery, live WebSockets, third-party embeds, real hardware. No deploy was run.
