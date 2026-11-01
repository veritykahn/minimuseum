import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { HOLOCAUST, HOLOCAUST_CASE } from '../../../holocaust';
import '../../../holocaust.css';

/*
 * An artifact in the Holocaust Memorial Day display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(HOLOCAUST_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(HOLOCAUST, HOLOCAUST_CASE, (await params).artifact);
}

export default async function HolocaustArtifact({ params }: Props) {
  const artifact = findArtifact(HOLOCAUST_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={HOLOCAUST} data={HOLOCAUST_CASE} artifact={artifact} photo={casePhotosOnDisk(HOLOCAUST, HOLOCAUST_CASE).artifacts[artifact.id]} />;
}
