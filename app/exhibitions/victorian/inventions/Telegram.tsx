'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Celebrate from '../Celebrate';
import { usePrintSheet } from '../usePrintSheet';
import { INCOMING, INCOMING_NOTE, MORSE, POSTER, TELEGRAM, TELEGRAM_DRAFTS } from './inventionsText';
import { Marks, SoundToggle, useTone } from './morseKit';
import { coinsFor, purseFor, wordsFor } from './office';
import { RECEIVE_FACTS, SEND_FACTS } from './sources';
import { CardFoot, StepDots } from './Steps';
import { marks, morseTimeline, oldMoney, spoken, telegramCost, telegramWords, toMorse } from './workshop';
import { useMuseumSound } from '@/lib/museumSound';

/*
 * Telegrams, in International Morse code (said so on the page).
 *
 * Send one, as a Victorian did, at the telegraph office's counter. You
 * have a little money in your purse (the game's: 6d, 7d or 8d). Write
 * your telegram on the form (or start from a long, chatty letter), and
 * hand it over the counter: twelve words cost sixpence, as the Post Office
 * charged, and each word more a halfpenny (the room's game rule, said so).
 * Too long, and the clerk tells you what it costs and what you have, and
 * you tap words on the form to cross them out until it fits. Then the
 * telegraph clerk, not you, taps it out on the key, letter by letter, the
 * lamp flashing (and the sounder sounding, if sound is on). Last, address
 * it and print it: your telegram with its Morse code under every letter.
 *
 * Or receive one: one of many made-up telegrams, chosen at random, comes
 * in on the lamp (with its sound, if sound is on), its dots and dashes come
 * up on the tape, and you decode it letter by letter from the chart.
 *
 * Sound is off until it is turned on. The letters sit in fixed slots, so
 * nothing shifts as they are sent or found; only colour and opacity
 * change. Under reduced motion the clerk's sending and the tape come up
 * whole and the lamp stays still.
 */

/** The clerk's speed, and the incoming telegram's, as one Morse unit. */
const CLERK_UNIT = 90;
const RECEIVE_UNIT = 130;
const LETTERS = Object.keys(MORSE);
/** The letters to start from, by a short name. */
const DRAFT_NAMES = ['Ada’s letter', 'Tom’s letter', 'The new puppy'];

export type TelegramMode = 'send' | 'receive';
const SEND_STEPS = [
  { id: 'write', title: 'Write it and pay' },
  { id: 'clerk', title: 'The clerk sends it' },
  { id: 'print', title: 'Address it and print it' },
] as const;

/** A random number from 0 to 1, read only in event handlers (never while rendering). */
const roll = () => Math.random();

