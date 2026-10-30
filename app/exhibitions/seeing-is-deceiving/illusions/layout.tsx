import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perception Lab | Seeing is Deceiving | The Mini Museum',
  description:
    'You are the scientist: measure how much 19 optical illusions fool you, switch each trick off, and print your Lab Notebook and Illusion Fingerprint. Every explanation comes with its source.',
  keywords: [
    'optical illusions',
    'checker shadow illusion',
    'fraser spiral',
    'muller-lyer illusion',
    'visual perception',
    'brain tricks',
    'interactive',
  ],
  openGraph: {
    title: 'Perception Lab | Seeing is Deceiving',
    description:
      'Measure how much 19 optical illusions fool you, switch each trick off, and see the science behind each one, with its source.',
    url: `${SITE_URL}/exhibitions/seeing-is-deceiving/illusions`,
  },
};

export default function IllusionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
