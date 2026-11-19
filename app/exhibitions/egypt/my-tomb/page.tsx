'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import PrintSheet from '../PrintSheet';
import { ThingIcon } from '../PutInTomb';
import { DragGhost, toSvg, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import { AMULET_NOTES, SYMBOLS } from '../amulet/amulets';
import { useSavedAmulet, type SavedAmulet } from '../amulet/savedAmulet';
import { TOMB_NOTES, WALLS } from '../tomb/scenes';
import { emptyTomb, keptCount, readTomb, TOMB_PLACES, useTomb, type ActivityId, type TombState } from '../tombState';
import Chamber, { CH_H, CH_W, FLOOR_SLOTS, GoodArt, PLACES, box, depthScale, describeChamber, onFloor, type Filled, type Placed } from './Chamber';
import { GOODS, MAX_GOODS, MY_TOMB_INTRO, MY_TOMB_SOURCES, TASKS, type GoodId, type Mode } from './myTomb';
import { useSavedCartouche, type SavedCartouche } from './savedCartouche';
import './myTomb.css';

/*
 * Build Your Own Tomb: where the Egypt journey starts and ends. A fully lit
 * chamber (no torch here: the owner loved it lit), the visitor's own burial
 * tomb, with six empty places, one for each of the other rooms
 * (TOMB_PLACES): the painted wall, the stone column, the scroll stand, the
 * niche, the coffin and the offering table. Each empty place is a door (a
 * link laid over it in the picture, and a row in the list beside it) to
 * the room that fills it, and every room ends by putting what it made here
 * (PutInTomb.tsx). Coming back, the new thing is already in its place,
 * glowing, with a line saying what it is (and no intro to sit through).
 *
 *   The tomb     the places, filled or waiting; whose tomb it is
 *   Furnish it   things to take with you, dragged onto the floor (or tapped
 *                in), moved by drag or the arrow keys, Delete to take out
 *   Sealed       once every place is filled: the doorway is walled up,
 *                course by course, and stamped with the visitor's own
 *                cartouche; then the print to take home
 *
 * What the rooms put in is in tombState.ts; the furnishing, the owner's
 * name and whether the tomb is sealed are kept here (localStorage
 * `mm-egypt-my-tomb`). Both stay in this browser only. "Start a new tomb"
 * empties every place, for the next visitor at a classroom's computer.
 */

const KEY = 'mm-egypt-my-tomb';
type Carry = { kind: 'new'; id: GoodId } | { kind: 'move'; id: GoodId };
type Kept = { goods: Placed[]; owner: string; sealed: boolean; seen: ActivityId[] };
const IDS = TOMB_PLACES.map((p) => p.activity);

function readKept(): Kept | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const k = JSON.parse(raw) as Partial<Kept>;
    return {
      goods: Array.isArray(k.goods) ? k.goods.filter((g) => GOODS.some((x) => x.id === g?.id) && typeof g.x === 'number' && typeof g.y === 'number').slice(0, MAX_GOODS) : [],
      owner: typeof k.owner === 'string' ? k.owner.slice(0, 40) : '',
      sealed: k.sealed === true,
      seen: Array.isArray(k.seen) ? k.seen.filter((s): s is ActivityId => IDS.includes(s as ActivityId)) : [],
    };
  } catch {
    return null;
  }
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** What is in each place, from what the rooms kept and what they saved. */
function filledFrom(tomb: TombState, cartouche: SavedCartouche | null, amulet: SavedAmulet | null): Filled {
  const kept = tomb.kept ?? {};
  return {
    wall: kept.walls ? (WALLS.find((w) => w.id === tomb.painting) ?? WALLS[0]) : null,
    cartouche: kept.name ? cartouche : null,
    amulet: kept.amulet ? amulet : null,
    mummy: !!kept.mummification,
    heart: !!kept.weighing,
    papyrus: !!kept.rosetta,
  };
}

