'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import Modal from '../Modal';
import { useTomb } from '../tombState';
import { WALLS, detailAt, tombSources } from './scenes';
import TorchStage from './TorchStage';
import DetailCrop from './DetailCrop';
import './tomb.css';
import { playEgypt, startTorch } from '../egyptSound';

/*
 * The Tomb Explorer: five painted walls from tombs at Thebes, in the dark.
 * It opens on the room's dark intro (DarkIntro), then the first painting
 * fills the screen, black. The visitor turns on their torch (a big button
 * on the dark wall, and an on/off switch in the bar beneath), and only
 * while it is on can they search: its circle of light follows the mouse,
 * the finger or the arrow keys. Each wall hides three details; each one
 * found opens a card with that piece of the painting, up close, and what it
 * tells us. Once all three are found, the whole wall lights up, and the bar
 * beneath it gives the one big fact about that wall.
 *
 * Each wall is a tab with its own #address. What has been found is kept in
 * this browser (tombState.ts); "Search again" hides a wall's finds, for the
 * next visitor at the same computer.
 */

const SOURCES = tombSources();
const IDS = WALLS.map((w) => w.id);

/** The intro, read aloud (voice "tomb-intro"). The first line is the room's own. */
const INTRO = [
  'It is dark in the tomb.',
  'Its walls were painted more than three thousand years ago.',
  'Turn on your torch, and search each wall for what is hidden in the dark.',
  'Find everything on a wall, and the whole wall lights up.',
];

