import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/in-their-hands/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · In Their Hands lessons | The Mini Museum',
  description:
    'Run an In Their Hands lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · In Their Hands',
    description: 'In Their Hands lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('in-their-hands')}
      basePath={BASE}
      exhibitionHref="/exhibitions/in-their-hands"
      resourcesHref="/exhibitions/in-their-hands/resources"
      exhibitionName="In Their Hands"
    />
  );
}
