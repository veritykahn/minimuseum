import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Who gets a statue, and whose stories are left out: fifty monuments, a scale to tip, and questions for the class, after the words of the Women’s History Month poster.';

export const metadata: Metadata = {
  title: "Who Gets Remembered? | Women's History Month | The Mini Museum",
  description,
  openGraph: {
    title: "Who Gets Remembered? | Women's History Month",
    description,
    url: `${SITE_URL}/exhibitions/womens-history/remembered`,
  },
};

export default function WhoGetsRememberedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
