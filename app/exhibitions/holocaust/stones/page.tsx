'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { HOLOCAUST } from '../holocaust';
import MemorialStone, { StoneControls } from './MemorialStone';
import Stillness from './Stillness';
import { useStones } from './useStones';
import './memorial-stone.css';

/*
 * Lay a Stone, on one screen: a memorial stone in a dark room, with the
 * stones visitors have laid along its ledge, and two tabs beside it: lay a
 * stone, and a minute's stillness with the words of Martin Niemöller. Each
 * tab has its own address (#stone, #stillness). Quiet throughout: no sound,
 * nothing celebrates.
 */

const TABS = [
  { id: 'stone', label: 'Lay a stone' },
  { id: 'stillness', label: 'Stillness' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function LayAStone() {
  const { fonts, slug } = HOLOCAUST;
  const stones = useStones();
  const [settleFrom, setSettleFrom] = useState<number | null>(null);
  const [tab, setTab] = useState<TabId>('stone');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ stone: null, stillness: null });

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

  const style: CssVars = {
    background: '#0e0d0c',
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
  };

  return (
    <div className="pe-root ho-room" data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="hos-stage" data-tab={tab}>
        <MemorialStone count={stones.count} settleFrom={settleFrom} />

        <header className="hos-bar">
          <h1 className="hos-title">
            Lay a Stone
            <span className="hos-title-date">January 27</span>
          </h1>
          <div className="hos-tabs" role="tablist" aria-label="The memorial stone">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`hos-tab-${x.id}`}
                aria-controls={`hos-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="hos-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        <section className="hos-panel" id="hos-panel-stone" role="tabpanel" aria-labelledby="hos-tab-stone" hidden={tab !== 'stone'}>
          <StoneControls {...stones} onLaid={() => setSettleFrom(performance.now())} />
        </section>

        <section className="hos-panel hos-panel-stillness" id="hos-panel-stillness" role="tabpanel" aria-labelledby="hos-tab-stillness" hidden={tab !== 'stillness'}>
          <Stillness />
        </section>
      </main>
    </div>
  );
}
