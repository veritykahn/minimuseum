import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A memorial stone, with the stones laid on it by visitors; a minute’s stillness with the words of Martin Niemöller, and names and words to remember; a walk over a path of plain stones, through the history a line at a time; and the days to International Holocaust Remembrance Day.';

export const metadata: Metadata = {
  title: 'Never Forget | Holocaust Memorial Day | The Mini Museum',
  description,
  openGraph: {
    title: 'Never Forget | Holocaust Memorial Day',
    description,
    url: `${SITE_URL}/exhibitions/holocaust/stones`,
  },
};

export default function NeverForgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
