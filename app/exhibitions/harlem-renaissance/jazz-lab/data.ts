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
  variants: InstrumentVariant[];
  fact: {
    title: string;
    text: string;
    quote: string;
  };
};

// the clips moved to guess-instrument/ in February 2026; this path was missed
const AUDIO_BASE = '/exhibitions/harlem/audio/guess-instrument';

export const INSTRUMENTS: InstrumentDef[] = [
  {
    id: 'drums',
    name: 'Drums',
    tip: 'Rhythm without a tune: struck drums and shimmering cymbals. Those are the drums.',
    variants: [
      { id: 'drums-1', audioSrc: `${AUDIO_BASE}/drums-1.mp3`, label: '1' },
      { id: 'drums-2', audioSrc: `${AUDIO_BASE}/drums-2.mp3`, label: '2' },
      { id: 'drums-3', audioSrc: `${AUDIO_BASE}/drums-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Drums in Jazz',
      text: 'Chick Webb, the tiny drummer with the thunderous sound, ruled the Savoy Ballroom from 1931. His drum battles were legendary \u2014 even Benny Goodman\'s band couldn\'t outswing him.',
      quote: '"The rhythm is below everything." \u2014 Chick Webb',
    },
  },
  {
    id: 'bass',
    name: 'Double Bass',
    tip: 'Deep, round, plucked notes underneath everything. That’s the double bass.',
    variants: [
      { id: 'double-bass-1', audioSrc: `${AUDIO_BASE}/double-bass-1.mp3`, label: '1' },
      { id: 'double-bass-2', audioSrc: `${AUDIO_BASE}/double-bass-2.mp3`, label: '2' },
      { id: 'double-bass-3', audioSrc: `${AUDIO_BASE}/double-bass-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Bass in Jazz',
      text: 'The upright bass was the heartbeat of every Harlem jazz combo. Players like Jimmy Blanton revolutionized the instrument, turning the bass from timekeeper into soloist.',
      quote: '"The bass is the link between harmony and rhythm." \u2014 Ray Brown',
    },
  },
  {
    id: 'piano',
    name: 'Piano',
    tip: 'Hammered notes that ring and fade, often several at once. That’s the piano.',
    variants: [
      { id: 'piano-1', audioSrc: `${AUDIO_BASE}/piano-1.mp3`, label: '1' },
      { id: 'piano-2', audioSrc: `${AUDIO_BASE}/piano-2.mp3`, label: '2' },
      { id: 'piano-3', audioSrc: `${AUDIO_BASE}/piano-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Piano in Jazz',
      text: 'Fats Waller and James P. Johnson pioneered "stride piano" at Harlem rent parties, where tenants would hire pianists to play while guests paid admission to help cover rent.',
      quote: '"Jazz is not just music, it\'s a way of life." \u2014 Fats Waller',
    },
  },
  {
    id: 'trumpet',
    name: 'Trumpet',
    tip: 'A bright, brassy attack. That’s the trumpet.',
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
    variants: [
      { id: 'clarinet-1', audioSrc: `${AUDIO_BASE}/clarinet-1.mp3`, label: '1' },
      { id: 'clarinet-2', audioSrc: `${AUDIO_BASE}/clarinet-2.mp3`, label: '2' },
      { id: 'clarinet-3', audioSrc: `${AUDIO_BASE}/clarinet-3.mp3`, label: '3' },
    ],
    fact: {
      title: 'The Clarinet in Jazz',
      text: 'The clarinet was the dominant melodic voice of early jazz. Sidney Bechet and Benny Goodman brought it from New Orleans to Harlem, where it sang over the big bands of the swing era.',
      quote: '"I live my daydreams in music." \u2014 Sidney Bechet',
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
    quote: string;
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
      quote: '"The rhythm is below everything." \u2014 Chick Webb',
    },
  },
  {
    id: 'bass',
    name: 'Bass',
    sections: [1, 2, 3, 4, 5, 6, 7, 8],
    fact: {
      title: 'The Bass in Jazz',
      text: 'The upright bass was the heartbeat of every Harlem jazz combo. Players like Jimmy Blanton revolutionized the instrument, turning the bass from timekeeper into soloist.',
      quote: '"The bass is the link between harmony and rhythm." \u2014 Ray Brown',
    },
  },
  {
    id: 'piano',
    name: 'Piano',
    sections: [1, 2, 3, 4, 5, 6, 7, 8],
    fact: {
      title: 'The Piano in Jazz',
      text: 'Fats Waller and James P. Johnson pioneered "stride piano" at Harlem rent parties, where tenants would hire pianists to play while guests paid admission to help cover rent.',
      quote: '"Jazz is not just music, it\'s a way of life." \u2014 Fats Waller',
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
