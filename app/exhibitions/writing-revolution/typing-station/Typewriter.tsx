'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { BELL_BEFORE, LINE_WIDTH, inkJitter, newPage, pageText, strikeOvers, typeKey, type Effect, type Page } from './typewriterPage';
import { STATION_TEXT } from './stationText';
import type { SoundName } from './typingSound';

/*
 * The typewriter, drawn: the sheet in the carriage above the platen, the
 * typebars fanned in their basket, and four rows of keys. The carriage runs
 * left as each key strikes and slides back on Return, the sheet feeding up
 * a line. Keys typed on a keyboard, tapped on the drawn keys or typed on a
 * phone's own keyboard (tap the sheet) all strike the same way.
 */

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

const KEY_ROWS = ['1234567890-', 'qwertyuiop', 'asdfghjkl;', "zxcvbnm,./"];
const TYPEBARS = 30;
/* A phone's keyboard types into this hidden field; it is kept holding these two characters so Back space always has something to delete. */
const SENTINEL = '  ';

/** Posts the sheet to the class board: null once it is up, or why it can't go. */
export type PostSheet = (text: string) => string | null;

export default function Typewriter({ play, onPost }: { play: (s: SoundName) => void; onPost?: PostSheet }) {
  const [page, setPage] = useState<Page>(newPage);
  const [shift, setShift] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [returning, setReturning] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const pageRef = useRef(page);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(pressTimer.current), []);

  const press = useCallback(
    (key: string) => {
      const { page: next, effects } = typeKey(pageRef.current, key);
      pageRef.current = next;
      setPage(next);
      const sound: Record<Effect, SoundName> = { strike: 'clack', locked: 'clack', space: 'space', bell: 'bell', back: 'back', return: 'ret' };
      effects.forEach((e) => play(sound[e]));
      if (effects.includes('bell')) setMessage(`Ding: ${BELL_BEFORE} spaces left on the line.`);
      else if (effects.includes('locked')) setMessage('End of the line. Return the carriage.');
      else if (effects.includes('return')) setMessage('');
      if (effects.includes('return')) {
        setReturning(true);
        setTimeout(() => setReturning(false), 420);
      }
      const shown = key === 'Enter' ? 'return' : key === 'Backspace' ? 'back' : key === ' ' ? 'space' : key.toLowerCase();
      setPressed(shown);
      clearTimeout(pressTimer.current);
      pressTimer.current = setTimeout(() => setPressed(null), 110);
    },
    [play],
  );

  const tapKey = (k: string) => {
    if (k === 'shift') return setShift((s) => !s);
    press(shift && k.length === 1 ? k.toUpperCase() : k);
    if (k.length === 1) setShift(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Enter' || e.key === 'Backspace' || [...e.key].length === 1) {
      e.preventDefault();
      press(e.key);
    }
  };

  // A phone's keyboard sends no usable keys: read what it typed into the field, then reset it.
  const onInput = (e: FormEvent<HTMLTextAreaElement>) => {
    const v = e.currentTarget.value;
    if (v.length < SENTINEL.length) press('Backspace');
    else for (const ch of v.slice(SENTINEL.length)) press(ch === '\n' ? 'Enter' : ch);
    e.currentTarget.value = SENTINEL;
  };

  const newSheet = () => {
    pageRef.current = newPage();
    setPage(pageRef.current);
    setMessage('A new sheet is in.');
    play('ret');
  };

  // The sheet comes out of the carriage and goes up on the board; a fresh one goes in.
  const postSheet = () => {
    if (!onPost) return;
    const refused = onPost(pageText(pageRef.current));
    if (refused) return setMessage(refused);
    pageRef.current = newPage();
    setPage(pageRef.current);
    play('ret');
  };

  const col = Math.min(page.col, LINE_WIDTH);
  const fresh = page.strikes === 0 && page.line === 0 && page.col === 0;
  const style: CssVars = { '--col': col, '--line': page.line, '--width': LINE_WIDTH };

  return (
    <div className={`wrt ${returning ? 'is-returning' : ''}`} style={style}>
      <div className="wrt-window">
        <div className="wrt-carriage">
          <div className="wrt-paper" aria-hidden="true">
            {page.lines.map((cells, li) => (
              <div className="wrt-paper-line" key={li}>
                {cells.map((c, ci) => (
                  <span className="wrt-cell" key={ci}>
                    {[...c].map((ch, k) => {
                      const j = inkJitter(li, ci, k);
                      return (
                        <span key={k} className="wrt-ink" style={{ '--dy': `${j.dy}em`, '--rot': `${j.rot}deg`, '--ink': j.ink } as CssVars}>
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="wrt-platen" aria-hidden="true">
            <span className="wrt-knob wrt-knob-l" />
            <span className="wrt-roller" />
            <span className="wrt-knob wrt-knob-r" />
          </div>
        </div>
        {fresh && <p className="wrt-hint" aria-hidden="true">{STATION_TEXT.typewriterHint}</p>}
        <textarea
          ref={field}
          className="wrt-field"
          aria-label={`${STATION_TEXT.typewriterName}: type here. Return feeds a new line; Back space moves back to strike over.`}
          aria-describedby="wrt-page-text"
          defaultValue={SENTINEL}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          onKeyDown={onKeyDown}
          onInput={onInput}
        />
      </div>

      <button type="button" className="wrt-lever" onPointerDown={(e) => e.preventDefault()} onClick={() => press('Enter')} aria-label="Carriage return">
        <span aria-hidden="true" />
      </button>

      <div className="wrt-body">
        <svg className="wrt-basket" viewBox="0 0 400 110" aria-hidden="true">
          <path className="wrt-basket-bed" d="M10 110 A190 104 0 0 1 390 110 Z" />
          {Array.from({ length: TYPEBARS }, (_, i) => {
            const a = -80 + (160 * i) / (TYPEBARS - 1);
            const swing = page.strikes > 0 && (page.strikes * 7) % TYPEBARS === i;
            return (
              <g key={i} transform={`rotate(${a} 200 108)`}>
                <line key={swing ? `s${page.strikes}` : 'r'} className={`wrt-bar ${swing ? 'is-striking' : ''}`} x1="200" y1="22" x2="200" y2="100" />
              </g>
            );
          })}
          <path className="wrt-guide" d="M192 4 L200 18 L208 4" />
        </svg>
        <div className="wrt-keys" role="group" aria-label="Typewriter keys">
          {KEY_ROWS.map((row, r) => (
            <div className={`wrt-row wrt-row-${r}`} key={row}>
              {[...row].map((k) => (
                <button
                  key={k}
                  type="button"
                  tabIndex={-1}
                  className={`wrt-key ${pressed === k ? 'is-down' : ''}`}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => tapKey(k)}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          ))}
          <div className="wrt-row wrt-row-space">
            <button type="button" tabIndex={-1} className={`wrt-key wrt-key-wide ${shift ? 'is-locked' : ''}`} aria-pressed={shift} onPointerDown={(e) => e.preventDefault()} onClick={() => tapKey('shift')}>
              Shift
            </button>
            <button type="button" tabIndex={-1} className={`wrt-key wrt-space ${pressed === 'space' ? 'is-down' : ''}`} onPointerDown={(e) => e.preventDefault()} onClick={() => tapKey(' ')} aria-label="Space">
              <span aria-hidden="true" />
            </button>
            <button type="button" tabIndex={-1} className={`wrt-key wrt-key-wide ${pressed === 'back' ? 'is-down' : ''}`} onPointerDown={(e) => e.preventDefault()} onClick={() => tapKey('Backspace')}>
              Back space
            </button>
          </div>
        </div>
      </div>

      <div className="wrt-foot">
        <p className="wrt-name">{STATION_TEXT.typewriterName}</p>
        <p className="wrt-count" aria-hidden={fresh}>
          {strikeOvers(page) > 0 && <>Strike-overs: {strikeOvers(page)} · </>}
          Line {page.line + 1}, space {col + 1}
        </p>
        <button type="button" className="wrs-button" onClick={newSheet}>
          New sheet
        </button>
        {onPost && (
          <button type="button" className="wrs-button wrs-button-post" onClick={postSheet} disabled={fresh}>
            {STATION_TEXT.post}
          </button>
        )}
      </div>

      <p id="wrt-page-text" style={srOnly}>{pageText(page) || 'The sheet is blank.'}</p>
      <p role="status" style={srOnly}>{message}</p>
    </div>
  );
}
