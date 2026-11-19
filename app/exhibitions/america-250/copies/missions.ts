import { mulberry32, shuffle } from '@/components/games/scoring';
import { COPIES, type CopyId } from '../sign/signText';

/*
 * A Copy of a Copy, as a detective's case. The four copies come out of the
 * archive box muddled up and unlabelled, as Exhibits A to D (`exhibitOrder`,
 * shuffled from a seed and never in the chain's own order). For each one the
 * detective looks with the lens and decides which of the four case files it
 * matches: the first printing, the printing with every signer, Stone's
 * engraving, or the signed parchment as it is today. Each file says what to
 * look for (CASE_FILES); the answer is in the photograph itself, so it has to
 * be seen, not read off the screen: printed type or handwriting, two names
 * or dozens, crisp or faded. A wrong match says where to look on that sheet
 * (HINTS). Last, one question with a twist: which of the four do most people
 * picture when they think of the Declaration? (Stone's engraving.)
 *
 * Every "what to look for" is what the copy's photograph shows (its alt text,
 * signText.ts) and its fact-checked note says (COPIES); nothing new is
 * claimed. REVIEW: new text, all of the wording below.
 */

export type CaseFile = {
  copy: CopyId;
  /** The file's name, as a detective would label it. */
  title: string;
  /** When it was made. */
  when: string;
  /** What to look for on it. */
  look: string;
};

/** The four case files, in the chain's order (oldest first, the parchment as it is today last). */
export const CASE_FILES: CaseFile[] = [
  {
    copy: 'dunlap',
    title: 'The first printing',
    when: 'July 1776',
    look: 'Printed overnight on July 4, before the signing. Only two names at its foot, set in type.',
  },
  {
    copy: 'goddard',
    title: 'The printing with every signer',
    when: '1777',
    look: 'Congress ordered a copy with the names of everyone who signed. Rows of printed names, grouped by state.',
  },
  {
    copy: 'stone',
    title: 'Stone’s engraving',
    when: '1823',
    look: 'Copied from the signed parchment onto a copper plate. Every signature in handwriting, crisp and dark, as if just written.',
  },
  {
    copy: 'original',
    title: 'The signed parchment today',
    when: 'Signed 1776',
    look: 'The real thing, signed by hand. Years on display have faded it: the signatures are almost gone.',
  },
];

/** Said after a wrong match: where to look on this sheet. */
export const HINTS: Record<CopyId, string> = {
  dunlap: 'Look at the very foot of the sheet. How many names are there? Are they printed, or written by hand?',
  goddard: 'Look at the bottom third of the sheet: rows and rows of names. Are they printed, or written by hand?',
  stone: 'Look at the signatures at the foot. Are they printed, or handwriting? Are they clear, or faded?',
  original: 'Look at the foot of the sheet. Can you still read the signatures?',
};

/** The case file for a copy. */
export const fileFor = (copy: CopyId) => CASE_FILES.find((f) => f.copy === copy)!;

/** The letters the exhibits go by, in the order they come out of the box. */
export const EXHIBIT_LETTERS = ['A', 'B', 'C', 'D'] as const;

/**
 * The order the copies come out of the box: shuffled from a seed, and never
 * the chain's own order, so the next copy is never simply the next in time.
 */
export function exhibitOrder(seed: number): CopyId[] {
  const chain = CASE_FILES.map((f) => f.copy);
  const rng = mulberry32(seed);
  for (let i = 0; i < 8; i++) {
    const order = shuffle(chain, rng);
    if (order.some((c, j) => c !== chain[j])) return order;
  }
  return [...chain].reverse();
}

/**
 * What a screen reader hears for an exhibit: what the photograph shows (the
 * copy's own alt text), without the name it opens with, which is the answer.
 */
export function exhibitAlt(copy: CopyId, letter: string) {
  const alt = COPIES.find((c) => c.id === copy)!.alt;
  const i = alt.indexOf(': ');
  return `Exhibit ${letter}: ${i >= 0 ? alt.slice(i + 2) : alt}`;
}

/** The last question: which copy do most people picture? (The note on Stone's: "the most frequently reproduced version".) */
export const PICTURE = {
  ask: 'Case closed? Not quite. One of these four is the Declaration most people picture when they think of it. Which one?',
  answer: 'stone' as CopyId,
  hint: 'Think of the copy you see on posters and in books: every word and every name still clear and dark.',
  found: 'Stone’s engraving: the most frequently reproduced version of the Declaration.',
};
