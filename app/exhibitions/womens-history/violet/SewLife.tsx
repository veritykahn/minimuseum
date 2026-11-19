'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnswerFeedback, Celebration } from '@/components/games/feedback/FeedbackKit';
import { seededShuffle } from '@/components/games/scoring';
import { useClientSeed } from '@/components/games/useClientSeed';
import Keepsake from './Keepsake';
import { useBox } from './useBox';
import { threadLayout, threadPath } from './violetLife';
import {
  SEW_CARDS,
  SEW_START,
  checkLine,
  checkStitches,
  emptySlots,
  keepRight,
  placeCard,
  slotOf,
  type SewCard,
  type Slots,
} from './sewLife';

/*
 * Sew her life together (sewLife.ts): the room's opening challenge.
 *
 * Its point: from clues in Violet's own story (an age, a year, the Blitz,
 * "after the war"), a child works out the order of her life, as a historian
 * builds a timeline from evidence; the poster alone hands it over in order.
 *
 * The thread runs across the cloth as in her story, with Fulham sewn on at
 * its start and six empty rings after it. Below, the basket: the six
 * keepsakes, dealt in a shuffled order that never changes, each with its
 * clue in the poster's typewritten words. Pick a keepsake, then a ring
 * (every piece is a button, so touch, mouse and keyboard all work; a card
 * already on the thread can be picked up from either place and moved, and
 * two cards swap). With all six on, check the stitches: the right ones are
 * sewn on for good, the rest return to the basket with one hint. After two
 * tries the visitor may have one sewn on for them. Done, each ring shows
 * the year worked out, and her whole story is one press away.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

/** The basket's order: shuffled, but never the answer itself. */
export function dealOrder(seed: number): SewCard[] {
  const dealt = seededShuffle(SEW_CARDS, seed);
  const same = dealt.every((c, i) => c.id === SEW_CARDS[i].id);
  return same ? [...dealt.slice(1), dealt[0]] : dealt;
}

const clueText = (c: SewCard) => c.clue.join(' … ');

