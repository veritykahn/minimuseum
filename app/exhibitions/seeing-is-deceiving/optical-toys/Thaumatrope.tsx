'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { DISC, POSTER, TOY_NOTES } from './toysText';
import { faceAt, speedAt, TAU, thaumaSeen, TOY_SPEEDS } from './spin';
import { useSpeed } from './useSpeed';
import SpeedControl from './SpeedControl';

/*
 * The thaumatrope: a card disc on two strings, the bird on one side and the
 * cage on the other. It works the way the real one does. The disc really
 * turns about its strings, frame by frame, so the visitor only ever sees one
 * side at a time; the bird appears in its cage only when the disc turns fast
 * enough for the two sides to flicker into one. There is no picture of the
 * bird in the cage anywhere on the page.
 *
 * "Twirl" starts it very slowly and lets it climb, step by small step; the
 * slider sets the speed by hand, and a flick up or down across the disc
 * spins it too. Under reduced motion the disc does not turn: its two sides
 * are shown one at a time, and flipped by hand.
 *
 * Its two faces are the owner's illustrations (made with Leonardo.Ai,
 * credited in the room).
 */

const FACES = {
  front: '/exhibitions/seeing-is-deceiving/optical-toys/thaum-bird.webp',
  back: '/exhibitions/seeing-is-deceiving/optical-toys/thaum-cage.webp',
};

const TOP = TOY_SPEEDS.thaumatrope.top;
/** How quickly the disc follows the control: a share of the gap closed each second. */
const FOLLOW = 2.5;
/** Let go, the strings unwind it to a stop: turns a second lost each second. */
const SPIN_DOWN = 1.6;

export const THAUMA_SEEN_LABEL = {
  still: 'Still: one side faces you',
  sides: 'Slow: watch each side go by in turn',
  flicker: 'Faster: the bird and the cage flicker, one after the other',
  together: 'Fast: the bird and the cage flicker into one picture',
};

type Side = 'front' | 'back';

