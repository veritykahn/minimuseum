'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import Modal from '../Modal';
import PrintSheet from '../PrintSheet';
import { EES_CARTOUCHE, BM_SYMBOLS, GLYPHS, SIGN_NAMES } from '../rooms';
import { writeTomb } from '../tombState';
import Cartouche from './Cartouche';
import { CHART, MAX_LETTERS, NAME_NOTES, NAME_SOURCES, ROYAL_EXAMPLE, SIGNS, consonantsOnly, readOut, spell } from './alphabet';
import { saveCartouche } from './savedCartouche';
import './name.css';
import { playEgypt } from '../egyptSound';

/*
 * Your Name in Hieroglyphs. After the room's dark intro (DarkIntro), a
 * short, visual "What is a cartouche?": King Ptolemy's name from the
 * Rosetta Stone, the oval drawn round it, and three numbered marks (the
 * name, the oval, the line that ends it). Then the stone tablet, one
 * screen: (1) type a name at the top and it is spelled sign by sign in a
 * cartouche, across or down; (2) tap any sign to see what it is a picture of
 * (a horned viper, a mouth, a loaf of bread…), and compare the name as an
 * Egyptian scribe would more likely have written it, consonants only;
 * (3) keep it: print it on one Letter page, or save it in this browser
 * (savedCartouche.ts) for Build Your Own Tomb to place on a wall. The room
 * says plainly that this is a modern sound-alike (alphabet.ts, NAME_NOTES),
 * in its "How it works" card, with the whole chart. Nothing typed is sent
 * anywhere.
 */

const INTRO = [
  'In ancient Egypt, the names of kings and queens were written in hieroglyphs.',
  'Each royal name was ringed by an oval, called a cartouche.',
  'Today, you can write your own name the same way: sign by sign, like a scribe.',
];

