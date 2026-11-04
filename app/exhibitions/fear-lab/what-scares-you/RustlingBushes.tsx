'use client';

import { useEffect, useRef, useState } from 'react';
import { FEAR_LAB_COPY as C } from '../fearLab';
import { ROUNDS, makeLayout, makeRounds, tally, type BushPlace, type Call, type Clue, type Round } from './lab';
import type { LabSound } from './sound';
import SoundPrompt from './SoundPrompt';

/*
 * The rustling bushes: the startle test. A bush rustles in the dark; call
 * "Tiger!" or "Just the wind" before the time runs out. Then see what was
 * there: in three of the eight rounds, a pair of eyes. At the end, the tally
 * of fake alarms and missed tigers, and poster 1 on why the brain would
 * rather raise a hundred false alarms.
 *
 * Where it happens changes: the bushes stand in different places each game,
 * and each round a different bush rustles, at a different spot in it. Soon
 * after the rustling starts, there is a clue for those watching (and
 * listening) closely: a striped tail tip, a shadow on the ground, paw
 * prints, a low growl (shown as words, too), or leaves blowing loose in the
 * wind. Every clue can be seen, big and bright enough for the back of a
 * class with the sound off: the growl as large shaking words and sound
 * lines, the wind as streaks and a flurry of leaves. The reveal names the
 * clue. "Guess first" takes the timer away, so a class can talk it over
 * before anyone calls; it is on to begin with (for younger classes), and
 * with it on the class moves on to the next round when it is ready. With
 * the timer, there are ten seconds to decide.
 *
 * A warning comes first. The eyes appear without any flashing; with motion
 * off, nothing shakes and the leaves fade instead of blowing, and with sound
 * off, nothing is heard.
 */

/** How long there is to decide, how long the answer shows, and when the clue appears, in ms. */
export const DECIDE_MS = 10000;
export const REVEAL_MS = 2600;
export const CLUE_MS = 1200;

/** What the reveal says each clue was. */
export const CLUE_TEXT: Record<Clue, string> = {
  tail: 'a striped tail tip, poking out of the bush',
  shadow: 'a tiger-shaped shadow on the ground',
  tracks: 'paw prints leading into the bush',
  growl: 'a low growl',
  leaves: 'leaves blowing loose in the wind',
  none: 'none this time. Sometimes there isn’t one',
};

type Phase = 'warn' | 'rustle' | 'reveal' | 'done';

function Paw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx="7" ry="5.6" />
      <circle cx="-7" cy="-7" r="2.5" />
      <circle cx="-2.4" cy="-10" r="2.5" />
      <circle cx="2.8" cy="-10" r="2.5" />
      <circle cx="7.3" cy="-6.8" r="2.5" />
    </g>
  );
}

/**
 * A clue, drawn in the bush's own space (its foot at 0, 0). `side` is the
 * side away from the eyes. Each is big and bright enough to see from the
 * back of a class with the sound off: a sound clue is drawn as well as heard.
 */
function ClueArt({ clue, side }: { clue: Clue; side: 1 | -1 }) {
  if (clue === 'tail')
    return (
      <g className="fl-clue fl-clue-tail" transform={`translate(${side * 58} -8) scale(${side * 1.5} 1.5)`}>
        <g className="fl-clue-swish">
          <path d="M 0 0 q 26 -2 32 -30 q 4 -18 -10 -22" className="fl-clue-tail-fur" />
          <path d="M 0 0 q 26 -2 32 -30 q 4 -18 -10 -22" className="fl-clue-tail-stripes" />
        </g>
      </g>
    );
  if (clue === 'shadow')
    // The moon is up and to the right, so the shadow falls to the left, across a patch of moonlit ground.
    return (
      <g className="fl-clue fl-clue-shadow-wrap">
        <ellipse className="fl-clue-moonlit" cx="-112" cy="12" rx="78" ry="13" />
        <path className="fl-clue-shadow" d="M -178 16 q 16 -12 44 -11 l 6 -10 l 7 9 q 13 -1 22 1 l 7 -9 l 4 10 q 22 4 34 10 q -56 10 -124 0 Z" />
      </g>
    );
  if (clue === 'tracks')
    return (
      <g className="fl-clue fl-clue-tracks" transform={`scale(${side} 1)`}>
        <ellipse className="fl-clue-moonlit" cx="128" cy="20" rx="70" ry="13" />
        <Paw x={178} y={26} />
        <Paw x={146} y={14} />
        <Paw x={114} y={26} />
        <Paw x={84} y={14} />
      </g>
    );
  if (clue === 'growl')
    return (
      <g className="fl-clue fl-clue-growl-wrap">
        <g className="fl-clue-waves" transform="translate(0 -40)">
          <path d="M -80 -22 q -14 22 0 44 M -96 -32 q -20 32 0 64 M 80 -22 q 14 22 0 44 M 96 -32 q 20 32 0 64" />
        </g>
        <text className="fl-clue-growl" x={side * 30} y={-108} textAnchor="middle">
          GRRR…
        </text>
      </g>
    );
  if (clue === 'leaves')
    return (
      <g className="fl-clue fl-clue-leaves">
        <path className="fl-clue-wind" d="M 90 -90 q -60 -8 -120 4 M 110 -60 q -70 -6 -150 6 M 80 -30 q -50 -4 -110 4" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path
            key={k}
            className="fl-clue-leaf"
            style={{ animationDelay: `${k * 0.35}s` }}
            transform={`translate(${-24 + (k % 3) * 22} ${-86 + Math.floor(k / 3) * 26 + (k % 2) * 6})`}
            d="M 0 0 q 9 -10 18 0 q -9 10 -18 0 Z"
          />
        ))}
      </g>
    );
  return null;
}

