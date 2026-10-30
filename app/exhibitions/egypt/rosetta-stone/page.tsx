'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader } from '../RoomShell';
import { CLEOPATRA, NAME_SIGNS, PTOLEMY, PTOLEMY_SOUNDS, ROSETTA_NOTES, SCRIPTS, STONE, STONE_CREDIT, glyph, sharedSigns } from './rosetta';
import './rosetta.css';

/*
 * The Rosetta Stone decoder, in four parts, each a tab with its own
 * #address: the stone and its three scripts side by side; Ptolemy's
 * cartouche, matched sign by sign to the sounds of his name; Cleopatra's,
 * read with the signs it shares with his; and the moment of decipherment.
 * Every fact is a museum note with its source (rosetta.ts).
 */

const PARTS = [
  { id: 'scripts', label: 'Three scripts' },
  { id: 'ptolemy', label: 'Ptolemy' },
  { id: 'cleopatra', label: 'Cleopatra' },
  { id: 'eureka', label: '“I’ve got it!”' },
] as const;
type PartId = (typeof PARTS)[number]['id'];

const SHARED = sharedSigns();

export default function RosettaStone() {
  const [part, setPart] = useState<PartId>('scripts');
  const [chosenSign, setChosenSign] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState('');
  const tabRefs = useRef<Record<PartId, HTMLButtonElement | null>>({ scripts: null, ptolemy: null, cleopatra: null, eureka: null });

  useEffect(() => {
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
    window.history.replaceState(null, '', `#${id}`);
    setStatus('');
    if (focus) tabRefs.current[id]?.focus();
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
      setStatus(`Not ${sound}. Try another sound for that sign.`);
    }
  };

  // Cleopatra: tap the signs already known from Ptolemy.
  const pickCleo = (i: number) => {
    if (found.includes(i)) return;
    if (SHARED.includes(i)) {
      const next = [...found, i];
      setFound(next);
      setStatus(next.length === SHARED.length ? `All ${SHARED.length} known signs found.` : `Yes: you know that one. It says ${CLEOPATRA[i].sound}.`);
    } else {
      setStatus('That sign is new: it is not in Ptolemy’s name.');
    }
  };

  const ptolemyDone = matched.length === PTOLEMY.length;
  const cleoDone = found.length === SHARED.length;

  return (
    <RoomShell className="eg-rosetta">
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
                <p className="egr-label">
                  {s.place} of the stone
                </p>
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
            <p className="egs-read" aria-hidden="true">
              {PTOLEMY.map((s, i) => (matched.includes(i) ? s.sound : '·')).join(' ')}
            </p>
          </div>
          <section className="egr-panel" aria-labelledby="egs-ptolemy-title">
            <h2 id="egs-ptolemy-title">{ptolemyDone ? 'P-T-O-L-M-I-S: Ptolemy!' : 'Match each sign to a sound'}</h2>
            <p>The Greek text names King Ptolemy. Find his name in hieroglyphs: choose a sign in the cartouche, then the sound you think it makes.</p>
            <fieldset className="egr-choice">
              <legend>Sounds</legend>
              <div className="egr-options">
                {PTOLEMY_SOUNDS.map((snd) => {
                  const used = matched.some((i) => PTOLEMY[i].sound === snd);
                  return (
                    <button key={snd} type="button" className="egr-option egs-sound-button" disabled={used} onClick={() => pickSound(snd)}>
                      {snd}
                    </button>
                  );
                })}
              </div>
            </fieldset>
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
                const known = found.includes(i);
                const shown = known || revealed;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`egs-sign ${known ? 'is-done' : ''}`}
                    onClick={() => pickCleo(i)}
                    aria-label={shown && s.sound ? `Sign ${i + 1}: ${s.sound}` : `Sign ${i + 1}`}
                  >
                    <Glyphs text={glyph(s)} />
                    <span className="egs-sound" aria-hidden="true">{shown ? s.sound || '·' : '?'}</span>
                  </button>
                );
              })}
            </div>
            <p className="egs-read" aria-hidden="true">
              {CLEOPATRA.slice(0, NAME_SIGNS)
                .map((s, i) => (revealed || found.includes(i) ? s.sound : '·'))
                .join(' ')}
            </p>
          </div>
          <section className="egr-panel" aria-labelledby="egs-cleo-title">
            <h2 id="egs-cleo-title">{revealed ? 'K-L-E-O-P-A-T-R-A' : 'Which signs do you already know?'}</h2>
            <p>This cartouche names Queen Cleopatra. Some of its signs are in Ptolemy’s name too. Tap every sign you already know.</p>
            <p className="egr-label">
              {found.length} of {SHARED.length} found
            </p>
            {cleoDone && <FactNote fact={ROSETTA_NOTES.cleopatra} className="egr-fact" />}
            <div className="egr-actions">
              <button type="button" className="egr-button" aria-pressed={revealed} onClick={() => setRevealed((r) => !r)} disabled={!cleoDone}>
                {revealed ? 'Hide the new sounds' : 'Show the new sounds'}
              </button>
              {cleoDone && (
                <button type="button" className="egr-button egr-button-primary" onClick={() => choose('eureka')}>
                  The breakthrough <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {part === 'eureka' && (
        <div id="egs-panel-eureka" role="tabpanel" aria-labelledby="egs-tab-eureka" className="egr-layout">
          <div className="egr-scene egs-board egs-eureka" aria-hidden="true">
            <span className="egs-big">
              <Glyphs text={PTOLEMY.map(glyph).join('')} />
            </span>
            <span className="egs-big">
              <Glyphs text={CLEOPATRA.map(glyph).join('')} />
            </span>
          </div>
          <section className="egr-panel">
            <h2>“Look, I’ve got it!”</h2>
            <FactNote fact={ROSETTA_NOTES.eureka} className="egr-fact" />
            <FactNote fact={ROSETTA_NOTES.young} className="egr-fact" />
          </section>
        </div>
      )}

      <p className="egr-credit egs-credit">
        <a href={STONE_CREDIT.href} target="_blank" rel="noopener noreferrer">
          Rosetta Stone
        </a>{' '}
        photograph by Hans Hillewaert,{' '}
        <a href={STONE_CREDIT.licence} target="_blank" rel="noopener noreferrer">
          CC BY-SA 4.0
        </a>
        , via Wikimedia Commons; the close-ups are cropped from it. Hieroglyphs set in Noto Sans Egyptian Hieroglyphs (SIL Open Font License).
      </p>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
