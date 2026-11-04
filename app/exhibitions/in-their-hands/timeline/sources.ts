import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { timelineStops } from './timeline-data';

/*
 * The Gospel Timeline's Sources drawer: for each stop, the passage it quotes
 * (the reference already shown on its card) and the painting behind it.
 *
 * The painting credits are the owner's own wording where the lessons already
 * give it (lib/lessons/in-their-hands/*.json: "James Tissot (1836–1902),
 * Brooklyn Museum"; "Vasily Surikov (1848–1916)"). The rest are new and
 * marked REVIEW: the Tissot ones need their holding museum confirmed, and
 * the Zurbarán needs its title and collection.
 */

const TISSOT_BROOKLYN = 'James Tissot (1836–1902), Brooklyn Museum';
// REVIEW: Tissot paintings whose holding museum the site does not yet name (the lessons credit the others to the Brooklyn Museum).
const TISSOT = 'James Tissot (1836–1902)';

/** Each painting's credit, by its file name. */
export const PAINTING_CREDITS: Record<string, string> = {
  'augustus-tissot.jpg': TISSOT,
  'great-tissot.jpg': TISSOT,
  'baptist-tissot.jpg': TISSOT,
  'widow-tissot.jpg': TISSOT_BROOKLYN,
  'tribute-tissot.jpg': TISSOT_BROOKLYN,
  'judas-tissot.jpg': TISSOT_BROOKLYN,
  'pilate-tissot.jpg': TISSOT_BROOKLYN,
  'herod-tissot.jpg': TISSOT,
  // REVIEW: new credit; artist's dates as the Museo del Prado gives them; the painting's title and collection to add.
  'agrippa-zurbaran.jpg': 'Francisco de Zurbarán (1598–1664)',
  'paul-tissot.jpg': TISSOT,
  'festus-surikov.jpg': 'Vasily Surikov (1848–1916)',
};

export const paintingCredit = (src: string) => PAINTING_CREDITS[src.split('/').pop() ?? ''];

export const TIMELINE_SOURCES: SourceGroup[] = timelineStops.map((s) => ({
  title: `Stop ${s.id}: ${s.ruler}`,
  items: [
    { note: 'The passage', label: s.reference },
    ...(paintingCredit(s.painting) ? [{ note: 'The painting', label: paintingCredit(s.painting) }] : []),
  ],
}));
