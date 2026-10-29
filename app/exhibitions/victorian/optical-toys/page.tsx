'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import Thaumatrope from './Thaumatrope';
import Zoetrope from './Zoetrope';
import { TOYS_TEXT, type DiscId, type StripId } from './toysText';
import './optical-toys.css';

/*
 * The optical toys, on one screen: a parlour papered in the exhibition's
 * damask, the toy at its centre, and a card of green linen beside it with
 * the controls and a line from the posters. Two tabs: the thaumatrope and the
 * zoetrope, each with its own address (#thaumatrope, #zoetrope).
 */

const TABS = [
  { id: 'thaumatrope', label: TOYS_TEXT.thaumaHeading },
  { id: 'zoetrope', label: TOYS_TEXT.zoeHeading },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#(vto-)?/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function VictorianOpticalToys() {
  const t = TOYS_TEXT;
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('thaumatrope');
  const [disc, setDisc] = useState<DiscId>('tree');
  const [strip, setStrip] = useState<StripId>('locomotive');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ thaumatrope: null, zoetrope: null });

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
    <RoomShell className="vb-optical">
      <div className="vto-stage" data-tab={tab}>
        <div className="vto-room" aria-hidden="true">
          <div className="vto-paper" />
          <div className="vto-light" />
          <div className="vto-table" />
        </div>

        <header className="vto-bar">
          <h1 className="vto-title">{t.title}</h1>
          <div className="vto-tabs" role="tablist" aria-label="The optical toys">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`vto-tab-${x.id}`}
                aria-controls={`vto-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="vto-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        <section className="vto-panel" id="vto-panel-thaumatrope" role="tabpanel" aria-labelledby="vto-tab-thaumatrope" hidden={tab !== 'thaumatrope'}>
          {tab === 'thaumatrope' && <Thaumatrope reduced={reduced} disc={disc} onDisc={setDisc} intro={t.thaumaIntro} />}
        </section>

        <section className="vto-panel" id="vto-panel-zoetrope" role="tabpanel" aria-labelledby="vto-tab-zoetrope" hidden={tab !== 'zoetrope'}>
          {tab === 'zoetrope' && <Zoetrope reduced={reduced} strip={strip} onStrip={setStrip} intro={t.zoeIntro} />}
        </section>
      </div>
    </RoomShell>
  );
}
