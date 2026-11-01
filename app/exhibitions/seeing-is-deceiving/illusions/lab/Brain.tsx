'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { observed, stroopMatchResult, stroopResult } from './results';
import { Choices, Picture, Slider, useSvgDrag, Work, type BenchProps } from './ui';

// ───────── Stroop race ─────────

export const INKS = [
  { id: 'red', word: 'RED', ink: '#ef5350' },
  { id: 'blue', word: 'BLUE', ink: '#42a5f5' },
  { id: 'green', word: 'GREEN', ink: '#66bb6a' },
  { id: 'yellow', word: 'YELLOW', ink: '#ffee58' },
] as const;

/** Twelve items: the inks in a fixed shuffle; in Round 2 each word names a different color from its ink. */
export const STROOP_INKS = [0, 2, 1, 3, 2, 0, 3, 1, 0, 3, 2, 1];
export const STROOP_WORDS = STROOP_INKS.map((ink, k) => (ink + 1 + (k % 3)) % 4);

type Round = 1 | 2 | 3;

export function Stroop({ step, broken, phase, record }: BenchProps) {
  const [round, setRound] = useState<Round>(1);
  const [running, setRunning] = useState(false);
  const [times, setTimes] = useState<Partial<Record<Round, number>>>({});
  const started = useRef(0);
  const [now, setNow] = useState(0);
  const shown: Round = broken ? 3 : round;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow((performance.now() - started.current) / 1000), 100);
    return () => window.clearInterval(id);
  }, [running]);

  const go = () => {
    started.current = performance.now();
    setNow(0);
    setRunning(true);
  };
  const stop = () => {
    const t = (performance.now() - started.current) / 1000;
    setRunning(false);
    const next = { ...times, [shown]: t };
    setTimes(next);
    if (shown === 1) setRound(2);
    if (shown === 2 && next[1] !== undefined) record('before', stroopResult(next[1], t));
    if (shown === 3) record('after', stroopMatchResult(t, next[2]));
  };

  return (
    <Work
      label="Stroop race"
      figure={
        <Picture
          id="stroop"
          step={step}
          broken={broken}
          label="Stroop race"
          drawing={
            <div className="pl-stroop" aria-label={`Round ${shown}`} role="list">
              {STROOP_INKS.map((ink, k) => {
                const c = INKS[ink];
                if (shown === 1) return <span key={k} role="listitem" className="pl-stroop-patch" style={{ background: c.ink }} aria-label={c.id} />;
                const word = shown === 2 ? INKS[STROOP_WORDS[k]].word : c.word;
                return (
                  <span key={k} role="listitem" className="pl-stroop-word" style={{ color: c.ink }} aria-label={`${word} in ${c.id} ink`}>
                    {word}
                  </span>
                );
              })}
            </div>
          }
        />
      }
      task={
        phase && (
          <>
            <p className="pl-q">
              {shown === 1 ? 'Round 1: say the color of each patch, out loud.' : shown === 2 ? 'Round 2: say the color of the ink, not the word.' : 'Round 3: say the ink colors again. The words match now.'}
            </p>
            {running ? (
              <>
                <p className="pl-count">
                  <strong>{now.toFixed(1)}</strong> s
                </p>
                <button type="button" className="pl-btn pl-btn-primary" onClick={stop}>
                  Done!
                </button>
              </>
            ) : (
              <button type="button" className="pl-btn pl-btn-primary" onClick={go}>
                Start Round {shown}
              </button>
            )}
            {phase === 'before' && round === 2 && !running && times[1] !== undefined && <p className="pl-say">Round 1: {times[1].toFixed(1)} s.</p>}
            {phase === 'after' && times[3] !== undefined && <p className="pl-say">Round 3: {times[3].toFixed(1)} s.</p>}
            {phase === 'before' && times[2] !== undefined && (
              <button
                type="button"
                className="pl-btn"
                onClick={() => {
                  setTimes({});
                  setRound(1);
                }}
              >
                Race again
              </button>
            )}
            <p className="pl-tip">No stopwatch needed: you can just say them out loud and notice which round feels harder. If some of these colors are hard for you to tell apart, try it with a friend.</p>
          </>
        )
      }
    />
  );
}

// ───────── Paris in the the springtime ("Read the sign") ─────────

