/*
 * Design a doll: the doll's shapes, as numbers, so every part is drawn from
 * one body and fits it.
 *
 * The doll is one figure on a 400 x 800 canvas, standing or sitting in a
 * wheelchair. Its torso, arms and legs are each a list of key points down
 * the figure (how far from the middle, or where the two edges are, at each
 * height); the skin is drawn through those points as smooth curves, and so
 * is every piece of clothing, a few pixels further out and cut off at its
 * own hem. So a sleeve, a trouser leg or a skirt always sits on the arm or
 * leg under it, in both poses, and nothing has to be clipped to fit.
 *
 * Nothing here draws: DollArt.tsx turns these paths into the picture.
 * Everything is a plain function of plain numbers, and is tested in
 * __tests__/components/DollDesigner.test.tsx.
 */

export type Pt = readonly [number, number];
export type Pose = 'standing' | 'seated';

/** The canvas: every layer of the doll is drawn on it, in place. */
export const CANVAS = { w: 400, h: 800 } as const;
/** The doll's middle line. */
export const MID = 200;

const r1 = (n: number) => Math.round(n * 10) / 10;
const p = (pt: Pt) => `${r1(pt[0])} ${r1(pt[1])}`;

/** Mirror points across the middle line (the doll's right side from its left). */
export const mirror = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [2 * MID - x, y] as const);

/**
 * A smooth curve through the points (Catmull-Rom, as cubic Béziers), as
 * path commands that carry on from the first point. `tension` 1 is the
 * usual curve; less is tighter.
 */
export function through(pts: readonly Pt[], tension = 1): string {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const k = tension / 6;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${p(c1)} ${p(c2)} ${p(p2)}`;
  }
  return d;
}

/** A smooth open line through the points: "M … C …". */
export const smoothLine = (pts: readonly Pt[], tension = 1) => `M ${p(pts[0])}${through(pts, tension)}`;

/** A smooth closed shape through the points. */
export function smoothShape(pts: readonly Pt[], tension = 1): string {
  const n = pts.length;
  const ring = [pts[n - 1], ...pts, pts[0], pts[1]];
  let d = `M ${p(pts[0])}`;
  for (let i = 1; i <= n; i++) {
    const seg = through([ring[i - 1], ring[i], ring[i + 1], ring[i + 2]], tension);
    // `through` on four points gives three curves; the middle one is the closed shape's segment.
    d += ` C${seg.split(' C')[2]}`;
  }
  return `${d} Z`;
}

/**
 * A soft, bumpy outline round the points: each stretch between two points
 * bulges outwards by `bulge` (inwards if negative). For curls, coils and
 * afro puffs: the outline of textured hair, drawn, never cut.
 * The points go round clockwise on screen.
 */
export function scallop(pts: readonly Pt[], bulge: number, closed = true): string {
  const n = pts.length;
  let d = `M ${p(pts[0])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    // Clockwise on screen (y down): outward is to the left of the direction of travel.
    const c: Pt = [mx + (dy / len) * bulge * 2, my - (dx / len) * bulge * 2];
    d += ` Q ${p(c)} ${p(b)}`;
  }
  return closed ? `${d} Z` : d;
}

/** Points round an ellipse, clockwise on screen from `from` to `to` (degrees, 0 = right, 90 = down). */
export function arcPoints(cx: number, cy: number, rx: number, ry: number, from: number, to: number, n: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return out;
}

/** A value read off key points [y, value…] at height y, in a straight line between them. */
export function at(keys: readonly (readonly number[])[], y: number, col = 1): number {
  if (y <= keys[0][0]) return keys[0][col];
  for (let i = 1; i < keys.length; i++) {
    if (y <= keys[i][0]) {
      const [y0, y1] = [keys[i - 1][0], keys[i][0]];
      const t = (y - y0) / (y1 - y0 || 1);
      return keys[i - 1][col] + (keys[i][col] - keys[i - 1][col]) * t;
    }
  }
  return keys[keys.length - 1][col];
}

/** The key heights between y0 and y1, with y0 and y1 themselves. */
function heights(keys: readonly (readonly number[])[], y0: number, y1: number): number[] {
  return [y0, ...keys.map((k) => k[0]).filter((y) => y > y0 + 2 && y < y1 - 2), y1];
}

/* ───────── The head ───────── */

/** The face's outline: forehead at 70, cheeks widest at 150, chin at 232. */
export const HEAD = {
  top: 70,
  chin: 232,
  cy: 150,
  hw: 66,
  path: 'M 200 70 C 246 70 266 104 266 148 C 266 194 236 232 200 232 C 164 232 134 194 134 148 C 134 104 154 70 200 70 Z',
  ears: { x: 131, y: 160 },
  eyes: { x: 172, y: 162 },
} as const;

/* ───────── The torso ───────── */

