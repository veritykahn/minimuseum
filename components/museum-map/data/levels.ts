import { MapRoom, RoomConnection, MapLevelConfig, ExhibitionFloorPlan, FloorPlanWall } from '../types';
import { LESSON_ROOM_IDS, hasLessons, lessonsPath } from '@/lib/lessons/catalog';

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
  inTheirHands: '#C9A84C',
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

// An exhibition with on-screen lessons gets a Lessons room along the foot of
// its plan, through a doorway in the old outer wall; the view grows to hold it.
const LESSONS_ROOM_HEIGHT = 50;

function withLessons(
  plan: ExhibitionFloorPlan, viewBox: string, exhibition: string,
): { floorPlan: ExhibitionFloorPlan; viewBox: string } {
  if (!hasLessons(exhibition)) return { floorPlan: plan, viewBox };
  const { x, y, width, height } = plan.outline;
  const foot = y + height;
  const [vx, vy, vw, vh] = viewBox.split(' ').map(Number);
  return {
    viewBox: `${vx} ${vy} ${vw} ${vh + LESSONS_ROOM_HEIGHT}`,
    floorPlan: {
      ...plan,
      outline: { ...plan.outline, height: height + LESSONS_ROOM_HEIGHT },
      walls: [...plan.walls, ...wallWithDoorway(x, foot, x + width, foot, 20)],
      rooms: [
        ...plan.rooms,
        {
          id: LESSON_ROOM_IDS[exhibition], label: 'Lessons', path: lessonsPath(exhibition),
          accentColor: plan.accentColor, parent: exhibition,
          x, y: foot, width, height: LESSONS_ROOM_HEIGHT,
          labelX: x + width / 2, labelY: foot + LESSONS_ROOM_HEIGHT / 2,
        },
      ],
    },
  };
}

/** The exhibition's Lessons room, as a child id, once it has lessons. */
const lessonsChild = (exhibition: string) => (hasLessons(exhibition) ? [LESSON_ROOM_IDS[exhibition]] : []);

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
    parent: 'greathall',
  },
  {
    id: 'first-floor', label: '1st Floor: Horizons', path: '/exhibitions/first-floor',
    x: 100, y: 140, width: 300, height: 80, accentColor: COLORS.sageLighter,
    parent: 'greathall',
    children: ['seeing-is-deceiving', 'harlem-renaissance', 'in-their-hands', 'fear-lab', 'great-war'],
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
  // Top row — open exhibitions
  {
    id: 'seeing-is-deceiving', label: 'Seeing is Deceiving', path: '/exhibitions/seeing-is-deceiving',
    x: 25, y: 80, width: 140, height: 120, accentColor: COLORS.seeingIsDeceiving,
    parent: 'first-floor',
    children: ['illusions', 'artifacts', 'resources', ...lessonsChild('seeing-is-deceiving')],
  },
  {
    id: 'harlem-renaissance', label: 'Harlem Renaissance', path: '/exhibitions/harlem-renaissance',
    x: 180, y: 80, width: 140, height: 120, accentColor: COLORS.harlemRenaissance,
    parent: 'first-floor',
    children: ['hr-artifacts', 'hr-jazz-lab', 'hr-harlem-in-words', 'hr-migration-map', 'hr-resources', ...lessonsChild('harlem-renaissance')],
  },
  {
    id: 'in-their-hands', label: 'In Their Hands', path: '/exhibitions/in-their-hands',
    x: 335, y: 80, width: 140, height: 120, accentColor: COLORS.inTheirHands,
    parent: 'first-floor',
    children: ['ith-case-6', 'ith-case-7', 'ith-case-8', 'ith-timeline', 'ith-hands', 'ith-real-or-replica', ...lessonsChild('in-their-hands')],
  },
  // Bottom row — installation in progress
  {
    id: 'fear-lab', label: 'Fear Lab', path: '/exhibitions/fear-lab',
    x: 102, y: 240, width: 140, height: 100, accentColor: COLORS.fearLab,
    comingSoon: true, parent: 'first-floor',
  },
  {
    id: 'great-war', label: 'The Great War', path: '/exhibitions/great-war',
    x: 257, y: 240, width: 140, height: 100, accentColor: COLORS.greatWar,
    comingSoon: true, parent: 'first-floor',
  },
];

