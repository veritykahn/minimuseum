import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Real or Replica? | In Their Hands | The Mini Museum',
  description:
    'Which is the fake? Examine ancient coins like a numismatist and decide which are authentic and which are replicas.',
  openGraph: {
    title: 'Real or Replica? | In Their Hands',
    description:
      'Which is the fake? Examine ancient coins like a numismatist and decide which are authentic and which are replicas.',
    url: `${SITE_URL}/exhibitions/in-their-hands/real-or-replica`,
  },
};

export default function RealOrReplicaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
