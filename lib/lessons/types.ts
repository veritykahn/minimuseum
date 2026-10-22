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

/** a coin shown by its ruler's name, for reading as evidence */
export interface NamedCoin {
  img: string;
  name: string;
  sub?: string;
  replica?: boolean;
  alt: string;
}

export interface Objective {
  /** what students will be able to do, completing "you will be able to:" */
  text: string;
  /** the same, asked back in the look back, completing "Can you now…" */
  question: string;
  /** the stretch objective, marked in the Red level's color */
  deeper?: boolean;
}

export interface Objectives {
  heading: string;
  items: Objective[];
  why: string;
}

export type Screen =
  | { kind: 'question'; question: string }
  /** the step's students list is the questions, beside these coins */
  | { kind: 'coins'; coins: NamedCoin[] }
  | { kind: 'painting'; img: Picture; verse: Verse }
  | { kind: 'coin'; coin: Specimen; back?: string; alt: string; backAlt?: string }
  | { kind: 'verse'; verse: Verse; question?: string; echo?: string }
  | { kind: 'levels'; levels: LevelCard[]; note?: string }
  /** the plenary: the step's students list, each completing `lead` */
  | { kind: 'review'; lead: string; deeper?: number[] }
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
  /** what the step is for, for the teacher */
  purpose?: string;
  /** what students do, shown large on the classroom screen */
  students?: string[];
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
  objectives?: Objectives;
  materials: string[];
  questions: string[];
  connection: string[];
  totalMinutes: number;
  phases: Phase[];
  steps: Step[];
  lessonPlan: string;
  handouts: Handout[];
}
