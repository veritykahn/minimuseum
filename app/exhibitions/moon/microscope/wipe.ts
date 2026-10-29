/*
 * Wiping a slide with a cloth, on the photograph itself: these work on the
 * photo's own pixels, in the photo's pixels as units. Moon dust clings: the
 * cloth picks the dust up and smears it along its path, so the slide is
 * streaked rather than cleaned, and the cloth grays. Earth's grains are
 * pushed aside, to both sides of the cloth's path, leaving a clear lane of
 * lamp-lit glass, and the cloth stays clean. (The poster: lunar dust can
 * "stick to everything because of static electricity", and was "hard to
 * clean off their suits".)
 */

/** A photo's pixels, RGBA, as a canvas's ImageData holds them. */
export type Pixels = { data: Uint8ClampedArray; width: number; height: number };

/** The part of the photo a wipe may touch: one side of the line, side by side. */
export type Limit = { x0: number; x1: number };

const ALL: Limit = { x0: -Infinity, x1: Infinity };

/** What the cloth is carrying: the colors it has picked up, around its middle, and how gray it has gone. */
export type Brush = { r: number; size: number; rgb: Float32Array; loaded: boolean; dust: number };

export function newBrush(r: number): Brush {
  const rr = Math.max(2, Math.round(r));
  const size = rr * 2 + 1;
  return { r: rr, size, rgb: new Float32Array(size * size * 3), loaded: false, dust: 0 };
}

/** Soft at the rim, full in the middle: how hard the cloth presses at a distance d of its radius r (eased, so no edge shows). */
const press = (d: number, r: number) => {
  const t = Math.min(1, Math.max(0, (1 - d / r) / 0.45));
  return t * t * (3 - 2 * t);
};

const lum = (a: ArrayLike<number>, o: number) => a[o] + a[o + 1] + a[o + 2];

/**
 * Moon dust: one dab of the cloth at (x, y). Where the cloth is loaded it
 * leaves some of what it carries, then picks up what lies under it, so dark
 * dust is dragged into streaks. Returns how much dust it picked up, 0 to 1.
 */
export function smear(px: Pixels, b: Brush, x: number, y: number, limit: Limit = ALL): number {
  const { data, width, height } = px;
  const cx = Math.round(x);
  const cy = Math.round(y);
  let dark = 0;
  let n = 0;
  for (let j = -b.r; j <= b.r; j++) {
    const py = cy + j;
    if (py < 0 || py >= height) continue;
    for (let i = -b.r; i <= b.r; i++) {
      const pxx = cx + i;
      if (pxx < 0 || pxx >= width || pxx < limit.x0 || pxx >= limit.x1) continue;
      const w = press(Math.hypot(i, j), b.r);
      if (w <= 0) continue;
      const k = (py * width + pxx) * 4;
      const q = ((j + b.r) * b.size + (i + b.r)) * 3;
      // Dark dust is left freely on the pale glass; little of the glass's light is left on the grains.
      const darker = b.loaded && lum(b.rgb, q) < lum(data, k);
      const leave = w * (darker ? 0.42 : 0.1);
      for (let c = 0; c < 3; c++) {
        const under = data[k + c];
        const held = b.loaded ? b.rgb[q + c] : under;
        // Leave some, then take some up.
        const left = under + (held - under) * leave;
        data[k + c] = left;
        b.rgb[q + c] = held + (left - held) * w * 0.22;
      }
      dark += (255 - (data[k] + data[k + 1] + data[k + 2]) / 3) * w;
      n += w;
    }
  }
  b.loaded = true;
  const took = n ? Math.min(1, dark / n / 255) : 0;
  // The cloth grays a little with every dab over the dust.
  b.dust = Math.min(1, b.dust + took * 0.008);
  return took;
}

/**
 * The bright-field light under a bare slide, at (x, y) in a photo w × h:
 * warm white, brightest in the middle of the lamp, a little dimmer out
 * toward the edge of the field.
 */
export function lamp(x: number, y: number, w: number, h: number): [number, number, number] {
  const t = Math.min(1, Math.hypot(x - w / 2, y - h / 2) / (Math.max(w, h) * 0.72));
  const k = t * t;
  return [250 - k * 34, 246 - k * 38, 236 - k * 44];
}

/**
 * What the cloth has done to each pixel of a photo, kept between steps so
 * going over a place again never hardens its edge: how clear the glass is
 * (the first half, 0 to 255), and how deep the shadow of a heap beside the
 * lane (the second half).
 */
export function newMask(px: Pixels): Uint8Array {
  return new Uint8Array(px.width * px.height * 2);
}

