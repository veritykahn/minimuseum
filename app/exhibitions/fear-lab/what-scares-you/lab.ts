/*
 * The lab's arithmetic, kept apart from the screens so it can be tested:
 * a pulse from taps, the rounds of the rustling bushes and their tally, and
 * the heartbeat's pace on the monitor.
 */

/**
 * Beats a minute from taps (ms timestamps), using the taps since the last
 * long pause. Needs five taps in a row; null until then. The middle interval
 * is used, so one early or late tap does not throw it.
 */
export function pulseFromTaps(taps: number[]): number | null {
  let start = taps.length - 1;
  while (start > 0 && taps[start] - taps[start - 1] < 2500) start--;
  const run = taps.slice(start).slice(-9);
  if (run.length < 5) return null;
  const gaps = run.slice(1).map((t, i) => t - run[i]).sort((a, b) => a - b);
  const mid = gaps[Math.floor(gaps.length / 2)];
  const bpm = Math.round(60000 / mid);
  return bpm >= 30 && bpm <= 220 ? bpm : null;
}

/** What gives a round away to an attentive eye (or ear) before the reveal. */
export type Clue = 'tail' | 'shadow' | 'tracks' | 'growl' | 'leaves' | 'none';
export const TIGER_CLUES: Clue[] = ['tail', 'shadow', 'tracks', 'growl'];

/**
 * A round: which bush rustles, where in it (`spot`, -1 left to 1 right),
 * whether a tiger waits there, and the clue. Each tiger leaves a different
 * clue; the wind mostly blows a few leaves loose, and sometimes leaves no
 * clue at all.
 */
export type Round = { bush: number; tiger: boolean; spot: number; clue: Clue };
export type Call = 'tiger' | 'wind';

export const BUSHES = 5;
export const ROUNDS = 8;
export const TIGERS = 3;

/** The rounds: a bush rustles in each, and a tiger waits in three of them. */
export function makeRounds(rand: () => number = Math.random): Round[] {
  const tigerAt = new Set<number>();
  while (tigerAt.size < TIGERS) tigerAt.add(Math.floor(rand() * ROUNDS));
  const clues = [...TIGER_CLUES];
  for (let i = clues.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [clues[i], clues[j]] = [clues[j], clues[i]];
  }
  let last = -1;
  let t = 0;
  return Array.from({ length: ROUNDS }, (_, i) => {
    let bush = Math.floor(rand() * BUSHES);
    if (bush === last) bush = (bush + 1 + Math.floor(rand() * (BUSHES - 1))) % BUSHES;
    last = bush;
    const tiger = tigerAt.has(i);
    const spot = Math.round((rand() * 2 - 1) * 100) / 100;
    const clue: Clue = tiger ? clues[t++ % clues.length] : rand() < 0.7 ? 'leaves' : 'none';
    return { bush, tiger, spot, clue };
  });
}

/** Where the bushes stand this game: spread along the ground, each nudged and sized a little differently. */
export type BushPlace = { x: number; y: number; scale: number };
export function makeLayout(rand: () => number = Math.random): BushPlace[] {
  return Array.from({ length: BUSHES }, (_, i) => ({
    x: Math.round(70 + i * 140 + (rand() * 2 - 1) * 26),
    y: Math.round(300 + (rand() * 2 - 1) * 6),
    scale: Math.round((0.86 + rand() * 0.26) * 100) / 100,
  }));
}

export type Tally = { fakeAlarms: number; missed: number; spotted: number; calm: number };

/** What the calls came to: alarms at nothing, tigers missed, tigers spotted, and nothing rightly ignored. */
export function tally(rounds: Round[], calls: Call[]): Tally {
  const t: Tally = { fakeAlarms: 0, missed: 0, spotted: 0, calm: 0 };
  calls.forEach((c, i) => {
    const r = rounds[i];
    if (!r) return;
    if (r.tiger) t[c === 'tiger' ? 'spotted' : 'missed']++;
    else t[c === 'tiger' ? 'fakeAlarms' : 'calm']++;
  });
  return t;
}

/** The monitor's pace for a level of fright, 0 (calm) to 1: drawn, not measured. */
export function paceFor(fright: number): number {
  const f = Math.max(0, Math.min(1, fright));
  return 66 + f * 84;
}
