import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Eleven American servicemen of the Great War, a field of poppies placed by visitors, and two minutes’ silence at 11:00.';

export const metadata: Metadata = {
  title: 'The Memorial | The Great War | The Mini Museum',
  description,
  openGraph: {
    title: 'The Memorial | The Great War',
    description,
    url: `${SITE_URL}/exhibitions/great-war/memorial`,
  },
};

export default function GreatWarMemorialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
