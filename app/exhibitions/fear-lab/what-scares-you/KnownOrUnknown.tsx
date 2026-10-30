'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import FactNote, { type ApprovedFact } from '@/components/exhibition/FactNote';
import { FEAR_LAB_COPY as C } from '../fearLab';
import type { SoundSlot } from './assets';
import type { LabSound } from './sound';
import SoundPrompt from './SoundPrompt';
import { SpiderArt } from './Swarm';

/*
 * Known or unknown: "would you rather" choices, the question at the top,
 * each against a countdown ring (a teacher can pause it). The first three
 * are built from experiments on poster 1, and after each comes what the
 * poster says people did; the rest come from other experiments, each with
 * a checked museum note and its source. There are no right answers; the
 * choices stay on this screen.
 *
 * Each answer has its own effect, heard and seen: a zap and a jolt for the
 * shock, a ticking clock for the wait, a skittering spider, clinking
 * marbles, a friendly ghost, a swell of dread for the unknown. With motion
 * off, the jolts and the running become gentle fades; gentle mode softens
 * them too.
 */

/** How long each question waits for a choice, in ms. */
export const QUESTION_MS = 20000;

type Picture = 'bolt' | 'big-bolt' | 'wait' | 'spider' | 'dark' | 'jar' | 'mystery-jar' | 'room' | 'button' | 'ghost' | 'haunted';
/** Each answer's effect: its sound slot (assets.ts) and the matching thing seen. */
export type Effect = Extract<SoundSlot, 'zap' | 'big-zap' | 'clock' | 'dread' | 'skitter' | 'marbles' | 'quiet' | 'ghost' | 'haunt'>;
type Option = { tag: string; text: string; picture: Picture; effect: Effect };
export type Choice = { question: string; a: Option; b: Option } & ({ poster: string; fact?: undefined } | { fact: ApprovedFact; poster?: undefined });

export const CHOICES: Choice[] = [
  {
    question: 'A shock for sure, or maybe a shock?',
    a: { tag: 'Known', text: 'A small electric shock, for certain.', picture: 'bolt', effect: 'zap' },
    b: { tag: 'Unknown', text: 'A 50% chance of a small electric shock.', picture: 'dark', effect: 'dread' },
    poster: C.ambiguity,
  },
  {
    question: 'A strong shock now, or a weak one later?',
    a: { tag: 'Now', text: 'A stronger shock, right away.', picture: 'big-bolt', effect: 'big-zap' },
    b: { tag: 'Wait', text: 'A weaker shock, but you have to wait for it.', picture: 'wait', effect: 'clock' },
    poster: C.dread,
  },
  {
    question: 'Which box would you reach into?',
    a: { tag: 'See it', text: 'Reach into a glass box with a spider you can see.', picture: 'spider', effect: 'skitter' },
    b: { tag: 'Unseen', text: "Reach into a box you can't see into.", picture: 'dark', effect: 'dread' },
    poster: C.amygdala,
  },
  {
    question: 'Which jar would you bet on?',
    a: { tag: 'Known jar', text: 'A jar of 50 red and 50 black marbles. Pull out a red one to win.', picture: 'jar', effect: 'marbles' },
    b: { tag: 'Mystery jar', text: 'A jar of 100 red and black marbles, in a mix nobody will tell you. Pull out a red one to win.', picture: 'mystery-jar', effect: 'dread' },
    fact: {
      text: 'In 1961 the economist Daniel Ellsberg described this choice. Most people pick the jar with the known mix, even though nobody has said the mystery jar is any worse. It is called the Ellsberg paradox.',
      sources: [{ label: 'Ellsberg, “Risk, Ambiguity, and the Savage Axioms,” Quarterly Journal of Economics (1961)', href: 'https://doi.org/10.2307/1884324' }],
    },
  },
  {
    question: 'Fifteen minutes alone with your thoughts, or a button?',
    a: { tag: 'Just think', text: 'Sit alone in a bare room for 15 minutes, with nothing to do but think.', picture: 'room', effect: 'quiet' },
    b: { tag: 'The button', text: 'Sit there with a button that gives you a small electric shock, if you want one.', picture: 'button', effect: 'zap' },
    fact: {
      text: 'In a 2014 study, 12 of 18 men and 6 of 24 women gave themselves at least one small electric shock rather than just sit alone with their thoughts for 15 minutes.',
      sources: [
        { label: 'Wilson et al., Science (2014)', href: 'https://doi.org/10.1126/science.1250830' },
        { label: 'University of Virginia, via ScienceDaily', href: 'https://www.sciencedaily.com/releases/2014/07/140703142154.htm' },
      ],
    },
  },
  {
    question: 'Which haunted house would you go into?',
    a: { tag: 'A bit scary', text: 'A haunted house that is only a little bit scary.', picture: 'ghost', effect: 'ghost' },
    b: { tag: 'Terrifying', text: 'The scariest haunted house in the world.', picture: 'haunted', effect: 'haunt' },
    fact: {
      text: 'In a 2020 study, 110 visitors to a haunted house in Vejle, Denmark, wore heart-rate monitors. They enjoyed it most when they were scared a medium amount: not too little, and not too much.',
      sources: [
        { label: 'Association for Psychological Science', href: 'https://www.psychologicalscience.org/observer/playing-with-fear' },
        { label: 'Andersen et al., Psychological Science (2020)', href: 'https://doi.org/10.1177/0956797620972116' },
      ],
    },
  },
];

