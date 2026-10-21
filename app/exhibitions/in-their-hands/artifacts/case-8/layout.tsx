import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Case 8: Coins from the Early Church | In Their Hands | The Mini Museum',
  description:
    'Coins of Herod Agrippa I, Emperor Claudius and Porcius Festus from the world of the Apostles and the Acts of the Apostles.',
  openGraph: {
    title: 'Case 8: Coins from the Early Church | In Their Hands',
    description:
      'Coins of Herod Agrippa I, Emperor Claudius and Porcius Festus from the world of the Apostles and the Acts of the Apostles.',
    url: `${SITE_URL}/exhibitions/in-their-hands/artifacts/case-8`,
  },
};

export default function Case8Layout({ children }: { children: React.ReactNode }) {
  return children;
}
