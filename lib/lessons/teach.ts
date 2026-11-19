/**
 * "Teach with this", and the Resources hub (/resources): what an exhibition
 * offers each kind of visitor who teaches with it. The visitor says who they
 * are (a teacher, a librarian, a parent or a homeschool), then the lesson
 * finder asks one more thing, their grade (and, for grades 5–8, their
 * subject), and shows just their lesson: to run on a screen, or to print.
 *
 * Which lessons suit a role is read from the lesson catalog's own metadata
 * (its grade band and subject); which files print with a lesson is read from
 * each exhibition's resources data (app/exhibitions/<slug>/resources/data),
 * the same tables its resources page reads. Nothing here writes lesson
 * content. The sheet's look comes from teachTheme(), from the room's own
 * colours.
 */

import * as HARLEM from '@/app/exhibitions/harlem-renaissance/resources/data/resource-data';
import * as ITH from '@/app/exhibitions/in-their-hands/resources/data/resource-data';
import * as SEEING from '@/app/exhibitions/seeing-is-deceiving/resources/data/resource-data';
// <every-exhibition-data>
import * as MOON from '@/app/exhibitions/moon/resources/data/resource-data';
import * as EGY from '@/app/exhibitions/egypt/resources/data/resource-data';
import * as A250 from '@/app/exhibitions/america-250/resources/data/resource-data';
import * as VIC from '@/app/exhibitions/victorian/resources/data/resource-data';
import * as GW from '@/app/exhibitions/great-war/resources/data/resource-data';
import * as WH from '@/app/exhibitions/womens-history/resources/data/resource-data';
import * as HOL from '@/app/exhibitions/holocaust/resources/data/resource-data';
import * as BH from '@/app/exhibitions/black-history/resources/data/resource-data';
import * as WR from '@/app/exhibitions/writing-revolution/resources/data/resource-data';
import * as FL from '@/app/exhibitions/fear-lab/resources/data/resource-data';
// </every-exhibition-data>
import { catalogFor, lessonPath, lessonsPath, type LessonCard } from './catalog';

export { lessonPath, lessonsPath };

/* ───────── Who is teaching ───────── */

export type TeachRole = 'teacher' | 'librarian' | 'parent' | 'homeschool';

export type TeachRoleInfo = {
  id: TeachRole;
  label: string;
  hint: string;
  /** The lesson finder's question. */
  ask: string;
};

export const TEACH_ROLES: TeachRoleInfo[] = [
  { id: 'teacher', label: 'Teacher', hint: 'A class in school', ask: 'What grade do you teach?' },
  { id: 'librarian', label: 'Librarian', hint: 'A library visit or class', ask: 'Which grade is coming to the library?' },
  { id: 'parent', label: 'Parent', hint: 'Exploring together at home', ask: 'What grade is your child in?' },
  { id: 'homeschool', label: 'Homeschool', hint: 'Teaching every subject at home', ask: 'What grade are you teaching?' },
];

export const isTeachRole = (v: unknown): v is TeachRole => TEACH_ROLES.some((r) => r.id === v);

export const roleInfo = (role: TeachRole) => TEACH_ROLES.find((r) => r.id === role)!;

/** The role a visitor chose, kept for the visit (the sheet asks again in a new tab). */
export const TEACH_ROLE_KEY = 'mm-teach-role';

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the sheet simply asks again next time */
  }
}

export function readTeachRole(): TeachRole | null {
  const v = readSession(TEACH_ROLE_KEY);
  return isTeachRole(v) ? v : null;
}

export function writeTeachRole(role: TeachRole | null) {
  writeSession(TEACH_ROLE_KEY, role);
}

/* ───────── Faith-based lessons ───────── */

/**
 * How faith-based lessons (catalog `faith: true`) are offered. Verity's
 * answer is pending; this one constant is the whole decision:
 *   'switch-off'  a switch in the lesson finder, off until the visitor turns it on (the default)
 *   'switch-on'   the same switch, on until the visitor turns it off
 *   'always'      no switch; faith-based lessons always show, labelled
 *   'never'       no switch; faith-based lessons never show
 */
export type FaithMode = 'switch-off' | 'switch-on' | 'always' | 'never';
export const FAITH_LESSONS: FaithMode = 'switch-off';

/** The switch's choice, kept for the visit. */
export const TEACH_FAITH_KEY = 'mm-teach-faith';

