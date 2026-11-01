'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, TombDoor } from '../RoomShell';
import { markDone } from '../tombState';
import {
  CLEOPATRA,
  CLEO_LETTERS,
  DEDUCE,
  DISTRACTORS,
  PTOLEMY,
  PTOLEMY_SOUNDS,
  ROSETTA_NOTES,
  ROSETTA_SOURCES,
  SCRIPTS,
  STONE,
  glyph,
  sharedSigns,
  shuffledSounds,
} from './rosetta';
import './rosetta.css';

/*
 * The Rosetta Stone decoder, in four parts, each a tab with its own
 * #address: the stone and its three scripts side by side; Ptolemy's
 * cartouche, matched sign by sign to its sounds, picked from a shuffled
 * set with sounds that are not in his name; Cleopatra's, cracked by
 * Champollion's own method (the signs she shares with Ptolemy first, then
 * each new sign reasoned from the Greek spelling, with the twist of her
 * hand-shaped t); and the moment of decipherment. Every fact is a museum
 * note; the sources and the photograph's licence are in the room's
 * Sources drawer (rosetta.ts).
 */

const PARTS = [
  { id: 'scripts', label: 'Three scripts' },
  { id: 'ptolemy', label: 'Ptolemy' },
  { id: 'cleopatra', label: 'Cleopatra' },
  { id: 'eureka', label: '“I’ve got it!”' },
] as const;
type PartId = (typeof PARTS)[number]['id'];

const SHARED = sharedSigns();
const HAND = CLEOPATRA.findIndex((s) => s.code === 'D46');

