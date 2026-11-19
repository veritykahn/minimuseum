import type { FactSource } from '@/components/exhibition/FactNote';
import { BIO } from '../womensHistory';
import type { KeepsakeId } from './Keepsake';

/*
 * Sew her life together: the challenge that opens Violet's room.
 *
 * Its point: a child works out the order of an ordinary woman's life from
 * clues in her own story (an age, a year, "during the Blitz", "after the
 * war"), the way a historian builds a timeline from evidence, rather than
 * being handed it in order.
 *
 * Six keepsakes have come off the thread. Each carries a clue: words cut,
 * unchanged, from poster 2's biography (BIO), so a test can check that every
 * clue is the poster's own. Only one fact is given: she was born in 1907
 * (her name card). Three clues are ages or events, not years, so the order
 * has to be worked out: at 14 is 1907 + 14; at 21 is 1907 + 21; the Blitz
 * and "after the war" need the dates of the war, which the hints give.
 *
 * The visitor picks a keepsake, then a place on the thread (tap, click or
 * keyboard: every piece is a button). When all six are on, "Check the
 * stitches": the right ones are sewn on for good, the rest come back to the
 * basket, and a hint points at one clue to look at again. Nothing is lost
 * for a wrong try, and the cards keep the order they were dealt in, so the
 * basket never gives the answer away.
 *
 * The hints and the years worked out are the room's reasoning, from the
 * clues and from two dates sourced below (the Blitz, the war's end).
 */

// REVIEW: new source: the Blitz's dates, read on the IWM page itself.
export const IWM_BLITZ: FactSource = { label: 'Imperial War Museums, “The Blitz”', href: 'https://www.iwm.org.uk/history/second-world-war/blitz' };
// REVIEW: new source: the war's end in 1945, seen only in a search excerpt ([S]); check in a browser.
export const IWM_END: FactSource = { label: 'Imperial War Museums, “The End of the Second World War”', href: 'https://www.iwm.org.uk/history/second-world-war/victory' };

/** Her birth year, as her name card gives it (VIOLET_DATES). */
export const BORN = 1907;

export type SewCard = {
  /** The stop of her story it belongs to (violetLife.ts LIFE). */
  id: string;
  label: string;
  keepsake: KeepsakeId;
  /** Words from the poster, in order; shown joined by an ellipsis where words are left out. */
  clue: readonly string[];
  /** One nudge, shown when this card is in the wrong place. */
  hint: string;
  /** When it was, worked out, shown once it is sewn on. */
  worked: string;
};

/** The first stop, already sewn on: where her life begins. */
export const SEW_START: SewCard = {
  id: 'fulham',
  label: 'Fulham',
  keepsake: 'house',
  clue: ['was born at the turn of the 20th century in Fulham, Hammersmith, London'],
  hint: '',
  worked: '1907',
};

/* REVIEW: new text (the labels, hints and years worked out; the clues are the poster's). */
/** The six to sew on, in the order of her life. */
export const SEW_CARDS: readonly SewCard[] = [
  {
    id: 'factory',
    label: 'The factory',
    keepsake: 'machine',
    clue: ['Violet had to leave school at 14 to work and help support the family.'],
    hint: 'She was born in 1907. Add 14 years to find when she left school.',
    worked: '1921, at 14',
  },
  {
    id: 'marriage',
    label: 'Marriage',
    keepsake: 'rings',
    clue: ['at the age of 21, she married Harold Henry Robert Want'],
    hint: 'She was born in 1907. Add 21 years to find the year she married.',
    worked: '1928, at 21',
  },
  {
    id: 'family',
    label: 'Family',
    keepsake: 'coat',
    clue: ['Violet and Harold began their own family in 1929'],
    hint: 'Her own family began after she married Harold. Work out her wedding year, then compare.',
    worked: '1929',
  },
  {
    id: 'blitz',
    label: 'The Blitz',
    keepsake: 'window',
    clue: ['the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England'],
    hint: 'The Blitz was the bombing of Britain’s towns and cities from September 1940 to May 1941.',
    worked: '1940 to 1941',
  },
  {
    id: 'essex',
    label: 'Essex',
    keepsake: 'rose',
    clue: ['After the war, she was offered a home on a new council estate in Essex.'],
    hint: '“After the war”: the war of the Blitz, World War II, ended in 1945.',
    worked: 'After 1945',
  },
  {
    id: 'later',
    label: 'Later years',
    keepsake: 'radio',
    clue: ['Widowed in 1956, Violet remained strong and resilient.'],
    hint: '1956 is the latest year in any of the clues.',
    worked: '1956',
  },
];

