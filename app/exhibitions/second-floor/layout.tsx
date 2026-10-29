import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Second Floor: Reflections | The Mini Museum',
  description:
    'Explore the Reflections collection on the second floor of The Mini Museum, with exhibitions on identity, words and the mind.',
  openGraph: {
    title: 'Second Floor: Reflections | The Mini Museum',
    description: 'Exhibitions on identity, words and the mind.',
    url: `${SITE_URL}/exhibitions/second-floor`,
  },
};

export default function SecondFloorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
