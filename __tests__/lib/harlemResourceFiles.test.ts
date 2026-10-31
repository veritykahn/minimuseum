/**
 * Every printable the Harlem Renaissance resources page and "Teach with this"
 * sheet link to is a file in public/, at the path the page builds for it.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  LIBRARIAN_HANDOUTS,
  LIBRARIAN_LESSON_PLANS,
  PARENT_RESOURCE_PATH,
  SUBJECT_HANDOUTS,
  SUBJECT_LESSON_PLANS,
  TEACHER_HANDOUTS,
  TEACHER_LESSON_PLANS,
} from '@/app/exhibitions/harlem-renaissance/resources/data/resource-data';
import { printablesFor, TEACH_ROLES } from '@/lib/lessons/teach';

const PUBLIC = join(process.cwd(), 'public');
const BASE = '/resources/harlem-renaissance';

function paths(): string[] {
  const out: string[] = [PARENT_RESOURCE_PATH, `${BASE}/Using Differentiated Student Handouts.pdf`];
  for (const [grade, file] of Object.entries(TEACHER_LESSON_PLANS)) out.push(`${BASE}/teachers/${grade}/${file}`);
  for (const [grade, files] of Object.entries(TEACHER_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/teachers/${grade}/${f}`);
  for (const [subject, file] of Object.entries(SUBJECT_LESSON_PLANS)) out.push(`${BASE}/teachers/grades-5-8/${subject}/${file}`);
  for (const [subject, files] of Object.entries(SUBJECT_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/teachers/grades-5-8/${subject}/${f}`);
  for (const [grade, file] of Object.entries(LIBRARIAN_LESSON_PLANS)) out.push(`${BASE}/librarians/${grade}/${file}`);
  for (const [grade, files] of Object.entries(LIBRARIAN_HANDOUTS)) for (const f of Object.values(files)) out.push(`${BASE}/librarians/${grade}/${f}`);
  for (const role of TEACH_ROLES) for (const p of printablesFor('harlem-renaissance', role.id)) if (p.file) out.push(p.href);
  return [...new Set(out)];
}

describe('Harlem Renaissance printables', () => {
  it.each(paths())('%s is in public/', (p) => {
    expect(existsSync(join(PUBLIC, p))).toBe(true);
  });
});
