'use client';

import { useState } from 'react';
import Link from 'next/link';
import PutInTomb from '../PutInTomb';
import { DragGhost, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import { COFFIN_OUTLINE, CoffinBase, CoffinLid } from './Coffin';
import { Picture, Task, Tray, boxIn, type StepKit } from './kit';
import { CHECK, stepNotes } from './steps';

/*
 * Day 70: into the coffin, then the room's three questions, then into the
 * visitor's own burial tomb.
 *
 * The coffin stands upright, drawn the right way up and to its own shape
 * (it once lay sideways, squashed, beside a body seen from the side, which
 * looked wrong): the open coffin in the middle, the wrapped mummy on the
 * left, the painted lid leaning on the right. The visitor carries the
 * mummy into the coffin, then the lid onto it (dragged, or tapped and then
 * tapped onto the coffin). The three questions (Verity likes them) follow,
 * one at a time, a wrong answer met with "have another go". Last, the
 * mummy in its coffin goes into the visitor's burial tomb (PutInTomb), and
 * the way on is the Hall of Judgement.
 */

const VIEW = { x: 0, y: 0, w: 640, h: 330 };
const box = boxIn(VIEW);
const S = 0.58;
const AT = { mummy: 136, coffin: 320, lid: 506 };
const TOP = 18;

/** The wrapped mummy seen from the front: the coffin's own shape, a little smaller, in linen. */
function Mummy() {
  return (
    <g>
      <path d={COFFIN_OUTLINE} fill="url(#egm-cof-linen)" stroke="#8a7a5c" strokeWidth="3" />
      <g clipPath="url(#egm-cof-clip)">
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M-70 ${40 + i * 22} L70 ${i * 22 + (i % 2 ? 70 : 10)}`} stroke="#cbbb92" strokeWidth="5" opacity="0.8" />
        ))}
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M-70 ${i * 22 + 20} L70 ${60 + i * 22}`} stroke="#ddd0ac" strokeWidth="3" opacity="0.7" />
        ))}
      </g>
      <path d={COFFIN_OUTLINE} fill="url(#egm-cof-shade)" />
    </g>
  );
}

type Phase = 'mummy' | 'lid' | 'closed';

