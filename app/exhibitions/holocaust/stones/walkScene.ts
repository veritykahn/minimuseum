/*
 * The walk's ground: a long path of plain, flat stones, close-laid, each
 * unmarked and none like the next, running ahead into the dark. They stand
 * for people, so none is named and none has a face. Everything here is
 * plain geometry, worked out from a stone's row and place in it, so the path
 * goes on as far as the visitor walks and is the same each time.
 *
 * Distances are in metres, on the ground: x across the path (0 its middle),
 * z ahead of where the walk began.
 */

/** Rows of stones, this far apart. */
export const ROW = 0.46;
/** Stones across a row. */
export const ACROSS = 9;
/** The path's half-width. */
export const HALF_WIDTH = 2.1;
/** One step forward. */
export const STEP = 0.72;
/** The eye's height above the ground. */
export const EYE = 1.55;
/** How far ahead the path is drawn. */
export const FAR = 34;

export type PathStone = {
  row: number;
  /** The stone's middle, on the ground. */
  x: number;
  z: number;
  /** Its outline: corners as offsets (m) from its middle, across and ahead. */
  outline: [number, number][];
  /** Its thickness above the ground. */
  rise: number;
  /** Its grey, 0 (dark iron) to 1 (pale stone). */
  tone: number;
};

/** A cheap, stable hash of two integers to 0–1. */
export function hash2(a: number, b: number) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
  h ^= h >>> 13;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** The stones of row `row`: plain, flat, worn, each a little turned. */
export function rowStones(row: number): PathStone[] {
  const out: PathStone[] = [];
  const cell = (HALF_WIDTH * 2) / ACROSS;
  // Alternate rows are laid half a stone along, like a paving.
  const shift = row % 2 === 0 ? 0 : cell * 0.5;
  for (let k = 0; k < ACROSS + (row % 2 === 0 ? 0 : -1); k++) {
    const r = (u: number) => hash2(row * 31 + k, u);
    const x = -HALF_WIDTH + cell * (k + 0.5) + shift + (r(1) - 0.5) * cell * 0.18;
    const z = row * ROW + (r(2) - 0.5) * ROW * 0.16;
    const w = cell * (0.45 + r(3) * 0.04);
    const d = ROW * (0.44 + r(4) * 0.04);
    const turn = (r(5) - 0.5) * 0.3;
    const corners = 8;
    const outline: [number, number][] = [];
    for (let j = 0; j < corners; j++) {
      const a = (j / corners) * Math.PI * 2 + turn;
      const rr = 0.86 + r(10 + j) * 0.18;
      // A rounded square: flatter sides than an ellipse, as worn stones are.
      const c = Math.cos(a);
      const s = Math.sin(a);
      const sq = 1 / Math.max(0.78, Math.pow(Math.pow(Math.abs(c), 4) + Math.pow(Math.abs(s), 4), 0.25));
      outline.push([c * w * rr * sq * 0.92, s * d * rr * sq * 0.92]);
    }
    out.push({ row, x, z, outline, rise: 0.035 + r(6) * 0.03, tone: r(7) });
  }
  return out;
}

export type View = { w: number; h: number; cx: number; horizon: number; focal: number; eye: number };

/** The view on a screen `w` × `h`; on a phone the path rises higher, clear of the words below it. */
export function makeView(w: number, h: number): View {
  const narrow = w <= 760;
  return { w, h, cx: w * (narrow ? 0.5 : 0.36), horizon: h * (narrow ? 0.27 : 0.36), focal: h * (narrow ? 0.62 : 1.05), eye: EYE };
}

/** A point on (or `up` above) the ground, `dz` ahead of the eye, on screen. Null if it is behind. */
export function project(v: View, x: number, dz: number, up = 0): [number, number] | null {
  if (dz <= 0.05) return null;
  const k = v.focal / dz;
  return [v.cx + x * k, v.horizon + (v.eye - up) * k];
}

/** The rows in view from `at` (the walker's distance along the path), far to near. */
export function rowsInView(at: number, near = 0.4, far = FAR): number[] {
  const first = Math.floor((at + near) / ROW);
  const last = Math.ceil((at + far) / ROW);
  const rows: number[] = [];
  for (let r = last; r >= first; r--) if (r >= 0) rows.push(r);
  return rows;
}

/** How dim a stone is with distance: 0 close by, toward 1 far off in the dark. */
export function fog(dz: number): number {
  return 1 - Math.exp(-dz / 9);
}

/** Ease in and out, for a step taken slowly. */
export function easeStep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}
