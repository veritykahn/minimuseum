import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = "Moon dust beside Earth's soil under a microscope: focus the slide, change the power, and wipe it with a cloth.";

export const metadata: Metadata = {
  title: 'Under the Microscope | Our Incredible Moon | The Mini Museum',
  description,
  openGraph: {
    title: 'Under the Microscope | Our Incredible Moon',
    description,
    url: `${SITE_URL}/exhibitions/moon/microscope`,
  },
};

export default function MoonMicroscopeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
