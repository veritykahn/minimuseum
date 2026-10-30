/*
 * Wiping a slide with a cloth, on the photograph itself: these work on the
 * photo's own pixels, in the photo's pixels as units. Both wipe the glass
 * clean, but differently. Moon dust clings: the cloth lifts it off the glass
 * and keeps it, so the cloth grays the more it wipes. Earth's grains are
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

/** The cloth's own color: white suit cloth. */
export const CLOTH: [number, number, number] = [243, 240, 250];

export function newBrush(r: number): Brush {
  const rr = Math.max(2, Math.round(r));
  const size = rr * 2 + 1;
  const rgb = new Float32Array(size * size * 3);
  for (let i = 0; i < rgb.length; i += 3) rgb.set(CLOTH, i);
  return { r: rr, size, rgb, loaded: false, dust: 0 };
}

/** Soft at the rim, full in the middle: how hard the cloth presses at a distance d of its radius r (eased, so no edge shows). */
const press = (d: number, r: number) => {
  const t = Math.min(1, Math.max(0, (1 - d / r) / 0.45));
  return t * t * (3 - 2 * t);
};

const lum = (a: ArrayLike<number>, o: number) => a[o] + a[o + 1] + a[o + 2];

/**
 * Moon dust: one dab of the cloth at (x, y). The cloth lifts the dust off the
 * glass, down toward the lamp's light, and keeps it: what it takes darkens
 * the cloth where it touched. A few dabs over the same place leave it clean.
 * Returns how much dust it lifted, 0 to 1.
 */
export function lift(px: Pixels, b: Brush, x: number, y: number, limit: Limit = ALL): number {
  const { data, width, height } = px;
  const cx = Math.round(x);
  const cy = Math.round(y);
  let took = 0;
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
      const g = lamp(pxx, py, width, height);
      // How much darker than bare glass this pixel is: the dust on it.
      const dust = Math.max(0, (lum(g, 0) - lum(data, k)) / lum(g, 0));
      const take = w * 0.6;
      for (let c = 0; c < 3; c++) {
        const under = data[k + c];
        data[k + c] = under + (g[c] - under) * take;
        // The cloth takes on the dust's color, as much as there was dust to take.
        b.rgb[q + c] += (under - b.rgb[q + c]) * dust * take * 0.35;
      }
      took += dust * take;
      n += w;
    }
  }
  b.loaded = true;
  const t = n ? Math.min(1, took / n) : 0;
  // The cloth grays with every dab over the dust.
  b.dust = Math.min(1, b.dust + t * 0.02);
  return t;
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

/** Bare, lamp-lit glass: every pixel of a photo set to the light under a clean slide. */
export function paintClean(px: Pixels): void {
  const { data, width, height } = px;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const g = lamp(x, y, width, height);
      const k = (y * width + x) * 4;
      data[k] = g[0];
      data[k + 1] = g[1];
      data[k + 2] = g[2];
      data[k + 3] = 255;
    }
  }
}

/** A part of a photo, in its pixels. */
export type Rect = { x0: number; y0: number; x1: number; y1: number };

/**
 * How clean a slide is, 0 to 1: the share of its pixels within a little of
 * bare lamp-lit glass. Looks at every `step`th pixel each way, for speed;
 * only inside `rect` when given (the part of the slide in view).
 */
export function cleanness(px: Pixels, step = 4, rect?: Rect): number {
  const { data, width, height } = px;
  const x0 = Math.max(0, Math.floor(rect?.x0 ?? 0));
  const y0 = Math.max(0, Math.floor(rect?.y0 ?? 0));
  const x1 = Math.min(width, Math.ceil(rect?.x1 ?? width));
  const y1 = Math.min(height, Math.ceil(rect?.y1 ?? height));
  let clean = 0;
  let n = 0;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const g = lamp(x, y, width, height);
      const k = (y * width + x) * 4;
      const d = Math.abs(data[k] - g[0]) + Math.abs(data[k + 1] - g[1]) + Math.abs(data[k + 2] - g[2]);
      if (d < 45) clean++;
      n++;
    }
  }
  return n ? clean / n : 1;
}

/** One grain of a sample being placed: where it lands (0 to 1 across the slide), how big, when, and from how high. */
export type Grain = { x: number; y: number; r: number; delay: number; drop: number; spin: number };

/**
 * The grains of a sample tipped onto a slide: a jittered grid that covers
 * the whole slide, so that once they have settled the photograph shows
 * through everywhere. Starts near the middle first, as a sample poured from a
 * spatula would. Seeded, so the same every time.
 */
