import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { BM_HIEROGLYPHS, BM_MUMMY_NOTES, BM_SYMBOLS, GLYPHS, met } from '../rooms';

/*
 * The amulet maker: choose a shape, a material and up to three symbols, and
 * learn what each symbol meant. Each symbol is its hieroglyph (rooms.ts), and
 * its meaning is a museum note with its source: the British Museum's
 * teachers' resource "Symbols of the pharaoh" for the ankh, scarab, uraeus
 * and lotus; the British Museum's Hieroglyphs exhibition text for the heart;
 * The Met's records of a wedjat eye and a djed pillar amulet for those two.
 * The materials are colours only, except faience, which has its note.
 */

export type SymbolId = 'ankh' | 'wedjat' | 'djed' | 'scarab' | 'uraeus' | 'lotus' | 'heart';

export const SYMBOLS: { id: SymbolId; name: string; glyph: string; meaning: ApprovedFact }[] = [
  {
    id: 'ankh',
    name: 'Ankh',
    glyph: GLYPHS.S34,
    meaning: { text: 'The ankh is a symbol of life. It was often carried in the hand.', sources: [BM_SYMBOLS] },
  },
  {
    id: 'wedjat',
    name: 'Wedjat eye',
    glyph: GLYPHS.D10,
    meaning: {
      text: 'The wedjat eye stands for the healed eye of the god Horus. One of the most popular amulets in ancient Egypt, it was thought to pass the power of renewal to its wearer and to protect them.',
      sources: [met(587566, 'Wedjat Eye Amulet')],
    },
  },
  {
    id: 'djed',
    name: 'Djed pillar',
    glyph: GLYPHS.R11,
    meaning: {
      text: 'The djed pillar stood for permanence. From the New Kingdom on, it was closely linked with Osiris, the god who was revived after death.',
      sources: [met(587565, 'Djed Pillar Amulet')],
    },
  },
  {
    id: 'scarab',
    name: 'Scarab beetle',
    glyph: GLYPHS.L1,
    meaning: {
      text: 'Scarab beetles roll a ball of dung along the ground, and the ancient Egyptians linked this with the sun moving across the sky each day. The beetle grubs hatching from the ball were a sign of rebirth.',
      sources: [BM_SYMBOLS],
    },
  },
  {
    id: 'uraeus',
    name: 'Uraeus cobra',
    glyph: GLYPHS.I12,
    meaning: {
      text: 'The uraeus, a rearing cobra with a flared hood, was a symbol of protection. It was worn on the forehead.',
      sources: [BM_SYMBOLS],
    },
  },
  {
    id: 'lotus',
    name: 'Lotus flower',
    glyph: GLYPHS.M9,
    meaning: {
      text: 'Like the sun, which rises in the morning and sets in the evening, the lotus flower blooms in the day and closes each night. It was a symbol of rebirth.',
      sources: [BM_SYMBOLS],
    },
  },
  {
    id: 'heart',
    name: 'Heart',
    glyph: GLYPHS.F34,
    meaning: {
      text: 'Heart amulets were often buried with the dead, sometimes wrapped inside the mummy bandages, for extra protection at the judgement in the afterlife.',
      sources: [BM_HIEROGLYPHS],
    },
  },
];

export const SHAPES = [
  { id: 'scarab', name: 'Scarab' },
  { id: 'oval', name: 'Oval' },
  { id: 'plaque', name: 'Plaque' },
] as const;
export type ShapeId = (typeof SHAPES)[number]['id'];

/** Each material as three colours (its highlight, its face and its shadow) and the colour its symbols are cut in. */
export const MATERIALS = [
  { id: 'faience', name: 'Blue-green faience', light: '#a9e6da', face: '#3fb3a3', shade: '#1d6f73', ink: '#0d2e33' },
  { id: 'gold', name: 'Gold', light: '#fff1c2', face: '#f0c75e', shade: '#a8771f', ink: '#4a300a' },
  { id: 'red', name: 'Red stone', light: '#f0a083', face: '#c9502f', shade: '#7a2414', ink: '#2e0c05' },
  { id: 'blue', name: 'Deep blue stone', light: '#8ea8e6', face: '#3557a8', shade: '#172f6b', ink: '#e9d9a6' },
] as const;
export type MaterialId = (typeof MATERIALS)[number]['id'];

export const MAX_SYMBOLS = 3;

export const AMULET_NOTES = {
  faience: { text: 'Faience is a type of ceramic, commonly used to make amulets.', sources: [BM_MUMMY_NOTES] },
  amulets: {
    text: 'Amulets were placed between the layers of a mummy’s wrappings to protect the body and spirit.',
    sources: [BM_MUMMY_NOTES],
  },
} satisfies Record<string, ApprovedFact>;

/** Toggle a symbol in the design: off if it is on; on, if there is room. */
export function toggleSymbol(chosen: SymbolId[], id: SymbolId): SymbolId[] {
  if (chosen.includes(id)) return chosen.filter((s) => s !== id);
  return chosen.length >= MAX_SYMBOLS ? chosen : [...chosen, id];
}
