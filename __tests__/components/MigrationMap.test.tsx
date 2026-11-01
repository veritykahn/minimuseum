import { fireEvent, render, screen, within } from '@testing-library/react';
import MigrationMapPage from '@/app/exhibitions/harlem-renaissance/migration-map/page';
import { CITIES } from '@/app/exhibitions/harlem-renaissance/migration-map/cities';
import { ATLANTIC_COAST, ILLINOIS_CENTRAL, MUSIC_PATH, MUSIC_ROAD, STOP_AT, at, smoothPath } from '@/app/exhibitions/harlem-renaissance/migration-map/routes';
import { MIGRATION_SOURCES } from '@/app/exhibitions/harlem-renaissance/migration-map/sources';
import { TICKET_QUESTIONS } from '@/app/exhibitions/harlem-renaissance/migration-map/ticket';
import { MAP_H, MAP_W, STATES, project } from '@/app/exhibitions/harlem-renaissance/migration-map/usMap';

/*
 * The Great Migration map: a real map of the states behind the route, every
 * stop at its real place, the journey only ever going north and then east,
 * and every source and photograph credit in the Sources drawer.
 */

/** A state's outline as rings of points, from its path. */
const rings = (d: string) =>
  d
    .split('M')
    .filter(Boolean)
    .map((r) => r.replace(/Z/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number) as [number, number]));
const inside = ([x, y]: [number, number], d: string) => {
  let hit = false;
  for (const ring of rings(d)) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
};
const state = (name: string) => STATES.find((s) => s.name === name)!.d;
const box = (d: string) => {
  const pts = rings(d).flat();
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
};
const within_ = ({ x, y }: { x: number; y: number }, b: ReturnType<typeof box>) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;