const cap = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`;

export default function TombExplorer() {
  const [intro, setIntro] = useState(true);
  const [view, setView] = useState<string>(IDS[0]);
  const [torch, setTorch] = useState(false);
  const [status, setStatus] = useState('');
  // The detail whose card is open (on this wall), if any.
  const [found, setFound] = useState<string | null>(null);
  const [tomb, updateTomb] = useTomb();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lightRef = useRef<HTMLButtonElement>(null);
  const index = Math.max(0, IDS.indexOf(view));
  const wall = WALLS[index];
  const foundHere = tomb.found[wall.id] ?? [];
  const wallDone = wall.details.every((d) => foundHere.includes(d.id));
  // The whole wall lights up once its last card is closed.
  const lit = wallDone && !found;

  // The torch crackles while it is lit in the visitor's hand.
  useEffect(() => (!intro && torch && !lit ? startTorch() : undefined), [intro, torch, lit]);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (IDS.includes(id)) setView(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // Into the room: the first thing to do is the torch.
  useEffect(() => {
    if (!intro) lightRef.current?.focus({ preventScroll: true });
  }, [intro]);

  const focusStage = () => window.requestAnimationFrame(() => document.querySelector<HTMLElement>('.egt-stage')?.focus({ preventScroll: true }));

  const switchTorch = (on: boolean) => {
    setTorch(on);
    playEgypt(on ? 'find' : 'grind');
    setStatus(on ? 'Your torch is on. Move it over the wall to search.' : 'Your torch is off. It is dark.');
  };

  const choose = (id: string, focus = false) => {
    if (id !== view) playEgypt('grind');
    setView(id);
    setFound(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
    const w = WALLS.find((x) => x.id === id)!;
    setStatus(`${w.name}. Search with the torch for ${w.details.map((d) => d.label).join(', ')}.`);
    if (focus) tabRefs.current[id]?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' ? (index + 1) % IDS.length
      : e.key === 'ArrowLeft' ? (index - 1 + IDS.length) % IDS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? IDS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(IDS[to], true);
  };

  /** The torch is on a detail: remembered, ringed, announced and shown in its card. The last of every wall completes the walls. */
  const onTorch = useCallback(
    (x: number, y: number) => {
      if (!torch) return;
      const d = detailAt(wall.details, x, y);
      const list = tomb.found[wall.id] ?? [];
      if (!d || list.includes(d.id)) return;
      updateTomb((s) => {
        const had = s.found[wall.id] ?? [];
        if (had.includes(d.id)) return s;
        const all = { ...s.found, [wall.id]: [...had, d.id] };
        const every = WALLS.every((w) => w.details.every((t) => (all[w.id] ?? []).includes(t.id)));
        return { ...s, found: all, done: every ? { ...s.done, walls: true } : s.done };
      });
      playEgypt('find');
      const last = list.length + 1 === wall.details.length;
      setStatus(last ? `You found ${d.label}! That is everything on this wall.` : `You found ${d.label}!`);
      setFound(d.id);
    },
    [torch, wall, tomb.found, updateTomb],
  );

  const searchAgain = () => {
    updateTomb((s) => {
      const rest = { ...s.found };
      delete rest[wall.id];
      return { ...s, found: rest };
    });
    setStatus(`${wall.name}: dark again. Search it with your torch.`);
  };

  const closeCard = () => {
    const finishing = wallDone;
    setFound(null);
    if (finishing) {
      playEgypt('find');
      setStatus(`The whole wall is lit. ${wall.big.text}`);
    }
  };

  const card = found ? wall.details.find((d) => d.id === found) : undefined;
  const cardIndex = card ? foundHere.indexOf(card.id) + 1 : 0;
  const last = index === WALLS.length - 1;
  const nextWall = () => choose(IDS[(index + 1) % IDS.length]);
  const stageLabel = `${wall.title}. ${lit ? 'The whole wall is lit.' : torch ? 'Move the torch with the arrow keys.' : 'It is dark: turn on your torch to search.'} ${wall.alt}`;

  return (
    <RoomShell className="eg-tomb" sources={SOURCES} fit>
      {intro && <DarkIntro title="Tomb Explorer" lines={INTRO} voice="tomb-intro" begin="Enter the tomb" onDone={() => setIntro(false)} />}

      <RoomHeader kicker="Interactive · Into the dark" title="Tomb Explorer">
        <div className="egr-tabs egt-tabs" role="tablist" aria-label="The painted walls">
          {WALLS.map((w) => {
            const complete = w.details.every((d) => (tomb.found[w.id] ?? []).includes(d.id));
            return (
              <button
                key={w.id}
                ref={(el) => {
                  tabRefs.current[w.id] = el;
                }}
                type="button"
                role="tab"
                id={`egt-tab-${w.id}`}
                aria-controls="egt-panel"
                aria-selected={w.id === wall.id}
                tabIndex={w.id === wall.id ? 0 : -1}
                className="egr-tab"
                onClick={() => choose(w.id)}
                onKeyDown={onTabKey}
              >
                {w.name}
                {complete && <span className="egt-tick" aria-label=" (complete)">✓</span>}
              </button>
            );
          })}
        </div>
      </RoomHeader>

      <div className="egt-view egr-fill" id="egt-panel" role="tabpanel" aria-labelledby={`egt-tab-${wall.id}`}>
        <div className={`egt-stage-cell egr-sizer ${lit ? 'is-lit' : ''}`}>
          <TorchStage
            key={wall.id}
            width={wall.width}
            height={wall.height}
            torch={torch}
            lit={lit}
            rings={wall.details.filter((d) => foundHere.includes(d.id))}
            onTorch={onTorch}
            label={stageLabel}
            overlay={
              !torch && !wallDone ? (
                <button
                  ref={lightRef}
                  type="button"
                  className="egt-light"
                  onClick={() => {
                    switchTorch(true);
                    focusStage();
                  }}
                >
                  <span className="egt-flame" aria-hidden="true" />
                  Turn on your torch
                </button>
              ) : null
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-picture src={wall.src} alt="" width={wall.width} height={wall.height} draggable={false} />
          </TorchStage>
        </div>

        {/* The wall's bar: the torch, what to search for, and the way on. Once the wall is lit, its big fact. */}
        <section className={`egt-bar ${lit ? 'is-lit' : ''}`} aria-label={wall.name}>
          {lit ? (
            <>
              <div className="egt-bar-info">
                <p className="egr-label">
                  Wall {index + 1} of {WALLS.length} · <span className="egt-count is-done">Wall complete</span>
                </p>
                <h2 className="egt-bar-title">{wall.title}</h2>
              </div>
              <FactNote fact={wall.big} className="egr-fact egt-big" />
            </>
          ) : (
            <>
              <button type="button" role="switch" aria-checked={torch} className="egt-switch" onClick={() => switchTorch(!torch)}>
                <span className="egt-switch-track" aria-hidden="true">
                  <span className="egt-switch-knob" />
                </span>
                <span className="egt-switch-text">
                  Torch <strong aria-hidden="true">{torch ? 'On' : 'Off'}</strong>
                </span>
              </button>
              <div className="egt-bar-info">
                <p className="egr-label">
                  Wall {index + 1} of {WALLS.length} · <span className="egt-count">{foundHere.length} of {wall.details.length} found</span>
                </p>
                <h2 className="egt-bar-title">{wall.title}</h2>
              </div>
              <div className="egt-bar-clues">
                <p className="egt-hint" aria-hidden="true">
                  {torch ? 'Search the dark for:' : 'Turn on your torch to search for:'}
                </p>
                <ul className="egt-clues">
                  {wall.details.map((d) => {
                    const got = foundHere.includes(d.id);
                    return (
                      <li key={d.id} className={got ? 'is-found' : ''}>
                        {got ? (
                          <button type="button" className="egt-clue" onClick={() => setFound(d.id)} aria-label={`Found: ${d.label}. See it again`}>
                            <span className="egt-clue-mark" aria-hidden="true">✓</span>
                            <span>{d.label}</span>
                          </button>
                        ) : (
                          <p className="egt-clue">
                            <span className="egt-clue-mark" aria-hidden="true">?</span>
                            <span>{d.label}</span>
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
          <div className="egr-actions egt-bar-actions">
            {lit && (
              <button type="button" className="egr-button egr-button-quiet" onClick={searchAgain}>
                Search again
              </button>
            )}
            <button type="button" className={`egr-button ${lit ? 'egr-button-primary' : ''}`} onClick={nextWall}>
              {last ? 'Back to the first wall' : 'Next wall'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

      {/* A find, in its own card: that piece of the painting, up close, and what it tells us. */}
      <Modal open={!!card} onClose={closeCard} tone="gold" kicker={card ? `Found! · ${cardIndex} of ${wall.details.length}` : undefined} title={card ? cap(card.label) : ''}>
        {card && (
          <>
            <DetailCrop src={wall.src} width={wall.width} height={wall.height} detail={card} label={`Close-up of ${card.label}, from the painting`} />
            <FactNote fact={card.tells} className="egr-fact" />
            {wallDone ? <p className="egt-found">That’s everything on this wall!</p> : <p className="egt-left">{wall.details.length - foundHere.length} more to find on this wall.</p>}
            <div className="egr-actions">
              <button type="button" className="egr-button egr-button-primary" onClick={closeCard}>
                {wallDone ? 'Light up the wall' : 'Keep searching'}
              </button>
            </div>
          </>
        )}
      </Modal>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
