import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Holocaust Memorial Day: International Holocaust Remembrance Day, what the Holocaust was, and the words of Martin Niemöller.';

export const metadata: Metadata = {
  title: 'Holocaust Memorial Day: Never Forget | The Mini Museum',
  description,
  openGraph: {
    title: 'Holocaust Memorial Day: Never Forget',
    description,
    url: `${SITE_URL}/exhibitions/holocaust`,
  },
};

export default function HolocaustLayout({ children }: { children: React.ReactNode }) {
  return children;
}
