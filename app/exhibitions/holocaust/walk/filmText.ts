import type { FactSource } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { WALK_LINES, type WalkLine } from './walkLines';
import { hash2 } from './walkScene';

/*
 * The film that opens the walk: what it says, in order, and for how long.
 * It opens with a few words, alone on the dark, on what the Holocaust was:
 * plainly, for children, honest about what happened and with nothing
 * graphic. Then the history, the walk's 32 lines (walkLines.ts), each over
 * its picture, in order, in their exact words. About five and a half
 * seconds a line, six for each of the opening words; under reduced motion
 * the visitor moves it on, a line at a time.
 *
 * It is shown in black and white, as an old film is, and now and then, for
 * a moment, a picture's own color bleeds through (FILM_BLEEDS): only on a
 * few of the pictures, and only briefly.
 *
 * Every line's sources, and the opening words', are in the walk's Sources
 * drawer, by line, never on the screen.
 */

/** Each of the opening words is shown this long. */
export const FILM_OPENING_MS = 6000;
/** Each line of the history is shown this long: time to read it. */
export const FILM_LINE_MS = 5500;
/** The music fades out over the last line; if the film is skipped, more quickly. */
export const FILM_FADE_MS = FILM_LINE_MS;
export const FILM_SKIP_FADE_MS = 1200;

const INTRO: FactSource = { label: 'USHMM, “Introduction to the Holocaust”', href: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust' };

export type FilmOpening = { id: string; text: string; sources: readonly FactSource[] };

/** The opening words, alone on the dark, before the history. */
export const FILM_OPENING: readonly FilmOpening[] = [
  // REVIEW (Verity): new, from https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("the systematic, state-sponsored persecution and murder of six million European Jews by the Nazi German regime and its allies and collaborators"; "between 1933 and 1945").
  { id: 'F1', text: 'From 1933 to 1945, Nazi Germany and those who helped them persecuted the Jewish people of Europe.', sources: [INTRO] },
  // REVIEW (Verity): new, from the same page (six million Jews; the Nazis also targeted Roma, people with disabilities and others).
  { id: 'F2', text: 'They murdered six million Jewish men, women and children. They murdered Roma and Sinti people, disabled people and many others too.', sources: [INTRO] },
  // REVIEW (Verity): new, from the same page ("The Holocaust was an evolving process"): it did not happen all at once.
  { id: 'F3', text: 'This was the Holocaust. It did not happen all at once. It happened step by step.', sources: [INTRO] },
  // REVIEW (Verity): new: the turn into the history, and the pictures.
  { id: 'F4', text: 'This is what happened, in the order it happened, and the places and things the people left behind. We remember them.', sources: [] },
];

export type FilmFrame = { kind: 'words'; opening: FilmOpening } | { kind: 'line'; line: WalkLine };

/** The whole film, in order: the opening words, then every line with its picture. */
export const FILM_FRAMES: readonly FilmFrame[] = [
  ...FILM_OPENING.map((opening): FilmFrame => ({ kind: 'words', opening })),
  ...WALK_LINES.map((line): FilmFrame => ({ kind: 'line', line })),
];

/** How long a frame is shown. */
export const frameMs = (f: FilmFrame) => (f.kind === 'words' ? FILM_OPENING_MS : FILM_LINE_MS);

/** The film's length, played through. */
export const FILM_MS = FILM_FRAMES.reduce((t, f) => t + frameMs(f), 0);

/** A frame's words, as shown and read out. */
export const frameText = (f: FilmFrame) => (f.kind === 'words' ? f.opening.text : f.line.text);

/** A frame's key: its line's id, or its opening words'. */
export const frameId = (f: FilmFrame) => (f.kind === 'words' ? f.opening.id : f.line.id);

/** The pictures whose color bleeds through, briefly, as they are shown: about one in six, never two together. */
export const FILM_BLEEDS: ReadonlySet<string> = new Set(
  WALK_LINES.filter((l, i) => hash2(i, 1945) < 0.2 && !(i > 0 && hash2(i - 1, 1945) < 0.2)).map((l) => l.id),
);

// REVIEW (Verity): the film's quiet buttons.
export const FILM_SKIP = 'Skip to the walk';
export const FILM_NEXT = 'Next';
export const FILM_MUSIC = 'Music';

/** The film's sources, line by line, for the Sources drawer: the opening words, then each line of the history. */
export function filmSourceGroups(): SourceGroup[] {
  const short = (t: string) => (t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t.replace(/\.$/, ''));
  return [
    { title: 'The film: its opening words', items: FILM_OPENING.flatMap((o) => o.sources.map((s) => ({ ...s, note: short(o.text) }))) },
    ...WALK_LINES.map((l, i) => ({ title: `The film, line ${i + 1}`, items: l.sources.map((s) => ({ ...s, note: short(l.text) })) })),
  ];
}
