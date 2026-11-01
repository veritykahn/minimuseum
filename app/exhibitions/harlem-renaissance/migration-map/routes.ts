import { project } from './usMap';

/*
 * The lines drawn on the Great Migration map, each through real places
 * (latitude, longitude), placed by the map's own projection (usMap.ts).
 *
 * REVIEW (Verity): the routes below are new. Sources:
 *   - The music's road (the journey's six stops, south to north, then east):
 *     jazz came up from New Orleans; "Many of the musicians had arrived [in
 *     Chicago] from New Orleans, St. Louis, and other points south" (National
 *     Park Service, "Chicago's Black Metropolis", Teaching with Historic
 *     Places). The stops are joined along the Mississippi as far as St. Louis
 *     (the riverboats, as the St. Louis panel says), then by rail to Chicago
 *     and on to New York (Louis Armstrong, 1924, as the Harlem panel says).
 *   - Up the middle of the country: the Illinois Central Railroad, "the
 *     primary way that African Americans left Mississippi for Chicago"
 *     (Mississippi Encyclopedia, "Railroads"), its network "from New Orleans
 *     to Chicago", with its Yazoo & Mississippi Valley track across the Delta
 *     (Mississippi Blues Trail, "Mississippi to Chicago"). Drawn from the
 *     Delta through Memphis, then north along the Illinois Central's main
 *     line (Fulton, Cairo, Carbondale, Centralia, Champaign, Kankakee) to
 *     Chicago's Central Station.
 *   - Up the Atlantic coast: trains from Georgia, the Carolinas and Virginia
 *     up the East Coast, stopping in Philadelphia and New York (National Park
 *     Service, "From the Great Migration to Boston's Charlestown Navy Yard").
 *     Drawn from Jacksonville through Savannah, the Carolinas, Richmond,
 *     Washington, Baltimore and Philadelphia to New York.
 */

export type LonLat = readonly [lon: number, lat: number];

/** The journey's stops, where each dot sits: a town, or (for the Delta) the middle of the Delta, near Cleveland, Mississippi. */
export const STOP_AT = {
  'new-orleans': [-90.07, 29.95],
  delta: [-90.6, 33.8],
  memphis: [-90.05, 35.15],
  'st-louis': [-90.2, 38.63],
  chicago: [-87.63, 41.88],
  harlem: [-73.94, 40.81],
} as const satisfies Record<string, LonLat>;

/** The music's road: up the Mississippi from New Orleans through the Delta and Memphis to St. Louis, by rail to Chicago, and east to New York. */
export const MUSIC_ROAD: readonly LonLat[] = [
  STOP_AT['new-orleans'],
  [-91.19, 30.45], // Baton Rouge
  [-91.4, 31.56], // Natchez
  [-90.88, 32.35], // Vicksburg
  STOP_AT.delta,
  STOP_AT.memphis,
  [-89.53, 36.59], // New Madrid
  [-89.18, 37.0], // Cairo
  [-89.52, 37.31], // Cape Girardeau
  STOP_AT['st-louis'],
  [-89.65, 39.8], // Springfield, Illinois
  [-88.99, 40.48], // Bloomington
  STOP_AT.chicago,
  [-86.25, 41.68], // South Bend
  [-83.55, 41.65], // Toledo
  [-81.69, 41.5], // Cleveland
  [-79.0, 41.4], // across Pennsylvania
  [-76.0, 41.1],
  STOP_AT.harlem,
];

/** The Illinois Central, from the Delta through Memphis to Chicago. */
export const ILLINOIS_CENTRAL: readonly LonLat[] = [
  STOP_AT.delta,
  STOP_AT.memphis,
  [-89.26, 36.11], // Newbern, Tennessee
  [-88.88, 36.5], // Fulton, Kentucky
  [-89.18, 37.0], // Cairo
  [-89.22, 37.73], // Carbondale
  [-89.13, 38.52], // Centralia
  [-88.54, 39.12], // Effingham
  [-88.24, 40.12], // Champaign
  [-87.86, 41.12], // Kankakee
  STOP_AT.chicago,
];

/** The seaboard lines, from Florida up the coast to New York. */
export const ATLANTIC_COAST: readonly LonLat[] = [
  [-81.66, 30.33], // Jacksonville, Florida
  [-81.09, 32.08], // Savannah, Georgia
  [-79.76, 34.2], // Florence, South Carolina
  [-77.79, 35.94], // Rocky Mount, North Carolina
  [-77.44, 37.54], // Richmond, Virginia
  [-77.04, 38.9], // Washington
  [-76.61, 39.29], // Baltimore
  [-75.17, 39.95], // Philadelphia
  STOP_AT.harlem,
];

/** The people's places named along the coast line: each state (or city) at a town on the line. */
export const COAST_PLACES: readonly { name: string; at: LonLat }[] = [
  { name: 'Florida', at: ATLANTIC_COAST[0] },
  { name: 'Georgia', at: ATLANTIC_COAST[1] },
  { name: 'The Carolinas', at: [-78.8, 35.05] },
  { name: 'Virginia', at: ATLANTIC_COAST[4] },
  { name: 'Washington', at: ATLANTIC_COAST[5] },
  { name: 'Philadelphia', at: ATLANTIC_COAST[7] },
];

export const at = ([lon, lat]: LonLat) => project(lon, lat);

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * A smooth line through every point (a Catmull–Rom curve, as cubic Béziers),
 * so the route bends gently but still passes exactly through each stop.
 */
export function smoothPath(points: readonly LonLat[]): string {
  const p = points.map(at);
  if (p.length < 2) return '';
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${r1(c1.x)},${r1(c1.y)} ${r1(c2.x)},${r1(c2.y)} ${p2.x},${p2.y}`;
  }
  return d;
}

export const MUSIC_PATH = smoothPath(MUSIC_ROAD);
export const CENTRAL_PATH = smoothPath(ILLINOIS_CENTRAL);
export const EAST_COAST_PATH = smoothPath(ATLANTIC_COAST);
