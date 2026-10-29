'use client';

import type { CSSProperties } from 'react';
import { effectClass, emphasisRuns, sentences } from './helpers';
import type { PanelEffect } from './types';

/*
 * Copy that arrives its own way: the pieces of a panel entrance that are drawn
 * on the words themselves. PosterPanel uses them for the data-driven
 * exhibitions, and the three hand-built walkthroughs (Harlem, In Their Hands,
 * Seeing is Deceiving) use them through EntranceCopy, so every walkthrough
 * types, sets line by line and fades the same way. The classes they carry
 * (pe-effect-*, pe-line, pe-typed-*) are drawn in poster-exhibition.css.
 */

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/** Short copy with "*…*" set in italics: a credit, a caption, a citation. */
export function Emph({ text }: { text: string }) {
  return (
    <>
      {emphasisRuns(text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
    </>
  );
}

/** Copy typed out a character at a time. The line is read whole (the typing is hidden from assistive technology). */
export function Typed({ text }: { text: string }) {
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
export function Lines({ text }: { text: string }) {
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

/** The line typed out, kept whole for assistive technology beside the hidden typing. */
export function TypedForReaders({ effect, text }: { effect: PanelEffect; text: string }) {
  if (effect !== 'typewriter') return null;
  return (
    <span className="visually-hidden">
      <Emph text={text} />
    </span>
  );
}

/**
 * A run of copy arriving its own way, for a hand-built walkthrough: set
 * inside the page's own paragraph, title or quote, so the page's styling and
 * any motion it gives that element (Harlem's train rocking, its jazz swing)
 * carry on around it. The entrance is drawn on this inner block.
 */
export function EntranceCopy({ text, effect, className = '' }: { text: string; effect: PanelEffect; className?: string }) {
  const body = effect === 'typewriter' ? <Typed text={text} /> : effect === 'line-by-line' ? <Lines text={text} /> : <Emph text={text} />;
  return (
    <>
      <span className={`pe-entrance ${effectClass(effect)} ${className}`}>{body}</span>
      <TypedForReaders effect={effect} text={text} />
    </>
  );
}

/** The disc of the ground that hides the middle of the panel and fades, as the blind spot fills in. */
export function BlindSpot({ effect }: { effect: PanelEffect }) {
  return effect === 'blind-spot-reveal' ? <span className="pe-blind-spot" aria-hidden="true" /> : null;
}
