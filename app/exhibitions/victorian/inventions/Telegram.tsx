'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Celebrate from '../Celebrate';
import { usePrintSheet } from '../usePrintSheet';
import { INCOMING, MORSE, NOTES, POSTER, TELEGRAM, TELEGRAM_IDEAS } from './inventionsText';
import { CardFoot, StepDots } from './Steps';
import { marks, morseTimeline, oldMoney, spoken, telegramCost, telegramWords, toMorse } from './workshop';

/*
 * Telegrams, in International Morse code (said so on the page).
 *
 * Send one, in three steps: write it (twelve words for sixpence, as the
 * Post Office charged; a halfpenny for each word more is the room's game
 * rule, and says so), tap it out on the key letter by letter, the chart
 * beside it lighting each letter's code as you go, and print the form, the
 * message with its Morse beneath.
 *
 * Or receive one: a lamp flashes a short telegram (with its sound, if
 * sound is on), its dots and dashes come up on the tape, and you decode it
 * letter by letter from the chart.
 *
 * Sound is off until it is turned on. The letters sit in fixed slots, so
 * nothing shifts as they are tapped or found; only colour and opacity
 * change. Under reduced motion the tape comes up whole and the lamp stays
 * still.
 */

/** A press of the key shorter than this is a dot; longer, a dash. */
const DOT_MS = 260;
/** The clerk's speed, and the incoming telegram's, as one Morse unit. */
const CLERK_UNIT = 90;
const RECEIVE_UNIT = 130;
const TONE_HZ = 620;
const LETTERS = Object.keys(MORSE);

export type TelegramMode = 'send' | 'receive';
const SEND_STEPS = [
  { id: 'write', title: 'Write it' },
  { id: 'tap', title: 'Tap it out' },
  { id: 'print', title: 'Print it' },
] as const;

/* ── Sound: a sounder's tone, only once it is turned on ── */
function useTone(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  const osc = useRef<OscillatorNode | null>(null);
  const start = useCallback(() => {
    if (!on || typeof window === 'undefined') return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      ctx.current ??= new AC();
      if (osc.current) return;
      const g = ctx.current.createGain();
      g.gain.value = 0.12;
      g.connect(ctx.current.destination);
      const o = ctx.current.createOscillator();
      o.frequency.value = TONE_HZ;
      o.connect(g);
      o.start();
      osc.current = o;
    } catch {}
  }, [on]);
  const stop = useCallback(() => {
    try {
      osc.current?.stop();
    } catch {}
    osc.current = null;
  }, []);
  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    if (!on) stop();
  }, [on, stop]);
  return { start, stop };
}

