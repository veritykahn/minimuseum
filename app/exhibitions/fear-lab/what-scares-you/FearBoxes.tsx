'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { FEAR_LAB_COPY as C } from '../fearLab';
import { BOX_COUNT, fillBoxes, type Content, type Credit } from './boxes';
import { pulseFromTaps } from './lab';
import type { LabSound } from './sound';

/*
 * The fear boxes (poster 1's mystery box, five times over): a row of closed
 * boxes on a shelf in the dark. Pick one, and it creaks slowly open while
 * the heart monitor quickens and the music tightens; then something jumps
 * out at you: a cockroach, a tarantula, a bat, a snake, a rat, a centipede
 * (boxes.ts), or the poster's pinecone, or nothing at all, just the dark.
 * Each creature comes with one checked creepy fact and its photograph's
 * credit.
 *
 * A warning comes first, and the boxes wait until the visitor says they are
 * ready. Nothing flashes and nothing is gory. With motion off (or the
 * visitor's reduced-motion setting), nothing jumps or shakes: the creature
 * simply fades in.
 *
 * Beside it, a pulse you take yourself, by tapping along with it, before and
 * after: it stays on this screen, and nothing is kept.
 */

/** How long a box takes to creak open, in ms. */
export const BUILD_MS = 2600;
/** How long the jump lasts, in ms, before the heart starts to settle. */
export const JUMP_MS = 1100;

type Phase = 'warn' | 'pick' | 'build' | 'reveal';

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
    <svg viewBox="-70 -40 140 160" className="fl-fb-pinecone" role="img" aria-label="A pinecone">
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
    </svg>
  );
}

/** A box on the shelf: its lid, its front with a number, and the dark inside. */
function BoxArt({ n, open }: { n: number; open: boolean }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="fl-fb-art">
      <ellipse cx="60" cy="114" rx="52" ry="5" fill="rgba(0,0,0,0.45)" />
      {/* The dark inside, seen once the lid is up. */}
      <path d="M 14 44 L 106 44 L 98 54 L 22 54 Z" fill="#03060c" />
      <rect x="14" y="50" width="92" height="62" fill="url(#fl-fb-front)" stroke="#0b1322" strokeWidth="2" />
      {[66, 82, 98].map((y) => (
        <line key={y} x1="16" y1={y} x2="104" y2={y} stroke="#0f1d33" strokeWidth="1.5" />
      ))}
      <text x="60" y="98" textAnchor="middle" className="fl-fb-q">{open ? '' : '?'}</text>
      <text x="96" y="106" textAnchor="end" className="fl-fb-n">{n}</text>
      <g className="fl-fb-lid">
        <path d="M 8 38 L 112 38 L 112 50 L 8 50 Z" fill="#2c4a78" stroke="#0b1322" strokeWidth="2" />
        <rect x="52" y="32" width="16" height="6" rx="2" fill="#f2b33d" opacity="0.8" />
      </g>
    </svg>
  );
}

/** A photograph's credit: its title, author and licence, each linked. */
function CreditLine({ credit }: { credit: Credit }) {
  return (
    <p className="fl-lab-credit">
      Photo, cut out: <a href={credit.href} target="_blank" rel="noopener noreferrer">{credit.title}</a>, {credit.author},{' '}
      {credit.licenceHref ? <a href={credit.licenceHref} target="_blank" rel="noopener noreferrer">{credit.licence}</a> : credit.licence}
    </p>
  );
}

const said = (c: Content) => (c.kind === 'creature' ? c.name.replace('!', '') : c.kind === 'pinecone' ? 'a pinecone' : 'nothing');

