import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educational Resources | The Mini Museum',
  description:
    'Free downloadable lesson plans and student handouts for teachers and families. Resources for grades PreK-8 on In Their Hands: the coins of the New Testament.',
  keywords: [
    'lesson plans',
    'teacher resources',
    'student handouts',
    'New Testament coins curriculum',
    'education',
    'free downloads',
  ],
  openGraph: {
    title: 'Educational Resources | In Their Hands',
    description:
      'Free lesson plans and handouts for teachers and families. Grades PreK-8.',
    url: `${SITE_URL}/exhibitions/in-their-hands/resources`,
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
