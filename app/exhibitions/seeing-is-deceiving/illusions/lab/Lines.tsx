'use client';

import { useState } from 'react';
import { observed, poggendorffResult } from './results';
import { Choices, grey, Record, Slider, Work, type BenchProps } from './ui';

// ───────── 8. Café wall ─────────

export function CafeWall({ broken, record }: BenchProps) {
  const [mortar, setMortar] = useState(128);
  const [shift, setShift] = useState(50);
  const [answer, setAnswer] = useState<'tilted' | 'little' | 'straight' | null>(null);
  const tw = 50;
  const th = 50;
  const m = 4;
  const rows = 7;
  const cycle = [0, 0.5, 1, 0.5];
  return (
    <Work
      label="Café wall"
      figure={
        <svg viewBox="0 0 600 374" className="pl-svg" role="img" aria-label="A wall of black and white tiles in rows, each row shifted along from the one above, with thin mortar lines between the rows.">
          <rect width="600" height="374" fill={grey(mortar)} />
          {Array.from({ length: rows }, (_, r) => {
            const off = cycle[r % 4] * (shift / 100) * tw;
            return (
              <g key={r}>
                {Array.from({ length: 14 }, (_, c) => (
                  <rect key={c} x={c * tw * 2 - tw * 2 + off} y={r * (th + m)} width={tw} height={th} fill="#111" />
                ))}
                {Array.from({ length: 14 }, (_, c) => (
                  <rect key={`w${c}`} x={c * tw * 2 - tw + off} y={r * (th + m)} width={tw} height={th} fill="#f4f4f4" />
                ))}
              </g>
            );
          })}
        </svg>
      }
      task={
        broken ? (
          <>
            <Slider label="Mortar: black to white" value={mortar} min={0} max={255} big={16} onChange={setMortar} valueText={mortar < 40 ? 'black' : mortar > 215 ? 'white' : 'gray'} />
            <Slider label="Line the rows up" value={shift} min={0} max={100} onChange={setShift} valueText={`${shift}% shifted`} />
          </>
        ) : (
          <Choices
            question="The lines between the rows look…"
            value={answer}
            onChoose={(a) => {
              setAnswer(a);
              record(
                observed(
                  a === 'tilted' ? 'The rows looked tilted. They are perfectly straight.' : a === 'little' ? 'The rows looked a little tilted. They are perfectly straight.' : 'The rows looked straight to you, as they are.',
                  a === 'tilted' ? 1 : a === 'little' ? 0.5 : 0,
                ),
              );
            }}
            options={[
              { id: 'tilted', label: 'Tilted' },
              { id: 'little', label: 'A little tilted' },
              { id: 'straight', label: 'Straight' },
            ]}
          />
        )
      }
    />
  );
}

// ───────── 9. Fraser spiral ─────────

const RINGS = [46, 88, 130, 172, 214];
const TRACED = 3;

function cords(r: number, tilt: number) {
  const n = Math.round((2 * Math.PI * r) / 11);
  const len = (2 * Math.PI * r) / n;
  return Array.from({ length: n }, (_, k) => {
    const a = (k / n) * 360;
    return { a, len, fill: k % 2 ? '#fff' : '#111', tilt };
  });
}

