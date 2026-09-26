import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import LazyArtifactViewer from '@/components/LazyArtifactViewer';

export const metadata: Metadata = {
  title: 'Victorian Optical Illusion Puzzle Cards (c.1890–1900) | Seeing is Deceiving | The Mini Museum',
  description:
    'Victorian optical illusion puzzle cards (c.1890–1900): parlor magic when reality transforms, and a question for today about images that fool us.',
  openGraph: {
    title: 'Victorian Optical Illusion Puzzle Cards (c.1890–1900)',
    description:
      'Victorian optical illusion puzzle cards (c.1890–1900): parlor magic when reality transforms, and a question for today about images that fool us.',
    url: `${SITE_URL}/exhibitions/seeing-is-deceiving/artifacts/victorian-cards`,
  },
};

export default function VictorianCardsPage() {
  return <LazyArtifactViewer artifactId="victorian-cards" />;
}
