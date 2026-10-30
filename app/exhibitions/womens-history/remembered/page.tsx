'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import { WOMENS_HISTORY } from '../womensHistory';
import { AUDIT, FACT_MERMAIDS, FACT_TOP_50, TOP_50, WOMEN_IN_TOP_50, guessLine } from './remembered';
import { CONFEDERATE_NAMES, FACT_CONFEDERATE, THREE_WOMEN, rankOf, type WomanId } from './threeWomen';
import WeighTheEvidence from './WeighTheEvidence';
import OralHistory, { type PrintKind } from './OralHistory';
import './remembered.css';

/*
 * Who Gets Remembered?, on one screen, in three tabs, each with its own
 * address. "Who gets a statue?": fifty statues on their plinths, the fifty
 * people with the most public monuments in the US; the visitor guesses how
 * many are women, and the names are uncovered; then they can meet the three
 * women (threeWomen.ts), and read a note on the four Confederate names
 * among the fifty. "Tip the scale": weigh the evidence for poster 1's claim,
 * choose the strongest and say why (WeighTheEvidence.tsx). "Talk about it":
 * an oral history with a woman in your family, with an interview sheet and a
 * write-up to print (OralHistory.tsx). Facts from outside the poster are
 * cited. Nothing moves under reduced motion.
 */

const TABS = [
  { id: 'statues', label: 'Who gets a statue?' },
  { id: 'scale', label: 'Tip the scale' },
  { id: 'talk', label: 'Talk about it' },
] as const;
type TabId = (typeof TABS)[number]['id'];

type CssVars = CSSProperties & Record<`--${string}`, string>;
type Detail = WomanId | 'confederate' | null;

const isConfederate = (name: string) => (CONFEDERATE_NAMES as readonly string[]).includes(name);

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

/** A statue on its plinth: a plain standing figure, the same for everyone until the names are uncovered. */
function Statue() {
  return (
    <svg className="whr-statue" viewBox="0 0 40 64" aria-hidden="true" focusable="false">
      <circle cx="20" cy="9" r="5.5" />
      <path d="M12 18c2-2 5-3 8-3s6 1 8 3l2 15-4 1-1-9v21h-4V33h-2v13h-4V25l-1 9-4-1z" />
      <rect className="whr-plinth-top" x="7" y="47" width="26" height="4" rx="0.8" />
      <rect className="whr-plinth" x="9" y="51" width="22" height="13" />
    </svg>
  );
}

