# Plotune engineering experience redesign

Base: `origin/master` at `892d1fcea439a0c89283c6e44a38e3d6943fb11c`. Delivery branch: `redesign/engineering-experience`. No merge or production deployment.

## Visual identity and design rationale

Warm paper, dark ink, engineering teal, restrained violet and gold. Technical labels use a system monospace stack; product headings use clear sans serif type; research uses a bounded editorial reading measure. Ruled indexes, asymmetric product spreads and explicit architecture replace repeated rounded feature cards. The existing Nexus hardware image is the central product asset; it is not described as a verified photograph.

Nexus presents controlled MCP operations, physical interfaces and recorded artifacts. Stream has a new independent overview explaining HTTP sources and distinguishing its local MVP, authenticated stream tools and future reference prototype. Research preserves MDX, benchmark data and charts while improving publication navigation and reading. Documentation, forms, account screens and workspaces share the tokens without using identical layouts.

## Complete route and screenshot coverage

[Route inventory](routes.json) and [coverage matrix](coverage.md). 106 baseline URLs/states × 3 viewports = 318 screenshots. The additive Stream overview brings the final inventory to 107 × 3 = 321 screenshots. Viewports: 390 × 844, 768 × 1024, 1440 × 900. The coverage matrix separates screenshots that were captured from screenshots that were opened and visually inspected, and names the reviewer. Full-resolution PNG evidence is kept locally under `evidence/` and is not committed (it is several hundred megabytes); `scripts/redesign/browser.cjs` regenerates it from a production build. Downscaled per-route previews are committed under `previews/`.

Review logs: [products and funnels](product-review.md), [account and supporting pages](account-route-review.md), [editorial and documentation](editorial-review.md), [workspaces](workspace-review.md). Manifests include headings, rendered destinations, errors, broken images and horizontal overflow. Zero flags means those automated checks found nothing; it is not a substitute for the visual reviews.

## Significant issues discovered and corrected

- Product imagery and evidence were buried in explanatory cards: rebuilt the homepage and Nexus composition.
- Tablet public navigation competed for width: switched to a disclosure menu below 1280px.
- Mobile storage actions clipped: stacked and widened toolbar controls.
- Research article CTA labels had insufficient contrast on teal: corrected to white and recaptured every article.
- Programmatic assessment heading focus acquired a decorative rectangle: removed it for noninteractive headings while retaining interactive focus states.
- Partner video used an excessively tall mobile frame: changed to its aspect ratio and added a visible YouTube fallback.
- Legacy icon words appeared as text or relied on blocking CDNs: use existing SVG icons for account controls and local deferred icon styles for remaining legacy pages.
- Static terminal demonstration styles lost to more specific selectors: corrected the frame and mobile controls. JavaScript typing waits now honor reduced motion.
- Initial lazy route loading replaced prerendered content: preload the initial route before mounting React; internal navigation still shows loading feedback.

## Functional validation

[Interaction results](interactions.md), [account checks](account-interactions.md), [conversion inventory](conversions.md), and [analytics results](analytics-results.json). Validation totals and production checks are recorded in [validation](validation.md). The second review pass (visual self-review of every route) is summarised in [visual review](visual-review.md).

Analytics, attribution, lead transports, API services, research article bodies and deployment workflows retain their existing implementations. The navigation reorganizes links; no existing route was deleted. `/stream` is additive. Nexus keeps its two impression IDs and explicit assessment click event; its bottom contact link now also carries stored funnel parameters.

## Performance

[Reproducible measurements](performance.json) and comparison in [validation](validation.md). Local mobile lab measurements use CDP throttling, three samples and median results, with external requests intercepted. They are not field Web Vitals. Initial product-image priority and blocking icon CSS regressions were measured and corrected before final measurements.

## Assets and motion

[Existing asset inventory](assets.json). Reused Nexus hardware and technical SVGs, recolored without changing their topology; preserved research charts/data. Added a code-native request/result architecture diagram and an explicit step control. Event specimens are labelled illustrative. No generated hardware images, screenshots, customer environments or benchmark results were introduced. No new animation dependency.

## Remaining limitations

- All remote requests use fixtures. Production OAuth, reset email delivery, lead delivery, backend writes, live stream ingestion/WebSockets and real hardware operations are unverified. No production customer data was changed.
- YouTube and Google form embeds are blank under those fixtures; the surrounding layouts and fallback links were reviewed, not the third-party rendered contents or playback.
- MVP sample event timestamps can fall outside the default Last 24 hours filter. This preexisting demo-clock limitation is documented; the event model was preserved.
- DNS, package mirroring, partner portal and vision workspace include existing demo/reference data; their presentation now makes that status clearer. Reference capabilities are not presented as implemented MVP features.
- Research remains heavy because existing plotting code/data were preserved. Build emits existing dependency source-map warnings. Tests emit existing jsdom navigation/scroll warnings; these are separate from the zero uncaught browser errors in route captures.
- Visual coverage uses representative valid routes/states and safe account fixtures. It cannot cover every possible customer dataset, backend failure or authenticated permission combination.
