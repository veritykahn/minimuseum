import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Black History Month display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | Black History Month | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | Black History Month',
    description,
    url: `${SITE_URL}/exhibitions/black-history/artifacts/case`,
  },
};

export default function BlackHistoryCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
