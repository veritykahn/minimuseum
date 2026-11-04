import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The International Holocaust Remembrance Day display case and the artifacts in it.';

export const metadata: Metadata = {
  title: 'Display Case | International Holocaust Remembrance Day | The Mini Museum',
  description,
  openGraph: {
    title: 'Display Case | International Holocaust Remembrance Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/artifacts/case`,
  },
};

export default function HolocaustCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
