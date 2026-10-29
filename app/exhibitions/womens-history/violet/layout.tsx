import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The life of Violet Dina Want, from Fulham to the greengrocer: her places and moments, one keepsake at a time, in the words of the poster; and a timeline of your own, for a woman in your life.';

export const metadata: Metadata = {
  title: "Violet's Life | Women's History Month | The Mini Museum",
  description,
  openGraph: {
    title: "Violet's Life | Women's History Month",
    description,
    url: `${SITE_URL}/exhibitions/womens-history/violet`,
  },
};

export default function VioletsLifeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
