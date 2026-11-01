'use client';

import { useEffect, useState } from 'react';
import { checkerResult, contrastResult, observed } from './results';
import { Choices, grey, Picture, RecordFor, Slider, Work, type BenchProps } from './ui';

// ───────── Adelson's checker shadow (the owner's picture) ─────────

/**
 * Squares A and B in the owner's picture are both this gray (sampled from
 * the file, slots.ts: checker.jpg, 1080 × 757). If the picture is replaced,
 * sample A and B again and set this, and the strip's ends below.
 */
export const CHECKER_TRUTH = 111;
/** The strip's ends, in the picture's pixels: inside square A below its letter, and inside square B above its letter. */
const A = { x: 553, y: 262 };
const B = { x: 541, y: 386 };

/** The drawing, used only if the picture is taken out of its slot: the board, with a full cylinder shadow over B. */
function CheckerDrawing({ broken }: { broken: boolean }) {
  // A 5×5 board seen from above at a slant; the cylinder stands behind B and its shadow covers B and its neighbours.
  const toScreen = (x: number, y: number) => ({ x: 300 + (x - y) * 0.7071, y: 60 + (x + y) * 0.4243 });
  const poly = (pts: [number, number][]) => pts.map(([a, b]) => toScreen(a, b)).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const LIGHT = 185;
  const DARK = CHECKER_TRUTH;
  const a = toScreen(90, 150);
  const b = toScreen(210, 90);
  return (
    <svg viewBox="0 0 600 380" className="pl-svg" role="img" aria-label="A checkerboard with a green cylinder standing on it, casting a shadow. Square A is a dark square in the light; square B is a light square in the shadow.">
      <defs>
        <linearGradient id="pl-shadow" gradientUnits="userSpaceOnUse" x1={toScreen(150, 150).x} y1="0" x2={toScreen(300, 150).x} y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="pl-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6b2f" />
          <stop offset="0.45" stopColor="#6fb46a" />
          <stop offset="1" stopColor="#1f4a20" />
        </linearGradient>
      </defs>
      <rect width="600" height="380" fill="#111" />
      {Array.from({ length: 25 }, (_, k) => {
        const i = k % 5;
        const j = Math.floor(k / 5);
        // B (i 3, j 1) is a light square: 185 × 0.6 in the shadow is the dark squares' gray.
        const v = (i + j) % 2 === 0 ? LIGHT : DARK;
        return <polygon key={k} points={poly([[i * 60, j * 60], [i * 60 + 60, j * 60], [i * 60 + 60, j * 60 + 60], [i * 60, j * 60 + 60]])} fill={grey(v)} />;
      })}
      {/* The shadow: a band from the cylinder across B to the board's edge, soft where it begins. */}
      <polygon points={poly([[150, 30], [300, 30], [300, 160], [150, 160]])} fill="url(#pl-shadow)" />
      <rect x="430" y="70" width="80" height="150" fill="url(#pl-cyl)" />
      <ellipse cx="470" cy="220" rx="40" ry="16" fill="#2f6b2f" />
      <ellipse cx="470" cy="70" rx="40" ry="16" fill="#8fd08a" stroke="#2f6b2f" />
      {broken && <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={grey(DARK)} strokeWidth="18" />}
      <text x={a.x} y={a.y + 10} textAnchor="middle" className="pl-svg-label" fill="#fff">
        A
      </text>
      <text x={b.x} y={b.y + 10} textAnchor="middle" className="pl-svg-label" fill="#222">
        B
      </text>
    </svg>
  );
}

export function Checker({ step, broken, phase, record }: BenchProps) {
  const [chip, setChip] = useState(175);
  return (
    <Work
      label="Adelson’s checker shadow"
      figure={
        <Picture
          id="checker"
          step={step}
          broken={broken}
          label="A checkerboard with a cylinder standing on it, casting a shadow. Square A is a dark square in the light; square B is a light square in the cylinder’s shadow."
          marks={broken && <path d={`M${A.x} ${A.y} L${B.x} ${B.y}`} stroke={grey(CHECKER_TRUTH)} strokeWidth="34" data-mark="strip" />}
          drawing={<CheckerDrawing broken={broken} />}
        />
      }
      task={
        phase && (
          <>
            {phase === 'after' && <p className="pl-say">Follow the gray strip from A to B. There is no join: it is all one shade.</p>}
            <div className="pl-chip-row">
              <span className="pl-chip" style={{ background: grey(chip) }} aria-hidden="true" />
              <span className="pl-chip-name">Your paint chip</span>
            </div>
            <Slider label="Paint chip shade" value={chip} min={40} max={240} onChange={setChip} valueText={chip > 150 ? 'light gray' : chip > 100 ? 'mid gray' : 'dark gray'} />
            <RecordFor phase={phase} onRecord={(p) => record(p, checkerResult(chip, CHECKER_TRUTH))} />
          </>
        )
      }
    />
  );
}

// ───────── Simultaneous contrast ─────────

export const CONTRAST_TRUTH = 128;

