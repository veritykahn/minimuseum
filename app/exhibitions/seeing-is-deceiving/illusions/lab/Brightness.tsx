'use client';

import { useEffect, useState } from 'react';
import { checkerResult, contrastResult, observed } from './results';
import { Choices, grey, Record, Slider, Work, type BenchProps } from './ui';

// ───────── 1. Adelson's checker shadow (drawn for the museum) ─────────

const LIGHT = 199;
const DARK = 120;
/** The shadow takes away 40% of the light: a light square in it is 199 × 0.6 ≈ 119, the same as a dark square out of it. */
const SHADE = 0.4;
export const CHECKER_TRUTH = DARK;

/** A point on the board (0 to 300 each way) to the picture: the board turned 45° and seen from above at a slant. */
const toScreen = (x: number, y: number) => ({ x: 300 + (x - y) * 0.7071, y: 70 + (x + y) * 0.4243 });
const cellPoly = (i: number, j: number) =>
  [
    [i, j],
    [i + 1, j],
    [i + 1, j + 1],
    [i, j + 1],
  ]
    .map(([a, b]) => toScreen(a * 60, b * 60))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

function CheckerBoard({ broken }: { broken: boolean }) {
  const A = toScreen(90, 90);
  const B = toScreen(210, 150);
  return (
    <svg viewBox="0 0 600 360" className="pl-svg" role="img" aria-label="A checkerboard with a green cylinder standing on it, casting a shadow. Square A is a dark square in the light; square B is a light square in the shadow.">
      <defs>
        <filter id="pl-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="pl-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6b2f" />
          <stop offset="0.45" stopColor="#6fb46a" />
          <stop offset="1" stopColor="#1f4a20" />
        </linearGradient>
        <clipPath id="pl-board">
          <polygon points={[toScreen(0, 0), toScreen(300, 0), toScreen(300, 300), toScreen(0, 300)].map((p) => `${p.x},${p.y}`).join(' ')} />
        </clipPath>
      </defs>
      <rect width="600" height="360" fill={grey(150)} />
      {Array.from({ length: 25 }, (_, k) => {
        const i = k % 5;
        const j = Math.floor(k / 5);
        return <polygon key={k} points={cellPoly(i, j)} fill={grey((i + j) % 2 === 0 ? DARK : LIGHT)} />;
      })}
      {/* The cylinder's shadow: soft at its edge, B well inside its core. */}
      <g clipPath="url(#pl-board)">
        <g transform="translate(300 70) matrix(0.7071 0.4243 -0.7071 0.4243 0 0)">
          <ellipse cx="240" cy="115" rx="125" ry="72" transform="rotate(-47 240 115)" fill="#000" opacity={SHADE} filter="url(#pl-soft)" />
        </g>
      </g>
      {/* The cylinder */}
      <g>
        <rect x="408" y="70" width="80" height="150" fill="url(#pl-cyl)" />
        <ellipse cx="448" cy="220" rx="40" ry="16" fill="#2f6b2f" />
        <ellipse cx="448" cy="70" rx="40" ry="16" fill="#8fd08a" stroke="#2f6b2f" />
      </g>
      {broken && (
        <path d={`M${A.x} ${A.y} L${B.x} ${B.y}`} stroke={grey(DARK)} strokeWidth="18" strokeLinecap="square" />
      )}
      <text x={A.x} y={A.y + 8} textAnchor="middle" className="pl-svg-label" fill="#fff">
        A
      </text>
      <text x={B.x} y={B.y + 8} textAnchor="middle" className="pl-svg-label" fill="#222">
        B
      </text>
    </svg>
  );
}

export function Checker({ broken, record }: BenchProps) {
  const [chip, setChip] = useState(175);
  return (
    <Work
      label="Adelson’s checker shadow"
      figure={<CheckerBoard broken={broken} />}
      task={
        broken ? (
          <p className="pl-say">Follow the grey strip from A to B. There is no join: it is all one shade.</p>
        ) : (
          <>
            <div className="pl-chip-row">
              <span className="pl-chip" style={{ background: grey(chip) }} aria-hidden="true" />
              <span className="pl-chip-name">Your paint chip</span>
            </div>
            <Slider label="Paint chip shade" value={chip} min={40} max={240} onChange={setChip} valueText={chip > 150 ? 'light grey' : chip > 100 ? 'mid grey' : 'dark grey'} />
            <Record onClick={() => record(checkerResult(chip, CHECKER_TRUTH))} />
          </>
        )
      }
    />
  );
}

// ───────── 2. Simultaneous contrast ─────────

export const CONTRAST_TRUTH = 128;

export function Contrast({ broken, record }: BenchProps) {
  const [right, setRight] = useState(92);
  const [pos, setPos] = useState(15);
  const lx = 30 + (pos / 100) * 460;
  return (
    <Work
      label="Simultaneous contrast"
      figure={
        <svg viewBox="0 0 600 300" className="pl-svg" role="img" aria-label="Two grey squares on a background that runs from black on the left to white on the right.">
          <defs>
            <linearGradient id="pl-bw" x1="0" x2="1">
              <stop offset="0" stopColor="#000" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
          </defs>
          <rect width="600" height="300" fill="url(#pl-bw)" />
          {broken && (
            <>
              <rect x={lx - 30} y={70} width={140} height={140} fill={grey(170)} stroke="#333" strokeWidth="2" />
              <rect x={460} y={70} width={140 - 30} height={140} fill={grey(170)} stroke="#333" strokeWidth="2" />
            </>
          )}
          <rect x={lx} y={100} width={80} height={80} fill={grey(CONTRAST_TRUTH)} />
          <rect x={490} y={100} width={80} height={80} fill={grey(right)} />
        </svg>
      }
      task={
        <>
          <Slider label="Slide the left square across" value={pos} min={0} max={100} onChange={setPos} valueText={`${pos}% of the way across`} />
          {!broken && (
            <>
              <Slider label="Right square’s shade" value={right} min={40} max={220} onChange={setRight} />
              <Record onClick={() => record(contrastResult(right, CONTRAST_TRUTH))} />
            </>
          )}
        </>
      }
    />
  );
}

// ───────── 3. Lilac chaser ─────────

export function Lilac({ broken, record, result }: BenchProps) {
  const [gone, setGone] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  const [answer, setAnswer] = useState<'green' | 'lilac' | 'grey' | 'none' | null>(null);

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
      a === 'green'
        ? observed('The gap looked green: your eyes made a colour that wasn’t there.', 1)
        : a === 'lilac'
          ? observed('The gap looked lilac: no green for you this time.', 0.2)
          : observed('The gap had no colour for you this time.', 0),
    );
  };

  return (
    <Work
      label="Lilac chaser"
      figure={
        <svg viewBox="0 0 400 400" className="pl-svg pl-square" role="img" aria-label="Twelve soft lilac spots in a ring on grey, with a cross in the middle. One spot at a time disappears, round and round.">
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
      task={
        broken ? (
          <p className="pl-say">All twelve spots stay still now. Stare at the cross: no green.</p>
        ) : (
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
            {(count === 0 || result) && (
              <Choices
                question="What colour is the gap going round?"
                value={answer}
                onChoose={choose}
                options={[
                  { id: 'green', label: 'Green', swatch: '#7fd38a' },
                  { id: 'lilac', label: 'Lilac', swatch: '#d38ad8' },
                  { id: 'grey', label: 'Grey', swatch: '#bdbdbd' },
                  { id: 'none', label: 'I can’t tell' },
                ]}
              />
            )}
          </>
        )
      }
    />
  );
}
