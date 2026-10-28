import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { WRITING_REVOLUTION, WRITING_REVOLUTION_CASE } from '../../../writingRevolution';
import '../../../writing-revolution.css';

/*
 * An artifact in the The Writing Revolution display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(WRITING_REVOLUTION_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(WRITING_REVOLUTION, WRITING_REVOLUTION_CASE, (await params).artifact);
}

export default async function WritingRevolutionArtifact({ params }: Props) {
  const artifact = findArtifact(WRITING_REVOLUTION_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={WRITING_REVOLUTION} data={WRITING_REVOLUTION_CASE} artifact={artifact} />;
}
