import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/seeing-is-deceiving/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Seeing is Deceiving lessons | The Mini Museum',
  description:
    'Run a Seeing is Deceiving lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Seeing is Deceiving',
    description: 'Seeing is Deceiving lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('seeing-is-deceiving')}
      basePath={BASE}
      exhibitionHref="/exhibitions/seeing-is-deceiving"
      resourcesHref="/exhibitions/seeing-is-deceiving/resources"
      exhibitionName="Seeing is Deceiving"
    />
  );
}
