# Discovery and design direction

Baseline: origin/master, commit 892d1fcea439a0c89283c6e44a38e3d6943fb11c. No applicable AGENTS.md found. Dedicated branch: redesign/engineering-experience.

## Architecture

React 18 / React Router 7 / CRACO, Tailwind 3 utilities, route lazy loading, MDX via webpack, Plotly research charts, Framer Motion in older marketing components. AuthContext uses a cookie and API profile cache. Axios services target api.plotune.net and stream.plotune.net; live streams use WebSockets. Account functions include profile, tokens, S3 upload/download/delete, stream/network access, package mirroring. Research has its own layout, article registry, benchmark data, methodology, plots and RSS. Nexus MDX documentation is separate from legacy query-param documentation.

Stream MVP and vision are independent local demos. MVP has event filters, dashboards, webhooks, API/MCP example setup and settings. Vision includes synthetic runs, signals, sources, processors and investigations. Existing legacy Stream management/live connection routes remain separate. Public static Claude and Codex use cases have their own terminal runtimes.

## Preservation

See conversions.md for source-level CTA, redirect, endpoint and instrumentation inventory; routes.json includes static/dynamic URLs, documentation query pages, workspace views, aliases, external redirects and fallback states. Browser evidence records rendered destinations. Attribution remains in session storage; withFunnelParams carries segment/article/solution/entry_source. PostHog attaches attr_* campaign properties, cta_impression records visibility, Nexus assessment has its explicit click event, scroll_depth records 25/50/75/90. Contact and assessment use the same lead transport with distinct payloads; Google Ads and LinkedIn tags remain. Seo, canonical URLs, RSS, robots, sitemap and prerender route generation are preserved.

## Assets and claims

assets.json inventories the existing images, SVG diagrams, icons and plots. Use the supplied 1088 × 725 Nexus image prominently without claiming it is a verified photograph. Reuse existing technical diagrams and research plots; preserve source data and MDX. Do not create hardware imagery, testimonials, certifications or benchmarks. Existing product claims require attention: legacy partner-portal contains illustrative compliance/security metrics; richer Stream functionality is explicitly a prototype. Any new marketing copy must be grounded in documentation and implemented UI.

## Build and validation

npm run build runs RSS generation, CRACO production compile, static-route shims, Chromium prerender and agent-content verification. npm test runs Jest. npm run webvitals measures throttled browser FCP/LCP/CLS; check:webmcp validates the agent integration. No .github workflow exists in this checkout; deploy is an explicit gh-pages script and is not to be invoked. Local server and Chromium require sandbox escalation. External requests are intercepted in the visual runner; fixture authentication and empty backend lists allow account layouts to be reviewed without customer data.

## Visual system

Warm paper #F7F6F2, ink #1C242B, teal #00796B, violet #7479C8 and technical gold #F0BE57. System sans typography with editorial serif in research and monospace for protocols/data. A 1200px content grid, 4px spacing unit, restrained square corners, thin rules, no decorative glow. Public products use asymmetric sections, real hardware, diagrams and indexed workflows. Workspaces retain functional density and distinct demo status. Forms, focus states and touch targets use consistent tokens. Motion explains controlled requests and results and respects reduced motion.

## Baseline UX findings

Comprehensive review is requested. Evidence from source: homepage repeats explanatory card sections; Nexus hardware is nested in several decorative containers; primary navigation competes with seven public choices; Stream is not independently discoverable; marketing gradients obscure section hierarchy; account screens use inconsistent literal colors; fixed navigation covers short page headings; loading fallback has no visible status; documentation relies on small type and narrow nested content on phones. These affect hierarchy, grouping, recognition, choice load, feedback and target usability. Rendered screenshots will confirm and refine them.

## Implementation decisions and migration notes

The homepage's repeated explanatory blocks are replaced by product spreads, an architecture path, an illustrative event specimen and publication/toolkit indexes. Existing Home → Nexus, Contact, Downloads and Extensions destinations remain; the Features anchor remains as the wider toolkit section. Existing use-case examples remain at /nexus/use-cases and in the static terminal routes. New /stream is additive and clearly distinguishes MVP, existing account tools and the richer reference prototype.

Nexus retains nexus_hero_assessment and nexus_bottom_contact impression IDs, nexus_assessment_clicked and its original properties, plus all destination routes. The bottom Contact link now also uses withFunnelParams, preserving the session context explicitly. Research article CTA handlers, solution context capture and all lead/auth transports are unchanged. Navigation reorganizes public choices into Nexus, Stream, Research, Docs and Company; account navigation stays distinct.

Legacy utility names now resolve semantic RGB variables instead of literal dark colors. Route family classes scope layout changes to public, docs, account and auth surfaces; workspace and research styles remain isolated. Existing SVG diagrams adopt the new palette without changing their topology. Static use-case terminals retain dark code surfaces inside a paper frame. Font Awesome is served from the installed package instead of a blocking CDN; typography uses system fallbacks without external font dependency.

Initial lazy routes are preloaded before React replaces prerendered HTML. This keeps a landing page visible during code loading without bundling the application routes together. Internal navigation still has a visible loading state. Three baseline Stream event-model tests referred to old fixture contents; their assertions were corrected using independent sorting/time fixtures and an exact sensor-run selection, without changing the event model or its behavior.
