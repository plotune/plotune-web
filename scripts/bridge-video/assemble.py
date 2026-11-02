"""Assemble the Bridge family film from the four Veo clips + the animated end card.
  desktop: 16:9, 1280x720   |   mobile: 9:16, 720x1280 (own cut: punched-in shots, portrait layout)"""
import subprocess, sys, os, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.environ.get('BRIDGE_VIDEO_WORK', os.path.join(os.getcwd(), 'work'))
S = WORK + '/'                                   # clips/ fonts/ cut/ end_wide/ end_tall/ final/
PUBLIC = os.path.join(HERE, '..', '..', 'public')

def find_ffmpeg():
    if os.environ.get('FFMPEG'): return os.environ['FFMPEG']
    if shutil.which('ffmpeg'): return shutil.which('ffmpeg')
    try:
        import imageio_ffmpeg; return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit('ffmpeg not found: install it, set FFMPEG=/path/to/ffmpeg, or pip install imageio-ffmpeg')
FF = find_ffmpeg()
os.makedirs(S + 'final', exist_ok=True)
F = S + 'fonts/'
semibold = lambda s: ImageFont.truetype(F + 'font1.ttf', s); medium = lambda s: ImageFont.truetype(F + 'font2.ttf', s); mono = lambda s: ImageFont.truetype(F + 'font3.ttf', s)
logo = Image.open(os.path.join(PUBLIC, 'assets', 'logo.png')).convert('RGBA')
SHOTS = [('can', 'clips/can.mp4', 'Bridge CAN', 'CAN · 2 CHANNELS'), ('serial', 'clips/serial.mp4', 'Bridge Serial', 'SERIAL · 2 CHANNELS'),
         ('daq', 'clips/daq.mp4', 'Bridge DAQ', 'ANALOG · 7 INPUTS'), ('io', 'clips/io.mp4', 'Bridge I/O', 'DIGITAL + ANALOG · 12 I/O')]
START = {'can': 0.0, 'serial': 0.3, 'daq': 2.1, 'io': 0.0}     # DAQ: first 2 s carry a hallucinated caption, skipped

def spaced(d, xy, t, f, fill, tr=0):
    x, y = xy
    for c in t: d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + tr

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)

def device_center_x(clip, t):
    """x of the product's centre in a 1280x720 frame (dark-pixel bounding box), to aim the mobile crop."""
    cmd = [FF, '-hide_banner', '-loglevel', 'error', '-ss', str(t), '-i', S + clip, '-frames:v', '1', '-vf', 'format=gray', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    a = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.uint8).reshape(720, 1280)
    m = a < 34; m[:, :40] = m[:, -40:] = False; m[:40] = m[-40:] = False
    cols = np.where(m.sum(0) > 18)[0]
    return int(cols.min()), int(cols.max())

# ------------------------------------------------------------------ desktop
def desktop(out, D=1.8, X=0.25, END_FRAMES=66):
    W, H = 1280, 720
    for key, clip, name, tag in SHOTS:
        ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = ov.load()
        for y in range(H - 230, H):
            a = int(150 * ((y - (H - 230)) / 230) ** 1.6)
            for x in range(W): px[x, y] = (8, 9, 10, a)
        d = ImageDraw.Draw(ov); d.text((72, H - 168), name, font=semibold(60), fill=(255, 255, 255, 255))
        spaced(d, (75, H - 92), tag, mono(21), (70, 215, 185, 255), 3)
        lg = logo.resize((54, 54), Image.LANCZOS); lg.putalpha(lg.getchannel('A').point(lambda v: int(v * .9))); ov.alpha_composite(lg, (W - 126, H - 116))
        ov.save(f'{S}final/cap-d-{key}.png')
    inputs, fc = [], []
    for i, (key, clip, *_ ) in enumerate(SHOTS):
        inputs += ['-i', S + clip, '-loop', '1', '-t', str(D), '-i', f'{S}final/cap-d-{key}.png']
    inputs += ['-framerate', '24', '-i', S + 'end_wide/f%03d.png']
    for i, (key, clip, *_ ) in enumerate(SHOTS):
        st = START[key]
        fc += [f'[{2*i}:v]trim=start={st}:end={st+D},setpts=PTS-STARTPTS,fps=24,scale=1280:720,format=yuv420p[v{i}]',
               f'[{2*i+1}:v]format=rgba,fade=t=in:st=0.25:d=0.35:alpha=1,fade=t=out:st={D-0.45}:d=0.35:alpha=1[c{i}]',
               f'[v{i}][c{i}]overlay=0:0:shortest=1,format=yuv420p[s{i}]']
    fc.append(f'[8:v]trim=end_frame={END_FRAMES},setpts=PTS-STARTPTS,fps=24,scale=1280:720,format=yuv420p[end]')
    cur = 's0'
    for i in range(1, 4):
        fc.append(f'[{cur}][s{i}]xfade=transition=fade:duration={X}:offset={(D-X)*i:.3f}[x{i}]'); cur = f'x{i}'
    chain = 4 * D - 3 * X
    fc.append(f'[{cur}][end]xfade=transition=fade:duration=0.35:offset={chain-0.35:.3f}[outv]')
    run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[outv]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', '24', out])
    return chain - 0.35 + END_FRAMES / 24

