import { FLAG_MILESTONES, FLAG_STATES } from '../sign/signText';

/*
 * Add a Star, as a guessing game: the states after the first 13 come in the
 * order they joined the Union ("Our Flag", signText.ts), those that joined in
 * the same year together, and before their stars go on the flag the player
 * guesses the decade they joined. A bullseye (the right decade) scores 3, a
 * decade out scores 1. Pure functions, so they can be tested.
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

/** The decades on the ruler: from the first state's to the last's (1790s to 1950s). */
export const DECADES: number[] = (() => {
  const first = decadeOf(FLAG_STATES[0].year);
  const last = decadeOf(FLAG_STATES[FLAG_STATES.length - 1].year);
  return Array.from({ length: (last - first) / 10 + 1 }, (_, i) => first + i * 10);
})();

export type Verdict = 'bullseye' | 'close' | 'early' | 'late';
export const POINTS: Record<Verdict, number> = { bullseye: 3, close: 1, early: 0, late: 0 };
export const MAX_SCORE = ROUNDS.length * POINTS.bullseye;

export function judge(decade: number, year: number): Verdict {
  const off = (decade - decadeOf(year)) / 10;
  if (off === 0) return 'bullseye';
  if (Math.abs(off) === 1) return 'close';
  return off < 0 ? 'early' : 'late';
}

/** "Vermont", "Florida and Texas", "North Dakota, South Dakota, Montana and Washington". */
export function namesOf(round: Round) {
  const n = round.states.map((s) => s.state);
  return n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
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

/** The milestone reached when the flag grows from `from` stars to `to`, if any. */
export function milestoneBetween(from: number, to: number) {
  return FLAG_MILESTONES.filter((m) => m.stars > from && m.stars <= to).pop();
}
