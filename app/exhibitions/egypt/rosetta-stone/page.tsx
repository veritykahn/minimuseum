'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { seededShuffle } from '@/components/games/scoring';
import { useClientSeed } from '@/components/games/useClientSeed';
import RoomShell, { Glyphs, RoomHeader, StepDots } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import PutInTomb from '../PutInTomb';
import { markDone } from '../tombState';
import {
  BY_PAIR,
  BY_PLACE,
  CLEOPATRA,
  CLEOPATRA_GREEK,
  CLEOPATRA_GREEK_LETTERS,
  CODE_LETTERS,
  NAME_SIGNS,
  PTOLEMY,
  PTOLEMY_GREEK,
  PTOLEMY_ORDER,
  ROSETTA_NOTES,
  ROSETTA_SOURCES,
  SCRIPTS,
  SKIPPED,
  STONE_CARTOUCHES,
  checkFill,
  glyph,
  inQueen,
  onCartouche,
  pairSound,
  type Script,
} from './rosetta';
import './rosetta.css';
import { playEgypt } from '../egyptSound';

/*
 * The point: you crack a code the way Champollion did, by reasoning from a
 * Greek name you can read to the hieroglyphs of the same name you cannot.
 *
 * The Rosetta Stone Decoder. It opens on the room's dark intro (DarkIntro),
 * its lines appearing one by one and read aloud, which sets the mission:
 * read a king's name in hieroglyphs. The mission bar stays at the top the
 * whole time, filling up: first the seven signs of the king's cartouche,
 * then the sound of each, until it reads P-T-O-L-M-I-S.
 *
 *   1  The stone, its three bands stacked as on the stone: tap the one you
 *      can read (it looks like our letters). Each band tapped is labelled.
 *   2  The top band, close up: find an oval (a cartouche) ringing the
 *      king's name, and tap it. The signs inside go into the mission bar,
 *      and Thomas Young comes in: he read this name first, not all of it
 *      right. Can you do better?
 *   3  Two names, one code (Champollion's check, made the way in): the
 *      king's cartouche and the queen's, each under its Greek name, letters
 *      numbered. Tap a sign of the king's that is also in the queen's; then
 *      work out its sound: the one letter at its place in both names. Wrong
 *      tries say why; the second shows how to count. This gives P, O, L.
 *   4  Read the whole name: the king's other signs, one at a time, in order.
 *      Tap the Greek letter each says, from where it sits between the
 *      sounds already known; every consonant has a sign, some vowels were
 *      left out. Each wrong letter says why (checkFill); after two, the
 *      right letter glows. Then the queen's name reads too, with its two
 *      twists (the hand, the ending).
 *   5  Cracked: the name, the real code-breakers in three short stops, and
 *      "Put this in your burial tomb": a papyrus with the royal name, laid
 *      on the tomb's scroll stand.
 *
 * Each step has its own #address and a dot, so a teacher can jump to it.
 * Every fact is a museum note; the sources (and the stone's museum number)
 * are in the room's Sources drawer (rosetta.ts).
 */

// REVIEW: new text (step titles 3 and 4).
const STEPS = [
  { id: 'stone', title: 'Which writing can you read?' },
  { id: 'find', title: 'Find the king’s name' },
  { id: 'crack', title: 'Two names, one code' },
  { id: 'fill', title: 'Read the whole name' },
  { id: 'cracked', title: 'Cracked!' },
] as const;
type StepId = (typeof STEPS)[number]['id'];
/** The old steps' and tabs' addresses, still opened at the step they are now. */
const OLD: Record<string, StepId> = { scripts: 'stone', code: 'crack', check: 'crack', ptolemy: 'crack', cleopatra: 'fill', eureka: 'cracked' };

const INTRO = [
  'In 1799, soldiers in Egypt found a broken stone.',
  'One message was carved on it three times, in three kinds of writing.',
  'By then, nobody could read hieroglyphs. But people could still read Greek.',
  'Your mission: use the Greek to crack a king’s name, hidden in hieroglyphs.',
];

