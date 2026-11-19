import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/fear-lab/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · The Fear Lab lessons | The Mini Museum',
  description:
    'Run a Fear Lab lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · The Fear Lab',
    description: 'The Fear Lab lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('fear-lab')}
      basePath={BASE}
      exhibitionHref="/exhibitions/fear-lab"
      resourcesHref="/resources"
      exhibitionName="The Fear Lab"
    />
  );
}