export default function RosettaStone() {
  const [part, setPart] = useState<PartId>('scripts');
  // The server and the first render share one order; the shuffle comes once the page is in the browser.
  const [sounds, setSounds] = useState<string[]>([...PTOLEMY_SOUNDS, ...DISTRACTORS]);
  const [chosenSign, setChosenSign] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [solved, setSolved] = useState<Record<number, string>>({});
  const [miss, setMiss] = useState('');
  const [status, setStatus] = useState('');
  const tabRefs = useRef<Record<PartId, HTMLButtonElement | null>>({ scripts: null, ptolemy: null, cleopatra: null, eureka: null });

  useEffect(() => {
    setSounds(shuffledSounds());
    const fromHash = () => {
      const p = PARTS.find((x) => x.id === window.location.hash.slice(1));
      if (p) setPart(p.id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = (id: PartId, focus = false) => {
    setPart(id);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
    setStatus('');
    setMiss('');
    if (focus) tabRefs.current[id]?.focus();
    if (id === 'eureka') markDone('rosetta');
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = PARTS.findIndex((x) => x.id === part);
    const to =
      e.key === 'ArrowRight' ? (i + 1) % PARTS.length
      : e.key === 'ArrowLeft' ? (i - 1 + PARTS.length) % PARTS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? PARTS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(PARTS[to].id, true);
  };

  // Ptolemy: choose a sign, then its sound.
  const pickSound = (sound: string) => {
    if (chosenSign === null) {
      setStatus('First choose a sign in the cartouche.');
      return;
    }
    if (PTOLEMY[chosenSign].sound === sound) {
      const next = [...matched, chosenSign];
      setMatched(next);
      setChosenSign(null);
      setStatus(next.length === PTOLEMY.length ? 'All seven signs matched: P, T, O, L, M, I, S. Ptolemy!' : `Yes: that sign says ${sound}.`);
    } else {
      setStatus(PTOLEMY.some((s) => s.sound === sound) ? `Not ${sound}. Try another sound for that sign.` : `Not ${sound}: there is no ${sound} in Ptolemy’s name.`);
    }
  };

  // Cleopatra, first: tap the signs already known from Ptolemy.
  const pickCleo = (i: number) => {
    if (found.length < SHARED.length) {
      if (found.includes(i)) return;
      if (SHARED.includes(i)) {
        const next = [...found, i];
        setFound(next);
        setStatus(next.length === SHARED.length ? `All ${SHARED.length} known signs found. Now for the new ones.` : `Yes: you know that one. It says ${CLEOPATRA[i].sound}.`);
      } else {
        setStatus('That sign is new: it is not in Ptolemy’s name. Find the ones you know first.');
      }
    }
  };
  // Then: reason out each new sign from the Greek spelling, in Champollion's order.
  const step = DEDUCE.find((d) => !solved[d.sign]);
  const pickLetter = (letter: string) => {
    if (!step) return;
    if (CLEOPATRA[step.sign].sound === letter) {
      setSolved((s) => ({ ...s, [step.sign]: letter }));
      setMiss('');
      setStatus(step.sign === HAND ? `Yes: the hand says T, just like the bread loaf.` : `Yes: that sign says ${letter}.`);
    } else {
      setMiss(`Not ${letter}. Look at the Greek spelling again: K-L-E-O-P-A-T-R-A.`);
      setStatus(`Not ${letter}.`);
    }
  };

  const ptolemyDone = matched.length === PTOLEMY.length;
  const knownDone = found.length === SHARED.length;
  const cleoDone = knownDone && !step;
  const cleoSound = (i: number) => (found.includes(i) ? CLEOPATRA[i].sound : solved[i] ?? null);

  return (
    <RoomShell className="eg-rosetta" sources={ROSETTA_SOURCES}>
      <RoomHeader kicker="Interactive · Code breakers" title="The Rosetta Stone Decoder">
        <p className="egr-lede">One message, carved three times in three scripts. Crack the names, as Champollion did.</p>
      </RoomHeader>

      <div className="egr-tabs" role="tablist" aria-label="The decoder">
        {PARTS.map((p) => (
          <button
            key={p.id}
            ref={(el) => {
              tabRefs.current[p.id] = el;
            }}
            type="button"
            role="tab"
            id={`egs-tab-${p.id}`}
            aria-controls={`egs-panel-${p.id}`}
            aria-selected={part === p.id}
            tabIndex={part === p.id ? 0 : -1}
            className="egr-tab"
            onClick={() => choose(p.id)}
            onKeyDown={onTabKey}
          >
            {p.label}
          </button>
        ))}
      </div>

      {part === 'scripts' && (
        <div id="egs-panel-scripts" role="tabpanel" aria-labelledby="egs-tab-scripts" className="egs-scripts">
          <div className="egs-stone-row">
            <figure className="egs-stone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={STONE.src} alt={STONE.alt} width={STONE.width} height={STONE.height} />
            </figure>
            <div className="egr-panel">
              <h2>One decree, three scripts</h2>
              <FactNote fact={ROSETTA_NOTES.found} className="egr-fact" />
              <FactNote fact={ROSETTA_NOTES.decree} className="egr-fact" />
              <FactNote fact={ROSETTA_NOTES.museum} className="egr-fact" />
              <div className="egr-actions">
                <button type="button" className="egr-button egr-button-primary" onClick={() => choose('ptolemy')}>
                  Crack a name <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
          <ol className="egs-columns" aria-label="The three scripts, side by side">
            {SCRIPTS.map((s) => (
              <li key={s.id} className="egs-column">
                <p className="egr-label">{s.place} of the stone</p>
                <h3>{s.name}</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading="lazy" />
                <FactNote fact={s.note} className="egr-fact" />
              </li>
            ))}
          </ol>
        </div>
      )}

      {part === 'ptolemy' && (
        <div id="egs-panel-ptolemy" role="tabpanel" aria-labelledby="egs-tab-ptolemy" className="egr-layout">
          <div className="egr-scene egs-board">
            <p className="egr-label">Ptolemy’s cartouche</p>
            <div className="egs-cartouche" role="group" aria-label="The signs in Ptolemy’s cartouche">
              {PTOLEMY.map((s, i) => {
                const done = matched.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`egs-sign ${done ? 'is-done' : ''}`}
                    aria-pressed={chosenSign === i}
                    disabled={done}
                    onClick={() => setChosenSign(i)}
                    aria-label={done ? `Sign ${i + 1}: ${s.sound}` : `Sign ${i + 1}`}
                  >
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound" aria-hidden="true">{done ? s.sound : '?'}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <section className="egr-panel" aria-labelledby="egs-ptolemy-title">
            <h2 id="egs-ptolemy-title">{ptolemyDone ? 'P-T-O-L-M-I-S: Ptolemy!' : 'Match each sign to a sound'}</h2>
            <p>The Greek text names King Ptolemy. Find his name in hieroglyphs: choose a sign in the cartouche, then the sound you think it makes. Careful: some of these sounds are not in his name at all.</p>
            <fieldset className="egr-choice">
              <legend>Sounds</legend>
              <div className="egr-options">
                {sounds.map((snd) => {
                  const used = matched.some((i) => PTOLEMY[i].sound === snd);
                  return (
                    <button key={snd} type="button" className="egr-option egs-sound-button" disabled={used} onClick={() => pickSound(snd)}>
                      {snd}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p className="egs-feedback" aria-hidden="true">{status}</p>
            <FactNote fact={ROSETTA_NOTES.cartouches} className="egr-fact" />
            {ptolemyDone && (
              <div className="egr-actions">
                <button type="button" className="egr-button egr-button-primary" onClick={() => choose('cleopatra')}>
                  Now try Cleopatra <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {part === 'cleopatra' && (
        <div id="egs-panel-cleopatra" role="tabpanel" aria-labelledby="egs-tab-cleopatra" className="egr-layout">
          <div className="egr-scene egs-board">
            <p className="egr-label">Cleopatra’s cartouche</p>
            <div className="egs-cartouche egs-cartouche-long" role="group" aria-label="The signs in Cleopatra’s cartouche">
              {CLEOPATRA.map((s, i) => {
                const sound = cleoSound(i);
                const isEnd = i >= CLEOPATRA.length - 2 && cleoDone;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`egs-sign ${sound ? 'is-done' : ''} ${step && knownDone && step.sign === i ? 'is-asking' : ''} ${i === HAND && solved[HAND] ? 'is-twist' : ''}`}
                    onClick={() => pickCleo(i)}
                    aria-label={sound ? `Sign ${i + 1}: ${sound}` : `Sign ${i + 1}`}
                  >
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound" aria-hidden="true">
                      {sound ?? (isEnd ? '·' : '?')}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* One mark per sign: the name read so far. */}
            <p className="egs-read" aria-hidden="true">
              {CLEOPATRA.map((_, i) => (
                <span key={i} className={i >= CLEOPATRA.length - 2 ? 'egs-read-end' : ''}>
                  {cleoSound(i) ?? '·'}
                </span>
              ))}
            </p>
          </div>
          <section className="egr-panel" aria-labelledby="egs-cleo-title">
            <h2 id="egs-cleo-title">{cleoDone ? 'K-L-E-O-P-A-T-R-A' : knownDone ? 'Work out the new signs' : 'Which signs do you already know?'}</h2>
            {!knownDone && (
              <>
                <p>This cartouche names Queen Cleopatra. Some of its signs are in Ptolemy’s name too. Tap every sign you already know.</p>
                <p className="egr-label">
                  {found.length} of {SHARED.length} found
                </p>
              </>
            )}
            {knownDone && step && (
              <fieldset className="egr-choice egs-deduce">
                <legend>The Greek spelling is K-L-E-O-P-A-T-R-A. {step.clue}</legend>
                <div className="egr-options">
                  {CLEO_LETTERS.map((l) => (
                    <button key={l} type="button" className="egr-option egs-sound-button" onClick={() => pickLetter(l)}>
                      {l}
                    </button>
                  ))}
                </div>
                <p className="egs-feedback" aria-hidden="true">{miss}</p>
              </fieldset>
            )}
            {solved[HAND] && <FactNote fact={ROSETTA_NOTES.hand} className="egr-fact egs-twist" lead="The twist:" />}
            {knownDone && <FactNote fact={ROSETTA_NOTES.cleopatra} className="egr-fact" />}
            <FactNote fact={ROSETTA_NOTES.notOnStone} className="egr-fact" />
            {cleoDone && (
              <>
                <FactNote fact={ROSETTA_NOTES.ending} className="egr-fact" />
                <div className="egr-actions">
                  <button type="button" className="egr-button egr-button-primary" onClick={() => choose('eureka')}>
                    The breakthrough <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {part === 'eureka' && (
        <div id="egs-panel-eureka" role="tabpanel" aria-labelledby="egs-tab-eureka" className="egr-layout">
          <div className="egr-scene egs-board egs-eureka" aria-hidden="true">
            <span className="egs-big">
              <Glyphs text={PTOLEMY.map(glyph).join('')} />
            </span>
            <span className="egs-big egs-big-long">
              <Glyphs text={CLEOPATRA.map(glyph).join('')} />
            </span>
          </div>
          <section className="egr-panel">
            <h2>“Look, I’ve got it!”</h2>
            <FactNote fact={ROSETTA_NOTES.eureka} className="egr-fact" />
            <FactNote fact={ROSETTA_NOTES.young} className="egr-fact" />
            <div className="egr-actions">
              <TombDoor />
            </div>
          </section>
        </div>
      )}

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
