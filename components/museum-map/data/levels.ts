import { MapRoom, RoomConnection, MapLevelConfig, ExhibitionFloorPlan, FloorPlanWall } from '../types';
import { LESSON_ROOM_IDS, hasLessons, lessonsPath } from '@/lib/lessons/catalog';
import {
  FLOORS,
  GROUND_FLOOR as GROUND_FLOOR_PAGE,
  FIRST_FLOOR as FIRST_FLOOR_PAGE,
  SECOND_FLOOR as SECOND_FLOOR_PAGE,
  STUDIO as STUDIO_PAGE,
  findExhibition,
} from '@/lib/floors';

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
  slate: SECOND_FLOOR_PAGE.accent,
  brass: STUDIO_PAGE.accent,
  seeingIsDeceiving: '#a8d5e5',
  harlemRenaissance: '#b485d2',
  inTheirHands: '#C9A84C',
  fearLab: '#F2B33D',
  greatWar: '#E8372C',
  egypt: '#F04A1A',
  moon: '#A88BEB',
  america250: '#56656F',
  victorian: '#D9B7B8',
  womensHistory: '#F2661F',
  holocaust: '#78716C',
  blackHistory: '#EC4899',
  writingRevolution: '#5B8DB8',
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

// Each floor's exhibitions, in the order of its floor page (see lib/floors.ts).
// The ids are the exhibitions' slugs: /exhibitions/<id>.
const GROUND_FLOOR_IDS = GROUND_FLOOR_PAGE.exhibitions.map((e) => e.slug);
const FIRST_FLOOR_IDS = FIRST_FLOOR_PAGE.exhibitions.map((e) => e.slug);
const SECOND_FLOOR_IDS = SECOND_FLOOR_PAGE.exhibitions.map((e) => e.slug);

// The Studio's tools, each a door to its room in its exhibition.
const STUDIO_IDS = STUDIO_PAGE.tools.map((_, i) => `studio-${i + 1}`);

// Each floor as the map names it, and its color.
const MAP_FLOORS: Record<string, { label: string; accentColor: string }> = {
  [GROUND_FLOOR_PAGE.path]: { label: 'Ground Floor', accentColor: COLORS.sage },
  [FIRST_FLOOR_PAGE.path]: { label: '1st Floor', accentColor: COLORS.sageLighter },
  [SECOND_FLOOR_PAGE.path]: { label: '2nd Floor', accentColor: COLORS.slate },
};

/**
 * An exhibition's way back up the map: its floor, as the back target and the
 * second of its ancestors, so it follows the exhibition to whichever floor
 * lib/floors.ts puts it on.
 */
function onFloorOf(exhibition: string): Pick<MapLevelConfig, 'backTarget' | 'ancestors'> {
  const floor = FLOORS.find((f) => f.exhibitions.some((e) => e.slug === exhibition));
  if (!floor) throw new Error(`No floor holds the exhibition "${exhibition}"`);
  const { label, accentColor } = MAP_FLOORS[floor.path];
  return {
    backTarget: { label, path: floor.path },
    ancestors: [
      { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
      { label, viewPath: floor.path, accentColor },
    ],
  };
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
    parent: 'greathall',
  },
  // The floors, top first, as the stairs climb them
  {
    id: 'third-floor', label: '3rd Floor: The Studio', path: '/exhibitions/third-floor',
    x: 100, y: 125, width: 300, height: 52, accentColor: COLORS.brass,
    parent: 'greathall',
    children: STUDIO_IDS,
  },
  {
    id: 'second-floor', label: '2nd Floor: Reflections', path: '/exhibitions/second-floor',
    x: 100, y: 197, width: 300, height: 52, accentColor: COLORS.slate,
    parent: 'greathall',
    children: SECOND_FLOOR_IDS,
  },
  {
    id: 'first-floor', label: '1st Floor: Horizons', path: '/exhibitions/first-floor',
    x: 100, y: 269, width: 300, height: 52, accentColor: COLORS.sageLighter,
    parent: 'greathall',
    children: FIRST_FLOOR_IDS,
  },
  {
    id: 'ground-floor', label: 'Ground Floor: Origins', path: '/exhibitions/ground-floor',
    x: 100, y: 341, width: 300, height: 52, accentColor: COLORS.sage,
    parent: 'greathall',
    children: GROUND_FLOOR_IDS,
  },
];

const LEVEL1_CONNECTIONS: RoomConnection[] = [
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ['greathall', 'third-floor'],
  ['third-floor', 'second-floor'],
  ['second-floor', 'first-floor'],
  ['first-floor', 'ground-floor'],
];

