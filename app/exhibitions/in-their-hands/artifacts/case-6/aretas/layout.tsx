import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(6, 'aretas');

export default function AretasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
