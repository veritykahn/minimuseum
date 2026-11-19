import { mulberry32 } from '@/components/games/scoring';
import { FLAG_MILESTONES, FLAG_STATES } from '../sign/signText';

/*
 * Add a Star, as a guessing game. The flag grows from 13 stars to 50 in
 * seven jumps, one for each stretch of the country's growth (ERAS): before
 * each jump one state (or one year's states) is named, and the player
 * guesses the decade it joined the Union ("Our Flag", signText.ts). Then
 * its star goes on, with the stars of every state that joined since the
 * last jump. A bullseye (the right decade) scores 3, a decade out scores 1.
 *
 * Why jumps, not every star (Verity, Nov 18: "boring, just adding a star
 * endlessly"; Nov 19: no "click the next one along"): with every state in
 * turn, the answer was nearly always the decade just guessed or the next,
 * 30 times over. Each era here is at least two decades from the next, so the
 * last answer is never this one's, and the state asked in each era is drawn
 * afresh each game. Pure functions, so they can be tested.
 */

export type Round = { year: number; states: { stars: number; state: string }[] };

/** One round for each year a state (or several) joined, oldest first. */
export const ROUNDS: Round[] = FLAG_STATES.reduce<Round[]>((out, s) => {
  const last = out[out.length - 1];
  if (last && last.year === s.year) last.states.push({ stars: s.stars, state: s.state });
  else out.push({ year: s.year, states: [{ stars: s.stars, state: s.state }] });
  return out;
}, []);

export const decadeOf = (year: number) => Math.floor(year / 10) * 10;

/**
 * The seven stretches of the flag's growth, by the years their states
 * joined. Each game asks about one round (one year's states) from each, in
 * order; no two are within two decades of each other.
 */
export const ERAS: { from: number; to: number }[] = [
  { from: 1790, to: 1799 },
  { from: 1810, to: 1829 },
  { from: 1840, to: 1849 },
  { from: 1860, to: 1869 },
  { from: 1880, to: 1899 },
  { from: 1910, to: 1919 },
  { from: 1950, to: 1959 },
];

/** The rounds a game asks, one from each era, drawn from a seed. */
export function pickRounds(seed: number): Round[] {
  const rng = mulberry32(seed);
  return ERAS.map((e) => {
    const pool = ROUNDS.filter((r) => r.year >= e.from && r.year <= e.to);
    return pool[Math.floor(rng() * pool.length)];
  });
}

/** The states whose stars go on between `from` stars and the round's own (not counting the round's). */
export function joinedBefore(from: number, round: Round) {
  const first = round.states[0].stars;
  return FLAG_STATES.filter((s) => s.stars > from && s.stars < first);
}

/** "Kentucky", "Kentucky and Tennessee", "Kentucky, Tennessee and Ohio". */
export const listOf = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

/** The decades on the ruler: from the first state's to the last's (1790s to 1950s). */
export const DECADES: number[] = (() => {
  const first = decadeOf(FLAG_STATES[0].year);
  const last = decadeOf(FLAG_STATES[FLAG_STATES.length - 1].year);
  return Array.from({ length: (last - first) / 10 + 1 }, (_, i) => first + i * 10);
})();

export type Verdict = 'bullseye' | 'close' | 'early' | 'late';
export const POINTS: Record<Verdict, number> = { bullseye: 3, close: 1, early: 0, late: 0 };
/** The most a game can score: a bullseye in every era. */
export const MAX_SCORE = ERAS.length * POINTS.bullseye;

export function judge(decade: number, year: number): Verdict {
  const off = (decade - decadeOf(year)) / 10;
  if (off === 0) return 'bullseye';
  if (Math.abs(off) === 1) return 'close';
  return off < 0 ? 'early' : 'late';
}

/** "Vermont", "Florida and Texas", "North Dakota, South Dakota, Montana and Washington". */
export function namesOf(round: Round) {
  return listOf(round.states.map((s) => s.state));
}

/** What the flag says once a round's stars are on it. */
export function verdictLine(v: Verdict, round: Round) {
  const who = namesOf(round);
  const joined = `${who} joined the Union in ${round.year}`;
  switch (v) {
    case 'bullseye':
      return `Bullseye! ${joined}.`;
    case 'close':
      return `So close! ${joined}, just one decade away.`;
    case 'early':
      return `Too early. ${joined}, later than that.`;
    default:
      return `Too late. ${joined}, earlier than that.`;
  }
}

/** The milestones reached when the flag grows from `from` stars to `to`, oldest first (a jump can pass more than one). */
export function milestonesBetween(from: number, to: number) {
  return FLAG_MILESTONES.filter((m) => m.stars > from && m.stars <= to);
}
