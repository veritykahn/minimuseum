'use client';

import { useEffect, useState } from 'react';
import Celebrate from '../Celebrate';
import { MORSE, MORSE_LEARN, MORSE_MESSAGES, MORSE_WORDS, POSTER, TELEGRAM } from './inventionsText';
import { Marks, SoundToggle, useMorseKey, useTone } from './morseKit';
import { MORSE_FACTS } from './sources';
import { CardFoot } from './Steps';
import { morseTimeline, spoken, toMorse } from './workshop';
import { useMuseumSound } from '@/lib/museumSound';

/*
 * The Morse code bench: its own table in the workshop, a brass key at the
 * front, a paper tape across the top, and three parts, one after another.
 *
 * 1. Learn. Eight short letters on cards (E, T, I, M, A, N, S, O). Tap a
 *    card and the lamp flashes its code (and the sounder sounds it, if the
 *    museum's sound is on); then copy it on the key: a quick tap is a dot,
 *    a longer press a dash. Each letter copied gets its tick.
 * 2. Send. Choose a word made of those letters and tap it out, letter by
 *    letter, its code under each letter to follow. A wrong tap says what
 *    you tapped and starts that letter again.
 * 3. Decode. A short message, chosen at random and made of the same
 *    letters, comes in on the lamp (and the sounder); its dots and dashes
 *    come up on the tape, and you press the letter each group spells.
 *
 * Every mark tapped is drawn on the tape. Dot and Dash buttons do the same
 * as the key, for anyone who cannot hold a key. Sound is off until it is
 * turned on. Under reduced motion the lamp stays still and a message comes
 * up on the tape whole.
 */

const LEARN_UNIT = 160;
const DECODE_UNIT = 150;
const FROM_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

type Part = 'learn' | 'send' | 'decode';
const PARTS: { id: Part; label: string }[] = [
  { id: 'learn', label: '1. Learn' },
  { id: 'send', label: '2. Send' },
  { id: 'decode', label: '3. Decode' },
];

/** Read only in event handlers, never while rendering. */
const roll = () => Math.random();

