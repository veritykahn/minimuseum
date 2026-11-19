/**
 * "Punch your ticket": one question per stop, answered from that stop's own
 * panel. Each answer rests on the city's words on the map (`evidence` is the
 * exact phrase, checked by a test), so the game adds no new facts. The
 * questions ask what the words mean, not which name they mention: why
 * Memphis is called a bridge, what a population rising fivefold tells you,
 * which road Harlem's newcomers took. A right answer earns the city's stamp
 * and a line on why it is right; a wrong one is set aside and they try again.
 *
 * REVIEW (Verity): new questions. The first set could be answered by
 * matching a name in the question to the same name in the story ("Who heard
 * the blues in Memphis and published 'Memphis Blues' in 1912?").
 */
export type TicketQuestion = {
  cityId: string;
  question: string;
  options: readonly string[];
  answer: string;
  /** The words in the city's panel text that give the answer. */
  evidence: string;
  /** Said with the stamp: why the answer is right, from the same words. */
  why: string;
};

// REVIEW: new text (every question, option and why below)
export const TICKET_QUESTIONS: readonly TicketQuestion[] = [
  {
    cityId: 'new-orleans',
    question: 'Why was New Orleans a good place for a brand-new kind of music to begin?',
    options: [
      'Only one kind of music was allowed there',
      'Many kinds of music were mixing in its streets',
      'It was far from any river',
    ],
    answer: 'Many kinds of music were mixing in its streets',
    evidence: 'brass bands, ragtime, blues, and Caribbean rhythms were all colliding in the streets',
    why: 'Brass bands, ragtime, blues and Caribbean rhythms all met there, and out of the mix came “jass.”',
  },
  {
    cityId: 'delta',
    question: 'Sharecroppers in the Delta were trapped in debt. What did they have that no one could take from them?',
    options: ['Their land', 'Their money', 'Their music'],
    answer: 'Their music',
    evidence: 'they carried something no one could take from them: their music',
    why: 'Work songs, field hollers and spirituals: the music that would become the blues.',
  },
  {
    cityId: 'memphis',
    question: 'The story calls Memphis “the bridge.” What did it join together?',
    options: [
      'Folk music from the countryside and the music business',
      'The two banks of the Atlantic Ocean',
      'Chicago and New York',
    ],
    answer: 'Folk music from the countryside and the music business',
    evidence: 'It was the bridge between rural folk music and the commercial recording industry',
    why: 'W.C. Handy wrote down the blues he heard and published them as sheet music: country songs became part of the music business.',
  },
  {
    cityId: 'st-louis',
    question: 'How did jazz get from New Orleans up to St. Louis? Look at the map, too.',
    options: ['On ships across the Atlantic', 'On riverboats up the Mississippi', 'By airplane'],
    answer: 'On riverboats up the Mississippi',
    evidence: 'Fate Marable’s band played jazz on Mississippi riverboats, carrying the sound from New Orleans upriver to St. Louis',
    why: 'Fate Marable’s band played on the riverboats, carrying the sound upriver. Find the Mississippi on the map: it joins the two cities.',
  },
  {
    cityId: 'chicago',
    question: 'Chicago’s Black population grew from about 44,000 to about 234,000. What does that tell you?',
    options: [
      'Many Black families were leaving Chicago',
      'Many Black families moved to Chicago',
      'Chicago stayed about the same',
    ],
    answer: 'Many Black families moved to Chicago',
    evidence: 'Chicago’s Black population grew more than fivefold, from about 44,000 to about 234,000',
    why: 'More than five times as many people in twenty years, from 1910 to 1930: families were arriving on the trains from the South.',
  },
  {
    cityId: 'harlem',
    question: 'The music came to Harlem by way of Chicago. Which way did most of Harlem’s newcomers come?',
    options: ['Through Chicago, like the music', 'Up the Mississippi River', 'Up the Atlantic coast'],
    answer: 'Up the Atlantic coast',
    evidence: 'Most of its newcomers had come up the Atlantic coast',
    why: 'From Virginia, the Carolinas, Georgia and Florida. The people and the music took different roads north.',
  },
];

/**
 * "Where next?": before each ride the child finds the next stop on the map
 * from a clue, rather than being told it. Each clue is in the words of that
 * stop's own panel (`evidence`, checked by a test) and never names the place.
 * Keyed by the stop the clue leads to.
 *
 * REVIEW (Verity): new clues.
 */
export type NextStopClue = { clue: string; evidence: string };

// REVIEW: new text
export const NEXT_STOP_CLUES: Readonly<Record<string, NextStopClue>> = {
  delta: {
    clue: 'Head upriver to the flat cotton fields, where work songs, field hollers and spirituals were becoming the blues.',
    evidence: 'Upriver from New Orleans lie the flat cotton fields',
  },
  memphis: {
    clue: 'Ride on to the crossroads halfway between the Delta and the North, where Beale Street was lined with clubs and theaters.',
    evidence: 'halfway between the Delta and the North',
  },
  'st-louis': {
    clue: 'Follow the riverboats up the Mississippi to the city where the river met the railroad.',
    evidence: 'St. Louis was where the river met the railroad',
  },
  chicago: {
    clue: 'Take the train to the end of the line: the city by a great lake where the trains from the South ended.',
    evidence: 'The trains from the South ended at Chicago',
  },
  harlem: {
    clue: 'Now turn east, all the way to the Atlantic, to the Promised Land: the cultural capital of Black America.',
    evidence: 'the cultural capital of Black America',
  },
};

/**
 * What a wrong pick on the map says: the stop chosen is further along the
 * journey than the next one (only stops not yet reached can be picked).
 */
export function wrongStopLine(pickedName: string, fromName: string): string {
  // REVIEW: new text
  return `Not yet: the music reaches ${pickedName} later on. Read the clue again, and look for a stop nearer ${fromName}.`;
}

export function questionFor(cityId: string): TicketQuestion | undefined {
  return TICKET_QUESTIONS.find((q) => q.cityId === cityId);
}

/** Stamps earned, and the wrong answers tried at each city. */
export type TicketState = {
  stamps: Readonly<Record<string, true>>;
  misses: Readonly<Record<string, readonly string[]>>;
};

export const EMPTY_TICKET: TicketState = { stamps: {}, misses: {} };

/**
 * Applies one answer. A stamped city does not change; a wrong answer is
 * remembered (so its button can be set aside) and never costs a stamp.
 */
export function answerTicket(state: TicketState, cityId: string, choice: string): { state: TicketState; correct: boolean } {
  const q = questionFor(cityId);
  if (!q || state.stamps[cityId]) return { state, correct: !!state.stamps[cityId] };
  if (choice === q.answer) {
    return { state: { ...state, stamps: { ...state.stamps, [cityId]: true } }, correct: true };
  }
  const tried = state.misses[cityId] ?? [];
  if (tried.includes(choice)) return { state, correct: false };
  return { state: { ...state, misses: { ...state.misses, [cityId]: [...tried, choice] } }, correct: false };
}

export function stampCount(state: TicketState): number {
  return TICKET_QUESTIONS.filter((q) => state.stamps[q.cityId]).length;
}

export function ticketComplete(state: TicketState): boolean {
  return stampCount(state) === TICKET_QUESTIONS.length;
}
