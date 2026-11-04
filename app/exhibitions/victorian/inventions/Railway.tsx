'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Celebrate from '../Celebrate';
import { BRISTOL_CLOCK, MAP_TOWNS, POSTER, RAIL_STEPS, STATIONS, TRAIN_PUZZLES } from './inventionsText';
import { RAIL_FACTS } from './sources';
import { CardFoot, StepDots } from './Steps';
import { MAP, catchTrain, clockTime, dragMinute, hands, project, sunTimeAt, sunX } from './workshop';

/*
 * The railway bench, in five steps, each on one screen: a map of the south
 * of England and Wales with the towns of the Great Western line (and
 * Plymouth) on it, each with its own clock.
 *
 * 1. Noon moves west: drag the Sun (or its slider) west across the map and
 *    each town's clock reaches noon in turn, later the further west.
 * 2. Your watch says London time: steam west and your watch, set in London,
 *    and each town's clock disagree, by the 1841 timetable's minutes.
 * 3. Will you catch the train? Read a town's clock and the train's London
 *    time: the train waits at the platform with a big tick, or is gone.
 * 4. You're the stationmaster: drag each town clock's minute hand round to
 *    London time (or send the time down the telegraph wire at once).
 * 5. A clock with two minute hands: Bristol's Exchange clock, its red hand
 *    London's time and its black hand Bristol's own; which is which?
 *
 * Few words on the card; the notes, each with its source, open from "Did you
 * know?". Every drag has keys too (the slider, arrow keys on the clock, and
 * buttons), and under reduced motion nothing slides or spins.
 */

const NOON = 12 * 60;
const SUN_MIN = NOON;
const SUN_MAX = NOON + 17;
/** On a phone, the map is cropped to the towns and its words set larger. */
const NARROW = '(max-width: 760px)';
const subscribe = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(NARROW);
  mql.addEventListener?.('change', onChange);
  return () => mql.removeEventListener?.('change', onChange);
};
const narrowNow = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(NARROW).matches;
const r2 = (n: number) => Math.round(n * 100) / 100;
const stationIndex = (name: string) => STATIONS.findIndex((s) => s.name === name);
const minutesWords = (m: number) => `${String(m).replace('.5', '½')} minute${m === 1 ? '' : 's'}`;
const fmtBehind = (m: number) => String(m).replace('.5', '½');
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/**
 * The game's journey: when the train reaches each station by your watch
 * (London time), leaving London at ten. The times are the room's own, for
 * the game, not a timetable's.
 */
const ARRIVE = [10 * 60, 10 * 60 + 40, 11 * 60 + 10, 11 * 60 + 50, 12 * 60 + 10, 12 * 60 + 25, 13 * 60 + 15];

/** Where each town's clock hangs on the map, beside the town and joined to it by a line; the top row spaced so no plaque touches the next. */
const BADGE: Record<string, { x: number; y: number }> = {
  London: { x: 860, y: 100 },
  Reading: { x: 720, y: 315 },
  Steventon: { x: 700, y: 100 },
  Chippenham: { x: 540, y: 100 },
  Bath: { x: 500, y: 335 },
  Bristol: { x: 380, y: 100 },
  Bridgewater: { x: 330, y: 385 },
  Plymouth: { x: 120, y: 405 },
};

/**
 * Where each town's name sits by its dot on the journey's map (below and
 * centred, unless said), clear of its neighbours and of the line: Bristol to
 * its west, over the Severn, which leaves the space above the line to
 * Chippenham; Bath below.
 */
