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
  /** set larger than its neighbors; by default a replica is, unless this says otherwise */
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
  /** the same in a young child's words, for the classroom screen ("I can…") */
  screen?: string;
  /** the same, asked back in the look back, completing "Can you now…" */
  question: string;
  /** the stretch objective, marked in the Red level's color */
  deeper?: boolean;
}

export interface Objectives {
  heading: string;
  /** the heading on the classroom screen, when it differs (e.g. "I can…") */
  screenHeading?: string;
  items: Objective[];
  why: string;
}

/** a picture to compare with another: two side by side, labeled A and B */
export interface PairItem {
  img: string;
  alt: string;
  /** the big label students point to, e.g. "Coin A" */
  label: string;
  caption?: string;
  /** a verdict set on the picture once it is revealed, e.g. "Fake" */
  stamp?: string;
  stampTone?: 'gold' | 'red';
  /** "cover" for a photograph that fills its frame; coins stay "contain" */
  fit?: 'cover' | 'contain';
  pos?: string;
}

/** a person shown by their hands, with the coin they held */
export interface Person {
  img: string;
  pos?: string;
  alt: string;
  name?: string;
  /** where they are, e.g. "At the Temple" */
  label?: string;
  coin?: string;
  coinAlt?: string;
}

/** a recording from the exhibition, to play to the class */
export interface Clip {
  src: string;
  /** what it is, e.g. "Trumpet" or a song title */
  label: string;
  /** where it comes from, e.g. "Jazz Lab" */
  sub?: string;
  credit?: string;
}

/** where to see a work the site does not show (a painting still in copyright) */
export interface WorkLink {
  label: string;
  href: string;
}

export type Screen =
  /** the question, large; the step's students list, if any, beneath */
  | { kind: 'question'; question: string }
  /** the step's students list is the questions, beside these coins */
  | { kind: 'coins'; coins: NamedCoin[] }
  | { kind: 'painting'; img: Picture; verse: Verse; alt?: string; pos?: string }
  | { kind: 'coin'; coin: Specimen; back?: string; alt: string; backAlt?: string }
  | { kind: 'verse'; verse: Verse; question?: string; echo?: string }
  | { kind: 'levels'; levels: LevelCard[]; note?: string }
  /** the plenary: the step's students list, each completing `lead` */
  | { kind: 'review'; lead: string; deeper?: number[]; hint?: string }
  | { kind: 'prayer'; prayer: string }
  /** a table to read from: a caption, column heads, rows */
  | { kind: 'chart'; caption: string; columns: string[]; rows: ChartRow[] }
  /** labelled pictures in groups, side by side, for comparing */
  | { kind: 'gallery'; groups: GalleryGroup[] }
  /** a number line; with a worked example, the rule beside it (a \n starts a new line) */
  | { kind: 'numberline'; line: NumberLine; worked?: WorkedExample; rule?: string }
  /** worked examples side by side */
  | { kind: 'worked'; examples: WorkedExample[] }
  /** two pictures to compare; `note` is a quoted clue under them */
  | { kind: 'pair'; items: PairItem[]; note?: Verse }
  /** a row of people; `letters` marks them A, B, C… to point to */
  | { kind: 'people'; people: Person[]; letters?: boolean }
  /** one person: their hands and coin, and their story to read aloud */
  | {
      kind: 'person';
      person: Person;
      coinName: string;
      replica?: boolean;
      story: string;
      ref?: string;
    }
  /** words from the plan set large: a key line, a quotation; a \n starts a new line */
  | { kind: 'words'; text: string; cite?: string }
  /** a work of art: its picture, or, when the site cannot show it, its name and where to see it */
  | { kind: 'artwork'; work: string; artist?: string; date?: string; img?: Picture; alt?: string; links?: WorkLink[] }
  /** recordings to play to the class, with what to listen for */
  | { kind: 'listen'; clips: Clip[]; question?: string };

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
  /** set for the youngest classes: larger type on the classroom screen */
  large?: boolean;
  exhibition: { slug: string; name: string; accent: string; text: string; big: string };
  title: string;
  sub: string;
  hero?: Picture;
  objective: string[];
  objectives?: Objectives;
  materials: string[];
  questions: string[];
  /** what the plan calls its questions, when not "Questions to ask in front of the case" */
  questionsLabel?: string;
  connection: string[];
  totalMinutes: number;
  phases: Phase[];
  steps: Step[];
  lessonPlan: string;
  handouts: Handout[];
}
