'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Celebrate from '../Celebrate';
import { BRISTOL_CLOCK, BRISTOL_TRAIN, MAP_TOWNS, PLYMOUTH, POSTER, RAIL_STEPS, STATION_JOB, STATIONS, TRAIN_PUZZLES, type RailStepId } from './inventionsText';
import { RAIL_FACTS } from './sources';
import { CardFoot, StepDots } from './Steps';
import { MAP, catchTrain, clockTime, dragMinute, hands, project, sunX } from './workshop';
import './railway.css';

/*
 * The railway bench, in five steps, each on one screen and each laid out
 * its own way, under one ribbon (the step, its words and its task) and over
 * one foot (Back, "Did you know?", Next). The towns are those of the Great
 * Western line in its 1841 timetable, and Plymouth.
 *
 * 1. Noon moves west: London's big clock, a wide map and a noon book. Drag
 *    the Sun west (or play it): the clocks tick on smoothly, each town's
 *    face hidden until noon reaches it, and the book writes down what
 *    London's clock said when it did.
 * 2. Your watch says London time: a wide strip of the line, the train
 *    steaming along it town by town; under it, your pocket watch and the
 *    town's clock side by side, and how far behind the town is.
 * 3. Will you catch the train? A platform: the town clock on its tower, the
 *    departure board, the train. Count on the town's minutes to find
 *    London time, then say whether you'll catch it: it waits, or it goes.
 * 4. You're the stationmaster: the job explained first; then a telegram
 *    with London time, the station clocks along the line still on their
 *    towns' times, and a winding key: work out how many minutes each clock
 *    needs, and wind it on.
 * 5. A clock with two minute hands: Bristol's Exchange clock. Set the red
 *    hand to London time, turn the black hand back to Bristol's own, then
 *    wind the clock on until your train leaves by the red hand.
 *
 * Few words; the notes, each with its source, open from "Did you know?".
 * Every drag has keys or buttons too, and under reduced motion nothing
 * slides or sweeps: the hands and the train move in plain steps.
 */

const NOON = 12 * 60;
const SUN_MIN = NOON;
const SUN_MAX = NOON + 17;
/** On a phone, the maps are cropped to the towns, so they read larger. */
const NARROW = '(max-width: 760px)';
const subscribe = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(NARROW);
  mql.addEventListener?.('change', onChange);
  return () => mql.removeEventListener?.('change', onChange);
};
const narrowNow = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(NARROW).matches;
const r2 = (n: number) => Math.round(n * 100) / 100;
const stationOf = (name: string) => STATIONS.find((s) => s.name === name)!;
const half = (m: number) => String(m).replace('.5', '½');
const minutesWords = (m: number) => `${half(m)} minute${m === 1 ? '' : 's'}`;
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * The game's journey: when the train reaches each station by your watch
 * (London time), leaving London at ten. The times are the room's own, for
 * the game, not a timetable's.
 */
const ARRIVE = [10 * 60, 10 * 60 + 40, 11 * 60 + 10, 11 * 60 + 50, 12 * 60 + 10, 12 * 60 + 25, 13 * 60 + 15];

/* ───────── The map ───────── */

/** Where each town's clock hangs on the noon map, beside the town and joined to it by a line. */
const BADGE: Record<string, { x: number; y: number }> = {
  London: { x: 880, y: 96 },
  Reading: { x: 730, y: 318 },
  Steventon: { x: 716, y: 96 },
  Chippenham: { x: 552, y: 96 },
  Bath: { x: 510, y: 340 },
  Bristol: { x: 388, y: 96 },
  Bridgewater: { x: 330, y: 392 },
  Plymouth: { x: 130, y: 410 },
};

/** Where each town's name sits by its dot on the journey's strip (below and centred, unless said), clear of its neighbours and of the line. */
const LABEL: Record<string, { dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' }> = {
  Steventon: { dy: -18 },
  Chippenham: { dx: -4, dy: -16 },
  Bristol: { dx: -16, dy: 8, anchor: 'end' },
  Bath: { dx: -2, dy: 34 },
};

/** The coast of the south of England and Wales, as longitude and latitude, round from mid Wales. */
const COAST: [number, number][] = [
  [-4.1, 52.9], [-4.05, 52.54], [-4.09, 52.41], [-4.36, 52.21], [-4.68, 52.1], [-5.07, 52.03], [-5.31, 51.9], [-5.1, 51.77], [-5.17, 51.68], [-5.0, 51.7], [-4.7, 51.67],
  [-4.55, 51.74], [-4.25, 51.68], [-4.33, 51.56], [-3.98, 51.57], [-3.93, 51.62], [-3.8, 51.58], [-3.7, 51.48], [-3.27, 51.39], [-3.16, 51.46], [-2.95, 51.55], [-2.67, 51.64],
  [-2.45, 51.72], [-2.66, 51.56], [-2.7, 51.5], [-2.77, 51.49], [-2.86, 51.44], [-2.98, 51.35], [-3.01, 51.24], [-3.13, 51.21], [-3.47, 51.21], [-3.83, 51.23], [-4.12, 51.21],
  [-4.2, 51.19], [-4.23, 51.13], [-4.24, 51.04], [-4.53, 51.02], [-4.55, 50.83], [-4.75, 50.67], [-4.94, 50.55], [-5.08, 50.42], [-5.21, 50.32], [-5.48, 50.21], [-5.7, 50.13],
  [-5.71, 50.07], [-5.54, 50.08], [-5.2, 49.96], [-5.07, 50.15], [-4.8, 50.22], [-4.64, 50.33], [-4.45, 50.35], [-4.22, 50.31], [-4.14, 50.36], [-3.87, 50.22], [-3.64, 50.22],
  [-3.58, 50.35], [-3.52, 50.45], [-3.5, 50.55], [-3.41, 50.62], [-3.24, 50.68], [-2.94, 50.72], [-2.76, 50.71], [-2.45, 50.52], [-2.45, 50.61], [-2.06, 50.58], [-1.95, 50.68],
  [-1.55, 50.71], [-1.4, 50.85], [-1.08, 50.78], [-0.79, 50.73], [-0.37, 50.81], [-0.14, 50.82], [0.24, 50.74], [0.58, 50.85], [0.97, 50.91], [1.2, 51.05], [1.2, 51.38],
  [1.02, 51.36], [0.75, 51.44], [0.37, 51.44], [0.2, 51.47], [0.58, 51.52], [0.71, 51.53], [0.95, 51.6], [1.2, 51.7], [1.2, 52.9],
];
const WIGHT: [number, number][] = [[-1.58, 50.66], [-1.3, 50.77], [-1.08, 50.7], [-1.17, 50.59], [-1.31, 50.58]];
const pathOf = (pts: [number, number][]) => pts.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).x} ${project(lon, lat).y}`).join(' ') + 'Z';
const COAST_D = pathOf(COAST);
const WIGHT_D = pathOf(WIGHT);
/** Swindon: no stop of the bench's, but the line bends through it between Steventon and Chippenham. */
const SWINDON = project(-1.78, 51.56);
const STOPS = STATIONS.map((s) => project(s.lon, s.lat));
const LINE_D = STOPS.flatMap((p, i) => (i === 3 ? [SWINDON, p] : [p]))
  .map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`)
  .join(' ');

