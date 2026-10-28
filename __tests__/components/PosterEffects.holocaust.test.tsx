import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { atmosphereName, entranceOf } from '@/components/exhibition/helpers';
import type { ExhibitionConfig, PosterConfig } from '@/components/exhibition/types';
import { HOLOCAUST } from '@/app/exhibitions/holocaust/holocaust';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';

/*
 * Holocaust Memorial Day in the walkthrough's vocabulary, held to the same
 * rules as the two exhibitions that model it (PosterEffects.test.tsx): every
 * panel arrives its own way, no two in a row alike and none dominating; each
 * section stands in an atmosphere of the exhibition's own; and each poster
 * opens on its own lettering, except where noted below.
 */

const EXHIBITIONS: [string, ExhibitionConfig][] = [['Holocaust Memorial Day', HOLOCAUST as ExhibitionConfig]];
/*
 * Poster 1 opens on its title set in type, not on the poster's lettering:
 * the lettering reads "NATIONAL HOLOCAUST MEMORIAL DAY", and the owner
 * approved "International Holocaust Remembrance Day" in its place, so cutting
 * it from the poster would put the old name back.
 */
const TYPESET_OPENERS: Record<string, string[]> = { holocaust: ['poster1'] };

describe.each(EXHIBITIONS)('%s: panels arrive in many ways', (_name, config) => {
  it.each(config.posters.map((p) => [p.id, p] as const))('%s: no two panels in a row enter alike, and no entrance dominates', (_id, poster) => {
    const entrances = poster.items.map(entranceOf);
    entrances.slice(1).forEach((e, i) => expect([i + 1, e]).not.toEqual([i + 1, entrances[i]]));
    const counts = new Map<string, number>();
    for (const e of entrances) counts.set(e, (counts.get(e) ?? 0) + 1);
    const most = Math.max(...counts.values());
    expect(most / entrances.length).toBeLessThanOrEqual(0.3);
    expect(counts.size).toBeGreaterThanOrEqual(Math.min(8, entrances.length - 1));
  });

  it('stands its sections in four to six atmospheres of its own, each one used', () => {
    const defined = Object.keys(config.atmospheres ?? {});
    expect(defined.length).toBeGreaterThanOrEqual(4);
    expect(defined.length).toBeLessThanOrEqual(6);
    const used = new Set(config.posters.flatMap((p) => p.items.map((it) => atmosphereName(p, it)).filter(Boolean)));
    expect([...used].sort()).toEqual([...defined].sort());
  });

  it('opens each poster on the poster’s own lettering, a picture that is on disk', () => {
    const typeset = TYPESET_OPENERS[config.slug] ?? [];
    for (const p of config.posters) {
      const first = p.items[0];
      if (typeset.includes(p.id)) {
        // Set in type, under its approved name, read whole.
        expect(first).toMatchObject({ type: 'title-text', text: p.title });
        continue;
      }
      expect(first.type).toBe('title-image');
      if (first.type !== 'title-image') continue;
      expect(first.alt).toBe(p.title);
      expect(first.src).toMatch(new RegExp(`^/exhibitions/${config.slug}/titles/`));
      expect(existsSync(join(process.cwd(), 'public', first.src))).toBe(true);
    }
  });

  it('uses only pictures that exist, and never a photograph of the installation', () => {
    const srcs = config.posters.flatMap((p) => p.items.flatMap((it) => ('src' in it ? [it.src] : 'figure' in it && it.figure ? [it.figure.src] : [])));
    const images = Object.values(config.atmospheres ?? {}).flatMap((a) => (a.images ?? []).map((i) => i.src));
    for (const src of [...srcs, ...images]) expect(existsSync(join(process.cwd(), 'public', src))).toBe(true);
    expect(JSON.stringify(config)).not.toMatch(/images\/mm\/|womens-history-\d\.jpg|holocaust-\d\.jpg|\/women\d?\.jpg|installation/);
  });
});

it('gives the exhibition atmospheres of its own, not the models’', () => {
  const own = Object.keys(HOLOCAUST.atmospheres ?? {});
  const models = [GREAT_WAR, EGYPT].flatMap((c) => Object.keys(c.atmospheres ?? {}));
  expect(own.filter((n) => models.includes(n))).toEqual([]);
});

it('keeps poster 1 under its approved name, never the lettering’s old one', () => {
  const poster = HOLOCAUST.posters[0] as PosterConfig;
  expect(poster.items[0]).toMatchObject({ type: 'title-text', text: 'International Holocaust Remembrance Day' });
  expect(poster.items.some((it) => it.type === 'title-image')).toBe(false);
});
