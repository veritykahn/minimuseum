import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Twirl a thaumatrope and spin a zoetrope: pictures of the Christmas tree, the railway, the fireside, snow on a village and a dancer in a crinoline.';

export const metadata: Metadata = {
  title: 'Optical Toys | Victorian Britain | The Mini Museum',
  description,
  openGraph: {
    title: 'Optical Toys | Victorian Britain',
    description,
    url: `${SITE_URL}/exhibitions/victorian/optical-toys`,
  },
};

export default function VictorianOpticalToysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
