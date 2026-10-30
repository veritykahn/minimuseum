/**
 * "Teach with this": what an exhibition offers each kind of visitor who
 * teaches with it. The visitor says who they are (a teacher, a librarian, a
 * parent or homeschooler) and the sheet shows the materials for that role,
 * in groups: presenting the posters, lessons by grade, printables and
 * discussion questions.
 *
 * Which lessons suit a role is read from the lesson catalog's own metadata
 * (its grade band and subject); where that is not enough, the small tables
 * below say so explicitly. Nothing here writes lesson content.
 */

import { catalogFor, lessonPath, lessonsPath, type LessonCard } from './catalog';

export type TeachRole = 'teacher' | 'librarian' | 'parent';

export const TEACH_ROLES: { id: TeachRole; label: string; hint: string; heading: string }[] = [
  { id: 'teacher', label: 'Teacher', hint: 'A class in school', heading: 'For teachers' },
  { id: 'librarian', label: 'Librarian', hint: 'A library visit or class', heading: 'For librarians' },
  { id: 'parent', label: 'Parent / homeschool', hint: 'Learning at home', heading: 'For parents and homeschoolers' },
];

export const isTeachRole = (v: unknown): v is TeachRole => v === 'teacher' || v === 'librarian' || v === 'parent';

/** The role a visitor chose, kept for the visit (the sheet asks again in a new tab). */
export const TEACH_ROLE_KEY = 'mm-teach-role';

export function readTeachRole(): TeachRole | null {
  try {
    const v = sessionStorage.getItem(TEACH_ROLE_KEY);
    return isTeachRole(v) ? v : null;
  } catch {
    return null;
  }
}

export function writeTeachRole(role: TeachRole | null) {
  try {
    if (role) sessionStorage.setItem(TEACH_ROLE_KEY, role);
    else sessionStorage.removeItem(TEACH_ROLE_KEY);
  } catch {
    /* storage unavailable: the sheet simply asks again next time */
  }
}

/* ───────── Lessons ───────── */

/** The grade bands, youngest first, as the catalog writes them. */
export const GRADE_BANDS = ['PreK–K', 'Grades 1–2', 'Grades 3–4', 'Grades 5–8'] as const;

/** "Grades 5–8 · Religion" → band "Grades 5–8", subject "Religion"; the younger lessons have no subject. */
export function gradeParts(card: LessonCard): { band: string; subject: string | null } {
  const [band, subject] = card.grade.split(' · ');
  return { band: band.trim(), subject: subject?.trim() || null };
}

/**
 * The subjects a librarian teaches: research, reading and evidence. The
 * general (homeroom) lessons for the younger grades are library lessons too.
 * A librarian can still open every lesson from the sheet.
 */
export const LIBRARY_SUBJECTS = ['ELA', 'Social Studies'];

export function suitsRole(card: LessonCard, role: TeachRole): boolean {
  if (role !== 'librarian') return true; // a teacher, or a homeschool, teaches every subject
  const { subject } = gradeParts(card);
  return subject === null || LIBRARY_SUBJECTS.includes(subject);
}

export type LessonGroup = { band: string; lessons: LessonCard[] };

/** The lessons for a role, grouped by grade band, youngest first, in the catalog's order within a band. */
export function lessonsByGrade(exhibition: string, role: TeachRole): LessonGroup[] {
  const mine = catalogFor(exhibition).filter((c) => suitsRole(c, role));
  const bands = [...GRADE_BANDS, ...new Set(mine.map((c) => gradeParts(c).band))].filter((b, i, all) => all.indexOf(b) === i);
  return bands
    .map((band) => ({ band, lessons: mine.filter((c) => gradeParts(c).band === band) }))
    .filter((g) => g.lessons.length > 0);
}

export { lessonPath, lessonsPath };

/* ───────── Printables ───────── */

export type Printable = { label: string; detail: string; href: string; roles: TeachRole[]; file?: boolean };

const RESOURCES: Record<string, { guide: string; handoutsGuide: string; parentGuide: string; library: boolean }> = {
  'in-their-hands': {
    guide: '/resources/in-their-hands/ITH_Teaching_Guide.pdf',
    handoutsGuide: '/resources/in-their-hands/Using Differentiated Student Handouts.pdf',
    parentGuide: '/resources/in-their-hands/parents/ITH_Parent_Guide.pdf',
    library: false,
  },
  'harlem-renaissance': {
    guide: '/resources/harlem-renaissance/HR_Teaching_Guide.pdf',
    handoutsGuide: '/resources/harlem-renaissance/Using Differentiated Student Handouts.pdf',
    parentGuide: '/resources/harlem-renaissance/parents/HR_Parent_Guide.pdf',
    library: true,
  },
  'seeing-is-deceiving': {
    guide: '/resources/seeing-is-deceiving/Teaching Guide_ Optical Illusions & Visual Deception.pdf',
    handoutsGuide: '/resources/seeing-is-deceiving/Using Differentiated Student Handouts.pdf',
    parentGuide: '/resources/seeing-is-deceiving/parents/Parent Resource Guide_ Optical Illusions & Visual Deception.pdf',
    library: true,
  },
};

export const resourcesPath = (exhibition: string) => `/exhibitions/${exhibition}/resources`;

/** The exhibition's printable materials for a role: the PDFs its resources page offers, and that page itself. */
export function printablesFor(exhibition: string, role: TeachRole): Printable[] {
  const r = RESOURCES[exhibition];
  if (!r) return [];
  const all: Printable[] = [
    {
      label: 'Lesson plans and student handouts',
      detail: 'By grade and subject, each in three levels',
      href: resourcesPath(exhibition),
      roles: ['teacher', 'parent'],
    },
    ...(r.library
      ? [{ label: 'Library lesson plans and handouts', detail: 'By grade, for a library visit', href: resourcesPath(exhibition), roles: ['librarian'] as TeachRole[] }]
      : []),
    { label: 'Parent Resource Guide', detail: 'PDF · Activities and conversation starters', href: r.parentGuide, roles: ['parent'], file: true },
    { label: 'Quick Teaching Guide', detail: 'PDF · Overview and key concepts', href: r.guide, roles: ['teacher', 'librarian', 'parent'], file: true },
    {
      label: 'Teacher Explanation Sheet',
      detail: 'PDF · Using the differentiated handouts',
      href: r.handoutsGuide,
      roles: ['teacher', 'librarian'],
      file: true,
    },
  ];
  return all.filter((p) => p.roles.includes(role));
}

/** Pages the sheet already lists as printables, so the classroom links do not repeat them. */
export function isResourcesLink(exhibition: string, href: string) {
  return href === resourcesPath(exhibition);
}

/* ───────── The order of the groups ───────── */

export type TeachSection = 'present' | 'lessons' | 'printables' | 'discussion' | 'interactives';

/** A parent leads with talking and the guide; a class leads with the screen. */
export const SECTION_ORDER: Record<TeachRole, TeachSection[]> = {
  teacher: ['present', 'lessons', 'printables', 'discussion', 'interactives'],
  librarian: ['present', 'lessons', 'printables', 'discussion', 'interactives'],
  parent: ['discussion', 'printables', 'lessons', 'present', 'interactives'],
};
