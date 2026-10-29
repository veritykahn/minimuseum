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

export type Round = { bush: number; tiger: boolean };
export type Call = 'tiger' | 'wind';

export const BUSHES = 5;
export const ROUNDS = 8;
export const TIGERS = 3;

/** The rounds: a bush rustles in each, and a tiger waits in three of them. */
export function makeRounds(rand: () => number = Math.random): Round[] {
  const tigerAt = new Set<number>();
  while (tigerAt.size < TIGERS) tigerAt.add(Math.floor(rand() * ROUNDS));
  let last = -1;
  return Array.from({ length: ROUNDS }, (_, i) => {
    let bush = Math.floor(rand() * BUSHES);
    if (bush === last) bush = (bush + 1 + Math.floor(rand() * (BUSHES - 1))) % BUSHES;
    last = bush;
    return { bush, tiger: tigerAt.has(i) };
  });
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
