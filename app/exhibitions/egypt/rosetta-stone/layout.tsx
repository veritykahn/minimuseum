import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'See the Rosetta Stone’s three scripts side by side, and crack the names of Ptolemy and Cleopatra as Champollion did.';

export const metadata: Metadata = {
  title: 'The Rosetta Stone Decoder | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'The Rosetta Stone Decoder | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/rosetta-stone`,
  },
};

export default function RosettaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
