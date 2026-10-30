'use client';

import { useCallback, useMemo, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader } from '../RoomShell';
import PrintSheet from '../PrintSheet';
import { EES_CARTOUCHE, BM_SYMBOLS, GLYPHS } from '../rooms';
import Cartouche from './Cartouche';
import { CHART, MAX_LETTERS, NAME_NOTES, SIGNS, readOut, spell } from './alphabet';
import './name.css';

/*
 * Your Name in Hieroglyphs: type a name and it is spelled sign by sign in a
 * cartouche, across or down, with each letter's sign listed beneath it and
 * the whole chart to look through. It prints on one Letter page. The room
 * says plainly that this is a modern sound-alike (alphabet.ts, NAME_NOTES).
 * Nothing typed is stored or sent.
 */

export default function HieroglyphName() {
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [printing, setPrinting] = useState(false);
  const spelled = useMemo(() => spell(name), [name]);
  const shown = name.trim() ? name.trim() : '';
  const label = spelled.length
    ? `The name ${shown} in hieroglyphs, inside a cartouche, ${direction === 'across' ? 'read left to right' : 'read top to bottom'}: ${readOut(spelled)}`
    : 'An empty cartouche, waiting for a name';
  const done = useCallback(() => setPrinting(false), []);

  return (
    <RoomShell className="eg-name">
      <RoomHeader kicker="Interactive · The scribe’s chart" title="Your Name in Hieroglyphs">
        <p className="egr-lede">Type your name and watch it appear, sign by sign, inside a cartouche. Then print it.</p>
      </RoomHeader>

      <div className="egr-layout">
        <div className="egr-scene egn-wall" data-direction={direction}>
          <Cartouche className="egn-cartouche" spelled={spelled} direction={direction} label={label} />
          {spelled.length > 0 && (
            <ol className="egn-key" aria-label="Each letter and its sign">
              {spelled.map((s, i) => (
                <li key={i}>
                  <Glyphs text={s.glyphs} className="egn-key-glyph" />
                  <span className="egn-key-letter">{s.letters}</span>
                </li>
              ))}
            </ol>
          )}
          {!spelled.length && <p className="egn-empty">Your name will appear here.</p>}
        </div>

        <section className="egr-panel" aria-label="Write your name">
          <label className="egr-field">
            <span className="egr-label">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          </div>

          <FactNote fact={NAME_NOTES.chart} className="egr-fact" />
          <FactNote fact={NAME_NOTES.modern} className="egr-fact" />
          <FactNote fact={NAME_NOTES.cartouche} className="egr-fact" />
          <FactNote fact={NAME_NOTES.line} className="egr-fact" />

          <details className="egn-chart">
            <summary>See every sign in the chart</summary>
            <ul className="egn-chart-grid">
              {CHART.map((letter) => (
                <li key={letter}>
                  <Glyphs text={SIGNS[letter].map((c) => GLYPHS[c]).join('')} className="egn-chart-glyph" />
                  <span>{letter}</span>
                </li>
              ))}
            </ul>
          </details>
          <p className="egr-credit">Hieroglyphs set in Noto Sans Egyptian Hieroglyphs (SIL Open Font License). Nothing you type is stored or sent.</p>
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
