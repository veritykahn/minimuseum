/*
 * The walk's floor: a dark hall whose floor is covered with cast-iron faces
 * (rough round plates, holes cut for the eyes and an open mouth), after
 * Menashe Kadishman's Fallen Leaves (Shalekhet), and here and there a pair
 * of empty cast-iron shoes, men's, women's and children's, after the Shoes
 * on the Danube Bank. Nothing here is theirs: every face and shoe is plain
 * geometry, worked out from its row and place, so the floor is the same
 * each time and goes on as far as the visitor walks.
 *
 * The only light is the visitor's candle, carried just in front of them:
 * the nearest faces are lit warm, and the floor falls away into darkness.
 *
 * Distances are in metres, on the floor: x across the hall (0 its middle),
 * z ahead of where the walk began.
 */

/** Rows of iron, this far apart. */
export const ROW = 0.34;
/** The hall's half-width. */
export const HALF_WIDTH = 2.7;
/** Places across a row. */
export const ACROSS = 15;
/** One step forward. */
export const STEP = 0.8;
/** The eye's height above the floor. */
export const EYE = 1.55;
/** How far ahead the floor is drawn; beyond, only darkness. */
export const FAR = 14;
/** The candle: carried this far ahead of the eye, this high. */
const CANDLE_Z = 0.35;
const CANDLE_UP = 1.05;

export type Pt = [number, number];

type Iron = {
  /** Its middle, on the floor. */
  x: number;
  z: number;
  /** 0–1: how rusted. */
  rust: number;
  /** 0.85–1.15: a little lighter or darker iron. */
  tone: number;
};

export type IronFace = Iron & {
  kind: 'face';
  /** Its outline, as offsets (m) from its middle, across and ahead. */
  outline: Pt[];
  /** The eyes and the mouth, cut through. */
  holes: Pt[][];
  /** Its thickness, and how it lies: tilted up on the faces beneath it (rise per metre, across and ahead). */
  rise: number;
  slope: Pt;
};

export type ShoeSize = 'man' | 'woman' | 'child';

export type IronShoe = Iron & {
  kind: 'shoe';
  size: ShoeSize;
  /** Which way its toe points, across the visitor's view (1 right, −1 left). */
  facing: 1 | -1;
  /** How much of its length shows (1 side on; less, turned toward or away). */
  side: number;
  /** How it lies: tipped a little, toe up or down. */
  lean: number;
};

export type FloorPiece = IronFace | IronShoe;

/** A cheap, stable hash of two integers to 0–1. */
export function hash2(a: number, b: number) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
  h ^= h >>> 13;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

const turn = ([u, v]: Pt, a: number): Pt => [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)];

/** An oval, `n` points, centre (cx, cy), half-sizes (rx, ry), in a face's own frame. */
function oval(cx: number, cy: number, rx: number, ry: number, n = 9, wobble?: (j: number) => number): Pt[] {
  const out: Pt[] = [];
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2;
    const k = wobble ? wobble(j) : 1;
    out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return out;
}

/** One iron face: a rough round plate, two eyes and an open mouth cut through it. */
export function makeFace(x: number, z: number, r: (u: number) => number): IronFace {
  const size = 0.15 + r(3) * 0.1;
  const rx = size * (0.86 + r(4) * 0.18);
  const ry = size * (0.98 + r(5) * 0.18);
  const rot = r(6) * Math.PI * 2;
  const outline = oval(0, 0, rx, ry, 22, (j) => 0.95 + r(20 + j) * 0.09);
  // Eyes: round, narrow, or drooping; the mouth: open, wide, or long.
  const eyeKind = Math.floor(r(7) * 3);
  const ex = rx * (0.3 + r(8) * 0.08);
  const ey = ry * (0.22 + r(9) * 0.08);
  const [erx, ery] = eyeKind === 0 ? [size * 0.14, size * 0.14] : eyeKind === 1 ? [size * 0.17, size * 0.09] : [size * 0.11, size * 0.16];
  const mouthKind = Math.floor(r(10) * 3);
  const [mrx, mry] = mouthKind === 0 ? [size * 0.2, size * 0.22] : mouthKind === 1 ? [size * 0.3, size * 0.14] : [size * 0.15, size * 0.28];
  const my = -ry * (0.36 + r(11) * 0.08);
  const holes = [oval(-ex, ey, erx, ery, 10), oval(ex, ey, erx, ery, 10), oval((r(12) - 0.5) * size * 0.12, my, mrx, mry, 12)];
  // Most lie flat; some rest tilted on the faces beneath them.
  const tilted = r(13) < 0.45;
  // (Tipped up toward the visitor, never away: a plate tipped away is seen edge on, as a stick.)
  const slope: Pt = tilted ? [(r(14) - 0.5) * 0.6, r(15) * 0.45] : [0, 0];
  return {
    kind: 'face',
    x,
    z,
    outline: outline.map((p) => turn(p, rot)),
    holes: holes.map((h) => h.map((p) => turn(p, rot))),
    rise: 0.02 + r(16) * 0.03 + (tilted ? 0.04 : 0),
    slope,
    rust: r(17) * r(17) * 0.7,
    tone: 0.85 + r(18) * 0.3,
  };
}

