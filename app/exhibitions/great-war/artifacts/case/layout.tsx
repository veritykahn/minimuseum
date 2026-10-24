import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The Great War display case: photographs of the installation and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | The Great War | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | The Great War',
    description,
    url: `${SITE_URL}/exhibitions/great-war/artifacts/case`,
  },
};

export default function GreatWarCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
