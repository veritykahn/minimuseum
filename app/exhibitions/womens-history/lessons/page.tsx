import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/womens-history/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Women’s History Month lessons | The Mini Museum',
  description:
    'Run a Women’s History Month lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Women’s History Month',
    description: 'Women’s History Month lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('womens-history')}
      basePath={BASE}
      exhibitionHref="/exhibitions/womens-history"
      resourcesHref="/resources"
      exhibitionName="Women’s History Month"
    />
  );
}
