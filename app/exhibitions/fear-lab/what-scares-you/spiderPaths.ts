/*
 * The spiders' paths, worked out ahead so they can be tested: each spider
 * starts in the open box and wanders out past an edge of the screen, along
 * its own wavering line. Only the points are worked out here; the spiders
 * run along them with transforms alone (Swarm.tsx), which an iPad can keep
 * smooth.
 */

export type Point = { x: number; y: number };

export type SpiderPath = {
  /** Where it is at each step, in px from the screen's top left, and which way it faces (degrees, 0 = up). */
  steps: (Point & { turn: number })[];
  /** Its size, in px. */
  size: number;
  /** When it starts, and how long it takes, in ms. */
  delay: number;
  duration: number;
};

/** How many spiders: lots and lots, scaled to the screen, or a handful in gentle mode. */
export function spiderCount(width: number, height: number, gentle: boolean): number {
  if (gentle) return 10;
  return Math.max(36, Math.min(110, Math.round((width * height) / 11000)));
}

/** The longest any spider takes to get out, start to finish, in ms. */
export const swarmLength = (gentle: boolean) => (gentle ? 5600 : 4000);

/** Where a ray from `o` at `angle` (radians) leaves the screen, a little past the edge. */
function exitPoint(o: Point, angle: number, w: number, h: number, past: number): Point {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const tx = dx > 0 ? (w + past - o.x) / dx : dx < 0 ? (-past - o.x) / dx : Infinity;
  const ty = dy > 0 ? (h + past - o.y) / dy : dy < 0 ? (-past - o.y) / dy : Infinity;
  const t = Math.min(tx, ty);
  return { x: o.x + dx * t, y: o.y + dy * t };
}

export function makeSwarm({
  width,
  height,
  origin,
  gentle,
  count = spiderCount(width, height, gentle),
  rand = Math.random,
}: {
  width: number;
  height: number;
  origin: Point;
  gentle: boolean;
  count?: number;
  rand?: () => number;
}): SpiderPath[] {
  const total = swarmLength(gentle);
  return Array.from({ length: count }, (_, i) => {
    const size = gentle ? 44 + rand() * 18 : 18 + rand() * 38;
    // Spread evenly round the box, then jostled, so they cover the whole screen.
    const angle = ((i + rand() * 0.8) / count) * Math.PI * 2;
    const start = { x: origin.x + (rand() - 0.5) * 40, y: origin.y + (rand() - 0.5) * 20 };
    const end = exitPoint(start, angle, width, height, size + 20);
    // A wavering line: a sideways wobble that grows and shrinks along the way.
    const n = gentle ? 5 : 4 + Math.floor(rand() * 4);
    const len = Math.hypot(end.x - start.x, end.y - start.y);
    const nx = -(end.y - start.y) / (len || 1);
    const ny = (end.x - start.x) / (len || 1);
    const sway = (gentle ? 0.06 : 0.04 + rand() * 0.14) * len;
    const phase = rand() * Math.PI * 2;
    const turns = 1 + rand() * 1.5;
    const pts: Point[] = Array.from({ length: n + 1 }, (_, k) => {
      const t = k / n;
      const off = k === 0 || k === n ? 0 : Math.sin(phase + t * Math.PI * 2 * turns) * sway * Math.sin(t * Math.PI);
      return { x: start.x + (end.x - start.x) * t + nx * off, y: start.y + (end.y - start.y) * t + ny * off };
    });
    // Which way it faces on each leg of the way, kept continuous so it never spins the long way round.
    let last = 0;
    const steps = pts.map((p, k) => {
      const a = pts[Math.min(k, n - 1)];
      const b = pts[Math.min(k + 1, n)];
      let turn = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
      if (k > 0) turn = last + ((((turn - last) % 360) + 540) % 360) - 180;
      last = turn;
      return { x: Math.round(p.x), y: Math.round(p.y), turn: Math.round(turn) };
    });
    const duration = gentle ? 3800 + rand() * 1200 : 1600 + rand() * 1400;
    const delay = Math.min(rand() * (gentle ? 1200 : 1600), total - duration);
    return { steps, size: Math.round(size), delay: Math.max(0, Math.round(delay)), duration: Math.round(duration) };
  });
}
