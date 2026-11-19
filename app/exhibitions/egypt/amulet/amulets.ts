import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { BM_HIEROGLYPHS, BM_MUMMY_NOTES, BM_SYMBOLS, GLYPHS, met } from '../rooms';

/*
 * The point: you read what each symbol meant to the Egyptians, and choose
 * the ones that fit what your amulet should protect.
 *
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

/**
 * Who the amulet is for: the visitor's choice, used for its printed title and
 * for whose name the room asks for (their own, or the other person's or pet's).
 */
// REVIEW: new text (choices, no facts).
export const FOR_WHOM = [
  { id: 'me', name: 'Me', title: 'My amulet', ask: 'Your name', placeholder: 'Your name' },
  { id: 'family', name: 'Someone in my family', title: 'An amulet for my family', ask: 'Their name', placeholder: 'Their name' },
  { id: 'friend', name: 'A friend', title: 'An amulet for a friend', ask: 'Your friend’s name', placeholder: 'Their name' },
  { id: 'pet', name: 'A pet', title: 'An amulet for a pet', ask: 'Your pet’s name', placeholder: 'Your pet’s name' },
] as const;
export type ForWhomId = (typeof FOR_WHOM)[number]['id'];

/**
 * What the amulet should protect, and the symbols whose meanings fit it:
 * each follows from the symbol's own meaning above (the wedjat eye's
 * renewal and protection, the uraeus's protection, the ankh's life, the
 * djed's permanence, the scarab's and lotus's rebirth, the heart amulet's
 * help at the judgement). The visitor reads each meaning and decides; the
 * room says whether a carved symbol fits, and, if not, what to look for
 * (look). Any symbol can still be carved.
 */
// REVIEW: new text. Each "fits" list is drawn from the SYMBOLS meanings and their sources (British Museum; The Met); "look" names the meaning to look for.
export const NEEDS: { id: string; name: string; fits: SymbolId[]; look: string }[] = [
  { id: 'harm', name: 'Keeping safe from harm', fits: ['uraeus', 'wedjat'], look: 'protection' },
  { id: 'health', name: 'Getting well and strong', fits: ['wedjat', 'ankh'], look: 'healing, renewal or life' },
  { id: 'long', name: 'A long life', fits: ['ankh', 'djed'], look: 'life, or something that lasts' },
  { id: 'fresh', name: 'A fresh start', fits: ['scarab', 'lotus'], look: 'rebirth' },
  { id: 'afterlife', name: 'The afterlife', fits: ['heart', 'djed', 'scarab'], look: 'the judgement, or being revived or reborn' },
];

/** Whether a symbol's meaning fits what the amulet should protect. */
export function fits(needId: string | null, id: SymbolId): boolean {
  return NEEDS.find((n) => n.id === needId)?.fits.includes(id) ?? false;
}

/**
 * What the room says as a symbol is carved: whether its meaning fits what
 * the amulet should protect, and, if not, a hint (never a no).
 */
// REVIEW: new text (feedback).
export function carveFeedback(needId: string | null, id: SymbolId): { fits: boolean; text: string } {
  const need = NEEDS.find((n) => n.id === needId);
  const name = SYMBOLS.find((s) => s.id === id)!.name;
  if (!need) return { fits: true, text: `${name} carved on your amulet.` };
  if (fits(needId, id)) return { fits: true, text: `Good choice! The ${name.toLowerCase()}’s meaning fits ${need.name.toLowerCase()}.` };
  return { fits: false, text: `Does the ${name.toLowerCase()} fit ${need.name.toLowerCase()}? Read what it meant. You can keep it, or take it off. Hint: look for ${need.look}.` };
}

/** How the finished amulet's symbols fit what it should protect, said kindly. */
// REVIEW: new text.
export function fitSummary(needId: string | null, chosen: SymbolId[]): string {
  const need = NEEDS.find((n) => n.id === needId);
  if (!need || chosen.length === 0) return '';
  const n = chosen.filter((id) => fits(needId, id)).length;
  if (n === chosen.length) return `Every symbol on it fits ${need.name.toLowerCase()}. An Egyptian craftsperson would be proud.`;
  if (n === 0) return `None of its symbols’ meanings fit ${need.name.toLowerCase()}, but it is yours. Go back and look for ${need.look}, if you like.`;
  return `${n} of its ${chosen.length} symbols fit ${need.name.toLowerCase()}.`;
}

/** The room's Sources drawer. */
export const AMULET_SOURCES: SourceGroup[] = [
  { title: 'The symbols', items: [...new Map(SYMBOLS.flatMap((s) => s.meaning.sources).map((x) => [x.href, x])).values()] },
  { title: 'Materials and wrappings', items: [...new Map([...AMULET_NOTES.faience.sources, ...AMULET_NOTES.amulets.sources].map((x) => [x.href, x])).values()] },
  {
    title: 'Pictures and lettering',
    items: [
      { label: 'The amulet is drawn for the Mini Museum.' },
      { label: 'The name is spelled with the Egypt Exploration Society’s chart, as in “Your Name in Hieroglyphs”: a modern sound-alike.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];

/** The room's dark opening, read aloud (voice: amulet-intro). */
// REVIEW: new text, read aloud. Amulets were worn to protect their wearers (The Met's wedjat eye record, above).
export const AMULET_INTRO = [
  'In ancient Egypt, people wore amulets: small charms to keep them safe.',
  'Every symbol carved on an amulet had a meaning.',
  'Today, you are the craftsperson.',
  'Choose who it is for, shape it, and carve its symbols.',
];

// REVIEW: new text (the steps).
export const AMULET_STEPS = [
  { id: 'who', title: 'Who is it for?' },
  { id: 'blank', title: 'Choose its shape and material' },
  { id: 'carve', title: 'Carve symbols that fit' },
  { id: 'finish', title: 'Your amulet is ready' },
] as const;