function BoxPicture({ picture }: { picture: Picture }) {
  if (picture === 'jar' || picture === 'mystery-jar') {
    const mystery = picture === 'mystery-jar';
    const balls = Array.from({ length: 22 }, (_, i) => ({ x: 64 + (i % 6) * 14 + (Math.floor(i / 6) % 2) * 7, y: 136 - Math.floor(i / 6) * 13, red: i % 2 === 0 }));
    return (
      <svg viewBox="0 0 200 160" aria-hidden="true" className="fl-ku-pic">
        <ellipse cx="100" cy="150" rx="60" ry="6" fill="rgba(0,0,0,0.4)" />
        <rect x="70" y="30" width="60" height="12" rx="3" fill="#8a5a2f" />
        <path d="M 66 44 Q 56 50 56 64 L 56 138 Q 56 148 70 148 L 130 148 Q 144 148 144 138 L 144 64 Q 144 50 134 44 Z" fill={mystery ? '#1b3050' : 'rgba(251,246,236,0.1)'} stroke="rgba(251,246,236,0.6)" strokeWidth="2" />
        {mystery ? (
          <text x="100" y="118" textAnchor="middle" className="fl-ku-q">?</text>
        ) : (
          <g className="fl-ku-marbles">
            {balls.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r="6" fill={b.red ? '#d4483b' : '#1c1c22'} stroke="rgba(251,246,236,0.35)" />)}
          </g>
        )}
      </svg>
    );
  }
  if (picture === 'room' || picture === 'button') {
    return (
      <svg viewBox="0 0 200 160" aria-hidden="true" className="fl-ku-pic">
        <path d="M 30 30 L 170 30 L 170 140 L 30 140 Z" fill="rgba(251,246,236,0.06)" stroke="rgba(251,246,236,0.4)" strokeWidth="2" />
        <path d="M 30 140 L 60 112 L 140 112 L 170 140" fill="none" stroke="rgba(251,246,236,0.25)" strokeWidth="2" />
        {/* A chair. */}
        <path d="M 86 112 L 86 82 L 114 82 L 114 112 M 84 96 L 116 96" fill="none" stroke="#fbf6ec" strokeWidth="3" strokeLinecap="round" />
        {picture === 'room' ? (
          <g fill="rgba(251,246,236,0.5)">
            <circle cx="140" cy="56" r="3" />
            <circle cx="150" cy="46" r="4" />
            <circle cx="162" cy="34" r="6" />
          </g>
        ) : (
          <g>
            <rect x="128" y="86" width="26" height="18" rx="3" fill="#2a3e5c" stroke="#fbf6ec" strokeWidth="2" />
            <circle cx="141" cy="90" r="6" fill="#e0533d" />
            <path d="M 150 50 L 142 66 L 148 66 L 144 80 L 156 62 L 150 62 L 154 50 Z" fill="#f2b33d" />
          </g>
        )}
      </svg>
    );
  }
  if (picture === 'ghost' || picture === 'haunted') {
    const big = picture === 'haunted';
    return (
      <svg viewBox="0 0 200 160" aria-hidden="true" className="fl-ku-pic">
        <path d="M 40 146 L 40 76 L 100 34 L 160 76 L 160 146 Z" fill={big ? '#14101c' : '#2a3e5c'} stroke="rgba(251,246,236,0.5)" strokeWidth="2" />
        <rect x="88" y="104" width="24" height="42" fill={big ? '#06040a' : '#0e1a2c'} />
        <rect x="56" y="88" width="20" height="18" fill={big ? '#7a1f1f' : '#f2b33d'} opacity={big ? 0.9 : 0.6} />
        <rect x="124" y="88" width="20" height="18" fill={big ? '#7a1f1f' : '#f2b33d'} opacity={big ? 0.9 : 0.6} />
        {big ? (
          <g fill="#fbf6ec">
            <path d="M 54 20 l 6 12 l -12 0 Z M 146 20 l 6 12 l -12 0 Z" opacity="0.6" />
            <circle cx="66" cy="97" r="2.5" />
            <circle cx="134" cy="97" r="2.5" />
          </g>
        ) : (
          <path className="fl-ku-ghost" d="M 150 52 q 0 -16 14 -16 q 14 0 14 16 l 0 22 l -5 -5 l -5 5 l -4 -5 l -5 5 l -4 -5 l -5 5 Z" fill="#fbf6ec" opacity="0.85" />
        )}
      </svg>
    );
  }
  const dark = picture === 'dark';
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true" className="fl-ku-pic">
      <ellipse cx="100" cy="148" rx="80" ry="8" fill="rgba(0,0,0,0.4)" />
      {/* The box: glass to see into, or shut and dark. */}
      <path d="M 40 46 L 160 46 L 176 70 L 24 70 Z" fill={dark ? '#2c4a78' : 'rgba(251,246,236,0.16)'} stroke={dark ? '#0b1322' : 'rgba(251,246,236,0.6)'} strokeWidth="2" />
      <rect x="24" y="70" width="152" height="76" fill={dark ? '#1b3050' : 'rgba(251,246,236,0.08)'} stroke={dark ? '#0b1322' : 'rgba(251,246,236,0.6)'} strokeWidth="2" />
      {dark && <text x="100" y="130" textAnchor="middle" className="fl-ku-q">?</text>}
      {(picture === 'bolt' || picture === 'big-bolt') && (
        <path
          className="fl-ku-bolt"
          d={picture === 'bolt' ? 'M 104 78 L 88 112 L 100 112 L 94 138 L 116 100 L 103 100 L 112 78 Z' : 'M 108 30 L 76 104 L 98 104 L 86 148 L 132 86 L 108 86 L 124 30 Z'}
          fill="#f2b33d"
          stroke="#7a4f0a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
      {picture === 'wait' && (
        <g>
          <g className="fl-ku-glass">
            <path d="M 84 78 L 116 78 L 116 82 Q 116 96 102 106 Q 116 116 116 132 L 116 138 L 84 138 L 84 132 Q 84 116 98 106 Q 84 96 84 82 Z" fill="none" stroke="#fbf6ec" strokeWidth="3" />
            <path d="M 90 86 L 110 86 Q 108 96 100 102 Q 92 96 90 86 Z M 92 134 Q 100 120 108 134 Z" fill="#f2b33d" />
          </g>
          <path d="M 140 92 L 134 106 L 139 106 L 136 118 L 146 102 L 140 102 L 143 92 Z" fill="#f2b33d" />
        </g>
      )}
      {picture === 'spider' && <image href="/exhibitions/fear-lab/spider.png" x="62" y="76" width="76" height="68" />}
    </svg>
  );
}

