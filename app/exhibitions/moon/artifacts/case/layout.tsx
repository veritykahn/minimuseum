import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Our Incredible Moon display case: photographs of the installation and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | Our Incredible Moon | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | Our Incredible Moon',
    description,
    url: `${SITE_URL}/exhibitions/moon/artifacts/case`,
  },
};

export default function MoonCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
