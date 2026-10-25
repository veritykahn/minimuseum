import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Women’s History Month, and the life of Violet Dina Want: the biography of a working-class woman, beside her family’s letters from the Blitz.';

export const metadata: Metadata = {
  title: "Women's History Month: Letters From the Blitz | The Mini Museum",
  description,
  openGraph: {
    title: "Women's History Month: Letters From the Blitz",
    description,
    url: `${SITE_URL}/exhibitions/womens-history`,
  },
};

export default function WomensHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
