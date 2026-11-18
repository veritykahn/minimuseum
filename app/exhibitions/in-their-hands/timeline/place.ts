/**
 * "Place the Coin", the game that opens the Gospel Timeline: the coins come
 * out of the purse in a muddled order, and the student puts each one in its
 * place on the timeline from the clues on it (clues.ts). The timeline's
 * places are the dated windows the stops already carry (timeline-data.ts
 * `when`); stops whose windows coincide or sit a year apart share one place,
 * so every place is a fair, readable target. A test checks that each place
 * spans exactly its stops.
 */
import { mulberry32, shuffle } from '@/components/games/scoring';
import { AD, BC, toAstronomical, type Year } from './chronology';
import { timelineStops, type TimelineStop } from './timeline-data';

export type PlaceZone = {
  id: string;
  label: string;
  from: Year;
  to?: Year;
  /** Stop ids (1-based, as in timeline-data) that belong here. */
  stops: readonly number[];
};

export const PLACE_ZONES: readonly PlaceZone[] = [
  { id: 'z-5bc', label: 'c. 5–4 BC', from: BC(5), to: BC(4), stops: [1, 2] },
  { id: 'z-28', label: 'c. 28–29 AD', from: AD(28), to: AD(29), stops: [3] },
  { id: 'z-30', label: 'c. 30–33 AD', from: AD(30), to: AD(33), stops: [4, 5, 6, 7, 8] },
  { id: 'z-44', label: 'c. 44 AD', from: AD(44), stops: [9] },
  { id: 'z-49', label: 'c. 49 AD', from: AD(49), stops: [10] },
  { id: 'z-59', label: 'c. 59–60 AD', from: AD(59), to: AD(60), stops: [11] },
];

export function zoneForStop(stopId: number): PlaceZone {
  const z = PLACE_ZONES.find((p) => p.stops.includes(stopId));
  if (!z) throw new Error(`No place on the ribbon for stop ${stopId}`);
  return z;
}

export function isRightPlace(stopId: number, zoneId: string): boolean {
  return zoneForStop(stopId).id === zoneId;
}

/** The earliest and latest years a zone's stops cover (for the test). */
export function stopsSpan(stopIds: readonly number[]): { from: number; to: number } {
  const stops = timelineStops.filter((s) => stopIds.includes(s.id));
  const froms = stops.map((s) => toAstronomical(s.when.from));
  const tos = stops.map((s) => toAstronomical(s.when.to ?? s.when.from));
  return { from: Math.min(...froms), to: Math.max(...tos) };
}

export type PlaceVerdict = 'right' | 'too-early' | 'too-late';

/** Right, or which way the coin's story lies from the place tried. */
export function placeVerdict(stopId: number, zoneId: string): PlaceVerdict {
  const want = PLACE_ZONES.indexOf(zoneForStop(stopId));
  const got = PLACE_ZONES.findIndex((z) => z.id === zoneId);
  if (got === want) return 'right';
  return got < want ? 'too-early' : 'too-late';
}

/** The two parts of the timeline: the Gospels' stories, then Acts'. */
export type Era = 'gospels' | 'acts';
export const ERAS: Record<Era, { label: string; book: string }> = {
  gospels: { label: 'The life of Jesus', book: 'A Gospel: the life of Jesus' },
  acts: { label: 'After Jesus: the early Church', book: 'Acts: after Jesus, the early Church' },
};
export const eraOf = (stop: Pick<TimelineStop, 'reference'>): Era => (stop.reference.startsWith('Acts') ? 'acts' : 'gospels');
/** Where the Gospels give way to Acts on the timeline: after the last Passion place (c. 30–33 AD). */
export const ERA_TURN: Year = AD(33);

/**
 * The order the coins come out of the purse: shuffled from a seed, and never
 * the story order, so the next coin is never just "the next one along".
 */
export function coinOrder(seed: number, stops: readonly TimelineStop[] = timelineStops): TimelineStop[] {
  const rng = mulberry32(seed);
  for (let i = 0; i < 8; i++) {
    const order = shuffle(stops, rng);
    if (order.some((s, j) => s.id !== stops[j].id)) return order;
  }
  return [...stops].reverse();
}
