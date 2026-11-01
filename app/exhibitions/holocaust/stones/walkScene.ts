/*
 * The walk's floor: a dark hall whose floor is covered with cast-iron faces
 * (rough plates, holes cut for the eyes and an open mouth), after Menashe
 * Kadishman's Fallen Leaves (Shalekhet), and among them pairs of empty
 * cast-iron shoes, men's, women's and children's, after the Shoes on the
 * Danube Bank. Nothing here is theirs: every face and shoe is plain
 * geometry, worked out from its row and place, so the floor is the same
 * each time and goes on as far as the visitor walks.
 *
 * The iron is dark, near black, with a little rust in it. The only light is
 * the visitor's candle, carried just in front of them: it catches the rims
 * of the nearest faces and shoes, and the floor falls away into darkness.
 *
 * Distances are in metres, on the floor: x across the hall (0 its middle),
 * z ahead of where the walk began.
 */

/** Rows of iron, this far apart. */
export const ROW = 0.3;
/** The hall's half-width. */
export const HALF_WIDTH = 2.7;
/** Pieces across a row. */
export const ACROSS = 17;
/** One step forward. */
export const STEP = 0.8;
/** The eye's height above the floor. */
export const EYE = 1.55;
/** How far ahead the floor is drawn; beyond, only darkness. */
export const FAR = 13;
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
  /** A little rust on it, here and there: centres and radii (m). */
  mottles: [number, number, number][];
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

/** A hole cut through a plate, centre (cx, cy), half-sizes (rx, ry), turned by `tilt`; `taper` narrows its ends to points (an almond, a slit). */
function hole(cx: number, cy: number, rx: number, ry: number, tilt: number, taper: number, wobble: (j: number) => number, n = 12): Pt[] {
  const out: Pt[] = [];
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2;
    const s = Math.sin(a);
    const k = wobble(j);
    const [u, v] = turn([Math.cos(a) * rx * k, s * ry * k * (1 - taper + taper * Math.abs(s))], tilt);
    out.push([cx + u, cy + v]);
  }
  return out;
}

/**
 * One iron face, cut from a flat plate: an uneven, slightly lopsided round,
 * two eyes (almonds, slits or round holes, never quite a pair) and an open
 * mouth, taller than it is wide, as in a cry.
 */
