import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { BM_HIEROGLYPHS, BUDGE_ROSETTA, EES_CARTOUCHE, GLYPHS, type GlyphCode } from '../rooms';

/*
 * The Rosetta Stone decoder. The stone's three scripts, cut from one
 * photograph of it (Hans Hillewaert, CC BY-SA 4.0, Wikimedia Commons;
 * cropped, in public/exhibitions/egypt/rosetta/), and the two ovals ringing
 * the king's name in its hieroglyphs; then the decipherment as Champollion
 * made it: Ptolemy's cartouche matched sign by sign to his name in the
 * Greek, in order, skipping some vowels, and checked against Cleopatra's,
 * which shares three of its signs. The notes are the British Museum's own
 * account, from its exhibition "Hieroglyphs: unlocking ancient Egypt", and
 * Budge's book for the British Museum, The Rosetta Stone (1913).
 *
 * The cartouches are set in hieroglyphs as Champollion compared them:
 * Ptolemy (Ptolmys) p t o l m i s, and Cleopatra k l e o p a t r a, with the
 * two signs that close her name.
 *
 * How the visitor cracks it (Nov 19 rework): not by dragging signs onto
 * letters one after another, but as Champollion checked it. First, the two
 * names side by side: find a sign that is in both cartouches, then reason
 * out its sound from where it stands in both Greek names (inQueen,
 * pairSound): that gives P, O and L. Then the rest of the king's name, sign
 * by sign, from where each sits between the sounds already known, with the
 * rule that every consonant has a sign and some vowels were left out
 * (checkFill says why a wrong letter is wrong).
 */

export type Script = {
  id: 'hieroglyphic' | 'demotic' | 'greek';
  name: string;
  /** Where it sits on the stone. */
  place: 'Top' | 'Middle' | 'Bottom';
  src: string;
  width: number;
  height: number;
  alt: string;
  note: ApprovedFact;
};

const DIR = '/exhibitions/egypt/rosetta';

export const STONE = {
  src: `${DIR}/rosetta-stone.jpg`,
  width: 1196,
  height: 1400,
  alt: 'The Rosetta Stone: a broken slab of dark grey stone, its face covered in three bands of carved writing',
};

export const SCRIPTS: Script[] = [
  {
    id: 'hieroglyphic',
    name: 'Hieroglyphic',
    place: 'Top',
    src: `${DIR}/hieroglyphic.jpg`,
    width: 1400,
    height: 637,
    alt: 'Close-up of the top band of the Rosetta Stone: rows of small carved hieroglyphs, with a few names ringed in ovals',
    note: {
      text: 'Hieroglyphs are the oldest form of ancient Egyptian writing. They were used on temples, tombs and other monuments.',
      sources: [BM_HIEROGLYPHS],
    },
  },
  {
    id: 'demotic',
    name: 'Demotic',
    place: 'Middle',
    src: `${DIR}/demotic.jpg`,
    width: 1400,
    height: 671,
    alt: 'Close-up of the middle band of the Rosetta Stone: dense rows of small, flowing demotic signs',
    note: {
      text: 'Writing with a brush or reed pen led to quicker, less pictorial scripts, first hieratic and later demotic. These handwritten scripts were used for daily letters and literature, and mostly read from right to left.',
      sources: [BM_HIEROGLYPHS],
    },
  },
  {
    id: 'greek',
    name: 'Greek',
    place: 'Bottom',
    src: `${DIR}/greek.jpg`,
    width: 1400,
    height: 581,
    alt: 'Close-up of the bottom band of the Rosetta Stone: long, even rows of carved Greek capital letters',
    note: {
      text: 'After Alexander the Great conquered Egypt in 332 BC, the use of Greek became widespread.',
      sources: [BM_HIEROGLYPHS],
    },
  },
];

/**
 * The two ovals (cartouches) ringing the king's name in the top band's
 * close-up (hieroglyphic.jpg, 1400 × 637), checked against the photograph:
 * centre and half-width and half-height, in the picture's own pixels.
 */
export const STONE_CARTOUCHES = [
  { x: 589, y: 257, rx: 76, ry: 32 },
  { x: 1068, y: 506, rx: 74, ry: 30 },
];

