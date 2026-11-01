'use client';

import { useEffect, useState } from 'react';
import { observed } from './results';
import { Choices, Picture, Work, type BenchProps } from './ui';

// ───────── The waterfall effect (motion aftereffect) ─────────

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

type Drift = 'grow' | 'shrink' | 'no';

export function Waterfall({ step, broken, phase, record }: BenchProps) {
  // The stare's seconds, and which step it was started on (a new step starts afresh).
  const [stare, setStare] = useState<{ t: number; on: typeof phase } | null>(null);
  const [answer, setAnswer] = useState<{ a: Drift; on: typeof phase } | null>(null);
  const t = stare && stare.on === phase ? stare.t : null;
  const chosen = answer && answer.on === phase ? answer.a : null;
  const running = t !== null && t < STARE;
  const still = t !== null && t >= STARE;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStare((x) => (x ? { ...x, t: x.t + 1 } : x)), 1000);
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
        <Picture
          id="waterfall"
          step={step}
          broken={broken}
          label="The waterfall effect"
          drawing={
            <svg viewBox="-250 -250 500 500" className="pl-svg" role="img" aria-label={still ? 'The same spiral, standing still.' : 'A black spiral on white, which turns while you stare at its middle.'}>
              <rect x="-250" y="-250" width="500" height="500" fill="#fff" />
              <g className={running ? 'pl-spin' : undefined} style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
                <path d={SPIRAL} fill="none" stroke="#111" strokeWidth="16" strokeLinecap="round" />
                <path d={SPIRAL} transform="rotate(180)" fill="none" stroke="#111" strokeWidth="16" strokeLinecap="round" />
              </g>
              <circle r="5" fill="#e0703a" />
              {t !== null && <circle r="236" fill="none" stroke="#e0703a" strokeWidth="10" strokeDasharray={ring} strokeDashoffset={ring * (1 - done)} transform="rotate(-90)" />}
            </svg>
          }
        />
      }
      task={
        !phase ? null : t === null ? (
          <button type="button" className="pl-btn pl-btn-primary" onClick={() => setStare({ t: 0, on: phase })}>
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
              value={chosen}
              onChoose={(a) => {
                setAnswer({ a, on: phase });
                record(phase, observed(a === 'no' ? 'The still spiral stayed still for you.' : `The still spiral seemed to ${a}. Nothing was moving.`, a === 'no' ? 0 : 1));
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
                setStare({ t: 0, on: phase });
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

// ───────── Rotating snakes, drawn for the museum after Kitaoka ─────────

/*
 * Kitaoka's motion needs one thing above all: the same uneven run of
 * shades, black → dark blue → white → yellow, repeated the same way round
 * every ring of a disc. (The old drawing reversed it on every other ring,
 * which cancels the motion.) Each disc is rings of these runs, the rings
 * shrinking towards the middle and each set half a step round from the one
 * outside it, as in his picture; neighbouring discs run opposite ways, so
 * they seem to turn opposite ways.
 */

/** The run of shades, in order round the disc: thin black, wide dark blue, thin white, wide yellow. */
export const SNAKE_ORDER = ['#000000', '#1f3c9c', '#ffffff', '#e6d23c'] as const;
/** Break it: the two middle shades made one gray, so the run has no direction. */
export const SNAKE_PLAIN = ['#000000', '#8a8a8a', '#ffffff', '#8a8a8a'] as const;
const SHARES = [0.14, 0.36, 0.14, 0.36];
const PER_RING = 18;

/** One disc's pieces, as four paths (one for each shade), every run going the same way round. */
export function snakeDisc(cx: number, cy: number, R: number, dir: 1 | -1) {
  const d: string[][] = [[], [], [], []];
  const P = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  // Each ring as deep as its pieces are long: square-ish pieces, shrinking towards the middle.
  const q = 1 / (1 + (2 * Math.PI) / PER_RING);
  const step = (2 * Math.PI) / PER_RING;
  let rings = 0;
  for (let ring = 0, r1 = R; r1 > R * 0.14; ring++, r1 *= q) {
    rings++;
    const r0 = r1 * q;
    for (let s = 0; s < PER_RING; s++) {
      let a = (s + (ring % 2) * 0.5) * step;
      for (let b = 0; b < 4; b++) {
        const a1 = a + dir * SHARES[b] * step;
        const [lo, hi] = dir > 0 ? [a, a1] : [a1, a];
        d[b].push(`M${P(r0, lo)} L${P(r1, lo)} A${r1} ${r1} 0 0 1 ${P(r1, hi)} L${P(r0, hi)} A${r0} ${r0} 0 0 0 ${P(r0, lo)} Z`);
        a = a1;
      }
    }
  }
  return { paths: d.map((p) => p.join(' ')), rings };
}

function SnakeDisc({ cx, cy, R, dir, colours }: { cx: number; cy: number; R: number; dir: 1 | -1; colours: readonly string[] }) {
  const { paths } = snakeDisc(cx, cy, R, dir);
  return (
    <g data-dir={dir}>
      {paths.map((p, b) => (
        <path key={b} d={p} fill={colours[b]} />
      ))}
    </g>
  );
}

type Turn = 'yes' | 'little' | 'no';

export function Snakes({ step, broken, phase, record }: BenchProps) {
  const [answer, setAnswer] = useState<Turn | null>(null);
  const [after, setAfter] = useState<Turn | null>(null);
  const colours = broken ? SNAKE_PLAIN : SNAKE_ORDER;
  const turnLine = (a: Turn, off: boolean) =>
    a === 'no'
      ? off
        ? 'With the middle shades the same gray, the circles stayed still.'
        : 'The circles stayed still for you. Some people see little or no motion here.'
      : off
        ? 'The circles still seemed to turn for you, with the middle shades the same gray.'
        : 'The circles seemed to turn. The picture is perfectly still.';
  return (
    <Work
      label="Rotating snakes"
      figure={
        <Picture
          id="snakes"
          step={step}
          broken={broken}
          label="Rotating snakes"
          drawing={
            <svg viewBox="0 0 600 600" className="pl-svg" role="img" aria-label="Four circles made of rings of black, dark blue, white and yellow pieces, on pale gray. Nothing in the picture moves.">
              <rect width="600" height="600" fill="#d8d8d8" />
              <SnakeDisc cx={150} cy={150} R={140} dir={1} colours={colours} />
              <SnakeDisc cx={450} cy={150} R={140} dir={-1} colours={colours} />
              <SnakeDisc cx={150} cy={450} R={140} dir={-1} colours={colours} />
              <SnakeDisc cx={450} cy={450} R={140} dir={1} colours={colours} />
            </svg>
          }
        />
      }
      task={
        <>
          {phase === 'before' && (
            <Choices
              question="Let your eyes wander. Do the circles seem to turn?"
              value={answer}
              onChoose={(a) => {
                setAnswer(a);
                record('before', observed(turnLine(a, false), a === 'yes' ? 1 : a === 'little' ? 0.5 : 0));
              }}
              options={[
                { id: 'yes', label: 'Yes, they turn' },
                { id: 'little', label: 'A little' },
                { id: 'no', label: 'No' },
              ]}
            />
          )}
          {phase === 'after' && (
            <Choices
              question="Let your eyes wander again. Do they still turn?"
              value={after}
              onChoose={(a) => {
                setAfter(a);
                record('after', observed(turnLine(a, true), a === 'yes' ? 1 : a === 'little' ? 0.5 : 0));
              }}
              options={[
                { id: 'yes', label: 'Yes, they turn' },
                { id: 'little', label: 'A little' },
                { id: 'no', label: 'No' },
              ]}
            />
          )}
          {phase === 'before' && <p className="pl-say">Now look straight at one circle and hold your eyes still: it stops.</p>}
        </>
      }
    />
  );
}
