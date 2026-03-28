'use client';
import CoinViewer from '../../coin-viewer';
import { case6Coins } from '../../coin-data';

export default function AretasPage() {
  const coin = case6Coins.find(c => c.id === 'aretas')!;
  return <CoinViewer coin={coin} backRoute="/exhibitions/in-their-hands/artifacts/case-6" backLabel="Case 6" />;
}
