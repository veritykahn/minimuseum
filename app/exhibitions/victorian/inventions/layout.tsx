import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A hands-on workshop of the Victorian inventions: steam a train west and compare the town clocks with railway time, send a word on a five-needle telegraph, and make a negative and prints from it.';

export const metadata: Metadata = {
  title: 'Inventions Workshop | Victorian Britain | The Mini Museum',
  description,
  openGraph: {
    title: 'Inventions Workshop | Victorian Britain',
    description,
    url: `${SITE_URL}/exhibitions/victorian/inventions`,
  },
};

export default function VictorianInventionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
