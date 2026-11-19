import type { Tier } from '@/components/games/scoring';

export type InstrumentId = 'piano' | 'trumpet' | 'saxophone' | 'clarinet' | 'drums' | 'bass';

export type InstrumentVariant = {
  id: string;
  audioSrc: string;
  label: string;
};

export type InstrumentDef = {
  id: InstrumentId;
  name: string;
  /** What to listen for: one generic sentence, shown after a quiz answer. */
  tip: string;
  /**
   * The same sound described as this instrument's own, for a wrong first
   * answer ("Not the trumpet: a trumpet starts each note…"), so the player
   * can compare it with what they hear before trying again.
   */
  listenFor: string;
  /** For a teacher in projector mode: what to ask the class after the reveal. */
  teacherTip?: string;
  variants: InstrumentVariant[];
  fact: {
    title: string;
    text: string;
    /** a line the musician is on record as saying; left out when none can be sourced */
    quote?: string;
  };
};

// the clips moved to guess-instrument/ in February 2026; this path was missed
const AUDIO_BASE = '/exhibitions/harlem/audio/guess-instrument';

export const INSTRUMENTS: InstrumentDef[] = [
  {
    id: 'drums',
    name: 'Drums',
    tip: 'Rhythm without a tune: struck drums and shimmering cymbals. Those are the drums.',
    // REVIEW: new text
    listenFor: 'Drums play rhythm without a tune: struck drums and shimmering cymbals.',
    teacherTip:
      'Ask whether there is a tune or only rhythm, then listen again for the shimmer of the cymbals.',
    variants: [
      { id: 'drums-1', audioSrc: `${AUDIO_BASE}/drums-1.mp3`, label: '1' },
      { id: 'drums-2', audioSrc: `${AUDIO_BASE}/drums-2.mp3`, label: '2' },
      { id: 'drums-3', audioSrc: `${AUDIO_BASE}/drums-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Drums in Jazz',
      text: 'Chick Webb, the tiny drummer with the thunderous sound, ruled the Savoy Ballroom from 1931. His drum battles were legendary \u2014 even Benny Goodman\'s band couldn\'t outswing him.',
    },
  },
  {
    id: 'bass',
    name: 'Double Bass',
    tip: 'Deep, round, plucked notes underneath everything. That’s the double bass.',
    // REVIEW: new text
    listenFor: 'A double bass plays deep, round, plucked notes underneath everything.',
    teacherTip:
      'Ask whether the notes sit high or low, and point out that they are plucked and sit underneath everything.',
    variants: [
      { id: 'double-bass-1', audioSrc: `${AUDIO_BASE}/double-bass-1.mp3`, label: '1' },
      { id: 'double-bass-2', audioSrc: `${AUDIO_BASE}/double-bass-2.mp3`, label: '2' },
      { id: 'double-bass-3', audioSrc: `${AUDIO_BASE}/double-bass-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Bass in Jazz',
      text: 'The upright bass was the heartbeat of every Harlem jazz combo. Players like Jimmy Blanton revolutionized the instrument, turning the bass from timekeeper into soloist.',
    },
  },
  {
    id: 'piano',
    name: 'Piano',
    tip: 'Hammered notes that ring and fade, often several at once. That’s the piano.',
    // REVIEW: new text
    listenFor: 'A piano’s hammered notes ring and fade, often several at once.',
    teacherTip:
      'Ask whether more than one note sounds at once, then listen for notes that ring and fade.',
    variants: [
      { id: 'piano-1', audioSrc: `${AUDIO_BASE}/piano-1.mp3`, label: '1' },
      { id: 'piano-2', audioSrc: `${AUDIO_BASE}/piano-2.mp3`, label: '2' },
      { id: 'piano-3', audioSrc: `${AUDIO_BASE}/piano-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Piano in Jazz',
      text: 'Fats Waller and James P. Johnson pioneered "stride piano" at Harlem rent parties, where tenants would hire pianists to play while guests paid admission to help cover rent.',
      quote: '"One never knows, do one?" \u2014 Fats Waller\u2019s catchphrase',
    },
  },
  {
    id: 'trumpet',
    name: 'Trumpet',
    tip: 'A bright, brassy attack. That’s the trumpet.',
    // REVIEW: new text
    listenFor: 'A trumpet starts each note with a bright, brassy attack.',
    teacherTip:
      'Ask the class to describe the very start of each note: is it bright and brassy?',
    variants: [
      { id: 'trumpet-1', audioSrc: `${AUDIO_BASE}/trumpet-1.mp3`, label: '1' },
      { id: 'trumpet-2', audioSrc: `${AUDIO_BASE}/trumpet-2.mp3`, label: '2' },
      { id: 'trumpet-3', audioSrc: `${AUDIO_BASE}/trumpet-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Trumpet in Jazz',
      text: 'Louis Armstrong transformed the trumpet from an ensemble instrument into a solo voice. His improvisations at the Cotton Club and Savoy Ballroom defined the sound of the Harlem Renaissance.',
      quote: '"What we play is life." \u2014 Louis Armstrong',
    },
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    tip: 'A reedy, breathy tone that bends like a voice. That’s the saxophone.',
    // REVIEW: new text
    listenFor: 'A saxophone has a reedy, breathy tone that bends like a voice.',
    teacherTip:
      'Ask whether the sound bends like a singing voice, then listen again for its reedy, breathy tone.',
    variants: [
      { id: 'saxophone-1', audioSrc: `${AUDIO_BASE}/saxophone-1.mp3`, label: '1' },
      { id: 'saxophone-2', audioSrc: `${AUDIO_BASE}/saxophone-2.mp3`, label: '2' },
      { id: 'saxophone-3', audioSrc: `${AUDIO_BASE}/saxophone-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Saxophone in Jazz',
      text: 'Coleman Hawkins established the tenor saxophone as a jazz instrument with his 1939 recording of "Body and Soul." The sax became the voice of Harlem\'s nightlife.',
      quote: '"If you don\'t make mistakes, you aren\'t really trying." \u2014 Coleman Hawkins',
    },
  },
  {
    id: 'clarinet',
    name: 'Clarinet',
    tip: 'A smooth, woody tone, sweet up high and dark down low. That’s the clarinet.',
    // REVIEW: new text
    listenFor: 'A clarinet has a smooth, woody tone, sweet up high and dark down low.',
    teacherTip:
      'Ask the class to compare its high and low notes: sweet up high, dark down low.',
    variants: [
      { id: 'clarinet-1', audioSrc: `${AUDIO_BASE}/clarinet-1.mp3`, label: '1' },
      { id: 'clarinet-2', audioSrc: `${AUDIO_BASE}/clarinet-2.mp3`, label: '2' },
      { id: 'clarinet-3', audioSrc: `${AUDIO_BASE}/clarinet-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Clarinet in Jazz',
      text: 'The clarinet was the dominant melodic voice of early jazz. Sidney Bechet and Benny Goodman brought it from New Orleans to Harlem, where it sang over the big bands of the swing era.',
    },
  },
];

export const INSTRUMENT_MAP: Record<InstrumentId, InstrumentDef> = Object.fromEntries(
  INSTRUMENTS.map(i => [i.id, i])
) as Record<InstrumentId, InstrumentDef>;

export const ALL_INSTRUMENT_IDS: InstrumentId[] = ['drums', 'bass', 'piano', 'trumpet', 'saxophone', 'clarinet'];

// Quiz data
export type QuizAudioItem = {
  src: string;
  instrument: InstrumentId;
};

export const QUIZ_AUDIO_POOL: QuizAudioItem[] = [
  { src: `${AUDIO_BASE}/piano-1.mp3`, instrument: 'piano' },
  { src: `${AUDIO_BASE}/piano-2.mp3`, instrument: 'piano' },
  { src: `${AUDIO_BASE}/piano-3.mp3`, instrument: 'piano' },
  { src: `${AUDIO_BASE}/trumpet-1.mp3`, instrument: 'trumpet' },
  { src: `${AUDIO_BASE}/trumpet-2.mp3`, instrument: 'trumpet' },
  { src: `${AUDIO_BASE}/trumpet-3.mp3`, instrument: 'trumpet' },
  { src: `${AUDIO_BASE}/saxophone-1.mp3`, instrument: 'saxophone' },
  { src: `${AUDIO_BASE}/saxophone-2.mp3`, instrument: 'saxophone' },
  { src: `${AUDIO_BASE}/saxophone-3.mp3`, instrument: 'saxophone' },
  { src: `${AUDIO_BASE}/clarinet-1.mp3`, instrument: 'clarinet' },
  { src: `${AUDIO_BASE}/clarinet-2.mp3`, instrument: 'clarinet' },
  { src: `${AUDIO_BASE}/clarinet-3.mp3`, instrument: 'clarinet' },
  { src: `${AUDIO_BASE}/drums-1.mp3`, instrument: 'drums' },
  { src: `${AUDIO_BASE}/drums-2.mp3`, instrument: 'drums' },
  { src: `${AUDIO_BASE}/drums-3.mp3`, instrument: 'drums' },
  { src: `${AUDIO_BASE}/double-bass-1.mp3`, instrument: 'bass' },
  { src: `${AUDIO_BASE}/double-bass-2.mp3`, instrument: 'bass' },
  { src: `${AUDIO_BASE}/double-bass-3.mp3`, instrument: 'bass' },
];

export const TOTAL_QUIZ_ROUNDS = 12;

export type ScoreRating = {
  min: number;
  label: string;
  message: string;
};

export const SCORE_RATINGS: ScoreRating[] = [
  { min: 12, label: 'Jazz Master', message: 'Perfect score! Duke Ellington would be proud.' },
  { min: 10, label: 'Jazz Aficionado', message: "You've got a serious ear for jazz!" },
  { min: 7, label: 'Bandstand Regular', message: 'Not bad! Keep listening.' },
  { min: 4, label: 'Jazz Newcomer', message: 'Keep exploring the sounds of jazz.' },
  { min: 0, label: 'First Night at the Club', message: 'The Harlem jazz scene awaits your return!' },
];

/** The same ratings as shares of the rounds played, for the shared ending. */
export const QUIZ_TIERS: Tier[] = SCORE_RATINGS.map((r) => ({
  min: r.min / TOTAL_QUIZ_ROUNDS,
  title: r.label,
  message: r.message,
}));

// ─── Build a Band (Section-based) ───────────────────────────────────────────

export type BandInstrumentId = 'drums' | 'bass' | 'piano' | 'saxophone' | 'trumpet' | 'horns';

export type BandInstrumentDef = {
  id: BandInstrumentId;
  name: string;
  sections: number[];
  fact: {
    title: string;
    text: string;
    /** a line the musician is on record as saying; left out when none can be sourced */
    quote?: string;
  };
};

export type SectionDef = {
  number: number;
  name: string;
  /** One sentence on what this part of a jazz tune is (general music theory). */
  description: string;
};

const BAND_AUDIO_BASE = '/exhibitions/harlem/audio/build-a-band';

export function getBandAudioSrc(id: BandInstrumentId, section: number): string {
  return `${BAND_AUDIO_BASE}/${id}-${section}.mp3`;
}

export const SECTIONS: SectionDef[] = [
  { number: 1, name: 'Intro', description: 'The opening bars that set the tempo and the mood before the tune begins.' },
  { number: 2, name: 'Head', description: 'The main melody of the tune, played before the solos and usually again at the end.' },
  { number: 3, name: 'Piano Solo', description: 'The pianist improvises, inventing a new melody on the spot over the tune’s chords.' },
  { number: 4, name: 'Horn Solo', description: 'A horn takes its turn to improvise while the rhythm section keeps time underneath.' },
  { number: 5, name: 'Walking Bass', description: 'The bass plays a steady note on every beat, walking up and down through the chords.' },
  { number: 6, name: 'Groove', description: 'The rhythm section locks into a repeating pattern: the feel that makes you want to dance.' },
  { number: 7, name: 'Bridge', description: 'A contrasting middle section with new chords that leads back to the main melody.' },
  { number: 8, name: 'Finale', description: 'The ending, where the whole band comes together to bring the tune home.' },
];

export const BAND_INSTRUMENTS: BandInstrumentDef[] = [
  {
    id: 'drums',
    name: 'Drums',
    sections: [1, 2, 3, 4, 5, 6, 7, 8],
    fact: {
      title: 'The Drums in Jazz',
      text: 'Chick Webb, the tiny drummer with the thunderous sound, ruled the Savoy Ballroom from 1931. His drum battles were legendary \u2014 even Benny Goodman\'s band couldn\'t outswing him.',
    },
  },
  {
    id: 'bass',
    name: 'Bass',
    sections: [1, 2, 3, 4, 5, 6, 7, 8],
    fact: {
      title: 'The Bass in Jazz',
      text: 'The upright bass was the heartbeat of every Harlem jazz combo. Players like Jimmy Blanton revolutionized the instrument, turning the bass from timekeeper into soloist.',
    },
  },
  {
    id: 'piano',
    name: 'Piano',
    sections: [1, 2, 3, 4, 5, 6, 7, 8],
    fact: {
      title: 'The Piano in Jazz',
      text: 'Fats Waller and James P. Johnson pioneered "stride piano" at Harlem rent parties, where tenants would hire pianists to play while guests paid admission to help cover rent.',
      quote: '"One never knows, do one?" \u2014 Fats Waller\u2019s catchphrase',
    },
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    sections: [2, 3, 4, 5, 6, 7],
    fact: {
      title: 'The Saxophone in Jazz',
      text: 'Coleman Hawkins established the tenor saxophone as a jazz instrument with his 1939 recording of "Body and Soul." The sax became the voice of Harlem\'s nightlife.',
      quote: '"If you don\'t make mistakes, you aren\'t really trying." \u2014 Coleman Hawkins',
    },
  },
  {
    id: 'trumpet',
    name: 'Trumpet',
    sections: [1, 2, 3, 4, 5, 7],
    fact: {
      title: 'The Trumpet in Jazz',
      text: 'Louis Armstrong transformed the trumpet from an ensemble instrument into a solo voice. His improvisations at the Cotton Club and Savoy Ballroom defined the sound of the Harlem Renaissance.',
      quote: '"What we play is life." \u2014 Louis Armstrong',
    },
  },
  {
    id: 'horns',
    name: 'Ensemble',
    sections: [3, 4, 8],
    fact: {
      title: 'The Horn Section',
      text: 'Big bands of the Harlem Renaissance era featured powerful horn sections \u2014 trumpets, trombones, and saxophones playing arranged harmonies that could fill the Cotton Club or the Savoy Ballroom.',
      quote: '"It don\'t mean a thing if it ain\'t got that swing." \u2014 Duke Ellington',
    },
  },
];

export const BAND_INSTRUMENT_MAP: Record<BandInstrumentId, BandInstrumentDef> = Object.fromEntries(
  BAND_INSTRUMENTS.map(i => [i.id, i])
) as Record<BandInstrumentId, BandInstrumentDef>;

// ─── Build a Band: the bandleader's requests ─────────────────────────────────

/** What a request is checked against: the band as it stands. */
export type BandState = { section: number; active: ReadonlySet<BandInstrumentId>; spotlight: BandInstrumentId | null };

export type BandGoal = {
  id: string;
  /**
   * What the bandleader asks for, in words taken from a song section's own
   * description (SECTIONS) but never naming the section or the players: the
   * child works out which part of the tune it is, and who should play it.
   */
  goal: string;
  /** The part of the tune that answers the request. */
  section: number;
  /** Who must be playing (on top of the soloist). */
  needs: readonly BandInstrumentId[];
  /** Who may take the spotlight; empty means nobody: the whole band evenly. */
  soloists: readonly BandInstrumentId[];
  /** Everyone the section allows must be on stage (the finale). */
  everyone?: boolean;
  /** After a wrong try: a nudge that points the way without giving it all. */
  hint: string;
  /** After a right one: what the child just made, named. */
  success: string;
};

/**
 * The bandleader's requests. They are dealt in a shuffled order, and the
 * child plays each one for the bandleader to check (the check names what is
 * still off, a hint follows a wrong try). Every request is a section from
 * SECTIONS, described in that section's own words; the players it needs are
 * the ones that description names ("while the rhythm section keeps time":
 * the drums and the bass).
 *
 * REVIEW (Verity): new requests and wording. They replace four goals that
 * spelled out every tap ("Pick Piano Solo. Bring on drums and bass, then give
 * the piano the spotlight"), which made the goal a set of instructions to
 * follow rather than a puzzle to work out. "The rhythm section" is the
 * standard name for a jazz band's piano, bass and drums.
 */
export const BAND_GOALS: readonly BandGoal[] = [
  {
    id: 'piano-solo',
    // REVIEW: new text
    goal: 'The pianist wants a turn to invent a brand-new melody on the spot, while the drums and bass keep time.',
    section: 3,
    needs: ['drums', 'bass'],
    soloists: ['piano'],
    hint: 'Read the song sections: one of them is the pianist’s turn to improvise. Then give the piano the spotlight.',
    success: 'That’s a piano solo: the pianist improvises over the tune’s chords.',
  },
  {
    id: 'horn-solo',
    // REVIEW: new text
    goal: 'A horn player wants to improvise. Give a horn its turn out front, with the drums and bass keeping time underneath.',
    section: 4,
    needs: ['drums', 'bass'],
    soloists: ['saxophone', 'trumpet'],
    hint: 'Find the section where a horn takes its turn. The saxophone and the trumpet are the horns that can solo.',
    success: 'That’s a horn solo, with the rhythm section keeping time underneath.',
  },
  {
    id: 'walking-bass',
    // REVIEW: new text
    goal: 'Let the bass go for a walk: one steady note on every beat, up and down through the chords. The drummer keeps it company.',
    section: 5,
    needs: ['drums'],
    soloists: ['bass'],
    hint: 'Which section is named after the way the bass moves? The bass is the star of this one.',
    success: 'That’s a walking bass: a note on every beat, walking through the chords.',
  },
  {
    id: 'groove',
    // REVIEW: new text
    goal: 'The dancers want a repeating pattern that makes them move. Lock in the piano, bass and drums, with nobody showing off out front.',
    section: 6,
    needs: ['piano', 'bass', 'drums'],
    soloists: [],
    hint: 'Look for the section the dancers love. If someone is in the spotlight, tap them again so the band plays evenly.',
    success: 'That’s the groove: the rhythm section locked into a pattern you can dance to.',
  },
  {
    id: 'finale',
    // REVIEW: new text
    goal: 'Last number of the night! Bring the tune home with the whole band together, and nobody out in front.',
    section: 8,
    needs: [],
    soloists: [],
    everyone: true,
    hint: 'Find the ending. Every instrument that can play it should be on stage, and nobody in the spotlight.',
    success: 'That’s the finale: the whole band brings the tune home together.',
  },
];

export type GoalProblem = 'section' | 'missing' | 'soloist' | 'no-soloist';

/**
 * What is still off for a request, in the order a child should fix it
 * (an empty list means the band is right). `missing` lists the players
 * still needed on stage.
 */
export function judgeGoal(goal: BandGoal, band: BandState): { problems: GoalProblem[]; missing: BandInstrumentId[] } {
  const problems: GoalProblem[] = [];
  if (band.section !== goal.section) return { problems: ['section'], missing: [] };
  const wanted = goal.everyone
    ? BAND_INSTRUMENTS.filter((i) => i.sections.includes(goal.section)).map((i) => i.id)
    : [...goal.needs, ...goal.soloists.slice(0, goal.soloists.length === 1 ? 1 : 0)];
  const missing = wanted.filter((id) => !band.active.has(id));
  if (missing.length > 0) problems.push('missing');
  if (goal.soloists.length === 0) {
    if (band.spotlight !== null) problems.push('no-soloist');
  } else if (!band.spotlight || !goal.soloists.includes(band.spotlight)) {
    problems.push('soloist');
  }
  return { problems, missing };
}

/** What the bandleader says about one problem: a pointer, not the answer. */
export function problemLine(goal: BandGoal, problem: GoalProblem, missing: readonly BandInstrumentId[]): string {
  // REVIEW: new text
  switch (problem) {
    case 'section':
      return 'That’s not the part of the tune I asked for. Tap the song sections and read what each one is.';
    case 'missing':
      return `Someone is missing: bring on the ${listNames(missing)}.`;
    case 'soloist':
      return goal.soloists.length === 1
        ? 'The right player isn’t in the spotlight yet. Who did I ask to take a turn?'
        : 'The right player isn’t in the spotlight yet. Which instruments are horns?';
    case 'no-soloist':
      return 'Nobody should be out in front for this one. Tap the player in the spotlight so the whole band plays evenly.';
  }
}

function listNames(ids: readonly BandInstrumentId[]): string {
  const names = ids.map((id) => BAND_INSTRUMENT_MAP[id].name.toLowerCase());
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