const HIERO = SCRIPTS[0];
const BREAD = CLEOPATRA.length - 2;
const KING_LETTERS = PTOLEMY_GREEK.map((g) => g.letter);
const KING_GREEK = KING_LETTERS.join('');
const QUEEN_GREEK = CLEOPATRA_GREEK_LETTERS.join('');
const letterOf = (sound: string) => CODE_LETTERS.find((c) => c.sound === sound)!.letter;

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

/** A Greek name, its letters numbered, so the decoder can count along it. */
function GreekName({ letters, who }: { letters: readonly string[]; who: string }) {
  return (
    <ol className="egs-greek-row" aria-label={`${who} in Greek: ${letters.join('')}`}>
      {letters.map((l, i) => (
        <li key={i} aria-hidden="true">
          <span className="egs-greek-n">{i + 1}</span>
          <span className="egs-greek-letter" lang="grc">
            {l}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function RosettaStone() {
  const seed = useClientSeed();
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState<StepId>('stone');
  // 1: which bands have been tapped (each is then labelled).
  const [tapped, setTapped] = useState<Script['id'][]>([]);
  // 2: the oval found, and the last missed tap (where to show "not there").
  const [found, setFound] = useState(false);
  const [miss, setMiss] = useState<{ x: number; y: number } | null>(null);
  // 3 and 4: the king's signs whose sound is known, in the order found.
  const [solved, setSolved] = useState<number[]>([]);
  // 3: the king's sign picked to crack.
  const [pick, setPick] = useState<number | null>(null);
  // 3 and 4: wrong tries on the sign in hand, and the last wrong answer.
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const firstRef = useRef<HTMLElement | null>(null);

  const index = STEPS.findIndex((s) => s.id === step);
  const greekDone = tapped.includes('greek');
  const pairDone = BY_PAIR.every((i) => solved.includes(i));
  const fillDone = solved.length === PTOLEMY.length;
  const nextFill = pairDone ? (BY_PLACE.find((i) => !solved.includes(i)) ?? null) : null;
  const done = (i: number) => [greekDone, found, pairDone, fillDone, fillDone][i];
  const queenAt = pick === null ? null : inQueen(pick);
  // The letters to choose from, in an order of this visit's own.
  const choices = useMemo(() => (seed === null ? CODE_LETTERS : seededShuffle(CODE_LETTERS, seed)), [seed]);

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
    if (step === 'cracked' && fillDone) markDone('rosetta');
  }, [step, fillDone]);

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
    setTries(0);
    setPick(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
  };

  // A sound worked out: into the mission bar.
  const crack = (pi: number, text: string) => {
    const now = [...solved, pi];
    setSolved(now);
    setPick(null);
    setTries(0);
    setWrong(null);
    playEgypt(now.length === PTOLEMY.length || (BY_PAIR.includes(pi) && BY_PAIR.every((i) => now.includes(i))) ? 'find' : 'chisel');
    say(text);
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

  // 3: tap a sign of the king's, looking for one the queen has too.
  // REVIEW: new text (this feedback).
  const pickKing = (pi: number) => {
    setWrong(null);
    setTries(0);
    if (solved.includes(pi)) {
      setPick(null);
      say(`You cracked that one: it says ${PTOLEMY[pi].sound}.`);
      return;
    }
    const at = inQueen(pi);
    if (typeof at === 'number') {
      playEgypt('chisel');
      setPick(pi);
      say(`Yes! This sign is in both names: number ${pi + 1} in the king’s, number ${at + 1} in the queen’s. Now, which sound does it say?`);
    } else if (at === 'ending') {
      playEgypt('miss');
      setPick(null);
      say('The queen has this sign too, but only in the two signs that close her cartouche, after her name. It cannot help you here. Find another.');
    } else {
      playEgypt('miss');
      setPick(null);
      say('Look along the queen’s cartouche: this sign is not in it. Find a sign that is in both.');
    }
  };

  // 3: the sound of the picked sign, from where it stands in both Greek names.
  // REVIEW: new text (this feedback).
  const tryPair = (sound: string) => {
    if (pick === null || typeof queenAt !== 'number') return;
    const want = pairSound(pick);
    const kingLetter = KING_LETTERS[PTOLEMY_ORDER[pick]];
    if (sound === want) {
      const left = BY_PAIR.filter((i) => i !== pick && !solved.includes(i)).length;
      crack(
        pick,
        left === 0
          ? `${kingLetter} is number ${pick + 1} in his name and number ${queenAt + 1} in hers: this sign says ${want}. P, O and L: three signs cracked, the way Champollion did it.`
          : `${kingLetter}! Number ${pick + 1} in his name, number ${queenAt + 1} in hers: this sign says ${want}. ${left} more sign${left === 1 ? '' : 's'} in both names to find.`,
      );
      return;
    }
    playEgypt('miss');
    if (tries >= 1) {
      crack(pick, `Count along: letter ${pick + 1} of his name is ${kingLetter}, and letter ${queenAt + 1} of hers is ${kingLetter} too. So this sign says ${want}.`);
      return;
    }
    setWrong(sound);
    setTries(1);
    const letter = letterOf(sound);
    const inKing = PTOLEMY_GREEK.some((g) => g.sound === sound);
    const inHers = CLEOPATRA_GREEK.includes(sound);
    say(
      !inKing || !inHers
        ? `Not ${letter}: it is not in ${inKing ? 'the queen’s' : 'the king’s'} name. The sound must be in both. Hint: count along each name to the sign’s number.`
        : `${letter} is in both names, but not in those places. Hint: count along each name. This sign is number ${pick + 1} in his, number ${queenAt + 1} in hers.`,
    );
  };

  // 4: the Greek letter for the next of the king's signs.
  // REVIEW: new text (this feedback).
  const tryFill = (gi: number) => {
    if (nextFill === null) return;
    const g = PTOLEMY_GREEK[gi];
    const answer = checkFill(nextFill, gi, solved);
    if (answer === 'right') {
      const last = solved.length + 1 === PTOLEMY.length;
      crack(nextFill, last ? 'P, T, O, L, M, I, S: the king’s name is Ptolemy! You cracked the code. And with it, you can read the queen’s name too.' : `Yes! Sign ${nextFill + 1} says ${g.sound}.`);
      return;
    }
    playEgypt('miss');
    setWrong(String(gi));
    setTries((t) => t + 1);
    const known = [...solved].sort((a, b) => a - b);
    const before = known.filter((k) => k < nextFill).map((k) => PTOLEMY[k].sound);
    const after = known.filter((k) => k > nextFill).map((k) => PTOLEMY[k].sound);
    const where = `Sign ${nextFill + 1} comes after ${before[before.length - 1]}${after.length ? ` and before ${after[0]}` : ''}`;
    say(
      answer === 'used'
        ? `${g.letter} has its sign already. Find a letter with no sign yet.`
        : answer === 'outside'
          ? `Not ${g.letter}. ${where}, so its letter must sit there in the Greek name too.`
          : answer === 'vowel'
            ? `Not ${g.letter}. ${g.letter} says ${g.sound}, a vowel the scribes left out: it has no sign. Try the next letter.`
            : answer === 'nearly'
              ? `Nearly! This sign is a vowel, but not ${g.sound}: the scribes left that one out. Try the next vowel.`
              : `Not yet: ${g.letter} comes later. Take the letters in order: is there one before it that still needs a sign?`,
    );
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
        <span className="egs-nav-end" aria-hidden="true" />
      )}
    </div>
  );

  return (
    <RoomShell className="eg-rosetta" sources={ROSETTA_SOURCES} fit>
      {intro && <DarkIntro title="The Rosetta Stone Decoder" lines={INTRO} voice="rosetta-stone-intro" begin="Start the mission" onDone={() => setIntro(false)} />}

      <RoomHeader kicker="Interactive · Code breakers" title="The Rosetta Stone Decoder" />
      <MissionBar signs={found || solved.length > 0} sounds={solved} />

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
                          {s.id === 'greek' ? <FactNote fact={ROSETTA_NOTES.greek} className="egr-fact" /> : <FactNote fact={s.note} className="egr-fact" />}
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
                <div className="egs-young">
                  <FactNote fact={ROSETTA_NOTES.cartouches} className="egr-fact" lead="The race:" />
                  {/* REVIEW: new text */}
                  <p className="egs-young-ask">Seven signs. Which says which sound? Can you do better than Thomas Young?</p>
                </div>
              </div>
            )}
          </>
        )}

        {step === 'crack' && (
          <div className="egs-crack">
            {/* REVIEW: new text */}
            <p className="egr-task">
              Champollion’s trick: a sign that is in <strong>both</strong> names must say a sound that is in both. Tap a sign in the king’s name that the queen has too.
            </p>
            <div className="egs-two">
              <section className="egs-name-card" aria-label="The king: Ptolemy">
                <p className="egr-label">The king</p>
                <GreekName letters={KING_LETTERS} who="The king’s name" />
                <div className="egs-cartouche egs-king" role="group" aria-label="The signs in the king’s cartouche">
                  {PTOLEMY.map((s, i) => {
                    const known = solved.includes(i);
                    return (
                      <button
                        key={i}
                        ref={i === 0 ? (el) => void (firstRef.current = el) : undefined}
                        type="button"
                        className={`egs-pair ${known ? 'is-match' : ''} ${pick === i ? 'is-picked' : ''}`}
                        aria-pressed={pick === i}
                        aria-label={`Sign ${i + 1}${known ? `: ${s.sound}` : ''}`}
                        onClick={() => pickKing(i)}
                      >
                        <span className="egs-over" aria-hidden="true">
                          {i + 1}
                        </span>
                        <Glyphs text={glyph(s)} />
                        <span className="egs-sound" aria-hidden="true">
                          {known ? s.sound : '?'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="egs-name-card" aria-label="The queen: Cleopatra">
                <p className="egr-label">The queen</p>
                <GreekName letters={CLEOPATRA_GREEK_LETTERS} who="The queen’s name" />
                <div className="egs-cartouche egs-queen" role="list" aria-label="The signs in the queen’s cartouche">
                  {CLEOPATRA.map((s, i) => {
                    const end = i >= NAME_SIGNS;
                    const shared = !end && PTOLEMY.some((p, pi) => p.code === s.code && solved.includes(pi));
                    const lit = !end && pick !== null && PTOLEMY[pick].code === s.code;
                    return (
                      <span
                        key={i}
                        role="listitem"
                        className={`egs-pair ${shared ? 'is-match' : ''} ${lit ? 'is-picked' : ''} ${end ? 'is-ending' : ''}`}
                        aria-label={end ? `Sign ${i + 1}: part of the ending` : `Sign ${i + 1}${shared ? `: ${s.sound}` : ''}${lit ? ', the same as the king’s sign you picked' : ''}`}
                      >
                        <span className="egs-over" aria-hidden="true">
                          {end ? '' : i + 1}
                        </span>
                        <Glyphs text={glyph(s)} />
                        <span className="egs-sound" aria-hidden="true">
                          {end ? (i === NAME_SIGNS ? 'ending' : '') : shared ? s.sound : '?'}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </section>
            </div>

            {pick !== null && typeof queenAt === 'number' && (
              <div className="egs-ask" role="group" aria-label={`Which letter is number ${pick + 1} in ${KING_GREEK} and number ${queenAt + 1} in ${QUEEN_GREEK}?`}>
                {/* REVIEW: new text */}
                <p className="egs-ask-q">
                  Which letter is number <strong>{pick + 1}</strong> in his name, and number <strong>{queenAt + 1}</strong> in hers?
                </p>
                <div className="egs-letters">
                  {choices.map((c) => (
                    <button key={c.sound} type="button" className={`egs-letter ${wrong === c.sound ? 'is-wrong' : ''}`} aria-label={`${c.letter}, says ${c.sound}`} onClick={() => tryPair(c.sound)}>
                      <span className="egs-greek-letter" lang="grc" aria-hidden="true">
                        {c.letter}
                      </span>
                      <span className="egs-greek-sound" aria-hidden="true">
                        {c.sound}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="egs-feedback" aria-hidden="true">
              {feedback || (pairDone ? '' : `${BY_PAIR.filter((i) => solved.includes(i)).length} of ${BY_PAIR.length} signs in both names cracked`)}
            </p>
            {pairDone && pick === null && (
              <div className="egs-notes">
                <FactNote fact={ROSETTA_NOTES.cleopatra} className="egr-fact" lead="Champollion’s check:" />
                <FactNote fact={ROSETTA_NOTES.notOnStone} className="egr-fact" />
              </div>
            )}
          </div>
        )}

        {step === 'fill' && (
          <div className="egs-code">
            {!pairDone && (
              // REVIEW: new text
              <p className="egr-task">First crack the signs the two names share, in step 3.</p>
            )}
            <ul className="egs-rules" aria-label="The code’s two rules">
              <li>
                <span className="egs-rule-n" aria-hidden="true">1</span> The signs go in the <strong>same order</strong> as the Greek letters.
              </li>
              <li>
                {/* REVIEW: new text */}
                <span className="egs-rule-n" aria-hidden="true">2</span> Every consonant has a sign. Some <strong>vowels</strong> were left out.
              </li>
            </ul>

            <ol className="egs-tape" aria-label={`The king’s name in Greek: ${KING_GREEK}`}>
              {PTOLEMY_GREEK.map((g, gi) => {
                const si = PTOLEMY_ORDER.indexOf(gi);
                const has = si >= 0 && solved.includes(si);
                const skipped = fillDone && SKIPPED.includes(gi);
                const hint = tries >= 2 && nextFill !== null && PTOLEMY_ORDER[nextFill] === gi;
                return (
                  <li key={gi}>
                    <button
                      ref={gi === 0 ? (el) => void (firstRef.current = el) : undefined}
                      type="button"
                      className={`egs-slot ${has ? 'is-filled' : ''} ${wrong === String(gi) ? 'is-wrong' : ''} ${skipped ? 'is-skipped' : ''} ${hint ? 'is-hint' : ''}`}
                      aria-label={`Letter ${gi + 1}, ${g.letter}, says ${g.sound}${has ? `: sign ${si + 1} is here` : ''}${hint ? ' (try this one)' : ''}`}
                      onClick={() => tryFill(gi)}
                      disabled={fillDone || !pairDone}
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

            <div className="egs-cartouche egs-tiles" role="list" aria-label="The signs in the king’s cartouche, in order">
              {PTOLEMY.map((s, i) => {
                const known = solved.includes(i);
                return (
                  <span key={i} role="listitem" className={`egs-tile ${known ? 'is-placed' : ''} ${i === nextFill ? 'is-next' : ''}`} aria-label={known ? `Sign ${i + 1}: ${s.sound}` : `Sign ${i + 1}${i === nextFill ? ': which letter does it say?' : ''}`}>
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound" aria-hidden="true">
                      {known ? s.sound : '?'}
                    </span>
                  </span>
                );
              })}
            </div>
            <p className="egs-feedback" aria-hidden="true">
              {/* REVIEW: new text */}
              {feedback || (nextFill === null ? '' : `The glowing sign is number ${nextFill + 1}. Which Greek letter does it say? Tap it.`)}
            </p>
            {fillDone && (
              <div className="egs-queen-read">
                <div className="egs-cartouche egs-known" role="img" aria-label="The queen’s cartouche, read: K, L, E, O, P, A, T, R, A, and the ending">
                  {CLEOPATRA.map((s, i) => (
                    <span key={i} className={`egs-pair ${i >= NAME_SIGNS ? 'is-ending' : PTOLEMY.some((p) => p.code === s.code) ? 'is-match' : 'is-new'}`} aria-hidden="true">
                      <Glyphs text={glyph(s)} />
                      <span className="egs-sound">{i >= NAME_SIGNS ? (i === BREAD ? 'ending' : '') : s.sound}</span>
                    </span>
                  ))}
                </div>
                <div className="egs-notes">
                  <FactNote fact={ROSETTA_NOTES.hand} className="egr-fact" lead="A twist:" />
                  <FactNote fact={ROSETTA_NOTES.ending} className="egr-fact" lead="And the ending:" />
                </div>
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
              <p className="egs-win">{fillDone ? 'You cracked it: Ptolemy!' : 'This is the name you are cracking: Ptolemy.'}</p>
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
            {fillDone && (
              <div className="egs-put">
                {/* REVIEW: new text */}
                <PutInTomb activity="rosetta" what="a papyrus with the royal name you cracked, Ptolemy" />
              </div>
            )}
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
