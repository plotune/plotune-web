# Home Page — Nexus-Forward Rework (Design Spec)

_Date: 2026-07-24. Repo: `plotune-web`. Route: `/` (`src/pages/Home.jsx`)._

## Goal

Make the Home page lead with **Plotune Nexus** as the flagship product: describe it most,
reference the Nexus subpages (especially Use Cases), and add tasteful "Claude/Codex working
with Nexus" animated showcase moments — while **preserving the current architecture, design
language, and mobile-friendliness**. Showcase Nexus without distracting.

## Confirmed decisions

1. **Legacy sections:** _reframe around Nexus_ (keep `Features` and `BusinessImpact`, reword so
   Nexus leads; Core/Stream/Cloud become a subordinate "platform behind Nexus" mention — NOT cut).
2. **Showcase weight:** _lightweight animated cards + link_ — self-contained CSS/SVG cards
   (reusing `src/assets/use-case-*.svg` + the status-pulse CSS + `CaseChip`), **no iframes on Home**,
   with a prominent link into `/nexus/use-cases`.

All copy is vetted by the `nexus-marketing-expert` agent against the approved/prohibited claim
guardrails and grounded in `ROADMAP.md` + dated test evidence.

## Section order (final)

| # | Section | Component | Action |
|---|---------|-----------|--------|
| 1 | Hero | `components/Hero.jsx` | Keep layout · reword copy + guardrail fixes |
| 2 | Value pillars | `components/NexusSpotlight.jsx` | Keep layout · reword 4 cards + guardrail fixes |
| 3 | Claude/Codex + Nexus showcase | `components/NexusShowcase.jsx` (NEW) | Add — animated cards → Use Cases |
| 4 | Use Cases + subpage links | `components/NexusUseCasesTeaser.jsx` (NEW) | Add — industry pills + Connectivity/Stream tiles |
| 5 | The platform behind Nexus | `components/Features.jsx` | Reword (subordinate to Nexus) |
| 6 | Nexus buyer outcomes | `components/BusinessImpact.jsx` | Reword copy (keep layout) |
| 7 | Closing CTA | inline in `Home.jsx` or small component | Add |

`Home.jsx` composition becomes: `Hero → NexusSpotlight → NexusShowcase → NexusUseCasesTeaser →
Features → BusinessImpact → ClosingCta`.

## Copy

### 1. Hero (`Hero.jsx`) — keep two-column layout + live panel

- Eyebrow: `Plotune Nexus`
- Headline: `Turn bench and vehicle interfaces into controlled AI workflows.`
- Subhead: `A managed, local-first appliance that turns CAN, UART, XCP, and ROS 2 / DDS tasks into bounded, AI-ready workflows — with artifacts that stay local until you choose where they go.`
- Primary CTA: `Request a Demo` → `/contact` (keep)
- Secondary CTA: `Explore Nexus` → `/nexus` (rename from "Learn More")
- Live panel: header pill `Managed appliance` (was "Live"); three rows:
  - `CAN · UART · XCP` / `Capture, send, wait, and calibrate over real interfaces`
  - `ROS 2 / DDS` / `Join the robot's DDS domain — no ROS install on the appliance`
  - `Bounded AI actions` / `Agents act through a narrow MCP surface, not raw shell`

### 2. Value pillars (`NexusSpotlight.jsx`) — keep 4-card grid

- Eyebrow: `Plotune Nexus` · Headline: `One controlled surface for hardware-facing work.`
- Cards:
  1. **Local-first by design** — `Runs on Plotune-defined hardware. Raw artifacts stay on the device and move only to storage you already control.`
  2. **Bounded, not raw** — `AI-assisted work runs through a narrow set of MCP actions — acquire, capture, wait, send only approved frames, stop, package — instead of direct hardware access.`
  3. **Repeatable evidence** — `Recurring capture and stimulation move from operator memory into reusable jobs and test sequences that leave a packaged artifact behind.`
  4. **Real protocol coverage** — `Classic CAN, UART (incl. RS-485), XCP on CAN and Ethernet, and ROS 2 / DDS over CycloneDDS — shipped today.`
- **Guardrail fixes:** removes the "over 500 automotive-specific skills" claim, the "enterprise-grade" hype, and the "anywhere / always reachable" over-claim (reframed as local-first + delegated access).

### 3. Claude/Codex + Nexus showcase (`NexusShowcase.jsx`, NEW)

- Eyebrow: `Claude & Codex, on the bench`
- Headline: `Watch an agent run the bounded workflow — and leave the proof.`
- Subhead: `Real example runs on Plotune Nexus. The agent acquires the interface, runs the procedure, gates on live signals, and packages the artifact. See the full animated runtime on the Use Cases page.`
- CTA: `See it run in Use Cases →` → `/nexus/use-cases`
- Cards (title · one line · `Example run` chips, animated status pulse; reuse `use-case-*.svg`):
  1. **DDS requirement gate, 15 for 15** — `15/15 runs PASS, 0 flakes, gate match 0.26–0.37 s.` chips: `15/15 PASS`, `0 flakes`, `~0.3 s`
  2. **Command, then measure** — `Published a scalar Twist, then gated on live odometry — clean stop-on-zero.` chips: `Twist → pose`, `θ 2.87`, `stop 3.3e-16`
  3. **Multi-topic evidence to one MCAP** — `Recorded several ROS 2 topics into one MCAP as an async job.` chips: `6.47 Hz`, `∈[2,10]`, `194/30 s`
  4. **XCP calibration, margin restored** — `Ran the acceptance gate, applied a bounded XCP change, reran it.` chips: `438 → 428 A`, `2.4 → 8.7 A`, `note ready`
  5. **Field triage to a fault window** — `Recorded CAN + UART through a warm restart and pinned the root-cause window.` chips: `47.6 V`, `P0D67:28`, `22.184–22.432 s`

