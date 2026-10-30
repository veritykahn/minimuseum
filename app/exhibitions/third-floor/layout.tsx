import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Third Floor: Studio | The Mini Museum',
  description:
    'Studio, the third floor of The Mini Museum: every make-your-own tool in the museum, from a class declaration to a Victorian Christmas card, each a door to its exhibition.',
  openGraph: {
    title: 'Third Floor: Studio | The Mini Museum',
    description: 'Every make-your-own tool in the museum, each a door to its exhibition.',
    url: `${SITE_URL}/exhibitions/third-floor`,
  },
};

export default function ThirdFloorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
