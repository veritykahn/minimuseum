'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import Celebrate from '../Celebrate';
import { MORSE, NOTES, POSTER, READ_WORDS, SEND_WORDS, WIRE_STEPS, WORKSHOP_TEXT } from './inventionsText';
import { StepButtons, StepDots } from './Steps';
import { DIAL, NEEDLES, needleAngles, spell } from './workshop';

/*
 * The telegraph bench, in three parts. First, how a telegraph works, step
 * by step: a battery, a key, a wire, a coil and a needle drawn as one
 * circuit; press the key and the current runs along the wire, the coil
 * glows and the needle swings; then Morse's dots and dashes, tapped on the
 * key. Then the five-needle dial, its 20 letters set in a diamond round the
 * row of needles, as on the 1837 instrument (C, J, Q, U, X and Z left off).
 * Press a letter (each is a button) and its two needles swing to point to
 * it; send a word, and the needles spell it letter by letter; or read one:
 * the needles point, the visitor finds the letter, and a right guess turns
 * green with a burst of stars, a wrong one red.
 */

const SPELL_MS = 1400;
/** A press of the key shorter than this is a dot; longer, a dash. */
const DOT_MS = 260;
/** A pause this long after a tap ends the letter. */
const LETTER_GAP_MS = 1100;
const W = 6;
const H = 5.4;
const left = (x: number) => `${(x / W) * 100}%`;
const top = (y: number) => `${((y + H / 2) / H) * 100}%`;
const FROM_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

type Mode = 'how' | 'send' | 'read';

