import fs from 'node:fs';
import path from 'node:path';
import { ALL_POSTERS_SOUND, FLOOR_SOUND, SILENT_EXHIBITIONS, momentSrc, posterSoundDir, type PosterMoments, type PosterSounds } from './posterSoundPaths';
import type { ExhibitionConfig } from './types';

/*
 * Which posters have a room sound (posterSoundPaths.ts): read from public/
 * when the page is built (server only), so a file dropped in place is used
 * from the next build, and an empty slot costs no request. Like the case
 * photographs (casePhotos.ts), the routes that read it are listed under
 * outputFileTracingExcludes in next.config.ts.
 */

const found = (slug: string, name: string) => {
  const src = `${posterSoundDir(slug)}/${name}.mp3`;
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', src)) ? src : undefined;
  } catch {
    return undefined; /* unreadable: the room stays quiet */
  }
};

export function posterSoundsOnDisk<K extends string>(config: Pick<ExhibitionConfig<K>, 'slug' | 'posters'>): PosterSounds<K> | undefined {
  if (SILENT_EXHIBITIONS.includes(config.slug)) return undefined;
  const all = found(config.slug, ALL_POSTERS_SOUND);
  const sounds: PosterSounds<K> = {};
  for (const p of config.posters) {
    const src = found(config.slug, p.id) ?? all;
    if (src) sounds[p.id] = src;
  }
  return Object.keys(sounds).length ? sounds : undefined;
}

/**
 * Each exhibition's sound for its floor's hall, by slug (FloorSound.ts): the
 * sound heard faintly from its doorway as a visitor passes. Its own
 * floor.mp3 if it has one, else its posters' sound. None for a silent one.
 */
export function floorSoundsOnDisk(slugs: readonly string[]): Record<string, string> | undefined {
  const sounds: Record<string, string> = {};
  for (const slug of slugs) {
    if (SILENT_EXHIBITIONS.includes(slug)) continue;
    const src = [FLOOR_SOUND, ALL_POSTERS_SOUND, 'poster1', 'poster2'].map((n) => found(slug, n)).find(Boolean);
    if (src) sounds[slug] = src;
  }
  return Object.keys(sounds).length ? sounds : undefined;
}

/**
 * Each poster's moments, panel by panel (PanelMoment.ts): the file of the
 * moment a panel names, where it is in place, else null.
 */
export function posterMomentsOnDisk<K extends string>(config: Pick<ExhibitionConfig<K>, 'slug' | 'posters'>): PosterMoments<K> | undefined {
  /* A silent exhibition (the Holocaust) has no music and is not heard from the hall, but may keep a few very quiet moments of its own. */
  const there = (name: string) => {
    try {
      return fs.existsSync(path.join(process.cwd(), 'public', momentSrc(config.slug, name)));
    } catch {
      return false;
    }
  };
  const out: PosterMoments<K> = {};
  for (const p of config.posters) {
    const files = p.items.map((i) => (i.moment && there(i.moment) ? momentSrc(config.slug, i.moment) : null));
    if (files.some(Boolean)) out[p.id] = files;
  }
  return Object.keys(out).length ? out : undefined;
}
