'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { FEAR_LAB_COPY as C } from '../fearLab';
import { pulseFromTaps } from './lab';

/*
 * The mystery box (poster 1's own experiment): press and hold to reach into
 * a box you can't see into. As the hand goes in, the heart monitor quickens
 * and the imagination fills the dark with the poster's three horrors; at the
 * bottom, the box opens on what is really there. Letting go pulls the hand
 * back out.
 *
 * Beside it, a pulse you take yourself, by tapping along with it, before and
 * after: it stays on this screen, and nothing is kept.
 */

/** How long to hold, in ms, to reach the bottom of the box. */
export const REACH_MS = 5000;
/** The poster's horrors, each appearing a little further in. */
export const THOUGHTS = [
  { at: 0.22, text: 'Poisonous spiders?' },
  { at: 0.48, text: 'Slimy worms?' },
  { at: 0.74, text: 'Nibbling rodents?' },
];

type Phase = 'ready' | 'reaching' | 'open';

/** The pinecone, scale by scale. */
function Pinecone() {
  const scales: { x: number; y: number; w: number }[] = [];
  const rows = 8;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const width = 30 + Math.sin(t * Math.PI * 0.9 + 0.2) * 34;
    const n = r % 2 ? 4 : 5;
    for (let k = 0; k < n; k++) {
      const x = (k - (n - 1) / 2) * (width / (n - 0.6));
      scales.push({ x: Math.round(x * 10) / 10, y: r * 13, w: Math.round((width / n) * 1.25 * 10) / 10 });
    }
  }
  return (
    <g className="fl-box-pinecone">
      <ellipse cx="0" cy="104" rx="56" ry="9" fill="rgba(0,0,0,0.35)" />
      <path d="M -4 -14 Q 0 -26 6 -30" stroke="#5b3a1e" strokeWidth="4" fill="none" strokeLinecap="round" />
      {scales.map((s, i) => (
        <path
          key={i}
          d={`M ${s.x - s.w / 2} ${s.y} Q ${s.x} ${s.y + 22} ${s.x + s.w / 2} ${s.y} Q ${s.x} ${s.y + 6} ${s.x - s.w / 2} ${s.y} Z`}
          fill={i % 3 === 0 ? '#8a5a2f' : i % 3 === 1 ? '#a06a38' : '#76491f'}
          stroke="#3e2410"
          strokeWidth="1.4"
        />
      ))}
    </g>
  );
}

