import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'In Their Hands: Coins of the New Testament | The Mini Museum',
  description:
    'Real coins from the world of Jesus, his ministry and Passion, and the early Church, each paired with the passage of scripture it belongs to.',
  openGraph: {
    title: 'In Their Hands: Coins of the New Testament',
    description:
      'Real coins from the world of Jesus, his ministry and Passion, and the early Church, each paired with the passage of scripture it belongs to.',
    url: `${SITE_URL}/exhibitions/in-their-hands`,
  },
};

export default function InTheirHandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
