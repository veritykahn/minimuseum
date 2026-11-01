'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader } from '../RoomShell';
import { fromTomb, useTomb } from '../tombState';
import Chamber from './Chamber';
import { CHAMBER, THINGS } from './things';
import { TOMB_NOTES, WALLS, detailAt, tombSources } from './scenes';
import TorchStage from './TorchStage';
import './tomb.css';

/*
 * The Tomb Explorer: the way into the Egypt rooms. First the burial
 * chamber, dark, searched by torchlight: the things found in it open the
 * other rooms, and what the visitor makes in those rooms is left here (the
 * tomb remembers, tombState.ts). Then the painted walls, one at a time,
 * each hiding three details; finding them all completes the wall.
 *
 * Each view is a tab with its own #address. The torch follows the mouse or
 * the finger, or the arrow keys; "Light the whole wall" lifts the dark at
 * once, for anyone who would rather look than search, and leaves a small
 * lens to search with.
 */

const VIEWS = ['chamber', ...WALLS.map((w) => w.id)] as const;
const SOURCES = tombSources([]);

export default function TombExplorer() {
  const [view, setView] = useState<string>('chamber');
  const [lit, setLit] = useState(false);
  const [status, setStatus] = useState('');
  const [tomb, updateTomb] = useTomb();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const index = VIEWS.indexOf(view as (typeof VIEWS)[number]);
  const wall = WALLS.find((w) => w.id === view);
  const seen = tomb.found.chamber ?? [];
  const foundHere = wall ? (tomb.found[wall.id] ?? []) : seen;

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if ((VIEWS as readonly string[]).includes(id)) setView(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = (id: string, focus = false) => {
    setView(id);
    setLit(false);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
    const w = WALLS.find((x) => x.id === id);
    setStatus(w ? `${w.name}. Search with the torch for ${w.details.map((d) => d.label).join(', ')}.` : 'The burial chamber. Search the dark with the torch.');
    if (focus) tabRefs.current[id]?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' ? (index + 1) % VIEWS.length
      : e.key === 'ArrowLeft' ? (index - 1 + VIEWS.length) % VIEWS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? VIEWS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(VIEWS[to], true);
  };

  /** Something found: remembered, ringed and announced. A wall's last detail completes it; every wall, the walls. */
  const find = useCallback(
    (key: string, id: string, said: string) => {
      updateTomb((s) => {
        const list = s.found[key] ?? [];
        if (list.includes(id)) return s;
        const found = { ...s.found, [key]: [...list, id] };
        const wallsDone = WALLS.every((w) => w.details.every((d) => (found[w.id] ?? []).includes(d.id)));
        return { ...s, found, done: wallsDone ? { ...s.done, walls: true } : s.done };
      });
      setStatus(said);
    },
    [updateTomb],
  );

  const onTorch = useCallback(
    (x: number, y: number) => {
      if (wall) {
        const d = detailAt(wall.details, x, y);
        if (d && !(tomb.found[wall.id] ?? []).includes(d.id)) {
          const n = (tomb.found[wall.id] ?? []).length + 1;
          find(wall.id, d.id, n === wall.details.length ? `You found ${d.label}! The wall is complete.` : `You found ${d.label}!`);
        }
      } else {
        const t = detailAt(THINGS, x, y);
        if (t && !(tomb.found.chamber ?? []).includes(t.id)) find('chamber', t.id, `You found ${t.label}.`);
      }
    },
    [wall, tomb.found, find],
  );

  const lightAll = () => {
    const next = !lit;
    setLit(next);
    // In the chamber, lighting it shows everything at once; on a wall, the details are still to find.
    if (next && !wall) for (const t of THINGS) if (!seen.includes(t.id)) find('chamber', t.id, '');
    setStatus(next ? (wall ? 'The whole wall is lit. Search it with the lens.' : 'The whole chamber is lit.') : 'The torch is back.');
  };

  const roomsDone = THINGS.filter((t) => tomb.done[t.room]).length;
  const wallDone = wall ? wall.details.every((d) => foundHere.includes(d.id)) : false;

  return (
    <RoomShell className="eg-tomb" sources={SOURCES}>
      <RoomHeader kicker="Interactive · Into the dark" title="Tomb Explorer">
        <p className="egr-lede">It is dark in the tomb. Carry your torch through it: what you find opens the tomb’s other rooms, and what you make there is left here.</p>
      </RoomHeader>

      <div className="egr-tabs" role="tablist" aria-label="The tomb">
        {VIEWS.map((id) => {
          const w = WALLS.find((x) => x.id === id);
          const complete = w ? w.details.every((d) => (tomb.found[w.id] ?? []).includes(d.id)) : false;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              type="button"
              role="tab"
              id={`egt-tab-${id}`}
              aria-controls="egt-panel"
              aria-selected={id === view}
              tabIndex={id === view ? 0 : -1}
              className="egr-tab"
              onClick={() => choose(id)}
              onKeyDown={onTabKey}
            >
              {w ? w.name : 'The chamber'}
              {complete && <span className="egt-tick" aria-label=" (complete)">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="egr-layout" id="egt-panel" role="tabpanel" aria-labelledby={`egt-tab-${view}`}>
        <div className="egr-scene">
          {wall ? (
            <TorchStage
              key={wall.id}
              width={wall.width}
              height={wall.height}
              lit={lit}
              rings={wall.details.filter((d) => foundHere.includes(d.id))}
              onTorch={onTorch}
              label={`${wall.title}. ${lit ? 'The whole wall is lit.' : 'Move the torch with the arrow keys.'} ${wall.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-picture src={wall.src} alt="" width={wall.width} height={wall.height} draggable={false} />
            </TorchStage>
          ) : (
            <TorchStage
              key="chamber"
              width={CHAMBER.width}
              height={CHAMBER.height}
              lit={lit}
              rings={[]}
              onTorch={onTorch}
              className="egt-stage-chamber"
              label={`The burial chamber. ${lit ? 'The whole chamber is lit.' : 'Move the torch with the arrow keys.'} A dark stone chamber with a starry ceiling: a painted doorway, the doorway of the Hall of Judgement with scales beyond it, a carved cartouche, a niche in the wall, an embalmers’ table and a broken carved stone.`}
            >
              <Chamber tomb={tomb} />
            </TorchStage>
          )}
          <p className="egt-hint" aria-hidden="true">
            {lit ? 'Move the lens over the picture · or use the arrow keys' : 'Move your mouse or finger over the dark · or use the arrow keys'}
          </p>
        </div>

        <section className="egr-panel egt-panel" aria-label={wall ? wall.name : 'The burial chamber'}>
          {wall ? (
            <>
              <p className="egr-label">
                Wall {index} of {WALLS.length} · {foundHere.length} of {wall.details.length} found
              </p>
              <h2>{wall.title}</h2>
              <ul className="egt-clues">
                {wall.details.map((d) => {
                  const got = foundHere.includes(d.id);
                  return (
                    <li key={d.id} className={got ? 'is-found' : ''}>
                      <p className="egt-clue">
                        <span className="egt-clue-mark" aria-hidden="true">{got ? '✓' : '?'}</span>
                        <span>{got ? 'You found ' : 'Search for '}<strong>{d.label}</strong></span>
                      </p>
                      {got && <FactNote fact={d.tells} className="egr-fact" />}
                    </li>
                  );
                })}
              </ul>
              {wallDone && (
                <div className="egt-reward">
                  <p className="egt-found">Wall complete!</p>
                  <FactNote fact={wall.note} className="egr-fact" />
                </div>
              )}
              <div className="egr-actions">
                <button type="button" className="egr-button" aria-pressed={lit} onClick={lightAll}>
                  Light the whole wall
                </button>
                {index < WALLS.length ? (
                  <button type="button" className="egr-button egr-button-primary" onClick={() => choose(VIEWS[index + 1])}>
                    Next wall <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button type="button" className="egr-button egr-button-primary" onClick={() => choose('chamber')}>
                    <span aria-hidden="true">←</span> Back to the chamber
                  </button>
                )}
              </div>
              <FactNote fact={TOMB_NOTES.copies} className="egr-fact" />
            </>
          ) : (
            <>
              <p className="egr-label">
                {seen.length} of {THINGS.length} found · {roomsDone} of {THINGS.length} rooms finished
              </p>
              <h2>The burial chamber</h2>
              <ul className="egt-things">
                {THINGS.map((t) => {
                  const got = seen.includes(t.id);
                  const finished = !!tomb.done[t.room];
                  return (
                    <li key={t.id} className={`${got ? 'is-found' : ''} ${finished ? 'is-done' : ''}`}>
                      {got ? (
                        <>
                          <p className="egt-thing-name">
                            {finished && <span className="egt-tick" aria-label="Finished: ">✓</span>}
                            {t.title}
                          </p>
                          <p className="egt-thing-line">{finished ? t.done : t.found}</p>
                          {t.href ? (
                            <Link className="egr-button egt-door" href={fromTomb(t.href)}>
                              {finished ? 'Go back in' : 'Go in'} <span aria-hidden="true">→</span>
                            </Link>
                          ) : (
                            <button type="button" className="egr-button egt-door" onClick={() => choose(WALLS[0].id)}>
                              {finished ? 'See the walls again' : 'Go in'} <span aria-hidden="true">→</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="egt-thing-line egt-hidden">Something is hidden in the dark…</p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="egr-actions">
                <button type="button" className="egr-button" aria-pressed={lit} onClick={lightAll}>
                  Light the whole chamber
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
