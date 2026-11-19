import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Read the Declaration of Independence on parchment, dip the quill and sign your name at its foot; or sign your class’s declaration, or your own.';

export const metadata: Metadata = {
  title: 'Put Your Name to It | America 250 | The Mini Museum',
  description,
  openGraph: {
    title: 'Put Your Name to It | America 250',
    description,
    url: `${SITE_URL}/exhibitions/america-250/sign`,
  },
};

export default function America250SignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
