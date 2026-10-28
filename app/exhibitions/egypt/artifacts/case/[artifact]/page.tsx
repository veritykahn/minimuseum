import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { EGYPT, EGYPT_CASE } from '../../../egypt';
import '../../../egypt.css';

/*
 * An artifact in the Ancient Egypt display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(EGYPT_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(EGYPT, EGYPT_CASE, (await params).artifact);
}

export default async function EgyptArtifact({ params }: Props) {
  const artifact = findArtifact(EGYPT_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={EGYPT} data={EGYPT_CASE} artifact={artifact} />;
}
