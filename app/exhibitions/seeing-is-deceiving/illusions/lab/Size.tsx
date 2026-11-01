'use client';

import { useCallback, useRef, useState } from 'react';
import { ebbinghausResult, mullerLyerResult, observed, ponzoResult } from './results';
import { Choices, Record, Slider, useSvgDrag, Work, type BenchProps } from './ui';

// ───────── 4. Müller-Lyer, Brentano's form: one line, three arrowheads ─────────

const L = 60;
const R = 540;
const FX = 24.6;
const FY = 17.2;

export function MullerLyer({ broken, record }: BenchProps) {
  const [m, setM] = useState(0.32);
  const [m2, setM2] = useState(0.68);
  const first = useRef<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const cur = broken ? m2 : m;
  const set = broken ? setM2 : setM;
  const drag = useSvgDrag(
    svg,
    useCallback((x: number) => set(Math.max(0.05, Math.min(0.95, (x - L) / (R - L)))), [set]),
  );
  const mx = L + cur * (R - L);
  return (
    <Work
      label="The Müller-Lyer line"
      figure={
        <svg ref={svg} viewBox="0 0 600 200" className="pl-svg pl-drag" role="img" aria-label="A long line with three arrowheads: one at each end and one you can move along it." {...drag}>
          <rect width="600" height="200" fill="#f4f1ea" />
          <g stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d={`M${L} 100 H${R}`} />
            {!broken && (
              <>
                <path d={`M${L + FX} ${100 - FY} L${L} 100 L${L + FX} ${100 + FY}`} />
                <path d={`M${mx - FX} ${100 - FY} L${mx} 100 L${mx - FX} ${100 + FY}`} />
                <path d={`M${R + FX} ${100 - FY} L${R} 100 L${R + FX} ${100 + FY}`} />
              </>
            )}
          </g>
          <circle cx={mx} cy="100" r="13" fill="#e0703a" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      }
      task={
        <>
          <Slider label="Move the middle" value={Math.round(cur * 1000)} min={50} max={950} big={10} onChange={(v) => set(v / 1000)} valueText="Drag until both halves look the same length" />
          <Record
            onClick={() => {
              if (!broken) first.current = m;
              record(mullerLyerResult(first.current ?? m, broken ? m2 : undefined));
            }}
          >
            {broken ? 'Write both in my notebook' : 'Write it in my notebook'}
          </Record>
        </>
      }
    />
  );
}

// ───────── 5. Ebbinghaus circles ─────────

export const EBB_TRUTH = 34;

export function Ebbinghaus({ broken, record }: BenchProps) {
  const [r, setR] = useState(24);
  const rings = broken ? 0.08 : 1;
  return (
    <Work
      label="Ebbinghaus circles"
      figure={
        <svg viewBox="0 0 640 320" className="pl-svg" role="img" aria-label="Two orange circles. The left one is ringed by six big gray circles; the right one, whose size you set, by eight small gray circles.">
          <rect width="640" height="320" fill="#f4f1ea" />
          <g fill="#9aa3ad" opacity={rings}>
            {Array.from({ length: 6 }, (_, k) => {
              const a = (k / 6) * Math.PI * 2;
              return <circle key={k} cx={160 + 104 * Math.cos(a)} cy={160 + 104 * Math.sin(a)} r="46" />;
            })}
            {Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2;
              return <circle key={k} cx={480 + 64 * Math.cos(a)} cy={160 + 64 * Math.sin(a)} r="12" />;
            })}
          </g>
          <circle cx="160" cy="160" r={EBB_TRUTH} fill="#e0703a" />
          <circle cx="480" cy="160" r={r} fill="#e0703a" />
        </svg>
      }
      task={
        <>
          <Slider label="Right circle’s size" value={r * 2} min={28} max={100} onChange={(v) => setR(v / 2)} />
          {!broken && <Record onClick={() => record(ebbinghausResult(r, EBB_TRUTH))} />}
          <p className="pl-tip">Ask a grown-up to try this one too. Who got closer?</p>
        </>
      }
    />
  );
}

