'use client';

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, StepDots, TombDoor } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import { markDone } from '../tombState';
import {
  CLEOPATRA,
  CLEOPATRA_GREEK,
  NAME_SIGNS,
  PTOLEMY,
  PTOLEMY_GREEK,
  PTOLEMY_ORDER,
  ROSETTA_NOTES,
  ROSETTA_SOURCES,
  SCRIPTS,
  SHARED_IN_NAME,
  SKIPPED,
  STONE_CARTOUCHES,
  glyph,
  onCartouche,
  type Script,
} from './rosetta';
import './rosetta.css';
import { playEgypt } from '../egyptSound';

/*
 * The Rosetta Stone Decoder: cracking a code. It opens on the room's dark
 * intro (DarkIntro), its lines appearing one by one and read aloud, which
 * sets the mission: read a king's name in hieroglyphs. The mission bar
 * stays at the top the whole time, filling up: first the seven signs of the
 * king's cartouche, then the sound of each, until it reads P-T-O-L-M-I-S.
 *
 *   1  The stone, its three bands stacked as on the stone: tap the one you
 *      can read (it looks like our letters). Each band tapped is labelled.
 *   2  The top band, close up: find an oval (a cartouche) ringing the
 *      king's name, and tap it. The signs inside go into the mission bar.
 *   3  The code: the Greek name ΠΤΟΛΕΜΑΙΟΣ as a row of letters, each with
 *      its sound, and the cartouche beneath. Two rules, taught first: the
 *      signs go in the same order as the Greek letters, and the scribes
 *      left out some vowels. Drag each sign (or tap the letter) onto the
 *      Greek letter it says, one at a time, in order.
 *   4  The check, as Champollion made it: Cleopatra's cartouche under
 *      Ptolemy's, her Greek name over her signs. Tap the signs you already
 *      know: each lights up in both names, in the same place as its letter.
 *   5  Cracked: the name, and the real code-breakers, in three short stops.
 *
 * Each step has its own #address and a dot, so a teacher can jump to it.
 * Every fact is a museum note; the sources (and the stone's museum number)
 * are in the room's Sources drawer (rosetta.ts).
 */

const STEPS = [
  { id: 'stone', title: 'Which writing can you read?' },
  { id: 'find', title: 'Find the king’s name' },
  { id: 'code', title: 'Crack the code' },
  { id: 'check', title: 'Check it with a queen' },
  { id: 'cracked', title: 'Cracked!' },
] as const;
type StepId = (typeof STEPS)[number]['id'];
/** The old tabs' addresses, still opened at the step they are now. */
const OLD: Record<string, StepId> = { scripts: 'stone', ptolemy: 'code', cleopatra: 'check', eureka: 'cracked' };

const INTRO = [
  'In 1799, soldiers in Egypt found a broken stone.',
  'One message was carved on it three times, in three kinds of writing.',
  'By then, nobody could read hieroglyphs. But people could still read Greek.',
  'Your mission: use the Greek to crack a king’s name, hidden in hieroglyphs.',
];

const HIERO = SCRIPTS[0];
const ENDING = NAME_SIGNS;

