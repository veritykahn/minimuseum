import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { WOMENS_HISTORY, WOMENS_HISTORY_CASE } from '../../../womensHistory';
import '../../../womensHistory.css';

/*
 * An artifact in the Women's History Month display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(WOMENS_HISTORY_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(WOMENS_HISTORY, WOMENS_HISTORY_CASE, (await params).artifact);
}

export default async function WomensHistoryArtifact({ params }: Props) {
  const artifact = findArtifact(WOMENS_HISTORY_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={WOMENS_HISTORY} data={WOMENS_HISTORY_CASE} artifact={artifact} />;
}
