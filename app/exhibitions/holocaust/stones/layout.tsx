import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A memorial stone, with the stones laid on it by visitors, and a minute’s stillness with the words of Martin Niemöller.';

export const metadata: Metadata = {
  title: 'Lay a Stone | Holocaust Memorial Day | The Mini Museum',
  description,
  openGraph: {
    title: 'Lay a Stone | Holocaust Memorial Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/stones`,
  },
};

export default function LayAStoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
