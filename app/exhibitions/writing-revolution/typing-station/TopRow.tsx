'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { MESSAGE_MAX } from '@/lib/classBoard';
import { ROWS, STATION_TEXT, rowCheck, type RowName } from './stationText';
import { TEN, TEN_WORD, beatTen, beatsTen, longestWordsMessage } from './challenges';
import type { SoundName } from './typingSound';

/*
 * The top row: the poster says "typewriter" is one of the longest words you
 * can type using only the top row. Try words on the top row (or the bottom
 * one): the row's round keys light as a word uses them, and any letter off
 * the row is named. Only the letters are checked.
 *
 * "Beat ten": "typewriter" has ten letters, and a meter of ten keys fills as
 * a top-row word grows. Keep another word of ten letters or more and the
 * station celebrates. The kept words make a "longest words" list, which can
 * go up on the class board, and the class checks them in a dictionary.
 */

type Kept = { word: string; row: RowName };

/** What the station says as a word is kept. */
function keptNote(word: string, row: RowName): { text: string; win: boolean } {
  if (row !== 'top') return { text: `Kept: ${word.toUpperCase()}, ${word.length} ${word.length === 1 ? 'letter' : 'letters'}.`, win: false };
  const r = beatTen(word);
  if (r.kind === 'poster') return { text: `That’s the poster’s word, ten letters. Can you find another?`, win: false };
  if (r.kind === 'short') return { text: `Kept: ${word.toUpperCase()}. ${r.toGo} more ${r.toGo === 1 ? 'letter' : 'letters'} would make ten.`, win: false };
  if (r.kind === 'ten') return { text: `You beat ten! ${word.toUpperCase()} has ten letters, as many as “${TEN_WORD}”.`, win: true };
  return { text: `You beat ten! ${word.toUpperCase()} has ${word.length} letters, longer than “${TEN_WORD}”.`, win: true };
}

export default function TopRow({ play, onPost }: { play: (s: SoundName) => void; onPost?: (text: string) => string | null }) {
  const [row, setRow] = useState<RowName>('top');
  const [word, setWord] = useState('');
  const [kept, setKept] = useState<Kept[]>([]);
  /** The note on the last word kept; a win is celebrated. */
  const [note, setNote] = useState<{ text: string; win: boolean; n: number } | null>(null);
  const [posted, setPosted] = useState('');
  const winTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(winTimer.current), []);
  const check = rowCheck(word, row);
  const used = new Set(check.letters);
  const rowName = row === 'top' ? 'top row' : 'bottom row';
  const n = check.letters.length;
  const shownNote = word ? null : note;

  const verdict = !check.letters
    ? `Type a word using only the ${rowName}.`
    : check.ok
      ? `Every letter is on the ${rowName}: ${n} ${n === 1 ? 'letter' : 'letters'}.`
      : `Not on the ${rowName}: ${check.off.map((c) => c.toUpperCase()).join(', ')}.`;

  const keep = (e: FormEvent) => {
    e.preventDefault();
    if (!check.ok) return;
    const w = check.letters;
    const fresh = !kept.some((k) => k.word === w && k.row === row);
    setKept((k) => (fresh ? [...k, { word: w, row }].sort((a, b) => b.word.length - a.word.length) : k));
    const said = keptNote(w, row);
    setNote({ ...said, n: (note?.n ?? 0) + 1 });
    setPosted('');
    if (said.win) {
      play('bell');
      clearTimeout(winTimer.current);
      winTimer.current = setTimeout(() => setNote((x) => (x && x.win ? { ...x, win: false } : x)), 4000);
    }
    setWord('');
  };

  const tap = (ch: string) => {
    setWord((w) => w + ch);
    play('clack');
  };

  const postList = () => {
    if (!onPost) return;
    const refused = onPost(longestWordsMessage(kept, MESSAGE_MAX));
    setPosted(refused ?? '');
  };

  // The meter: ten keys for "typewriter", lit as a top-row word's letters fill them; past ten, the extra show gold.
  const meter = row === 'top' && (
    <div className={`wrq-ten ${check.ok && n >= TEN ? 'is-full' : ''}`} aria-hidden="true">
      {Array.from({ length: Math.max(TEN, check.ok ? n : 0) }, (_, i) => (
        <span key={i} className={`wrq-ten-cell ${check.ok && i < n ? 'is-lit' : ''} ${i >= TEN ? 'is-extra' : ''}`} />
      ))}
      <span className="wrq-ten-count">
        {check.ok ? Math.min(n, 99) : 0} / {TEN}
      </span>
    </div>
  );

  return (
    <div className="wrq" data-row={row}>
      <blockquote className="wrq-quote">{STATION_TEXT.topRowSentence}</blockquote>

      <div className="wrq-head">
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
                setNote(null);
              }}
            >
              {r === 'top' ? 'Top row' : 'Bottom row'}
            </button>
          ))}
        </div>
        {row === 'top' && <p className="wrq-goal">{STATION_TEXT.beatTen.goal}</p>}
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
        {/* Once a word is kept, what the station says about it stands where the verdict was, under the eyes, until the next word begins. */}
        <p id="wrq-verdict" className={`wrq-verdict ${shownNote ? 'wrq-note' : ''} ${shownNote?.win ? 'is-win' : ''}`} role="status" data-ok={check.ok}>
          {shownNote?.win && (
            <span className="wrq-burst" key={shownNote.n} aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties} />
              ))}
            </span>
          )}
          {shownNote ? shownNote.text : verdict}
        </p>
        <div className="wrq-actions">
          <button type="submit" className="wrs-button" disabled={!check.ok}>
            Keep it
          </button>
          {row === 'top' && (
            <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setWord(TEN_WORD)}>
              Try “{TEN_WORD}”
            </button>
          )}
          {meter}
        </div>
      </form>

      {kept.length > 0 && (
        <div className="wrq-kept">
          <p className="wrq-label">{STATION_TEXT.beatTen.listTitle}</p>
          <ul>
            {kept.map((k) => {
              const win = k.row === 'top' && beatsTen(beatTen(k.word));
              return (
                <li key={`${k.row}-${k.word}`} className={win ? 'is-win' : ''}>
                  {k.word.toUpperCase()} <span>{k.word.length}</span>
                  {k.row === 'bottom' && <span className="wrq-kept-row">bottom row</span>}
                  {win && <span style={srOnly}> (beats ten)</span>}
                </li>
              );
            })}
          </ul>
          <p className="wrq-dictionary">{STATION_TEXT.beatTen.dictionary}</p>
          {onPost && (
            <div className="wrq-actions">
              <button type="button" className="wrs-button wrs-button-post" onClick={postList}>
                {STATION_TEXT.beatTen.post}
              </button>
              {posted && <span className="wrq-posted">{posted}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
