/*
 * "When the Guns Fell Silent": every word on screen, and the timing.
 *
 * The title cards are the owner's own words from the film she made for the
 * installation iPad, one per card, exactly as she set them. A change to a
 * card (the owner may revise "20 million") is
 * a one-line edit here.
 *
 * The film itself is not used: the Imperial War Museum owns its film strip
 * and its sound. The countdown, the drawn record and the sound are ours. The
 * two IWM photographs are used under the IWM Non-Commercial Licence, with the
 * attribution each record specifies.
 */

export const TITLE_CARDS = [
  'After 1,568 days of war.',
  'After 20 million dead.',
  'After boys lied about their age to fight.',
  'After trenches stretched 475 miles across Europe.',
  'After one final soldier fell at 10:59 AM.',
  'The guns finally went silent.',
] as const;

/** The film shows the trench photograph after this card (0-based). */
export const PHOTO_AFTER_CARD = 2;

export const COUNTDOWN = [5, 4, 3, 2, 1] as const;

export const SOUND_NOTE = 'Our sound reconstruction, based on the sound-ranging record. Not a recording.';

/** The words printed on the 1918 record, as they appear on it. */
export const RECORD = {
  heading: '“The End of the War.”',
  subheading: 'A Graphic Record.',
  before: ['One minute before', 'the hour.', 'All guns firing.'],
  date: ['Nov. 11, 1918.', '11 A.M.'],
  after: ['One minute after', 'the hour.', 'All guns silent.'],
  /** The time marks under the film, hour.minutes-seconds, as printed. */
  ticks: ['10.58-56', '10.58-57', '10.58-58', '10.58-59', '11.01-00', '11.01-01', '11.01-02', '11.01-03'],
  tickCaption: 'Hour – minutes – seconds',
  redrawnCredit: 'Redrawn from the 1918 sound-ranging record held by the Imperial War Museum',
};

export const IWM = {
  record: {
    url: 'https://www.iwm.org.uk/collections/item/object/205281906',
    /** IWM's own object description, verbatim. */
    description:
      'Photograph of the record by sound ranging of artillery activity on the American front near the River Moselle for one minute before and one minute after the Armistice at 11am on 11th November 1918.',
    /** The attribution the record specifies. */
    credit: '© IWM (Q 47886)',
    src: '/exhibitions/great-war/iwm-q47886-sound-ranging.jpg',
    width: 800,
    height: 257,
    alt: 'The 1918 sound-ranging record, “The End of the War. A Graphic Record.”: a strip of film with six white trace lines, jagged on the left under “One minute before the hour. All guns firing.”, then a blank gap, then flat on the right under “One minute after the hour. All guns silent.”, with time marks from 10.58-56 to 11.01-03 beneath',
  },
  trench: {
    url: 'https://www.iwm.org.uk/collections/item/object/205193964',
    description:
      'Troops of the Royal Irish Rifles resting in a communication trench during the opening hours of the Battle of the Somme, 1 July 1916.',
    credit: 'Image: IWM (Q 1)',
    src: '/exhibitions/great-war/iwm-q1-trench.jpg',
    width: 800,
    height: 594,
    alt: 'Black and white photograph of British soldiers in steel helmets resting in a muddy trench, some sitting against the earth wall, others standing behind them; several look at the camera',
  },
  reconstruction: {
    url: 'https://www.iwm.org.uk/history/first-world-war/western-front/sound-ranging-explained',
    label: 'Hear IWM’s reconstruction',
  },
  licence: {
    url: 'https://www.iwm.org.uk/corporate/policies/non-commercial-licence',
    label: 'IWM Non-Commercial Licence',
  },
};

/*
 * The timeline, in milliseconds from "Begin". The sound engine and the
 * picture both read it, so the guns stop exactly as the strip crosses 11:00.
 */
export const TIMING = {
  countdownStep: 1000,
  card: 3800,
  photo: 5200,
  /** The strip runs this long before the hour… */
  stripBeforeHour: 14000,
  /** …and holds the silence this long after it, before the closing words. */
  stripAfterHour: 9000,
};

export type Scene =
  | { kind: 'countdown'; n: number }
  | { kind: 'card'; index: number }
  | { kind: 'photo' }
  | { kind: 'strip' }
  | { kind: 'end' };

type Segment = { scene: Scene; start: number; end: number };

function buildSegments(): Segment[] {
  const out: Segment[] = [];
  let t = 0;
  const push = (scene: Scene, len: number) => {
    out.push({ scene, start: t, end: t + len });
    t += len;
  };
  for (const n of COUNTDOWN) push({ kind: 'countdown', n }, TIMING.countdownStep);
  TITLE_CARDS.forEach((_, index) => {
    push({ kind: 'card', index }, TIMING.card);
    if (index === PHOTO_AFTER_CARD) push({ kind: 'photo' }, TIMING.photo);
  });
  push({ kind: 'strip' }, TIMING.stripBeforeHour + TIMING.stripAfterHour);
  return out;
}

export const SEGMENTS = buildSegments();

/** When the strip starts, when it crosses 11:00, and when the film ends. */
export const STRIP_START = SEGMENTS[SEGMENTS.length - 1].start;
export const HOUR_AT = STRIP_START + TIMING.stripBeforeHour;
export const FILM_END = SEGMENTS[SEGMENTS.length - 1].end;

/** The scene showing at `t` ms after Begin. */
export function sceneAt(t: number): Scene {
  if (t >= FILM_END) return { kind: 'end' };
  const seg = SEGMENTS.find((s) => t >= s.start && t < s.end);
  return seg ? seg.scene : SEGMENTS[0].scene;
}

/** The first moment of a scene, for "skip" controls and tests. */
export function startOf(kind: Scene['kind'], index = 0): number {
  if (kind === 'end') return FILM_END;
  const seg = SEGMENTS.find((s) => s.scene.kind === kind && (s.scene.kind !== 'card' || s.scene.index === index));
  return seg ? seg.start : 0;
}
