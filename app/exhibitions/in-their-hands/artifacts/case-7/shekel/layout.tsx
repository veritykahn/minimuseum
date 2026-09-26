import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(7, 'shekel');

export default function ShekelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
