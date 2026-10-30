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

/* ── The railway's map ── */

/**
 * The map of the south of England and Wales: a plain projection, its
 * degrees of longitude shortened as they are at London's latitude, in a
 * 1000 × 600 drawing that runs from 5.3° west to 0.9° east.
 */
export const MAP = { w: 1000, h: 600, lon0: -5.3, lat0: 52.25, k: 259, squash: Math.cos((51.5 * Math.PI) / 180) };
export function project(lon: number, lat: number) {
  return { x: Math.round((lon - MAP.lon0) * MAP.squash * MAP.k * 10) / 10, y: Math.round((MAP.lat0 - lat) * MAP.k * 10) / 10 };
}

/**
 * Where the Sun stands over the map at a London time (minutes after
 * midnight): over each town when that town's own clock says noon, and
 * between them in between. Towns with the same minutes share a spot
 * halfway between them.
 */
export function sunX(londonTime: number, towns: { behind: number; lon: number; lat: number }[]) {
  const by = new Map<number, number[]>();
  for (const t of towns) by.set(t.behind, [...(by.get(t.behind) ?? []), project(t.lon, t.lat).x]);
  const pts = [...by.entries()].map(([b, xs]) => ({ b, x: xs.reduce((s, x) => s + x, 0) / xs.length })).sort((a, z) => a.b - z.b);
  const m = londonTime - 12 * 60;
  if (m <= pts[0].b) return pts[0].x;
  for (let i = 1; i < pts.length; i++) {
    if (m <= pts[i].b) {
      const f = (m - pts[i - 1].b) / (pts[i].b - pts[i - 1].b);
      return Math.round((pts[i - 1].x + f * (pts[i].x - pts[i - 1].x)) * 10) / 10;
    }
  }
  return pts[pts.length - 1].x;
}

/** The London time at which the Sun stands over `x` on the map: sunX turned round, to the half minute, for dragging the Sun. */
export function sunTimeAt(x: number, towns: { behind: number; lon: number; lat: number }[], min: number, max: number) {
  let best = min;
  for (let t = min; t <= max; t += 0.5) if (Math.abs(sunX(t, towns) - x) < Math.abs(sunX(best, towns) - x)) best = t;
  return best;
}

/**
 * A clock's minute hand dragged to `angle` degrees from twelve: the time
 * nearest `current` whose minute hand stands there, to the whole minute,
 * so dragging past twelve carries the hour on (or back).
 */
export function dragMinute(current: number, angle: number) {
  const m = Math.round((((angle % 360) + 360) % 360) / 6) % 60;
  const at = ((current % 60) + 60) % 60;
  const delta = ((((m - at + 30) % 60) + 60) % 60) - 30;
  return Math.round((current + delta) * 2) / 2;
}

/** Will you catch the train? London's time when the town clock says what it says, and the minutes to spare (below nothing: gone). */
export function catchTrain(p: { train: number; clock: number }, behind: number) {
  const london = p.clock + behind;
  return { london, spare: p.train - london, caught: london <= p.train };
}

/* ── Telegrams ── */

/** A telegram's words, in capitals: letters only, the rest left out. */
export function telegramWords(text: string) {
  return text
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/** What a telegram of `words` words costs, in halfpence: sixpence for twelve, and (the game rule) a halfpenny for each word more. */
export function telegramCost(words: number, base = 12, extra = 1) {
  if (!words) return 0;
  return 12 + Math.max(0, words - base) * extra;
}

/** Halfpence as old money: 13 → "6½d", 24 → "1s", 25 → "1s ½d". */
export function oldMoney(halfpence: number) {
  const pence = Math.floor(halfpence / 2);
  const half = halfpence % 2 ? '½' : '';
  const s = Math.floor(pence / 12);
  const d = pence % 12;
  if (!s) return `${d || ''}${half}d`;
  return d || half ? `${s}s ${d || ''}${half}d` : `${s}s`;
}

/** A message in Morse, letter by letter: each letter with its code, a space as a word break. */
export function toMorse(text: string, code: Record<string, string>) {
  return text
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split('')
    .filter((c) => c === ' ' || code[c])
    .map((c) => ({ char: c, code: c === ' ' ? '' : code[c] }));
}

/**
 * A message's Morse as a timeline, for the lamp and the sounder: a dot
 * one unit on, a dash three, a unit off inside a letter, three between
 * letters and seven between words (the international timing). Each piece
 * carries the index of its letter in toMorse's list.
 */
export function morseTimeline(text: string, code: Record<string, string>, unit: number) {
  const out: { on: boolean; ms: number; letter: number }[] = [];
  toMorse(text, code).forEach((m, i) => {
    if (m.char === ' ') {
      out.push({ on: false, ms: unit * 4, letter: i });
      return;
    }
    m.code.split('').forEach((s, j) => {
      if (j) out.push({ on: false, ms: unit, letter: i });
      out.push({ on: true, ms: s === '.' ? unit : unit * 3, letter: i });
    });
    out.push({ on: false, ms: unit * 3, letter: i });
  });
  return out;
}

/** Dots and dashes drawn as • and —, for reading. */
export const marks = (code: string) => code.replace(/\./g, '•').replace(/-/g, '—');
/** Dots and dashes read aloud. */
export const spoken = (code: string) => code.replace(/\./g, 'dot ').replace(/-/g, 'dash ').trim();
