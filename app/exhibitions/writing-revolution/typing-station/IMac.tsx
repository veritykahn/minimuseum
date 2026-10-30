'use client';

import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from 'react';
import { STATION_TEXT } from './stationText';
import type { SoundName } from './typingSound';

/*
 * The iMac, drawn: the translucent blue shell round its screen, and on the
 * screen a word processor's window in the manner of AppleWorks: a menu bar,
 * a striped title bar, a toolbar of fonts, sizes and styles, cut, copy,
 * paste and undo, and the page. Everything on the page can be changed after
 * it is typed, which is the whole difference from the typewriter.
 */

export const FONTS = [
  { name: 'Times', stack: "'Times New Roman', Times, serif" },
  { name: 'Helvetica', stack: 'Helvetica, Arial, sans-serif' },
  { name: 'Courier', stack: "'Courier Prime', 'Courier New', monospace" },
  { name: 'Palatino', stack: "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif" },
  { name: 'Antonio', stack: "'Antonio', 'Arial Narrow', sans-serif" },
];
const SIZES = [10, 12, 14, 18, 24];
/* The time, read only in the page's event handlers (the compiler can't tell they never run during render). */
const clock = () => Date.now();

/** Posts the page to the class board, in its font: null once it is up, or why it can't go. */
export type PostPage = (text: string, font: string) => string | null;

/** How the page is set: its font, size and styles. */
type Look = { font: string; size: number; bold: boolean; italic: boolean; underline: boolean };
const FIRST_LOOK: Look = { font: FONTS[0].name, size: 14, bold: false, italic: false, underline: false };