/** Where the train is at a place `p` along the line (0 London, 1 Reading … 6 Bridgewater), bending through Swindon. */
export function trainAt(p: number) {
  const last = STOPS.length - 1;
  const q = clamp(p, 0, last);
  const i = Math.min(Math.floor(q), last - 1);
  const f = q - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  if (i === 2) {
    const [from, to, g] = f < 0.5 ? [a, SWINDON, f * 2] : [SWINDON, b, (f - 0.5) * 2];
    return { x: r2(from.x + (to.x - from.x) * g), y: r2(from.y + (to.y - from.y) * g) };
  }
  return { x: r2(a.x + (b.x - a.x) * f), y: r2(a.y + (b.y - a.y) * f) };
}

/** Your watch on the journey: London time at a place `p` along the line, ticking on between stations. */
export function watchAt(p: number) {
  const q = clamp(p, 0, ARRIVE.length - 1);
  const i = Math.min(Math.floor(q), ARRIVE.length - 2);
  return ARRIVE[i] + (ARRIVE[i + 1] - ARRIVE[i]) * (q - i);
}

/** The Sun's stops over the map: one for each number of minutes behind (Bath and Bristol share one), east to west. */
const SUN_STOPS = [...new Set(MAP_TOWNS.map((t) => t.behind))].sort((a, z) => a - z).map((b) => ({ b, x: sunX(NOON + b, MAP_TOWNS) }));

/** The London time, to the moment, at which the Sun stands over `x` on the map: sunX turned round, so the Sun drags smoothly. */
export function londonTimeUnderSun(x: number) {
  const pts = SUN_STOPS;
  if (x >= pts[0].x) return NOON + pts[0].b;
  for (let i = 1; i < pts.length; i++) {
    if (x >= pts[i].x) {
      const f = (pts[i - 1].x - x) / (pts[i - 1].x - pts[i].x);
      return NOON + pts[i - 1].b + f * (pts[i].b - pts[i - 1].b);
    }
  }
  return SUN_MAX;
}

/** The towns whose noon came between two London times (after `from`, up to and with `to`), east to west. */
export function noonBetween(from: number, to: number) {
  return MAP_TOWNS.filter((t) => NOON + t.behind > from + 1e-6 && NOON + t.behind <= to + 1e-6);
}

/** A pointer's place in an SVG's own drawing units. */
function svgPoint(svg: SVGSVGElement | null, e: ReactPointerEvent) {
  const m = svg?.getScreenCTM?.();
  if (!svg || !m) return null;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(m.inverse());
}

/* ───────── The bench ───────── */

const NOT_DONE: Record<RailStepId, boolean> = { sun: false, journey: false, catch: false, set: false, bristol: false };

