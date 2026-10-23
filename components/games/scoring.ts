/**
 * Pure helpers shared by the scored games (Perception Lab, Name That
 * Instrument, Hands of History, Real or Replica?). Nothing here touches the
 * DOM or React, so all of it is unit-tested directly.
 */

/** One answered item. `correct` is from the player's point of view. */
export type AnswerRecord<C extends string = string> = {
  itemId: string;
  choice: C;
  correct: boolean;
};

/**
 * An ending band. `min` is the share of items answered correctly (0–1) the
 * player needs to reach it. Tiers can be given in any order.
 */
export type Tier = {
  min: number;
  title: string;
  message: string;
};

export function countCorrect(records: readonly AnswerRecord[]): number {
  return records.reduce((n, r) => n + (r.correct ? 1 : 0), 0);
}

/** Ids of the items the player got wrong, in the order they were played. */
export function missedIds(records: readonly AnswerRecord[]): string[] {
  return records.filter((r) => !r.correct).map((r) => r.itemId);
}

/**
 * The highest tier whose threshold the score reaches. With nothing answered
 * the lowest tier is returned, so an ending never claims mastery of nothing.
 */
export function tierFor(score: number, total: number, tiers: readonly Tier[]): Tier {
  if (tiers.length === 0) throw new Error('tierFor needs at least one tier');
  const sorted = [...tiers].sort((a, b) => b.min - a.min);
  if (total <= 0) return sorted[sorted.length - 1];
  const ratio = score / total;
  // A small epsilon so 4/5 reaches a 0.8 tier despite floating point.
  return sorted.find((t) => ratio + 1e-9 >= t.min) ?? sorted[sorted.length - 1];
}

/** Groups records by a key (an instrument, a category) and tallies each. */
export function breakdownBy<K>(
  records: readonly AnswerRecord[],
  keyOf: (r: AnswerRecord) => K,
): Map<K, { correct: number; total: number }> {
  const out = new Map<K, { correct: number; total: number }>();
  for (const r of records) {
    const k = keyOf(r);
    const cur = out.get(k) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (r.correct) cur.correct += 1;
    out.set(k, cur);
  }
  return out;
}

/** Small, fast, seedable PRNG (mulberry32). Returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle into a new array. Pass a seeded rng for repeatability. */
export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Same seed, same order — used so server and client never disagree. */
export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  return shuffle(arr, mulberry32(seed));
}

/** "1 shortcut" / "3 shortcuts". */
export function plural(n: number, one: string, many: string = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
