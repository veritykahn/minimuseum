'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import Celebrate from '../Celebrate';
import { NOTES, POSTER, RAIL_STEPS, STATIONS, TRAIN_PUZZLES } from './inventionsText';
import { StepButtons, StepDots } from './Steps';
import { clockTime, hands } from './workshop';

/*
 * The railway bench: the line west from London, its towns along it, and a
 * locomotive to steam from station to station. At each station two clocks
 * hang side by side: the railway's, kept to London time, and the town's
 * own, kept by the Sun, a few minutes behind (the 1841 timetable's
 * minutes). The comparison is made at noon by London time.
 *
 * The card tells it in five steps, each with something to do: steam west
 * and watch the town clocks fall behind; work out whether you would catch
 * your train; set a town's clock to railway time yourself, a minute at a
 * time; send the time down the line by telegraph; and see one time kept
 * everywhere. Its words are large, for a class reading it off a projector.
 */

const NOON = 12 * 60;
/** On a phone the line runs down the screen, its towns one under another and the clocks beside them. */
const NARROW = '(max-width: 760px)';
const subscribe = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(NARROW);
  mql.addEventListener?.('change', onChange);
  return () => mql.removeEventListener?.('change', onChange);
};
const narrowNow = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(NARROW).matches;
/** The line drawn down the screen: x of the rails, and the first and last stations' y. */
const DOWN = { x: 120, y0: 40, y1: 400 };
const stationY = (i: number) => DOWN.y0 + ((DOWN.y1 - DOWN.y0) * i) / (STATIONS.length - 1);
const LINE = { x0: 70, x1: 930, y: 150 };
const stationX = (i: number) => LINE.x0 + ((LINE.x1 - LINE.x0) * i) / (STATIONS.length - 1);
// Rounded, so the server's drawing and the browser's agree to the last digit.
const r2 = (n: number) => Math.round(n * 100) / 100;
const stationIndex = (name: string) => STATIONS.findIndex((s) => s.name === name);
const behindWords = (m: number) => `${String(m).replace('.5', '½')} minute${m === 1 ? '' : 's'}`;

