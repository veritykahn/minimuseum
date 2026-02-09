import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voices of Harlem | The Mini Museum',
  description: 'Explore artifacts and interactive experiences from the Harlem Renaissance.',
};

export default function ArtifactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
