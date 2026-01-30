import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seeing is Deceiving | The Mini Museum',
  description:
    'Explore optical illusions and visual perception. Learn how your brain interprets reality through interactive exhibits, historical artifacts, and the science of deception.',
  keywords: [
    'optical illusions',
    'visual perception',
    'brain science',
    'museum exhibition',
    'education',
    'interactive learning',
  ],
  openGraph: {
    title: 'Seeing is Deceiving Exhibition',
    description:
      'The Science of How We See - Interactive optical illusions and the history of visual deception.',
    url: 'https://minimuseumproject.com/exhibitions/seeing-is-deceiving',
  },
};

export default function SeeingIsDeceivingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
