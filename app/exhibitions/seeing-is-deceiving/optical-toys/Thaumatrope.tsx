'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { DISC, POSTER, TOY_NOTES } from './toysText';
import { approach, faceAt, thaumaBlend, thaumaSeen, TAU, THAUMA_LADDER, THAUMA_TOP } from './spin';
import { useLadder } from './useLadder';
import SpeedLadder from './SpeedLadder';

/*
 * The thaumatrope: a card disc on two strings, the bird on one side and the
 * cage on the other. Twirl it and it starts slowly, so each side is seen in
 * turn, then climbs, rung by rung, until the sides blend and the bird is in
 * the cage; faster and slower step by hand, and a flick up or down across
 * the disc spins it too. Or look at its sides one by one: under reduced
 * motion that is all it shows.
 *
 * Its two faces are the owner's illustrations (made with Leonardo.Ai,
 * not credited on the page, at the owner's request): card discs the same size, so laid one over the
 * other the bird sits inside the cage.
 */

const FACES = {
  front: '/exhibitions/seeing-is-deceiving/optical-toys/thaum-bird.webp',
  back: '/exhibitions/seeing-is-deceiving/optical-toys/thaum-cage.webp',
};

const RATE = 1.4; // turns a second, every second, between rungs
const SPIN_DOWN = 1.1; // as the strings unwind
const SIDES = ['front', 'back', 'together'] as const;
type Side = (typeof SIDES)[number];

const SEEN_LABEL = {
  sides: 'Slow enough to see each side go by',
  blending: 'The two sides begin to blend',
  merged: 'One picture: the bird in its cage',
};

export default function Thaumatrope({ reduced, intro, footer }: { reduced: boolean; intro: string; footer?: ReactNode }) {
  // Side by side under reduced motion, until the visitor chooses.
  const [sidesChoice, setSidesChoice] = useState<boolean | null>(null);
  const sidesView = sidesChoice ?? reduced;
  const [side, setSide] = useState<Side>('front');
  const [merged, setMerged] = useState(false);
  const [seen, setSeen] = useState<keyof typeof SEEN_LABEL>('sides');
  const [face, setFace] = useState<'front' | 'back'>('front');
  const [status, setStatus] = useState('');

  const toy = useRef<HTMLDivElement>(null);
  const discEl = useRef<HTMLDivElement>(null);
  const blendEl = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const speed = useRef(0);
  const target = useRef(0);
  const drag = useRef<{ y: number; t: number; v: number } | null>(null);
  const raf = useRef(0);
  // The frame loop calls itself through a ref, so it always runs the latest tick.
  const loop = useRef<FrameRequestCallback | null>(null);
  const last = useRef(0);
  const mergedRef = useRef(false);
  const seenRef = useRef<keyof typeof SEEN_LABEL>('sides');
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
    const s = thaumaSeen(speed.current);
    if (s !== seenRef.current) {
      seenRef.current = s;
      setSeen(s);
    }
    const isMerged = blend >= 1;
    if (isMerged !== mergedRef.current) {
      mergedRef.current = isMerged;
      setMerged(isMerged);
      if (isMerged) setStatus(`${SEEN_LABEL.merged}.`);
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000 || 0);
      last.current = now;
      if (!drag.current) {
        speed.current = approach(speed.current, target.current, dt, target.current > 0 ? RATE : SPIN_DOWN);
        angle.current += speed.current * TAU * dt;
      }
      // Coming to rest, it settles flat, on whichever side it was nearest.
      if (target.current === 0 && !drag.current && speed.current === 0) {
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
  useEffect(() => {
    paint();
  }, [paint]);

  const onRung = useCallback(
    (rps: number, rung: number) => {
      target.current = rps;
      setStatus(rung < 0 ? 'Letting it slow down.' : `Speed ${rung + 1} of ${THAUMA_LADDER.length}: ${SEEN_LABEL[thaumaSeen(rps)].toLowerCase()}.`);
      run();
    },
    [run],
  );
  const ladder = useLadder(THAUMA_LADDER, onRung);
  const twirling = ladder.rung >= 0;

  const flip = () => {
    ladder.stop();
    target.current = 0;
    speed.current = 0;
    angle.current = Math.round(angle.current / Math.PI) * Math.PI + Math.PI;
    if (discEl.current && !reduced) discEl.current.style.transition = 'transform 0.6s cubic-bezier(0.3, 0.7, 0.3, 1)';
    paint();
    window.setTimeout(() => {
      if (discEl.current) discEl.current.style.transition = '';
    }, 650);
    setStatus(faceAt(angle.current) === 'front' ? `Front: ${DISC.front}.` : `Back: ${DISC.back}.`);
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
    setStatus(sideLabel(SIDES[i]));
  };

  // The poster's line for what is on screen: the toy itself, then what the brain makes of it.
  const line = sidesView ? (side === 'together' ? POSTER.discovered : POSTER.thaumatrope) : seen === 'merged' ? POSTER.discovered : POSTER.thaumatrope;

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
              aria-label={`The thaumatrope’s disc. ${merged ? `Twirling: ${DISC.together}.` : `${face === 'front' ? `Front: ${DISC.front}` : `Back: ${DISC.back}`}.`}`}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
            >
              <div className="vt-disc" ref={discEl}>
                <div className="vt-face vt-face-front">
                  <DiscFace sides={['front']} />
                </div>
                <div className="vt-face vt-face-back">
                  <DiscFace sides={['back']} />
                </div>
              </div>
              <div className="vt-blend" ref={blendEl} style={{ opacity: 0 }}>
                <DiscFace sides={['front', 'back']} />
              </div>
            </div>
          </div>
        ) : (
          <ol className="vt-sides" aria-label="The disc, side by side">
            {SIDES.map((s, i) => (
              <li key={s} className="vt-side" aria-current={side === s ? 'step' : undefined}>
                <button type="button" className="vt-side-button" onClick={() => { setSide(s); setStatus(sideLabel(s)); }} aria-label={sideLabel(s)}>
                  <DiscFace sides={s === 'together' ? ['front', 'back'] : [s]} />
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
        <div className="vto-actions">
          {!sidesView ? (
            <>
              {!reduced && (
                <button type="button" className="vto-button vto-button-primary" aria-pressed={twirling} onClick={twirling ? ladder.stop : ladder.start}>
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
        {!reduced && !sidesView && (
          <SpeedLadder
            ladder={THAUMA_LADDER}
            rung={ladder.rung}
            climbing={ladder.climbing}
            seen={twirling ? SEEN_LABEL[thaumaSeen(THAUMA_LADDER[ladder.rung].rps)] : 'Still'}
            onFaster={twirling ? ladder.faster : ladder.start}
            onSlower={ladder.slower}
            onClimb={ladder.climb}
          />
        )}
        <p className="vto-caption" aria-live="polite">{line}</p>
        <FactNote fact={TOY_NOTES.thaumatrope} className="vto-fact" />
        {footer}
      </div>
      <p className="vto-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function sideLabel(s: Side) {
  return s === 'front' ? `Front: ${DISC.front}.` : s === 'back' ? `Back: ${DISC.back}.` : `Together: ${DISC.together}.`;
}

/**
 * A card disc, one face or both: laid together, the cage is printed over the
 * bird (multiplied, as one picture seen through the other), so the bird sits
 * inside the cage, behind its bars.
 */
export function DiscFace({ sides }: { sides: ('front' | 'back')[] }) {
  return (
    <span className="vt-face-art">
      {sides.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={s} src={FACES[s]} alt="" draggable={false} className={i ? 'vt-face-over' : undefined} />
      ))}
    </span>
  );
}
