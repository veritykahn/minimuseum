import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/black-history/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Black History Month lessons | The Mini Museum',
  description:
    'Run a Black History Month lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Black History Month',
    description: 'Black History Month lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('black-history')}
      basePath={BASE}
      exhibitionHref="/exhibitions/black-history"
      resourcesHref="/resources"
      exhibitionName="Black History Month"
    />
  );
}
