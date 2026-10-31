import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'First Floor: Horizons | The Mini Museum',
  description:
    'Explore the Horizons collection on the first floor of The Mini Museum, with exhibitions from the 20th century.',
  openGraph: {
    title: 'First Floor: Horizons | The Mini Museum',
    description: 'Exhibitions from the 20th century.',
    url: `${SITE_URL}/exhibitions/first-floor`,
  },
};

export default function FirstFloorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