function Bush({ place, rustling, eyes, spot, clue }: { place: BushPlace; rustling: boolean; eyes: boolean; spot: number; clue: Clue | null }) {
  const sx = Math.round(spot * 24);
  const side: 1 | -1 = spot > 0 ? -1 : 1;
  const behind = clue === 'shadow' || clue === 'tracks' || clue === 'tail';
  return (
    <g className="fl-bush" data-rustling={rustling ? 'true' : undefined} transform={`translate(${place.x} ${place.y}) scale(${place.scale})`}>
      {clue && behind && <ClueArt clue={clue} side={side} />}
      <g className="fl-bush-leaves" style={{ transformOrigin: `${sx}px 0px` }}>
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
      {/* Rustle marks, for when nothing may move, at the spot that rustles. */}
      <g className="fl-bush-marks" aria-hidden="true" transform={`translate(${sx} 0)`}>
        <path d="M -78 -60 q -10 10 0 20 M 78 -60 q 10 10 0 20 M -70 -92 q -12 6 -8 18 M 70 -92 q 12 6 8 18" />
      </g>
      <g className="fl-bush-eyes" data-on={eyes ? 'true' : undefined} transform={`translate(${sx} 0)`}>
        <path d="M -30 -40 q 12 -12 24 0 q -12 10 -24 0 Z" />
        <path d="M 6 -40 q 12 -12 24 0 q -12 10 -24 0 Z" />
        <rect x="-19.5" y="-47" width="3" height="13" rx="1.5" className="fl-bush-pupil" />
        <rect x="16.5" y="-47" width="3" height="13" rx="1.5" className="fl-bush-pupil" />
      </g>
      {clue && !behind && <ClueArt clue={clue} side={side} />}
    </g>
  );
}

