"""Cut a product out of its studio render (for the end card).

The backdrop is a smooth gradient, so it is modelled from the image border; what differs from it is the
product. The silhouette is the convex hull of the confidently-dark blob (a box-shaped product is convex),
filled with everything that differs from the backdrop inside it. Outside the silhouette the render's own
ground shadow is rebuilt as soft black with fading alpha, so it sits on any floor with no visible slab.

usage: cutout.py NAME INPUT.png [x0 y0 x1 y1]     -> $BRIDGE_VIDEO_WORK/cut/NAME_v2.png
"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

def cutout2(img, strict=24, weak=12):
    """Silhouette = convex hull of the confidently-dark blob (a box-shaped product is convex), filled with
    everything that differs from the backdrop inside it. Outside the silhouette, the old ground shadow is
    rebuilt as soft black with fading alpha, so it sits on any floor without a visible slab edge."""
    from scipy.spatial import ConvexHull
    from PIL import ImageDraw
    a = np.asarray(img.convert('RGB'), dtype=np.float32); H, W, _ = a.shape
    yy, xx = np.mgrid[0:H, 0:W]; x = xx / W - .5; y = yy / H - .5
    ring = np.zeros((H, W), bool); b = max(3, int(min(H, W) * .035))
    ring[:b] = ring[-b:] = True; ring[:, :b] = ring[:, -b:] = True
    A = np.stack([np.ones_like(x), x, y, x * x, x * y, y * y, x**3, y**3, x * x * y, x * y * y], -1)
    bg = np.zeros_like(a)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A[ring], a[..., c][ring], rcond=None); bg[..., c] = A @ coef
    diff = np.abs(a - bg).max(-1)
    def biggest(m):
        lab, n = ndi.label(m); size = ndi.sum(m, lab, range(1, n + 1)); return lab == (1 + int(np.argmax(size)))
    s = biggest(ndi.binary_opening(ndi.binary_closing(diff > strict, iterations=3), iterations=3))
    pts = np.argwhere(s)[::7][:, ::-1]                      # (x, y) samples of the strict blob
    hull = ConvexHull(pts); poly = [tuple(pts[i]) for i in hull.vertices]
    hm = Image.new('L', (W, H), 0); ImageDraw.Draw(hm).polygon(poly, fill=255); hullmask = np.asarray(hm) > 0
    wk = biggest(ndi.binary_closing(diff > weak, iterations=3))
    core = ndi.binary_fill_holes((hullmask & wk) | s)
    core = ndi.binary_opening(core, iterations=2)
    d_in = ndi.distance_transform_edt(core); d_out = ndi.distance_transform_edt(~core)
    alpha_core = ndi.gaussian_filter(np.clip(0.5 + (d_in - d_out) / 4.0, 0, 1), 0.8)
    # rebuilt shadow: darkness relative to the backdrop, outside the silhouette, fading with distance
    lum = a.mean(-1); bgl = np.maximum(bg.mean(-1), 1)
    dark = np.clip((bgl - lum) / bgl, 0, 1)
    outside = wk & ~ndi.binary_dilation(core, iterations=2)
    fade = np.clip(1 - d_out / 70.0, 0, 1) ** 1.5
    sh = ndi.gaussian_filter(np.where(outside, dark, 0) * fade, 5) * 0.9
    sh = np.clip(sh * (1 - alpha_core), 0, 1)
    rgb = a * alpha_core[..., None] / np.maximum(alpha_core[..., None] + sh[..., None], 1e-3)
    rgb = np.where((alpha_core + sh)[..., None] > 0, a * (alpha_core / np.maximum(alpha_core + sh, 1e-3))[..., None], 0)
    alpha = np.clip(alpha_core + sh, 0, 1)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA'); bbox = im.getchannel('A').point(lambda v: 255 if v > 6 else 0).getbbox()
    return im.crop(bbox)


if __name__ == '__main__':
    name, path = sys.argv[1], sys.argv[2]
    box = tuple(int(v) for v in sys.argv[3:7]) if len(sys.argv) >= 7 else None
    work = os.environ.get('BRIDGE_VIDEO_WORK', os.path.join(os.getcwd(), 'work'))
    os.makedirs(work + '/cut', exist_ok=True)
    img = Image.open(path).convert('RGB')
    if box: img = img.crop(box)
    out = cutout2(img); out.save(f'{work}/cut/{name}_v2.png'); print(name, img.size, '->', out.size)
