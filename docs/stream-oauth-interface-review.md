# Stream OAuth interface review

User task: identify the requesting application, review its read permissions, select one Stream project, and approve or deny access.

Reviewed `/stream/authorize` in the actual site shell using local Chromium screenshots at 1440 × 1000, 768 × 1024, 390 × 844, and 320 × 740. External services were intercepted with synthetic sessions, projects, and consent requests. Changes were explicitly requested, including applying Laws of UX.

## Findings and fixes

| Severity | Principle | Before evidence and impact | Fix |
| --- | --- | --- | --- |
| High | Cognitive load / recognition; text contrast | Consent screenshots show white heading, application name, and selected project on pale surfaces. Users cannot reliably identify what they are approving. Faint helper text also obscures access boundaries. | Use solid ink and muted colors on paper, readable helper sizes, and a clearly bordered project selector. Measured consent text contrast is at least 5.31:1 for the checked elements. |
| Medium | Gestalt grouping / hierarchy | Mobile consent screenshot shows the fixed navigation covering the top of the panel and lock icon. The standalone full-height card does not account for the site header. | Reserve header clearance and use the site's ruled introduction, paper palette, typography, and buttons. Group application identity, permissions, project selection, and decision into labeled sections. |
| Medium | Fitts's Law | Redirect disclosure is a small, 12px text line, making requester verification harder to target. | Give the native keyboard-operable disclosure a 44px target and a visible expansion indicator. Keep full redirect and application ID available on demand. |
| Low | Hick's Law / Von Restorff effect | Mobile approve and deny actions occupy narrow equal columns, with approval wrapping onto two lines. | Stack full-width controls on mobile, use one filled primary action and a bordered denial action, and retain explicit labels. |

## Verification

- Saved 4 before and 32 after screenshots under `docs/redesign/evidence/stream-oauth/`. This evidence directory follows the repository's existing ignore rules.
- After states: consent, expanded redirect details, keyboard focus, long unbroken application names and redirect hosts, no projects, network failure, expired request, and loading, at all four viewport sizes.
- Visually inspected desktop, tablet, both mobile sizes, mobile error, and long-identifier screenshots.
- Automated checks passed for horizontal overflow, browser exceptions, minimum 44px controls, consent text contrast, keyboard disclosure and focus order, project selection, and approve/deny payloads with a local callback.
- Existing `src/pages/StreamAuthorize.test.jsx`: all four tests passed.
- `git diff --check` passed. Development compilation succeeded with existing dependency source-map warnings.

To repeat against a local development server on port 3000:

```sh
BROWSER=none HOST=127.0.0.1 PORT=3000 npm start
node scripts/stream-oauth-qa.cjs after
```

The review covers rendered UI and local consent fixtures. It does not verify a live external client's OAuth exchange or constitute a user study.
