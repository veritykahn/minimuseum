import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The Christmas card maker's words. The one line about the cards' history is
 * poster 2's own, word for word (victorian.ts); the room's test checks it.
 * The rest is instruction, and the choices on the card: its pictures,
 * borders, papers and greetings, which make no claims.
 *
 * The exceptions are two notes from the V&A (CARD_NOTES), fact-checked
 * against the museum's own pages and set with their sources: who sent the
 * first card, and the greeting it carried, which is offered among the
 * greetings and marked as the first card's.
 */

export const CARD_TEXT = {
  title: 'Christmas Card Maker',
  intro: 'Design a Victorian Christmas card: choose its picture, its border and its paper, and write your greeting inside. Then print it and fold it.',
  poster: "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s.",
  printNote: 'It prints on one Letter page. Fold the top half back behind the bottom, printing outside; then fold the left half back behind the right, and the picture is on the front.',
  privacy: 'Nothing you write is saved or sent.',
};

const VA_FIRST_CARD = { label: 'V&A, “The first Christmas card”', href: 'https://www.vam.ac.uk/articles/the-first-christmas-card' };

export const CARD_NOTES = {
  first: {
    text: 'Henry Cole, the first director of the V&A, sent the first Christmas card in 1843. His friend, the artist John Callcott Horsley, illustrated it, and a thousand copies were printed.',
    sources: [VA_FIRST_CARD],
  },
  greeting: {
    text: 'The first card, a hand-coloured lithograph, carried the greeting “A merry Christmas and a Happy New Year”, with spaces for the names of the sender and the recipient.',
    sources: [{ label: 'V&A, Christmas card, MSL/1987/3293', href: 'https://collections.vam.ac.uk/item/O1370293/christmas-card-to-henry-christmas-card-horsley-john-callcott/' }],
  },
} satisfies Record<string, ApprovedFact>;

export type PictureId = 'tree' | 'village' | 'holly' | 'fireside';
export type BorderId = 'gilt' | 'lace' | 'holly' | 'rule';
export type PaperId = 'cream' | 'rose' | 'sage' | 'night';

export const PICTURES: { id: PictureId; name: string; alt: string }[] = [
  { id: 'tree', name: 'Christmas tree', alt: 'a Christmas tree lit with candles and hung with baubles, a star at its top and parcels beneath it' },
  { id: 'village', name: 'Snowy village', alt: 'a village in the snow at dusk, its windows lit and a church spire behind' },
  { id: 'holly', name: 'Holly', alt: 'a sprig of holly with red berries, tied with a ribbon' },
  { id: 'fireside', name: 'Fireside', alt: 'a fire in the grate, with candles and a garland on the mantelpiece' },
];

export const BORDERS: { id: BorderId; name: string }[] = [
  { id: 'gilt', name: 'Gilt' },
  { id: 'lace', name: 'Lace' },
  { id: 'holly', name: 'Holly' },
  { id: 'rule', name: 'Plain' },
];

export const PAPERS: { id: PaperId; name: string; bg: string; ink: string; accent: string }[] = [
  { id: 'cream', name: 'Cream', bg: '#f4eee3', ink: '#2f4a32', accent: '#b8903a' },
  { id: 'rose', name: 'Rose', bg: '#ecd3d2', ink: '#5a2a2e', accent: '#a4565c' },
  { id: 'sage', name: 'Sage', bg: '#dfe4d6', ink: '#2f4a32', accent: '#8a6a2c' },
  { id: 'night', name: 'Midnight', bg: '#1f2a3a', ink: '#f4eee3', accent: '#d6b46a' },
];

/** The first card's greeting comes first; the rest are greetings of the kind, offered as choices. */
export const GREETINGS = [
  { text: 'A merry Christmas and a Happy New Year', first: true },
  { text: 'A Happy Christmas to You', first: false },
  { text: 'With Christmas Greetings', first: false },
  { text: 'The Compliments of the Season', first: false },
];
