import { MapRoom, RoomConnection, MapLevelConfig } from '../types';

/**
 * Per-level layout configurations for the hierarchical museum map.
 *
 * Each level defines its own rooms (with positions), connections, viewBox,
 * title, back-navigation target, and optional sibling exhibitions.
 *
 * Coordinates are hand-crafted for each level — the same room ID can have
 * different positions at different zoom depths.
 */

// ─── Exhibition Colors ──────────────────────────────────────────
const COLORS = {
  sage: '#7D8471',
  sageLighter: '#9aa091',
  seeingIsDeceiving: '#a8d5e5',
  harlemRenaissance: '#b485d2',
  fearLab: '#1E3A5F',
  greatWar: '#9B2226',
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 1 — Museum Overview
// Shown at: /greathall, /about, /contact
// ═══════════════════════════════════════════════════════════════════

const LEVEL1_ROOMS: MapRoom[] = [
  {
    id: 'greathall', label: 'Great Hall', path: '/greathall',
    x: 175, y: 30, width: 150, height: 60, accentColor: COLORS.sage,
  },
  {
    id: 'about', label: 'About', path: '/about',
    x: 50, y: 30, width: 90, height: 60, accentColor: COLORS.sage,
    parent: 'greathall',
  },
  {
    id: 'contact', label: 'Contact', path: '/contact',
    x: 360, y: 30, width: 90, height: 60, accentColor: COLORS.sage,
    comingSoon: true, parent: 'greathall',
  },
  {
    id: 'first-floor', label: '1st Floor: Horizons', path: '/exhibitions/first-floor',
    x: 100, y: 140, width: 300, height: 80, accentColor: COLORS.sageLighter,
    parent: 'greathall',
    children: ['seeing-is-deceiving', 'harlem-renaissance', 'fear-lab', 'great-war'],
  },
  {
    id: 'ground-floor', label: 'Ground Floor: Origins', path: '/exhibitions/ground-floor',
    x: 100, y: 280, width: 300, height: 80, accentColor: COLORS.sage,
    comingSoon: true, parent: 'greathall',
    children: ['egypt', 'victorian', 'holocaust', 'black-barbie', 'womens-history'],
  },
];

const LEVEL1_CONNECTIONS: RoomConnection[] = [
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ['greathall', 'first-floor'],
  ['first-floor', 'ground-floor'],
];

export const MUSEUM_OVERVIEW: MapLevelConfig = {
  level: 'museum',
  viewBox: '0 0 500 400',
  rooms: LEVEL1_ROOMS,
  connections: LEVEL1_CONNECTIONS,
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 2 — First Floor
// Shown at: /exhibitions/first-floor
// ═══════════════════════════════════════════════════════════════════

const FIRST_FLOOR_ROOMS: MapRoom[] = [
  {
    id: 'seeing-is-deceiving', label: 'Seeing is Deceiving', path: '/exhibitions/seeing-is-deceiving',
    x: 30, y: 80, width: 200, height: 120, accentColor: COLORS.seeingIsDeceiving,
    parent: 'first-floor',
    children: ['illusions', 'artifacts', 'resources'],
  },
  {
    id: 'harlem-renaissance', label: 'Harlem Renaissance', path: '/exhibitions/harlem-renaissance',
    x: 270, y: 80, width: 200, height: 120, accentColor: COLORS.harlemRenaissance,
    parent: 'first-floor',
    children: ['hr-artifacts', 'hr-jazz-lab', 'hr-harlem-in-words', 'hr-migration-map', 'hr-resources'],
  },
  {
    id: 'fear-lab', label: 'Fear Lab', path: '/exhibitions/fear-lab',
    x: 30, y: 240, width: 200, height: 100, accentColor: COLORS.fearLab,
    comingSoon: true, parent: 'first-floor',
  },
  {
    id: 'great-war', label: 'The Great War', path: '/exhibitions/great-war',
    x: 270, y: 240, width: 200, height: 100, accentColor: COLORS.greatWar,
    comingSoon: true, parent: 'first-floor',
  },
];

const FIRST_FLOOR_CONNECTIONS: RoomConnection[] = [
  ['seeing-is-deceiving', 'harlem-renaissance'],
  ['seeing-is-deceiving', 'fear-lab'],
  ['harlem-renaissance', 'great-war'],
  ['fear-lab', 'great-war'],
];

export const FIRST_FLOOR: MapLevelConfig = {
  level: 'floor',
  viewBox: '0 0 500 380',
  rooms: FIRST_FLOOR_ROOMS,
  connections: FIRST_FLOOR_CONNECTIONS,
  title: '1st Floor: Horizons',
  backTarget: { label: 'Museum Overview', path: '/greathall' },
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 2 — Ground Floor (placeholder for future)
// ═══════════════════════════════════════════════════════════════════

export const GROUND_FLOOR: MapLevelConfig = {
  level: 'floor',
  viewBox: '0 0 500 380',
  rooms: [],
  connections: [],
  title: 'Ground Floor: Origins',
  backTarget: { label: 'Museum Overview', path: '/greathall' },
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Seeing is Deceiving
// Shown at: /exhibitions/seeing-is-deceiving and deeper
// ═══════════════════════════════════════════════════════════════════

const SID_ROOMS: MapRoom[] = [
  {
    id: 'illusions', label: 'Illusions', path: '/exhibitions/seeing-is-deceiving/illusions',
    x: 30, y: 80, width: 120, height: 110, accentColor: COLORS.seeingIsDeceiving,
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'artifacts', label: 'Artifacts', path: '/exhibitions/seeing-is-deceiving/artifacts',
    x: 175, y: 80, width: 120, height: 110, accentColor: COLORS.seeingIsDeceiving,
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'resources', label: 'Resources', path: '/exhibitions/seeing-is-deceiving/resources',
    x: 320, y: 80, width: 120, height: 110, accentColor: COLORS.seeingIsDeceiving,
    parent: 'seeing-is-deceiving',
  },
];

const SID_CONNECTIONS: RoomConnection[] = [
  ['illusions', 'artifacts'],
  ['artifacts', 'resources'],
];

const SID_SIBLINGS: MapRoom[] = [
  {
    id: 'harlem-renaissance', label: 'Harlem Renaissance', path: '/exhibitions/harlem-renaissance',
    x: 0, y: 0, width: 0, height: 0, accentColor: COLORS.harlemRenaissance,
    parent: 'first-floor',
  },
  {
    id: 'fear-lab', label: 'Fear Lab', path: '/exhibitions/fear-lab',
    x: 0, y: 0, width: 0, height: 0, accentColor: COLORS.fearLab,
    comingSoon: true, parent: 'first-floor',
  },
];

export const SEEING_IS_DECEIVING: MapLevelConfig = {
  level: 'exhibition',
  viewBox: '0 0 500 240',
  rooms: SID_ROOMS,
  connections: SID_CONNECTIONS,
  title: 'Seeing is Deceiving',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  siblingExhibitions: SID_SIBLINGS,
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Harlem Renaissance
// Shown at: /exhibitions/harlem-renaissance and deeper
// ═══════════════════════════════════════════════════════════════════

const HR_ROOMS: MapRoom[] = [
  {
    id: 'hr-artifacts', label: 'Artifacts', path: '/exhibitions/harlem-renaissance/artifacts',
    x: 30, y: 70, width: 130, height: 90, accentColor: COLORS.harlemRenaissance,
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-jazz-lab', label: 'Jazz Lab', path: '/exhibitions/harlem-renaissance/jazz-lab',
    x: 185, y: 70, width: 130, height: 90, accentColor: COLORS.harlemRenaissance,
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-harlem-in-words', label: 'Harlem in Words', path: '/exhibitions/harlem-renaissance/harlem-in-words',
    x: 340, y: 70, width: 130, height: 90, accentColor: COLORS.harlemRenaissance,
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-migration-map', label: 'Great Migration Map', path: '/exhibitions/harlem-renaissance/migration-map',
    x: 108, y: 190, width: 140, height: 90, accentColor: COLORS.harlemRenaissance,
    parent: 'harlem-renaissance',
  },
  {
    id: 'hr-resources', label: 'Resources', path: '/exhibitions/harlem-renaissance/resources',
    x: 273, y: 190, width: 130, height: 90, accentColor: COLORS.harlemRenaissance,
    comingSoon: true, parent: 'harlem-renaissance',
  },
];

const HR_CONNECTIONS: RoomConnection[] = [
  ['hr-artifacts', 'hr-jazz-lab'],
  ['hr-jazz-lab', 'hr-harlem-in-words'],
  ['hr-artifacts', 'hr-migration-map'],
  ['hr-jazz-lab', 'hr-migration-map'],
  ['hr-harlem-in-words', 'hr-resources'],
  ['hr-migration-map', 'hr-resources'],
];

const HR_SIBLINGS: MapRoom[] = [
  {
    id: 'seeing-is-deceiving', label: 'Seeing is Deceiving', path: '/exhibitions/seeing-is-deceiving',
    x: 0, y: 0, width: 0, height: 0, accentColor: COLORS.seeingIsDeceiving,
    parent: 'first-floor',
  },
  {
    id: 'great-war', label: 'The Great War', path: '/exhibitions/great-war',
    x: 0, y: 0, width: 0, height: 0, accentColor: COLORS.greatWar,
    comingSoon: true, parent: 'first-floor',
  },
];

export const HARLEM_RENAISSANCE: MapLevelConfig = {
  level: 'exhibition',
  viewBox: '0 0 500 320',
  rooms: HR_ROOMS,
  connections: HR_CONNECTIONS,
  title: 'Harlem Renaissance',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  siblingExhibitions: HR_SIBLINGS,
};

// ═══════════════════════════════════════════════════════════════════
// Level resolver — maps pathname to the correct config
// ═══════════════════════════════════════════════════════════════════

export function getLevelConfig(pathname: string): MapLevelConfig {
  // Level 3: Exhibition pages and their sub-pages
  if (pathname.startsWith('/exhibitions/seeing-is-deceiving')) return SEEING_IS_DECEIVING;
  if (pathname.startsWith('/exhibitions/harlem-renaissance')) return HARLEM_RENAISSANCE;

  // Level 2: Floor pages
  if (pathname === '/exhibitions/first-floor') return FIRST_FLOOR;
  if (pathname === '/exhibitions/ground-floor') return GROUND_FLOOR;

  // Level 1: Everything else
  return MUSEUM_OVERVIEW;
}