export default function MyTomb() {
  const [tomb] = useTomb();
  const cartouche = useSavedCartouche();
  const amulet = useSavedAmulet();
  const [intro, setIntro] = useState(true);
  const [mode, setMode] = useState<Mode>('tomb');
  const [goods, setGoods] = useState<Placed[]>([]);
  const [selected, setSelected] = useState<GoodId | null>(null);
  const [owner, setOwner] = useState('');
  const [seen, setSeen] = useState<ActivityId[]>([]);
  // What arrived since the last visit: shown glowing, and in words, this visit.
  const [fresh, setFresh] = useState<ActivityId[]>([]);
  const [asking, setAsking] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const [loaded, setLoaded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const kept = tomb.kept ?? {};
  const count = keptCount(tomb);
  const full = count === TOMB_PLACES.length;
  const sealed = mode === 'sealed';
  const filled = filledFrom(tomb, cartouche, amulet);
  const name = owner.trim() || cartouche?.name || amulet?.name || '';
  const title = name ? `The tomb of ${name}` : 'Your burial tomb';

  // Come back to the tomb as it was left, and see what has arrived since.
  // (Read once the page is in the browser, as useTomb does: the server cannot see it.)
  useEffect(() => {
    const restore = () => {
      const k = readKept();
      const now = IDS.filter((id) => readTomb().kept?.[id]);
      const arrived = now.filter((id) => !(k?.seen ?? []).includes(id));
      if (k) {
        setGoods(k.goods);
        setOwner(k.owner);
        if (k.sealed && arrived.length === 0 && now.length === IDS.length) setMode('sealed');
      }
      setSeen(now);
      if (arrived.length) {
        // Straight in from a room: the new thing is waiting in its place.
        setFresh(arrived);
        setIntro(false);
      }
      setLoaded(true);
    };
    restore();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      const k: Kept = { goods, owner, sealed, seen };
      window.localStorage.setItem(KEY, JSON.stringify(k));
    } catch {
      /* storage unavailable: the tomb lasts while the page is open */
    }
  }, [loaded, goods, owner, sealed, seen]);

  const goTo = (m: Mode) => {
    setMode(m);
    setSelected(null);
    setAsking(false);
    window.requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };

  const nameOf = (id: GoodId) => GOODS.find((g) => g.id === id)!.name;

  // ── Furnishing: things on the floor ──
  const putIn = (id: GoodId, at?: { x: number; y: number }) => {
    if (goods.some((g) => g.id === id)) return;
    if (goods.length >= MAX_GOODS) {
      setStatus(`The floor holds ${MAX_GOODS} things. Take one out first.`);
      playEgypt('miss');
      return;
    }
    const free = FLOOR_SLOTS.find((s) => !goods.some((g) => Math.hypot(g.x - s.x, g.y - s.y) < 60)) ?? FLOOR_SLOTS[goods.length % FLOOR_SLOTS.length];
    const p = onFloor((at ?? free).x, (at ?? free).y);
    setGoods((gs) => [...gs, { id, ...p }]);
    setSelected(id);
    playEgypt('settle');
    setStatus(`${nameOf(id)} is in your tomb. Drag it, or use the arrow keys, to move it.`);
  };
  const moveTo = (id: GoodId, x: number, y: number) => {
    const p = onFloor(x, y);
    setGoods((gs) => gs.map((g) => (g.id === id ? { ...g, ...p } : g)));
  };
  const nudge = (id: GoodId, dx: number, dy: number) => {
    const g = goods.find((x) => x.id === id);
    if (g) moveTo(id, g.x + dx, g.y + dy);
  };
  const takeOut = (id: GoodId) => {
    setGoods((gs) => gs.filter((g) => g.id !== id));
    setSelected(null);
    setStatus(`${nameOf(id)} is out of your tomb.`);
  };
  const keys = (id: GoodId) => (e: KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
    if (d[e.key]) {
      e.preventDefault();
      setSelected(id);
      nudge(id, ...d[e.key]);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      takeOut(id);
    }
  };
  const { drag, carrying, start } = useDragDrop<Carry>((c, at) => {
    if (at.target !== 'floor') return;
    const p = toSvg(room.current?.querySelector<SVGSVGElement>('.egb-svg') ?? null, at.x, at.y);
    if (c.kind === 'new') putIn(c.id, p ?? undefined);
    else if (p) moveTo(c.id, p.x, p.y);
  });

  // ── The finale ──
  const seal = () => {
    if (!full) return;
    playEgypt('grind');
    setFresh([]);
    goTo('sealed');
    setStatus('Your tomb is sealed: the doorway is walled up, and stamped with your seal.');
  };
  const reopen = () => {
    goTo('tomb');
    setStatus('Your tomb is open again.');
  };
  const startAgain = () => {
    emptyTomb();
    setGoods([]);
    setOwner('');
    setFresh([]);
    setSeen([]);
    goTo('tomb');
    setStatus('A new tomb, empty and waiting.');
  };

  const task = mode === 'furnish' ? TASKS.furnish : sealed ? TASKS.sealed : full ? TASKS.full : count === 0 ? TASKS.empty : TASKS.some(count, TOMB_PLACES.length);
  const label = describeChamber(filled, goods, sealed);
  const newest = fresh[fresh.length - 1];
  const arrivalNote =
    newest === 'walls' && filled.wall ? filled.wall.note
    : newest === 'amulet' ? AMULET_NOTES.amulets
    : newest === 'weighing' ? SYMBOLS.find((s) => s.id === 'heart')!.meaning
    : null;

  return (
    <RoomShell className="eg-my-tomb" sources={MY_TOMB_SOURCES} fit>
      {intro && <DarkIntro title="Build Your Own Tomb" lines={MY_TOMB_INTRO} voice="my-tomb-intro" begin="Enter your tomb" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · Your burial tomb" title="Build Your Own Tomb" />

      <section className={`egb-room egr-fill is-${mode}`} aria-labelledby="egb-title" data-carrying={carrying ? '' : undefined}>
        <div className="egb-strip">
          <p className="egb-name-line">{title}</p>
          <ol className="egb-progress" aria-label={`${count} of ${TOMB_PLACES.length} places filled`}>
            {TOMB_PLACES.map((p) => (
              <li key={p.activity} className={kept[p.activity] ? 'is-in' : ''} title={kept[p.activity] ? cap(kept[p.activity]!) : `Waiting for ${p.waits}`} aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <ThingIcon activity={p.activity} size={48} />
                </svg>
              </li>
            ))}
          </ol>
        </div>

        {/* ───── The chamber ───── */}
        <div className="egb-scene" ref={room}>
          <div className="egb-pic">
            <Chamber filled={filled} goods={goods} selected={mode === 'furnish' ? selected : null} sealed={sealed} label={label}>
              {mode === 'tomb' &&
                TOMB_PLACES.map((p) =>
                  kept[p.activity] ? (
                    fresh.includes(p.activity) && <span key={p.activity} className="egb-arrived" style={box(PLACES[p.activity])} aria-hidden="true" />
                  ) : (
                    <Link key={p.activity} href={p.href} className="egb-door" style={box(PLACES[p.activity])} aria-label={`${cap(p.place)}, empty: it waits for ${p.waits}. Go to ${p.room}`}>
                      <span className="egb-door-tag" aria-hidden="true">
                        {p.room.replace(/^The /, '').replace(/, Step by Step$/, '')}
                      </span>
                    </Link>
                  ),
                )}
              {mode === 'furnish' && (
                <>
                  <div className="egb-floor" data-drop="floor" style={box([0, 440, CH_W, CH_H - 440])} aria-hidden="true" />
                  {goods.map((g) => {
                    const s = depthScale(g.y);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        className="egb-placed egk-carry"
                        style={box([g.x - 60 * s, g.y - 100 * s, 120 * s, 108 * s])}
                        aria-pressed={selected === g.id}
                        aria-label={`${nameOf(g.id)}, on the floor`}
                        aria-describedby="egb-move-help"
                        onPointerDown={(e) => {
                          setSelected(g.id);
                          start({ kind: 'move', id: g.id }, e);
                        }}
                        onClick={() => setSelected(g.id)}
                        onKeyDown={keys(g.id)}
                      />
                    );
                  })}
                </>
              )}
            </Chamber>
          </div>
        </div>

        {/* ───── The desk ───── */}
        <div className="egb-desk">
          <div className="egb-desk-head">
            <h2 id="egb-title" ref={heading} tabIndex={-1}>
              {mode === 'furnish' ? 'Furnish your tomb' : sealed ? 'Your tomb is sealed' : full ? 'Every place is filled' : 'Six places to fill'}
            </h2>
            <p className="egr-task">{task}</p>
          </div>

          <div className="egb-desk-body">
            {mode === 'tomb' && (
              <>
                {fresh.length > 0 && (
                  <div className="egb-arrival">
                    <p className="egb-arrival-title">New in your tomb</p>
                    <ul>
                      {fresh.map((id) => (
                        <li key={id}>
                          {cap(kept[id] ?? '')}, in {TOMB_PLACES.find((p) => p.activity === id)!.place}.
                        </li>
                      ))}
                    </ul>
                    {arrivalNote && <FactNote fact={arrivalNote} className="egr-fact" />}
                    {newest === 'walls' && <FactNote fact={TOMB_NOTES.copies} className="egr-fact egb-small" />}
                  </div>
                )}
                <ol className="egb-places" aria-label="The places in your tomb">
                  {TOMB_PLACES.map((p) => {
                    const what = kept[p.activity];
                    return (
                      <li key={p.activity} className={`egb-place${what ? ' is-in' : ''}`}>
                        <svg className="egb-place-icon" viewBox="0 0 48 48" aria-hidden="true">
                          <ThingIcon activity={p.activity} size={48} />
                        </svg>
                        <span className="egb-place-text">
                          <span className="egb-place-name">{cap(p.place)}</span>
                          {what ? (
                            <span className="egb-place-what">
                              <span aria-hidden="true">✓ </span>
                              {cap(what)}
                            </span>
                          ) : (
                            <span className="egb-place-what">Waiting for {p.waits}</span>
                          )}
                        </span>
                        {!what && (
                          <Link href={p.href} className="egb-place-go">
                            {p.room} <span aria-hidden="true">→</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <label className="egb-owner">
                  <span>Whose tomb is this?</span>
                  <input type="text" value={owner} maxLength={40} placeholder={cartouche?.name || amulet?.name || 'Your name'} onChange={(e) => setOwner(e.target.value)} />
                </label>
              </>
            )}

            {mode === 'furnish' && (
              <>
                <div className="egb-goods" role="group" aria-label="Things to take with you">
                  {GOODS.map((g) => {
                    const on = goods.some((x) => x.id === g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        className={`egb-good-tile${on ? ' is-in' : ''}${!on ? ' egk-carry' : ''}`}
                        aria-label={on ? `${g.name} (in your tomb)` : `Put in ${g.name.toLowerCase()}`}
                        aria-pressed={on}
                        onPointerDown={(e) => !on && start({ kind: 'new', id: g.id }, e)}
                        onClick={() => (on ? setSelected(g.id) : putIn(g.id))}
                      >
                        <svg viewBox="-64 -110 128 118" aria-hidden="true">
                          <GoodArt id={g.id} />
                        </svg>
                        <span>{g.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="egb-small" id="egb-move-help">
                  Choose a thing on the floor, then move it with the arrow keys. Delete takes it out.
                </p>
                {selected && (
                  <div className="egb-move" role="group" aria-label={`Move ${nameOf(selected).toLowerCase()}`}>
                    <span className="egb-move-name">{nameOf(selected)}</span>
                    <button type="button" className="egr-button egb-arrow" aria-label="Move it back" onClick={() => nudge(selected, 0, -24)}>
                      ↑
                    </button>
                    <button type="button" className="egr-button egb-arrow" aria-label="Move it left" onClick={() => nudge(selected, -30, 0)}>
                      ←
                    </button>
                    <button type="button" className="egr-button egb-arrow" aria-label="Move it right" onClick={() => nudge(selected, 30, 0)}>
                      →
                    </button>
                    <button type="button" className="egr-button egb-arrow" aria-label="Move it forward" onClick={() => nudge(selected, 0, 24)}>
                      ↓
                    </button>
                    <button type="button" className="egr-button" onClick={() => takeOut(selected)}>
                      Take it out
                    </button>
                  </div>
                )}
              </>
            )}

            {sealed && (
              <>
                <ul className="egb-list">
                  {TOMB_PLACES.map((p) => (
                    <li key={p.activity}>{cap(kept[p.activity] ?? p.waits)}</li>
                  ))}
                  {goods.length > 0 && <li>And on the floor: {goods.map((g) => nameOf(g.id).toLowerCase()).join(', ')}</li>}
                </ul>
                {asking && (
                  <div className="egb-ask" role="group" aria-label="Start a new tomb?">
                    <p>A new tomb empties every place, ready for the next visitor. Print this one first if you want to keep it.</p>
                    <div className="egr-actions">
                      <button type="button" className="egr-button" onClick={startAgain}>
                        Yes, empty it
                      </button>
                      <button type="button" className="egr-button egr-button-quiet" onClick={() => setAsking(false)}>
                        No, keep it
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="egr-step-nav egb-nav">
            {mode === 'tomb' && (
              <>
                <button type="button" className="egr-button" onClick={() => goTo('furnish')}>
                  Furnish it
                </button>
                <button type="button" className="egr-button egr-button-primary" onClick={seal} disabled={!full}>
                  Seal your tomb
                </button>
              </>
            )}
            {mode === 'furnish' && (
              <button type="button" className="egr-button egr-button-primary" onClick={() => goTo('tomb')}>
                <span aria-hidden="true">←</span> Back to your tomb
              </button>
            )}
            {sealed && (
              <>
                <button type="button" className="egr-button egr-button-primary" onClick={() => setPrinting(true)}>
                  Print my tomb
                </button>
                <button type="button" className="egr-button egr-button-quiet" onClick={reopen}>
                  Open it again
                </button>
                <button type="button" className="egr-button egr-button-quiet" onClick={() => setAsking(true)}>
                  Start a new tomb
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <DragGhost at={drag} className="egb-ghost">
        {carrying && (
          <svg viewBox="-64 -110 128 118" width="96" height="90">
            <GoodArt id={carrying.id} />
          </svg>
        )}
      </DragGhost>

      <PrintSheet printing={printing} onDone={() => setPrinting(false)}>
        <div className="egb-print">
          <h1>{title}</h1>
          <Chamber filled={filled} goods={goods} label={describeChamber(filled, goods)} idPrefix="egb-print" />
          <ul>
            {TOMB_PLACES.map((p) => (
              <li key={p.activity}>
                {cap(p.place)}: {kept[p.activity] ?? 'empty'}
                {p.activity === 'walls' && filled.wall ? ` (${filled.wall.title}. ${filled.wall.credit.text})` : ''}
              </li>
            ))}
            {goods.length > 0 && <li>On the floor: {goods.map((g) => nameOf(g.id).toLowerCase()).join(', ')}.</li>}
          </ul>
          <p>Built in the Mini Museum’s Ancient Egypt exhibition.</p>
        </div>
      </PrintSheet>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
