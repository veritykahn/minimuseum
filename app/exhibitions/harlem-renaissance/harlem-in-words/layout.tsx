import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harlem in Words | The Mini Museum',
  description: 'Compose poetry from the language of the Harlem Renaissance \u2014 drag words, build verses, and hear your poem read aloud.',
};

export default function HarlemInWordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
