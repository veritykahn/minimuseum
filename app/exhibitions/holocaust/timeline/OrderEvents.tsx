'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { TIMELINE_TEXT, entryById, italicRuns, pickEntries, placesRight, plainWords, shuffled, swapped } from './timelineEntries';

/*
 * Put them in order: a quiet exercise for a class, after the timeline. Five
 * of the poster's entries, each from a different year, are set out as cards
 * in a mixed-up order, showing only the poster's words. Tap (or click, or
 * press) one card and then another to swap them; with a card picked up, the
 * arrow keys carry it up and down the list. "Check the order" marks each
 * card in its place or not yet, and shows its date. All in order, it says so
 * plainly, once. Nothing celebrates: no sound, no confetti, no score. This
 * is the Holocaust room; the Black Barbie timeline's game is not the model
 * for its tone, only for its keys.
 */

const WORDS = (id: string) => plainWords(entryById(id)!.words);

export default function OrderEvents({
  onBack,
  initialIds,
  initialOrder,
}: {
  onBack: () => void;
  /** For tests: the five entries, in their right order. */
  initialIds?: string[];
  /** For tests: the order the cards start in. */
  initialOrder?: string[];
}) {
  const [order, setOrder] = useState<string[]>(() => initialOrder ?? shuffled(initialIds ?? pickEntries()));
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<boolean[] | null>(null);
  const [said, setSaid] = useState('');
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusTo = useRef<number | null>(null);
  const allRight = !!marks && marks.every(Boolean);

  useEffect(() => headingRef.current?.focus(), []);
  useEffect(() => {
    if (focusTo.current === null) return;
    cardRefs.current[focusTo.current]?.focus();
    focusTo.current = null;
  }, [order]);

  const place = (next: string[], focus: number | null, words: string) => {
    setOrder(next);
    setMarks(null);
    focusTo.current = focus;
    setSaid(words);
  };

  // REVIEW (Verity): the exercise's spoken words (for screen readers).
  const tap = (i: number) => {
    if (picked === null) {
      setPicked(i);
      setSaid(`Card ${i + 1} picked up. Choose another card to swap it with.`);
      return;
    }
    if (picked === i) {
      setPicked(null);
      setSaid(`Card ${i + 1} put down.`);
      return;
    }
    const next = swapped(order, picked, i);
    setPicked(null);
    place(next, i, `Swapped cards ${picked + 1} and ${i + 1}.`);
  };

  const onCardKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'Escape' && picked !== null) {
      e.preventDefault();
      e.stopPropagation();
      setPicked(null);
      return;
    }
    if (picked !== i) return;
    const by = e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : 0;
    if (!by) return;
    e.preventDefault();
    const to = i + by;
    if (to < 0 || to >= order.length) return;
    setPicked(to);
    place(swapped(order, i, to), to, `Moved to card ${to + 1}.`);
  };

  const check = () => {
    const m = placesRight(order);
    setMarks(m);
    setPicked(null);
    const n = m.filter(Boolean).length;
    setSaid(n === m.length ? TIMELINE_TEXT.allRight : TIMELINE_TEXT.notYet(n, m.length));
  };

  const another = () => {
    setPicked(null);
    place(shuffled(pickEntries()), null, 'Five more events, mixed up.');
    headingRef.current?.focus();
  };

  return (
    <section className="hot-order" aria-labelledby="hot-order-heading">
      <h2 id="hot-order-heading" ref={headingRef} tabIndex={-1} className="hot-order-heading">
        {TIMELINE_TEXT.orderHeading}
      </h2>
      <p className="hot-order-how">{TIMELINE_TEXT.orderHow}</p>
      <p style={srOnly}>{TIMELINE_TEXT.orderKeys}</p>

      <p className="hot-order-end" aria-hidden="true">{TIMELINE_TEXT.earliest}</p>
      <ol className="hot-cards">
        {order.map((id, i) => {
          const entry = entryById(id)!;
          const mark = marks?.[i];
          return (
            <li key={id}>
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className="hot-card"
                onClick={() => tap(i)}
                onKeyDown={(e) => onCardKey(e, i)}
                aria-pressed={picked === i}
                aria-label={`Card ${i + 1}: ${WORDS(id)}${marks ? `. ${entry.when}, ${mark ? 'in its place' : 'not in its place yet'}` : ''}`}
                data-mark={mark === undefined ? undefined : mark ? 'right' : 'not-yet'}
              >
                <span className="hot-card-n" aria-hidden="true">{i + 1}</span>
                <span className="hot-card-words" aria-hidden="true">
                  {italicRuns(entry.words).map((r, k) => (r.italic ? <em key={k}>{r.text}</em> : <span key={k}>{r.text}</span>))}
                </span>
                {marks && (
                  <span className="hot-card-when" aria-hidden="true">
                    {entry.when}
                    <span className="hot-card-mark">{mark ? 'In its place' : 'Not yet'}</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="hot-order-end" aria-hidden="true">{TIMELINE_TEXT.latest}</p>

      {marks && (
        <p className="hot-order-result" aria-hidden="true">
          {allRight ? TIMELINE_TEXT.allRight : TIMELINE_TEXT.notYet(marks.filter(Boolean).length, marks.length)}
        </p>
      )}

      <div className="hot-order-actions">
        {allRight ? (
          <button type="button" className="hot-btn" onClick={another}>
            {TIMELINE_TEXT.another}
          </button>
        ) : (
          <button type="button" className="hot-btn" onClick={check}>
            {TIMELINE_TEXT.check}
          </button>
        )}
        <button type="button" className="hot-btn hot-btn-quiet" onClick={onBack}>
          {TIMELINE_TEXT.backToTimeline}
        </button>
      </div>

      <p role="status" style={srOnly}>{said}</p>
    </section>
  );
}
