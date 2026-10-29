import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Fear Lab display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | The Fear Lab | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | The Fear Lab',
    description,
    url: `${SITE_URL}/exhibitions/fear-lab/artifacts/case`,
  },
};

export default function FearLabCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