# ------------------------------------------------------------------ mobile
def mobile(out, D=1.5, X=0.2, END_FRAMES=58):
    from endcard_anim import backdrop
    W, H = 720, 1280
    base = backdrop(W, H, .46); d = ImageDraw.Draw(base)
    lg = logo.resize((60, 60), Image.LANCZOS); base.alpha_composite(lg, (56, 66)); d.text((132, 72), 'Plotune Bridge', font=semibold(38), fill=(255, 255, 255, 255))
    base.convert('RGB').save(S + 'final/base-m.png')
    geo = {}
    for key, clip, *_ in SHOTS:
        mn, mx = device_center_x(clip, START[key] + D / 2)                     # product's left/right extent in the 1280 px frame
        cw = int(min(1280, max(960, (mx - mn) + 100))); cw -= cw % 2           # crop wide enough to keep the whole product
        wh = round(720 * 720 / cw); wh -= wh % 2                               # window height after scaling to 720 wide
        x0 = max(0, min(1280 - cw, (mn + mx) // 2 - cw // 2)); wy = 560 - wh // 2
        ys = np.arange(wh, dtype=np.float32); e = np.minimum(ys, wh - 1 - ys) / 85.0           # feather top and bottom into the studio backdrop
        m = (np.clip(e, 0, 1) ** 1.6 * 255).astype(np.uint8); Image.fromarray(np.repeat(m[:, None], W, 1), 'L').save(f'{S}final/mask-m-{key}.png')
        geo[key] = (x0, cw, wh, wy)
    inputs, fc = [], []
    for i, (key, clip, name, tag) in enumerate(SHOTS):
        ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(ov)
        dd.text((60, 900), name, font=semibold(66), fill=(255, 255, 255, 255)); spaced(dd, (63, 988), tag, mono(24), (70, 215, 185, 255), 3)
        for j in range(4):                                                      # progress: which product of four
            x0_ = 60 + j * 74; dd.rounded_rectangle((x0_, 1180, x0_ + (58 if j == i else 20), 1186), radius=3, fill=(70, 215, 185, 255) if j == i else (255, 255, 255, 70))
        ov.save(f'{S}final/cap-m-{key}.png')
        inputs += ['-i', S + clip, '-loop', '1', '-t', str(D), '-i', S + 'final/base-m.png', '-loop', '1', '-t', str(D), '-i', f'{S}final/mask-m-{key}.png', '-loop', '1', '-t', str(D), '-i', f'{S}final/cap-m-{key}.png']
    inputs += ['-framerate', '24', '-i', S + 'end_tall/f%03d.png']
    for i, (key, clip, *_ ) in enumerate(SHOTS):
        v, b, mk, c = 4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3
        x0, cw, wh, wy = geo[key]; st = START[key]
        fc += [f'[{v}:v]trim=start={st}:end={st+D},setpts=PTS-STARTPTS,fps=24,crop={cw}:720:{x0}:0,scale=720:{wh},format=yuv420p[a{i}]',
               f'[{mk}:v]format=gray[m{i}]', f'[a{i}][m{i}]alphamerge[am{i}]',
               f'[{b}:v]format=yuv420p[b{i}]', f'[b{i}][am{i}]overlay=0:{wy}:format=auto[o{i}]',
               f'[{c}:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st={D-0.4}:d=0.3:alpha=1[c{i}]',
               f'[o{i}][c{i}]overlay=0:0:shortest=1,fps=24,format=yuv420p[s{i}]']
    fc.append(f'[16:v]trim=end_frame={END_FRAMES},setpts=PTS-STARTPTS,fps=24,scale=720:1280,format=yuv420p[end]')
    cur = 's0'
    for i in range(1, 4):
        fc.append(f'[{cur}][s{i}]xfade=transition=fade:duration={X}:offset={(D-X)*i:.3f}[x{i}]'); cur = f'x{i}'
    chain = 4 * D - 3 * X
    fc.append(f'[{cur}][end]xfade=transition=fade:duration=0.3:offset={chain-0.3:.3f}[outv]')
    run([FF, '-hide_banner', '-loglevel', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[outv]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', '24', out])
    return chain - 0.3 + END_FRAMES / 24, geo

# ------------------------------------------------------------------ publish
def publish(dest=None):
    """WebM (smaller) + MP4 + poster for each cut, written to public/assets/bridge/video/ (or dest)."""
    dest = dest or os.path.join(PUBLIC, 'assets', 'bridge', 'video'); os.makedirs(dest, exist_ok=True)
    f = S + 'final/'
    def enc(*args): run([FF, '-hide_banner', '-loglevel', 'error', '-y', *args])
    # posters: a clean hero frame of the CAN shot (no caption), and a frame of the vertical cut with header + caption
    enc('-ss', '0.6', '-i', S + SHOTS[0][1], '-frames:v', '1', '-vf', 'scale=1280:720', '-q:v', '3', dest + '/bridge-family-poster.jpg')
    enc('-ss', '0.95', '-i', f + 'bridge-family-mobile.mp4', '-frames:v', '1', '-q:v', '3', dest + '/bridge-family-mobile-poster.jpg')
    for name, crf in (('bridge-family', '34'), ('bridge-family-mobile', '35')):
        shutil.copy(f + name + '.mp4', dest + '/' + name + '.mp4')
        enc('-i', f + name + '.mp4', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', crf, '-row-mt', '1', '-an', dest + '/' + name + '.webm')
    return dest

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'both'
    if which in ('desktop', 'both'): print('desktop expected length', round(desktop(S + 'final/bridge-family.mp4'), 2))
    if which in ('mobile', 'both'):
        n, geo = mobile(S + 'final/bridge-family-mobile.mp4'); print('mobile expected length', round(n, 2), '| crop (x0, width, window h, y):', geo)
    if which == 'publish': print('published to', publish(sys.argv[2] if len(sys.argv) > 2 else None))
