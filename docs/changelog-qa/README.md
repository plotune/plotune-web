# Technical changelog review

The proposed edition at `/changelog` and `/changelog/2026-10-12` now documents
Stream sample-workspace filtering, Saved Filter references, browser export and
widget configuration. It is a technical walkthrough of existing sample behavior,
not an announcement of production activation or a newly shipped backend release.

The layout follows compact release notes with edition navigation, linked contents,
concrete instructions, JSON and inline supporting media. Pricing/rental content,
unrelated images, decorative media badges and burned-in caption overlays are removed.
The diagram explains which selection is reused and where widget settings differ.

Browser checks on 2026-10-20 passed at 1440×1000, 768×1024, 390×844 and 320×740:
latest/dated/unknown routes, no horizontal overflow, inline recording and diagram,
contents anchors, lazy video loading, real autoplay, offscreen/one-player pause,
reduced-motion manual playback and keyboard-accessible written steps.
Screenshots were taken at scroll-top; playback and diagram views show their actual
viewport states. These checks use a local production build with external requests
intercepted and synthetic events. They do not access real customer systems.

Final posters and sampled action frames were inspected visually. Both full clips
are available in `public/changelog/media`; every encoded frame and poster is scanned
for sensitive text. Scanning is imperfect: owner review of the complete recordings
and technical claims is still required before merge. Nothing was deployed.
