import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Case 7: Coins from Jesus' Ministry and Passion | In Their Hands | The Mini Museum",
  description:
    "The widow's mite, the tribute penny, the shekel of Tyre, and the coins of Pontius Pilate and Herod Antipas, with the Gospel passages they belong to.",
  openGraph: {
    title: "Case 7: Coins from Jesus' Ministry and Passion | In Their Hands",
    description:
      "The widow's mite, the tribute penny, the shekel of Tyre, and the coins of Pontius Pilate and Herod Antipas, with the Gospel passages they belong to.",
    url: `${SITE_URL}/exhibitions/in-their-hands/artifacts/case-7`,
  },
};

export default function Case7Layout({ children }: { children: React.ReactNode }) {
  return children;
}