export const faithSwitchShown = (mode: FaithMode = FAITH_LESSONS) => mode === 'switch-off' || mode === 'switch-on';

/** Whether faith-based lessons show now: the visitor's choice for the visit, else the mode's. */
export function readFaith(mode: FaithMode = FAITH_LESSONS): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  const v = readSession(TEACH_FAITH_KEY);
  if (v === 'on') return true;
  if (v === 'off') return false;
  return mode === 'switch-on';
}

export function writeFaith(on: boolean) {
  writeSession(TEACH_FAITH_KEY, on ? 'on' : 'off');
}

/* ───────── Grades and subjects ───────── */

/** The grades the finder offers, youngest first. */
export const GRADES = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8'] as const;
export type Grade = (typeof GRADES)[number];
export const isGrade = (v: unknown): v is Grade => (GRADES as readonly unknown[]).includes(v);

/** "Grade 8", "Kindergarten", "PreK". */
export const gradeName = (g: Grade) => (g === 'PreK' ? 'PreK' : g === 'K' ? 'Kindergarten' : `Grade ${g}`);

/** The grade bands, youngest first, as the catalog writes them. */
export const GRADE_BANDS = ['PreK–K', 'Grades 1–2', 'Grades 3–4', 'Grades 5–8'] as const;

/** A grade's band in the lesson catalog. */
export function bandForGrade(g: Grade): (typeof GRADE_BANDS)[number] {
  if (g === 'PreK' || g === 'K') return 'PreK–K';
  if (g === '1' || g === '2') return 'Grades 1–2';
  if (g === '3' || g === '4') return 'Grades 3–4';
  return 'Grades 5–8';
}

/** A grade's band in the library sets (the resources data's librarian grades). */
export function libraryBandForGrade(g: Grade): 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' {
  if (g === 'PreK' || g === 'K') return 'prek-k';
  if (g === '1' || g === '2') return 'grades-1-2';
  if (g === '3' || g === '4' || g === '5') return 'grades-3-5';
  return 'grades-6-8';
}

/** "Grades 5–8 · Religion" → band "Grades 5–8", subject "Religion"; the younger lessons have no subject. */
export function gradeParts(card: LessonCard): { band: string; subject: string | null } {
  const [band, subject] = card.grade.split(' · ');
  return { band: band.trim(), subject: subject?.trim() || null };
}

/** Subjects in the order the finder offers them. One not listed goes at the end. */
export const SUBJECT_ORDER = ['Social Studies', 'ELA', 'Science', 'Math', 'Art', 'Music', 'Theater', 'PE', 'Spanish', 'Religion'];

/**
 * The subjects a librarian teaches: research, reading and evidence. The
 * general (homeroom) lessons for the younger grades are library lessons too.
 * A librarian can still open every lesson from "See all lessons".
 */
export const LIBRARY_SUBJECTS = ['ELA', 'Social Studies'];

export function suitsRole(card: LessonCard, role: TeachRole): boolean {
  if (role !== 'librarian') return true; // a teacher, a parent or a homeschool teaches every subject
  const { subject } = gradeParts(card);
  return subject === null || LIBRARY_SUBJECTS.includes(subject);
}

/** The exhibitions with lessons, among those given. */
export const withLessons = (exhibitions: readonly string[]) => exhibitions.filter((e) => catalogFor(e).length > 0);

const inBand = (exhibitions: readonly string[], grade: Grade, role: TeachRole) =>
  exhibitions.flatMap((e) => catalogFor(e).filter((c) => gradeParts(c).band === bandForGrade(grade) && suitsRole(c, role)).map((card) => ({ exhibition: e, card })));

/** Whether the finder asks for a subject at this grade: the lessons there are by subject (grades 5–8), and the role chooses one. */
export function needsSubject(exhibitions: readonly string[], grade: Grade, role: TeachRole): boolean {
  if (role === 'librarian') return false;
  return inBand(exhibitions, grade, role).some(({ card }) => gradeParts(card).subject !== null);
}

