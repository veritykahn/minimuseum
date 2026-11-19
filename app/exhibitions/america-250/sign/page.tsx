'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import Parchment, { hasSigned, type Doc, type Signer } from './Parchment';
import SignaturePad from './SignaturePad';
import { OWN_DECLARATIONS, type OwnFill, type VersionId } from './declaration';
import { COPIES_HREF, FLAG_HREF, SIGN_TEXT } from './signText';
import type { Stroke } from './signing';
import { SIGN_SOURCES } from './sources';
import './sign.css';

/*
 * Put Your Name to It: a sheet of parchment on the green cloth of the
 * Congress's tables, by candlelight. The room opens in the middle of the
 * desk on what to do (read it, dip the quill, sign) and three declarations
 * to choose from, each its own thing: the Declaration in its own words, the
 * class's (in a classroom's version or a middle school's) and the student's
 * own. Then the chosen parchment fills the desk, the inkwell beside it, the
 * three steps across the top (each ticked as it is done) and a tray of what
 * to do under it. Read it (the parchment scrolls inside itself), dip the
 * quill (it starts dry), and sign on the line at its foot by finger, pen or
 * mouse, or type the name; add an address, as Carroll did. The class's takes
 * name after name and prints with lines to sign; the others sign once. Each
 * declaration has its own address (#sign, #class, #mine). Nothing signed or
 * written is stored or sent.
 *
 * The point (what the poster alone can't give): the child reads the
 * Declaration's own words to its last line, finds what its signers were
 * pledging ("our Lives, our Fortunes and our sacred Honor": the Declaration
 * asks before the quill will take ink, the choices its own phrases), and
 * then puts their own name under it, so the posters' "a death warrant"
 * means something; and they write and sign declarations of their own, for
 * their class and for themselves. Verity, Nov 18: explain it on entry, read
 * on the parchment, dip the quill, sign at its foot; three separate things.
 *
 * The Declaration's text is the National Archives' transcription, and the
 * class's and the student's are the owner's own wording (declaration.ts);
 * every line about 1776 is the posters' own (signText.ts), its source in the
 * room's Sources drawer (sources.ts). "A Copy of a Copy" and "Add a Star",
 * once tabs here, are rooms of their own (../copies, ../flag); their old
 * addresses here (#copies, #flag) open them.
 */

const DOCS: { id: Doc; label: string; short: string; tag: string }[] = [
  { id: 'declaration', label: SIGN_TEXT.declarationName, short: SIGN_TEXT.declarationShort, tag: '1776' },
  { id: 'class', label: OWN_DECLARATIONS.class.name, short: OWN_DECLARATIONS.class.short, tag: 'Everyone signs' },
  { id: 'mine', label: OWN_DECLARATIONS.mine.name, short: OWN_DECLARATIONS.mine.short, tag: 'Just you' },
];

/** The old tabs' addresses, now rooms of their own. */
const MOVED: Record<string, string> = { copies: COPIES_HREF, flag: FLAG_HREF };

