#!/bin/sh
# Download the site's typefaces (Inter, Roboto Mono; SIL Open Font License) as TTF into $BRIDGE_VIDEO_WORK/fonts.
# font1 = Inter SemiBold, font2 = Inter Medium, font3 = Roboto Mono Medium. The legacy user agent makes Google
# Fonts answer with TTF files, which Pillow can read (it cannot read WOFF2).
set -e
WORK="${BRIDGE_VIDEO_WORK:-$PWD/work}"; mkdir -p "$WORK/fonts"; cd "$WORK/fonts"
for fam in "Inter:wght@500;600" "Roboto+Mono:wght@500"; do curl -sf -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=$fam"; done > css.txt
i=0; for u in $(grep -o "https://[^)]*\.ttf" css.txt | sort -u); do i=$((i+1)); curl -sf -o "font$i.ttf" "$u"; done
python3 - <<'PY'
from PIL import ImageFont
for n in (1, 2, 3): print(f'font{n}.ttf =', ' '.join(ImageFont.truetype(f'font{n}.ttf', 20).getname()))
PY
