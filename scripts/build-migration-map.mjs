#!/usr/bin/env node
/*
 * Builds the Great Migration map's outline of the eastern United States
 * (app/exhibitions/harlem-renaissance/migration-map/usMap.ts) from two
 * public-domain sources:
 *
 *   - the U.S. Census Bureau's cartographic boundary files (2017), as
 *     redistributed in TopoJSON by us-atlas: states-10m.json
 *     https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json
 *   - Natural Earth's 1:50m rivers (public domain), for the Mississippi and
 *     the Ohio: ne_50m_rivers_lake_centerlines.geojson
 *     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson
 *
 * Usage: node scripts/build-migration-map.mjs <states-10m.json> <rivers.geojson>
 *
 * The projection is an Albers equal-area conic (standard parallels 29.5°N
 * and 45.5°N, centred on 84°W), fitted to the map's 700 × 620 viewBox. The
 * same formula, with the constants this script writes, is usMap.ts's
 * project(), so the stops (placed by latitude and longitude) land where
 * they really are on the drawn states.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const [statesPath, riversPath] = process.argv.slice(2);
if (!statesPath || !riversPath) {
  console.error('Usage: node scripts/build-migration-map.mjs <states-10m.json> <rivers.geojson>');
  process.exit(1);
}

const W = 700;
const H = 620;
const PAD = 8;
/** The part of the country the map shows: Louisiana and Florida up to the Great Lakes and New York. */
const WINDOW = { west: -95, east: -69.8, south: 24.8, north: 45.6 };

const rad = Math.PI / 180;
const P1 = 29.5 * rad;
const P2 = 45.5 * rad;
const LAT0 = 23 * rad;
const LON0 = -84 * rad;
const N = (Math.sin(P1) + Math.sin(P2)) / 2;
const C = Math.cos(P1) ** 2 + 2 * N * Math.sin(P1);
const RHO0 = Math.sqrt(C - 2 * N * Math.sin(LAT0)) / N;
const albers = (lon, lat) => {
  const rho = Math.sqrt(C - 2 * N * Math.sin(lat * rad)) / N;
  const theta = N * (lon * rad - LON0);
  return [rho * Math.sin(theta), -(RHO0 - rho * Math.cos(theta))];
};

// Fit the window's edges into the viewBox.
const edge = [];
for (let i = 0; i <= 40; i++) {
  const t = i / 40;
  const lon = WINDOW.west + (WINDOW.east - WINDOW.west) * t;
  const lat = WINDOW.south + (WINDOW.north - WINDOW.south) * t;
  edge.push(albers(lon, WINDOW.south), albers(lon, WINDOW.north), albers(WINDOW.west, lat), albers(WINDOW.east, lat));
}
const minX = Math.min(...edge.map((p) => p[0]));
const maxX = Math.max(...edge.map((p) => p[0]));
const minY = Math.min(...edge.map((p) => p[1]));
const maxY = Math.max(...edge.map((p) => p[1]));
const SCALE = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
const TX = (W - (maxX - minX) * SCALE) / 2 - minX * SCALE;
const TY = (H - (maxY - minY) * SCALE) / 2 - minY * SCALE;
const project = (lon, lat) => {
  const [x, y] = albers(lon, lat);
  return [x * SCALE + TX, y * SCALE + TY];
};

/** Douglas–Peucker, to about half a pixel. */
function simplify(pts, tol = 0.45) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const len = Math.hypot(bx - ax, by - ay);
    let worst = -1;
    let at = -1;
    for (let i = a + 1; i < b; i++) {
      // A closed ring starts and ends on one point: there, measure from that point.
      const d = len ? Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
      if (d > worst) (worst = d), (at = i);
    }
    if (worst > tol) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const r1 = (n) => Math.round(n * 10) / 10;
const inView = (pts) => pts.some(([x, y]) => x > -40 && x < W + 40 && y > -40 && y < H + 40);
const ring = (pts, close) => {
  const s = simplify(pts);
  if (s.length < (close ? 3 : 2)) return '';
  return s.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join('') + (close ? 'Z' : '');
};

/* ── The states ── */
const topo = JSON.parse(readFileSync(statesPath, 'utf8'));
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return project(x * scale[0] + translate[0], y * scale[1] + translate[1]);
  });
});
const ringOf = (ids) => {
  const out = [];
  ids.forEach((id, k) => {
    const a = id < 0 ? [...arcs[~id]].reverse() : arcs[id];
    out.push(...(k ? a.slice(1) : a));
  });
  return out;
};
const states = [];
for (const g of topo.objects.states.geometries) {
  const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  const rings = polys.flat().map(ringOf).filter(inView);
  if (!rings.length) continue;
  const d = rings.map((r) => ring(r, true)).join('');
  if (d) states.push({ name: g.properties.name, d });
}
states.sort((a, b) => a.name.localeCompare(b.name));

/* ── The Mississippi and the Ohio ── */
const rivers = JSON.parse(readFileSync(riversPath, 'utf8'));
const riverPaths = {};
for (const f of rivers.features) {
  const name = f.properties.name;
  if (name !== 'Mississippi' && name !== 'Ohio') continue;
  const lines = f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates];
  for (const line of lines) {
    const pts = line.map(([lon, lat]) => project(lon, lat)).filter(([x, y]) => x > -20 && x < W + 20 && y > -20 && y < H + 20);
    const d = ring(pts, false);
    if (d) riverPaths[name] = (riverPaths[name] ?? '') + d;
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'app/exhibitions/harlem-renaissance/migration-map/usMap.ts');
const ts = `/*
 * GENERATED by scripts/build-migration-map.mjs: don't edit by hand.
 *
 * The eastern United States for the Great Migration map: each state's
 * outline from the U.S. Census Bureau's cartographic boundary files (2017,
 * public domain, via us-atlas), and the Mississippi and Ohio rivers from
 * Natural Earth (public domain), in an Albers equal-area projection fitted
 * to a ${W} × ${H} viewBox. project() places a latitude and longitude on it.
 */

export const MAP_W = ${W};
export const MAP_H = ${H};

const RAD = Math.PI / 180;
const N = ${N};
const C = ${C};
const RHO0 = ${RHO0};
const LON0 = ${LON0};
const SCALE = ${SCALE};
const TX = ${TX};
const TY = ${TY};

/** Where a longitude and latitude (degrees) fall on the map, in viewBox units, to a tenth. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const rho = Math.sqrt(C - 2 * N * Math.sin(lat * RAD)) / N;
  const theta = N * (lon * RAD - LON0);
  const x = rho * Math.sin(theta) * SCALE + TX;
  const y = -(RHO0 - rho * Math.cos(theta)) * SCALE + TY;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/** Each state in (or partly in) the map's window, by name. */
export const STATES: readonly { name: string; d: string }[] = ${JSON.stringify(states, null, 0).replace(/\},\{/g, '},\n  {').replace(/^\[/, '[\n  ').replace(/\]$/, ',\n]')};

/** The Mississippi and the Ohio, as lines. */
export const RIVERS = ${JSON.stringify(riverPaths, null, 2)} as const;
`;
writeFileSync(out, ts);
console.log(`Wrote ${out}: ${states.length} states, ${(ts.length / 1024).toFixed(1)} KB`);
