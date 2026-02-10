import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Phonograph & Bessie Smith 78 | The Mini Museum',
  description: 'Explore a 1930s electric phonograph and listen to original Bessie Smith 78 RPM recordings from the Harlem Renaissance.',
};

export default function PhonographLayout({ children }: { children: React.ReactNode }) {
  return children;
}
