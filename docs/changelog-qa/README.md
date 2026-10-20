# Changelog media and interface review

The initial proposed edition at `/changelog/2026-10-12` covers the already-public
Nexus pricing flow. Its publication is proposed in the website PR; nothing was
deployed by this work. Availability was checked against the live public pricing
page and the eligible merged website PR. No pending backend change is announced.

These additional examples demonstrate the generation pipeline, not new releases:

- [Stream event search recording](stream-event-search.mp4) · [poster](stream-event-search.webp)
- [Backend flow illustration](event-delivery-diagram.mp4) · [poster](event-delivery-diagram.webp)

Both use trusted code, synthetic/demo content and intercepted external requests.
The illustration names only public concepts; it is not a live delivery recording.
The generator checks every encoded frame with OCR and strips unnecessary metadata.
A synthetic secret canary in an encoded video is rejected by the test suite.
Scanning is imperfect; the owner must inspect complete clips before publication.

Review on 2026-10-20 used Chromium against a local production build at
1440×1000, 768×1024, 390×844 and 320×740. Before-and-after browser requests to
external services were intercepted, including analytics. This was not a user study
or a test against production customer data.

The UI follows the site's paper/ink/teal palette, ruled sections, editorial reading
measure, existing navigation and native keyboard controls. Availability headings
make previews distinguishable in text. Video sources are absent on the archive and
are attached only when visible on an edition. Reduced-motion/Save-Data users retain
posters and explicit playback; the written steps remain available without video.

Visual review opened the archive and edition at desktop and mobile widths, the
320px archive, the generated posters and sampled recording frames. A caption that
incorrectly called a UI capture an illustration was corrected. The rental choice
was centered to keep its action visible above the caption, and loading lead-in was
trimmed. Full-page evidence is captured at scroll-top so sticky navigation is not
misrepresented midway down the page. Playback viewport captures show the actual
controls and surrounding layout. Browser tests verify real playback and pausing;
frame inspection does not replace the owner's review of the complete recordings.

Detailed command results are recorded in the implementation PR. All screenshots
are local synthetic review evidence; selected final screenshots are committed here.