export default function HieroglyphName() {
  const [intro, setIntro] = useState(true);
  const [phase, setPhase] = useState<'what' | 'make'>('what');
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [printing, setPrinting] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [how, setHow] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const spelled = useMemo(() => spell(name), [name]);
  const scribe = useMemo(() => consonantsOnly(spelled), [spelled]);
  const shown = name.trim() ? name.trim() : '';
  const label = spelled.length
    ? `The name ${shown} in hieroglyphs, inside a cartouche, ${direction === 'across' ? 'read left to right' : 'read top to bottom'}: ${readOut(spelled)}`
    : 'An empty cartouche, waiting for a name';
  const done = useCallback(() => setPrinting(false), []);
  const sign = picked !== null ? spelled[picked] : undefined;
  const isSaved = !!shown && saved === shown;

  // Each part's first thing to do takes the focus: the button on, then the name box.
  useEffect(() => {
    if (intro) return;
    if (phase === 'what') goRef.current?.focus({ preventScroll: true });
    else inputRef.current?.focus({ preventScroll: true });
  }, [intro, phase]);

  const save = () => {
    playEgypt('grind');
    saveCartouche(shown, spelled);
    writeTomb((s) => ({ ...s, cartouche: shown, done: { ...s.done, name: true } }));
    setSaved(shown);
  };

  return (
    <RoomShell className="eg-name" sources={NAME_SOURCES} fit>
      {intro && <DarkIntro title="Your Name in Hieroglyphs" lines={INTRO} voice="hieroglyph-name-intro" onDone={() => setIntro(false)} />}

      <RoomHeader kicker="Interactive · The scribe’s chart" title="Your Name in Hieroglyphs">
        {phase === 'make' && (
          <div className="egr-head-tools">
            <button type="button" className="egr-button egr-button-quiet" aria-haspopup="dialog" onClick={() => setHow(true)}>
              <span className="egr-q" aria-hidden="true">?</span>How it works
            </button>
            <button type="button" className="egr-button egr-button-quiet" onClick={() => setPhase('what')}>
              What is a cartouche?
            </button>
          </div>
        )}
      </RoomHeader>

      {phase === 'what' ? (
        <section className="egn-what-step egr-fill" aria-labelledby="egn-what-title">
          <h2 id="egn-what-title" className="egn-what-title">
            What is a cartouche?
          </h2>
          <div className="egn-explain">
            <div className="egn-explain-art">
              <Cartouche className="egn-explain-cartouche" spelled={ROYAL_EXAMPLE} direction="across" label="King Ptolemy’s name in hieroglyphs, inside a cartouche" />
              <span className="egn-pin" data-pin="1" aria-hidden="true">1</span>
              <span className="egn-pin" data-pin="2" aria-hidden="true">2</span>
              <span className="egn-pin" data-pin="3" aria-hidden="true">3</span>
            </div>
            <ol className="egn-callouts">
              <li>
                <span className="egn-num" aria-hidden="true">1</span>
                <span>
                  <strong>The name:</strong> a king’s or queen’s name, in hieroglyphs.
                </span>
              </li>
              <li>
                <span className="egn-num" aria-hidden="true">2</span>
                <span>
                  <strong>The cartouche:</strong> an oval drawn all the way round the name.
                </span>
              </li>
              <li>
                <span className="egn-num" aria-hidden="true">3</span>
                <span>
                  <strong>The line:</strong> it marks the end of the name.
                </span>
              </li>
            </ol>
          </div>
          <FactNote fact={NAME_NOTES.example} className="egr-fact egn-example" />
          <button ref={goRef} type="button" className="egr-button egr-button-primary egn-go" onClick={() => setPhase('make')}>
            Now write your name in one <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <section className="egn-tablet egr-fill" data-direction={direction} data-empty={!spelled.length || undefined} aria-label="Write your name">
          <div className="egn-type">
            <label className="egn-step-label" htmlFor="egn-name">
              <span className="egn-num" aria-hidden="true">1</span>
              <span>Your name</span>
            </label>
            <input
              id="egn-name"
              aria-describedby="egn-hint"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                // Each new letter: a sign cut into the stone.
                if (e.target.value.length > name.length) playEgypt('chisel');
                setName(e.target.value);
                setPicked(null);
              }}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              placeholder="Type your name here"
            />
            <span id="egn-hint" className="egn-hint">
              Up to {MAX_LETTERS} letters. “Ch” and “sh” each have a sign of their own.
            </span>
          </div>

          <div className="egn-wall">
            <Cartouche className="egn-cartouche" spelled={spelled} direction={direction} label={label} />

            <div className="egn-signs">
              {spelled.length > 0 ? (
                <>
                  <p className="egn-step-label">
                    <span className="egn-num" aria-hidden="true">2</span>
                    <span>Tap a sign to see what it shows</span>
                  </p>
                  <ol className="egn-key" aria-label="Each letter and its sign: tap one to see what it is">
                    {spelled.map((s, i) => (
                      <li key={i}>
                        <button type="button" className="egn-key-button" aria-pressed={picked === i} onClick={() => setPicked(picked === i ? null : i)} aria-label={`${s.letters}: ${s.codes.map((c) => SIGN_NAMES[c] ?? c).join(' and ')}`}>
                          <Glyphs text={s.glyphs} className="egn-key-glyph" />
                          <span className="egn-key-letter">{s.letters}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}
              <p className="egn-what" aria-live="polite">
                {sign ? (
                  <>
                    <strong>{sign.letters}</strong> is {sign.codes.map((c) => SIGN_NAMES[c] ?? c).join(' and ')}.
                  </>
                ) : spelled.length ? (
                  ''
                ) : (
                  'Type in the box above, and your name appears in the cartouche.'
                )}
              </p>
            </div>

            {spelled.length > 0 && (
              <div className="egn-scribe">
                <p className="egr-label">An Egyptian scribe would leave out the vowels:</p>
                <Cartouche className="egn-cartouche egn-cartouche-small" spelled={scribe} direction="across" label={`Consonants only: ${readOut(scribe)}`} />
              </div>
            )}
          </div>

          <div className="egn-tools">
            <span className="egn-step-label">
              <span className="egn-num" aria-hidden="true">3</span>
              <span>Keep it</span>
            </span>
            <div className="egr-options" role="group" aria-label="Write it">
              <button type="button" className="egr-option" aria-pressed={direction === 'across'} onClick={() => setDirection('across')}>
                Across
              </button>
              <button type="button" className="egr-option" aria-pressed={direction === 'down'} onClick={() => setDirection('down')}>
                Down
              </button>
            </div>
            <button type="button" className="egr-button egr-button-primary" disabled={!spelled.length} onClick={() => setPrinting(true)}>
              Print my cartouche
            </button>
            <button type="button" className="egr-button" disabled={!spelled.length || isSaved} onClick={save}>
              {isSaved ? 'Saved for my tomb ✓' : 'Save it for my tomb'}
            </button>
          </div>
          <p className="egr-credit egn-privacy">
            {isSaved ? 'Saved in this browser only, ready to place in Build Your Own Tomb.' : 'Nothing you type is sent anywhere. If you save it, it is kept only in this browser.'}
          </p>
        </section>
      )}

      <Modal open={how} onClose={() => setHow(false)} kicker="Your name in hieroglyphs" title="How it works">
        <FactNote fact={NAME_NOTES.chart} className="egr-fact" />
        <FactNote fact={NAME_NOTES.modern} className="egr-fact" />
        <FactNote fact={NAME_NOTES.scribe} className="egr-fact" />
        <FactNote fact={NAME_NOTES.cartouche} className="egr-fact" />
        <FactNote fact={NAME_NOTES.line} className="egr-fact" />
        <details className="egn-chart">
          <summary>See every sign in the chart</summary>
          <ul className="egn-chart-grid">
            {CHART.map((letter) => (
              <li key={letter} title={SIGNS[letter].map((c) => SIGN_NAMES[c] ?? c).join(' and ')}>
                <Glyphs text={SIGNS[letter].map((c) => GLYPHS[c]).join('')} className="egn-chart-glyph" />
                <span>{letter}</span>
                <span className="egn-chart-what">{SIGNS[letter].map((c) => SIGN_NAMES[c] ?? c).join(' + ')}</span>
              </li>
            ))}
          </ul>
        </details>
      </Modal>

      <p className="egr-status" role="status" aria-live="polite">
        {spelled.length ? `${spelled.length} ${spelled.length === 1 ? 'sign' : 'signs'}: ${readOut(spelled)}` : ''}
      </p>

      <PrintSheet printing={printing} onDone={done}>
        <div className="egn-print">
          <h1>{shown} in hieroglyphs</h1>
          <p>A modern sound-alike: one sign for each letter, from the Egypt Exploration Society’s chart.</p>
          <Cartouche className="egn-print-cartouche" spelled={spelled} direction="down" label="" ink="#1a1a1a" />
          <ol className="egn-print-key">
            {spelled.map((s, i) => (
              <li key={i}>
                <span className="egr-glyph">{s.glyphs}</span> {s.letters}
              </li>
            ))}
          </ol>
          <p className="egr-print-sources">
            <FactSources sources={[EES_CARTOUCHE, BM_SYMBOLS]} className="egn-print-source" /> · The Mini Museum, Ancient Egypt
          </p>
        </div>
      </PrintSheet>
    </RoomShell>
  );
}
