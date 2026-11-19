'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { playCue } from '@/components/games/feedback/sound';
import { Celebration, isGoodScore } from '@/components/games/feedback/FeedbackKit';
import { RIBBON_END, RIBBON_START, formatYear, ribbonPosition, windowPosition } from './chronology';
import { COIN_CLUES } from './clues';
import { ERAS, ERA_TURN, PLACE_ZONES, eraOf, placeVerdict, zoneForStop, type PlaceZone } from './place';
import type { TimelineStop } from './timeline-data';
import './place-the-coin.css';

/** How far a pointer must move before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

type Drag = { x: number; y: number; over: string | null };

function zoneAt(x: number, y: number): string | null {
  if (typeof document === 'undefined' || !document.elementFromPoint) return null;
  const el = document.elementFromPoint(x, y);
  return (el?.closest('[data-place-zone]') as HTMLElement | null)?.dataset.placeZone ?? null;
}

const AXIS_TICKS = [
  { label: formatYear(RIBBON_START), pos: 0, edge: 'start' },
  { label: '1 AD', pos: ribbonPosition({ year: 1, era: 'AD' }), edge: '' },
  { label: '30 AD', pos: ribbonPosition({ year: 30, era: 'AD' }), edge: '' },
  { label: formatYear(RIBBON_END), pos: 1, edge: 'end' },
];
const TURN = ribbonPosition(ERA_TURN);
const pct = (p: number) => `${(p * 100).toFixed(2)}%`;

type Phase = 'intro' | 'play' | 'done';

/**
 * Place the Coin: the game that opens the Gospel Timeline. The coins come out
 * of the purse one at a time, in a muddled order (`order`, from coinOrder).
 * Each shows its ruler and two clues (what the coin itself tells you, what
 * happens in its story) and which book its story is in. The student drags it
 * onto one of the six places on the timeline across the foot of the screen,
 * or taps the coin and then a place, or taps a place; with a keyboard, Tab to
 * a place (arrow keys move along) and press Enter. A place shows its date
 * only once a coin has landed there, so the timeline never gives it away.
 *
 * A wrong place says which way to look ("too early: further right") and is
 * crossed off for that coin; a second miss adds a hint from the book. A right
 * place snaps the coin in, shows its date and why it belongs there, and the
 * Next coin button moves on. A coin placed first time earns a star; after the
 * last coin come the score and the way into the stories.
 */
