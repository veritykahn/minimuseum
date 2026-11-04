import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { AMERICA_250, AMERICA_250_CASE } from '../../../america250';
import '../../../america250.css';

/*
 * An artifact in the America 250 display case: its own page, built from the
 * case's record (components/exhibition/ArtifactPage). One page per artifact,
 * built ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(AMERICA_250_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(AMERICA_250, AMERICA_250_CASE, (await params).artifact);
}

export default async function America250Artifact({ params }: Props) {
  const artifact = findArtifact(AMERICA_250_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={AMERICA_250} data={AMERICA_250_CASE} artifact={artifact} photo={casePhotosOnDisk(AMERICA_250, AMERICA_250_CASE).artifacts[artifact.id]} />;
}
