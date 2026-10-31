import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const description = 'Type the same line on a mechanical typewriter and on an iMac word processor, and try the top-row challenge.';

export const metadata: Metadata = {
  title: 'The Typing Station | The Writing Revolution | The Mini Museum',
  description,
  openGraph: {
    title: 'The Typing Station | The Writing Revolution',
    description,
    url: `${SITE_URL}/exhibitions/writing-revolution/typing-station`,
  },
};

export default function TypingStationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
