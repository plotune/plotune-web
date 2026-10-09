# Baseline visual review

Review date: 2026-10-09. Baseline source is the `origin/master` snapshot recorded in `discovery.md` (892d1fcea439a0c89283c6e44a38e3d6943fb11c). This is a limited visual review, not a complete route audit.

## Evidence actually opened

I opened these full-page PNGs with the image viewer and reviewed their compositions:

| Screenshot | Device | Review focus |
|---|---|---|
| `000-mobile.png` | Mobile | Home page hierarchy, product discovery, page length, footer |
| `000-desktop.png` | Desktop | Home page section rhythm, product hierarchy, navigation |
| `015-mobile.png` | Mobile | Contact form, alternate assessment path, contact details |
| `015-desktop.png` | Desktop | Contact layout and form prominence |
| `030-mobile.png` | Mobile | Nexus hierarchy, supplied product image, lower page sections |
| `041-mobile.png` | Mobile | Assessment intro and top-of-page spacing |
| `013-mobile.png` | Mobile | Nexus documentation index card density and navigation |
| `012-desktop.png` | Desktop | Legacy documentation content width, type size and navigation |
| `036-mobile.png` | Mobile | Research overview chart and results density |
| `036-desktop.png` | Desktop | Research overview hierarchy and chart/results legibility |

I did not open any other baseline screenshots. In particular, I did not visually inspect tablet screenshots, Stream/workspace views, individual research articles, or the remaining route variants. The initial `results.json` snapshot I read contained 277 entries: 106 mobile, 106 tablet, and 65 desktop, out of 318 planned captures. The root capture runner later rewrote that file while this review was in progress; at the final file read it contained only three mobile entries, so the counts above describe the initial snapshot rather than the current manifest. The ten filenames listed above were opened from the retained PNG evidence.

## Findings from the opened screenshots

- **Home, mobile and desktop:** Nexus is the clearest product path, but the page has many vertically stacked sections before its final contact prompt. The mobile screenshot makes the overall page feel particularly long. Home presents Nexus, Stream, Research and the wider toolkit, but Stream's public introduction and separate route are not visible in this baseline screenshot; preserve a direct public discovery path in the redesigned page. Desktop sections are well aligned but several consecutive card-led sections give them similar visual weight.
- **Nexus, mobile:** The page does show a real product image and a clear assessment action near the top. Repeated dark cards and long explanatory sections make it a substantial scroll. Keep the product image and the bounded-workflow story, while making the next useful technical destination easy to find.
- **Contact, mobile and desktop:** The form is prominent, the assessment is a secondary route for visitors not ready to contact, and practical contact alternatives appear below. On mobile this is a long page, but the form is visible before the secondary material. Preserve the separate contact and assessment actions and their distinct tracking.
- **Assessment, mobile:** The intro has a notably large empty top area between the brand and the assessment label/title. This pushes the action down without adding context. The reviewed screenshot is the intro only; later question, result and email-capture states were not visually reviewed here.
- **Nexus docs, mobile:** The overview uses a readable sequence of topic cards with summaries, but every card is a sizable block. Check the dense reference pages at phone widths, including code/table behavior; those page variants were not visually reviewed in this pass.
- **Legacy docs, desktop:** The content sits in a large dark panel with several nested cards. Labels and body copy appear small relative to the panel, especially in the lower sections. This supports the discovery note about documentation density; it does not establish the appearance of all documentation pages or sizes.
- **Research overview, mobile and desktop:** The desktop chart is comfortably sized, while the overview contains many charts, tabs and result cards. On mobile it becomes a long sequence and labels/metrics are small. Keep chart controls and data legible at narrow widths, and verify every chart's accessible text alternative as part of implementation review.

## Capture and inventory flags

The initial `results.json` snapshot reported `overflow: false` for all entries examined by the metadata check. That is only the runner's measured horizontal overflow flag; it does not establish visual quality or keyboard accessibility. The runner's `errors` and `brokenImages` fields are synthetic capture signals, not a substitute for opening screenshots. The evidence manifest was being rewritten by the root capture job, so consult its final stable output before using it as route-coverage evidence. No reviewed screenshot here establishes tablet behavior.

## Conversion, attribution and SEO review

Source-level utilities remain present in the working tree: `src/utils/attribution.js`, `src/utils/funnel.js`, `src/utils/ctaTracking.js` and the lead submission transport. `Seo` still emits canonical and social metadata. The rewritten Nexus hero retains `nexus_assessment_clicked`, links to the assessment with `withFunnelParams`, and retains distinct `cta_impression` tracking for its hero assessment and bottom contact CTA. Contact retains its separate assessment-click event and funnel-aware destination. Nexus technical links and page-specific `Seo` canonical path remain in place.

Review item for the implementation pass: most newly authored Home links are ordinary `Link`s without `withFunnelParams` or explicit impression hooks. The new direct `/nexus` and `/stream` destinations are valid routes, but source-level attribution/instrumentation should be checked against the conversion inventory before sign-off; do not infer that a destination link's presence preserves campaign context or its former CTA event. Home's newly introduced Stream path is a content addition, not a legacy CTA migration. The root Nexus assessment action keeps its explicit click event; its generic click autocapture should be checked in the final browser run if event parity is required.

This document records baseline observations only. I have not reviewed the post-redesign screenshots and make no claims about the final rendered result.
