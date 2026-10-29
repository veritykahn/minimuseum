import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { atmosphereName, entranceOf } from '@/components/exhibition/helpers';
import type { ExhibitionConfig } from '@/components/exhibition/types';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { MOON } from '@/app/exhibitions/moon/moon';

/*
 * Our Incredible Moon in the walkthrough's vocabulary, as PosterEffects.test
 * holds The Great War and Ancient Egypt to it: every panel arrives its own
 * way, no two in a row alike and none dominating, each part of the story
 * stands in an atmosphere of the exhibition's own, and each poster opens on
 * its own lettering.
 */

const config = MOON as ExhibitionConfig;

describe('Our Incredible Moon: panels arrive in many ways', () => {
  it.each(config.posters.map((p) => [p.id, p] as const))('%s: no two panels in a row enter alike, and no entrance dominates', (_id, poster) => {
    const entrances = poster.items.map(entranceOf);
    entrances.slice(1).forEach((e, i) => expect([i + 1, e]).not.toEqual([i + 1, entrances[i]]));
    const counts = new Map<string, number>();
    for (const e of entrances) counts.set(e, (counts.get(e) ?? 0) + 1);
    const most = Math.max(...counts.values());
    expect(most / entrances.length).toBeLessThanOrEqual(0.3);
    expect(counts.size).toBeGreaterThanOrEqual(Math.min(8, entrances.length - 1));
  });

  it('stands its panels in four to six atmospheres of its own, each one used', () => {
    const defined = Object.keys(config.atmospheres ?? {});
    expect(defined.length).toBeGreaterThanOrEqual(4);
    expect(defined.length).toBeLessThanOrEqual(6);
    const used = new Set(config.posters.flatMap((p) => p.items.map((it) => atmosphereName(p, it)).filter(Boolean)));
    expect([...used].sort()).toEqual([...defined].sort());
    const others = [...Object.keys(GREAT_WAR.atmospheres ?? {}), ...Object.keys(EGYPT.atmospheres ?? {})];
    expect(defined.filter((n) => others.includes(n))).toEqual([]);
  });

  it('opens each poster on the poster’s own lettering, a picture that is on disk', () => {
    for (const p of config.posters) {
      const first = p.items[0];
      expect(first.type).toBe('title-image');
      if (first.type !== 'title-image') continue;
      expect(first.alt).toBe(p.title);
      expect(existsSync(join(process.cwd(), 'public', first.src))).toBe(true);
    }
  });

  it('uses only pictures that exist, and never a photograph of the installation', () => {
    const srcs = config.posters.flatMap((p) => p.items.flatMap((it) => [
      ...('src' in it ? [it.src] : 'figure' in it && it.figure ? [it.figure.src] : []),
      ...(it.decor ? [it.decor.src] : []),
    ]));
    const images = Object.values(config.atmospheres ?? {}).flatMap((a) => (a.images ?? []).map((i) => i.src));
    for (const src of [...srcs, ...images]) expect(existsSync(join(process.cwd(), 'public', src))).toBe(true);
    expect(JSON.stringify(config)).not.toMatch(/images\/mm\/|space\d?\.jpg|installation/);
  });
});
