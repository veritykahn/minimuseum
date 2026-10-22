/**
 * Year arithmetic for the Gospel Timeline's date ribbon.
 *
 * There is no year zero: 1 BC is followed directly by AD 1. To measure
 * distances we convert to astronomical numbering (1 BC = 0, 2 BC = -1,
 * 5 BC = -4; AD years unchanged), so 5 BC to AD 1 is five years, not six.
 */

export type Year = { year: number; era: 'BC' | 'AD' };

export const BC = (year: number): Year => ({ year, era: 'BC' });
export const AD = (year: number): Year => ({ year, era: 'AD' });

export function toAstronomical(y: Year): number {
  if (!Number.isInteger(y.year) || y.year < 1) throw new RangeError(`No year ${y.year} ${y.era}`);
  return y.era === 'AD' ? y.year : 1 - y.year;
}

/** Years elapsed from a to b (negative if b is earlier). */
export function yearsBetween(a: Year, b: Year): number {
  return toAstronomical(b) - toAstronomical(a);
}

/** The site writes dates as "5 BC" and "62 AD". */
export function formatYear(y: Year): string {
  return `${y.year} ${y.era}`;
}

export const RIBBON_START: Year = BC(5);
export const RIBBON_END: Year = AD(62);

/** Fractional position (0 to 1) of a year along the ribbon. */
export function ribbonPosition(y: Year, start: Year = RIBBON_START, end: Year = RIBBON_END): number {
  const span = yearsBetween(start, end);
  return Math.min(1, Math.max(0, yearsBetween(start, y) / span));
}

/** Position of a dated window: the midpoint of from..to (or the year itself). */
export function windowPosition(from: Year, to?: Year, start: Year = RIBBON_START, end: Year = RIBBON_END): number {
  if (!to) return ribbonPosition(from, start, end);
  return (ribbonPosition(from, start, end) + ribbonPosition(to, start, end)) / 2;
}

/**
 * Read `?stop=N` (1-based). Returns a 0-based index, or null when the
 * parameter is missing or not a whole number between 1 and count.
 */
export function parseStopParam(value: string | null | undefined, count: number): number | null {
  if (value == null || !/^\d+$/.test(value.trim())) return null;
  const n = parseInt(value, 10);
  return n >= 1 && n <= count ? n - 1 : null;
}
