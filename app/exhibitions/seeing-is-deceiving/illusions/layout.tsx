import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Optical Illusions | The Mini Museum',
  description:
    'Test your perception with 25+ interactive optical illusions. Experience the Checker Shadow, Fraser Spiral, Hermann Grid, and more. Learn the science behind each illusion.',
  keywords: [
    'optical illusions',
    'checker shadow illusion',
    'fraser spiral',
    'hermann grid',
    'visual perception',
    'brain tricks',
    'interactive',
  ],
  openGraph: {
    title: 'Interactive Optical Illusions',
    description:
      'Test your perception with 25+ interactive optical illusions and learn the science behind each one.',
    url: 'https://minimuseumproject.com/exhibitions/seeing-is-deceiving/illusions',
  },
};

export default function IllusionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
