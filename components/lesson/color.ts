/** Mix a hex color toward another, t in 0–1. */
export function mix(a: string, b: string, t: number): string {
  const pa = parse(a);
  const pb = parse(b);
  const out = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function parse(h: string): number[] {
  const s = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

export const PARCHMENT = '#F5EDD8';

/**
 * The PDF's phase colors are chosen for white paper. On the dark exhibition
 * ground they are lifted toward parchment so a ring or a dot still reads.
 */
export function onDark(hex: string): string {
  return mix(hex, PARCHMENT, 0.42);
}
