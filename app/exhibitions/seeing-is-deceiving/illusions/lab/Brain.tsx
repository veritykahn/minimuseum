'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { observed, stroopResult } from './results';
import { Choices, Slider, useSvgDrag, Work, type BenchProps } from './ui';

// ───────── 16. Stroop race ─────────

export const INKS = [
  { id: 'red', word: 'RED', ink: '#ef5350' },
  { id: 'blue', word: 'BLUE', ink: '#42a5f5' },
  { id: 'green', word: 'GREEN', ink: '#66bb6a' },
  { id: 'yellow', word: 'YELLOW', ink: '#ffee58' },
] as const;

/** Twelve items: the inks in a fixed shuffle; in Round 2 each word names a different colour from its ink. */
export const STROOP_INKS = [0, 2, 1, 3, 2, 0, 3, 1, 0, 3, 2, 1];
export const STROOP_WORDS = STROOP_INKS.map((ink, k) => (ink + 1 + (k % 3)) % 4);

type Round = 1 | 2 | 3;

export function Stroop({ broken, record }: BenchProps) {
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
    if (shown === 2 && next[1] !== undefined) record(stroopResult(next[1], t));
  };

  return (
    <Work
      label="Stroop race"
      figure={
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
      task={
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
          {!broken && round === 2 && !running && times[1] !== undefined && <p className="pl-say">Round 1: {times[1].toFixed(1)} s.</p>}
          {broken && times[3] !== undefined && <p className="pl-say">Round 3: {times[3].toFixed(1)} s.</p>}
          {!broken && times[2] !== undefined && (
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
      }
    />
  );
}

// ───────── 17. Paris in the the springtime ("Read the sign") ─────────

export const PHRASES = [
  [['PARIS'], ['IN', 'THE'], ['THE', 'SPRINGTIME']],
  [['ONCE'], ['IN', 'A'], ['A', 'LIFETIME']],
  [['A', 'BIRD'], ['IN', 'THE'], ['THE', 'HAND']],
];

export function Paris({ broken, record }: BenchProps) {
  const [n, setN] = useState(0);
  const [first, setFirst] = useState<'missed' | 'spotted' | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const lines = PHRASES[n];
  const wrong = '2-0';

  return (
    <Work
      label="Read the sign"
      figure={
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
                  >
                    {w}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )
      }
      task={
        broken ? (
          <p className="pl-say">On one line, the extra word stands out.</p>
        ) : (
          <>
            {n === 0 && (
              <Choices
                question="Read it out loud. What did it say?"
                value={first}
                onChoose={(a) => {
                  setFirst(a);
                  record(observed(a === 'missed' ? 'You read “Paris in the springtime” and missed the extra “the”.' : 'You spotted the extra word straight away.', a === 'missed' ? 1 : 0));
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
        )
      }
    />
  );
}

// ───────── 18. Rubin's vase, drawn for the museum ─────────

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

export function Rubin({ broken, record }: BenchProps) {
  const [first, setFirst] = useState<'vase' | 'faces' | null>(null);
  const [flip, setFlip] = useState<'yes' | 'no' | null>(null);
  const say = (f: 'vase' | 'faces' | null, x: 'yes' | 'no' | null) => {
    if (!f) return;
    record(observed(`You saw ${f === 'vase' ? 'the vase' : 'the faces'} first.${x ? (x === 'yes' ? ' You could flip it on purpose.' : ' It would not flip on purpose.') : ''}`, null));
  };
  return (
    <Work
      label="Rubin’s vase"
      figure={
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
      task={
        broken ? (
          <p className="pl-say">With eyes, the faces win. Can you still find the vase?</p>
        ) : (
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
        )
      }
    />
  );
}

// ───────── Bonus: the Ames room ─────────

export function Ames({ broken, record }: BenchProps) {
  const [t, setT] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useSvgDrag(
    svg,
    useCallback((x: number) => setT(Math.max(0, Math.min(1, (x - 160) / 320))), []),
  );
  const s = 0.5 + t * 0.85;
  const fx = 160 + t * 320;
  return (
    <Work
      label="The Ames room"
      figure={
        broken ? (
          <svg viewBox="0 0 640 400" className="pl-svg" role="img" aria-label="The room seen from above: its back wall slants, so the left corner is much further from the peephole than the right corner.">
            <rect width="640" height="400" fill="#f4f1ea" />
            <path d="M80 40 L560 200 L560 340 L80 340 Z" fill="#e6d7bd" stroke="#3b2a1c" strokeWidth="4" />
            <path d="M80 40 L320 380 L560 200" fill="none" stroke="#8da3b8" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="320" cy="380" r="9" fill="#3b2a1c" />
            <text x="336" y="388" className="pl-svg-small">peephole</text>
            <text x="90" y="30" className="pl-svg-small">far corner</text>
            <text x="500" y="190" className="pl-svg-small" textAnchor="end">near corner</text>
            <circle cx={80 + t * 480} cy={40 + t * 160 + 18} r="12" fill="#e0703a" />
          </svg>
        ) : (
          <svg ref={svg} viewBox="0 0 640 400" className="pl-svg pl-drag" role="img" aria-label="A room seen through a peephole: a back wall with a window, a tiled floor, and a child you can move from the left corner to the right." {...drag}>
            <rect width="640" height="400" fill="#cdb894" />
            <path d="M0 0 L120 60 L120 300 L0 400 Z" fill="#b89f78" />
            <path d="M640 0 L520 60 L520 300 L640 400 Z" fill="#b89f78" />
            <rect x="120" y="60" width="400" height="240" fill="#e6d7bd" />
            <rect x="280" y="110" width="80" height="90" fill="#a8d5e5" stroke="#3b2a1c" strokeWidth="5" />
            <path d="M320 110 V200 M280 155 H360" stroke="#3b2a1c" strokeWidth="3" />
            <path d="M120 300 L520 300 L640 400 L0 400 Z" fill="#7a5c3c" />
            {[0.25, 0.5, 0.75].map((k) => (
              <path key={k} d={`M${120 + 400 * k} 300 L${640 * k} 400`} stroke="#5e442b" strokeWidth="2" />
            ))}
            <path d="M60 350 H580" stroke="#5e442b" strokeWidth="2" />
            <g transform={`translate(${fx} ${300 + t * 8}) scale(${s})`}>
              <ellipse cx="0" cy="2" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
              <rect x="-14" y="-62" width="10" height="62" rx="4" fill="#2e4a7a" />
              <rect x="4" y="-62" width="10" height="62" rx="4" fill="#2e4a7a" />
              <rect x="-20" y="-118" width="40" height="62" rx="12" fill="#e0703a" />
              <circle cx="0" cy="-138" r="20" fill="#f2c9a0" />
              <path d="M-20 -146 q20 -22 40 0" fill="#5a3a1e" />
            </g>
          </svg>
        )
      }
      task={
        <>
          <Slider label="Move the child" value={Math.round(t * 100)} min={0} max={100} onChange={(v) => setT(v / 100)} valueText={t < 0.2 ? 'in the left corner' : t > 0.8 ? 'in the right corner' : 'in between'} />
          {!broken && (
            <Choices
              question="As the child crosses the room, do they seem to grow?"
              value={answer as 'yes' | 'no' | null}
              onChoose={(a) => {
                setAnswer(a);
                record(observed(a === 'yes' ? 'The child seemed to grow. They are the same size: the room is not.' : 'The child did not seem to grow for you.', a === 'yes' ? 1 : 0));
              }}
              options={[
                { id: 'yes', label: 'They grow' },
                { id: 'no', label: 'They stay the same' },
              ]}
            />
          )}
        </>
      }
    />
  );
}
