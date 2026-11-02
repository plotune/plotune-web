#!/usr/bin/env python3
"""Make a 16:9 first frame from a 4:3 or 3:2 product render by extending its plain studio backdrop
(the outer column is replicated, blurred to follow the gradient, and given matching film grain).

  firstframe.py INPUT.png OUTPUT.jpg [x0 y0 x1 y1]     (optional crop box first, e.g. one view of a collage)
"""
import random, sys
from PIL import Image, ImageFilter

src = Image.open(sys.argv[1]).convert('RGB')
if len(sys.argv) >= 7: src = src.crop(tuple(int(v) for v in sys.argv[3:7]))
w, h = src.size; W = round(h * 16 / 9); pad = (W - w) // 2
canvas = Image.new('RGB', (W, h)); canvas.paste(src, (pad, 0))
left = src.crop((0, 0, 1, h)).resize((pad, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(30))
right = src.crop((w - 1, 0, w, h)).resize((W - w - pad, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(30))
canvas.paste(left, (0, 0)); canvas.paste(right, (pad + w, 0))
seam = canvas.filter(ImageFilter.GaussianBlur(5))
for x0 in (pad, pad + w):                                        # feather the joins
    box = (x0 - 10, 0, x0 + 10, h); canvas.paste(seam.crop(box), box)
px = canvas.load(); random.seed(5)
for x in list(range(0, pad)) + list(range(pad + w, W)):          # grain only where we invented pixels
    for y in range(h):
        n = random.randint(-2, 2); r, g, b = px[x, y]; px[x, y] = tuple(max(0, min(255, c + n)) for c in (r, g, b))
canvas.resize((1600, 900), Image.LANCZOS).save(sys.argv[2], quality=93)
print('wrote', sys.argv[2], f'(source {w}x{h}, padded {pad}px per side)')
