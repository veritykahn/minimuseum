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
  /** set larger than its neighbors; by default, a replica is */
  feature?: boolean;
  alt: string;
}

/** a row of a projected chart; its first cell names the row */
export interface ChartRow {
  img?: string;
  replica?: boolean;
  cells: string[];
}

/** one labelled picture in a gallery group */
export interface GalleryItem {
  img: string;
  caption: string;
  sub?: string;
  alt: string;
  replica?: boolean;
  /** width over height, for a picture that is not a single round coin */
  aspect?: number;
}

/** a labelled set of pictures: one column of a comparison */
export interface GalleryGroup {
  label: string;
  text?: string;
  items: GalleryItem[];
}

/** a number line, positions in percent of its width */
export interface NumberLine {
  /** what the line shows, for screen readers */
  alt: string;
  ticks: { at: number; label: string; edge?: boolean }[];
  /** short notes above the line, e.g. "no year zero" */
  notes?: { at: number; text: string }[];
  /** numbered arcs above the line, from one position to another */
  hops?: [number, number][];
}

/** a worked example, set out one step at a time */
export interface WorkedExample {
  title: string;
  img?: string;
  alt?: string;
  replica?: boolean;
  steps: string[];
  answer?: string;
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
  /** the question, large; the step's students list, if any, beneath */
  | { kind: 'question'; question: string }
  /** the step's students list is the questions, beside these coins */
  | { kind: 'coins'; coins: NamedCoin[] }
  | { kind: 'painting'; img: Picture; verse: Verse; alt?: string }
  | { kind: 'coin'; coin: Specimen; back?: string; alt: string; backAlt?: string }
  | { kind: 'verse'; verse: Verse; question?: string; echo?: string }
  | { kind: 'levels'; levels: LevelCard[]; note?: string }
  /** the plenary: the step's students list, each completing `lead` */
  | { kind: 'review'; lead: string; deeper?: number[] }
  | { kind: 'prayer'; prayer: string }
  /** a table to read from: a caption, column heads, rows */
  | { kind: 'chart'; caption: string; columns: string[]; rows: ChartRow[] }
  /** labelled pictures in groups, side by side, for comparing */
  | { kind: 'gallery'; groups: GalleryGroup[] }
  /** a number line, and a worked example beside it */
  /** a number line; with a worked example, the rule beside it (a \n starts a new line) */
  | { kind: 'numberline'; line: NumberLine; worked?: WorkedExample; rule?: string }
  /** worked examples side by side */
  | { kind: 'worked'; examples: WorkedExample[] };

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
