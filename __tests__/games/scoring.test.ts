import {
  breakdownBy,
  countCorrect,
  missedIds,
  mulberry32,
  plural,
  seededShuffle,
  shuffle,
  tierFor,
  type AnswerRecord,
  type Tier,
} from '@/components/games/scoring';
import { gameReducer, initialGameState } from '@/components/games/useScoredGame';

const records: AnswerRecord[] = [
  { itemId: 'a', choice: 'x', correct: true },
  { itemId: 'b', choice: 'y', correct: false },
  { itemId: 'c', choice: 'x', correct: true },
  { itemId: 'd', choice: 'z', correct: false },
];

const tiers: Tier[] = [
  { min: 0, title: 'low', message: '' },
  { min: 1, title: 'perfect', message: '' },
  { min: 0.8, title: 'high', message: '' },
  { min: 0.4, title: 'mid', message: '' },
];

describe('scoring helpers', () => {
  it('counts correct answers and lists the misses in play order', () => {
    expect(countCorrect(records)).toBe(2);
    expect(missedIds(records)).toEqual(['b', 'd']);
  });

  it('picks the highest tier the score reaches, whatever order tiers are given in', () => {
    expect(tierFor(5, 5, tiers).title).toBe('perfect');
    expect(tierFor(4, 5, tiers).title).toBe('high'); // exactly 0.8 despite floating point
    expect(tierFor(3, 5, tiers).title).toBe('mid');
    expect(tierFor(2, 5, tiers).title).toBe('mid');
    expect(tierFor(1, 5, tiers).title).toBe('low');
    expect(tierFor(0, 5, tiers).title).toBe('low');
  });

  it('never awards a top tier for nothing answered', () => {
    expect(tierFor(0, 0, tiers).title).toBe('low');
  });

  it('tallies by key', () => {
    const by = breakdownBy(records, (r) => r.choice);
    expect(by.get('x')).toEqual({ correct: 2, total: 2 });
    expect(by.get('y')).toEqual({ correct: 0, total: 1 });
  });

  it('shuffles into a permutation without touching the input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, mulberry32(7));
    expect(out).not.toBe(input);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('gives the same order for the same seed and different orders across seeds', () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    expect(seededShuffle(items, 42)).toEqual(seededShuffle(items, 42));
    const orders = new Set(Array.from({ length: 20 }, (_, s) => seededShuffle(items, s).join(',')));
    expect(orders.size).toBeGreaterThan(15);
  });

  it('pluralizes counts', () => {
    expect(plural(1, 'shortcut')).toBe('1 shortcut');
    expect(plural(14, 'shortcut')).toBe('14 shortcuts');
    expect(plural(2, 'one')).toBe('2 ones');
  });
});

describe('gameReducer', () => {
  it('takes one answer per item, then moves on, then ends', () => {
    let s = gameReducer(initialGameState, { type: 'answer', itemId: 'a', choice: 'x', correct: true });
    expect(s.phase).toBe('feedback');
    // A second click while the feedback is up changes nothing.
    s = gameReducer(s, { type: 'answer', itemId: 'a', choice: 'y', correct: false });
    expect(s.records).toHaveLength(1);
    s = gameReducer(s, { type: 'next', total: 2 });
    expect(s).toMatchObject({ index: 1, phase: 'question' });
    // "Next" does nothing until the item is answered.
    expect(gameReducer(s, { type: 'next', total: 2 })).toBe(s);
    s = gameReducer(s, { type: 'answer', itemId: 'b', choice: 'y', correct: false });
    s = gameReducer(s, { type: 'next', total: 2 });
    expect(s.phase).toBe('ended');
    expect(countCorrect(s.records)).toBe(1);
    expect(gameReducer(s, { type: 'reset' })).toEqual(initialGameState);
  });
});
