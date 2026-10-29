'use client';

import { useEffect, useState } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { NOTES, POSTER, READ_WORDS, WORKSHOP_TEXT } from './inventionsText';
import { DIAL, NEEDLES, needleAngles, spell } from './workshop';

/*
 * The telegraph bench: a five-needle dial, its 20 letters set in a diamond
 * round the row of needles. Press a letter (each is a button) and its two
 * needles swing to point to it. Send a word, and the needles spell it
 * letter by letter; or read one: the needles point, and the visitor finds
 * the letter. The dial's letters are drawn after the 1837 dial; the
 * needles' pairs follow from where they cross (workshop.ts).
 */

const SPELL_MS = 1400;
const W = 6;
const H = 5.4;
const left = (x: number) => `${(x / W) * 100}%`;
const top = (y: number) => `${((y + H / 2) / H) * 100}%`;

export default function Telegraph({ reduced, footer }: { reduced: boolean; footer?: React.ReactNode }) {
  const [mode, setMode] = useState<'send' | 'read'>('send');
  const [pressed, setPressed] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [queue, setQueue] = useState<string[]>([]);
  const [word, setWord] = useState(0);
  const [read, setRead] = useState('');
  const [status, setStatus] = useState('');
  // While a word is sent, the needles point to its letter on the way; otherwise to the last one pressed.
  const shown = queue[0] ?? pressed;

  // Sending: the needles spell the queue, a letter at a time.
  useEffect(() => {
    if (!queue.length) return;
    const rest = queue.slice(1);
    const id = window.setTimeout(() => {
      setQueue(rest);
      if (!rest.length) {
        setPressed(null);
        setStatus('Sent.');
      }
    }, SPELL_MS);
    return () => window.clearTimeout(id);
  }, [queue]);

  const target = READ_WORDS[word % READ_WORDS.length];
  const reading = mode === 'read' && read.length < target.length;
  const angles = needleAngles(mode === 'read' ? (reading ? target[read.length] : null) : shown);

  const press = (letter: string) => {
    if (mode === 'send') {
      setQueue([]);
      setPressed(letter);
      setMessage((m) => (m + letter).slice(0, 24));
      setStatus(`${letter}: needles ${pairOf(letter)}.`);
      return;
    }
    if (!reading) return;
    if (letter === target[read.length]) {
      const next = read + letter;
      setRead(next);
      setStatus(next.length === target.length ? `You read the word: ${target}.` : `${letter}. Right. The needles point to the next letter.`);
    } else {
      setStatus(`Not ${letter}. Look again at which two needles lean, and which way.`);
    }
  };

  const send = () => {
    const { letters, skipped } = spell(message);
    if (!letters.length) return;
    setQueue(letters);
    setStatus(`Sending ${letters.join('')}.${skipped.length ? ` ${skipped.join(', ')} ${skipped.length > 1 ? 'are' : 'is'} not on the dial, and left out.` : ''}`);
  };

  const switchMode = (m: 'send' | 'read') => {
    setMode(m);
    setQueue([]);
    setPressed(null);
    setRead('');
    setStatus(m === 'read' ? 'The needles point to a letter. Which is it?' : '');
  };

  const pointed = mode === 'read' ? (reading ? target[read.length] : null) : shown;

  return (
    <div className="vbi-bench">
      <div className="vbr-scene vbi-scene">
        <div className="vbi-board">
          <div className="vbi-dial" data-reduced={reduced || undefined}>
            <svg className="vbi-diamond" viewBox="0 0 600 540" aria-hidden="true">
              <path d="M300 14 L586 270 L300 526 L14 270Z" fill="#efe3c8" stroke="#6b4a32" strokeWidth="6" />
              <path d="M300 34 L562 270 L300 506 L38 270Z" fill="none" stroke="#c9a24a" strokeWidth="2" />
              <clipPath id="vbi-diamond-clip">
                <path d="M300 34 L562 270 L300 506 L38 270Z" />
              </clipPath>
              {/* the needles' lines, faint, where the letters cross */}
              {Array.from({ length: NEEDLES }, (_, k) => {
                const x = ((k + 1) / W) * 600;
                return (
                  <g key={k} stroke="#6b4a32" strokeOpacity="0.14" strokeWidth="1.4" clipPath="url(#vbi-diamond-clip)">
                    <line x1={x - 260} y1={270 - 260} x2={x + 260} y2={270 + 260} />
                    <line x1={x + 260} y1={270 - 260} x2={x - 260} y2={270 + 260} />
                  </g>
                );
              })}
            </svg>
            {DIAL.map((l) => (
              <button
                key={l.letter}
                type="button"
                className="vbi-letter"
                data-pointed={pointed === l.letter && mode === 'send' ? true : undefined}
                style={{ left: left(l.x), top: top(l.y) }}
                onClick={() => press(l.letter)}
                aria-label={l.letter}
              >
                {l.letter}
              </button>
            ))}
            {angles.map((a, k) => (
              <span key={k} className="vbi-needle" style={{ left: left(k + 1), top: top(0), transform: `translate(-50%, -50%) rotate(${a}deg)` }} aria-hidden="true">
                <span className="vbi-needle-n">{k + 1}</span>
              </span>
            ))}
          </div>
          <p className="vbi-board-name" aria-hidden="true">Cooke &amp; Wheatstone · 1837</p>
        </div>
      </div>

      <div className="vbr-card">
        <div className="vbr-options" role="group" aria-label="Send or read">
          <button type="button" className="vbr-option" aria-pressed={mode === 'send'} onClick={() => switchMode('send')}>
            Send a word
          </button>
          <button type="button" className="vbr-option" aria-pressed={mode === 'read'} onClick={() => switchMode('read')}>
            Read the needles
          </button>
        </div>
        {mode === 'send' ? (
          <>
            <p className="vbr-intro">{WORKSHOP_TEXT.telegraphIntro}</p>
            <label className="vbr-field">
              <span className="vbr-label">Your word</span>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 24))} maxLength={24} autoComplete="off" spellCheck={false} />
            </label>
            <div className="vbr-actions">
              <button type="button" className="vbr-button vbr-button-primary" onClick={send} disabled={!spell(message).letters.length || queue.length > 0}>
                Send it
              </button>
              <button type="button" className="vbr-button vbr-button-quiet" onClick={() => { setMessage(''); setQueue([]); setPressed(null); }} disabled={!message}>
                Clear
              </button>
            </div>
            <p className="vbi-readout" aria-live="polite">
              {shown ? (
                <>
                  The needles point to <strong>{shown}</strong>
                </>
              ) : (
                'The needles stand upright.'
              )}
            </p>
          </>
        ) : (
          <>
            <p className="vbr-intro">Two needles lean to point to a letter: follow their lines to where they cross, and press it.</p>
            <p className="vbi-readout vbi-word" aria-live="polite">
              {target.split('').map((c, i) => (
                <span key={i} className="vbi-word-letter" data-read={i < read.length || undefined}>
                  {i < read.length ? c : '·'}
                </span>
              ))}
            </p>
            <div className="vbr-actions">
              <button type="button" className="vbr-button vbr-button-primary" onClick={() => { setWord((w) => w + 1); setRead(''); setStatus('A new word. The needles point to its first letter.'); }}>
                {reading ? 'Another word' : 'Read another'}
              </button>
            </div>
          </>
        )}
        <FactNote fact={NOTES.telegraph} className="vbr-fact" />
        <p className="vbr-poster">{POSTER.innovations}</p>
        {footer}
      </div>
      <p className="vbr-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

function pairOf(letter: string) {
  const l = DIAL.find((x) => x.letter === letter)!;
  return `${l.i} and ${l.j}, ${l.above ? 'above' : 'below'}`;
}
