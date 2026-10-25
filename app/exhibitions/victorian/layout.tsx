import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Victorian innovation, the birth of the V&A, and how Charles Dickens reinvented Christmas.';

export const metadata: Metadata = {
  title: 'Victorian Britain: Material & Domestic Life | The Mini Museum',
  description,
  openGraph: {
    title: 'Victorian Britain: Material & Domestic Life',
    description,
    url: `${SITE_URL}/exhibitions/victorian`,
  },
};

export default function VictorianLayout({ children }: { children: React.ReactNode }) {
  return children;
}
