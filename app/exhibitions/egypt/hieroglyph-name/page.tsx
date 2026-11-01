'use client';

import { useCallback, useMemo, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, TombDoor } from '../RoomShell';
import PrintSheet from '../PrintSheet';
import { EES_CARTOUCHE, BM_SYMBOLS, GLYPHS, SIGN_NAMES } from '../rooms';
import { useTomb } from '../tombState';
import Cartouche from './Cartouche';
import { CHART, MAX_LETTERS, NAME_NOTES, NAME_SOURCES, SIGNS, consonantsOnly, readOut, spell } from './alphabet';
import './name.css';

/*
 * Your Name in Hieroglyphs: type a name and it is spelled sign by sign in a
 * cartouche, across or down. Tap any sign to see what it is a picture of
 * (a horned viper, a mouth, a loaf of bread…), and compare it with the name
 * as an Egyptian scribe would more likely have written it, consonants only.
 * It prints on one Letter page, and it can be carved on the tomb's wall
 * (kept in this browser only). The room says plainly that this is a modern
 * sound-alike (alphabet.ts, NAME_NOTES). Nothing typed is sent anywhere.
 */

export default function HieroglyphName() {
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [printing, setPrinting] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [tomb, updateTomb] = useTomb();
  const spelled = useMemo(() => spell(name), [name]);
  const scribe = useMemo(() => consonantsOnly(spelled), [spelled]);
  const shown = name.trim() ? name.trim() : '';
  const label = spelled.length
    ? `The name ${shown} in hieroglyphs, inside a cartouche, ${direction === 'across' ? 'read left to right' : 'read top to bottom'}: ${readOut(spelled)}`
    : 'An empty cartouche, waiting for a name';
  const done = useCallback(() => setPrinting(false), []);
  const sign = picked !== null ? spelled[picked] : undefined;
  const carved = !!shown && tomb.cartouche === shown;

  const carve = () => {
    updateTomb((s) => ({ ...s, cartouche: shown, done: { ...s.done, name: true } }));
  };

  return (
    <RoomShell className="eg-name" sources={NAME_SOURCES}>
      <RoomHeader kicker="Interactive · The scribe’s chart" title="Your Name in Hieroglyphs">
        <p className="egr-lede">Type your name and watch it appear, sign by sign, inside a cartouche. Tap a sign to find out what it is a picture of.</p>
      </RoomHeader>

      <div className="egr-layout">
        <div className="egr-scene egn-wall" data-direction={direction}>
          <Cartouche className="egn-cartouche" spelled={spelled} direction={direction} label={label} />
          {spelled.length > 0 && (
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
          )}
          <p className="egn-what" aria-live="polite">
            {sign ? (
              <>
                <strong>{sign.letters}</strong> is {sign.codes.map((c) => SIGN_NAMES[c] ?? c).join(' and ')}.
              </>
            ) : spelled.length ? (
              'Tap a sign to see what it shows.'
            ) : (
              'Your name will appear here.'
            )}
          </p>
          {spelled.length > 0 && (
            <div className="egn-scribe">
              <p className="egr-label">How an Egyptian scribe might write it: consonants only</p>
              <Cartouche className="egn-cartouche egn-cartouche-small" spelled={scribe} direction="across" label={`Consonants only: ${readOut(scribe)}`} />
            </div>
          )}
        </div>

        <section className="egr-panel" aria-label="Write your name">
          <label className="egr-field">
            <span className="egr-label">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPicked(null);
              }}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              placeholder="Type a name"
            />
          </label>
          <p className="egn-hint">Up to {MAX_LETTERS} letters. “Ch” and “sh” each have a sign of their own.</p>

          <fieldset className="egr-choice">
            <legend>Write it</legend>
            <div className="egr-options">
              <button type="button" className="egr-option" aria-pressed={direction === 'across'} onClick={() => setDirection('across')}>
                Across
              </button>
              <button type="button" className="egr-option" aria-pressed={direction === 'down'} onClick={() => setDirection('down')}>
                Down
              </button>
            </div>
          </fieldset>

          <div className="egr-actions">
            <button type="button" className="egr-button egr-button-primary" disabled={!spelled.length} onClick={() => setPrinting(true)}>
              Print my cartouche
            </button>
            <button type="button" className="egr-button" disabled={!spelled.length || carved} onClick={carve}>
              {carved ? 'Carved in the tomb ✓' : 'Carve it in the tomb'}
            </button>
          </div>
          {carved && <TombDoor>See it in the tomb</TombDoor>}

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
          <p className="egr-credit">Nothing you type is sent anywhere. If you carve your name in the tomb, it is kept only in this browser.</p>
        </section>
      </div>

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
