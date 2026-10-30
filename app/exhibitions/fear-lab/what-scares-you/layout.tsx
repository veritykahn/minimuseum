import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'A lab for school students: open the fear boxes, choose between the known and the unknown, and test your nerve with the rustling bushes.';

export const metadata: Metadata = {
  title: 'What Scares You? | The Fear Lab | The Mini Museum',
  description,
  openGraph: {
    title: 'What Scares You? | The Fear Lab',
    description,
    url: `${SITE_URL}/exhibitions/fear-lab/what-scares-you`,
  },
};

export default function WhatScaresYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
