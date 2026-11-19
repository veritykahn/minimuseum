'use client';

import { useCallback, useRef, useState } from 'react';
import { ebbinghausResult, mullerLyerResult, observed, ponzoResult } from './results';
import { Choices, Explain, ExplainPath, ExplainText, Picture, RecordFor, Slider, useSvgDrag, Work, type BenchProps } from './ui';

/*
 * Size and length. Each measurement carries from Try it into Break it: the
 * visitor starts Break it where they left Try it, switches the trick off,
 * and measures again. On Why? each drawing shows the truth over itself:
 * measuring brackets, outlines and guide lines.
 */

// ───────── Müller-Lyer, Brentano's form: one line, three arrowheads ─────────

const L = 70;
const R = 530;
/** Fins 36° off the line, all the same length. */
const FIN = 34;
const FX = FIN * Math.cos(Math.PI / 5);
const FY = FIN * Math.sin(Math.PI / 5);
const LINE_Y = 90;

export function MullerLyer({ step, broken, explain, phase, record }: BenchProps) {
  const [m, setM] = useState(0.32);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useSvgDrag(
    svg,
    useCallback((x: number) => setM(Math.max(0.05, Math.min(0.95, (x - L) / (R - L)))), []),
  );
  const mx = L + m * (R - L);
  // Why?: the middle fin sits at the true middle; the marker stays where the visitor put it.
  const fin = explain ? (L + R) / 2 : mx;
  const top = LINE_Y - FY - 16;
  return (
    <Work
      label="The Müller-Lyer line"
      figure={
        <Picture
          id="muller-lyer"
          step={step}
          broken={broken}
          label="The Müller-Lyer line"
          drawing={
            <svg
              ref={svg}
              viewBox="0 0 600 200"
              className={explain ? 'pl-svg' : 'pl-svg pl-drag'}
              role="img"
              aria-label={
                explain
                  ? 'The line with its middle arrowhead at the true middle, and a bracket over each half showing the two halves are the same length. The orange marker shows where you put the middle.'
                  : 'A long line with three arrowheads: one at each end and one in the middle, which you move with the orange marker beneath the line.'
              }
              {...(explain ? {} : drag)}
            >
              <rect width="600" height="200" fill="#f4f1ea" />
              <g stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={`M${L} ${LINE_Y} H${R}`} />
                {!broken && (
                  <>
                    <path d={`M${L + FX} ${LINE_Y - FY} L${L} ${LINE_Y} L${L + FX} ${LINE_Y + FY}`} />
                    <path d={`M${fin - FX} ${LINE_Y - FY} L${fin} ${LINE_Y} L${fin - FX} ${LINE_Y + FY}`} />
                    <path d={`M${R + FX} ${LINE_Y - FY} L${R} ${LINE_Y} L${R + FX} ${LINE_Y + FY}`} />
                  </>
                )}
              </g>
              {/* The marker sits below the line, clear of the fins: a thin tick up to the point it marks. */}
              <path d={`M${mx} ${LINE_Y + FY + 10} V${LINE_Y + FY + 34}`} stroke="#e0703a" strokeWidth="3" />
              <path d={`M${mx} ${LINE_Y + FY + 30} l-16 26 h32 Z`} fill="#e0703a" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
              {explain && (
                <Explain id="muller-lyer">
                  <ExplainPath d={`M${L} ${top} v-14 M${L} ${top - 7} H${fin - 5} M${fin - 5} ${top} v-14 M${fin + 5} ${top} v-14 M${fin + 5} ${top - 7} H${R} M${R} ${top} v-14`} />
                  <ExplainText x={(L + fin) / 2} y={top - 20}>
                    same length
                  </ExplainText>
                  <ExplainText x={(fin + R) / 2} y={top - 20}>
                    same length
                  </ExplainText>
                  <ExplainText x={mx} y={194} size={17}>
                    your middle
                  </ExplainText>
                </Explain>
              )}
            </svg>
          }
        />
      }
      task={
        phase && (
          <>
            <Slider label="Move the middle" value={Math.round(m * 1000)} min={50} max={950} big={10} onChange={(v) => setM(v / 1000)} valueText="Set it where both halves look the same length" />
            <RecordFor phase={phase} onRecord={(p) => record(p, mullerLyerResult(m))} />
          </>
        )
      }
    />
  );
}

// ───────── Ebbinghaus circles ─────────

