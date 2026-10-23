import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLesson, lessonsFor } from '@/lib/lessons';
import { PresenterView } from '@/components/lesson/PresenterView';

const EXHIBITION = 'seeing-is-deceiving';
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
  return {
    title: `Presenter · ${lesson.title} | The Mini Museum`,
    // the teacher's notes are a tool, not a page to find in search
    robots: { index: false, follow: true },
  };
}

export default async function PresenterPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(EXHIBITION, slug);
  if (!lesson) notFound();
  return <PresenterView lesson={lesson} basePath={BASE} />;
}
