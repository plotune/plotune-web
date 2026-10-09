# Interaction review

Review date: 2026-10-09. The interaction runner is `scripts/redesign/interactions.cjs`; captured evidence is under `docs/redesign/evidence/interactions/`. The final run used the local production preview at `http://localhost:4184` and the existing `browser.cjs` fixture intercepted every external request. No analytics or lead submission was sent to a live service.

## Checks performed

The runner exercised the desktop Nexus navigation dropdown and Escape close, mobile navigation open/close, Nexus-to-assessment funnel URL, all four assessment answers and result, contact validation and submission state, Stream MVP event search and event detail, project creation, dashboard creation, webhook form, and API/MCP setup. It also opened the prototype Overview, Runs, Measurements, Sources and Processors views, opened a run detail and selected its Measurements and Artifacts tabs, and checked research chart controls, results pagination and article navigation.

The final production-preview run recorded 21 passing checks out of 21, with 30 screenshots. The runner now waits for the populated article and active research page 2 before taking those screenshots, and waits for the visible “Cost across models” heading before recording the chart check. The final run captured the inline contact validation errors.

## Screenshots opened

After the final production-preview run, I opened and visually checked all 30 full-page captures under `docs/redesign/evidence/interactions/`:

- `nexus-mobile-cta.png`, `assessment-intro.png`, `assessment-result.png`
- `contact-empty.png`, `contact-invalid.png`, `contact-submitted.png`
- `stream-events-initial.png`, `stream-event-detail.png`, `stream-create-project-dialog.png`, `stream-empty-project.png`, `stream-create-dashboard-dialog.png`, `stream-dashboard-created.png`, `stream-webhooks.png`, `stream-webhook-form.png`, `stream-api-setup.png`, `stream-mcp-setup.png`
- `stream-prototype-overview.png`, `stream-prototype-runs.png`, `stream-prototype-run-detail.png`, `stream-prototype-run-measurements.png`, `stream-prototype-run-artifacts.png`, `stream-prototype-measurements.png`, `stream-prototype-sources.png`, `stream-prototype-processors.png`
- `research-overview.png`, `research-landscape-cost.png`, `research-cost-detail.png`, `research-results-page-2.png`, `research-reports.png`, `research-article.png`

## Observations and limits

- The funnel URL preserved campaign context as `entry_source=qa` on the assessment route.
- The dev-server run showed “Preview only: nothing was sent.” In the production preview, the contact flow reached “Message sent” after its Google Apps Script request received the fixture's `{ok:true}` response. That POST was intercepted; no live lead was delivered.
- Six external requests were observed in the final production-preview run: Google Tag Manager script load, PostHog config script/config and two flags requests, and the mocked Google Apps Script lead POST. The fixture intercepted all six. No PostHog event ingestion request appeared, so this run does not verify click/impression payload contents.
- The Stream screenshot showed 34 fixture events and five rows on the current page. Search produced four matching rows for `motor`; the event detail displayed the timestamp, event name, device/session context and JSON properties. Project and dashboard creation stayed in local browser state, and their created/empty states were captured.
- API setup shows the sample project ID, a masked demo tracker key and illustrative `curl` payload; MCP setup shows an illustrative client configuration and says its connection check is mocked. The webhook empty state and add form are visible. Nothing in these screenshots indicates a live send.
- Prototype run detail shows run #1843, a timeline, a measurements chart and two artifact entries; the Measurements and Artifacts tabs were captured with their active states. Prototype Overview charts, source status cards and processor workflow examples are populated and labeled as mock data.
- Research overview includes a rendered performance-versus-cost scatter plot, leading-model cards and rankings. The cost view updates the ranking heading and cost bars. Results page 2 is active and shows the second set of models. Report navigation reaches a populated long-form article with rendered charts and tables; all three states were captured after settling.
- Visual review found no material layout or rendering defect in these 30 captures. Small text in long full-page screenshots is naturally hard to read at fit-to-view scale; the report claims that those screenshots were opened, not that every paragraph was transcribed.
- The sequence was performed at desktop width except for public navigation and the Nexus CTA/assessment entry. This is an interaction check, not complete keyboard, touch, responsive, or accessibility testing.

Additional account and Stream checks are scoped in [account-interactions.md](account-interactions.md) and `scripts/redesign/account-interactions.cjs`. The additional runner passed 12/12 checks with 15 reviewed captures; these are separate from the 21-check total above.
