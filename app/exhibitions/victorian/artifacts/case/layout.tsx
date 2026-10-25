import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Victorian Britain display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | Victorian Britain | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | Victorian Britain',
    description,
    url: `${SITE_URL}/exhibitions/victorian/artifacts/case`,
  },
};

export default function VictorianCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
