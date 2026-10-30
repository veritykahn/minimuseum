import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = "Use a microscope like a scientist: wipe the slide, place a sample of Moon dust or Earth's soil, focus, change lenses and move the slide.";

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
