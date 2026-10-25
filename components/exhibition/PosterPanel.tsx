'use client';

import type { CSSProperties, ReactNode } from 'react';
import { FxText, type FxKind } from '@/components/poster-fx/PosterFx';
import { PosterProjectorEnd } from '@/components/projector/PosterProjector';
import PosterLessons from '@/components/lesson/PosterLessons';
import { effectClass, emphasisRuns, panelClasses, positionClass } from './helpers';
import type { ExhibitionConfig, PanelDecor, PanelMarks, PosterConfig, PosterItem, PosterItemType } from './types';

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

/** Short copy with "*…*" set in italics: a credit, a caption, a citation. */
function Emph({ text }: { text: string }) {
  return (
    <>
      {emphasisRuns(text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
    </>
  );
}

/** Copy that takes part in the reveal when the exhibition reveals all text. "*…*" is set in italics. */
function RevealText({ text, kind, on }: { text: string; kind: FxKind; on: boolean }) {
  const emphasis = text.includes('*');
  if (!on) return emphasis ? <Emph text={text} /> : <>{text}</>;
  return <FxText text={text} words={kind === 'statement' || kind === 'quote'} emphasis={emphasis} />;
}

const PANEL_RENDERERS: Renderers = {
  paragraph: ({ config, poster, item, colors, kind }) => {
    const all = config.fx.text === 'all';
    const figure = item.figure;
    const lead = item.lead && (
      <>
        <strong className="pe-lead pfx-line">{item.lead}</strong>{' '}
      </>
    );
    return (
      <div
        className={`pe-text-content-wrapper ${positionClass(item.position)} ${figure ? `pe-has-figure pe-figure-${figure.side ?? 'left'}` : ''} ${panelClasses(poster, item)}`}
      >
        {figure && (
          <figure className="pe-figure pfx-media">
            {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
            <img src={figure.src} alt={figure.alt} />
            {figure.credit && (
              <figcaption className="pe-figure-credit">
                {figure.credit.href ? (
                  <a href={figure.credit.href} target="_blank" rel="noopener noreferrer"><Emph text={figure.credit.text} /></a>
                ) : (
                  <Emph text={figure.credit.text} />
                )}
              </figcaption>
            )}
          </figure>
        )}
        {item.source ? (
          <div className="pe-copy">
            <p
              className={`pe-paragraph-text ${all ? '' : effectClass(item.effect)}`}
              style={{ color: colors.text }}
              data-fx={all ? kind : undefined}
            >
              {lead}
              <RevealText text={item.text} kind={kind} on={all} />
            </p>
            <p className="pe-source" style={{ color: colors.text }}>
              <a href={item.source.href} target="_blank" rel="noopener noreferrer">{item.source.text}</a>
            </p>
          </div>
        ) : (
          <p
            className={`pe-paragraph-text ${all ? '' : effectClass(item.effect)}`}
            style={{ color: colors.text }}
            data-fx={all ? kind : undefined}
          >
            {lead}
            <RevealText text={item.text} kind={kind} on={all} />
          </p>
        )}
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
        {item.lines || item.lettering ? (
          <>
            <span className="visually-hidden">{[item.kicker, item.text].filter(Boolean).join(' ')}</span>
            {item.lines && (
              <span className="pe-title-lines" aria-hidden="true">
                {item.lines.map((line, i) => (
                  <span key={i} className={`pe-title-line pe-title-line-${i + 1} pfx-line`}>{line}</span>
                ))}
              </span>
            )}
            {item.lettering && (
              // eslint-disable-next-line @next/next/no-img-element -- lettering cut from the poster; the title above is what is read
              <img className="pe-title-lettering pfx-line" src={item.lettering.src} width={item.lettering.width} height={item.lettering.height} alt="" aria-hidden="true" />
            )}
          </>
        ) : (
          <>
            {item.kicker && <span className="pe-title-kicker pfx-line">{item.kicker}</span>}
            <FxText text={item.text} />
          </>
        )}
      </h2>
      {item.subtitle && <p className="pe-title-subtitle pfx-fg">{item.subtitle}</p>}
      {item.note && <p className="pe-title-note pfx-fg">{item.note}</p>}
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
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer"><Emph text={item.text} /></a>
          ) : (
            <Emph text={item.text} />
          )}
        </span>
      )}
    </div>
  ),

  quote: ({ config, poster, item, colors }) => {
    const all = config.fx.text === 'all';
    return (
      <div className={`pe-text-content-wrapper pe-pos-center ${item.cite ? 'pe-has-cite' : ''} ${panelClasses(poster, item)}`}>
        <blockquote
          className={`pe-quote-text ${all ? '' : effectClass(item.effect)}`}
          style={{ color: colors.title, borderColor: poster.colors.quoteRule ?? colors.title }}
          data-fx={all ? 'quote' : undefined}
        >
          <RevealText text={item.text} kind="quote" on={all} />
        </blockquote>
        {item.cite && (
          <p className="pe-quote-cite pfx-fg" style={{ color: colors.text }}>
            <Emph text={item.cite} />
          </p>
        )}
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

/** A poster's running head or foot: a short line at each side of the panel. */
function Marks({ marks }: { marks: PanelMarks }) {
  return (
    <p className={`pe-marks pe-marks-${marks.placement ?? 'foot'} pfx-fg`}>
      {marks.left && <span className="pe-marks-left">{marks.left}</span>}
      {marks.right && <span className="pe-marks-right">{marks.right}</span>}
    </p>
  );
}

export default function PosterPanel(props: PanelProps) {
  const render = PANEL_RENDERERS[props.item.type] as (p: PanelProps) => ReactNode;
  return (
    <>
      {props.item.decor && <Decor decor={props.item.decor} />}
      {render(props)}
      {props.item.marks && <Marks marks={props.item.marks} />}
    </>
  );
}
