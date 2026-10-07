# Plotune Stream workspace preview

Route: `/stream/workspace` (also accepts a trailing slash). The route is lazy loaded,
uses a separate light application shell, and is emitted as a real static route by
the existing GitHub Pages build. The existing `/streams` page is unchanged.

## Explore the product

1. Inspect Battery HIL's Overview and open failed run #1842.
2. Follow its timeline, measurements, and attached artifacts.
3. Filter Events or acknowledge an alarm after reviewing its evidence.
4. Add a source, inspect an illustrative setup guide, and simulate success/failure.
5. Pause Live measurements or preview a bridge to a local application.
6. Explore processor types, save a draft, or investigate a run using the demo agent.
7. Switch projects or use Engineering Sandbox to inspect the empty state.

All data is synthetic. Added sources, alarm acknowledgements, processor drafts,
bridge state, and preferences exist only in React state and disappear on reload.
Source snippets describe a possible integration; they are not released SDK contracts.
There are no backend writes, real integrations, model calls, file downloads, or compute.
The workspace uses the existing site's router and providers without altering auth.

## UX choices

- Hick's Law / Miller's Law: group navigation into Track, Analyze, Connect, and Automate;
  expose calculations, simulations, and actions inside Processors rather than as more
  top-level navigation choices.
- Jakob's Law: familiar project navigation, searchable tables, labelled filters,
  detail dialogs, and time ranges. Views use URL query state for browser back/forward.
- Fitts's Law: clear primary actions and larger touch targets on smaller screens.
- Tesler's Law / progressive disclosure: start with a preset workflow, reveal its
  trigger/input/output, then review before saving a draft. Source setup follows source
  selection, and run evidence is divided into Timeline, Measurements, and Artifacts.
- Proximity / common region: project context, health metrics, run evidence, and source
  status each have a clearly bounded region. Events and measurement samples are distinct.
- Hierarchy / aesthetic-usability: restrained teal, readable supporting text, tabular
  data, compact headings, minimal shadows, and a consistent engineering vocabulary.
- System status: connection freshness, delayed sources, result/severity badges, empty
  projects, simulated connection checking/failure/retry, paused values, and notifications.

Mobile uses a navigation drawer and single-column content. Data tables scroll within
their own regions instead of shrinking every desktop column. Dialogs use the browser's
native focus trapping, Escape handling, and focus restoration.

## Validation

Use the repository's existing commands: `npm ci`, `npm test -- --watchAll=false
--runInBand`, and `npm run build`. The build's existing prerender step requires
Playwright Chromium and network access for the Download page's release lookup.
Deploy using the existing `npm run deploy` / gh-pages flow.

Before publishing, inspect desktop/tablet/mobile, try the interactions above, ensure
no horizontal document overflow or runtime errors, and verify `/streams` still
renders its original application. `/stream` itself was not an existing route and
is intentionally not added or redirected by this feature.
