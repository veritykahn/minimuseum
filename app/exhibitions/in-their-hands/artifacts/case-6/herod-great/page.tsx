'use client';
import CoinViewer from '../../coin-viewer';
import { case6Coins } from '../../coin-data';

export default function HerodGreatPage() {
  const coin = case6Coins.find(c => c.id === 'herod-great')!;
  return <CoinViewer coin={coin} backRoute="/exhibitions/in-their-hands/artifacts/case-6" backLabel="Case 6" />;
}
