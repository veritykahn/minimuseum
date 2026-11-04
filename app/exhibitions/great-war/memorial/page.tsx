'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import RoomShell from '../RoomShell';
import PoppyField, { PoppyControls } from './PoppyField';
import TwoMinuteSilence from './TwoMinuteSilence';
import RememberSoldier from './RememberSoldier';
import { usePoppies } from './usePoppies';
import { MEMORIAL_TEXT } from './memorialText';
import { MEMORIAL_SOURCES } from './sources';
import './memorial.css';
import './remember.css';

/*
 * The memorial, on one screen: the soldier on the rise, lit from behind, above
 * the field of poppies visitors have placed, with three tabs over it: place
 * a poppy, remember a soldier (a memorial card for one of the fallen, to keep
 * or print), and the silence at 11:00. Each tab has its own address
 * (#poppies, #remember, #silence).
 */

const TABS = [
  { id: 'poppies', label: MEMORIAL_TEXT.poppyHeading, short: 'Poppy' },
  { id: 'remember', label: MEMORIAL_TEXT.rememberHeading, short: 'Remember' },
  { id: 'silence', label: MEMORIAL_TEXT.silenceHeading, short: 'Silence' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#(gwm-)?/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function GreatWarMemorial() {
  const t = MEMORIAL_TEXT;
  const poppies = usePoppies();
  const [growFrom, setGrowFrom] = useState<number | null>(null);
  const [tab, setTab] = useState<TabId>('poppies');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ poppies: null, remember: null, silence: null });

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
    <RoomShell className="gw-memorial" label="Interactive" title={t.title} bare>
      {/* The records' source, in the room's Sources drawer (sources.ts). */}
      <SourcesDrawer groups={MEMORIAL_SOURCES}>
      <div className="gwm-stage" data-tab={tab}>
        <PoppyField count={poppies.count} growFrom={growFrom} />

        <header className="gwm-bar">
          <h1 className="gwm-title">
            {t.title}
            <span className="gwm-title-date">11.11.1918 · 11:00</span>
          </h1>
          <div className="gwm-tabs" role="tablist" aria-label="The memorial">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`gwm-tab-${x.id}`}
                aria-controls={`gwm-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="gwm-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                <span className="gwm-tab-long">{x.label}</span>
                <span className="gwm-tab-short" aria-hidden="true">{x.short}</span>
              </button>
            ))}
          </div>
        </header>

        <section className="gwm-panel gwm-panel-poppies" id="gwm-panel-poppies" role="tabpanel" aria-labelledby="gwm-tab-poppies" hidden={tab !== 'poppies'}>
          <PoppyControls {...poppies} intro={t.poppyIntro} onPlaced={() => setGrowFrom(performance.now())} />
        </section>

        <section className="gwm-panel gwm-panel-remember" id="gwm-panel-remember" role="tabpanel" aria-labelledby="gwm-tab-remember" hidden={tab !== 'remember'}>
          <p className="gwm-intro">{t.rememberIntro}</p>
          <RememberSoldier />
        </section>

        {/* Always mounted: at 11:00 on November 11 the silence begins by itself, whichever tab is open. */}
        <section className="gwm-panel gwm-panel-silence" id="gwm-panel-silence" role="tabpanel" aria-labelledby="gwm-tab-silence" hidden={tab !== 'silence'}>
          <TwoMinuteSilence />
        </section>
      </div>
      </SourcesDrawer>
    </RoomShell>
  );
}
