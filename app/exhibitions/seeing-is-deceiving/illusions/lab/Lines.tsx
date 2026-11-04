'use client';

import { useState } from 'react';
import { observed, poggendorffResult } from './results';
import { Choices, grey, Picture, RecordFor, Slider, Work, type BenchProps } from './ui';

// ───────── Café wall: big tiles, thin mortar (the strongest form) ─────────

const TILE = 72;
const MORTAR = 3;
const ROWS = 6;
const WALL_H = ROWS * (TILE + MORTAR) - MORTAR;

export function CafeWall({ step, broken, phase, record }: BenchProps) {
  const [mortar, setMortar] = useState(128);
  const [shift, setShift] = useState(50);
  const [answer, setAnswer] = useState<'tilted' | 'little' | 'straight' | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const cycle = [0, 0.5, 1, 0.5];
  // Try it and Why? always show the classic wall: gray mortar, rows half a tile along.
  const m = broken ? mortar : 128;
  const sh = broken ? shift : 50;
  return (
    <Work
      label="Café wall"
      figure={
        <Picture
          id="cafe-wall"
          step={step}
          broken={broken}
          label="Café wall"
          drawing={
            <svg viewBox={`0 0 600 ${WALL_H}`} className="pl-svg" role="img" aria-label="A wall of big black and white tiles in rows, each row shifted along from the one above, with thin gray mortar lines between the rows.">
              <rect width="600" height={WALL_H} fill={grey(m)} />
              {Array.from({ length: ROWS }, (_, r) => {
                const off = cycle[r % 4] * (sh / 100) * TILE;
                return (
                  <g key={r}>
                    {Array.from({ length: 6 }, (_, c) => (
                      <rect key={c} x={c * TILE * 2 - TILE * 2 + off} y={r * (TILE + MORTAR)} width={TILE} height={TILE} fill="#111" />
                    ))}
                    {Array.from({ length: 6 }, (_, c) => (
                      <rect key={`w${c}`} x={c * TILE * 2 - TILE + off} y={r * (TILE + MORTAR)} width={TILE} height={TILE} fill="#f4f4f4" />
                    ))}
                  </g>
                );
              })}
            </svg>
          }
        />
      }
      task={
        phase === 'after' ? (
          <>
            <Slider label="Mortar: black to white" value={mortar} min={0} max={255} big={16} onChange={setMortar} valueText={mortar < 40 ? 'black' : mortar > 215 ? 'white' : 'gray'} />
            <Slider label="Line the rows up" value={shift} min={0} max={100} onChange={setShift} valueText={`${shift}% shifted`} />
            <Choices
              question="Try black mortar, white mortar, and rows lined up. Did the tilt go away?"
              value={after as 'gone' | 'stayed' | null}
              onChoose={(a) => {
                setAfter(a);
                record('after', observed(a === 'gone' ? 'With black or white mortar, or the rows lined up, the tilt went away.' : 'The tilt stayed for you, whatever the mortar.', a === 'gone' ? 0 : 1));
              }}
              options={[
                { id: 'gone', label: 'Yes, it went' },
                { id: 'stayed', label: 'No, it stayed' },
              ]}
            />
          </>
        ) : phase === 'before' ? (
          <Choices
            question="The lines between the rows look…"
            value={answer}
            onChoose={(a) => {
              setAnswer(a);
              record(
                'before',
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
        ) : null
      }
    />
  );
}

// ───────── Fraser spiral, drawn for the museum after Fraser (1908) ─────────

/*
 * Fraser's figure: true circles, each a "twisted cord" of short black and
 * white strands. Every strand is tilted the same way against its circle, so
 * the cords lean inward, and the background is a checkerboard whose
 * squares spiral the same way. Straightened (Break it), every strand lies
 * along its circle and the checks line up in rings: no spiral.
 */

/** The cords' circles, out to the picture's corners. */
const RINGS = Array.from({ length: 11 }, (_, k) => 48 + k * 30);
const TRACED = 4;
const CORD = 12;
/** How far each stripe slants across its cord. */
const TILT = 55;
const SECTORS = 64;

const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;

/** The background: rings of checks, each ring turned a little further than the one inside it, so the checks spiral. */
function checks(twist: number) {
  const d: string[] = [];
  const edges = [20, ...RINGS.map((r, i) => (i < RINGS.length - 1 ? (r + RINGS[i + 1]) / 2 : 380))];
  for (let band = 0; band < edges.length - 1; band++) {
    const r0 = edges[band];
    const r1 = edges[band + 1];
    for (let s = 0; s < SECTORS; s += 2) {
      const turn = band * twist;
      const a0 = ((s + turn) / SECTORS) * Math.PI * 2;
      const a1 = ((s + 1 + turn) / SECTORS) * Math.PI * 2;
      d.push(`M${pt(r0, a0)} L${pt(r1, a0)} A${r1} ${r1} 0 0 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 0 0 ${pt(r0, a0)} Z`);
    }
  }
  return d.join(' ');
}

/**
 * One ring's cord, as two paths (black and white): a band round the circle
 * filled with short stripes, black and white in turn, each slanted across
 * the band like the strands of a twisted rope. Straightened, the stripes
 * run square across the band and the cord has no lean.
 */
function cord(r: number, tilt: number) {
  const n = 2 * Math.round((2 * Math.PI * r) / (CORD * 2.2));
  const p = (Math.PI * 2) / n;
  // How far round the outer edge runs ahead of the inner edge, for the slant.
  const lead = (CORD * Math.tan((tilt * Math.PI) / 180)) / r / 2;
  const r0 = r - CORD / 2;
  const r1 = r + CORD / 2;
  const out = { black: [] as string[], white: [] as string[] };
  for (let k = 0; k < n; k++) {
    const a = k * p;
    const d = `M${pt(r0, a - lead)} L${pt(r1, a + lead)} A${r1} ${r1} 0 0 1 ${pt(r1, a + p + lead)} L${pt(r0, a + p - lead)} A${r0} ${r0} 0 0 0 ${pt(r0, a - lead)} Z`;
    (k % 2 ? out.white : out.black).push(d);
  }
  return out;
}

export function Fraser({ step, broken, phase, record, reduced }: BenchProps) {
  const [answer, setAnswer] = useState<'spiral' | 'circles' | null>(null);
  const [after, setAfter] = useState<'spiral' | 'circles' | null>(null);
  const [traced, setTraced] = useState(false);
  const tilt = broken ? 0 : TILT;
  const strands = RINGS.map((r) => cord(r, tilt));
  const C = 2 * Math.PI * RINGS[TRACED];
  return (
    <Work
      label="Fraser spiral"
      figure={
        <Picture
          id="fraser"
          step={step}
          broken={broken}
          label="Fraser spiral"
          drawing={
            <svg viewBox="-250 -250 500 500" className="pl-svg" role="img" aria-label="Rings of twisted black-and-white cord on a background of blue and green checks.">
              <rect x="-250" y="-250" width="500" height="500" fill="#4f8fb8" />
              <path d={checks(broken ? 0 : 0.5)} fill="#8cc68a" />
              <circle r="38" fill="#4f8fb8" />
              <path d={strands.map((s) => s.black.join(' ')).join(' ')} fill="#111" />
              <path d={strands.map((s) => s.white.join(' ')).join(' ')} fill="#fafafa" />
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
        />
      }
      task={
        <>
          {phase === 'before' && (
            <Choices
              question="Is it a spiral, or circles?"
              value={answer}
              onChoose={(a) => {
                setAnswer(a);
                record('before', observed(a === 'spiral' ? 'It looked like a spiral. It is circles.' : 'You saw circles, which is what it is.', a === 'spiral' ? 1 : 0));
              }}
              options={[
                { id: 'spiral', label: 'A spiral' },
                { id: 'circles', label: 'Circles' },
              ]}
            />
          )}
          {step !== 'why' && (
            <button type="button" className="pl-btn" aria-pressed={traced} onClick={() => setTraced(!traced)}>
              {traced ? 'Hide the tracing' : 'Trace one ring'}
            </button>
          )}
          {traced && step !== 'why' && <p className="pl-say">The pink line follows one ring all the way round, and comes back to where it started.</p>}
          {phase === 'after' && (
            <Choices
              question="With the cord straightened: spiral, or circles?"
              value={after}
              onChoose={(a) => {
                setAfter(a);
                record('after', observed(a === 'circles' ? 'Straightened, you saw circles.' : 'Even straightened, it looked like a spiral to you.', a === 'spiral' ? 1 : 0));
              }}
              options={[
                { id: 'spiral', label: 'A spiral' },
                { id: 'circles', label: 'Circles' },
              ]}
            />
          )}
        </>
      }
    />
  );
}

// ───────── Poggendorff ─────────

const SLOPE = 0.6;
const ENTER = { x: 250, y: 216 };
export const POGG_TRUTH = ENTER.y - SLOPE * 100;

export function Poggendorff({ step, broken, phase, entry, record }: BenchProps) {
  const [guess, setGuess] = useState(236);
  const [shown, setShown] = useState(false);
  const line = (x0: number, y0: number, x1: number) => `M${x0} ${y0} L${x1} ${y0 - SLOPE * (x1 - x0)}`;
  // The real line is shown once both guesses are written down, or in Why?.
  const reveal = step === 'why' || (shown && Boolean(entry?.after));
  return (
    <Work
      label="Poggendorff"
      figure={
        <Picture
          id="poggendorff"
          step={step}
          broken={broken}
          label="Poggendorff"
          drawing={
            <svg viewBox="0 0 600 400" className="pl-svg" role="img" aria-label="A slanting line going up behind a tall gray bar, and a marker on the bar’s right edge for where the line comes out.">
              <rect width="600" height="400" fill="#f4f1ea" />
              <g stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round">
                <path d={line(40, ENTER.y + SLOPE * 210, ENTER.x)} />
                {reveal && <path d={line(350, POGG_TRUTH, 560)} />}
              </g>
              {broken ? (
                <path d="M250 0 V400 M350 0 V400" stroke="#8da3b8" strokeWidth="3" strokeDasharray="10 8" />
              ) : (
                <rect x="250" y="0" width="100" height="400" fill="#8da3b8" />
              )}
              {reveal && <path d={line(ENTER.x, ENTER.y, 350)} stroke="#1a1a1a" strokeWidth="5" strokeDasharray="6 8" />}
              <path d={line(350, guess, 560)} stroke="#e0703a" strokeWidth="5" strokeLinecap="round" strokeDasharray={reveal ? '12 10' : undefined} />
              <circle cx="350" cy={guess} r="11" fill="#e0703a" stroke="#1a1a1a" strokeWidth="2" />
            </svg>
          }
        />
      }
      task={
        <>
          {phase && (
            <>
              <Slider label="Move the marker up or down" value={400 - guess} min={40} max={360} onChange={(v) => setGuess(400 - v)} />
              <RecordFor phase={phase} onRecord={(p) => record(p, poggendorffResult(guess, POGG_TRUTH, 400))} />
            </>
          )}
          {phase === 'after' && entry?.after && (
            <button type="button" className="pl-btn" aria-pressed={shown} onClick={() => setShown(!shown)}>
              {shown ? 'Hide the real line' : 'Show where it really comes out'}
            </button>
          )}
          {reveal && <p className="pl-say">The black line is where it really comes out. The orange one is your guess.</p>}
        </>
      }
    />
  );
}
