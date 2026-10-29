'use client';

import { useEffect, useRef, useState } from 'react';
import { FEAR_LAB_COPY as C } from '../fearLab';
import { ROUNDS, makeRounds, tally, type Call, type Round } from './lab';
import type { LabSound } from './sound';

/*
 * The rustling bushes: the startle test. A bush rustles in the dark; call
 * "Tiger!" or "Just the wind" before the time runs out. Then see what was
 * there: in three of the eight rounds, a pair of eyes. At the end, the tally
 * of fake alarms and missed tigers, and poster 1 on why the brain would
 * rather raise a hundred false alarms.
 *
 * A warning comes first. The eyes appear without any flashing; with motion
 * off, nothing shakes, and with sound off, nothing is heard.
 */

/** How long there is to decide, and how long the answer shows, in ms. */
export const DECIDE_MS = 3500;
export const REVEAL_MS = 1800;

type Phase = 'warn' | 'rustle' | 'reveal' | 'done';

const BUSH_X = [70, 210, 350, 490, 630];

function Bush({ i, rustling, eyes }: { i: number; rustling: boolean; eyes: boolean }) {
  const x = BUSH_X[i];
  const s = i % 2 ? 0.92 : 1.06;
  return (
    <g className="fl-bush" data-rustling={rustling ? 'true' : undefined} transform={`translate(${x} 300) scale(${s})`}>
      <g className="fl-bush-leaves">
        <circle cx="-48" cy="-16" r="20" />
        <circle cx="-34" cy="-36" r="28" />
        <circle cx="-8" cy="-58" r="30" />
        <circle cx="22" cy="-54" r="26" />
        <circle cx="44" cy="-30" r="26" />
        <circle cx="52" cy="-10" r="18" />
        <circle cx="0" cy="-22" r="40" />
        <rect x="-64" y="-18" width="128" height="20" rx="10" />
        {/* Leaves catching the moonlight along the top. */}
        <g className="fl-bush-lit">
          <path d="M -40 -60 q 6 -8 14 -4 M -14 -86 q 8 -6 16 0 M 18 -78 q 8 -4 14 2 M 44 -52 q 6 -4 10 4" />
        </g>
      </g>
      {/* Rustle marks, for when nothing may move. */}
      <g className="fl-bush-marks" aria-hidden="true">
        <path d="M -78 -60 q -10 10 0 20 M 78 -60 q 10 10 0 20 M -70 -92 q -12 6 -8 18 M 70 -92 q 12 6 8 18" />
      </g>
      <g className="fl-bush-eyes" data-on={eyes ? 'true' : undefined}>
        <path d="M -30 -40 q 12 -12 24 0 q -12 10 -24 0 Z" />
        <path d="M 6 -40 q 12 -12 24 0 q -12 10 -24 0 Z" />
        <rect x="-19.5" y="-47" width="3" height="13" rx="1.5" className="fl-bush-pupil" />
        <rect x="16.5" y="-47" width="3" height="13" rx="1.5" className="fl-bush-pupil" />
      </g>
    </g>
  );
}

