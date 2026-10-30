'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import { PROMPT_KINDS, PROMPT_LABELS, PROMPT_MAX, promptWords, type BoardPrompt, type PromptKind } from '@/lib/classBoard';
import { STATION_TEXT } from './stationText';
import { wordsUsed } from './challenges';
import type { ClassBoardState } from './useClassBoard';

/*
 * The teacher's prompt: set on the class board, shown on both machines.
 *
 * PromptPanel is the board's: the prompt as it stands, and (in one sitting,
 * or with the teacher key on a saved board) the form to set, change or
 * clear it. PromptLine is the machines': the prompt over the typewriter or
 * the iMac, a word list's words ticked off as the page uses them.
 */

const P = STATION_TEXT.prompt;

export function PromptLine({ prompt, typed }: { prompt: BoardPrompt; typed: string }) {
  const words = prompt.kind === 'words' ? wordsUsed(prompt.text, typed) : [];
  const n = words.filter((w) => w.used).length;
  return (
    <p className="wrs-line wrs-prompt" data-kind={prompt.kind}>
      <span className="wrs-line-label">{PROMPT_LABELS[prompt.kind]}</span>{' '}
      {prompt.kind === 'words' ? (
        <>
          {words.map((w) => (
            <span key={w.word} className={`wrs-chip ${w.used ? 'is-used' : ''}`}>
              {w.word}
              {w.used && (
                <>
                  <span className="wrs-chip-tick" aria-hidden="true"> ✓</span>
                  <span style={srOnly}> (used)</span>
                </>
              )}
            </span>
          ))}{' '}
          <span className="wrs-chip-count">{P.used(n, words.length)}</span>
        </>
      ) : (
        prompt.text
      )}
    </p>
  );
}

export default function PromptPanel({ board, editing, setEditing }: { board: ClassBoardState; editing: boolean; setEditing: (on: boolean) => void }) {
  const { prompt, canSetPrompt, mode } = board;
  const [kind, setKind] = useState<PromptKind>(prompt?.kind ?? 'topic');
  const [text, setText] = useState(prompt?.text ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const ids = useId();

  // The form opens on the prompt as it stands (a refresh mid-edit leaves what is being typed), with the field ready.
  const openForm = () => {
    setKind(prompt?.kind ?? 'topic');
    setText(prompt?.text ?? '');
    setError('');
    setEditing(true);
  };
  useEffect(() => {
    if (editing) requestAnimationFrame(() => field.current?.focus());
  }, [editing]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const refused = await board.setPrompt({ kind, text });
    setBusy(false);
    if (refused) return setError(refused);
    setEditing(false);
  };

  const clear = async () => {
    setBusy(true);
    const refused = await board.setPrompt(null);
    setBusy(false);
    setError(refused ?? '');
  };

  if (editing && canSetPrompt) {
    return (
      <form className="wrp wrp-form" onSubmit={submit} aria-labelledby={`${ids}-title`}>
        <p id={`${ids}-title`} className="wrb-label">{P.title}</p>
        <fieldset className="wrp-kinds">
          <legend className="wrp-sr">{P.kindLabel}</legend>
          {PROMPT_KINDS.map((k) => (
            <label key={k} className={`wrp-kind ${kind === k ? 'is-on' : ''}`}>
              <input type="radio" name={`${ids}-kind`} value={k} checked={kind === k} onChange={() => setKind(k)} />
              {PROMPT_LABELS[k]}
            </label>
          ))}
        </fieldset>
        <label htmlFor={`${ids}-text`} className="wrp-sr">{P.textLabel}</label>
        <textarea
          ref={field}
          id={`${ids}-text`}
          className="wrp-text"
          rows={kind === 'prompt' ? 2 : 1}
          maxLength={PROMPT_MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={P.placeholders[kind]}
          aria-describedby={`${ids}-help`}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditing(false);
          }}
        />
        <p id={`${ids}-help`} className="wrp-help">
          {kind === 'words' && text.trim() ? `${promptWords(text).length} ${promptWords(text).length === 1 ? 'word' : 'words'}. ` : kind === 'words' ? `${P.wordsHelp} ` : ''}
          {[...text].length} / {PROMPT_MAX}
        </p>
        <div className="wrp-actions">
          <button type="submit" className="wrs-button" disabled={busy}>{P.show}</button>
          <button type="button" className="wrs-button wrs-button-ghost" onClick={() => setEditing(false)}>{P.cancel}</button>
        </div>
        {error && <p className="wrp-error" role="alert">{error}</p>}
      </form>
    );
  }

  if (!prompt) {
    return canSetPrompt ? (
      <div className="wrp wrp-empty">
        <button type="button" className="wrs-button wrs-button-ghost" onClick={openForm}>{P.set}</button>
      </div>
    ) : null;
  }

  return (
    <section className="wrp wrp-shown" aria-labelledby={`${ids}-shown`}>
      <p id={`${ids}-shown`} className="wrb-label">{P.title}</p>
      <p className="wrp-current">
        <span className="wrs-line-label">{PROMPT_LABELS[prompt.kind]}</span> {prompt.text}
      </p>
      <p className="wrp-help">{!canSetPrompt ? P.keyNote : mode.kind === 'saved' ? P.savedNote : P.localNote}</p>
      {canSetPrompt && (
        <div className="wrp-actions">
          <button type="button" className="wrs-button" onClick={openForm}>{P.change}</button>
          <button type="button" className="wrs-button wrs-button-ghost" onClick={() => void clear()} disabled={busy}>{P.clear}</button>
        </div>
      )}
      {error && <p className="wrp-error" role="alert">{error}</p>}
    </section>
  );
}
