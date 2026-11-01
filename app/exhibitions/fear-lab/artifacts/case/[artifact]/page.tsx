import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { FEAR_LAB, FEAR_LAB_CASE } from '../../../fearLab';
import '../../../fear-lab.css';

/*
 * An artifact in The Fear Lab display case: its own page, built from the
 * case's record (components/exhibition/ArtifactPage). One page per artifact,
 * built ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(FEAR_LAB_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(FEAR_LAB, FEAR_LAB_CASE, (await params).artifact);
}

export default async function FearLabArtifact({ params }: Props) {
  const artifact = findArtifact(FEAR_LAB_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={FEAR_LAB} data={FEAR_LAB_CASE} artifact={artifact} photo={casePhotosOnDisk(FEAR_LAB, FEAR_LAB_CASE).artifacts[artifact.id]} />;
}
