import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/great-war/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · The Great War lessons | The Mini Museum',
  description:
    'Run a Great War lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · The Great War',
    description: 'The Great War lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('great-war')}
      basePath={BASE}
      exhibitionHref="/exhibitions/great-war"
      resourcesHref="/resources"
      exhibitionName="The Great War"
    />
  );
}