/** Is a point (in hieroglyphic.jpg's pixels) on one of the ovals? */
export function onCartouche(x: number, y: number) {
  return STONE_CARTOUCHES.some((c) => ((x - c.x) / c.rx) ** 2 + ((y - c.y) / c.ry) ** 2 <= 1);
}

export type Sign = { code: GlyphCode; sound: string };

/** Ptolemy's cartouche, sign by sign, with the sound of each. */
export const PTOLEMY: Sign[] = [
  { code: 'Q3', sound: 'P' },
  { code: 'X1', sound: 'T' },
  { code: 'V4', sound: 'O' },
  { code: 'E23', sound: 'L' },
  { code: 'Aa15', sound: 'M' },
  { code: 'M17A', sound: 'I' },
  { code: 'S29', sound: 'S' },
];

/**
 * Cleopatra's cartouche. The last two signs close her name: the bread (t),
 * known from Ptolemy's, and the egg, which is not sounded; her name is read
 * from the first nine (NAME_SIGNS).
 */
export const CLEOPATRA: Sign[] = [
  { code: 'N29', sound: 'K' },
  { code: 'E23', sound: 'L' },
  { code: 'M17', sound: 'E' },
  { code: 'V4', sound: 'O' },
  { code: 'Q3', sound: 'P' },
  { code: 'G1', sound: 'A' },
  { code: 'D46', sound: 'T' },
  { code: 'D21', sound: 'R' },
  { code: 'G1', sound: 'A' },
  { code: 'X1', sound: 'T' },
  { code: 'H8', sound: '' },
];

/** How many of Cleopatra's signs spell her name: K L E O P A T R A. */
export const NAME_SIGNS = 9;

/**
 * Ptolemy's name as the Greek part of the stone spells it, letter by letter,
 * with the sound of each: Champollion's way in. The hieroglyphs follow the
 * Greek in order, skipping some of its vowels.
 */
// REVIEW: new text. The Greek text of the Rosetta Stone names the king ΠΤΟΛΕΜΑΙΟΣ (Ptolemaios); Budge, The Rosetta Stone (1913), compares it with the cartouche sign by sign.
export const PTOLEMY_GREEK: { letter: string; sound: string }[] = [
  { letter: 'Π', sound: 'P' },
  { letter: 'Τ', sound: 'T' },
  { letter: 'Ο', sound: 'O' },
  { letter: 'Λ', sound: 'L' },
  { letter: 'Ε', sound: 'E' },
  { letter: 'Μ', sound: 'M' },
  { letter: 'Α', sound: 'A' },
  { letter: 'Ι', sound: 'I' },
  { letter: 'Ο', sound: 'O' },
  { letter: 'Σ', sound: 'S' },
];

/**
 * Which Greek letter each of Ptolemy's signs says, in order: the code the
 * visitor cracks. The signs follow the Greek letters in order, and the
 * Greek vowels E, A and the second O have no sign of their own (SKIPPED).
 */
export const PTOLEMY_ORDER = [0, 1, 2, 3, 5, 7, 9];
export const SKIPPED = PTOLEMY_GREEK.map((_, i) => i).filter((i) => !PTOLEMY_ORDER.includes(i));

/** Cleopatra's name in the Greek, letter by letter, over her cartouche. */
export const CLEOPATRA_GREEK = 'KLEOPATRA'.split('');

/** The signs of Cleopatra's cartouche that also stand in Ptolemy's: the ones a decoder already knows. */
export function sharedSigns(): number[] {
  const known = new Set(PTOLEMY.map((s) => s.code));
  return CLEOPATRA.map((s, i) => (known.has(s.code) ? i : -1)).filter((i) => i >= 0);
}

/** The shared signs inside her name itself (L, O and P); the bread at the end is part of the ending. */
export const SHARED_IN_NAME = sharedSigns().filter((i) => i < NAME_SIGNS);

export const glyph = (s: Sign) => GLYPHS[s.code];

/** Cleopatra's name in Greek letters, ΚΛΕΟΠΑΤΡΑ, set over her cartouche to compare. */
export const CLEOPATRA_GREEK_LETTERS = 'ΚΛΕΟΠΑΤΡΑ'.split('');

