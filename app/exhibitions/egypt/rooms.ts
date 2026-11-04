import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * What the Egypt rooms share: the sources their museum notes cite, and the
 * hieroglyphs they set.
 *
 * Every fact a room adds beyond the posters is a museum note (FactNote) with
 * one of these sources beneath it. Each source is a museum's or a learned
 * society's own publication, read in full before a note was written from it:
 *
 *   BM_SYMBOLS      the British Museum's teachers' resource "Ancient Egypt:
 *                   Symbols of the pharaoh" (ankh, scarab, uraeus, lotus,
 *                   cartouche; consonants only, no vowels)
 *   BM_HIEROGLYPHS  the British Museum's exhibition text for "Hieroglyphs:
 *                   unlocking ancient Egypt" (2022): the Rosetta Stone, Young
 *                   and Champollion, Thoth, the scales, canopic jars
 *   BM_MUMMY_NOTES  the British Museum's notes for teachers "What is
 *                   mummification?" (natron, 40 days, linen, amulets, the
 *                   weighing of Hunefer's heart)
 *   BM_MUMMY_VISIT  the British Museum's visit resource "Ancient Egyptian
 *                   mummification" (the 70 days, as Herodotus records them)
 *   EES_CARTOUCHE   the Egypt Exploration Society's "Try writing your name in
 *                   hieroglyphs": the sign for each English letter
 *   PENN_JUDGMENT   Edward F. Wente, "Funerary Beliefs of the Ancient
 *                   Egyptians", Expedition magazine, Penn Museum (the
 *                   Negative Confession, the forty-two judges, the heart scarab)
 *   BM_ANI / BUDGE  the Papyrus of Ani (British Museum EA10470) and the
 *                   British Museum's translation of its chapter 125 by
 *                   E. A. Wallis Budge, then Keeper of Egyptian Antiquities
 *   BM_ANI_JUDGEMENT / BM_HUNEFER  the British Museum's records of the two
 *                   judgement scenes: Ani's (EA10470,3) and Hunefer's
 *                   (EA9901,3), never to be mixed up
 *   BUDGE_ROSETTA   E. A. Wallis Budge, The Rosetta Stone (British Museum,
 *                   1913): how Ptolemy's and Cleopatra's names were compared
 *   MET_*           The Metropolitan Museum of Art's object records
 */

export const BM_SYMBOLS: FactSource = {
  label: 'British Museum, “Ancient Egypt: Symbols of the pharaoh”',
  href: 'https://www.britishmuseum.org/sites/default/files/2019-09/Visit_Egypt_Symbols_KS2b.pdf',
};
export const BM_HIEROGLYPHS: FactSource = {
  label: 'British Museum, “Hieroglyphs: unlocking ancient Egypt” exhibition text',
  href: 'https://www.britishmuseum.org/sites/default/files/2022-10/Hieroglyphs_unlocking_ancient_Egypt_large_print_guide_The_British_Museum.pdf',
};
export const BM_MUMMY_NOTES: FactSource = {
  label: 'British Museum, “What is mummification?” notes for teachers',
  href: 'https://www.britishmuseum.org/sites/default/files/2023-10/What_is_mummification_notes_for_teachers.pdf',
};
export const BM_MUMMY_VISIT: FactSource = {
  label: 'British Museum, “Ancient Egyptian mummification”',
  href: 'https://www.britishmuseum.org/sites/default/files/2025-08/Ancient_Egyptian_mummification_Visit_Resource.pdf',
};
export const EES_CARTOUCHE: FactSource = {
  label: 'Egypt Exploration Society, “Try writing your name in hieroglyphs”',
  href: 'https://www.ees.ac.uk/static/891e5e6b-fb2d-4175-96e9d87121eead15/EES-Digital-ResourceCartouche.pdf',
};
export const PENN_JUDGMENT: FactSource = {
  label: 'Penn Museum, Expedition: “Funerary Beliefs of the Ancient Egyptians”',
  href: 'https://www.penn.museum/sites/expedition/funerary-beliefs-of-the-ancient-egyptians/',
};
export const BM_ANI: FactSource = {
  label: 'British Museum, the Papyrus of Ani (EA10470)',
  href: 'https://www.britishmuseum.org/collection/object/Y_EA10470-32',
};
export const BUDGE: FactSource = {
  label: 'E. A. Wallis Budge, The Book of the Dead (British Museum translation)',
  href: 'https://www.gutenberg.org/ebooks/7145',
};