### 4. Use Cases + subpage links (`NexusUseCasesTeaser.jsx`, NEW)

- Eyebrow: `Scenarios by industry` · Headline: `See how Plotune Nexus works in your world.`
- Body: `Automotive validation, robotics, ROS 2 / DDS supervision, ECU & gateway integration, field diagnostics, and HIL automation — each with the bounded workflows Nexus runs on real hardware and the evidence each one leaves behind.`
- Static industry pills (mirror Use Cases labels): `Automotive & Mobility` · `Robotics` · `ROS 2 & Autonomous` · `ECU & Gateway` · `Field Diagnostics` · `HIL & Test Automation`
- CTA: `Explore the Use Cases →` → `/nexus/use-cases`
- Two subpage tiles (accurate to the subpages):
  - **Connectivity** — `CAN, UART, XCP, and ROS 2 / DDS — one connection point for your test environment.` → `/nexus/connectivity`
  - **Stream** — `Monitor live signals and validate requirements as your tests run — continuously.` → `/nexus/stream`

### 5. The platform behind Nexus (`Features.jsx`) — reword, keep 3-card layout + framer-motion

- Section heading: `The platform behind Nexus` · intro: `Nexus runs on the Plotune platform — the control, execution, and storage layers that keep hardware-facing work orchestrated, fast, and local-first.`
- Cards (keep icons, reposition as supporting Nexus, drop ETL/data-lake/governance hype):
  1. **Plotune Core — Control plane** — `Orchestrate, monitor, and manage your Nexus appliances and workflows from one interface.`
  2. **Plotune Stream — Execution plane** — `Run bounded capture, recording, and live validation close to the hardware.`
  3. **Plotune Cloud — Storage & handoff** — `Move artifacts to the storage you choose — local-first, customer-controlled, never defaulted into a vendor archive.`
- CTA line reworded away from "transform your data operations."

### 6. Nexus buyer outcomes (`BusinessImpact.jsx`) — keep 3-card centered layout + motion

- Heading: `Why teams put Nexus on the bench.` · subhead: `Start with one real workflow — not a platform migration.`
- Cards:
  1. **Faster triage** — `Inspect interfaces, capture bounded traces, and share evidence without stitching local tools together by hand each time.`
  2. **Repeatable validation** — `Move recurring capture and stimulation from ad-hoc operator steps into reusable jobs and test sequences.`
  3. **Approvable AI-assisted work** — `A narrower execution layer than raw shell or one-off scripts, so AI-assisted workflows are easier to approve — with the data path staying customer-controlled.`

### 7. Closing CTA

- Heading: `Start with one real workflow.` · body: `Put Plotune Nexus on one bench and see the bounded workflow, the live gate, and the packaged evidence for yourself.`
- Primary: `Request a Demo` → `/contact`; secondary: `Explore Nexus` → `/nexus`. Reuse the gradient CTA-band style from `NexusUseCases.jsx`.

## Architecture & constraints

- New sections are their own components in `src/components/` (one-component-per-section pattern).
- Reuse existing tokens only: `primary` (#26A69A), `bg-dark-card`, `bg-dark-surface`, `shadow-custom`,
  rounded-full pills, eyebrow `text-primary uppercase tracking-[0.28em]`. No new colors.
- Reuse `src/assets/use-case-*.svg` and a local `motionCss`-style status-pulse keyframe block
  wrapped in `@media (prefers-reduced-motion: reduce)`. No iframes on Home.
- No routing, `Header`, `Footer`, or dependency changes. `framer-motion` is already a dependency
  (used by Features/BusinessImpact) — reuse; do not add libraries.
- Mobile: every grid collapses to 1 column; pill rows use `flex flex-wrap` (no horizontal scroll);
  the page body never scrolls horizontally.

## Verification

1. `CI=true npm run build` passes (warnings are errors) with no new warnings.
2. `npm start`; visit `http://localhost:3000/#/` — confirm section order, animations, and all
   links resolve (`/nexus`, `/nexus/use-cases`, `/nexus/connectivity`, `/nexus/stream`, `/contact`).
3. A Sonnet-5 **design-expert** subagent opens the running page in a browser and checks for
   animation/layout artifacts, contrast, and mobile responsiveness (narrow viewport). Fix findings.
4. No pricing/plan language reintroduced (respects the prior removal).

## Out of scope

- Nav/Header changes, new routes, a separate `/platform` page, and any edits to the Use Cases
  page itself (kept intact; Home only links to it).
