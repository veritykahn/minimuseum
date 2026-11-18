import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Build your own Egyptian tomb: choose a painting for the wall, fill the chamber with things to take with you, carve your name and lay your amulet in its niche, then print it.';

export const metadata: Metadata = {
  title: 'Build Your Own Tomb | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Build Your Own Tomb | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/my-tomb`,
  },
};

export default function MyTombLayout({ children }: { children: React.ReactNode }) {
  return children;
}