export const MUSEUM_OVERVIEW: MapLevelConfig = {
  level: 'museum',
  viewBox: '0 0 500 410',
  rooms: LEVEL1_ROOMS,
  connections: LEVEL1_CONNECTIONS,
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 2 — Ground Floor: Origins
//
// The deep past up to about 1900, in historical order, read left to right
// and top to bottom:
// ┌──────────┐ ┌──────────┐ ┌──────────┐
// │   Moon   │─│  Egypt   │─│ In Their │
// └──────────┘ └──────────┘ │  Hands   │
//      │                    └──────────┘
//   ┌──────────┐ ┌──────────┐    │
//   │ America  │─│Victorian │────┘
//   │   250    │ │ Britain  │
//   └──────────┘ └──────────┘
// ═══════════════════════════════════════════════════════════════════

const GROUND_FLOOR_ROOMS: MapRoom[] = [
  // Top row
  {
    id: 'moon', label: 'Our Incredible\nMoon', path: '/exhibitions/moon',
    x: 25, y: 80, width: 140, height: 110, accentColor: COLORS.moon,
    parent: 'ground-floor',
    children: ['mo-case'],
  },
  {
    id: 'egypt', label: 'Ancient Egypt', path: '/exhibitions/egypt',
    x: 180, y: 80, width: 140, height: 110, accentColor: COLORS.egypt,
    parent: 'ground-floor',
    children: ['eg-case'],
  },
  {
    id: 'in-their-hands', label: 'In Their Hands', path: '/exhibitions/in-their-hands',
    x: 335, y: 80, width: 140, height: 110, accentColor: COLORS.inTheirHands,
    parent: 'ground-floor',
    children: ['ith-case-6', 'ith-case-7', 'ith-case-8', 'ith-timeline', 'ith-hands', 'ith-real-or-replica', ...lessonsChild('in-their-hands')],
  },
  // Bottom row
  {
    id: 'america-250', label: 'America 250', path: '/exhibitions/america-250',
    x: 102, y: 230, width: 140, height: 100, accentColor: COLORS.america250,
    parent: 'ground-floor',
    children: ['ap-sign'],
  },
  {
    id: 'victorian', label: 'Victorian\nBritain', path: '/exhibitions/victorian',
    x: 257, y: 230, width: 140, height: 100, accentColor: COLORS.victorian,
    parent: 'ground-floor',
    children: ['vb-case', 'vb-christmas-card', 'vb-inventions', 'vb-christmas-parlour'],
  },
];

const GROUND_FLOOR_CONNECTIONS: RoomConnection[] = [
  ['moon', 'egypt'],
  ['egypt', 'in-their-hands'],
  ['moon', 'america-250'],
  ['in-their-hands', 'victorian'],
  ['america-250', 'victorian'],
];

export const GROUND_FLOOR: MapLevelConfig = {
  level: 'floor',
  viewBox: '0 0 500 380',
  rooms: GROUND_FLOOR_ROOMS,
  connections: GROUND_FLOOR_CONNECTIONS,
  title: 'Ground Floor: Origins',
  backTarget: { label: 'Museum Overview', path: '/greathall' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 2 — First Floor: Horizons
//
// The 20th century, two rows of two, read left to right and top to bottom:
//   ┌──────────┐ ┌──────────┐
//   │ The Great│─│  Harlem  │
//   │   War    │ │Renaissance│
//   └──────────┘ └──────────┘
//        │            │
//   ┌──────────┐ ┌──────────┐
//   │ Women's  │─│Holocaust │
//   │ History  │ │ Mem. Day │
//   └──────────┘ └──────────┘
// ═══════════════════════════════════════════════════════════════════

// Two 140-wide rooms with 15 between them, centred in the 500-wide view
const COL = [102, 257];
const TOP = { y: 80, width: 140, height: 110 };
const BOTTOM = { y: 230, width: 140, height: 100 };

const FIRST_FLOOR_ROOMS: MapRoom[] = [
  {
    id: 'great-war', label: 'The Great War', path: '/exhibitions/great-war',
    x: COL[0], ...TOP, accentColor: COLORS.greatWar,
    parent: 'first-floor',
    children: ['gw-case', 'gw-silence', 'gw-memorial', ...lessonsChild('great-war')],
  },
  {
    id: 'harlem-renaissance', label: 'Harlem\nRenaissance', path: '/exhibitions/harlem-renaissance',
    x: COL[1], ...TOP, accentColor: COLORS.harlemRenaissance,
    parent: 'first-floor',
    children: ['hr-artifacts', 'hr-jazz-lab', 'hr-harlem-in-words', 'hr-migration-map', 'hr-resources', ...lessonsChild('harlem-renaissance')],
  },
  {
    id: 'womens-history', label: "Women's\nHistory Month", path: '/exhibitions/womens-history',
    x: COL[0], ...BOTTOM, accentColor: COLORS.womensHistory,
    parent: 'first-floor',
    children: ['wh-case', 'wh-violet', 'wh-remembered', ...lessonsChild('womens-history')],
  },
  {
    id: 'holocaust', label: 'Holocaust\nMemorial Day', path: '/exhibitions/holocaust',
    x: COL[1], ...BOTTOM, accentColor: COLORS.holocaust,
    parent: 'first-floor',
    children: ['ho-case', 'ho-stones', ...lessonsChild('holocaust')],
  },
];

const FIRST_FLOOR_CONNECTIONS: RoomConnection[] = [
  ['great-war', 'harlem-renaissance'],
  ['great-war', 'womens-history'],
  ['harlem-renaissance', 'holocaust'],
  ['womens-history', 'holocaust'],
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
// LEVEL 2 — Second Floor: Reflections
//
// Identity, words and the mind, two rows of two:
//   ┌──────────┐ ┌──────────┐
//   │  Black   │─│ Writing  │
//   │ History  │ │Revolution│
//   └──────────┘ └──────────┘
//        │            │
//   ┌──────────┐ ┌──────────┐
//   │ Seeing is│─│ The Fear │
//   │ Deceiving│ │   Lab    │
//   └──────────┘ └──────────┘
// ═══════════════════════════════════════════════════════════════════

const SECOND_FLOOR_ROOMS: MapRoom[] = [
  {
    id: 'black-history', label: 'Black History\nMonth', path: '/exhibitions/black-history',
    x: COL[0], ...TOP, accentColor: COLORS.blackHistory,
    parent: 'second-floor',
    children: ['bh-case', 'bh-timeline', 'bh-representation', ...lessonsChild('black-history')],
  },
  {
    id: 'writing-revolution', label: 'The Writing\nRevolution', path: '/exhibitions/writing-revolution',
    x: COL[1], ...TOP, accentColor: COLORS.writingRevolution,
    parent: 'second-floor',
    children: ['wr-case', 'wr-typing', ...lessonsChild('writing-revolution')],
  },
  {
    id: 'seeing-is-deceiving', label: 'Seeing is\nDeceiving', path: '/exhibitions/seeing-is-deceiving',
    x: COL[0], ...BOTTOM, accentColor: COLORS.seeingIsDeceiving,
    parent: 'second-floor',
    children: ['illusions', 'artifacts', 'resources', 'sid-optical-toys', ...lessonsChild('seeing-is-deceiving')],
  },
  {
    id: 'fear-lab', label: 'The Fear Lab', path: '/exhibitions/fear-lab',
    x: COL[1], ...BOTTOM, accentColor: COLORS.fearLab,
    parent: 'second-floor',
    children: [...lessonsChild('fear-lab')],
  },
];

const SECOND_FLOOR_CONNECTIONS: RoomConnection[] = [
  ['black-history', 'writing-revolution'],
  ['black-history', 'seeing-is-deceiving'],
  ['writing-revolution', 'fear-lab'],
  ['seeing-is-deceiving', 'fear-lab'],
];

export const SECOND_FLOOR: MapLevelConfig = {
  level: 'floor',
  viewBox: '0 0 500 380',
  rooms: SECOND_FLOOR_ROOMS,
  connections: SECOND_FLOOR_CONNECTIONS,
  title: '2nd Floor: Reflections',
  backTarget: { label: 'Museum Overview', path: '/greathall' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 2 — Third Floor: The Studio
//
// One workshop, its tools along two benches, each a door to the room in its
// exhibition where the tool lives (lib/floors.ts STUDIO_TOOLS), in its
// exhibition's color:
// ┌─────┬─────┬─────┬─────┬─────┐
// │  1  │  2  │  3  │  4  │  5  │
// ├─────┼─────┼─────┼─────┼─────┤
// │  6  │  7  │  8  │  9  │ 10  │
// └─────┴─────┴─────┴─────┴─────┘
// ═══════════════════════════════════════════════════════════════════

// Five 86-wide benches with 8 between them, centred in the 500-wide view
const BENCH = { width: 86, height: 110, gap: 8, left: 17, top: 80, rowGap: 30 };

// A tool's name on two lines where it is long.
const benchLabel = (title: string) => {
  const words = title.split(' ');
  if (title.length <= 12 || words.length < 2) return title;
  const mid = Math.ceil(words.length / 2);
  return `${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`;
};

const STUDIO_ROOMS: MapRoom[] = STUDIO_PAGE.tools.map((tool, i) => ({
  id: STUDIO_IDS[i],
  label: benchLabel(tool.title),
  path: tool.href,
  x: BENCH.left + (i % 5) * (BENCH.width + BENCH.gap),
  y: BENCH.top + Math.floor(i / 5) * (BENCH.height + BENCH.rowGap),
  width: BENCH.width,
  height: BENCH.height,
  accentColor: findExhibition(tool.exhibition)?.accent ?? COLORS.brass,
  parent: 'third-floor',
}));

export const STUDIO: MapLevelConfig = {
  level: 'floor',
  viewBox: '0 0 500 380',
  rooms: STUDIO_ROOMS,
  connections: [],
  title: '3rd Floor: The Studio',
  backTarget: { label: 'Museum Overview', path: '/greathall' },
  ancestors: [
    { label: 'Great Hall', viewPath: '/greathall', accentColor: COLORS.sage },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Seeing is Deceiving (Floor Plan)
//
// Layout: the Exhibition Hall with Resources beside it, the display case
// (Artifacts) beyond, and the two interactive rooms beyond that
// ┌───────────────────────┬────────────┐
// │    Exhibition Hall    ╎ Resources  │
// ├──────────╴ ╶──────────┴────────────┤
// │      Artifacts (Display Case)      │
// ├────────╴ ╶───────┬───────╴ ╶───────┤
// │    Illusions     ╎   Optical Toys  │
// └──────────────────┴─────────────────┘
// ═══════════════════════════════════════════════════════════════════

const SID_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 250, rx: 3 },
  accentColor: COLORS.seeingIsDeceiving,
  walls: [
    // Between the Exhibition Hall and Resources (with doorway)
    ...wallWithDoorway(340, 80, 340, 130),
    // Under the Exhibition Hall, into the case (with doorway); Resources is closed to it
    ...wallWithDoorway(40, 130, 340, 130, 20),
    { x1: 340, y1: 130, x2: 460, y2: 130 },
    // Under the case, a doorway into each room
    ...wallWithDoorway(40, 230, 250, 230),
    ...wallWithDoorway(250, 230, 460, 230),
    ...wallWithDoorway(250, 230, 250, 330),
  ],
  rooms: [
    {
      id: 'sid-entrance', label: 'Exhibition Hall', path: '/exhibitions/seeing-is-deceiving',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 80, width: 300, height: 50,
      labelX: 190, labelY: 105,
    },
    {
      id: 'resources', label: 'Resources', path: '/exhibitions/seeing-is-deceiving/resources',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 340, y: 80, width: 120, height: 50,
      labelX: 400, labelY: 105,
    },
    {
      id: 'artifacts', label: 'Artifacts', path: '/exhibitions/seeing-is-deceiving/artifacts',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 130, width: 420, height: 100,
      labelX: 250, labelY: 180,
    },
    {
      id: 'illusions', label: 'Illusions', path: '/exhibitions/seeing-is-deceiving/illusions',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 40, y: 230, width: 210, height: 100,
      labelX: 145, labelY: 280,
    },
    {
      id: 'sid-optical-toys', label: 'Optical Toys', path: '/exhibitions/seeing-is-deceiving/optical-toys',
      accentColor: COLORS.seeingIsDeceiving, parent: 'seeing-is-deceiving',
      x: 250, y: 230, width: 210, height: 100,
      labelX: 355, labelY: 280,
    },
  ],
};

export const SEEING_IS_DECEIVING: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Seeing is Deceiving',
  ...onFloorOf('seeing-is-deceiving'),
  ...withLessons(SID_FLOOR_PLAN, '0 0 500 380', 'seeing-is-deceiving'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Harlem Renaissance (Floor Plan)
//
// Layout: the Exhibition Hall with Resources beside it, the display case
// (Artifacts) beyond, and the three interactive rooms beyond that
// ┌───────────────────────┬────────────┐
// │    Exhibition Hall    ╎ Resources  │
// ├──────────╴ ╶──────────┴────────────┤
// │      Artifacts (Display Case)      │
// ├────╴ ╶─────┬────╴ ╶────┬────╴ ╶────┤
// │  Jazz Lab  ╎ Migration ╎ Harlem in │
// │            ╎    Map    ╎   Words   │
// └────────────┴───────────┴───────────┘
// ═══════════════════════════════════════════════════════════════════

const HR_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: {
    x: 40, y: 80, width: 420, height: 280, rx: 3,
  },
  accentColor: COLORS.harlemRenaissance,
  walls: [
    // Between the Exhibition Hall and Resources (with doorway)
    ...wallWithDoorway(340, 80, 340, 130),
    // Under the Exhibition Hall, into the case (with doorway); Resources is closed to it
    ...wallWithDoorway(40, 130, 340, 130, 20),
    { x1: 340, y1: 130, x2: 460, y2: 130 },

    // Under the case, a doorway into each room
    ...wallWithDoorway(40, 245, 180, 245),
    ...wallWithDoorway(180, 245, 320, 245),
    ...wallWithDoorway(320, 245, 460, 245),

    // Between the rooms
    ...wallWithDoorway(180, 245, 180, 360),
    ...wallWithDoorway(320, 245, 320, 360),
  ],
  rooms: [
    // Exhibition Hall entrance, and Resources beside it
    {
      id: 'hr-entrance', label: 'Exhibition Hall', path: '/exhibitions/harlem-renaissance',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 80, width: 300, height: 50,
      labelX: 190, labelY: 105,
    },
    {
      id: 'hr-resources', label: 'Resources', path: '/exhibitions/harlem-renaissance/resources',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 340, y: 80, width: 120, height: 50,
      labelX: 400, labelY: 105,
    },
    // The display case
    {
      id: 'hr-artifacts', label: 'Artifacts', path: '/exhibitions/harlem-renaissance/artifacts',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 130, width: 420, height: 115,
      labelX: 250, labelY: 188,
    },
    // The rooms beyond it
    {
      id: 'hr-jazz-lab', label: 'Jazz Lab', path: '/exhibitions/harlem-renaissance/jazz-lab',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 40, y: 245, width: 140, height: 115,
      labelX: 110, labelY: 302,
    },
    {
      id: 'hr-migration-map', label: 'Great Migration\nMap', path: '/exhibitions/harlem-renaissance/migration-map',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 180, y: 245, width: 140, height: 115,
      labelX: 250, labelY: 302,
    },
    {
      id: 'hr-harlem-in-words', label: 'Harlem in Words', path: '/exhibitions/harlem-renaissance/harlem-in-words',
      accentColor: COLORS.harlemRenaissance, parent: 'harlem-renaissance',
      x: 320, y: 245, width: 140, height: 115,
      labelX: 390, labelY: 302,
    },
  ],
};

export const HARLEM_RENAISSANCE: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Harlem Renaissance',
  ...onFloorOf('harlem-renaissance'),
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
  ...onFloorOf('in-their-hands'),
  ...withLessons(ITH_FLOOR_PLAN, '0 0 500 410', 'in-their-hands'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Fear Lab (Floor Plan)
//
// Layout: the Exhibition Hall, and the interactive room beyond it
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │        What Scares You?        │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const FEAR_LAB_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 200, rx: 3 },
  accentColor: COLORS.fearLab,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
  ],
  rooms: [
    {
      id: 'fl-entrance', label: 'Exhibition Hall', path: '/exhibitions/fear-lab',
      accentColor: COLORS.fearLab, parent: 'fear-lab',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'fl-what-scares-you', label: 'What Scares You?', path: '/exhibitions/fear-lab/what-scares-you',
      accentColor: COLORS.fearLab, parent: 'fear-lab',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
  ],
};

export const FEAR_LAB: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'The Fear Lab',
  ...onFloorOf('fear-lab'),
  ...withLessons(FEAR_LAB_FLOOR_PLAN, '0 0 500 330', 'fear-lab'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — The Great War (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the two
// interactive rooms beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────╴ ╶───────┬──────╴ ╶─────┤
// │ When the Guns…  ╎ The Memorial │
// └─────────────────┴──────────────┘
// ═══════════════════════════════════════════════════════════════════

const GREAT_WAR_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.greatWar,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 250, 280),
    ...wallWithDoorway(250, 280, 460, 280),
    ...wallWithDoorway(250, 280, 250, 380),
  ],
  rooms: [
    {
      id: 'gw-entrance', label: 'Exhibition Hall', path: '/exhibitions/great-war',
      accentColor: COLORS.greatWar, parent: 'great-war',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'gw-case', label: 'Display Case', path: '/exhibitions/great-war/artifacts/case',
      accentColor: COLORS.greatWar, parent: 'great-war',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'gw-silence', label: 'When the Guns Fell Silent', path: '/exhibitions/great-war/silence',
      accentColor: COLORS.greatWar, parent: 'great-war',
      x: 40, y: 280, width: 210, height: 100,
      labelX: 145, labelY: 330,
    },
    {
      id: 'gw-memorial', label: 'The Memorial', path: '/exhibitions/great-war/memorial',
      accentColor: COLORS.greatWar, parent: 'great-war',
      x: 250, y: 280, width: 210, height: 100,
      labelX: 355, labelY: 330,
    },
  ],
};

export const GREAT_WAR: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'The Great War',
  ...onFloorOf('great-war'),
  ...withLessons(GREAT_WAR_FLOOR_PLAN, '0 0 500 430', 'great-war'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Ancient Egypt (Floor Plan)
//
// Layout: the Exhibition Hall, and the display case beyond it
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const EGYPT_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 200, rx: 3 },
  accentColor: COLORS.egypt,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
  ],
  rooms: [
    {
      id: 'eg-entrance', label: 'Exhibition Hall', path: '/exhibitions/egypt',
      accentColor: COLORS.egypt, parent: 'egypt',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'eg-case', label: 'Display Case', path: '/exhibitions/egypt/artifacts/case',
      accentColor: COLORS.egypt, parent: 'egypt',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
  ],
};

export const EGYPT: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Ancient Egypt',
  ...onFloorOf('egypt'),
  ...withLessons(EGYPT_FLOOR_PLAN, '0 0 500 330', 'egypt'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Our Incredible Moon (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the
// interactive room beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────────────╴ ╶──────────────┤
// │      Under the Microscope      │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const MOON_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.moon,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 460, 280),
  ],
  rooms: [
    {
      id: 'mo-entrance', label: 'Exhibition Hall', path: '/exhibitions/moon',
      accentColor: COLORS.moon, parent: 'moon',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'mo-case', label: 'Display Case', path: '/exhibitions/moon/artifacts/case',
      accentColor: COLORS.moon, parent: 'moon',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'mo-microscope', label: 'Under the Microscope', path: '/exhibitions/moon/microscope',
      accentColor: COLORS.moon, parent: 'moon',
      x: 40, y: 280, width: 420, height: 100,
      labelX: 250, labelY: 330,
    },
  ],
};

export const MOON: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Our Incredible Moon',
  ...onFloorOf('moon'),
  ...withLessons(MOON_FLOOR_PLAN, '0 0 500 430', 'moon'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — America 250 (Floor Plan)
//
// Layout: the Exhibition Hall, and the signing room beyond it (there is no
// display case)
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │      Put Your Name to It       │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const AMERICA_250_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 200, rx: 3 },
  accentColor: COLORS.america250,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
  ],
  rooms: [
    {
      id: 'ap-entrance', label: 'Exhibition Hall', path: '/exhibitions/america-250',
      accentColor: COLORS.america250, parent: 'america-250',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'ap-sign', label: 'Put Your Name to It', path: '/exhibitions/america-250/sign',
      accentColor: COLORS.america250, parent: 'america-250',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
  ],
};

export const AMERICA_250: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'America 250',
  ...onFloorOf('america-250'),
  ...withLessons(AMERICA_250_FLOOR_PLAN, '0 0 500 330', 'america-250'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Victorian Britain (Floor Plan)
//
// Layout: the Exhibition Hall, the display case, and three interactive
// rooms beyond: the card maker, the inventions workshop and the parlour
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├──────╴ ╶──┬───╴ ╶───┬──╴ ╶─────┤
// │Card Maker │Inventions│ Parlour │
// └───────────┴──────────┴─────────┘
// ═══════════════════════════════════════════════════════════════════

const VICTORIAN_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.victorian,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    // Under the case, a doorway into each room
    ...wallWithDoorway(40, 280, 180, 280),
    ...wallWithDoorway(180, 280, 320, 280),
    ...wallWithDoorway(320, 280, 460, 280),
    ...wallWithDoorway(180, 280, 180, 380),
    ...wallWithDoorway(320, 280, 320, 380),
  ],
  rooms: [
    {
      id: 'vb-entrance', label: 'Exhibition Hall', path: '/exhibitions/victorian',
      accentColor: COLORS.victorian, parent: 'victorian',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'vb-case', label: 'Display Case', path: '/exhibitions/victorian/artifacts/case',
      accentColor: COLORS.victorian, parent: 'victorian',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'vb-christmas-card', label: 'Card Maker', path: '/exhibitions/victorian/christmas-card',
      accentColor: COLORS.victorian, parent: 'victorian',
      x: 40, y: 280, width: 140, height: 100,
      labelX: 110, labelY: 330,
    },
    {
      id: 'vb-inventions', label: 'Inventions', path: '/exhibitions/victorian/inventions',
      accentColor: COLORS.victorian, parent: 'victorian',
      x: 180, y: 280, width: 140, height: 100,
      labelX: 250, labelY: 330,
    },
    {
      id: 'vb-christmas-parlour', label: 'Parlour', path: '/exhibitions/victorian/christmas-parlour',
      accentColor: COLORS.victorian, parent: 'victorian',
      x: 320, y: 280, width: 140, height: 100,
      labelX: 390, labelY: 330,
    },
  ],
};

export const VICTORIAN: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Victorian Britain',
  ...onFloorOf('victorian'),
  ...withLessons(VICTORIAN_FLOOR_PLAN, '0 0 500 430', 'victorian'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Women's History Month (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the two
// interactive rooms beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────╴ ╶───────┬──────╴ ╶─────┤
// │  Violet’s Life  ╎ Who Gets…    │
// └─────────────────┴──────────────┘
// ═══════════════════════════════════════════════════════════════════

const WOMENS_HISTORY_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.womensHistory,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 250, 280),
    ...wallWithDoorway(250, 280, 460, 280),
    ...wallWithDoorway(250, 280, 250, 380),
  ],
  rooms: [
    {
      id: 'wh-entrance', label: 'Exhibition Hall', path: '/exhibitions/womens-history',
      accentColor: COLORS.womensHistory, parent: 'womens-history',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'wh-case', label: 'Display Case', path: '/exhibitions/womens-history/artifacts/case',
      accentColor: COLORS.womensHistory, parent: 'womens-history',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'wh-violet', label: 'Violet’s Life', path: '/exhibitions/womens-history/violet',
      accentColor: COLORS.womensHistory, parent: 'womens-history',
      x: 40, y: 280, width: 210, height: 100,
      labelX: 145, labelY: 330,
    },
    {
      id: 'wh-remembered', label: 'Who Gets\nRemembered?', path: '/exhibitions/womens-history/remembered',
      accentColor: COLORS.womensHistory, parent: 'womens-history',
      x: 250, y: 280, width: 210, height: 100,
      labelX: 355, labelY: 330,
    },
  ],
};

