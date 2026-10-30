import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'In Their Hands: Coins of Roman Judaea | The Mini Museum',
  description:
    'Real coins from Roman Judaea in the years of the Second Temple, read alongside the Gospels and Acts, the Jewish historian Josephus, Roman historians and the archaeology of the region.',
  openGraph: {
    title: 'In Their Hands: Coins of Roman Judaea',
    description:
      'Real coins from Roman Judaea in the years of the Second Temple, read alongside the Gospels and Acts, the Jewish historian Josephus, Roman historians and the archaeology of the region.',
    url: `${SITE_URL}/exhibitions/in-their-hands`,
  },
};

export default function InTheirHandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
