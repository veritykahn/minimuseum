/*
 * The workshop's working parts, as pure functions (tested): the
 * five-needle telegraph's dial, and the town clocks on the line.
 *
 * The dial: five needles in a row, each turning on its centre. A letter
 * sits where two needles' lines cross: needle i leaning one way and needle j
 * the other, so the pair points to it. Above the row, the letters of pairs
 * whose needles' tops lean in towards each other; below, those whose
 * bottoms do. Ten pairs above and ten below make the dial's 20 letters, set
 * in the diamond the drawings of the dial show.
 */

export const NEEDLES = 5;
/** The dial's rows, top to bottom: four above the needles, four below. */
export const DIAL_ROWS = ['A', 'BD', 'EFG', 'HIKL', 'MNOP', 'RST', 'VW', 'Y'];
export const DIAL_LETTERS = DIAL_ROWS.join('');

export type DialLetter = { letter: string; /** The pair of needles, numbered 1 to 5. */ i: number; j: number; above: boolean; /** Where it sits, in needle spacings, from the first needle; y is negative above. */ x: number; y: number };

export const DIAL: DialLetter[] = DIAL_ROWS.flatMap((row, r) => {
  const above = r < 4;
  // The gap between the pair: 4 at the top and bottom points, 1 next to the needles.
  const d = above ? 4 - r : r - 3;
  return row.split('').map((letter, k) => {
    const i = k + 1;
    const j = i + d;
    return { letter, i, j, above, x: (i + j) / 2, y: above ? -d / 2 : d / 2 };
  });
});

export const onDial = (c: string) => DIAL_LETTERS.includes(c.toUpperCase());

/**
 * The needles' angles for a letter, in degrees from upright, needle 1 first
 * (positive leans the top to the right). A letter not on the dial, or none,
 * leaves them all upright.
 */
export function needleAngles(letter: string | null): number[] {
  const a = Array.from({ length: NEEDLES }, () => 0);
  const l = letter ? DIAL.find((x) => x.letter === letter.toUpperCase()) : undefined;
  if (!l) return a;
  a[l.i - 1] = l.above ? 45 : -45;
  a[l.j - 1] = l.above ? -45 : 45;
  return a;
}

/** The letters of a message the dial can show, in order; the rest it cannot. */
export function spell(message: string) {
  const out: string[] = [];
  const skipped = new Set<string>();
  for (const c of message.toUpperCase()) {
    if (!/[A-Z]/.test(c)) continue;
    if (onDial(c)) out.push(c);
    else skipped.add(c);
  }
  return { letters: out, skipped: [...skipped] };
}

/**
 * A clock's hands, in degrees turned from twelve, for a time in minutes
 * after midnight. The turns are counted, not wrapped, so a clock set
 * forward turns its hands forward.
 */
export function hands(minutes: number) {
  return { hour: (minutes / 720) * 360, minute: (minutes / 60) * 360 };
}

/** A time in minutes after midnight, as a clock face reads it ("11:49", with half a minute as "½"). */
export function clockTime(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60) % 12 || 12;
  const whole = Math.floor(m % 60);
  const half = m % 1 >= 0.5 ? '½' : '';
  return `${h}:${String(whole).padStart(2, '0')}${half}`;
}
