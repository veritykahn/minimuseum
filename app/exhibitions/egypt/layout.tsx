import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The mysteries of ancient Egypt, and the gods and goddesses who guarded the afterlife.';

export const metadata: Metadata = {
  title: 'Ancient Egypt: Guardians of the Afterlife | The Mini Museum',
  description,
  openGraph: {
    title: 'Ancient Egypt: Guardians of the Afterlife',
    description,
    url: `${SITE_URL}/exhibitions/egypt`,
  },
};

export default function EgyptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
