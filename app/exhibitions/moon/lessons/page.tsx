import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { lessonsFor } from '@/lib/lessons';
import { LessonIndex } from '@/components/lesson/LessonIndex';

const BASE = '/exhibitions/moon/lessons';

export const metadata: Metadata = {
  title: 'Teach on screen · Our Incredible Moon lessons | The Mini Museum',
  description:
    'Run an Our Incredible Moon lesson from the classroom projector, step by step, with a presenter view for the teacher’s script, timer and handouts.',
  openGraph: {
    title: 'Teach on screen · Our Incredible Moon',
    description: 'Our Incredible Moon lessons, ready to run on the classroom projector.',
    url: `${SITE_URL}${BASE}`,
  },
};

export default function LessonsPage() {
  return (
    <LessonIndex
      lessons={lessonsFor('moon')}
      basePath={BASE}
      exhibitionHref="/exhibitions/moon"
      resourcesHref="/resources"
      exhibitionName="Our Incredible Moon"
    />
  );
}
