"""Animated brand end card: four cut-out products on a shared dark studio floor (soft shadow + glossy
reflection), staggered rise-in, title and tagline, slow push-in. Writes a PNG sequence."""
import sys, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
WORK = os.environ.get('BRIDGE_VIDEO_WORK', os.path.join(os.getcwd(), 'work'))   # clips/, fonts/, cut/, final/ live here
HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, '..', '..', 'public')
S = WORK + '/'
SITE = PUBLIC + '/'
FPS, SECS = 24, 3.0
semibold = lambda s: ImageFont.truetype(S + 'fonts/font1.ttf', s)
medium = lambda s: ImageFont.truetype(S + 'fonts/font2.ttf', s)
mono = lambda s: ImageFont.truetype(S + 'fonts/font3.ttf', s)
logo = Image.open(SITE + 'assets/logo.png').convert('RGBA')
cuts = {'can': Image.open(S + 'cut/can_v2.png'), 'serial': Image.open(S + 'cut/serial_v2.png'),
        'daq': Image.open(S + 'cut/daq_v2.png'), 'io': Image.open(S + 'cut/io_v2.png')}
names = [('can', 'Bridge CAN'), ('serial', 'Bridge Serial'), ('daq', 'Bridge DAQ'), ('io', 'Bridge I/O')]
ease = lambda x: 1 - (1 - max(0., min(1., x))) ** 3

def backdrop(W, H, cy):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * .5) / (W * .72)) ** 2 + ((yy - H * cy) / (H * .80)) ** 2)
    v = 62 - (62 - 11) * np.clip(r, 0, 1) ** 1.35
    rng = np.random.default_rng(7); v = v + rng.normal(0, 1.1, v.shape)
    a = np.stack([v, v + .6, v + 2.2], -1).clip(0, 255).astype(np.uint8)
    return Image.fromarray(a, 'RGB').convert('RGBA')

