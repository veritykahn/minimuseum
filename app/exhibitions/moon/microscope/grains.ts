/*
 * The slides under the microscope, drawn rather than photographed: each grain
 * is generated from a seed, so a slide looks the same every time it is laid
 * on the stage.
 *
 * Only the poster's words make claims: lunar dust is sharp and jagged and
 * clings because of static; Earth's soil is shaped by wind, water and living
 * things. The shapes and colors of the Earth slides are illustration, one
 * slide for each of the poster's three words, and make no claim of their own.
 *
 * Coordinates are in "slide units": the eyepiece at its lowest power shows the
 * disc of radius 1 around the origin.
 */

export type SampleId = 'moon' | 'wind' | 'water' | 'life';
export type EarthSample = Exclude<SampleId, 'moon'>;

export type GrainKind = 'grain' | 'speck' | 'shell' | 'fiber';

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
  /** Small marks drawn on the grain at high power (pits, ridges), in grain units. */
  marks: { x: number; y: number; r: number }[];
};

export const EARTH_SAMPLES: { id: EarthSample; label: string }[] = [
  { id: 'wind', label: 'Wind' },
  { id: 'water', label: 'Water' },
  { id: 'life', label: 'Living things' },
];

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

function pick<T>(rand: () => number, xs: T[]): T {
  return xs[Math.floor(rand() * xs.length)];
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

const SEEDS: Record<SampleId, number> = { moon: 1969, wind: 7, water: 11, life: 23 };

/** Every grain on a slide, back to front. */
export function makeSlide(id: SampleId): Grain[] {
  const rand = rng(SEEDS[id]);
  const out: Grain[] = [];
  const add = (g: Omit<Grain, 'rot'>) => out.push({ ...g, rot: rand() * Math.PI * 2 });

  if (id === 'moon') {
    // Gray shards of every size, and a haze of fine dust between them.
    for (const p of scatter(rand, sizes(rand, 230, 0.018, 0.12), SPREAD, 0.86)) {
      add({ ...p, kind: 'grain', shape: jagged(rand), h: 250 + rand() * 30, s: 4 + rand() * 8, l: 34 + rand() * 30, marks: marks(rand, 2 + Math.floor(rand() * 4), 0.12) });
    }
    for (let i = 0; i < 700; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * SPREAD;
      add({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: 0.003 + rand() * 0.007, kind: 'speck', shape: jagged(rand), h: 255, s: 6, l: 40 + rand() * 30, marks: [] });
    }
  } else if (id === 'wind') {
    for (const p of scatter(rand, sizes(rand, 120, 0.05, 0.12), SPREAD, 1.02)) {
      add({ ...p, kind: 'grain', shape: smooth(rand, 1 + rand() * 0.25, 0.05), h: 30 + rand() * 14, s: 42 + rand() * 30, l: 52 + rand() * 26, marks: marks(rand, 10, 0.05) });
    }
  } else if (id === 'water') {
    const tints: [number, number, number][] = [
      [214, 12, 58],
      [18, 42, 46],
      [40, 18, 84],
      [225, 8, 32],
      [32, 30, 66],
    ];
    for (const p of scatter(rand, sizes(rand, 110, 0.05, 0.14), SPREAD, 1.04)) {
      const [h, s, l] = pick(rand, tints);
      add({ ...p, kind: 'grain', shape: smooth(rand, 1.1 + rand() * 0.5, 0.03), h: h + rand() * 8, s, l: l + (rand() - 0.5) * 10, marks: [] });
    }
  } else {
    // Crumbs, curved pieces and threads, as illustration.
    for (const p of scatter(rand, sizes(rand, 120, 0.04, 0.13), SPREAD, 0.95)) {
      const roll = rand();
      if (roll < 0.28) {
        add({ ...p, kind: 'shell', shape: [], h: 24 + rand() * 16, s: 30 + rand() * 30, l: 76 + rand() * 12, marks: [] });
      } else if (roll < 0.42) {
        add({ ...p, r: p.r * 1.6, kind: 'fiber', shape: [rand() - 0.5, rand() - 0.5, rand() - 0.5], h: 28, s: 30 + rand() * 20, l: 30 + rand() * 18, marks: [] });
      } else {
        add({ ...p, kind: 'grain', shape: smooth(rand, 1 + rand() * 0.3, 0.12), h: 20 + rand() * 14, s: 28 + rand() * 24, l: 22 + rand() * 22, marks: marks(rand, 5, 0.08) });
      }
    }
  }
  return out;
}
