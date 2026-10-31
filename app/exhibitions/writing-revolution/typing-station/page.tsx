'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { srOnly } from '@/lib/a11y';
import { WRITING_REVOLUTION } from '../writingRevolution';
import Typewriter from './Typewriter';
import IMac from './IMac';
import TopRow from './TopRow';
import ClassBoard from './ClassBoard';
import { PromptLine } from './PromptPanel';
import { RaceBar, RaceResults, newRace, raceMessage, type RaceState } from './Race';
import { mistakesLeft, spokenTime } from './challenges';
import { STATION_TEXT } from './stationText';
import { useTypingSound } from './typingSound';
import { useClassBoard } from './useClassBoard';
import type { Machine } from '@/lib/classBoard';
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
 *
 * Over the machines: the teacher's prompt when one is set (PromptPanel.tsx,
 * set on the class board), and the race between the two machines
 * (Race.tsx). The top row has its "beat ten" challenge (TopRow.tsx).
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
  const back = useMuseumReturn(roomReturn(WRITING_REVOLUTION));
  const sound = useTypingSound();
  const [tab, setTab] = useState<TabId>('typewriter');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ typewriter: null, imac: null, 'top-row': null, board: null });
  const board = useClassBoard();
  /** Why a message couldn't go up, shown by the machine it was typed on. */
  const [refusal, setRefusal] = useState('');
  const { open } = board;
  const [promptEditing, setPromptEditing] = useState(false);
  /** What each machine's page says now: the word list's ticks, and the race's check. */
  const [typed, setTyped] = useState<Record<Machine, string>>({ typewriter: '', imac: '' });
  const strikesRef = useRef(0);
  const [race, setRaceState] = useState<RaceState | null>(null);
  const raceRef = useRef<RaceState | null>(null);
  const setRace = (next: RaceState | null) => {
    raceRef.current = next;
    setRaceState(next);
  };
  /** Each race starts both machines on a fresh page. */
  const [round, setRound] = useState(0);
  /** What the race says aloud: a clock stopping, the winner. */
  const [raceSaid, setRaceSaid] = useState('');

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

  /* ───────── The race ───────── */
  const focusMachine = (m: Machine) => requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>(m === 'imac' ? '.wri-text' : '.wrt-field')?.focus());

  const startRace = () => {
    setRound((n) => n + 1);
    setTyped({ typewriter: '', imac: '' });
    strikesRef.current = 0;
    setRace(newRace());
    setRaceSaid(STATION_TEXT.race.first);
    choose('typewriter');
    focusMachine('typewriter');
  };

  /** The racing machine's clock stops: by itself when the line is right, or at "Stop the clock". */
  const stopClock = (machine: Machine, text: string) => {
    const r = raceRef.current;
    if (!r || r.stage !== machine || r.start === null) return;
    const ms = Date.now() - r.start;
    const next: RaceState = {
      ...r,
      start: null,
      stage: machine === 'typewriter' ? 'imac' : 'done',
      times: { ...r.times, [machine]: ms },
      mistakes: { ...r.mistakes, [machine]: mistakesLeft(text, STATION_TEXT.line) },
      strikeOvers: machine === 'typewriter' ? strikesRef.current : r.strikeOvers,
    };
    setRace(next);
    sound.play('bell');
    const name = machine === 'imac' ? STATION_TEXT.imacTab : STATION_TEXT.typewriterTab;
    setRaceSaid(`${name}: ${spokenTime(ms)}. ${machine === 'typewriter' ? STATION_TEXT.race.next : ''}`);
  };

  // Each machine tells the room what its page says, keystroke by keystroke.
  const hear = (machine: Machine, text: string, strikes = 0) => {
    if (machine === 'typewriter') strikesRef.current = strikes;
    setTyped((t) => (t[machine] === text ? t : { ...t, [machine]: text }));
    const r = raceRef.current;
    if (!r || r.stage !== machine) return;
    if (r.start === null) {
      if (!text) return;
      setRace({ ...r, start: Date.now() });
    }
    if (mistakesLeft(text, STATION_TEXT.line) === 0) stopClock(machine, text);
  };

  const onToImac = () => {
    choose('imac');
    focusMachine('imac');
  };

  const showLine = tab === 'typewriter' || tab === 'imac';
  const racing = race && race.stage !== 'done' && showLine;

  return (
    <div className="pe-root wrs-room" data-exhibition={slug} data-tab={tab} data-race={racing ? 'on' : undefined} data-prompt={board.prompt && showLine && !racing ? board.prompt.kind : undefined} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
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
          {racing ? (
            <RaceBar race={race} line={STATION_TEXT.line} tab={tab} onStop={() => stopClock(race.stage as Machine, typed[race.stage as Machine])} onNext={onToImac} onQuit={() => setRace(null)} />
          ) : (
            showLine && (
              <div className="wrs-line-row">
                {board.prompt ? (
                  <PromptLine prompt={board.prompt} typed={typed[tab as Machine]} />
                ) : (
                  <p className="wrs-line">
                    <span className="wrs-line-label">{STATION_TEXT.lineLabel}</span> {STATION_TEXT.line}
                  </p>
                )}
                <button type="button" className="wrs-button wrs-race-start" onClick={startRace}>
                  <span aria-hidden="true">⏱ </span>
                  {STATION_TEXT.race.start}
                </button>
              </div>
            )
          )}
        </header>

        {refusal && (
          <p className="wrs-refusal" aria-hidden="true">
            {refusal}
          </p>
        )}
        <p role="status" style={srOnly}>{raceSaid}</p>

        {/* All four stay mounted, so each keeps its page while you try another; a race starts both on a fresh page. */}
        <section className="wrs-panel wrs-panel-typewriter" id="wrs-panel-typewriter" role="tabpanel" aria-labelledby="wrs-tab-typewriter" hidden={tab !== 'typewriter'}>
          <Typewriter key={`typewriter-${round}`} play={sound.play} onPost={postFrom('typewriter')} onText={(text, strikes) => hear('typewriter', text, strikes)} />
        </section>
        <section className="wrs-panel wrs-panel-imac" id="wrs-panel-imac" role="tabpanel" aria-labelledby="wrs-tab-imac" hidden={tab !== 'imac'}>
          <IMac key={`imac-${round}`} play={sound.play} onPost={postFrom('imac')} onText={(text) => hear('imac', text)} />
        </section>
        <section className="wrs-panel wrs-panel-top-row" id="wrs-panel-top-row" role="tabpanel" aria-labelledby="wrs-tab-top-row" hidden={tab !== 'top-row'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wrs-urania" src="/exhibitions/writing-revolution/urania.webp" alt="" aria-hidden="true" />
          <TopRow play={sound.play} onPost={(text) => postFrom('typewriter')(text)} />
        </section>
        <section className="wrs-panel wrs-panel-board" id="wrs-panel-board" role="tabpanel" aria-labelledby="wrs-tab-board" hidden={tab !== 'board'}>
          <ClassBoard board={board} onWrite={(t) => choose(t, true)} promptEditing={promptEditing} setPromptEditing={setPromptEditing} />
        </section>

        {race?.stage === 'done' && (
          <RaceResults
            race={race}
            onAgain={startRace}
            onPost={() => {
              const r = race;
              setRace(null);
              postFrom('typewriter')(raceMessage(r));
            }}
            onClose={() => setRace(null)}
          />
        )}
      </main>
    </div>
  );
}