export function Contrast({ step, broken, phase, record }: BenchProps) {
  const [right, setRight] = useState(92);
  return (
    <Work
      label="Simultaneous contrast"
      figure={
        <Picture
          id="contrast"
          step={step}
          broken={broken}
          label="Simultaneous contrast"
          drawing={
            <svg viewBox="0 0 600 300" className="pl-svg" role="img" aria-label="Two gray squares on a background that runs from black on the left to white on the right.">
              <defs>
                <linearGradient id="pl-bw" x1="0" x2="1">
                  <stop offset="0" stopColor="#000" />
                  <stop offset="1" stopColor="#fff" />
                </linearGradient>
              </defs>
              <rect width="600" height="300" fill="url(#pl-bw)" />
              {broken && (
                <>
                  <rect x={40} y={70} width={140} height={140} fill={grey(170)} stroke="#333" strokeWidth="2" />
                  <rect x={420} y={70} width={140} height={140} fill={grey(170)} stroke="#333" strokeWidth="2" />
                </>
              )}
              <rect x={70} y={100} width={80} height={80} fill={grey(CONTRAST_TRUTH)} />
              <rect x={450} y={100} width={80} height={80} fill={grey(right)} />
            </svg>
          }
        />
      }
      task={
        phase && (
          <>
            <Slider label="Right square’s shade" value={right} min={40} max={220} onChange={setRight} valueText={right > 150 ? 'light gray' : right > 100 ? 'mid gray' : 'dark gray'} />
            <RecordFor phase={phase} onRecord={(p) => record(p, contrastResult(right, CONTRAST_TRUTH))} />
          </>
        )
      }
    />
  );
}

// ───────── Lilac chaser ─────────

export function Lilac({ step, broken, phase, record }: BenchProps) {
  const [gone, setGone] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  const [answer, setAnswer] = useState<'green' | 'lilac' | 'grey' | 'none' | null>(null);
  const [after, setAfter] = useState<'green' | 'none' | null>(null);

  // One spot gone at a time, round the ring, ten a second (stopped when broken).
  useEffect(() => {
    if (broken) return;
    const id = window.setInterval(() => setGone((g) => (g + 1) % 12), 100);
    return () => window.clearInterval(id);
  }, [broken]);

  useEffect(() => {
    if (count === null || count <= 0) return;
    const id = window.setTimeout(() => setCount((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [count]);

  const choose = (a: 'green' | 'lilac' | 'grey' | 'none') => {
    setAnswer(a);
    record(
      'before',
      a === 'green'
        ? observed('The gap looked green: your eyes made a color that wasn’t there.', 1)
        : a === 'lilac'
          ? observed('The gap looked lilac: no green for you this time.', 0.2)
          : observed('The gap had no color for you this time.', 0),
    );
  };

  return (
    <Work
      label="Lilac chaser"
      figure={
        <Picture
          id="lilac"
          step={step}
          broken={broken}
          label="Lilac chaser"
          drawing={
            <svg viewBox="0 0 400 400" className="pl-svg" role="img" aria-label="Twelve soft lilac spots in a ring on gray, with a cross in the middle. One spot at a time disappears, round and round.">
              <defs>
                <filter id="pl-blur" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>
              <rect width="400" height="400" fill="#bdbdbd" />
              {Array.from({ length: 12 }, (_, k) => {
                const a = (k / 12) * Math.PI * 2;
                return broken || k !== gone ? <circle key={k} cx={200 + 140 * Math.cos(a)} cy={200 + 140 * Math.sin(a)} r="22" fill="#d38ad8" filter="url(#pl-blur)" /> : null;
              })}
              <path d="M200 188 V212 M188 200 H212" stroke="#000" strokeWidth="3" />
            </svg>
          }
        />
      }
      task={
        phase === 'after' ? (
          <Choices
            question="All twelve spots stand still. Stare at the cross: do you see any green?"
            value={after}
            onChoose={(a) => {
              setAfter(a);
              record('after', observed(a === 'none' ? 'With the spots standing still, there was no green.' : 'You still saw some green with the spots standing still.', a === 'none' ? 0 : 1));
            }}
            options={[
              { id: 'none', label: 'No green' },
              { id: 'green', label: 'Some green', swatch: '#7fd38a' },
            ]}
          />
        ) : phase === 'before' ? (
          <>
            {count === null && (
              <button type="button" className="pl-btn pl-btn-primary" onClick={() => setCount(15)}>
                Start: stare for 15 seconds
              </button>
            )}
            {count !== null && count > 0 && (
              <p className="pl-count" aria-live="polite">
                Keep staring at the cross… <strong>{count}</strong>
              </p>
            )}
            {(count === 0 || answer) && (
              <Choices
                question="What color is the gap going round?"
                value={answer}
                onChoose={choose}
                options={[
                  { id: 'green', label: 'Green', swatch: '#7fd38a' },
                  { id: 'lilac', label: 'Lilac', swatch: '#d38ad8' },
                  { id: 'grey', label: 'Gray', swatch: '#bdbdbd' },
                  { id: 'none', label: 'I can’t tell' },
                ]}
              />
            )}
          </>
        ) : null
      }
    />
  );
}
