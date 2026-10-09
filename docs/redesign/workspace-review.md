# Workspace screenshot review

Scope: route IDs 83–102 in `docs/redesign/routes.json` (MVP workspace states, prototype workspace states, and two fallback routes). The screenshots listed below were opened individually with the image viewer, at full page size.

## Baseline screenshots opened

I opened all 20 mobile files and all 20 tablet files for IDs 83–102:

| ID | Route / state | Mobile | Tablet | Desktop |
|---:|---|---|---|---|
| 83 | MVP dashboards, Battery HIL | `083-mobile.png` | `083-tablet.png` | `083-desktop.png` |
| 84 | MVP API setup, Battery HIL | `084-mobile.png` | `084-tablet.png` | `084-desktop.png` |
| 85 | MVP MCP setup, Battery HIL | `085-mobile.png` | `085-tablet.png` | `085-desktop.png` |
| 86 | MVP webhooks, Battery HIL | `086-mobile.png` | `086-tablet.png` | `086-desktop.png` |
| 87 | MVP project settings, Battery HIL | `087-mobile.png` | `087-tablet.png` | `087-desktop.png` |
| 88 | MVP events, Robot Validation | `088-mobile.png` | `088-tablet.png` | `088-desktop.png` |
| 89 | Prototype overview | `089-mobile.png` | `089-tablet.png` | `089-desktop.png` |
| 90 | Prototype events | `090-mobile.png` | `090-tablet.png` | `090-desktop.png` |
| 91 | Prototype runs | `091-mobile.png` | `091-tablet.png` | `091-desktop.png` |
| 92 | Prototype measurements | `092-mobile.png` | `092-tablet.png` | `092-desktop.png` |
| 93 | Prototype records | `093-mobile.png` | `093-tablet.png` | `093-desktop.png` |
| 94 | Prototype alarms | `094-mobile.png` | `094-tablet.png` | `094-desktop.png` |
| 95 | Prototype dashboards | `095-mobile.png` | `095-tablet.png` | `095-desktop.png` |
| 96 | Prototype sources | `096-mobile.png` | `096-tablet.png` | `096-desktop.png` |
| 97 | Prototype live measurements | `097-mobile.png` | `097-tablet.png` | `097-desktop.png` |
| 98 | Prototype processors | `098-mobile.png` | `098-tablet.png` | `098-desktop.png` |
| 99 | Prototype agents | `099-mobile.png` | `099-tablet.png` | `099-desktop.png` |
| 100 | Prototype project settings | `100-mobile.png` | `100-tablet.png` | `100-desktop.png` |
| 101 | Unknown route fallback | `101-mobile.png` | `101-tablet.png` | `101-desktop.png` |
| 102 | Unknown Nexus doc fallback | `102-mobile.png` | `102-tablet.png` | `102-desktop.png` |

I opened all 60 baseline files in this table. These were added by the completed baseline capture after the initial partial manifest read.

## Baseline findings

- MVP screens use a compact persistent workspace header and keep the current project context visible. API and MCP setup show copyable endpoint/configuration examples; the page labels them as illustrative and says the demo does not send requests.
- MVP dashboards and webhooks have clear empty states and prominent create actions. Project settings separate project name from member management.
- The Robot Validation route reports 26 project events but the default “Last 24 hours” filter shows 0 matching rows in both mobile and tablet screenshots. The fixture timestamps and the captured page's clock do not align, making this state look empty despite the project count.
- Prototype views are visually distinct from the MVP and marked as preview/demo data. Overview, events, runs, measurements, records, alarms, dashboards, sources, live, processors, agents and project settings each show dense engineering context.
- The mobile prototype Overview has a long stack of charts, tables and alarm/source panels. Recent runs and recent events tables extend beyond the screenshot's visible width. Their `.sw-table-wrap` containers use `overflow: auto`, so the hidden columns remain reachable by horizontal scrolling. Tablet captures show more columns at once.
- Mobile and tablet settings and agents pages have substantial open space below their main cards. Prototype records show a short table and large remaining blank region. These are simple states rather than capture failures.
- IDs 101 and 102 render their expected not-found messages and navigation actions; they are not workspace views.

## Post-redesign review

I opened all 60 post-redesign screenshots for IDs 83–102 in the final 321-capture manifest with zero capture errors: `083-mobile.png`–`102-mobile.png`, `083-tablet.png`–`102-tablet.png`, and `083-desktop.png`–`102-desktop.png`. Each file was opened individually at full page size.

| ID | Mobile opened | Tablet opened | Desktop opened |
|---:|---|---|---|
| 83–102 | `083-mobile.png`–`102-mobile.png` | `083-tablet.png`–`102-tablet.png` | `083-desktop.png`–`102-desktop.png` |

### Post-redesign findings

- MVP dashboard, API setup, MCP setup, webhooks and project settings preserve their clear project context and actions at mobile and tablet widths. Setup pages identify their examples as illustrative and state that no requests are sent.
- Route 88 still has the fixture-clock mismatch seen in baseline: the page says there are 26 demo events but shows 0 rows with the default Last 24 hours filter. The 10-event populated prototype Events page is route 90 and should not be conflated with this MVP route.
- Prototype overview, events, runs, measurements, records, alarms, dashboards, sources, live, processors, agents and project settings are populated and consistently labeled as demo snapshots. Charts and source cards fit at tablet width.
- At mobile width, route 89 Overview remains a long stack of panels and its Recent runs and recent events tables extend beyond the screenshot width. Routes 90 Events and 91 Runs show the same behavior. Source review confirms these prototype tables are wrapped in `.sw-table-wrap { overflow: auto; }`, which provides horizontal scrolling. Their desktop versions fit all shown columns.
- Routes 101 and 102 continue to render their separate site and Nexus docs not-found states with navigation actions.
