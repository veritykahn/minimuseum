'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader } from '../RoomShell';
import { TOMB_NOTES, WALLS, nearDetail } from './scenes';
import './tomb.css';

/*
 * The Tomb Explorer: a dark tomb, one painted wall at a time. A torch
 * follows the mouse or the finger and lights the painting where it falls;
 * each wall hides one detail, and finding it opens the wall's note. The
 * arrow keys move the torch too, and "Light the whole wall" lifts the dark
 * at once (for anyone who would rather look than search). The torch's
 * place is set as CSS variables, so moving it does not re-render the room.
 */

export default function TombExplorer() {
  const [index, setIndex] = useState(0);
  const [found, setFound] = useState<Record<string, boolean>>({});
  const [lit, setLit] = useState(false);
  const [status, setStatus] = useState('');
  const stage = useRef<HTMLDivElement>(null);
  const torch = useRef({ x: 0.5, y: 0.5 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wall = WALLS[index];
  const isFound = !!found[wall.id];

  const place = useCallback(
    (x: number, y: number) => {
      const el = stage.current;
      const cx = Math.min(1, Math.max(0, x));
      const cy = Math.min(1, Math.max(0, y));
      torch.current = { x: cx, y: cy };
      el?.style.setProperty('--tx', `${cx * 100}%`);
      el?.style.setProperty('--ty', `${cy * 100}%`);
      if (!found[wall.id] && nearDetail(wall, cx, cy)) {
        setFound((f) => ({ ...f, [wall.id]: true }));
        setStatus(`You found ${wall.find.label}.`);
      }
    },
    [found, wall],
  );

  // A new wall: the torch back to the middle, the dark back down.
  useEffect(() => {
    const el = stage.current;
    torch.current = { x: 0.5, y: 0.5 };
    el?.style.setProperty('--tx', '50%');
    el?.style.setProperty('--ty', '50%');
  }, [index]);

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    place((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.12 : 0.05;
    const { x, y } = torch.current;
    const to =
      e.key === 'ArrowLeft' ? [x - step, y]
      : e.key === 'ArrowRight' ? [x + step, y]
      : e.key === 'ArrowUp' ? [x, y - step]
      : e.key === 'ArrowDown' ? [x, y + step]
      : null;
    if (!to) return;
    e.preventDefault();
    place(to[0], to[1]);
  };

  const choose = (i: number, focus = false) => {
    setIndex(i);
    setLit(false);
    setStatus(`${WALLS[i].name}. Search with the torch for ${WALLS[i].find.label}.`);
    if (focus) tabRefs.current[i]?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' ? (index + 1) % WALLS.length
      : e.key === 'ArrowLeft' ? (index - 1 + WALLS.length) % WALLS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? WALLS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(to, true);
  };

  const lightAll = () => {
    const next = !lit;
    setLit(next);
    if (next && !found[wall.id]) setFound((f) => ({ ...f, [wall.id]: true }));
    setStatus(next ? 'The whole wall is lit.' : 'The torch is back.');
  };

  const foundCount = WALLS.filter((w) => found[w.id]).length;

  return (
    <RoomShell className="eg-tomb">
      <RoomHeader kicker="Interactive · Into the dark" title="Tomb Explorer">
        <p className="egr-lede">It is dark in the tomb. Move your torch across the wall to light the paintings, and search each wall for its hidden detail.</p>
      </RoomHeader>

      <div className="egr-tabs" role="tablist" aria-label="The tomb’s walls">
        {WALLS.map((w, i) => (
          <button
            key={w.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`egt-tab-${w.id}`}
            aria-controls="egt-panel"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            className="egr-tab"
            onClick={() => choose(i)}
            onKeyDown={onTabKey}
          >
            {w.name}
            {found[w.id] && <span className="egt-tick" aria-label=" (found)">✓</span>}
          </button>
        ))}
      </div>

      <div className="egr-layout" id="egt-panel" role="tabpanel" aria-labelledby={`egt-tab-${wall.id}`}>
        <div className="egr-scene">
          <div
            ref={stage}
            className={`egt-wall ${lit ? 'is-lit' : ''}`}
            style={{ aspectRatio: `${wall.width} / ${wall.height}`, width: `min(100%, calc(70vh * ${(wall.width / wall.height).toFixed(4)}))` }}
            tabIndex={0}
            role="group"
            aria-roledescription="torch"
            aria-label={`${wall.title}. ${lit ? 'The whole wall is lit.' : 'Move the torch with the arrow keys.'} ${wall.alt}`}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onKeyDown={onKey}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wall.src} alt="" width={wall.width} height={wall.height} draggable={false} />
            <span className="egt-dark" aria-hidden="true" />
            {isFound && (
              <span className="egt-mark" style={{ left: `${wall.find.x * 100}%`, top: `${wall.find.y * 100}%` }} aria-hidden="true" />
            )}
          </div>
          <p className="egt-hint" aria-hidden="true">
            {lit ? 'The whole wall is lit' : 'Move your mouse or finger over the wall · or use the arrow keys'}
          </p>
        </div>

        <section className="egr-panel" aria-label={wall.name}>
          <p className="egr-label">
            Wall {index + 1} of {WALLS.length} · {foundCount} found
          </p>
          <h2>{wall.title}</h2>
          {isFound ? (
            <>
              <p className="egt-found">You found {wall.find.label}!</p>
              <FactNote fact={wall.note} className="egr-fact" />
            </>
          ) : (
            <p>
              Search with the torch for <strong>{wall.find.label}</strong>.
            </p>
          )}
          <div className="egr-actions">
            <button type="button" className="egr-button" aria-pressed={lit} onClick={lightAll}>
              Light the whole wall
            </button>
            {index < WALLS.length - 1 && (
              <button type="button" className="egr-button egr-button-primary" onClick={() => choose(index + 1)}>
                Next wall <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <FactNote fact={TOMB_NOTES.copies} className="egr-fact" />
          <p className="egr-credit">
            <a href={wall.credit.href} target="_blank" rel="noopener noreferrer">
              {wall.title}
            </a>
            . {wall.credit.text}
          </p>
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