/** The countdown: a ring that empties, the seconds in its middle. */
function Ring({ left, paused }: { left: number; paused: boolean }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const share = Math.max(0, Math.min(1, left / QUESTION_MS));
  const secs = Math.ceil(left / 1000);
  return (
    <span className="fl-ku-ring" data-paused={paused ? 'true' : undefined} data-low={secs <= 5 ? 'true' : undefined} role="timer" aria-label={paused ? `Timer paused, ${secs} seconds left` : `${secs} seconds left`}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={r} className="fl-ku-ring-track" />
        <circle cx="28" cy="28" r={r} className="fl-ku-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - share)} transform="rotate(-90 28 28)" />
      </svg>
      <span className="fl-ku-ring-secs" aria-hidden="true">{paused ? 'II' : secs}</span>
    </span>
  );
}

export default function KnownOrUnknown({
  motion,
  gentle,
  soundOn,
  onSoundOn,
  sound,
  onFright,
}: {
  motion: boolean;
  gentle: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
  sound: () => LabSound | null;
  onFright: (f: number) => void;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<('a' | 'b' | 'none')[]>([]);
  const [left, setLeft] = useState(QUESTION_MS);
  const [paused, setPaused] = useState(false);
  const leftRef = useRef(QUESTION_MS);
  const done = step >= CHOICES.length;
  const choice = CHOICES[Math.min(step, CHOICES.length - 1)];
  const picked = picks[step];
  const running = started && !done && !picked && !paused;

  // The countdown, which stops on a choice or a pause. At zero, time's up.
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    let lastSec = Math.ceil(leftRef.current / 1000);
    const iv = setInterval(() => {
      const now = Date.now();
      leftRef.current = Math.max(0, leftRef.current - (now - last));
      last = now;
      setLeft(leftRef.current);
      const sec = Math.ceil(leftRef.current / 1000);
      if (sec !== lastSec && sec <= 5 && sec > 0) sound()?.play('tick');
      lastSec = sec;
      if (leftRef.current <= 0) {
        clearInterval(iv);
        setPicks((p) => {
          const next = [...p];
          next[step] = 'none';
          return next;
        });
        onFright(0);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [running, step, sound, onFright]);

  const resetClock = () => {
    leftRef.current = QUESTION_MS;
    setLeft(QUESTION_MS);
  };

  const pick = (k: 'a' | 'b') => {
    if (picked) return;
    sound()?.play(choice[k].effect);
    setPicks((p) => {
      const next = [...p];
      next[step] = k;
      return next;
    });
    onFright(choice[k].effect === 'dread' || choice[k].effect === 'haunt' ? 0.6 : 0.3);
  };
  const next = () => {
    setStep((s) => s + 1);
    resetClock();
    onFright(0);
  };
  const restart = () => {
    setStep(0);
    setPicks([]);
    resetClock();
  };

  const fright = (o: Option) => (o.effect === 'dread' || o.effect === 'clock' || o.effect === 'haunt' ? 0.55 : 0.3);

  return (
    <div className="fl-ku" data-motion={motion ? 'on' : 'off'} data-gentle={gentle ? 'true' : undefined} data-started={started ? 'true' : undefined}>
      <header className="fl-ku-top">
        {!started ? (
          <div>
            <p className="fl-lab-kicker">Known or unknown?</p>
            <h2 className="fl-lab-heading">Which would you rather?</h2>
          </div>
        ) : done ? (
          <div>
            <p className="fl-lab-kicker">Your choices</p>
            <h2 className="fl-lab-heading">What scares you?</h2>
          </div>
        ) : (
          <>
            <div>
              <p className="fl-lab-kicker">Question {step + 1} of {CHOICES.length}: which would you rather?</p>
              <h2 className="fl-lab-heading fl-ku-question">{choice.question}</h2>
            </div>
            <div className="fl-ku-clock">
              <Ring left={left} paused={paused && !picked} />
              {!picked && (
                <button type="button" className="fl-lab-switch fl-ku-pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                  {paused ? 'Resume timer' : 'Pause timer'}
                </button>
              )}
            </div>
          </>
        )}
      </header>

      <div className="fl-ku-scene">
        {!started ? (
          <div className="fl-ku-options" aria-hidden="true">
            <div className="fl-ku-option fl-ku-preview"><span className="fl-ku-tag">Known</span><BoxPicture picture="bolt" /></div>
            <div className="fl-ku-option fl-ku-preview"><span className="fl-ku-tag">Unknown</span><BoxPicture picture="dark" /></div>
            <span className="fl-ku-or">or</span>
          </div>
        ) : done ? (
          <ol className="fl-ku-done" aria-label="Your choices">
            {CHOICES.map((c, i) => {
              const k = picks[i];
              const o = k === 'a' || k === 'b' ? c[k] : null;
              return (
                <li key={i} className="fl-ku-done-item">
                  <span className="fl-ku-tag">{o ? o.tag : 'Time ran out'}</span>
                  {o ? <BoxPicture picture={o.picture} /> : null}
                  <span className="fl-ku-text">{o ? o.text : c.question}</span>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="fl-ku-options" role="group" aria-label={`Question ${step + 1} of ${CHOICES.length}: ${choice.question}`}>
            {(['a', 'b'] as const).map((k) => {
              const o = choice[k];
              const chosen = picked === k;
              return (
                <button
                  key={`${step}-${k}`}
                  type="button"
                  className="fl-ku-option"
                  data-side={k}
                  aria-pressed={chosen}
                  data-faded={picked && !chosen ? 'true' : undefined}
                  data-effect={chosen ? o.effect : undefined}
                  aria-disabled={picked ? 'true' : undefined}
                  onClick={() => pick(k)}
                  onPointerEnter={() => !picked && onFright(fright(o))}
                  onPointerLeave={() => !picked && onFright(0)}
                  onFocus={() => !picked && onFright(fright(o))}
                  onBlur={() => !picked && onFright(0)}
                >
                  <span className="fl-ku-tag">{o.tag}</span>
                  <BoxPicture picture={o.picture} />
                  <span className="fl-ku-text">{o.text}</span>
                  {chosen && (
                    <span className="fl-ku-fx" data-effect={o.effect} aria-hidden="true" style={{ ['--fx-scale' as string]: gentle ? '0.5' : '1' } as CSSProperties}>
                      {o.effect === 'skitter' && (
                        <span className="fl-ku-runner">
                          <SpiderArt cartoon={gentle} />
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
            <span className="fl-ku-or" aria-hidden="true">or</span>
          </div>
        )}
      </div>

      <div className="fl-lab-panel-body">
        {!started ? (
          <>
            <p className="fl-lab-note">
              {CHOICES.length} questions. Each one has a timer: choose before it runs out. Teachers can pause it to talk it over.
            </p>
            <SoundPrompt soundOn={soundOn} onSoundOn={onSoundOn} why="Every answer has its own sound." />
            <button type="button" className="fl-lab-button" onClick={() => { setStarted(true); resetClock(); sound()?.play('tick'); }}>
              Start
            </button>
          </>
        ) : done ? (
          <>
            <p className="fl-lab-note">Your choices stay on this screen. There are no right answers.</p>
            <p className="fl-lab-poster">{C.unknown}</p>
            <button type="button" className="fl-lab-button" onClick={restart}>Start again</button>
          </>
        ) : picked ? (
          <>
            {picked === 'none' && <p className="fl-lab-kicker">Time’s up!</p>}
            {choice.poster ? (
              <p className="fl-lab-poster fl-lab-reveal">{choice.poster}</p>
            ) : (
              <FactNote fact={choice.fact!} className="fl-lab-fact" />
            )}
            <button type="button" className="fl-lab-button" onClick={next}>
              {step + 1 < CHOICES.length ? 'Next question' : 'See your choices'}
            </button>
          </>
        ) : (
          <p className="fl-lab-note">Choose one before the timer runs out. Then see what {choice.poster ? 'the poster says' : 'scientists found'}.</p>
        )}
        <p className="fl-lab-status" role="status">
          {picked && !done ? (picked === 'none' ? 'Time’s up! No choice made.' : `You chose: ${choice[picked].text}`) : ''}
        </p>
      </div>
    </div>
  );
}
