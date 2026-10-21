import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import LazyArtifactViewer from '@/components/LazyArtifactViewer';

export const metadata: Metadata = {
  title: 'Monarch Stereoscope (1904) | Seeing is Deceiving | The Mini Museum',
  description:
    'Monarch Stereoscope (1904): Victorian virtual reality. The same principle as a modern VR headset: show each eye a different image and let the brain create depth.',
  openGraph: {
    title: 'Monarch Stereoscope (1904)',
    description:
      'Monarch Stereoscope (1904): Victorian virtual reality. The same principle as a modern VR headset: show each eye a different image and let the brain create depth.',
    url: `${SITE_URL}/exhibitions/seeing-is-deceiving/artifacts/stereoscope`,
  },
};

export default function StereoscopePage() {
  return <LazyArtifactViewer artifactId="stereoscope" />;
}
