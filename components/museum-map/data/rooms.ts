import { MapRoom } from '../types';

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
    comingSoon: true,
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
    children: ['seeing-is-deceiving', 'harlem-renaissance', 'fear-lab', 'great-war'],
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
    comingSoon: true,
    parent: 'greathall',
    children: ['egypt', 'victorian', 'holocaust', 'black-barbie', 'womens-history'],
  },
  // First Floor Exhibitions
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
    children: ['illusions', 'artifacts', 'resources'],
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
    children: ['hr-artifacts', 'hr-jazz-lab', 'hr-harlem-in-words', 'hr-migration-map', 'hr-resources'],
  },
  {
    id: 'fear-lab',
    label: 'Fear Lab',
    path: '/exhibitions/fear-lab',
    x: 270,
    y: 190,
    width: 70,
    height: 50,
    accentColor: '#1E3A5F',
    comingSoon: true,
    parent: 'first-floor',
  },
  {
    id: 'great-war',
    label: 'The Great War',
    path: '/exhibitions/great-war',
    x: 355,
    y: 190,
    width: 100,
    height: 50,
    accentColor: '#9B2226',
    comingSoon: true,
    parent: 'first-floor',
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
    comingSoon: true,
    parent: 'harlem-renaissance',
  },
];

/**
 * Find a room by its ID
 */
export function getRoomById(id: string): MapRoom | undefined {
  return MUSEUM_ROOMS.find((room) => room.id === id);
}

/**
 * Find a room by its path
 */
export function getRoomByPath(path: string): MapRoom | undefined {
  return (
    MUSEUM_ROOMS.find((room) => room.path === path) ||
    MUSEUM_ROOMS.find((room) => path.startsWith(room.path) && room.path !== '/')
  );
}
