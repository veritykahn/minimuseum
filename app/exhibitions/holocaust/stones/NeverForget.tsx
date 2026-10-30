'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { HOLOCAUST } from '../holocaust';
import MemorialStone, { StoneControls } from './MemorialStone';
import Countdown from './Countdown';
import Stillness from './Stillness';
import { WalkControls, WalkFull, WalkScene, useWalk } from './Walk';
import type { Ambient } from './walkLines';
import { useStones } from './useStones';
import './memorial-stone.css';

/*
 * Never Forget (it was "Lay a Stone"), on one screen: a memorial stone in a dark room, with the
 * stones visitors have laid along its ledge, and three tabs beside it: lay
 * a stone; a minute's stillness with the words of Martin Niemöller, and
 * names, words and questions shown during it (stillnessPrompts.ts); and the
 * walk, full screen, a path of plain stones to walk over, after Menashe
 * Kadishman's Fallen Leaves, a line of the history a step (Walk.tsx). Each tab has its own address (#stone,
 * #stillness, #walk). Under the title, the days to International Holocaust
 * Remembrance Day (Countdown.tsx). Quiet throughout: nothing celebrates,
 * and the only sound is the walk's footsteps, off until the visitor turns
 * them on.
 */

const TABS = [
  { id: 'stone', label: 'Lay a stone' },
  { id: 'stillness', label: 'Stillness' },
  { id: 'walk', label: 'The walk' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function NeverForget({ pictures = [], ambients = [] }: { pictures?: readonly string[]; ambients?: readonly Ambient[] }) {
  const { fonts, slug } = HOLOCAUST;
  const back = useMuseumReturn(roomReturn(HOLOCAUST));
  const stones = useStones();
  const [settleFrom, setSettleFrom] = useState<number | null>(null);
  const [tab, setTab] = useState<TabId>('stone');
  const walk = useWalk(ambients);
  const { stop: stopWalking } = walk;
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ stone: null, stillness: null, walk: null });

  useEffect(() => {
    const fromHash = () => {
      const h = tabFromHash(window.location.hash);
      if (h) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // Niemöller's words are set in League Gothic, which the browser fetches only when they are first shown; fetch it now, so they never appear first in another face.
  useEffect(() => {
    document.fonts?.load('1em "League Gothic"').catch(() => undefined);
  }, []);

  // Leaving the walk stops it.
  useEffect(() => {
    if (tab !== 'walk') stopWalking();
  }, [tab, stopWalking]);

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

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="hos-stage" data-tab={tab}>
        {tab === 'walk' ? <WalkScene steps={walk.steps} stepAt={walk.stepAt} reduced={walk.reduced} /> : <MemorialStone count={stones.count} settleFrom={settleFrom} />}

        <header className="hos-bar">
          <h1 className="hos-title">
            Never Forget
            <span className="hos-title-date">January 27</span>
          </h1>
          <Countdown />
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

        <section className="hos-panel hos-panel-walk" id="hos-panel-walk" role="tabpanel" aria-labelledby="hos-tab-walk" hidden={tab !== 'walk'}>
          <WalkControls {...walk} />
        </section>
        {tab === 'walk' && walk.full && <WalkFull walk={walk} pictures={pictures} />}
      </main>
    </div>
  );
}
