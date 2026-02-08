import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jazz Lab | The Harlem Renaissance | The Mini Museum',
  description:
    'Build your own jazz band and test your ear in the Jazz Lab. Mix instruments, hear different jazz sounds, and learn about the instruments that defined the Harlem Renaissance.',
  keywords: [
    'jazz',
    'Harlem Renaissance',
    'music',
    'interactive',
    'instruments',
    'piano',
    'trumpet',
    'saxophone',
    'clarinet',
    'drums',
    'bass',
  ],
  openGraph: {
    title: 'Jazz Lab | The Harlem Renaissance',
    description: 'Build your own jazz band and test your ear in the Jazz Lab.',
  },
};

export default function JazzLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