export default function TelegramBench({ mode, reduced, modes }: { mode: TelegramMode; reduced: boolean; modes: ReactNode }) {
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const [sound, setSound] = useState(false);
  const tone = useTone(sound);

  /* ── Send: write, tap, print ── */
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const words = telegramWords(text);
  const message = words.join(' ');
  const cells = toMorse(message, MORSE);
  const letterIdx = cells.map((c, i) => (c.char === ' ' ? -1 : i)).filter((i) => i >= 0);
  const [at, setAt] = useState(0); // how many letters are sent
  const [tap, setTap] = useState('');
  const [wrong, setWrong] = useState(0);
  const [live, setLive] = useState(false);
  const [clerk, setClerk] = useState(false);
  const downAt = useRef(0);
  const current = at < letterIdx.length ? cells[letterIdx[at]] : null;
  const sentAll = letterIdx.length > 0 && at >= letterIdx.length;
  const cost = telegramCost(words.length, TELEGRAM.words, TELEGRAM.extraHalfpence);
  const over = Math.max(0, words.length - TELEGRAM.words);

  const write = (v: string) => {
    const ws = v.toUpperCase().replace(/[^A-Z\s]/g, '');
    // No more than the most words the form takes.
    const parts = ws.split(/(\s+)/);
    let n = 0;
    const kept: string[] = [];
    for (const p of parts) {
      if (/\S/.test(p)) n += 1;
      if (n > TELEGRAM.maxWords) break;
      kept.push(p);
    }
    setText(kept.join(''));
    setAt(0);
    setTap('');
  };

  const mark = (m: '.' | '-') => {
    if (!current) return;
    const t = tap + m;
    if (t === current.code) {
      const next = at + 1;
      setAt(next);
      setTap('');
      if (next >= letterIdx.length) {
        setBurst((b) => b + 1);
        setStatus(`${current.char}. The whole telegram is sent!`);
      } else setStatus(`${current.char}, sent. Next: ${cells[letterIdx[next]].char}, ${spoken(cells[letterIdx[next]].code)}.`);
    } else if (current.code.startsWith(t)) {
      setTap(t);
    } else {
      setTap('');
      setWrong((w) => w + 1);
      setStatus(`Not quite: ${current.char} is ${spoken(current.code)}. Try ${current.char} again.`);
    }
  };

  const keyDown = () => {
    if (live || clerk) return;
    downAt.current = Date.now();
    setLive(true);
    tone.start();
  };
  const keyUp = () => {
    if (!live) return;
    setLive(false);
    tone.stop();
    mark(Date.now() - downAt.current < DOT_MS ? '.' : '-');
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

  // The clerk sends the rest: each letter's dots and dashes, then on to the next.
  const [clerkOn, setClerkOn] = useState(false);
  useEffect(() => {
    if (!clerk) return;
    if (!current) {
      setClerk(false);
      return;
    }
    const tl = morseTimeline(current.char, MORSE, CLERK_UNIT);
    let i = 0;
    let timer = 0;
    const tick = () => {
      if (i >= tl.length) {
        setClerkOn(false);
        tone.stop();
        setTap('');
        setAt((a) => a + 1);
        return;
      }
      const piece = tl[i++];
      setClerkOn(piece.on);
      if (piece.on) tone.start();
      else tone.stop();
      timer = window.setTimeout(tick, reduced ? 0 : piece.ms);
    };
    tick();
    return () => window.clearTimeout(timer);
    // One letter at a time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerk, at]);
  useEffect(() => {
    if (clerk && sentAll) {
      setClerk(false);
      setBurst((b) => b + 1);
      setStatus('The clerk has sent your whole telegram.');
    }
  }, [clerk, sentAll]);

  const [printing, setPrinting] = useState(false);
  const donePrinting = useCallback(() => setPrinting(false), []);
  usePrintSheet(printing, donePrinting);

  const goStep = (i: number) => {
    const s = Math.max(0, Math.min(SEND_STEPS.length - 1, i));
    setStep(s);
    setClerk(false);
    setStatus(`Step ${s + 1}: ${SEND_STEPS[s].title}.`);
  };

  /* ── Receive ── */
  const [inN, setInN] = useState(0);
  const incoming = INCOMING[inN % INCOMING.length];
  const inCells = toMorse(incoming, MORSE);
  const inLetters = inCells.map((c, i) => (c.char === ' ' ? -1 : i)).filter((i) => i >= 0);
  const [heard, setHeard] = useState(-1); // the last letter whose code has come up on the tape
  const [lamp, setLamp] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guesses, setGuesses] = useState<Record<number, string>>({});
  const [miss, setMiss] = useState<{ slot: number; n: number } | null>(null);
  const slot = inLetters.find((i) => !guesses[i]) ?? -1;
  const decoded = inLetters.every((i) => guesses[i]);

  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      setHeard(inCells.length - 1);
    }
    const tl = morseTimeline(incoming, MORSE, RECEIVE_UNIT);
    let i = 0;
    let timer = 0;
    const tick = () => {
      if (i >= tl.length) {
        setLamp(false);
        tone.stop();
        setPlaying(false);
        setHeard(inCells.length - 1);
        setStatus('The telegram is in. Decode it from the chart.');
        return;
      }
      const piece = tl[i++];
      if (!reduced) setLamp(piece.on);
      if (piece.on) tone.start();
      else tone.stop();
      setHeard((h) => Math.max(h, piece.on ? piece.letter : piece.letter - 1));
      timer = window.setTimeout(tick, piece.ms);
    };
    tick();
    return () => {
      window.clearTimeout(timer);
      tone.stop();
    };
    // Plays once each time it is started.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const guess = (letter: string) => {
    if (slot < 0 || heard < 0) return;
    const want = inCells[slot].char;
    if (letter === want) {
      const next = { ...guesses, [slot]: letter };
      setGuesses(next);
      setMiss(null);
      if (inLetters.every((i) => next[i])) {
        setBurst((b) => b + 1);
        setStatus(`Well decoded! The telegram says: ${incoming}.`);
      } else setStatus(`${letter}. Right!`);
    } else {
      setMiss((m) => ({ slot, n: (m?.n ?? 0) + 1 }));
      setStatus(`Not ${letter}. Look again: ${marks(inCells[slot].code)}.`);
    }
  };
  const newIncoming = () => {
    setInN((n) => n + 1);
    setGuesses({});
    setHeard(-1);
    setMiss(null);
    setPlaying(false);
    setStatus('A new telegram is waiting. Press Play.');
  };

  // Letters typed on the keyboard fill the next slot, while decoding.
  useEffect(() => {
    if (mode !== 'receive') return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k.length === 1 && MORSE[k]) guess(k);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const chartPick = mode === 'receive' ? guess : undefined;

  const sendFacts = step === 0 ? [NOTES.telegramPrice, NOTES.telegramForm] : step === 1 ? [NOTES.morse, NOTES.morseBritain] : [NOTES.telegramForm];

  return (
    <div className="vbi-bench vbi-telegram">
      <div className="vbr-scene vbi-scene">
        <div className="vbi-tg" data-mode={mode}>
          {mode === 'send' ? (
            <section className="vbi-tg-form" aria-label="Your telegram form">
              <header className="vbi-tg-head">
                <span className="vbi-tg-titles">
                  <span className="vbi-tg-title">Telegram</span>
                  <span className="vbi-tg-code-name">{TELEGRAM.morseNote}</span>
                </span>
                <span className="vbi-tg-meta">
                  {words.length} word{words.length === 1 ? '' : 's'} · {cost ? oldMoney(cost) : '—'}
                </span>
              </header>
              <MessageCells cells={cells} at={step === 1 || step === 2 ? at : -1} tapIdx={step === 1 && current ? letterIdx[at] : -1} wrong={wrong} empty="Write your telegram on the card." />
              {step === 1 && (
                <p className="vbi-tg-tapped" aria-hidden="true">
                  <span className="vbi-tg-lamp" data-on={live || clerkOn || undefined} />
                  <span className="vbi-tg-tapmarks">{tap ? marks(tap) : ' '}</span>
                </p>
              )}
            </section>
          ) : (
            <section className="vbi-tg-form vbi-tg-in" aria-label="The telegram coming in">
              <header className="vbi-tg-head">
                <span className="vbi-tg-titles">
                  <span className="vbi-tg-title">Incoming</span>
                  <span className="vbi-tg-code-name">{TELEGRAM.morseNote}</span>
                </span>
                <span className="vbi-tg-lamp vbi-tg-lamp-big" data-on={lamp || undefined} aria-hidden="true" />
              </header>
              <ol className="vbi-tg-cells vbi-tg-decode" aria-label="The telegram, letter by letter">
                {byWord(inCells).map((w, k) => (
                  <li key={k} className="vbi-tg-word">
                    {w.map(({ c, i }) => (
                      <span key={i} className="vbi-tg-cell" data-current={(i === slot && heard >= 0) || undefined} data-done={guesses[i] ? true : undefined} data-miss={miss && miss.slot === i ? miss.n : undefined}>
                        <span className="vbi-tg-code" data-shown={heard >= i || undefined} aria-label={heard >= i ? spoken(c.code) : 'not yet'}>
                          <Marks code={c.code} />
                        </span>
                        <span className="vbi-tg-char" aria-label={guesses[i] ? guesses[i] : 'blank'}>
                          {guesses[i] ?? ' '}
                        </span>
                      </span>
                    ))}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {/* The chart, while there is Morse to tap or to read: not while the telegram is being written. */}
          {!(mode === 'send' && step !== 1) && <MorseChart highlight={mode === 'send' && step === 1 ? current?.char : undefined} onPick={chartPick} disabled={mode === 'receive' && (heard < 0 || decoded)} />}
          <span className="vbi-tg-cheer">
            <Celebrate burst={(mode === 'send' && sentAll) || (mode === 'receive' && decoded) ? burst : 0} reduced={reduced} />
          </span>
        </div>
      </div>

      <div className="vbr-card vbi-card">
        {modes}
        {mode === 'send' ? (
          <>
            <StepDots steps={SEND_STEPS.map((s) => ({ ...s }))} at={step} done={(i) => (i === 0 ? words.length > 0 : i === 1 ? sentAll : false)} onGo={goStep} label="Send a telegram, step by step" />
            <div className="vbi-step-area">
              {step === 0 && (
                <>
                  <label className="vbr-field">
                    <span className="vbr-label">Your telegram</span>
                    <textarea rows={2} value={text} onChange={(e) => write(e.target.value)} autoComplete="off" spellCheck={false} placeholder="ARRIVING BATH NOON" />
                  </label>
                  <p className="vbi-tg-price" aria-live="polite">
                    <span className="vbi-coins" aria-hidden="true">
                      <span className="vbi-coin">6d</span>
                      {Array.from({ length: Math.min(over, 8) }, (_, i) => (
                        <span key={i} className="vbi-coin vbi-coin-half">
                          ½
                        </span>
                      ))}
                    </span>
                    <span>
                      <strong className="vbi-tnum">{words.length}</strong> of {TELEGRAM.words} words for sixpence.{' '}
                      {over > 0 ? (
                        <>
                          {over} more: <strong>{oldMoney(cost)}</strong>
                        </>
                      ) : null}
                    </span>
                  </p>
                  <p className="vbr-note vbi-rule">{TELEGRAM.rule}</p>
                  <div className="vbr-options vbi-tg-ideas" role="group" aria-label="Ideas for a telegram">
                    {TELEGRAM_IDEAS.map((w) => (
                      <button key={w} type="button" className="vbr-option" onClick={() => write(w)}>
                        {w}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  {!letterIdx.length ? (
                    <p className="vbi-step-body">First write your telegram.</p>
                  ) : (
                    <p className="vbi-big-readout vbi-readout vbi-tg-now" aria-live="polite">
                      {sentAll ? (
                        'Sent! Every letter is on its way.'
                      ) : (
                        <>
                          Letter {at + 1} of {letterIdx.length}: <strong className="vbi-tnum">{current?.char}</strong> <span className="vbi-tg-want">{current ? marks(current.code) : ''}</span>
                        </>
                      )}
                    </p>
                  )}
                  <button
                    type="button"
                    className="vbi-key-button"
                    data-live={live || clerkOn || undefined}
                    aria-pressed={live}
                    disabled={!current || clerk}
                    onPointerDown={(e) => {
                      try {
                        e.currentTarget.setPointerCapture?.(e.pointerId);
                      } catch {}
                      keyDown();
                    }}
                    onPointerUp={keyUp}
                    onPointerCancel={keyUp}
                    onLostPointerCapture={keyUp}
                    onContextMenu={(e) => e.preventDefault()}
                    {...keyKeys}
                  >
                    {live ? 'Tapping…' : 'The key: tap • hold —'}
                  </button>
                  <div className="vbr-actions vbi-tg-row">
                    <button type="button" className="vbr-button vbi-markbutton" onClick={() => mark('.')} disabled={!current || clerk} aria-label="Dot">
                      <Marks code="." />
                    </button>
                    <button type="button" className="vbr-button vbi-markbutton" onClick={() => mark('-')} disabled={!current || clerk} aria-label="Dash">
                      <Marks code="-" />
                    </button>
                    <SoundToggle on={sound} set={setSound} />
                  </div>
                  <button type="button" className="vbr-button vbr-button-quiet vbi-clerk" onClick={() => setClerk(true)} disabled={!current || clerk}>
                    Let the clerk send the rest
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="vbi-step-body">Address it, then print it: your telegram with its Morse code under every letter.</p>
                  <div className="vbi-tg-names">
                    <label className="vbr-field">
                      <span className="vbr-label">To</span>
                      <input type="text" value={to} onChange={(e) => setTo(e.target.value.slice(0, 30))} maxLength={30} autoComplete="off" />
                    </label>
                    <label className="vbr-field">
                      <span className="vbr-label">From</span>
                      <input type="text" value={from} onChange={(e) => setFrom(e.target.value.slice(0, 30))} maxLength={30} autoComplete="off" />
                    </label>
                  </div>
                  <div className="vbr-actions">
                    <button
                      type="button"
                      className="vbr-button vbr-button-primary"
                      onClick={() => {
                        setPrinting(true);
                        setStatus('Printing your telegram.');
                      }}
                      disabled={!letterIdx.length}
                    >
                      Print my telegram
                    </button>
                  </div>
                  <p className="vbr-note">Nothing you write is saved or sent.</p>
                </>
              )}
            </div>
            <CardFoot at={step} count={SEND_STEPS.length} onGo={goStep} facts={sendFacts} poster={POSTER.innovations} reset={`send${step}`} />
          </>
        ) : (
          <>
            <p className="vbi-step-body">Watch the lamp. Then match each group of dots and dashes to a letter in the chart.</p>
            <div className="vbi-step-area">
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={() => setPlaying(true)} disabled={playing}>
                  {heard < 0 ? 'Play the telegram' : playing ? 'Playing…' : 'Play it again'}
                </button>
                <button type="button" className="vbr-button" onClick={newIncoming}>
                  Another telegram
                </button>
              </div>
              <SoundToggle on={sound} set={setSound} />
              <div className="vbi-feedback" aria-live="polite" data-verdict={decoded ? 'right' : miss ? 'wrong' : undefined}>
                <p className={decoded || miss ? 'vbi-verdict' : 'vbi-verdict vbi-verdict-quiet'}>
                  {decoded ? `Well decoded! “${incoming}”` : miss ? 'Not that one: look again.' : heard < 0 ? 'Press Play to receive it.' : 'Press a letter in the chart, or type it.'}
                </p>
              </div>
              {heard >= 0 && !decoded && (
                <button
                  type="button"
                  className="vbr-button vbr-button-quiet"
                  onClick={() => {
                    setGuesses(Object.fromEntries(inLetters.map((i) => [i, inCells[i].char])));
                    setHeard(inCells.length - 1);
                    setStatus(`The telegram says: ${incoming}.`);
                  }}
                >
                  Show me the answer
                </button>
              )}
            </div>
            <CardFoot facts={[NOTES.morse, NOTES.morseBritain, NOTES.telegramForm]} poster={POSTER.innovations} reset={inN} />
          </>
        )}
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>

      {printing &&
        createPortal(
          <div className="vbr-print-root vbi-print-root" data-exhibition="victorian">
            <TelegramSheet to={to} from={from} cells={cells} words={words.length} cost={cost} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** A letter's code drawn as dots and dashes, sized by the text around it (its words are given by whatever holds it). */
function Marks({ code }: { code: string }) {
  return (
    <span className="vbi-marks" aria-hidden="true">
      {code.split('').map((m, i) => (
        <i key={i} className={m === '.' ? 'vbi-m-dot' : 'vbi-m-dash'} />
      ))}
    </span>
  );
}

/** A message's cells in words, each cell with its place in the message. */
function byWord(cells: { char: string; code: string }[]) {
  const words: { c: { char: string; code: string }; i: number }[][] = [[]];
  cells.forEach((c, i) => {
    if (c.char === ' ') words.push([]);
    else words[words.length - 1].push({ c, i });
  });
  return words.filter((w) => w.length);
}

function SoundToggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" className="vbr-option vbi-sound" aria-pressed={on} onClick={() => set(!on)}>
      <span aria-hidden="true">{on ? '🔊' : '🔈'}</span> Sound {on ? 'on' : 'off'}
    </button>
  );
}

/** The message in fixed slots: each letter over its code; sent letters green, the one to tap lit, the rest waiting. */
function MessageCells({ cells, at, tapIdx, wrong, empty }: { cells: { char: string; code: string }[]; at: number; tapIdx: number; wrong: number; empty: string }) {
  const list = useRef<HTMLOListElement>(null);
  // Keeps the letter being tapped in view inside the form (never scrolls the page).
  useEffect(() => {
    const ol = list.current;
    const cur = ol?.querySelector<HTMLElement>('[data-current]');
    if (!ol || !cur) return;
    const top = cur.offsetTop - ol.offsetTop;
    if (top < ol.scrollTop || top + cur.offsetHeight > ol.scrollTop + ol.clientHeight) ol.scrollTop = top - 4;
  }, [tapIdx]);
  if (!cells.length) return <p className="vbi-tg-empty">{empty}</p>;
  // The how-manyth letter each cell is (spaces not counted), to know which are sent.
  const nth = new Map<number, number>();
  cells.forEach((c, i) => {
    if (c.char !== ' ') nth.set(i, nth.size);
  });
  return (
    <ol ref={list} className="vbi-tg-cells" aria-label="Your telegram, letter by letter">
      {byWord(cells).map((w, k) => (
        <li key={k} className="vbi-tg-word">
          {w.map(({ c, i }) => (
            <span key={i} className="vbi-tg-cell" data-done={(at >= 0 && (nth.get(i) ?? 0) < at) || undefined} data-current={i === tapIdx || undefined} data-miss={i === tapIdx && wrong ? wrong : undefined}>
              <span className="vbi-tg-char">{c.char}</span>
              <span className="vbi-tg-code" data-shown aria-label={spoken(c.code)}>
                <Marks code={c.code} />
              </span>
            </span>
          ))}
        </li>
      ))}
    </ol>
  );
}

/** The International Morse chart, A to Z. Lit: the letter to tap. In decoding, each letter is a button. */
function MorseChart({ highlight, onPick, disabled }: { highlight?: string; onPick?: (l: string) => void; disabled?: boolean }) {
  return (
    <div className="vbi-chart" role={onPick ? 'group' : undefined} aria-label="International Morse code chart">
      <ul className="vbi-chart-grid">
        {LETTERS.map((l) => (
          <li key={l} className="vbi-chart-cell" data-lit={highlight === l || undefined}>
            {onPick ? (
              <button type="button" className="vbi-chart-button" onClick={() => onPick(l)} disabled={disabled} aria-label={`${l}: ${spoken(MORSE[l])}`}>
                <span className="vbi-chart-l">{l}</span>
                <span className="vbi-chart-c">
                  <Marks code={MORSE[l]} />
                </span>
              </button>
            ) : (
              <span className="vbi-chart-face">
                <span className="vbi-chart-l">{l}</span>
                <span className="vbi-chart-c" aria-label={spoken(MORSE[l])}>
                  <Marks code={MORSE[l]} />
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The telegram form to print: to and from, the message a word to a box, each letter's Morse beneath it, and the price. */
function TelegramSheet({ to, from, cells, words, cost }: { to: string; from: string; cells: { char: string; code: string }[]; words: number; cost: number }) {
  const groups: { char: string; code: string }[][] = [[]];
  for (const c of cells) {
    if (c.char === ' ') groups.push([]);
    else groups[groups.length - 1].push(c);
  }
  return (
    <article className="vbi-sheet vbi-tg-sheet">
      <header className="vbi-sheet-head">
        <p className="vbi-sheet-kicker">Victorian Britain · Inventions Workshop</p>
        <h1>Telegram</h1>
      </header>
      <dl className="vbi-tg-sheet-to">
        <div>
          <dt>To</dt>
          <dd>{to.trim() || ' '}</dd>
        </div>
        <div>
          <dt>From</dt>
          <dd>{from.trim() || ' '}</dd>
        </div>
        <div>
          <dt>Words</dt>
          <dd>
            {words} · {oldMoney(cost)}
          </dd>
        </div>
      </dl>
      <div className="vbi-tg-sheet-msg">
        {groups
          .filter((g) => g.length)
          .map((g, i) => (
            <span key={i} className="vbi-tg-sheet-word">
              {g.map((c, j) => (
                <span key={j} className="vbi-tg-sheet-cell">
                  <span className="vbi-tg-sheet-l">{c.char}</span>
                  <span className="vbi-tg-sheet-c">
                    <Marks code={c.code} />
                  </span>
                </span>
              ))}
            </span>
          ))}
      </div>
      {/* The chart, so whoever it is sent to can read the Morse too. */}
      <ul className="vbi-tg-sheet-chart" aria-label="International Morse code chart">
        {LETTERS.map((l) => (
          <li key={l}>
            <strong>{l}</strong>
            <Marks code={MORSE[l]} />
          </li>
        ))}
      </ul>
      <footer className="vbi-sheet-credits">
        <p>
          In International Morse code. {TELEGRAM.words} words for sixpence, as the Post Office charged; each word more a halfpenny, by the workshop’s game rule.
        </p>
        <p>Facts: BT Archives; Science Museum Group; Library of Congress.</p>
      </footer>
    </article>
  );
}
