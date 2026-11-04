import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { OWNER_BARBIE_PHOTOS, TIMELINE_STOPS, photoFor, type OwnerPhoto, type TimelineStop } from './timelineStops';

/*
 * Every source and picture credit the timeline uses, for its Sources drawer
 * (SourcesDrawer), grouped by stop: the added stops' notes and, once the
 * owner gives them, the photographs' credits (as their sources ask for them).
 * The stops cite nothing inline.
 */
const stopTitle = (s: TimelineStop) => (s.year === null ? s.name : `${s.yearLabel ?? s.year}: ${s.name}`);

export function timelineSources(photos: OwnerPhoto[] = OWNER_BARBIE_PHOTOS): SourceGroup[] {
  return TIMELINE_STOPS.map((s) => {
    const photo = photoFor(s.id, photos);
    return {
      title: stopTitle(s),
      items: [
        ...(s.note?.sources ?? []),
        ...(photo ? [photo.credit.href ? { label: photo.credit.text, href: photo.credit.href, note: 'Photograph' } : { label: photo.credit.text, note: 'Photograph' }] : []),
      ],
    };
  }).filter((g) => g.items.length > 0);
}

export const TIMELINE_SOURCES = timelineSources();