export function settleGrains(across = 14, seed = 7): Grain[] {
  let s = seed >>> 0 || 1;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const cell = 1 / across;
  const grains: Grain[] = [];
  for (let j = 0; j < across; j++) {
    for (let i = 0; i < across; i++) {
      const x = (i + 0.2 + rand() * 0.6) * cell;
      const y = (j + 0.2 + rand() * 0.6) * cell;
      const fromMiddle = Math.hypot(x - 0.5, y - 0.5) / 0.71;
      grains.push({
        x,
        y,
        r: cell * (0.75 + rand() * 0.35),
        delay: Math.min(0.62, fromMiddle * 0.5 + rand() * 0.14),
        drop: 0.12 + rand() * 0.22,
        spin: (rand() - 0.5) * 1.4,
      });
    }
  }
  return grains;
}

/**
 * A fresh glass slide straight from the box, n × n: lamp-lit glass with a
 * little dirt on it, to be wiped off before a sample goes on. Specks of dust
 * all over, a few soft greasy smudges, and a fingerprint near the middle,
 * its ridges in rings. Seeded, so the same every time.
 */
export function smudgedGlass(n = 360, seed = 11): Pixels {
  let s = seed >>> 0 || 1;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  // How dark the dirt is at each pixel, 0 to 1.
  const dirt = new Float32Array(n * n);
  const add = (i: number, d: number) => (dirt[i] = 1 - (1 - dirt[i]) * (1 - Math.min(1, d)));

  // Smudges: soft, streaky ovals where a thumb has rubbed the glass.
  for (let k = 0; k < 7; k++) {
    const cx = n * (0.2 + rand() * 0.6);
    const cy = n * (0.2 + rand() * 0.6);
    const a = n * (0.12 + rand() * 0.1);
    const b = a * (0.45 + rand() * 0.3);
    const t = rand() * Math.PI;
    const depth = 0.16 + rand() * 0.08;
    const c = Math.cos(t);
    const sn = Math.sin(t);
    for (let y = Math.max(0, Math.floor(cy - a)); y < Math.min(n, cy + a); y++) {
      for (let x = Math.max(0, Math.floor(cx - a)); x < Math.min(n, cx + a); x++) {
        const u = ((x - cx) * c + (y - cy) * sn) / a;
        const v = (-(x - cx) * sn + (y - cy) * c) / b;
        const r = u * u + v * v;
        if (r >= 1) continue;
        const soft = (1 - r) * (1 - r);
        const streak = 0.75 + 0.25 * Math.sin(v * 9 + u * 2);
        add(y * n + x, depth * soft * streak * 1.6);
      }
    }
  }

  // A fingerprint: rings of ridges in an oval, fading at its rim.
  const fx = n * 0.52;
  const fy = n * 0.46;
  const fa = n * 0.2;
  const fb = n * 0.26;
  const period = n / 42;
  for (let y = Math.max(0, Math.floor(fy - fb)); y < Math.min(n, fy + fb); y++) {
    for (let x = Math.max(0, Math.floor(fx - fa)); x < Math.min(n, fx + fa); x++) {
      const r = Math.hypot((x - fx) / fa, (y - fy) / fb);
      if (r >= 1) continue;
      const d = Math.hypot((x - fx) * 1.15, y - fy);
      const ridge = 0.5 + 0.5 * Math.cos((d / period) * Math.PI * 2 + Math.sin((x - fx) / (n * 0.05)) * 0.8);
      const env = Math.min(1, (1 - r) / 0.25);
      add(y * n + x, 0.34 * ridge * env);
    }
  }

  // Dust: specks scattered across the glass.
  const specks = Math.round((n * n) / 700);
  for (let k = 0; k < specks; k++) {
    const cx = rand() * n;
    const cy = rand() * n;
    const r = 0.8 + rand() * rand() * 3.2;
    const depth = 0.35 + rand() * 0.45;
    for (let y = Math.max(0, Math.floor(cy - r - 1)); y < Math.min(n, cy + r + 1); y++) {
      for (let x = Math.max(0, Math.floor(cx - r - 1)); x < Math.min(n, cx + r + 1); x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d < r + 0.8) add(y * n + x, depth * Math.min(1, r + 0.8 - d));
      }
    }
  }

  // The dirt is a gray-brown film over the lamp's light.
  const tint = [118, 110, 104];
  const data = new Uint8ClampedArray(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      const g = lamp(x, y, n, n);
      const d = dirt[i];
      for (let c = 0; c < 3; c++) data[i * 4 + c] = g[c] - (g[c] - tint[c]) * d;
      data[i * 4 + 3] = 255;
    }
  }
  return { data, width: n, height: n };
}