export const PHRASES = [
  [['PARIS'], ['IN', 'THE'], ['THE', 'SPRINGTIME']],
  [['ONCE'], ['IN', 'A'], ['A', 'LIFETIME']],
  [['A', 'BIRD'], ['IN', 'THE'], ['THE', 'HAND']],
];

export function Paris({ step, broken, phase, record }: BenchProps) {
  const [n, setN] = useState(0);
  const [first, setFirst] = useState<'missed' | 'spotted' | null>(null);
  const [after, setAfter] = useState<'yes' | 'no' | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const lines = PHRASES[n];
  const wrong = '2-0';

  return (
    <Work
      label="Read the sign"
      figure={
        <Picture
          id="paris"
          step={step}
          broken={broken}
          label="Read the sign"
          drawing={
            broken ? (
              <div className="pl-sign pl-sign-line">{lines.flat().join(' ')}</div>
            ) : (
              <div className="pl-sign">
                {lines.map((line, i) => (
                  <div key={i} className="pl-sign-row">
                    {line.map((w, j) => (
                      <button
                        key={j}
                        type="button"
                        className="pl-word"
                        aria-pressed={tapped === `${i}-${j}`}
                        data-wrong={tapped === `${i}-${j}` && `${i}-${j}` === wrong ? 'yes' : undefined}
                        onClick={() => setTapped(`${i}-${j}`)}
                        disabled={step === 'why'}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )
          }
        />
      }
      task={
        phase === 'after' ? (
          <Choices
            question="On one line, can you see the extra word?"
            value={after}
            onChoose={(a) => {
              setAfter(a);
              record('after', observed(a === 'yes' ? 'On one line, the extra word was easy to spot.' : 'Even on one line, the extra word was hard to spot.', a === 'yes' ? 0 : 1));
            }}
            options={[
              { id: 'yes', label: 'Yes, easily' },
              { id: 'no', label: 'Not really' },
            ]}
          />
        ) : phase === 'before' ? (
          <>
            {n === 0 && (
              <Choices
                question="Read it out loud. What did it say?"
                value={first}
                onChoose={(a) => {
                  setFirst(a);
                  record('before', observed(a === 'missed' ? 'You read “Paris in the springtime” and missed the extra “the”.' : 'You spotted the extra word straight away.', a === 'missed' ? 1 : 0));
                }}
                options={[
                  { id: 'missed', label: 'It made sense' },
                  { id: 'spotted', label: 'Something was wrong' },
                ]}
              />
            )}
            <p className="pl-say" aria-live="polite">
              {tapped === null ? 'Tap the word that is wrong.' : tapped === wrong ? 'Yes: that “' + lines[2][0] + '” is there twice.' : 'Not that one. Read it word by word.'}
            </p>
            {n < PHRASES.length - 1 && (
              <button
                type="button"
                className="pl-btn"
                onClick={() => {
                  setN(n + 1);
                  setTapped(null);
                }}
              >
                Try another sign
              </button>
            )}
          </>
        ) : null
      }
    />
  );
}

// ───────── Rubin's vase, drawn for the museum ─────────

/** The vase's half-width at each height: its edge is the faces' profile (forehead, nose, lips, chin). */
const PROFILE: [number, number][] = [
  [20, 150], [50, 134], [85, 120], [112, 112], [138, 78], [158, 96], [178, 84], [192, 94], [206, 80], [228, 104], [258, 88], [292, 62], [330, 58], [360, 96], [380, 150],
];

function vasePath() {
  const right = PROFILE.map(([y, w]) => [300 + w, y]);
  const left = PROFILE.map(([y, w]) => [300 - w, y]).reverse();
  const smooth = (pts: number[][]) => {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };
  return `${smooth(right)} L${left[0][0]} ${left[0][1]} ${smooth(left).slice(1).replace(/^[^C]*/, '')} Z`;
}

const VASE = vasePath();

export function Rubin({ step, broken, phase, record }: BenchProps) {
  const [first, setFirst] = useState<'vase' | 'faces' | null>(null);
  const [flip, setFlip] = useState<'yes' | 'no' | null>(null);
  const [after, setAfter] = useState<'faces' | 'vase' | 'both' | null>(null);
  const say = (f: 'vase' | 'faces' | null, x: 'yes' | 'no' | null) => {
    if (!f) return;
    record('before', observed(`You saw ${f === 'vase' ? 'the vase' : 'the faces'} first.${x ? (x === 'yes' ? ' You could flip it on purpose.' : ' It would not flip on purpose.') : ''}`, null));
  };
  return (
    <Work
      label="Rubin’s vase"
      figure={
        <Picture
          id="rubin"
          step={step}
          broken={broken}
          label="Rubin’s vase"
          drawing={
            <svg viewBox="0 0 600 400" className="pl-svg" role="img" aria-label="A white vase in the middle of a black picture. Its edges are also the profiles of two black faces looking at each other.">
              <rect width="600" height="400" fill="#111" />
              <path d={VASE} fill="#f4f1ea" />
              {broken && (
                <g>
                  <path d="M118 104 q14 -9 28 0 q-14 8 -28 0 Z" fill="#f4f1ea" />
                  <path d="M482 104 q-14 -9 -28 0 q14 8 28 0 Z" fill="#f4f1ea" />
                  <path d="M110 86 q20 -10 40 -2" stroke="#f4f1ea" strokeWidth="4" fill="none" />
                  <path d="M490 86 q-20 -10 -40 -2" stroke="#f4f1ea" strokeWidth="4" fill="none" />
                </g>
              )}
            </svg>
          }
        />
      }
      task={
        phase === 'after' ? (
          <Choices
            question="With eyes on the faces, what do you see now?"
            value={after}
            onChoose={(a) => {
              setAfter(a);
              record('after', observed(a === 'faces' ? 'With eyes, you saw the faces.' : a === 'vase' ? 'With eyes, you still saw the vase.' : 'With eyes, it still flipped between the two.', null));
            }}
            options={[
              { id: 'faces', label: 'The faces' },
              { id: 'vase', label: 'The vase' },
              { id: 'both', label: 'It still flips' },
            ]}
          />
        ) : phase === 'before' ? (
          <>
            <Choices
              question="What did you see first?"
              value={first}
              onChoose={(a) => {
                setFirst(a);
                say(a, flip);
              }}
              options={[
                { id: 'vase', label: 'A vase' },
                { id: 'faces', label: 'Two faces' },
              ]}
            />
            <Choices
              question="Can you make it flip on purpose?"
              value={flip}
              onChoose={(a) => {
                setFlip(a);
                say(first, a);
              }}
              options={[
                { id: 'yes', label: 'Yes' },
                { id: 'no', label: 'Not yet' },
              ]}
            />
          </>
        ) : null
      }
    />
  );
}

// ───────── Bonus: the Ames room ─────────

/*
 * A real Ames room, worked out in 3D. Seen from the peephole it is a
 * rectangular room: the back wall 5 m wide, 6 m away, its floor 1.6 m below
 * the eye. In fact its back wall slants: every point of it is pushed along
 * its own line of sight from the eye, by λ(x) = 6 / (6 + 0.8x), so the
 * left corner is 1.5 times as far away as it looks and the right corner
 * 0.75 times. Pushed along lines of sight, nothing in the peephole picture
 * changes: the walls, the window and the checkered floor all look square.
 * The child is one height, 1.3 m, wherever they stand. Their picture is
 * that height seen from their real distance, so it is the room, not the
 * child, that changes their size. "Fly above" shows the real plan.
 */

/** The projection: K / z pixels to a meter at depth z, the eye at (320, 200). */
const K = 600;
const Z0 = 6;
const FLOOR = -1.6;
const CEIL = 1.4;
const HALF = 2.5;
export const CHILD_HEIGHT = 1.3;
/** How much further away (more than 1) or nearer (less than 1) the back wall really is than it looks, across it. */
export const amesDepth = (x: number) => 6 / (6 + 0.8 * x);
const proj = (x: number, y: number, z: number) => ({ x: 320 + (K * x) / z, y: 200 - (K * y) / z });
const poly = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
/** Where the child can stand along the back wall, in meters from its middle. */
const REACH = 2.1;
/** A point across the peephole picture to the child's place along the wall, 0 (left corner) to 1 (right). */
const amesT = (px: number) => Math.max(0, Math.min(1, (((px - 320) * Z0) / K + REACH) / (2 * REACH)));
/** The child's height in the peephole picture, in pixels: one height, seen from their real distance. */
export const amesChildPx = (x: number) => (K * CHILD_HEIGHT) / (amesDepth(x) * Z0);

/** The peephole view of the room (identical to a square room's). */
function AmesView() {
  const tiles: { pts: string; dark: boolean }[] = [];
  const cols = 8;
  // Square tiles, 0.4 m deep, from the back wall forward (the nearest run off the bottom of the picture).
  const zs = Array.from({ length: 8 }, (_, k) => Z0 - k * 0.4);
  for (let r = 0; r < zs.length - 1; r++)
    for (let c = 0; c < cols; c++) {
      const x0 = -HALF + (c * 2 * HALF) / cols;
      const x1 = x0 + (2 * HALF) / cols;
      tiles.push({ pts: poly([proj(x0, FLOOR, zs[r]), proj(x1, FLOOR, zs[r]), proj(x1, FLOOR, zs[r + 1]), proj(x0, FLOOR, zs[r + 1])]), dark: (r + c) % 2 === 0 });
    }
  const back = [proj(-HALF, CEIL, Z0), proj(HALF, CEIL, Z0), proj(HALF, FLOOR, Z0), proj(-HALF, FLOOR, Z0)];
  const near = 2.4;
  const win = (x0: number, x1: number) => poly([proj(x0, 0.9, Z0), proj(x1, 0.9, Z0), proj(x1, -0.25, Z0), proj(x0, -0.25, Z0)]);
  return (
    <>
      <rect width="640" height="400" fill="#b89f78" />
      {/* side walls and ceiling */}
      <polygon points={poly([proj(-HALF, CEIL, near), proj(-HALF, CEIL, Z0), proj(-HALF, FLOOR, Z0), proj(-HALF, FLOOR, near)])} fill="#c9b08a" />
      <polygon points={poly([proj(HALF, CEIL, near), proj(HALF, CEIL, Z0), proj(HALF, FLOOR, Z0), proj(HALF, FLOOR, near)])} fill="#c9b08a" />
      <polygon points={poly([proj(-HALF, CEIL, near), proj(HALF, CEIL, near), proj(HALF, CEIL, Z0), proj(-HALF, CEIL, Z0)])} fill="#e9dcc4" />
      <polygon points={poly(back)} fill="#e6d7bd" />
      <polygon points={win(-1.9, -0.9)} fill="#a8d5e5" stroke="#3b2a1c" strokeWidth="4" />
      <polygon points={win(0.9, 1.9)} fill="#a8d5e5" stroke="#3b2a1c" strokeWidth="4" />
      {tiles.map((t, i) => (
        <polygon key={i} points={t.pts} fill={t.dark ? '#3b2a1c' : '#efe4cf'} />
      ))}
    </>
  );
}

function Child({ x, y, h }: { x: number; y: number; h: number }) {
  // Drawn 160 units tall, feet at 0.
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(h / 160).toFixed(3)})`} data-child-px={h.toFixed(1)}>
      <ellipse cx="0" cy="2" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
      <rect x="-14" y="-62" width="10" height="62" rx="4" fill="#2e4a7a" />
      <rect x="4" y="-62" width="10" height="62" rx="4" fill="#2e4a7a" />
      <rect x="-20" y="-118" width="40" height="62" rx="12" fill="#e0703a" />
      <circle cx="0" cy="-138" r="20" fill="#f2c9a0" />
      <path d="M-20 -146 q20 -22 40 0" fill="#5a3a1e" />
    </g>
  );
}

/** The plan from above, in meters: the eye at the origin, depth up the picture. */
const PLAN = { s: 36, ox: 340, oy: 384 };
const plan = (x: number, z: number) => ({ x: PLAN.ox + PLAN.s * x, y: PLAN.oy - PLAN.s * z });

function AmesPlan({ cx }: { cx: number }) {
  const lam = (x: number) => amesDepth(x);
  // The real room: everything on the left pushed 1.5 times as far along its sight line, the right 0.75 times.
  const L = plan(-HALF * lam(-HALF), Z0 * lam(-HALF));
  const R = plan(HALF * lam(HALF), Z0 * lam(HALF));
  const LF = plan(-HALF * lam(-HALF), 3 * lam(-HALF));
  const RF = plan(HALF * lam(HALF), 3 * lam(HALF));
  const eye = plan(0, 0);
  const child = plan(cx * lam(cx), Z0 * lam(cx));
  return (
    <>
      <rect width="640" height="400" fill="#f4f1ea" />
      {/* What the peephole shows: a square room. */}
      <polygon points={poly([plan(-HALF, Z0), plan(HALF, Z0), plan(HALF, 3), plan(-HALF, 3)])} fill="none" stroke="#8da3b8" strokeWidth="2" strokeDasharray="8 6" />
      {/* The real room. */}
      <polygon points={poly([L, R, RF, LF])} fill="#e6d7bd" stroke="#3b2a1c" strokeWidth="4" />
      <path d={`M${eye.x} ${eye.y} L${L.x} ${L.y} M${eye.x} ${eye.y} L${R.x} ${R.y}`} stroke="#8da3b8" strokeWidth="2" strokeDasharray="4 6" />
      <path d={`M${eye.x} ${eye.y} L${child.x} ${child.y}`} stroke="#e0703a" strokeWidth="2" />
      <circle cx={eye.x} cy={eye.y} r="9" fill="#3b2a1c" />
      <text x={eye.x + 16} y={eye.y + 6} className="pl-svg-small">
        peephole
      </text>
      <text x={L.x + 10} y={L.y + 6} className="pl-svg-small">
        far corner
      </text>
      <text x={R.x + 28} y={R.y + 6} className="pl-svg-small">
        near corner
      </text>
      <text x={plan(HALF, 3).x + 10} y={plan(HALF, 3).y + 6} className="pl-svg-small" style={{ fill: '#5c7a96' }}>
        how it looks
      </text>
      {/* The child, the same size wherever they stand. */}
      <circle cx={child.x} cy={child.y} r="11" fill="#e0703a" stroke="#1a1a1a" strokeWidth="2" data-child-r="11" />
    </>
  );
}

export function Ames({ step, broken, phase, record }: BenchProps) {
  const [t, setT] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useSvgDrag(
    svg,
    useCallback((x: number) => setT(amesT(x)), []),
  );
  const cx = -REACH + t * 2 * REACH;
  const foot = proj(cx, FLOOR, Z0);
  return (
    <Work
      label="The Ames room"
      figure={
        <Picture
          id="ames"
          step={step}
          broken={broken}
          label="The Ames room"
          drawing={
            broken ? (
              <svg viewBox="0 0 640 400" className="pl-svg" role="img" aria-label="The room seen from above: its back wall slants, so the left corner is much further from the peephole than the right corner. The child is the same size wherever they stand.">
                <AmesPlan cx={cx} />
              </svg>
            ) : (
              <svg ref={svg} viewBox="0 0 640 400" className="pl-svg pl-drag" role="img" aria-label="A room seen through a peephole: a back wall with two windows, a checkered floor, and a child you can move from the left corner to the right." {...drag}>
                <AmesView />
                <Child x={foot.x} y={foot.y} h={amesChildPx(cx)} />
              </svg>
            )
          }
        />
      }
      task={
        <>
          {step !== 'why' && (
            <Slider label="Move the child" value={Math.round(t * 100)} min={0} max={100} onChange={(v) => setT(v / 100)} valueText={t < 0.2 ? 'in the left corner' : t > 0.8 ? 'in the right corner' : 'in between'} />
          )}
          {phase === 'before' && (
            <Choices
              question="As the child crosses the room, do they seem to grow?"
              value={answer as 'yes' | 'no' | null}
              onChoose={(a) => {
                setAnswer(a);
                record('before', observed(a === 'yes' ? 'The child seemed to grow. They are the same size: the room is not.' : 'The child did not seem to grow for you.', a === 'yes' ? 1 : 0));
              }}
              options={[
                { id: 'yes', label: 'They grow' },
                { id: 'no', label: 'They stay the same' },
              ]}
            />
          )}
          {phase === 'after' && (
            <Choices
              question="From above, move the child again. Does the child change size?"
              value={after as 'same' | 'grows' | null}
              onChoose={(a) => {
                setAfter(a);
                record('after', observed(a === 'same' ? 'From above, the child stayed the same size: only their distance changed.' : 'From above, the child still seemed to change size for you.', a === 'same' ? 0 : 1));
              }}
              options={[
                { id: 'same', label: 'Same size' },
                { id: 'grows', label: 'They change' },
              ]}
            />
          )}
        </>
      }
    />
  );
}
