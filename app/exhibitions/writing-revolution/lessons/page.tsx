import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/writing-revolution/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · The Writing Revolution lessons | The Mini Museum',
  description:
    'Run a Writing Revolution lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · The Writing Revolution',
    description: 'The Writing Revolution lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('writing-revolution')}
      basePath={BASE}
      exhibitionHref="/exhibitions/writing-revolution"
      resourcesHref="/resources"
      exhibitionName="The Writing Revolution"
    />
  );
}