export default function RustlingBushes({
  motion,
  sound,
  onFright,
}: {
  motion: boolean;
  sound: () => LabSound | null;
  onFright: (f: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>('warn');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [calls, setCalls] = useState<Call[]>([]);
  const [status, setStatus] = useState('');
  const [startled, setStartled] = useState(0);
  /** Whole seconds left to decide, for the clock. */
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callsRef = useRef<Call[]>([]);

  const round = rounds[index];

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => clear, []);

  const start = () => {
    setRounds(makeRounds());
    setIndex(0);
    setCalls([]);
    callsRef.current = [];
    setPhase('rustle');
  };

  const reveal = (call: Call) => {
    if (phase !== 'rustle' || !round) return;
    clear();
    callsRef.current = [...callsRef.current, call];
    setCalls(callsRef.current);
    setPhase('reveal');
    if (round.tiger) {
      sound()?.thump();
      setStartled((n) => n + 1);
      onFright(1);
      setStatus(call === 'tiger' ? 'Eyes in the dark! You ran. Good call.' : 'Eyes in the dark! You stayed put.');
    } else {
      onFright(0.25);
      setStatus(call === 'tiger' ? 'Nothing there. A fake alarm.' : 'Nothing there. Just the wind.');
    }
  };

  // Each round: the bush rustles, and the clock runs. Not answering is staying put.
  useEffect(() => {
    if (phase !== 'rustle' || !round) return;
    sound()?.rustle();
    onFright(0.55);
    setStatus(`Round ${index + 1} of ${ROUNDS}. A bush rustles.`);
    timer.current = setTimeout(() => reveal('wind'), DECIDE_MS);
    return clear;
    // reveal reads this round's state; the round is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, rounds]);

  // The seconds left, counted down beside the clock's bar (which holds still with reduced motion).
  useEffect(() => {
    if (phase !== 'rustle') return;
    const t0 = performance.now();
    const count = () => setLeft(Math.max(1, Math.ceil((DECIDE_MS - (performance.now() - t0)) / 1000)));
    count();
    const iv = setInterval(count, 200);
    return () => clearInterval(iv);
  }, [phase, index]);

  // After the answer shows, the next round, or the tally.
  useEffect(() => {
    if (phase !== 'reveal') return;
    timer.current = setTimeout(() => {
      onFright(0.1);
      if (index + 1 >= ROUNDS) {
        setPhase('done');
        setStatus('All eight rounds done.');
        onFright(0);
      } else {
        setIndex(index + 1);
        setPhase('rustle');
      }
    }, REVEAL_MS);
    return clear;
  }, [phase, index, onFright]);

  const t = tally(rounds, calls);
  const showEyes = phase === 'reveal' && !!round?.tiger;
  const playing = phase === 'rustle' || phase === 'reveal';

  return (
    <div className="fl-bushes" data-phase={phase} data-motion={motion ? 'on' : 'off'}>
      <div className="fl-bushes-scene" data-startled={motion && startled ? startled % 2 : undefined}>
        <svg viewBox="0 0 700 340" role="img" aria-label={showEyes ? 'A row of bushes at night. A pair of eyes stares out of one of them.' : 'A row of dark bushes at night under a full moon.'}>
          <defs>
            <radialGradient id="fl-moon-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0.5" stopColor="#fbf6ec" stopOpacity="0.28" />
              <stop offset="1" stopColor="#fbf6ec" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="560" cy="96" r="92" fill="url(#fl-moon-glow)" />
          <circle cx="560" cy="96" r="40" fill="#fbf6ec" />
          <path className="fl-cloud" transform="translate(0 26)" d="M 470 92 q 20 -26 50 -12 q 18 -22 46 -6 q 30 -6 36 18 q 22 4 16 18 l -150 0 q -14 -10 2 -18 Z" />
          {/* Far trees */}
          <path d="M 0 240 L 20 180 L 40 240 L 56 196 L 74 240 L 110 170 L 140 240 L 170 200 L 196 240 L 240 186 L 280 240 L 320 204 L 352 240 L 400 176 L 440 240 L 470 206 L 500 240 L 540 190 L 580 240 L 620 200 L 660 240 L 700 210 L 700 340 L 0 340 Z" fill="#0d1a2c" />
          <rect x="0" y="292" width="700" height="48" fill="#08111e" />
          {BUSH_X.map((_, i) => (
            <Bush key={i} i={i} rustling={phase === 'rustle' && round?.bush === i} eyes={showEyes && round?.bush === i} />
          ))}
        </svg>
        {playing && (
          <div className="fl-bushes-clock-row" aria-hidden="true">
            <div className="fl-bushes-clock">
              <span key={`${index}-${phase}`} data-run={phase === 'rustle' ? 'true' : undefined} style={{ animationDuration: `${DECIDE_MS}ms` }} />
            </div>
            <span className="fl-bushes-secs">{phase === 'rustle' ? left : ''}</span>
          </div>
        )}
        {phase === 'done' && (
          <dl className="fl-bushes-tally">
            <div><dt>Fake alarms</dt><dd>{t.fakeAlarms}</dd></div>
            <div><dt>Missed tigers</dt><dd>{t.missed}</dd></div>
            <div><dt>Tigers spotted</dt><dd>{t.spotted}</dd></div>
          </dl>
        )}
      </div>

      <div className="fl-lab-panel-body">
        {phase === 'warn' && (
          <>
            <h2 className="fl-lab-heading">The Rustling Bushes</h2>
            <p className="fl-lab-note">A bush rustles in the dark. Is it a tiger, or just the wind? Decide before the time runs out.</p>
            <div className="fl-lab-warning" role="note">
              <p><strong>Startle warning.</strong> Eyes will appear suddenly in the dark. Nothing flashes.</p>
              <p>Turn the sound and the motion on or off with the buttons at the top.</p>
            </div>
            <button type="button" className="fl-lab-button" onClick={start}>I’m ready</button>
          </>
        )}
        {playing && (
          <>
            <p className="fl-lab-kicker">Round {index + 1} of {ROUNDS}</p>
            <h2 className="fl-lab-heading">What’s in the bush?</h2>
            <div className="fl-bushes-calls">
              <button type="button" className="fl-lab-button fl-call-tiger" aria-disabled={phase !== 'rustle'} onClick={() => reveal('tiger')}>
                Tiger! Run!
              </button>
              <button type="button" className="fl-lab-button fl-lab-button-quiet" aria-disabled={phase !== 'rustle'} onClick={() => reveal('wind')}>
                Just the wind
              </button>
            </div>
          </>
        )}
        {phase === 'done' && (
          <>
            <h2 className="fl-lab-heading">
              {t.fakeAlarms} fake {t.fakeAlarms === 1 ? 'alarm' : 'alarms'}, {t.missed} missed {t.missed === 1 ? 'tiger' : 'tigers'}
            </h2>
            <p className="fl-lab-poster">{C.tigers}</p>
            <p className="fl-lab-poster">{C.byDesign}</p>
            <button type="button" className="fl-lab-button" onClick={start}>Play again</button>
          </>
        )}
        <p className="fl-lab-status" role="status">{status}</p>
      </div>
    </div>
  );
}
