'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { seededShuffle } from '@/components/games/scoring';
import { nextSeed, useClientSeed } from '@/components/games/useClientSeed';
import Celebrate from '../Celebrate';
import { POSTER, READ_WORDS, SEND_WORDS, WIRE_PARTS, type WirePartId } from './inventionsText';
import { NEEDLE_FACTS, WIRE_FACTS } from './sources';
import { CardFoot } from './Steps';
import TelegramBench from './Telegram';
import { DIAL, NEEDLES, needleAngles, spell } from './workshop';

/*
 * The telegraph bench, in four parts, each with its own look.
 *
 * Build a telegraph: the circuit drawn across the bench with five empty
 * places, each saying the job done there ("Makes the electric current",
 * "A switch: press it to send"...). Drag each part from the tray (or tap
 * it, then tap its place) to where it does its job; a part in the wrong
 * place says what it is and what that place needs. Each part, once in,
 * says what it does. With all five in, press the key: the current runs
 * along the wire, the coil glows and the needle swings.
 *
 * Then Cooke and Wheatstone's five-needle dial, Britain's telegraph of
 * 1837, its 20 letters set in a diamond round the row of needles (C, J, Q,
 * U, X and Z left off): press a letter and its two needles swing to point
 * to it; send a word and the needles spell it; or read one, the visitor
 * finding the letter the needles point to. Then the telegraph office:
 * telegrams sent and received (Telegram.tsx). Morse code has its own bench
 * (Morse.tsx).
 *
 * The parts come to the tray shuffled, never in the circuit's own order,
 * so each is matched to its place by what it does.
 *
 * The point: a child can say what each part of a telegraph does and why a
 * press of a key at one station moves a needle miles away, and read a
 * letter off Cooke and Wheatstone's needles, which the poster's one word,
 * "the telegraph", cannot show.
 *
 * The letters to find sit in fixed slots, and a right guess changes only
 * colour and size about its own centre, so nothing shifts as it is read.
 */

const SPELL_MS = 1400;
const W = 6;
const H = 5.4;
const left = (x: number) => `${(x / W) * 100}%`;
const top = (y: number) => `${((y + H / 2) / H) * 100}%`;
/** How far a press must move before it is a drag rather than a tap, in pixels. */
const DRAG_PX = 8;

/** Where each part's place is on the 1000 × 600 drawing: its centre, width and height. */
const SLOTS: Record<WirePartId, { x: number; y: number; w: number; h: number }> = {
  battery: { x: 108, y: 300, w: 170, h: 124 },
  key: { x: 292, y: 318, w: 150, h: 104 },
  wire: { x: 490, y: 336, w: 230, h: 132 },
  coil: { x: 810, y: 258, w: 160, h: 96 },
  needle: { x: 810, y: 128, w: 160, h: 132 },
};
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** A random number from 0 to 1, read only in event handlers (never while rendering). */
const roll = () => Math.random();

type Mode = 'build' | 'needles' | 'send' | 'receive';
/** The four parts, each with a short name for a phone's one row. */
const MODES: { id: Mode; label: string; short: string }[] = [
  { id: 'build', label: 'Build a telegraph', short: 'Build' },
  { id: 'needles', label: 'Needle dial', short: 'Needles' },
  { id: 'send', label: 'Send a telegram', short: 'Send' },
  { id: 'receive', label: 'Receive a telegram', short: 'Receive' },
];

