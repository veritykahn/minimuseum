import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Design a doll that looks like you, learn about Kenneth and Mamie Phipps Clark’s doll tests and Brown v. Board of Education, and count who is in your books.';

export const metadata: Metadata = {
  title: 'Who Do You See? | Black History Month | The Mini Museum',
  description,
  openGraph: {
    title: 'Who Do You See? | Black History Month',
    description,
    url: `${SITE_URL}/exhibitions/black-history/representation`,
  },
};

export default function WhoDoYouSeeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
