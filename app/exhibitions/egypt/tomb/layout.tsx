import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Explore a dark tomb by torchlight and find the details hidden in its painted walls.';

export const metadata: Metadata = {
  title: 'Tomb Explorer | Ancient Egypt | The Mini Museum',
  description,
  openGraph: {
    title: 'Tomb Explorer | Ancient Egypt',
    description,
    url: `${SITE_URL}/exhibitions/egypt/tomb`,
  },
};

export default function TombLayout({ children }: { children: React.ReactNode }) {
  return children;
}
