/*
 * How the optical toys turn, as pure functions (tested): speeding up and
 * slowing down, and what the eye is shown at each speed.
 *
 * The rule for both toys: nothing may flash more than three times a second.
 * A twirled disc alternates its two sides once a turn, so the room shows the
 * sides alternating only while the disc turns slowly, and past that shows
 * them merged, steady, as the eye sees them. The zoetrope's slits are drawn
 * only while fewer than three pass a second; faster, they blur to an even
 * band, and the figures inside move instead (at 15 pictures a second at most).
 */

export const TAU = Math.PI * 2;

/** Ease a speed toward a target: `rate` turns a second, every second. */
export function approach(speed: number, target: number, dt: number, rate: number) {
  const step = rate * dt;
  if (Math.abs(target - speed) <= step) return target;
  return speed + Math.sign(target - speed) * step;
}

// ───────── The thaumatrope ─────────

/** Turns a second when twirled. */
export const THAUMA_TOP = 4;
/** Below this many turns a second the sides are shown turning; above THAUMA_MERGED, merged. */
export const THAUMA_SEEN = 1;
export const THAUMA_MERGED = 1.5;

/** How far the two sides have merged into one picture, from 0 to 1, at `rps` turns a second. */
export function thaumaBlend(rps: number) {
  const s = Math.abs(rps);
  if (s <= THAUMA_SEEN) return 0;
  if (s >= THAUMA_MERGED) return 1;
  return (s - THAUMA_SEEN) / (THAUMA_MERGED - THAUMA_SEEN);
}

/** Which side faces the visitor at a turn of `angle` radians about the strings. */
export function faceAt(angle: number): 'front' | 'back' {
  const a = ((angle % TAU) + TAU) % TAU;
  return a < Math.PI / 2 || a >= (3 * Math.PI) / 2 ? 'front' : 'back';
}

/**
 * How often the sides alternate, in changes a second, at `rps` turns a second,
 * as the room draws them: twice a turn while they are seen, never once merged.
 */
export function alternationsPerSecond(rps: number) {
  return thaumaBlend(rps) >= 1 ? 0 : 2 * Math.abs(rps);
}

// ───────── The zoetrope ─────────

/** Pictures round the drum, and slits in its wall. */
export const ZOE_FRAMES = 12;
/** The drum's top speed, in turns a second: 15 pictures a second. */
export const ZOE_TOP = 1.25;
/** Above this, the slits strobe the strip: each picture is seen in place, moving. */
export const ZOE_STROBE = 0.3;

/** The picture seen through the front slit at a drum turned `angle` radians. */
export function frameAt(angle: number, n = ZOE_FRAMES) {
  const u = (((angle / TAU) % 1) + 1) % 1;
  return Math.floor(u * n + 1e-9) % n;
}

/** How strongly the slits are drawn at `rps` turns a second: fading out as three a second go by. */
export function slitStrength(rps: number, n = ZOE_FRAMES) {
  return Math.max(0, 1 - (Math.abs(rps) * n) / 3);
}

/** Pictures a second seen through the slits. */
export function picturesPerSecond(rps: number, n = ZOE_FRAMES) {
  return Math.abs(rps) * n;
}
