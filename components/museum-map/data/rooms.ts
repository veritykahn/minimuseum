import { MapRoom } from '../types';
import { LESSON_ROOM_IDS, hasLessons, lessonsPath } from '@/lib/lessons/catalog';
import { FLOORS, GROUND_FLOOR, FIRST_FLOOR } from '@/lib/floors';

const EXHIBITION_ACCENTS: Record<string, string> = {
  'seeing-is-deceiving': '#a8d5e5',
  'harlem-renaissance': '#b485d2',
  'in-their-hands': '#C9A84C',
  'fear-lab': '#F2B33D',
  'great-war': '#E8372C',
  egypt: '#F04A1A',
  moon: '#A88BEB',
  'america-250': '#56656F',
};

/** Each exhibition's Lessons room, once it has lessons (see levels.ts). */
const LESSON_ROOMS: MapRoom[] = Object.keys(EXHIBITION_ACCENTS)
  .filter(hasLessons)
  .map((exhibition) => ({
    id: LESSON_ROOM_IDS[exhibition],
    label: 'Lessons',
    path: lessonsPath(exhibition),
    x: 0, y: 0, width: 0, height: 0,
    accentColor: EXHIBITION_ACCENTS[exhibition],
    parent: exhibition,
  }));
const lessonsChild = (exhibition: string) => (hasLessons(exhibition) ? [LESSON_ROOM_IDS[exhibition]] : []);

/** Exhibitions still being installed: on their floor, not yet open. */
const COMING_SOON_ROOMS: MapRoom[] = FLOORS.flatMap((floor) =>
  floor.exhibitions
    .filter((e) => !e.active)
    .map((e) => ({
      id: e.slug,
      label: e.title,
      path: `/exhibitions/${e.slug}`,
      x: 0, y: 0, width: 0, height: 0,
      accentColor: '#7D8471',
      comingSoon: true,
      parent: floor.path === GROUND_FLOOR.path ? 'ground-floor' : 'first-floor',
    })),
);

/**
 * Museum room definitions
 * Extracted from MuseumMap.tsx for maintainability
 */
