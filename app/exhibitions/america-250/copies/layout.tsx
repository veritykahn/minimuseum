import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A detective’s case: follow the Declaration of Independence from copy to copy, from the first printing of July 1776 to the faded parchment, and find one thing on each with the lens.';

export const metadata: Metadata = {
  title: 'A Copy of a Copy | America 250 | The Mini Museum',
  description,
  openGraph: {
    title: 'A Copy of a Copy | America 250',
    description,
    url: `${SITE_URL}/exhibitions/america-250/copies`,
  },
};

export default function America250CopiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
