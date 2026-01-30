import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artifacts Gallery | The Mini Museum',
  description:
    'Explore historical optical instruments and artifacts. View 3D models of stereoscopes, Victorian cards, and other historical devices used for visual deception.',
  keywords: [
    'stereoscope',
    'Victorian optical toys',
    'historical artifacts',
    'optical instruments',
    '3D models',
    'museum collection',
  ],
  openGraph: {
    title: 'Artifacts Gallery | Seeing is Deceiving',
    description:
      'Explore 3D models of historical optical instruments including stereoscopes and Victorian optical toys.',
    url: 'https://minimuseumproject.com/exhibitions/seeing-is-deceiving/artifacts',
  },
};

export default function ArtifactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