export default function Railway({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const [done, setDone] = useState(NOT_DONE);
  const narrow = useSyncExternalStore(subscribe, narrowNow, () => false);
  const id = RAIL_STEPS[step].id;
  const s = RAIL_STEPS[step];
  const cheer = useCallback(() => setBurst((b) => b + 1), []);
  // One steady "done" for each step, so a step's timers are not set up again at every turn.
  const finish = useMemo(() => Object.fromEntries(RAIL_STEPS.map((x) => [x.id, () => setDone((d) => (d[x.id] ? d : { ...d, [x.id]: true }))])) as Record<RailStepId, () => void>, []);

  const goStep = (i: number) => {
    const to = clamp(i, 0, RAIL_STEPS.length - 1);
    setStep(to);
    setStatus(`Step ${to + 1}: ${RAIL_STEPS[to].title}.`);
  };

  const common = { reduced, say: setStatus, cheer, burst };
  return (
    <div className="vbi-bench vbi-railway vrw" data-step={id}>
      <header className="vrw-head">
        <div className="vrw-head-top">
          <h2 className="vbi-step-title">{s.title}</h2>
          <StepDots steps={RAIL_STEPS} at={step} done={(i) => done[RAIL_STEPS[i].id]} onGo={goStep} label="Railway time, step by step" />
        </div>
        <div className="vrw-head-words">
          <p className="vbi-step-body">{s.body}</p>
          <p className="vbi-task">
            <span className="vbi-task-mark" aria-hidden="true">
              ▸
            </span>{' '}
            {s.task}
          </p>
        </div>
      </header>

      <div className="vrw-stage">
        {id === 'sun' && <SunStep {...common} narrow={narrow} onDone={finish.sun} />}
        {id === 'journey' && <JourneyStep {...common} narrow={narrow} onDone={finish.journey} />}
        {id === 'catch' && <CatchStep {...common} onDone={finish.catch} />}
        {id === 'set' && <StationmasterStep {...common} onDone={finish.set} />}
        {id === 'bristol' && <BristolStep {...common} onDone={finish.bristol} />}
      </div>

      <div className="vrw-foot">
        <CardFoot at={step} count={RAIL_STEPS.length} onGo={goStep} facts={RAIL_FACTS[id]} poster={id === 'bristol' ? POSTER.growth : undefined} reset={step} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

type StepProps = { reduced: boolean; say: (s: string) => void; cheer: () => void; burst: number; onDone: () => void };

/** A timer of the step's own, cleared when the step closes. */
function useTimer() {
  const timer = useRef<number | null>(null);
  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => stop, [stop]);
  const start = useCallback(
    (fn: () => void, ms: number) => {
      stop();
      timer.current = window.setInterval(fn, ms);
    },
    [stop],
  );
  return { start, stop };
}

/* ───────── 1. Noon moves west ───────── */

function SunStep({ reduced, narrow, say, cheer, burst, onDone }: StepProps & { narrow: boolean }) {
  const [t, setT] = useState(SUN_MIN);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const [moved, setMoved] = useState(false);
  const tRef = useRef(SUN_MIN);
  const svg = useRef<SVGSVGElement>(null);
  const sx = sunX(t, MAP_TOWNS);
  const allIn = t >= NOON + PLYMOUTH.behind - 1e-6;

  /** Moves the Sun, says which towns noon has just reached, and cheers once it has reached them all. */
  const apply = useCallback(
    (to: number) => {
      const next = clamp(to, SUN_MIN, SUN_MAX);
      const prev = tRef.current;
      tRef.current = next;
      setT(next);
      const newly = noonBetween(prev, next);
      if (newly.length) say(`Noon in ${list(newly.map((x) => x.name))}. In London it is ${clockTime(NOON + newly[newly.length - 1].behind)}.`);
      if (prev < NOON + PLYMOUTH.behind - 1e-6 && next >= NOON + PLYMOUTH.behind - 1e-6) {
        cheer();
        onDone();
      }
    },
    [say, cheer, onDone],
  );

  useEffect(() => {
    if (!playing) return;
    // A twentieth of a minute every 40 ms, so the hands sweep round as real clocks' do; under reduced motion, half a minute at a time.
    const timer = window.setInterval(
      () => {
        const next = Math.min(SUN_MAX, tRef.current + (reduced ? 0.5 : 0.05));
        apply(next);
        if (next >= SUN_MAX) setPlaying(false);
      },
      reduced ? 500 : 40,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced, apply]);

  const play = () => {
    setMoved(true);
    if (playing) return setPlaying(false);
    if (tRef.current >= SUN_MAX) {
      tRef.current = SUN_MIN;
      setT(SUN_MIN);
      say('The Sun is over London again: noon in London.');
    }
    setPlaying(true);
  };

  const fromPointer = (e: ReactPointerEvent) => {
    const p = svgPoint(svg.current, e);
    if (p) apply(londonTimeUnderSun(p.x));
  };
  const grab = (e: ReactPointerEvent) => {
    setHeld(true);
    setMoved(true);
    setPlaying(false);
    try {
      svg.current?.setPointerCapture?.(e.pointerId);
    } catch {}
    fromPointer(e);
  };

  const reached = MAP_TOWNS.filter((x) => t >= NOON + x.behind - 1e-6);
  const view = narrow ? '60 40 900 520' : `0 0 ${MAP.w} ${MAP.h}`;
  const label = `A map of the south of England and Wales, with a clock at each town. In London it is ${clockTime(t)}. ${reached.length === 1 ? 'Noon has reached only London so far.' : `Noon has reached ${list(reached.map((x) => x.name))}.`}`;

  return (
    <div className="vrw-sun">
      <figure className="vrw-london">
        <svg viewBox="-130 -130 260 260" className="vrw-london-svg" role="img" aria-label={`London’s clock says ${clockTime(t)}.`}>
          <Face r={112} minutes={t} rim="#2f4a32" numerals={12} />
        </svg>
        <figcaption>
          <span className="vrw-cap">London</span>
          <strong className="vbi-tnum vrw-big-time">{clockTime(t)}</strong>
        </figcaption>
      </figure>

      <div className="vrw-sun-map">
        <svg ref={svg} className="vrw-map" viewBox={view} role="img" aria-label={label} onPointerMove={(e) => held && fromPointer(e)} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)}>
          <MapDefs />
          <BaseMap />
          {MAP_TOWNS.map((town) => {
            const c = project(town.lon, town.lat);
            const b = BADGE[town.name];
            const at = NOON + town.behind;
            const isIn = t >= at - 1e-6;
            const noonNow = isIn && t - at < 0.75;
            return (
              <g key={town.name} className="vbi-town" data-reached={isIn || undefined} data-noon={noonNow || undefined}>
                <path d={`M${c.x} ${c.y} L${b.x} ${b.y}`} className="vbi-map-leader" />
                <circle cx={c.x} cy={c.y} r={7} className="vbi-map-dot" />
                <MiniClock x={b.x} y={b.y} minutes={t - town.behind} name={town.name} reached={isIn} noon={noonNow} />
              </g>
            );
          })}
          <rect x="0" y="0" width={MAP.w} height="84" fill="transparent" className="vrw-sun-track" onPointerDown={grab} />
          <g className="vrw-sun-disc" transform={`translate(${sx} 0)`} onPointerDown={grab} aria-hidden="true">
            <circle cx="0" cy="40" r="54" fill="url(#vrw-sun-glow)" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI) / 6;
              return <line key={i} x1={r2(Math.cos(a) * 26)} y1={r2(40 + Math.sin(a) * 26)} x2={r2(Math.cos(a) * 38)} y2={r2(40 + Math.sin(a) * 38)} stroke="#e0a83a" strokeWidth="5" strokeLinecap="round" />;
            })}
            <circle cx="0" cy="40" r="20" fill="#f2c45a" stroke="#c98a2a" strokeWidth="3" />
            <path d="M0 64 V160" stroke="#f2c45a" strokeWidth="3" strokeDasharray="4 6" opacity="0.8" />
          </g>
          <text x="40" y="34" className="vbi-map-hint">
            ← West
          </text>
          {!moved && (
            <text x={sx - 66} y="48" textAnchor="end" className="vrw-drag-hint">
              Drag the Sun ←
            </text>
          )}
        </svg>
        <div className="vrw-sun-controls">
          <button type="button" className="vbr-button vbr-button-primary" onClick={play}>
            {playing ? 'Pause' : t >= SUN_MAX ? 'Again' : 'Play the Sun'}
          </button>
          <label className="vrw-slider">
            <span className="visually-hidden">Move the Sun west</span>
            <span aria-hidden="true" className="vrw-slider-end">
              East
            </span>
            <input
              type="range"
              min={SUN_MIN}
              max={SUN_MAX}
              step={0.25}
              value={t}
              onChange={(e) => {
                setMoved(true);
                setPlaying(false);
                apply(Number(e.target.value));
              }}
              aria-valuetext={`London time ${clockTime(t)}`}
            />
            <span aria-hidden="true" className="vrw-slider-end">
              West
            </span>
          </label>
        </div>
      </div>

      <section className="vrw-book" aria-label="The noon book">
        <h3 className="vrw-book-title">The noon book</h3>
        <p className="vrw-book-sub">When noon came to each town, London’s clock said…</p>
        <ol className="vrw-book-list">
          {MAP_TOWNS.map((town) => {
            const isIn = t >= NOON + town.behind - 1e-6;
            return (
              <li key={town.name} data-in={isIn || undefined}>
                <span className="vrw-book-town">{town.name}</span>
                <span className="vrw-book-time vbi-tnum">{isIn ? clockTime(NOON + town.behind) : '…'}</span>
                <span className="vrw-book-later">{isIn ? (town.behind ? `+${half(town.behind)} min` : 'first') : ''}</span>
              </li>
            );
          })}
        </ol>
        {allIn && <p className="vrw-book-end">The further west, the later the noon!</p>}
        <div className="vrw-cheer">
          <Celebrate burst={allIn ? burst : 0} reduced={reduced} />
        </div>
      </section>
    </div>
  );
}

/** The maps' sea, the Sun's glow and the drawing's edge. */
function MapDefs() {
  return (
    <defs>
      <pattern id="vrw-waves" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 12 Q10 6 20 12 T40 12" fill="none" stroke="#7c97a3" strokeOpacity="0.35" strokeWidth="1.4" />
      </pattern>
      <radialGradient id="vrw-sun-glow">
        <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
      </radialGradient>
      <clipPath id="vrw-map-clip">
        <rect x="0" y="0" width={MAP.w} height={MAP.h} rx="10" />
      </clipPath>
    </defs>
  );
}

/** The sea, the land and the line, drawn the same for both maps. */
function BaseMap() {
  return (
    <>
      <g clipPath="url(#vrw-map-clip)">
        <rect x="0" y="0" width={MAP.w} height={MAP.h} fill="#c9d8dc" />
        <rect x="0" y="0" width={MAP.w} height={MAP.h} fill="url(#vrw-waves)" />
        <path d={COAST_D} fill="#efe6cf" stroke="#6b5a40" strokeWidth="2.2" strokeLinejoin="round" />
        <path d={WIGHT_D} fill="#efe6cf" stroke="#6b5a40" strokeWidth="2" />
      </g>
      <path d={LINE_D} className="vbi-map-line" />
      <path d={LINE_D} className="vbi-map-sleepers" />
    </>
  );
}

