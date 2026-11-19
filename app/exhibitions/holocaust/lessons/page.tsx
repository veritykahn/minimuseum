import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/holocaust/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · International Holocaust Remembrance Day lessons | The Mini Museum',
  description:
    'Run an International Holocaust Remembrance Day lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · International Holocaust Remembrance Day',
    description: 'International Holocaust Remembrance Day lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('holocaust')}
      basePath={BASE}
      exhibitionHref="/exhibitions/holocaust"
      resourcesHref="/resources"
      exhibitionName="International Holocaust Remembrance Day"
    />
  );
}
