import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Grow the flag from 13 stars to 50: before each state’s star goes on, guess the decade it joined the Union.';

export const metadata: Metadata = {
  title: 'Add a Star | America 250 | The Mini Museum',
  description,
  openGraph: {
    title: 'Add a Star | America 250',
    description,
    url: `${SITE_URL}/exhibitions/america-250/flag`,
  },
};

export default function America250FlagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
