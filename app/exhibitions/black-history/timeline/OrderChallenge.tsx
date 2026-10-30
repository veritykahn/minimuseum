'use client';

import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type KeyboardEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { DATED_STOPS, TIMELINE_TEXT, moved, placesRight, shuffled, swapped } from './timelineStops';

/*
 * The timeline's final challenge: the dated stops as cards, mixed up, to be
 * put back in order, earliest first. On a desktop a card drags to its place;
 * on a phone or an iPad (or with a mouse, or the keyboard) tap one card and
 * then another to swap them. With a card picked up, the arrow keys move it
 * along. "Check my order" marks each card right or not and shows its year;
 * all in place, the room celebrates.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

const NAME = Object.fromEntries(DATED_STOPS.map((s) => [s.id, s.name]));
const YEAR = Object.fromEntries(DATED_STOPS.map((s) => [s.id, s.yearLabel ?? String(s.year)]));
const IDS = DATED_STOPS.map((s) => s.id);

export default function OrderChallenge({
  onBack,
  onStartOver,
  cue,
  reduced,
  initialOrder,
}: {
  onBack: () => void;
  onStartOver: () => void;
  /** Plays a sound, if sound is on. */
  cue: (c: 'right' | 'wrong' | 'fanfare') => void;
  reduced: boolean;
  /** For tests: the order the cards start in. */
  initialOrder?: string[];
}) {
  const [order, setOrder] = useState<string[]>(() => initialOrder ?? shuffled(IDS));
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<boolean[] | null>(null);
  const [said, setSaid] = useState('');
  const dragFrom = useRef<number | null>(null);
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

  const tap = (i: number) => {
    if (picked === null) {
      setPicked(i);
      setSaid(`${NAME[order[i]]} picked up. Tap another card to swap them.`);
      return;
    }
    if (picked === i) {
      setPicked(null);
      setSaid(`${NAME[order[i]]} put down.`);
      return;
    }
    const next = swapped(order, picked, i);
    setPicked(null);
    place(next, i, `Swapped: ${NAME[next[i]]} is now card ${i + 1}, ${NAME[next[picked]]} card ${picked + 1}.`);
  };

  // With a card picked up, the arrow keys carry it along; Escape puts it down.
  const onCardKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'Escape' && picked !== null) {
      e.preventDefault();
      setPicked(null);
      return;
    }
    if (picked !== i) return;
    const by = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : 0;
    if (!by) return;
    e.preventDefault();
    const to = i + by;
    if (to < 0 || to >= order.length) return;
    const next = swapped(order, i, to);
    setPicked(to);
    place(next, to, `${NAME[next[to]]} is now card ${to + 1}.`);
  };

  const onDragStart = (e: DragEvent, i: number) => {
    dragFrom.current = i;
    setPicked(null);
    e.dataTransfer?.setData('text/plain', order[i]);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  };
  const onDrop = (e: DragEvent, i: number) => {
    e.preventDefault();
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from === null || from === i) return;
    const next = moved(order, from, i);
    place(next, null, `${NAME[next[i]]} moved to card ${i + 1}.`);
  };

  const check = () => {
    const m = placesRight(order);
    setMarks(m);
    setPicked(null);
    const n = m.filter(Boolean).length;
    if (n === m.length) {
      cue('fanfare');
      setSaid(TIMELINE_TEXT.allRight);
    } else {
      cue(n >= m.length / 2 ? 'right' : 'wrong');
      setSaid(`${n} of ${m.length} in the right place. Swap the others and check again.`);
    }
  };

  const mix = () => {
    setPicked(null);
    place(shuffled(IDS), null, 'Mixed up again.');
  };

  const rightCount = marks?.filter(Boolean).length ?? 0;

  return (
    <section className="bht-order" aria-labelledby="bht-order-heading" data-all-right={allRight || undefined}>
      {allRight && !reduced && (
        <div className="bht-confetti" aria-hidden="true">
          {Array.from({ length: 36 }, (_, i) => (
            <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--d': `${(i % 9) * 0.09}s`, '--r': `${(i * 53) % 360}deg` } as CssVars} />
          ))}
        </div>
      )}
      <h2 id="bht-order-heading" ref={headingRef} tabIndex={-1} className="bht-order-heading">
        {TIMELINE_TEXT.orderHeading}
      </h2>
      <p className="bht-order-how">{TIMELINE_TEXT.orderHow}</p>

      <div className="bht-order-ends" aria-hidden="true">
        <span>{TIMELINE_TEXT.earliest} &#8592;</span>
        <span>&#8594; {TIMELINE_TEXT.latest}</span>
      </div>
      <ol className="bht-cards">
        {order.map((id, i) => {
          const mark = marks?.[i];
          return (
            <li key={id} className="bht-card-slot" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, i)}>
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className="bht-card"
                draggable
                onDragStart={(e) => onDragStart(e, i)}
                onClick={() => tap(i)}
                onKeyDown={(e) => onCardKey(e, i)}
                aria-pressed={picked === i}
                aria-label={`Card ${i + 1}: ${NAME[id]}${marks ? `, ${YEAR[id]}, ${mark ? 'in the right place' : 'not in the right place yet'}` : ''}`}
                data-mark={mark === undefined ? undefined : mark ? 'right' : 'wrong'}
              >
                <span className="bht-card-n" aria-hidden="true">{i + 1}</span>
                <span className="bht-card-name" aria-hidden="true">{NAME[id]}</span>
                <span className="bht-card-year" aria-hidden="true">
                  {marks ? (
                    <>
                      {YEAR[id]} <span className="bht-card-tick">{mark ? '✓' : '✗'}</span>
                    </>
                  ) : (
                    '?'
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {marks && (
        <p className={`bht-order-result ${allRight ? 'bht-order-result-all' : ''}`} aria-hidden="true">
          {allRight ? TIMELINE_TEXT.allRight : `${rightCount} of ${marks.length} in the right place`}
        </p>
      )}

      <div className="bht-order-actions">
        {allRight ? (
          <button type="button" className="bht-btn bht-btn-big" onClick={onStartOver}>
            {TIMELINE_TEXT.startOver}
          </button>
        ) : (
          <>
            <button type="button" className="bht-btn bht-btn-big" onClick={check}>
              {TIMELINE_TEXT.check}
            </button>
            <button type="button" className="bht-btn bht-btn-ghost" onClick={mix}>
              {TIMELINE_TEXT.shuffle}
            </button>
          </>
        )}
        <button type="button" className="bht-btn bht-btn-ghost" onClick={onBack}>
          {TIMELINE_TEXT.backToTimeline}
        </button>
      </div>

      <p role="status" style={srOnly}>{said}</p>
    </section>
  );
}
