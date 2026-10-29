'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell from '../RoomShell';
import Flag from './Flag';
import { milestonesAt } from './flagLayout';
import Sheet from './Sheet';
import SignaturePad from './SignaturePad';
import { COPY_STAGES, FLAG_MAX, FLAG_MILESTONES, FLAG_MIN, FLAG_TEXT, SIGN_TEXT } from './signText';
import type { Stroke } from './signing';
import './sign.css';

/*
 * The signing, on one screen: a sheet of parchment on the green cloth of the
 * Congress's tables, by candlelight, with two tabs over it. Sign your name
 * with a quill (and add your address, as Carroll did); then follow the sheet
 * from copy to copy, from the Rough Draft to the printed transcription, and
 * see your signature copied with it; and add the flag's stars, from 13 to 50.
 * Each tab has its own address (#sign, #copies, #flag). Nothing signed is
 * stored or sent.
 *
 * The flag's milestones, and where the Rough Draft and the Engrossed Copy
 * are held, are owner-approved, fact-checked notes from outside the posters,
 * each set with its source (signText.ts).
 */

const TABS = [
  { id: 'sign', label: SIGN_TEXT.signHeading, short: SIGN_TEXT.signShort },
  { id: 'copies', label: SIGN_TEXT.copiesHeading, short: SIGN_TEXT.copiesShort },
  { id: 'flag', label: SIGN_TEXT.flagHeading, short: SIGN_TEXT.flagShort },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#(aps-)?/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function America250Signing() {
  const t = SIGN_TEXT;
  const [tab, setTab] = useState<TabId>('sign');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ sign: null, copies: null, flag: null });

  // The signature: drawn with the quill, or typed.
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [typed, setTyped] = useState('');
  const [address, setAddress] = useState('');
  const [ink, setInk] = useState(1);
  const [dipping, setDipping] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [status, setStatus] = useState('');

  // The copies.
  const [stage, setStage] = useState(0);
  const [printedName, setPrintedName] = useState('');

  // The flag.
  const [stars, setStars] = useState(FLAG_MIN);
  const [grew, setGrew] = useState(false);

  useEffect(() => {
    const fromHash = () => {
      const h = tabFromHash(window.location.hash);
      if (h) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((id: TabId, focus = false) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }, []);

  // Arrow keys, Home and End move between the tabs.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.findIndex((x) => x.id === tab);
    const to =
      e.key === 'ArrowRight' ? (i + 1) % TABS.length
      : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TABS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(TABS[to].id, true);
  };

  const signature = mode === 'draw' ? strokes : [];
  const typedName = mode === 'type' ? typed : '';
  const hasSignature = signature.length > 0 || typedName.trim().length > 0;

  const dip = () => {
    setInk(1);
    setDipping(true);
    setStatus('The quill is full of ink.');
    window.setTimeout(() => setDipping(false), 700);
  };

  const startAgain = () => {
    setStrokes([]);
    setTyped('');
    setSealed(false);
    setStatus('The line is clear.');
  };

  const seal = () => {
    setSealed(true);
    setStatus('Signed.');
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(COPY_STAGES.length - 1, i));
    setStage(to);
    setStatus(`${to + 1} of ${COPY_STAGES.length}: ${COPY_STAGES[to].name}`);
  };

  const setFlagStars = (n: number) => {
    const to = Math.max(FLAG_MIN, Math.min(FLAG_MAX, n));
    if (to === stars) return;
    setGrew(to > stars);
    setStars(to);
    const reached = to > stars ? FLAG_MILESTONES.filter((m) => m.stars > stars && m.stars <= to).pop() : undefined;
    setStatus(`${to} stars.${reached ? ` ${reached.year}: ${reached.text}` : ''}`);
  };
  const passed = milestonesAt(stars);

  const current = COPY_STAGES[stage];
  const sheetStage = tab === 'sign' ? 'engrossed' : current.id;
  const live = tab === 'sign' && !sealed;

  return (
    <RoomShell className="ap-signing">
      <div className="aps-stage" data-tab={tab} data-sealed={sealed || undefined} data-note={(tab === 'copies' && !!current.note) || undefined}>
        <Desk />

        <header className="aps-bar">
          <h1 className="aps-title">{t.title}</h1>
          <div className="aps-tabs" role="tablist" aria-label="The signing">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`aps-tab-${x.id}`}
                aria-controls={`aps-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="aps-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                <span className="aps-tab-long">{x.label}</span>
                <span className="aps-tab-short" aria-hidden="true">{x.short}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="aps-sheet-wrap">
          <div className="aps-sheet">
            {tab === 'flag' ? (
              <Flag stars={stars} grew={grew} onStars={setFlagStars} />
            ) : (
              <Sheet stage={sheetStage} strokes={signature} typed={typedName} address={address} printedName={printedName} live={live} />
            )}
            {live && mode === 'draw' && (
              <div className="aps-pad-box">
                <SignaturePad
                  strokes={strokes}
                  onStroke={(s) => setStrokes((all) => [...all, s])}
                  ink={ink}
                  onInk={setInk}
                  onDry={() => setStatus('The quill has run dry. Dip it in the ink.')}
                  label="The line to sign on. Write with your finger, pen or mouse."
                />
                {!strokes.length && <span className="aps-pad-hint" aria-hidden="true">Sign here</span>}
              </div>
            )}
            {live && mode === 'draw' && (
              <button type="button" className="aps-inkwell" data-low={ink < 0.25 || undefined} data-dipping={dipping || undefined} onClick={dip} aria-label="Dip the quill in the ink">
                <Inkwell level={ink} />
                <span className="aps-inkwell-label" aria-hidden="true">Dip</span>
              </button>
            )}
          </div>
        </div>

        <section className="aps-panel aps-panel-sign" id="aps-panel-sign" role="tabpanel" aria-labelledby="aps-tab-sign" hidden={tab !== 'sign'}>
          {!sealed ? (
            <>
              <p className="aps-intro">{mode === 'draw' ? t.signIntro : 'Type your name, and it is set in a flowing hand.'}</p>
              {mode === 'type' && (
                <label className="aps-field">
                  <span>Your name</span>
                  <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)} maxLength={40} autoComplete="off" spellCheck={false} />
                </label>
              )}
              <label className="aps-field aps-field-of">
                <span>{t.addressLabel}</span>
                <span className="aps-of">
                  <span aria-hidden="true">of</span>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={32} placeholder={t.addressPlaceholder} autoComplete="off" />
                </span>
              </label>
              <figure className="aps-quote aps-quote-small">
                <blockquote>{t.carroll.text}</blockquote>
              </figure>
              <div className="aps-actions">
                <button type="button" className="aps-button aps-button-primary" onClick={seal} disabled={!hasSignature}>
                  Put your name to it
                </button>
                <button type="button" className="aps-button" onClick={startAgain} disabled={!hasSignature && !address}>
                  Start again
                </button>
                <button type="button" className="aps-button aps-button-quiet" aria-pressed={mode === 'type'} onClick={() => setMode((m) => (m === 'draw' ? 'type' : 'draw'))}>
                  {mode === 'draw' ? 'Type it instead' : 'Sign with the quill'}
                </button>
              </div>
              <p className="aps-note">{t.privacy}</p>
            </>
          ) : (
            <div className="aps-signed">
              {t.signed.map((s) => (
                <p key={s} className="aps-signed-line">{s}</p>
              ))}
              <figure className="aps-quote">
                <blockquote>{t.epigraph.text}</blockquote>
                <figcaption>{t.epigraph.cite}</figcaption>
              </figure>
              <div className="aps-actions">
                <button type="button" className="aps-button aps-button-primary" onClick={() => choose('copies')}>
                  Follow it from copy to copy
                </button>
                <button type="button" className="aps-button" onClick={startAgain}>
                  Sign again
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="aps-panel aps-panel-copies" id="aps-panel-copies" role="tabpanel" aria-labelledby="aps-tab-copies" hidden={tab !== 'copies'}>
          <p className="aps-intro">{t.copiesIntro}</p>
          <ol className="aps-steps" aria-label="The copies, oldest first">
            {COPY_STAGES.map((s, i) => (
              <li key={s.id}>
                <button type="button" className="aps-step" aria-current={i === stage ? 'step' : undefined} onClick={() => go(i)}>
                  <span className="aps-step-n" aria-hidden="true">{i + 1}</span>
                  <span className="aps-step-name">{s.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <h2 className="aps-step-heading">{current.name}</h2>
          <figure className="aps-quote" key={current.id}>
            <blockquote>{current.quote}</blockquote>
          </figure>
          {current.note && <FactNote fact={current.note} className="aps-fact" />}
          {current.id === 'transcription' && (
            <>
              <label className="aps-field">
                <span>{t.printedNameLabel}</span>
                <input type="text" value={printedName} onChange={(e) => setPrintedName(e.target.value)} maxLength={40} placeholder={t.printedNamePlaceholder} autoComplete="off" />
              </label>
              <p className="aps-close">{t.copiesClose}</p>
            </>
          )}
          {!hasSignature && (current.id === 'engrossed' || current.id === 'stone') && (
            <p className="aps-note">
              <button type="button" className="aps-link" onClick={() => choose('sign')}>Sign your name</button> and it is copied too.
            </p>
          )}
          <div className="aps-actions aps-actions-step">
            <button type="button" className="aps-button" onClick={() => go(stage - 1)} disabled={stage === 0}>
              <span aria-hidden="true">←</span> Earlier
            </button>
            <button type="button" className="aps-button aps-button-primary" onClick={() => go(stage + 1)} disabled={stage === COPY_STAGES.length - 1}>
              The next copy <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section className="aps-panel aps-panel-flag" id="aps-panel-flag" role="tabpanel" aria-labelledby="aps-tab-flag" hidden={tab !== 'flag'}>
          <p className="aps-intro">{FLAG_TEXT.intro}</p>
          <p className="aps-flag-count" aria-hidden="true">
            <span className="aps-flag-n">{stars}</span> stars
          </p>
          <div className="aps-actions">
            <button type="button" className="aps-button aps-button-primary" onClick={() => setFlagStars(stars + 1)} disabled={stars === FLAG_MAX}>
              Add a star
            </button>
            <button type="button" className="aps-button" onClick={() => setFlagStars(stars - 1)} disabled={stars === FLAG_MIN}>
              Take one away
            </button>
            <button type="button" className="aps-button aps-button-quiet" onClick={() => setFlagStars(FLAG_MIN)} disabled={stars === FLAG_MIN}>
              Back to 13
            </button>
          </div>
          <ol className="aps-milestones" aria-label="Milestones">
            {passed.map((m, i) => (
              <li key={m.year} className="aps-milestone" aria-current={i === passed.length - 1 ? 'step' : undefined}>
                <span className="aps-milestone-year">{m.year}</span>
                <span className="aps-milestone-text">{m.text}</span>
              </li>
            ))}
          </ol>
          <p className="aps-fact aps-fact-flag">
            <FactSources sources={FLAG_TEXT.sources} className="aps-fact-source" />
          </p>
        </section>

        <p className="aps-status" role="status" aria-live="polite">{status}</p>
      </div>
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
