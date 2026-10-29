import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Carter G. Woodson and the story of Black History Month, and the importance of Black Barbie.';

export const metadata: Metadata = {
  title: 'Black History Month: Black Barbie & Representation | The Mini Museum',
  description,
  openGraph: {
    title: 'Black History Month: Black Barbie & Representation',
    description,
    url: `${SITE_URL}/exhibitions/black-history`,
  },
};

export default function BlackHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
