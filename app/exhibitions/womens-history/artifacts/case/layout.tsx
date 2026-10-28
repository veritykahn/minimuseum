import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = "The Women's History Month display case and the artifacts in it.";

export const metadata: Metadata = {
  title: "Display Case | Women's History Month | The Mini Museum",
  description,
  openGraph: {
    title: "Display Case | Women's History Month",
    description,
    url: `${SITE_URL}/exhibitions/womens-history/artifacts/case`,
  },
};

export default function WomensHistoryCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
