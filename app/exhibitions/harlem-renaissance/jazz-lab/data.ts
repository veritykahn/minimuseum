export type InstrumentId = 'piano' | 'trumpet' | 'saxophone' | 'clarinet' | 'drums' | 'bass';

export type InstrumentVariant = {
  id: string;
  audioSrc: string;
  label: string;
};

export type InstrumentDef = {
  id: InstrumentId;
  name: string;
  emoji: string;
  variants: InstrumentVariant[];
  fact: {
    title: string;
    text: string;
    quote: string;
  };
};

export const INSTRUMENTS: InstrumentDef[] = [
  {
    id: 'drums',
    name: 'Drums',
    emoji: '\u{1F941}',
    variants: [
      { id: 'drum-1', audioSrc: '/exhibitions/harlem/audio/drum-1.mp3', label: 'Swing' },
      { id: 'drum-2', audioSrc: '/exhibitions/harlem/audio/drum-2.mp3', label: 'Brush' },
    ],
    fact: {
      title: 'The Drums in Jazz',
      text: 'Chick Webb, the tiny drummer with the thunderous sound, ruled the Savoy Ballroom from 1931. His drum battles were legendary \u2014 even Benny Goodman\'s band couldn\'t outswing him.',
      quote: '"The rhythm is below everything." \u2014 Chick Webb',
    },
  },
  {
    id: 'bass',
    name: 'Bass',
    emoji: '\u{1F3B8}',
    variants: [
      { id: 'doublebass-1', audioSrc: '/exhibitions/harlem/audio/doublebass-1.mp3', label: 'Walking' },
      { id: 'doublebass-2', audioSrc: '/exhibitions/harlem/audio/doublebass-2.mp3', label: 'Pizzicato' },
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
    emoji: '\u{1F3B9}',
    variants: [
      { id: 'piano-1', audioSrc: '/exhibitions/harlem/audio/piano-1.mp3', label: 'Stride' },
      { id: 'piano-2', audioSrc: '/exhibitions/harlem/audio/piano-2.mp3', label: 'Bebop' },
      { id: 'piano-3', audioSrc: '/exhibitions/harlem/audio/piano-3.mp3', label: 'Blues' },
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
    emoji: '\u{1F3BA}',
    variants: [
      { id: 'trumpet-1', audioSrc: '/exhibitions/harlem/audio/trumpet-1.mp3', label: 'Bright' },
      { id: 'trumpet-2', audioSrc: '/exhibitions/harlem/audio/trumpet-2.mp3', label: 'Muted' },
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
    emoji: '\u{1F3B7}',
    variants: [
      { id: 'saxophone-1', audioSrc: '/exhibitions/harlem/audio/saxophone-1.mp3', label: 'Smooth' },
      { id: 'saxophone-2', audioSrc: '/exhibitions/harlem/audio/saxophone-2.mp3', label: 'Swing' },
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
    emoji: '\u{1FA88}',
    variants: [
      { id: 'clarinet-1', audioSrc: '/exhibitions/harlem/audio/clarinet-1.mp3', label: 'Sweet' },
      { id: 'clarinet-2', audioSrc: '/exhibitions/harlem/audio/clarinet-2.mp3', label: 'Hot' },
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
  { src: '/exhibitions/harlem/audio/piano-1.mp3', instrument: 'piano' },
  { src: '/exhibitions/harlem/audio/piano-2.mp3', instrument: 'piano' },
  { src: '/exhibitions/harlem/audio/piano-3.mp3', instrument: 'piano' },
  { src: '/exhibitions/harlem/audio/trumpet-1.mp3', instrument: 'trumpet' },
  { src: '/exhibitions/harlem/audio/trumpet-2.mp3', instrument: 'trumpet' },
  { src: '/exhibitions/harlem/audio/saxophone-1.mp3', instrument: 'saxophone' },
  { src: '/exhibitions/harlem/audio/saxophone-2.mp3', instrument: 'saxophone' },
  { src: '/exhibitions/harlem/audio/clarinet-1.mp3', instrument: 'clarinet' },
  { src: '/exhibitions/harlem/audio/clarinet-2.mp3', instrument: 'clarinet' },
  { src: '/exhibitions/harlem/audio/drum-1.mp3', instrument: 'drums' },
  { src: '/exhibitions/harlem/audio/drum-2.mp3', instrument: 'drums' },
  { src: '/exhibitions/harlem/audio/doublebass-1.mp3', instrument: 'bass' },
  { src: '/exhibitions/harlem/audio/doublebass-2.mp3', instrument: 'bass' },
];

export const TOTAL_QUIZ_ROUNDS = 13;

export type ScoreRating = {
  min: number;
  label: string;
  message: string;
};

export const SCORE_RATINGS: ScoreRating[] = [
  { min: 13, label: 'Jazz Master', message: 'Perfect score! Duke Ellington would be proud.' },
  { min: 10, label: 'Jazz Aficionado', message: "You've got a serious ear for jazz!" },
  { min: 7, label: 'Bandstand Regular', message: 'Not bad! Keep listening.' },
  { min: 4, label: 'Jazz Newcomer', message: 'Keep exploring the sounds of jazz.' },
  { min: 0, label: 'First Night at the Club', message: 'The Harlem jazz scene awaits your return!' },
];
