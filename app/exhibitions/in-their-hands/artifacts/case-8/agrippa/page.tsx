'use client';
import CoinViewer from '../../coin-viewer';
import { case8Coins } from '../../coin-data';

export default function AgrippaPage() {
  const coin = case8Coins.find(c => c.id === 'agrippa')!;
  return <CoinViewer coin={coin} backRoute="/exhibitions/in-their-hands/artifacts/case-8" backLabel="Case 8" />;
}
