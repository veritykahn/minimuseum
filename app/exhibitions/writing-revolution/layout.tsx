import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'How each new writing tool, from the printing press to the typewriter and the computer, opened the gates to more voices, and QWERTY’s accidental empire.';

export const metadata: Metadata = {
  title: 'The Writing Revolution: From Movable Type to the Digital Age | The Mini Museum',
  description,
  openGraph: {
    title: 'The Writing Revolution: From Movable Type to the Digital Age',
    description,
    url: `${SITE_URL}/exhibitions/writing-revolution`,
  },
};

export default function WritingRevolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
