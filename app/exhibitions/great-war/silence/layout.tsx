import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A short film for the Armistice: a countdown, six title cards, and the 1918 sound-ranging record of the minute the guns fell silent.';

export const metadata: Metadata = {
  title: 'When the Guns Fell Silent | The Great War | The Mini Museum',
  description,
  openGraph: {
    title: 'When the Guns Fell Silent | The Great War',
    description,
    url: `${SITE_URL}/exhibitions/great-war/silence`,
  },
};

export default function GreatWarSilenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
