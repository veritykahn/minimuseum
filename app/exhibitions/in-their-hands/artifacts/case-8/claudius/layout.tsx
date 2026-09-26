import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(8, 'claudius');

export default function ClaudiusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
