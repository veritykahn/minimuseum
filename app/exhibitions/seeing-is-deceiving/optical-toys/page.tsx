'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import FactNote from '@/components/exhibition/FactNote';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import Thaumatrope from './Thaumatrope';
import Zoetrope from './Zoetrope';
import { TOY_NOTES, TOYS_TEXT, type StripId } from './toysText';
import './optical-toys.css';

/*
 * The optical toys, on one screen, in Seeing is Deceiving's dark: the toy
 * lit at the centre as if on a screen in a darkened room, the edges of an old
 * film strip running past above and below, and beside it a card with the
 * controls and the poster's own lines, set as "The First Motion Pictures
 * (1820s–1830s)" sets them. Two tabs: the thaumatrope and the zoetrope, each
 * with its own address (#thaumatrope, #zoetrope). Both start slowly and
 * build up (spin.ts), so the visitor can see how they work.
 *
 * Each toy's card adds a note on its history, and one note for both toys,
 * set once (only the open toy's card is drawn): owner-approved and
 * fact-checked, from outside the poster, each set with its source
 * (toysText.ts).
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

export default function SeeingOpticalToys() {
  const t = TOYS_TEXT;
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('thaumatrope');
  const [strip, setStrip] = useState<StripId>('horses');
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

  // The one note for both toys, under whichever toy is open, and the credit for both toys’ illustrations.
  const both = (
    <>
      <FactNote fact={TOY_NOTES.both} className="vto-fact" />
    </>
  );

  return (
    <div className="sid-toys">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');`}</style>

      <ExhibitionNav className="sid-nav" href="/exhibitions/seeing-is-deceiving/artifacts?view=interactives">
        <span className="sid-nav-m" aria-hidden="true">M</span>
        <span className="sid-nav-arrow" aria-hidden="true">←</span>
        <span className="sid-nav-label">Display Case</span>
      </ExhibitionNav>

      <main className="vto-stage" data-tab={tab}>
        <div className="vto-room" aria-hidden="true">
          <div className="vto-beam" />
          <div className="vto-film vto-film-top" />
          <div className="vto-film vto-film-bottom" />
          <div className="vto-grain" />
        </div>

        <header className="vto-bar">
          <p className="vto-kicker">{t.section}</p>
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
          {tab === 'thaumatrope' && <Thaumatrope reduced={reduced} intro={t.thaumaIntro} footer={both} />}
        </section>

        <section className="vto-panel" id="vto-panel-zoetrope" role="tabpanel" aria-labelledby="vto-tab-zoetrope" hidden={tab !== 'zoetrope'}>
          {tab === 'zoetrope' && <Zoetrope reduced={reduced} strip={strip} onStrip={setStrip} intro={t.zoeIntro} footer={both} />}
        </section>
      </main>
    </div>
  );
}
