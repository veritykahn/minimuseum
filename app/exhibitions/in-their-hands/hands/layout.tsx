import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Whose Hands Held This? | In Their Hands | The Mini Museum',
  description:
    'Match each coin to the people of the Gospels who could have held it.',
  openGraph: {
    title: 'Whose Hands Held This? | In Their Hands',
    description:
      'Match each coin to the people of the Gospels who could have held it.',
    url: `${SITE_URL}/exhibitions/in-their-hands/hands`,
  },
};

export default function WhoseHandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
