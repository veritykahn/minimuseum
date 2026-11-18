'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import Morse from './Morse';
import Photography from './Photography';
import Railway from './Railway';
import Telegraph from './Telegraph';
import { WORKSHOP_TEXT } from './inventionsText';
import { INVENTIONS_SOURCES } from './sources';
import './inventions.css';
import './telegraph.css';
import './morse.css';
import './photography.css';

/*
 * The inventions workshop, on one screen: four benches for the three
 * inventions poster 1 names, "railways, the telegraph, and photography",
 * and Morse code, the telegraph's own alphabet, on a bench of its own;
 * each bench its own tab and address (#railway, #telegraph, #morse,
 * #photography). Move the Sun west across a map and watch noon reach each
 * town's clock in turn, then catch a train and set the clocks to railway
 * time; build a telegraph and press its key, press a letter and watch two
 * needles point to it, or send a telegram from the telegraph office with
 * the money in your purse; learn a few letters of Morse code, tap them out
 * and decode a message; make a negative of a window, counting the seconds
 * with the lens cap off, and print from it. Each step fits on one screen.
 *
 * Behind each bench, the owner's painting of where its invention worked (a
 * station platform, a telegraph office, an inventor's workbench for Morse
 * code, a glass-roofed studio), filling the whole room from the top of the
 * page to the bottom, with nothing laid over its foot (made with
 * Leonardo.Ai, not credited on the page, at the owner's request). What each
 * bench shows is fact-checked against the Science Museum Group and the V&A
 * (inventionsText.ts); the notes' sources and the photographs' credits are
 * in the workshop's Sources drawer, bench by bench and step by step
 * (sources.ts).
 */

const TABS = [
  { id: 'railway', label: WORKSHOP_TEXT.railwayHeading, backdrop: '/exhibitions/victorian/inventions/railway-platform.webp' },
  { id: 'telegraph', label: WORKSHOP_TEXT.telegraphHeading, backdrop: '/exhibitions/victorian/inventions/telegraph-office.webp' },
  { id: 'morse', label: WORKSHOP_TEXT.morseHeading, backdrop: '/exhibitions/victorian/inventions/workshop-bench.webp' },
  { id: 'photography', label: WORKSHOP_TEXT.photoHeading, backdrop: '/exhibitions/victorian/inventions/photography-studio.webp' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#(vbi-)?/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function VictorianInventions() {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('railway');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ railway: null, telegraph: null, morse: null, photography: null });

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

  return (
    <SourcesDrawer groups={INVENTIONS_SOURCES}>
      <RoomShell className="vb-inventions">
        <div className="vbr-stage vbi-stage" data-tab={tab}>
          <div className="vbr-room" aria-hidden="true">
            {TABS.map((x) => (
              <div key={x.id} className="vbi-backdrop" data-shown={tab === x.id || undefined} style={{ backgroundImage: `url(${x.backdrop})` }} />
            ))}
          </div>

          <header className="vbr-bar">
            <h1 className="vbr-title">{WORKSHOP_TEXT.title}</h1>
            <div className="vbr-tabs" role="tablist" aria-label="The benches">
              {TABS.map((x) => (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabRefs.current[x.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`vbi-tab-${x.id}`}
                  aria-controls={`vbi-panel-${x.id}`}
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

          {TABS.map((x) => (
            <section key={x.id} className="vbi-panel" id={`vbi-panel-${x.id}`} role="tabpanel" aria-labelledby={`vbi-tab-${x.id}`} hidden={tab !== x.id}>
              {tab === x.id && x.id === 'railway' && <Railway reduced={reduced} />}
              {tab === x.id && x.id === 'telegraph' && <Telegraph reduced={reduced} />}
              {tab === x.id && x.id === 'morse' && <Morse reduced={reduced} />}
              {tab === x.id && x.id === 'photography' && <Photography reduced={reduced} />}
            </section>
          ))}
        </div>
      </RoomShell>
    </SourcesDrawer>
  );
}
