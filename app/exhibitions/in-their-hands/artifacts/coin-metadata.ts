import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { case6Coins, case7Coins, case8Coins } from './coin-data';

const cases = { 6: case6Coins, 7: case7Coins, 8: case8Coins } as const;

/** Title and description for a coin page, built from its entry in coin-data. */
export function coinMetadata(caseNumber: 6 | 7 | 8, id: string): Metadata {
  const coin = cases[caseNumber].find((c) => c.id === id);
  if (!coin) return {};
  const title = `${coin.title}, ${coin.date} | In Their Hands | The Mini Museum`;
  const text = coin.description[0] ?? '';
  const description = text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text;
  return {
    title,
    description,
    openGraph: {
      title: `${coin.title}, ${coin.date}`,
      description,
      url: `${SITE_URL}/exhibitions/in-their-hands/artifacts/case-${caseNumber}/${id}`,
      images: [coin.frontImage],
    },
  };
}