// ───────── 6. Ponzo railway ─────────

export const PONZO_TRUTH = 140;

export function Ponzo({ broken, record }: BenchProps) {
  const [w, setW] = useState(170);
  const [y, setY] = useState(110);
  const ties = [0.04, 0.12, 0.22, 0.34, 0.48, 0.64, 0.82];
  return (
    <Work
      label="Ponzo railway"
      figure={
        <svg viewBox="0 0 600 400" className="pl-svg" role="img" aria-label="Railway tracks running away into the distance, with two red bars across them: one near the bottom, and one you can move and stretch further up.">
          <rect width="600" height="400" fill="#f4f1ea" />
          {!broken && (
            <g stroke="#3b2a1c" strokeWidth="4">
              <line x1="140" y1="400" x2="276" y2="0" />
              <line x1="460" y1="400" x2="324" y2="0" />
              {ties.map((t) => {
                const yy = 400 * (1 - t);
                const half = 24 + (160 - 24) * (1 - t);
                return <line key={t} x1={300 - half - 14} y1={yy} x2={300 + half + 14} y2={yy} strokeWidth="3" opacity="0.7" />;
              })}
            </g>
          )}
          <rect x={300 - PONZO_TRUTH / 2} y="322" width={PONZO_TRUTH} height="14" fill="#c0392b" />
          <rect x={300 - w / 2} y={y} width={w} height="14" fill="#c0392b" />
        </svg>
      }
      task={
        <>
          <Slider label="Top bar’s length" value={w} min={60} max={240} onChange={setW} />
          <Slider label="Slide it up or down the tracks" value={300 - y} min={0} max={250} onChange={(v) => setY(300 - v)} />
          {!broken && <Record onClick={() => record(ponzoResult(w, PONZO_TRUTH))} />}
        </>
      }
    />
  );
}

// ───────── 7. Jastrow ─────────

function arcShape(cx: number, cy: number) {
  const pt = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  };
  return `M${pt(220, -120)} A220 220 0 0 1 ${pt(220, -60)} L${pt(140, -60)} A140 140 0 0 0 ${pt(140, -120)} Z`;
}

export function Jastrow({ broken, record }: BenchProps) {
  const [drop, setDrop] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [answer, setAnswer] = useState<'top' | 'bottom' | 'same' | null>(null);
  const d = broken ? 100 : drop;
  const [cTop, cBottom] = swapped ? ['#2e86c1', '#e0703a'] : ['#e0703a', '#2e86c1'];
  return (
    <Work
      label="Jastrow curves"
      figure={
        <svg viewBox="0 -10 600 240" className="pl-svg" role="img" aria-label="Two curved shapes, one above the other, like slices of a ring.">
          <rect y="-10" width="600" height="240" fill="#f4f1ea" />
          {/* bottom shape, then top shape (which slides down onto it) */}
          <path d={arcShape(300, 330)} fill={cBottom} />
          <path d={arcShape(300, 330)} transform={`translate(0 ${d - 100})`} fill={cTop} opacity={d > 0 ? 0.85 : 1} />
        </svg>
      }
      task={
        <>
          {!broken && (
            <Choices
              question="Which shape looks bigger?"
              value={answer}
              onChoose={(a) => {
                setAnswer(a);
                record(
                  a === 'same'
                    ? observed('You saw the two shapes as the same size.', 0)
                    : observed(`The ${a} shape looked bigger to you. They are exactly the same.`, a === 'bottom' ? 1 : 0.6),
                );
              }}
              options={[
                { id: 'top', label: 'The top one' },
                { id: 'bottom', label: 'The bottom one' },
                { id: 'same', label: 'The same' },
              ]}
            />
          )}
          {!broken && <Slider label="Slide the top one down" value={drop} min={0} max={100} onChange={setDrop} />}
          <button type="button" className="pl-btn" onClick={() => setSwapped(!swapped)}>
            Swap them
          </button>
        </>
      }
    />
  );
}
