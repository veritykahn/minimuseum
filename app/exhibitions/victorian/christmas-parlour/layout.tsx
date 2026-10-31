import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = "A parlour on Christmas Eve: open the parts of a Victorian Christmas, the tree, the cards, A Christmas Carol and the fire, and bring Dickens' Christmas to life.";

export const metadata: Metadata = {
  title: 'Dickens’ Christmas Parlour | Victorian Britain | The Mini Museum',
  description,
  openGraph: {
    title: 'Dickens’ Christmas Parlour | Victorian Britain',
    description,
    url: `${SITE_URL}/exhibitions/victorian/christmas-parlour`,
  },
};

export default function VictorianChristmasParlourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
