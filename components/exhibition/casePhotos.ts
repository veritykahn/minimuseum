import fs from 'node:fs';
import path from 'node:path';
import { casePath } from './artifacts';
import { PHOTO_EXTENSIONS, casePhotoDir, type CasePhotosOnDisk } from './casePhotoPaths';
import type { CasePageData, DisplayCase, ExhibitionConfig } from './types';

/*
 * Which of a display case's photographs the owner has dropped in
 * (casePhotoPaths.ts): read from public/ when the page is built (server
 * only), so a file dropped in place is used from the next build, and an
 * empty slot costs no request. The routes that read it are listed under
 * outputFileTracingExcludes in next.config.ts, so public/ is not packed into
 * their functions.
 */

const found = (slug: string, name: string, exts: readonly string[] = PHOTO_EXTENSIONS) => {
  for (const ext of exts) {
    const src = `${casePhotoDir(slug)}/${name}.${ext}`;
    try {
      if (fs.existsSync(path.join(process.cwd(), 'public', src))) return src;
    } catch {
      /* unreadable: the placeholder stays */
    }
  }
  return undefined;
};

export function casePhotosOnDisk(config: Pick<ExhibitionConfig, 'slug'>, data: Pick<CasePageData, 'artifacts'>): CasePhotosOnDisk {
  const artifacts: Record<string, string> = {};
  for (const a of data.artifacts) {
    const src = found(config.slug, a.id);
    if (src) artifacts[a.id] = src;
  }
  return { case: found(config.slug, 'case'), cutout: found(config.slug, 'case-cutout', ['png', 'webp']), artifacts };
}

/**
 * The landing page's case cards with the owner's photograph in place, where
 * one has been dropped in: the cut-out if there is one, else case.jpg. A card
 * whose config already has its picture keeps it.
 */
export function casesWithPhotos(config: Pick<ExhibitionConfig, 'slug' | 'name' | 'cases'>): DisplayCase[] | undefined {
  if (!config.cases) return config.cases;
  const ownCase = casePath(config);
  const src = found(config.slug, 'case-cutout', ['png', 'webp']) ?? found(config.slug, 'case');
  return config.cases.map((c) => (c.image || c.href !== ownCase || !src ? c : { ...c, image: { src, alt: `The ${config.name} display case` } }));
}
