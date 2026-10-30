/*
 * The signing room's drawing: the quill's broad nib and the ink it carries.
 * Pure functions, so they can be tested and shared by the live canvas and the
 * parchment's signatures (SVG).
 */

/** A point of a signature, in the signature box: x from 0 to 1, y from 0 to SIG_ASPECT. */
export type Pt = { x: number; y: number; /** The ink's strength as written (0 where a dry quill skipped). */ a?: number };
export type Stroke = Pt[];

/** The signature box's height for a width of 1. */
export const SIG_ASPECT = 0.3;
/** The nib's edge, as a share of the box's width, and its angle (a broad nib held at 40°). */
export const NIB = { width: 0.014, angle: (-40 * Math.PI) / 180, hairline: 0.0018 };
/** How far one dip of ink writes, in box widths. */
export const INK_PER_DIP = 3.2;

const r1 = (n: number) => Math.round(n * 10) / 10;

/** The length of a stroke, in box widths. */
export function strokeLength(s: Stroke) {
  let d = 0;
  for (let i = 1; i < s.length; i++) d += Math.hypot(s[i].x - s[i - 1].x, s[i].y - s[i - 1].y);
  return d;
}

/** How much ink is left after writing `length` box widths from a full quill (0 to 1). */
export function inkAfter(level: number, length: number) {
  return Math.max(0, level - length / INK_PER_DIP);
}

/** The ink's strength for the quill's level: full and dark, then thinning to a dry scratch. */
export function inkAlpha(level: number) {
  if (level <= 0) return 0.06;
  return Math.min(0.92, 0.18 + 0.8 * Math.sqrt(level));
}

/**
 * The mark of a broad nib drawn from a to b: the parallelogram its edge
 * sweeps. Up-and-down strokes come out broad, strokes along the nib hairline,
 * as with a quill. Corners in the units of a and b, scaled by `scale`.
 */
export function nibQuad(a: Pt, b: Pt, scale: number, width = NIB.width): [number, number][] {
  const hx = (Math.cos(NIB.angle) * width) / 2;
  const hy = (Math.sin(NIB.angle) * width) / 2;
  return [
    [(a.x - hx) * scale, (a.y - hy) * scale],
    [(a.x + hx) * scale, (a.y + hy) * scale],
    [(b.x + hx) * scale, (b.y + hy) * scale],
    [(b.x - hx) * scale, (b.y - hy) * scale],
  ];
}

/** The whole signature as one SVG path of nib marks, in a box `scale` wide. */
export function nibPath(strokes: Stroke[], scale: number) {
  let d = '';
  for (const s of strokes) {
    if (s.length === 1) {
      const q = nibQuad(s[0], { x: s[0].x + 0.002, y: s[0].y + 0.002 }, scale);
      d += `M${q.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`;
    }
    for (let i = 1; i < s.length; i++) {
      if (s[i].a === 0) continue;
      const q = nibQuad(s[i - 1], s[i], scale);
      d += `M${q.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`;
    }
  }
  return d;
}

/**
 * Thin a stroke for storing and copying: drop points closer than `min` to
 * the last one kept (a fast hand gives few points, a slow one many).
 */
export function thin(s: Stroke, min = 0.003): Stroke {
  if (s.length < 3) return s;
  const out: Stroke = [s[0]];
  for (let i = 1; i < s.length - 1; i++) {
    const l = out[out.length - 1];
    if (Math.hypot(s[i].x - l.x, s[i].y - l.y) >= min) out.push(s[i]);
  }
  out.push(s[s.length - 1]);
  return out;
}