export const WOMENS_HISTORY: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: "Women's History Month",
  ...onFloorOf('womens-history'),
  ...withLessons(WOMENS_HISTORY_FLOOR_PLAN, '0 0 500 430', 'womens-history'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Holocaust Memorial Day (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the
// interactive room beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────────────╴ ╶──────────────┤
// │          Lay a Stone           │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const HOLOCAUST_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.holocaust,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 460, 280),
  ],
  rooms: [
    {
      id: 'ho-entrance', label: 'Exhibition Hall', path: '/exhibitions/holocaust',
      accentColor: COLORS.holocaust, parent: 'holocaust',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'ho-case', label: 'Display Case', path: '/exhibitions/holocaust/artifacts/case',
      accentColor: COLORS.holocaust, parent: 'holocaust',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'ho-stones', label: 'Lay a Stone', path: '/exhibitions/holocaust/stones',
      accentColor: COLORS.holocaust, parent: 'holocaust',
      x: 40, y: 280, width: 420, height: 100,
      labelX: 250, labelY: 330,
    },
  ],
};

export const HOLOCAUST: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Holocaust Memorial Day',
  ...onFloorOf('holocaust'),
  ...withLessons(HOLOCAUST_FLOOR_PLAN, '0 0 500 430', 'holocaust'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — Black History Month (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the two
// interactive rooms beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────╴ ╶───────┬──────╴ ╶─────┤
// │ The Black Barbie╎ Who Do You   │
// │    Timeline     ╎    See?      │
// └─────────────────┴──────────────┘
// ═══════════════════════════════════════════════════════════════════

const BLACK_HISTORY_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.blackHistory,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 250, 280),
    ...wallWithDoorway(250, 280, 460, 280),
    ...wallWithDoorway(250, 280, 250, 380),
  ],
  rooms: [
    {
      id: 'bh-entrance', label: 'Exhibition Hall', path: '/exhibitions/black-history',
      accentColor: COLORS.blackHistory, parent: 'black-history',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'bh-case', label: 'Display Case', path: '/exhibitions/black-history/artifacts/case',
      accentColor: COLORS.blackHistory, parent: 'black-history',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'bh-timeline', label: 'The Black Barbie Timeline', path: '/exhibitions/black-history/timeline',
      accentColor: COLORS.blackHistory, parent: 'black-history',
      x: 40, y: 280, width: 210, height: 100,
      labelX: 145, labelY: 330,
    },
    {
      id: 'bh-representation', label: 'Who Do You See?', path: '/exhibitions/black-history/representation',
      accentColor: COLORS.blackHistory, parent: 'black-history',
      x: 250, y: 280, width: 210, height: 100,
      labelX: 355, labelY: 330,
    },
  ],
};

