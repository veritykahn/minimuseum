/*
 * Wiping a slide with a cloth, on the photograph itself: these work on the
 * photo's own pixels, in the photo's pixels as units. Moon dust clings: the
 * cloth picks the dust up and smears it along its path, so the slide is
 * streaked rather than cleaned, and the cloth grays. Earth's grains are
 * pushed aside, to both sides of the cloth's path, leaving a clear lane of
 * glass, and the cloth stays clean. (The poster: lunar dust can "stick to
 * everything because of static electricity", and was "hard to clean off
 * their suits".)
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

/** Soft at the rim, full in the middle: how hard the cloth presses at a distance d of its radius r. */
const press = (d: number, r: number) => {
  const t = 1 - d / r;
  return t <= 0 ? 0 : t >= 0.35 ? 1 : t / 0.35;
};

const lum = (a: ArrayLike<number>, o: number) => a[o] + a[o + 1] + a[o + 2];

/** The lit glass of a bare slide. */
export const GLASS: [number, number, number] = [222, 216, 232];

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
 * Earth's grains: one step of the cloth from (x0, y0) to (x1, y1), no longer
 * than about a third of its radius. Whatever it meets is pushed out to the
 * sides of its path, and the glass under its middle is left clear. Returns
 * how many pixels it moved.
 */
export function brushAside(px: Pixels, x0: number, y0: number, x1: number, y1: number, r: number, limit: Limit = ALL): number {
  const { data, width, height } = px;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  // Which way is "aside": across the way the cloth is moving.
  const ux = len > 1e-6 ? dx / len : 1;
  const uy = len > 1e-6 ? dy / len : 0;
  const nx = -uy;
  const ny = ux;
  const core = r * 0.78;
  const R = Math.ceil(r);
  const cx = Math.round(x1);
  const cy = Math.round(y1);
  // What the cloth meets this step: under it now, and not under its middle last step.
  const moved: { k: number; rgb: [number, number, number] }[] = [];
  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const sx = cx + i;
      const sy = cy + j;
      if (sx < 0 || sy < 0 || sx >= width || sy >= height || sx < limit.x0 || sx >= limit.x1) continue;
      if (Math.hypot(i, j) > core) continue;
      if (len > 0 && Math.hypot(sx - x0, sy - y0) <= core) continue;
      const k = (sy * width + sx) * 4;
      // Out to the side it lies on, just past the cloth's edge, squeezed into a ridge.
      const side = (sx - x1) * nx + (sy - y1) * ny;
      const s = side < 0 ? -1 : 1;
      const out = core + Math.abs(side) * 0.4 + 1 - Math.abs(side);
      const tx = Math.round(sx + nx * s * out + ux * 1.5);
      const ty = Math.round(sy + ny * s * out + uy * 1.5);
      if (tx < 0 || ty < 0 || tx >= width || ty >= height || tx < limit.x0 || tx >= limit.x1) continue;
      moved.push({ k: (ty * width + tx) * 4, rgb: [data[k], data[k + 1], data[k + 2]] });
    }
  }
  // Clear the glass under the cloth's middle; a fine film is left behind.
  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const sx = cx + i;
      const sy = cy + j;
      if (sx < 0 || sy < 0 || sx >= width || sy >= height || sx < limit.x0 || sx >= limit.x1) continue;
      const d = Math.hypot(i, j);
      if (d > core) continue;
      const w = d > core - 3 ? 0.45 : 0.84;
      const k = (sy * width + sx) * 4;
      for (let c = 0; c < 3; c++) data[k + c] += (GLASS[c] - data[k + c]) * w;
    }
  }
  // And the grains land in a heap at the sides, a little shadowed where they pile.
  for (const m of moved) for (let c = 0; c < 3; c++) data[m.k + c] += (m.rgb[c] * 0.88 - data[m.k + c]) * 0.85;
  return moved.length;
}

/** How many pixels differ between two copies of a photo: a wiped slide and a fresh one. */
export function changed(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let n = 0;
  for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++;
  return n;
}
