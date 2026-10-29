import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Design a Victorian Christmas card: its picture, its border, its paper and its greeting, then write inside it and print it to fold.';

export const metadata: Metadata = {
  title: 'Christmas Card Maker | Victorian Britain | The Mini Museum',
  description,
  openGraph: {
    title: 'Christmas Card Maker | Victorian Britain',
    description,
    url: `${SITE_URL}/exhibitions/victorian/christmas-card`,
  },
};

export default function VictorianChristmasCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
