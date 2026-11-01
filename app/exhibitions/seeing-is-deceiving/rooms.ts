import type { DisplayCase } from '@/components/exhibition/types';

/*
 * Seeing is Deceiving's interactive rooms: listed under "Interactives" on the
 * display case page (artifacts/page.tsx) and in the landing page's Explore
 * row, both from this one list, so the two cannot drift apart.
 */
export const SEEING_ROOMS: DisplayCase[] = [
  {
    href: '/exhibitions/seeing-is-deceiving/illusions',
    image: { src: '/exhibitions/seeing/rooms/perception-lab.webp', alt: 'Perception Lab' },
    label: 'Interactive',
    title: 'Perception Lab',
    subtitle: 'Test Your Visual System',
  },
  {
    href: '/exhibitions/seeing-is-deceiving/optical-toys',
    image: { src: '/exhibitions/seeing/rooms/optical-toys.webp', alt: 'Optical Toys' },
    label: 'Interactive',
    title: 'Optical Toys',
    subtitle: 'The Thaumatrope & the Zoetrope',
  },
];
