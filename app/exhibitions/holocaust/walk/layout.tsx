import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// REVIEW (Verity): the room's description.
const description = 'A short film of the history of the Holocaust, a picture and a line at a time, and then a slow walk through a grey hall over a floor of iron faces, with the names of children who were murdered.';

export const metadata: Metadata = {
  title: 'The Walk | International Holocaust Remembrance Day | The Mini Museum',
  description,
  openGraph: {
    title: 'The Walk | International Holocaust Remembrance Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/walk`,
  },
};

export default function WalkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