/**
 * Each shoe's shape, side on (as the shoes on the Danube are seen), in
 * shares of its length: heel 0 to toe 1, and up from the floor. Its
 * outline, its sole, and the opening where the foot went, seen a little
 * from above. A man's shoe; a woman's, with a heel; a child's small boot.
 */
type ShoeShape = { length: number; upper: Pt[]; sole: Pt[]; opening: [number, number, number, number] };
export const SHOES: Record<ShoeSize, ShoeShape> = {
  man: {
    length: 0.34,
    upper: [[0.03, 0.03], [0, 0.13], [0.02, 0.3], [0.1, 0.32], [0.36, 0.29], [0.5, 0.23], [0.66, 0.17], [0.84, 0.14], [0.95, 0.11], [1, 0.07], [0.99, 0.04], [0.95, 0.03]],
    sole: [[0.01, 0.04], [0.99, 0.04], [0.97, 0], [0.03, 0]],
    opening: [0.21, 0.305, 0.17, 0.035],
  },
  woman: {
    length: 0.3,
    upper: [[0.03, 0.12], [0, 0.17], [0.03, 0.26], [0.12, 0.25], [0.3, 0.21], [0.55, 0.14], [0.75, 0.09], [0.92, 0.06], [1, 0.035], [0.96, 0.015], [0.62, 0], [0.4, 0.035], [0.14, 0.1]],
    sole: [[0.03, 0.12], [0.14, 0.11], [0.12, 0], [0.06, 0]],
    opening: [0.3, 0.23, 0.25, 0.03],
  },
  child: {
    length: 0.22,
    upper: [[0.05, 0.03], [0, 0.16], [0.04, 0.44], [0.22, 0.45], [0.36, 0.34], [0.55, 0.25], [0.78, 0.21], [0.95, 0.16], [1, 0.09], [0.97, 0.04], [0.9, 0.03]],
    sole: [[0.02, 0.05], [0.99, 0.05], [0.96, 0], [0.05, 0]],
    opening: [0.13, 0.445, 0.12, 0.04],
  },
};

/** One iron shoe, standing or tipped a little, side on to the visitor or turned. */
export function makeShoe(x: number, z: number, size: ShoeSize, r: (u: number) => number): IronShoe {
  return {
    kind: 'shoe',
    size,
    x,
    z,
    facing: r(40) < 0.5 ? 1 : -1,
    side: 0.55 + r(41) * 0.45,
    lean: (r(42) - 0.5) * 0.35,
    rust: 0.15 + r(17) * 0.4,
    tone: 0.85 + r(18) * 0.3,
  };
}

/** The iron of row `row`: mostly faces, overlapping, now and then a pair of shoes. Far to near, so nearer pieces lie over farther ones. */
export function rowPieces(row: number): FloorPiece[] {
  const out: FloorPiece[] = [];
  const cell = (HALF_WIDTH * 2) / ACROSS;
  const shift = row % 2 === 0 ? 0 : cell * 0.5;
  for (let k = 0; k < ACROSS; k++) {
    const r = (u: number) => hash2(row * 37 + k, u);
    const x = -HALF_WIDTH + cell * (k + 0.5) + shift + (r(1) - 0.5) * cell * 0.4;
    const z = row * ROW + (r(2) - 0.5) * ROW * 0.5;
    if (r(30) < 0.08) {
      const pick = r(31);
      const size: ShoeSize = pick < 0.45 ? 'man' : pick < 0.8 ? 'woman' : 'child';
      // A pair, side by side; sometimes one has fallen a little apart from the other.
      const apart = SHOES[size].length * (0.25 + (r(34) < 0.3 ? 0.4 : 0));
      const first = makeShoe(x, z + apart * 0.5, size, r);
      const second = makeShoe(x + (r(35) - 0.5) * 0.08, z - apart * 0.5, size, (u) => r(u + 50));
      // Most pairs point the same way.
      out.push(first, r(36) < 0.8 ? { ...second, facing: first.facing } : second);
    } else {
      out.push(makeFace(x, z, r));
    }
  }
  return out.sort((a, b) => b.z - a.z);
}

