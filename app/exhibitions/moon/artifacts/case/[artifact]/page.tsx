import { notFound } from 'next/navigation';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import { artifactMetadata, artifactParams, findArtifact } from '@/components/exhibition/artifacts';
import { MOON, MOON_CASE } from '../../../moon';
import '../../../moon.css';

/*
 * An artifact in the Our Incredible Moon display case: its own page, built from the case's
 * record (components/exhibition/ArtifactPage). One page per artifact, built
 * ahead; any other path is not found.
 */

type Props = { params: Promise<{ artifact: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return artifactParams(MOON_CASE);
}

export async function generateMetadata({ params }: Props) {
  return artifactMetadata(MOON, MOON_CASE, (await params).artifact);
}

export default async function MoonArtifact({ params }: Props) {
  const artifact = findArtifact(MOON_CASE, (await params).artifact);
  if (!artifact) notFound();
  return <ArtifactPage config={MOON} data={MOON_CASE} artifact={artifact} />;
}