/** Half the torso's width at each height, from the neck down to the hips. */
export const TORSO: readonly (readonly [number, number])[] = [
  [258, 16],
  [264, 40],
  [272, 56],
  [284, 61],
  [300, 59],
  [322, 52],
  [350, 46],
  [380, 42],
  [398, 42],
  [420, 47],
  [440, 52],
  [452, 53],
];
export const WAIST = 396;
export const HIPS = 452;
/** Where the legs meet, under the hips. */
export const CROTCH = 470;

/** One side of the torso (the left on screen), from y0 down to y1, `out` pixels further out. */
export function torsoSide(out: number, y0: number, y1: number): Pt[] {
  return heights(TORSO, y0, y1).map((y) => [MID - at(TORSO, y) - out, y] as const);
}

/** The torso's skin: shoulders, sides and the curve of the hips down to the crotch. */
export function torsoPath(): string {
  const left = torsoSide(0, 262, HIPS);
  const right = mirror(left).reverse();
  return `M ${MID - 15} 256${through([[MID - 15, 256], ...left], 0.9)} Q ${MID - 30} ${CROTCH} ${MID} ${CROTCH} Q ${MID + 30} ${CROTCH} ${right[0][0]} ${right[0][1]}${through(right, 0.9)} L ${MID + 15} 256 Z`;
}

/* ───────── Arms and hands ───────── */

/** The left arm (on screen): at each height, its outer and inner edge. */
export const ARM: readonly (readonly [number, number, number])[] = [
  [276, 138, 158],
  [300, 130, 154],
  [340, 125, 147],
  [380, 122, 143],
  [420, 120, 140],
  [454, 119, 137],
];
export const SHOULDER_TOP = 268;
export const WRIST = 454;

/** An arm, or a sleeve on it (`out` pixels wider), from its top down to `hem`. */
export function armPath(side: 'left' | 'right', out = 0, hem = WRIST): string {
  const ys = heights(ARM, 286, hem);
  const outer: Pt[] = ys.map((y): Pt => [at(ARM, y, 1) - out, y]);
  const inner: Pt[] = ys.map((y): Pt => [at(ARM, y, 2) + out, y]).reverse();
  // Over the shoulder: a round cap from the inner edge to the outer one.
  const capIn: Pt = [158 + out * 0.5, 292];
  const top: Pt = [146, SHOULDER_TOP - out];
  let pts = { outer, inner, capIn, top };
  if (side === 'right') {
    pts = { outer: mirror(outer), inner: mirror(inner), capIn: mirror([capIn])[0], top: mirror([top])[0] };
  }
  const o = pts.outer;
  const i = pts.inner;
  return `M ${p(pts.top)} Q ${p([o[0][0] + (side === 'left' ? -2 : 2), pts.top[1] + 6])} ${p(o[0])}${through(o)} L ${p(i[0])}${through(i)} Q ${p([pts.capIn[0], pts.capIn[1] - 14])} ${p(pts.top)} Z`;
}

/** A hand, hanging at the wrist, thumb towards the body. */
export function handPath(side: 'left' | 'right'): string {
  const pts: Pt[] = [
    [118, 450],
    [114, 470],
    [115, 490],
    [121, 502],
    [130, 504],
    [137, 494],
    [139, 478],
    [146, 474],
    [143, 466],
    [137, 462],
    [138, 450],
  ];
  return smoothShape(side === 'left' ? pts : mirror(pts), 0.8);
}

/* ───────── Legs and feet ───────── */

type LegKeys = readonly (readonly [number, number, number])[];

/** Standing: the left leg's outer and inner edge at each height, hip to ankle. */
export const LEG_STANDING: LegKeys = [
  [440, 150, 200],
  [480, 152, 199],
  [540, 157, 196],
  [600, 161, 192],
  [640, 161, 190],
  [690, 164, 187],
  [736, 168, 184],
];
/** Sitting: the thigh comes towards us, so the lap is short and wide; the knee is at 514. */
export const THIGH_SEATED: LegKeys = [
  [444, 147, 200],
  [470, 144, 200],
  [498, 143, 199],
];
export const KNEE_SEATED = 514;
/** Sitting: the shin hangs from just under the knee to the ankle, narrower than the lap. */
export const SHIN_SEATED: LegKeys = [
  [500, 156, 192],
  [540, 158, 190],
  [580, 162, 187],
  [612, 166, 184],
];
export const ANKLE = { standing: 736, seated: 612 } as const;
export const KNEE = { standing: 600, seated: KNEE_SEATED } as const;
/** Where the sole of the shoe rests. */
export const SOLE = { standing: 774, seated: 650 } as const;

const legSide = (side: 'left' | 'right') => (pts: Pt[]) => (side === 'left' ? pts : mirror(pts));