export default function WhoGetsRemembered() {
  const { fonts, slug } = WOMENS_HISTORY;
  const back = useMuseumReturn(roomReturn(WOMENS_HISTORY));
  const [tab, setTab] = useState<TabId>('statues');
  const [guess, setGuess] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [detail, setDetail] = useState<Detail>(null);
  const [printing, setPrinting] = useState<PrintKind | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ statues: null, scale: null, talk: null });
  const detailHead = useRef<HTMLHeadingElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    const fromHash = () => {
      const h = tabFromHash(window.location.hash);
      if (h) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // Printing: the chosen sheet is marked on the room (in place before the dialog opens), printed, and unmarked.
  const print = useCallback((kind: PrintKind) => {
    flushSync(() => setPrinting(kind));
    try {
      window.print();
    } catch {
      /* no print dialog here (a test, or an embedded view) */
    }
    setPrinting(null);
  }, []);

  useEffect(() => {
    if (!opened.current) return;
    opened.current = false;
    detailHead.current?.focus({ preventScroll: true });
  }, [detail]);

  const choose = useCallback((id: TabId, focus = false) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }, []);

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

  const uncover = () => {
    setRevealed(true);
    setAnnouncement(`${guessLine(guess)} ${WOMEN_IN_TOP_50.map((w) => w.name).join(', ')}.`);
  };
  const again = () => {
    setRevealed(false);
    setDetail(null);
    setAnnouncement('The names are covered again. Make a new guess.');
  };
  const open = (d: Detail) => {
    opened.current = true;
    setDetail(d);
  };

  const woman = THREE_WOMEN.find((w) => w.id === detail);

  const style: CssVars = {
    background: '#e8d6cc',
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
  };

  return (
    <div className="pe-root whr-room" data-exhibition={slug} data-print={printing ?? (tab === 'scale' ? 'argument' : tab === 'talk' ? 'sheet' : undefined)} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="whr-stage" data-tab={tab}>
        <span className="whr-ground" aria-hidden="true" />
        <header className="whr-bar">
          <h1 className="whr-title">Who Gets Remembered?</h1>
          <div className="whr-tabs" role="tablist" aria-label="Who gets remembered">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`whr-tab-${x.id}`}
                aria-controls={`whr-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="whr-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        {/* Who gets a statue? */}
        <section className="whr-panel whr-statues" id="whr-panel-statues" role="tabpanel" aria-labelledby="whr-tab-statues" hidden={tab !== 'statues'}>
          {revealed && detail ? (
            <article className="whr-meet" aria-labelledby="whr-meet-head">
              {woman ? (
                <>
                  <h2 className="whr-meet-head" id="whr-meet-head" ref={detailHead} tabIndex={-1}>
                    {woman.name}
                  </h2>
                  <p className="whr-meet-rank">
                    Number {rankOf(woman.name).rank} in the Top 50, with {rankOf(woman.name).monuments} recorded monuments.{' '}
                    <FactSources sources={[AUDIT]} className="whr-fact-source" />
                  </p>
                  <ol className="whr-meet-lines">
                    {woman.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ol>
                  {woman.words && (
                    <blockquote className="whr-meet-words">
                      <p>“{woman.words.text}”</p>
                      <footer>{woman.words.cite}</footer>
                    </blockquote>
                  )}
                  <FactSources sources={[woman.source]} className="whr-fact-source" />
                </>
              ) : (
                <>
                  <h2 className="whr-meet-head" id="whr-meet-head" ref={detailHead} tabIndex={-1}>
                    About four of these names
                  </h2>
                  <p className="whr-meet-names">{CONFEDERATE_NAMES.join(' · ')}</p>
                  <FactNote fact={FACT_CONFEDERATE} className="whr-fact whr-fact-long" as="div" />
                </>
              )}
              <div className="whr-meet-buttons">
                {THREE_WOMEN.filter((w) => w.id !== detail).map((w) => (
                  <button key={w.id} type="button" className="whr-button" onClick={() => open(w.id)}>
                    Meet {w.name}
                  </button>
                ))}
                <button type="button" className="whr-button whr-button-primary" onClick={() => open(null)}>
                  Back to the fifty statues
                </button>
              </div>
            </article>
          ) : (
            <ol className={`whr-plinths${revealed ? ' is-revealed' : ''}`} aria-label={revealed ? 'The 50 people with the most public monuments in the US' : undefined} aria-hidden={revealed ? undefined : true}>
              {TOP_50.map((p, i) => {
                const lit = revealed ? !!p.woman : i < guess;
                return (
                  <li key={p.rank} className={`whr-cell${lit ? ' is-lit' : ''}${p.woman ? ' is-woman' : ''}`} style={{ '--i': String(i) } as CssVars}>
                    <Statue />
                    <span className="whr-name">
                      {revealed ? p.name : ''}
                      {revealed && isConfederate(p.name) && (
                        <span className="whr-mark">
                          <span aria-hidden="true">*</span>
                          <span className="visually-hidden"> (a Confederate leader: see the note “About four of these names”)</span>
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className={`whr-side${revealed ? ' is-revealed' : ''}`}>
            <p className="whr-ask">The 50 people with the most public monuments in the United States. How many do you think are women?</p>
            {!revealed ? (
              <>
                <label className="whr-guess">
                  <span className="whr-guess-n" aria-hidden="true">{guess}</span>
                  <input type="range" min={0} max={50} value={guess} onChange={(e) => setGuess(Number(e.target.value))} aria-label="Your guess: how many are women?" aria-valuetext={`${guess} of 50`} />
                </label>
                <button type="button" className="whr-button whr-button-primary" onClick={uncover}>
                  Uncover the names
                </button>
              </>
            ) : (
              <div className="whr-result">
                <p className="whr-result-line">
                  <span className="whr-result-n">{WOMEN_IN_TOP_50.length}</span> {guessLine(guess)}
                </p>
                <div className="whr-meet-pick" role="group" aria-label="Meet the three women">
                  <p className="whr-meet-pick-title">Meet the three women</p>
                  {THREE_WOMEN.map((w) => (
                    <button key={w.id} type="button" className="whr-button whr-meet-button" aria-pressed={detail === w.id} onClick={() => open(w.id)}>
                      {w.name}
                    </button>
                  ))}
                </div>
                <FactNote fact={FACT_TOP_50} className="whr-fact" />
                <FactNote fact={FACT_MERMAIDS} className="whr-fact" />
                <button type="button" className="whr-link-button" aria-pressed={detail === 'confederate'} onClick={() => open('confederate')}>
                  <span aria-hidden="true">* </span>About four of these names
                </button>
                <button type="button" className="whr-button" onClick={again}>
                  Guess again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tip the scale */}
        <section className="whr-panel whr-scale-panel" id="whr-panel-scale" role="tabpanel" aria-labelledby="whr-tab-scale" hidden={tab !== 'scale'}>
          <WeighTheEvidence onSay={setAnnouncement} onPrint={() => print('argument')} />
        </section>

        {/* Talk about it */}
        <section className="whr-panel whr-talk" id="whr-panel-talk" role="tabpanel" aria-labelledby="whr-tab-talk" hidden={tab !== 'talk'}>
          <OralHistory onPrint={print} />
        </section>

        <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
      </main>
    </div>
  );
}
