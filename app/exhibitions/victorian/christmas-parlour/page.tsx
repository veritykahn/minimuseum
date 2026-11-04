'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import GhostStory from './GhostStory';
import ParlourScene from './ParlourScene';
import { GHOST_TEXT } from './ghostText';
import { PARLOUR_SOURCES, PARLOUR_TEXT, PARTS, type PartId } from './parlourText';
import './parlour.css';

/*
 * Dickens' Christmas parlour, on one screen, in two tabs, each its own
 * address (#parlour, #ghost-story).
 *
 * The parlour: a parlour on Christmas Eve (the owner's paintings,
 * ParlourScene), cold at first, and beside it the green linen card. Open
 * the parts of a Victorian Christmas the poster names (the clock, the
 * tree, the cards, the book, the window, the fire), in the room or from
 * the card's list, in any order: each comes to life, the room grows
 * warmer, and the card sets the poster's line for it. With all six open,
 * the poster's last word.
 *
 * A ghost story: write your own Christmas ghost story, a Victorian
 * Christmas tradition, and print it (GhostStory).
 *
 * Its words are large, for a class reading them off a projector.
 */

const TABS = [
  { id: 'parlour', label: 'The parlour' },
  { id: 'ghost-story', label: GHOST_TEXT.tab },
] as const;
type TabId = (typeof TABS)[number]['id'];

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

export default function VictorianChristmasParlour() {
  const t = PARLOUR_TEXT;
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('parlour');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ parlour: null, 'ghost-story': null });
  const [open, setOpen] = useState<Set<PartId>>(() => new Set());
  const [current, setCurrent] = useState<PartId | null>(null);
  const [status, setStatus] = useState('');

  const part = PARTS.find((p) => p.id === current);
  const all = open.size === PARTS.length;

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

  // With the sixth part open, the card scrolls down to the poster's last word, wherever the card was left.
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = card.current;
    if (all && el && el.scrollHeight > el.clientHeight) el.scrollTo?.({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [all, reduced]);

  const openPart = (id: PartId) => {
    const p = PARTS.find((x) => x.id === id)!;
    const next = new Set(open).add(id);
    setOpen(next);
    setCurrent(id);
    setStatus(`${p.opened}${next.size === PARTS.length && open.size < PARTS.length ? ' Every part of the parlour is open.' : ` ${next.size} of ${PARTS.length} open.`}`);
  };

  const startAgain = () => {
    setOpen(new Set());
    setCurrent(null);
    setStatus('The parlour is dark again.');
  };

  return (
    <RoomShell className="vb-parlour">
      <SourcesDrawer groups={PARLOUR_SOURCES}>
      <div className="vbr-stage vcp-stage" data-warm={all || undefined} data-tab={tab}>
        <div className="vbr-room" aria-hidden="true">
          <div className="vbr-paper" />
          <div className="vbr-light" />
        </div>

        <header className="vbr-bar">
          <h1 className="vbr-title">{t.title}</h1>
          <div className="vbr-tabs" role="tablist" aria-label="The parlour">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`vcp-tab-${x.id}`}
                aria-controls={`vcp-panel-${x.id}`}
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

        <div className="vcp-panel" id="vcp-panel-parlour" role="tabpanel" aria-labelledby="vcp-tab-parlour" hidden={tab !== 'parlour'}>
          <div className="vbr-scene vcp-scene-wrap">
            <ParlourScene open={open} current={current} onPart={openPart} reduced={reduced} />
          </div>

          <section ref={card} className="vbr-card vcp-card" aria-label="The parts of a Victorian Christmas">
            {/* The parts come first, so they stay put as the part below them changes. */}
            <ol className="vcp-parts" aria-label="Open each part">
              {PARTS.map((p) => (
                <li key={p.id}>
                  <button type="button" className="vcp-part-button" aria-pressed={open.has(p.id)} aria-current={current === p.id ? 'true' : undefined} onClick={() => openPart(p.id)}>
                    <span className="vcp-part-mark" aria-hidden="true">{open.has(p.id) ? '✦' : '○'}</span>
                    <Italics text={p.name === 'A Christmas Carol' ? '*A Christmas Carol*' : p.name} />
                  </button>
                </li>
              ))}
            </ol>

            {!part ? (
              <>
                <figure className="vbr-quote">
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <Italics text={t.cite} />
                  </figcaption>
                </figure>
                <p className="vbr-intro">{t.intro}</p>
              </>
            ) : (
              <div className="vcp-part" key={part.id}>
                <h2>
                  <Italics text={part.name === 'A Christmas Carol' ? '*A Christmas Carol*' : part.name} />
                </h2>
                <p className="vbr-poster">
                  <Italics text={part.poster} />
                </p>
                {part.note && <FactNote fact={part.note} className="vbr-fact" />}
                {part.id === 'cards' && (
                  <p className="vbr-note">
                    <Link href="/exhibitions/victorian/christmas-card">Make your own Victorian Christmas card</Link>
                  </p>
                )}
                {part.id === 'book' && (
                  <button type="button" className="vbr-button" onClick={() => choose('ghost-story')}>
                    Write your own Christmas ghost story <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            )}

            {all && (
              <div className="vcp-closing">
                {t.closing.map((c) => (
                  <p key={c}>{c}</p>
                ))}
                <button type="button" className="vbr-button vbr-button-quiet" onClick={startAgain}>
                  Start again
                </button>
              </div>
            )}
          </section>

          <p className="vbr-status" role="status" aria-live="polite">{status}</p>
        </div>

        <div className="vcp-panel" id="vcp-panel-ghost-story" role="tabpanel" aria-labelledby="vcp-tab-ghost-story" hidden={tab !== 'ghost-story'}>
          <GhostStory />
        </div>
      </div>
      </SourcesDrawer>
    </RoomShell>
  );
}

/** "*…*" set in italics, as the posters set the book's title. */
function Italics({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((s, i) => (i % 2 ? <em key={i}>{s}</em> : <Fragment key={i}>{s}</Fragment>))}
    </>
  );
}