/** A town's own clock on the noon map: its face hidden until noon reaches the town, then the town's time, ticking on; glowing at noon. */
function MiniClock({ x, y, minutes, name, reached, noon }: { x: number; y: number; minutes: number; name: string; reached: boolean; noon: boolean }) {
  const r = 30;
  const shown = noon ? `☀ ${name}` : name;
  const plaque = Math.max(112, Math.round(shown.length * 13.4) + 22);
  return (
    <g transform={`translate(${x} ${y})`} className="vbi-mini vrw-mini" data-reached={reached || undefined} data-noon={noon || undefined}>
      <circle r={r + 6} className="vbi-mini-rim" />
      {reached ? (
        <>
          <circle r={r} fill="#fbf7ef" stroke="#2a2522" strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" y1={-r + 3} x2="0" y2={-r + 9} stroke="#2a2522" strokeWidth="2.4" transform={`rotate(${i * 90})`} />
          ))}
          <line x1="0" y1="3" x2="0" y2={-r * 0.5} stroke="#2a2522" strokeWidth="3.6" strokeLinecap="round" transform={`rotate(${r2(hands(minutes).hour)})`} />
          <line x1="0" y1="4" x2="0" y2={-r * 0.82} stroke="#2a2522" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${r2(hands(minutes).minute)})`} />
          <circle r="3" fill="#a4565c" />
        </>
      ) : (
        <>
          <circle r={r} className="vrw-mini-cover" />
          <text y="11" textAnchor="middle" className="vrw-mini-q">
            ?
          </text>
        </>
      )}
      <rect x={-plaque / 2} y={r + 10} width={plaque} height="34" rx="6" className="vbi-mini-plaque" />
      <text y={r + 34} textAnchor="middle" className="vbi-mini-name">
        {shown}
      </text>
    </g>
  );
}

/* ───────── 2. Your watch says London time ───────── */

function JourneyStep({ reduced, narrow, say, onDone }: StepProps & { narrow: boolean }) {
  const last = STATIONS.length - 1;
  const [at, setAt] = useState(0);
  const [p, setP] = useState(0);
  const timer = useTimer();
  const moving = p !== at;

  const arrive = (i: number) => {
    const s = STATIONS[i];
    if (i === 0) say(`London. Your watch and London’s clock both say ${clockTime(ARRIVE[0])}.`);
    else say(`${s.name}. Your watch says ${clockTime(ARRIVE[i])}; ${s.name}’s clock says ${clockTime(ARRIVE[i] - s.behind)}: ${minutesWords(s.behind)} behind.`);
    if (i === last) onDone();
  };

  const steamTo = (i: number) => {
    timer.stop();
    const from = at;
    setAt(i);
    if (reduced || i < from) {
      setP(i);
      arrive(i);
      return;
    }
    say(`Steaming on to ${STATIONS[i].name}…`);
    let q = from;
    timer.start(() => {
      q = Math.min(i, q + 0.025);
      setP(q);
      if (q >= i) {
        timer.stop();
        arrive(i);
      }
    }, 40);
  };

  const town = STATIONS[at];
  const watch = watchAt(p);
  const train = trainAt(p);
  const view = narrow ? '330 106 540 220' : '300 100 620 226';
  const next = STATIONS[at + 1];
  const local = ARRIVE[at] - town.behind;

  return (
    <div className="vrw-journey">
      <svg className="vrw-strip" viewBox={view} role="img" aria-label={`A map of the railway west from London. ${moving ? `The train is steaming on to ${town.name}.` : `The train is at ${town.name}.`}`}>
        <MapDefs />
        <BaseMap />
        {STATIONS.map((s, i) => {
          const c = STOPS[i];
          const here = !moving && i === at;
          return (
            <g key={s.name} className="vbi-town" data-here={here || undefined}>
              <circle cx={c.x} cy={c.y} r={here ? 10 : 7} className="vbi-map-dot" />
              <text x={c.x + (LABEL[s.name]?.dx ?? 0)} y={c.y + (LABEL[s.name]?.dy ?? 30)} textAnchor={LABEL[s.name]?.anchor ?? 'middle'} className="vbi-map-name" data-here={here || undefined}>
                {s.name}
              </text>
            </g>
          );
        })}
        {/* the engine faces west, the way it goes */}
        <g className="vrw-train" transform={`translate(${r2(train.x + 28)} ${r2(train.y - 44)}) scale(-0.72 0.72)`}>
          <Locomotive base={64} />
        </g>
      </svg>

      <div className="vrw-compare">
        <figure className="vrw-clockcard vrw-watchcard">
          <svg viewBox="-125 -150 250 275" role="img" aria-label={`Your pocket watch, set in London, says ${clockTime(watch)}.`}>
            <Watch minutes={watch} />
          </svg>
          <figcaption>
            <span className="vrw-cap">Your watch: London time</span>
            <strong className="vbi-tnum vrw-big-time">{clockTime(watch)}</strong>
          </figcaption>
        </figure>

        <div className="vrw-compare-mid">
          <p className="vrw-gap" data-zero={at === 0 || moving || undefined}>
            {moving ? 'All aboard…' : at === 0 ? 'In London they agree.' : `${town.name}’s clock is ${minutesWords(town.behind)} behind.`}
          </p>
          {at < last ? (
            <button type="button" className="vbr-button vbr-button-primary vrw-steam" onClick={() => steamTo(at + 1)} disabled={moving}>
              Steam on to {next.name} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" className="vbr-button vrw-steam" onClick={() => steamTo(0)}>
              Back to London
            </button>
          )}
          <p className="vrw-progress">
            Station {at + 1} of {STATIONS.length}
          </p>
        </div>

        <figure className="vrw-clockcard vrw-towncard">
          <svg viewBox="-125 -150 250 275" role="img" aria-label={moving ? `${town.name}’s clock, coming into view.` : `${town.name}’s own clock says ${clockTime(local)}.`}>
            <g transform="translate(0 -128)">
              <rect x="-110" y="-20" width="220" height="40" rx="5" className="vrw-nameboard" />
              <text y="9" textAnchor="middle" className="vrw-nameboard-text">
                {town.name}
              </text>
            </g>
            <Face r={98} minutes={local} rim="#6b4a32" numerals={12} cover={moving} />
          </svg>
          <figcaption>
            <span className="vrw-cap">{town.name}’s own time</span>
            <strong className="vbi-tnum vrw-big-time">{moving ? '…' : clockTime(local)}</strong>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

/* ───────── 3. Will you catch the train? ───────── */

function CatchStep({ reduced, say, cheer, burst, onDone }: StepProps) {
  const [n, setN] = useState(0);
  const [counted, setCounted] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const p = TRAIN_PUZZLES[n % TRAIN_PUZZLES.length];
  const behind = stationOf(p.town).behind;
  const verdict = catchTrain(p, behind);
  const known = counted >= behind;
  const right = answer !== null && answer === verdict.caught;
  const why = verdict.caught
    ? `When ${p.town}’s clock says ${clockTime(p.clock)}, it is ${clockTime(verdict.london)} in London: ${minutesWords(verdict.spare)} to spare.`
    : `When ${p.town}’s clock says ${clockTime(p.clock)}, it is already ${clockTime(verdict.london)} in London. The train left ${minutesWords(-verdict.spare)} ago!`;

  const count = (by: number) => {
    if (counted + by > behind) {
      say(`Too far! ${p.town} is only ${minutesWords(behind)} behind: ${minutesWords(behind - counted)} left to count.`);
      return;
    }
    const c = counted + by;
    setCounted(c);
    say(c === behind ? `London time is ${clockTime(p.clock + behind)}. Will you catch the ${clockTime(p.train)} train?` : `Counted on ${minutesWords(c)}: ${clockTime(p.clock + c)}.`);
  };
  const choose = (yes: boolean) => {
    setAnswer(yes);
    if (yes === verdict.caught) {
      cheer();
      onDone();
      say(`Right! ${why}`);
    } else say(`Not quite. Compare ${clockTime(verdict.london)} with ${clockTime(p.train)}.`);
  };
  const another = () => {
    setN((x) => x + 1);
    setCounted(0);
    setAnswer(null);
    say('Another train to catch.');
  };

  const gone = right && !verdict.caught;
  const label = `${p.town} station. The town clock says ${clockTime(p.clock)}. ${p.town}’s time is ${minutesWords(behind)} behind London’s. The train to London leaves at ${clockTime(p.train)} London time. ${known ? `London time is ${clockTime(verdict.london)}${right ? `: ${verdict.caught ? 'you catch it' : 'the train has gone'}` : ''}.` : 'London time is a time to work out.'}`;
  return (
    <div className="vrw-catch" data-solved={right || undefined}>
      <div className="vrw-platform-wrap">
        <svg className="vrw-platform" viewBox="0 0 1200 520" role="img" aria-label={label}>
          {/* drawn wider and deeper than its frame, so the platform fills whatever space it has */}
          <rect x="-600" y="-400" width="2400" height="760" fill="#e9dcc4" />
          {/* the station's iron roof and its columns */}
          <path d="M-600 -400 H1800 V34 Q1500 70 1200 34 Q900 70 600 34 Q300 70 0 34 Q-300 70 -600 34Z" fill="#6b4a32" />
          {[-450, -150, 150, 450, 750, 1050, 1350, 1650].map((x) => (
            <rect key={x} x={x - 7} y="30" width="14" height="330" fill="#4f6152" />
          ))}
          <rect x="-600" y="360" width="2400" height="72" fill="#8a7a62" />
          <rect x="-600" y="360" width="2400" height="12" fill="#c9b48a" />
          <rect x="-600" y="432" width="2400" height="500" fill="#5a4e44" />
          {Array.from({ length: 46 }, (_, i) => (
            <rect key={i} x={i * 52 - 600} y="462" width="26" height="50" fill="#3f352e" />
          ))}
          <path d="M-600 472 H1800 M-600 504 H1800" stroke="#2a2522" strokeWidth="6" />

          {/* the town clock on its tower; a pale red hand counts on to London time */}
          <rect x="70" y="56" width="300" height="304" rx="6" fill="#b9a27a" />
          <path d="M54 66 L220 22 L386 66Z" fill="#6b4a32" />
          <g transform="translate(220 184)">
            <Face r={104} minutes={p.clock} rim="#6b4a32" numerals={12} ghost={counted ? p.clock + counted : undefined} />
          </g>
          <g transform="translate(220 332)">
            <rect x="-140" y="-22" width="280" height="44" rx="6" fill="#f4eee3" stroke="#c9a24a" strokeWidth="2" />
            <text y="9" textAnchor="middle" className="vrw-sign">
              {p.town}: {half(behind)} min behind London
            </text>
          </g>

          {/* the departure board */}
          <g transform="translate(790 66)">
            <rect width="360" height="236" rx="10" fill="#2f4a32" stroke="#c9a24a" strokeWidth="4" />
            <text x="180" y="40" textAnchor="middle" className="vbi-board-small">
              Train to London
            </text>
            <text x="180" y="104" textAnchor="middle" className="vbi-board-big">
              {clockTime(p.train)}
            </text>
            <text x="180" y="136" textAnchor="middle" className="vrw-board-note">
              London time
            </text>
            <path d="M24 156 H336" stroke="#c9a24a" strokeWidth="1.5" />
            <text x="180" y="186" textAnchor="middle" className="vrw-board-note">
              London time now
            </text>
            <text x="180" y="224" textAnchor="middle" className="vrw-board-now" data-known={known || undefined}>
              {known ? clockTime(verdict.london) : '?'}
            </text>
          </g>

          {/* the train: waiting at the platform, or gone */}
          <g className="vrw-catch-train" data-gone={gone || undefined}>
            <g transform="translate(420 420) scale(1.3)">
              <Locomotive base={64} />
              <rect x="82" y="16" width="120" height="40" rx="4" fill="#6b4a32" />
              {[92, 128, 164].map((x) => (
                <rect key={x} x={x} y="24" width="24" height="16" fill="#f2d68a" />
              ))}
              <circle cx="110" cy="60" r="6" fill="#2a2522" />
              <circle cx="176" cy="60" r="6" fill="#2a2522" />
            </g>
          </g>
          {right && (
            <g className="vbi-stamp" data-caught={verdict.caught || undefined}>
              <rect x="420" y="190" width="360" height="96" rx="14" />
              <text x="600" y="256" textAnchor="middle">
                {verdict.caught ? '✓ You catch it!' : '✗ Missed it!'}
              </text>
            </g>
          )}
        </svg>
        <div className="vrw-cheer">
          <Celebrate burst={right && verdict.caught ? burst : 0} reduced={reduced} />
        </div>
      </div>

      <div className="vrw-ticket">
        <p className="vrw-ticket-n">
          Train {(n % TRAIN_PUZZLES.length) + 1} of {TRAIN_PUZZLES.length}
        </p>
        {!known && (
          <div className="vrw-ticket-row">
            <p className="vrw-ticket-q">
              {p.town}’s clock says <strong>{clockTime(p.clock)}</strong>. Count on <strong>{half(behind)} minutes</strong> to find London time.
            </p>
            <div className="vrw-count" role="group" aria-label="Count on">
              <button type="button" className="vbi-answer" onClick={() => count(1)}>
                + 1 minute
              </button>
              <button type="button" className="vbi-answer" onClick={() => count(5)}>
                + 5 minutes
              </button>
              <span className="vrw-counted vbi-tnum">
                +{counted} of {half(behind)}
              </span>
            </div>
          </div>
        )}
        {known && !right && (
          <div className="vrw-ticket-row">
            <p className="vrw-ticket-q">
              London time is <strong>{clockTime(verdict.london)}</strong>. Your train leaves at <strong>{clockTime(p.train)}</strong>. Will you catch it?
            </p>
            <div className="vbi-answers vbi-answers-two vrw-answers" role="group" aria-label="Will you catch it?">
              {[true, false].map((yes) => (
                <button key={String(yes)} type="button" className="vbi-answer" data-verdict={answer === yes ? 'wrong' : undefined} aria-pressed={answer === yes} onClick={() => choose(yes)}>
                  {yes ? 'Yes, I’ll catch it' : 'No, it’s gone'}
                </button>
              ))}
            </div>
          </div>
        )}
        {right && (
          <div className="vrw-ticket-row">
            <p className="vrw-ticket-q vrw-why">{why}</p>
            <button type="button" className="vbr-button vbr-button-primary" onClick={another}>
              Another train <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── 4. You're the stationmaster ───────── */

const JOB_TOWNS = STATION_JOB.towns.map(stationOf);

function StationmasterStep({ reduced, say, cheer, burst, onDone }: StepProps) {
  const towns = JOB_TOWNS;
  const target = STATION_JOB.london;
  const [started, setStarted] = useState(false);
  const [sel, setSel] = useState(0);
  const [shows, setShows] = useState<number[]>(() => towns.map((t) => target - t.behind));
  const [wind, setWind] = useState(0);
  const [clue, setClue] = useState(false);
  const [winding, setWinding] = useState(false);
  const timer = useTimer();
  const town = towns[sel];
  const now = shows[sel];
  const isSet = (i: number) => shows[i] === target;
  const setCount = towns.filter((_, i) => isSet(i)).length;

  const verdict = (i: number, to: number) => {
    const name = towns[i].name;
    if (to === target) {
      cheer();
      if (towns.every((_, k) => k === i || isSet(k))) {
        onDone();
        say(`Well done! Every station on the line says ${clockTime(target)}: railway time.`);
      } else say(`${name}’s station clock says ${clockTime(target)}: railway time! Now choose another station.`);
    } else if (to < target) say(`${name}’s clock says ${clockTime(to)}: still ${minutesWords(target - to)} behind London. Wind it on again.`);
    else say(`${name}’s clock says ${clockTime(to)}: ${minutesWords(to - target)} too far. Wind it back.`);
  };

  const windOn = () => {
    if (!wind || winding) return;
    const i = sel;
    const from = shows[i];
    const to = from + wind;
    const put = (m: number) => setShows((xs) => xs.map((x, k) => (k === i ? m : x)));
    setWind(0);
    if (reduced) {
      put(to);
      verdict(i, to);
      return;
    }
    // The hands sweep round, half a minute at a time, as the key turns.
    setWinding(true);
    let m = from;
    const dir = Math.sign(to - from);
    timer.start(() => {
      m = Math.abs(to - m) <= 0.5 ? to : m + dir * 0.5;
      put(m);
      if (m === to) {
        timer.stop();
        setWinding(false);
        verdict(i, to);
      }
    }, 45);
  };

  const choose = (i: number) => {
    if (winding) return;
    setSel(i);
    setWind(0);
    setClue(false);
    say(`${towns[i].name} station. Its clock says ${clockTime(shows[i])}.`);
  };

  if (!started)
    return (
      <div className="vrw-set">
        <div className="vrw-goal" role="group" aria-labelledby="vrw-goal-title">
          <p className="vrw-goal-kicker">Your job</p>
          <h3 id="vrw-goal-title" className="vrw-goal-title">
            Put the whole line on London time
          </h3>
          <ol className="vrw-goal-list">
            {STATION_JOB.goal.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
          <button
            type="button"
            className="vbr-button vbr-button-primary"
            onClick={() => {
              setStarted(true);
              say(`The telegram says London time is ${clockTime(target)}. ${towns[0].name}’s clock says ${clockTime(shows[0])}.`);
            }}
          >
            Read the telegram <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );

  return (
    <div className="vrw-set" data-started="true">
      <ol className="vrw-line" aria-label="The stations on the line">
        {towns.map((t, i) => (
          <li key={t.name}>
            <button type="button" className="vrw-station" aria-pressed={sel === i} data-set={isSet(i) || undefined} onClick={() => choose(i)} aria-label={`${t.name}${isSet(i) ? ' (set)' : ''}`}>
              <svg viewBox="-34 -34 68 68" aria-hidden="true" className="vrw-station-face">
                <Face r={29} minutes={shows[i]} rim={isSet(i) ? '#3f8a4a' : '#6b4a32'} numerals={0} />
              </svg>
              <span className="vrw-station-name">{t.name}</span>
              <span className="vrw-station-flag" aria-hidden="true">
                {isSet(i) ? '✓' : ''}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="vrw-desk">
        <div className="vrw-telegram" role="note" aria-label="Telegram from London">
          <p className="vrw-telegram-head">Telegram</p>
          <p className="vrw-telegram-from">From London</p>
          <p className="vrw-telegram-body">
            LONDON TIME IS <span className="vbi-tnum">{clockTime(target)}</span> STOP SET EVERY STATION CLOCK STOP
          </p>
        </div>

        <figure className="vrw-bigclock">
          <svg viewBox="-130 -130 260 260" role="img" aria-label={`${town.name}’s station clock says ${clockTime(now)}.${isSet(sel) ? ' Railway time!' : ''}`}>
            <Face r={112} minutes={now} rim={isSet(sel) ? '#3f8a4a' : '#6b4a32'} numerals={12} />
          </svg>
          <figcaption>
            <span className="vrw-cap">{town.name} station</span>
            <strong className="vbi-tnum vrw-big-time">{clockTime(now)}</strong>
          </figcaption>
          <div className="vrw-cheer">
            <Celebrate burst={isSet(sel) ? burst : 0} reduced={reduced} />
          </div>
        </figure>

        <div className="vrw-winder">
          {isSet(sel) ? (
            <p className="vrw-winder-done">
              {town.name} keeps railway time! {setCount < towns.length ? 'Choose another station.' : `All ${towns.length} stations are set.`}
            </p>
          ) : (
            <>
              <p className="vrw-winder-q">
                How many minutes must <strong>{town.name}</strong>’s clock go {now > target ? 'back' : 'on'}?
              </p>
              <div className="vrw-stepper" role="group" aria-label="Minutes to wind">
                <button type="button" className="vbi-nudge" onClick={() => setWind((w) => clamp(w - 1, -20, 20))} aria-label="One minute fewer" disabled={winding}>
                  −
                </button>
                <span className="vrw-stepper-n vbi-tnum" aria-live="polite">
                  {wind > 0 ? `+${wind}` : wind} min
                </span>
                <button type="button" className="vbi-nudge" onClick={() => setWind((w) => clamp(w + 1, -20, 20))} aria-label="One minute more" disabled={winding}>
                  +
                </button>
              </div>
              <button type="button" className="vbr-button vbr-button-primary vrw-wind" onClick={windOn} disabled={!wind || winding}>
                <span aria-hidden="true">⟳</span> {wind < 0 ? 'Wind it back' : 'Wind it on'}
              </button>
              <button type="button" className="vbr-button vbr-button-quiet vrw-clue" aria-expanded={clue} onClick={() => setClue((c) => !c)}>
                Need a clue?
              </button>
              {clue && (
                <p className="vrw-clue-text">
                  The 1841 timetable: {town.name}’s own time is {minutesWords(town.behind)} behind London’s.
                </p>
              )}
            </>
          )}
          <p className="vrw-winder-count">
            {setCount} of {towns.length} stations set
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── 5. A clock with two minute hands ───────── */

type BristolPhase = 'london' | 'bristol' | 'train' | 'done';
const PHASES: { id: BristolPhase; label: string }[] = [
  { id: 'london', label: 'London time' },
  { id: 'bristol', label: 'Bristol time' },
  { id: 'train', label: 'Catch the train' },
];
const ORDER: BristolPhase[] = ['london', 'bristol', 'train', 'done'];

function BristolStep({ reduced, say, cheer, burst, onDone }: StepProps) {
  const london = BRISTOL_CLOCK.london;
  const behind = BRISTOL_CLOCK.behind;
  const bristol = london - behind;
  const [red, setRed] = useState(NOON);
  const [black, setBlack] = useState(NOON);
  const [phase, setPhase] = useState<BristolPhase>('london');
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const gap = red - black;
  // Which hands turn: both together to set London time and to wind on, the black alone to set Bristol's own.
  const turning: 'both' | 'black' | null = phase === 'bristol' ? 'black' : phase === 'done' ? null : 'both';
  const value = turning === 'black' ? black : red;

  const setTo = (to: number) => {
    if (phase === 'london') {
      setRed(to);
      setBlack(to);
      if (to === london) {
        setPhase('bristol');
        cheer();
        say(`Right! The red hand says London time, ${clockTime(london)}. Now turn the black hand back to Bristol’s own time.`);
      } else say(`The red hand says ${clockTime(to)}.`);
    } else if (phase === 'bristol') {
      const b = clamp(to, red - 30, red);
      setBlack(b);
      if (b === bristol) {
        setPhase('train');
        cheer();
        say(`Right! The black hand says ${clockTime(bristol)}, Bristol’s own time, ${minutesWords(behind)} behind London. Now wind the clock on to catch your train.`);
      } else say(`The black hand says ${clockTime(b)}: ${minutesWords(red - b)} behind the red hand.`);
    } else if (phase === 'train') {
      const r = clamp(to, london, BRISTOL_TRAIN);
      setRed(r);
      setBlack(r - behind);
      if (r === BRISTOL_TRAIN) {
        setPhase('done');
        cheer();
        onDone();
        say(`The red hand says ${clockTime(BRISTOL_TRAIN)}: your train goes! The black hand says only ${clockTime(BRISTOL_TRAIN - behind)}.`);
      } else say(`The red hand says ${clockTime(r)}. The black hand says ${clockTime(r - behind)}.`);
    }
  };
  const nudge = (by: number) => setTo(value + by);

  const C = { x: 500, y: 250 };
  const angleAt = (e: ReactPointerEvent) => {
    const q = svgPoint(svg.current, e);
    return q ? (Math.atan2(q.x - C.x, -(q.y - C.y)) * 180) / Math.PI : null;
  };
  const drag = (e: ReactPointerEvent) => {
    if (!dragging.current || !turning) return;
    const a = angleAt(e);
    if (a !== null) setTo(dragMinute(value, a));
  };
  const keys = (e: KeyboardEvent<SVGGElement>) => {
    if (!turning) return;
    const by = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : e.key === 'PageUp' ? 5 : e.key === 'PageDown' ? -5 : 0;
    if (!by) return;
    e.preventDefault();
    nudge(by);
  };

  const r = 190;
  const redA = hands(red).minute;
  const blackA = hands(black).minute;
  const task =
    phase === 'london' ? `The telegraph says London time is ${clockTime(london)}. Turn the red hand to ${clockTime(london)}.`
    : phase === 'bristol' ? `Bristol is ${minutesWords(behind)} behind London. Turn the black hand back to Bristol’s own time.`
    : phase === 'train' ? `Your train to London leaves at ${clockTime(BRISTOL_TRAIN)} London time. Wind the clock on until it goes.`
    : `It went at ${clockTime(BRISTOL_TRAIN)} by the red hand, when the black hand said only ${clockTime(BRISTOL_TRAIN - behind)}. Go by the black hand, and you miss it by ${minutesWords(behind)}!`;

  return (
    <div className="vrw-bristol" data-phase={phase}>
      <div className="vrw-exchange">
        <svg
          ref={svg}
          className="vrw-exchange-svg"
          viewBox="0 0 1000 560"
          role="img"
          aria-label={`Bristol’s Exchange clock, with one hour hand and two minute hands: a red one for London time at ${clockTime(red)}, and a black one for Bristol’s own time at ${clockTime(black)}.${gap > 0 ? ` They are ${minutesWords(gap)} apart.` : ' They are together.'}`}
          onPointerMove={drag}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          {/* the Exchange's stone front, filling the picture to its foot, and the street before it */}
          <rect x="-400" y="-400" width="1800" height="1200" fill="#d9ccb0" />
          <path d="M120 64 L500 4 L880 64Z" fill="#b9a27a" />
          <rect x="-400" y="64" width="1800" height="18" fill="#c8b994" />
          {[-60, 160, 250, 750, 840, 1060].map((x) => (
            <rect key={x} x={x - 16} y="82" width="32" height="400" fill="#c8b994" />
          ))}
          <rect x="-400" y="482" width="1800" height="400" fill="#8a7a62" />
          <path d="M-400 528 H1400 M-400 552 H1400" stroke="#3a3430" strokeWidth="5" />
          <g className="vrw-bristol-train" data-gone={phase === 'done' || undefined}>
            <g transform="translate(60 470) scale(0.9)">
              <Locomotive base={64} />
              <rect x="82" y="16" width="120" height="40" rx="4" fill="#6b4a32" />
              <circle cx="110" cy="60" r="6" fill="#2a2522" />
              <circle cx="176" cy="60" r="6" fill="#2a2522" />
            </g>
          </g>
          <g transform={`translate(${C.x} ${C.y})`}>
            <circle r={r + 22} fill="#1f2f22" />
            <circle r={r + 12} fill="#c9a24a" />
            <circle r={r} fill="#fbf7ef" />
            {gap > 0 && <path d={wedgePath(r * 0.8, blackA, redA)} className="vrw-wedge" />}
            {Array.from({ length: 60 }, (_, i) => {
              const a = (i * 6 * Math.PI) / 180;
              const long = i % 5 === 0;
              return <line key={i} x1={r2(Math.sin(a) * (r - 8))} y1={r2(-Math.cos(a) * (r - 8))} x2={r2(Math.sin(a) * (r - (long ? 26 : 16)))} y2={r2(-Math.cos(a) * (r - (long ? 26 : 16)))} stroke="#2a2522" strokeWidth={long ? 4 : 1.6} />;
            })}
            {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((n, i) => (
              <text key={n} x={r2(Math.sin((i * Math.PI) / 6) * (r - 56))} y={r2(-Math.cos((i * Math.PI) / 6) * (r - 56) + 10)} textAnchor="middle" className="vbi-bristol-n">
                {n}
              </text>
            ))}
            <line x1="0" y1="16" x2="0" y2={-r * 0.5} stroke="#2a2522" strokeWidth="12" strokeLinecap="round" transform={`rotate(${r2(hands(red).hour)})`} />
            <g
              className="vrw-hands"
              role="slider"
              tabIndex={turning ? 0 : -1}
              aria-label={turning === 'black' ? 'The black minute hand: drag it, or use the arrow keys' : 'The clock’s minute hands: drag them, or use the arrow keys'}
              aria-valuemin={NOON - 60}
              aria-valuemax={NOON + 60}
              aria-valuenow={value}
              aria-valuetext={clockTime(value)}
              aria-disabled={!turning || undefined}
              onKeyDown={keys}
              onPointerDown={(e) => {
                if (!turning) return;
                dragging.current = true;
                try {
                  svg.current?.setPointerCapture?.(e.pointerId);
                } catch {}
                const a = angleAt(e);
                if (a !== null) setTo(dragMinute(value, a));
              }}
            >
              <circle r={r} fill="transparent" />
              <g transform={`rotate(${r2(blackA)})`} className="vrw-bhand" data-hand="black" data-active={turning === 'black' || undefined}>
                <line x1="0" y1="22" x2="0" y2={-r * 0.86} stroke="#1c1a18" strokeWidth="8" strokeLinecap="round" />
                {turning === 'black' && <circle cy={-r * 0.86} r="15" className="vbi-grab" />}
              </g>
              <g transform={`rotate(${r2(redA)})`} className="vrw-bhand" data-hand="red" data-active={turning === 'both' || undefined}>
                <line x1="0" y1="22" x2="0" y2={-r * 0.86} stroke="#c0392b" strokeWidth="8" strokeLinecap="round" />
                {turning === 'both' && <circle cy={-r * 0.86} r="15" className="vbi-grab" />}
              </g>
            </g>
            <circle r="11" fill="#c9a24a" stroke="#2a2522" strokeWidth="2" />
          </g>
          {/* the two hands' tags, either side of the clock */}
          <g transform="translate(40 150)">
            <rect width="190" height="92" rx="10" fill="#1c1a18" />
            <text x="95" y="38" textAnchor="middle" className="vbi-bristol-tag">
              Bristol
            </text>
            <text x="95" y="74" textAnchor="middle" className="vbi-bristol-tag-sub">
              {clockTime(black)}
            </text>
          </g>
          <g transform="translate(770 150)">
            <rect width="190" height="92" rx="10" fill="#c0392b" />
            <text x="95" y="38" textAnchor="middle" className="vbi-bristol-tag">
              London
            </text>
            <text x="95" y="74" textAnchor="middle" className="vbi-bristol-tag-sub">
              {clockTime(red)}
            </text>
          </g>
          {gap > 0 && (
            <g transform="translate(500 340)">
              <rect x="-90" y="-24" width="180" height="48" rx="24" className="vbi-behind-pill" />
              <text y="9" textAnchor="middle" className="vbi-behind-text">
                {half(gap)} min apart
              </text>
            </g>
          )}
        </svg>
        <div className="vrw-cheer">
          <Celebrate burst={burst} reduced={reduced} />
        </div>
      </div>

      <div className="vrw-bristol-panel">
        <ol className="vrw-phases" aria-label="Three jobs">
          {PHASES.map((x, i) => {
            const past = ORDER.indexOf(phase) > i;
            return (
              <li key={x.id} aria-current={phase === x.id ? 'step' : undefined} data-done={past || undefined}>
                <span className="vrw-phase-n" aria-hidden="true">
                  {past ? '✓' : i + 1}
                </span>
                {x.label}
              </li>
            );
          })}
        </ol>
        <p className="vrw-bristol-task">{task}</p>
        {turning && (
          <div className="vrw-stepper" role="group" aria-label={turning === 'black' ? 'Turn the black hand' : 'Turn the clock'}>
            <button type="button" className="vbi-nudge" onClick={() => nudge(-1)} aria-label="Back one minute">
              − 1 min
            </button>
            <button type="button" className="vbi-nudge" onClick={() => nudge(1)} aria-label="On one minute">
              + 1 min
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** The slice of a clock face between two minute hands, `from` to `to` degrees, clockwise. */
function wedgePath(rad: number, from: number, to: number) {
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${r2(Math.sin(a) * rad)} ${r2(-Math.cos(a) * rad)}`;
  };
  return `M0 0 L${pt(from)} A${rad} ${rad} 0 ${to - from > 180 ? 1 : 0} 1 ${pt(to)} Z`;
}

