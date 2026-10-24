import { fxKindFor, type FxKind } from '@/components/poster-fx/PosterFx';
import type { ProjectorPoster } from '@/components/projector/PosterProjector';
import type { ExhibitionConfig, PanelEffect, PanelPosition, PosterConfig, PosterItem } from './types';

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

/** A panel's colors: its own, then its section's, then its poster's. */
export function colorsFor(poster: PosterConfig, item: PosterItem | undefined) {
  const section = item?.section ? poster.sections?.[item.section] : undefined;
  return {
    bg: item?.colors?.bg ?? section?.bg ?? poster.colors.bg,
    text: item?.colors?.text ?? section?.text ?? poster.colors.text,
    title: item?.colors?.title ?? section?.title ?? poster.colors.title,
  };
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
  return effect && effect !== 'none' ? `pe-effect-${effect}` : '';
}

/** The reveal kind for a panel (title, statement, body, quote). */
export function fxKind(item: PosterItem | undefined): FxKind {
  if (!item) return 'body';
  return fxKindFor({ type: item.type, text: 'text' in item ? item.text : undefined, effect: 'effect' in item ? item.effect : undefined });
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
