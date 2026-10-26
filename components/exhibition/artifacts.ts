import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import type { CaseArtifact, CasePageData, ExhibitionConfig } from './types';

/*
 * A display case's artifacts: their routes, their params for a static build,
 * and their metadata. An exhibition's artifacts/case/[artifact] route is a few
 * lines built from these (see app/exhibitions/egypt/artifacts/case/[artifact]).
 */

/** The display case page: /exhibitions/<slug>/artifacts/case. */
export function casePath(config: Pick<ExhibitionConfig, 'slug'>) {
  return `/exhibitions/${config.slug}/artifacts/case`;
}

/** An artifact's own page: /exhibitions/<slug>/artifacts/case/<id>. */
export function artifactPath(config: Pick<ExhibitionConfig, 'slug'>, artifact: Pick<CaseArtifact, 'id'>) {
  return `${casePath(config)}/${artifact.id}`;
}

export function findArtifact(data: CasePageData, id: string): CaseArtifact | undefined {
  return data.artifacts.find((a) => a.id === id);
}

/** generateStaticParams for an artifacts/case/[artifact] route. */
export function artifactParams(data: CasePageData) {
  return data.artifacts.map((a) => ({ artifact: a.id }));
}

/** A name or line with its *italics* markers taken out, for titles and metadata. */
export function plainText(text: string) {
  return text.replace(/\*/g, '');
}

/** The title of the poster a piece of writing comes from. */
export function posterTitle(config: ExhibitionConfig, posterId: string) {
  return config.posters.find((p) => p.id === posterId)?.title;
}

/** The record's lines for the case, in order, each once: the objects' lines, then the display's. */
export function recordLines(data: CasePageData) {
  return [...new Set([...data.artifacts.map((a) => a.record), ...(data.display ?? [])])];
}

/** The artifact before and after this one in the case. */
export function neighbours(data: CasePageData, id: string) {
  const i = data.artifacts.findIndex((a) => a.id === id);
  return { prev: i > 0 ? data.artifacts[i - 1] : undefined, next: i >= 0 ? data.artifacts[i + 1] : undefined };
}

export function artifactMetadata(config: ExhibitionConfig, data: CasePageData, id: string): Metadata {
  const artifact = findArtifact(data, id);
  if (!artifact) return {};
  const name = plainText(artifact.name);
  const description = plainText(artifact.record);
  return {
    title: `${name} | ${config.name} | The Mini Museum`,
    description,
    openGraph: {
      title: `${name} | ${config.name}`,
      description,
      url: `${SITE_URL}${artifactPath(config, artifact)}`,
    },
  };
}
