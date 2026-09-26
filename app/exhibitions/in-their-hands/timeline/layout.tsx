import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The Gospel Timeline | In Their Hands | The Mini Museum',
  description:
    'Follow the coins of In Their Hands through the New Testament, from the census of Augustus to the early Church.',
  openGraph: {
    title: 'The Gospel Timeline | In Their Hands',
    description:
      'Follow the coins of In Their Hands through the New Testament, from the census of Augustus to the early Church.',
    url: `${SITE_URL}/exhibitions/in-their-hands/timeline`,
  },
};

export default function GospelTimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
