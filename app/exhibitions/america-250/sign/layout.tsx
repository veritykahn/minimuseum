import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Sign your name with a quill, and follow the Declaration from copy to copy: the Rough Draft, the July 4 Fair Copy, the Engrossed Copy, Stone’s engraving and the transcription.';

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
