import type { DisplayCase } from '@/components/exhibition/types';

/*
 * The Harlem Renaissance's interactive rooms: listed under "Interactives" on
 * the display case page (artifacts/page.tsx) and in the landing page's
 * Explore row, both from this one list, so the two cannot drift apart. Each
 * card's picture is the room's own; the emblem stands in only without one.
 */
export const HARLEM_ROOMS: DisplayCase[] = [
  {
    href: '/exhibitions/harlem-renaissance/jazz-lab',
    image: { src: '/exhibitions/harlem/artifacts/jazz-thumb.jpg', alt: 'The Jazz Lab' },
    emblem: '\u{1F3B7}',
    label: 'Interactive',
    title: 'The Jazz Lab',
    subtitle: 'Build a Band & Test Your Ear',
  },
  {
    href: '/exhibitions/harlem-renaissance/migration-map',
    image: { src: '/exhibitions/harlem/artifacts/migration-thumb.jpg', alt: 'The Great Migration Map' },
    emblem: '\u{1F5FA}\u{FE0F}',
    label: 'Interactive',
    title: 'The Great Migration Map',
    subtitle: 'Trace the Journey North',
  },
  {
    href: '/exhibitions/harlem-renaissance/harlem-in-words',
    image: { src: '/exhibitions/harlem/artifacts/words-thumb.jpg', alt: 'Harlem in Words' },
    emblem: '\u{270D}\u{FE0F}',
    label: 'Interactive',
    title: 'Harlem in Words',
    subtitle: 'Poetry of the Renaissance',
  },
];
