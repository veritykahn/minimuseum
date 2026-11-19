'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { useClientSeed, nextSeed } from '@/components/games/useClientSeed';
import { seededShuffle } from '@/components/games/scoring';
import { ANCHOR_ID, DATED_STOPS, SORT_CARDS, TIMELINE_TEXT, posterSentence, stopName, stopYear, type SortSide } from './timelineStops';

/*
 * Point: the class works out from the poster's own words whether each doll
 * came before or after the first Black Barbie, so the order is reasoned, not
 * remembered.
 *
 * The timeline's final challenge, "Before or after?" (timelineStops.ts, at
 * SORT_CARDS, says why it is not "put them in order"). The first Black Barbie
 * stands in the middle with its year; one card at a time gives a clue with
 * no year, and the class says Before 1980 or After 1980 (the buttons, or the
 * Left and Right arrow keys). Right, the card goes to its side with its
 * year; wrong, a hint points at the words that decide it, and they try
 * again. The score counts the cards right on the first try. At the end,
 * every stop in time, Shani too.
 *
 * The cards come in a new order each time, from a seed made only in the
 * browser (useClientSeed), so the server and the browser never disagree.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;
type Placed = { id: string; side: SortSide; first: boolean };

const IDS = SORT_CARDS.map((c) => c.id);
const CARD = Object.fromEntries(SORT_CARDS.map((c) => [c.id, c]));
const ANCHOR_WORDS = posterSentence('This doll broke away');
/** Each opening of the challenge in a visit deals a new order, not the same one again. */
let openings = 0;

