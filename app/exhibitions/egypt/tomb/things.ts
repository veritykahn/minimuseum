import type { ActivityId } from '../tombState';

/*
 * The burial chamber: the way into the Egypt rooms. The visitor carries the
 * torch through the dark and finds, one by one, the things that open the
 * other rooms: a painted doorway (the painted walls), the embalmers' table
 * (Mummification), the scales through the doorway of the Hall of Judgement
 * (the Weighing of the Heart), a cartouche carved on the wall (Your Name in
 * Hieroglyphs), a broken stone carved with writing (the Rosetta Stone) and a
 * niche for an amulet (Design an Amulet).
 *
 * Each thing's place is in the chamber picture's own units (CHAMBER, the
 * SVG's viewBox), as the walls' details are in their paintings' pixels.
 * The lines here say only what the thing is and which room it opens: no
 * facts, so nothing to source. They are new words, for the owner's review.
 */

export const CHAMBER = { width: 1600, height: 900 };

export type ChamberThing = {
  id: 'corridor' | 'table' | 'scales' | 'cartouche' | 'stone' | 'niche';
  /** The room it opens, as the tomb remembers it. */
  room: ActivityId;
  /** What it is, as the visitor finds it: "the embalmers’ table". */
  label: string;
  /** The room's own name. */
  title: string;
  /** The room's address; the painted walls are in this room, by tab. */
  href: string | null;
  /** A line on finding it, and a line once its room is finished. */
  found: string;
  done: string;
  x: number;
  y: number;
  r: number;
};

export const THINGS: ChamberThing[] = [
  {
    id: 'corridor',
    room: 'walls',
    label: 'a painted doorway',
    title: 'The painted walls',
    href: null,
    found: 'A doorway into a corridor of painted walls. Search each painting by torchlight.',
    done: 'You have searched every painted wall.',
    x: 230,
    y: 520,
    r: 130,
  },
  {
    id: 'table',
    room: 'mummification',
    label: 'the embalmers’ table',
    title: 'Mummification, Step by Step',
    href: '/exhibitions/egypt/mummification',
    found: 'A table with lion’s legs, and four empty jars beside it. This is where the embalmers worked.',
    done: 'The mummy you prepared lies wrapped on the table, its four jars filled.',
    x: 540,
    y: 690,
    r: 140,
  },
  {
    id: 'scales',
    room: 'weighing',
    label: 'the scales in the Hall of Judgement',
    title: 'The Weighing of the Heart',
    href: '/exhibitions/egypt/weighing-of-the-heart',
    found: 'Through this doorway is the Hall of Judgement, and the great scales.',
    done: 'The scales are level: the heart balanced the feather.',
    x: 800,
    y: 470,
    r: 130,
  },
  {
    id: 'cartouche',
    room: 'name',
    label: 'a cartouche carved on the wall',
    title: 'Your Name in Hieroglyphs',
    href: '/exhibitions/egypt/hieroglyph-name',
    found: 'An empty cartouche, carved into the wall, waiting for a name.',
    done: 'Your name is carved in the cartouche.',
    x: 1110,
    y: 300,
    r: 120,
  },
  {
    id: 'stone',
    room: 'rosetta',
    label: 'a broken stone carved with writing',
    title: 'The Rosetta Stone Decoder',
    href: '/exhibitions/egypt/rosetta-stone',
    found: 'A broken stone, carved with three kinds of writing.',
    done: 'You cracked the names on the stone.',
    x: 1290,
    y: 670,
    r: 130,
  },
  {
    id: 'niche',
    room: 'amulet',
    label: 'a niche in the wall',
    title: 'Design an Amulet',
    href: '/exhibitions/egypt/amulet',
    found: 'A small niche in the wall, the right size for an amulet.',
    done: 'Your amulet rests in the niche.',
    x: 1420,
    y: 410,
    r: 110,
  },
];
