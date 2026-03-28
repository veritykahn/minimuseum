'use client';
import CoinViewer from '../../coin-viewer';
import { case7Coins } from '../../coin-data';

export default function PilatePage() {
  const coin = case7Coins.find(c => c.id === 'pilate')!;
  return <CoinViewer coin={coin} backRoute="/exhibitions/in-their-hands/artifacts/case-7" backLabel="Case 7" />;
}
