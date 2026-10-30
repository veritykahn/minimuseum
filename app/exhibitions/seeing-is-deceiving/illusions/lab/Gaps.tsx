'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { observed, troxlerResult } from './results';
import { Choices, Work, type BenchProps } from './ui';

// ───────── 11. Your blind spot ─────────

export function BlindSpot({ broken, record }: BenchProps) {
  const [mode, setMode] = useState<'dot' | 'line'>('dot');
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <Work
      label="Blind spot test"
      figure={
        <svg viewBox="0 0 800 300" className="pl-svg" role="img" aria-label={mode === 'dot' ? 'A cross on the left and a black dot on the right, on white.' : 'A cross on the left, and on the right a black line with a gap in it.'}>
          <rect width="800" height="300" fill="#fff" />
          <path d="M120 128 V172 M98 150 H142" stroke="#000" strokeWidth="6" />
          {mode === 'dot' ? (
            <circle cx="520" cy="150" r="24" fill="#000" />
          ) : (
            <g stroke="#000" strokeWidth="14">
              <line x1="380" y1="150" x2="496" y2="150" />
              <line x1="544" y1="150" x2="760" y2="150" />
            </g>
          )}
        </svg>
      }
      task={
        <>
          <div className="pl-choice-row" role="group" aria-label="Which test">
            <button type="button" className="pl-btn pl-choice" aria-pressed={mode === 'dot'} onClick={() => setMode('dot')}>
              The dot
            </button>
            <button type="button" className="pl-btn pl-choice" aria-pressed={mode === 'line'} onClick={() => setMode('line')}>
              The gap in the line
            </button>
          </div>
          {broken ? (
            <p className="pl-say">Open both eyes: the {mode === 'dot' ? 'dot is' : 'gap is'} back.</p>
          ) : mode === 'dot' ? (
            <Choices
              question="Close your left eye and look at the cross. Did the dot vanish?"
              value={answer as 'yes' | 'no' | null}
              onChoose={(a) => {
                setAnswer(a);
                record(observed(a === 'yes' ? 'You found your blind spot: the dot vanished, and your brain filled the hole.' : 'The dot did not vanish yet. Try moving slowly closer to the screen.', a === 'yes' ? 1 : 0.3));
              }}
              options={[
                { id: 'yes', label: 'It vanished!' },
                { id: 'no', label: 'Not yet' },
              ]}
            />
          ) : (
            <Choices
              question="Find your blind spot again. Does the gap close up, so the line looks whole?"
              value={answer as 'whole' | 'gap' | null}
              onChoose={(a) => {
                setAnswer(a);
                record(observed(a === 'whole' ? 'Your brain healed the gap: the line looked whole.' : 'The gap stayed for you.', a === 'whole' ? 1 : 0.4));
              }}
              options={[
                { id: 'whole', label: 'It looks whole' },
                { id: 'gap', label: 'I still see the gap' },
              ]}
            />
          )}
        </>
      }
    />
  );
}

// ───────── 12. Kanizsa triangle ─────────

const CORNERS = [
  { x: 0, y: -190 },
  { x: -165, y: 95 },
  { x: 165, y: 95 },
];
const inward = CORNERS.map((c) => (Math.atan2(-c.y, -c.x) * 180) / Math.PI);

function pacman(dir: number, r: number) {
  const P = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  return `M0 0 L${P(dir + 30)} A${r} ${r} 0 1 1 ${P(dir - 30)} Z`;
}