export type View = { w: number; h: number; cx: number; horizon: number; focal: number };

/** The view on a screen `w` × `h`: the floor runs straight ahead, under the pictures at the far end. */
export function makeView(w: number, h: number): View {
  const narrow = w <= 760;
  return { w, h, cx: w * 0.5, horizon: h * (narrow ? 0.42 : 0.47), focal: Math.min(h * (narrow ? 0.8 : 0.95), w * 1.6) };
}

/** A point on (or `up` above) the floor, `dz` ahead of the eye, on screen. Null if it is behind. */
export function project(v: View, x: number, dz: number, up = 0): Pt | null {
  if (dz <= 0.05) return null;
  const k = v.focal / dz;
  return [v.cx + x * k, v.horizon + (EYE - up) * k];
}

/** The rows in view from `at` (the walker's distance along the floor), far to near. */
export function rowsInView(at: number, near = 0.9, far = FAR): number[] {
  const first = Math.max(0, Math.floor((at + near) / ROW));
  const last = Math.ceil((at + far) / ROW);
  const rows: number[] = [];
  for (let r = last; r >= first; r--) rows.push(r);
  return rows;
}

/**
 * The candle's light on the floor at (x, dz ahead): 1 or so on the nearest
 * faces, falling away to nothing in the dark; `glow` is the candle itself,
 * 0 (not yet lit) to 1.
 */
export function lightAt(x: number, dz: number, glow = 1): number {
  const d2 = x * x + (dz - CANDLE_Z) * (dz - CANDLE_Z) + CANDLE_UP * CANDLE_UP;
  const candle = Math.min(1.25, 10 / d2) * glow;
  // Far off, the faint light of the pictures on the end wall, just enough to see the floor goes on.
  const far = 0.03 * Math.exp(-((dz - FAR * 0.8) ** 2) / 18);
  return (candle + far) * Math.exp(-dz / 30);
}

/** Ease in and out, for a step taken slowly. */
export function easeStep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

const cache = new Map<number, FloorPiece[]>();
function piecesOf(row: number) {
  let p = cache.get(row);
  if (!p) {
    p = rowPieces(row);
    if (cache.size > 400) cache.clear();
    cache.set(row, p);
  }
  return p;
}

/** Dull cast iron, and rust: lit by a warm candle. */
const IRON = [54, 52, 50];
const RUST = [86, 60, 44];
const WARM = [1.0, 0.82, 0.6];

function ironColour(p: Iron, light: number, shade: number, alpha = 1) {
  const c = IRON.map((v, i) => (v * (1 - p.rust) + RUST[i] * p.rust) * p.tone * light * shade * WARM[i] * 1.6);
  return `rgba(${Math.min(255, c[0]) | 0},${Math.min(255, c[1]) | 0},${Math.min(255, c[2]) | 0},${alpha})`;
}

/**
 * Draws the floor as seen from `at` along it, lit by the candle at `glow`.
 * The canvas is cleared to black first; what the light doesn't reach stays dark.
 */
export function drawFloor(ctx: CanvasRenderingContext2D, v: View, at: number, glow = 1) {
  ctx.fillStyle = '#030303';
  ctx.fillRect(0, 0, v.w, v.h);
  ctx.lineJoin = 'round';
  for (const row of rowsInView(at)) {
    for (const p of piecesOf(row)) {
      const dz = p.z - at;
      if (dz <= 0.3) continue;
      const light = lightAt(p.x, dz, glow);
      if (light < 0.015) continue;
      const scale = v.focal / dz;
      // Off to the side, out of view.
      const sx = v.cx + p.x * scale;
      if (sx < -0.4 * scale || sx > v.w + 0.4 * scale) continue;
      if (p.kind === 'face') drawFace(ctx, v, p, dz, light, scale);
      else drawShoe(ctx, v, p, dz, light, scale);
    }
  }
}