export default function CoffinStep({ kit }: { kit: StepKit }) {
  const [phase, setPhase] = useState<Phase>(kit.done ? 'closed' : 'mummy');
  const [holding, setHolding] = useState<'mummy' | 'lid' | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>(kit.done ? Object.fromEntries(CHECK.map((c, i) => [i, c.answer])) : {});
  const question = CHECK.findIndex((c, i) => answers[i] !== c.answer);
  const checked = question < 0;

  const putIn = (what: 'mummy' | 'lid') => {
    setHolding(null);
    if (what === 'mummy' && phase === 'mummy') {
      setPhase('lid');
      playEgypt('settle');
      kit.say('The mummy is laid in its coffin. Now put the lid on.');
    } else if (what === 'lid' && phase === 'lid') {
      setPhase('closed');
      playEgypt('grind');
      kit.say('The lid is on. The seventy days are over. Three quick questions about what you did.');
    } else if (what === 'lid') kit.say('The mummy goes in first.');
  };
  const { drag, carrying, start } = useDragDrop<'mummy' | 'lid'>((what, at) => {
    if (at.target === 'coffin') putIn(what);
  });
  const answer = (i: number, o: string) => {
    const next = { ...answers, [i]: o };
    setAnswers(next);
    if (o === CHECK[i].answer) {
      playEgypt('find');
      kit.say(`Yes! ${CHECK[i].after}`);
      if (CHECK.every((c, k) => next[k] === c.answer)) kit.finish();
    } else {
      playEgypt('miss');
      kit.say('Not quite. Have another go.');
    }
  };

  return (
    <>
      <Task done={phase === 'closed' && checked}>
        {phase === 'mummy' ? 'Carry the wrapped mummy into its coffin.' : phase === 'lid' ? 'Now carry the painted lid onto the coffin, to close it.' : checked ? 'The seventy days are over.' : 'Three quick questions about what you did.'}
      </Task>
      <Picture
        label={
          phase === 'mummy'
            ? 'An open coffin, shaped like a wrapped body, stands upright; the wrapped mummy stands to its left, and the painted lid leans on the right'
            : phase === 'lid'
              ? 'The mummy lies in its open coffin; the painted lid leans on the right'
              : 'The coffin, closed: a gold face under a striped blue wig, a broad collar, a winged sun and a column of protective signs'
        }
        aspect="640 / 330"
        carrying={!!carrying || !!holding}
        over={
          phase !== 'closed' && (
            <>
              {phase === 'mummy' ? (
                <button type="button" className="egm-thing-over egk-carry" style={box(AT.mummy - 40, 50, 80, 250)} aria-pressed={holding === 'mummy'} aria-label="The wrapped mummy" onPointerDown={(e) => start('mummy', e)} onClick={() => setHolding((h) => (h === 'mummy' ? null : 'mummy'))} />
              ) : (
                <button type="button" className="egm-thing-over egk-carry" style={box(AT.lid - 44, TOP, 88, 282)} aria-pressed={holding === 'lid'} aria-label="The painted lid" onPointerDown={(e) => start('lid', e)} onClick={() => setHolding((h) => (h === 'lid' ? null : 'lid'))} />
              )}
              <button type="button" data-drop="coffin" className="egm-place" style={box(AT.coffin - 46, TOP, 92, 282)} aria-label={phase === 'mummy' ? 'The open coffin: lay the mummy in it' : 'The coffin: put the lid on it'} onClick={() => (holding ? putIn(holding) : kit.say(phase === 'mummy' ? 'First pick up the mummy.' : 'First pick up the lid.'))} />
            </>
          )
        }
      >
        <svg className="egm-svg" viewBox="0 0 640 330" aria-hidden="true">
          <defs>
            <linearGradient id="egm-cof-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f3520" />
              <stop offset="1" stopColor="#22160b" />
            </linearGradient>
            <radialGradient id="egm-cof-light" cx="50%" cy="45%" r="55%">
              <stop offset="0" stopColor="rgba(255, 205, 120, 0.3)" />
              <stop offset="1" stopColor="rgba(255, 205, 120, 0)" />
            </radialGradient>
            <pattern id="egm-cof-linen" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#efe5cc" />
              <path d="M0 3 H10 M0 8 H10" stroke="#ddd0ac" strokeWidth="1" />
            </pattern>
            <linearGradient id="egm-cof-shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(60, 40, 20, 0.35)" />
              <stop offset="0.4" stopColor="rgba(60, 40, 20, 0)" />
              <stop offset="1" stopColor="rgba(60, 40, 20, 0.4)" />
            </linearGradient>
            <clipPath id="egm-cof-clip">
              <path d={COFFIN_OUTLINE} />
            </clipPath>
          </defs>
          <rect width="640" height="330" fill="url(#egm-cof-wall)" />
          <rect width="640" height="330" fill="url(#egm-cof-light)" />
          {/* a painted band along the wall, and the floor */}
          <rect y="256" width="640" height="10" fill="#1d3f7c" opacity="0.8" />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={i * 16 + 2} y="258" width="10" height="6" fill={['#c8402a', '#d9a441', '#2f7a4a'][i % 3]} opacity="0.85" />
          ))}
          <rect y="298" width="640" height="32" fill="#3a2614" />
          <rect y="296" width="640" height="3" fill="#2a1b0e" />
          {/* shadows on the floor */}
          {(phase === 'closed' ? [AT.coffin] : phase === 'lid' ? [AT.coffin, AT.lid] : [AT.mummy, AT.coffin, AT.lid]).map((x) => (
            <ellipse key={x} cx={x} cy="299" rx="46" ry="6" fill="rgba(0,0,0,0.4)" />
          ))}

          {/* the mummy, standing, until it is laid in the coffin */}
          {phase === 'mummy' && !(drag && drag.item === 'mummy') && (
            <g transform={`translate(${AT.mummy} 60) scale(0.5)`} className={holding === 'mummy' ? 'egm-lifted' : undefined}>
              <Mummy />
            </g>
          )}

          {/* the coffin: open, with the mummy in it, or closed */}
          <g transform={`translate(${AT.coffin} ${TOP}) scale(${S})`}>
            {phase === 'closed' ? (
              <CoffinLid id="egm-cof-closed" />
            ) : (
              <>
                <CoffinBase />
                {phase === 'lid' && (
                  <g transform="translate(0 24) scale(0.82 0.9)">
                    <Mummy />
                  </g>
                )}
              </>
            )}
          </g>

          {/* the lid, leaning, until it is put on */}
          {phase !== 'closed' && !(drag && drag.item === 'lid') && (
            <g transform={`translate(${AT.lid} ${TOP + 4}) rotate(3) scale(${S})`} className={holding === 'lid' ? 'egm-lifted' : undefined}>
              <CoffinLid id="egm-cof-lid" />
            </g>
          )}
        </svg>
      </Picture>
      <Tray
        tools={
          phase !== 'closed' ? (
            <p className="egm-small">{holding ? `You are holding the ${holding}. Now tap the coffin.` : 'Drag it to the coffin, or tap it and then tap the coffin.'}</p>
          ) : (
            <div className="egm-check">
              <p className="egr-label">
                Three quick questions · {checked ? CHECK.length : question + 1} of {CHECK.length}
              </p>
              {CHECK.map((c, i) =>
                i === question ? (
                  <fieldset key={c.q} className="egr-choice">
                    <legend>{c.q}</legend>
                    <div className="egr-options">
                      {c.options.map((o) => (
                        <button key={o} type="button" className="egr-option" aria-pressed={answers[i] === o} onClick={() => answer(i, o)}>
                          {o}
                        </button>
                      ))}
                    </div>
                    {answers[i] && <p className="egm-hint">Not quite. Have another go.</p>}
                  </fieldset>
                ) : answers[i] === c.answer ? (
                  <p key={c.q} className="egm-done egm-answered">
                    <span aria-hidden="true">✓ </span>Yes! {c.after}
                  </p>
                ) : null,
              )}
              {checked && (
                <div className="egm-ending">
                  {/* REVIEW: new text. */}
                  <p>Your mummy is ready for its burial. Put it in your tomb, then follow its heart to the Hall of Judgement, where it will be weighed.</p>
                  <PutInTomb activity="mummification" what="your mummy in its coffin" />
                  <div className="egr-actions">
                    <Link className="egr-button" href="/exhibitions/egypt/weighing-of-the-heart">
                      Into the Hall of Judgement <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        }
        notes={phase === 'closed' ? stepNotes('coffin') : []}
      />
      <DragGhost at={drag}>
        {drag && (
          <svg className="egm-ghost" viewBox="-70 -10 140 500" width="44" height="150" aria-hidden="true">
            {drag.item === 'lid' ? <CoffinLid id="egm-cof-ghost" /> : <path d={COFFIN_OUTLINE} fill="#efe5cc" stroke="#8a7a5c" strokeWidth="4" />}
          </svg>
        )}
      </DragGhost>
    </>
  );
}
