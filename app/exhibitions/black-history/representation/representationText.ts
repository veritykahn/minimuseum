import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
import { posterSentence } from '../timeline/timelineStops';

/*
 * "Who Do You See?": every word in the room's three tabs.
 *
 * The Doll Test is told only in checked facts, each set as a museum note
 * with its source (FactNote), in the sources' own wording and figures: the
 * NAACP Legal Defense Fund's "A Revealing Experiment: Brown v. Board and
 * 'The Doll Test'", the Library of Congress's exhibition "With an Even Hand:
 * Brown v. Board at Fifty", the decision itself (its footnote 11, as the
 * Legal Information Institute transcribes it) and the National Archives'
 * transcript of the decision. It ends on poster 2's own sentence, quoted
 * whole from blackHistory.ts. The reflection questions are open questions
 * and make no claims.
 *
 * The book survey's one comparison is the Cooperative Children's Book
 * Center's own published figures for 2025, as its table gives them, with no
 * further arithmetic (the CCBC asks to review any analysis of its data).
 *
 * The rest is interface, and makes no claims.
 */

const LDF: FactSource = {
  label: 'NAACP Legal Defense Fund, “A Revealing Experiment: Brown v. Board and ‘The Doll Test’”',
  href: 'https://www.naacpldf.org/brown-vs-board/significance-doll-test/',
};
const LOC: FactSource = {
  label: 'Library of Congress, “With an Even Hand: Brown v. Board at Fifty”',
  href: 'https://www.loc.gov/exhibits/brown/brown-brown.html',
};
const DECISION_FOOTNOTE: FactSource = {
  label: 'Brown v. Board of Education, 347 U.S. 483 (1954), footnote 11 (Legal Information Institute)',
  href: 'https://www.law.cornell.edu/supremecourt/text/347/483/USSC_PRO_347_483_1',
};
const ARCHIVES: FactSource = {
  label: 'National Archives, “Brown v. Board of Education (1954)”',
  href: 'https://www.archives.gov/milestone-documents/brown-v-board-of-education',
};
const CCBC: FactSource = {
  label: 'Cooperative Children’s Book Center, University of Wisconsin–Madison, “Books By and/or About Black, Indigenous and People of Color 2018–” (updated April 24, 2026)',
  href: 'https://ccbc.education.wisc.edu/literature-resources/ccbc-diversity-statistics/books-by-and-or-about-poc-2018/',
};

/** The Doll Test's checked facts, in the order the story tells them. */
export const DOLL_TEST_FACTS = {
  clarks: {
    text: 'In the 1940s, psychologists Kenneth and Mamie Phipps Clark designed and conducted a series of experiments known as “the doll tests,” to study the psychological effects of segregation on African-American children.',
    sources: [LDF, LOC],
  },
  dolls: {
    text: 'They used four plastic, diaper-clad dolls, identical except for color, and showed them to Black children between the ages of three and seven.',
    sources: [LOC],
  },
  answers: {
    text: 'Almost all of the children readily identified the race of the dolls. A majority of the children preferred the white doll and assigned positive characteristics to it.',
    sources: [LOC, LDF],
  },
  drawings: {
    text: 'The Clarks also gave the children outline drawings of a boy and girl and asked them to color the figures the same color as themselves. Many of the children with dark complexions colored the figures with a white or yellow crayon.',
    sources: [LOC],
  },
  conclusion: {
    text: 'The Clarks concluded that “prejudice, discrimination, and segregation” created a feeling of inferiority among African-American children and damaged their self-esteem.',
    sources: [LDF],
  },
  court: {
    text: 'Kenneth Clark became the NAACP Legal Defense Fund’s principal expert witness, and testified in the Briggs, Davis and Delaware cases. The doll test was only one part of his testimony.',
    sources: [LOC, LDF],
  },
  decision: {
    text: 'The Supreme Court announced its unanimous decision in Brown v. Board of Education on May 17, 1954: school segregation violated the Fourteenth Amendment.',
    sources: [LOC],
  },
  footnote: {
    text: 'The decision’s footnote 11 cites Kenneth Clark’s 1950 paper, “Effect of Prejudice and Discrimination on Personality Development,” written for the Midcentury White House Conference on Children and Youth.',
    sources: [DECISION_FOOTNOTE, LOC],
  },
  words: {
    text: 'The Court wrote that separating children “from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone.”',
    sources: [ARCHIVES],
  },
} satisfies Record<string, ApprovedFact>;

export type DollTestStep = {
  id: string;
  /** The step's heading: a label, not a claim. */
  heading: string;
  /** The step's facts, as notes with their sources. */
  facts: ApprovedFact[];
  /** What the step's picture shows. */
  picture: 'dolls' | 'clarks' | 'answers' | 'drawings' | 'court' | 'footnote' | 'mirror';
};

