import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The optical toys room's words. The toys' pictures are drawn from the
 * posters' own subjects, and each is captioned with a line from the posters
 * (victorian.ts), word for word; the room's test checks each one against
 * them. The rest is instruction.
 *
 * The toys' history is the exception: three notes (TOY_NOTES), owner-approved
 * and fact-checked, each set with its source (the Science Museum Group, the
 * V&A, and US Patent 64,117), apart from the posters' captions.
 */

export const TOYS_TEXT = {
  title: 'Optical Toys',
  thaumaHeading: 'Thaumatrope',
  zoeHeading: 'Zoetrope',
  thaumaIntro: 'A picture on each side of a disc. Twirl it on its strings, and the two sides become one picture.',
  zoeIntro: 'A strip of pictures inside a drum. Spin it, look through the slits, and the pictures move.',
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

export type DiscId = 'tree' | 'railway' | 'hearth';

export const DISCS: { id: DiscId; name: string; front: string; back: string; together: string; caption: string }[] = [
  {
    id: 'tree',
    name: 'Christmas tree',
    front: 'A bare fir tree in a pot',
    back: 'A star, candles and baubles, hung in the air',
    together: 'The fir tree, lit with candles and hung with baubles, a star at its top',
    caption: "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s.",
  },
  {
    id: 'railway',
    name: 'Railway',
    front: 'An empty line of rails under telegraph wires',
    back: 'A steam locomotive, puffing steam',
    together: 'The locomotive steaming along the rails under the telegraph wires',
    caption: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art.',
  },
  {
    id: 'hearth',
    name: 'Fireside',
    front: 'A cold, empty fireplace',
    back: 'Flames, a garland and candles, floating',
    together: 'A fire burning in the grate, with a garland and candles on the mantel',
    caption: 'Dickens\' "Carol Philosophy" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later.',
  },
];

export type StripId = 'locomotive' | 'snow' | 'waltz';

export const STRIPS: { id: StripId; name: string; alt: string; caption: string }[] = [
  {
    id: 'locomotive',
    name: 'Locomotive',
    alt: 'A steam locomotive running along the rails, its wheels turning and steam rolling back from its chimney',
    caption: 'This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.',
  },
  {
    id: 'snow',
    name: 'Snowfall',
    alt: 'Snow falling on a village at dusk, smoke rising from the chimneys and lamplight in the windows',
    caption: 'Dickens may not have invented Christmas but he certainly reinvented it.',
  },
  {
    id: 'waltz',
    name: 'The waltz',
    alt: 'A woman in a wide crinoline gown turning as she dances, her skirt swirling and her fan raised',
    caption: 'Victorian Britain was a time of innovation, fashion, culture, and the birth of one of the most iconic museums in the world today!',
  },
];