/* ───────── Clocks and the engine ───────── */

/**
 * A clock face at 0,0: its rim, ticks and numerals (all twelve, the four
 * quarters or none), and its hands for a time in minutes after midnight.
 * `cover` hides the hands behind a shutter (a clock not yet seen); `ghost`
 * draws a pale red minute hand counting on to another time.
 */
function Face({ r, minutes, rim, numerals = 4, cover = false, ghost }: { r: number; minutes: number; rim: string; numerals?: 0 | 4 | 12; cover?: boolean; ghost?: number }) {
  const h = hands(minutes);
  const romans = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const shown = numerals === 12 ? romans.map((n, i) => [n, i] as const) : numerals === 4 ? [0, 3, 6, 9].map((i) => [romans[i], i] as const) : [];
  return (
    <g className="vrw-face">
      <circle r={r2(r * 1.13)} fill={rim} />
      <circle r={r} fill="#fbf7ef" stroke="#2a2522" strokeWidth={r2(Math.max(1, r * 0.02))} />
      {r > 40
        ? Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const long = i % 5 === 0;
            return <line key={i} x1={r2(Math.sin(a) * r * 0.94)} y1={r2(-Math.cos(a) * r * 0.94)} x2={r2(Math.sin(a) * r * (long ? 0.8 : 0.88))} y2={r2(-Math.cos(a) * r * (long ? 0.8 : 0.88))} stroke="#2a2522" strokeWidth={r2(long ? r * 0.03 : r * 0.012)} />;
          })
        : [0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={-r + 3} x2="0" y2={-r + 9} stroke="#2a2522" strokeWidth="2.4" transform={`rotate(${i * 90})`} />)}
      {shown.map(([n, i]) => (
        <text key={n} x={r2(Math.sin((i * Math.PI) / 6) * r * 0.64)} y={r2(-Math.cos((i * Math.PI) / 6) * r * 0.64 + r * 0.06)} textAnchor="middle" className="vrw-face-n" style={{ fontSize: r2(r * (numerals === 12 ? 0.16 : 0.2)) }}>
          {n}
        </text>
      ))}
      {cover ? (
        <>
          <circle r={r} className="vrw-mini-cover" />
          <text y={r2(r * 0.2)} textAnchor="middle" className="vrw-mini-q" style={{ fontSize: r2(r * 0.6) }}>
            ?
          </text>
        </>
      ) : (
        <>
          {ghost !== undefined && <line className="vrw-ghost" x1="0" y1="0" x2="0" y2={r2(-r * 0.8)} stroke="#c0392b" strokeOpacity="0.8" strokeWidth={r2(r * 0.04)} strokeLinecap="round" strokeDasharray={`${r2(r * 0.08)} ${r2(r * 0.05)}`} transform={`rotate(${r2(hands(ghost).minute)})`} />}
          <line x1="0" y1={r2(r * 0.1)} x2="0" y2={r2(-r * 0.5)} stroke="#2a2522" strokeWidth={r2(r * 0.065)} strokeLinecap="round" transform={`rotate(${r2(h.hour)})`} />
          <line x1="0" y1={r2(r * 0.14)} x2="0" y2={r2(-r * 0.8)} stroke="#2a2522" strokeWidth={r2(r * 0.037)} strokeLinecap="round" transform={`rotate(${r2(h.minute)})`} />
        </>
      )}
      <circle r={r2(Math.max(3, r * 0.05))} fill="#a4565c" />
    </g>
  );
}