export default function TelegramBench({ mode, reduced, modes, seed }: { mode: TelegramMode; reduced: boolean; modes: ReactNode; seed: number }) {
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  // The museum's one sound switch (lib/museumSound.ts).
  const [sound, setSound] = useMuseumSound();
  const tone = useTone(sound);

  /* ── Send: write and pay, the clerk sends it, address and print ── */
  const [purse, setPurse] = useState(() => purseFor(seed));
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [crossed, setCrossed] = useState<Set<number>>(() => new Set());
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [clerkSays, setClerkSays] = useState<{ ok: boolean; words: string } | null>(null);
  const [handed, setHanded] = useState(false);
  const words = telegramWords(text);
  const kept = words.filter((_, i) => !crossed.has(i));
  const message = kept.join(' ');
  const cells = toMorse(message, MORSE);
  const letterIdx = cells.map((c, i) => (c.char === ' ' ? -1 : i)).filter((i) => i >= 0);
  const cost = telegramCost(kept.length, TELEGRAM.words, TELEGRAM.extraHalfpence);
  const fits = kept.length > 0 && cost <= purse;
  const canBuy = wordsFor(purse);
  // Where sixpence's twelve words end on the form: the index of the twelfth word kept.
  const sixpenceEnd = (() => {
    let n = 0;
    for (let i = 0; i < words.length; i++) {
      if (crossed.has(i)) continue;
      n += 1;
      if (n === TELEGRAM.words) return i;
    }
    return -1;
  })();

  const write = (v: string) => {
    const ws = v.toUpperCase().replace(/[^A-Z\s]/g, '');
    // No more than the most words the form takes.
    const parts = ws.split(/(\s+)/);
    let n = 0;
    const out: string[] = [];
    for (const p of parts) {
      if (/\S/.test(p)) n += 1;
      if (n > TELEGRAM.maxWords) break;
      out.push(p);
    }
    setText(out.join(''));
    setCrossed(new Set());
    setClerkSays(null);
  };

  const cross = (i: number) => {
    const next = new Set(crossed);
    const was = next.has(i);
    if (was) next.delete(i);
    else next.add(i);
    setCrossed(next);
    setClerkSays(null);
    const n = words.length - next.size;
    const c = telegramCost(n, TELEGRAM.words, TELEGRAM.extraHalfpence);
    setStatus(`${words[i]} ${was ? 'put back' : 'crossed out'}. ${n} word${n === 1 ? '' : 's'}: ${oldMoney(c)}. You have ${oldMoney(purse)}.`);
  };

  /* The clerk at the key: the telegram's dots and dashes, letter by letter, the lamp lit while the key is down. */
  const [clerkRun, setClerkRun] = useState(0);
  const [clerkCell, setClerkCell] = useState(-1);
  const [clerkOn, setClerkOn] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!clerkRun) return;
    const tl = morseTimeline(message, MORSE, CLERK_UNIT);
    let i = 0;
    let timer = 0;
    const tick = () => {
      if (i >= tl.length) {
        setClerkOn(false);
        tone.stop();
        setClerkCell(cells.length);
        setSent(true);
        setBurst((b) => b + 1);
        setStatus('Sent! Your telegram is on its way down the wire.');
        return;
      }
      const piece = tl[i++];
      setClerkOn(piece.on);
      if (piece.on) tone.start();
      else tone.stop();
      setClerkCell(piece.letter);
      timer = window.setTimeout(tick, piece.ms);
    };
    timer = window.setTimeout(tick, 400);
    return () => {
      window.clearTimeout(timer);
      tone.stop();
    };
    // Runs once each time the clerk starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkRun]);
  const finishSending = () => {
    setClerkRun(0);
    setClerkOn(false);
    tone.stop();
    setClerkCell(cells.length);
    setSent(true);
    setStatus('Sent! Your telegram is on its way down the wire.');
  };
  const clerkLettersDone = clerkCell < 0 ? 0 : letterIdx.filter((i) => i < clerkCell).length;
  const clerkLetter = clerkCell >= 0 && clerkCell < cells.length ? cells[clerkCell] : null;

  const handOver = () => {
    if (!kept.length) {
      setClerkSays({ ok: false, words: '“Your form is empty! Write your telegram first, please.”' });
      setStatus('Write your telegram first.');
      return;
    }
    if (!fits) {
      const cut = kept.length - canBuy;
      const says = `“That will be ${oldMoney(cost)}, please.” You only have ${oldMoney(purse)}. Tap words on the form to cross ${cut === 1 ? 'one' : cut} out: ${oldMoney(purse)} pays for ${canBuy} words.`;
      setClerkSays({ ok: false, words: says });
      setStatus(says);
      return;
    }
    const change = purse - cost;
    setClerkSays({ ok: true, words: `“${oldMoney(cost)}. Thank you!”${change ? ` Your change: ${oldMoney(change)}.` : ''}` });
    setHanded(true);
    setStep(1);
    setSent(false);
    setClerkCell(-1);
    if (reduced) {
      setClerkCell(cells.length);
      setSent(true);
      setStatus('Paid. The clerk has sent your telegram.');
    } else {
      setClerkRun((r) => r + 1);
      setStatus(`Paid ${oldMoney(cost)}. The clerk taps your telegram out on the key.`);
    }
  };

  const newCustomer = () => {
    setPurse(purseFor(roll()));
    setText('');
    setCrossed(new Set());
    setClerkSays(null);
    setHanded(false);
    setSent(false);
    setClerkRun(0);
    setClerkCell(-1);
    setStep(0);
    setStatus('A new telegram, and a new purse.');
  };

  const [printing, setPrinting] = useState(false);
  const donePrinting = useCallback(() => setPrinting(false), []);
  usePrintSheet(printing, donePrinting);

  const goStep = (i: number) => {
    const s = Math.max(0, Math.min(SEND_STEPS.length - 1, i));
    if (s > 0 && !handed) {
      setClerkSays({ ok: false, words: '“Hand your form over the counter first, please.”' });
      setStatus('Hand your telegram over the counter first.');
      return;
    }
    if (s === 2 && !sent) finishSending();
    setStep(s);
    setStatus(`Step ${s + 1}: ${SEND_STEPS[s].title}.`);
  };

  /* ── Receive ── */
  const [inIdx, setInIdx] = useState<number | null>(null);
  const incoming = inIdx === null ? '' : INCOMING[inIdx];
  const inCells = toMorse(incoming, MORSE);
  const inLetters = inCells.map((c, i) => (c.char === ' ' ? -1 : i)).filter((i) => i >= 0);
  const [heard, setHeard] = useState(-1); // the last letter whose code has come up on the tape
  const [lamp, setLamp] = useState(false);
  const [playing, setPlaying] = useState(0);
  const [guesses, setGuesses] = useState<Record<number, string>>({});
  const [miss, setMiss] = useState<{ slot: number; n: number } | null>(null);
  const slot = inLetters.find((i) => !guesses[i]) ?? -1;
  const decoded = inLetters.length > 0 && inLetters.every((i) => guesses[i]);

  useEffect(() => {
    if (!playing) return;
    const tl = morseTimeline(incoming, MORSE, RECEIVE_UNIT);
    let i = 0;
    let timer = 0;
    const tick = () => {
      if (i >= tl.length) {
        setLamp(false);
        tone.stop();
        setPlaying(0);
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

  const play = () => {
    const idx = inIdx ?? Math.floor(roll() * INCOMING.length);
    if (inIdx === null) setInIdx(idx);
    // Under reduced motion the whole telegram comes up on the tape at once.
    if (reduced) setHeard(toMorse(INCOMING[idx], MORSE).length - 1);
    setPlaying((p) => p + 1);
  };

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
    // Another telegram, never the same one twice in a row.
    const n = INCOMING.length;
    const idx = inIdx === null ? Math.floor(roll() * n) : (inIdx + 1 + Math.floor(roll() * (n - 1))) % n;
    setInIdx(idx);
    setGuesses({});
    setHeard(-1);
    setMiss(null);
    setPlaying(0);
    setLamp(false);
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

  if (mode === 'receive')
    return (
      <div className="vbi-bench vbi-telegram" data-look="receive">
        <div className="vbr-scene vbi-scene">
          <div className="vbi-tg" data-mode="receive">
            <section className="vbi-tg-form vbi-tg-in" aria-label="The telegram coming in">
              <header className="vbi-tg-head">
                <span className="vbi-tg-titles">
                  <span className="vbi-tg-title">Incoming</span>
                  <span className="vbi-tg-code-name">{TELEGRAM.morseNote}</span>
                </span>
                <span className="vbi-tg-lamp vbi-tg-lamp-big" data-on={lamp || undefined} aria-hidden="true" />
              </header>
              {inIdx === null ? (
                <p className="vbi-tg-empty">A telegram is waiting for you. Press Play.</p>
              ) : (
                <ol className="vbi-tg-cells vbi-tg-decode" aria-label="The telegram, letter by letter">
                  {byWord(inCells).map((w, k) => (
                    <li key={k} className="vbi-tg-word">
                      {w.map(({ c, i }) => (
                        <span key={i} className="vbi-tg-cell" data-current={(i === slot && heard >= 0) || undefined} data-done={guesses[i] ? true : undefined} data-miss={miss && miss.slot === i ? miss.n : undefined}>
                          <span className="vbi-tg-code" data-shown={heard >= i || undefined} aria-label={heard >= i ? spoken(c.code) : 'not yet'}>
                            <Marks code={c.code} />
                          </span>
                          <span className="vbi-tg-char" aria-label={guesses[i] ? guesses[i] : 'blank'}>
                            {guesses[i] ?? ' '}
                          </span>
                        </span>
                      ))}
                    </li>
                  ))}
                </ol>
              )}
            </section>
            <MorseChart onPick={guess} disabled={heard < 0 || decoded} />
            <span className="vbi-tg-cheer">
              <Celebrate burst={decoded ? burst : 0} reduced={reduced} />
            </span>
          </div>
        </div>

        <div className="vbr-card vbi-card">
          {modes}
          <p className="vbi-step-body">Watch the lamp. Then match each group of dots and dashes to a letter in the chart.</p>
          <div className="vbi-step-area">
            <div className="vbr-actions">
              <button type="button" className="vbr-button vbr-button-primary" onClick={play} disabled={playing > 0}>
                {heard < 0 ? 'Play the telegram' : playing ? 'Playing…' : 'Play it again'}
              </button>
              <button type="button" className="vbr-button" onClick={newIncoming} disabled={playing > 0}>
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
            <p className="vbr-note">{INCOMING_NOTE}</p>
          </div>
          <CardFoot facts={RECEIVE_FACTS} poster={POSTER.innovations} reset={inIdx} />
        </div>
        <p className="vbr-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    );

  /* ── The telegraph office's counter ── */
  const sendFacts = SEND_FACTS[step];
  const coins = coinsFor(purse);
  return (
    <div className="vbi-bench vbi-telegram vbi-office" data-look="office" data-step={SEND_STEPS[step].id}>
      <div className="vbr-scene vbi-scene">
        <div className="vbi-office-desk">
          <section className="vbi-tg-form vbi-office-form" aria-label="Your telegram form">
            <header className="vbi-tg-head">
              <span className="vbi-tg-titles">
                <span className="vbi-tg-title">Telegram</span>
                <span className="vbi-tg-code-name">{step === 0 ? 'Write in capitals, one word to a box' : TELEGRAM.morseNote}</span>
              </span>
              <span className="vbi-tg-meta">
                {kept.length} word{kept.length === 1 ? '' : 's'} · {kept.length ? oldMoney(cost) : '—'}
              </span>
            </header>
            {step === 0 ? (
              words.length ? (
                <ol className="vbi-office-words" aria-label="Your telegram, word by word. Tap a word to cross it out.">
                  {words.map((w, i) => (
                    <li key={i} className="vbi-office-word">
                      <button type="button" className="vbi-office-token" aria-pressed={crossed.has(i)} onClick={() => cross(i)}>
                        {w}
                      </button>
                      {i === sixpenceEnd && i < words.length - 1 && (
                        <span className="vbi-office-sixpence" aria-hidden="true">
                          12 words: 6d
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="vbi-tg-empty">Write your telegram on the card. It comes up here, word by word.</p>
              )
            ) : (
              <MessageCells cells={cells} at={step === 1 ? clerkLettersDone : -1} tapIdx={step === 1 && !sent && clerkLetter ? clerkCell : -1} wrong={0} empty="" />
            )}
          </section>

          {step === 0 ? (
            <div className="vbi-purse" data-ok={(kept.length > 0 && fits) || undefined} data-short={(kept.length > 0 && !fits) || undefined}>
              <p className="vbi-purse-label">In your purse</p>
              <ul className="vbi-purse-coins" aria-label={`In your purse: ${oldMoney(purse)}`}>
                {coins.map((c, i) => (
                  <li key={i} className="vbi-coin" data-coin={c}>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="vbi-purse-sum">
                <strong className="vbi-tnum">{oldMoney(purse)}</strong>
                <span className="vbi-purse-cost">{kept.length ? (fits ? `Costs ${oldMoney(cost)}: enough!` : `Costs ${oldMoney(cost)}: not enough!`) : ' '}</span>
              </p>
            </div>
          ) : (
            <div className="vbi-clerk" data-on={clerkOn || undefined} aria-hidden="true">
              <ClerkKey down={clerkOn} />
              <p className="vbi-clerk-now">
                <span className="vbi-tg-lamp vbi-tg-lamp-big" data-on={clerkOn || undefined} />
                <span className="vbi-clerk-letter">{step === 1 && clerkLetter && !sent ? clerkLetter.char : ' '}</span>
                <span className="vbi-tg-tapmarks">{step === 1 && clerkLetter && !sent ? marks(clerkLetter.code) : ' '}</span>
              </p>
              <p className="vbi-clerk-name">The telegraph clerk</p>
            </div>
          )}
          <span className="vbi-tg-cheer">
            <Celebrate burst={sent && step === 1 ? burst : 0} reduced={reduced} />
          </span>
        </div>
      </div>

      <div className="vbr-card vbi-card vbi-office-card">
        {modes}
        <StepDots steps={SEND_STEPS.map((s) => ({ ...s }))} at={step} done={(i) => (i === 0 ? handed : i === 1 ? sent : false)} onGo={goStep} label="Send a telegram, step by step" />
        <div className="vbi-step-area">
          {step === 0 && (
            <>
              <p className="vbi-step-body">
                You have <strong>{oldMoney(purse)}</strong> to spend. Twelve words cost sixpence. Write your telegram, then hand it over the counter.
              </p>
              <label className="vbr-field">
                <span className="vbr-label">Your telegram</span>
                <textarea rows={2} value={text} onChange={(e) => write(e.target.value)} autoComplete="off" spellCheck={false} placeholder="ARRIVING BATH NOON" />
              </label>
              <div className="vbi-office-drafts">
                <span className="vbr-label" id="vbi-drafts-label">
                  Or start from a letter
                </span>
                <div className="vbr-options" role="group" aria-labelledby="vbi-drafts-label">
                  {TELEGRAM_DRAFTS.map((d, i) => (
                    <button key={d} type="button" className="vbr-option" onClick={() => write(d)}>
                      {DRAFT_NAMES[i]}
                    </button>
                  ))}
                </div>
              </div>
              {words.length > 0 && (
                <p className="vbi-task">
                  <span className="vbi-task-mark" aria-hidden="true">▸</span> Too long? Tap words on the form to cross them out.
                </p>
              )}
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={handOver}>
                  Hand it over the counter
                </button>
              </div>
              <div className="vbi-feedback vbi-clerk-says" aria-live="polite" data-verdict={clerkSays ? (clerkSays.ok ? 'right' : 'wrong') : undefined}>
                {clerkSays ? <p className="vbi-verdict">{clerkSays.words}</p> : <p className="vbi-verdict vbi-verdict-quiet">The clerk waits behind the counter.</p>}
              </div>
              <p className="vbr-note vbi-rule">
                {TELEGRAM.rule} {TELEGRAM.purseNote}
              </p>
            </>
          )}
          {step === 1 && (
            <>
              <p className="vbi-step-body">
                The telegraph clerk takes your form and taps it out on the key, letter by letter, in Morse code. <strong>You don’t work the key: the clerk does.</strong>
              </p>
              <p className="vbi-big-readout vbi-readout" aria-live="polite">
                {sent ? 'Sent! A messenger will carry it to the door.' : `Letter ${Math.min(clerkLettersDone + 1, letterIdx.length)} of ${letterIdx.length}`}
              </p>
              <div className="vbr-actions">
                <SoundToggle on={sound} set={setSound} />
                {!sent && (
                  <button type="button" className="vbr-button vbr-button-quiet" onClick={finishSending}>
                    Skip to the end
                  </button>
                )}
              </div>
              {clerkSays?.ok && <p className="vbr-note">{clerkSays.words}</p>}
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
                <button type="button" className="vbr-button" onClick={newCustomer}>
                  Send another
                </button>
              </div>
              <p className="vbr-note">Nothing you write is saved or sent.</p>
            </>
          )}
        </div>
        <CardFoot at={step} count={SEND_STEPS.length} onGo={goStep} facts={sendFacts} poster={POSTER.innovations} reset={`send${step}`} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>

      {printing &&
        createPortal(
          <div className="vbr-print-root vbi-print-root" data-exhibition="victorian">
            <TelegramSheet to={to} from={from} cells={cells} words={kept.length} cost={cost} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** The clerk's key, drawn: a brass lever on a wooden base, down while the clerk presses it. */
function ClerkKey({ down }: { down: boolean }) {
  return (
    <svg className="vbi-clerk-key" viewBox="0 0 240 120">
      <rect x="20" y="78" width="200" height="30" rx="6" fill="#7a4a34" />
      <circle cx="50" cy="70" r="9" fill="#c9a24a" />
      <circle cx="190" cy="72" r="9" fill="#c9a24a" />
      <g className="vbi-key-lever" style={{ transform: down ? 'rotate(7deg)' : 'rotate(0deg)', transformOrigin: '50px 62px' }}>
        <path d="M44 62 L196 40" stroke="#b8903a" strokeWidth="11" strokeLinecap="round" />
        <circle cx="200" cy="38" r="18" fill="#2a2522" />
      </g>
    </svg>
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
