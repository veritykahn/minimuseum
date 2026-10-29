'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { DiscArt } from './DiscArt';
import { DISCS, type DiscId } from './toysText';
import { approach, faceAt, thaumaBlend, TAU, THAUMA_TOP } from './spin';

/*
 * The thaumatrope: a card disc on two strings, a half picture on each side.
 * Twirl it (the button, or a flick up or down across the disc) and it turns
 * over and over; slowly, the sides are seen in turn, and past a turn and a
 * half a second they are shown merged, steady, as the eye sees them. Or look
 * at its sides one by one: under reduced motion that is all it shows.
 */

const SPIN_UP = 3; // turns a second, every second, as the strings are twirled
const SPIN_DOWN = 1.1; // as they unwind
const SIDES = ['front', 'back', 'together'] as const;
type Side = (typeof SIDES)[number];

export default function Thaumatrope({ reduced, disc, onDisc, intro }: { reduced: boolean; disc: DiscId; onDisc: (d: DiscId) => void; intro: string }) {
  const d = DISCS.find((x) => x.id === disc)!;
  const [twirling, setTwirling] = useState(false);
  // Side by side under reduced motion, until the visitor chooses.
  const [sidesChoice, setSidesChoice] = useState<boolean | null>(null);
  const sidesView = sidesChoice ?? reduced;
  const [side, setSide] = useState<Side>('front');
  const [merged, setMerged] = useState(false);
  const [face, setFace] = useState<'front' | 'back'>('front');
  const [status, setStatus] = useState('');

  const toy = useRef<HTMLDivElement>(null);
  const discEl = useRef<HTMLDivElement>(null);
  const blendEl = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const speed = useRef(0);
  const twirl = useRef(false);
  const drag = useRef<{ y: number; t: number; v: number } | null>(null);
  const raf = useRef(0);
  // The frame loop calls itself through a ref, so it always runs the latest tick.
  const loop = useRef<FrameRequestCallback | null>(null);
  const last = useRef(0);
  const mergedRef = useRef(false);
  const faceRef = useRef<'front' | 'back'>('front');


  // Draw the disc at its angle and speed.
  const paint = useCallback(() => {
    const blend = thaumaBlend(speed.current);
    if (discEl.current) {
      discEl.current.style.transform = `rotateX(${angle.current}rad)`;
      discEl.current.style.opacity = String(1 - blend);
    }
    if (blendEl.current) blendEl.current.style.opacity = String(blend);
    toy.current?.style.setProperty('--twist', String(Math.round(angle.current * 6)));
    const f = faceAt(angle.current);
    if (f !== faceRef.current) {
      faceRef.current = f;
      setFace(f);
    }
    const isMerged = blend >= 1;
    if (isMerged !== mergedRef.current) {
      mergedRef.current = isMerged;
      setMerged(isMerged);
      if (isMerged) setStatus('The two sides make one picture.');
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000 || 0);
      last.current = now;
      if (!drag.current) {
        const target = twirl.current ? THAUMA_TOP : 0;
        speed.current = approach(speed.current, target, dt, twirl.current ? SPIN_UP : SPIN_DOWN);
        angle.current += speed.current * TAU * dt;
      }
      // Coming to rest, it settles flat, on whichever side it was nearest.
      if (!twirl.current && !drag.current && speed.current === 0) {
        const rest = Math.round(angle.current / Math.PI) * Math.PI;
        angle.current += (rest - angle.current) * Math.min(1, dt * 8);
        if (Math.abs(rest - angle.current) < 0.002) {
          angle.current = rest;
          paint();
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

  // A new disc starts still, front up.
  const pick = (id: DiscId) => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    twirl.current = false;
    setTwirling(false);
    angle.current = 0;
    speed.current = 0;
    onDisc(id);
  };
  useEffect(() => {
    paint();
  }, [disc, paint]);

  const toggleTwirl = () => {
    const on = !twirl.current;
    twirl.current = on;
    setTwirling(on);
    setStatus(on ? 'Twirling.' : 'Letting it slow down.');
    run();
  };

  const flip = () => {
    twirl.current = false;
    setTwirling(false);
    speed.current = 0;
    angle.current = Math.round(angle.current / Math.PI) * Math.PI + Math.PI;
    if (discEl.current && !reduced) discEl.current.style.transition = 'transform 0.6s cubic-bezier(0.3, 0.7, 0.3, 1)';
    paint();
    window.setTimeout(() => {
      if (discEl.current) discEl.current.style.transition = '';
    }, 650);
    setStatus(faceAt(angle.current) === 'front' ? `Front: ${d.front}.` : `Back: ${d.back}.`);
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
    speed.current = Math.min(THAUMA_TOP, Math.abs(g.v));
  };
  const up = () => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    speed.current = Math.min(THAUMA_TOP, Math.abs(g.v));
    run();
  };

  const stepSide = (by: number) => {
    const i = (SIDES.indexOf(side) + by + SIDES.length) % SIDES.length;
    setSide(SIDES[i]);
    setStatus(sideLabel(SIDES[i], d));
  };

  return (
    <div className="vt-thauma">
      <div className="vto-toy-area" ref={toy} style={{ '--twist': '0' } as CSSProperties}>
        {!sidesView ? (
          <div className="vt-toy" data-merged={merged || undefined}>
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
              aria-label={`The ${d.name.toLowerCase()} disc. ${merged ? `Twirling: ${d.together}.` : `${face === 'front' ? 'Front' : 'Back'} side showing.`}`}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
            >
              <div className="vt-disc" ref={discEl}>
                <div className="vt-face vt-face-front">
                  <DiscFace>
                    <DiscArt id={disc} side="front" />
                  </DiscFace>
                </div>
                <div className="vt-face vt-face-back">
                  <DiscFace>
                    <DiscArt id={disc} side="back" />
                  </DiscFace>
                </div>
              </div>
              <div className="vt-blend" ref={blendEl} style={{ opacity: 0 }}>
                <DiscFace>
                  <DiscArt id={disc} side="front" />
                  <DiscArt id={disc} side="back" />
                </DiscFace>
              </div>
            </div>
          </div>
        ) : (
          <ol className="vt-sides" aria-label={`The ${d.name.toLowerCase()} disc, side by side`}>
            {SIDES.map((s, i) => (
              <li key={s} className="vt-side" aria-current={side === s ? 'step' : undefined}>
                <button type="button" className="vt-side-button" onClick={() => { setSide(s); setStatus(sideLabel(s, d)); }} aria-label={sideLabel(s, d)}>
                  <DiscFace>
                    {s !== 'back' && <DiscArt id={disc} side="front" />}
                    {s !== 'front' && <DiscArt id={disc} side="back" />}
                  </DiscFace>
                </button>
                <span className="vt-side-name" aria-hidden="true">{s === 'front' ? 'Front' : s === 'back' ? 'Back' : 'Together'}</span>
                {i < 2 && <span className="vt-side-op" aria-hidden="true">{i === 0 ? '+' : '='}</span>}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="vto-controls">
        <p className="vto-intro">{intro}</p>
        <div className="vto-picker" role="group" aria-label="Choose a disc">
          {DISCS.map((x) => (
            <button key={x.id} type="button" className="vto-pick" aria-pressed={disc === x.id} onClick={() => pick(x.id)}>
              <span className="vto-pick-art" aria-hidden="true">
                <DiscFace small>
                  <DiscArt id={x.id} side="front" />
                  <DiscArt id={x.id} side="back" />
                </DiscFace>
              </span>
              <span className="vto-pick-name">{x.name}</span>
            </button>
          ))}
        </div>
        <div className="vto-actions">
          {!sidesView ? (
            <>
              {!reduced && (
                <button type="button" className="vto-button vto-button-primary" aria-pressed={twirling} onClick={toggleTwirl}>
                  {twirling ? 'Let it slow' : 'Twirl'}
                </button>
              )}
              <button type="button" className="vto-button" onClick={flip}>
                Flip the disc
              </button>
            </>
          ) : (
            <>
              <button type="button" className="vto-button" onClick={() => stepSide(-1)} aria-label="Previous side">
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" className="vto-button vto-button-primary" onClick={() => stepSide(1)} aria-label="Next side">
                Next <span aria-hidden="true">→</span>
              </button>
            </>
          )}
          <button type="button" className="vto-button vto-button-quiet" aria-pressed={sidesView} onClick={() => setSidesChoice(!sidesView)}>
            {sidesView ? 'Back to the toy' : 'See both sides'}
          </button>
        </div>
        <p className="vto-caption">{d.caption}</p>
      </div>
      <p className="vto-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function sideLabel(s: Side, d: (typeof DISCS)[number]) {
  return s === 'front' ? `Front: ${d.front}.` : s === 'back' ? `Back: ${d.back}.` : `Together: ${d.together}.`;
}

/** A card disc: cream card in a gold rim, with the holes for its strings. */
export function DiscFace({ children, small = false }: { children: ReactNode; small?: boolean }) {
  const clip = `vt-clip-${useId().replace(/:/g, '')}`;
  return (
    <svg className="vt-face-art" viewBox="-100 -100 200 200">
      <circle r="98" fill="#f4eee3" stroke="#c9a24a" strokeWidth={small ? 5 : 3} />
      <circle r="92" fill="none" stroke="#d9b7b8" strokeWidth="1.5" />
      <clipPath id={clip}>
        <circle r="90" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>{children}</g>
      {!small && (
        <>
          <circle cx="-94" cy="0" r="2.6" fill="#8a7a62" />
          <circle cx="94" cy="0" r="2.6" fill="#8a7a62" />
        </>
      )}
    </svg>
  );
}
