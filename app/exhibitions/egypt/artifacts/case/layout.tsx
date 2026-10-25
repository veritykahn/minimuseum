import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Ancient Egypt display case: photographs of the installation and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/artifacts/case`,
  },
};

export default function EgyptCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