/** The mission, always in view: the king's cartouche, filling up sign by sign and sound by sound. */
function MissionBar({ signs, sounds }: { signs: boolean; sounds: number[] }) {
  const all = sounds.length === PTOLEMY.length;
  return (
    <section className={`egs-mission ${all ? 'is-done' : ''}`} aria-label="Your mission">
      <p className="egs-mission-goal">
        <span className="egs-mission-kicker">Mission</span> {all ? 'Cracked: Ptolemy!' : 'Read the king’s name in hieroglyphs'}
      </p>
      <ol className="egs-mission-slots" aria-label={signs ? `The king’s name so far: ${PTOLEMY.map((s, i) => (sounds.includes(i) ? s.sound : '?')).join(' ')}` : 'The king’s name: not found yet'}>
        {PTOLEMY.map((s, i) => (
          <li key={i} className={`egs-mission-slot ${signs ? 'has-sign' : ''} ${sounds.includes(i) ? 'has-sound' : ''}`} aria-hidden="true">
            <span className="egs-mission-sign">{signs ? <Glyphs text={glyph(s)} /> : null}</span>
            <span className="egs-mission-sound">{sounds.includes(i) ? s.sound : ''}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function RosettaStone() {
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState<StepId>('stone');
  // 1: which bands have been tapped (each is then labelled).
  const [tapped, setTapped] = useState<Script['id'][]>([]);
  // 2: the oval found, and the last missed tap (where to show "not there").
  const [found, setFound] = useState(false);
  const [miss, setMiss] = useState<{ x: number; y: number } | null>(null);
  // 3: the signs placed on their Greek letters, in order.
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  // 4: Cleopatra's signs recognised from Ptolemy's.
  const [known, setKnown] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const drag = useRef<{ id: number; x: number; y: number; el: HTMLElement; moved: boolean } | null>(null);
  const firstRef = useRef<HTMLElement | null>(null);

  const index = STEPS.findIndex((s) => s.id === step);
  const greekDone = tapped.includes('greek');
  const codeDone = placed.length === PTOLEMY.length;
  const checkDone = SHARED_IN_NAME.every((i) => known.includes(i));
  const next = codeDone ? null : placed.length;
  const done = (i: number) => [greekDone, found, codeDone, checkDone, codeDone && checkDone][i];

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const id = (STEPS.find((s) => s.id === h)?.id ?? OLD[h]) as StepId | undefined;
      if (id) setStep(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  useEffect(() => {
    if (step === 'cracked') markDone('rosetta');
  }, [step]);

  // Into each step: its first thing to do takes the focus.
  useEffect(() => {
    if (!intro) firstRef.current?.focus({ preventScroll: true });
  }, [intro, step]);

  const say = (text: string) => {
    setFeedback(text);
    setStatus(text);
  };

  const go = (i: number) => {
    const id = STEPS[Math.max(0, Math.min(STEPS.length - 1, i))].id;
    if (id !== step) playEgypt('grind');
    setStep(id);
    setFeedback('');
    setWrong(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
  };

  // 1: tap a band.
  const pickBand = (s: Script) => {
    setTapped((t) => (t.includes(s.id) ? t : [...t, s.id]));
    if (s.id === 'greek') {
      playEgypt('find');
      say('Greek! People could still read it. The Greek names the king: Ptolemy.');
    } else {
      playEgypt('miss');
      say(`That is ${s.name.toLowerCase()} writing. Nobody could read it in 1799. Try another band.`);
    }
  };

  // 2: find an oval in the top band.
  const findIt = () => {
    if (!found) playEgypt('find');
    setFound(true);
    setMiss(null);
    say('You found a cartouche! Inside the oval are the seven signs of the king’s name. They are in your mission bar.');
  };
  const onPano = (e: MouseEvent<HTMLDivElement>) => {
    if (found) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0) return;
    const x = ((e.clientX - r.left) / r.width) * HIERO.width;
    const y = ((e.clientY - r.top) / r.height) * HIERO.height;
    if (onCartouche(x, y)) {
      findIt();
    } else {
      playEgypt('miss');
      setMiss({ x: (x / HIERO.width) * 100, y: (y / HIERO.height) * 100 });
      say('Not there. Look for an oval ring drawn round a few signs.');
    }
  };

  // 3: put the next sign on a Greek letter.
  const place = (letter: number) => {
    if (next === null) return;
    const sign = PTOLEMY[next];
    const want = PTOLEMY_ORDER[next];
    const g = PTOLEMY_GREEK[letter];
    if (letter === want || (g.sound === sign.sound && !PTOLEMY_ORDER.slice(0, next).includes(letter))) {
      const now = [...placed, next];
      setPlaced(now);
      setWrong(null);
      playEgypt(now.length === PTOLEMY.length ? 'find' : 'chisel');
      say(now.length === PTOLEMY.length ? 'P, T, O, L, M, I, S: the king’s name is Ptolemy! You cracked the code.' : `Yes! Sign ${next + 1} says ${sign.sound}.${letter !== want ? ' (It goes with the first O: the signs go in order.)' : ''}`);
      return;
    }
    playEgypt('miss');
    setWrong(letter);
    if (SKIPPED.includes(letter)) say(`Not ${g.sound}. The scribes left this vowel out! Try the next letter.`);
    else if (letter < want) say(`Not ${g.sound}: that letter already has its sign. The signs go in order.`);
    else say(`Not ${g.sound}. Count along: the signs go in the same order as the Greek letters.`);
  };

  // 3: dragging a sign (the pointer); a tap on a letter does the same.
  const onDown = (e: PointerEvent<HTMLButtonElement>, i: number) => {
    if (i !== next) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, el: e.currentTarget, moved: false };
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) d.moved = true;
    d.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
    d.el.classList.add('is-dragging');
  };
  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    d.el.style.transform = '';
    d.el.classList.remove('is-dragging');
    if (!d.moved) return;
    d.el.style.visibility = 'hidden';
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-slot]');
    d.el.style.visibility = '';
    if (under) place(Number(under.dataset.slot));
  };

  // 4: tap a sign in Cleopatra's cartouche that is also in Ptolemy's.
  const pickCleo = (i: number) => {
    if (known.includes(i)) return;
    if (SHARED_IN_NAME.includes(i)) {
      const now = [...known, i];
      setKnown(now);
      playEgypt(now.length === SHARED_IN_NAME.length ? 'find' : 'chisel');
      const p = PTOLEMY.findIndex((s) => s.code === CLEOPATRA[i].code);
      say(
        now.length === SHARED_IN_NAME.length
          ? 'Your code works! L, O and P sit just where the Greek spelling puts them. Now the rest of her name can be read.'
          : `Yes! In Ptolemy’s name this sign says ${PTOLEMY[p].sound}. In Cleopatra’s, the Greek letter above it is ${CLEOPATRA_GREEK[i]}, too.`,
      );
    } else if (i >= ENDING) {
      playEgypt('miss');
      say(i === CLEOPATRA.length - 2 ? 'That is the bread, T, from Ptolemy’s name! But here it is part of the ending after a queen’s name. Look inside her name.' : 'That sign is part of the ending after a queen’s name. Look inside her name.');
    } else {
      playEgypt('miss');
      say('That sign is new: it is not in Ptolemy’s name. Find the ones you know.');
    }
  };

  const nav = (
    <div className="egs-nav">
      <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
        <span aria-hidden="true">←</span> Back
      </button>
      <StepDots steps={STEPS} at={index} done={done} onGo={go} label="The decoder’s steps" />
      {index < STEPS.length - 1 ? (
        <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={!done(index)}>
          Next <span aria-hidden="true">→</span>
        </button>
      ) : (
        <TombDoor />
      )}
    </div>
  );

  return (
    <RoomShell className="eg-rosetta" sources={ROSETTA_SOURCES} fit>
      {intro && <DarkIntro title="The Rosetta Stone Decoder" lines={INTRO} voice="rosetta-stone-intro" begin="Start the mission" onDone={() => setIntro(false)} />}

      <RoomHeader kicker="Interactive · Code breakers" title="The Rosetta Stone Decoder" />
      <MissionBar signs={found || placed.length > 0} sounds={placed} />

      <div className="egs-step egr-fill" data-step={step}>
        <h2 className="egs-step-title">
          <span className="egs-step-n">{index + 1}</span> {STEPS[index].title}
        </h2>

        {step === 'stone' && (
          <>
            <p className="egr-task">Three kinds of writing, one on top of another. Tap the one you can read: it looks like our letters.</p>
            <ol className="egs-bands" aria-label="The Rosetta Stone, top to bottom">
              {SCRIPTS.map((s, i) => {
                const seen = tapped.includes(s.id);
                return (
                  <li key={s.id} className={`egs-band-row ${seen ? 'is-seen' : ''} ${seen && s.id === 'greek' ? 'is-right' : ''}`}>
                    <button
                      ref={i === 0 ? (el) => void (firstRef.current = el) : undefined}
                      type="button"
                      className="egs-band"
                      aria-pressed={seen}
                      onClick={() => pickBand(s)}
                      style={{ aspectRatio: `${s.width} / ${s.height}` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.src} alt={s.alt} width={s.width} height={s.height} />
                    </button>
                    <div className="egs-band-tag">
                      {seen ? (
                        <>
                          <p className="egs-band-name">
                            {s.id === 'greek' ? '✓ ' : ''}
                            {s.name}
                            {s.id === 'greek' && (
                              <span className="egs-greek-name" lang="grc" aria-label="ΠΤΟΛΕΜΑΙΟΣ, Ptolemaios">
                                ΠΤΟΛΕΜΑΙΟΣ
                              </span>
                            )}
                          </p>
                          {s.id === 'greek' ? (
                            <FactNote fact={ROSETTA_NOTES.greek} className="egr-fact" />
                          ) : (
                            <FactNote fact={s.note} className="egr-fact" />
                          )}
                        </>
                      ) : (
                        <p className="egs-band-place">{s.place}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {step === 'find' && (
          <>
            <p className="egr-task">
              A king’s name was ringed by an oval, called a <strong>cartouche</strong>. Find one in the hieroglyphs, and tap it.
            </p>
            <div className="egs-find egr-sizer">
              <div className={`egs-pano ${found ? 'is-found' : ''}`} style={{ aspectRatio: `${HIERO.width} / ${HIERO.height}` }} onClick={onPano}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HIERO.src} alt={HIERO.alt} width={HIERO.width} height={HIERO.height} draggable={false} />
                {STONE_CARTOUCHES.map((c, i) => (
                  <button
                    key={i}
                    ref={i === 0 ? (el) => void (firstRef.current = el) : undefined}
                    type="button"
                    className="egs-oval"
                    style={{ left: `${((c.x - c.rx) / HIERO.width) * 100}%`, top: `${((c.y - c.ry) / HIERO.height) * 100}%`, width: `${((2 * c.rx) / HIERO.width) * 100}%`, height: `${((2 * c.ry) / HIERO.height) * 100}%` }}
                    aria-label={`An oval on the stone (${i + 1} of ${STONE_CARTOUCHES.length})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      findIt();
                    }}
                  />
                ))}
                {miss && !found && <span className="egs-miss" style={{ left: `${miss.x}%`, top: `${miss.y}%` }} aria-hidden="true" />}
              </div>
            </div>
            {found && (
              <div className="egs-zoom">
                <span className="egs-zoom-oval" aria-hidden="true">
                  <Glyphs text={PTOLEMY.map(glyph).join('')} />
                </span>
                <p>The king’s name, inside its cartouche: seven signs. But which sign says which sound?</p>
              </div>
            )}
          </>
        )}

        {step === 'code' && (
          <div className="egs-code">
            <ul className="egs-rules" aria-label="The code’s two rules">
              <li>
                <span className="egs-rule-n" aria-hidden="true">1</span> The signs go in the <strong>same order</strong> as the Greek letters.
              </li>
              <li>
                <span className="egs-rule-n" aria-hidden="true">2</span> The scribes <strong>left out</strong> some vowels.
              </li>
            </ul>

            <ol className="egs-tape" aria-label={`Ptolemy’s name in the Greek: ${PTOLEMY_GREEK.map((g) => g.letter).join('')}`}>
              {PTOLEMY_GREEK.map((g, gi) => {
                const si = PTOLEMY_ORDER.indexOf(gi);
                const has = si >= 0 && placed.includes(si);
                const skipped = codeDone && SKIPPED.includes(gi);
                return (
                  <li key={gi}>
                    <button
                      ref={gi === 0 ? (el) => void (firstRef.current = el) : undefined}
                      type="button"
                      data-slot={gi}
                      className={`egs-slot ${has ? 'is-filled' : ''} ${wrong === gi ? 'is-wrong' : ''} ${skipped ? 'is-skipped' : ''}`}
                      aria-label={`Letter ${gi + 1}, ${g.letter}, says ${g.sound}${has ? `: sign ${si + 1} is here` : ''}`}
                      onClick={() => place(gi)}
                      disabled={codeDone}
                    >
                      <span className="egs-slot-sign" aria-hidden="true">
                        {has ? <Glyphs text={glyph(PTOLEMY[si])} /> : skipped ? '–' : ''}
                      </span>
                      <span className="egs-greek-letter" lang="grc" aria-hidden="true">
                        {g.letter}
                      </span>
                      <span className="egs-greek-sound" aria-hidden="true">
                        {g.sound}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="egs-cartouche egs-tiles" role="group" aria-label="The signs in the king’s cartouche, in order">
              {PTOLEMY.map((s, i) => {
                const isPlaced = placed.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`egs-tile ${isPlaced ? 'is-placed' : ''} ${i === next ? 'is-next' : ''}`}
                    aria-label={isPlaced ? `Sign ${i + 1}: ${s.sound}` : `Sign ${i + 1}${i === next ? ': drag it to the Greek letter it says' : ''}`}
                    aria-disabled={i !== next}
                    onPointerDown={(e) => onDown(e, i)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onClick={() => i === next && say(`Sign ${i + 1}: which Greek letter does it say? Drag it there, or tap the letter.`)}
                  >
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound" aria-hidden="true">
                      {isPlaced ? s.sound : '?'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="egs-feedback" aria-hidden="true">
              {feedback || (codeDone ? '' : `Drag the glowing sign up to the Greek letter it says, or tap that letter. Start with sign ${(next ?? 0) + 1}.`)}
            </p>
            {codeDone && <p className="egs-win">P-T-O-L-M-I-S: Ptolemy!</p>}
          </div>
        )}

        {step === 'check' && (
          <div className="egs-check">
            {!checkDone && <p className="egr-task">If your code is right, the same signs must say the same sounds in another royal name. Tap each sign in Cleopatra’s name that you already know from Ptolemy’s.</p>}
            <div className="egs-compare">
              <p className="egr-label">Ptolemy: your code</p>
              <div className="egs-cartouche egs-known" role="list" aria-label="Ptolemy’s cartouche, for comparing">
                {PTOLEMY.map((s, i) => {
                  const match = known.some((k) => CLEOPATRA[k].code === s.code);
                  return (
                    <span key={i} role="listitem" className={`egs-pair ${match ? 'is-match' : ''}`} aria-label={`${s.sound}${match ? ', also in Cleopatra’s name' : ''}`}>
                      <Glyphs text={glyph(s)} />
                      <span className="egs-sound" aria-hidden="true">
                        {s.sound}
                      </span>
                    </span>
                  );
                })}
              </div>

              <p className="egr-label">Cleopatra: her name in Greek, over her signs</p>
              <div className="egs-cartouche egs-cleo" role="group" aria-label="The signs in Cleopatra’s cartouche">
                {CLEOPATRA.map((s, i) => {
                  const isKnown = known.includes(i);
                  const end = i >= ENDING;
                  const sound = isKnown || (checkDone && !end) ? s.sound : null;
                  return (
                    <button
                      key={i}
                      ref={i === 0 ? (el) => void (firstRef.current = el) : undefined}
                      type="button"
                      className={`egs-pair ${isKnown ? 'is-match' : ''} ${sound && !isKnown ? 'is-new' : ''} ${end ? 'is-ending' : ''}`}
                      aria-label={end ? `Sign ${i + 1}: part of the ending` : sound ? `Sign ${i + 1}: ${sound}` : `Sign ${i + 1}`}
                      onClick={() => pickCleo(i)}
                    >
                      <span className="egs-over" aria-hidden="true">
                        {end ? '' : CLEOPATRA_GREEK[i]}
                      </span>
                      <Glyphs text={glyph(s)} />
                      <span className="egs-sound" aria-hidden="true">
                        {end ? (i === ENDING ? 'ending' : '') : sound ?? '?'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FactNote fact={ROSETTA_NOTES.notOnStone} className="egr-fact egs-caption" />
            </div>
            <p className="egs-feedback" aria-hidden="true">
              {feedback || `${known.length} of ${SHARED_IN_NAME.length} found`}
            </p>
            {checkDone && (
              <div className="egs-notes">
                <FactNote fact={ROSETTA_NOTES.cleopatra} className="egr-fact" lead="Champollion’s check:" />
                <FactNote fact={ROSETTA_NOTES.hand} className="egr-fact" lead="A twist:" />
              </div>
            )}
          </div>
        )}

        {step === 'cracked' && (
          <div className="egs-cracked">
            <div className="egs-trophy">
              <div className="egs-cartouche egs-trophy-oval" role="img" aria-label="Ptolemy’s cartouche: P, T, O, L, M, I, S">
                {PTOLEMY.map((s, i) => (
                  <span key={i} className="egs-pair is-match" aria-hidden="true">
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound">{s.sound}</span>
                  </span>
                ))}
              </div>
              <p className="egs-win">{codeDone && checkDone ? 'You cracked it: Ptolemy!' : 'This is the name you are cracking: Ptolemy.'}</p>
            </div>
            <ol className="egs-timeline" aria-label="The real code-breakers">
              <li>
                <p className="egs-when">1799</p>
                <h3>The stone is found</h3>
                <FactNote fact={ROSETTA_NOTES.found} className="egr-fact" />
              </li>
              <li>
                <p className="egs-when">Before 1822</p>
                <h3>Thomas Young</h3>
                <FactNote fact={ROSETTA_NOTES.youngShort} className="egr-fact" />
              </li>
              <li>
                <p className="egs-when">14 September 1822</p>
                <h3>Jean-François Champollion</h3>
                <FactNote fact={ROSETTA_NOTES.eureka} className="egr-fact" />
              </li>
            </ol>
          </div>
        )}
      </div>

      {nav}

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}