export default function FearBoxes({
  motion,
  sound,
  onFright,
}: {
  motion: boolean;
  sound: () => LabSound | null;
  /** How frightened the scene is, 0–1, for the heart monitor and the music. */
  onFright: (f: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>('warn');
  const [boxes, setBoxes] = useState<Content[]>(() => fillBoxes());
  const [opened, setOpened] = useState<boolean[]>(() => Array(BOX_COUNT).fill(false));
  const [current, setCurrent] = useState(-1);
  const [status, setStatus] = useState('');
  const [after, setAfter] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearAll, []);

  const content = current >= 0 ? boxes[current] : null;

  const pick = (i: number) => {
    if (phase !== 'pick' || opened[i]) return;
    clearAll();
    setCurrent(i);
    setPhase('build');
    setStatus(`Box ${i + 1} creaks open…`);
    sound()?.creak(BUILD_MS / 1000);
    // The dread builds as the lid lifts.
    for (let k = 0; k <= 5; k++) later((BUILD_MS * k) / 5, () => onFright(0.3 + k * 0.12));
    later(BUILD_MS, () => reveal(i));
  };

  const reveal = (i: number) => {
    const c = boxes[i];
    setOpened((o) => o.map((v, k) => v || k === i));
    setPhase('reveal');
    setAfter(true);
    if (c.kind === 'creature') {
      sound()?.jump();
      sound()?.creature(c.id);
      onFright(1);
      setStatus(`${c.name} It was in box ${i + 1}.`);
      later(JUMP_MS + 800, () => onFright(0.45));
    } else if (c.kind === 'nothing') {
      sound()?.creak(0.7);
      onFright(0.5);
      setStatus('Nothing. Just the dark.');
      later(1600, () => onFright(0.2));
    } else {
      sound()?.beat(0.2);
      onFright(0.35);
      setStatus('It’s really just a pinecone.');
      later(1800, () => onFright(0.1));
    }
  };

  const close = () => {
    clearAll();
    setPhase('pick');
    setCurrent(-1);
    onFright(0);
    const left = opened.filter((o) => !o).length;
    setStatus(left ? `${left} ${left === 1 ? 'box' : 'boxes'} still shut.` : 'Every box is open.');
  };

  const refill = () => {
    clearAll();
    setBoxes(fillBoxes());
    setOpened(Array(BOX_COUNT).fill(false));
    setCurrent(-1);
    setPhase('pick');
    onFright(0);
    setStatus('A new row of boxes.');
  };

  const allOpen = opened.every(Boolean);
  const showing = phase === 'reveal' && content;

  return (
    <div className="fl-box fl-fb" data-phase={phase} data-motion={motion ? 'on' : 'off'}>
      <div className="fl-box-scene fl-fb-scene">
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="fl-fb-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#25406a" />
              <stop offset="1" stopColor="#152741" />
            </linearGradient>
          </defs>
        </svg>
        <span className="fl-fb-spot" aria-hidden="true" />

        <div className="fl-fb-shelf" role="group" aria-label="Fear boxes">
          {boxes.map((c, i) => {
            const isOpen = opened[i] || (current === i && phase !== 'pick');
            return (
              <button
                key={i}
                type="button"
                className="fl-fb-box"
                data-open={isOpen ? 'true' : undefined}
                data-building={current === i && phase === 'build' ? 'true' : undefined}
                aria-disabled={phase !== 'pick' || opened[i] ? 'true' : undefined}
                aria-label={opened[i] ? `Box ${i + 1}, open: ${said(c)}` : `Box ${i + 1}`}
                onClick={() => pick(i)}
                style={{ ['--build' as string]: `${BUILD_MS}ms` } as CSSProperties}
              >
                <BoxArt n={i + 1} open={opened[i]} />
              </button>
            );
          })}
        </div>

        {/* What comes out of the box. */}
        {showing && (
          <div className="fl-fb-reveal" data-kind={content.kind} aria-hidden={content.kind === 'nothing' ? 'true' : undefined}>
            {content.kind === 'creature' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={current}
                className="fl-fb-creature"
                data-id={content.id}
                src={content.src}
                width={content.width}
                height={content.height}
                alt={content.alt}
              />
            )}
            {content.kind === 'pinecone' && <Pinecone />}
            {content.kind === 'nothing' && <span className="fl-fb-nothing">…nothing.</span>}
          </div>
        )}

        {phase !== 'reveal' && (
          <div className="fl-fb-veil" aria-hidden="true">
            <span>?</span>
          </div>
        )}
      </div>

      <div className="fl-lab-panel-body">
        {phase === 'warn' && (
          <>
            <h2 className="fl-lab-heading">The Fear Boxes</h2>
            <p className="fl-lab-poster">{C.box}</p>
            <div className="fl-lab-warning" role="note">
              <p><strong>Startle warning.</strong> Real animals jump out of some boxes: a cockroach, a spider, a bat, a snake, a rat, a centipede. Nothing flashes and nothing is gory.</p>
              <p>Turn the sound and the motion on or off with the buttons at the top.</p>
            </div>
            <button type="button" className="fl-lab-button" onClick={() => { setPhase('pick'); setStatus('Five boxes. Pick one.'); sound()?.tick(); }}>
              I’m ready
            </button>
          </>
        )}

        {(phase === 'pick' || phase === 'build') && (
          <>
            <h2 className="fl-lab-heading">Pick a box</h2>
            <p className="fl-lab-poster">{after ? C.mysteryBox : C.box}</p>
            <p className="fl-lab-note">Something might jump out. Or nothing at all.</p>
            {allOpen && phase === 'pick' && (
              <button type="button" className="fl-lab-button" onClick={refill}>New boxes</button>
            )}
          </>
        )}

        {phase === 'reveal' && content && (
          <>
            <p className="fl-lab-kicker">Box {current + 1}</p>
            {content.kind === 'creature' && (
              <>
                <h2 className="fl-lab-heading">{content.name}</h2>
                <FactNote fact={content.fact} className="fl-lab-fact" />
                <CreditLine credit={content.credit} />
              </>
            )}
            {content.kind === 'nothing' && (
              <>
                <h2 className="fl-lab-heading">Nothing</h2>
                <p className="fl-lab-poster">{C.unknown}</p>
              </>
            )}
            {content.kind === 'pinecone' && (
              <>
                <h2 className="fl-lab-heading">Just a pinecone</h2>
                <p className="fl-lab-poster">{C.pinecone}</p>
              </>
            )}
            <div className="fl-fb-actions">
              <button type="button" className="fl-lab-button" onClick={allOpen ? refill : close}>
                {allOpen ? 'New boxes' : 'Close the box'}
              </button>
            </div>
          </>
        )}

        <p className="fl-lab-status" role="status">{status}</p>
        <PulseTap after={after} />
      </div>
    </div>
  );
}

/** Take your own pulse: tap along with it, before opening a box and after. */
function PulseTap({ after }: { after: boolean }) {
  const taps = useRef<number[]>([]);
  const [before, setBefore] = useState<number | null>(null);
  const [later, setLater] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [beat, setBeat] = useState(0);

  const mode = useRef(after);

  const tap = () => {
    const now = performance.now();
    // A new run of taps for "after" once a box has opened.
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
        Find your pulse on your wrist or neck, then tap the heart with each beat. {after ? 'Now take it again.' : 'Take it before you open a box.'}
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
