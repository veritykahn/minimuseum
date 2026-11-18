'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { StopQuestion } from './questions';

/*
 * One stop's question, as a short pop-up over the sheet: a choice question
 * says whether the tap was right and why; a think-and-tap one shows what the
 * stop says once tapped. Escape or the close button closes it, focus stays
 * inside it while open, and returns to the button that opened it.
 */

type Props = {
  question: StopQuestion;
  /** The stop's name, for the pop-up's heading. */
  label: string;
  onClose: () => void;
  /** Called once the question has an answer (or, for think-and-tap, is revealed). */
  onAnswered: () => void;
};

export default function StopQuestionDialog({ question, label, onClose, onAnswered }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const answered = question.kind === 'choice' ? picked !== null : shown;
  // Once answered, focus the answer (the options are spent); on Try again, the first option.
  const wasAnswered = useRef(false);
  useEffect(() => {
    if (answered) resultRef.current?.focus();
    else if (wasAnswered.current) firstRef.current?.focus();
    wasAnswered.current = answered;
  }, [answered]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !boxRef.current) return;
    const items = Array.from(boxRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const pick = (i: number) => {
    setPicked(i);
    onAnswered();
  };

  const right = question.kind === 'choice' && picked === question.answer;

  return (
    <div className="whv-q-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={boxRef}
        className="whv-q"
        role="dialog"
        aria-modal="true"
        aria-labelledby="whv-q-ask"
        aria-describedby="whv-q-label"
        onKeyDown={onKey}
      >
        <button type="button" className="whv-q-close" aria-label="Close the question" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <p className="whv-q-label" id="whv-q-label">
          {question.kind === 'choice' ? 'Quick question' : 'Think and tap'} · {label}
        </p>
        <h2 className="whv-q-ask" id="whv-q-ask">{question.ask}</h2>

        {question.kind === 'choice' ? (
          <div className="whv-q-options" role="group" aria-labelledby="whv-q-ask">
            {question.options.map((o, i) => {
              const state = picked === null ? '' : i === question.answer ? ' is-right' : i === picked ? ' is-wrong' : '';
              return (
                <button
                  key={o}
                  ref={i === 0 ? firstRef : undefined}
                  type="button"
                  className={`whv-q-option${state}`}
                  aria-pressed={picked === i}
                  disabled={picked !== null}
                  onClick={() => pick(i)}
                >
                  {o}
                </button>
              );
            })}
          </div>
        ) : (
          !shown && (
            <button
              ref={firstRef}
              type="button"
              className="whv-q-option whv-q-tap"
              onClick={() => {
                setShown(true);
                onAnswered();
              }}
            >
              Tap to see what happened
            </button>
          )
        )}

        {answered && (
          <p className={`whv-q-result${question.kind === 'choice' ? (right ? ' is-right' : ' is-wrong') : ''}`} ref={resultRef} tabIndex={-1} role="status">
            {question.kind === 'choice' ? (
              <>
                <strong>{right ? 'Yes!' : 'Not quite.'}</strong> {question.why}
              </>
            ) : (
              question.reveal
            )}
          </p>
        )}

        <div className="whv-q-foot">
          {question.kind === 'choice' && picked !== null && !right && (
            <button type="button" className="whv-step" onClick={() => setPicked(null)}>
              Try again
            </button>
          )}
          <button type="button" className="whv-step whv-step-next" onClick={onClose}>
            Back to her story
          </button>
        </div>
      </div>
    </div>
  );
}
