import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';

/*
 * The optical toys room's words. Every line that explains the toys is quoted
 * from Seeing is Deceiving's first poster, "The First Motion Pictures
 * (1820s–1830s)" (page.tsx, poster1Content), word for word; the room's test
 * checks each one against the poster. The rest is instruction: what the
 * buttons do, and what is on screen at each speed.
 *
 * The toys' history is the exception: three notes (TOY_NOTES), owner-approved
 * and fact-checked, each with its source (the Science Museum Group, the
 * V&A, and US Patent 64,117), apart from the poster's lines. The sources
 * are listed in the room's Sources drawer (TOY_SOURCES), not on the cards. They came with
 * the toys from Victorian Britain, where the room first stood.
 */

/** The poster's lines, as set on the poster. */
export const POSTER = {
  discovered: "Inventors discovered something strange: show the eye rapid sequences of still images and the brain sees continuous motion that doesn't exist.",
  thaumatrope: 'The thaumatrope (1825) was a disk with different images on each side—spin it and a bird appears inside a cage.',
  zoetrope: 'The zoetrope (1834) showed sequential drawings through slits—spin it and horses gallop, people dance.',
  nothingMoves: 'Nothing actually moves. Your brain creates the motion.',
  movies: 'Movies are still pictures shown fast.',
  screens: 'Every screen you look at exploits this biological quirk discovered 200 years ago.',
};

export const TOYS_TEXT = {
  title: 'Optical Toys',
  section: 'The First Motion Pictures (1820s–1830s)',
  thaumaHeading: 'Thaumatrope',
  zoeHeading: 'Zoetrope',
  makeHeading: 'Make your own',
  thaumaIntro: 'A bird on one side of the disc, an empty cage on the other. Twirl it: it starts very slowly, so you can watch each side go by, then speeds up little by little. Or slide the speed yourself.',
  zoeIntro: 'A strip of drawings inside the drum, and slits in its wall to look through. Put your eye to the slits and spin it: it starts very slowly, so you see a slit crawl past, then speeds up little by little. Or slide the speed yourself.',
};

const VA_ZOETROPE = { label: 'V&A', href: 'https://collections.vam.ac.uk/item/O96347/optical-toy-zoetrope-zoetrope/' };

/* Owner-approved, fact-checked notes on the toys' history, with their sources. */
export const TOY_NOTES = {
  thaumatrope: {
    text: 'The thaumatrope was invented by John Ayrton Paris in 1825.',
    sources: [{ label: 'Science Museum Group', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co8085499' }],
  },
  zoetrope: {
    text: 'William Horner described the first one in 1834, calling it the daedaleum. In 1867 William E. Lincoln patented it in the United States, and Milton Bradley sold it as the zoetrope.',
    sources: [VA_ZOETROPE, { label: 'US Patent 64,117', href: 'https://patents.google.com/patent/US64117A/en' }],
  },
  /** Set once in the room, for both toys. */
  both: {
    text: 'Optical toys like these were popular family entertainment in Victorian homes.',
    sources: [VA_ZOETROPE],
  },
} satisfies Record<string, ApprovedFact>;

/** The room's Sources drawer: every source, by toy. */
export const TOY_SOURCES: SourceGroup[] = [
  { title: 'Thaumatrope', items: TOY_NOTES.thaumatrope.sources.map((s) => ({ ...s, note: 'Who invented it' })) },
  { title: 'Zoetrope', items: TOY_NOTES.zoetrope.sources.map((s) => ({ ...s, note: s.label === 'V&A' ? 'Horner’s daedaleum' : 'Lincoln’s patent' })) },
  { title: 'Both toys', items: TOY_NOTES.both.sources.map((s) => ({ ...s, note: 'Victorian family entertainment' })) },
];

/** The thaumatrope's two sides, and what the eye makes of them. */
export const DISC = {
  name: 'Bird and cage',
  front: 'A small bird, alone on a perch',
  back: 'An empty birdcage',
};

export type StripId = 'horses' | 'dancers';

/** The zoetrope's strips: the horses and the dancers the poster names. */
export const STRIPS: { id: StripId; name: string; alt: string }[] = [
  {
    id: 'horses',
    name: 'Horses gallop',
    alt: 'A horse at a gallop, its legs reaching and gathering, its mane and tail flying',
  },
  {
    id: 'dancers',
    name: 'People dance',
    alt: 'Two dancers hand in hand, hopping and kicking up their heels, her skirt swinging',
  },
];
