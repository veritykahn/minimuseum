import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(7, 'pilate');

export default function PilateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
