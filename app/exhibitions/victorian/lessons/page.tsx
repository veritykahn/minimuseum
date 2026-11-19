import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/victorian/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Victorian Britain lessons | The Mini Museum',
  description:
    'Run a Victorian Britain lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Victorian Britain',
    description: 'Victorian Britain lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('victorian')}
      basePath={BASE}
      exhibitionHref="/exhibitions/victorian"
      resourcesHref="/resources"
      exhibitionName="Victorian Britain"
    />
  );
}
