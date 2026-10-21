import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(7, 'widow-mite');

export default function WidowMiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
