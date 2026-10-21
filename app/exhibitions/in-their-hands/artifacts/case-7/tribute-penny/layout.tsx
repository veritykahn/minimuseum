import { coinMetadata } from '../../coin-metadata';

export const metadata = coinMetadata(7, 'tribute-penny');

export default function TributePennyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