export const MUSEUM_ROOMS: MapRoom[] = [
  // Main Hub
  {
    id: 'greathall',
    label: 'Great Hall',
    path: '/greathall',
    x: 200,
    y: 30,
    width: 100,
    height: 50,
    accentColor: '#7D8471',
  },
  // Side rooms off Great Hall
  {
    id: 'about',
    label: 'About',
    path: '/about',
    x: 70,
    y: 30,
    width: 70,
    height: 50,
    accentColor: '#7D8471',
    parent: 'greathall',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    x: 360,
    y: 30,
    width: 70,
    height: 50,
    accentColor: '#7D8471',
    parent: 'greathall',
  },
  // First Floor
  {
    id: 'first-floor',
    label: '1st Floor: Horizons',
    path: '/exhibitions/first-floor',
    x: 130,
    y: 120,
    width: 240,
    height: 40,
    accentColor: '#9aa091', // Lighter shade of Great Hall sage
    parent: 'greathall',
    children: FIRST_FLOOR.exhibitions.map((e) => e.slug),
  },
  // Ground Floor
  {
    id: 'ground-floor',
    label: 'Ground Floor: Origins',
    path: '/exhibitions/ground-floor',
    x: 130,
    y: 340,
    width: 240,
    height: 40,
    accentColor: '#7D8471',
    parent: 'greathall',
    children: GROUND_FLOOR.exhibitions.map((e) => e.slug),
  },
  // Exhibitions
  {
    id: 'seeing-is-deceiving',
    label: 'Seeing is Deceiving',
    path: '/exhibitions/seeing-is-deceiving',
    x: 40,
    y: 190,
    width: 110,
    height: 50,
    accentColor: '#a8d5e5',
    parent: 'first-floor',
    children: ['illusions', 'artifacts', 'resources', ...lessonsChild('seeing-is-deceiving')],
  },
  {
    id: 'harlem-renaissance',
    label: 'Harlem Renaissance',
    path: '/exhibitions/harlem-renaissance',
    x: 165,
    y: 190,
    width: 110,
    height: 50,
    accentColor: '#b485d2',
    parent: 'first-floor',
    children: ['hr-artifacts', 'hr-jazz-lab', 'hr-harlem-in-words', 'hr-migration-map', 'hr-resources', ...lessonsChild('harlem-renaissance')],
  },
  {
    id: 'moon',
    label: 'Our Incredible Moon',
    path: '/exhibitions/moon',
    x: 25,
    y: 80,
    width: 140,
    height: 110,
    accentColor: '#A88BEB',
    parent: 'ground-floor',
    children: ['mo-case'],
  },
  {
    id: 'mo-case',
    label: 'Display Case',
    path: '/exhibitions/moon/artifacts/case',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#A88BEB',
    parent: 'moon',
  },
  {
    id: 'america-250',
    label: 'America 250',
    path: '/exhibitions/america-250',
    x: 102,
    y: 230,
    width: 140,
    height: 100,
    accentColor: '#56656F',
    parent: 'ground-floor',
  },
  {
    id: 'egypt',
    label: 'Ancient Egypt',
    path: '/exhibitions/egypt',
    x: 180,
    y: 80,
    width: 140,
    height: 110,
    accentColor: '#F04A1A',
    parent: 'ground-floor',
    children: ['eg-case'],
  },
  {
    id: 'eg-case',
    label: 'Display Case',
    path: '/exhibitions/egypt/artifacts/case',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#F04A1A',
    parent: 'egypt',
  },
  {
    id: 'in-their-hands',
    label: 'In Their Hands',
    path: '/exhibitions/in-their-hands',
    x: 335,
    y: 80,
    width: 140,
    height: 120,
    accentColor: '#C9A84C',
    parent: 'ground-floor',
    children: ['ith-case-6', 'ith-case-7', 'ith-case-8', 'ith-timeline', 'ith-hands', 'ith-real-or-replica', ...lessonsChild('in-their-hands')],
  },
  {
    id: 'fear-lab',
    label: 'The Fear Lab',
    path: '/exhibitions/fear-lab',
    x: 270,
    y: 190,
    width: 70,
    height: 50,
    accentColor: '#F2B33D',
    parent: 'first-floor',
    children: [...lessonsChild('fear-lab')],
  },
  {
    id: 'great-war',
    label: 'The Great War',
    path: '/exhibitions/great-war',
    x: 355,
    y: 190,
    width: 100,
    height: 50,
    accentColor: '#E8372C',
    parent: 'first-floor',
    children: ['gw-case', 'gw-silence', 'gw-memorial', ...lessonsChild('great-war')],
  },
  // Seeing is Deceiving sub-pages
  {
    id: 'illusions',
    label: 'Illusions',
    path: '/exhibitions/seeing-is-deceiving/illusions',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'artifacts',
    label: 'Artifacts',
    path: '/exhibitions/seeing-is-deceiving/artifacts',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/exhibitions/seeing-is-deceiving/resources',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  // Harlem Renaissance sub-pages
  {
    id: 'hr-artifacts',
    label: 'Artifacts',
    path: '/exhibitions/harlem-renaissance/artifacts',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#b485d2',
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-jazz-lab',
    label: 'Jazz Lab',
    path: '/exhibitions/harlem-renaissance/jazz-lab',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#b485d2',
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-harlem-in-words',
    label: 'Harlem in Words',
    path: '/exhibitions/harlem-renaissance/harlem-in-words',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#b485d2',
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-migration-map',
    label: 'Great Migration Map',
    path: '/exhibitions/harlem-renaissance/migration-map',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#b485d2',
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-resources',
    label: 'Resources',
    path: '/exhibitions/harlem-renaissance/resources',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#b485d2',
    parent: 'harlem-renaissance',
  },
  // In Their Hands sub-pages
  {
    id: 'ith-case-6',
    label: 'Case 6',
    path: '/exhibitions/in-their-hands/artifacts/case-6',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  {
    id: 'ith-case-7',
    label: 'Case 7',
    path: '/exhibitions/in-their-hands/artifacts/case-7',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  {
    id: 'ith-case-8',
    label: 'Case 8',
    path: '/exhibitions/in-their-hands/artifacts/case-8',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  {
    id: 'ith-timeline',
    label: 'The Gospel Timeline',
    path: '/exhibitions/in-their-hands/timeline',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  {
    id: 'ith-hands',
    label: 'Hands of History',
    path: '/exhibitions/in-their-hands/hands',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  {
    id: 'ith-real-or-replica',
    label: 'Real or Replica?',
    path: '/exhibitions/in-their-hands/real-or-replica',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#C9A84C',
    parent: 'in-their-hands',
  },
  // The Great War sub-pages
  {
    id: 'gw-case',
    label: 'Display Case',
    path: '/exhibitions/great-war/artifacts/case',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#E8372C',
    parent: 'great-war',
  },
  {
    id: 'gw-silence',
    label: 'When the Guns Fell Silent',
    path: '/exhibitions/great-war/silence',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#E8372C',
    parent: 'great-war',
  },
  {
    id: 'gw-memorial',
    label: 'The Memorial',
    path: '/exhibitions/great-war/memorial',
    x: 0, y: 0, width: 0, height: 0,
    accentColor: '#E8372C',
    parent: 'great-war',
  },
  ...COMING_SOON_ROOMS,
  ...LESSON_ROOMS,
];

/**
 * Find a room by its ID
 */
export function getRoomById(id: string): MapRoom | undefined {
  return MUSEUM_ROOMS.find((room) => room.id === id);
}

/** True when `pathname` is `roomPath` or a page inside it (whole segments only). */
export function isWithinPath(pathname: string, roomPath: string): boolean {
  if (roomPath === '/') return pathname === '/';
  return pathname === roomPath || pathname.startsWith(`${roomPath}/`);
}

/**
 * Find a room by its path. A page with no room of its own (a single coin,
 * an artifact viewer) belongs to the most specific room that contains it.
 */
export function getRoomByPath(path: string): MapRoom | undefined {
  let best: MapRoom | undefined;
  for (const room of MUSEUM_ROOMS) {
    if (!isWithinPath(path, room.path)) continue;
    if (!best || room.path.length > best.path.length) best = room;
  }
  return best;
}

/**
 * Whether a room on the map marks where the visitor is. A room that holds
 * other rooms (a floor, an exhibition) is lit for every page inside it; a
 * leaf room only when no more specific room holds the page, so an
 * exhibition's entrance hall is not lit while the visitor is in its Jazz Lab.
 */
export function isRoomCurrent(room: { path: string; children?: string[] }, pathname: string): boolean {
  if (!isWithinPath(pathname, room.path)) return false;
  if (room.children && room.children.length > 0) return true;
  return !MUSEUM_ROOMS.some((r) => r.path.length > room.path.length && isWithinPath(pathname, r.path));
}