export default function Telegraph({ reduced }: { reduced: boolean }) {
  const [mode, setMode] = useState<Mode>('build');
  // A number from 0 to 1, rolled each time the telegraph office opens: it picks the money in the visitor's purse.
  const [seed, setSeed] = useState(0);
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);

  /* ── Build a telegraph ── */
  const [placed, setPlaced] = useState<WirePartId[]>([]);
  const [picked, setPicked] = useState<WirePartId | null>(null);
  const [said, setSaid] = useState<{ ok: boolean; words: string } | null>(null);
  const [wrongAt, setWrongAt] = useState<{ slot: WirePartId; n: number } | null>(null);
  const [live, setLive] = useState(false);
  const [pressedOnce, setPressedOnce] = useState(false);
  const built = placed.length === WIRE_PARTS.length;
  // The tray in a shuffled order (never the circuit's own), so a part is matched to its place by its job, not by its turn.
  const clientSeed = useClientSeed();
  const [builds, setBuilds] = useState(0);
  const tray = useMemo(() => trayOrder(clientSeed === null ? null : nextSeed(clientSeed, builds)), [clientSeed, builds]);

  const place = (part: WirePartId, slot: WirePartId) => {
    if (placed.includes(slot)) return;
    const p = WIRE_PARTS.find((x) => x.id === part)!;
    const s = WIRE_PARTS.find((x) => x.id === slot)!;
    if (part !== slot) {
      setWrongAt((w) => ({ slot, n: (w?.n ?? 0) + 1 }));
      const words = `That’s the ${p.name.toLowerCase()}. This place needs the part that ${PART_DOES[s.id]}.`;
      setSaid({ ok: false, words });
      setStatus(words);
      return;
    }
    const next = [...placed, part];
    setPlaced(next);
    setPicked(null);
    setWrongAt(null);
    setSaid({ ok: true, words: p.line });
    if (next.length === WIRE_PARTS.length) {
      setBurst((b) => b + 1);
      setStatus(`${p.name} in place. Your telegraph is built! Press the key.`);
    } else setStatus(`${p.name} in place. ${p.line}`);
  };
  const tapSlot = (slot: WirePartId) => {
    if (!picked) {
      setStatus('First pick a part from the tray.');
      setSaid({ ok: false, words: 'First pick a part from the tray, then tap the place where it does its job.' });
      return;
    }
    place(picked, slot);
  };

  /* Dragging a part from the tray onto its place. */
  const drag = useRef<{ part: WirePartId; x: number; y: number; moved: boolean } | null>(null);
  const [ghost, setGhost] = useState<{ part: WirePartId; x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const partDown = (e: PointerEvent<HTMLButtonElement>, part: WirePartId) => {
    drag.current = { part, x: e.clientX, y: e.clientY, moved: false };
    dragged.current = false;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  };
  const partMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < DRAG_PX) return;
    d.moved = true;
    setGhost({ part: d.part, x: e.clientX, y: e.clientY });
  };
  const partUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    setGhost(null);
    if (!d?.moved) return;
    dragged.current = true;
    const under = typeof document.elementsFromPoint === 'function' ? document.elementsFromPoint(e.clientX, e.clientY) : [];
    const slot = under.map((el) => (el as HTMLElement).closest?.('[data-slot]')).find(Boolean) as HTMLElement | undefined;
    if (slot?.dataset.slot) place(d.part, slot.dataset.slot as WirePartId);
  };
  const tapPart = (part: WirePartId) => {
    // A drag ends in a click too: that click is not a tap.
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const p = WIRE_PARTS.find((x) => x.id === part)!;
    setPicked((x) => (x === part ? null : part));
    setStatus(picked === part ? `${p.name} put down.` : `${p.name} picked up. Now tap the place where it does its job.`);
  };

  /* The key, once the telegraph is built. */
  const keyDown = () => {
    if (live || !built) return;
    setLive(true);
    setPressedOnce(true);
    setStatus('The key is pressed: the current flows from the battery, along the wire, through the coil, and the needle swings.');
  };
  const keyUp = () => {
    if (!live) return;
    setLive(false);
    setStatus('The key is up: the current stops, and the needle stands upright again.');
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
  const rebuild = () => {
    setPlaced([]);
    setPicked(null);
    setSaid(null);
    setWrongAt(null);
    setLive(false);
    setPressedOnce(false);
    setBuilds((b) => b + 1);
    setStatus('The parts are back in the tray.');
  };

  /* ── The needle dial ── */
  const [dial, setDial] = useState<'send' | 'read'>('send');
  const guessN = useRef(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [queue, setQueue] = useState<string[]>([]);
  const [word, setWord] = useState(0);
  const [read, setRead] = useState('');
  const [guess, setGuess] = useState<{ letter: string; ok: boolean; n: number } | null>(null);
  // The letters a word sent had that the dial does not, said where it can be seen.
  const [missing, setMissing] = useState<string[]>([]);
  // While a word is sent, the needles point to its letter on the way; otherwise to the last one pressed.
  const shown = queue[0] ?? pressed;
  const sending = mode === 'needles' && dial === 'send';
  const readingMode = mode === 'needles' && dial === 'read';

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
  const reading = readingMode && read.length < target.length;
  const angles = needleAngles(readingMode ? (reading ? target[read.length] : null) : sending ? shown : null);

  const press = (letter: string) => {
    if (sending) {
      setQueue([]);
      setPressed(letter);
      setMessage((m) => (m + letter).slice(0, 24));
      setStatus(`${letter}: needles ${pairOf(letter)}.`);
      return;
    }
    if (!reading) return;
    guessN.current += 1;
    if (letter === target[read.length]) {
      const next = read + letter;
      setRead(next);
      setGuess({ letter, ok: true, n: guessN.current });
      setBurst((b) => b + 1);
      setStatus(next.length === target.length ? `You read the word: ${target}.` : `${letter}. Right. The needles point to the next letter.`);
    } else {
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

  const reset = () => {
    setMissing([]);
    setQueue([]);
    setPressed(null);
    setRead('');
    setGuess(null);
    setLive(false);
  };
  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
    if (m === 'send') setSeed(roll());
    setStatus(m === 'needles' ? 'The five-needle dial. Press a letter.' : m === 'build' ? 'Build a telegraph.' : m === 'send' ? 'The telegraph office. Send a telegram.' : 'Receive a telegram.');
  };
  const switchDial = (d: 'send' | 'read') => {
    setDial(d);
    reset();
    setStatus(d === 'read' ? 'The needles point to a letter. Which is it?' : 'The five-needle dial. Press a letter.');
  };

  const pointed = readingMode ? (reading ? target[read.length] : null) : shown;
  const wordDone = readingMode && !reading;
  const verdict = (l: string) => (readingMode && guess && guess.letter === l ? (guess.ok ? 'right' : 'wrong') : undefined);

  const modes = (
    <div className="vbr-options vbi-modes" role="group" aria-label="The telegraph’s parts">
      {MODES.map((m) => (
        <button key={m.id} type="button" className="vbr-option" aria-pressed={mode === m.id} aria-label={m.label} onClick={() => switchMode(m.id)}>
          <span className="vbi-mode-long">{m.label}</span>
          <span className="vbi-mode-short" aria-hidden="true">
            {m.short}
          </span>
        </button>
      ))}
    </div>
  );

  if (mode === 'send' || mode === 'receive') return <TelegramBench key={mode} mode={mode} reduced={reduced} modes={modes} seed={seed} />;

  if (mode === 'build') {
    const facts = placed.length ? placed.flatMap((id) => WIRE_FACTS[id]).filter((f, i, all) => all.indexOf(f) === i) : WIRE_FACTS.battery;
    return (
      <div className="vbi-bench vbi-telegraph vbi-build" data-look="strip">
        <div className="vbr-scene vbi-scene">
          <div className="vbi-build-board" data-built={built || undefined}>
            <BuildCircuit placed={placed} live={live} onDown={keyDown} onUp={keyUp} />
            {WIRE_PARTS.map((p) => {
              const s = SLOTS[p.id];
              if (placed.includes(p.id)) return null;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="vbi-slot"
                  data-slot={p.id}
                  data-ready={picked ? true : undefined}
                  data-wrong={wrongAt?.slot === p.id ? wrongAt.n : undefined}
                  style={{ left: pct(s.x - s.w / 2, 1000), top: pct(s.y - s.h / 2, 600), width: pct(s.w, 1000), height: pct(s.h, 600) }}
                  onClick={() => tapSlot(p.id)}
                  aria-label={`Empty place: ${p.job}`}
                >
                  <span className="vbi-slot-n" aria-hidden="true">
                    {WIRE_PARTS.indexOf(p) + 1}
                  </span>
                  <span className="vbi-slot-job">{p.job}</span>
                </button>
              );
            })}
            <span className="vbi-build-cheer" aria-hidden="true">
              <Celebrate burst={built ? burst : 0} reduced={reduced} />
            </span>
          </div>
        </div>

        <div className="vbr-card vbi-card vbi-strip-card">
          {modes}
          <div className="vbi-strip-main">
            <div className="vbi-strip-text" aria-live="polite">
              {built ? (
                <p className="vbi-step-body">
                  <strong>Your telegraph is built!</strong> {pressedOnce ? 'Press and hold the key, then let go. Watch the needle at the far station.' : 'Now press the key and send the current down the wire.'}
                </p>
              ) : said ? (
                <p className="vbi-step-body vbi-build-said" data-ok={said.ok || undefined}>
                  {said.words}
                </p>
              ) : (
                <p className="vbi-step-body">Put each part where it does its job. Drag it from the tray, or tap it, then tap its place.</p>
              )}
              {!built && <p className="vbr-note">{placed.length} of 5 parts in place.</p>}
              {!built && (
                <ol className="vbi-slot-key" aria-hidden="true">
                  {WIRE_PARTS.map((p) => (
                    <li key={p.id} data-placed={placed.includes(p.id) || undefined}>
                      {p.job}
                    </li>
                  ))}
                </ol>
              )}
            </div>
            {built ? (
              <div className="vbi-build-go">
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
                  onContextMenu={(e) => e.preventDefault()}
                  {...keyKeys}
                >
                  {live ? 'Current flowing…' : 'Press the key'}
                </button>
                <div className="vbr-actions">
                  {pressedOnce && (
                    <button type="button" className="vbr-button vbr-button-primary" onClick={() => switchMode('needles')}>
                      Now try the five-needle telegraph <span aria-hidden="true">→</span>
                    </button>
                  )}
                  <button type="button" className="vbr-button vbr-button-quiet" onClick={rebuild}>
                    Build it again
                  </button>
                </div>
              </div>
            ) : (
              <ul className="vbi-tray" aria-label="The parts tray">
                {tray.map((p) => {
                  const has = placed.includes(p.id);
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="vbi-tray-part"
                        aria-pressed={picked === p.id}
                        disabled={has}
                        data-placed={has || undefined}
                        onPointerDown={(e) => partDown(e, p.id)}
                        onPointerMove={partMove}
                        onPointerUp={partUp}
                        onPointerCancel={() => {
                          drag.current = null;
                          setGhost(null);
                        }}
                        onClick={() => tapPart(p.id)}
                      >
                        <PartIcon id={p.id} />
                        <span>{has ? `${p.name} ✓` : p.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <CardFoot facts={facts} poster={POSTER.innovations} reset={built} />
        </div>
        {ghost && (
          <span className="vbi-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
            <PartIcon id={ghost.part} />
          </span>
        )}
        <p className="vbr-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    );
  }

  return (
    <div className="vbi-bench vbi-telegraph" data-look="dial">
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
                data-pointed={pointed === l.letter && sending ? true : undefined}
                data-verdict={verdict(l.letter)}
                // A new key each guess, so the same letter guessed twice flashes again.
                data-n={verdict(l.letter) ? guess?.n : undefined}
                style={{ left: left(l.x), top: top(l.y) }}
                onClick={() => press(l.letter)}
                aria-label={l.letter}
              >
                <span className="vbi-letter-face">{l.letter}</span>
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
          <p className="vbi-board-name" aria-hidden="true">
            Cooke &amp; Wheatstone · 1837 · 20 letters
          </p>
        </div>
      </div>

      <div className="vbr-card vbi-card">
        {modes}
        <div className="vbr-options vbi-subtabs" role="group" aria-label="Send or read">
          <button type="button" className="vbr-option" aria-pressed={dial === 'send'} onClick={() => switchDial('send')}>
            Send a word
          </button>
          <button type="button" className="vbr-option" aria-pressed={dial === 'read'} onClick={() => switchDial('read')}>
            Read the needles
          </button>
        </div>
        <div className="vbi-step-area">
          {sending && (
            <>
              <p className="vbi-step-body vbi-send-intro">Press a letter, or type a word and send it: two needles point to each letter.</p>
              <div className="vbi-send-row">
                <label className="vbr-field">
                  <span className="vbr-label">Your word</span>
                  <input type="text" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 24))} maxLength={24} autoComplete="off" spellCheck={false} />
                </label>
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
              <div className="vbr-options" role="group" aria-label="Words the dial can spell">
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
              <p className="vbi-readout vbi-big-readout vbi-pointed" aria-live="polite">
                {shown ? (
                  <>
                    The needles point to <strong className="vbi-slotchar">{shown}</strong>
                  </>
                ) : (
                  'The needles stand upright.'
                )}
              </p>
              <p className="vbr-note vbi-left" data-empty={!missing.length || undefined}>
                {missing.length > 0 ? `${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} not on the dial, so ${missing.length > 1 ? 'they are' : 'it is'} left out.` : ' '}
              </p>
            </>
          )}

          {readingMode && (
            <>
              <p className="vbi-step-body">Two needles lean. Follow their lines to where they cross, and press that letter.</p>
              <ol className="vbi-word" aria-label={`The word so far: ${read || 'no letters yet'}`} style={{ ['--n' as string]: target.length }}>
                {target.split('').map((c, i) => (
                  <li key={i} className="vbi-word-letter" data-read={i < read.length || undefined} data-next={i === read.length || undefined}>
                    <span className="vbi-word-dot" aria-hidden="true">
                      ·
                    </span>
                    <span className="vbi-word-char">{i < read.length ? c : ''}</span>
                  </li>
                ))}
              </ol>
              <div className="vbi-feedback" aria-live="polite" data-verdict={wordDone ? 'right' : guess ? (guess.ok ? 'right' : 'wrong') : undefined}>
                {/* Stars for a right letter, drawn over the card (they take no room of their own). */}
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
        </div>
        <CardFoot facts={NEEDLE_FACTS} poster={POSTER.innovations} reset={dial} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/** The tray's order for a seed: shuffled, and never the circuit's own order (before the browser's seed, the circuit's order turned round once). */
export function trayOrder(seed: number | null) {
  const turned = [...WIRE_PARTS.slice(2), ...WIRE_PARTS.slice(0, 2)];
  if (seed === null) return turned;
  const s = seededShuffle(WIRE_PARTS, seed);
  return s.every((p, i) => p.id === WIRE_PARTS[i].id) ? turned : s;
}

/** What each part does, said when another part is put in its place. */
const PART_DOES: Record<WirePartId, string> = {
  battery: 'makes the electric current',
  key: 'switches the current on and off',
  wire: 'carries the current miles away',
  coil: 'pushes on a magnet when the current flows',
  needle: 'swings to show the message',
};

function pairOf(letter: string) {
  const l = DIAL.find((x) => x.letter === letter)!;
  return `${l.i} and ${l.j}, ${l.above ? 'above' : 'below'}`;
}

/** Each part as a small drawing, for the tray (and the part being dragged). */
function PartIcon({ id }: { id: WirePartId }) {
  return (
    <svg className="vbi-part-icon" viewBox="0 0 60 40" aria-hidden="true">
      {id === 'battery' && (
        <>
          <rect x="4" y="8" width="52" height="26" rx="4" fill="#2f4a32" />
          {[10, 23, 36].map((x) => (
            <rect key={x} x={x} y="13" width="10" height="16" rx="2" fill="#c9a24a" />
          ))}
        </>
      )}
      {id === 'key' && (
        <>
          <rect x="6" y="26" width="48" height="9" rx="2" fill="#7a4a34" />
          <path d="M12 22 L48 14" stroke="#b8903a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="13" r="6" fill="#2a2522" />
        </>
      )}
      {id === 'wire' && (
        <>
          <path d="M14 10 V36 M46 10 V36" stroke="#6b4a32" strokeWidth="4" />
          <path d="M8 10 H20 M40 10 H52" stroke="#6b4a32" strokeWidth="3" />
          <path d="M2 12 Q30 20 58 12" stroke="#2a2522" strokeWidth="2.4" fill="none" />
        </>
      )}
      {id === 'coil' && (
        <>
          <rect x="10" y="8" width="40" height="26" rx="5" fill="#b0603a" />
          {[15, 21, 27, 33, 39, 45].map((x) => (
            <path key={x} d={`M${x} 8 V34`} stroke="#7a3a1c" strokeWidth="2.4" />
          ))}
        </>
      )}
      {id === 'needle' && (
        <>
          <circle cx="30" cy="20" r="17" fill="#fbf7ef" stroke="#6b4a32" strokeWidth="2.5" />
          <path d="M30 5 L34 20 L30 35 L26 20Z" fill="#2a2522" transform="rotate(30 30 20)" />
          <circle cx="30" cy="20" r="2.6" fill="#c9a24a" />
        </>
      )}
    </svg>
  );
}

/**
 * The telegraph to build, drawn as one circuit: the battery and the key at
 * the sending station, the wire on its poles, and at the far station the
 * coil with its needle. The connections are pencilled in; each part is
 * drawn once it is in its place. With all five in, pressing the key sets
 * the current running and the needle swinging.
 */
function BuildCircuit({ placed, live, onDown, onUp }: { placed: WirePartId[]; live: boolean; onDown: () => void; onUp: () => void }) {
  const has = (id: WirePartId) => placed.includes(id);
  const built = placed.length === WIRE_PARTS.length;
  const flowing = built && live;
  return (
    <svg
      className="vbi-circuit vbi-build-circuit"
      viewBox="0 0 1000 600"
      data-live={flowing || undefined}
      role="img"
      aria-label={`A telegraph circuit to build: a battery and a key at the sending station, a long wire on poles, and a coil with a needle at the far station. ${placed.length} of 5 parts in place.${built ? (flowing ? ' The key is pressed: the current flows and the needle swings.' : ' The key is up: no current flows.') : ''}`}
    >
      <rect x="10" y="10" width="980" height="580" rx="10" fill="#f4eee3" stroke="#6b4a32" strokeOpacity="0.4" strokeWidth="2" />
      <text x="190" y="62" textAnchor="middle" className="vbi-circuit-station">Sending station</text>
      <text x="810" y="44" textAnchor="middle" className="vbi-circuit-station">Far station</text>

      {/* the connections, pencilled in until the parts are there */}
      <path className="vbi-wire-path vbi-wire-pencil" d="M193 300 H217 M367 318 H375 M605 318 H700 V258 H730 M890 258 H950 V550 H90 V362" />
      {has('wire') && <path className="vbi-wire-path" d="M367 318 H700 V258 H730 M890 258 H950 V550 H90 V362" />}
      <path className="vbi-current" d="M193 300 H217 M367 318 H700 V258 H730 M890 258 H950 V550 H90 V362" />

      {has('wire') && (
        <g className="vbi-part vbi-part-wire">
          {[420, 560].map((x) => (
            <g key={x}>
              <path d={`M${x} 318 V420`} stroke="#6b4a32" strokeWidth="10" />
              <path d={`M${x - 26} 318 H${x + 26}`} stroke="#6b4a32" strokeWidth="6" />
            </g>
          ))}
          <text x="490" y="450" textAnchor="middle" className="vbi-circuit-label">Wire</text>
        </g>
      )}

      {has('battery') && (
        <g className="vbi-part vbi-part-battery">
          <rect x="40" y="255" width="135" height="90" rx="8" fill="#2f4a32" />
          {[60, 92, 124].map((x) => (
            <rect key={x} x={x} y="271" width="26" height="58" rx="3" fill="#c9a24a" />
          ))}
          <text x="166" y="249" className="vbi-circuit-sign">+</text>
          <text x="44" y="249" className="vbi-circuit-sign">−</text>
          <text x="108" y="385" textAnchor="middle" className="vbi-circuit-label">Battery</text>
        </g>
      )}

      {has('key') && (
        <g className="vbi-part vbi-part-key" onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp} style={{ cursor: built ? 'pointer' : undefined }}>
          <rect x="237" y="336" width="110" height="26" rx="4" fill="#7a4a34" />
          <circle cx="252" cy="328" r="8" fill="#c9a24a" />
          <circle cx="332" cy="328" r="8" fill="#c9a24a" />
          <g className="vbi-key-lever" style={{ transform: flowing ? 'rotate(9deg)' : 'rotate(0deg)', transformOrigin: '252px 318px' }}>
            <path d="M248 318 L347 300" stroke="#b8903a" strokeWidth="9" strokeLinecap="round" />
            <circle cx="347" cy="300" r="13" fill="#2a2522" />
          </g>
          <text x="292" y="398" textAnchor="middle" className="vbi-circuit-label">Key</text>
        </g>
      )}

      {has('coil') && (
        <g className="vbi-part vbi-part-coil">
          <rect x="760" y="223" width="100" height="70" rx="10" fill={flowing ? '#e0783a' : '#b0603a'} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${770 + i * 10} 223 V293`} stroke="#7a3a1c" strokeWidth="4" />
          ))}
          <text x="810" y="328" textAnchor="middle" className="vbi-circuit-label">Coil</text>
        </g>
      )}
      {has('needle') && (
        <g className="vbi-part vbi-part-needle">
          <circle cx="810" cy="128" r="56" fill="#fbf7ef" stroke="#6b4a32" strokeWidth="4" />
          <path d="M810 78 V90 M810 166 V178" stroke="#6b4a32" strokeWidth="3" />
          <g className="vbi-big-needle" style={{ transform: flowing ? 'rotate(40deg)' : 'rotate(0deg)', transformOrigin: '810px 128px' }}>
            <path d="M810 82 L820 128 L810 174 L800 128Z" fill="#2a2522" />
            <circle cx="810" cy="128" r="7" fill="#c9a24a" />
          </g>
          <text x="896" y="134" className="vbi-circuit-label">Needle</text>
        </g>
      )}
    </svg>
  );
}
