import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Black Barbie from Francie in 1967 to the “So In Style” line in 2009, in the words of the poster The Importance of Black Barbie.';

export const metadata: Metadata = {
  title: 'The Black Barbie Timeline | Black History Month | The Mini Museum',
  description,
  openGraph: {
    title: 'The Black Barbie Timeline | Black History Month',
    description,
    url: `${SITE_URL}/exhibitions/black-history/timeline`,
  },
};

export default function BlackBarbieTimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