/** A leg piece (or the cloth on it, `out` wider) between two heights; the hem is a gentle curve. */
export function tubePath(keys: LegKeys, side: 'left' | 'right', out: number, y0: number, y1: number, roundTop = false): string {
  const ys = heights(keys, y0, y1);
  const f = legSide(side);
  const outer = f(ys.map((y): Pt => [at(keys, y, 1) - out, y]));
  const inner = f(ys.map((y): Pt => [at(keys, y, 2) + out, y]).reverse());
  const hemMid: Pt = [(outer[outer.length - 1][0] + inner[0][0]) / 2, y1 + 3];
  const topMid: Pt = [(outer[0][0] + inner[inner.length - 1][0]) / 2, y0 - (roundTop ? 10 : 0)];
  return `M ${p(outer[0])}${through(outer)} Q ${p(hemMid)} ${p(inner[0])}${through(inner)} Q ${p(topMid)} ${p(outer[0])} Z`;
}

/** The seated thigh, seen from the front: the lap, rounded at the knee. */
export function thighPath(side: 'left' | 'right', out = 0): string {
  const ys = heights(THIGH_SEATED, 444, 498);
  const f = legSide(side);
  const outer = f(ys.map((y): Pt => [at(THIGH_SEATED, y, 1) - out, y]));
  const inner = f(ys.map((y): Pt => [at(THIGH_SEATED, y, 2) + out, y]).reverse());
  const knee: Pt = [(outer[outer.length - 1][0] + inner[0][0]) / 2, KNEE_SEATED + out];
  const o = outer[outer.length - 1];
  const i = inner[0];
  return `M ${p(outer[0])}${through(outer)} C ${p([o[0], o[1] + 14])} ${p([knee[0] - 16 * (side === 'left' ? 1 : -1), knee[1]])} ${p(knee)} C ${p([knee[0] + 16 * (side === 'left' ? 1 : -1), knee[1]])} ${p([i[0], i[1] + 14])} ${p(i)}${through(inner)} Z`;
}

/** The whole leg's skin in either pose, as one or two pieces (the seated thigh is drawn over the shin). */
export function legPaths(pose: Pose, side: 'left' | 'right'): string[] {
  if (pose === 'standing') return [tubePath(LEG_STANDING, side, 0, 440, ANKLE.standing + 6)];
  return [tubePath(SHIN_SEATED, side, 0, 502, ANKLE.seated + 6), thighPath(side)];
}

/** A shoe: from above the ankle to the sole, the toe turned a little out. `kind` changes its shape. */
export function shoePath(pose: Pose, side: 'left' | 'right', kind: 'trainer' | 'flat' | 'boot' | 'smart'): string {
  const a = ANKLE[pose];
  const s = SOLE[pose];
  const top = kind === 'boot' ? a - 34 : kind === 'trainer' ? a - 6 : a + 4;
  const pts: Pt[] = [
    [166, top],
    [184, top],
    [188, a + 16],
    [191, s - 10],
    [190, s - 1],
    [176, s + 1],
    [158, s - 1],
    [154, s - 8],
    [160, a + 20],
    [164, a + 6],
  ];
  return smoothShape(side === 'left' ? pts : mirror(pts), kind === 'smart' ? 0.7 : 0.9);
}

/** The prosthetic below the left knee: a socket, a pylon and the ankle. */
export function prostheticParts(pose: Pose): { socket: string; pylon: string; joint: string } {
  const k = KNEE[pose];
  const a = ANKLE[pose];
  if (pose === 'standing') {
    return {
      socket: smoothShape(
        [
          [159, k - 18],
          [193, k - 18],
          [192, k + 16],
          [186, k + 44],
          [176, k + 52],
          [166, k + 44],
          [160, k + 16],
        ],
        0.8,
      ),
      pylon: `M 172 ${k + 48} L 180 ${k + 48} L 180 ${a + 4} L 172 ${a + 4} Z`,
      joint: `M 168 ${a - 2} L 184 ${a - 2} L 184 ${a + 10} L 168 ${a + 10} Z`,
    };
  }
  return {
    socket: smoothShape(
      [
        [156, 506],
        [192, 506],
        [190, 530],
        [184, 550],
        [174, 556],
        [164, 550],
        [158, 530],
      ],
      0.8,
    ),
    pylon: `M 170 552 L 178 552 L 178 ${a + 4} L 170 ${a + 4} Z`,
    joint: `M 166 ${a - 2} L 182 ${a - 2} L 182 ${a + 10} L 166 ${a + 10} Z`,
  };
}

/* ───────── Colour ───────── */

const hex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

/** Two colours mixed: t of the way from a to b. */
export function mix(a: string, b: string, t: number): string {
  const [x, y] = [rgb(a), rgb(b)];
  return `#${x.map((v, i) => hex(v + (y[i] - v) * t)).join('')}`;
}
export const darken = (c: string, t: number) => mix(c, '#000000', t);
export const lighten = (c: string, t: number) => mix(c, '#ffffff', t);
