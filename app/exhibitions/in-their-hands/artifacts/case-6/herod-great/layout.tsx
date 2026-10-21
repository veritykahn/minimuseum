import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(6, 'herod-great');

export default function HerodGreatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
