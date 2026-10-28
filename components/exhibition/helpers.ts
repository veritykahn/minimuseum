import { fxKindFor, type FxKind } from '@/components/poster-fx/PosterFx';
import type { ProjectorPoster } from '@/components/projector/PosterProjector';
import type { Atmosphere, ExhibitionConfig, PanelEffect, PanelPosition, PosterConfig, PosterItem } from './types';

/** Panels per poster, keyed by id: what usePosterWalkthrough and the deep link need. */
export function posterLengths<K extends string>(posters: PosterConfig<K>[]): Record<K, number> {
  return Object.fromEntries(posters.map((p) => [p.id, p.items.length])) as Record<K, number>;
}

/** The posters as the projector frame lists them. */
export function projectorPosters<K extends string>(posters: PosterConfig<K>[]): ProjectorPoster<K>[] {
  return posters.map((p) => ({
    id: p.id,
    title: p.title,
    thumb: p.hero.src,
    items: p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })),
    talk: p.talk,
  }));
}

/** The name of the atmosphere a panel stands in: its own, else its section's. */
export function atmosphereName(poster: PosterConfig, item: PosterItem | undefined): string | undefined {
  if (!item) return undefined;
  return item.atmosphere ?? (item.section ? poster.sections?.[item.section]?.atmosphere : undefined);
}

/**
 * A panel's colors: its own; then its own atmosphere's; then its section's;
 * then its section's atmosphere's; then its poster's.
 */
export function colorsFor(poster: PosterConfig, item: PosterItem | undefined, atmospheres?: Record<string, Atmosphere>) {
  const section = item?.section ? poster.sections?.[item.section] : undefined;
  const own = item?.atmosphere ? atmospheres?.[item.atmosphere] : undefined;
  const inherited = section?.atmosphere ? atmospheres?.[section.atmosphere] : undefined;
  const pick = (k: 'bg' | 'text' | 'title') => item?.colors?.[k] ?? own?.[k] ?? section?.[k] ?? inherited?.[k] ?? poster.colors[k];
  return { bg: pick('bg'), text: pick('text'), title: pick('title') };
}

/**
 * How a panel arrives: its own entrance, or 'theme' (the exhibition's
 * reveal). The ending, with its lessons, always takes the theme's.
 */
export function entranceOf(item: PosterItem | undefined): PanelEffect {
  if (!item || item.type === 'end') return 'theme';
  return item.effect ?? 'theme';
}

/** Whether a panel arrives its own way, so the exhibition's reveal steps back for it. */
export function ownsEntrance(item: PosterItem | undefined) {
  return entranceOf(item) !== 'theme';
}

/** Classes a panel's wrapper takes from its section and itself. */
export function panelClasses(poster: PosterConfig, item: PosterItem) {
  const section = item.section ? poster.sections?.[item.section] : undefined;
  return [section?.className, item.className].filter(Boolean).join(' ');
}

export function positionClass(position?: PanelPosition) {
  return `pe-pos-${position ?? 'center'}`;
}

export function effectClass(effect?: PanelEffect) {
  return effect && effect !== 'none' && effect !== 'theme' ? `pe-effect-${effect}` : '';
}

/**
 * The sentences in a run of copy, for setting it line by line. Each keeps
 * its trailing space, so joined they are the copy exactly; copy that cannot
 * be split cleanly comes back whole.
 */
export function sentences(text: string): string[] {
  const out: string[] = [];
  const re = /[.!?]+["”’')\]]*\s+/g;
  let start = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const end = m.index + m[0].length;
    // Not after an initial or a short abbreviation ("U.S.", "St.", "W.E.B."): the next word must start with a capital.
    const next = text[end];
    const before = text.slice(start, m.index).split(/\s+/).pop() ?? '';
    if (next && /[A-Z“"‘']/.test(next) && !/^(?:[A-Z]|St|Dr|Mr|Mrs|Ms|U\.S|[A-Z]\.[A-Z.]*)$/.test(before)) {
      out.push(text.slice(start, end));
      start = end;
    }
  }
  out.push(text.slice(start));
  return out.join('') === text ? out.filter(Boolean) : [text];
}

/**
 * A deterministic scatter for an atmosphere's particles: positions 0–100 and
 * a random 0–1 per particle, the same on the server and in the browser.
 */
export function scatter(i: number) {
  const f = (n: number) => {
    const x = Math.sin((i + 1) * n) * 43758.5453;
    return x - Math.floor(x);
  };
  return { x: Math.round(f(12.9898) * 1000) / 10, y: Math.round(f(78.233) * 1000) / 10, r: Math.round(f(37.719) * 1000) / 1000 };
}

/** The reveal kind for a panel (title, statement, body, quote). */
export function fxKind(item: PosterItem | undefined): FxKind {
  if (!item) return 'body';
  return fxKindFor({ type: item.type, text: 'text' in item ? item.text : undefined, effect: item.effect });
}

/** Which reveal layer crosses this panel, if any. */
export function veilFor(
  mode: ExhibitionConfig['fx']['veil'],
  item: PosterItem | undefined,
  step: number,
): 'media' | 'title' | 'text' | 'art' | null {
  if (!item || mode === 'none') return null;
  const kind: 'media' | 'title' | 'text' =
    item.type === 'section-title' || item.type === 'title-text'
      ? 'title'
      : item.type === 'paragraph' || item.type === 'quote' || item.type === 'callout'
        ? 'text'
        : 'media';
  if (mode === 'every-panel') return kind;
  if (mode === 'first') return step === 0 ? 'media' : null;
  // 'chapters': as the poster opens, and at each chapter title
  if (step === 0) return 'media';
  return item.type === 'section-title' ? 'title' : null;
}

/** Splits "*word*" into runs, the starred ones to be set in italics. */
export function emphasisRuns(text: string): { text: string; em: boolean }[] {
  return text.split(/(\*[^*]+\*)/).filter(Boolean).map((part) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? { text: part.slice(1, -1), em: true } : { text: part, em: false },
  );
}
