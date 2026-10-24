'use client';

import type { CSSProperties, ReactNode } from 'react';
import { FxText, type FxKind } from '@/components/poster-fx/PosterFx';
import { PosterProjectorEnd } from '@/components/projector/PosterProjector';
import PosterLessons from '@/components/lesson/PosterLessons';
import { effectClass, emphasisRuns, panelClasses, positionClass } from './helpers';
import type { ExhibitionConfig, PanelDecor, PosterConfig, PosterItem, PosterItemType } from './types';

/*
 * One panel of a poster walkthrough. Each panel type has a renderer in
 * PANEL_RENDERERS; to add a type, add its shape to PosterItem (types.ts) and
 * its renderer here.
 *
 * Class names keep the shared fragments the projector looks for
 * (…paragraph-text, …quote-text, …text-content-wrapper), so fitStage() sizes
 * the copy for a classroom without knowing about this engine.
 */

export type PanelProps<T extends PosterItem = PosterItem> = {
  config: ExhibitionConfig;
  poster: PosterConfig;
  item: T;
  /** Resolved colors for this panel. */
  colors: { bg: string; text: string; title: string };
  /** The reveal kind for this panel's copy. */
  kind: FxKind;
  projector: boolean;
  returnToMain: () => void;
};

type Renderers = { [T in PosterItemType]: (props: PanelProps<Extract<PosterItem, { type: T }>>) => ReactNode };

/** Copy that takes part in the reveal when the exhibition reveals all text. */
function RevealText({ text, kind, on }: { text: string; kind: FxKind; on: boolean }) {
  if (!on) return <>{text}</>;
  return <FxText text={text} words={kind === 'statement' || kind === 'quote'} />;
}

const PANEL_RENDERERS: Renderers = {
  paragraph: ({ config, poster, item, colors, kind }) => {
    const all = config.fx.text === 'all';
    return (
      <div className={`pe-text-content-wrapper ${positionClass(item.position)} ${panelClasses(poster, item)}`}>
        <p
          className={`pe-paragraph-text ${all ? '' : effectClass(item.effect)}`}
          style={{ color: colors.text }}
          data-fx={all ? kind : undefined}
        >
          <RevealText text={item.text} kind={kind} on={all} />
        </p>
      </div>
    );
  },

  'section-title': ({ poster, item, colors }) => (
    <div className={`pe-text-content-wrapper ${positionClass(item.position ?? 'full-width')} ${panelClasses(poster, item)}`}>
      <h2 className="pe-section-title-text" style={{ color: colors.title }} data-fx="title">
        <FxText text={item.text} />
      </h2>
    </div>
  ),

  'title-image': ({ poster, item }) => (
    <div className={`pe-full-bleed-image pe-title-${item.fit ?? 'width'} pfx-media ${effectClass(item.effect)} ${panelClasses(poster, item)}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
      <img src={item.src} alt={item.alt} />
    </div>
  ),

  'title-text': ({ poster, item, colors }) => (
    <div className={`pe-text-content-wrapper pe-pos-center pe-title-card ${panelClasses(poster, item)}`}>
      <h2 className="pe-title-text" style={{ color: colors.title }} data-fx="title">
        {item.kicker && <span className="pe-title-kicker pfx-line">{item.kicker}</span>}
        <FxText text={item.text} />
      </h2>
      {item.badge && (
        <p className="pe-badge pfx-fg">
          <span className="pe-badge-text">
            {emphasisRuns(item.badge).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
          </span>
        </p>
      )}
    </div>
  ),

  'full-image': ({ poster, item, colors }) => (
    <div className={`pe-full-bleed-image pe-full-image pfx-media ${effectClass(item.effect)} ${panelClasses(poster, item)}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
      <img src={item.src} alt={item.alt} />
      {item.text && (
        <span className="pe-image-caption" style={{ color: colors.text }}>
          {item.text}
        </span>
      )}
    </div>
  ),

  quote: ({ config, poster, item, colors }) => {
    const all = config.fx.text === 'all';
    return (
      <div className={`pe-text-content-wrapper pe-pos-center ${panelClasses(poster, item)}`}>
        <blockquote
          className={`pe-quote-text ${all ? '' : effectClass(item.effect)}`}
          style={{ color: colors.title, borderColor: poster.colors.quoteRule ?? colors.title }}
          data-fx={all ? 'quote' : undefined}
        >
          <RevealText text={item.text} kind="quote" on={all} />
        </blockquote>
      </div>
    );
  },

  link: ({ poster, item, colors }) => (
    <div className={`pe-text-content-wrapper pe-pos-center ${panelClasses(poster, item)}`}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="pe-content-link pfx-fg" style={{ color: colors.text, borderColor: colors.text }}>
        {item.text}
      </a>
    </div>
  ),

  callout: ({ poster, item }) => {
    const body = (
      <>
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element -- a small picture from the poster
          <img src={item.image.src} alt={item.image.alt} className={`pe-callout-img ${item.image.pixelated ? 'is-pixelated' : ''}`} />
        )}
        <span className="pe-callout-text">
          {item.text}
          {item.url && (
            <>
              {' '}
              <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </>
          )}
        </span>
      </>
    );
    return (
      <div className={`pe-text-content-wrapper pe-pos-center ${panelClasses(poster, item)}`}>
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="pe-callout pfx-fg">
            {body}
          </a>
        ) : (
          <p className="pe-callout pfx-fg">{body}</p>
        )}
      </div>
    );
  },

  end: ({ config, poster, item, colors, projector, returnToMain }) =>
    projector ? (
      <PosterProjectorEnd />
    ) : (
      <div className={`pe-text-content-wrapper pe-pos-center pe-end ${panelClasses(poster, item)}`}>
        <button type="button" className="pe-content-end pfx-fg" onClick={returnToMain} style={{ color: colors.text, borderColor: colors.text }}>
          {item.text}
        </button>
        <PosterLessons exhibition={config.slug} poster={poster.id} color={colors.text} />
      </div>
    ),
};

/** A decorative picture hung in a corner of the panel. */
function Decor({ decor }: { decor: PanelDecor }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative, animated in CSS
    <img
      src={decor.src}
      alt=""
      aria-hidden="true"
      className={`pe-decor pfx-bg pe-decor-${decor.placement} pe-decor-${decor.motion ?? 'none'}`}
      style={decor.width ? ({ '--pe-decor-w': decor.width } as CSSProperties) : undefined}
    />
  );
}

export default function PosterPanel(props: PanelProps) {
  const render = PANEL_RENDERERS[props.item.type] as (p: PanelProps) => ReactNode;
  return (
    <>
      {props.item.decor && <Decor decor={props.item.decor} />}
      {render(props)}
    </>
  );
}