/** The subjects there are lessons in at this grade, in SUBJECT_ORDER; with faith off, the subjects whose every lesson is faith-based drop out. */
export function subjectsFor(exhibitions: readonly string[], grade: Grade, role: TeachRole, faith: boolean): string[] {
  const subjects = new Set(
    inBand(exhibitions, grade, role)
      .filter(({ card }) => faith || !card.faith)
      .map(({ card }) => gradeParts(card).subject)
      .filter((s): s is string => s !== null),
  );
  const rank = (s: string) => (SUBJECT_ORDER.includes(s) ? SUBJECT_ORDER.indexOf(s) : SUBJECT_ORDER.length);
  return [...subjects].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

export type FinderQuery = { role: TeachRole; grade: Grade; subject: string | null; faith: boolean };

export type FoundLesson = {
  exhibition: string;
  card: LessonCard;
  /** The lesson on a screen, step by step (lessons/[slug]). */
  online: string;
  /** Its lesson plan and handouts, where the exhibition has them. */
  printables: Printable[];
};

export type FinderResult = {
  /** The finder still needs a subject before it can show a lesson. */
  needsSubject: boolean;
  lessons: FoundLesson[];
  /** Lessons that would match, hidden because faith-based lessons are off. */
  hiddenFaith: number;
};

/**
 * The visitor's lesson: for a grade below 5, the one lesson of that band in
 * each exhibition; for grades 5–8, the one in their subject; for a librarian,
 * the library lessons of that band. Faith-based lessons only when `faith`.
 */
export function findLessons(exhibitions: readonly string[], q: FinderQuery): FinderResult {
  const subjectStep = needsSubject(exhibitions, q.grade, q.role);
  if (subjectStep && !q.subject) return { needsSubject: true, lessons: [], hiddenFaith: 0 };
  const matches = inBand(exhibitions, q.grade, q.role).filter(({ card }) => !subjectStep || gradeParts(card).subject === q.subject);
  const shown = matches.filter(({ card }) => q.faith || !card.faith);
  return {
    needsSubject: false,
    hiddenFaith: matches.length - shown.length,
    lessons: shown.map(({ exhibition, card }) => ({
      exhibition,
      card,
      online: lessonPath(exhibition, card.slug),
      printables: lessonPrintables(exhibition, card.slug),
    })),
  };
}

/** Who the finder's answer is for, as a heading: "For a Grade 8 Social Studies teacher". */
export function finderHeading(role: TeachRole, grade: Grade, subject: string | null): string {
  const g = gradeName(grade);
  const s = subject ? `${subject} ` : '';
  switch (role) {
    case 'teacher':
      return `For a ${g} ${s}teacher`;
    case 'librarian':
      return `For a ${g} library class`;
    case 'parent':
      return subject ? `For a child in ${g}, exploring ${subject}` : `For a child in ${g}`;
    case 'homeschool':
      return `For ${g} ${s}at home`.replace(/\s+/g, ' ');
  }
}

/** The finder's last answers, kept for the visit, so the lesson is there again next time. */
export const TEACH_FINDER_KEY = 'mm-teach-finder';

export function readFinder(): { grade: Grade | null; subject: string | null } {
  try {
    const v = JSON.parse(readSession(TEACH_FINDER_KEY) ?? 'null') as { grade?: unknown; subject?: unknown } | null;
    return { grade: isGrade(v?.grade) ? v.grade : null, subject: typeof v?.subject === 'string' ? v.subject : null };
  } catch {
    return { grade: null, subject: null };
  }
}

export function writeFinder(grade: Grade | null, subject: string | null) {
  writeSession(TEACH_FINDER_KEY, grade ? JSON.stringify({ grade, subject }) : null);
}

/* ───────── Printables ───────── */

export type Printable = { label: string; detail: string; href: string; kind: 'plan' | 'handout' | 'guide' };

type ResourceData = {
  TEACHER_LESSON_PLANS: Record<string, string>;
  TEACHER_HANDOUTS: Record<string, Record<string, string>>;
  SUBJECT_LESSON_PLANS: Record<string, string>;
  SUBJECT_HANDOUTS: Record<string, Record<string, string>>;
  LIBRARIAN_LESSON_PLANS: Record<string, string>;
  LIBRARIAN_HANDOUTS: Record<string, Record<string, string>>;
  LIBRARIAN_GRADE_LABELS: Record<string, string>;
  ON_SCREEN_LESSONS: Record<string, string>;
  PARENT_RESOURCE_PATH: string;
};

/** Each exhibition's resources data, and the guides its resources page offers. */
const RESOURCES: Record<string, { data: ResourceData; guide: string; handoutsGuide: string }> = {
  'in-their-hands': {
    data: ITH,
    guide: '/resources/in-their-hands/ITH_Teaching_Guide.pdf',
    handoutsGuide: '/resources/in-their-hands/Using Differentiated Student Handouts.pdf',
  },
  'harlem-renaissance': {
    data: HARLEM,
    guide: '/resources/harlem-renaissance/HR_Teaching_Guide.pdf',
    handoutsGuide: '/resources/harlem-renaissance/Using Differentiated Student Handouts.pdf',
  },
  'seeing-is-deceiving': {
    data: SEEING,
    guide: '/resources/seeing-is-deceiving/Teaching-Guide-Optical-Illusions-and-Visual-Deception.pdf',
    handoutsGuide: '/resources/seeing-is-deceiving/Using Differentiated Student Handouts.pdf',
  },
  // <every-exhibition-resources>
  'moon': {
    data: MOON,
    guide: '/resources/moon/MOON_Teaching_Guide.pdf',
    handoutsGuide: '/resources/moon/Using Differentiated Student Handouts.pdf',
  },
  'egypt': {
    data: EGY,
    guide: '/resources/egypt/EGY_Teaching_Guide.pdf',
    handoutsGuide: '/resources/egypt/Using Differentiated Student Handouts.pdf',
  },
  'america-250': {
    data: A250,
    guide: '/resources/america-250/A250_Teaching_Guide.pdf',
    handoutsGuide: '/resources/america-250/Using Differentiated Student Handouts.pdf',
  },
  'victorian': {
    data: VIC,
    guide: '/resources/victorian/VIC_Teaching_Guide.pdf',
    handoutsGuide: '/resources/victorian/Using Differentiated Student Handouts.pdf',
  },
  'great-war': {
    data: GW,
    guide: '/resources/great-war/GW_Teaching_Guide.pdf',
    handoutsGuide: '/resources/great-war/Using Differentiated Student Handouts.pdf',
  },
  'womens-history': {
    data: WH,
    guide: '/resources/womens-history/WH_Teaching_Guide.pdf',
    handoutsGuide: '/resources/womens-history/Using Differentiated Student Handouts.pdf',
  },
  'holocaust': {
    data: HOL,
    guide: '/resources/holocaust/HOL_Teaching_Guide.pdf',
    handoutsGuide: '/resources/holocaust/Using Differentiated Student Handouts.pdf',
  },
  'black-history': {
    data: BH,
    guide: '/resources/black-history/BH_Teaching_Guide.pdf',
    handoutsGuide: '/resources/black-history/Using Differentiated Student Handouts.pdf',
  },
  'writing-revolution': {
    data: WR,
    guide: '/resources/writing-revolution/WR_Teaching_Guide.pdf',
    handoutsGuide: '/resources/writing-revolution/Using Differentiated Student Handouts.pdf',
  },
  'fear-lab': {
    data: FL,
    guide: '/resources/fear-lab/FL_Teaching_Guide.pdf',
    handoutsGuide: '/resources/fear-lab/Using Differentiated Student Handouts.pdf',
  },
  // </every-exhibition-resources>
};

/** The three levels of every handout, as the resources pages name them. */
const LEVELS: { key: string; label: string; detail: string }[] = [
  { key: 'green', label: 'Green handout', detail: 'More support' },
  { key: 'yellow', label: 'Yellow handout', detail: 'At grade level' },
  { key: 'red', label: 'Red handout', detail: 'Go deeper' },
];

const file = (dir: string, name: string) => `${dir}/${encodeURIComponent(name)}`;

function planAndHandouts(dir: string, plan: string | undefined, handouts: Record<string, string> | undefined, planLabel: string): Printable[] {
  const out: Printable[] = [];
  if (plan) out.push({ label: planLabel, detail: 'PDF · The full lesson, with its objectives', href: file(dir, plan), kind: 'plan' });
  for (const l of LEVELS) if (handouts?.[l.key]) out.push({ label: l.label, detail: `PDF · ${l.detail}`, href: file(dir, handouts[l.key]), kind: 'handout' });
  return out;
}

/** A lesson's lesson plan and handouts to print, found by the lesson's place in the resources data (ON_SCREEN_LESSONS). */
export function lessonPrintables(exhibition: string, slug: string): Printable[] {
  const r = RESOURCES[exhibition];
  if (!r) return [];
  const key = Object.entries(r.data.ON_SCREEN_LESSONS).find(([, s]) => s === slug)?.[0];
  if (!key) return [];
  const base = `/resources/${exhibition}/teachers`;
  const [grade, subject] = key.split('/');
  return subject
    ? planAndHandouts(`${base}/${grade}/${subject}`, r.data.SUBJECT_LESSON_PLANS[subject], r.data.SUBJECT_HANDOUTS[subject], 'Lesson plan')
    : planAndHandouts(`${base}/${grade}`, r.data.TEACHER_LESSON_PLANS[grade], r.data.TEACHER_HANDOUTS[grade], 'Lesson plan');
}

/** The library set for a grade (a library lesson plan and its handouts), where the exhibition has one. */
export function libraryPrintables(exhibition: string, grade: Grade): Printable[] {
  const r = RESOURCES[exhibition];
  if (!r) return [];
  const band = libraryBandForGrade(grade);
  const label = `Library lesson plan, ${r.data.LIBRARIAN_GRADE_LABELS[band] ?? band}`;
  return planAndHandouts(`/resources/${exhibition}/librarians/${band}`, r.data.LIBRARIAN_LESSON_PLANS[band], r.data.LIBRARIAN_HANDOUTS[band], label);
}

/** The exhibition's guides for a role: the overview for everyone, the handout explainer for whoever uses the handouts, the parent guide at home. */
export function guidesFor(exhibition: string, role: TeachRole): Printable[] {
  const r = RESOURCES[exhibition];
  if (!r) return [];
  const all: (Printable & { roles: TeachRole[] })[] = [
    { label: 'Parent Resource Guide', detail: 'PDF · Activities and conversation starters', href: r.data.PARENT_RESOURCE_PATH, kind: 'guide', roles: ['parent', 'homeschool'] },
    { label: 'Quick Teaching Guide', detail: 'PDF · Overview and key ideas', href: r.guide, kind: 'guide', roles: ['teacher', 'librarian', 'parent', 'homeschool'] },
    { label: 'Teacher Explanation Sheet', detail: 'PDF · Using the three handout levels', href: r.handoutsGuide, kind: 'guide', roles: ['teacher', 'librarian', 'homeschool'] },
  ];
  return all.filter((p) => p.roles.includes(role)).map((p) => ({ label: p.label, detail: p.detail, href: p.href, kind: p.kind }));
}

/** The exhibition's old resources page (kept working: lesson pages and PDFs link to it). */
export const resourcesPath = (exhibition: string) => `/exhibitions/${exhibition}/resources`;

/** The one Resources hub, every exhibition's lessons and printables by role. */
export const RESOURCES_HUB = '/resources';

/** A link that goes to an old resources page, which "Teach with this" now holds itself. */
export const isResourcesLink = (href: string) => /^\/exhibitions\/[^/]+\/resources(\/|$)/.test(href);

/* ───────── The sheet's colours ───────── */

/** The room's colours, as the sheet asks for them. A list gives choices, best first. */
export type TeachThemeInput = {
  /** The room's ground. */
  bg: string;
  /** Body copy: the first that reads on the ground (4.5:1) is used. */
  ink: string | readonly string[];
  /** Headings: large type, 3:1 is enough. */
  heading?: string;
  /** Buttons, labels and rules: the first that reads on the ground (4.5:1). */
  accent?: string | readonly string[];
  /** Quieter copy (4.5:1), else the ink. */
  muted?: string | readonly string[];
  display?: string;
  body?: string;
};

export type TeachThemeVars = Record<`--tw-${string}`, string>;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function rgb(hex: string): [number, number, number] | null {
  if (!HEX.test(hex)) return null;
  const h = hex.length === 4 ? hex.slice(1).replace(/./g, (c) => c + c) : hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio of two hex colours; a colour that is not hex counts as readable. */
export function contrast(a: string, b: string): number {
  const x = rgb(a);
  const y = rgb(b);
  if (!x || !y) return 21;
  const [l1, l2] = [luminance(x), luminance(y)].sort((m, n) => n - m);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** `a` mixed toward `b` by `t` (0–1), as hex. */
export function mix(a: string, b: string, t: number): string {
  const x = rgb(a);
  const y = rgb(b);
  if (!x || !y) return a;
  return `#${x.map((c, i) => Math.round(c + (y[i] - c) * t).toString(16).padStart(2, '0')).join('')}`;
}

const list = (v: string | readonly string[] | undefined): string[] => (v === undefined ? [] : typeof v === 'string' ? [v] : [...v]);
const firstReadable = (on: string, choices: string[], min: number) => choices.find((c) => contrast(c, on) >= min);
const blackOrWhite = (on: string) => (contrast('#111111', on) >= contrast('#ffffff', on) ? '#111111' : '#ffffff');

/**
 * The sheet's custom properties from a room's colours. Every pairing the
 * sheet draws is checked (WCAG 2.2) on the ground, on its raised cards and on
 * the accent-tinted panel: body copy, quiet copy and small accent text
 * (--tw-accent-text) 4.5:1; headings, and the accent where it draws a line,
 * an icon or a button's fill (--tw-accent), 3:1; the text on an accent
 * button 4.5:1. A colour that fails gives way to the next choice, then to the
 * ink, or to black or white. The cards and panel lean toward the copy, or
 * away from it where that would cost the copy its contrast.
 */
export function teachTheme(t: TeachThemeInput): TeachThemeVars {
  const bg = t.bg;
  const inks = list(t.ink);
  const ink0 = firstReadable(bg, inks, 4.5) ?? blackOrWhite(bg);
  // Away from the copy: darker under light copy, lighter under dark.
  const away = contrast('#000000', ink0) > contrast('#ffffff', ink0) ? '#000000' : '#ffffff';
  const surface = [mix(bg, ink0, 0.045), mix(bg, away, 0.12)].find((g) => contrast(ink0, g) >= 4.5) ?? bg;
  const on = (c: string, min: number, grounds: string[]) => grounds.every((g) => contrast(c, g) >= min);
  const heading = list(t.heading).find((c) => on(c, 3, [bg, surface])) ?? ink0;
  const accent = [...list(t.accent), heading].find((c) => on(c, 3, [bg, surface])) ?? ink0;
  const softs = [mix(bg, accent, 0.08), mix(bg, away, 0.08), bg];
  const soft = softs.find((g) => contrast(ink0, g) >= 4.5 && contrast(accent, g) >= 3) ?? bg;
  const grounds = [bg, surface, soft];
  const ink = on(ink0, 4.5, grounds) ? ink0 : (inks.find((c) => on(c, 4.5, grounds)) ?? blackOrWhite(bg));
  const accentText = [...list(t.accent), heading, ink].find((c) => on(c, 4.5, grounds)) ?? ink;
  const muted = [...list(t.muted), mix(ink, bg, 0.22)].find((c) => on(c, 4.5, grounds)) ?? ink;
  const onAccent = [bg, '#111111', '#ffffff'].sort((a, b) => contrast(b, accent) - contrast(a, accent))[0];
  return {
    '--tw-bg': bg,
    '--tw-surface': surface,
    '--tw-ink': ink,
    '--tw-heading': heading,
    '--tw-muted': muted,
    '--tw-accent': accent,
    '--tw-accent-text': accentText,
    '--tw-on-accent': onAccent,
    '--tw-line': mix(bg, ink, 0.22),
    '--tw-soft': soft,
    '--tw-display': t.display ?? "'Cormorant Garamond', Georgia, serif",
    '--tw-body': t.body ?? "'Outfit', system-ui, sans-serif",
  };
}

/** The museum's own look, for the Resources hub and any room that passes no colours: the Great Hall's black, white and sage. */
export const MUSEUM_TEACH_THEME: TeachThemeInput = {
  bg: '#0a0a0a',
  ink: '#fafafa',
  heading: '#fafafa',
  accent: ['#a9b39c'],
  muted: ['#b5b5b5'],
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Outfit', system-ui, sans-serif",
};

/**
 * A poster exhibition's sheet colours, from its config: its landing page's
 * ground, its projector's ink (or its heading), its "Teach with this" colour
 * for the accent, and its own faces.
 */
export function exhibitionTeachTheme(
  palette: { page: string; heading: string; accent: string; teach: { color: string } },
  projector: object,
  fonts: { display: string; body: string; ui?: string },
): TeachThemeInput {
  const pj = projector as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? [v] : []);
  return {
    bg: palette.page,
    ink: [...str(pj['--pj-ink']), palette.heading],
    heading: palette.heading,
    accent: [palette.teach.color, palette.accent],
    muted: str(pj['--pj-muted']),
    display: fonts.display,
    body: fonts.ui ?? fonts.body,
  };
}
