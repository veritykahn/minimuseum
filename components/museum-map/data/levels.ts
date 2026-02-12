import { MapRoom, RoomConnection, MapLevelConfig, ExhibitionFloorPlan, FloorPlanWall } from '../types';

/**
 * Per-level layout configurations for the hierarchical museum map.
 *
 * Level 1 & 2 use box-and-line rendering.
 * Level 3 uses architectural floor plans (connected rooms with shared walls).
 *
 * Ancestors at each level let you navigate up within the map without
 * leaving the current page.
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

// Helper: create a wall segment with a doorway gap in the middle
function wallWithDoorway(
  x1: number, y1: number, x2: number, y2: number,
  gapSize = 16,
): FloorPlanWall[] {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const isVertical = x1 === x2;
  const half = gapSize / 2;

  if (isVertical) {
    return [
      { x1, y1, x2, y2: midY - half },
      { x1, y1: midY + half, x2, y2 },
    ];
  }
  return [
    { x1, y1, x2: midX - half, y2 },
    { x1: midX + half, y1, x2, y2 },
  ];
}

// ═══════════════════════════════════════════════════════════════════
// LEVEL 1 — Museum Overview
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
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
  ],
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
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Seeing is Deceiving (Floor Plan)
//
// Layout: three rooms in a row sharing walls
// ┌────────────┬────────────┬────────────┐
// │            │            │            │
// │  Illusions │  Artifacts │  Resources │
// │            │            │            │
// └────────────┴────────────┴────────────┘
// ═══════════════════════════════════════════════════════════════════

const SID_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 130, rx: 3 },
  accentColor: COLORS.seeingIsDeceiving,
  walls: [
    // Vertical wall between Illusions and Artifacts (with doorway)
    ...wallWithDoorway(180, 80, 180, 210),
    // Vertical wall between Artifacts and Resources (with doorway)
    ...wallWithDoorway(320, 80, 320, 210),
  ],
  rooms: [
    {
      id: 'illusions', label: 'Illusions', path: '/exhibitions/seeing-is-deceiving/illusions',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 80, width: 140, height: 130,
      labelX: 110, labelY: 145,
    },
    {
      id: 'artifacts', label: 'Artifacts', path: '/exhibitions/seeing-is-deceiving/artifacts',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 180, y: 80, width: 140, height: 130,
      labelX: 250, labelY: 145,
    },
    {
      id: 'resources', label: 'Resources', path: '/exhibitions/seeing-is-deceiving/resources',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 320, y: 80, width: 140, height: 130,
      labelX: 390, labelY: 145,
    },
  ],
};

export const SEEING_IS_DECEIVING: MapLevelConfig = {
  level: 'exhibition',
  viewBox: '0 0 500 260',
  rooms: [],
  connections: [],
  title: 'Seeing is Deceiving',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
    { label: '1st Floor', viewPath: '/exhibitions/first-floor', accentColor: COLORS.sageLighter },
  ],
  floorPlan: SID_FLOOR_PLAN,
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Harlem Renaissance (Floor Plan)
//
// Layout: 3 rooms on top, 2 rooms on bottom, all connected
// ┌──────────┬──────────┬──────────────┐
// │          │          │   Harlem in  │
// │ Artifacts│ Jazz Lab │    Words     │
// │          │          │              │
// ├── ───────┼── ───────┼── ──────┐    │
// │          │          │         │    │
// │ Great    │          │         └────┤
// │ Migration│ Resources│              │
// │   Map    │(coming)  │              │
// └──────────┴──────────┘              │
//                                      │
// ═══════════════════════════════════════════════════════════════════

const HR_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: {
    x: 40, y: 80, width: 420, height: 230, rx: 3,
  },
  accentColor: COLORS.harlemRenaissance,
  walls: [
    // Top row vertical walls
    ...wallWithDoorway(180, 80, 180, 195),   // between Artifacts and Jazz Lab
    ...wallWithDoorway(320, 80, 320, 195),   // between Jazz Lab and Harlem in Words

    // Horizontal wall (top/bottom row separator)
    ...wallWithDoorway(40, 195, 180, 195),   // under Artifacts
    ...wallWithDoorway(180, 195, 320, 195),  // under Jazz Lab

    // Bottom row vertical wall
    ...wallWithDoorway(220, 195, 220, 310),  // between Migration Map and Resources
  ],
  rooms: [
    // Top row
    {
      id: 'hr-artifacts', label: 'Artifacts', path: '/exhibitions/harlem-renaissance/artifacts',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 80, width: 140, height: 115,
      labelX: 110, labelY: 138,
    },
    {
      id: 'hr-jazz-lab', label: 'Jazz Lab', path: '/exhibitions/harlem-renaissance/jazz-lab',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 180, y: 80, width: 140, height: 115,
      labelX: 250, labelY: 138,
    },
    {
      id: 'hr-harlem-in-words', label: 'Harlem in Words', path: '/exhibitions/harlem-renaissance/harlem-in-words',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 320, y: 80, width: 140, height: 230,
      labelX: 390, labelY: 195,
    },
    // Bottom row
    {
      id: 'hr-migration-map', label: 'Great Migration Map', path: '/exhibitions/harlem-renaissance/migration-map',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 195, width: 180, height: 115,
      labelX: 130, labelY: 252,
    },
    {
      id: 'hr-resources', label: 'Resources', path: '/exhibitions/harlem-renaissance/resources',
      accentColor: COLORS.harlemRenaissance, comingSoon: true, parent: 'harlem-renaissance',
      x: 220, y: 195, width: 100, height: 115,
      labelX: 270, labelY: 252,
    },
  ],
};

export const HARLEM_RENAISSANCE: MapLevelConfig = {
  level: 'exhibition',
  viewBox: '0 0 500 360',
  rooms: [],
  connections: [],
  title: 'Harlem Renaissance',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
    { label: '1st Floor', viewPath: '/exhibitions/first-floor', accentColor: COLORS.sageLighter },
  ],
  floorPlan: HR_FLOOR_PLAN,
};

// ═══════════════════════════════════════════════════════════════════
// Level resolver
// ═══════════════════════════════════════════════════════════════════

export function getLevelConfig(pathname: string): MapLevelConfig {
  if (pathname.startsWith('/exhibitions/seeing-is-deceiving')) return SEEING_IS_DECEIVING;
  if (pathname.startsWith('/exhibitions/harlem-renaissance')) return HARLEM_RENAISSANCE;
  if (pathname === '/exhibitions/first-floor') return FIRST_FLOOR;
  if (pathname === '/exhibitions/ground-floor') return GROUND_FLOOR;
  return MUSEUM_OVERVIEW;
}
