/*
 * How the optical toys turn, as pure functions (tested).
 *
 * The toys work the way the real ones do: nothing on screen ever shows the
 * finished picture as a still. The thaumatrope's disc really turns, so its
 * two sides really flicker in turn, and only a fast twirl puts the bird in
 * its cage. The zoetrope's drawings are seen only through its slits, a
 * sliver at a time, so only a fast spin lets the glimpses join up and move.
 *
 * Because of that, the toys flicker when they go fast, as the real ones do.
 * Up to three flickers a second is free to anyone; faster than that, the
 * room asks first (FlickerGate), and under reduced motion nothing turns.
 *
 * The speed is a smooth control of SPEED_STEPS small steps. Its first step
 * is very slow, and each step is the same small fraction faster than the
 * last, from the toy's slowest speed to its fastest.
 */

export const TAU = Math.PI * 2;

/** Ease a speed toward a target: `rate` turns a second, every second. */
export function approach(speed: number, target: number, dt: number, rate: number) {
  const step = rate * dt;
  if (Math.abs(target - speed) <= step) return target;
  return speed + Math.sign(target - speed) * step;
}

// ───────── The speed control ─────────

/** Steps on the speed control, above "still" (0). */
export const SPEED_STEPS = 200;

export type ToyId = 'thaumatrope' | 'zoetrope';

/**
 * Each toy's speeds, in turns a second: the slowest, the fastest, and how
 * many flickers each turn makes (the disc's two sides; the drum's twelve
 * slits going past).
 */
export const TOY_SPEEDS: Record<ToyId, { min: number; top: number; flickersPerTurn: number }> = {
  // Two sides a turn: at the top, 20 changes a second, as a twirled card makes.
  thaumatrope: { min: 0.12, top: 10, flickersPerTurn: 2 },
  // Twelve slits a turn: at the top, 15 glimpses a second.
  zoetrope: { min: 0.015, top: 1.25, flickersPerTurn: 12 },
};

/** Flickers a second up to which the toys run without asking. */
export const FLICKER_FREE = 3;

/** Turns a second at step `v` of the speed control (0 is still). */
export function speedAt(toy: ToyId, v: number) {
  const { min, top } = TOY_SPEEDS[toy];
  if (v <= 0) return 0;
  const u = (Math.min(SPEED_STEPS, v) - 1) / (SPEED_STEPS - 1);
  return min * (top / min) ** u;
}

/** Flickers a second at `rps` turns a second. */
export function flickerRate(toy: ToyId, rps: number) {
  return Math.abs(rps) * TOY_SPEEDS[toy].flickersPerTurn;
}

/** The highest step that flickers no more than FLICKER_FREE times a second. */
export function flickerFreeStep(toy: ToyId) {
  let v = 0;
  while (v < SPEED_STEPS && flickerRate(toy, speedAt(toy, v + 1)) <= FLICKER_FREE) v++;
  return v;
}

/** The step the visitor may stand on: held at the flicker-free step until they say yes. */
export function allowedStep(toy: ToyId, v: number, flickerOk: boolean) {
  const clamped = Math.max(0, Math.min(SPEED_STEPS, Math.round(v)));
  return flickerOk ? clamped : Math.min(clamped, flickerFreeStep(toy));
}

/** "Twirl" and "Spin" climb the control by themselves this many steps a second: from the slowest to the fastest in about a minute. */
export const CLIMB_RATE = 3.5;

// ───────── The thaumatrope ─────────

/** Which side faces the visitor at a turn of `angle` radians about the strings. */
export function faceAt(angle: number): 'front' | 'back' {
  const a = ((angle % TAU) + TAU) % TAU;
  return a < Math.PI / 2 || a >= (3 * Math.PI) / 2 ? 'front' : 'back';
}

/** What the visitor is watching at a speed of the thaumatrope. */
export function thaumaSeen(rps: number): 'still' | 'sides' | 'flicker' | 'together' {
  const f = flickerRate('thaumatrope', rps);
  if (f === 0) return 'still';
  if (f < 3) return 'sides';
  if (f < 12) return 'flicker';
  return 'together';
}

// ───────── The zoetrope ─────────

/** Pictures round the drum, and slits in its wall. */
export const ZOE_FRAMES = 12;
const SLOT = TAU / ZOE_FRAMES;

/** The picture opposite the front slit at a drum turned `angle` radians. */
export function frameAt(angle: number, n = ZOE_FRAMES) {
  const u = (((angle / TAU) % 1) + 1) % 1;
  return Math.floor(u * n + 1e-9) % n;
}

/** Pictures a second seen through the slits. */
export function picturesPerSecond(rps: number, n = ZOE_FRAMES) {
  return Math.abs(rps) * n;
}

/** What the visitor is watching through the slits at a speed of the zoetrope. */
export function zoeSeen(rps: number): 'still' | 'sliver' | 'glimpses' | 'moving' {
  const f = flickerRate('zoetrope', rps);
  if (f === 0) return 'still';
  if (f < 2) return 'sliver';
  if (f < 10) return 'glimpses';
  return 'moving';
}

/**
 * Looking through the drum's wall, close up: where each slit is, and which
 * picture shows through it. The view is one slit's spacing wide (0 to 1
 * across); the slits run left to right as the drum turns. Each slit shows
 * the picture opposite it, so each slit that passes shows the next picture.
 * Returned: the slits now in view, with their centres (in spacings, 0 at the
 * view's left edge) and their pictures.
 */
export function slitsInView(angle: number, n = ZOE_FRAMES) {
  const turns = angle / SLOT;
  const whole = Math.floor(turns);
  const frac = turns - whole;
  const out: { x: number; picture: number }[] = [];
  for (let m = -1; m <= 1; m++) {
    const x = frac + m;
    // The slit's own number round the drum; later slits arrive from the left.
    const id = m - whole;
    out.push({ x, picture: (((-id) % n) + n) % n });
  }
  return out;
}

/**
 * How much of the view one slit uncovers, as a share of the spacing between
 * slits: wide enough that at the top speed, on a screen showing 60 pictures
 * a second, the slit's places between one frame and the next tile the view
 * (15 slits a second, four frames each).
 */
export const SLIT_SHARE = 0.27;