const FIRST_FLOOR_CONNECTIONS: RoomConnection[] = [
  ['seeing-is-deceiving', 'harlem-renaissance'],
  ['harlem-renaissance', 'in-their-hands'],
  ['seeing-is-deceiving', 'fear-lab'],
  ['in-their-hands', 'great-war'],
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
  outline: { x: 40, y: 80, width: 420, height: 170, rx: 3 },
  accentColor: COLORS.seeingIsDeceiving,
  walls: [
    // Horizontal wall between Exhibition Hall and rooms (with doorway)
    ...wallWithDoorway(40, 130, 460, 130, 20),
    // Vertical wall between Illusions and Artifacts (with doorway)
    ...wallWithDoorway(180, 130, 180, 250),
    // Vertical wall between Artifacts and Resources (with doorway)
    ...wallWithDoorway(320, 130, 320, 250),
  ],
  rooms: [
    {
      id: 'sid-entrance', label: 'Exhibition Hall', path: '/exhibitions/seeing-is-deceiving',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 80, width: 420, height: 50,
      labelX: 250, labelY: 105,
    },
    {
      id: 'illusions', label: 'Illusions', path: '/exhibitions/seeing-is-deceiving/illusions',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 130, width: 140, height: 120,
      labelX: 110, labelY: 190,
    },
    {
      id: 'artifacts', label: 'Artifacts', path: '/exhibitions/seeing-is-deceiving/artifacts',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 180, y: 130, width: 140, height: 120,
      labelX: 250, labelY: 190,
    },
    {
      id: 'resources', label: 'Resources', path: '/exhibitions/seeing-is-deceiving/resources',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 320, y: 130, width: 140, height: 120,
      labelX: 390, labelY: 190,
    },
  ],
};

export const SEEING_IS_DECEIVING: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Seeing is Deceiving',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
    { label: '1st Floor', viewPath: '/exhibitions/first-floor', accentColor: COLORS.sageLighter },
  ],
  ...withLessons(SID_FLOOR_PLAN, '0 0 500 300', 'seeing-is-deceiving'),
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
    x: 40, y: 80, width: 420, height: 280, rx: 3,
  },
  accentColor: COLORS.harlemRenaissance,
  walls: [
    // Horizontal wall between Exhibition Hall and top row (with doorway)
    ...wallWithDoorway(40, 130, 460, 130, 20),

    // Top row vertical walls
    ...wallWithDoorway(180, 130, 180, 245),   // between Artifacts and Jazz Lab
    ...wallWithDoorway(320, 130, 320, 245),   // between Jazz Lab and Harlem in Words

    // Horizontal wall (top/bottom row separator)
    ...wallWithDoorway(40, 245, 180, 245),   // under Artifacts
    ...wallWithDoorway(180, 245, 320, 245),  // under Jazz Lab

    // Bottom row vertical wall
    ...wallWithDoorway(220, 245, 220, 360),  // between Migration Map and Resources
  ],
  rooms: [
    // Exhibition Hall entrance
    {
      id: 'hr-entrance', label: 'Exhibition Hall', path: '/exhibitions/harlem-renaissance',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 80, width: 420, height: 50,
      labelX: 250, labelY: 105,
    },
    // Top row
    {
      id: 'hr-artifacts', label: 'Artifacts', path: '/exhibitions/harlem-renaissance/artifacts',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 130, width: 140, height: 115,
      labelX: 110, labelY: 188,
    },
    {
      id: 'hr-jazz-lab', label: 'Jazz Lab', path: '/exhibitions/harlem-renaissance/jazz-lab',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 180, y: 130, width: 140, height: 115,
      labelX: 250, labelY: 188,
    },
    {
      id: 'hr-harlem-in-words', label: 'Harlem in Words', path: '/exhibitions/harlem-renaissance/harlem-in-words',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 320, y: 130, width: 140, height: 230,
      labelX: 390, labelY: 245,
    },
    // Bottom row
    {
      id: 'hr-migration-map', label: 'Great Migration Map', path: '/exhibitions/harlem-renaissance/migration-map',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 245, width: 180, height: 115,
      labelX: 130, labelY: 302,
    },
    {
      id: 'hr-resources', label: 'Resources', path: '/exhibitions/harlem-renaissance/resources',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 220, y: 245, width: 100, height: 115,
      labelX: 270, labelY: 302,
    },
  ],
};