def prep(c, w):
    h = round(c.size[1] * w / c.size[0]); dev = c.resize((w, h), Image.LANCZOS)
    # glossy-floor reflection: flipped, fading out
    refl = dev.transpose(Image.FLIP_TOP_BOTTOM); ra = np.asarray(refl).copy()
    fade = np.clip(1 - np.arange(h) / (h * .42), 0, 1) ** 1.6 * .30
    ra[..., 3] = (ra[..., 3] * fade[:, None]).astype(np.uint8)
    refl = Image.fromarray(ra, 'RGBA').filter(ImageFilter.GaussianBlur(1.4))
    # contact shadow
    sh = Image.new('RGBA', (w + 120, 90), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((60, 28, w + 60, 62), fill=(0, 0, 0, 150))
    return dev, refl, sh.filter(ImageFilter.GaussianBlur(14))

def tint(layer, a):
    arr = np.asarray(layer).copy(); arr[..., 3] = (arr[..., 3] * a).astype(np.uint8); return Image.fromarray(arr, 'RGBA')

def build(kind):
    W, H = (1280, 720) if kind == 'wide' else (720, 1280)
    bg = backdrop(W, H, .42 if kind == 'wide' else .46)
    if kind == 'wide':
        dw, base_y, xs = 262, 500, [W // 2 + (i - 1.5) * 292 for i in range(4)]
        slots = [(x, base_y) for x in xs]
    else:
        dw = 280; slots = [(190, 670), (530, 670), (190, 1000), (530, 1000)]
    items = []
    for i, (key, label) in enumerate(names):
        dev, refl, sh = prep(cuts[key], dw); items.append((dev, refl, sh, slots[i], label))
    # static text layers
    def text_layer(draw_fn):
        l = Image.new('RGBA', (W, H), (0, 0, 0, 0)); draw_fn(ImageDraw.Draw(l), l); return l
    def title(d, l):
        if kind == 'wide':
            f = semibold(74); tw = d.textlength('Plotune Bridge', font=f); lg = logo.resize((88, 88), Image.LANCZOS)
            x0 = (W - (88 + 22 + tw)) / 2; l.alpha_composite(lg, (int(x0), 62)); d.text((x0 + 110, 66), 'Plotune Bridge', font=f, fill=(255, 255, 255, 255))
        else:
            f = semibold(64); tw = d.textlength('Plotune Bridge', font=f); lg = logo.resize((96, 96), Image.LANCZOS)
            l.alpha_composite(lg, ((W - 96) // 2, 96)); d.text(((W - tw) / 2, 210), 'Plotune Bridge', font=f, fill=(255, 255, 255, 255))
    def tagline(d, l):
        if kind == 'wide':
            t = 'Connect your hardware.  Access it anywhere.  Automate with AI.'; f = medium(27); d.text(((W - d.textlength(t, font=f)) / 2, 178), t, font=f, fill=(206, 213, 209, 255))
        else:
            f = medium(30)
            for j, t in enumerate(['Connect your hardware.', 'Access it anywhere.', 'Automate with AI.']):
                d.text(((W - d.textlength(t, font=f)) / 2, 308 + j * 44), t, font=f, fill=(206, 213, 209, 255))
    def url(d, l):
        t = 'plotune.net/bridge'; f = mono(26 if kind == 'wide' else 28); tw = sum(d.textlength(c, font=f) + 2 for c in t) - 2
        x = (W - tw) / 2; y = H - (70 if kind == 'wide' else 96)
        for c in t: d.text((x, y), c, font=f, fill=(70, 215, 185, 255)); x += d.textlength(c, font=f) + 2
    L_title, L_tag, L_url = text_layer(title), text_layer(tagline), text_layer(url)
    # labels (per device), drawn onto their own layers
    labels = []
    for dev, refl, sh, (cx, by), label in items:
        l = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(l); f = semibold(24 if kind == 'wide' else 26)
        ly = by + (80 if kind == 'wide' else 50); d.text((cx - d.textlength(label, font=f) / 2, ly), label, font=f, fill=(238, 241, 240, 255)); labels.append(l)
    return W, H, bg, items, L_title, L_tag, L_url, labels

def frame(parts, t, kind):
    W, H, bg, items, L_title, L_tag, L_url, labels = parts
    img = bg.copy()
    for i, (dev, refl, sh, (cx, by), label) in enumerate(items):
        p = ease((t - (.35 + .20 * i)) / .65)
        if p <= 0: continue
        s = .94 + .06 * p; yo = (1 - p) * 34
        def place(layer, ax, ay, alpha):
            lw, lh = layer.size; layer = layer.resize((max(1, round(lw * s)), max(1, round(lh * s))), Image.LANCZOS)
            img.alpha_composite(tint(layer, alpha), (round(ax - layer.size[0] / 2), round(ay - layer.size[1] + yo)))
        dw, dh = dev.size
        place(sh, cx, by + 46, p)                       # shadow
        rl = refl; rw, rh = rl.size; rl = rl.resize((max(1, round(rw * s)), max(1, round(rh * s))), Image.LANCZOS)
        img.alpha_composite(tint(rl, p), (round(cx - rl.size[0] / 2), round(by + 4 + yo)))   # reflection hangs below the base
        place(dev, cx, by, p)                           # product
        img.alpha_composite(tint(labels[i], ease((t - (.75 + .20 * i)) / .5)))
    img.alpha_composite(tint(L_title, ease(t / .6)))
    img.alpha_composite(tint(L_tag, ease((t - .95) / .6)))
    img.alpha_composite(tint(L_url, ease((t - 1.55) / .6)))
    # slow push-in
    z = 1 + .035 * (t / SECS); cw, ch = W / z, H / z
    return img.convert('RGB').transform((W, H), Image.EXTENT, ((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2), Image.BICUBIC)

if __name__ == '__main__':
    kind = sys.argv[1]; out = S + ('end_wide/' if kind == 'wide' else 'end_tall/'); os.makedirs(out, exist_ok=True)
    parts = build(kind); n = int(FPS * SECS)
    for k in range(n): frame(parts, k / FPS, kind).save(out + f'f{k:03d}.png')
    for name, k in (('mid', 30), ('end', n - 1)): Image.open(out + f'f{k:03d}.png').save(S + f'end-{kind}-{name}.png')
    print(kind, n, 'frames ->', out)
