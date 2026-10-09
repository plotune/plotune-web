# Visual self-review (second pass)

Date: 2026-10-10. Branch `redesign/engineering-experience`. This pass resumed an interrupted session and re-checked every route by opening rendered screenshots, not by DOM checks alone. Per-route status is in [coverage.md](coverage.md).

## Method

1. Production build (`npm run build`, including prerender) served locally; all external requests intercepted by `scripts/redesign/browser.cjs` fixtures.
2. 107 routes × 3 viewports (390×844, 768×1024, 1440×900) captured full-page.
3. Screenshots were split into readable segments (`scripts/redesign/coverage.py` lists them; triptych and crop helpers were used) and opened one by one.
4. A first-pass sweep by delegated reviewers (Haiku) covered routes in parallel. Every finding was re-checked against a fresh image before being fixed; several findings came from captures taken before fixes and were confirmed resolved rather than re-fixed.
5. Each fix was re-rendered against the dev server (`scripts/redesign/quick.cjs`) and the new image opened before moving on. A final full recapture was taken after all fixes.

## What was wrong and what changed

Shared system

- Leftover Tailwind blue/indigo/purple classes on account and workspace screens mapped onto the teal/violet palette in `tailwind.config.js`; light 200–400 status shades darkened for AA contrast on paper.
- Letter-spaced, centred sans "kicker" labels (a generic SaaS hero pattern) now use the mono technical-label voice site-wide.
- New shared `page-intro` (ruled index + left-aligned title) used by FAQ, Extensions, Download, Careers, Docs, Legal, Privacy, Partners and Partner application, replacing centred grey hero bands.
- Mobile footer is two link columns instead of one long stack.

Pages rebuilt after inspection

- FAQ: topic index + ruled accordion. Extensions: ruled engineering catalog instead of a truncated 4-column card grid with avatar placeholders. Download: platform switch + package rows with code-first install steps; fixed "Invalid Date" and a contradictory "Snap only" answer; removed the Lite/Pro upgrade question (no pricing on the site).
- About mission: traffic-light window card and icon value cards replaced by ruled principles. Careers: removed invisible icon button and centred kicker. Partners: editorial programs/benefits; hero no longer flush against the header. Partner application: back link was hidden under the fixed header.
- Legal/Privacy: unboxed reading column with ruled section index; Legal plan cards were crushed at tablet width.
- Docs (`?page=`): flattening layer over legacy per-page card markup fixed whole-page horizontal overflow on several pages, justified bullet spacing, stray accent bars, dark low-contrast tiles; sub-navigation now wraps on its own row. Nexus docs: removed double top padding and grey band, serif section headings unified to sans, ruled index.
- Dashboard/Profile/DNS: removed a dead "Upgrade Now" premium panel (it only showed "not available"), an illegible dark FREE badge and a DNS "Upgrade to Plus" plan upsell; emoji navigation icons replaced by line icons.
- Embeddings: tablet hero card overflowed the viewport; window-chrome dots and emoji icons removed; chart text in the two plot SVGs recoloured from dark-theme light grey to ink.
- Research: protocol strip overflowed on phones (now a numbered list); reports filters misaligned; ranked bar labels and values truncated; highlight cards crushed into two columns; methodology metric rows cramped; a chart legend overlapped bars; remaining blue accents replaced; article paragraphs had no spacing; article CTA crowded on phones.
- Workspaces: copy button overlapped the code sample on mobile; project selector was an unstyled box running past the gutter; wide tables gained a right-edge fade on phones; chart "Limit" label collided with the peak marker.
- Streams: loading-spinner-like empty-state icon replaced; "New Stream" no longer wraps.

## Coherence across products

Nexus, Stream and Research share tokens (paper, ink, teal, mono labels, ruled sections) but keep distinct voices: Nexus uses hardware plates and architecture paths; Stream uses dense application chrome with demo status labels; Research keeps a serif editorial voice with data charts. Workspace and research palettes for data series remain multi-colour because they encode categories.

## Known remaining items

- Route 88 (Robot Validation events) still shows zero rows under the default "Last 24 hours" filter: a pre-existing demo-clock limitation, unchanged.
- Partner portal remains a labelled prototype with illustrative content; its plan-tier wording ("Enterprise Partner Tier") was left as product copy for the owner to decide.
- Legal "Subscription Plans" section names editions without prices; it is legal text and was not rewritten.
- Third-party embeds (YouTube, Google Form) render blank under fixtures.