/** Every letter of the two Greek names, once each, with its sound: the choices when cracking a sign. */
export const CODE_LETTERS: { letter: string; sound: string }[] = [
  ...new Map(
    [...PTOLEMY_GREEK, ...CLEOPATRA_GREEK_LETTERS.map((letter, i) => ({ letter, sound: CLEOPATRA_GREEK[i] }))].map((g) => [g.sound, g]),
  ).values(),
];

/**
 * Where a sign of the king's cartouche stands in the queen's: its place in
 * her name (0-based), 'ending' if it is only in the two signs that close
 * her name (the bread), or null if she has no such sign.
 */
export function inQueen(pi: number): number | 'ending' | null {
  const code = PTOLEMY[pi].code;
  const at = CLEOPATRA.findIndex((s, j) => j < NAME_SIGNS && s.code === code);
  if (at >= 0) return at;
  return CLEOPATRA.some((s) => s.code === code) ? 'ending' : null;
}

/** The king's signs that are also in the queen's name (P, O and L): cracked by comparing the two. */
export const BY_PAIR = PTOLEMY.map((_, i) => i).filter((i) => typeof inQueen(i) === 'number');

/** The sound of a shared sign: the Greek letter at its place in the king's name (and, the check, in the queen's). */
export function pairSound(pi: number): string {
  return PTOLEMY_GREEK[PTOLEMY_ORDER[pi]].sound;
}

/** The rest of the king's signs (T, M, I, S), read in order from where each sits between the sounds known. */
export const BY_PLACE = PTOLEMY.map((_, i) => i).filter((i) => !BY_PAIR.includes(i));

const VOWELS = new Set(['A', 'E', 'I', 'O']);

/**
 * A Greek letter tried for one of the king's signs (letter: its place in
 * ΠΤΟΛΕΜΑΙΟΣ), given the signs already known: right; that letter has its
 * sign already; it is outside the known sounds on either side; it is a
 * vowel the scribes left out (when the sign is a consonant); nearly (a
 * left-out vowel tried for a vowel sign); or too far along (a letter
 * further on still needs its own sign first).
 */
export type FillAnswer = 'right' | 'used' | 'outside' | 'vowel' | 'nearly' | 'later';
export function checkFill(pi: number, letter: number, known: readonly number[]): FillAnswer {
  const want = PTOLEMY_ORDER[pi];
  if (letter === want) return 'right';
  if (known.some((k) => PTOLEMY_ORDER[k] === letter)) return 'used';
  const before = known.filter((k) => k < pi).map((k) => PTOLEMY_ORDER[k]);
  const after = known.filter((k) => k > pi).map((k) => PTOLEMY_ORDER[k]);
  const lo = before.length ? Math.max(...before) : -1;
  const hi = after.length ? Math.min(...after) : PTOLEMY_GREEK.length;
  if (letter <= lo || letter >= hi) return 'outside';
  if (SKIPPED.includes(letter)) return VOWELS.has(PTOLEMY[pi].sound) ? 'nearly' : 'vowel';
  return letter > want ? 'later' : 'outside';
}

