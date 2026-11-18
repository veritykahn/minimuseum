import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | The Mini Museum',
  description:
    'Free lesson plans and printables from every Mini Museum exhibition, for teachers, librarians, parents and homeschoolers, grades PreK–8. Choose who you are and your grade, and find your lesson.',
  openGraph: {
    title: 'Resources | The Mini Museum',
    description: 'Lesson plans and printables from every exhibition, for teachers, librarians and families.',
    url: `${SITE_URL}/resources`,
  },
};

export default function ResourcesHubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