export function makeFace(x: number, z: number, r: (u: number) => number): IronFace {
  const size = 0.13 + r(3) * 0.11;
  const rx = size * (0.84 + r(4) * 0.14);
  const ry = size * (1.0 + r(5) * 0.16);
  const rot = r(6) * Math.PI * 2;
  // The plate: uneven, a little lopsided, never a true circle.
  const p1 = r(20) * 6.28;
  const p2 = r(21) * 6.28;
  const lop = (r(22) - 0.5) * 0.16;
  const n = 26;
  const outline: Pt[] = [];
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2;
    const k = 1 + 0.06 * Math.sin(2 * a + p1) + 0.045 * Math.sin(3 * a + p2) + (r(30 + j) - 0.5) * 0.04;
    const s = Math.sin(a);
    outline.push([Math.cos(a) * rx * k * (1 + lop * s), s * ry * k]);
  }
  // The eyes: each its own, a little different from the other.
  const kind = r(7);
  const [erx, ery, taper] =
    kind < 0.4 ? [size * (0.13 + r(8) * 0.05), size * (0.05 + r(9) * 0.03), 0.6] // almond
    : kind < 0.65 ? [size * (0.13 + r(8) * 0.04), size * (0.025 + r(9) * 0.015), 0.8] // slit
    : kind < 0.85 ? [size * (0.07 + r(8) * 0.05), size * (0.07 + r(9) * 0.05), 0] // round
    : [size * (0.1 + r(8) * 0.04), size * (0.07 + r(9) * 0.04), 0.3]; // heavy, drooping
  const droop = kind >= 0.85 ? 0.35 : 0;
  const ey = ry * (0.14 + r(10) * 0.16);
  const ex = rx * (0.27 + r(11) * 0.1);
  const eye = (side: number, salt: number) =>
    hole(
      side * ex + (r(salt) - 0.5) * size * 0.08,
      ey + (r(salt + 1) - 0.5) * size * 0.1,
      erx * (0.85 + r(salt + 2) * 0.3),
      ery * (0.85 + r(salt + 3) * 0.3),
      side * droop + (r(salt + 4) - 0.5) * 0.4,
      taper,
      (j) => 0.92 + r(salt + 10 + j) * 0.14,
      10,
    );
  // The mouth: open, taller than wide, uneven.
  const mrx = size * (0.09 + r(12) * 0.07);
  const mry = size * (0.17 + r(13) * 0.13);
  const mouth = hole((r(14) - 0.5) * size * 0.14, -ry * (0.3 + r(15) * 0.14), mrx, mry, (r(16) - 0.5) * 0.4, 0.15, (j) => 0.86 + r(60 + j) * 0.24, 14);
  const holes = [eye(-1, 70), eye(1, 100), mouth];
  // Most rest tilted on the faces beneath them, tipped up toward the visitor, never away (a plate tipped away is seen edge on, as a stick).
  const tilted = r(17) < 0.55;
  const slope: Pt = tilted ? [(r(18) - 0.5) * 0.6, r(19) * 0.5] : [0, 0];
  const mottles: [number, number, number][] = [0, 1, 2].map((m) => {
    const [u, v] = turn([(r(130 + m) - 0.5) * size * 1.1, (r(133 + m) - 0.5) * size * 1.1], 0);
    return [u, v, size * (0.12 + r(136 + m) * 0.18)];
  });
  return {
    kind: 'face',
    x,
    z,
    outline: outline.map((p) => turn(p, rot)),
    holes: holes.map((h) => h.map((p) => turn(p, rot))),
    mottles: mottles.map(([u, v, rr]) => [...turn([u, v], rot), rr] as [number, number, number]),
    rise: 0.025 + r(23) * 0.03 + (tilted ? 0.05 : 0) + (r(24) < 0.3 ? 0.05 : 0),
    slope,
    rust: r(25) * 0.6,
    tone: 0.8 + r(26) * 0.4,
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
    length: 0.4,
    upper: [[0.03, 0.03], [0, 0.13], [0.02, 0.3], [0.1, 0.32], [0.36, 0.29], [0.5, 0.23], [0.66, 0.17], [0.84, 0.14], [0.95, 0.11], [1, 0.07], [0.99, 0.04], [0.95, 0.03]],
    sole: [[0.01, 0.04], [0.99, 0.04], [0.97, 0], [0.03, 0]],
    opening: [0.21, 0.305, 0.17, 0.035],
  },
  woman: {
    length: 0.35,
    upper: [[0.03, 0.12], [0, 0.17], [0.03, 0.26], [0.12, 0.25], [0.3, 0.21], [0.55, 0.14], [0.75, 0.09], [0.92, 0.06], [1, 0.035], [0.96, 0.015], [0.62, 0], [0.4, 0.035], [0.14, 0.1]],
    sole: [[0.03, 0.12], [0.14, 0.11], [0.12, 0], [0.06, 0]],
    opening: [0.3, 0.23, 0.25, 0.03],
  },
  child: {
    length: 0.26,
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
    side: 0.7 + r(41) * 0.3,
    lean: (r(42) - 0.5) * 0.3,
    rust: 0.1 + r(43) * 0.4,
    tone: 0.85 + r(44) * 0.3,
  };
}

