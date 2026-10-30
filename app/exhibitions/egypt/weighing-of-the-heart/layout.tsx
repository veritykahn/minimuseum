import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Help the scribe Ani through the weighing of his heart against the feather of Maat, with Anubis, Thoth and Ammit watching.';

export const metadata: Metadata = {
  title: 'The Weighing of the Heart | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'The Weighing of the Heart | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/weighing-of-the-heart`,
  },
};

export default function WeighingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
