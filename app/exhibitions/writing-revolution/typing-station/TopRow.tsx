'use client';

import { useState, type FormEvent } from 'react';
import { ROWS, STATION_TEXT, rowCheck, type RowName } from './stationText';
import type { SoundName } from './typingSound';

/*
 * The top row: the poster says "typewriter" is one of the longest words you
 * can type using only the top row. Try words on the top row (or the bottom
 * one): the row's round keys light as a word uses them, and any letter off
 * the row is named. Only the letters are checked.
 */

export default function TopRow({ play }: { play: (s: SoundName) => void }) {
  const [row, setRow] = useState<RowName>('top');
  const [word, setWord] = useState('');
  const [kept, setKept] = useState<string[]>([]);
  const check = rowCheck(word, row);
  const used = new Set(check.letters);
  const rowName = row === 'top' ? 'top row' : 'bottom row';

  const verdict = !check.letters
    ? `Type a word using only the ${rowName}.`
    : check.ok
      ? `Every letter is on the ${rowName}: ${check.letters.length} ${check.letters.length === 1 ? 'letter' : 'letters'}.`
      : `Not on the ${rowName}: ${check.off.map((c) => c.toUpperCase()).join(', ')}.`;

  const keep = (e: FormEvent) => {
    e.preventDefault();
    if (!check.ok) return;
    setKept((k) => (k.includes(check.letters) ? k : [...k, check.letters].sort((a, b) => b.length - a.length)));
    setWord('');
  };

  const tap = (ch: string) => {
    setWord((w) => w + ch);
    play('clack');
  };

  return (
    <div className="wrq" data-row={row}>
      <blockquote className="wrq-quote">{STATION_TEXT.topRowSentence}</blockquote>

      <div className="wrq-rows" role="radiogroup" aria-label="Which row">
        {(['top', 'bottom'] as RowName[]).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={row === r}
            className="wrq-row-choice"
            onClick={() => {
              setRow(r);
              setWord('');
            }}
          >
            {r === 'top' ? 'Top row' : 'Bottom row'}
          </button>
        ))}
      </div>

      <div className="wrq-keys" role="group" aria-label={`The ${rowName}: tap to add a letter`}>
        {[...ROWS[row]].map((ch) => (
          <button key={ch} type="button" className={`wrq-key ${used.has(ch) ? 'is-used' : ''}`} onClick={() => tap(ch)} aria-label={ch.toUpperCase()}>
            <span aria-hidden="true">{ch.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <form className="wrq-form" onSubmit={keep}>
        <label className="wrq-label" htmlFor="wrq-word">Your word</label>
        <div className="wrq-input-row">
          <input
            id="wrq-word"
            className={`wrq-input ${check.letters && !check.ok ? 'is-off' : ''} ${check.ok ? 'is-ok' : ''}`}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="wrq-verdict"
          />
          <button type="button" className="wrq-small" onClick={() => setWord((w) => w.slice(0, -1))} aria-label="Delete a letter" disabled={!word}>
            <span aria-hidden="true">&#9003;</span>
          </button>
        </div>
        <p id="wrq-verdict" className="wrq-verdict" role="status" data-ok={check.ok}>
          {verdict}
        </p>
        <div className="wrq-actions">
          <button type="submit" className="wrs-button" disabled={!check.ok}>
            Keep it
          </button>
          {row === 'top' && (
            <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setWord('typewriter')}>
              Try “typewriter”
            </button>
          )}
        </div>
      </form>

      {kept.length > 0 && (
        <div className="wrq-kept">
          <p className="wrq-label">Your words</p>
          <ul>
            {kept.map((w) => (
              <li key={w}>
                {w.toUpperCase()} <span>{w.length}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
