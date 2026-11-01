import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { BLACK_HISTORY, BLACK_HISTORY_CASE } from '../../../blackHistory';
import '../../../black-history.css';

/*
 * An artifact in the Black History Month display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(BLACK_HISTORY_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(BLACK_HISTORY, BLACK_HISTORY_CASE, (await params).artifact);
}

export default async function BlackHistoryArtifact({ params }: Props) {
  const artifact = findArtifact(BLACK_HISTORY_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={BLACK_HISTORY} data={BLACK_HISTORY_CASE} artifact={artifact} photo={casePhotosOnDisk(BLACK_HISTORY, BLACK_HISTORY_CASE).artifacts[artifact.id]} />;
}
