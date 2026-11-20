import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { AMULET_NOTES } from '../amulet/amulets';
import { BM_HIEROGLYPHS } from '../rooms';
import { TOMB_NOTES, WALLS } from '../tomb/scenes';

/*
 * Build Your Own Tomb: the words and the lists. This is where the Egypt
 * journey starts (Nov 19): the visitor's own burial tomb, fully lit, with
 * six empty places, one for each of the other rooms (tombState.ts's
 * TOMB_PLACES). Each place is a door to the room that fills it, and every
 * room ends by putting what it made in its place. The visitor can furnish
 * the tomb with things to take with them, and once every place is filled,
 * seal it, and print it to take home.
 *
 * The things are the visitor's own choices, named plainly; the room makes
 * no claim about what any one tomb held, so there is nothing here to
 * source. The facts the room does show (the painted wall's note, the note
 * on the copies, the note on amulets) come from the other rooms with their
 * sources.
 *
 * The point of the room: the child sees the whole exhibition as one burial,
 * each thing they made in its place in one tomb, and comes back to it after
 * every room to watch it fill.
 *
 * Everything marked REVIEW is new text for the owner's review.
 */

// REVIEW: new text, read aloud as the room opens (no facts).
export const MY_TOMB_INTRO = [
  'This is your burial tomb. It is all yours.',
  'Here, the lamps are lit. Nothing is hidden.',
  'But the tomb is empty. Six places are waiting.',
  'Every room in this exhibition will give you something to put here.',
  'Fill every place, and then seal your tomb.',
];

/** The room's three parts: the tomb and its places, furnishing it, and the sealed tomb. */
export type Mode = 'tomb' | 'furnish' | 'sealed';

// REVIEW: new text (instructions).
export const TASKS = {
  empty: 'Your tomb is built. Tap an empty place in the tomb to go to the room that fills it. Each room ends by putting what you made here.',
  some: (n: number, of: number) => `${n} of ${of} places are filled. Tap an empty place to go and fill it.`,
  full: 'Every place is filled. Now seal your tomb.',
  furnish: 'Drag things onto the floor, or tap one to put it in. Move them about to arrange your tomb.',
  sealed: 'Your tomb is sealed, with everything you made safe inside. Print it to take home.',
};

export type GoodId = 'chair' | 'bed' | 'food' | 'jars' | 'game' | 'sandals' | 'mirror' | 'lamp' | 'horse' | 'boat' | 'chest';

// REVIEW: new text (names of things only; no claims).
export const GOODS: { id: GoodId; name: string }[] = [
  { id: 'chair', name: 'A chair' },
  { id: 'bed', name: 'A bed' },
  { id: 'food', name: 'Bread and fruit' },
  { id: 'jars', name: 'Jars of drink' },
  { id: 'game', name: 'A board game' },
  { id: 'sandals', name: 'Sandals' },
  { id: 'mirror', name: 'A mirror' },
  { id: 'lamp', name: 'A lamp' },
  { id: 'horse', name: 'A toy horse' },
  { id: 'boat', name: 'A model boat' },
  { id: 'chest', name: 'A chest for clothes' },
];

/** The most things the floor holds, so the chamber stays a room and not a heap. */
export const MAX_GOODS = 8;

const HEART_SOURCES = [BM_HIEROGLYPHS];

export const MY_TOMB_SOURCES: SourceGroup[] = [
  ...WALLS.map((w) => ({
    title: w.name,
    items: [{ label: w.title, href: w.credit.href, note: 'Picture', licence: w.credit.text }, ...w.note.sources.filter((s) => s.href !== w.credit.href)],
  })),
  { title: 'About these copies', items: [...TOMB_NOTES.copies.sources] },
  { title: 'Your amulet', items: [...AMULET_NOTES.amulets.sources] },
  { title: 'Your heart amulet', items: [...HEART_SOURCES] },
  {
    title: 'Pictures',
    items: [
      { label: 'The chamber is drawn, and the things in it pictured, for the Mini Museum.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];
