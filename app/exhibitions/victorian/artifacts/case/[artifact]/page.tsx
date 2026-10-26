import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { VICTORIAN, VICTORIAN_CASE } from '../../../victorian';
import '../../../victorian.css';

/*
 * An artifact in the Victorian Britain display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(VICTORIAN_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(VICTORIAN, VICTORIAN_CASE, (await params).artifact);
}

export default async function VictorianArtifact({ params }: Props) {
  const artifact = findArtifact(VICTORIAN_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={VICTORIAN} data={VICTORIAN_CASE} artifact={artifact} />;
}
