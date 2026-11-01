'use client';

import { useEffect, useState } from 'react';
import { observed } from './results';
import { Choices, Work, type BenchProps } from './ui';

// ───────── 14. The waterfall effect (motion aftereffect) ─────────

const STARE = 30;

function spiralPath() {
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const th = (i / 240) * Math.PI * 7;
    const r = 6 + th * 9.5;
    pts.push(`${i ? 'L' : 'M'}${(r * Math.cos(th)).toFixed(1)} ${(r * Math.sin(th)).toFixed(1)}`);
  }
  return pts.join(' ');
}

const SPIRAL = spiralPath();

export function Waterfall({ broken, record }: BenchProps) {
  const [t, setT] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const path = SPIRAL;
  const running = t !== null && t < STARE;
  const still = t !== null && t >= STARE;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setT((x) => (x === null ? null : x + 1)), 1000);
    return () => window.clearTimeout(id);
  }, [running, t]);

  // Break it: the spiral turns one way, then the other, every three seconds.
  const reverse = broken && t !== null && Math.floor(t / 3) % 2 === 1;
  const ring = 2 * Math.PI * 236;
  const done = t === null ? 0 : Math.min(1, t / STARE);

  return (
    <Work
      label="The waterfall effect"
      figure={
        <svg viewBox="-250 -250 500 500" className="pl-svg pl-square" role="img" aria-label={still ? 'The same spiral, standing still.' : 'A black spiral on white, which turns while you stare at its middle.'}>
          <rect x="-250" y="-250" width="500" height="500" fill="#fff" />
          <g className={running ? 'pl-spin' : undefined} style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
            <path d={path} fill="none" stroke="#111" strokeWidth="16" strokeLinecap="round" />
            <path d={path} transform="rotate(180)" fill="none" stroke="#111" strokeWidth="16" strokeLinecap="round" />
          </g>
          <circle r="5" fill="#e0703a" />
          {t !== null && <circle r="236" fill="none" stroke="#e0703a" strokeWidth="10" strokeDasharray={ring} strokeDashoffset={ring * (1 - done)} transform="rotate(-90)" />}
        </svg>
      }
      task={
        t === null ? (
          <button type="button" className="pl-btn pl-btn-primary" onClick={() => setT(0)}>
            Start: stare at the middle for 30 seconds
          </button>
        ) : running ? (
          <p className="pl-count">
            Keep staring at the orange dot… <strong>{STARE - t}</strong>
          </p>
        ) : (
          <>
            <Choices
              question="Now the spiral is still. Does it seem to move?"
              value={answer as 'grow' | 'shrink' | 'no' | null}
              onChoose={(a) => {
                setAnswer(a);
                if (!broken) record(observed(a === 'no' ? 'The still spiral stayed still for you.' : `The still spiral seemed to ${a}. Nothing was moving.`, a === 'no' ? 0 : 1));
              }}
              options={[
                { id: 'grow', label: 'It swells' },
                { id: 'shrink', label: 'It shrinks' },
                { id: 'no', label: 'It stays still' },
              ]}
            />
            <button
              type="button"
              className="pl-btn"
              onClick={() => {
                setAnswer(null);
                setT(0);
              }}
            >
              Stare again
            </button>
          </>
        )
      }
    />
  );
}

// ───────── 15. Rotating snakes, drawn for the museum after Kitaoka ─────────

const ORDER = ['#000', '#1f3c9c', '#fff', '#e6d23c'];
const PLAIN = ['#000', '#7f7f7f', '#fff', '#7f7f7f'];

function SnakeDisc({ cx, cy, flip, colours }: { cx: number; cy: number; flip: boolean; colours: string[] }) {
  const bands: { d: string; fill: string }[] = [];
  const P = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  for (let ring = 0; ring < 4; ring++) {
    const r0 = 22 + ring * 26;
    const r1 = r0 + 24;
    const n = 8 + ring * 4;
    for (let s = 0; s < n; s++) {
      for (let b = 0; b < 4; b++) {
        const k = flip !== (ring % 2 === 1) ? 3 - b : b;
        const a0 = ((s + b / 4 + (ring % 2) * 0.5) / n) * Math.PI * 2;
        const a1 = ((s + (b + 1) / 4 + (ring % 2) * 0.5) / n) * Math.PI * 2;
        bands.push({ d: `M${P(r0, a0)} L${P(r1, a0)} A${r1} ${r1} 0 0 1 ${P(r1, a1)} L${P(r0, a1)} A${r0} ${r0} 0 0 0 ${P(r0, a0)} Z`, fill: colours[k] });
      }
    }
  }
  return (
    <g>
      {bands.map((b, i) => (
        <path key={i} d={b.d} fill={b.fill} />
      ))}
    </g>
  );
}

export function Snakes({ broken, record }: BenchProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const colours = broken ? PLAIN : ORDER;
  return (
    <Work
      label="Rotating snakes"
      figure={
        <svg viewBox="0 0 600 600" className="pl-svg pl-square" role="img" aria-label="Four circles made of rings of black, dark blue, white and yellow stripes, on gray. Nothing in the picture moves.">
          <rect width="600" height="600" fill="#9a9a9a" />
          <SnakeDisc cx={150} cy={150} flip={false} colours={colours} />
          <SnakeDisc cx={450} cy={150} flip colours={colours} />
          <SnakeDisc cx={150} cy={450} flip colours={colours} />
          <SnakeDisc cx={450} cy={450} flip={false} colours={colours} />
        </svg>
      }
      task={
        <>
          {!broken && (
            <Choices
              question="Let your eyes wander. Do the circles seem to turn?"
              value={answer as 'yes' | 'little' | 'no' | null}
              onChoose={(a) => {
                setAnswer(a);
                record(observed(a === 'no' ? 'The circles stayed still for you. Some people see little or no motion here.' : 'The circles seemed to turn. The picture is perfectly still.', a === 'yes' ? 1 : a === 'little' ? 0.5 : 0));
              }}
              options={[
                { id: 'yes', label: 'Yes, they turn' },
                { id: 'little', label: 'A little' },
                { id: 'no', label: 'No' },
              ]}
            />
          )}
          <p className="pl-say">{broken ? 'The two middle shades are now the same gray.' : 'Now look straight at one circle and hold your eyes still: it stops.'}</p>
          <p className="pl-credit">Circles drawn for the museum after Akiyoshi Kitaoka’s Rotating Snakes (2003).</p>
        </>
      }
    />
  );
}
