'use client';

import type { CSSProperties, ReactNode } from 'react';
import { FxText, type FxKind } from '@/components/poster-fx/PosterFx';
import { PosterProjectorEnd } from '@/components/projector/PosterProjector';
import PosterLessons from '@/components/lesson/PosterLessons';
import { effectClass, emphasisRuns, entranceOf, panelClasses, positionClass, sentences } from './helpers';
import type { ExhibitionConfig, PanelDecor, PanelEffect, PanelMarks, PosterConfig, PosterItem, PosterItemType } from './types';

/*
 * One panel of a poster walkthrough. Each panel type has a renderer in
 * PANEL_RENDERERS; to add a type, add its shape to PosterItem (types.ts) and
 * its renderer here.
 *
 * A panel with its own entrance (item.effect) arrives that way: the effect's
 * class goes on the copy or the picture, and the exhibition's reveal (the
 * theme's word-by-word rise, its developing photographs) steps back for it.
 * Copy is always real text: set a sentence at a time, or typed out with the
 * whole line kept for assistive technology.
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
type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/** Entrances drawn on the copy even where a panel also has a picture. */
const COPY_EFFECTS: PanelEffect[] = ['typewriter', 'line-by-line', 'ink-spread'];

/** Short copy with "*…*" set in italics: a credit, a caption, a citation. */
function Emph({ text }: { text: string }) {
  return (
    <>
      {emphasisRuns(text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
    </>
  );
}

/** Copy typed out a character at a time. The line is read whole (the typing is hidden from assistive technology). */
function Typed({ text }: { text: string }) {
  const runs = emphasisRuns(text);
  const total = runs.reduce((n, r) => n + r.text.length, 0);
  // About three seconds however long the copy, and never faster than a brisk typist.
  const step = Math.min(0.045, 3.2 / Math.max(total, 1));
  let c = 0;
  return (
    <span className="pe-typed" aria-hidden="true" style={{ '--tw-step': `${step.toFixed(4)}s`, '--tw-total': `${(step * total).toFixed(2)}s` } as CssVars}>
      {runs.map((r, ri) => {
        // Words stay whole at the end of a line: each is a nowrap run of letters.
        const words = r.text.split(/(\s+)/);
        const body = words.map((w, wi) => {
          if (/^\s+$/.test(w)) {
            c += w.length;
            return ' ';
          }
          return (
            <span key={wi} className="pe-typed-word">
              {Array.from(w).map((ch, ci) => (
                <span key={ci} className="pe-typed-ch" style={{ '--c': c++ } as CssVars}>
                  {ch}
                </span>
              ))}
            </span>
          );
        });
        return r.em ? <em key={ri}>{body}</em> : <span key={ri}>{body}</span>;
      })}
      <span className="pe-typed-caret" />
    </span>
  );
}

/** Copy set a sentence at a time. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {sentences(text).map((s, i) => (
        <span key={i} className="pe-line" style={{ '--n': i } as CssVars}>
          <Emph text={s} />
        </span>
      ))}
    </>
  );
}

/**
 * Panel copy. With its own entrance it is set plainly (or typed, or a line at
 * a time); otherwise it takes part in the exhibition's reveal when the
 * exhibition reveals all text.
 */
function Copy({ text, kind, effect, reveal }: { text: string; kind: FxKind; effect: PanelEffect; reveal: boolean }) {
  if (effect === 'typewriter') return <Typed text={text} />;
  if (effect === 'line-by-line') return <Lines text={text} />;
  const emphasis = text.includes('*');
  if (effect !== 'theme' || !reveal) return emphasis ? <Emph text={text} /> : <>{text}</>;
  return <FxText text={text} words={kind === 'statement' || kind === 'quote'} emphasis={emphasis} />;
}

/** The line typed out, kept whole for assistive technology beside the hidden typing. */
function TypedForReaders({ effect, text }: { effect: PanelEffect; text: string }) {
  if (effect !== 'typewriter') return null;
  return (
    <span className="visually-hidden">
      <Emph text={text} />
    </span>
  );
}

/** A picture's credit as its owner specifies it, linked to its record. */
function Credit({ credit, className }: { credit?: { text: string; href?: string }; className: string }) {
  if (!credit) return null;
  return (
    <span className={className}>
      {credit.href ? (
        <a href={credit.href} target="_blank" rel="noopener noreferrer"><Emph text={credit.text} /></a>
      ) : (
        <Emph text={credit.text} />
      )}
    </span>
  );
}

/** The disc of the ground that hides the middle of the panel and fades, as the blind spot fills in. */
function BlindSpot({ effect }: { effect: PanelEffect }) {
  return effect === 'blind-spot-reveal' ? <span className="pe-blind-spot" aria-hidden="true" /> : null;
}

/**
 * Where a panel's entrance goes when it has both copy and a picture: the
 * copy's own effects (typing, line by line) on the copy, everything else on
 * the picture; the other part follows quietly.
 */
function split(effect: PanelEffect) {
  const own = effect !== 'theme';
  const onCopy = COPY_EFFECTS.includes(effect);
  return {
    own,
    copy: own ? (onCopy ? effectClass(effect) : 'pe-follow') : '',
    picture: own ? (onCopy ? 'pe-follow' : effectClass(effect)) : 'pfx-media',
  };
}

const PANEL_RENDERERS: Renderers = {
  paragraph: ({ config, poster, item, colors, kind }) => {
    const effect = entranceOf(item);
    const own = effect !== 'theme';
    const all = config.fx.text === 'all';
    const figure = item.figure;
    const parts = split(effect);
    const lead = item.lead && (
      <>
        <strong className="pe-lead pfx-line">{item.lead}</strong>{' '}
      </>
    );
    const p = (
      <p
        className={`pe-paragraph-text ${own ? (figure ? parts.copy : effectClass(effect)) : ''}`}
        style={{ color: colors.text }}
        data-fx={all && !own ? kind : undefined}
      >
        {lead}
        <Copy text={item.text} kind={kind} effect={effect} reveal={all} />
      </p>
    );
    return (
      <div
        className={`pe-text-content-wrapper ${positionClass(item.position)} ${figure ? `pe-has-figure pe-figure-${figure.side ?? 'left'}` : ''} ${panelClasses(poster, item)}`}
      >
        <BlindSpot effect={effect} />
        {figure && (
          <figure className={`pe-figure ${own ? '' : 'pfx-media'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
            <img src={figure.src} alt={figure.alt} className={own ? parts.picture : ''} />
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
            {p}
            <TypedForReaders effect={effect} text={item.text} />
            <p className="pe-source" style={{ color: colors.text }}>
              <a href={item.source.href} target="_blank" rel="noopener noreferrer">{item.source.text}</a>
            </p>
          </div>
        ) : (
          <>
            {p}
            <TypedForReaders effect={effect} text={item.text} />
          </>
        )}
      </div>
    );
  },

  'section-title': ({ poster, item, colors }) => {
    const effect = entranceOf(item);
    const own = effect !== 'theme';
    return (
      <div className={`pe-text-content-wrapper ${positionClass(item.position ?? 'full-width')} ${panelClasses(poster, item)}`}>
        <BlindSpot effect={effect} />
        <h2 className={`pe-section-title-text ${effectClass(effect)}`} style={{ color: colors.title }} data-fx={own ? undefined : 'title'}>
          {own ? <Copy text={item.text} kind="title" effect={effect} reveal={false} /> : <FxText text={item.text} />}
        </h2>
        <TypedForReaders effect={effect} text={item.text} />
      </div>
    );
  },

  'title-image': ({ poster, item }) => {
    const effect = entranceOf(item);
    const own = effect !== 'theme';
    const framing = item.framing ?? item.fit ?? 'width';
    const size = item.width ? ({ '--pe-title-w': `${item.width}px` } as CssVars) : undefined;
    return (
      <div className={`pe-title-image pe-frame-${framing} ${panelClasses(poster, item)}`} style={size}>
        <h2 className="pe-title-image-heading">
          <span className="visually-hidden">{item.alt}</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- lettering cut from the poster, animated in CSS; the heading above is what is read */}
          <img
            src={item.src}
            alt=""
            aria-hidden="true"
            width={item.width}
            height={item.height}
            className={own ? effectClass(effect) : 'pfx-media'}
          />
        </h2>
      </div>
    );
  },

  'title-text': ({ poster, item, colors }) => (
    <div className={`pe-text-content-wrapper pe-pos-center pe-title-card ${panelClasses(poster, item)}`}>
      <h2 className={`pe-title-text ${effectClass(item.effect)}`} style={{ color: colors.title }} data-fx="title">
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

  'full-image': ({ poster, item, colors }) => {
    const effect = entranceOf(item);
    const own = effect !== 'theme';
    return (
      <div className={`pe-full-bleed-image pe-full-image ${own ? '' : 'pfx-media'} ${panelClasses(poster, item)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
        <img src={item.src} alt={item.alt} className={effectClass(effect)} />
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
    );
  },

  'artwork-display': ({ config, poster, item, colors, kind }) => {
    const effect = entranceOf(item);
    const parts = split(effect);
    return (
      <div className={`pe-artwork-display pe-artwork-${item.side ?? 'left'} ${panelClasses(poster, item)}`}>
        <figure className={`pe-artwork-picture ${parts.own ? '' : 'pfx-media'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
          <img src={item.src} alt={item.alt} className={parts.picture === 'pfx-media' ? '' : parts.picture} />
          <Credit credit={item.credit} className="pe-figure-credit pe-artwork-credit" />
        </figure>
        <div className={`pe-artwork-info ${parts.own ? '' : 'pfx-fg'}`} style={{ color: colors.text }}>
          {item.title && (
            <h2 className="pe-artwork-title" style={{ color: colors.title }}>
              <Emph text={item.title} />
            </h2>
          )}
          {item.meta && <p className="pe-artwork-meta">{item.meta}</p>}
          <p className={`pe-paragraph-text pe-artwork-text ${parts.copy}`} style={{ color: colors.text }} data-fx={parts.own || config.fx.text !== 'all' ? undefined : kind}>
            <Copy text={item.text} kind={kind} effect={effect} reveal={config.fx.text === 'all'} />
          </p>
          <TypedForReaders effect={effect} text={item.text} />
        </div>
      </div>
    );
  },

  'text-image-stacked': (props) => <Stacked {...props} />,
  'image-text-stacked': (props) => <Stacked {...props} />,

  quote: ({ config, poster, item, colors }) => {
    const effect = entranceOf(item);
    const own = effect !== 'theme';
    const all = config.fx.text === 'all';
    return (
      <div className={`pe-text-content-wrapper pe-pos-center ${item.cite ? 'pe-has-cite' : ''} ${panelClasses(poster, item)}`}>
        <BlindSpot effect={effect} />
        <blockquote
          className={`pe-quote-text ${own ? effectClass(effect) : all ? '' : effectClass(item.effect)}`}
          style={{ color: colors.title, borderColor: poster.colors.quoteRule ?? colors.title }}
          data-fx={all && !own ? 'quote' : undefined}
        >
          <Copy text={item.text} kind="quote" effect={effect} reveal={all} />
        </blockquote>
        <TypedForReaders effect={effect} text={item.text} />
        {item.cite && (
          <p className={`pe-quote-cite ${own ? 'pe-follow' : 'pfx-fg'}`} style={{ color: colors.text }}>
            <Emph text={item.cite} />
          </p>
        )}
      </div>
    );
  },

  link: ({ poster, item, colors }) => (
    <div className={`pe-text-content-wrapper pe-pos-center ${panelClasses(poster, item)}`}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`pe-content-link ${item.effect && item.effect !== 'theme' ? effectClass(item.effect) : 'pfx-fg'}`}
        style={{ color: colors.text, borderColor: colors.text }}
      >
        {item.text}
      </a>
    </div>
  ),

  callout: ({ poster, item }) => {
    const effect = entranceOf(item);
    const cls = `pe-callout ${effect !== 'theme' ? effectClass(effect) : 'pfx-fg'}`;
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
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>
            {body}
          </a>
        ) : (
          <p className={cls}>{body}</p>
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

/** A picture and copy, one above the other. */
function Stacked({ config, poster, item, colors, kind }: PanelProps<Extract<PosterItem, { type: 'text-image-stacked' | 'image-text-stacked' }>>) {
  const effect = entranceOf(item);
  const parts = split(effect);
  const all = config.fx.text === 'all';
  const picture = (
    <figure className={`pe-stack-picture ${parts.own ? '' : 'pfx-media'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the reveals animate the element itself */}
      <img src={item.src} alt={item.alt} className={parts.picture === 'pfx-media' ? '' : parts.picture} />
      <Credit credit={item.credit} className="pe-figure-credit pe-stack-credit" />
    </figure>
  );
  const copy = (
    <>
      <p className={`pe-paragraph-text ${parts.copy}`} style={{ color: colors.text }} data-fx={all && !parts.own ? kind : undefined}>
        <Copy text={item.text} kind={kind} effect={effect} reveal={all} />
      </p>
      <TypedForReaders effect={effect} text={item.text} />
    </>
  );
  return (
    <div className={`pe-text-content-wrapper pe-stack pe-${item.type} ${panelClasses(poster, item)}`}>
      {item.type === 'image-text-stacked' ? (
        <>
          {picture}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {picture}
        </>
      )}
    </div>
  );
}

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
