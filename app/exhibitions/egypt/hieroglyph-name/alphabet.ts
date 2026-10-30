import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { BM_SYMBOLS, EES_CARTOUCHE, GLYPHS, type GlyphCode } from '../rooms';

/*
 * Your name in hieroglyphs: the sign for each English letter, as the Egypt
 * Exploration Society's chart "Try writing your name in hieroglyphs" sets
 * them, with its two signs for "ch" and "sh". Where the chart gives a
 * choice (Y: two reeds or two strokes) the first is used. X is the basket
 * and the folded cloth, k + s, as the chart draws it.
 *
 * This is a modern sound-alike for fun, and the room says so: the Egyptians
 * wrote consonants only, and their signs were not an alphabet.
 */

export const SIGNS: Record<string, GlyphCode[]> = {
  A: ['G1'],
  B: ['D58'],
  C: ['V31'],
  D: ['D46'],
  E: ['M17A'],
  F: ['I9'],
  G: ['W11'],
  H: ['V28'],
  I: ['M17'],
  J: ['I10'],
  K: ['V31'],
  L: ['E23'],
  M: ['G17'],
  N: ['N35'],
  O: ['V4'],
  P: ['Q3'],
  Q: ['N29'],
  R: ['D21'],
  S: ['S29'],
  T: ['X1'],
  U: ['G43'],
  V: ['I9'],
  W: ['G43'],
  X: ['V31', 'S29'],
  Y: ['M17A'],
  Z: ['O34'],
  CH: ['V13'],
  SH: ['N37'],
};

/** The chart in order, for the key: A to Z, then CH and SH. */
export const CHART = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'CH', 'SH'];

export const MAX_LETTERS = 14;

export type Spelled = { letters: string; glyphs: string };

/**
 * A name spelled sign by sign: "ch" and "sh" each take their own sign,
 * accents are dropped (é is e), and anything that is not a letter is left
 * out. At most MAX_LETTERS letters, so the cartouche stays readable.
 */
export function spell(name: string): Spelled[] {
  const plain = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, MAX_LETTERS);
  const out: Spelled[] = [];
  for (let i = 0; i < plain.length; i++) {
    const two = plain.slice(i, i + 2);
    const letters = SIGNS[two] && two.length === 2 ? two : plain[i];
    out.push({ letters, glyphs: SIGNS[letters].map((c) => GLYPHS[c]).join('') });
    if (letters.length === 2) i++;
  }
  return out;
}

/** The name as it is read aloud with its cartouche: "M, A, Y, A". */
export function readOut(spelled: Spelled[]) {
  return spelled.map((s) => s.letters).join(', ');
}

export const NAME_NOTES = {
  chart: {
    text: 'These signs follow the Egypt Exploration Society’s chart for writing your name: a sign for each letter of the English alphabet, and one each for “ch” and “sh”. If a letter is missing, spell your name by its sounds.',
    sources: [EES_CARTOUCHE],
  },
  modern: {
    text: 'So this is a modern sound-alike, not how the ancient Egyptians wrote names. Their hieroglyphs wrote consonants only; no vowels were written out. And it was not an alphabet: one sign could stand for two or more sounds, like the gaming-board sign for mn.',
    sources: [BM_SYMBOLS],
  },
  cartouche: {
    text: 'A cartouche is an oval placed around the names of royal people in hieroglyphic inscriptions.',
    sources: [BM_SYMBOLS],
  },
  line: {
    text: 'The straight line at one end marks the end of the name and helps show the reading direction. Hieroglyphs could be written left to right or right to left, but always top to bottom.',
    sources: [EES_CARTOUCHE],
  },
} satisfies Record<string, ApprovedFact>;
