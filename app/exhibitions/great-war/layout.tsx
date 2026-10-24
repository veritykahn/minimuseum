import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Doughboys, the trenches, and the armistice that came at the eleventh hour.';

export const metadata: Metadata = {
  title: 'The Great War: The Doughboys & the 11th Hour | The Mini Museum',
  description,
  openGraph: {
    title: 'The Great War: The Doughboys & the 11th Hour',
    description,
    url: `${SITE_URL}/exhibitions/great-war`,
  },
};

export default function GreatWarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
