import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Holocaust Memorial Day display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | Holocaust Memorial Day | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | Holocaust Memorial Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/artifacts/case`,
  },
};

export default function HolocaustCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
