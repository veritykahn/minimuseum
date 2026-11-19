import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { AMULET_NOTES } from '../amulet/amulets';
import { TOMB_NOTES, WALLS } from '../tomb/scenes';

/*
 * Build Your Own Tomb: the words and the lists. The visitor chooses one of
 * the five painted walls from Tomb Explorer (tomb/scenes.ts, The Met's
 * facsimiles, shared rather than copied), fills the chamber with things to
 * take with them, carves their name on the wall (the cartouche they made in
 * Your Name in Hieroglyphs) and lays their amulet (from Design an Amulet)
 * in its niche.
 *
 * The things are the visitor's own choices, named plainly; the room makes
 * no claim about what any one tomb held, so there is nothing here to
 * source. The facts the room does show (each wall's note, the note on the
 * copies, the note on faience and amulets) come from the other rooms with
 * their sources.
 *
 * Everything marked REVIEW is new text for the owner's review.
 */

// REVIEW: new text, read aloud as the room opens (no facts).
export const MY_TOMB_INTRO = [
  'Welcome to your very own tomb.',
  'Here, the lamps are all lit. Nothing is hidden.',
  'Choose a painting for the wall, and fill the room with things to take with you.',
  'Then make it yours: carve your name, and lay your amulet in its place.',
];

export type StepId = 'wall' | 'goods' | 'yours' | 'done';

// REVIEW: new text (instructions).
export const STEPS: { id: StepId; title: string; task: string }[] = [
  { id: 'wall', title: 'Paint the wall', task: 'Choose a painting for your tomb’s wall.' },
  { id: 'goods', title: 'Fill the chamber', task: 'Drag things onto the floor, or tap one to put it in. Move them about to arrange your room.' },
  { id: 'yours', title: 'Make it yours', task: 'Carve your name on the wall and lay your amulet in the niche.' },
  { id: 'done', title: 'Your tomb', task: 'Your tomb is ready. Print it to take home.' },
];

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

export const MY_TOMB_SOURCES: SourceGroup[] = [
  ...WALLS.map((w) => ({
    title: w.name,
    items: [{ label: w.title, href: w.credit.href, note: 'Picture', licence: w.credit.text }, ...w.note.sources.filter((s) => s.href !== w.credit.href)],
  })),
  { title: 'About these copies', items: [...TOMB_NOTES.copies.sources] },
  { title: 'Your amulet', items: [...AMULET_NOTES.amulets.sources] },
  {
    title: 'Pictures',
    items: [
      { label: 'The chamber and the things in it are drawn for the Mini Museum.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];
