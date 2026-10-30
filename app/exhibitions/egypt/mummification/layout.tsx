import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Follow the embalmers through the seventy days of mummification: natron, canopic jars and the four Sons of Horus, linen and amulets.';

export const metadata: Metadata = {
  title: 'Mummification, Step by Step | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Mummification, Step by Step | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/mummification`,
  },
};

export default function MummificationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
