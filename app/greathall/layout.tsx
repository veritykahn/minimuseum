import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Great Hall | The Mini Museum',
  description:
    'Enter The Mini Museum Great Hall. Explore our exhibition floors featuring curated collections of historical artifacts and primary sources.',
  openGraph: {
    title: 'The Great Hall | The Mini Museum',
    description: 'Explore our exhibition floors featuring curated collections.',
    url: `${SITE_URL}/greathall`,
  },
};

export default function GreatHallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