function fromHash(hash: string): Doc | null {
  const h = hash.replace(/^#(aps-)?/, '');
  if (h === 'class' || h === 'mine') return h;
  if (h === 'sign' || h === 'declaration') return 'declaration';
  if (MOVED[h]) window.location.replace(MOVED[h]);
  return null;
}

const blank = (): Signer => ({ strokes: [], typed: '', address: '' });
const byDoc = <T,>(make: () => T): Record<Doc, T> => ({ declaration: make(), class: make(), mine: make() });

export default function America250Signing() {
  const t = SIGN_TEXT;
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<'choose' | 'sign'>('choose');
  const [doc, setDoc] = useState<Doc>('declaration');
  const scroll = useRef<HTMLDivElement>(null);
  const chooseHead = useRef<HTMLHeadingElement>(null);
  const signHead = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // The signature: drawn with the quill, or typed. Each parchment has its own
  // line to sign on, and its own names signed.
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [pads, setPads] = useState<Record<Doc, Signer>>(() => byDoc(blank));
  const [signed, setSigned] = useState<Record<Doc, Signer[]>>(() => byDoc<Signer[]>(() => []));
  // The owner's declarations: their blanks as filled in, and the class's version.
  const [fills, setFills] = useState<Record<'class' | 'mine', OwnFill>>({ class: {}, mine: {} });
  const [version, setVersion] = useState<VersionId>('classroom');
  // The quill starts dry: dipping it is the second step.
  const [ink, setInk] = useState(0);
  const [dipped, setDipped] = useState(false);
  const [read, setRead] = useState<Record<Doc, boolean>>(() => byDoc(() => false));
  const [dipping, setDipping] = useState(false);
  // The Declaration asks what you are pledging before the quill will take ink.
  const [pledged, setPledged] = useState(false);
  const [pledgeTried, setPledgeTried] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  // What is being printed; `n` counts the presses, so a second press prints again even if the browser never said it was done.
  const [printing, setPrinting] = useState<{ doc: Doc; n: number } | null>(null);
  const print = (d: Doc) => setPrinting((p) => ({ doc: d, n: (p?.n ?? 0) + 1 }));

  useEffect(() => {
    const go = () => {
      const h = fromHash(window.location.hash);
      if (!h) return;
      setDoc(h);
      setView('sign');
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);

  // After a choice (made here, not by an address), the focus goes to the new view's heading.
  useEffect(() => {
    if (!moved.current) return;
    (view === 'choose' ? chooseHead : signHead).current?.focus({ preventScroll: true });
  }, [view]);

  const open = (d: Doc) => {
    moved.current = true;
    setDoc(d);
    setView('sign');
    window.history.replaceState(null, '', `#${d === 'declaration' ? 'sign' : d}`);
    setStatus(`${DOCS.find((x) => x.id === d)!.label}.`);
  };
  const backToChoose = () => {
    moved.current = true;
    setView('choose');
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setStatus('');
  };

  const pad = pads[doc];
  const setPad = (change: Partial<Signer>) => setPads((all) => ({ ...all, [doc]: { ...all[doc], ...change } }));
  // What is on the line now, as the mode shows it.
  const current: Signer = { strokes: mode === 'draw' ? pad.strokes : [], typed: mode === 'type' ? pad.typed : '', address: pad.address };
  const hasSignature = hasSigned(current);
  const names = signed[doc];
  // A class's parchment takes name after name; the others, one.
  const sealed = doc !== 'class' && names.length > 0;

  const mustPledge = doc === 'declaration' && !pledged;
  const answerPledge = (id: string) => {
    if (pledged || pledgeTried.includes(id)) return;
    const c = t.pledge.choices.find((x) => x.id === id)!;
    if (id === t.pledge.answer) {
      setPledged(true);
      setStatus(t.pledge.right);
    } else {
      setPledgeTried((x) => [...x, id]);
      setStatus(c.no);
    }
  };

  const dip = () => {
    if (mustPledge) {
      setStatus(t.pledge.first);
      return;
    }
    setInk(1);
    setDipped(true);
    setDipping(true);
    setStatus('The quill is full of ink. Now sign on the line at the foot of the parchment.');
    window.setTimeout(() => setDipping(false), 700);
  };

  const startAgain = () => {
    setPads((all) => ({ ...all, [doc]: { ...blank(), address: doc === 'class' ? '' : all[doc].address } }));
    if (doc !== 'class') setSigned((all) => ({ ...all, [doc]: [] }));
    setStatus('The line is clear.');
  };

  const seal = () => {
    if (!hasSignature || mustPledge) return;
    const s: Signer = { strokes: current.strokes, typed: current.typed.trim(), address: current.address };
    if (doc === 'class') {
      setSigned((all) => ({ ...all, class: [...all.class, s] }));
      // The line is cleared for the next name.
      setPads((all) => ({ ...all, class: blank() }));
      setStatus(`Signed. ${names.length + 1} ${names.length ? 'names' : 'name'} on the class declaration.`);
    } else {
      setSigned((all) => ({ ...all, [doc]: [s] }));
      setStatus('Signed.');
    }
  };

  const clearClass = () => {
    setSigned((all) => ({ ...all, class: [] }));
    setStatus('Every name is cleared from the class declaration.');
  };

  const markRead = useCallback(() => setRead((r) => (r[doc] ? r : { ...r, [doc]: true })), [doc]);
  const toFoot = () => {
    markRead();
    const el = scroll.current;
    if (!el) return;
    el.scrollTo?.({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    setStatus('At the foot of the parchment, the line to sign on.');
  };

  // Print just the parchment with its names: it is set once the fonts are in, and cleared when the printer is done.
  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    const done = () => setPrinting(null);
    window.addEventListener('afterprint', done);
    (async () => {
      await document.fonts?.ready;
      if (!cancelled) window.print();
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', done);
    };
  }, [printing]);

  const live = view === 'sign' && !sealed;
  const own = doc === 'declaration' ? null : OWN_DECLARATIONS[doc];
  // The three steps, each ticked once done, and the next one marked.
  const stepWords = (mode === 'type' ? t.stepsTyped : t.steps).map((w, i) => (i === 0 && doc === 'declaration' ? t.pledge.step : w));
  const anySigned = sealed || (doc === 'class' && names.length > 0);
  const done = [
    doc === 'declaration' ? pledged || anySigned : read[doc] || hasSignature || anySigned,
    (mode === 'type' ? !!pad.typed.trim() : dipped) || hasSignature || anySigned,
    anySigned,
  ];
  const next = done.findIndex((d) => !d);

  return (
    <RoomShell className="ap-signing">
      {/* Every source, in one drawer; nothing cited inline (sources.ts). */}
      <SourcesDrawer groups={SIGN_SOURCES}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');`}</style>
        <div className="aps-stage" data-view={view} data-doc={view === 'sign' ? doc : undefined} data-sealed={sealed || undefined}>
          <Desk />

          {view === 'choose' ? (
            <section className="aps-choose" aria-labelledby="aps-choose-title">
              <h1 className="aps-title" id="aps-choose-title" ref={chooseHead} tabIndex={-1}>
                {t.title}
              </h1>
              <p className="aps-choose-lead">{t.chooseLead}</p>
              <ol className="aps-how" aria-label="How it works">
                {t.steps.map((s, i) => (
                  <li key={s}>
                    <span className="aps-how-n" aria-hidden="true">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <h2 className="aps-choose-ask">{t.chooseAsk}</h2>
              <ul className="aps-choices">
                {DOCS.map((d) => (
                  <li key={d.id}>
                    <button type="button" className="aps-choice" data-doc={d.id} onClick={() => open(d.id)}>
                      <span className="aps-choice-sheet" aria-hidden="true">
                        <span className="aps-choice-lines" />
                        <span className="aps-choice-seal" />
                      </span>
                      <span className="aps-choice-tag">{d.tag}</span>
                      <span className="aps-choice-name">{d.label}</span>
                      <span className="aps-choice-text">{t.choices[d.id]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              <header className="aps-bar">
                <h1 className="aps-title aps-title-small" ref={signHead} tabIndex={-1}>
                  {t.title}
                </h1>
                <div className="aps-docs" role="group" aria-label="Which declaration">
                  {DOCS.map((d) => (
                    <button key={d.id} type="button" className="aps-doc" aria-pressed={doc === d.id} onClick={() => open(d.id)}>
                      <span className="aps-doc-long">{d.label}</span>
                      <span className="aps-doc-short" aria-hidden="true">{d.short}</span>
                    </button>
                  ))}
                </div>
                <ol className="aps-steps-strip" aria-label="Three steps">
                  {stepWords.map((s, i) => (
                    <li key={s} data-done={done[i] || undefined} aria-current={i === next ? 'step' : undefined}>
                      <span className="aps-how-n" aria-hidden="true">{done[i] ? '✓' : i + 1}</span>
                      {s}
                      {done[i] && <span className="aps-sr"> (done)</span>}
                    </li>
                  ))}
                </ol>
              </header>

              <div className="aps-sheet-wrap">
                <div className="aps-sheet">
                  <Parchment
                    // Each parchment opens at its head, not where the last one was left.
                    key={doc}
                    ref={scroll}
                    doc={doc}
                    signers={names}
                    typing={live && mode === 'type' ? pad.typed : ''}
                    address={live ? pad.address : ''}
                    version={doc === 'class' ? version : 'classroom'}
                    fill={doc === 'declaration' ? undefined : fills[doc]}
                    onFill={(change) => {
                      if (doc !== 'declaration') setFills((f) => ({ ...f, [doc]: { ...f[doc], ...change } }));
                    }}
                    onAtFoot={markRead}
                    pad={
                      live ? (
                        mode === 'draw' ? (
                          <div className="aps-pad-box">
                            <SignaturePad
                              key={doc}
                              strokes={pad.strokes}
                              onStroke={(s: Stroke) => setPads((all) => ({ ...all, [doc]: { ...all[doc], strokes: [...all[doc].strokes, s] } }))}
                              ink={ink}
                              onInk={setInk}
                              onDry={() => setStatus(dipped ? 'The quill has run dry. Dip it in the ink.' : 'The quill is dry. Dip it in the ink first.')}
                              label="The line to sign on. Write with your finger, pen or mouse."
                            />
                            {!pad.strokes.length && (
                              <span className="aps-pad-hint" aria-hidden="true">
                                {ink > 0 ? 'Sign here' : 'Dip the quill first'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="aps-pad-box aps-pad-box-typed">
                            {!pad.typed.trim() && <span className="aps-pad-hint" aria-hidden="true">Your name here</span>}
                          </div>
                        )
                      ) : undefined
                    }
                  />
                </div>
                {live && mode === 'draw' && (
                  <div className="aps-well">
                    <button
                      type="button"
                      className="aps-inkwell"
                      data-low={ink < 0.25 || undefined}
                      data-dipping={dipping || undefined}
                      data-locked={mustPledge || undefined}
                      aria-disabled={mustPledge || undefined}
                      onClick={dip}
                      aria-label="Dip the quill in the ink"
                    >
                      <Inkwell level={ink} />
                      <span className="aps-inkwell-label" aria-hidden="true">Dip</span>
                    </button>
                    {ink <= 0 && (
                      <span className="aps-dry" aria-hidden="true">
                        {mustPledge ? 'Find the pledge first' : dipped ? 'The quill is dry. Dip it again' : t.dipFirst}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <section className="aps-tray" aria-label="Sign it">
                {!sealed ? (
                  <>
                    {/* Once pledged and the quill dipped, it steps aside for the line to sign. */}
                    {doc === 'declaration' && !(pledged && dipped) && (
                      <div className="aps-pledge" role="group" aria-labelledby="aps-pledge-ask" data-done={pledged || undefined}>
                        <p className="aps-pledge-ask" id="aps-pledge-ask">{t.pledge.ask}</p>
                        {pledged ? (
                          <p className="aps-pledge-right">{t.pledge.right}</p>
                        ) : (
                          <>
                            <ul className="aps-pledge-choices">
                              {t.pledge.choices.map((c) => {
                                const wrong = pledgeTried.includes(c.id);
                                return (
                                  <li key={c.id}>
                                    <button type="button" className="aps-pledge-choice" data-wrong={wrong || undefined} disabled={wrong} onClick={() => answerPledge(c.id)}>
                                      {c.label}
                                      {wrong && <span className="aps-sr"> (not this one)</span>}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                            {pledgeTried.length > 0 && (
                              <p className="aps-pledge-hint">{t.pledge.choices.find((c) => c.id === pledgeTried[pledgeTried.length - 1])!.no}</p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div className="aps-tray-row">
                      <button type="button" className="aps-button aps-button-quiet aps-to-foot" onClick={toFoot}>
                        {t.toFoot} <span aria-hidden="true">↓</span>
                      </button>
                      {doc === 'class' && (
                        <div className="aps-versions" role="group" aria-label={t.versionLabel}>
                          <span className="aps-versions-label" aria-hidden="true">{t.versionLabel}</span>
                          {OWN_DECLARATIONS.class.versions.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              className="aps-version"
                              aria-pressed={version === v.id}
                              onClick={() => {
                                setVersion(v.id);
                                setStatus(`${v.label} version.`);
                              }}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {mode === 'type' && (
                        <label className="aps-field">
                          <span>Your name</span>
                          <input type="text" value={pad.typed} onChange={(e) => setPad({ typed: e.target.value })} maxLength={40} autoComplete="off" spellCheck={false} />
                        </label>
                      )}
                      <label className="aps-field aps-field-of">
                        <span>{t.addressLabel}</span>
                        <span className="aps-of">
                          <span aria-hidden="true">of</span>
                          <input type="text" value={pad.address} onChange={(e) => setPad({ address: e.target.value })} maxLength={32} placeholder={t.addressPlaceholder} autoComplete="off" />
                        </span>
                      </label>
                    </div>
                    <div className="aps-tray-row aps-actions-main">
                      <button type="button" className="aps-button aps-button-primary" onClick={seal} disabled={!hasSignature || mustPledge}>
                        {doc === 'class' ? t.addName : 'Put your name to it'}
                      </button>
                      <button type="button" className="aps-button" onClick={startAgain} disabled={!hasSignature && !pad.address}>
                        Start again
                      </button>
                      <button type="button" className="aps-button aps-button-quiet" aria-pressed={mode === 'type'} onClick={() => setMode((m) => (m === 'draw' ? 'type' : 'draw'))}>
                        {mode === 'draw' ? 'Type it instead' : 'Sign with the quill'}
                      </button>
                      {doc === 'class' && (
                        <>
                          <span className="aps-count">{names.length === 1 ? '1 name signed' : `${names.length} names signed`}</span>
                          {/* Printable before anyone signs: its lines can be signed by hand. */}
                          <button type="button" className="aps-button" onClick={() => print('class')}>
                            Print it
                          </button>
                          <button type="button" className="aps-button aps-button-quiet" onClick={clearClass} disabled={!names.length}>
                            Clear every name
                          </button>
                        </>
                      )}
                      <button type="button" className="aps-button aps-button-quiet" onClick={backToChoose}>
                        {t.chooseOther}
                      </button>
                    </div>
                    {doc === 'declaration' && <p className="aps-carroll">{t.carroll.text}</p>}
                    <p className="aps-note">{own ? t.privacyWritten : t.privacy}</p>
                  </>
                ) : doc === 'declaration' ? (
                  <div className="aps-signed">
                    <div className="aps-signed-words">
                      {t.signed.map((s) => (
                        <p key={s} className="aps-signed-line">{s}</p>
                      ))}
                      <figure className="aps-quote">
                        <blockquote>{t.epigraph.text}</blockquote>
                        <figcaption>{t.epigraph.cite}</figcaption>
                      </figure>
                    </div>
                    <div className="aps-tray-row">
                      <Link className="aps-button aps-button-primary" href={COPIES_HREF}>
                        {t.copiesNext} <span aria-hidden="true">→</span>
                      </Link>
                      <button type="button" className="aps-button" onClick={() => print('declaration')}>
                        Print it
                      </button>
                      <button type="button" className="aps-button" onClick={startAgain}>
                        Sign again
                      </button>
                      <button type="button" className="aps-button aps-button-quiet" onClick={backToChoose}>
                        {t.chooseOther}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="aps-signed">
                    <p className="aps-signed-line">{t.mineSigned}</p>
                    <div className="aps-tray-row">
                      <button type="button" className="aps-button aps-button-primary" onClick={() => print('mine')}>
                        Print it
                      </button>
                      <button type="button" className="aps-button" onClick={startAgain}>
                        Sign again
                      </button>
                      <button type="button" className="aps-button aps-button-quiet" onClick={backToChoose}>
                        {t.chooseOther}
                      </button>
                    </div>
                    <p className="aps-note">{t.privacyWritten}</p>
                  </div>
                )}
              </section>
            </>
          )}

          <p className="aps-status" role="status" aria-live="polite">{status}</p>
        </div>

        {printing &&
          createPortal(
            <div className="aps-print-root" data-exhibition="america-250" style={{ '--pe-ui': "'IBM Plex Sans', sans-serif" } as CSSProperties} aria-hidden="true">
              <Parchment
                doc={printing.doc}
                signers={signed[printing.doc]}
                version={printing.doc === 'class' ? version : 'classroom'}
                fill={printing.doc === 'declaration' ? undefined : fills[printing.doc]}
                print
              />
            </div>,
            document.body,
          )}
      </SourcesDrawer>
    </RoomShell>
  );
}

/** The scene around the sheet: the green cloth, the candle and its light. */
function Desk() {
  return (
    <div className="aps-desk" aria-hidden="true">
      <div className="aps-cloth" />
      <div className="aps-glow" />
      <svg className="aps-candle" viewBox="0 0 120 420">
        <defs>
          <radialGradient id="aps-flame" cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#fffbe8" />
            <stop offset="45%" stopColor="#ffd77a" />
            <stop offset="100%" stopColor="#e8862e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="aps-wax" x1="0" x2="1">
            <stop offset="0%" stopColor="#d9cdb4" />
            <stop offset="45%" stopColor="#f6eedc" />
            <stop offset="100%" stopColor="#b7a789" />
          </linearGradient>
          <linearGradient id="aps-brass" x1="0" x2="1">
            <stop offset="0%" stopColor="#6e4f1e" />
            <stop offset="40%" stopColor="#d9b265" />
            <stop offset="100%" stopColor="#5b3f15" />
          </linearGradient>
        </defs>
        <g className="aps-flame">
          <ellipse cx="60" cy="70" rx="30" ry="58" fill="url(#aps-flame)" opacity="0.65" />
          <path d="M60 20 C72 48 76 68 70 84 C66 94 54 94 50 84 C44 68 50 46 60 20Z" fill="#ffe7a3" />
          <path d="M60 46 C65 62 66 72 63 82 C61 87 59 87 57 82 C54 72 55 60 60 46Z" fill="#fffdf2" />
        </g>
        <line x1="60" y1="86" x2="60" y2="98" stroke="#2b1d14" strokeWidth="2.4" />
        <rect x="40" y="96" width="40" height="230" rx="4" fill="url(#aps-wax)" />
        <path d="M40 104 C46 112 50 104 54 116 C56 124 52 136 55 146 L55 104Z" fill="#efe5cf" />
        <ellipse cx="60" cy="330" rx="56" ry="14" fill="url(#aps-brass)" />
        <rect x="30" y="322" width="60" height="16" rx="6" fill="url(#aps-brass)" />
        <ellipse cx="60" cy="380" rx="58" ry="16" fill="#3a2a12" opacity="0.6" />
        <path d="M14 340 Q60 404 106 340 L100 360 Q60 412 20 360Z" fill="url(#aps-brass)" />
      </svg>
    </div>
  );
}

/** The inkwell, with the quill standing in it; the ink on the nib shows how much is left. */
function Inkwell({ level }: { level: number }) {
  return (
    <svg className="aps-inkwell-art" viewBox="0 0 140 220" aria-hidden="true">
      <defs>
        <linearGradient id="aps-glass" x1="0" x2="1">
          <stop offset="0%" stopColor="#1c2128" />
          <stop offset="35%" stopColor="#4a5560" />
          <stop offset="60%" stopColor="#20262d" />
          <stop offset="100%" stopColor="#0e1115" />
        </linearGradient>
        <linearGradient id="aps-feather" x1="0" x2="1">
          <stop offset="0%" stopColor="#f6efe0" />
          <stop offset="100%" stopColor="#c9bca4" />
        </linearGradient>
      </defs>
      {/* the quill */}
      <g className="aps-quill">
        <path d="M78 150 L122 6 C128 2 134 8 130 16 L84 152Z" fill="#e9dfcb" />
        <path d="M86 132 C70 92 92 40 124 8 C126 40 116 96 92 140Z" fill="url(#aps-feather)" opacity="0.95" />
        <path d="M86 132 C96 98 110 58 124 8" stroke="#a89878" strokeWidth="1.2" fill="none" />
        <path d="M78 150 L84 152 L80 168Z" fill="#2b1d14" opacity={0.25 + 0.75 * level} />
      </g>
      {/* the well */}
      <ellipse cx="62" cy="206" rx="54" ry="10" fill="#000" opacity="0.45" />
      <path d="M18 160 Q16 200 30 204 L94 204 Q108 200 106 160 Z" fill="url(#aps-glass)" />
      <ellipse cx="62" cy="160" rx="44" ry="10" fill="#2e353d" />
      <rect x="44" y="140" width="36" height="22" rx="4" fill="url(#aps-glass)" />
      <ellipse cx="62" cy="140" rx="18" ry="5" fill="#0b0d10" />
      <path d="M28 170 Q30 194 40 198" stroke="#9fb0bf" strokeOpacity="0.4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
