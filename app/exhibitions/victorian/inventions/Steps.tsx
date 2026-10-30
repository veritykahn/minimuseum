'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import FactNote, { type ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The parts every bench's card shares. The numbered steps at its head
 * ("Step 2 of 5", a dot for each, done or not; each dot a button, so a
 * teacher can jump straight to one on the projector). At its foot, Back,
 * "Did you know?" and Next, in one row, so a step fits on one screen: the
 * step's notes, each with its source, open over the card from "Did you
 * know?" instead of lengthening it.
 */

export function StepDots({ steps, at, done, onGo, label }: { steps: { id: string; title: string }[]; at: number; done: (i: number) => boolean; onGo: (i: number) => void; label: string }) {
  return (
    <nav className="vbi-steps-nav" aria-label={label}>
      <p className="vbi-step-count">
        Step {at + 1} of {steps.length}
      </p>
      <ol className="vbi-step-dots">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button type="button" className="vbi-step-dot" aria-current={i === at ? 'step' : undefined} data-done={done(i) || undefined} aria-label={`Step ${i + 1}: ${s.title}${done(i) ? ' (done)' : ''}`} onClick={() => onGo(i)}>
              {done(i) ? '✓' : i + 1}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The card's foot: Back and Next (when there are steps), and between them
 * "Did you know?", which opens the notes over the card. `reset` closes it
 * again (a new step, a new part).
 */
export function CardFoot({ at, count, onGo, nextLabel, facts, poster, reset, children }: { at?: number; count?: number; onGo?: (i: number) => void; nextLabel?: string; facts: ApprovedFact[]; poster?: string; reset?: unknown; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  // A new step or part closes the notes (set while rendering, as React suggests, not in an effect).
  const [seen, setSeen] = useState(reset);
  if (seen !== reset) {
    setSeen(reset);
    setOpen(false);
  }
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  const stepped = at !== undefined && count !== undefined && onGo;
  return (
    <div className="vbi-foot">
      <div
        id={id}
        className="vbi-dyk-panel"
        role="region"
        aria-label="Did you know?"
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
      >
        <div className="vbi-dyk-head">
          <p className="vbi-dyk-title">Did you know?</p>
          <button type="button" className="vbr-button vbr-button-quiet vbi-dyk-close" onClick={close}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        {facts.map((f) => (
          <FactNote key={f.text} fact={f} className="vbr-fact" />
        ))}
        {children}
        {poster && <p className="vbr-poster">{poster}</p>}
      </div>
      <div className="vbi-foot-row">
        {stepped && (
          <button type="button" className="vbr-button vbi-back" onClick={() => onGo(at - 1)} disabled={at === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
        )}
        <button ref={button} type="button" className="vbr-button vbi-dyk-button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span className="vbi-dyk-mark" aria-hidden="true">?</span> Did you know?
        </button>
        {stepped && at < count - 1 && (
          <button type="button" className="vbr-button vbr-button-primary vbi-next" onClick={() => onGo(at + 1)}>
            {nextLabel ?? 'Next'} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
