import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Great Migration Map | The Mini Museum',
  description: 'Follow the music north \u2014 trace the journey of the Great Migration from the Mississippi Delta to Harlem.',
};

export default function MigrationMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
