'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { BLACK_HISTORY } from '../blackHistory';
import BookSurvey from './BookSurvey';
import DollDesigner from './DollDesigner';
import DollTest from './DollTest';
import { ROOM_TEXT } from './representationText';
import '../black-history.css';
import './representation.css';

/*
 * Who Do You See? Three ways into representation, on one screen, as tabs:
 * design a doll that looks like you or someone you love (#design), learn
 * about Kenneth and Mamie Phipps Clark's doll tests and Brown v. Board of
 * Education (#doll-test), and count who is in the books around you
 * (#books). One room, because they are one question asked three ways, and
 * the room moves from the child to history to the class's own shelves. Each
 * tab keeps its state while you try another.
 *
 * The look is poster 1's lime and its sunburst rays, poster 2's pink for
 * the doll, and the black blob for the history.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

const TABS = [
  { id: 'design', label: ROOM_TEXT.designTab },
  { id: 'doll-test', label: ROOM_TEXT.dollTestTab },
  { id: 'books', label: ROOM_TEXT.booksTab },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function WhoDoYouSee() {
  const { fonts, palette, slug } = BLACK_HISTORY;
  const back = useMuseumReturn(roomReturn(BLACK_HISTORY));
  const [tab, setTab] = useState<TabId>('design');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ design: null, 'doll-test': null, books: null });

  useEffect(() => {
    const fromHash = () => {
      const t = TABS.find((x) => x.id === window.location.hash.replace(/^#/, ''));
      if (t) setTab(t.id);
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
    const to = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(TABS[to].id, true);
  };

  const style: CssVars = {
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className="pe-root bhr-room" data-exhibition={slug} data-tab={tab} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="bhr-stage">
        <div className="bhr-ground" aria-hidden="true">
          <span className="bhr-rays bhr-rays-a" />
          <span className="bhr-rays bhr-rays-b" />
        </div>

        <header className="bhr-bar">
          <h1 className="bhr-title">{ROOM_TEXT.title}</h1>
          <div className="bhr-tabs" role="tablist" aria-label={ROOM_TEXT.title}>
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`bhr-tab-${x.id}`}
                aria-controls={`bhr-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="bhr-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        {/* All three stay mounted, so each keeps its state while you try another. */}
        <section className="bhr-panel" id="bhr-panel-design" role="tabpanel" aria-labelledby="bhr-tab-design" hidden={tab !== 'design'}>
          {/* The designer is one self-contained component: the owner's doll artwork will replace it here, whole. */}
          <DollDesigner />
        </section>
        <section className="bhr-panel" id="bhr-panel-doll-test" role="tabpanel" aria-labelledby="bhr-tab-doll-test" hidden={tab !== 'doll-test'}>
          <DollTest active={tab === 'doll-test'} />
        </section>
        <section className="bhr-panel" id="bhr-panel-books" role="tabpanel" aria-labelledby="bhr-tab-books" hidden={tab !== 'books'}>
          <BookSurvey />
        </section>
      </main>
    </div>
  );
}
