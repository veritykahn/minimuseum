import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/harlem-renaissance/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Harlem Renaissance lessons | The Mini Museum',
  description:
    'Run a Harlem Renaissance lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · The Harlem Renaissance',
    description: 'Harlem Renaissance lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('harlem-renaissance')}
      basePath={BASE}
      exhibitionHref="/exhibitions/harlem-renaissance"
      resourcesHref="/exhibitions/harlem-renaissance/resources"
      exhibitionName="The Harlem Renaissance"
    />
  );
}
