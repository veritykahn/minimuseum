import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Harlem Renaissance | The Mini Museum',
  description:
    'Explore the Great Migration and the Harlem Renaissance. Discover how over one million Black Americans transformed American culture through literature, art, music, and activism.',
  keywords: [
    'Harlem Renaissance',
    'Great Migration',
    'African American history',
    'Black culture',
    'museum exhibition',
    'education',
    'Walter White',
    'Langston Hughes',
  ],
  openGraph: {
    title: 'The Harlem Renaissance Exhibition',
    description:
      'The Great Migration and the cultural revolution that reshaped America.',
    url: 'https://minimuseumproject.com/exhibitions/harlem-renaissance',
  },
};

export default function HarlemRenaissanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