/** The iron of row `row`: faces piled and overlapping, scattered rather than laid out, and now and then a pair of shoes. Far to near, so nearer pieces lie over farther ones. */
export function rowPieces(row: number): FloorPiece[] {
  const out: FloorPiece[] = [];
  const cell = (HALF_WIDTH * 2) / ACROSS;
  for (let k = 0; k < ACROSS; k++) {
    const r = (u: number) => hash2(row * 41 + k, u);
    const x = -HALF_WIDTH + cell * (k + 0.5) + (r(1) - 0.5) * cell * 1.1;
    const z = row * ROW + (r(2) - 0.5) * ROW * 1.1;
    if (r(50) < 0.09) {
      const pick = r(51);
      const size: ShoeSize = pick < 0.42 ? 'man' : pick < 0.77 ? 'woman' : 'child';
      // A pair, side by side; sometimes one has fallen a little apart from the other.
      const apart = SHOES[size].length * (0.3 + (r(54) < 0.3 ? 0.4 : 0));
      const first = makeShoe(x, z + apart * 0.5, size, r);
      const second = makeShoe(x + (r(55) - 0.5) * 0.1, z - apart * 0.5, size, (u) => r(u + 50));
      // Most pairs point the same way.
      out.push(first, r(56) < 0.8 ? { ...second, facing: first.facing } : second);
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
 * The candle's light on the floor at (x, dz ahead): about 1 on the nearest
 * iron, falling away soon to nothing in the dark; `glow` is the candle
 * itself, 0 (not yet lit) to 1.
 */
export function lightAt(x: number, dz: number, glow = 1): number {
  const d2 = x * x * 1.4 + (dz - CANDLE_Z) * (dz - CANDLE_Z) + CANDLE_UP * CANDLE_UP;
  const candle = Math.min(1.25, 6.5 / d2) * glow;
  // Far off, the faint light of the pictures on the end wall, just enough to see the floor goes on.
  const far = 0.025 * Math.exp(-((dz - FAR * 0.8) ** 2) / 14);
  return (candle + far) * Math.exp(-dz / 14);
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

/** Dark cast iron, nearly black, and a little rust; the candle warms it only slightly. */
const IRON = [36, 35, 34];
const RUST = [60, 40, 30];

function ironColour(p: Iron, light: number, shade: number) {
  const rust = p.rust * 0.35;
  const warm = Math.min(1, light);
  const c = IRON.map((v, i) => (v * (1 - rust) + RUST[i] * rust) * p.tone * shade * (0.3 + light * 1.7) * [1, 1 - 0.06 * warm, 1 - 0.13 * warm][i]);
  return `rgb(${Math.min(255, c[0]) | 0},${Math.min(255, c[1]) | 0},${Math.min(255, c[2]) | 0})`;
}

/** The candle caught on an iron edge: warm, and only where the light reaches. */
const rimLight = (light: number, k = 1) => `rgba(255, 198, 140, ${Math.min(0.7, light * light * 0.55 * k).toFixed(3)})`;

/**
 * Draws the floor as seen from `at` along it, lit by the candle at `glow`.
 * The canvas is cleared to black first; what the light doesn't reach stays dark.
 * Each row's shoes are drawn just after the faces of the row in front of
 * it, so the flat faces never hide the shoes standing among them.
 */
export function drawFloor(ctx: CanvasRenderingContext2D, v: View, at: number, glow = 1) {
  ctx.fillStyle = '#030303';
  ctx.fillRect(0, 0, v.w, v.h);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  let shoes: IronShoe[] = [];
  const each = (p: FloorPiece) => {
    const dz = p.z - at;
    if (dz <= 0.3) return;
    const light = lightAt(p.x, dz, glow);
    if (light < 0.02) return;
    const scale = v.focal / dz;
    // Off to the side, out of view.
    const sx = v.cx + p.x * scale;
    if (sx < -0.4 * scale || sx > v.w + 0.4 * scale) return;
    if (p.kind === 'face') drawFace(ctx, v, p, dz, light, scale);
    else drawShoe(ctx, v, p, dz, light, scale);
  };
  for (const row of rowsInView(at)) {
    const pieces = piecesOf(row);
    for (const p of pieces) if (p.kind === 'face') each(p);
    shoes.forEach(each);
    shoes = pieces.filter((p): p is IronShoe => p.kind === 'shoe');
  }
  shoes.forEach(each);
}

function path(ctx: CanvasRenderingContext2D, v: View, pts: Pt[], x: number, dz: number, up: (p: Pt, i: number) => number, close = true) {
  ctx.beginPath();
  let any = false;
  pts.forEach((pt, i) => {
    const s = project(v, x + pt[0], dz + pt[1], up(pt, i));
    if (!s) return;
    if (any) ctx.lineTo(s[0], s[1]);
    else ctx.moveTo(s[0], s[1]);
    any = true;
  });
  if (close) ctx.closePath();
  return any;
}

/** The run of an outline on one side of its middle (`near`: the side toward the visitor), as an open line. */
function arc(pts: Pt[], cy: number, near: boolean): Pt[] {
  const on = pts.map((p) => (near ? p[1] < cy : p[1] > cy));
  const start = on.findIndex((o, i) => o && !on[(i - 1 + on.length) % on.length]);
  if (start < 0) return [];
  const out: Pt[] = [];
  for (let k = 0; k < pts.length; k++) {
    const i = (start + k) % pts.length;
    if (!on[i]) break;
    out.push(pts[i]);
  }
  return out;
}

function drawFace(ctx: CanvasRenderingContext2D, v: View, f: IronFace, dz: number, light: number, scale: number) {
  const top = (p: Pt) => f.rise + Math.max(-f.rise + 0.005, f.slope[0] * p[0] + f.slope[1] * p[1]);
  // Its edge, the thickness of the iron, nearly black.
  if (path(ctx, v, f.outline, f.x, dz, (p) => top(p) - 0.03)) {
    ctx.fillStyle = ironColour(f, light, 0.28);
    ctx.fill();
  }
  // Its face: dull, dark iron, a little brighter toward the candle.
  if (!path(ctx, v, f.outline, f.x, dz, top)) return;
  const px = scale * 0.2;
  if (px > 22) {
    const a = project(v, f.x, dz - 0.22, f.rise)!;
    const b = project(v, f.x, dz + 0.22, f.rise)!;
    const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
    g.addColorStop(0, ironColour(f, light, 0.85));
    g.addColorStop(1, ironColour(f, light, 0.5));
    ctx.fillStyle = g;
  } else ctx.fillStyle = ironColour(f, light, 0.7);
  ctx.fill();
  if (px < 5) return;
  // A little rust in it, here and there.
  if (px > 18 && f.rust > 0.15) {
    ctx.save();
    ctx.clip();
    ctx.fillStyle = `rgba(66, 40, 28, ${(0.05 + f.rust * 0.12).toFixed(3)})`;
    for (const [u, w, rr] of f.mottles) {
      const c = project(v, f.x + u, dz + w, top([u, w]));
      if (!c) continue;
      ctx.beginPath();
      ctx.ellipse(c[0], c[1], rr * scale, rr * scale * 0.3, (u * 37) % 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  // The eyes and the mouth, cut through to the dark beneath; the far wall of each catches the candle.
  ctx.fillStyle = '#020202';
  for (const h of f.holes) if (path(ctx, v, h, f.x, dz, top)) ctx.fill();
  if (px > 10) {
    ctx.lineWidth = Math.max(0.6, scale * 0.004);
    ctx.strokeStyle = rimLight(light, 0.6);
    for (const h of f.holes) {
      const cy = h.reduce((s, p) => s + p[1], 0) / h.length;
      if (path(ctx, v, arc(h, cy, false), f.x, dz, top, false)) ctx.stroke();
    }
  }
  // The rim toward the candle catches its light.
  ctx.lineWidth = Math.max(0.7, scale * 0.006);
  ctx.strokeStyle = rimLight(light);
  if (path(ctx, v, arc(f.outline, 0, true), f.x, dz, top, false)) ctx.stroke();
}

function drawShoe(ctx: CanvasRenderingContext2D, v: View, s: IronShoe, dz: number, light: number, scale: number) {
  const shape = SHOES[s.size];
  // It stands on the faces beneath it.
  const base = project(v, s.x, dz, 0.05);
  if (!base) return;
  const len = shape.length * scale;
  const cos = Math.cos(s.lean);
  const sin = Math.sin(s.lean);
  const at = ([t, up]: Pt): Pt => {
    const px = s.facing * (t - 0.5) * len * s.side;
    const py = -up * len;
    return [base[0] + px * cos - py * sin * s.facing, base[1] + px * sin * s.facing + py * cos];
  };
  const trace = (pts: Pt[], close = true) => {
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const [a, b] = at(pt);
      if (i) ctx.lineTo(a, b);
      else ctx.moveTo(a, b);
    });
    if (close) ctx.closePath();
  };
  // Its shadow on the iron beneath.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(base[0], base[1], len * s.side * 0.58, len * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  // The upper, dark iron, a little brighter toward its top.
  trace(shape.upper);
  if (len > 30) {
    const top = at([0.5, 0.35]);
    const g = ctx.createLinearGradient(top[0], top[1], base[0], base[1]);
    g.addColorStop(0, ironColour(s, light, 1.3));
    g.addColorStop(1, ironColour(s, light, 0.6));
    ctx.fillStyle = g;
  } else ctx.fillStyle = ironColour(s, light, 0.75);
  ctx.fill();
  if (len < 8) return;
  // The sole (or a woman's heel), darker.
  trace(shape.sole);
  ctx.fillStyle = ironColour(s, light, 0.3);
  ctx.fill();
  // The opening, empty.
  const [ot, oup, orx, ory] = shape.opening;
  const c = at([ot, oup]);
  ctx.beginPath();
  ctx.ellipse(c[0], c[1], orx * len * s.side, Math.max(1, ory * len), s.lean * s.facing, 0, Math.PI * 2);
  ctx.fillStyle = '#020202';
  ctx.fill();
  // The candle along its top edge and the rim of the opening.
  ctx.lineWidth = Math.max(0.7, scale * 0.005);
  ctx.strokeStyle = rimLight(light, 1.1);
  ctx.stroke();
  // The top edge: from the heel round to the toe.
  const toe = shape.upper.reduce((best, p, i) => (p[0] > shape.upper[best][0] ? i : best), 0);
  const ridge = shape.upper.slice(1, toe);
  if (ridge.length > 1) {
    trace(ridge, false);
    ctx.stroke();
  }
}
