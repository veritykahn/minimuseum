import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exhibitions | The Mini Museum',
  description:
    'Explore current and upcoming exhibitions at The Mini Museum. Monthly curated collections featuring real artifacts and primary sources.',
  openGraph: {
    title: 'Exhibitions | The Mini Museum',
    description: 'Monthly curated collections featuring real artifacts and primary sources.',
    url: `${SITE_URL}/exhibitions`,
  },
};

export default function ExhibitionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
