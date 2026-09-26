import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import LazyArtifactViewer from '@/components/LazyArtifactViewer';

export const metadata: Metadata = {
  title: 'The Village of Dalen, Lake Bandaksvand (1906) | Seeing is Deceiving | The Mini Museum',
  description:
    'Keystone View Card #13399, The Village of Dalen, Lake Bandaksvand (1906): Norway in your parlor, a window to a world most Victorians would never visit.',
  openGraph: {
    title: 'The Village of Dalen, Lake Bandaksvand (1906)',
    description:
      'Keystone View Card #13399, The Village of Dalen, Lake Bandaksvand (1906): Norway in your parlor, a window to a world most Victorians would never visit.',
    url: `${SITE_URL}/exhibitions/seeing-is-deceiving/artifacts/stereoscope-cards`,
  },
};

export default function StereoscopeCardsPage() {
  return <LazyArtifactViewer artifactId="stereoscope-cards" />;
}
