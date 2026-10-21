/**
 * The shape of a lesson exported by resources-src/export_lessons.py.
 * Copy fields keep the PDF source's **bold** / *italic* markup; render them
 * with <Inline>.
 */

export interface Verse {
  text: string;
  ref: string;
}

export interface Picture {
  img: string;
  pos?: string;
  credit?: string;
}

export interface Specimen {
  img: string;
  label: string;
  replica?: boolean;
  title: string;
  facts: [string, string][];
  body?: string[];
}

export interface LevelCard {
  key: 'green' | 'yellow' | 'red';
  name: string;
  sub: string;
  color: string;
  summary: string;
}

export type Screen =
  | { kind: 'question'; question: string }
  | { kind: 'painting'; img: Picture; verse: Verse }
  | { kind: 'coin'; coin: Specimen; back?: string; alt: string; backAlt?: string }
  | { kind: 'verse'; verse: Verse; question?: string; echo?: string }
  | { kind: 'levels'; levels: LevelCard[]; note: string }
  | { kind: 'prayer'; prayer: string };

export interface Phase {
  name: string;
  minutes: number;
  color: string;
}

export interface Step {
  id: string;
  phase: string;
  color: string;
  /** the lesson-plan section this step comes from, e.g. "Direct instruction" */
  section: string;
  title: string;
  minutes: number;
  /** what the teacher says and does: the plan's own paragraphs */
  script: string[];
  screen: Screen;
}

export interface Handout {
  key: 'green' | 'yellow' | 'red';
  name: string;
  sub: string;
  color: string;
  href: string;
}

export interface Lesson {
  slug: string;
  exhibition: { slug: string; name: string; accent: string; text: string; big: string };
  title: string;
  sub: string;
  hero?: Picture;
  objective: string[];
  materials: string[];
  questions: string[];
  connection: string[];
  totalMinutes: number;
  phases: Phase[];
  steps: Step[];
  lessonPlan: string;
  handouts: Handout[];
}