export default function IMac({ play, onPost, onText }: { play: (s: SoundName) => void; onPost?: PostPage; onText?: (text: string) => void }) {
  const [text, setPageText] = useState('');
  const onTextRef = useRef(onText);
  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);
  /** The page's words as they now are, kept and told (for the race and the word list). */
  const setText = (next: string) => {
    setPageText(next);
    onTextRef.current?.(next);
  };
  const [look, setLook] = useState<Look>(FIRST_LOOK);
  const { font, size, bold, italic, underline } = look;
  const [clip, setClip] = useState('');
  const [message, setMessage] = useState('');
  /* The last thing said, shown for a moment in the window's status bar, where a word processor says it. */
  const [shown, setShown] = useState('');
  const shownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(shownTimer.current), []);
  const say = (text: string) => {
    setMessage(text);
    setShown(text);
    clearTimeout(shownTimer.current);
    shownTimer.current = setTimeout(() => setShown(''), 2600);
  };
  /* Every step Undo can take back: the words and how they were set, together. */
  const history = useRef<{ text: string; look: Look }[]>([]);
  const area = useRef<HTMLTextAreaElement>(null);

  const lastTyped = useRef(0);

  const commit = (next: string, caret?: number, typing = false) => {
    // Typing keeps one undo step per pause, as a word processor does; every cut or paste is its own.
    const now = clock();
    if (!typing || now - lastTyped.current > 900) remember();
    lastTyped.current = typing ? now : 0;
    setText(next);
    if (caret !== undefined) {
      requestAnimationFrame(() => {
        area.current?.focus();
        area.current?.setSelectionRange(caret, caret);
      });
    }
  };

  const remember = () => {
    history.current = [...history.current.slice(-99), { text, look }];
  };
  // A font, a size or a style is a step of its own, as in a word processor's Undo.
  const restyle = (change: Partial<Look>) => {
    remember();
    lastTyped.current = 0;
    setLook((l) => ({ ...l, ...change }));
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => commit(e.target.value, undefined, true);
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.metaKey && !e.ctrlKey) play('key');
  };

  const selection = () => {
    const el = area.current;
    return el ? { from: el.selectionStart, to: el.selectionEnd } : { from: text.length, to: text.length };
  };

  const copy = (cut: boolean) => {
    const { from, to } = selection();
    if (from === to) return say('Select some words first.');
    const picked = text.slice(from, to);
    setClip(picked);
    void navigator.clipboard?.writeText(picked).catch(() => {});
    if (cut) commit(text.slice(0, from) + text.slice(to), from);
    say(cut ? 'Cut.' : 'Copied.');
  };

  const paste = () => {
    if (!clip) return say('Nothing to paste yet: cut or copy first.');
    const { from, to } = selection();
    commit(text.slice(0, from) + clip + text.slice(to), from + clip.length);
    say('Pasted.');
  };

  const undo = () => {
    const prev = history.current.pop();
    if (prev === undefined) return say('Nothing to undo.');
    setText(prev.text);
    setLook(prev.look);
    lastTyped.current = 0;
    say('Undone.');
  };

  // The page goes up on the board in its font, and a new document opens.
  const postPage = () => {
    if (!onPost) return;
    const refused = onPost(text, font);
    if (refused) return say(refused);
    history.current = [];
    setText('');
  };

  const stack = FONTS.find((f) => f.name === font)!.stack;
  const pageStyle: CSSProperties = {
    fontFamily: stack,
    fontSize: `${size}px`,
    fontWeight: bold ? 700 : 400,
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
  };
  // The toolbar keeps the page's selection: pressing a button does not take the focus from it.
  const keep = (e: { preventDefault: () => void }) => e.preventDefault();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="wri">
      <div className="wri-shell">
        <div className="wri-bezel">
          <div className="wri-screen">
            <div className="wri-menubar" aria-hidden="true">
              <span className="wri-menu-mark" />
              <span>File</span>
              <span>Edit</span>
              <span>Format</span>
              <span>Font</span>
              <span>Size</span>
              <span className="wri-app">AppleWorks</span>
            </div>
            <div className="wri-window">
              <div className="wri-titlebar" aria-hidden="true">
                <span className="wri-close" />
                <span className="wri-doc-title">Untitled 1 (WP)</span>
              </div>
              <div className="wri-toolbar" role="toolbar" aria-label="Word processor">
                <label className="wri-select">
                  <span className="wri-sr">Font</span>
                  <select value={font} onChange={(e) => restyle({ font: e.target.value })}>
                    {FONTS.map((f) => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </label>
                <label className="wri-select wri-select-size">
                  <span className="wri-sr">Size</span>
                  <select value={size} onChange={(e) => restyle({ size: Number(e.target.value) })}>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s} pt</option>
                    ))}
                  </select>
                </label>
                <span className="wri-sep" aria-hidden="true" />
                <button type="button" className="wri-tool wri-b" aria-pressed={bold} aria-label="Bold" onMouseDown={keep} onClick={() => restyle({ bold: !bold })}>B</button>
                <button type="button" className="wri-tool wri-i" aria-pressed={italic} aria-label="Italic" onMouseDown={keep} onClick={() => restyle({ italic: !italic })}>I</button>
                <button type="button" className="wri-tool wri-u" aria-pressed={underline} aria-label="Underline" onMouseDown={keep} onClick={() => restyle({ underline: !underline })}>U</button>
                <span className="wri-sep" aria-hidden="true" />
                <button type="button" className="wri-tool wri-word" onMouseDown={keep} onClick={() => copy(true)}>Cut</button>
                <button type="button" className="wri-tool wri-word" onMouseDown={keep} onClick={() => copy(false)}>Copy</button>
                <button type="button" className="wri-tool wri-word" onMouseDown={keep} onClick={paste}>Paste</button>
                <button type="button" className="wri-tool wri-word" onMouseDown={keep} onClick={undo}>Undo</button>
              </div>
              <div className="wri-ruler" aria-hidden="true" />
              <div className="wri-page">
                <textarea
                  ref={area}
                  className="wri-text"
                  value={text}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  style={pageStyle}
                  placeholder={STATION_TEXT.imacHint}
                  aria-label={`${STATION_TEXT.imacName}: the page`}
                  spellCheck={false}
                />
              </div>
              <div className={`wri-status ${shown ? 'is-saying' : ''}`} aria-hidden="true">
                {shown || `${words} ${words === 1 ? 'word' : 'words'} · ${font} ${size}`}
              </div>
            </div>
          </div>
        </div>
        <div className="wri-chin" aria-hidden="true">
          <span className="wri-grille" />
          <span className="wri-power" />
        </div>
      </div>
      <div className="wri-foot-stand" aria-hidden="true" />
      <div className="wri-foot">
        <p className="wri-name">{STATION_TEXT.imacName}</p>
        {onPost && (
          <button type="button" className="wrs-button wrs-button-post" onClick={postPage} disabled={!text.trim()}>
            {STATION_TEXT.post}
          </button>
        )}
      </div>
      <p role="status" className="wri-sr">{message}</p>
    </div>
  );
}
