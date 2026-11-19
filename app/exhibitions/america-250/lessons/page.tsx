import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/america-250/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · America 250 lessons | The Mini Museum',
  description:
    'Run an America 250 lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · America 250',
    description: 'America 250 lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('america-250')}
      basePath={BASE}
      exhibitionHref="/exhibitions/america-250"
      resourcesHref="/resources"
      exhibitionName="America 250"
    />
  );
}
