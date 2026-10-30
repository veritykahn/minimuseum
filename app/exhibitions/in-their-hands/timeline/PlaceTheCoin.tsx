'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { playCue } from '@/components/games/feedback/sound';
import { prefersReducedMotion } from '@/lib/a11y';
import { PLACE_ZONES, isRightPlace, zoneForStop } from './place';
import type { TimelineStop } from './timeline-data';

/** How far a pointer must move before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

type Drag = { x: number; y: number; active: boolean; over: string | null };

function zoneAt(x: number, y: number): string | null {
  if (typeof document === 'undefined' || !document.elementFromPoint) return null;
  const el = document.elementFromPoint(x, y);
  return (el?.closest('[data-place-zone]') as HTMLElement | null)?.dataset.placeZone ?? null;
}

/**
 * One stop of the Gospel Timeline before its story opens: the coin, its
 * ruler and passage, and the ribbon's dated places. The student drags the
 * coin to its place (mouse, pen or finger), or taps the coin and then a
 * date, or taps a date straight away; with a keyboard, Tab to a date (arrow
 * keys move along the ribbon) and press Enter. A right place snaps the coin
 * in with a click (if sound is on) and the story opens.
 *
 * Renders the page's coin area and card area, so it slots into the layout.
 */
export default function PlaceTheCoin({
  stop,
  placedStops,
  enterClass,
  onPlaced,
  onSkip,
}: {
  stop: TimelineStop;
  /** Stops already placed, drawn as small coins in their places. */
  placedStops: readonly TimelineStop[];
  /** The page's entering/visible transition class. */
  enterClass: string;
  onPlaced: () => void;
  onSkip: () => void;
}) {
  const [tried, setTried] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string | null>(null);
  const [picked, setPicked] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [message, setMessage] = useState('');
  const dragRef = useRef<{ x0: number; y0: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);
  const slotsRef = useRef<HTMLOListElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const place = useCallback(
    (zoneId: string) => {
      if (placed) return;
      const zone = PLACE_ZONES.find((z) => z.id === zoneId);
      if (!zone) return;
      setPicked(false);
      if (isRightPlace(stop.id, zoneId)) {
        setPlaced(zoneId);
        playCue('click');
        setMessage(`Yes: ${zone.label}. The story opens.`);
        timer.current = window.setTimeout(onPlaced, prefersReducedMotion() ? 500 : 950);
      } else {
        setTried((t) => (t.includes(zoneId) ? t : [...t, zoneId]));
        playCue('wrong');
        setMessage(`Not quite: not ${zone.label}. Try another date.`);
      }
    },
    [placed, stop.id, onPlaced],
  );

  // ── Pointer: drag the coin onto a place ──
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (placed || (e.pointerType === 'mouse' && e.button !== 0)) return;
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
    setDrag({ x: e.clientX, y: e.clientY, active: true, over: zoneAt(e.clientX, e.clientY) });
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
    if (placed) return;
    const next = !picked;
    setPicked(next);
    if (next) {
      setMessage('Coin picked up. Now choose its place on the ribbon.');
      slotsRef.current?.querySelector<HTMLButtonElement>('button:not([aria-disabled])')?.focus();
    } else {
      setMessage('');
    }
  };

  // Arrow keys move along the ribbon's places; they stay here rather than
  // turning the page to another stop.
  const onSlotsKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key === 'Escape' && picked) {
      setPicked(false);
      setMessage('');
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

  const right = placed ? zoneForStop(stop.id) : null;

  return (
    <>
      <div className="tl-coin-area tl-place-coin-area">
        <div className={`tl-coin-wrapper ${enterClass}`}>
          <button
            type="button"
            className={`tl-place-coin ${picked ? 'picked' : ''} ${drag ? 'dragging' : ''} ${placed ? 'placed' : ''}`}
            aria-pressed={picked}
            aria-describedby="tl-place-ask"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endDrag(e, true)}
            onPointerCancel={(e) => endDrag(e, false)}
            onClick={onCoinClick}
            disabled={!!placed}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tl-coin-img" src={stop.coinImage} alt={`The ${stop.ruler} coin`} draggable={false} />
            <span className="tl-place-coin-cue" aria-hidden="true">
              {placed ? 'In its place' : picked ? 'Now choose a date' : 'Drag me to the ribbon'}
            </span>
            <span className="tl-sr"> (pick it up, then choose its place)</span>
          </button>
        </div>
      </div>

      <div className="tl-card-area">
        <section className={`tl-card tl-place-card ${enterClass}`} aria-labelledby="tl-place-title">
          <p className="tl-place-kicker">Place the coin</p>
          <h2 className="tl-card-ruler" id="tl-place-title">{stop.ruler}</h2>
          <p className="tl-card-reference">{stop.reference}</p>
          <p className="tl-place-passage">&ldquo;{stop.passage}&rdquo;</p>
          <p className="tl-place-ask" id="tl-place-ask">
            When does this coin&rsquo;s story belong? Drag the coin onto the ribbon, or tap a date.
          </p>

          <ol
            className={`tl-place-ribbon ${picked || drag ? 'armed' : ''}`}
            ref={slotsRef}
            aria-label="The ribbon, 5 BC to 62 AD"
            onKeyDown={onSlotsKey}
          >
            {PLACE_ZONES.map((z) => {
              const missed = tried.includes(z.id);
              const here = placed === z.id;
              const others = placedStops.filter((s) => zoneForStop(s.id).id === z.id);
              return (
                <li key={z.id}>
                  <button
                    type="button"
                    className={`tl-place-slot ${missed ? 'missed' : ''} ${here ? 'here' : ''} ${drag?.over === z.id ? 'over' : ''}`}
                    data-place-zone={z.id}
                    aria-disabled={missed || !!placed || undefined}
                    onClick={() => {
                      if (!missed) place(z.id);
                    }}
                  >
                    <span className="tl-place-slot-label">{z.label}</span>
                    <span className="tl-place-slot-coins" aria-hidden="true">
                      {others.map((s) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={s.id} src={s.coinImage} alt="" />
                      ))}
                      {here && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="tl-place-snap" src={stop.coinImage} alt="" />
                      )}
                    </span>
                    <span className="tl-sr">
                      {here ? ' (the coin is here)' : missed ? ' (not this one)' : ' (place the coin here)'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="tl-place-foot">
            <p className={`tl-place-message ${right ? 'right' : tried.length ? 'wrong' : ''}`} role="status" aria-live="polite">
              {message}
            </p>
            {!placed && (
              <button type="button" className="tl-place-skip" onClick={onSkip}>
                Just show me the story
              </button>
            )}
          </div>
        </section>
      </div>

      {drag?.active &&
        typeof document !== 'undefined' &&
        createPortal(
          // eslint-disable-next-line @next/next/no-img-element
          <img className="tl-place-ghost" src={stop.coinImage} alt="" aria-hidden="true" style={{ left: drag.x, top: drag.y }} />,
          document.body,
        )}
    </>
  );
}
