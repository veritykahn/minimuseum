'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { WRITING_REVOLUTION } from '../writingRevolution';
import Typewriter from './Typewriter';
import IMac from './IMac';
import TopRow from './TopRow';
import ClassBoard from './ClassBoard';
import { STATION_TEXT } from './stationText';
import { useTypingSound } from './typingSound';
import { useClassBoard } from './useClassBoard';
import '../writing-revolution.css';
import './typing.css';

/*
 * The typing station, on one screen, as the installation pairs them: the
 * same line typed on a mechanical typewriter and on an iMac running a word
 * processor, with a third tab for the poster's top-row challenge and a
 * fourth, the class board, where messages typed on either machine are
 * posted and printed (ClassBoard.tsx, useClassBoard.ts). Each tab has its
 * own address (#typewriter, #imac, #top-row, #board; a saved board opens
 * from ?board=<code>#board), and each machine keeps its page while you try
 * the other. Sound is off until the visitor turns it on or starts typing,
 * and the switch is always in the corner.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

const TABS = [
  { id: 'typewriter', label: STATION_TEXT.typewriterTab },
  { id: 'imac', label: STATION_TEXT.imacTab },
  { id: 'top-row', label: STATION_TEXT.topRowTab },
  { id: 'board', label: STATION_TEXT.boardTab },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function TypingStation() {
  const { fonts, palette, slug } = WRITING_REVOLUTION;
  const sound = useTypingSound();
  const [tab, setTab] = useState<TabId>('typewriter');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ typewriter: null, imac: null, 'top-row': null, board: null });
  const board = useClassBoard();
  /** Why a message couldn't go up, shown by the machine it was typed on. */
  const [refusal, setRefusal] = useState('');
  const { open } = board;

  // A link to a saved board (?board=<code>) opens it.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('board');
    if (!code) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address names the tab to show
    setTab('board');
    void open(code);
  }, [open]);

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace(/^#/, '');
      const t = TABS.find((x) => x.id === h);
      if (t) setTab(t.id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((id: TabId, focus = false) => {
    setTab(id);
    setRefusal('');
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
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };
  const on = sound.state === 'on';

  // A message posted from a machine goes up on the board, and the board is shown.
  const postFrom = (machine: 'typewriter' | 'imac') => (text: string, font?: string) => {
    const refused = board.post(text, machine, font);
    setRefusal(refused ?? '');
    if (!refused) choose('board');
    return refused;
  };

  return (
    <div className="pe-root wrs-room" data-exhibition={slug} data-tab={tab} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <button type="button" className="wrs-sound" aria-pressed={on} onClick={sound.toggle}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          {on ? <path className="wrs-sound-waves" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" /> : <path className="wrs-sound-waves" d="M16 9l6 6M22 9l-6 6" />}
        </svg>
        <span className="wrs-sound-label">{on ? STATION_TEXT.soundOn : STATION_TEXT.soundOff}</span>
      </button>

      <main className="wrs-stage">
        <div className="wrs-blocks" aria-hidden="true">
          <span className="wrs-block-top" />
          <span className="wrs-frame" />
        </div>

        <header className="wrs-bar">
          <h1 className="wrs-title">{STATION_TEXT.title}</h1>
          <div className="wrs-tabs" role="tablist" aria-label={STATION_TEXT.title}>
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`wrs-tab-${x.id}`}
                aria-controls={`wrs-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="wrs-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
          {(tab === 'typewriter' || tab === 'imac') && (
            <p className="wrs-line">
              <span className="wrs-line-label">{STATION_TEXT.lineLabel}</span> {STATION_TEXT.line}
            </p>
          )}
        </header>

        {refusal && (
          <p className="wrs-refusal" aria-hidden="true">
            {refusal}
          </p>
        )}

        {/* All four stay mounted, so each keeps its page while you try another. */}
        <section className="wrs-panel wrs-panel-typewriter" id="wrs-panel-typewriter" role="tabpanel" aria-labelledby="wrs-tab-typewriter" hidden={tab !== 'typewriter'}>
          <Typewriter play={sound.play} onPost={postFrom('typewriter')} />
        </section>
        <section className="wrs-panel wrs-panel-imac" id="wrs-panel-imac" role="tabpanel" aria-labelledby="wrs-tab-imac" hidden={tab !== 'imac'}>
          <IMac play={sound.play} onPost={postFrom('imac')} />
        </section>
        <section className="wrs-panel wrs-panel-top-row" id="wrs-panel-top-row" role="tabpanel" aria-labelledby="wrs-tab-top-row" hidden={tab !== 'top-row'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wrs-urania" src="/exhibitions/writing-revolution/urania.webp" alt="" aria-hidden="true" />
          <TopRow play={sound.play} />
        </section>
        <section className="wrs-panel wrs-panel-board" id="wrs-panel-board" role="tabpanel" aria-labelledby="wrs-tab-board" hidden={tab !== 'board'}>
          <ClassBoard board={board} onWrite={(t) => choose(t, true)} />
        </section>
      </main>
    </div>
  );
}
