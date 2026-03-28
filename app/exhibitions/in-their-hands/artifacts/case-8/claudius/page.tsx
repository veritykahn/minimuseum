'use client';
import CoinViewer from '../../coin-viewer';
import { case8Coins } from '../../coin-data';

export default function ClaudiusPage() {
  const coin = case8Coins.find(c => c.id === 'claudius')!;
  return <CoinViewer coin={coin} backRoute="/exhibitions/in-their-hands/artifacts/case-8" backLabel="Case 8" />;
}