/** The sources the hints draw on, by the card whose hint uses them. */
export const SEW_SOURCES: readonly { card: string; source: FactSource; note: string }[] = [
  { card: 'blitz', source: IWM_BLITZ, note: 'The Blitz, September 1940 to May 1941' },
  { card: 'essex', source: IWM_END, note: 'The Second World War ended in 1945' },
];

/** Every clue's words, checked against the poster's biography (the tests do this). */
export function clueIsPosters(card: SewCard, bio: Record<string, string> = BIO): boolean {
  const all = Object.values(bio).join(' ');
  return card.clue.every((part) => all.includes(part));
}

/** The six places on the thread after Fulham: each holds a card's id, or nothing yet. */
export type Slots = readonly (string | null)[];

export const emptySlots = (): Slots => SEW_CARDS.map(() => null);

/** Where a card sits on the thread, or -1 if it is still in the basket. */
export const slotOf = (slots: Slots, id: string) => slots.indexOf(id);

/**
 * Puts a card in a place. A card already there swaps to the place the moving
 * card came from (or back to the basket, if it came from the basket). A
 * place that is sewn on for good (`locked`) takes nothing.
 */
export function placeCard(slots: Slots, id: string, at: number, locked: ReadonlySet<number> = new Set()): Slots {
  if (at < 0 || at >= slots.length || locked.has(at)) return slots;
  const from = slots.indexOf(id);
  if (from === at || (from >= 0 && locked.has(from))) return slots;
  const next = slots.slice();
  const there = next[at];
  next[at] = id;
  if (from >= 0) next[from] = there;
  return next;
}

/** Takes a card off the thread, back to the basket (unless it is sewn on). */
export function liftCard(slots: Slots, at: number, locked: ReadonlySet<number> = new Set()): Slots {
  if (locked.has(at) || !slots[at]) return slots;
  const next = slots.slice();
  next[at] = null;
  return next;
}

export type Check = {
  /** The places holding their own card. */
  right: number[];
  /** The card to give a hint for: the first one, along the thread, in the wrong place. */
  hintFor: SewCard | null;
  done: boolean;
};

/** Checks the stitches: which places hold their own card, and which card to hint at. */
export function checkStitches(slots: Slots): Check {
  const right: number[] = [];
  let hintFor: SewCard | null = null;
  slots.forEach((id, i) => {
    if (id === SEW_CARDS[i].id) right.push(i);
    else if (id && !hintFor) hintFor = SEW_CARDS.find((c) => c.id === id) ?? null;
  });
  return { right, hintFor, done: right.length === SEW_CARDS.length };
}

/** After a check: only the right cards stay on the thread. */
export function keepRight(slots: Slots, right: readonly number[]): Slots {
  return slots.map((id, i) => (right.includes(i) ? id : null));
}

/* REVIEW: new text */
export function checkLine(c: Check): string {
  const n = c.right.length;
  if (c.done) return 'Every stitch holds: her life is in order.';
  if (n === 0) return 'None of those are in the right place yet. They are back in the basket: read the clues again.';
  return `${n} of ${SEW_CARDS.length} are sewn on. The others are back in the basket.`;
}