export function Kanizsa({ broken, record }: BenchProps) {
  const [turns, setTurns] = useState([2, 4, 3]);
  const [answer, setAnswer] = useState<string | null>(null);
  const lined = turns.every((t) => t % 6 === 0);
  const turn = (i: number) => setTurns(turns.map((t, k) => (k === i ? (t + 1) % 6 : t)));
  const key = (i: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      turn(i);
    }
  };
  return (
    <Work
      label="Kanizsa triangle"
      figure={
        <svg viewBox="-300 -270 600 500" className="pl-svg" role="img" aria-label="Three black discs, each with a slice cut out like a mouth.">
          <rect x="-300" y="-270" width="600" height="500" fill="#fff" />
          {CORNERS.map((c, i) => (
            <g
              key={i}
              transform={`translate(${c.x} ${c.y})`}
              role="button"
              tabIndex={0}
              aria-label={`Turn shape ${i + 1}`}
              className="pl-tap"
              onClick={() => turn(i)}
              onKeyDown={key(i)}
            >
              {broken ? <circle r="62" fill="#111" /> : <path d={pacman(inward[i] + turns[i] * 60, 62)} fill="#111" />}
            </g>
          ))}
        </svg>
      }
      task={
        broken ? (
          <p className="pl-say">The mouths are closed. Where did the triangle go?</p>
        ) : (
          <>
            <div className="pl-choice-row" role="group" aria-label="Turn the shapes">
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" className="pl-btn" onClick={() => turn(i)}>
                  Turn shape {i + 1}
                </button>
              ))}
            </div>
            {lined ? (
              <Choices
                question="Does the triangle look brighter than the white page around it?"
                value={answer as 'yes' | 'little' | 'no' | null}
                onChoose={(a) => {
                  setAnswer(a);
                  record(observed(a === 'no' ? 'The triangle looked the same white as the page, as it is. Did you see its edges?' : 'You saw a bright triangle with edges. There is no triangle there.', a === 'yes' ? 1 : a === 'little' ? 0.6 : 0.3));
                }}
                options={[
                  { id: 'yes', label: 'Yes, brighter' },
                  { id: 'little', label: 'A little' },
                  { id: 'no', label: 'No' },
                ]}
              />
            ) : (
              <p className="pl-say">Keep turning: point all three mouths to the middle.</p>
            )}
          </>
        )
      }
    />
  );
}

// ───────── 13. Troxler fading ─────────

const BLOBS = ['#e7a7c9', '#9fc3e8', '#a8dcb0', '#efd98f', '#c9b2e6', '#f2b79a'];

export function Troxler({ broken, record }: BenchProps) {
  const [t, setT] = useState<number | null>(null);
  const [nudge, setNudge] = useState(0);
  const start = useRef(0);

  const running = t !== null;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setT((performance.now() - start.current) / 1000), 250);
    return () => window.clearInterval(id);
  }, [running]);

  // Break it: the ring jumps a little every few seconds.
  useEffect(() => {
    if (!broken) return;
    const id = window.setInterval(() => setNudge((n) => n + 1), 2000);
    return () => window.clearInterval(id);
  }, [broken]);

  const dx = broken ? (nudge % 2 ? 10 : -10) : 0;
  const done = (faded: boolean) => {
    record(troxlerResult(faded && t !== null ? t : null));
    setT(null);
  };

  return (
    <Work
      label="Troxler fading"
      figure={
        <svg viewBox="0 0 400 400" className="pl-svg pl-square" role="img" aria-label="Soft pale patches of colour in a ring on grey, with a small black dot in the middle.">
          <defs>
            <filter id="pl-fog" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>
          <rect width="400" height="400" fill="#c8c8c8" />
          <g transform={`translate(${dx} 0)`}>
            {BLOBS.map((c, k) => {
              const a = (k / BLOBS.length) * Math.PI * 2;
              return <circle key={k} cx={200 + 130 * Math.cos(a)} cy={200 + 130 * Math.sin(a)} r="40" fill={c} filter="url(#pl-fog)" />;
            })}
          </g>
          <circle cx="200" cy="200" r="5" fill="#000" />
        </svg>
      }
      task={
        broken ? (
          <p className="pl-say">Stare at the dot again. The colours jump a little every two seconds: do they still fade?</p>
        ) : t === null ? (
          <button
            type="button"
            className="pl-btn pl-btn-primary"
            onClick={() => {
              start.current = performance.now();
              setT(0);
            }}
          >
            Start the timer, and stare at the dot
          </button>
        ) : (
          <>
            <p className="pl-count" aria-live="off">
              Staring… <strong>{Math.floor(t)}</strong> s
            </p>
            <div className="pl-choice-row">
              <button type="button" className="pl-btn pl-btn-primary" onClick={() => done(true)}>
                It faded!
              </button>
              <button type="button" className="pl-btn" onClick={() => done(false)}>
                It isn’t fading
              </button>
            </div>
          </>
        )
      }
    />
  );
}
