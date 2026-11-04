## What changed

<!-- What and why, in a few lines. -->

## Checks before merge

- [ ] `npm test` passes
- [ ] `npm run build` passes (includes prerender and the agent-content check)
- [ ] `npm run a11y` passes: axe scan of every public route, desktop and phone (see `docs/accessibility.md`)
- [ ] Changed or new pages were looked at on a 390 px viewport (no horizontal scroll)
- [ ] New text colours meet 4.5:1 (3:1 for large text) on the ground they sit on; any `scripts/a11y-allowlist.json` entry carries a reason

## Not covered

<!-- Routes, states or devices you did not check. -->