export const BLACK_HISTORY: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'Black History Month',
  ...onFloorOf('black-history'),
  ...withLessons(BLACK_HISTORY_FLOOR_PLAN, '0 0 500 430', 'black-history'),
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL 3 — The Writing Revolution (Floor Plan)
//
// Layout: the Exhibition Hall, the display case beyond it, and the
// interactive room beyond that
// ┌────────────────────────────────┐
// │        Exhibition Hall         │
// ├───────────────╴ ╶──────────────┤
// │          Display Case          │
// ├───────────────╴ ╶──────────────┤
// │       The Typing Station       │
// └────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

const WRITING_REVOLUTION_FLOOR_PLAN: ExhibitionFloorPlan = {
  outline: { x: 40, y: 80, width: 420, height: 300, rx: 3 },
  accentColor: COLORS.writingRevolution,
  walls: [
    ...wallWithDoorway(40, 180, 460, 180),
    ...wallWithDoorway(40, 280, 460, 280),
  ],
  rooms: [
    {
      id: 'wr-entrance', label: 'Exhibition Hall', path: '/exhibitions/writing-revolution',
      accentColor: COLORS.writingRevolution, parent: 'writing-revolution',
      x: 40, y: 80, width: 420, height: 100,
      labelX: 250, labelY: 130,
    },
    {
      id: 'wr-case', label: 'Display Case', path: '/exhibitions/writing-revolution/artifacts/case',
      accentColor: COLORS.writingRevolution, parent: 'writing-revolution',
      x: 40, y: 180, width: 420, height: 100,
      labelX: 250, labelY: 230,
    },
    {
      id: 'wr-typing', label: 'The Typing Station', path: '/exhibitions/writing-revolution/typing-station',
      accentColor: COLORS.writingRevolution, parent: 'writing-revolution',
      x: 40, y: 280, width: 420, height: 100,
      labelX: 250, labelY: 330,
    },
  ],
};