export default function MysteryBox({
  motion,
  onFright,
  onReveal,
}: {
  motion: boolean;
  /** How frightened the scene is, 0–1, for the heart monitor. */
  onFright: (f: number) => void;
  /** The box opened (for the startle-free "relief" beat). */
  onReveal?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [reach, setReach] = useState(0);
  const [status, setStatus] = useState('');
  const held = useRef(false);
  const reachRef = useRef(0);
  const shown = useRef(0);
  const frame = useRef(0);

  // The hand goes in while held, and comes back out when let go.
  useEffect(() => {
    if (phase !== 'reaching') return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const r = Math.max(0, Math.min(1, reachRef.current + (held.current ? dt / REACH_MS : -dt / 900)));
      reachRef.current = r;
      setReach(r);
      onFright(0.1 + r * 0.9);
      const due = THOUGHTS.filter((t) => r >= t.at).length;
      if (due > shown.current) {
        shown.current = due;
        setStatus(THOUGHTS[due - 1].text);
      }
      if (r >= 1) {
        held.current = false;
        setPhase('open');
        setStatus('The box opens. It’s really just a pinecone.');
        onReveal?.();
        return;
      }
      if (r === 0 && !held.current) {
        setPhase('ready');
        shown.current = 0;
        onFright(0);
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [phase, onFright, onReveal]);

  // Once open, the heart settles.
  useEffect(() => {
    if (phase !== 'open') return;
    onFright(0.35);
    const t = setTimeout(() => onFright(0), 1800);
    return () => clearTimeout(t);
  }, [phase, onFright]);

  const grab = () => {
    if (phase === 'open') return;
    held.current = true;
    if (phase === 'ready') {
      setStatus('Reaching in…');
      setPhase('reaching');
    }
  };
  const letGo = () => {
    if (!held.current) return;
    held.current = false;
    if (reachRef.current < 1 && reachRef.current > 0.02) setStatus('You pulled your hand back out.');
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (!e.repeat) grab();
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    letGo();
  };

  const again = () => {
    reachRef.current = 0;
    shown.current = 0;
    setReach(0);
    setPhase('ready');
    setStatus('A new box.');
    onFright(0);
  };

  const open = phase === 'open';
  const thoughts = open ? 0 : THOUGHTS.filter((t) => reach >= t.at).length;
  const handDrop = motion ? (open ? 0 : reach) : 0;

  return (
    <div className="fl-box" data-phase={phase} data-motion={motion ? 'on' : 'off'}>
      <div className="fl-box-scene">
        <svg viewBox="-70 0 740 600" role="img" aria-label={open ? 'The box stands open: inside is a pinecone.' : 'A closed box with a question mark on it and a round hole in its top. A clawed hand hovers over the hole.'}>
          <defs>
            <radialGradient id="fl-spot" cx="50%" cy="0%" r="90%">
              <stop offset="0" stopColor="#fbf6ec" stopOpacity="0.22" />
              <stop offset="0.5" stopColor="#f2b33d" stopOpacity="0.06" />
              <stop offset="1" stopColor="#f2b33d" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fl-inside" cx="50%" cy="80%" r="70%">
              <stop offset="0" stopColor="#f2b33d" stopOpacity="0.55" />
              <stop offset="1" stopColor="#0b1322" stopOpacity="1" />
            </radialGradient>
            <clipPath id="fl-hole-clip">
              <rect x="-100" y="-100" width="800" height="397" />
            </clipPath>
            <linearGradient id="fl-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#25406a" />
              <stop offset="1" stopColor="#152741" />
            </linearGradient>
          </defs>

          {/* The light from above, and the floor. */}
          <path d="M 220 0 L 380 0 L 560 600 L 40 600 Z" fill="url(#fl-spot)" />
          <ellipse cx="300" cy="548" rx="210" ry="22" fill="rgba(0,0,0,0.45)" />

          {/* The inside, seen when the front falls open. */}
          <rect x="152" y="330" width="296" height="210" fill="url(#fl-inside)" />
          <g transform="translate(300 380) scale(1.35)" className="fl-box-inside">
            <Pinecone />
          </g>

          {/* The top, with its hole and the black cloth over it. */}
          <path d="M 190 265 L 410 265 L 450 330 L 150 330 Z" fill="#2c4a78" stroke="#0b1322" strokeWidth="2" />
          <ellipse cx="300" cy="297" rx="62" ry="20" fill="#03060c" />
          <g stroke="#1c2b45" strokeWidth="2">
            {[-50, -30, -10, 10, 30, 50].map((x) => (
              <line key={x} x1={300 + x * 0.25} y1="297" x2={300 + x} y2={297 + (Math.abs(x) > 40 ? 6 : 14) * (x < 0 ? -0.4 : 0.4)} />
            ))}
          </g>

          {/* The hand, sinking into the hole. */}
          <g clipPath="url(#fl-hole-clip)">
            <g className="fl-box-hand" style={{ transform: `translateY(${handDrop * 190}px)` }}>
              <image href="/exhibitions/fear-lab/hand.png" x="212" y="20" width="160" height="228" transform="scale(1 -1) translate(0 -268)" />
            </g>
          </g>

          {/* The front: a "?" stenciled on it, falling open at the end. */}
          <g className="fl-box-front">
            <rect x="150" y="330" width="300" height="212" fill="url(#fl-front)" stroke="#0b1322" strokeWidth="2" />
            {[372, 414, 456, 498].map((y) => (
              <line key={y} x1="152" y1={y} x2="448" y2={y} stroke="#0f1d33" strokeWidth="2" />
            ))}
            <text x="300" y="490" textAnchor="middle" className="fl-box-q">?</text>
          </g>

          {/* What the imagination puts in the dark. */}
          <g className="fl-box-thoughts" aria-hidden="true">
            <g className={thoughts >= 1 ? 'is-on' : ''}>
              <line x1="60" y1="0" x2="60" y2="128" stroke="rgba(251,246,236,0.5)" strokeWidth="1.5" />
              <image href="/exhibitions/fear-lab/spider.png" x="8" y="110" width="104" height="104" />
              <text x="50" y="250" textAnchor="middle">Poisonous spiders?</text>
            </g>
            <g className={thoughts >= 2 ? 'is-on' : ''}>
              <path d="M 500 130 q 14 -18 28 0 t 28 0 t 28 0 t 28 0" fill="none" stroke="#f2b33d" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
              <text x="556" y="178" textAnchor="middle">Slimy worms?</text>
            </g>
            <g className={thoughts >= 3 ? 'is-on' : ''}>
              {/* A small creature, as illustration */}
              <g transform="translate(560 400)" fill="#f2b33d">
                <path d="M -26 6 q -22 10 -40 -8" fill="none" stroke="#f2b33d" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="0" cy="0" rx="28" ry="16" />
                <circle cx="24" cy="-6" r="12" />
                <circle cx="19" cy="-17" r="7" />
                <circle cx="29" cy="-8" r="2" fill="#0e1a2c" />
              </g>
              <text x="556" y="450" textAnchor="middle">Nibbling rodents?</text>
            </g>
          </g>
        </svg>
      </div>

      <div className="fl-lab-panel-body">
        {open ? (
          <>
            <h2 className="fl-lab-heading">Just a pinecone</h2>
            <p className="fl-lab-poster">{C.pinecone}</p>
            <p className="fl-lab-poster">{C.mysteryBox}</p>
            <button type="button" className="fl-lab-button" onClick={again}>Try another box</button>
          </>
        ) : (
          <>
            <h2 className="fl-lab-heading">The Mystery Box</h2>
            <p className="fl-lab-poster">{C.box}</p>
            <button
              type="button"
              className="fl-lab-hold"
              style={{ ['--reach' as string]: String(reach) }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                grab();
              }}
              onPointerUp={letGo}
              onPointerCancel={letGo}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              onBlur={letGo}
              onContextMenu={(e) => e.preventDefault()}
            >
              <span className="fl-lab-hold-ring" aria-hidden="true" />
              <span className="fl-lab-hold-text">Hold to reach in</span>
            </button>
            <p className="fl-lab-note">Press and hold (or hold the Space bar). Let go to pull your hand back.</p>
          </>
        )}
        <p className="fl-lab-status" role="status">{status}</p>
        <PulseTap after={open} />
      </div>
    </div>
  );
}

/** Take your own pulse: tap along with it, before reaching in and after. */
function PulseTap({ after }: { after: boolean }) {
  const taps = useRef<number[]>([]);
  const [before, setBefore] = useState<number | null>(null);
  const [later, setLater] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [beat, setBeat] = useState(0);

  const mode = useRef(after);

  const tap = () => {
    const now = performance.now();
    // A new run of taps for "after" once the box opens.
    if (mode.current !== after) {
      mode.current = after;
      taps.current = [];
    }
    taps.current = [...taps.current.filter((t) => now - t < 15000), now];
    const run = taps.current;
    let n = 1;
    for (let i = run.length - 1; i > 0 && run[i] - run[i - 1] < 2500; i--) n++;
    setCount(n);
    setBeat((b) => b + 1);
    const bpm = pulseFromTaps(run);
    if (bpm !== null) (after ? setLater : setBefore)(bpm);
  };

  return (
    <details className="fl-pulse">
      <summary>Take your own pulse</summary>
      <p className="fl-lab-note">
        Find your pulse on your wrist or neck, then tap the heart with each beat. {after ? 'Now take it again.' : 'Take it before you reach in.'}
      </p>
      <div className="fl-pulse-row">
        <button type="button" className="fl-pulse-heart" onClick={tap} key={beat} aria-label="Tap with each beat">
          <svg viewBox="0 0 32 30" aria-hidden="true">
            <path d="M16 28 C 6 20 1 14 1 8.5 C 1 4.4 4.3 1 8.4 1 C 11.6 1 14.3 3 16 5.8 C 17.7 3 20.4 1 23.6 1 C 27.7 1 31 4.4 31 8.5 C 31 14 26 20 16 28 Z" />
          </svg>
        </button>
        <dl className="fl-pulse-readings">
          <div>
            <dt>Before</dt>
            <dd>{before ?? '—'}</dd>
          </div>
          <div>
            <dt>After</dt>
            <dd>{later ?? '—'}</dd>
          </div>
        </dl>
      </div>
      <p className="fl-lab-note" aria-live="polite">
        {count > 0 && count < 5 ? `Keep tapping… ${5 - count} more.` : (after ? later : before) !== null ? 'Beats a minute, from your taps.' : ''}
      </p>
    </details>
  );
}