export default function OrderChallenge({
  onBack,
  onStartOver,
  cue,
  reduced,
  initialDeck,
}: {
  onBack: () => void;
  onStartOver: () => void;
  /** Plays a sound, if sound is on. */
  cue: (c: 'right' | 'wrong' | 'fanfare') => void;
  reduced: boolean;
  /** For tests: the order the cards come in. */
  initialDeck?: string[];
}) {
  const seed = useClientSeed();
  const [opening] = useState(() => openings++);
  const [round, setRound] = useState(0);
  const deck = useMemo(() => (initialDeck && round === 0 ? initialDeck : seed === null ? null : seededShuffle(IDS, nextSeed(seed, opening * 97 + round))), [initialDeck, seed, opening, round]);
  const [at, setAt] = useState(0);
  const [missed, setMissed] = useState(false);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [said, setSaid] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLParagraphElement>(null);

  const total = IDS.length;
  const done = at >= total;
  const id = deck?.[at];
  const card = id ? CARD[id] : undefined;
  const answered = !!id && placed.some((p) => p.id === id);
  const firstRight = placed.filter((p) => p.first).length;
  const allRight = done && firstRight === total;

  useEffect(() => headingRef.current?.focus(), []);

  const focusSoon = (el: () => HTMLElement | null) => requestAnimationFrame(() => el()?.focus());

  const choose = (side: SortSide) => {
    if (!card || answered) return;
    if (side === card.side) {
      cue('right');
      setPlaced((p) => [...p, { id: card.id, side, first: !missed }]);
      setSaid(`${TIMELINE_TEXT.rightLead} ${TIMELINE_TEXT.placed(stopName(card.id), stopYear(card.id), side)}`);
      focusSoon(() => nextRef.current);
    } else {
      cue('wrong');
      setMissed(true);
      setSaid(`${TIMELINE_TEXT.hintLead} ${card.hint}`);
    }
  };

  const next = () => {
    setMissed(false);
    if (at + 1 < total) {
      setAt(at + 1);
      setSaid('');
      focusSoon(() => cardRef.current);
      return;
    }
    setAt(total);
    const perfect = firstRight === total;
    if (perfect) cue('fanfare');
    setSaid(perfect ? TIMELINE_TEXT.allRight : TIMELINE_TEXT.result(firstRight, total));
    focusSoon(() => endRef.current);
  };

  const again = () => {
    setRound((r) => r + 1);
    setAt(0);
    setMissed(false);
    setPlaced([]);
    setSaid('');
    focusSoon(() => cardRef.current);
  };

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey || answered || done) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (!(e.target as HTMLElement).closest('.bht-sort-card, .bht-order-heading')) return;
    e.preventDefault();
    choose(e.key === 'ArrowLeft' ? 'before' : 'after');
  };

  const pile = (side: SortSide) => (
    <div className={`bht-pile bht-pile-${side}`}>
      <p className="bht-pile-heading">{side === 'before' ? TIMELINE_TEXT.before : TIMELINE_TEXT.after}</p>
      <ul>
        {placed
          .filter((p) => p.side === side)
          .map((p) => (
            <li key={p.id}>
              <span className="bht-pile-year">{stopYear(p.id)}</span> {stopName(p.id)}
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <section className="bht-order" aria-labelledby="bht-order-heading" data-all-right={allRight || undefined} onKeyDown={onKey}>
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

      {!done ? (
        <>
          <p className="bht-order-how">{TIMELINE_TEXT.orderHow}</p>
          <div className="bht-sort">
            {pile('before')}
            <div className="bht-sort-middle">
              <div className="bht-sort-anchor">
                <span className="bht-sort-anchor-year">{stopYear(ANCHOR_ID)}</span>
                <span className="bht-sort-anchor-name">{TIMELINE_TEXT.anchorName}</span>
                <span className="bht-sort-anchor-words">“{ANCHOR_WORDS}”</span>
              </div>
              {card && (
                <div className="bht-sort-card" ref={cardRef} tabIndex={-1} key={card.id} aria-labelledby="bht-sort-name" aria-describedby="bht-sort-clue" data-state={answered ? 'right' : missed ? 'hint' : undefined}>
                  <p className="bht-sort-count">{TIMELINE_TEXT.cardCount(at + 1, total)}</p>
                  <p className="bht-sort-name" id="bht-sort-name">
                    {stopName(card.id)}
                  </p>
                  <figure className="bht-sort-clue" id="bht-sort-clue">
                    <blockquote>{card.from === 'poster' ? `“…${card.clue}…”` : card.clue}</blockquote>
                    <figcaption>{card.from === 'poster' ? TIMELINE_TEXT.fromPoster : TIMELINE_TEXT.fromNote}</figcaption>
                  </figure>
                  {answered ? (
                    <p className="bht-sort-said bht-sort-right" aria-hidden="true">
                      {TIMELINE_TEXT.rightLead} {TIMELINE_TEXT.placed(stopName(card.id), stopYear(card.id), card.side)}
                    </p>
                  ) : (
                    missed && (
                      <p className="bht-sort-said bht-sort-hint" aria-hidden="true">
                        <strong>{TIMELINE_TEXT.hintLead}</strong> {card.hint}
                      </p>
                    )
                  )}
                  <div className="bht-sort-picks">
                    {answered ? (
                      <button ref={nextRef} type="button" className="bht-btn bht-btn-big" onClick={next}>
                        {at + 1 < total ? TIMELINE_TEXT.next : TIMELINE_TEXT.seeLine}
                      </button>
                    ) : (
                      <>
                        <button type="button" className="bht-btn bht-btn-big bht-sort-pick" onClick={() => choose('before')}>
                          <span aria-hidden="true">&#8592; </span>
                          {TIMELINE_TEXT.before}
                        </button>
                        <button type="button" className="bht-btn bht-btn-big bht-sort-pick" onClick={() => choose('after')}>
                          {TIMELINE_TEXT.after}
                          <span aria-hidden="true"> &#8594;</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {pile('after')}
          </div>
        </>
      ) : (
        <div className="bht-line-end">
          <p ref={endRef} tabIndex={-1} className={`bht-order-result ${allRight ? 'bht-order-result-all' : ''}`}>
            {allRight ? TIMELINE_TEXT.allRight : TIMELINE_TEXT.result(firstRight, total)}
          </p>
          <h3 className="bht-line-heading">{TIMELINE_TEXT.lineHeading}</h3>
          <ol className="bht-line">
            {DATED_STOPS.map((s) => (
              <li key={s.id} data-anchor={s.id === ANCHOR_ID || undefined}>
                <span className="bht-line-year">{stopYear(s.id)}</span>
                <span className="bht-line-name">{s.name}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="bht-order-actions">
        {done && (
          <>
            <button type="button" className="bht-btn bht-btn-big" onClick={onStartOver}>
              {TIMELINE_TEXT.startOver}
            </button>
            <button type="button" className="bht-btn bht-btn-ghost" onClick={again}>
              {TIMELINE_TEXT.tryAgain}
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