export default function Telegraph({ reduced, footer }: { reduced: boolean; footer?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('how');
  const [step, setStep] = useState(0);
  const [pressedSteps, setPressedSteps] = useState<Set<number>>(() => new Set());
  const [live, setLive] = useState(false);
  const downAt = useRef(0);
  const guessN = useRef(0);
  const [tap, setTap] = useState('');
  const [decoded, setDecoded] = useState('');

  const [pressed, setPressed] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [queue, setQueue] = useState<string[]>([]);
  const [word, setWord] = useState(0);
  const [read, setRead] = useState('');
  const [guess, setGuess] = useState<{ letter: string; ok: boolean; n: number } | null>(null);
  const [burst, setBurst] = useState(0);
  const [status, setStatus] = useState('');
  // The letters a word sent had that the dial does not, said where it can be seen.
  const [missing, setMissing] = useState<string[]>([]);
  // While a word is sent, the needles point to its letter on the way; otherwise to the last one pressed.
  const shown = queue[0] ?? pressed;
  const stepId = WIRE_STEPS[step].id;

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

  // Morse: after a pause, the dots and dashes tapped so far become a letter.
  useEffect(() => {
    if (!tap || live) return;
    const id = window.setTimeout(() => {
      const letter = FROM_MORSE[tap] ?? '?';
      setDecoded((d) => (d + letter).slice(-12));
      setTap('');
      setStatus(letter === '?' ? `${tap} is not a letter in Morse code.` : `${tap} is ${letter}.`);
    }, LETTER_GAP_MS);
    return () => window.clearTimeout(id);
  }, [tap, live]);

  const target = READ_WORDS[word % READ_WORDS.length];
  const reading = mode === 'read' && read.length < target.length;
  const angles = needleAngles(mode === 'read' ? (reading ? target[read.length] : null) : mode === 'send' ? shown : null);

  /* ── The key ── */
  const keyDown = () => {
    if (live) return;
    downAt.current = Date.now();
    setLive(true);
    setPressedSteps((s) => new Set(s).add(step));
    setStatus('The key is pressed: the current flows along the wire, through the coil, and the needle swings.');
  };
  const keyUp = () => {
    if (!live) return;
    setLive(false);
    if (stepId === 'morse') {
      const mark = Date.now() - downAt.current < DOT_MS ? '.' : '-';
      setTap((t) => (t + mark).slice(0, 6));
    }
  };
  const keyKeys = {
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        keyDown();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        keyUp();
      }
    },
  };

  /* ── The dial ── */
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
      guessN.current += 1;
      setGuess({ letter, ok: true, n: guessN.current });
      setBurst((b) => b + 1);
      setStatus(next.length === target.length ? `You read the word: ${target}.` : `${letter}. Right. The needles point to the next letter.`);
    } else {
      guessN.current += 1;
      setGuess({ letter, ok: false, n: guessN.current });
      setStatus(`Not ${letter}. Look again at which two needles lean, and which way.`);
    }
  };

  const send = (text = message) => {
    const { letters, skipped } = spell(text);
    if (!letters.length) return;
    setQueue(letters);
    setMissing(skipped);
    setStatus(`Sending ${letters.join('')}.${skipped.length ? ` ${skipped.join(', ')} ${skipped.length > 1 ? 'are' : 'is'} not on the dial, and left out.` : ''}`);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setMissing([]);
    setQueue([]);
    setPressed(null);
    setRead('');
    setGuess(null);
    setLive(false);
    setStatus(m === 'read' ? 'The needles point to a letter. Which is it?' : m === 'send' ? 'The five-needle dial. Press a letter.' : 'How a telegraph works.');
  };

  const goStep = (i: number) => {
    setStep(Math.max(0, Math.min(WIRE_STEPS.length - 1, i)));
    setLive(false);
    setStatus(`Step ${i + 1}: ${WIRE_STEPS[Math.max(0, Math.min(WIRE_STEPS.length - 1, i))].title}.`);
  };

  const pointed = mode === 'read' ? (reading ? target[read.length] : null) : shown;
  const wordDone = mode === 'read' && !reading;
  const verdict = (l: string) => (mode === 'read' && guess && guess.letter === l ? (guess.ok ? 'right' : 'wrong') : undefined);

  return (
    <div className="vbi-bench">
      <div className="vbr-scene vbi-scene">
        {mode === 'how' ? (
          <Circuit step={stepId} live={live} tap={tap} decoded={decoded} onDown={keyDown} onUp={keyUp} />
        ) : (
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
                  data-verdict={verdict(l.letter)}
                  // A new key each guess, so the same letter guessed twice flashes again.
                  data-n={verdict(l.letter) ? guess?.n : undefined}
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
              {wordDone && (
                <span className="vbi-dial-cheer" aria-hidden="true">
                  <Celebrate burst={burst} reduced={reduced} />
                </span>
              )}
            </div>
            <p className="vbi-board-name" aria-hidden="true">Cooke &amp; Wheatstone · 1837 · 20 letters</p>
          </div>
        )}
      </div>

      <div className="vbr-card vbi-card">
        <div className="vbr-options vbi-modes" role="group" aria-label="How it works, send or read">
          <button type="button" className="vbr-option" aria-pressed={mode === 'how'} onClick={() => switchMode('how')}>
            How it works
          </button>
          <button type="button" className="vbr-option" aria-pressed={mode === 'send'} onClick={() => switchMode('send')}>
            Send a word
          </button>
          <button type="button" className="vbr-option" aria-pressed={mode === 'read'} onClick={() => switchMode('read')}>
            Read the needles
          </button>
        </div>

        {mode === 'how' && (
          <>
            <StepDots steps={WIRE_STEPS} at={step} done={(i) => pressedSteps.has(i)} onGo={goStep} label="How a telegraph works, step by step" />
            <h2 className="vbi-step-title">{WIRE_STEPS[step].title}</h2>
            <p className="vbi-step-body">{WIRE_STEPS[step].body}</p>
            <p className="vbi-task">
              <span className="vbi-task-mark" aria-hidden="true">▸</span> {WIRE_STEPS[step].task}
            </p>
            <button
              type="button"
              className="vbi-key-button"
              data-live={live || undefined}
              aria-pressed={live}
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                } catch {}
                keyDown();
              }}
              onPointerUp={keyUp}
              onPointerCancel={keyUp}
              onLostPointerCapture={keyUp}
              {...keyKeys}
            >
              {live ? 'Current flowing…' : 'Press the key'}
            </button>
            {stepId === 'morse' && (
              <p className="vbi-readout vbi-morse-read" aria-live="polite">
                Tapped: <strong className="vbi-morse-marks">{tap ? tap.replace(/\./g, '•').replace(/-/g, '—') : '…'}</strong>
                {decoded && (
                  <>
                    {' '}
                    Spells: <strong>{decoded}</strong>
                  </>
                )}
              </p>
            )}
            {stepId === 'morse' && (
              <div className="vbi-morse-help">
                <span className="vbr-label">Try these letters</span>
                <ul className="vbi-morse-chips">
                  {'ETAIMNOS'.split('').map((k) => (
                    <li key={k}>
                      <strong>{k}</strong> <span aria-label={MORSE[k].replace(/\./g, 'dot ').replace(/-/g, 'dash ').trim()}>{MORSE[k].replace(/\./g, '•').replace(/-/g, '—')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stepId === 'wire' && <FactNote fact={NOTES.wire} className="vbr-fact" />}
            {stepId === 'coil' && <FactNote fact={NOTES.oersted} className="vbr-fact" />}
            {stepId === 'needle' && <FactNote fact={NOTES.needles} className="vbr-fact" />}
            {stepId === 'morse' && <FactNote fact={NOTES.morse} className="vbr-fact" />}
            <StepButtons at={step} count={WIRE_STEPS.length} onGo={goStep} />
            {step === WIRE_STEPS.length - 1 && (
              <button type="button" className="vbr-button vbr-button-primary" onClick={() => switchMode('send')}>
                Now try the five-needle telegraph <span aria-hidden="true">→</span>
              </button>
            )}
          </>
        )}

        {mode === 'send' && (
          <>
            <p className="vbr-intro vbi-step-body">{WORKSHOP_TEXT.telegraphIntro}</p>
            <label className="vbr-field">
              <span className="vbr-label">Your word</span>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 24))} maxLength={24} autoComplete="off" spellCheck={false} />
            </label>
            <div className="vbr-actions">
              <button type="button" className="vbr-button vbr-button-primary" onClick={() => send()} disabled={!spell(message).letters.length || queue.length > 0}>
                Send it
              </button>
              <button
                type="button"
                className="vbr-button vbr-button-quiet"
                onClick={() => {
                  setMessage('');
                  setQueue([]);
                  setPressed(null);
                  setMissing([]);
                }}
                disabled={!message}
              >
                Clear
              </button>
            </div>
            <div className="vbi-try" role="group" aria-label="Words the dial can spell">
              <span className="vbr-label">Or tap a word</span>
              <div className="vbr-options">
                {SEND_WORDS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    className="vbr-option"
                    onClick={() => {
                      setMessage(w);
                      setPressed(null);
                      send(w);
                    }}
                    disabled={queue.length > 0}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <p className="vbi-readout vbi-big-readout" aria-live="polite">
              {shown ? (
                <>
                  The needles point to <strong>{shown}</strong>
                </>
              ) : (
                'The needles stand upright.'
              )}
            </p>
            {missing.length > 0 && (
              <p className="vbr-note vbi-left">
                {missing.join(', ')} {missing.length > 1 ? 'are' : 'is'} not on the dial, so {missing.length > 1 ? 'they are' : 'it is'} left out.
              </p>
            )}
            <FactNote fact={NOTES.dialLetters} className="vbr-fact" />
          </>
        )}

        {mode === 'read' && (
          <>
            <p className="vbi-step-body">Two needles lean to point to a letter: follow their lines to where they cross, and press it.</p>
            <p className="vbi-readout vbi-word" aria-label={`The word so far: ${read || 'no letters yet'}`}>
              {target.split('').map((c, i) => (
                <span key={i} className="vbi-word-letter" data-read={i < read.length || undefined}>
                  {i < read.length ? c : '·'}
                </span>
              ))}
            </p>
            <div className="vbi-feedback" aria-live="polite" data-verdict={wordDone ? 'right' : guess ? (guess.ok ? 'right' : 'wrong') : undefined}>
              {!wordDone && <Celebrate burst={guess?.ok ? burst : 0} reduced={reduced} />}
              {wordDone ? (
                <p className="vbi-verdict">Well read! The word is {target}.</p>
              ) : guess ? (
                <p className="vbi-verdict">{guess.ok ? `Right! ${guess.letter}.` : `Not ${guess.letter}: try again.`}</p>
              ) : (
                <p className="vbi-verdict vbi-verdict-quiet">Which letter do the needles point to?</p>
              )}
            </div>
            <div className="vbr-actions">
              <button
                type="button"
                className="vbr-button vbr-button-primary"
                onClick={() => {
                  setWord((w) => w + 1);
                  setRead('');
                  setGuess(null);
                  setStatus('A new word. The needles point to its first letter.');
                }}
              >
                {reading ? 'Another word' : 'Read another'}
              </button>
            </div>
          </>
        )}

        {mode !== 'how' && <FactNote fact={NOTES.telegraph} className="vbr-fact" />}
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

/**
 * How a telegraph works, drawn as one circuit: the battery and the key at
 * the sending station, the wire on its poles, and at the far station the
 * coil with its needle (and, for Morse, a paper tape). The part the step
 * is about is lit; pressing the key sets the current running.
 */
function Circuit({ step, live, tap, decoded, onDown, onUp }: { step: string; live: boolean; tap: string; decoded: string; onDown: () => void; onUp: () => void }) {
  const marks = tap.split('');
  return (
    <svg className="vbi-circuit" viewBox="0 0 1000 600" data-step={step} data-live={live || undefined} role="img" aria-label={`A telegraph circuit: a battery and a key at one station, a long wire on poles, and a coil with a needle at the far station. ${live ? 'The key is pressed: the current flows and the needle swings.' : 'The key is up: no current flows.'}`}>
      <rect x="10" y="10" width="980" height="580" rx="10" fill="#f4eee3" stroke="#6b4a32" strokeOpacity="0.4" strokeWidth="2" />
      <text x="140" y="70" textAnchor="middle" className="vbi-circuit-station">Sending station</text>
      <text x="830" y="70" textAnchor="middle" className="vbi-circuit-station">Far station</text>

      {/* the wires: out along the poles, and back */}
      <path className="vbi-wire-path" d="M175 300 H250 M330 300 H700 M700 300 V250 H760" />
      <path className="vbi-wire-path" d="M860 250 H950 V550 H90 V340" />
      <path className="vbi-current" d="M175 300 H250 M330 300 H700 M700 300 V250 H760" />
      <path className="vbi-current" d="M860 250 H950 V550 H90 V340" />
      {[420, 560].map((x) => (
        <g key={x} className="vbi-part vbi-part-wire">
          <path d={`M${x} 300 V420`} stroke="#6b4a32" strokeWidth="10" />
          <path d={`M${x - 26} 300 H${x + 26}`} stroke="#6b4a32" strokeWidth="6" />
        </g>
      ))}
      <text x="490" y="282" textAnchor="middle" className="vbi-circuit-label vbi-label-wire">Wire</text>

      {/* the battery */}
      <g className="vbi-part vbi-part-battery">
        <rect x="40" y="250" width="135" height="90" rx="8" fill="#2f4a32" />
        {[60, 92, 124].map((x) => (
          <rect key={x} x={x} y="266" width="26" height="58" rx="3" fill="#c9a24a" />
        ))}
        <text x="166" y="244" className="vbi-circuit-sign">+</text>
        <text x="44" y="244" className="vbi-circuit-sign">−</text>
        <text x="108" y="380" textAnchor="middle" className="vbi-circuit-label">Battery</text>
      </g>

      {/* the key: a brass lever on a wooden base; pressed, it closes the gap */}
      <g className="vbi-part vbi-part-key" onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp} style={{ cursor: 'pointer' }}>
        <rect x="235" y="318" width="110" height="26" rx="4" fill="#7a4a34" />
        <circle cx="250" cy="310" r="8" fill="#c9a24a" />
        <circle cx="330" cy="310" r="8" fill="#c9a24a" />
        <g className="vbi-key-lever" style={{ transform: live ? 'rotate(9deg)' : 'rotate(0deg)', transformOrigin: '250px 300px' }}>
          <path d="M246 300 L345 282" stroke="#b8903a" strokeWidth="9" strokeLinecap="round" />
          <circle cx="345" cy="282" r="13" fill="#2a2522" />
        </g>
        <text x="290" y="380" textAnchor="middle" className="vbi-circuit-label">Key</text>
      </g>

      {/* the coil and its needle at the far station */}
      <g className="vbi-part vbi-part-coil">
        <rect x="760" y="215" width="100" height="70" rx="10" fill="#b0603a" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${770 + i * 10} 215 V285`} stroke="#7a3a1c" strokeWidth="4" />
        ))}
        <text x="810" y="320" textAnchor="middle" className="vbi-circuit-label">Coil</text>
      </g>
      <g className="vbi-part vbi-part-needle">
        <circle cx="810" cy="140" r="58" fill="#fbf7ef" stroke="#6b4a32" strokeWidth="4" />
        <path d="M810 88 V100 M810 180 V192" stroke="#6b4a32" strokeWidth="3" />
        <g className="vbi-big-needle" style={{ transform: live ? 'rotate(40deg)' : 'rotate(0deg)', transformOrigin: '810px 140px' }}>
          <path d="M810 92 L820 140 L810 188 L800 140Z" fill="#2a2522" />
          <circle cx="810" cy="140" r="7" fill="#c9a24a" />
        </g>
        <text x="900" y="146" className="vbi-circuit-label">Needle</text>
      </g>

      {/* Morse's paper tape */}
      <g className="vbi-part vbi-part-morse">
        <rect x="520" y="420" width="400" height="70" rx="6" fill="#fffaf0" stroke="#c9a24a" strokeWidth="2" />
        <text x="720" y="410" textAnchor="middle" className="vbi-circuit-label">Morse tape</text>
        {marks.map((m, i) =>
          m === '.' ? <circle key={i} cx={550 + i * 52} cy="455" r="9" fill="#2a2522" /> : <rect key={i} x={535 + i * 52} y="448" width="36" height="14" rx="4" fill="#2a2522" />,
        )}
        <text x="900" y="465" textAnchor="end" className="vbi-circuit-decoded">{decoded.slice(-6)}</text>
      </g>
    </svg>
  );
}
