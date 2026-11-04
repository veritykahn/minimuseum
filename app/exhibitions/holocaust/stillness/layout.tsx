import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// REVIEW (Verity): the room's description.
const description = 'A minute’s stillness before a memorial stone, with the words of Martin Niemöller, and names, words and questions to remember.';

export const metadata: Metadata = {
  title: 'A Minute’s Stillness | Holocaust Memorial Day | The Mini Museum',
  description,
  openGraph: {
    title: 'A Minute’s Stillness | Holocaust Memorial Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/stillness`,
  },
};

export default function StillnessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
