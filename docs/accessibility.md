# Accessibility checks

Every change that touches pages, styles or shared components is checked with axe-core in a real
browser before it is merged. The same check runs in CI on every pull request.

## Run it

```bash
npm run build        # or: npx craco build   (the scan does not need the prerender step)
npm run a11y
```

`scripts/a11y-scan.cjs` serves `./build`, opens every route from `public/sitemap.xml` plus the extra
routes listed in the script, at a desktop (1440 px) and a phone (390 px) viewport, and runs axe with
the WCAG 2 A, WCAG 2 AA, WCAG 2.1 AA and best-practice rule sets. It exits non-zero on any violation.

Useful options: `--routes=/nexus,/bridge` to scan a few routes, `--desktop-only`, `--json=findings.json`.

## Rules of the repo

1. **Before merge:** the `Accessibility` check must pass. Enable it as a required status check in the
   branch protection settings for `master` so a failing scan blocks the merge.
2. **Before pushing a large UI change:** run `npm run a11y` locally. It takes a few minutes.
3. **Colour:** text needs 4.5:1 against its ground (3:1 for large text). The colour tokens live in
   `src/index.css` and `src/linear.css`; `src/linear.contrast.test.js` guards them.
4. **Allow-list:** a finding that cannot be fixed yet goes into `scripts/a11y-allowlist.json` with a
   `rule`, optionally a `route` and a `target` substring, and a `reason`. Keep it empty when you can.
5. **Not covered by the scan:** screens behind a sign-in are scanned signed out, and external redirects
   (`/blog`, `/community`, `/tutorials`) are skipped. Check those by hand when you change them.

## Patterns that came out of the first full scan

- Give every page one `<main>`. Pages that do not render their own get one in `src/App.js` (`Main`).
- Do not skip heading levels. When a component's visual tag must stay (`h3` under the page `h1`), set
  `aria-level` to the real level.
- Scrollable code and tables take `tabIndex={0}`. Icon-only buttons and selects get a name.
- Callout `aside` elements inside the page use `role="note"`; real sidebars stay `aside`.
- Links inside running text are underlined; do not rely on colour alone.