export const DOLL_TEST_STEPS: DollTestStep[] = [
  { id: 'clarks', heading: 'Two psychologists', facts: [DOLL_TEST_FACTS.clarks], picture: 'clarks' },
  { id: 'dolls', heading: 'Four dolls', facts: [DOLL_TEST_FACTS.dolls], picture: 'dolls' },
  { id: 'answers', heading: 'What the children chose', facts: [DOLL_TEST_FACTS.answers], picture: 'answers' },
  { id: 'drawings', heading: 'The crayons', facts: [DOLL_TEST_FACTS.drawings], picture: 'drawings' },
  { id: 'conclusion', heading: 'What the Clarks found', facts: [DOLL_TEST_FACTS.conclusion], picture: 'clarks' },
  { id: 'court', heading: 'In court', facts: [DOLL_TEST_FACTS.court, DOLL_TEST_FACTS.decision], picture: 'court' },
  { id: 'footnote', heading: 'Footnote 11', facts: [DOLL_TEST_FACTS.footnote, DOLL_TEST_FACTS.words], picture: 'footnote' },
  { id: 'think', heading: 'What it teaches', facts: [], picture: 'mirror' },
];

export const DOLL_TEST_TEXT = {
  intro: 'A true story from the 1940s about young children, dolls and the Supreme Court. Nobody takes a test here: read what happened, then think about it together.',
  /** Poster 2's own sentence, quoted whole, for the last step. */
  poster: posterSentence('The introduction of the first Black Barbie'),
  posterCite: 'The Importance of Black Barbie',
  questions: [
    'The children in the study were very young. Where do you think they learned which doll was “nice” or “good”?',
    'Think of the toys, books and screens around you. Who do they show as heroes, as beautiful, as clever?',
    'What would you want every child to be able to find in a toy shop or a library?',
  ],
};

/** The CCBC's 2025 figures, as its table gives them: books received, and those by and about Black/African people. */
export const CCBC_2025 = { year: 2025, received: 3638, aboutBlack: 491, aboutBlackPct: '13.5%', byBlack: 398, byBlackPct: '10.9%' };

export const CCBC_FACT: ApprovedFact = {
  text: 'Of the 3,638 children’s and young adult books published in 2025 that the Cooperative Children’s Book Center received, 491 (13.5%) were about Black/African people, and 398 (10.9%) were by Black/African authors or illustrators.',
  sources: [CCBC],
};

/* ───────── The book survey's questions ───────── */

export type SurveyOption = { id: string; label: string };
export type SurveyQuestion = { id: string; tab: string; heading: string; options: SurveyOption[] };

/* The backgrounds follow the CCBC's own categories, so the class can set its count beside theirs. */
const BACKGROUNDS: SurveyOption[] = [
  { id: 'black', label: 'Black/African' },
  { id: 'indigenous', label: 'Indigenous' },
  { id: 'asian', label: 'Asian' },
  { id: 'latine', label: 'Latine' },
  { id: 'pacific', label: 'Pacific Islander' },
  { id: 'arab', label: 'Arab' },
  { id: 'white', label: 'White' },
  { id: 'mixed', label: 'More than one' },
  { id: 'animal', label: 'Animal or not a person' },
  { id: 'unknown', label: 'Can’t tell' },
];

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 'background', tab: 'Background', heading: 'Main characters, by background', options: BACKGROUNDS },
  {
    id: 'gender',
    tab: 'Gender',
    heading: 'Main characters, by gender',
    options: [
      { id: 'girl', label: 'Girl or woman' },
      { id: 'boy', label: 'Boy or man' },
      { id: 'other', label: 'Another gender' },
      { id: 'unknown', label: 'Can’t tell or not a person' },
    ],
  },
  {
    id: 'ability',
    tab: 'Disability',
    heading: 'Main characters with a disability',
    options: [
      { id: 'yes', label: 'Has a disability we can see or read about' },
      { id: 'no', label: 'No disability shown' },
      { id: 'unknown', label: 'Can’t tell' },
    ],
  },
  {
    id: 'authors',
    tab: 'Authors',
    heading: 'Authors and creators, by background',
    options: BACKGROUNDS.filter((o) => o.id !== 'animal').map((o) => (o.id === 'unknown' ? { id: 'unknown', label: 'Don’t know' } : o)),
  },
];

export const SURVEY_KINDS = [
  { id: 'books', label: 'Books' },
  { id: 'toys', label: 'Toys' },
  { id: 'screens', label: 'Shows and games' },
] as const;
export type SurveyKind = (typeof SURVEY_KINDS)[number]['id'];

export const SURVEY_TEXT = {
  intro: 'Look at the books in your classroom or library (or the toys, shows and games). For each main character, add one to each chart. Your counts stay in this browser.',
  talk: [
    'Who did you find the most of? Who was hardest to find?',
    'Did anyone in your class not find someone like themselves?',
    'Which books would you add to make your shelf look more like the world?',
  ],
  compareHeading: 'Compare: books published in 2025',
};

export const ROOM_TEXT = {
  title: 'Who Do You See?',
  designTab: 'Design a doll',
  dollTestTab: 'The Doll Test',
  booksTab: 'Who’s in your books?',
};
