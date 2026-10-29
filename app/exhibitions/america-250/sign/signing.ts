/*
 * The signing room's drawing: the quill's broad nib, the ink it carries, and
 * the sheet's lines of handwriting, which are drawn, not written (no word of
 * them can be read, so none of them claims to be the Declaration's text).
 * Pure functions, so they can be tested and shared by the live canvas and the
 * copies (SVG).
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

/** A small, stable random number generator (mulberry32), so a sheet looks the same every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
 * The signature's centre line as a smooth SVG path, in a box `scale` wide,
 * as a copyist or an engraver would trace it: each point nudged by up to
 * `wobble` box widths (0 for a faithful trace).
 */
export function tracePath(strokes: Stroke[], scale: number, wobble = 0, seed = 7) {
  const rand = rng(seed);
  let d = '';
  for (const s of strokes) {
    const p = s.map((q) => ({ x: (q.x + (rand() - 0.5) * wobble) * scale, y: (q.y + (rand() - 0.5) * wobble) * scale }));
    if (!p.length) continue;
    d += `M${r1(p[0].x)} ${r1(p[0].y)}`;
    if (p.length === 1) {
      d += `l0.5 0.5`;
      continue;
    }
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2;
      const my = (p[i].y + p[i + 1].y) / 2;
      d += `Q${r1(p[i].x)} ${r1(p[i].y)} ${r1(mx)} ${r1(my)}`;
    }
    const last = p[p.length - 1];
    d += `L${r1(last.x)} ${r1(last.y)}`;
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

/**
 * A line of handwriting that cannot be read: joined humps, loops and tails
 * (like m, e, l and g) in words, leaning as a pen hand leans, from x to
 * x + width on the baseline y, with an x-height of xh. A copyist's neat hand
 * has little `wobble`; a draft's more.
 */
export function scribbleLine(seed: number, x: number, y: number, width: number, xh: number, wobble = 0.15, slant = 0.32) {
  const rand = rng(seed);
  const end = x + width;
  const step = xh * 0.62;
  // A point, leaned: the higher above the baseline, the further right.
  const p = (px: number, py: number) => `${r1(px + (y - py) * slant)} ${r1(py)}`;
  let d = '';
  let cx = x;
  while (cx < end - step * 2) {
    const letters = 2 + Math.floor(rand() * 6);
    let px = cx;
    d += `M${p(px, y)}`;
    for (let i = 0; i < letters && px < end - step; i++) {
      const kind = rand();
      const w = step * (0.8 + rand() * 0.5);
      const j = () => (rand() - 0.5) * xh * wobble;
      if (kind < 0.16) {
        // an ascender, looped (l, h, d)
        const top = y - xh * (2.1 + rand() * 0.5);
        d += `C${p(px + w * 0.9, top + xh * 0.5)} ${p(px + w * 0.3, top)} ${p(px + w * 0.35, top + j())}`;
        d += `C${p(px + w * 0.4, y - xh)} ${p(px + w * 0.45, y)} ${p(px + w, y + j())}`;
      } else if (kind < 0.26) {
        // a descender, looped (g, y, p)
        const bot = y + xh * (1.2 + rand() * 0.4);
        d += `C${p(px + w * 0.2, y - xh)} ${p(px + w * 0.8, y - xh)} ${p(px + w * 0.7, y)}`;
        d += `C${p(px + w * 0.6, bot)} ${p(px + w * 0.05, bot)} ${p(px + w, y - xh * 0.3 + j())}`;
      } else if (kind < 0.45) {
        // a small loop (e)
        d += `C${p(px + w * 0.8, y - xh * 0.3)} ${p(px + w * 0.7, y - xh * 1.05)} ${p(px + w * 0.35, y - xh * 0.75)}`;
        d += `C${p(px + w * 0.1, y - xh * 0.3)} ${p(px + w * 0.5, y + j())} ${p(px + w, y - xh * 0.15)}`;
      } else {
        // a hump (n, m)
        const h = xh * (0.85 + rand() * 0.3) + j();
        d += `C${p(px + w * 0.05, y - h)} ${p(px + w * 0.75, y - h * 1.05)} ${p(px + w * 0.8, y + j())}`;
        d += `L${p(px + w, y - xh * 0.1)}`;
      }
      px += w;
    }
    cx = px + step * (1.1 + rand() * 0.8);
  }
  return d;
}

/** A block of handwritten lines: `lines` baselines from y, `gap` apart, the last one short. */
export function scribbleBlock(seed: number, x: number, y: number, width: number, lines: number, gap: number, xh: number, wobble = 0.15) {
  const out: string[] = [];
  for (let i = 0; i < lines; i++) {
    const last = i === lines - 1;
    const w = last ? width * (0.35 + rng(seed + i * 31)() * 0.3) : width * (0.94 + rng(seed + i * 17)() * 0.06);
    out.push(scribbleLine(seed + i * 101, x, y + i * gap, w, xh, wobble));
  }
  return out;
}

/** Bars for a printed page: each line's words as rounded runs, for the transcription. */
export function typeLine(seed: number, x: number, y: number, width: number, h: number) {
  const rand = rng(seed);
  const runs: { x: number; w: number }[] = [];
  let cx = x;
  while (cx < x + width - h * 2) {
    const w = Math.min(x + width - cx, h * (1.4 + rand() * 4.5));
    runs.push({ x: r1(cx), w: r1(w) });
    cx += w + h * 0.75;
  }
  return runs.map((r) => ({ ...r, y: r1(y - h), h: r1(h) }));
}