/** A small, stable hash of a cell: decides where a stray grain stays behind in the lane. */
const cellHash = (cx: number, cy: number) => {
  let h = Math.imul(cx, 374761393) ^ Math.imul(cy, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const STRAY_CELL = 30;

/** How much of a pixel stays put, as a stray grain the cloth missed: 0 for most of the lane. */
function stray(x: number, y: number) {
  const cx = Math.floor(x / STRAY_CELL);
  const cy = Math.floor(y / STRAY_CELL);
  const h = cellHash(cx, cy);
  if (h > 0.035) return 0;
  // One small round grain somewhere in the cell.
  const gx = (cx + 0.25 + cellHash(cy, cx) * 0.5) * STRAY_CELL;
  const gy = (cy + 0.25 + cellHash(cx + 7, cy - 3) * 0.5) * STRAY_CELL;
  const r = 6 + h * 120;
  const d = Math.hypot(x - gx, y - gy);
  return d >= r ? 0 : d < r - 1.5 ? 1 : (r - d) / 1.5;
}

/**
 * Earth's grains: one step of the cloth from (x0, y0) to (x1, y1), no longer
 * than about a third of its radius. Under the cloth's middle the grains are
 * swept off, down to the lamp-lit glass, with a soft, feathered edge and a
 * few strays left behind; what it sweeps off heaps up just past both edges
 * of its path, the grains there shadowed where they pile. `mask` remembers how clear each pixel
 * already is (newMask). Returns how much it swept.
 */
export function brushAside(px: Pixels, mask: Uint8Array, x0: number, y0: number, x1: number, y1: number, r: number, limit: Limit = ALL): number {
  const { data, width, height } = px;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  // Which way is "aside": across the way the cloth is moving.
  const ux = len > 1e-6 ? dx / len : 1;
  const uy = len > 1e-6 ? dy / len : 0;
  const nx = -uy;
  const ny = ux;
  const core = r * 0.8;
  const feather = Math.max(4, r * 0.32);
  const R = Math.ceil(core);
  const cx = Math.round(x1);
  const cy = Math.round(y1);
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && x >= limit.x0 && x < limit.x1;
  const heap: { x: number; y: number; a: number; rgb: [number, number, number] }[] = [];
  let swept = 0;

  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const sx = cx + i;
      const sy = cy + j;
      if (!inside(sx, sy)) continue;
      const d = Math.hypot(i, j);
      if (d > core) continue;
      // Full in the middle, feathering to nothing at the rim.
      const e = Math.min(1, (core - d) / feather);
      let want = e * e * (3 - 2 * e);
      want *= 1 - 0.95 * stray(sx, sy);
      const p = sy * width + sx;
      const m = mask[p] / 255;
      if (want <= m + 0.004) continue;
      const k = p * 4;
      const g = lamp(sx, sy, width, height);
      // What lies here now is mix(grains, glass, m); clear it on to `want`.
      const keep = (1 - want) / (1 - m);
      const rgb: [number, number, number] = [0, 0, 0];
      for (let c = 0; c < 3; c++) {
        const under = m < 0.999 ? (data[k + c] - g[c] * m) / (1 - m) : g[c];
        rgb[c] = under;
        data[k + c] = g[c] + (data[k + c] - g[c]) * keep;
      }
      mask[p] = Math.round(want * 255);
      const moved = want - m;
      swept += moved;
      // The swept grains go out to the side they lie on, just past the edge, and a little ahead.
      const side = (sx - x1) * nx + (sy - y1) * ny;
      const s = side < 0 ? -1 : 1;
      const out = core + feather * (0.15 + 0.7 * cellHash(sx, sy)) - Math.abs(side);
      heap.push({ x: sx + nx * s * out + ux * 2, y: sy + ny * s * out + uy * 2, a: moved, rgb });
    }
  }

  // The heaps: a little of what was swept lands just past each edge, spread soft...
  for (const h of heap) {
    const hx = Math.round(h.x);
    const hy = Math.round(h.y);
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const tx = hx + i;
        const ty = hy + j;
        if (!inside(tx, ty)) continue;
        const p = ty * width + tx;
        const a = h.a * (i === 0 && j === 0 ? 0.07 : 0.03);
        const k = p * 4;
        for (let c = 0; c < 3; c++) data[k + c] += (h.rgb[c] - data[k + c]) * a;
        // Grains heaped on the glass cover it again.
        mask[p] = Math.round(mask[p] * (1 - a));
      }
    }
  }
  // ...and the grains already there, now heaped higher, fall into shadow toward the lane, fading outward.
  const n = width * height;
  const Rs = Math.ceil(core + feather);
  for (let j = -Rs; j <= Rs; j++) {
    for (let i = -Rs; i <= Rs; i++) {
      const sx = cx + i;
      const sy = cy + j;
      if (!inside(sx, sy)) continue;
      const d = Math.hypot(i, j);
      if (d < core - feather * 0.4 || d > core + feather) continue;
      // Beside the path, not ahead of it or behind.
      const across = Math.abs((sx - x1) * nx + (sy - y1) * ny) / Math.max(1, d);
      const t = 1 - Math.abs(d - (core + feather * 0.1)) / (feather * 0.9);
      if (t <= 0) continue;
      const p = sy * width + sx;
      const want = 0.2 * t * t * across * (1 - mask[p] / 255);
      const had = mask[n + p] / 255;
      if (want <= had + 0.004) continue;
      const k = p * 4;
      const f = (1 - want) / (1 - had);
      for (let c = 0; c < 3; c++) data[k + c] *= f;
      mask[n + p] = Math.round(want * 255);
    }
  }
  return swept;
}

/** How many pixels differ between two copies of a photo: a wiped slide and a fresh one. */
export function changed(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let n = 0;
  for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++;
  return n;
}