/** A gold pocket watch: its bow and crown at the top, its face with all twelve numerals. */
function Watch({ minutes }: { minutes: number }) {
  return (
    <g>
      <circle cy="-130" r="16" fill="none" stroke="#b8903a" strokeWidth="6" />
      <rect x="-12" y="-120" width="24" height="16" rx="4" fill="#b8903a" />
      <circle r="114" fill="#d6b46a" stroke="#8a6a2c" strokeWidth="4" />
      <g transform="scale(0.9)">
        <Face r={100} minutes={minutes} rim="#b8903a" numerals={12} />
      </g>
    </g>
  );
}

/** A small engine, from the side, its chimney to the right, its wheels on the rail at `base`. */
function Locomotive({ base }: { base: number }) {
  return (
    <g transform={`translate(0 ${base - 64})`}>
      <g fill="#f4eee3" stroke="#9a9184" strokeWidth="1" className="vbi-steam">
        <circle cx="52" cy="-4" r="7" />
        <circle cx="40" cy="-12" r="9" />
        <circle cx="24" cy="-16" r="10" />
      </g>
      <rect x="2" y="16" width="26" height="36" rx="2" fill="#2f4a32" />
      <path d="M-1 15 H31" stroke="#2a2522" strokeWidth="4" strokeLinecap="round" />
      <rect x="7" y="22" width="10" height="10" rx="1.5" fill="#f2d68a" />
      <rect x="26" y="28" width="50" height="22" rx="10" fill="#3f6446" />
      <path d="M38 28 V50 M54 28 V50" stroke="#c9a24a" strokeWidth="1.6" />
      <rect x="62" y="10" width="8" height="20" fill="#2a2522" />
      <path d="M59 9 H73" stroke="#2a2522" strokeWidth="4" strokeLinecap="round" />
      <rect x="2" y="50" width="76" height="5" fill="#2a2522" />
      {[
        [14, 9],
        [36, 9],
        [62, 7],
      ].map(([cx, rr]) => (
        <circle key={cx} cx={cx} cy={64 - rr} r={rr} fill="#a4565c" stroke="#2a2522" strokeWidth="2" />
      ))}
    </g>
  );
}
