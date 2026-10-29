import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The The Writing Revolution display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | The Writing Revolution | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | The Writing Revolution',
    description,
    url: `${SITE_URL}/exhibitions/writing-revolution/artifacts/case`,
  },
};

export default function WritingRevolutionCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
