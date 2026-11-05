import type { FactSource } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { WALK_LINES, type WalkLine } from './walkLines';
import { hash2 } from './walkScene';
import { FILM_PICTURE_CREDITS } from './filmPictures';

/*
 * The film that opens the walk: what it says, in order, and for how long.
 * It opens with a few words, alone on the dark, on what the Holocaust was:
 * plainly, for children, honest about what happened and with nothing
 * graphic. Then the history, the walk's lines (walkLines.ts), each over its
 * picture, in order, in their exact words, climbing step by step to the
 * toll. About five and a half seconds a line, six for each of the opening
 * words, longer for the names of the killing centers and for the toll.
 * The music plays to the end and fades over the last line; then, before the
 * walk, a few words on what the walk is, in silence (WalkThreshold).
 * Under reduced motion the visitor moves it on, a line at a time.
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
/** The music fades out over the last line, so the film ends on it; if the film is skipped, more quickly. */
export const FILM_FADE_MS = FILM_LINE_MS;
export const FILM_SKIP_FADE_MS = 1200;

const HMD_GENOCIDE: FactSource = { label: 'Holocaust Memorial Day Trust, “What is genocide?”', href: 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/what-is-genocide/' };
const INTRO: FactSource = { label: 'USHMM, “Introduction to the Holocaust”', href: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust' };

export type FilmOpening = { id: string; text: string; sources: readonly FactSource[] };

/** The opening words, alone on the dark, before the history. */
export const FILM_OPENING: readonly FilmOpening[] = [
  // REVIEW (Verity): from https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("the systematic, state-sponsored persecution and murder of six million European Jews by the Nazi German regime and its allies and collaborators"; "between 1933 and 1945").
  { id: 'F1', text: 'From 1933 to 1945, Nazi Germany and those who helped them persecuted the Jewish people of Europe.', sources: [INTRO] },
  // REVIEW (Verity): from the same page ("The Holocaust was an evolving process"). The toll is no longer told here, at the start: the film builds to it, at the end.
  { id: 'F2', text: 'It did not happen all at once. It happened step by step.', sources: [INTRO] },
  // REVIEW (Verity): new, the Holocaust Memorial Day Trust's words, as quoted on poster 1 (https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/what-is-genocide/).
  { id: 'F3', text: '“Genocide never just happens.” (Holocaust Memorial Day Trust)', sources: [HMD_GENOCIDE] },
]

export type FilmFrame = { kind: 'words'; opening: FilmOpening } | { kind: 'line'; line: WalkLine };

/** The whole film, in order: the opening words, then every line with its picture. */
export const FILM_FRAMES: readonly FilmFrame[] = [
  ...FILM_OPENING.map((opening): FilmFrame => ({ kind: 'words', opening })),
  ...WALK_LINES.map((line): FilmFrame => ({ kind: 'line', line })),
];

/** How long a frame is shown: a line's own hold, if it has one (the names of the killing centers, the toll), else FILM_LINE_MS. */
export const frameMs = (f: FilmFrame) => (f.kind === 'words' ? FILM_OPENING_MS : f.line.hold ?? FILM_LINE_MS);

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

/** The film's sources, line by line, for the Sources drawer: the opening words, then each line of the history, with its picture's credit where the picture is not the owner's own. */
export function filmSourceGroups(): SourceGroup[] {
  const short = (t: string) => (t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t.replace(/\.$/, ''));
  return [
    { title: 'The film: its opening words', items: FILM_OPENING.flatMap((o) => o.sources.map((s) => ({ ...s, note: short(o.text) }))) },
    ...WALK_LINES.map((l, i) => {
      const picture = FILM_PICTURE_CREDITS[l.slot];
      const items = l.sources.map((s) => ({ ...s, note: short(l.text) }));
      return { title: `The film, line ${i + 1}`, items: picture ? [...items, { note: 'Picture', label: picture.label, href: picture.href }] : items };
    }),
  ];
}
