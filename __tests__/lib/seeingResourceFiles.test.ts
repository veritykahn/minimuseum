/**
 * Every printable the Seeing is Deceiving resources page, "Teach with this"
 * sheet and lessons link to is a file in public/, at the path the page builds
 * for it. And no printable anywhere has a comma or "&" in its name: those
 * make links that break when pasted or emailed.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  LIBRARIAN_HANDOUTS,
  LIBRARIAN_LESSON_PLANS,
  PARENT_RESOURCE_PATH,
  SUBJECT_HANDOUTS,
  SUBJECT_LESSON_PLANS,
  TEACHER_HANDOUTS,
  TEACHER_LESSON_PLANS,
} from '@/app/exhibitions/seeing-is-deceiving/resources/data/resource-data';
import { printablesFor, TEACH_ROLES } from '@/lib/lessons/teach';

const PUBLIC = join(process.cwd(), 'public');
const BASE = '/resources/seeing-is-deceiving';
const LESSONS = join(process.cwd(), 'lib', 'lessons', 'seeing-is-deceiving');

function paths(): string[] {
  const out: string[] = [
    PARENT_RESOURCE_PATH,
    `${BASE}/Teaching-Guide-Optical-Illusions-and-Visual-Deception.pdf`,
    `${BASE}/Using Differentiated Student Handouts.pdf`,
  ];
  for (const [grade, file] of Object.entries(TEACHER_LESSON_PLANS)) out.push(`${BASE}/teachers/${grade}/${file}`);
  for (const [grade, files] of Object.entries(TEACHER_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/teachers/${grade}/${f}`);
  for (const [subject, file] of Object.entries(SUBJECT_LESSON_PLANS)) out.push(`${BASE}/teachers/grades-5-8/${subject}/${file}`);
  for (const [subject, files] of Object.entries(SUBJECT_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/teachers/grades-5-8/${subject}/${f}`);
  for (const [grade, file] of Object.entries(LIBRARIAN_LESSON_PLANS)) out.push(`${BASE}/librarians/${grade}/${file}`);
  for (const [grade, files] of Object.entries(LIBRARIAN_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/librarians/${grade}/${f}`);
  for (const role of TEACH_ROLES) for (const p of printablesFor('seeing-is-deceiving', role.id)) if (p.file) out.push(p.href);
  for (const f of readdirSync(LESSONS).filter((n) => n.endsWith('.json'))) {
    const lesson = JSON.parse(readFileSync(join(LESSONS, f), 'utf8')) as { lessonPlan?: string };
    if (lesson.lessonPlan) out.push(lesson.lessonPlan);
  }
  return [...new Set(out)];
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('Seeing is Deceiving printables', () => {
  it.each(paths())('%s is in public/', (p) => {
    expect(existsSync(join(PUBLIC, p))).toBe(true);
  });

  it('has no file in public/ with a comma or "&" in its name', () => {
    const bad = walk(PUBLIC).filter((p) => /[,&]/.test(p.slice(PUBLIC.length)));
    expect(bad).toEqual([]);
  });
});