export default function SewLife({
  announce,
  onRead,
  onMake,
}: {
  announce: (message: string) => void;
  /** Open her whole story. */
  onRead: () => void;
  /** Open "Make your own". */
  onMake: () => void;
}) {
  const seed = useClientSeed();
  const basket = useMemo(() => (seed === null ? null : dealOrder(seed)), [seed]);
  const [slots, setSlots] = useState<Slots>(emptySlots);
  const [locked, setLocked] = useState<ReadonlySet<number>>(() => new Set());
  const [held, setHeld] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [said, setSaid] = useState<{ line: string; hint: SewCard | null; tone: 'right' | 'wrong'; n: number } | null>(null);
  const [bandRef, band] = useBox<HTMLDivElement>();
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const done = locked.size === SEW_CARDS.length;
  const full = slots.every(Boolean);
  const cardOf = (id: string | null) => SEW_CARDS.find((c) => c.id === id) ?? null;

  // Fulham, then the six rings; on a phone the seam runs across and back.
  const count = SEW_CARDS.length + 1;
  const rows = band.w > 0 && band.w < 560 ? 2 : 1;
  const points = useMemo(() => threadLayout(count, band.w, band.h, rows), [count, band, rows]);
  const fullPath = useMemo(() => threadPath(points), [points]);
  // The thread is sewn in orange as far as the stitches hold, unbroken from Fulham.
  let run = 0;
  while (run < SEW_CARDS.length && locked.has(run)) run++;
  const sewnPath = useMemo(() => threadPath(points.slice(0, run + 1)), [points, run]);

  const pick = (id: string) => {
    if (done) return;
    const at = slotOf(slots, id);
    if (at >= 0 && locked.has(at)) return;
    const next = held === id ? null : id;
    setHeld(next);
    if (next) announce(`${cardOf(next)!.label} picked up. Now choose a place on the thread.`); // REVIEW: new text
  };

  const tapSlot = (i: number) => {
    if (done || locked.has(i)) return;
    if (held) {
      const card = cardOf(held)!;
      setSlots((s) => placeCard(s, held, i, locked));
      setHeld(null);
      announce(`${card.label}, place ${i + 2} of ${count} on the thread.`); // REVIEW: new text
      return;
    }
    // Nothing in hand: pick up the card in this ring, to move it.
    const there = slots[i];
    if (there) pick(there);
  };

  const check = () => {
    if (!full || done) return;
    const c = checkStitches(slots);
    const nowLocked = new Set([...locked, ...c.right]);
    setLocked(nowLocked);
    setSlots(keepRight(slots, c.right));
    setHeld(null);
    setTries((t) => t + 1);
    const line = checkLine(c);
    setSaid({ line, hint: c.hintFor, tone: c.done ? 'right' : 'wrong', n: tries + 1 });
    announce(c.hintFor ? `${line} Hint, ${c.hintFor.label}: ${c.hintFor.hint}` : line);
  };

  // After two tries, one card may be sewn on for the visitor: the first ring still open, with its own card.
  const helpOne = () => {
    const i = SEW_CARDS.findIndex((_, k) => !locked.has(k));
    if (i < 0) return;
    const card = SEW_CARDS[i];
    const nowLocked = new Set([...locked, i]);
    setSlots((s) => {
      const cleared = s.map((id) => (id === card.id ? null : id));
      cleared[i] = card.id;
      return cleared;
    });
    setLocked(nowLocked);
    setHeld(null);
    const finished = nowLocked.size === SEW_CARDS.length;
    const line = finished ? checkLine({ right: [], hintFor: null, done: true }) : `${card.label} is sewn on in place ${i + 2}: ${card.worked}.`; // REVIEW: new text
    setSaid({ line, hint: null, tone: 'right', n: tries + 100 });
    announce(line);
  };

  const heldCard = cardOf(held);

  return (
    <>
      <div className="whv-band whs-band" ref={bandRef}>
        <svg className="whv-thread" width={band.w} height={band.h} aria-hidden="true" focusable="false">
          <path className="whv-thread-ahead" d={fullPath} />
          <path className="whv-thread-sewn" d={sewnPath} />
        </svg>
        <ol className="whv-stops whs-slots" aria-label="Violet’s life, along the thread">
          <li className="whs-slot-li" style={points[0] ? { left: points[0].x, top: points[0].y } : { opacity: 0 }}>
            <span className="whv-stop is-visited whs-slot is-start">
              <span className="whv-stop-button">
                <Keepsake id={SEW_START.keepsake} className="whv-stop-art" />
              </span>
              <span className="whv-stop-label">
                {SEW_START.label}
                <span className="whv-stop-when">born {SEW_START.worked}</span>
              </span>
            </span>
          </li>
          {slots.map((id, i) => {
            const p = points[i + 1];
            const card = cardOf(id);
            const isLocked = locked.has(i);
            const label = card
              ? `Place ${i + 2}: ${card.label}${isLocked ? ', sewn on' : held && held !== id ? '. Press to swap' : ''}`
              : `Place ${i + 2}: empty${held ? `. Press to put ${heldCard?.label} here` : ''}`;
            return (
              <li key={i} className="whs-slot-li" style={p ? ({ left: p.x, top: p.y, '--i': String(i + 1) } as CssVars) : { opacity: 0 }}>
                <button
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  type="button"
                  className={`whv-stop whs-slot${card ? ' is-filled' : ' is-empty'}${isLocked ? ' is-visited is-locked' : ''}${held && !isLocked ? ' is-target' : ''}${held && held === id ? ' is-held' : ''}`}
                  aria-label={label}
                  aria-disabled={isLocked || done || undefined}
                  onClick={() => tapSlot(i)}
                >
                  <span className="whv-stop-button" aria-hidden="true">
                    {card ? <Keepsake id={card.keepsake} className="whv-stop-art" /> : <span className="whs-slot-n">{i + 2}</span>}
                  </span>
                  <span className="whv-stop-label" aria-hidden="true">
                    {card?.label}
                    {isLocked && card && <span className="whv-stop-when">{card.worked}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <section className="whv-sheet whs-sheet" aria-labelledby="whs-head">
        <div className="whs-inner">
          <div className="whs-top">
            <h2 className="whs-head" id="whs-head">
              {done ? 'Her life, sewn together' : 'Sew her life together'}
            </h2>
            {/* REVIEW: new text */}
            <p className="whs-lede">
              {done
                ? 'You put Violet’s life in order from clues in her own story, the way a historian builds a timeline. Now read all of it.'
                : 'Her keepsakes have come off the thread. Each one has a clue from her story. Pick a keepsake, then its place. She was born in 1907.'}
            </p>
          </div>

          {!done && (
            <ul className="whs-basket" aria-label="The basket of keepsakes">
              {(basket ?? []).map((c) => {
                const at = slotOf(slots, c.id);
                const sewn = at >= 0 && locked.has(at);
                if (sewn) return null;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`whs-card${held === c.id ? ' is-held' : ''}${at >= 0 ? ' is-placed' : ''}`}
                      aria-pressed={held === c.id}
                      onClick={() => pick(c.id)}
                    >
                      <span className="whs-card-disc" aria-hidden="true">
                        <Keepsake id={c.keepsake} className="whs-card-art" />
                      </span>
                      <span className="whs-card-words">
                        <span className="whs-card-label">
                          {c.label}
                          {at >= 0 && <span className="whs-card-at"> · on the thread, place {at + 2}</span>}
                        </span>
                        <span className="whs-card-clue">“…{clueText(c)}”</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {done && (
            <ol className="whs-done-list" aria-label="Her life, in order">
              {[SEW_START, ...SEW_CARDS].map((c) => (
                <li key={c.id}>
                  <Keepsake id={c.keepsake} className="whs-done-art" />
                  <span className="whs-done-label">{c.label}</span>
                  <span className="whs-done-when">{c.id === SEW_START.id ? `Born ${c.worked}` : c.worked}</span>
                </li>
              ))}
            </ol>
          )}

          {said && !done && (
            <div className={`whs-said is-${said.tone}`} key={said.n}>
              <AnswerFeedback tone={said.tone} />
              <p className="whs-said-line">{said.line}</p>
              {said.hint && (
                <p className="whs-said-hint">
                  <strong>Hint · {said.hint.label}:</strong> {said.hint.hint}
                </p>
              )}
            </div>
          )}
          {done && <Celebration />}
        </div>

        <nav className="whv-steps whs-steps" aria-label="Sewing">
          {done ? (
            <>
              <button type="button" className="whv-step" onClick={onMake}>
                Make your own
              </button>
              <button type="button" className="whv-step whv-step-next" onClick={onRead}>
                Read her whole story <span aria-hidden="true">&#8594;</span>
              </button>
            </>
          ) : (
            <>
              <span className="whs-progress" aria-hidden="true">
                {locked.size} of {SEW_CARDS.length} sewn on
              </span>
              <span className="whv-steps-move">
                {tries >= 2 && (
                  <button type="button" className="whv-step" onClick={helpOne}>
                    Sew one on for me
                  </button>
                )}
                <button type="button" className="whv-step whv-step-next" onClick={check} disabled={!full}>
                  Check the stitches
                </button>
              </span>
            </>
          )}
        </nav>
      </section>
    </>
  );
}
