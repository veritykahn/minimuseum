import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(6, 'augustus');

export default function AugustusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
