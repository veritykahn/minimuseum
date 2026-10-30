/**
 * "Place the coin": before each stop's story opens, the student puts its coin
 * where it belongs on the ribbon. The ribbon's places are the dated windows
 * the stops already carry (timeline-data.ts `when`); stops whose windows
 * coincide or sit a year apart share one place, so every place is a fair,
 * readable target. A test checks that each place spans exactly its stops.
 */
import { AD, BC, toAstronomical, type Year } from './chronology';
import { timelineStops } from './timeline-data';

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
