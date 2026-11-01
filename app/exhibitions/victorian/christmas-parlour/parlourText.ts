import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { GHOST_NOTES, GHOST_TEXT } from './ghostText';

/*
 * Dickens' Christmas parlour's words. Every line about Christmas is poster
 * 2's own, word for word (victorian.ts), "*…*" marking italics as there; the
 * room's test checks each one. Each part of the parlour opens on the line
 * that names it. The rest is instruction.
 *
 * The exceptions are three notes fact-checked against the V&A, each set
 * with its source (PARLOUR_NOTES): the royal family's tree in the
 * Illustrated London News, the first Christmas card, and the first edition
 * of A Christmas Carol.
 */

export const PARLOUR_TEXT = {
  title: 'Dickens’ Christmas Parlour',
  intro: 'A parlour on Christmas Eve, waiting to be brought to life. Open each part of a Victorian Christmas: press it in the room, or choose it here.',
  quote: '"Christmas was dead, to begin with. There is no doubt whatever about that."',
  cite: "After Charles Dickens, *A Christmas Carol* (1843): 'Marley was dead: to begin with.'",
  /** The paintings' credit, as the owner gives it. */
  closing: ['Dickens may not have invented Christmas but he certainly reinvented it.', "Dickens' influence shaped modern Christmas celebrations more profoundly than almost anyone else."],
};

const VA_TRADITIONS = { label: 'V&A, “Victorian Christmas traditions”', href: 'https://www.vam.ac.uk/articles/victorian-christmas-traditions' };

export const PARLOUR_NOTES = {
  tree: {
    text: 'In 1848 the Illustrated London News published a drawing of the royal family gathered round a Christmas tree, and the custom spread quickly.',
    sources: [VA_TRADITIONS],
  },
  cards: {
    text: 'Henry Cole, the first director of the V&A, sent the first Christmas card in 1843, illustrated by his friend the artist John Callcott Horsley.',
    sources: [{ label: 'V&A, “The first Christmas card”', href: 'https://www.vam.ac.uk/articles/the-first-christmas-card' }],
  },
  book: {
    text: 'The first edition was published in London by Chapman and Hall in 1843, with illustrations by John Leech.',
    sources: [{ label: 'V&A, A Christmas Carol, 1843', href: 'https://collections.vam.ac.uk/item/O1681222/a-christmas-carol-book-charles-dickens/' }],
  },
} satisfies Record<string, ApprovedFact>;

export type PartId = 'clock' | 'tree' | 'cards' | 'book' | 'window' | 'hearth';

const REVIVAL = "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s.";

/** The parts of the parlour, in the order the poster tells them. */
export const PARTS: { id: PartId; name: string; poster: string; note?: ApprovedFact; opened: string }[] = [
  {
    id: 'clock',
    name: 'The clock',
    poster: 'In the 19th century, Christmas traditions were in decline, impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution, which left workers little time for celebration.',
    opened: 'The clock on the mantelpiece ticks.',
  },
  { id: 'tree', name: 'The Christmas tree', poster: REVIVAL, note: PARLOUR_NOTES.tree, opened: 'The candles on the tree are lit.' },
  { id: 'cards', name: 'The Christmas cards', poster: REVIVAL, note: PARLOUR_NOTES.cards, opened: 'Christmas cards stand along the mantelpiece.' },
  {
    id: 'book',
    name: 'A Christmas Carol',
    poster: "However it was Charles Dickens' *A Christmas Carol* (1843) that truly gave us the Christmas we know today.",
    note: PARLOUR_NOTES.book,
    opened: 'The book lies open on the table.',
  },
  {
    id: 'window',
    name: 'The window',
    poster: "*A Christmas Carol* emphasized kindness, charity, and community through Scrooge's transformation.",
    opened: 'The curtains are drawn back on the village in the snow.',
  },
  {
    id: 'hearth',
    name: 'The fire',
    poster: 'Dickens\' "Carol Philosophy" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later.',
    opened: 'The fire is blazing in the grate.',
  },
];

/** The room's Sources drawer, by tab: each part's note, then the ghost story's. The paintings are the owner's own and carry no credit. */
export const PARLOUR_SOURCES: readonly SourceGroup[] = [
  { title: 'The parlour', items: PARTS.flatMap((p) => (p.note?.sources ?? []).map((s) => ({ ...s, note: p.name }))) },
  {
    title: GHOST_TEXT.tab,
    items: [
      ...GHOST_NOTES.fireside.sources.map((s) => ({ ...s, note: 'Ghost stories round the Christmas fire' })),
      ...GHOST_NOTES.carol.sources.map((s) => ({ ...s, note: 'A Ghost Story of Christmas' })),
      ...GHOST_NOTES.dickens.sources.map((s) => ({ ...s, note: 'Dickens and ghosts' })),
    ],
  },
];
