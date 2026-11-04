import type { CasePageData, CasePhoto, ExhibitionConfig } from './types';

/*
 * Where the owner's photographs of a display case and its artifacts drop in.
 * Each engine-built exhibition has one folder, public/exhibitions/<slug>/case/,
 * and in it:
 *
 *   case.jpg              the whole case, photographed straight on; landscape
 *                         4:3, 1600 × 1200 px. Set at the head of the case page
 *                         and, with no cut-out, on the landing page's case card.
 *   case-cutout.png       optional: the case cut out on a transparent ground,
 *                         about 1000 px tall, for the landing page's case card
 *                         (as the Harlem and Seeing is Deceiving cases are).
 *   <artifact id>.jpg     each object on its own, square, 1200 × 1200 px, on a
 *                         plain ground. Its card on the case page and the head
 *                         of its own page. The ids are the artifacts' page
 *                         addresses: /exhibitions/<slug>/artifacts/case/<id>.
 *
 * A .webp or .png of the same name works too. Until a file is there, the
 * empty case drawn in outline (CasePlaceholder) or the object on its stand
 * (ArtifactGlyph) stands in its place. Which files are there is read when the
 * site is built (casePhotos.ts), so a photograph dropped in shows from the
 * next build. expectedCasePhotos lists every file name, for the owner.
 */

export const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png'] as const;

/** The folder an exhibition's case photographs go in, under public/. */
export const casePhotoDir = (slug: string) => `/exhibitions/${slug}/case`;

/** The sizes asked for, which the pages reserve while a photograph loads. */
export const CASE_PHOTO_SIZE = { width: 1600, height: 1200 } as const;
export const ARTIFACT_PHOTO_SIZE = { width: 1200, height: 1200 } as const;

/** The photographs found for a case, by their public addresses. */
export type CasePhotosOnDisk = {
  /** case.jpg (or .webp / .png). */
  case?: string;
  /** case-cutout.png (or .webp). */
  cutout?: string;
  /** Each artifact's photograph, by artifact id. */
  artifacts: Record<string, string>;
};

export const NO_CASE_PHOTOS: CasePhotosOnDisk = { artifacts: {} };

/** Every file the owner can drop in for an exhibition, with the size asked for. */
export function expectedCasePhotos(config: Pick<ExhibitionConfig, 'slug'>, data: Pick<CasePageData, 'artifacts'>) {
  const dir = `public${casePhotoDir(config.slug)}`;
  return [
    { file: `${dir}/case.jpg`, size: '1600 × 1200 px (landscape 4:3)', what: 'the whole case' },
    { file: `${dir}/case-cutout.png`, size: 'about 1000 px tall, transparent ground (optional)', what: 'the case cut out, for the landing page card' },
    ...data.artifacts.map((a) => ({ file: `${dir}/${a.id}.jpg`, size: '1200 × 1200 px (square)', what: a.name.replace(/\*/g, '') })),
  ];
}

/** The case page's lead photograph: the record's own first, else the owner's dropped-in case.jpg. */
export function leadCasePhoto(data: Pick<CasePageData, 'photos'>, onDisk: CasePhotosOnDisk, name: string): CasePhoto | undefined {
  if (data.photos[0]) return data.photos[0];
  if (!onDisk.case) return undefined;
  return { src: onDisk.case, alt: `The ${name} display case`, ...CASE_PHOTO_SIZE };
}