export default function Railway({ reduced, footer }: { reduced: boolean; footer?: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [at, setAt] = useState(0);
  const [synced, setSynced] = useState(false);
  // Minutes the visitor has moved each town's clock on by hand (the "set the clock" step).
  const [moved, setMoved] = useState<Record<number, number>>({});
  const [setDone, setSetDone] = useState(false);
  const [nudged, setNudged] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [puzzle, setPuzzle] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [solved, setSolved] = useState(0);
  const [burst, setBurst] = useState(0);
  const narrow = useSyncExternalStore(subscribe, narrowNow, () => false);
  const [status, setStatus] = useState('');

  const id = RAIL_STEPS[step].id;
  const townTimeAt = (i: number) => (synced ? NOON : NOON - STATIONS[i].behind + (moved[i] ?? 0));
  const p = TRAIN_PUZZLES[puzzle % TRAIN_PUZZLES.length];

  // What the scene shows: in the puzzle, the puzzle's town and its two clocks; otherwise noon by London time.
  const scene =
    id === 'catch'
      ? { at: stationIndex(p.town), rail: p.clock + STATIONS[stationIndex(p.town)].behind, town: p.clock, hideRail: answer !== p.answer }
      : { at, rail: NOON, town: townTimeAt(at), hideRail: false };
  const town = STATIONS[scene.at];

  const cheer = () => setBurst((b) => b + 1);

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STATIONS.length - 1, i));
    setAt(to);
    setFurthest((f) => Math.max(f, to));
    const s = STATIONS[to];
    setStatus(to === 0 ? 'London. Railway time and town time agree.' : `${s.name}. Railway time ${clockTime(NOON)}; town time ${clockTime(townTimeAt(to))}.`);
  };

  const goStep = (i: number) => {
    const to = Math.max(0, Math.min(RAIL_STEPS.length - 1, i));
    setStep(to);
    // Setting a clock needs a town that is behind: Bath, unless the train is at one already.
    if (RAIL_STEPS[to].id === 'set' && (at === 0 || synced)) {
      setSynced(false);
      setAt(stationIndex('Bath'));
    }
    setStatus(`Step ${to + 1}: ${RAIL_STEPS[to].title}.`);
  };

  const choose = (c: number) => {
    setAnswer(c);
    if (c === p.answer) {
      setSolved((n) => n + 1);
      cheer();
      setStatus(`Right! ${p.why}`);
    } else {
      setStatus(`Not quite. ${p.why}`);
    }
  };

  const nextPuzzle = () => {
    setPuzzle((n) => n + 1);
    setAnswer(null);
  };

  // Moving the town clock by hand: within half a minute of London's, it clicks into place.
  const nudge = (by: number) => {
    // Counted from the clock as it stands, so quick presses each count.
    setMoved((m) => {
      const was = m[at] ?? 0;
      const shows = NOON - STATIONS[at].behind + was + by;
      return { ...m, [at]: Math.abs(NOON - shows) < 1 ? STATIONS[at].behind : was + by };
    });
    setNudged((n) => n + 1);
  };

  // Each move of the town clock said aloud; set right, cheered.
  const setShows = id === 'set' && at > 0 ? townTimeAt(at) : null;
  useEffect(() => {
    if (!nudged || setShows === null) return;
    const name = STATIONS[at].name;
    if (setShows === NOON) {
      setSetDone(true);
      setBurst((b) => b + 1);
      setStatus(`Well done! ${name}’s clock now keeps railway time: ${clockTime(NOON)}, the same as London.`);
    } else {
      setStatus(`${name}’s clock says ${clockTime(setShows)}. ${setShows < NOON ? 'Still behind.' : 'Too far: now it is ahead.'}`);
    }
    // Only when the visitor moves the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudged]);

  const sync = () => {
    setSynced(true);
    cheer();
    setStatus('The time is sent down the line by telegraph, and every town clock is set to railway time.');
  };

  // Back to the towns' own time, to compare the clocks again.
  const unsync = () => {
    setSynced(false);
    setMoved({});
    setStatus(`The town clocks keep their own time again. ${STATIONS[at].name}: ${clockTime(NOON - STATIONS[at].behind)}.`);
  };

  const done = (i: number) => {
    const s = RAIL_STEPS[i].id;
    return s === 'sun' ? furthest > 0 : s === 'catch' ? solved > 0 : s === 'set' ? setDone : s === 'send' ? synced : false;
  };

  const readout =
    scene.at === 0
      ? `Noon in London: ${clockTime(NOON)} on both clocks.`
      : synced
        ? `${town.name} keeps railway time now: ${clockTime(NOON)} on both clocks.`
        : `When it is noon in London, it is ${clockTime(scene.town)} in ${town.name}.`;

  const stationControls = (
    <>
      <div className="vbr-options vbi-stations" role="group" aria-label="The stations">
        {STATIONS.map((s, i) => (
          <button key={s.name} type="button" className="vbr-option" aria-pressed={i === at} onClick={() => go(i)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="vbr-actions">
        <button type="button" className="vbr-button vbr-button-primary" onClick={() => go(at + 1)} disabled={at === STATIONS.length - 1}>
          Steam on to the next station <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="vbi-readout vbi-big-readout" aria-live="polite">
        {readout}
      </p>
    </>
  );

  return (
    <div className="vbi-bench">
      <div className="vbr-scene vbi-scene">
        {narrow ? (
          <svg className="vbi-rail vbi-rail-down" viewBox="0 0 600 440" role="img" aria-label={`The line west from London, through ${STATIONS.slice(1).map((s) => s.name).join(', ')}. The train is at ${town.name}. The station clock reads ${scene.hideRail ? 'a time to work out' : `${clockTime(scene.rail)}, London time`}; ${town.name}’s own clock reads ${clockTime(scene.town)}.`}>
            <defs>
              <linearGradient id="vbi-sky-down" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f4eee3" />
                <stop offset="1" stopColor="#e6d0cb" />
              </linearGradient>
            </defs>
            {/* the line, London at the top and Bridgewater at the foot, the telegraph's wire beside it */}
            <rect x="8" y="8" width="312" height="424" rx="6" fill="url(#vbi-sky-down)" stroke="#2f4a32" strokeOpacity="0.25" />
            <path d={`M${DOWN.x} ${DOWN.y0} V${DOWN.y1}`} stroke="#2a2522" strokeWidth="4" />
            <path d={`M${DOWN.x} ${DOWN.y0} V${DOWN.y1}`} stroke="#f4eee3" strokeWidth="1.4" strokeDasharray="6 10" />
            <path d={`M${DOWN.x + 18} ${DOWN.y0} V${DOWN.y1}`} stroke="#2a2522" strokeWidth="1" strokeOpacity={synced ? 0.9 : 0.35} className={synced ? 'vbi-wire vbi-wire-live' : 'vbi-wire'} />
            {STATIONS.map((s, i) => (
              <g key={s.name}>
                <circle cx={DOWN.x} cy={stationY(i)} r={i === scene.at ? 11 : 8} fill={i === scene.at ? '#a4565c' : '#f4eee3'} stroke="#2f4a32" strokeWidth="2.4" />
                <text x={DOWN.x + 34} y={stationY(i) + (s.behind ? 2 : 9)} className="vbi-rail-name" data-here={i === scene.at || undefined}>
                  {s.name}
                </text>
                {s.behind > 0 && (
                  <text x={DOWN.x + 34} y={stationY(i) + 25} className="vbi-rail-behind">
                    {`${String(s.behind).replace('.5', '½')} min behind`}
                  </text>
                )}
              </g>
            ))}
            <g className="vbi-train" style={{ transform: `translate(12px, ${stationY(scene.at) - 36}px) scale(0.8)`, transition: reduced ? 'none' : undefined }}>
              <Locomotive base={64} />
            </g>

            {/* the two clocks, one above the other */}
            <g transform="translate(462 0) scale(0.72)">
              <Clock x={0} y={118} minutes={scene.rail} label="Railway time" sub="London" hide={scene.hideRail} reduced={reduced} />
              <Clock x={0} y={424} minutes={scene.town} label="Town time" sub={town.name} town reduced={reduced} matched={!synced && scene.at > 0 && scene.town === NOON} />
            </g>
          </svg>
        ) : (
          <svg className="vbi-rail" viewBox="0 0 1000 600" role="img" aria-label={`The line west from London, through ${STATIONS.slice(1).map((s) => s.name).join(', ')}. The train is at ${town.name}. The station clock reads ${scene.hideRail ? 'a time to work out' : `${clockTime(scene.rail)}, London time`}; ${town.name}’s own clock reads ${clockTime(scene.town)}.`}>
            <defs>
              <linearGradient id="vbi-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4eee3" />
                <stop offset="1" stopColor="#e6d0cb" />
              </linearGradient>
            </defs>
            {/* the country, and the line through it */}
            <rect x="20" y="20" width="960" height="240" rx="6" fill="url(#vbi-sky)" stroke="#2f4a32" strokeOpacity="0.25" />
            <path d="M20 190 Q160 150 300 182 T600 176 T980 186 V260 H20Z" fill="#4e6152" opacity="0.22" />
            <path d={`M${LINE.x0} ${LINE.y} H${LINE.x1}`} stroke="#2a2522" strokeWidth="4" />
            <path d={`M${LINE.x0} ${LINE.y}  H${LINE.x1}`} stroke="#f4eee3" strokeWidth="1.4" strokeDasharray="6 10" />
            {/* telegraph wires along the line, once the time is sent */}
            <path d={`M${LINE.x0} ${LINE.y - 58} H${LINE.x1}`} stroke="#2a2522" strokeWidth="1" strokeOpacity={synced ? 0.9 : 0.35} className={synced ? 'vbi-wire vbi-wire-live' : 'vbi-wire'} />
            {STATIONS.map((s, i) => (
              <g key={s.name}>
                <path d={`M${stationX(i)} ${LINE.y - 64} V${LINE.y - 50}`} stroke="#6b4a32" strokeWidth="2" />
                <circle cx={stationX(i)} cy={LINE.y} r={i === scene.at ? 11 : 8} fill={i === scene.at ? '#a4565c' : '#f4eee3'} stroke="#2f4a32" strokeWidth="2.4" />
                <text x={stationX(i)} y={LINE.y + 40} textAnchor="middle" className="vbi-rail-name" data-here={i === scene.at || undefined}>
                  {s.name}
                </text>
                {i > 0 && (
                  <text x={stationX(i)} y={LINE.y + 64} textAnchor="middle" className="vbi-rail-behind">
                    {s.behind === 0 ? '' : `${String(s.behind).replace('.5', '½')} min behind`}
                  </text>
                )}
              </g>
            ))}
            <g className="vbi-train" style={{ transform: `translateX(${stationX(scene.at) - 40}px)`, transition: reduced ? 'none' : undefined }}>
              <Locomotive base={LINE.y} />
            </g>

            {/* the two clocks at the station */}
            <Clock x={330} y={430} minutes={scene.rail} label="Railway time" sub="London" hide={scene.hideRail} reduced={reduced} />
            <Clock x={670} y={430} minutes={scene.town} label="Town time" sub={town.name} town reduced={reduced} matched={!synced && scene.at > 0 && scene.town === NOON} />
          </svg>
        )}
      </div>

      <div className="vbr-card vbi-card">
        <StepDots steps={RAIL_STEPS} at={step} done={done} onGo={goStep} label="Railway time, step by step" />
        <h2 className="vbi-step-title">{RAIL_STEPS[step].title}</h2>
        <p className="vbi-step-body">{RAIL_STEPS[step].body}</p>
        <p className="vbi-task">
          <span className="vbi-task-mark" aria-hidden="true">▸</span> {RAIL_STEPS[step].task}
        </p>

        {id === 'sun' && (
          <>
            {stationControls}
            {furthest > 0 && at > 0 && (
              <p className="vbi-explain">
                {at === 0 ? '' : `${town.name}’s clock is ${behindWords(STATIONS[at].behind)} behind London’s. The further west, the further behind.`}
              </p>
            )}
            <FactNote fact={NOTES.sunTime} className="vbr-fact" />
          </>
        )}

        {id === 'catch' && (
          <>
            <div className="vbi-puzzle">
              <p className="vbi-puzzle-q">
                You are in <strong>{p.town}</strong>. Your train leaves at <strong>{clockTime(p.train)}</strong> by London time. {p.town}’s church clock says <strong>{clockTime(p.clock)}</strong>. Will you catch it?
              </p>
              <div className="vbi-answers" role="group" aria-label="Your answer">
                {p.choices.map((c, i) => (
                  <button key={c} type="button" className="vbi-answer" data-verdict={answer === i ? (i === p.answer ? 'right' : 'wrong') : undefined} aria-pressed={answer === i} onClick={() => choose(i)} disabled={answer === p.answer}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="vbi-feedback" aria-live="polite" data-verdict={answer === null ? undefined : answer === p.answer ? 'right' : 'wrong'}>
                <Celebrate burst={answer === p.answer ? burst : 0} reduced={reduced} />
                {answer !== null && (
                  <>
                    <p className="vbi-verdict">{answer === p.answer ? 'Right!' : 'Not quite: try again.'}</p>
                    {answer === p.answer && <p className="vbi-why">{p.why}</p>}
                  </>
                )}
              </div>
              {answer === p.answer && (
                <button type="button" className="vbr-button" onClick={nextPuzzle}>
                  Another puzzle
                </button>
              )}
            </div>
            <FactNote fact={NOTES.missTrain} className="vbr-fact" />
          </>
        )}

        {id === 'set' && (
          <>
            {at === 0 ? (
              <p className="vbi-explain">London’s clock already keeps London time. Choose a town to the west.</p>
            ) : (
              <div className="vbi-setter vbi-feedback" data-verdict={townTimeAt(at) === NOON ? 'right' : undefined}>
                <Celebrate burst={townTimeAt(at) === NOON ? burst : 0} reduced={reduced} />
                <p className="vbi-setter-label">
                  {STATIONS[at].name}’s clock: <strong>{clockTime(townTimeAt(at))}</strong>
                </p>
                <div className="vbi-setter-buttons" role="group" aria-label={`Move ${STATIONS[at].name}’s clock`}>
                  <button type="button" className="vbi-nudge" onClick={() => nudge(-1)} aria-label="Back one minute" disabled={synced}>
                    − 1 min
                  </button>
                  <button type="button" className="vbi-nudge" onClick={() => nudge(1)} aria-label="Forward one minute" disabled={synced}>
                    + 1 min
                  </button>
                </div>
                {townTimeAt(at) === NOON && <p className="vbi-verdict">{STATIONS[at].name} keeps railway time!</p>}
              </div>
            )}
            <div className="vbr-options vbi-stations" role="group" aria-label="The stations">
              {STATIONS.map((s, i) => (
                <button key={s.name} type="button" className="vbr-option" aria-pressed={i === at} onClick={() => go(i)}>
                  {s.name}
                </button>
              ))}
            </div>
            <FactNote fact={NOTES.railwayTime} className="vbr-fact" />
            <FactNote fact={NOTES.clearingHouse} className="vbr-fact" />
          </>
        )}

        {id === 'send' && (
          <>
            {stationControls}
            {!synced ? (
              <>
                <FactNote fact={NOTES.railwayTime} className="vbr-fact" />
                <button type="button" className="vbr-button vbr-button-primary vbi-send" onClick={sync}>
                  Send the time down the line
                </button>
              </>
            ) : (
              <>
                <div className="vbi-feedback" data-verdict="right">
                  <Celebrate burst={burst} reduced={reduced} />
                  <p className="vbi-verdict">Every clock on the line now says {clockTime(NOON)}.</p>
                </div>
                {/* The two notes run on as one: they are from the same page, and its source is set once beneath them. */}
                <p className="vbr-fact" data-fact="approved">
                  <span className="vbr-fact-text">{NOTES.railwayTime.text}</span> <span className="vbr-fact-text">{NOTES.timeSignals.text}</span>{' '}
                  <FactSources sources={NOTES.timeSignals.sources} className="vbr-fact-source" />
                </p>
                <button type="button" className="vbr-button vbr-button-quiet vbi-unsync" onClick={unsync}>
                  Put the town clocks back to their own time
                </button>
              </>
            )}
          </>
        )}

        {id === 'law' && (
          <>
            {stationControls}
            {!synced && (
              <button type="button" className="vbr-button" onClick={sync}>
                Send the time down the line
              </button>
            )}
            <FactNote fact={NOTES.legalTime} className="vbr-fact" />
            <p className="vbr-poster">{POSTER.growth}</p>
          </>
        )}

        <StepButtons at={step} count={RAIL_STEPS.length} onGo={goStep} />
        {footer}
      </div>
      <p className="vbr-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

/** A clock on the station wall: a white face, black hands, and its name beneath. Hidden, a question mark covers its face; matched, it rings green. */
function Clock({ x, y, minutes, label, sub, town = false, reduced = false, hide = false, matched = false }: { x: number; y: number; minutes: number; label: string; sub: string; town?: boolean; reduced?: boolean; hide?: boolean; matched?: boolean }) {
  const h = hands(minutes);
  const r = 92;
  return (
    <g transform={`translate(${x} ${y})`} className="vbi-clock" data-matched={matched || undefined}>
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
      <line className="vbi-hand" x1="0" y1="14" x2="0" y2={-r * 0.8} stroke="#2a2522" strokeWidth="3.4" strokeLinecap="round" style={{ transform: `rotate(${h.minute}deg)`, transition: reduced ? 'none' : undefined }} />
      <circle r="5" fill="#a4565c" />
      {hide && (
        <g className="vbi-clock-hide">
          <circle r={r} fill="#2f4a32" />
          <text y="30" textAnchor="middle" className="vbi-clock-q">?</text>
        </g>
      )}
      {/* its name on a cream plaque beneath */}
      <rect x="-118" y={r + 16} width="236" height="66" rx="6" fill="#f4eee3" stroke="#c9a24a" strokeWidth="1.5" />
      <text y={r + 44} textAnchor="middle" className="vbi-clock-label">{label}</text>
      <text y={r + 72} textAnchor="middle" className="vbi-clock-sub">{sub} · {hide ? '?' : clockTime(minutes)}</text>
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
