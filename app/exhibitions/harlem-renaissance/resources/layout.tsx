import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educational Resources | The Mini Museum',
  description:
    'Free downloadable lesson plans and student handouts for teachers, librarians, and parents. Resources for grades PreK-8 covering the Harlem Renaissance.',
  keywords: [
    'lesson plans',
    'teacher resources',
    'librarian resources',
    'student handouts',
    'Harlem Renaissance curriculum',
    'education',
    'free downloads',
  ],
  openGraph: {
    title: 'Educational Resources | The Harlem Renaissance',
    description:
      'Free lesson plans and handouts for teachers, librarians, and parents. Grades PreK-8.',
    url: 'https://minimuseumproject.com/exhibitions/harlem-renaissance/resources',
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
