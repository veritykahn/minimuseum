import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Case 6: Coins from the World of Jesus | In Their Hands | The Mini Museum',
  description:
    'Coins of Augustus, Herod the Great and Aretas IV: the rulers of the Nativity, with the scripture each one touches.',
  openGraph: {
    title: 'Case 6: Coins from the World of Jesus | In Their Hands',
    description:
      'Coins of Augustus, Herod the Great and Aretas IV: the rulers of the Nativity, with the scripture each one touches.',
    url: `${SITE_URL}/exhibitions/in-their-hands/artifacts/case-6`,
  },
};

export default function Case6Layout({ children }: { children: React.ReactNode }) {
  return children;
}