const LABEL: Record<string, { dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' }> = {
  Steventon: { dy: -16 },
  Chippenham: { dx: -4, dy: -14 },
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
/** The Great Western line, through Swindon (no stop of the bench's) between Steventon and Chippenham. */
const LINE_D = (() => {
  const pts = STATIONS.flatMap((s) => (s.name === 'Chippenham' ? [[-1.78, 51.56] as [number, number], [s.lon, s.lat] as [number, number]] : [[s.lon, s.lat] as [number, number]]));
  return pts.map(([lon, lat], i) => `${i ? 'L' : 'M'}${project(lon, lat).x} ${project(lon, lat).y}`).join(' ');
})();

export default function Railway({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const cheer = () => setBurst((b) => b + 1);
  const narrow = useSyncExternalStore(subscribe, narrowNow, () => false);
  const id = RAIL_STEPS[step].id;

  /* ── 1. Noon moves west ── */
  const [sunT, setSunT] = useState(SUN_MIN);
  const [playing, setPlaying] = useState(false);
  const [sunDone, setSunDone] = useState(false);
  const atNoon = MAP_TOWNS.filter((t) => Math.abs(sunT - t.behind - NOON) < 0.25).map((t) => t.name);
  const moveSun = (t: number) => {
    const to = Math.max(SUN_MIN, Math.min(SUN_MAX, Math.round(t * 2) / 2));
    setSunT(to);
    if (to >= SUN_MAX - 0.5 && !sunDone) {
      setSunDone(true);
      cheer();
    }
    const noonNow = MAP_TOWNS.filter((x) => Math.abs(to - x.behind - NOON) < 0.25).map((x) => x.name);
    setStatus(noonNow.length ? `Noon in ${list(noonNow)}. In London it is ${clockTime(to)}.` : `In London it is ${clockTime(to)}.`);
  };
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSunT((t) => {
        const next = t + 0.5;
        if (next >= SUN_MAX) {
          setPlaying(false);
          setSunDone(true);
          setBurst((b) => b + 1);
          return SUN_MAX;
        }
        return next;
      });
    }, reduced ? 120 : 260);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  /* ── 2. Your watch says London time ── */
  const [at, setAt] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const watch = ARRIVE[at];
  const town = STATIONS[at];
  const go = (i: number) => {
    const to = Math.max(0, Math.min(STATIONS.length - 1, i));
    setAt(to);
    setFurthest((f) => Math.max(f, to));
    const s = STATIONS[to];
    setStatus(to === 0 ? `London. Your watch and London’s clock both say ${clockTime(ARRIVE[0])}.` : `${s.name}. Your watch says ${clockTime(ARRIVE[to])}; ${s.name}’s clock says ${clockTime(ARRIVE[to] - s.behind)}: ${minutesWords(s.behind)} behind.`);
  };

  /* ── 3. Will you catch the train? ── */
  const [puzzle, setPuzzle] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [solved, setSolved] = useState(0);
  const p = TRAIN_PUZZLES[puzzle % TRAIN_PUZZLES.length];
  const pTown = STATIONS[stationIndex(p.town)];
  const verdict = catchTrain(p, pTown.behind);
  const right = answer !== null && answer === verdict.caught;
  const why = verdict.caught
    ? `${p.town}’s clock is ${minutesWords(pTown.behind)} behind London’s. When it says ${clockTime(p.clock)}, it is ${clockTime(verdict.london)} in London: ${minutesWords(verdict.spare)} to spare.`
    : `${p.town}’s clock is ${minutesWords(pTown.behind)} behind London’s. When it says ${clockTime(p.clock)}, it is already ${clockTime(verdict.london)} in London. The train left ${minutesWords(-verdict.spare)} ago!`;
  const choose = (yes: boolean) => {
    setAnswer(yes);
    if (yes === verdict.caught) {
      setSolved((n) => n + 1);
      cheer();
      setStatus(`Right! ${why}`);
    } else setStatus('Not quite: try again.');
  };
  const nextPuzzle = () => {
    setPuzzle((n) => n + 1);
    setAnswer(null);
    setStatus('Another train to catch.');
  };

  /* ── 4. You're the stationmaster ── */
  const towns = STATIONS.slice(1);
  const [setAtTown, setSetAtTown] = useState(stationIndex('Bath'));
  const [moved, setMoved] = useState<Record<number, number>>({});
  const [wired, setWired] = useState(false);
  const shows = (i: number) => (wired ? NOON : NOON - STATIONS[i].behind + (moved[i] ?? 0));
  const isSet = (i: number) => shows(i) === NOON;
  const setCount = towns.filter((_, k) => isSet(k + 1)).length;
  const [turned, setTurned] = useState(0);
  // Counted from the clock as it stands, so quick presses each count; within a minute of London's, it clicks into place.
  const turnClock = (i: number, to: (now: number) => number) => {
    setMoved((m) => {
      const from = NOON - STATIONS[i].behind;
      const t0 = to(from + (m[i] ?? 0));
      const t = Math.abs(t0 - NOON) < 1 ? NOON : t0;
      return { ...m, [i]: t - from };
    });
    setTurned((n) => n + 1);
  };
  const setClock = (i: number, to: number) => turnClock(i, () => to);
  const nudge = (by: number) => turnClock(setAtTown, (now) => now + by);
  // Each turn of the clock said aloud; set right, cheered.
  const shown = shows(setAtTown);
  const lastShown = useRef(shown);
  useEffect(() => {
    if (!turned) return;
    const name = STATIONS[setAtTown].name;
    if (shown === NOON) {
      if (lastShown.current !== NOON) setBurst((b) => b + 1);
      setStatus(`Well done! ${name}’s clock keeps railway time: ${clockTime(NOON)}, the same as London.`);
    } else setStatus(`${name}’s clock says ${clockTime(shown)}. ${shown < NOON ? 'Still behind.' : 'Too far: now it is ahead.'}`);
    lastShown.current = shown;
    // Only when the visitor turns the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turned]);
  const sendTime = () => {
    setWired(true);
    cheer();
    setStatus('The time is sent down the telegraph wire, and every town clock is set to railway time.');
  };

  /* ── 5. A clock with two minute hands ── */
  const [pick, setPick] = useState<'red' | 'black' | null>(null);
  const bristolRight = pick === 'red';
  const choosePick = (h: 'red' | 'black') => {
    setPick(h);
    if (h === 'red') {
      cheer();
      setStatus('Right! The red hand shows London time: it is further on, because London’s time was ahead. The black hand shows Bristol’s own time.');
    } else setStatus('Not quite. London’s time was ahead of Bristol’s: which hand is further on?');
  };

  const goStep = (i: number) => {
    const to = Math.max(0, Math.min(RAIL_STEPS.length - 1, i));
    setStep(to);
    setPlaying(false);
    setStatus(`Step ${to + 1}: ${RAIL_STEPS[to].title}.`);
  };

  const done = (i: number) => {
    const s = RAIL_STEPS[i].id;
    return s === 'sun' ? sunDone : s === 'journey' ? furthest === STATIONS.length - 1 : s === 'catch' ? solved > 0 : s === 'set' ? setCount === towns.length : bristolRight;
  };

  const facts = RAIL_FACTS[id];

  return (
    <div className="vbi-bench vbi-railway">
      <div className="vbr-scene vbi-scene">
        {(id === 'sun' || id === 'journey') && (
          <MapScene mode={id} narrow={narrow} sunT={sunT} at={at} watch={watch} reduced={reduced} onSun={(t) => moveSun(t)} />
        )}
        {id === 'catch' && <CatchScene p={p} answer={answer} right={right} caught={verdict.caught} london={verdict.london} reduced={reduced} burst={burst} />}
        {id === 'set' && <SetScene town={STATIONS[setAtTown]} shows={shows(setAtTown)} reduced={reduced} wired={wired} burst={isSet(setAtTown) ? burst : 0} onSet={(t) => setClock(setAtTown, t)} />}
        {id === 'bristol' && <BristolScene pick={pick} reduced={reduced} burst={bristolRight ? burst : 0} onPick={choosePick} />}
      </div>

      <div className="vbr-card vbi-card">
        <StepDots steps={RAIL_STEPS} at={step} done={done} onGo={goStep} label="Railway time, step by step" />
        <h2 className="vbi-step-title">{RAIL_STEPS[step].title}</h2>
        <p className="vbi-step-body">{RAIL_STEPS[step].body}</p>
        <p className="vbi-task">
          <span className="vbi-task-mark" aria-hidden="true">▸</span> {RAIL_STEPS[step].task}
        </p>

        <div className="vbi-step-area">
          {id === 'sun' && (
            <>
              <label className="vbi-sun-slider">
                <span className="vbr-label">Move the Sun west</span>
                <input type="range" min={SUN_MIN} max={SUN_MAX} step={0.5} value={sunT} onChange={(e) => moveSun(Number(e.target.value))} aria-valuetext={`London time ${clockTime(sunT)}`} />
              </label>
              <div className="vbi-sun-row">
                <button type="button" className="vbr-button vbr-button-primary" onClick={() => (sunT >= SUN_MAX ? (setSunT(SUN_MIN), setPlaying(true)) : setPlaying((x) => !x))}>
                  {playing ? 'Pause' : sunT >= SUN_MAX ? 'Again' : 'Play the Sun'}
                </button>
                <p className="vbi-big-readout vbi-readout" aria-live="polite">
                  London <strong className="vbi-tnum">{clockTime(sunT)}</strong>
                  <span className="vbi-readout-sub">{atNoon.length ? `Noon in ${list(atNoon)}` : sunT === SUN_MIN ? 'Noon in London' : 'Noon is on its way west'}</span>
                </p>
              </div>
            </>
          )}

          {id === 'journey' && (
            <>
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary vbi-steam-on" onClick={() => go(at + 1)} disabled={at === STATIONS.length - 1}>
                  Steam to the next station <span aria-hidden="true">→</span>
                </button>
                {at === STATIONS.length - 1 && (
                  <button type="button" className="vbr-button" onClick={() => go(0)}>
                    Back to London
                  </button>
                )}
              </div>
              <p className="vbi-big-readout vbi-readout vbi-compare" aria-live="polite">
                <span>
                  Your watch <strong className="vbi-tnum">{clockTime(watch)}</strong>
                </span>
                <span>
                  {town.name} <strong className="vbi-tnum">{clockTime(watch - town.behind)}</strong>
                </span>
                <span className="vbi-readout-sub">{at === 0 ? 'In London they agree.' : `${town.name}’s clock is ${minutesWords(town.behind)} behind.`}</span>
              </p>
            </>
          )}

          {id === 'catch' && (
            <div className="vbi-puzzle">
              <p className="vbi-puzzle-q">
                <span className="vbi-puzzle-n">Train {(puzzle % TRAIN_PUZZLES.length) + 1} of {TRAIN_PUZZLES.length}.</span> You are in <strong>{p.town}</strong>. Its clock says <strong>{clockTime(p.clock)}</strong>. Your train leaves at <strong>{clockTime(p.train)}</strong> London time.
              </p>
              <div className="vbi-answers vbi-answers-two" role="group" aria-label="Will you catch it?">
                {[true, false].map((yes) => (
                  <button key={String(yes)} type="button" className="vbi-answer" data-verdict={answer === yes ? (yes === verdict.caught ? 'right' : 'wrong') : undefined} aria-pressed={answer === yes} onClick={() => choose(yes)} disabled={right}>
                    {yes ? 'Yes, I’ll catch it' : 'No, it’s gone'}
                  </button>
                ))}
              </div>
              <div className="vbi-feedback" aria-live="polite" data-verdict={answer === null ? undefined : right ? 'right' : 'wrong'}>
                {answer !== null && <p className="vbi-verdict">{right ? 'Right!' : 'Not quite: try again.'}</p>}
              </div>
              {right && (
                <>
                  <p className="vbi-why">{why}</p>
                  <button type="button" className="vbr-button vbr-button-primary" onClick={nextPuzzle}>
                    Another train <span aria-hidden="true">→</span>
                  </button>
                </>
              )}
            </div>
          )}

          {id === 'set' && (
            <>
              <div className="vbr-options vbi-stations" role="group" aria-label="The town clocks">
                {towns.map((s, k) => (
                  <button
                    key={s.name}
                    type="button"
                    className="vbr-option"
                    aria-pressed={setAtTown === k + 1}
                    onClick={() => {
                      setSetAtTown(k + 1);
                      lastShown.current = shows(k + 1);
                    }}
                    aria-label={`${s.name}${isSet(k + 1) ? ' (set)' : ''}`}
                  >
                    {isSet(k + 1) && (
                      <span className="vbi-tick" aria-hidden="true">
                        ✓
                      </span>
                    )}
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="vbi-setter-buttons" role="group" aria-label={`Move ${STATIONS[setAtTown].name}’s clock`}>
                <button type="button" className="vbi-nudge" onClick={() => nudge(-1)} aria-label="Back one minute" disabled={wired}>
                  − 1 min
                </button>
                <span className="vbi-setter-now vbi-tnum" aria-hidden="true">
                  {clockTime(shows(setAtTown))}
                </span>
                <button type="button" className="vbi-nudge" onClick={() => nudge(1)} aria-label="Forward one minute" disabled={wired}>
                  + 1 min
                </button>
              </div>
              <div className="vbi-feedback" aria-live="polite" data-verdict={isSet(setAtTown) ? 'right' : undefined}>
                <p className={isSet(setAtTown) ? 'vbi-verdict' : 'vbi-verdict vbi-verdict-quiet'}>
                  {wired ? `Every clock on the line now says ${clockTime(NOON)}.` : isSet(setAtTown) ? `${STATIONS[setAtTown].name} keeps railway time!` : `${setCount} of ${towns.length} clocks set.`}
                </p>
              </div>
              {!wired && (
                <button type="button" className="vbr-button vbi-wire-button" onClick={sendTime}>
                  Send the time by telegraph
                </button>
              )}
            </>
          )}

          {id === 'bristol' && (
            <>
              <div className="vbi-answers vbi-answers-two" role="group" aria-label="Which hand shows London time?">
                {(['red', 'black'] as const).map((h) => (
                  <button key={h} type="button" className="vbi-answer" data-hand={h} data-verdict={pick === h ? (h === 'red' ? 'right' : 'wrong') : undefined} aria-pressed={pick === h} onClick={() => choosePick(h)} disabled={bristolRight}>
                    The {h} hand
                  </button>
                ))}
              </div>
              <div className="vbi-feedback" aria-live="polite" data-verdict={pick === null ? undefined : bristolRight ? 'right' : 'wrong'}>
                {pick !== null && <p className="vbi-verdict">{bristolRight ? 'Right! Red is London. Black is Bristol.' : 'Not quite. London’s time was ahead: which hand is further on?'}</p>}
              </div>
            </>
          )}
        </div>

        <CardFoot at={step} count={RAIL_STEPS.length} onGo={goStep} facts={facts} poster={id === 'bristol' ? POSTER.growth : undefined} reset={step} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/* ───────── The map: towns, clocks, the Sun and the train ───────── */

function MapScene({ mode, narrow, sunT, at, watch, reduced, onSun }: { mode: 'sun' | 'journey'; narrow: boolean; sunT: number; at: number; watch: number; reduced: boolean; onSun: (t: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const [held, setHeld] = useState(false);
  const sx = sunX(sunT, MAP_TOWNS);
  const train = project(STATIONS[at].lon, STATIONS[at].lat);
  const town = STATIONS[at];
  // On a phone, cropped to the towns, so they read larger.
  // On the journey, the north of the map gives way to the two clocks, drawn large beneath it.
  const view = mode === 'journey' ? (narrow ? '60 120 880 780' : '0 120 1000 780') : narrow ? '60 40 900 520' : `0 0 ${MAP.w} ${MAP.h}`;

  const toX = (e: ReactPointerEvent) => {
    const el = svg.current;
    const m = el?.getScreenCTM?.();
    if (!el || !m) return null;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(m.inverse()).x;
  };
  const dragSun = (e: ReactPointerEvent) => {
    if (!held) return;
    const x = toX(e);
    if (x !== null) onSun(sunTimeAt(x, MAP_TOWNS, SUN_MIN, SUN_MAX));
  };
  // Take hold of the Sun, or of the sky anywhere along its path, and it comes to the pointer.
  const grab = (e: ReactPointerEvent) => {
    setHeld(true);
    try {
      svg.current?.setPointerCapture?.(e.pointerId);
    } catch {}
    const x = toX(e);
    if (x !== null) onSun(sunTimeAt(x, MAP_TOWNS, SUN_MIN, SUN_MAX));
  };

  const label =
    mode === 'sun'
      ? `A map of the south of England and Wales, with a clock at each town. In London it is ${clockTime(sunT)}. ${MAP_TOWNS.map((t) => `${t.name} ${clockTime(sunT - t.behind)}`).join(', ')}.`
      : `A map of the railway west from London. The train is at ${town.name}. Your watch says ${clockTime(watch)}; ${town.name}’s clock says ${clockTime(watch - town.behind)}.`;

  return (
    <svg ref={svg} className="vbi-map" viewBox={view} role="img" aria-label={label} data-mode={mode} onPointerMove={dragSun} onPointerUp={() => setHeld(false)} onPointerCancel={() => setHeld(false)}>
      <defs>
        <pattern id="vbi-waves" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q10 6 20 12 T40 12" fill="none" stroke="#7c97a3" strokeOpacity="0.35" strokeWidth="1.4" />
        </pattern>
        <radialGradient id="vbi-sun-glow">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <clipPath id="vbi-map-clip">
        <rect x="0" y="0" width={MAP.w} height={MAP.h} rx="10" />
      </clipPath>
      <g clipPath="url(#vbi-map-clip)">
        <rect x="0" y="0" width={MAP.w} height={MAP.h} fill="#c9d8dc" />
        <rect x="0" y="0" width={MAP.w} height={MAP.h} fill="url(#vbi-waves)" />
        <path d={COAST_D} fill="#efe6cf" stroke="#6b5a40" strokeWidth="2.2" strokeLinejoin="round" />
        <path d={WIGHT_D} fill="#efe6cf" stroke="#6b5a40" strokeWidth="2" />
      </g>
      <text x="760" y="560" className="vbi-map-sea">
        English Channel
      </text>
      <path d={LINE_D} className="vbi-map-line" />
      <path d={LINE_D} className="vbi-map-sleepers" />

      {MAP_TOWNS.map((t) => {
        const c = project(t.lon, t.lat);
        const b = BADGE[t.name];
        const local = (mode === 'sun' ? sunT : watch) - t.behind;
        const reached = mode === 'sun' && local >= NOON - 0.01;
        const noonNow = mode === 'sun' && Math.abs(local - NOON) < 0.25;
        const here = mode === 'journey' && t.name === town.name;
        const showBadge = mode === 'sun';
        return (
          <g key={t.name} className="vbi-town" data-reached={reached || undefined} data-noon={noonNow || undefined} data-here={here || undefined}>
            {showBadge && <path d={`M${c.x} ${c.y} L${b.x} ${b.y}`} className="vbi-map-leader" />}
            <circle cx={c.x} cy={c.y} r={here ? 10 : 7} className="vbi-map-dot" />
            {showBadge ? (
              <MiniClock x={b.x} y={b.y} minutes={local} name={t.name} reached={reached} noon={noonNow} reduced={reduced} />
            ) : (
              <text x={c.x + (LABEL[t.name]?.dx ?? 0)} y={c.y + (LABEL[t.name]?.dy ?? 30)} textAnchor={LABEL[t.name]?.anchor ?? 'middle'} className="vbi-map-name" data-here={here || undefined}>
                {t.name}
              </text>
            )}
          </g>
        );
      })}

      {mode === 'sun' && <rect x="0" y="0" width={MAP.w} height="84" fill="transparent" className="vbi-sun-track" onPointerDown={grab} />}
      {mode === 'sun' && (
        <g
          className="vbi-sun"
          style={{ transform: `translateX(${sx}px)`, transition: reduced || held ? 'none' : undefined }}
          onPointerDown={grab}
          aria-hidden="true"
        >
          <circle cx="0" cy="40" r="52" fill="url(#vbi-sun-glow)" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={r2(Math.cos(a) * 26)} y1={r2(40 + Math.sin(a) * 26)} x2={r2(Math.cos(a) * 38)} y2={r2(40 + Math.sin(a) * 38)} stroke="#e0a83a" strokeWidth="5" strokeLinecap="round" />;
          })}
          <circle cx="0" cy="40" r="20" fill="#f2c45a" stroke="#c98a2a" strokeWidth="3" />
          <path d="M0 64 V160" stroke="#f2c45a" strokeWidth="3" strokeDasharray="4 6" opacity="0.8" />
        </g>
      )}
      {mode === 'sun' && (
        <text x="40" y="34" className="vbi-map-hint">
          ← West
        </text>
      )}

      {mode === 'journey' && (
        <>
          <g className="vbi-train" style={{ transform: `translate(${train.x - 30}px, ${train.y - 40}px) scale(0.75)`, transition: reduced ? 'none' : undefined }}>
            <Locomotive base={64} />
          </g>
          {/* the two clocks, out in the Channel */}
          <g className="vbi-compare-clocks">
            <rect x="70" y="612" width="860" height="284" rx="14" className="vbi-map-panel" />
            <Clock x={290} y={722} scale={0.92} minutes={watch} label="Your watch" sub="London" reduced={reduced} />
            <Clock x={710} y={722} scale={0.92} minutes={watch - town.behind} label={town.name} sub="Town" town reduced={reduced} />
            {town.behind > 0 && (
              <g transform="translate(500 722)">
                <rect x="-52" y="-24" width="104" height="48" rx="24" className="vbi-behind-pill" />
                <text y="9" textAnchor="middle" className="vbi-behind-text">
                  −{fmtBehind(town.behind)} min
                </text>
              </g>
            )}
          </g>
        </>
      )}
    </svg>
  );
}

/** A town's own clock on the map: a small face, its name and time beneath; gold once noon has come, glowing at noon. */
function MiniClock({ x, y, minutes, name, reached, noon, reduced }: { x: number; y: number; minutes: number; name: string; reached: boolean; noon: boolean; reduced: boolean }) {
  const h = hands(minutes);
  const r = 30;
  // The plaque grows with a long name (Chippenham), so the name never spills out of it.
  const plaque = Math.max(116, Math.round(name.length * 13.4) + 18);
  return (
    <g transform={`translate(${x} ${y})`} className="vbi-mini" data-reached={reached || undefined} data-noon={noon || undefined}>
      <circle r={r + 6} className="vbi-mini-rim" />
      <circle r={r} fill="#fbf7ef" stroke="#2a2522" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" y1={-r + 3} x2="0" y2={-r + 9} stroke="#2a2522" strokeWidth="2.4" transform={`rotate(${i * 90})`} />
      ))}
      <line className="vbi-hand" x1="0" y1="3" x2="0" y2={-r * 0.5} stroke="#2a2522" strokeWidth="3.6" strokeLinecap="round" style={{ transform: `rotate(${h.hour}deg)`, transition: reduced ? 'none' : undefined }} />
      <line className="vbi-hand" x1="0" y1="4" x2="0" y2={-r * 0.82} stroke="#2a2522" strokeWidth="2.2" strokeLinecap="round" style={{ transform: `rotate(${h.minute}deg)`, transition: reduced ? 'none' : undefined }} />
      <circle r="3" fill="#a4565c" />
      <rect x={-plaque / 2} y={r + 10} width={plaque} height="50" rx="6" className="vbi-mini-plaque" />
      <text y={r + 31} textAnchor="middle" className="vbi-mini-name">
        {name}
      </text>
      <text y={r + 54} textAnchor="middle" className="vbi-mini-time">
        {clockTime(minutes)}
      </text>
    </g>
  );
}

/* ───────── Will you catch the train? ───────── */

function CatchScene({ p, answer, right, caught, london, reduced, burst }: { p: { town: string; train: number; clock: number }; answer: boolean | null; right: boolean; caught: boolean; london: number; reduced: boolean; burst: number }) {
  const gone = right && !caught;
  return (
    <div className="vbi-catch" data-solved={right || undefined}>
      <svg className="vbi-catch-svg" viewBox="0 0 1000 600" role="img" aria-label={`${p.town} station. The town clock says ${clockTime(p.clock)}. The train leaves at ${clockTime(p.train)} London time. ${right ? `London time is ${clockTime(london)}: ${caught ? 'you catch it' : 'the train has gone'}.` : 'London time is a time to work out.'}`}>
        <rect x="0" y="0" width="1000" height="600" rx="12" fill="#e9dcc4" />
        <rect x="0" y="420" width="1000" height="180" fill="#8a7a62" />
        <rect x="0" y="420" width="1000" height="14" fill="#c9b48a" />
        <path d="M0 520 H1000 M0 560 H1000" stroke="#3a3430" strokeWidth="6" />
        {/* the departure board */}
        <g transform="translate(600 70)">
          <rect width="360" height="190" rx="10" fill="#2f4a32" stroke="#c9a24a" strokeWidth="4" />
          <text x="180" y="44" textAnchor="middle" className="vbi-board-small">
            Train to London
          </text>
          <text x="180" y="112" textAnchor="middle" className="vbi-board-big">
            {clockTime(p.train)}
          </text>
          <text x="180" y="160" textAnchor="middle" className="vbi-board-small">
            London time
          </text>
        </g>
        {/* the town clock, on its tower */}
        <rect x="150" y="40" width="300" height="380" rx="6" fill="#b9a27a" />
        <path d="M130 50 L300 -10 L470 50Z" fill="#6b4a32" />
        <Clock x={300} y={190} scale={1.05} minutes={p.clock} label={`${p.town}`} sub="Town clock" town reduced={reduced} />
        {/* the train: waiting at the platform, or gone */}
        <g className="vbi-catch-train" data-gone={gone || undefined} style={{ transition: reduced ? 'none' : undefined }}>
          <g transform="translate(560 330) scale(1.3)">
            <Locomotive base={64} />
            <rect x="82" y="16" width="120" height="40" rx="4" fill="#6b4a32" />
            <rect x="92" y="24" width="24" height="16" fill="#f2d68a" />
            <rect x="128" y="24" width="24" height="16" fill="#f2d68a" />
            <rect x="164" y="24" width="24" height="16" fill="#f2d68a" />
            <circle cx="110" cy="60" r="6" fill="#2a2522" />
            <circle cx="176" cy="60" r="6" fill="#2a2522" />
          </g>
        </g>
        {right && (
          <g className="vbi-stamp" data-caught={caught || undefined}>
            <rect x="560" y="290" width="400" height="104" rx="14" />
            <text x="760" y="362" textAnchor="middle">
              {caught ? '✓ You catch it!' : '✗ Missed it!'}
            </text>
          </g>
        )}
        {answer !== null && !right && (
          <text x="760" y="350" textAnchor="middle" className="vbi-catch-try">
            Try again
          </text>
        )}
      </svg>
      <div className="vbi-catch-cheer">
        <Celebrate burst={right && caught ? burst : 0} reduced={reduced} />
      </div>
    </div>
  );
}

/* ───────── You're the stationmaster ───────── */

function SetScene({ town, shows, reduced, wired, burst, onSet }: { town: { name: string; behind: number }; shows: number; reduced: boolean; wired: boolean; burst: number; onSet: (t: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const C = { x: 680, y: 262 };
  const matched = shows === NOON;
  const angleAt = (e: ReactPointerEvent) => {
    const el = svg.current;
    const m = el?.getScreenCTM?.();
    if (!el || !m) return null;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const q = pt.matrixTransform(m.inverse());
    return (Math.atan2(q.x - C.x, -(q.y - C.y)) * 180) / Math.PI;
  };
  const move = (e: ReactPointerEvent) => {
    if (!dragging.current || wired) return;
    const a = angleAt(e);
    if (a !== null) onSet(dragMinute(shows, a));
  };
  const keys = (e: KeyboardEvent<SVGGElement>) => {
    if (wired) return;
    const by = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : e.key === 'PageUp' ? 5 : e.key === 'PageDown' ? -5 : 0;
    if (!by) return;
    e.preventDefault();
    onSet(shows + by);
  };
  return (
    <div className="vbi-set">
      <svg ref={svg} className="vbi-set-svg" viewBox="0 0 1000 540" onPointerMove={move} onPointerUp={() => (dragging.current = false)} onPointerCancel={() => (dragging.current = false)}>
        <rect x="0" y="0" width="1000" height="540" rx="12" fill="#efe6cf" opacity="0.94" />
        <text x="230" y="70" textAnchor="middle" className="vbi-set-head">
          London
        </text>
        <text x="680" y="70" textAnchor="middle" className="vbi-set-head">
          {town.name}
        </text>
        {/* the telegraph wire between them, live once the time is sent */}
        <path d="M330 200 Q430 140 525 200" className={wired ? 'vbi-wire vbi-wire-live' : 'vbi-wire'} />
        <Clock x={230} y={290} scale={0.9} minutes={NOON} label="Railway time" sub="London" reduced={reduced} />
        <g
          className="vbi-dragclock"
          role="slider"
          tabIndex={0}
          aria-label={`${town.name}’s clock: drag the minute hand, or use the arrow keys`}
          aria-valuemin={NOON - 60}
          aria-valuemax={NOON + 60}
          aria-valuenow={shows}
          aria-valuetext={clockTime(shows)}
          aria-disabled={wired || undefined}
          onKeyDown={keys}
          onPointerDown={(e) => {
            if (wired) return;
            dragging.current = true;
            try {
              svg.current?.setPointerCapture?.(e.pointerId);
            } catch {}
            const a = angleAt(e);
            if (a !== null) onSet(dragMinute(shows, a));
          }}
        >
          <Clock x={C.x} y={C.y} scale={1.45} minutes={shows} label={matched ? 'Railway time!' : 'Town time'} sub={town.name} town matched={matched} reduced={reduced} grab />
        </g>
        {!matched && !wired && (
          <g className="vbi-drag-hint" aria-hidden="true" transform="translate(900 100)">
            <text textAnchor="middle" className="vbi-set-hint">
              Drag me ↻
            </text>
          </g>
        )}
      </svg>
      <div className="vbi-set-cheer">
        <Celebrate burst={burst} reduced={reduced} />
      </div>
    </div>
  );
}

/* ───────── Bristol's clock with two minute hands ───────── */

function BristolScene({ pick, reduced, burst, onPick }: { pick: 'red' | 'black' | null; reduced: boolean; burst: number; onPick: (h: 'red' | 'black') => void }) {
  const london = BRISTOL_CLOCK.london;
  const bristol = london - BRISTOL_CLOCK.behind;
  const r = 200;
  const hourA = hands(london).hour;
  const red = hands(london).minute;
  const black = hands(bristol).minute;
  const known = pick === 'red';
  return (
    <div className="vbi-bristol" data-solved={known || undefined}>
      <svg className="vbi-bristol-svg" viewBox="0 0 1000 600" role="img" aria-label={`Bristol’s Exchange clock, with one hour hand and two minute hands: a red one at ${clockTime(london)} and a black one at ${clockTime(bristol)}.${known ? ' The red hand shows London time; the black hand Bristol’s own.' : ''}`}>
        {/* the Exchange's stone front behind the clock */}
        <rect x="200" y="20" width="600" height="580" fill="#d9ccb0" />
        <path d="M180 60 L500 0 L820 60Z" fill="#b9a27a" />
        {[240, 320, 680, 760].map((x) => (
          <rect key={x} x={x - 14} y="120" width="28" height="480" fill="#c8b994" />
        ))}
        <g transform="translate(500 320)">
          <circle r={r + 22} fill="#1f2f22" />
          <circle r={r + 12} fill="#c9a24a" />
          <circle r={r} fill="#fbf7ef" />
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
          <line x1="0" y1="16" x2="0" y2={-r * 0.5} stroke="#2a2522" strokeWidth="12" strokeLinecap="round" transform={`rotate(${hourA})`} />
          <g className="vbi-bhand" data-hand="black" data-picked={pick === 'black' || undefined} transform={`rotate(${black})`} onClick={() => onPick('black')}>
            <line x1="0" y1="20" x2="0" y2={-r * 0.86} stroke="transparent" strokeWidth="40" />
            <line x1="0" y1="20" x2="0" y2={-r * 0.86} stroke="#1c1a18" strokeWidth="7" strokeLinecap="round" />
          </g>
          <g className="vbi-bhand" data-hand="red" data-picked={pick === 'red' || undefined} transform={`rotate(${red})`} onClick={() => onPick('red')}>
            <line x1="0" y1="20" x2="0" y2={-r * 0.86} stroke="transparent" strokeWidth="40" />
            <line x1="0" y1="20" x2="0" y2={-r * 0.86} stroke="#c0392b" strokeWidth="7" strokeLinecap="round" />
          </g>
          <circle r="10" fill="#c9a24a" stroke="#2a2522" strokeWidth="2" />
        </g>
        {known && (
          <g className="vbi-bristol-labels">
            <g transform="translate(840 150)">
              <rect x="-10" y="-34" width="160" height="78" rx="10" fill="#c0392b" />
              <text x="70" y="0" textAnchor="middle" className="vbi-bristol-tag">
                London
              </text>
              <text x="70" y="32" textAnchor="middle" className="vbi-bristol-tag-sub">
                {clockTime(london)}
              </text>
            </g>
            <g transform="translate(40 150)">
              <rect x="-10" y="-34" width="160" height="78" rx="10" fill="#1c1a18" />
              <text x="70" y="0" textAnchor="middle" className="vbi-bristol-tag">
                Bristol
              </text>
              <text x="70" y="32" textAnchor="middle" className="vbi-bristol-tag-sub">
                {clockTime(bristol)}
              </text>
            </g>
          </g>
        )}
      </svg>
      <div className="vbi-set-cheer">
        <Celebrate burst={burst} reduced={reduced} />
      </div>
    </div>
  );
}

/* ───────── Clocks and the engine ───────── */

/** A clock on the station wall: a white face, black hands, and its name on a plaque beneath. Matched, it rings green; `grab` draws a knob on its minute hand to drag by. */
function Clock({ x, y, scale = 1, minutes, label, sub, town = false, reduced = false, matched = false, grab = false }: { x: number; y: number; scale?: number; minutes: number; label: string; sub: string; town?: boolean; reduced?: boolean; matched?: boolean; grab?: boolean }) {
  const h = hands(minutes);
  const r = 92;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="vbi-clock" data-matched={matched || undefined}>
      <circle r={r + 12} fill={matched ? '#3f8a4a' : town ? '#6b4a32' : '#2f4a32'} />
      <circle r={r} fill="#fbf7ef" stroke="#2a2522" strokeWidth="2" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const long = i % 5 === 0;
        return <line key={i} x1={r2(Math.sin(a) * (r - 6))} y1={r2(-Math.cos(a) * (r - 6))} x2={r2(Math.sin(a) * (r - (long ? 18 : 11)))} y2={r2(-Math.cos(a) * (r - (long ? 18 : 11)))} stroke="#2a2522" strokeWidth={long ? 3 : 1.2} />;
      })}
      {['XII', 'III', 'VI', 'IX'].map((n, i) => (
        <text key={n} x={r2(Math.sin((i * Math.PI) / 2) * (r - 40))} y={r2(-Math.cos((i * Math.PI) / 2) * (r - 40) + 6)} textAnchor="middle" className="vbi-clock-n">
          {n}
        </text>
      ))}
      <line className="vbi-hand" x1="0" y1="10" x2="0" y2={-r * 0.5} stroke="#2a2522" strokeWidth="6" strokeLinecap="round" style={{ transform: `rotate(${h.hour}deg)`, transition: reduced ? 'none' : undefined }} />
      <g className="vbi-hand" style={{ transform: `rotate(${h.minute}deg)`, transition: reduced || grab ? 'none' : undefined }}>
        <line x1="0" y1="14" x2="0" y2={-r * 0.8} stroke="#2a2522" strokeWidth="3.4" strokeLinecap="round" />
        {grab && <circle cy={-r * 0.8} r="11" className="vbi-grab" />}
      </g>
      <circle r="5" fill="#a4565c" />
      <rect x="-118" y={r + 16} width="236" height="66" rx="6" fill="#f4eee3" stroke="#c9a24a" strokeWidth="1.5" />
      <text y={r + 44} textAnchor="middle" className="vbi-clock-label">
        {label}
      </text>
      <text y={r + 72} textAnchor="middle" className="vbi-clock-sub">
        {sub} · {clockTime(minutes)}
      </text>
    </g>
  );
}

/** A small engine, from the side, facing west (to the right), its wheels on the rail at `base`. */
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
      ].map(([cx, r]) => (
        <circle key={cx} cx={cx} cy={64 - r} r={r} fill="#a4565c" stroke="#2a2522" strokeWidth="2" />
      ))}
    </g>
  );
}
