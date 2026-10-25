import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = "The science of being scared and why we just can't put our horror books down.";

export const metadata: Metadata = {
  title: 'The Fear Lab: Page Turners & Spine Tinglers | The Mini Museum',
  description,
  openGraph: {
    title: 'The Fear Lab: Page Turners & Spine Tinglers',
    description,
    url: `${SITE_URL}/exhibitions/fear-lab`,
  },
};

export default function FearLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
