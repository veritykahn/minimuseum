import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// REVIEW (Verity): the page's description, for search and link previews.
const description = 'The Holocaust from January 1933 to May 1945, a date at a time, in the words of the poster The Timeline of the Holocaust.';

export const metadata: Metadata = {
  title: 'The Timeline of the Holocaust | Holocaust Memorial Day | The Mini Museum',
  description,
  openGraph: {
    title: 'The Timeline of the Holocaust | Holocaust Memorial Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/timeline`,
  },
};

export default function HolocaustTimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