export default function PlaceTheCoin({
  order,
  onReadStories,
}: {
  /** The coins, in the order they come out of the purse. Null until the browser has shuffled them. */
  order: readonly TimelineStop[] | null;
  /** Leave the game for the stories (from the intro, the end, or the skip button). */
  onReadStories: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [placedIds, setPlacedIds] = useState<number[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [tried, setTried] = useState<string[]>([]);
  const [right, setRight] = useState(false);
  const [picked, setPicked] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'' | 'right' | 'wrong'>('');

  const dragRef = useRef<{ x0: number; y0: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);
  const slotsRef = useRef<HTMLOListElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const coinRef = useRef<HTMLButtonElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const focusCoin = useRef(false);

  const total = order?.length ?? 0;
  const stop = phase === 'play' && order ? order[index] : null;
  const clues = stop ? COIN_CLUES[stop.id] : null;
  const placedStops = (order ?? []).filter((s) => placedIds.includes(s.id));
  const revealed = new Set(placedStops.map((s) => zoneForStop(s.id).id));
  const isLastCoin = index === total - 1;
  const hereZone = right && stop ? zoneForStop(stop.id).id : null;

  // A right answer moves focus to Next; a new coin, to the coin; the end, to its heading.
  useEffect(() => {
    if (right) nextRef.current?.focus();
  }, [right]);
  useEffect(() => {
    if (phase === 'play' && focusCoin.current) {
      focusCoin.current = false;
      coinRef.current?.focus();
    }
    if (phase === 'done') headRef.current?.focus();
  }, [phase, index]);

  const start = () => {
    setPhase('play');
    setIndex(0);
    setPlacedIds([]);
    setStars([]);
    setTried([]);
    setRight(false);
    setPicked(false);
    setMessage('');
    setTone('');
    focusCoin.current = true;
  };

  const place = useCallback(
    (zoneId: string) => {
      if (!stop || right || tried.includes(zoneId)) return;
      const zone = PLACE_ZONES.find((z) => z.id === zoneId);
      if (!zone) return;
      setPicked(false);
      const verdict = placeVerdict(stop.id, zoneId);
      if (verdict === 'right') {
        setRight(true);
        setPlacedIds((ids) => [...ids, stop.id]);
        const first = tried.length === 0;
        if (first) setStars((s) => [...s, stop.id]);
        playCue('right');
        setTone('right');
        setMessage(`Yes! The ${stop.ruler} coin belongs at ${zone.label}.${first ? ' Right first time: a star!' : ''}`);
      } else {
        const misses = [...tried, zoneId];
        setTried(misses);
        playCue('wrong');
        setTone('wrong');
        const way =
          verdict === 'too-early'
            ? 'Too early! This coin’s story comes later. Try a place further right.'
            : 'Too late! This coin’s story comes earlier. Try a place further left.';
        const era = eraOf(stop);
        const hint =
          misses.length >= 2 ? ` Hint: its story is in ${era === 'acts' ? 'Acts' : 'a Gospel'}, so look under “${ERAS[era].label}”.` : '';
        setMessage(way + hint);
      }
    },
    [stop, right, tried],
  );

  const nextCoin = () => {
    setTried([]);
    setRight(false);
    setMessage('');
    setTone('');
    if (isLastCoin) {
      setPhase('done');
      return;
    }
    focusCoin.current = true;
    setIndex((i) => i + 1);
  };

  // ── Pointer: drag the coin onto a place ──
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (right || (e.pointerType === 'mouse' && e.button !== 0)) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* jsdom and old browsers */
    }
    dragRef.current = { x0: e.clientX, y0: e.clientY, active: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    if (!d.active && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < DRAG_THRESHOLD) return;
    d.active = true;
    setDrag({ x: e.clientX, y: e.clientY, over: zoneAt(e.clientX, e.clientY) });
  };
  const endDrag = (e: PointerEvent<HTMLButtonElement>, drop: boolean) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d?.active) return;
    suppressClick.current = true;
    setDrag(null);
    if (drop) {
      const over = zoneAt(e.clientX, e.clientY);
      if (over) place(over);
    }
  };

  // ── Tap or keyboard: pick the coin up, then choose a place ──
  const onCoinClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (right) return;
    const next = !picked;
    setPicked(next);
    if (next) {
      setTone('');
      setMessage('Coin picked up. Now choose its place on the timeline.');
      slotsRef.current?.querySelector<HTMLButtonElement>('button:not([aria-disabled])')?.focus();
    } else {
      setMessage('');
    }
  };

  // Arrow keys move along the timeline's places; they stay here rather than
  // turning the page.
  const onSlotsKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key === 'Escape' && picked) {
      setPicked(false);
      setMessage('');
      coinRef.current?.focus();
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const buttons = Array.from(slotsRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let j = i;
    if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = buttons.length - 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
    else j = Math.min(buttons.length - 1, i + 1);
    buttons[j]?.focus();
  };

  const slotName = (z: PlaceZone, i: number) => {
    const open = revealed.has(z.id) || phase === 'done';
    const n = PLACE_ZONES.length;
    const when = open ? z.label : `Place ${i + 1} of ${n}${i === 0 ? ', the earliest' : i === n - 1 ? ', the latest' : ''}`;
    if (phase !== 'play') return when;
    if (hereZone === z.id) return `${when} (the coin is here)`;
    if (tried.includes(z.id)) return `${when} (not this one)`;
    return `${when} (place the coin here)`;
  };

  const timeline = (
    <div className={`ptc-timeline ${picked || drag ? 'armed' : ''}`}>
      <p className="ptc-timeline-name" id="ptc-timeline-name">
        The timeline <span>earliest on the left, latest on the right</span>
      </p>
      <div className="ptc-eras" aria-hidden="true">
        <span className="ptc-era gospels" style={{ left: 0, width: pct(TURN) }}>
          {ERAS.gospels.label}
        </span>
        <span className="ptc-era acts" style={{ left: pct(TURN), width: pct(1 - TURN) }}>
          {ERAS.acts.label}
        </span>
      </div>
      <div className="ptc-axis" aria-hidden="true">
        <span className="ptc-axis-line" />
        {AXIS_TICKS.map((t) => (
          <span key={t.label} className={`ptc-tick ${t.edge}`} style={{ left: pct(t.pos) }}>
            <span>{t.label}</span>
          </span>
        ))}
        {PLACE_ZONES.map((z) => {
          const a = ribbonPosition(z.from);
          const b = z.to ? ribbonPosition(z.to) : a;
          return (
            <span
              key={z.id}
              className={`ptc-mark ${drag?.over === z.id || hereZone === z.id ? 'on' : ''}`}
              style={{ left: pct(a), width: `max(4px, ${pct(b - a)})` }}
            />
          );
        })}
      </div>
      <svg className="ptc-leaders" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {PLACE_ZONES.map((z, i) => (
          <line
            key={z.id}
            className={drag?.over === z.id || hereZone === z.id ? 'on' : ''}
            x1={windowPosition(z.from, z.to) * 100}
            y1={0}
            x2={((i + 0.5) / PLACE_ZONES.length) * 100}
            y2={10}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <ol className="ptc-slots" ref={slotsRef} aria-labelledby="ptc-timeline-name" onKeyDown={onSlotsKey}>
        {PLACE_ZONES.map((z, i) => {
          const missed = phase === 'play' && tried.includes(z.id);
          const here = phase === 'play' && hereZone === z.id;
          const open = revealed.has(z.id) || phase === 'done';
          const coins = placedStops.filter((s) => zoneForStop(s.id).id === z.id);
          return (
            <li key={z.id}>
              <button
                type="button"
                className={`ptc-slot ${missed ? 'missed' : ''} ${here ? 'here' : ''} ${open ? 'open' : ''} ${drag?.over === z.id ? 'over' : ''}`}
                data-place-zone={z.id}
                aria-disabled={phase !== 'play' || missed || right || undefined}
                aria-label={slotName(z, i)}
                onClick={() => place(z.id)}
              >
                <span className="ptc-slot-date" aria-hidden="true">
                  {open ? z.label : '?'}
                </span>
                <span className="ptc-slot-coins" aria-hidden="true">
                  {coins.map((s) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={s.id} src={s.coinImage} alt="" className={here && s.id === stop?.id ? 'snap' : ''} />
                  ))}
                </span>
                {missed && (
                  <span className="ptc-slot-x" aria-hidden="true">
                    {'✕'}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );

  return (
    <section className={`ptc ptc-${phase}`} aria-labelledby="ptc-title">
      {phase === 'intro' && (
        <div className="ptc-intro">
          <p className="ptc-kicker">A game for the Gospel Timeline</p>
          <h1 className="ptc-title" id="ptc-title">
            Place the Coin
          </h1>
          <p className="ptc-lead">
            Eleven coins are in the purse, all muddled up. Each one belongs to a story from the Bible. Can you put every
            coin in its place in time?
          </p>
          <ol className="ptc-how">
            <li>
              <span className="ptc-how-n" aria-hidden="true">
                1
              </span>
              <span>
                <strong>Read the clues on the coin.</strong> Whose coin is it? What happens in its story?
              </span>
            </li>
            <li>
              <span className="ptc-how-n" aria-hidden="true">
                2
              </span>
              <span>
                <strong>Drag it onto the timeline at the bottom.</strong> A timeline is a line of years: the earliest on
                the left, the latest on the right. Or tap the coin, then tap a place.
              </span>
            </li>
            <li>
              <span className="ptc-how-n" aria-hidden="true">
                3
              </span>
              <span>
                <strong>A place shows its date only when a coin lands there.</strong> Right first time wins a star.
              </span>
            </li>
          </ol>
          <div className="ptc-actions">
            <button type="button" className="ptc-btn primary" onClick={start} disabled={!order}>
              Open the purse
            </button>
            <button type="button" className="ptc-btn quiet" onClick={onReadStories}>
              Just show me the stories
            </button>
          </div>
        </div>
      )}

      {phase === 'play' && stop && clues && (
        <div className="ptc-play">
          <div className="ptc-bar">
            <h1 className="ptc-bar-title" id="ptc-title">
              Place the Coin
            </h1>
            <p className="ptc-count">
              Coin {index + 1} of {total}
            </p>
            <p className="ptc-stars">
              <span aria-hidden="true">{'★'}</span> {stars.length} {stars.length === 1 ? 'star' : 'stars'}
            </p>
            <button type="button" className="ptc-btn quiet small" onClick={onReadStories}>
              Just show me the stories
            </button>
          </div>

          <div className="ptc-stage" key={stop.id}>
            <h2 className="ptc-ruler">{stop.ruler}</h2>
            <div className="ptc-coin-row">
              <p className="ptc-clue who">
                <span className="ptc-clue-tag">On the coin</span>
                {clues.who}
              </p>
              <button
                type="button"
                ref={coinRef}
                className={`ptc-coin ${picked ? 'picked' : ''} ${drag ? 'dragging' : ''} ${right ? 'placed' : ''}`}
                aria-pressed={picked}
                aria-label={`The ${stop.ruler} coin (pick it up, then choose its place on the timeline)`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => endDrag(e, true)}
                onPointerCancel={(e) => endDrag(e, false)}
                onClick={onCoinClick}
                disabled={right}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stop.coinImage} alt="" draggable={false} />
                <span className="ptc-coin-cue" aria-hidden="true">
                  {right ? 'In its place' : picked ? 'Now tap a place' : 'Drag me down to the timeline'}
                </span>
              </button>
              <p className="ptc-clue story">
                <span className="ptc-clue-tag">In the story</span>
                {clues.story}
              </p>
            </div>
            <p className="ptc-book">
              {stop.reference} <span>{ERAS[eraOf(stop)].book}</span>
            </p>

            <div className={`ptc-say ${tone}`}>
              <p className="ptc-message" role="status" aria-live="polite">
                {message || 'Where does this coin belong on the timeline?'}
              </p>
              {right && (
                <div className="ptc-why">
                  <p>
                    <strong>{stop.when.label}.</strong> {clues.why}
                  </p>
                  <button type="button" ref={nextRef} className="ptc-btn primary" onClick={nextCoin}>
                    {isLastCoin ? 'See your score' : 'Next coin'} <span aria-hidden="true">{'→'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {timeline}
        </div>
      )}

      {phase === 'done' && (
        <div className="ptc-done">
          {isGoodScore(stars.length, total) && <Celebration />}
          <p className="ptc-kicker">Every coin is in its place</p>
          <h1 className="ptc-title" id="ptc-title" ref={headRef} tabIndex={-1}>
            {stars.length === total ? 'A perfect timeline!' : `${stars.length} of ${total} first time`}
          </h1>
          <p className="ptc-lead">
            You put {stars.length} of {total} coins in the right place on the first try. Now every date is showing: the
            Nativity at one end, Paul&rsquo;s journey to Rome at the other.
          </p>
          {timeline}
          <div className="ptc-actions">
            <button type="button" className="ptc-btn primary" onClick={onReadStories}>
              Read the stories <span aria-hidden="true">{'→'}</span>
            </button>
            <button type="button" className="ptc-btn quiet" onClick={start}>
              Play again
            </button>
          </div>
        </div>
      )}

      {drag &&
        stop &&
        typeof document !== 'undefined' &&
        createPortal(
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ptc-ghost" src={stop.coinImage} alt="" aria-hidden="true" style={{ left: drag.x, top: drag.y }} />,
          document.body,
        )}
    </section>
  );
}
