import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/site';
import { MUSEUM_ROOMS } from '@/components/museum-map/data/rooms';
import { getLevelConfig } from '@/components/museum-map/data/levels';

/*
 * Every page under app/exhibitions is in the sitemap and on the museum map,
 * so a new room cannot land without a way to find it. Dynamic routes
 * ([slug], [artifact]) are listed from their data, not their folders, and are
 * left out here.
 */

const EXHIBITIONS = join(__dirname, '..', '..', 'app', 'exhibitions');

/** '/exhibitions/egypt/tomb' for every app/exhibitions/**\/page.tsx without a [dynamic] segment. */
function staticRoutes(dir = EXHIBITIONS): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name.startsWith('[') || name.startsWith('(') || name.startsWith('_')) continue;
      out.push(...staticRoutes(full));
    } else if (name === 'page.tsx') {
      const rel = relative(EXHIBITIONS, dir).split(sep).filter(Boolean).join('/');
      out.push(rel ? `/exhibitions/${rel}` : '/exhibitions');
    }
  }
  return out.sort();
}

const ROUTES = staticRoutes();

/** Routes left out of the sitemap on purpose, each with its reason. */
const SITEMAP_EXCLUSIONS: Record<string, string> = {};

/**
 * A page with no room of its own on the map: one artifact inside a case or
 * an artifacts room (a coin, the phonograph), which the map lights as that
 * room. Matched as `<room path>/<one segment>`.
 */
const ARTIFACT_ROOMS = MUSEUM_ROOMS.map((r) => r.path).filter((p) => /\/artifacts(\/|$)/.test(p));
const isArtifactPage = (route: string) => ARTIFACT_ROOMS.includes(route.slice(0, route.lastIndexOf('/')));

describe('the exhibition routes', () => {
  it('finds the routes it walks', () => {
    expect(ROUTES).toEqual(expect.arrayContaining(['/exhibitions/egypt/tomb', '/exhibitions/moon/microscope']));
    expect(ROUTES.some((r) => r.includes('['))).toBe(false);
  });

  it('lists every one in the sitemap, apart from the named exclusions', () => {
    const urls = new Set(sitemap().map((e) => e.url.replace(SITE_URL, '')));
    const missing = ROUTES.filter((r) => !SITEMAP_EXCLUSIONS[r] && !urls.has(r));
    expect(missing).toEqual([]);
  });

  it('keeps each exclusion to a route that exists', () => {
    for (const r of Object.keys(SITEMAP_EXCLUSIONS)) expect(ROUTES).toContain(r);
  });

  it('puts every room on the museum map, and in its exhibition’s floor plan', () => {
    const mapPaths = new Set(MUSEUM_ROOMS.map((r) => r.path));
    const rooms = ROUTES.filter((r) => !isArtifactPage(r));
    expect(rooms.filter((r) => !mapPaths.has(r))).toEqual([]);

    // A room inside an exhibition is in that exhibition's floor plan too.
    for (const room of MUSEUM_ROOMS) {
      const exhibition = MUSEUM_ROOMS.find((r) => r.id === room.parent);
      if (!exhibition || !exhibition.path.startsWith('/exhibitions/') || exhibition.path.endsWith('-floor')) continue;
      const plan = getLevelConfig(room.path).floorPlan;
      expect({ room: room.path, inPlan: !!plan?.rooms.some((r) => r.path === room.path) }).toEqual({ room: room.path, inPlan: true });
      expect(exhibition.children).toContain(room.id);
    }
  });
});
