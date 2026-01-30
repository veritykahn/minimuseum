import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'First Floor: Horizons | The Mini Museum',
  description:
    'Explore the Horizons collection on the first floor. The second collection at The Mini Museum featuring exhibitions from 2025-2026.',
  openGraph: {
    title: 'First Floor: Horizons | The Mini Museum',
    description: 'The second collection featuring exhibitions from 2025-2026.',
    url: 'https://minimuseumproject.com/exhibitions/first-floor',
  },
};

export default function FirstFloorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
