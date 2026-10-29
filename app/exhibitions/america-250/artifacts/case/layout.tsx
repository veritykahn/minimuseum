import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The America 250 display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | America 250 | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | America 250',
    description,
    url: `${SITE_URL}/exhibitions/america-250/artifacts/case`,
  },
};

export default function America250CaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
