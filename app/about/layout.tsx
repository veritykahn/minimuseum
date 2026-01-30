import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | The Mini Museum',
  description:
    'Learn about The Mini Museum - a network of monthly curated exhibitions bringing real artifacts and primary sources to schools and libraries.',
  openGraph: {
    title: 'About The Mini Museum',
    description:
      'Discovery comes before knowledge. Wonder precedes learning. Monthly curated exhibitions for schools and libraries.',
    url: 'https://minimuseumproject.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
