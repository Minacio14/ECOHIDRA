"""Render a stylised shaded-relief image with a DEM-derived river network (teal palette)."""
import sys, time, heapq
import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.windows import from_bounds
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

SRC = sys.argv[1]
OUT = sys.argv[2]
W_OUT = int(sys.argv[3])                    # output width in px
BOUNDS = tuple(float(x) for x in sys.argv[4].split(','))  # west,south,east,north
THRESH = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0012   # fraction of max log-acc used as river threshold
t0 = time.time()

with rasterio.open(SRC) as r:
    win = from_bounds(*BOUNDS, transform=r.transform)
    aspect = (BOUNDS[2] - BOUNDS[0]) / (BOUNDS[3] - BOUNDS[1])
    h_out = int(round(W_OUT / aspect))
    dem = r.read(1, window=win, out_shape=(h_out, W_OUT), resampling=Resampling.average).astype('float64')
H, W = dem.shape
print('dem', dem.shape, dem.min(), dem.max(), round(time.time() - t0, 1), 's')

lat_mid = (BOUNDS[1] + BOUNDS[3]) / 2
dx = (BOUNDS[2] - BOUNDS[0]) / W * 111320 * np.cos(np.radians(lat_mid))
dy = (BOUNDS[3] - BOUNDS[1]) / H * 110574

# ---- hillshade (two light sources for depth)
z = ndi.gaussian_filter(dem, 1.0)
gy, gx = np.gradient(z, dy, dx)
ve = 2.2
slope = np.arctan(ve * np.hypot(gx, gy))
asp = np.arctan2(-gx, gy)
def shade(az, alt):
    az = np.radians(az); alt = np.radians(alt)
    return np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - asp), 0, 1)
hs = 0.65 * shade(315, 38) + 0.35 * shade(45, 55)

# ---- colour by elevation (dark lowlands -> teal -> pale highlands)
lo, hi = np.percentile(z, 2), np.percentile(z, 99.5)
t = np.clip((z - lo) / (hi - lo), 0, 1) ** 0.85
stops = np.array([0.0, 0.35, 0.7, 1.0])
cols = np.array([[3, 24, 30], [10, 62, 70], [30, 130, 134], [207, 231, 228]], dtype=float)
rgb = np.stack([np.interp(t, stops, cols[:, i]) for i in range(3)], axis=-1)
shade_f = (0.30 + 0.85 * hs)[..., None]
img = np.clip(rgb * shade_f, 0, 255)

# ---- depression filling (priority flood) + D8 flow accumulation
fz = z.copy()
filled = np.full_like(fz, np.inf)
closed = np.zeros(fz.shape, bool)
heap = []
for i in range(H):
    for j in (0, W - 1):
        heapq.heappush(heap, (fz[i, j], i, j)); closed[i, j] = True
for j in range(W):
    for i in (0, H - 1):
        if not closed[i, j]:
            heapq.heappush(heap, (fz[i, j], i, j)); closed[i, j] = True
nb = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
eps = 1e-3
while heap:
    e, i, j = heapq.heappop(heap)
    filled[i, j] = e
    for di, dj in nb:
        a, b = i + di, j + dj
        if 0 <= a < H and 0 <= b < W and not closed[a, b]:
            closed[a, b] = True
            heapq.heappush(heap, (max(fz[a, b], e + eps), a, b))
print('filled', round(time.time() - t0, 1), 's')

best = np.zeros((H, W)); down = np.full((H, W), -1, dtype=np.int64)
idx = np.arange(H * W).reshape(H, W)
pad = np.pad(filled, 1, constant_values=-np.inf)
for di, dj in nb:
    nbz = pad[1 + di:1 + di + H, 1 + dj:1 + dj + W]
    dist = np.hypot(di * dy, dj * dx)
    drop = (filled - nbz) / dist
    nidx = np.pad(idx, 1, constant_values=-1)[1 + di:1 + di + H, 1 + dj:1 + dj + W]
    better = drop > best
    best = np.where(better, drop, best)
    down = np.where(better, nidx, down)
order = np.argsort(-filled.ravel(), kind='stable')
acc = np.ones(H * W)
dflat = down.ravel()
for k in order:
    d = dflat[k]
    if d >= 0:
        acc[d] += acc[k]
acc = acc.reshape(H, W)
print('acc', acc.max(), round(time.time() - t0, 1), 's')

# ---- river layer
la = np.log(acc)
la = (la - np.log(30)) / (la.max() - np.log(30))
core = np.clip((la - THRESH * 0) / 1.0, 0, 1)
river = np.where(acc > np.exp(np.log(30) + THRESH * 0 + 0.30 * (np.log(acc.max()) - np.log(30))), core, 0)
river = river ** 1.2
# thicken the big rivers
thick = np.maximum(river, ndi.grey_dilation(river, size=(3, 3)) * 0.9)
big = ndi.grey_dilation(np.where(la > 0.62, 1.0, 0.0), size=(3, 3))
thick = np.maximum(thick, big)
m = Image.fromarray((np.clip(thick, 0, 1) * 255).astype('uint8'))
glow1 = np.asarray(m.filter(ImageFilter.GaussianBlur(5)), float) / 255
glow2 = np.asarray(m.filter(ImageFilter.GaussianBlur(16)), float) / 255
sharp = np.asarray(m, float) / 255
aqua = np.array([79, 209, 197.]); white = np.array([200, 255, 248.])
out = img * (1 - 0.55 * np.clip(glow2 * 1.4, 0, 1)[..., None]) + aqua * (0.55 * np.clip(glow2 * 1.4, 0, 1))[..., None]
out = out * (1 - np.clip(glow1, 0, 1)[..., None] * 0.7) + aqua * (np.clip(glow1, 0, 1)[..., None] * 0.7)
out = out * (1 - sharp[..., None]) + (aqua * 0.45 + white * 0.55) * sharp[..., None]
out = np.clip(out, 0, 255).astype('uint8')

# vignette to help text legibility / depth
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.35 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
out = np.clip(out * vig[..., None], 0, 255).astype('uint8')
Image.fromarray(out).save(OUT)
print('saved', OUT, round(time.time() - t0, 1), 's')
