import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { POSTER_NAME, POSTER_QR_URL, plainWords, type TimelineEntry } from './timelineEntries';
import { TIMELINE_STOPS } from './timelineStops';
import { MAP_CREDIT, STOP_MORE } from './stopMore';

/*
 * Every source and credit the timeline uses, for its Sources drawer
 * (SourcesDrawer): first the poster itself, the owner's design, and where
 * its QR code leads; then each entry's sources, under the entry's date and
 * words: the poster's, then those of what happened and of each thing to look
 * closer at in its stop (stopMore.ts), each source once, and its stop's
 * photograph credited last; and last of all the map. Nothing is cited on the
 * page.
 */

const entryTitle = (e: TimelineEntry) => `${e.when}: ${plainWords(e.words)}`;

// REVIEW (Verity): the poster's credit, and the note on its QR code.
export const POSTER_GROUP: SourceGroup = {
  title: 'The poster',
  items: [
    { note: 'Poster', label: `*${POSTER_NAME}*, designed by Verity Kahn` },
    { note: 'The poster’s QR code (“Learn more”)', label: 'USHMM Holocaust Encyclopedia, “Timeline of Events”', href: POSTER_QR_URL },
  ],
};

// REVIEW (Verity): the notes beside the stops' sources.
export const MORE_NOTES = { happened: 'What happened', closer: 'Look closer', map: 'The map of Europe at each stop' };

export function timelineSources(): SourceGroup[] {
  return [
    POSTER_GROUP,
    ...TIMELINE_STOPS.map((e) => {
      const more = STOP_MORE[e.id];
      const seen = new Set(e.sources.map((s) => s.href));
      const once = <T extends { href: string }>(s: T) => (seen.has(s.href) ? false : (seen.add(s.href), true));
      const added = more
        ? [
            ...more.happened.sources.filter(once).map((s) => ({ note: MORE_NOTES.happened, ...s })),
            ...more.closer.flatMap((c) => c.sources.filter(once).map((s) => ({ note: `${MORE_NOTES.closer}: ${c.title}`, ...s }))),
          ]
        : [];
      return {
        title: entryTitle(e),
        items: [...e.sources, ...added, ...(e.picture ? [{ note: 'Photograph', ...e.picture.credit }] : [])],
      };
    }),
    { title: MORE_NOTES.map, items: [MAP_CREDIT] },
  ];
}

export const TIMELINE_SOURCES = timelineSources();