// REVIEW: new sources (read in Wayback snapshots of the British Museum's collection pages, 2025–26).
export const BM_ANI_JUDGEMENT: FactSource = {
  label: 'British Museum, the Papyrus of Ani, frame 3: Ani’s judgment (EA10470,3)',
  href: 'https://www.britishmuseum.org/collection/object/Y_EA10470-3',
};
export const BM_HUNEFER: FactSource = {
  label: 'British Museum, the Book of the Dead of Hunefer, frame 3 (EA9901,3)',
  href: 'https://www.britishmuseum.org/collection/object/Y_EA9901-3',
};
// REVIEW: new source. Budge's own book for the British Museum (1913), Project Gutenberg's text.
export const BUDGE_ROSETTA: FactSource = {
  label: 'E. A. Wallis Budge, The Rosetta Stone (British Museum, 1913)',
  href: 'https://www.gutenberg.org/ebooks/48649',
};

/** The Met's record for an object, as a source. */
export const met = (id: number, title: string): FactSource => ({
  label: `The Met, “${title}”`,
  href: `https://www.metmuseum.org/art/collection/search/${id}`,
});

/** A hieroglyph from its code point, so the source reads as numbers that can be checked against Unicode's names. */
const g = (cp: number) => String.fromCodePoint(cp);

/*
 * The hieroglyphs the rooms set, by their Gardiner numbers (Unicode's names,
 * EGYPTIAN HIEROGLYPH G001 and so on). They are set in Noto Sans Egyptian
 * Hieroglyphs (SIL Open Font License), cut down to these signs:
 * public/exhibitions/egypt/fonts/.
 */
export const GLYPHS = {
  G1: g(0x1313f), // vulture
  D58: g(0x130c0), // foot
  V31: g(0x133a1), // basket
  D46: g(0x130a7), // hand
  M17: g(0x131cb), // reed
  M17A: g(0x131cc), // two reeds
  I9: g(0x13191), // horned viper
  W11: g(0x133bc), // jar stand
  V28: g(0x1339b), // twisted flax
  I10: g(0x13193), // cobra
  E23: g(0x130ed), // lion
  G17: g(0x13153), // owl
  N35: g(0x13216), // water
  V4: g(0x1336f), // lasso
  Q3: g(0x132aa), // stool
  N29: g(0x1320e), // hill
  D21: g(0x1308b), // mouth
  S29: g(0x132f4), // folded cloth
  X1: g(0x133cf), // bread
  G43: g(0x13171), // quail chick
  Z4: g(0x133ed), // two strokes
  O34: g(0x13283), // door bolt
  V13: g(0x1337f), // tethering rope
  N37: g(0x13219), // pool
  Aa15: g(0x1341d),
  H8: g(0x13187), // egg
  S34: g(0x132f9), // ankh
  D10: g(0x13080), // wedjat eye
  R11: g(0x132bd), // djed pillar
  L1: g(0x131a3), // scarab beetle
  I12: g(0x13197), // cobra rearing (uraeus)
  M9: g(0x131b8), // lotus flower
  F34: g(0x13123), // heart
  H6: g(0x13184), // feather
  C3: g(0x1305f), // god with ibis head (Thoth)
  C6: g(0x13062), // god with jackal head (Anubis)
  C10: g(0x13066), // goddess with feather (Maat)
  D1: g(0x13076), // head
  E15: g(0x130e2), // recumbent jackal
  E32: g(0x130f7), // baboon
  G5: g(0x13143), // falcon
  G26: g(0x1315d), // ibis on standard
  I3: g(0x1318a), // crocodile
} as const;

export type GlyphCode = keyof typeof GLYPHS;

// REVIEW: new source and text. Unicode's Unikemet data (the Unicode Character Database), its kEH_Desc for each sign.
export const UNIKEMET: FactSource = {
  label: 'Unicode Consortium, Unikemet: descriptions of the Egyptian hieroglyphs (Unicode Character Database)',
  href: 'https://www.unicode.org/Public/UCD/latest/ucd/Unikemet.txt',
};

/**
 * What each sign in the name chart is a picture of, in plain words, after
 * Unicode's own description of the sign (UNIKEMET): "A horned desert viper
 * (Cerastes cerastes)" is "a horned viper".
 */
// REVIEW: new text, each from its sign's kEH_Desc in Unikemet.
export const SIGN_NAMES: Partial<Record<GlyphCode, string>> = {
  G1: 'an Egyptian vulture',
  D58: 'a foot and lower leg',
  V31: 'a basket with a handle',
  D46: 'a hand',
  M17: 'a flowering reed',
  M17A: 'two flowering reeds',
  I9: 'a horned viper',
  W11: 'a stand for jars',
  V28: 'a wick of twisted flax',
  I10: 'a cobra, resting',
  E23: 'a lion, lying down',
  G17: 'an owl',
  N35: 'a ripple of water',
  V4: 'a lasso',
  Q3: 'a stool made of reed matting',
  N29: 'a sandy hill slope',
  D21: 'a mouth',
  S29: 'a folded cloth',
  X1: 'a half loaf of bread',
  G43: 'a quail chick',
  Z4: 'two strokes',
  O34: 'a door bolt',
  V13: 'a rope for tethering animals',
  N37: 'a pool',
};
