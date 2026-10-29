import type { EarthSample } from './slides';

/*
 * The loose dust on top of each slide, drawn over the photograph (slides.ts)
 * for the cloth to wipe: each grain is generated from a seed, so a slide
 * looks the same every time it is laid on the stage. On the Moon's slide it
 * is a scatter of fine dark dust and small shards, which cling to the cloth;
 * on Earth's, a few loose grains in the photograph's colors, which brush
 * aside.
 *
 * Only the poster's words make claims: lunar dust is sharp and jagged and
 * clings because of static. The drawn dust is illustration and makes no
 * claim of its own.
 *
 * Coordinates are in "slide units": the eyepiece at its lowest power shows the
 * disc of radius 1 around the origin.
 */

export type SampleId = 'moon' | EarthSample;

export type GrainKind = 'grain' | 'speck';

export type Grain = {
  x: number;
  y: number;
  /** Radius, in slide units. */
  r: number;
  rot: number;
  kind: GrainKind;
  /** The outline: a radius multiplier at evenly spaced angles. */
  shape: number[];
  /** HSL: hue, saturation %, lightness %. */
  h: number;
  s: number;
  l: number;
  /** Small marks drawn on the grain at high power (pits), in grain units. */
  marks: { x: number; y: number; r: number }[];
};

/** A small, fast seeded generator (mulberry32). */
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

/** A sharp, broken outline: few corners, deep notches, the odd spike. */
function jagged(rand: () => number): number[] {
  const n = 6 + Math.floor(rand() * 6);
  return Array.from({ length: n }, () => {
    const roll = rand();
    if (roll < 0.14) return 0.35 + rand() * 0.2; // a notch
    if (roll > 0.9) return 1.15 + rand() * 0.25; // a spike
    return 0.65 + rand() * 0.4;
  });
}

/** A smooth outline: a circle bent by two gentle waves. */
function smooth(rand: () => number, stretch: number, wobble: number): number[] {
  const n = 24;
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const a2 = wobble * (0.5 + rand() * 0.5);
  const a3 = wobble * 0.5 * rand();
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    // An ellipse of the given stretch, then the waves.
    const ell = 1 / Math.sqrt(Math.cos(t) ** 2 + (Math.sin(t) * stretch) ** 2);
    return ell * (1 + a2 * Math.sin(2 * t + p1) + a3 * Math.sin(3 * t + p2));
  });
}

/**
 * Lay grains on the disc without much overlap: try a spot, keep it if it is
 * clear of the grains already laid. Bigger grains go first.
 */
function scatter(rand: () => number, sizes: number[], spread: number, overlap: number): { x: number; y: number; r: number }[] {
  const placed: { x: number; y: number; r: number }[] = [];
  for (const r of sizes.sort((a, b) => b - a)) {
    for (let tries = 0; tries < 40; tries++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * spread;
      const x = Math.cos(a) * d;
      const y = Math.sin(a) * d;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > (p.r + r) * overlap)) {
        placed.push({ x, y, r });
        break;
      }
    }
  }
  return placed;
}

function sizes(rand: () => number, n: number, min: number, max: number): number[] {
  // More small grains than large ones.
  return Array.from({ length: n }, () => min + (max - min) * Math.pow(rand(), 1.8));
}

function marks(rand: () => number, n: number, size: number) {
  return Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * 0.55;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, r: size * (0.4 + rand() * 0.6) };
  });
}

const SPREAD = 1.25;

/** Hue, saturation and lightness ranges for each Earth slide's loose grains. */
const EARTH_TINTS: Record<EarthSample, [number, number, number, number, number, number]> = {
  wind: [28, 44, 40, 60, 55, 75],
  water: [200, 220, 6, 14, 66, 84],
  life: [14, 34, 30, 50, 72, 86],
};

const SEEDS: Record<SampleId, number> = { moon: 1969, wind: 7, water: 11, life: 23 };

/** Every grain on a slide, back to front. */
export function makeSlide(id: SampleId): Grain[] {
  const rand = rng(SEEDS[id]);
  const out: Grain[] = [];
  const add = (g: Omit<Grain, 'rot'>) => out.push({ ...g, rot: rand() * Math.PI * 2 });

  if (id === 'moon') {
    // Small dark shards, and a haze of fine dust between them.
    for (const p of scatter(rand, sizes(rand, 140, 0.012, 0.05), SPREAD, 0.86)) {
      add({ ...p, kind: 'grain', shape: jagged(rand), h: 24 + rand() * 16, s: 4 + rand() * 8, l: 16 + rand() * 20, marks: marks(rand, 2 + Math.floor(rand() * 4), 0.12) });
    }
    for (let i = 0; i < 900; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * SPREAD;
      add({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: 0.003 + rand() * 0.007, kind: 'speck', shape: jagged(rand), h: 30, s: 6, l: 18 + rand() * 24, marks: [] });
    }
  } else {
    // A few loose, rounded grains in the photograph's own colors.
    const [h0, h1, s0, s1, l0, l1] = EARTH_TINTS[id];
    for (const p of scatter(rand, sizes(rand, 60, 0.012, 0.032), SPREAD, 1.6)) {
      add({ ...p, kind: 'grain', shape: smooth(rand, 1 + rand() * 0.3, 0.05), h: h0 + rand() * (h1 - h0), s: s0 + rand() * (s1 - s0), l: l0 + rand() * (l1 - l0), marks: [] });
    }
  }
  return out;
}
