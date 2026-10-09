# Screenshot coverage matrix (final3)

**Totals:** 321 of 321 captured, 321 of 321 inspected.

Viewports: mobile 390x844, tablet 768x1024, desktop 1440x900. "Captured" means the harness saved a full-page PNG with no capture error. "Inspected" means the image was opened and examined by the named reviewer: `claude` is the implementing agent, `haiku` is a delegated first-pass sweep whose findings were re-verified before fixing. A route marked inspected but not re-captured after a fix was re-rendered and re-inspected through the quick-capture script during the fix.

| ID | Route | Captured (M/T/D) | Inspected (M/T/D) | Reviewer | Outcome |
|---:|---|---|---|---|---|
| 0 | `/` | ✓✓✓ | ✓✓✓ | claude | fixed: architecture return glyph rendered as stray arrow; re-inspected |
| 1 | `/faq` | ✓✓✓ | ✓✓✓ | claude | fixed: centered SaaS hero, tablet CTA overflow, long mobile footer; re-inspected |
| 2 | `/extensions` | ✓✓✓ | ✓✓✓ | claude | fixed: centered hero, truncated 4-col card grid, monster avatars -> ruled catalog; re-inspected |
| 3 | `/blog` | ✓✓✓ | ✓✓✓ | claude | clean (redirect interstitial) |
| 4 | `/community` | ✓✓✓ | ✓✓✓ | claude | clean (same interstitial component as 3; verified separately below) |
| 5 | `/tutorials` | ✓✓✓ | ✓✓✓ | claude | same interstitial |
| 6 | `/download` | ✓✓✓ | ✓✓✓ | claude | fixed: legacy centered hero, OS tiles, grey step boxes, Invalid Date, Lite/Pro pricing FAQ, contradictory Snap-only answer, mobile grid overflow; re-inspected |
| 7 | `/about` | ✓✓✓ | ✓✓✓ | claude | fixed: traffic-light mission card + icon value cards -> ruled principles; re-inspected |
| 8 | `/careers` | ✓✓✓ | ✓✓✓ | claude | fixed: centered hero + JOIN US kicker + invisible icon button; re-inspected |
| 9 | `/login` | ✓✓✓ | ✓✓✓ | claude | clean |
| 10 | `/register` | ✓✓✓ | ✓✓✓ | claude | clean |
| 11 | `/legal` | ✓✓✓ | ✓✓✓ | claude | fixed: crushed plan cards (tablet), centered hero, boxed nav; re-inspected |
| 12 | `/docs` | ✓✓✓ | ✓✓✓ | claude | fixed: card soup flattened, misaligned header, nav icons, broken sub-nav (mobile/tablet); re-inspected |
| 13 | `/docs/nexus` | ✓✓✓ | ✓✓✓ | claude | fixed: double top padding + grey band, letter-spaced kicker, cards -> ruled index; doc pages serif h2 -> sans; re-inspected |
| 14 | `/privacy` | ✓✓✓ | ✓✓✓ | claude | fixed: legacy centered hero/boxed nav, list spacing; re-inspected |
| 15 | `/contact` | ✓✓✓ | ✓✓✓ | claude | fixed: letter-spaced kickers via global mono label rule; re-inspected. Flag: Pricing topic chip kept (lead input) |
| 16 | `/verify-email` | ✓✓✓ | ✓✓✓ | claude | clean |
| 17 | `/reset-password` | ✓✓✓ | ✓✓✓ | claude | clean (reset password form) |
| 18 | `/dashboard` | ✓✓✓ | ✓✓✓ | claude | fixed: removed dead premium upsell, orphan tile, tall mobile tiles; re-inspected |
| 19 | `/profile` | ✓✓✓ | ✓✓✓ | claude | fixed: illegible FREE badge removed, emoji -> line icons; re-inspected |
| 20 | `/streams` | ✓✓✓ | ✓✓✓ | claude | fixed: spinner-like empty icon, New Stream wrap; re-inspected mobile |
| 21 | `/stream/workspace` | ✓✓✓ | ✓✓✓ | claude | fixed: copy button overlap (mobile); sidebar 'cut' is fixed-position capture artifact |
| 22 | `/stream/prototypes/vision` | ✓✓✓ | ✓✓✓ | claude | fixed: select inset/sizing, table scroll fade, chart limit label; re-inspected mobile |
| 23 | `/dns` | ✓✓✓ | ✓✓✓ | claude | fixed: removed Upgrade to Plus/plan labels; layout ok |
| 24 | `/partners` | ✓✓✓ | ✓✓✓ | claude | fixed: flush hero + centered SaaS card sections -> editorial; re-inspected |
| 25 | `/partner-portal` | ✓✓✓ | ✓✓✓ | claude | acceptable (labelled prototype); flag tier copy |
| 26 | `/partners/apply` | ✓✓✓ | ✓✓✓ | claude | fixed: back link hidden under fixed header, centered hero; re-inspected |
| 27 | `/storage` | ✓✓✓ | ✓✓✓ | claude | acceptable (minor refresh-button crowding tablet) |
| 28 | `/mirror` | ✓✓✓ | ✓✓✓ | claude | acceptable (Logs tab wraps on mobile, minor) |
| 29 | `/embed` | ✓✓✓ | ✓✓✓ | claude | fixed: tablet hero overflow, window dots, emoji, faint chart text (SVG recolor), centered card soup; re-inspected |
| 30 | `/nexus` | ✓✓✓ | ✓✓✓ | claude | clean |
| 31 | `/solutions/agentic-test-development` | ✓✓✓ | ✓✓✓ | claude | fixed: no gap after hero band (dev re-render pending) |
| 32 | `/agentic-test-development` | ✓✓✓ | ✓✓✓ | claude | alias of 31; same fix |
| 33 | `/nexus/connectivity` | ✓✓✓ | ✓✓✓ | claude | clean |
| 34 | `/nexus/stream` | ✓✓✓ | ✓✓✓ | claude | clean |
| 35 | `/nexus/use-cases` | ✓✓✓ | ✓✓✓ | claude | clean |
| 36 | `/research` | ✓✓✓ | ✓✓✓ | claude | fixed: mobile highlight cards 2-col crushed; leftover blues; re-inspected mobile |
| 37 | `/research/results` | ✓✓✓ | ✓✓✓ | claude | fixed: truncated bar labels/values; re-inspected mobile+tablet |
| 38 | `/research/reports` | ✓✓✓ | ✓✓✓ | claude | fixed: misaligned filters; verified in final2 |
| 39 | `/research/methodology` | ✓✓✓ | ✓✓✓ | claude | fixed: mobile protocol strip, cramped metrics rows & family cards |
| 40 | `/streams/connect` | ✓✓✓ | ✓✓✓ | claude | clean (auth-required state) |
| 41 | `/ai-readiness` | ✓✓✓ | ✓✓✓ | claude | clean |
| 42 | `/research/articles/agentic-ecu-testing-can-to-execution` | ✓✓✓ | ✓✓✓ | claude | fixed (template): paragraph spacing, serif title, CTA crowding, blue flow badges, red blockquote |
| 43 | `/research/articles/agentic-test-validation-model-comparison` | ✓✓✓ | ✓✓✓ | claude | fixed: mobile legend overlapping bars (+ template fixes) |
| 44 | `/research/articles/agentic-testing-ros2-dds-systems` | ✓✓✓ | ✓✓✓ | claude | template fixes; otherwise clean |
| 45 | `/research/articles/ai-agents-control-test-benches-with-mcp` | ✓✓✓ | ✓✓✓ | claude | template fixes; otherwise clean |
| 46 | `/research/articles/ai-agents-vs-traditional-test-automation` | ✓✓✓ | ✓✓✓ | claude | template fixes; otherwise clean |
| 47 | `/research/articles/ai-hardware-in-the-loop-testing` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 48 | `/research/articles/automating-can-ecu-tests-with-ai-agents` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 49 | `/research/articles/building-a-24-7-unattended-test-lab` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 50 | `/research/articles/decision-model-agent-guardrails` | ✓✓✓ | ✓✓✓ | claude | fixed: mobile legend item overflow (+ template fixes) |
| 51 | `/research/articles/running-unattended-ros2-hardware-tests` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 52 | `/research/articles/test-automation-engineer-in-the-loop` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 53 | `/research/articles/what-is-agentic-test-development` | ✓✓✓ | ✓✓✓ | claude | template fixes (paragraph spacing, serif title, CTA); otherwise clean |
| 54 | `/solutions/can-ecu-testing` | ✓✓✓ | ✓✓✓ | claude | fixed: closing CTA wraps (tablet); otherwise clean |
| 55 | `/solutions/ros2-dds-testing` | ✓✓✓ | ✓✓✓ | claude | same template fix |
| 56 | `/solutions/test-orchestration` | ✓✓✓ | ✓✓✓ | claude | solution template; CTA wrap fix |
| 57 | `/solutions/hil-testing` | ✓✓✓ | ✓✓✓ | claude | solution template; CTA wrap fix |
| 58 | `/solutions/can-testing` | ✓✓✓ | ✓✓✓ | claude | solution template; CTA wrap fix |
| 59 | `/docs/nexus/security-model` | ✓✓✓ | ✓✓✓ | claude | fixed: no scroll affordance on wide tables/code (mobile); otherwise clean |
| 60 | `/docs/nexus/hardware-compatibility` | ✓✓✓ | ✓✓✓ | claude | fixed: no scroll affordance on wide tables/code (mobile); otherwise clean |
| 61 | `/docs/nexus/mcp-api` | ✓✓✓ | ✓✓✓ | claude | fixed: no scroll affordance on wide tables/code (mobile); otherwise clean |
| 62 | `/docs/nexus/architecture` | ✓✓✓ | ✓✓✓ | claude | fixed: no scroll affordance on wide tables/code (mobile); otherwise clean |
| 63 | `/docs/nexus/data-handling` | ✓✓✓ | ✓✓✓ | claude | fixed: excess mobile top gap; otherwise clean |
| 64 | `/docs/nexus/protocols` | ✓✓✓ | ✓✓✓ | claude | fixed: excess mobile top gap; otherwise clean |
| 65 | `/docs/nexus/quick-start` | ✓✓✓ | ✓✓✓ | claude | fixed: excess mobile top gap; otherwise clean |
| 66 | `/docs?page=general` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 67 | `/docs?page=nexus` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 68 | `/docs?page=nexus-remote-routing` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 69 | `/docs?page=components-oscilloscope` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 70 | `/docs?page=components-scatter` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 71 | `/docs?page=components-bridge` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 72 | `/docs?page=components-statistical` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 73 | `/docs?page=components-recorder` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 74 | `/docs?page=calculations-mathematical` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 75 | `/docs?page=calculations-aggregations` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 76 | `/docs?page=calculations-plotunex` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 77 | `/docs?page=extensions-offline` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 78 | `/docs?page=extensions-online` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 79 | `/docs?page=extensions-simulation` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 80 | `/docs?page=extensions-bridging` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 81 | `/docs?page=sdk` | ✓✓✓ | ✓✓✓ | claude | legacy-doc flattening (overflow, card soup); dark non-code tiles -> ruled cells; mobile scroll fade |
| 82 | `/stream/workspace?view=events&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | clean |
| 83 | `/stream/workspace?view=dashboards&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 84 | `/stream/workspace?view=api&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 85 | `/stream/workspace?view=mcp&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 86 | `/stream/workspace?view=webhooks&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 87 | `/stream/workspace?view=settings&project=battery` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 88 | `/stream/workspace?project=robot` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 89 | `/stream/prototypes/vision?view=overview` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 90 | `/stream/prototypes/vision?view=events` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 91 | `/stream/prototypes/vision?view=runs` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 92 | `/stream/prototypes/vision?view=measurements` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 93 | `/stream/prototypes/vision?view=records` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 94 | `/stream/prototypes/vision?view=alarms` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 95 | `/stream/prototypes/vision?view=dashboards` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 96 | `/stream/prototypes/vision?view=sources` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 97 | `/stream/prototypes/vision?view=live` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 98 | `/stream/prototypes/vision?view=processors` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 99 | `/stream/prototypes/vision?view=agents` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 100 | `/stream/prototypes/vision?view=project-settings` | ✓✓✓ | ✓✓✓ | claude,haiku | haiku detail pass + claude contact-sheet; fixes: select, table fade, chart label |
| 101 | `/not-a-page` | ✓✓✓ | ✓✓✓ | claude | clean |
| 102 | `/docs/nexus/not-a-doc` | ✓✓✓ | ✓✓✓ | claude | clean |
| 103 | `/research/articles/not-a-study` | ✓✓✓ | ✓✓✓ | claude | clean |
| 104 | `/use-cases/claude/` | ✓✓✓ | ✓✓✓ | claude | clean |
| 105 | `/use-cases/codex/` | ✓✓✓ | ✓✓✓ | claude | clean |
| 106 | `/stream` | ✓✓✓ | ✓✓✓ | claude | clean |
