import type { FactSource } from '@/components/exhibition/FactNote';
import { TIMELINE_ENTRIES, type TimelineEntry } from './timelineEntries';

/*
 * The timeline's stops: each date opens, in a window of its own
 * (TimelineStop.tsx), with a photograph and, at a few, one very quiet sound.
 *
 * The photographs are from Wikimedia Commons, under free licenses, each
 * credited in the Sources drawer under its date (sources.ts), never on the
 * picture. Nothing graphic: places, buildings, documents and memorials, so
 * a child can look at every one. A stop whose photograph is not chosen yet
 * shows a quiet "Picture to come".
 *
 * The sounds are the posters' own moments (public/exhibitions/holocaust/
 * poster-sound/moments/), played once, as a panel's are (PanelMoment.ts),
 * and only with the museum's sound on. Most stops are silent.
 */

export type StopPicture = {
  /** Under public/. */
  src: string;
  alt: string;
  /** A few words under the picture: what and where, as the Commons page gives it. */
  caption: string;
  credit: FactSource;
};

export type TimelineStop = TimelineEntry & { picture?: StopPicture; sound?: string };

const MOMENTS = '/exhibitions/holocaust/poster-sound/moments';

/** The stops that sound, and what. REVIEW (Verity): each is a moment already heard on the posters. */
export const STOP_SOUNDS: Record<string, string> = {
  // The uprising began on the eve of Passover: a candle lit.
  '1943-04-19': `${MOMENTS}/candle.mp3`,
  // The Normandy beaches: the sea.
  '1944-06-06': `${MOMENTS}/water.mp3`,
  // The war in Europe over: a church bell, far off.
  '1945-05-08': `${MOMENTS}/church-clock.mp3`,
};

/** Each stop's photograph, by the entry's id. */
export const STOP_PICTURES: Record<string, StopPicture> = {};

export const TIMELINE_STOPS: TimelineStop[] = TIMELINE_ENTRIES.map((e) => ({
  ...e,
  ...(STOP_PICTURES[e.id] ? { picture: STOP_PICTURES[e.id] } : {}),
  ...(STOP_SOUNDS[e.id] ? { sound: STOP_SOUNDS[e.id] } : {}),
}));

/** The words around a stop, said to screen readers and on the buttons. REVIEW (Verity). */
export const STOP_TEXT = {
  open: 'Open this date',
  close: 'Close',
  previous: 'Before',
  next: 'Next',
  /** The speaker at a stop with a sound; pressed, the museum's sound is on. */
  sound: 'Sound',
  pictureToCome: 'Picture to come',
  of: (n: number, count: number) => `${n} of ${count}`,
};