export const EBB_TRUTH = 34;

export function Ebbinghaus({ step, broken, explain, phase, record }: BenchProps) {
  const [r, setR] = useState(24);
  const rings = broken ? 0.08 : 1;
  // Why?: the right circle at its true size, both outlined the same.
  const rr = explain ? EBB_TRUTH : r;
  return (
    <Work
      label="Ebbinghaus circles"
      figure={
        <Picture
          id="ebbinghaus"
          step={step}
          broken={broken}
          label="Ebbinghaus circles"
          drawing={
            <svg
              viewBox="0 0 640 320"
              className="pl-svg"
              role="img"
              aria-label={
                explain
                  ? 'The two orange circles, each outlined with the same dashed ring: they are exactly the same size.'
                  : 'Two orange circles. The left one is ringed by six big gray circles; the right one, whose size you set, by eight small gray circles.'
              }
            >
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
              <circle cx="480" cy="160" r={rr} fill="#e0703a" />
              {explain && (
                <Explain id="ebbinghaus">
                  {[160, 480].map((cx) => (
                    <ExplainPath key={cx} d={`M${cx - EBB_TRUTH - 6} 160 a${EBB_TRUTH + 6} ${EBB_TRUTH + 6} 0 1 0 ${2 * (EBB_TRUTH + 6)} 0 a${EBB_TRUTH + 6} ${EBB_TRUTH + 6} 0 1 0 ${-2 * (EBB_TRUTH + 6)} 0 M${cx - EBB_TRUTH} 160 H${cx + EBB_TRUTH}`} dash="8 6" />
                  ))}
                  <ExplainText x={320} y={300}>
                    same size
                  </ExplainText>
                </Explain>
              )}
            </svg>
          }
        />
      }
      task={
        phase && (
          <>
            <Slider label="Right circle’s size" value={r * 2} min={28} max={100} onChange={(v) => setR(v / 2)} />
            <RecordFor phase={phase} onRecord={(p) => record(p, ebbinghausResult(r, EBB_TRUTH))} />
            {phase === 'before' && <p className="pl-tip">Ask a grown-up to try this one too. Who got closer?</p>}
          </>
        )
      }
    />
  );
}

// ───────── Ponzo railway ─────────

export const PONZO_TRUTH = 140;

export function Ponzo({ step, broken, explain, phase, record }: BenchProps) {
  // The bars start the same length: there is nothing to see but the illusion.
  const [w, setW] = useState(PONZO_TRUTH);
  const [y, setY] = useState(110);
  const ties = [0.04, 0.12, 0.22, 0.34, 0.48, 0.64, 0.82];
  // Why?: the top bar at its true length, with guide lines down to the bottom bar's ends.
  const tw = explain ? PONZO_TRUTH : w;
  return (
    <Work
      label="Ponzo railway"
      figure={
        <Picture
          id="ponzo"
          step={step}
          broken={broken}
          label="Ponzo railway"
          drawing={
            <svg
              viewBox="0 0 600 400"
              className="pl-svg"
              role="img"
              aria-label={
                explain
                  ? 'The two red bars on the railway, with straight guide lines joining their ends: the bars are exactly the same length.'
                  : 'Railway tracks running away into the distance, with two red bars across them: one near the bottom, and one you can move and stretch further up.'
              }
            >
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
              <rect x={300 - tw / 2} y={y} width={tw} height="14" fill="#c0392b" />
              {explain && (
                <Explain id="ponzo">
                  <ExplainPath d={`M${300 - PONZO_TRUTH / 2} ${y - 6} V342 M${300 + PONZO_TRUTH / 2} ${y - 6} V342`} dash="8 7" />
                  <ExplainText x={300} y={y - 14}>
                    same length
                  </ExplainText>
                </Explain>
              )}
            </svg>
          }
        />
      }
      task={
        phase && (
          <>
            <Slider label="Top bar’s length" value={w} min={60} max={240} onChange={setW} />
            <Slider label="Slide it up or down the tracks" value={300 - y} min={0} max={250} onChange={(v) => setY(300 - v)} />
            <RecordFor phase={phase} onRecord={(p) => record(p, ponzoResult(w, PONZO_TRUTH))} />
          </>
        )
      }
    />
  );
}

// ───────── Jastrow ─────────

