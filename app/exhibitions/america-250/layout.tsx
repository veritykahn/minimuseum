import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Declaration of Independence at 250: what it was, what it became, and the wager fifty-six men made with their signatures.';

export const metadata: Metadata = {
  title: 'America 250: The Declaration of Independence at 250 | The Mini Museum',
  description,
  openGraph: {
    title: 'America 250: The Declaration of Independence at 250',
    description,
    url: `${SITE_URL}/exhibitions/america-250`,
  },
};

export default function America250Layout({ children }: { children: React.ReactNode }) {
  return children;
}
