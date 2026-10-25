'use client';

import { useCallback } from 'react';
import type React from 'react';
import './poster-fx.css';

/**
 * Reveal motion for the poster walkthroughs.
 *
 * Every panel arrives through an exhibition-specific reveal: Seeing is
 * Deceiving resolves out of an op-art blind and a chromatic split, the Harlem
 * Renaissance opens through Deco doors and Aaron Douglas's concentric irises,
 * In Their Hands unfolds like parchment with gilt light passing across, and
 * the Fear Lab is found by torchlight: each panel waits in the dark until a
 * beam picks it out and the lights come up. The Great War is quiet: a hush
 * lifts off each chapter, copy surfaces slowly out of the dark, and the
 * photographs develop like prints in a tray, pale sepia deepening to the
 * picture. Ancient Egypt opens through an arch: a doorway of light rises
 * out of the dark, traced by the posters' thin white arches, and widens until
 * the panel stands in it; copy settles like sand, and the gods' names are
 * written in, stroke by stroke. Our Incredible Moon is night: as each poster
 * opens a lavender moon rises out of the dark, waxing from a crescent to full
 * as it climbs, and the night lifts; on every other panel a soft terminator
 * sweeps across, the panel waxing into the light like a phase of the Moon.
 * Short lines come out a word at a time, like stars, and the starfield
 * behind drifts a little in the direction of travel. America 250 is a
 * broadsheet being printed: as each poster opens and at each chapter the
 * platen of a press comes down on the sheet and lifts, leaving the page
 * printed; copy inks into the paper, a little soft at first and then crisp,
 * pictures print up like engravings, and a quill draws the rule under each
 * section head.
 *
 * All of it is CSS: transforms, opacity, clip-path and one-shot filters,
 * started by the walkthrough remounting on each step. Nothing runs per frame
 * in JS. Under prefers-reduced-motion every reveal layer is removed and the
 * panel simply appears. Text stays real text: words are wrapped in spans,
 * never drawn.
 */

export type FxTheme = 'sid' | 'hr' | 'ith' | 'fl' | 'gw' | 'eg' | 'mo' | 'ap';
export type FxKind = 'title' | 'statement' | 'body' | 'quote' | 'glitch';

type CssVars = React.CSSProperties & Record<`--${string}`, string | number>;

type FxItem = { type: string; text?: string; effect?: string };

/** Words in a string, for deciding whether a line is short enough to rise word by word. */
function wordCount(text?: string) {
  return text ? text.trim().split(/\s+/).length : 0;
}

/** Which reveal a text panel gets. Short declarative lines rise word by word. */
export function fxKindFor(item: FxItem): FxKind {
  if (item.effect === 'glitch') return 'glitch';
  if (item.type === 'section-title') return 'title';
  if (item.type === 'quote') return 'quote';
  if (item.type === 'paragraph' && (item.effect === 'blur-to-sharp' || wordCount(item.text) <= 22)) return 'statement';
  return 'body';
}

/** Indices of the chapter openings in a poster: its title cards and section titles. */
export function chapterMarks(items: FxItem[]): number[] {
  return items.flatMap((item, i) => (i > 0 && item.type === 'section-title' ? [i] : []));
}

/**
 * Props for the element that remounts on every step. A callback ref marks it
 * entered two frames after mount, which lets CSS transitions carry the
 * foreground and background layers in at different rates (the parallax).
 */
export function usePosterFxStage(theme: FxTheme, direction: 1 | -1, panel: string, bg: string, ink: string) {
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || el.hasAttribute('data-entered')) return;
    requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-entered', '')));
  }, []);
  const style: CssVars = { '--pfx-bg': bg, '--pfx-ink': ink };
  return {
    ref,
    className: `pfx-stage pfx-${theme}`,
    'data-dir': direction > 0 ? 'fwd' : 'back',
    'data-panel': panel,
    style,
  };
}

/**
 * Text that takes part in the reveal. `words` splits it into spans that rise
 * in sequence; the spaces stay as text so it wraps, copies and reads normally.
 */
/** "&" in its own span, so a display face whose ampersand misleads (Righteous's reads as "€") can set it in another. */
function withAmp(text: string) {
  if (!text.includes('&')) return text;
  return text.split('&').flatMap((part, i) => (i === 0 ? [part] : [<span key={i} className="pfx-amp">&amp;</span>, part]));
}

/**
 * A word with "*…*" emphasis markers, as runs to set in italics. The markers
 * may open in one word and close in a later one ("*The American Crisis*"),
 * so the state carries from word to word.
 */
function emphasize(words: string[]): React.ReactNode[] {
  let em = false;
  return words.map((word, wi) => {
    const pieces = word.split('*');
    const out: React.ReactNode[] = [];
    pieces.forEach((piece, pi) => {
      if (pi > 0) em = !em;
      if (piece) out.push(em ? <em key={`${wi}-${pi}`}>{withAmp(piece)}</em> : <span key={`${wi}-${pi}`}>{withAmp(piece)}</span>);
    });
    return out;
  });
}