export const ROSETTA_NOTES = {
  found: {
    text: 'In July 1799, French soldiers rebuilding an old fort at the port city of Rashid found a broken stone carved with three different scripts: hieroglyphic, demotic and Greek. Europeans called Rashid “Rosette”, so the stone took the city’s name.',
    sources: [BM_HIEROGLYPHS],
  },
  decree: {
    text: 'The stone carries one priestly decree, repeated in each script. It was drawn up on 27 March 196 BC by a council of Egyptian priests in Memphis, in the reign of Ptolemy V.',
    sources: [BM_HIEROGLYPHS],
  },
  // REVIEW: new text. Budge, The Rosetta Stone (1913), gives the Greek text in translation, naming the king; the British Museum's exhibition text: the decree was made in the reign of Ptolemy V.
  greek: {
    text: 'Scholars could still read Greek. The Greek text names the king: Ptolemy.',
    sources: [BUDGE_ROSETTA, BM_HIEROGLYPHS],
  },
  cartouches: {
    text: 'Like the scholars before him, Jean-François Champollion focused on the oval cartouches enclosing royal names. Thomas Young had already read Ptolemy’s name in the stone’s cartouche, though not every sign correctly.',
    sources: [BM_HIEROGLYPHS],
  },
  cleopatra: {
    text: 'Near Aswan, the explorer William John Bankes found the cartouches of Ptolemy and Cleopatra on an obelisk from Philae. Champollion noticed that “Cleopatra” had four letters in common with “Ptolemy”. The lion-like sign in Ptolemy’s cartouche was the same as the second sign in Cleopatra’s, so it must be the letter l.',
    sources: [BM_HIEROGLYPHS],
  },
  eureka: {
    text: 'On 14 September 1822, Champollion hurried to his brother, waving his notes: “Look, I’ve got it!” That day is considered the moment of decipherment.',
    sources: [BM_HIEROGLYPHS],
  },
  // REVIEW: new text. Budge, The Rosetta Stone (1913): "on the obelisk which Mr. Bankes had brought from Philæ there is an inscription in two languages"; the Rosetta Stone's decree names Ptolemy V (British Museum).
  notOnStone: {
    text: 'Cleopatra’s name is not on the Rosetta Stone, which names King Ptolemy. It came from an obelisk from Philae, carved in Egyptian and in Greek, which William John Bankes took to England.',
    sources: [BUDGE_ROSETTA, BM_HIEROGLYPHS],
  },
  // REVIEW: new text. Budge, The Rosetta Stone (1913): the sign "No. 7" in Cleopatra's name is replaced in some copies by the t of Ptolemy, so "we may assume that [the two signs] have substantially the same sound, and that that sound is T."
  hand: {
    text: 'In Ptolemy’s name, t is the bread loaf. In Cleopatra’s, it is a hand. Two different signs with the same sound: one of the puzzles Champollion had to solve.',
    sources: [BUDGE_ROSETTA],
  },
  // REVIEW: new text. Budge, The Rosetta Stone (1913): Young "noticed that the two signs" always followed "the name of a goddess, queen, or princess".
  ending: {
    text: 'Her cartouche ends with two more signs, the bread and the egg. Thomas Young noticed that this pair always followed the name of a goddess, a queen or a princess.',
    sources: [BUDGE_ROSETTA],
  },
  young: {
    text: 'Thomas Young’s work helped Champollion crack the hieroglyphic code, but his richest gift to Egyptology was his work on the demotic script.',
    sources: [BM_HIEROGLYPHS],
  },
  // REVIEW: new text, two sentences of the British Museum's exhibition text made short: "Thomas Young had already read Ptolemy's name in the stone's cartouche, though not every sign correctly" and "Thomas Young's work helped Champollion crack the hieroglyphic code".
  youngShort: {
    text: 'Before Champollion, Thomas Young read Ptolemy’s name in the stone’s cartouche, though not every sign correctly. His work helped Champollion crack the code.',
    sources: [BM_HIEROGLYPHS],
  },
} satisfies Record<string, ApprovedFact>;

export const STONE_CREDIT = {
  text: 'Rosetta Stone photograph by Hans Hillewaert, CC BY-SA 4.0, via Wikimedia Commons; the close-ups are cropped from it.',
  href: 'https://commons.wikimedia.org/wiki/File:Rosetta_Stone.JPG',
  licence: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** The room's Sources drawer, by part. */
export const ROSETTA_SOURCES: SourceGroup[] = [
  { title: 'The story (the intro)', items: [BM_HIEROGLYPHS, BUDGE_ROSETTA] },
  {
    title: 'The stone and its three scripts',
    items: [
      { label: 'Rosetta Stone photograph by Hans Hillewaert', href: STONE_CREDIT.href, note: 'Picture (the close-ups are cropped from it)', licence: 'CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons' },
      BM_HIEROGLYPHS,
      BUDGE_ROSETTA,
      { ...EES_CARTOUCHE, note: 'The Rosetta Stone is in the British Museum, numbered EA24' },
    ],
  },
  { title: 'Two names, one code', items: [BM_HIEROGLYPHS, BUDGE_ROSETTA] },
  { title: 'Reading the whole name', items: [BM_HIEROGLYPHS, BUDGE_ROSETTA] },
  { title: 'The code-breakers', items: [...ROSETTA_NOTES.eureka.sources] },
  { title: 'Lettering', items: [{ label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' }] },
];
