'use client';

import { useState } from 'react';
import { FEAR_LAB_COPY as C } from '../fearLab';
import type { LabSound } from './sound';

/*
 * Known or unknown: three "would you rather" choices, each built from an
 * experiment on poster 1, and after each, what the poster says people did.
 * There are no right answers; the choices stay on this screen. With sound
 * on, choosing the unknown (or the wait) brings a swell of dread, the spider
 * a skitter, and the known a soft tick.
 */

type Picture = 'bolt' | 'big-bolt' | 'wait' | 'spider' | 'dark';
type Option = { tag: string; text: string; picture: Picture };
export type Choice = { a: Option; b: Option; poster: string };

export const CHOICES: Choice[] = [
  {
    a: { tag: 'Known', text: 'A small electric shock, for certain.', picture: 'bolt' },
    b: { tag: 'Unknown', text: 'A 50% chance of a small electric shock.', picture: 'dark' },
    poster: C.ambiguity,
  },
  {
    a: { tag: 'Now', text: 'A stronger shock, right away.', picture: 'big-bolt' },
    b: { tag: 'Wait', text: 'A weaker shock, but you have to wait for it.', picture: 'wait' },
    poster: C.dread,
  },
  {
    a: { tag: 'See it', text: 'Reach into a glass box with a spider you can see.', picture: 'spider' },
    b: { tag: 'Unseen', text: "Reach into a box you can't see into.", picture: 'dark' },
    poster: C.amygdala,
  },
];

function BoxPicture({ picture }: { picture: Picture }) {
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
          d={picture === 'bolt' ? 'M 104 78 L 88 112 L 100 112 L 94 138 L 116 100 L 103 100 L 112 78 Z' : 'M 108 30 L 76 104 L 98 104 L 86 148 L 132 86 L 108 86 L 124 30 Z'}
          fill="#f2b33d"
          stroke="#7a4f0a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
      {picture === 'wait' && (
        <g>
          <path d="M 84 78 L 116 78 L 116 82 Q 116 96 102 106 Q 116 116 116 132 L 116 138 L 84 138 L 84 132 Q 84 116 98 106 Q 84 96 84 82 Z" fill="none" stroke="#fbf6ec" strokeWidth="3" />
          <path d="M 90 86 L 110 86 Q 108 96 100 102 Q 92 96 90 86 Z M 92 134 Q 100 120 108 134 Z" fill="#f2b33d" />
          <path d="M 140 92 L 134 106 L 139 106 L 136 118 L 146 102 L 140 102 L 143 92 Z" fill="#f2b33d" />
        </g>
      )}
      {picture === 'spider' && <image href="/exhibitions/fear-lab/spider.png" x="62" y="76" width="76" height="68" />}
    </svg>
  );
}

export default function KnownOrUnknown({ sound, onFright }: { sound: () => LabSound | null; onFright: (f: number) => void }) {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<('a' | 'b')[]>([]);
  const done = step >= CHOICES.length;
  const choice = CHOICES[Math.min(step, CHOICES.length - 1)];
  const picked = picks[step];

  const pick = (k: 'a' | 'b') => {
    if (picked) return;
    const pic = choice[k].picture;
    if (pic === 'dark' || pic === 'wait') sound()?.swell();
    else if (pic === 'spider') sound()?.creature('tarantula');
    else sound()?.tick();
    setPicks((p) => {
      const next = [...p];
      next[step] = k;
      return next;
    });
    onFright(0.2);
  };
  const next = () => {
    setStep((s) => s + 1);
    onFright(0);
  };
  const restart = () => {
    setStep(0);
    setPicks([]);
  };

  return (
    <div className="fl-ku">
      <div className="fl-ku-scene">
        {done ? (
          <ol className="fl-ku-done" aria-label="Your choices">
            {CHOICES.map((c, i) => {
              const o = c[picks[i] ?? 'a'];
              return (
                <li key={i} className="fl-ku-done-item">
                  <span className="fl-ku-tag">{o.tag}</span>
                  <BoxPicture picture={o.picture} />
                  <span className="fl-ku-text">{o.text}</span>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="fl-ku-options" role="group" aria-label={`Would you rather? Question ${step + 1} of ${CHOICES.length}`}>
            {(['a', 'b'] as const).map((k) => {
              const o = choice[k];
              return (
                <button
                  key={`${step}-${k}`}
                  type="button"
                  className="fl-ku-option"
                  data-side={k}
                  aria-pressed={picked === k}
                  data-faded={picked && picked !== k ? 'true' : undefined}
                  onClick={() => pick(k)}
                  onPointerEnter={() => !picked && onFright(o.picture === 'dark' || o.picture === 'wait' ? 0.55 : 0.3)}
                  onPointerLeave={() => !picked && onFright(0)}
                  onFocus={() => !picked && onFright(o.picture === 'dark' || o.picture === 'wait' ? 0.55 : 0.3)}
                  onBlur={() => !picked && onFright(0)}
                >
                  <span className="fl-ku-tag">{o.tag}</span>
                  <BoxPicture picture={o.picture} />
                  <span className="fl-ku-text">{o.text}</span>
                </button>
              );
            })}
            <span className="fl-ku-or" aria-hidden="true">or</span>
          </div>
        )}
      </div>

      <div className="fl-lab-panel-body">
        {done ? (
          <>
            <h2 className="fl-lab-heading">What scares you?</h2>
            <p className="fl-lab-note">Your choices stay on this screen. There are no right answers.</p>
            <p className="fl-lab-poster">{C.unknown}</p>
            <button type="button" className="fl-lab-button" onClick={restart}>Start again</button>
          </>
        ) : (
          <>
            <p className="fl-lab-kicker">Question {step + 1} of {CHOICES.length}</p>
            <h2 className="fl-lab-heading">Which would you rather?</h2>
            {picked ? (
              <>
                <p className="fl-lab-poster fl-lab-reveal">{choice.poster}</p>
                <button type="button" className="fl-lab-button" onClick={next}>
                  {step + 1 < CHOICES.length ? 'Next question' : 'See your choices'}
                </button>
              </>
            ) : (
              <p className="fl-lab-note">Choose one. Then see what the poster says.</p>
            )}
          </>
        )}
        <p className="fl-lab-status" role="status">
          {picked && !done ? `You chose: ${choice[picked].text}` : ''}
        </p>
      </div>
    </div>
  );
}
