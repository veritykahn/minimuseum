import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { POSTER_NAME, POSTER_QR_URL, plainWords, type TimelineEntry } from './timelineEntries';
import { TIMELINE_STOPS } from './timelineStops';

/*
 * Every source and credit the timeline uses, for its Sources drawer
 * (SourcesDrawer): first the poster itself, the owner's design, and where
 * its QR code leads; then each entry's sources, under the entry's date and
 * words, with its stop's photograph credited last. Nothing is cited on the page.
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

export function timelineSources(): SourceGroup[] {
  return [POSTER_GROUP, ...TIMELINE_STOPS.map((e) => ({
      title: entryTitle(e),
      items: e.picture ? [...e.sources, { note: 'Photograph', ...e.picture.credit }] : e.sources,
    })),];
}

export const TIMELINE_SOURCES = timelineSources();