function path(ctx: CanvasRenderingContext2D, v: View, pts: Pt[], x: number, dz: number, up: (p: Pt, i: number) => number) {
  ctx.beginPath();
  let any = false;
  pts.forEach((pt, i) => {
    const s = project(v, x + pt[0], dz + pt[1], up(pt, i));
    if (!s) return;
    if (any) ctx.lineTo(s[0], s[1]);
    else ctx.moveTo(s[0], s[1]);
    any = true;
  });
  ctx.closePath();
  return any;
}

function drawFace(ctx: CanvasRenderingContext2D, v: View, f: IronFace, dz: number, light: number, scale: number) {
  const top = (p: Pt) => f.rise + Math.max(-f.rise + 0.005, f.slope[0] * p[0] + f.slope[1] * p[1]);
  // Its edge, the thickness of the iron, in shadow.
  if (path(ctx, v, f.outline, f.x, dz, (p) => top(p) - 0.022)) {
    ctx.fillStyle = ironColour(f, light, 0.32);
    ctx.fill();
  }
  // Its face.
  if (!path(ctx, v, f.outline, f.x, dz, top)) return;
  const near = scale * 0.2 > 26;
  if (near) {
    // A dull sheen on the iron, brighter on the side toward the candle.
    const a = project(v, f.x, dz - 0.25, f.rise)!;
    const b = project(v, f.x, dz + 0.25, f.rise)!;
    const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
    g.addColorStop(0, ironColour(f, light, 0.95));
    g.addColorStop(1, ironColour(f, light, 0.6));
    ctx.fillStyle = g;
  } else ctx.fillStyle = ironColour(f, light, 0.78);
  ctx.fill();
  if (scale * 0.2 < 5) return;
  ctx.lineWidth = Math.max(0.6, scale * 0.005);
  ctx.strokeStyle = ironColour(f, light, 1.3, 0.5);
  ctx.stroke();
  // The eyes and the mouth, cut through to the dark beneath.
  ctx.fillStyle = '#050403';
  for (const h of f.holes) if (path(ctx, v, h, f.x, dz, top)) ctx.fill();
  // The lower lip of each hole catches a little light.
  ctx.lineWidth = Math.max(0.5, scale * 0.004);
  ctx.strokeStyle = ironColour(f, light, 0.5);
  for (const h of f.holes) if (path(ctx, v, h, f.x, dz, top)) ctx.stroke();
}

function drawShoe(ctx: CanvasRenderingContext2D, v: View, s: IronShoe, dz: number, light: number, scale: number) {
  const shape = SHOES[s.size];
  // It stands on the faces beneath it.
  const base = project(v, s.x, dz, 0.03);
  if (!base) return;
  const len = shape.length * scale;
  const cos = Math.cos(s.lean);
  const sin = Math.sin(s.lean);
  const at = ([t, up]: Pt): Pt => {
    const px = s.facing * (t - 0.5) * len * s.side;
    const py = -up * len;
    return [base[0] + px * cos - py * sin * s.facing, base[1] + px * sin * s.facing + py * cos];
  };
  const trace = (pts: Pt[]) => {
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const [a, b] = at(pt);
      if (i) ctx.lineTo(a, b);
      else ctx.moveTo(a, b);
    });
    ctx.closePath();
  };
  // Its shadow on the iron beneath.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(base[0], base[1], len * s.side * 0.55, len * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  // The upper, dull iron, catching the light along its top.
  trace(shape.upper);
  if (len > 30) {
    const top = at([0.5, 0.35]);
    const g = ctx.createLinearGradient(top[0], top[1], base[0], base[1]);
    g.addColorStop(0, ironColour(s, light, 1.0));
    g.addColorStop(1, ironColour(s, light, 0.5));
    ctx.fillStyle = g;
  } else ctx.fillStyle = ironColour(s, light, 0.8);
  ctx.fill();
  if (len < 8) return;
  ctx.lineWidth = Math.max(0.6, scale * 0.004);
  ctx.strokeStyle = ironColour(s, light, 1.35, 0.55);
  ctx.stroke();
  // The sole (or a woman's heel), darker.
  trace(shape.sole);
  ctx.fillStyle = ironColour(s, light, 0.32);
  ctx.fill();
  // The opening, empty.
  const [ot, oup, orx, ory] = shape.opening;
  const c = at([ot, oup]);
  ctx.beginPath();
  ctx.ellipse(c[0], c[1], orx * len * s.side, Math.max(1, ory * len), s.lean * s.facing, 0, Math.PI * 2);
  ctx.fillStyle = '#060504';
  ctx.fill();
  ctx.strokeStyle = ironColour(s, light, 1.1, 0.7);
  ctx.stroke();

}