export default function Morse({ reduced }: { reduced: boolean }) {
  const [part, setPart] = useState<Part>('learn');
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const [sound, setSound] = useMuseumSound();
  const tone = useTone(sound);
  // The lamp, lit while the key (or a message coming in) is down.
  const [lamp, setLamp] = useState(false);
  // The tape: the marks tapped so far for the letter under way, and the last few letters made.
  const [tap, setTap] = useState('');
  const [said, setSaid] = useState<{ ok: boolean; words: string } | null>(null);

  /* ── 1. Learn ── */
  const [card, setCard] = useState<string | null>(null);
  const [learned, setLearned] = useState<string[]>([]);
  // A code playing on the lamp: the letter, and a new number each time it plays.
  const [show, setShow] = useState<{ text: string; n: number; unit: number } | null>(null);

  /* ── 2. Send ── */
  const [word, setWord] = useState(MORSE_WORDS[0]);
  const [at, setAt] = useState(0);
  const sentWord = at >= word.length;

  /* ── 3. Decode ── */
  const [msgIdx, setMsgIdx] = useState<number | null>(null);
  const msg = msgIdx === null ? '' : MORSE_MESSAGES[msgIdx];
  const cells = toMorse(msg, MORSE);
  const letters = cells.map((c, i) => (c.char === ' ' ? -1 : i)).filter((i) => i >= 0);
  const [heard, setHeard] = useState(-1);
  const [guesses, setGuesses] = useState<Record<number, string>>({});
  const [miss, setMiss] = useState<{ slot: number; n: number } | null>(null);
  const slot = letters.find((i) => !guesses[i]) ?? -1;
  const decoded = letters.length > 0 && letters.every((i) => guesses[i]);
  const playing = show !== null && part === 'decode';

  // Plays a code on the lamp (and the sounder): a card's letter, or the message to decode.
  useEffect(() => {
    if (!show) return;
    const tl = morseTimeline(show.text, MORSE, show.unit);
    let i = 0;
    let timer = 0;
    const tick = () => {
      if (i >= tl.length) {
        setLamp(false);
        tone.stop();
        setShow(null);
        if (part === 'decode') {
          setHeard(cells.length - 1);
          setStatus('The message is in. Press the letter each group of dots and dashes spells.');
        }
        return;
      }
      const piece = tl[i++];
      if (!reduced) setLamp(piece.on);
      if (piece.on) tone.start();
      else tone.stop();
      if (part === 'decode') setHeard((h) => Math.max(h, piece.on ? piece.letter : piece.letter - 1));
      timer = window.setTimeout(tick, piece.ms);
    };
    timer = window.setTimeout(tick, 250);
    return () => {
      window.clearTimeout(timer);
      tone.stop();
    };
    // Plays once each time it is asked to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  /* The key: each mark checked against the letter wanted, as soon as it is tapped. */
  const want = part === 'learn' ? card : part === 'send' && !sentWord ? word[at] : null;
  const mark = (m: '.' | '-') => {
    if (part === 'decode') {
      setStatus('In this part, read the message: press the letters below the tape.');
      return;
    }
    if (!want) {
      setSaid({ ok: false, words: part === 'learn' ? 'First tap a letter card, then copy its code on the key.' : 'Choose another word to send.' });
      setStatus(part === 'learn' ? 'First tap a letter card.' : 'Choose another word.');
      return;
    }
    const code = MORSE[want];
    const t = tap + m;
    if (t === code) {
      setTap('');
      if (part === 'learn') {
        const next = learned.includes(want) ? learned : [...learned, want];
        setLearned(next);
        const all = next.length === MORSE_LEARN.length;
        if (all) setBurst((b) => b + 1);
        const words = `${spoken(t)}: that’s ${want}! ${all ? 'You know all eight letters. Now send a word.' : 'Tap another card.'}`;
        setSaid({ ok: true, words });
        setStatus(words);
      } else {
        const next = at + 1;
        setAt(next);
        if (next >= word.length) {
          setBurst((b) => b + 1);
          setSaid({ ok: true, words: `You sent ${word}!` });
          setStatus(`${want}. You sent the whole word: ${word}!`);
        } else {
          setSaid({ ok: true, words: `${want}, sent. Next: ${word[next]}.` });
          setStatus(`${want}, sent. Next: ${word[next]}, ${spoken(MORSE[word[next]])}.`);
        }
      }
    } else if (code.startsWith(t)) {
      setTap(t);
      setStatus(`${spoken(t)}…`);
    } else {
      setTap('');
      const was = FROM_MORSE[t];
      const words = `You tapped ${spoken(t)}${was ? `: that’s ${was}` : ''}. ${want} is ${spoken(code)}. Try ${want} again.`;
      setSaid({ ok: false, words });
      setStatus(words);
    }
  };
  const key = useMorseKey({ onMark: mark, tone });
  const keyLit = key.live || lamp;

  const chooseCard = (l: string) => {
    setCard(l);
    setTap('');
    setSaid(null);
    setShow({ text: l, n: Date.now(), unit: LEARN_UNIT });
    setStatus(`${l} is ${spoken(MORSE[l])}. Now copy it on the key.`);
  };
  const chooseWord = (w: string) => {
    setWord(w);
    setAt(0);
    setTap('');
    setSaid(null);
    setStatus(`Send ${w}. First: ${w[0]}, ${spoken(MORSE[w[0]])}.`);
  };

  const play = () => {
    const idx = msgIdx ?? Math.floor(roll() * MORSE_MESSAGES.length);
    if (msgIdx === null) setMsgIdx(idx);
    if (reduced) setHeard(toMorse(MORSE_MESSAGES[idx], MORSE).length - 1);
    setShow({ text: MORSE_MESSAGES[idx], n: Date.now(), unit: DECODE_UNIT });
    setStatus('Watch the lamp, and the tape.');
  };
  const another = () => {
    const n = MORSE_MESSAGES.length;
    const idx = msgIdx === null ? Math.floor(roll() * n) : (msgIdx + 1 + Math.floor(roll() * (n - 1))) % n;
    setMsgIdx(idx);
    setGuesses({});
    setHeard(-1);
    setMiss(null);
    setShow(null);
    setLamp(false);
    setStatus('A new message is waiting. Press Play.');
  };
  const pick = (l: string) => {
    if (slot < 0 || heard < slot) return;
    if (cells[slot].char === l) {
      const next = { ...guesses, [slot]: l };
      setGuesses(next);
      setMiss(null);
      if (letters.every((i) => next[i])) {
        setBurst((b) => b + 1);
        setStatus(`Well decoded! The message says: ${msg}.`);
      } else setStatus(`${l}. Right!`);
    } else {
      setMiss((m) => ({ slot, n: (m?.n ?? 0) + 1 }));
      setStatus(`Not ${l}. Look again: ${spoken(cells[slot].code)}.`);
    }
  };

  const choosePart = (p: Part) => {
    setPart(p);
    setTap('');
    setSaid(null);
    setShow(null);
    setLamp(false);
    setStatus(p === 'learn' ? 'Learn a few letters.' : p === 'send' ? 'Send a word.' : 'Decode a message.');
  };

  // The tape: in decoding, the message's marks as they come in; otherwise the marks being tapped.
  const tape = part === 'decode' ? cells.slice(0, heard + 1) : null;

  return (
    <div className="vbi-bench vbi-morse" data-look="strip" data-part={part}>
      <div className="vbr-scene vbi-scene">
        <div className="vbi-morse-table">
          <div className="vbi-morse-tape" aria-hidden="true">
            <span className="vbi-tg-lamp vbi-tg-lamp-big" data-on={keyLit || undefined} />
            <span className="vbi-morse-paper">
              {tape
                ? tape.map((c, i) => (c.char === ' ' ? <span key={i} className="vbi-morse-gap" /> : <Marks key={i} code={c.code} />))
                : tap && <Marks code={tap} />}
            </span>
          </div>

          {part === 'learn' && (
            <ul className="vbi-morse-cards" aria-label="Letters to learn">
              {MORSE_LEARN.map((l) => (
                <li key={l}>
                  <button type="button" className="vbi-morse-card" aria-pressed={card === l} data-learned={learned.includes(l) || undefined} onClick={() => chooseCard(l)} aria-label={`${l}: ${spoken(MORSE[l])}${learned.includes(l) ? ' (learned)' : ''}`}>
                    <span className="vbi-morse-card-l">{l}</span>
                    <span className="vbi-morse-card-c">
                      <Marks code={MORSE[l]} />
                    </span>
                    {learned.includes(l) && (
                      <span className="vbi-morse-tick" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {part === 'send' && (
            <ol className="vbi-morse-word" aria-label={`Sending ${word}, letter by letter`}>
              {word.split('').map((c, i) => (
                <li key={i} className="vbi-morse-slot" data-done={i < at || undefined} data-current={i === at || undefined}>
                  <span className="vbi-morse-slot-l">{c}</span>
                  <span className="vbi-morse-slot-c" aria-label={spoken(MORSE[c])}>
                    <Marks code={MORSE[c]} />
                  </span>
                </li>
              ))}
            </ol>
          )}

          {part === 'decode' && (
            <div className="vbi-morse-decode">
              {msgIdx === null ? (
                <p className="vbi-morse-wait">A message is waiting. Press Play.</p>
              ) : (
                <ol className="vbi-morse-message" aria-label="The message, letter by letter">
                  {cells.map((c, i) =>
                    c.char === ' ' ? (
                      <li key={i} className="vbi-morse-gap" aria-hidden="true" />
                    ) : (
                      <li key={i} className="vbi-morse-slot" data-done={guesses[i] ? true : undefined} data-current={(i === slot && heard >= i) || undefined} data-miss={miss && miss.slot === i ? miss.n : undefined}>
                        <span className="vbi-morse-slot-c" data-shown={heard >= i || undefined} aria-label={heard >= i ? spoken(c.code) : 'not yet'}>
                          <Marks code={c.code} />
                        </span>
                        <span className="vbi-morse-slot-l" aria-label={guesses[i] ?? 'blank'}>
                          {guesses[i] ?? ' '}
                        </span>
                      </li>
                    ),
                  )}
                </ol>
              )}
              <div className="vbi-morse-picks" role="group" aria-label="The letters">
                {MORSE_LEARN.map((l) => (
                  <button key={l} type="button" className="vbi-morse-pick" onClick={() => pick(l)} disabled={heard < 0 || decoded || slot < 0 || heard < slot} aria-label={`${l}: ${spoken(MORSE[l])}`}>
                    <span className="vbi-morse-card-l">{l}</span>
                    <span className="vbi-morse-card-c">
                      <Marks code={MORSE[l]} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {part !== 'decode' && (
            <button type="button" className="vbi-morse-key" data-live={key.live || undefined} aria-label="The Morse key: tap for a dot, hold for a dash" {...key.props}>
              <svg viewBox="0 0 320 130" aria-hidden="true">
                <rect x="14" y="86" width="292" height="34" rx="8" fill="#6a3d2a" />
                <rect x="14" y="86" width="292" height="8" rx="4" fill="#8a5a3c" />
                <circle cx="56" cy="78" r="11" fill="#c9a24a" />
                <circle cx="252" cy="80" r="11" fill="#c9a24a" />
                <g className="vbi-key-lever" style={{ transform: key.live ? 'rotate(6deg)' : 'rotate(0deg)', transformOrigin: '56px 68px' }}>
                  <path d="M48 68 L262 40" stroke="#c9a24a" strokeWidth="13" strokeLinecap="round" />
                  <ellipse cx="268" cy="36" rx="30" ry="15" fill="#2a2522" />
                </g>
              </svg>
              <span className="vbi-morse-key-label">{key.live ? 'Down…' : 'Tap • hold —'}</span>
            </button>
          )}
          <span className="vbi-morse-cheer" aria-hidden="true">
            <Celebrate burst={(part === 'learn' && learned.length === MORSE_LEARN.length) || (part === 'send' && sentWord) || (part === 'decode' && decoded) ? burst : 0} reduced={reduced} />
          </span>
        </div>
      </div>

      <div className="vbr-card vbi-card vbi-strip-card">
        <div className="vbr-options vbi-modes" role="group" aria-label="Morse code, in three parts">
          {PARTS.map((p) => (
            <button key={p.id} type="button" className="vbr-option" aria-pressed={part === p.id} onClick={() => choosePart(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="vbi-strip-main">
          <div className="vbi-strip-text" aria-live="polite">
            {said ? (
              <p className="vbi-step-body vbi-build-said" data-ok={said.ok || undefined}>
                {said.words}
              </p>
            ) : part === 'learn' ? (
              <p className="vbi-step-body">
                Morse code spells each letter in dots and dashes. Tap a card to see and hear its code, then copy it on the key: <strong>tap quickly for a dot, hold a little longer for a dash.</strong>
              </p>
            ) : part === 'send' ? (
              <p className="vbi-step-body">
                Tap out <strong>{word}</strong> on the key, letter by letter. Its code is under each letter.
              </p>
            ) : (
              <p className="vbi-step-body">Press Play and watch the lamp. Then press the letter each group of dots and dashes spells.</p>
            )}
            {part === 'learn' && (
              <p className="vbr-note">
                {learned.length} of {MORSE_LEARN.length} letters learned. {TELEGRAM.morseNote}.
              </p>
            )}
            {part === 'decode' && decoded && <p className="vbi-step-body"><strong>Well decoded! “{msg}”</strong></p>}
          </div>
          <div className="vbi-strip-controls">
            {part === 'send' && (
              <div className="vbr-options vbi-morse-words" role="group" aria-label="Words to send">
                {MORSE_WORDS.map((w) => (
                  <button key={w} type="button" className="vbr-option" aria-pressed={word === w} onClick={() => chooseWord(w)}>
                    {w}
                  </button>
                ))}
              </div>
            )}
            {part === 'decode' ? (
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={play} disabled={playing}>
                  {heard < 0 ? 'Play the message' : playing ? 'Playing…' : 'Play it again'}
                </button>
                <button type="button" className="vbr-button" onClick={another} disabled={playing}>
                  Another message
                </button>
              </div>
            ) : (
              <div className="vbr-actions vbi-tg-row">
                <button type="button" className="vbr-button vbi-markbutton" onClick={() => mark('.')} aria-label="Dot">
                  <Marks code="." />
                </button>
                <button type="button" className="vbr-button vbi-markbutton" onClick={() => mark('-')} aria-label="Dash">
                  <Marks code="-" />
                </button>
                {part === 'learn' && learned.length === MORSE_LEARN.length && (
                  <button type="button" className="vbr-button vbr-button-primary" onClick={() => choosePart('send')}>
                    Send a word <span aria-hidden="true">→</span>
                  </button>
                )}
                {part === 'send' && sentWord && (
                  <button type="button" className="vbr-button vbr-button-primary" onClick={() => choosePart('decode')}>
                    Decode a message <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            )}
            <SoundToggle on={sound} set={setSound} />
          </div>
        </div>
        <CardFoot facts={MORSE_FACTS} poster={POSTER.innovations} reset={part} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
