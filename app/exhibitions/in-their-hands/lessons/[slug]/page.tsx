import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/site';
import { getLesson, lessonsFor } from '@/lib/lessons';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import { plain } from '@/components/lesson/Inline';

const EXHIBITION = 'in-their-hands';
const BASE = `/exhibitions/${EXHIBITION}/lessons`;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return lessonsFor(EXHIBITION).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(EXHIBITION, slug);
  if (!lesson) return {};
  const description = plain(lesson.objective[0] ?? lesson.sub);
  return {
    title: `${lesson.title} · Teach on screen | The Mini Museum`,
    description,
    openGraph: {
      title: `${lesson.title} · In Their Hands lesson`,
      description,
      url: `${SITE_URL}${BASE}/${lesson.slug}`,
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(EXHIBITION, slug);
  if (!lesson) notFound();
  return <ClassroomView lesson={lesson} basePath={BASE} />;
}