function arcShape(cx: number, cy: number) {
  const pt = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  };
  return `M${pt(220, -120)} A220 220 0 0 1 ${pt(220, -60)} L${pt(140, -60)} A140 140 0 0 0 ${pt(140, -120)} Z`;
}

/** One curved edge of the shape: its inside (r 140) or outside (r 220). */
function arcEdge(cx: number, cy: number, r: number) {
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  };
  return `M${pt(-120)} A${r} ${r} 0 0 1 ${pt(-60)}`;
}

type Bigger = 'top' | 'bottom' | 'same';

export function Jastrow({ step, broken, explain, phase, record }: BenchProps) {
  const [drop, setDrop] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [answer, setAnswer] = useState<Bigger | null>(null);
  const [after, setAfter] = useState<'yes' | 'no' | null>(null);
  // Why?: apart, so the edges side by side show; stacked when the trick is off.
  const d = broken ? 100 : explain ? 0 : drop;
  const [cTop, cBottom] = swapped ? ['#2e86c1', '#e0703a'] : ['#e0703a', '#2e86c1'];
  return (
    <Work
      label="Jastrow curves"
      figure={
        <Picture
          id="jastrow"
          step={step}
          broken={broken}
          label="Jastrow curves"
          drawing={
            <svg
              viewBox="0 -10 600 240"
              className="pl-svg"
              role="img"
              aria-label={
                explain
                  ? broken
                    ? 'The two curved shapes stacked: they fit exactly.'
                    : 'The two curved shapes, one above the other, with the short inside edge of the top one and the long outside edge of the bottom one marked: those two edges sit side by side.'
                  : 'Two curved shapes, one above the other, like slices of a ring.'
              }
            >
              <rect y="-10" width="600" height="240" fill="#f4f1ea" />
              {/* bottom shape, then top shape (which slides down onto it) */}
              <path d={arcShape(300, 330)} fill={cBottom} />
              <path d={arcShape(300, 330)} transform={`translate(0 ${d - 100})`} fill={cTop} opacity={d > 0 ? 0.85 : 1} />
              {explain && (
                <Explain id="jastrow">
                  {broken ? (
                    <ExplainText x={300} y={170}>
                      they fit exactly
                    </ExplainText>
                  ) : (
                    <>
                      <g transform="translate(0 -100)">
                        <ExplainPath d={arcEdge(300, 330, 140)} width={7} />
                      </g>
                      <ExplainPath d={arcEdge(300, 330, 220)} width={7} />
                      <ExplainText x={300} y={74}>
                        short edge
                      </ExplainText>
                      <ExplainText x={300} y={144}>
                        long edge
                      </ExplainText>
                    </>
                  )}
                </Explain>
              )}
            </svg>
          }
        />
      }
      task={
        phase === 'before' ? (
          <>
            <Choices
              question="Which shape looks bigger?"
              value={answer}
              onChoose={(a) => {
                setAnswer(a);
                record(
                  'before',
                  a === 'same'
                    ? observed('You saw the two shapes as the same size.', 0)
                    : observed(`The ${a} shape looked bigger to you.`, a === 'bottom' ? 1 : 0.6),
                );
              }}
              options={[
                { id: 'top', label: 'The top one' },
                { id: 'bottom', label: 'The bottom one' },
                { id: 'same', label: 'The same' },
              ]}
            />
            {/* The test comes after the guess: the slider waits for an answer, so the eyes answer first. */}
            {answer && <Slider label="Slide the top one down" value={drop} min={0} max={100} onChange={setDrop} />}
            {answer && drop >= 95 && (
              // REVIEW: new text.
              <p className="pl-say" aria-live="polite">
                One on top of the other, they fit exactly: the two shapes are the same size.{answer === 'same' ? ' Your eyes were right.' : ' Your eyes were fooled.'}
              </p>
            )}
            <button type="button" className="pl-btn" onClick={() => setSwapped(!swapped)}>
              Swap their colors
            </button>
          </>
        ) : phase === 'after' ? (
          <Choices
            question="Stacked, do they fit exactly?"
            value={after}
            onChoose={(a) => {
              setAfter(a);
              record('after', observed(a === 'yes' ? 'Stacked, the two shapes fit exactly.' : 'Even stacked, one still looked bigger to you.', a === 'yes' ? 0 : 1));
            }}
            options={[
              { id: 'yes', label: 'Yes, exactly' },
              { id: 'no', label: 'One still looks bigger' },
            ]}
          />
        ) : null
      }
    />
  );
}
