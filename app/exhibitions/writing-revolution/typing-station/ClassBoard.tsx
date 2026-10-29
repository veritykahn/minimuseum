'use client';

import { useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { BOARD_MAX, formatCode, type BoardMessage } from '@/lib/classBoard';
import { inkJitter } from './typewriterPage';
import { FONTS } from './IMac';
import { STATION_TEXT } from './stationText';
import type { ClassBoardState } from './useClassBoard';

/*
 * The class board: every message posted from the typewriter or the iMac,
 * pinned up as the machine typed it. A typewriter's message is a slip of
 * paper in ink that sits a little off true; an iMac's is a printout in the
 * font it was set in. Messages are text only: React sets them as text, never
 * as markup, and the API has already stripped any HTML.
 *
 * "Print the board" prints the messages alone (typing.css hides the rest).
 * Saving with a class code is for teachers; without the store (in
 * development) the board says so and works for the sitting.
 */

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

const T = STATION_TEXT.board;

/**
 * A typed message cut into its words (each letter with its place in the
 * message, for its ink) and the spaces and line breaks between them.
 */
export function inkWords(text: string): (string | { ch: string; k: number }[])[] {
  const out: (string | { ch: string; k: number }[])[] = [];
  [...text].forEach((ch, k) => {
    const last = out[out.length - 1];
    if (ch === ' ' || ch === '\n') out.push(ch);
    else if (Array.isArray(last)) last.push({ ch, k });
    else out.push([{ ch, k }]);
  });
  return out;
}

function Card({ m, i, canDelete, onDelete }: { m: BoardMessage; i: number; canDelete: boolean; onDelete: () => void }) {
  const tilt = ((i * 37) % 7) - 3;
  const first = m.text.split(/\s+/).slice(0, 5).join(' ');
  const machine = m.machine === 'imac' ? STATION_TEXT.imacTab : STATION_TEXT.typewriterTab;
  return (
    <li className={`wrb-card wrb-card-${m.machine}`} style={{ '--tilt': `${tilt * 0.4}deg` } as CssVars}>
      {m.machine === 'imac' ? (
        <>
          <span className="wrb-card-head" aria-hidden="true">{m.font ?? 'Times'}</span>
          <p className="wrb-card-text" style={{ fontFamily: FONTS.find((f) => f.name === m.font)?.stack ?? FONTS[0].stack }}>
            {m.text}
          </p>
        </>
      ) : (
        <p className="wrb-card-text">
          {inkWords(m.text).map((part, w) =>
            typeof part === 'string' ? (
              part
            ) : (
              // A word's letters stay together on a line: each is its own box, so the line would otherwise break inside a word.
              <span key={w} className="wrb-word">
                {part.map(({ ch, k }) => {
                  const j = inkJitter(i, k, 0);
                  return (
                    <span key={k} className="wrb-ink" style={{ '--dy': `${j.dy}em`, '--rot': `${j.rot * 0.6}deg`, '--ink': j.ink } as CssVars}>
                      {ch}
                    </span>
                  );
                })}
              </span>
            ),
          )}
        </p>
      )}
      <span style={srOnly}>Typed on the {machine}.</span>
      {canDelete && (
        <button type="button" className="wrb-delete" onClick={onDelete} aria-label={`Delete the message “${first}”`}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </li>
  );
}

export default function ClassBoard({ board, onWrite }: { board: ClassBoardState; onWrite: (tab: 'typewriter' | 'imac') => void }) {
  const { messages, mode, available } = board;
  const [opening, setOpening] = useState(false);
  const [code, setCode] = useState('');
  const [keyEntry, setKeyEntry] = useState(false);
  const [keyText, setKeyText] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState('');
  const codeField = useRef<HTMLInputElement>(null);
  const ids = useId();
  const saved = mode.kind === 'saved' ? mode : null;
  const canDelete = !saved || !!saved.teacherKey;

  const copy = (text: string, what: string) => {
    void navigator.clipboard?.writeText(text).then(
      () => setCopied(`${what} copied.`),
      () => setCopied(`Select the ${what.toLowerCase()} to copy it.`),
    );
  };

  const onOpen = async (e: FormEvent) => {
    e.preventDefault();
    if (await board.open(code)) {
      setOpening(false);
      setCode('');
    }
  };
  const onKey = (e: FormEvent) => {
    e.preventDefault();
    board.setTeacherKey(keyText);
    setKeyEntry(false);
    setKeyText('');
  };
  const link = saved && typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?board=${saved.code}#board` : '';

  return (
    <div className="wrb">
      <div className="wrb-tools">
        <div className="wrb-group" role="group" aria-label={T.writeOn}>
          <span className="wrb-label" aria-hidden="true">{T.writeOn}</span>
          <button type="button" className="wrs-button" onClick={() => onWrite('typewriter')}>{STATION_TEXT.typewriterTab}</button>
          <button type="button" className="wrs-button" onClick={() => onWrite('imac')}>{STATION_TEXT.imacTab}</button>
        </div>
        <button type="button" className="wrs-button" onClick={() => window.print()} disabled={messages.length === 0}>
          {T.print}
        </button>
        {saved ? (
          <div className="wrb-group">
            <span className="wrb-code" aria-label={`Class code ${[...saved.code].join(' ')}`}>{formatCode(saved.code)}</span>
            <button type="button" className="wrs-button wrs-button-ghost" onClick={() => copy(link, 'Link')}>{T.copyLink}</button>
            <button type="button" className="wrs-button wrs-button-ghost" onClick={() => void board.refresh()}>{T.refresh}</button>
            {!saved.teacherKey && !keyEntry && (
              <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setKeyEntry(true)}>{T.haveKey}</button>
            )}
            <button type="button" className="wrs-button wrs-button-ghost" onClick={board.leave}>{T.leave}</button>
          </div>
        ) : (
          <div className="wrb-group">
            <button type="button" className="wrs-button" onClick={() => void board.save()} disabled={!available || board.busy}>
              {T.save}
            </button>
            {!opening ? (
              <button
                type="button"
                className="wrs-button wrs-button-ghost"
                disabled={!available}
                onClick={() => {
                  setOpening(true);
                  requestAnimationFrame(() => codeField.current?.focus());
                }}
              >
                {T.open}
              </button>
            ) : (
              <form className="wrb-form" onSubmit={onOpen}>
                <label htmlFor={`${ids}-code`} style={srOnly}>{T.codeLabel}</label>
                <input ref={codeField} id={`${ids}-code`} className="wrb-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="K7M3-QX9P" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={12} />
                <button type="submit" className="wrs-button" disabled={board.busy}>{T.openGo}</button>
                <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setOpening(false)}>{T.cancel}</button>
              </form>
            )}
          </div>
        )}
      </div>

      {keyEntry && saved && (
        <form className="wrb-form wrb-keyform" onSubmit={onKey}>
          <label htmlFor={`${ids}-key`} className="wrb-label">{T.keyLabel}</label>
          <input id={`${ids}-key`} className="wrb-input wrb-input-key" value={keyText} onChange={(e) => setKeyText(e.target.value)} autoComplete="off" spellCheck={false} />
          <button type="submit" className="wrs-button">{T.keyGo}</button>
          <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setKeyEntry(false)}>{T.cancel}</button>
        </form>
      )}

      {board.newKey && saved && (
        <section className="wrb-newkey" aria-labelledby={`${ids}-newkey`}>
          <h2 id={`${ids}-newkey`} className="wrb-newkey-title">{T.newKeyTitle}</h2>
          <p>
            {T.codeIs} <strong>{formatCode(saved.code)}</strong>. {T.newKeyBody}
          </p>
          <p className="wrb-newkey-row">
            <code className="wrb-key">{board.newKey}</code>
            <button type="button" className="wrs-button" onClick={() => copy(board.newKey!, 'Teacher key')}>{T.copyKey}</button>
            <button type="button" className="wrs-button wrs-button-ghost" onClick={board.dismissKey}>{T.done}</button>
          </p>
        </section>
      )}

      <p className="wrb-note">
        {saved ? T.savedNote(formatCode(saved.code)) : available === false ? T.unavailableNote : T.localNote} {T.privacy}
      </p>

      <div className="wrb-sheet" tabIndex={0} aria-label={`${T.title}: ${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}>
        <p className="wrb-print-head" aria-hidden="true">
          {STATION_TEXT.title} · {T.title}
          {saved && <> · {formatCode(saved.code)}</>}
        </p>
        {messages.length === 0 ? (
          <p className="wrb-empty">{T.empty}</p>
        ) : (
          <ul className="wrb-cards">
            {messages.map((m, i) => (
              <Card key={m.id} m={m} i={i} canDelete={canDelete} onDelete={() => void board.remove(m.id)} />
            ))}
          </ul>
        )}
      </div>

      <div className="wrb-foot">
        <span className="wrb-count">
          {messages.length} / {BOARD_MAX}
        </span>
        <p role="status" className="wrb-status">
          {board.status} {copied}
        </p>
        {messages.length > 0 && canDelete && (
          confirming ? (
            <span className="wrb-group">
              <span className="wrb-label">{saved ? T.confirmDelete : T.confirmClear}</span>
              <button
                type="button"
                className="wrs-button"
                onClick={() => {
                  setConfirming(false);
                  void board.removeBoard();
                }}
              >
                {T.yes}
              </button>
              <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setConfirming(false)}>{T.no}</button>
            </span>
          ) : (
            <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setConfirming(true)}>
              {saved ? T.deleteBoard : T.clear}
            </button>
          )
        )}
      </div>

    </div>
  );
}
