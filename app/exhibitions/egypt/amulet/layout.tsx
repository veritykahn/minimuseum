import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Design an ancient Egyptian amulet: choose its shape, material and symbols, learn what each symbol meant, and print it.';

export const metadata: Metadata = {
  title: 'Design an Amulet | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Design an Amulet | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/amulet`,
  },
};

export default function AmuletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
