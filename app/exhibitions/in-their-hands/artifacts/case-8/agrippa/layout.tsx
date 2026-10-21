import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(8, 'agrippa');

export default function AgrippaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
