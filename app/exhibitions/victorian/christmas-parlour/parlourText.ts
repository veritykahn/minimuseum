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
  // REVIEW: new text
  intro: 'A parlour on Christmas Eve, waiting to be brought to life. Press a part of the room, or choose it here, and make a guess about it: get it right and that part comes to life.',
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
    // REVIEW (Verity): poster 2's first sentence, rewritten (victorian.ts, fix 3).
    poster: 'At the start of the 19th century, Christmas was hardly celebrated. Many businesses did not treat it as a holiday, and the long hours of the Industrial Revolution left workers little time for celebration.',
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

/*
 * Before a part comes to life, a guess: one question, three answers, and the
 * poster's line (or its note) that opens with the part says which was right.
 * Every right answer is the poster's line or the part's sourced note told
 * again; the wrong answers are only wrong guesses, and claim nothing. A wrong
 * guess gives the hint, and another try.
 */
// REVIEW: new text (every question, answer and hint)
export const PARLOUR_GUESS: Record<PartId, { ask: string; right: string; wrong: [string, string]; hint: string }> = {
  clock: {
    ask: 'At the start of the 1800s, how did most people spend Christmas Day?',
    right: 'Working: it was hardly a holiday at all',
    wrong: ['Feasting for twelve days', 'Opening presents round the tree'],
    hint: 'Think of the factories of the Industrial Revolution, and their long hours.',
  },
  tree: {
    ask: 'Who made the Christmas tree popular in Britain?',
    right: 'Queen Victoria and Prince Albert',
    wrong: ['Charles Dickens', 'Henry Cole'],
    hint: 'It was a German custom, brought to Britain by a royal couple.',
  },
  cards: {
    ask: 'When were the first Christmas cards sent?',
    right: 'In the 1840s',
    wrong: ['In the 1640s', 'In the 1940s'],
    hint: 'A Christmas Carol came out in 1843. The first card was sent that very same year.',
  },
  book: {
    ask: 'Who wrote A Christmas Carol, in 1843?',
    right: 'Charles Dickens',
    wrong: ['Prince Albert', 'Queen Victoria'],
    hint: 'Look at this room’s name: Dickens’ Christmas Parlour.',
  },
  window: {
    ask: 'Scrooge changes in A Christmas Carol. What does the story say Christmas is for?',
    right: 'Kindness, charity and community',
    wrong: ['Saving every penny', 'Staying at home alone'],
    hint: 'Look out of the window at the village: Christmas is about other people.',
  },
  hearth: {
    ask: 'Dickens’ “Carol Philosophy”: what did it ask people to do at Christmas?',
    right: 'Open their hearts to everyone',
    wrong: ['Work even harder', 'Keep Christmas quiet and small'],
    hint: 'Scrooge’s heart was closed at the start of the story. What happens to it?',
  },
};

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
