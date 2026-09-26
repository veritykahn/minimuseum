import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(8, 'festus');

export default function FestusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
