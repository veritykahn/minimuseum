import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Write your name in hieroglyphs, sign by sign, inside a cartouche, and print it.';

export const metadata: Metadata = {
  title: 'Your Name in Hieroglyphs | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Your Name in Hieroglyphs | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/hieroglyph-name`,
  },
};

export default function HieroglyphNameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