describe('the map', () => {
  it('draws the states from the Census Bureau outlines, the eastern half of the country', () => {
    const names = STATES.map((s) => s.name);
    for (const n of ['Louisiana', 'Mississippi', 'Tennessee', 'Missouri', 'Illinois', 'New York', 'Florida', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia', 'Pennsylvania']) {
      expect(names).toContain(n);
    }
    for (const s of STATES) expect(s.d).toMatch(/^M[\d.-]+ [\d.-]+L/);
  });

  it('places a latitude and longitude where it really is: New Orleans in Louisiana, the Delta in Mississippi', () => {
    expect(inside([at(STOP_AT['new-orleans']).x, at(STOP_AT['new-orleans']).y], state('Louisiana'))).toBe(true);
    expect(inside([at(STOP_AT.delta).x, at(STOP_AT.delta).y], state('Mississippi'))).toBe(true);
    expect(inside([at(STOP_AT.delta).x, at(STOP_AT.delta).y], state('Arkansas'))).toBe(false);
    // The rest within their states' bounds (they sit on a river or a shore).
    expect(within_(at(STOP_AT.memphis), box(state('Tennessee')))).toBe(true);
    expect(within_(at(STOP_AT['st-louis']), box(state('Missouri')))).toBe(true);
    expect(within_(at(STOP_AT.chicago), box(state('Illinois')))).toBe(true);
    expect(within_(at(STOP_AT.harlem), box(state('New York')))).toBe(true);
    // And every stop is on the map.
    for (const c of CITIES) {
      expect(c.cx).toBeGreaterThan(0);
      expect(c.cx).toBeLessThan(MAP_W);
      expect(c.cy).toBeGreaterThan(0);
      expect(c.cy).toBeLessThan(MAP_H);
    }
  });
});

describe('the journey', () => {
  it('starts in New Orleans and only goes north, up the Mississippi to Chicago, then east to Harlem', () => {
    expect(CITIES.map((c) => c.id)).toEqual(['new-orleans', 'delta', 'memphis', 'st-louis', 'chicago', 'harlem']);
    const lats = CITIES.map((c) => STOP_AT[c.id as keyof typeof STOP_AT][1]);
    // North all the way to Chicago (no going south again)…
    for (let i = 1; i < 5; i++) expect(lats[i]).toBeGreaterThan(lats[i - 1]);
    // …and the map agrees: each stop higher on the map than the one before.
    for (let i = 1; i < 5; i++) expect(CITIES[i].cy).toBeLessThan(CITIES[i - 1].cy);
    // Then east to Harlem.
    expect(CITIES[5].cx).toBeGreaterThan(CITIES[4].cx + 150);
  });

  it('draws the route through every stop, at its place', () => {
    for (const c of CITIES) expect(MUSIC_PATH).toContain(`${c.cx},${c.cy}`);
    expect(MUSIC_ROAD[0]).toEqual(STOP_AT['new-orleans']);
    expect(MUSIC_ROAD.at(-1)).toEqual(STOP_AT.harlem);
    // A smooth line: one curve per stretch.
    expect(smoothPath(MUSIC_ROAD).match(/C/g)).toHaveLength(MUSIC_ROAD.length - 1);
  });

  it('runs the Illinois Central from the Delta through Memphis to Chicago, and the coast line from Florida to New York', () => {
    expect(ILLINOIS_CENTRAL[0]).toEqual(STOP_AT.delta);
    expect(ILLINOIS_CENTRAL[1]).toEqual(STOP_AT.memphis);
    expect(ILLINOIS_CENTRAL.at(-1)).toEqual(STOP_AT.chicago);
    // Northward the whole way.
    for (let i = 1; i < ILLINOIS_CENTRAL.length; i++) expect(ILLINOIS_CENTRAL[i][1]).toBeGreaterThan(ILLINOIS_CENTRAL[i - 1][1]);
    expect(inside([project(...ATLANTIC_COAST[0]).x, project(...ATLANTIC_COAST[0]).y], state('Florida'))).toBe(true);
    expect(ATLANTIC_COAST.at(-1)).toEqual(STOP_AT.harlem);
  });

  it('keeps the ticket in the journey’s order', () => {
    expect(TICKET_QUESTIONS.map((q) => q.cityId)).toEqual(CITIES.map((c) => c.id));
  });
});

describe('the page', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/harlem-renaissance/migration-map'));

  it('draws the map behind the route, and begins in New Orleans', () => {
    const { container } = render(<MigrationMapPage />);
    expect(container.querySelectorAll('.mg-state').length).toBe(STATES.length);
    expect(container.querySelector('[data-river="Mississippi"]')).not.toBeNull();
    expect(screen.getByText('Gulf of Mexico')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Begin in New Orleans/ })).toBeInTheDocument();
    // The stops' names on the map.
    for (const name of ['Memphis', 'St. Louis', 'Chicago', 'Harlem']) expect(within(container.querySelector('svg') as unknown as HTMLElement).getByText(name)).toBeInTheDocument();
  });

  it('shows how the people moved: the coast line and the Illinois Central, each place named', () => {
    const { container } = render(<MigrationMapPage />);
    fireEvent.click(screen.getByRole('button', { name: 'How the people moved' }));
    expect(container.querySelectorAll('.mg-people-route')).toHaveLength(2);
    for (const name of ['Florida', 'Georgia', 'The Carolinas', 'Virginia', 'Washington', 'Philadelphia']) {
      expect(within(container.querySelector('svg') as unknown as HTMLElement).getByText(name)).toBeInTheDocument();
    }
  });

  it('keeps photo credits off the page and puts every source and credit in the Sources drawer', () => {
    render(<MigrationMapPage />);
    for (const c of CITIES) if (c.photoCredit) expect(c.photoCaption).not.toContain('Collection,');
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources' });
    expect(within(drawer).getByRole('heading', { name: 'The map' })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /U.S. Census Bureau/ })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /Mississippi Encyclopedia, “Railroads”/ })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /Charlestown Navy Yard/ })).toBeInTheDocument();
    // Each photograph's credit, under its stop, complete.
    expect(within(drawer).getByRole('heading', { name: 'Stop 1: New Orleans' })).toBeInTheDocument();
    expect(within(drawer).getByText(/The Historic New Orleans Collection, acquisition made possible by the Clarisse Claiborne Grima Fund\./)).toBeInTheDocument();
    expect(within(drawer).getByText(/Library of Congress Prints and Photographs Division/)).toBeInTheDocument();
    expect(within(drawer).getByText(/Photograph by Daguerre Studio/)).toBeInTheDocument();
    expect(MIGRATION_SOURCES.filter((g) => g.title.startsWith('Stop')).map((g) => g.title)).toEqual(CITIES.map((c, i) => `Stop ${i + 1}: ${c.name}`));
  });
});