export const HARLEM_RENAISSANCE: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Harlem Renaissance',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
    { label: '1st Floor', viewPath: '/exhibitions/first-floor', accentColor: COLORS.sageLighter },
  ],
  ...withLessons(HR_FLOOR_PLAN, '0 0 500 410', 'harlem-renaissance'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — In Their Hands (Floor Plan)
//
// Layout: each display case sits above the interactive it leads to
// ┌──────────┬──────────┬──────────┐
// │  Case 6  │  Case 7  │  Case 8  │
// ├── ───────┼── ───────┼── ───────┤
// │  Gospel  │ Hands of │  Real or │
// │ Timeline │ History  │ Replica? │
// └──────────┴──────────┴──────────┘
// ═══════════════════════════════════════════════════════════════════

const ITH_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 280, rx: 3 },
  accentColor: COLORS.inTheirHands,
  walls: [
    // Horizontal wall between Exhibition Hall and the cases (with doorway)
    ...wallWithDoorway(40, 130, 460, 130, 20),

    // Case row vertical walls
    ...wallWithDoorway(180, 130, 180, 245),  // between Case 6 and Case 7
    ...wallWithDoorway(320, 130, 320, 245),  // between Case 7 and Case 8

    // Horizontal wall between each case and its interactive
    ...wallWithDoorway(40, 245, 180, 245),   // Case 6 → Gospel Timeline
    ...wallWithDoorway(180, 245, 320, 245),  // Case 7 → Hands of History
    ...wallWithDoorway(320, 245, 460, 245),  // Case 8 → Real or Replica?

    // Interactive row vertical walls
    ...wallWithDoorway(180, 245, 180, 360),
    ...wallWithDoorway(320, 245, 320, 360),
  ],
  rooms: [
    // Exhibition Hall entrance
    {
      id: 'ith-entrance', label: 'Exhibition Hall', path: '/exhibitions/in-their-hands',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 40, y: 80, width: 420, height: 50,
      labelX: 250, labelY: 105,
    },
    // Display cases
    {
      id: 'ith-case-6', label: 'Case 6', path: '/exhibitions/in-their-hands/artifacts/case-6',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 40, y: 130, width: 140, height: 115,
      labelX: 110, labelY: 188,
    },
    {
      id: 'ith-case-7', label: 'Case 7', path: '/exhibitions/in-their-hands/artifacts/case-7',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 180, y: 130, width: 140, height: 115,
      labelX: 250, labelY: 188,
    },
    {
      id: 'ith-case-8', label: 'Case 8', path: '/exhibitions/in-their-hands/artifacts/case-8',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 320, y: 130, width: 140, height: 115,
      labelX: 390, labelY: 188,
    },
    // Interactives
    {
      id: 'ith-timeline', label: 'The Gospel Timeline', path: '/exhibitions/in-their-hands/timeline',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 40, y: 245, width: 140, height: 115,
      labelX: 110, labelY: 302,
    },
    {
      id: 'ith-hands', label: 'Hands of History', path: '/exhibitions/in-their-hands/hands',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 180, y: 245, width: 140, height: 115,
      labelX: 250, labelY: 302,
    },
    {
      id: 'ith-real-or-replica', label: 'Real or Replica?', path: '/exhibitions/in-their-hands/real-or-replica',
      accentColor: COLORS.inTheirHands, parent: 'in-their-hands',
      x: 320, y: 245, width: 140, height: 115,
      labelX: 390, labelY: 302,
    },
  ],
};

export const IN_THEIR_HANDS: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'In Their Hands',
  backTarget: { label: '1st Floor', path: '/exhibitions/first-floor' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
    { label: '1st Floor', viewPath: '/exhibitions/first-floor', accentColor: COLORS.sageLighter },
  ],
  ...withLessons(ITH_FLOOR_PLAN, '0 0 500 410', 'in-their-hands'),
};

// ═══════════════════════════════════════════════════════════════════
// Level resolver
// ═══════════════════════════════════════════════════════════════════

export function getLevelConfig(pathname: string): MapLevelConfig {
  if (pathname.startsWith('/exhibitions/seeing-is-deceiving')) return SEEING_IS_DECEIVING;
  if (pathname.startsWith('/exhibitions/harlem-renaissance')) return HARLEM_RENAISSANCE;
  if (pathname.startsWith('/exhibitions/in-their-hands')) return IN_THEIR_HANDS;
  if (pathname === '/exhibitions/first-floor') return FIRST_FLOOR;
  if (pathname === '/exhibitions/ground-floor') return GROUND_FLOOR;
  return MUSEUM_OVERVIEW;
}
