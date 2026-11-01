import type { DisplayCase } from '@/components/exhibition/types';

/*
 * In Their Hands' interactive rooms, one in each display case (6, 7 and 8):
 * listed under "Interactives" on that case's page (artifacts/case-N) and, all
 * three, in the landing page's Explore row, both from this one list, so the
 * two cannot drift apart.
 */
export type IthCaseNumber = 6 | 7 | 8;
export type IthRoom = DisplayCase & { caseNumber: IthCaseNumber };

export const ITH_ROOMS: IthRoom[] = [
  {
    caseNumber: 6,
    href: '/exhibitions/in-their-hands/timeline',
    image: { src: '/exhibitions/in-their-hands/rooms/timeline.webp', alt: 'The Gospel Timeline' },
    label: 'Interactive',
    title: 'The Gospel Timeline',
    subtitle: 'Follow the coins through the New Testament',
  },
  {
    caseNumber: 7,
    href: '/exhibitions/in-their-hands/hands',
    image: { src: '/exhibitions/in-their-hands/rooms/hands.webp', alt: 'Hands of History' },
    label: 'Interactive',
    title: 'Hands of History',
    subtitle: 'Who held these coins — and when?',
  },
  {
    caseNumber: 8,
    href: '/exhibitions/in-their-hands/real-or-replica',
    image: { src: '/exhibitions/in-their-hands/rooms/real-or-replica.webp', alt: 'Real or Replica?' },
    label: 'Interactive',
    title: 'Real or Replica?',
    subtitle: 'Learn to authenticate ancient coins',
  },
];

/** The room in a case, as its case page's Interactives card takes it (CaseListing's `interactive`). */
export function caseRoom(caseNumber: IthCaseNumber) {
  const r = ITH_ROOMS.find((room) => room.caseNumber === caseNumber);
  if (!r) throw new Error(`No room in case ${caseNumber}`);
  return { id: r.href.split('/').pop() ?? r.href, title: r.title, subtitle: r.subtitle ?? '', thumb: r.image?.src, route: r.href, status: 'available' as const };
}
