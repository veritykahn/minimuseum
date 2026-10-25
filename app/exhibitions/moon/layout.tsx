import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Why our Moon matters to life on Earth, and the search for another Earth among the stars.';

export const metadata: Metadata = {
  title: 'Our Incredible Moon: And Beyond | The Mini Museum',
  description,
  openGraph: {
    title: 'Our Incredible Moon: And Beyond',
    description,
    url: `${SITE_URL}/exhibitions/moon`,
  },
};

export default function MoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
