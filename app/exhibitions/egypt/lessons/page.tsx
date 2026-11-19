import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/egypt/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Ancient Egypt lessons | The Mini Museum',
  description:
    'Run an Ancient Egypt lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Ancient Egypt',
    description: 'Ancient Egypt lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('egypt')}
      basePath={BASE}
      exhibitionHref="/exhibitions/egypt"
      resourcesHref="/resources"
      exhibitionName="Ancient Egypt"
    />
  );
}
