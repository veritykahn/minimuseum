import type { Grain } from './grains';

/*
 * Wiping a slide with a cloth. Moon dust clings: a grain the cloth touches
 * sticks to it and travels with it, and the cloth turns gray. Earth's grains
 * are pushed aside, leaving a clear path, and the cloth stays clean. (The
 * poster: lunar dust can "stick to everything because of static electricity",
 * and was "hard to clean off their suits".)
 */

/** Marks a grain that fell from the cloth during this wipe. */
const DROPPED = 1e9;

export type Cloth ={ x: number; y: number; vx: number; vy: number; r: number };

/** Where each grain on a slide lies now, and whether it is stuck to the cloth. */
export type SlideState = {
  x: Float32Array;
  y: Float32Array;
  /** 1 while stuck to the cloth; its offset from the cloth's center is in ox, oy. */
  stuck: Uint8Array;
  ox: Float32Array;
  oy: Float32Array;
};

export function freshState(grains: Grain[]): SlideState {
  const n = grains.length;
  const s: SlideState = { x: new Float32Array(n), y: new Float32Array(n), stuck: new Uint8Array(n), ox: new Float32Array(n), oy: new Float32Array(n) };
  grains.forEach((g, i) => {
    s.x[i] = g.x;
    s.y[i] = g.y;
  });
  return s;
}

/**
 * One step of the cloth across the slide. `accept` limits it to part of the
 * slide (one side of the split). Returns how many grains newly stuck to the
 * cloth (clingy) or were pushed (not).
 */
export function wipeStep(
  grains: Grain[],
  s: SlideState,
  cloth: Cloth,
  clingy: boolean,
  accept: (x: number) => boolean = () => true,
  rand: () => number = Math.random,
): number {
  let touched = 0;
  for (let i = 0; i < grains.length; i++) {
    const g = grains[i];
    if (clingy && s.stuck[i]) {
      // Now and then a grain drops off again, so the dust is smeared along the
      // cloth's path rather than cleared away.
      if (rand() < 0.03) {
        s.stuck[i] = 0;
        s.ox[i] = DROPPED;
        continue;
      }
      // Stuck grains ride with the cloth, settling in toward its middle.
      s.ox[i] *= 0.985;
      s.oy[i] *= 0.985;
      s.x[i] = cloth.x + s.ox[i];
      s.y[i] = cloth.y + s.oy[i];
      continue;
    }
    if (!accept(s.x[i])) continue;
    // A grain just dropped is not picked straight up again.
    if (clingy && s.ox[i] === DROPPED) continue;
    const dx = s.x[i] - cloth.x;
    const dy = s.y[i] - cloth.y;
    const d = Math.hypot(dx, dy);
    const reach = cloth.r + g.r * (clingy ? 0.4 : 1);
    if (d >= reach) continue;
    if (clingy && g.kind !== 'speck' && (Math.imul(i, 2654435761) >>> 0) % 10 >= 7) {
      // Some grains hold to the slide instead: the cloth only smears them.
      s.x[i] += cloth.vx * 0.04;
      s.y[i] += cloth.vy * 0.04;
      continue;
    }
    touched++;
    if (clingy) {
      s.stuck[i] = 1;
      const k = d > cloth.r * 0.92 ? (cloth.r * 0.92) / d : 1;
      s.ox[i] = dx * k;
      s.oy[i] = dy * k;
    } else {
      // Out to the cloth's rim, and on a little in the way it is moving.
      const nx = d > 1e-6 ? dx / d : 1;
      const ny = d > 1e-6 ? dy / d : 0;
      s.x[i] = cloth.x + nx * reach + cloth.vx * 0.35;
      s.y[i] = cloth.y + ny * reach + cloth.vy * 0.35;
    }
  }
  return touched;
}

/** The cloth lifts: whatever was stuck to it stays where it is. */
export function releaseCloth(s: SlideState) {
  s.stuck.fill(0);
  s.ox.fill(0);
  s.oy.fill(0);
}

/** How many grains on the slide have moved from where they were laid. */
export function movedCount(grains: Grain[], s: SlideState): number {
  let n = 0;
  grains.forEach((g, i) => {
    if (Math.hypot(s.x[i] - g.x, s.y[i] - g.y) > g.r * 0.5) n++;
  });
  return n;
}