export function FxText({ text, words = false, delay = 0, span = 0.9, emphasis = false }: { text: string; words?: boolean; delay?: number; span?: number; emphasis?: boolean }) {
  const parts = text.trim().split(/\s+/);
  const runs = emphasis ? emphasize(parts) : parts.map(withAmp);
  if (!words) {
    if (!emphasis) return <span className="pfx-line">{withAmp(text)}</span>;
    return (
      <span className="pfx-line">
        {runs.map((r, i) => (
          <span key={i}>
            {r}
            {i < runs.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    );
  }
  const per = Math.min(0.055, span / Math.max(parts.length, 1));
  return (
    <span className="pfx-line pfx-words">
      {parts.map((w, i) => (
        <span key={i}>
          <span className="pfx-w" style={{ '--d': `${(delay + i * per).toFixed(3)}s` } as CssVars}>{runs[i]}</span>
          {i < parts.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

/** The decorative reveal layer drawn over a panel. Hidden from assistive technology. */
export function FxVeil({ theme, kind }: { theme: FxTheme; kind: 'media' | 'title' | 'text' | 'art' }) {
  if (theme === 'sid') {
    return <div className="pfx-veil" aria-hidden="true"><div className="pfx-sid-scan" /></div>;
  }
  if (theme === 'hr') {
    if (kind === 'title') {
      return (
        <div className="pfx-veil pfx-hr-doors" aria-hidden="true">
          <i className="pfx-door pfx-door-l" />
          <i className="pfx-door pfx-door-r" />
        </div>
      );
    }
    if (kind === 'text') {
      return (
        <div className="pfx-veil pfx-hr-chevron" aria-hidden="true">
          <i className="pfx-chev pfx-chev-gold" />
          <i className="pfx-chev" />
        </div>
      );
    }
    return (
      <div className={`pfx-veil pfx-hr-rings ${kind === 'art' ? 'is-art' : ''}`} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map(i => <i key={i} style={{ '--i': i } as CssVars} />)}
      </div>
    );
  }
  if (theme === 'fl') {
    return (
      <div className={`pfx-veil pfx-fl-torch is-${kind}`} aria-hidden="true">
        <i />
      </div>
    );
  }
  if (theme === 'gw') {
    return (
      <div className={`pfx-veil pfx-gw-hush is-${kind}`} aria-hidden="true">
        <i />
      </div>
    );
  }
  if (theme === 'mo') {
    // Titles and pictures: a moonrise. Copy: a phase, waxing across the panel.
    return kind === 'text' ? (
      <div className="pfx-veil pfx-mo-phase" aria-hidden="true" />
    ) : (
      <div className={`pfx-veil pfx-mo-rise is-${kind}`} aria-hidden="true">
        <i />
      </div>
    );
  }
  if (theme === 'ap') {
    // The press: a blank sheet, the platen coming down on it, and lifting.
    return (
      <div className={`pfx-veil pfx-ap-press is-${kind}`} aria-hidden="true">
        <i />
      </div>
    );
  }
  if (theme === 'eg') {
    return (
      <div className={`pfx-veil pfx-eg-arch is-${kind}`} aria-hidden="true">
        <i />
      </div>
    );
  }
  return (
    <div className={`pfx-veil pfx-ith-gilt is-${kind}`} aria-hidden="true">
      <i />
    </div>
  );
}

/**
 * Channel copies of an image for the chromatic split: drawn in the same box as
 * the original, tinted to one channel, and slid into register as they fade.
 */
export function FxChannelGhosts({ className, src, imgClassName }: { className: string; src?: string; imgClassName?: string }) {
  if (!src) return null;
  return (
    <>
      {(['r', 'c'] as const).map(ch => (
        <div key={ch} className={`${className} pfx-ghost pfx-ghost-${ch}`} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- a decorative copy of the image above */}
          <img src={src} alt="" className={imgClassName} />
        </div>
      ))}
    </>
  );
}

/** Colour-matrix filters for the channel ghosts. Rendered once per page. */
export function FxDefs() {
  return (
    <svg className="pfx-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="pfx-ch-r" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0.25  0 0 0 1 0" />
      </filter>
      <filter id="pfx-ch-c" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
      <filter id="pfx-ch-r-light" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
      </filter>
      <filter id="pfx-ch-c-light" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  );
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Where you are in the poster: the panel number, a rail that fills as you go
 * with a mark at every chapter, and a head that travels from the panel you
 * left to the one you are on. Decorative: the live region speaks the position.
 */
export function PosterProgress({
  theme,
  step,
  fromStep,
  count,
  marks,
  color,
}: {
  theme: FxTheme;
  step: number;
  fromStep: number;
  count: number;
  marks: number[];
  color: string;
}) {
  const span = Math.max(count - 1, 1);
  const style: CssVars = {
    color,
    '--p': (step / span).toFixed(4),
    '--p0': (fromStep / span).toFixed(4),
  };
  return (
    <span className={`pfx-progress pfx-progress-${theme}`} style={style} aria-hidden="true">
      <span className="pfx-progress-num">
        <span className="pfx-progress-cur" key={step}>{pad(step + 1)}</span>
        <span className="pfx-progress-of">{pad(count)}</span>
      </span>
      <span className="pfx-progress-track">
        <span className="pfx-progress-rail" />
        <span className="pfx-progress-fill" />
        {marks.map(m => (
          <span
            key={m}
            className={`pfx-progress-mark ${m <= step ? 'is-passed' : ''}`}
            style={{ left: `${(m / span) * 100}%` }}
          />
        ))}
        <span className="pfx-progress-headwrap">
          <span className="pfx-progress-head" />
        </span>
      </span>
    </span>
  );
}