export default function RustlingBushes({
  motion,
  gentle,
  soundOn,
  onSoundOn,
  sound,
  onFright,
  deal = makeRounds,
}: {
  motion: boolean;
  gentle: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
  sound: () => LabSound | null;
  onFright: (f: number) => void;
  /** Where the rounds come from: injectable, for the tests. */
  deal?: () => Round[];
}) {
  const [phase, setPhase] = useState<Phase>('warn');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [layout, setLayout] = useState<BushPlace[]>(() => makeLayout(() => 0.5));
  const [index, setIndex] = useState(0);
  const [calls, setCalls] = useState<Call[]>([]);
  const [status, setStatus] = useState('');
  const [startled, setStartled] = useState(0);
  const [clueOn, setClueOn] = useState(false);
  /** Guess first: no timer, so a class can talk it over (the way it starts, for younger classes). */
  const [untimed, setUntimed] = useState(true);
  /** Whole seconds left to decide, for the clock. */
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clueTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callsRef = useRef<Call[]>([]);
  const nextRef = useRef<HTMLButtonElement>(null);

  const round = rounds[index];

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(
    () => () => {
      clear();
      if (clueTimer.current) clearTimeout(clueTimer.current);
    },
    [],
  );

  const start = () => {
    setRounds(deal());
    setLayout(makeLayout());
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
    setClueOn(true);
    const clue = ` The clue: ${CLUE_TEXT[round.clue]}.`;
    if (round.tiger) {
      sound()?.play('startle');
      setStartled((n) => n + 1);
      onFright(gentle ? 0.7 : 1);
      setStatus((call === 'tiger' ? 'Eyes in the dark! You ran. Good call.' : 'Eyes in the dark! You stayed put.') + clue);
    } else {
      onFright(0.25);
      setStatus((call === 'tiger' ? 'Nothing there. A fake alarm.' : 'Nothing there. Just the wind.') + clue);
    }
  };

  // Each round: the bush rustles, and the clock runs (unless guessing first). Not answering is staying put.
  useEffect(() => {
    if (phase !== 'rustle' || !round) return;
    sound()?.play('rustle');
    onFright(0.55);
    setClueOn(false);
    setStatus(`Round ${index + 1} of ${ROUNDS}. A bush rustles.`);
    clueTimer.current = setTimeout(() => {
      setClueOn(true);
      if (round.clue === 'growl') sound()?.play('growl');
      else if (round.clue === 'leaves') sound()?.play('gust');
    }, CLUE_MS);
    if (!untimed) timer.current = setTimeout(() => reveal('wind'), DECIDE_MS);
    return () => {
      clear();
      if (clueTimer.current) clearTimeout(clueTimer.current);
    };
    // reveal reads this round's state; the round (and the timer switch) is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, rounds, untimed]);

  // The seconds left, counted down beside the clock's bar (which holds still with reduced motion).
  useEffect(() => {
    if (phase !== 'rustle' || untimed) return;
    const t0 = performance.now();
    const count = () => setLeft(Math.max(1, Math.ceil((DECIDE_MS - (performance.now() - t0)) / 1000)));
    count();
    const iv = setInterval(count, 200);
    return () => clearInterval(iv);
  }, [phase, index, untimed]);

  /** On from the answer: the next round, or the tally. */
  const nextRound = () => {
    if (phase !== 'reveal') return;
    clear();
    onFright(0.1);
    if (index + 1 >= ROUNDS) {
      setPhase('done');
      setStatus('All eight rounds done.');
      onFright(0);
    } else {
      setIndex(index + 1);
      setPhase('rustle');
    }
  };

  // With the timer, the next round comes by itself once the answer has shown; guessing first, the class says when.
  useEffect(() => {
    if (phase !== 'reveal' || untimed) return;
    timer.current = setTimeout(nextRound, REVEAL_MS);
    return clear;
    // nextRound reads this round's state; the reveal (and the timer switch) is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, untimed]);

  // Guessing first, the way on takes focus once the answer shows.
  useEffect(() => {
    if (phase === 'reveal' && untimed) nextRef.current?.focus();
  }, [phase, untimed]);

  const t = tally(rounds, calls);
  const showEyes = phase === 'reveal' && !!round?.tiger;
  const playing = phase === 'rustle' || phase === 'reveal';
  const guessToggle = (
    <button type="button" className="fl-lab-switch fl-bushes-untimed" aria-pressed={untimed} onClick={() => setUntimed((u) => !u)}>
      Guess first: no timer <span className="fl-lab-switch-state" aria-hidden="true">{untimed ? 'on' : 'off'}</span>
    </button>
  );

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
          {layout.map((place, i) => {
            const here = playing && round?.bush === i;
            return (
              <Bush
                key={i}
                place={place}
                rustling={phase === 'rustle' && here}
                eyes={showEyes && here}
                spot={here ? round.spot : 0}
                clue={here && clueOn ? round.clue : null}
              />
            );
          })}
        </svg>
        {playing && (
          <div className="fl-bushes-clock-row" aria-hidden="true">
            {untimed ? (
              <span className="fl-bushes-untimed-note">{phase === 'rustle' ? 'No timer. Look for a clue, guess together, then call it.' : ''}</span>
            ) : (
              <>
                <div className="fl-bushes-clock">
                  <span key={`${index}-${phase}`} data-run={phase === 'rustle' ? 'true' : undefined} style={{ animationDuration: `${DECIDE_MS}ms` }} />
                </div>
                <span className="fl-bushes-secs">{phase === 'rustle' ? left : ''}</span>
              </>
            )}
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
            <p className="fl-lab-note">A bush rustles in the dark. Is it a tiger, or just the wind? Watch for a clue (some you can hear, too), then decide. Guessing first, there is no timer: talk it over, then call it.</p>
            <SoundPrompt soundOn={soundOn} onSoundOn={onSoundOn} why="Some clues are sounds." />
            <div className="fl-lab-warning" role="note">
              <p><strong>Startle warning.</strong> Eyes will appear suddenly in the dark. Nothing flashes.</p>
              <p>Turn the sound and the motion on or off with the buttons at the top.</p>
            </div>
            {guessToggle}
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
            {phase === 'reveal' && untimed && (
              <button ref={nextRef} type="button" className="fl-lab-button fl-bushes-next" onClick={nextRound}>
                {index + 1 >= ROUNDS ? 'See the results' : 'Next round'}
              </button>
            )}
            {guessToggle}
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
