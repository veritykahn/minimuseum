import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'The first motion pictures: twirl a thaumatrope and the bird appears inside its cage; spin a zoetrope and horses gallop, people dance. Both start slowly, so you can see how they work.';

export const metadata: Metadata = {
  title: 'Optical Toys | Seeing is Deceiving | The Mini Museum',
  description,
  openGraph: {
    title: 'Optical Toys | Seeing is Deceiving',
    description,
    url: `${SITE_URL}/exhibitions/seeing-is-deceiving/optical-toys`,
  },
};

export default function SeeingOpticalToysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
