import { TELEGRAM } from './inventionsText';

/*
 * The telegraph office's money, as pure functions (tested): what is in the
 * visitor's purse, what it pays for, the coins it is made of, and what a
 * cut-down letter no longer tells its reader. Twelve
 * words for sixpence is the Post Office's price; a halfpenny a word more,
 * and the purse itself, are the workshop's game rules (TELEGRAM).
 */

/** The purse for a random number from 0 to 1 (chosen when the visitor comes to the counter). */
export function purseFor(r: number) {
  const p = TELEGRAM.purses;
  return p[Math.min(p.length - 1, Math.floor(r * p.length))];
}

/** How many words a purse of `halfpence` pays for. */
export function wordsFor(halfpence: number) {
  if (halfpence < 12) return 0;
  return TELEGRAM.words + Math.floor((halfpence - 12) / TELEGRAM.extraHalfpence);
}

/** The coins in a purse: a sixpence, and pennies for the rest (a halfpenny for an odd half). */
export function coinsFor(halfpence: number) {
  const coins: ('6d' | '1d' | '½d')[] = [];
  let left = halfpence;
  if (left >= 12) {
    coins.push('6d');
    left -= 12;
  }
  while (left >= 2) {
    coins.push('1d');
    left -= 2;
  }
  if (left) coins.push('½d');
  return coins;
}

/**
 * What a telegram cut down from one of the letters no longer says: each of
 * the letter's must-keep ideas whose words have all been crossed out.
 */
export function missingIdeas(kept: string[], keep: { words: string[]; ask: string }[]) {
  const have = new Set(kept);
  return keep.filter((k) => !k.words.some((w) => have.has(w)));
}
