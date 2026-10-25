import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ground Floor: Origins | The Mini Museum',
  description:
    'Explore the Origins collection on the ground floor of The Mini Museum, with exhibitions from the deep past up to about 1900.',
  openGraph: {
    title: 'Ground Floor: Origins | The Mini Museum',
    description: 'Exhibitions from the deep past up to about 1900.',
    url: `${SITE_URL}/exhibitions/ground-floor`,
  },
};

export default function GroundFloorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
