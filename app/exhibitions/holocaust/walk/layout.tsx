import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// REVIEW (Verity): the room's description, for search and link previews: at the owner's OK (November 5, 2026), short and gentle, as the room now opens.
const description = 'A short film of the history, then a quiet walk remembering children by name. For International Holocaust Remembrance Day.';

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
