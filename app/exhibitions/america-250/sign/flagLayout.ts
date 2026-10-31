import { FLAG_MILESTONES } from './signText';

/*
 * The flag's drawing, from 13 stars to 50. Proportions from Executive Order
 * 10834 (hoist 1, fly 1.9, the union 7/13 of the hoist and 0.76 wide). The
 * 50 stars are set as the order sets them (nine rows, six and five); every
 * other count is a generic arrangement, evenly spread in rows, and claims no
 * historical flag. Pure functions, so they can be tested.
 */

/** The flag's drawing space: a hoist of 1000. */
export const FLAG = { w: 1900, h: 1000, unionW: 760 };

export type StarPos = { x: number; y: number; r: number };

/** How many stripes the flag has at `stars` stars: 15 from 1795 until 1818, 13 otherwise. */
export function stripesFor(stars: number) {
  const m1795 = FLAG_MILESTONES.find((m) => m.year === 1795)!.stars;
  const m1818 = FLAG_MILESTONES.find((m) => m.year === 1818)!.stars;
  return stars >= m1795 && stars < m1818 ? 15 : 13;
}

/** The union's height: down to the foot of the stripe that ends it (the seventh of 13, the eighth of 15). */
export function unionHeight(stripes: number) {
  return (FLAG.h * Math.ceil(stripes / 2)) / stripes;
}

/** The stars' places in the union. */
export function starLayout(n: number, stripes = stripesFor(n)): StarPos[] {
  const uw = FLAG.unionW;
  const uh = unionHeight(stripes);
  if (n <= 0) return [];
  if (n === 50) {
    // Executive Order 10834: nine rows, alternately six and five stars.
    const out: StarPos[] = [];
    for (let row = 0; row < 9; row++) {
      const even = row % 2 === 0;
      for (let j = 0; j < (even ? 6 : 5); j++) {
        out.push({ x: 63 + (even ? 2 * j : 2 * j + 1) * 63, y: 54 + row * 54, r: 30.8 });
      }
    }
    return out;
  }
  // A generic arrangement: rows as even as can be, each centred.
  const rows = Math.max(1, Math.round(Math.sqrt((n * uh) / uw)));
  const base = Math.floor(n / rows);
  const extra = n % rows;
  // The extra stars go to alternate rows first, so the rows interleave.
  const order = [...Array.from({ length: rows }, (_, i) => i).filter((i) => i % 2 === 0), ...Array.from({ length: rows }, (_, i) => i).filter((i) => i % 2 === 1)];
  const sizes = Array.from({ length: rows }, () => base);
  for (let k = 0; k < extra; k++) sizes[order[k]]++;
  const most = Math.max(...sizes);
  const dx = uw / most;
  const dy = uh / rows;
  const r = Math.min(dx, dy) * 0.36;
  const out: StarPos[] = [];
  sizes.forEach((count, row) => {
    const left = (uw - count * dx) / 2 + dx / 2;
    for (let j = 0; j < count; j++) out.push({ x: left + j * dx, y: dy * (row + 0.5), r });
  });
  return out;
}

/** A five-pointed star of outer radius r about (x, y), one point up, as an SVG path. */
export function starPath({ x, y, r }: StarPos) {
  const inner = r * 0.382;
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : inner;
    d += `${i === 0 ? 'M' : 'L'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`;
  }
  return `${d}Z`;
}

/** The milestones passed at `stars` stars, oldest first. */
export function milestonesAt(stars: number) {
  return FLAG_MILESTONES.filter((m) => stars >= m.stars);
}
