import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(7, 'antipas');

export default function AntipasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
