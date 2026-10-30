import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { BM_HIEROGLYPHS, EES_CARTOUCHE, GLYPHS, type GlyphCode } from '../rooms';

/*
 * The Rosetta Stone decoder. The stone's three scripts side by side, cut
 * from one photograph of it (Hans Hillewaert, CC BY-SA 4.0, Wikimedia
 * Commons; cropped, in public/exhibitions/egypt/rosetta/); then the
 * decipherment as Champollion made it: Ptolemy's cartouche matched sign by
 * sign to the sounds of his name, and Cleopatra's read with the signs it
 * shares. The notes are the British Museum's own account, from its
 * exhibition "Hieroglyphs: unlocking ancient Egypt".
 *
 * The cartouches are set in hieroglyphs as Champollion compared them:
 * Ptolemy (Ptolmys) p t o l m i s, and Cleopatra k l e o p a t r a, with the
 * two signs that close her name.
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

/** The sounds offered in Ptolemy's game, in an order that is not the answer's. */
export const PTOLEMY_SOUNDS = ['S', 'L', 'P', 'I', 'O', 'T', 'M'];

/** The signs of Cleopatra's cartouche that also stand in Ptolemy's: the ones a decoder already knows. */
export function sharedSigns(): number[] {
  const known = new Set(PTOLEMY.map((s) => s.code));
  return CLEOPATRA.map((s, i) => (known.has(s.code) ? i : -1)).filter((i) => i >= 0);
}

export const glyph = (s: Sign) => GLYPHS[s.code];

export const ROSETTA_NOTES = {
  found: {
    text: 'In July 1799, French soldiers rebuilding an old fort at the port city of Rashid found a broken stone carved with three different scripts: hieroglyphic, demotic and Greek. Europeans called Rashid “Rosette”, so the stone took the city’s name.',
    sources: [BM_HIEROGLYPHS],
  },
  decree: {
    text: 'The stone carries one priestly decree, repeated in each script. It was drawn up on 27 March 196 BC by a council of Egyptian priests in Memphis, in the reign of Ptolemy V.',
    sources: [BM_HIEROGLYPHS],
  },
  museum: {
    text: 'Today the Rosetta Stone is in the British Museum, numbered EA24.',
    sources: [EES_CARTOUCHE],
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
  young: {
    text: 'Thomas Young’s work helped Champollion crack the hieroglyphic code, but his richest gift to Egyptology was his work on the demotic script.',
    sources: [BM_HIEROGLYPHS],
  },
} satisfies Record<string, ApprovedFact>;

export const STONE_CREDIT = {
  text: 'Rosetta Stone photograph by Hans Hillewaert, CC BY-SA 4.0, via Wikimedia Commons; the close-ups are cropped from it.',
  href: 'https://commons.wikimedia.org/wiki/File:Rosetta_Stone.JPG',
  licence: 'https://creativecommons.org/licenses/by-sa/4.0/',
};