export default function Thaumatrope({ reduced, intro, footer }: { reduced: boolean; intro: string; footer?: ReactNode }) {
  // One side at a time under reduced motion, until the visitor chooses.
  const [sidesChoice, setSidesChoice] = useState<boolean | null>(null);
  const sidesView = sidesChoice ?? reduced;
  const [side, setSide] = useState<Side>('front');
  const [face, setFace] = useState<Side>('front');
  const [status, setStatus] = useState('');

  const toy = useRef<HTMLDivElement>(null);
  const discEl = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const speed = useRef(0);
  const target = useRef(0);
  const drag = useRef<{ y: number; t: number; v: number } | null>(null);
  const raf = useRef(0);
  // The frame loop calls itself through a ref, so it always runs the latest tick.
  const loop = useRef<FrameRequestCallback | null>(null);
  const last = useRef(0);
  const faceRef = useRef<Side>('front');

  // Draw the disc at its angle. No blending, ever: what is on screen is the card itself.
  const paint = useCallback(() => {
    if (discEl.current) discEl.current.style.transform = `rotateX(${angle.current}rad)`;
    toy.current?.style.setProperty('--twist', String(Math.round(angle.current * 6)));
    const f = faceAt(angle.current);
    if (f !== faceRef.current) {
      faceRef.current = f;
      // Spinning, the side would race: it is only told at rest.
      if (speed.current < 0.5) setFace(f);
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000 || 0);
      last.current = now;
      if (!drag.current) {
        if (target.current > 0) speed.current += (target.current - speed.current) * Math.min(1, dt * FOLLOW);
        else speed.current = Math.max(0, speed.current - SPIN_DOWN * dt);
        angle.current += speed.current * TAU * dt;
      }
      // Coming to rest, it settles flat, on whichever side it was nearest.
      if (target.current === 0 && !drag.current && speed.current === 0) {
        const rest = Math.round(angle.current / Math.PI) * Math.PI;
        angle.current += (rest - angle.current) * Math.min(1, dt * 8);
        if (Math.abs(rest - angle.current) < 0.002) {
          angle.current = rest;
          paint();
          setFace(faceAt(rest));
          raf.current = 0;
          return;
        }
      }
      paint();
      raf.current = requestAnimationFrame((n) => loop.current?.(n));
    },
    [paint],
  );

  useEffect(() => {
    loop.current = tick;
  }, [tick]);

  const run = useCallback(() => {
    if (reduced || raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame((n) => loop.current?.(n));
  }, [reduced]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => {
    paint();
  }, [paint]);

  const onSpeed = useCallback(
    (rps: number) => {
      target.current = rps;
      run();
    },
    [run],
  );
  const sp = useSpeed('thaumatrope', onSpeed);
  const rps = speedAt('thaumatrope', sp.step);
  const seen = thaumaSeen(rps);
  const twirling = sp.step > 0;

  useEffect(() => {
    if (twirling) setStatus(THAUMA_SEEN_LABEL[seen] + '.');
  }, [seen, twirling]);

  const flip = () => {
    sp.stop();
    target.current = 0;
    speed.current = 0;
    angle.current = Math.round(angle.current / Math.PI) * Math.PI + Math.PI;
    if (discEl.current && !reduced) discEl.current.style.transition = 'transform 0.6s cubic-bezier(0.3, 0.7, 0.3, 1)';
    paint();
    const f = faceAt(angle.current);
    setFace(f);
    window.setTimeout(() => {
      if (discEl.current) discEl.current.style.transition = '';
    }, 650);
    setStatus(sideLabel(f));
  };

  // A flick up or down across the disc spins it.
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { y: e.clientY, t: performance.now(), v: 0 };
    run();
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g || !discEl.current) return;
    const h = discEl.current.getBoundingClientRect().height || 300;
    const now = performance.now();
    const da = ((g.y - e.clientY) / h) * Math.PI;
    angle.current += da;
    const v = da / TAU / Math.max(0.008, (now - g.t) / 1000);
    g.v = g.v * 0.6 + v * 0.4;
    g.y = e.clientY;
    g.t = now;
    // A flick never spins it faster than the visitor has allowed.
    speed.current = Math.min(sp.flickerOk ? TOP : speedAt('thaumatrope', sp.gate), Math.abs(g.v));
  };
  const up = () => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    run();
  };

  const showSide = (s: Side) => {
    setSide(s);
    setStatus(sideLabel(s));
  };

  return (
    <div className="vt-thauma">
      <div className="vto-toy-area" ref={toy} style={{ '--twist': '0' } as CSSProperties}>
        {!sidesView ? (
          <div className="vt-toy">
            <svg className="vt-strings" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
              {[0, 1].map((s) => (
                <g key={s} className={`vt-string vt-string-${s ? 'right' : 'left'}`}>
                  <path d={s ? 'M600 20 H1000' : 'M0 20 H400'} className="vt-strand-a" />
                  <path d={s ? 'M600 20 H1000' : 'M0 20 H400'} className="vt-strand-b" />
                </g>
              ))}
            </svg>
            <div
              className="vt-disc-holder"
              role="img"
              aria-label={`The thaumatrope’s disc. ${twirling ? `Twirling. ${THAUMA_SEEN_LABEL[seen]}.` : sideLabel(face)}`}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
            >
              <div className="vt-disc" ref={discEl}>
                <div className="vt-face vt-face-front">
                  <DiscFace side="front" />
                </div>
                <div className="vt-face vt-face-back">
                  <DiscFace side="back" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <figure className="vt-one-side" aria-label="The disc, one side at a time">
            <button type="button" className="vt-side-button" onClick={() => showSide(side === 'front' ? 'back' : 'front')} aria-label={`${sideLabel(side)} Turn it over`}>
              <DiscFace side={side} />
            </button>
            <figcaption className="vt-side-name">{side === 'front' ? 'Front' : 'Back'}</figcaption>
          </figure>
        )}
      </div>

      <div className="vto-controls">
        <p className="vto-intro">{intro}</p>
        <div className="vto-actions">
          {!sidesView ? (
            <>
              {!reduced && (
                <button type="button" className="vto-button vto-button-primary" aria-pressed={twirling} onClick={twirling ? sp.stop : sp.start}>
                  {twirling ? 'Let it slow' : 'Twirl'}
                </button>
              )}
              <button type="button" className="vto-button" onClick={flip}>
                Flip the disc
              </button>
            </>
          ) : (
            <button type="button" className="vto-button vto-button-primary" onClick={() => showSide(side === 'front' ? 'back' : 'front')}>
              Turn it over
            </button>
          )}
          <button type="button" className="vto-button vto-button-quiet" aria-pressed={sidesView} onClick={() => setSidesChoice(!sidesView)}>
            {sidesView ? 'Back to the toy' : 'One side at a time'}
          </button>
        </div>
        {!reduced && !sidesView && (
          <SpeedControl
            step={sp.step}
            gate={sp.gate}
            flickerOk={sp.flickerOk}
            asking={sp.asking}
            turns={rps}
            seen={THAUMA_SEEN_LABEL[seen]}
            onStep={sp.setByHand}
            onYes={sp.yes}
            onNo={sp.no}
          />
        )}
        {reduced && sidesView && <p className="vto-note">Your device asks for less motion, so the disc stays still. To see the bird in its cage, a disc has to really spin: make your own (the Make your own tab).</p>}
        <p className="vto-caption" aria-live="polite">{seen === 'together' && !sidesView ? POSTER.discovered : POSTER.thaumatrope}</p>
        <FactNote fact={TOY_NOTES.thaumatrope} className="vto-fact" />
        {footer}
      </div>
      <p className="vto-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function sideLabel(s: Side) {
  return s === 'front' ? `Front: ${DISC.front}.` : `Back: ${DISC.back}.`;
}

/** One face of the card disc. There is no "both at once": the eye makes that. */
export function DiscFace({ side }: { side: Side }) {
  return (
    <span className="vt-face-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FACES[side]} alt="" draggable={false} />
    </span>
  );
}
