import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { GREAT_WAR, GREAT_WAR_CASE } from '../../../greatWar';
import '../../../great-war.css';

/*
 * An artifact in the Great War display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(GREAT_WAR_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(GREAT_WAR, GREAT_WAR_CASE, (await params).artifact);
}

export default async function GreatWarArtifact({ params }: Props) {
  const artifact = findArtifact(GREAT_WAR_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={GREAT_WAR} data={GREAT_WAR_CASE} artifact={artifact} />;
}
