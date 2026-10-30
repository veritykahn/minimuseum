import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';

/*
 * Talk About It: an oral history. The visitor interviews a woman in their
 * family, with the guides' advice and fourteen questions, prints an
 * interview sheet to take along, and writes up what they learned (printed
 * too). It answers poster 2's closing invitation, "Your own women's
 * history" ("Ask. Listen. Write it down. Then step into Talk About It for
 * questions to start with.").
 *
 * Every word is the owner-approved draft (A18/B13/B14 proposal, 1D), set as
 * drafted. Each tip is drawn from a guide and is shown with it; the
 * questions and the room's own lines make no claims. The Veterans History
 * Project's line was seen only in a search excerpt ([S]); the owner checks it.
 */

export const SMITHSONIAN_GUIDE: FactSource = {
  label: 'Smithsonian Folklife and Oral History Interviewing Guide',
  href: 'https://folklife.si.edu/the-smithsonian-folklife-and-oral-history-interviewing-guide/smithsonian',
};
export const SMITHSONIAN_FAMILY: FactSource = {
  label: 'Smithsonian Education, Family Folklore: The Interview',
  href: 'https://www.smithsonianeducation.org/migrations/seek2/iview2.html',
};
export const FOLKLIFE_FIELDWORK: FactSource = {
  label: 'Library of Congress, American Folklife Center, Folklife and Fieldwork (2016)',
  href: 'https://www.loc.gov/item/2019667028/',
};
export const VETERANS_HISTORY: FactSource = {
  label: 'Library of Congress, Veterans History Project',
  href: 'https://www.loc.gov/vets/conducttheinterview.html',
};

export const ORAL_INTRO =
  'Choose a woman in your family to interview: a mother, grandmother, aunt, stepmother, or another woman who is family to you. (If that isn’t possible, a woman in your community who has known you a long time is a good choice too.) Ask a parent or guardian first.';

/** Poster 2's closing invitation quotes the Smithsonian guide; the room does too. */
export const EVERYBODY: ApprovedFact = {
  text: 'The Smithsonian’s guide to collecting oral history puts it simply: “everybody has a story to tell.”',
  sources: [SMITHSONIAN_GUIDE],
};

export type Tip = { title?: string; text: string; sources: readonly FactSource[] };

export const BEFORE: readonly Tip[] = [
  {
    title: 'Ask permission.',
    text: 'Tell her what the interview is for (a school project? a family keepsake?) and ask if you may record it. Ask a parent or guardian before you set it up.',
    sources: [SMITHSONIAN_GUIDE],
  },
  { title: 'Pick a calm, comfortable place,', text: 'such as her home or the kitchen table. Turn off the TV.', sources: [SMITHSONIAN_GUIDE] },
  { title: 'Test your recorder, then say who, where and when', text: 'at the start of the recording.', sources: [SMITHSONIAN_GUIDE] },
  { title: 'Ask her to bring an old photo, letter or keepsake.', text: 'Objects bring back memories.', sources: [SMITHSONIAN_GUIDE, SMITHSONIAN_FAMILY] },
];

export const LISTENING: readonly Tip[] = [
  { text: 'Ask questions that begin with “How,” “What” or “Why”; they get better answers than “Did you…?”', sources: [SMITHSONIAN_GUIDE, FOLKLIFE_FIELDWORK] },
  { text: 'Ask one thing at a time, and keep questions short.', sources: [FOLKLIFE_FIELDWORK] },
  { text: 'Don’t be afraid of quiet moments. She may be remembering.', sources: [SMITHSONIAN_GUIDE, FOLKLIFE_FIELDWORK] },
  { text: 'Ask a follow-up: “Can you give me an example?” or “How did that happen?”', sources: [SMITHSONIAN_GUIDE] },
  { text: 'If she wants to skip a question, or gets tired, stop. You can finish another day.', sources: [SMITHSONIAN_GUIDE, VETERANS_HISTORY] },
];

export type QuestionGroup = { title: string; questions: readonly string[] };

/** The fourteen questions, easy ones first, the bigger ones saved for the end. */
export const INTERVIEW: readonly QuestionGroup[] = [
  {
    title: 'Getting started',
    questions: [
      'What is your full name, and do you know why you were given it? Did you ever have a nickname?',
      'Where were you born, and where did you grow up?',
      'What was your home like when you were my age? What could you see from the window?',
    ],
  },
  {
    title: 'Growing up',
    questions: [
      'Who were the most important people in your life when you were a child, and what were they like?',
      'What did you do for fun? What games, songs or books did you love?',
      'What was school like for you? What is one thing a teacher said that you still remember?',
    ],
  },
  {
    title: 'Work and everyday life',
    questions: [
      'What jobs have you done, inside or outside the home? How did you learn to do them?',
      'What is something you know how to make, mend, grow or cook? Who taught you?',
      'What did a normal day look like for you when you were a young woman?',
    ],
  },
  {
    title: 'Family stories and keepsakes',
    questions: [
      'What stories did the older women in our family tell you? Which one do you remember best?',
      '(Show the photo or keepsake.) Can you tell me the story of this?',
      'What family traditions do we have, and how have they changed over the years?',
    ],
  },
  {
    title: 'Looking back',
    questions: [
      'What has changed most for girls and women since you were my age? What has stayed the same?',
      'What would you most like people in our family to remember about you, and what advice would you give me?',
    ],
  },
];

export const QUESTIONS_NOTE: ApprovedFact = {
  text: 'The guides say to start with easy questions, ask open-ended ones and keep each short.',
  sources: [SMITHSONIAN_GUIDE, FOLKLIFE_FIELDWORK],
};

export const AFTER: readonly Tip[] = [
  { text: 'Say thank you, and send a thank-you note.', sources: [SMITHSONIAN_GUIDE] },
  { text: 'Ask before you share. If you want to show the class, put it online or add it to a family book, ask her first.', sources: [SMITHSONIAN_GUIDE] },
  { text: 'Label your recording with her name, the date and the place, and write down your thoughts while they are fresh.', sources: [SMITHSONIAN_GUIDE] },
];

/** The guide's own "Time to Reflect" questions, verbatim. */
export const REFLECT: readonly string[] = [
  'How does your tradition-bearer’s story relate to your community in both the present and the past? How does it relate to you?',
  'If the roles were reversed and you became the tradition-bearer, what stories would you like to tell?',
];

export const SHARE_IDEAS: ApprovedFact = {
  text: 'Ideas to share it: a family recipe book, a “heritage box”, a memory quilt square, an illustrated family tree “annotated with stories and reminiscences about different family members.”',
  sources: [SMITHSONIAN_GUIDE],
};

/** The write-up: what the visitor fills in after the interview. Interface text. */
export const WRITE_UP = [
  { id: 'story', label: 'A story she told me that I want to remember' },
  { id: 'learned', label: 'Something I learned about the past' },
  { id: 'surprised', label: 'Something that surprised me' },
  { id: 'reflect1', label: REFLECT[0] },
  { id: 'reflect2', label: REFLECT[1] },
] as const;
export type WriteUpId = (typeof WRITE_UP)[number]['id'];

/** Every guide the room draws on, listed together at its foot and on the printed sheet. */
export const ORAL_SOURCES: readonly FactSource[] = [SMITHSONIAN_GUIDE, SMITHSONIAN_FAMILY, FOLKLIFE_FIELDWORK, VETERANS_HISTORY];

export const INTERVIEW_COUNT =INTERVIEW.reduce((n, g) => n + g.questions.length, 0);
