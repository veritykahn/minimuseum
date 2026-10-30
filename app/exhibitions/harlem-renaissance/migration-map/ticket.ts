/**
 * "Punch your ticket": one question per stop, answered from that stop's own
 * panel. Each answer is in the city's words on the map (`evidence` is the
 * exact phrase, checked by a test), so the game adds no new facts: it asks
 * students to read what is already there. A right answer earns the city's
 * stamp; a wrong one is set aside and they try again.
 */

export type TicketQuestion = {
  cityId: string;
  question: string;
  options: readonly string[];
  answer: string;
  /** The words in the city's panel text that give the answer. */
  evidence: string;
};

export const TICKET_QUESTIONS: readonly TicketQuestion[] = [
  {
    cityId: 'delta',
    question: 'Work songs, field hollers and spirituals were the raw material for which music?',
    options: ['Ragtime', 'The blues', 'Swing'],
    answer: 'The blues',
    evidence: 'the raw material that would become the blues',
  },
  {
    cityId: 'new-orleans',
    question: 'What did people call the new sound in New Orleans?',
    options: ['“Jass”', '“Swing”', '“Bebop”'],
    answer: '“Jass”',
    evidence: 'They called the new sound “jass.”',
  },
  {
    cityId: 'memphis',
    question: 'Who heard the blues in Memphis and published “Memphis Blues” in 1912?',
    options: ['Scott Joplin', 'King Oliver', 'W.C. Handy'],
    answer: 'W.C. Handy',
    evidence: 'W.C. Handy heard the blues here and wrote them down, publishing “Memphis Blues” in 1912',
  },
  {
    cityId: 'st-louis',
    question: 'Whose band played jazz on the Mississippi riverboats?',
    options: ['Fate Marable’s band', 'Fletcher Henderson’s orchestra', 'Duke Ellington’s orchestra'],
    answer: 'Fate Marable’s band',
    evidence: 'Fate Marable’s band played jazz on Mississippi riverboats',
  },
  {
    cityId: 'chicago',
    question: 'Who moved to Chicago in 1918, then sent for young Louis Armstrong in 1922?',
    options: ['W.C. Handy', 'King Oliver', 'Scott Joplin'],
    answer: 'King Oliver',
    evidence: 'King Oliver moved from New Orleans to Chicago in 1918, then sent for young Louis Armstrong in 1922',
  },
  {
    cityId: 'harlem',
    question: 'Which musician left Chicago for New York in 1924?',
    options: ['Fate Marable', 'W.C. Handy', 'Louis Armstrong'],
    answer: 'Louis Armstrong',
    evidence: 'in 1924 Louis Armstrong left Chicago for New York',
  },
];

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