export const WRITING_REVOLUTION: MapLevelConfig = {
  level: 'exhibition',
  rooms: [],
  connections: [],
  title: 'The Writing Revolution',
  ...onFloorOf('writing-revolution'),
  ...withLessons(WRITING_REVOLUTION_FLOOR_PLAN, '0 0 500 430', 'writing-revolution'),
};

// ═══════════════════════════════════════════════════════════════════
// Level resolver
// ═══════════════════════════════════════════════════════════════════

export function getLevelConfig(pathname: string): MapLevelConfig {
  if (pathname.startsWith('/exhibitions/seeing-is-deceiving')) return SEEING_IS_DECEIVING;
  if (pathname.startsWith('/exhibitions/harlem-renaissance')) return HARLEM_RENAISSANCE;
  if (pathname.startsWith('/exhibitions/in-their-hands')) return IN_THEIR_HANDS;
  if (pathname.startsWith('/exhibitions/fear-lab')) return FEAR_LAB;
  if (pathname.startsWith('/exhibitions/great-war')) return GREAT_WAR;
  if (pathname.startsWith('/exhibitions/egypt')) return EGYPT;
  if (pathname.startsWith('/exhibitions/moon')) return MOON;
  if (pathname.startsWith('/exhibitions/america-250')) return AMERICA_250;
  if (pathname.startsWith('/exhibitions/victorian')) return VICTORIAN;
  if (pathname.startsWith('/exhibitions/womens-history')) return WOMENS_HISTORY;
  if (pathname.startsWith('/exhibitions/holocaust')) return HOLOCAUST;
  if (pathname.startsWith('/exhibitions/black-history')) return BLACK_HISTORY;
  if (pathname.startsWith('/exhibitions/writing-revolution')) return WRITING_REVOLUTION;
  if (pathname === STUDIO_PAGE.path) return STUDIO;
  if (pathname === SECOND_FLOOR_PAGE.path) return SECOND_FLOOR;
  if (pathname === FIRST_FLOOR_PAGE.path) return FIRST_FLOOR;
  if (pathname === GROUND_FLOOR_PAGE.path) return GROUND_FLOOR;
  return MUSEUM_OVERVIEW;
}
