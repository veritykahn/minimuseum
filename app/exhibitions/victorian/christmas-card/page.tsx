'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell from '../RoomShell';
import { CardBack, CardFront, CardInside } from './CardArt';
import { BORDERS, CARD_NOTES, CARD_TEXT, GREETINGS, PAPERS, PICTURES, type BorderId, type PaperId, type PictureId } from './cardText';
import './card.css';

/*
 * The Christmas card maker, on one screen: the card stands on the parlour
 * table, and beside it the green linen card holds three tabs: the front
 * (its picture, border, paper and greeting), the inside (who it is to, the
 * message, who it is from) and printing it. Each tab has its own address
 * (#front, #inside, #print). It prints on one Letter page, laid out to fold
 * in four. Nothing written is stored or sent.
 *
 * The two notes on the first Christmas card are from the V&A, fact-checked
 * and set with their sources (cardText.ts).
 */

const TABS = [
  { id: 'front', label: 'The front' },
  { id: 'inside', label: 'The inside' },
  { id: 'print', label: 'Print it' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#(vcc-)?/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function VictorianChristmasCard() {
  const t = CARD_TEXT;
  const [tab, setTab] = useState<TabId>('front');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ front: null, inside: null, print: null });

  const [picture, setPicture] = useState<PictureId>('tree');
  const [border, setBorder] = useState<BorderId>('gilt');
  const [paper, setPaper] = useState<PaperId>('cream');
  const [greetingChoice, setGreetingChoice] = useState<number>(0);
  const [ownGreeting, setOwnGreeting] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');

  const greeting = greetingChoice < 0 ? ownGreeting : GREETINGS[greetingChoice].text;
  const pic = PICTURES.find((p) => p.id === picture)!;

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

  // Print the card: set once the fonts are in, cleared when the printer is done.
  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    const done = () => setPrinting(false);
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

  const frontLabel = `The card’s front: ${pic.alt}, in a ${BORDERS.find((b) => b.id === border)!.name.toLowerCase()} border on ${PAPERS.find((p) => p.id === paper)!.name.toLowerCase()} paper, and the greeting “${greeting.trim()}”`;
  const insideLabel = `The inside of the card${to.trim() ? `, to ${to.trim()}` : ''}${message.trim() ? `: ${message.trim()}` : ''}${from.trim() ? `, from ${from.trim()}` : ''}`;

  return (
    <RoomShell className="vb-card">
      <div className="vbr-stage vcc-stage" data-tab={tab}>
        <div className="vbr-room" aria-hidden="true">
          <div className="vbr-paper" />
          <div className="vbr-light" />
          <div className="vbr-table" />
        </div>

        <header className="vbr-bar">
          <h1 className="vbr-title">{t.title}</h1>
          <div className="vbr-tabs" role="tablist" aria-label="The card">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`vcc-tab-${x.id}`}
                aria-controls={`vcc-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="vbr-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        <div className="vbr-scene vcc-scene">
          <div className="vcc-cards" data-view={tab}>
            {tab !== 'inside' && (
              <div className="vcc-card vcc-card-front" role="img" aria-label={frontLabel}>
                <CardFront picture={picture} border={border} paper={paper} greeting={greeting} />
              </div>
            )}
            {tab !== 'front' && (
              <div className="vcc-card vcc-card-inside" role="img" aria-label={insideLabel}>
                <CardInside to={to} message={message} from={from} paper={paper} border={border} />
              </div>
            )}
          </div>
        </div>

        <section className="vbr-card" id="vcc-panel-front" role="tabpanel" aria-labelledby="vcc-tab-front" hidden={tab !== 'front'}>
          <p className="vbr-intro">{t.intro}</p>
          <Choice label="Picture" options={PICTURES} value={picture} onChange={(v) => { setPicture(v); setStatus(`Picture: ${PICTURES.find((p) => p.id === v)!.name}.`); }} />
          <Choice label="Border" options={BORDERS} value={border} onChange={(v) => { setBorder(v); setStatus(`Border: ${BORDERS.find((b) => b.id === v)!.name}.`); }} />
          <fieldset className="vbr-choice">
            <legend>Paper</legend>
            <div className="vbr-options">
              {PAPERS.map((p) => (
                <button key={p.id} type="button" className="vbr-option" aria-pressed={paper === p.id} onClick={() => { setPaper(p.id); setStatus(`Paper: ${p.name}.`); }}>
                  <span className="vcc-swatch" style={{ background: p.bg }} aria-hidden="true" />
                  {p.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="vbr-choice">
            <legend>Greeting</legend>
            <div className="vbr-options">
              {GREETINGS.map((g, i) => (
                <button key={g.text} type="button" className="vbr-option" aria-pressed={greetingChoice === i} onClick={() => setGreetingChoice(i)}>
                  {g.text}
                </button>
              ))}
              <button type="button" className="vbr-option" aria-pressed={greetingChoice < 0} onClick={() => setGreetingChoice(-1)}>
                Your own
              </button>
            </div>
            {greetingChoice < 0 && (
              <label className="vbr-field">
                <span className="visually-hidden">Your own greeting</span>
                <input type="text" value={ownGreeting} onChange={(e) => setOwnGreeting(e.target.value)} maxLength={48} placeholder="Your greeting" autoComplete="off" />
              </label>
            )}
          </fieldset>
          {GREETINGS[greetingChoice]?.first && <FactNote fact={CARD_NOTES.greeting} className="vbr-fact" />}
        </section>

        <section className="vbr-card" id="vcc-panel-inside" role="tabpanel" aria-labelledby="vcc-tab-inside" hidden={tab !== 'inside'}>
          <p className="vbr-intro">Write inside the card: who it is for, your message, and your name.</p>
          <label className="vbr-field">
            <span className="vbr-label">To</span>
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} maxLength={40} autoComplete="off" />
          </label>
          <label className="vbr-field">
            <span className="vbr-label">Your message</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={320} />
          </label>
          <label className="vbr-field">
            <span className="vbr-label">From</span>
            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} maxLength={40} autoComplete="off" />
          </label>
          <p className="vbr-note">{t.privacy}</p>
          <div className="vbr-actions">
            <button type="button" className="vbr-button vbr-button-primary" onClick={() => choose('print')}>
              Ready to print <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <section className="vbr-card" id="vcc-panel-print" role="tabpanel" aria-labelledby="vcc-tab-print" hidden={tab !== 'print'}>
          <p className="vbr-poster">{t.poster}</p>
          <FactNote fact={CARD_NOTES.first} className="vbr-fact" />
          <p className="vbr-note">{t.printNote}</p>
          <div className="vbr-actions">
            <button type="button" className="vbr-button vbr-button-primary" onClick={() => { setPrinting(true); setStatus('Printing the card.'); }}>
              Print the card
            </button>
            <button type="button" className="vbr-button" onClick={() => choose('front')}>
              Change the front
            </button>
          </div>
          <p className="vbr-note">{t.privacy}</p>
        </section>

        <p className="vbr-status" role="status" aria-live="polite">{status}</p>
      </div>

      {printing &&
        createPortal(
          // The page folds in four: the inside upside down at the top, the back and the front below.
          <div className="vcc-print-root" data-exhibition="victorian" aria-hidden="true">
            <div className="vcc-print-sheet">
              <div className="vcc-print-cell vcc-print-turned">
                <CardInside to={to} message={message} from={from} paper={paper} border={border} />
              </div>
              {/* The inside's left page: blank, but on the card's own paper (a white page in a Midnight card looks like a misprint). */}
              <div className="vcc-print-cell vcc-print-turned vcc-print-blank" style={{ background: PAPERS.find((p) => p.id === paper)!.bg }} />
              <div className="vcc-print-cell">
                <CardBack paper={paper} />
              </div>
              <div className="vcc-print-cell">
                <CardFront picture={picture} border={border} paper={paper} greeting={greeting} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </RoomShell>
  );
}

function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; name: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="vbr-choice">
      <legend>{label}</legend>
      <div className="vbr-options">
        {options.map((o) => (
          <button key={o.id} type="button" className="vbr-option" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