export function Fraser({ broken, record, reduced }: BenchProps) {
  const [answer, setAnswer] = useState<'spiral' | 'circles' | null>(null);
  const [traced, setTraced] = useState(false);
  const tilt = broken ? 0 : 32;
  const sectors = 32;
  const C = 2 * Math.PI * RINGS[TRACED];
  return (
    <Work
      label="Fraser spiral"
      figure={
        <svg viewBox="-250 -250 500 500" className="pl-svg pl-square" role="img" aria-label="Rings of twisted black-and-white rope on a patterned background.">
          <rect x="-250" y="-250" width="500" height="500" fill={broken ? '#9aa3ad' : '#2a7f8f'} />
          {!broken &&
            Array.from({ length: 6 }, (_, band) =>
              Array.from({ length: sectors }, (_, s) => {
                if ((band + s) % 2) return null;
                const r0 = band * 42 + 24;
                const r1 = r0 + 42;
                // Each band turned a little further than the one inside it: a spiral of checks.
                const a0 = ((s + band * 0.35) / sectors) * Math.PI * 2;
                const a1 = ((s + 1 + band * 0.35) / sectors) * Math.PI * 2;
                const p = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
                return <path key={`${band}-${s}`} d={`M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`} fill="#d9b44a" />;
              }),
            )}
          {RINGS.map((r) =>
            cords(r, tilt).map((c, k) => (
              <rect key={`${r}-${k}`} x={-c.len / 2} y={-r - 7} width={c.len + 0.6} height="14" fill={c.fill} transform={`rotate(${c.a}) rotate(${c.tilt} 0 ${-r})`} />
            )),
          )}
          {traced && (
            <circle
              r={RINGS[TRACED]}
              fill="none"
              stroke="#ff4fa3"
              strokeWidth="6"
              strokeDasharray={C}
              strokeDashoffset={0}
              transform="rotate(-90)"
              className={reduced ? undefined : 'pl-trace'}
              style={{ ['--len' as string]: `${C}` }}
            />
          )}
        </svg>
      }
      task={
        <>
          {!broken && (
            <Choices
              question="Is it a spiral, or circles?"
              value={answer}
              onChoose={(a) => {
                setAnswer(a);
                record(observed(a === 'spiral' ? 'It looked like a spiral. It is circles.' : 'You saw circles, which is what it is.', a === 'spiral' ? 1 : 0));
              }}
              options={[
                { id: 'spiral', label: 'A spiral' },
                { id: 'circles', label: 'Circles' },
              ]}
            />
          )}
          <button type="button" className="pl-btn" aria-pressed={traced} onClick={() => setTraced(!traced)}>
            {traced ? 'Hide the tracing' : 'Trace one ring'}
          </button>
          {traced && <p className="pl-say">The pink line follows one ring all the way round, and comes back to where it started.</p>}
        </>
      }
    />
  );
}

// ───────── 10. Poggendorff ─────────

const SLOPE = 0.6;
const ENTER = { x: 250, y: 216 };
export const POGG_TRUTH = ENTER.y - SLOPE * 100;

export function Poggendorff({ broken, record }: BenchProps) {
  const [guess, setGuess] = useState(236);
  const line = (x0: number, y0: number, x1: number) => `M${x0} ${y0} L${x1} ${y0 - SLOPE * (x1 - x0)}`;
  return (
    <Work
      label="Poggendorff"
      figure={
        <svg viewBox="0 0 600 400" className="pl-svg" role="img" aria-label="A slanting line going up behind a tall gray bar, and a marker on the bar’s right edge for where the line comes out.">
          <rect width="600" height="400" fill="#f4f1ea" />
          <g stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round">
            <path d={line(40, ENTER.y + SLOPE * 210, ENTER.x)} />
            {broken && <path d={line(ENTER.x, ENTER.y, 560)} />}
          </g>
          <rect x="250" y="0" width="100" height="400" fill={broken ? 'none' : '#8da3b8'} stroke={broken ? '#8da3b8' : 'none'} strokeWidth="3" strokeDasharray={broken ? '10 8' : undefined} />
          <path d={line(350, guess, 560)} stroke="#e0703a" strokeWidth="5" strokeLinecap="round" strokeDasharray={broken ? '12 10' : undefined} />
          <circle cx="350" cy={guess} r="11" fill="#e0703a" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      }
      task={
        broken ? (
          <p className="pl-say">The black line is where it really comes out. The orange one is your guess.</p>
        ) : (
          <>
            <Slider label="Move the marker up or down" value={400 - guess} min={40} max={360} onChange={(v) => setGuess(400 - v)} />
            <Record onClick={() => record(poggendorffResult(guess, POGG_TRUTH, 400))} />
          </>
        )
      }
    />
  );
}
