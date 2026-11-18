'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader, StepDots } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import PrintSheet from '../PrintSheet';
import { DragGhost, toSvg, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import AmuletArt from '../amulet/AmuletArt';
import { AMULET_NOTES } from '../amulet/amulets';
import { useSavedAmulet } from '../amulet/savedAmulet';
import Cartouche from '../hieroglyph-name/Cartouche';
import { TOMB_NOTES, WALLS } from '../tomb/scenes';
import Chamber, { CARTOUCHE_BOX, CH_H, CH_W, FLOOR_SLOTS, GoodArt, NICHE_BOX, box, depthScale, describeChamber, onFloor, type Placed } from './Chamber';
import { GOODS, MAX_GOODS, MY_TOMB_INTRO, MY_TOMB_SOURCES, STEPS, type GoodId } from './myTomb';
import { useSavedCartouche } from './savedCartouche';
import './myTomb.css';

/*
 * Build Your Own Tomb: a fully lit chamber (no torch here) that the visitor
 * makes their own, in four steps, each with one instruction:
 *
 *   Paint the wall    choose one of the five painted walls from Tomb Explorer
 *   Fill the chamber  drag things onto the floor (or tap one to put it in),
 *                     then drag them about, or choose one and move it with
 *                     the arrow keys; Delete takes it out
 *   Make it yours     carve the name they wrote in Your Name in Hieroglyphs
 *                     on the wall, and lay the amulet they made in Design an
 *                     Amulet in its niche (each read from this browser);
 *                     where either is missing, a link to go and make it
 *   Your tomb         the finished chamber, to print
 *
 * The chamber is kept in this browser (localStorage `mm-egypt-my-tomb`), so
 * a visitor who goes off to make their cartouche comes back to it as they
 * left it. Nothing is sent anywhere.
 */

const TOMB_KEY = 'mm-egypt-my-tomb';
type Carry = { kind: 'new'; id: GoodId } | { kind: 'move'; id: GoodId } | { kind: 'cartouche' } | { kind: 'amulet' };
type Kept = { step: number; wall: string | null; goods: Placed[]; cartouche: boolean; amulet: boolean; owner: string };

function readKept(): Kept | null {
  try {
    const raw = window.localStorage.getItem(TOMB_KEY);
    if (!raw) return null;
    const k = JSON.parse(raw) as Partial<Kept>;
    return {
      step: typeof k.step === 'number' ? Math.max(0, Math.min(STEPS.length - 1, k.step)) : 0,
      wall: WALLS.some((w) => w.id === k.wall) ? (k.wall as string) : null,
      goods: Array.isArray(k.goods) ? k.goods.filter((g) => GOODS.some((x) => x.id === g?.id) && typeof g.x === 'number' && typeof g.y === 'number').slice(0, MAX_GOODS) : [],
      cartouche: !!k.cartouche,
      amulet: !!k.amulet,
      owner: typeof k.owner === 'string' ? k.owner.slice(0, 40) : '',
    };
  } catch {
    return null;
  }
}

export default function MyTomb() {
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);
  const [wallId, setWallId] = useState<string | null>(null);
  const [goods, setGoods] = useState<Placed[]>([]);
  const [selected, setSelected] = useState<GoodId | null>(null);
  const [holding, setHolding] = useState<Carry | null>(null);
  const [cartoucheOn, setCartoucheOn] = useState(false);
  const [amuletOn, setAmuletOn] = useState(false);
  const [owner, setOwner] = useState('');
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const [loaded, setLoaded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const cartouche = useSavedCartouche();
  const amulet = useSavedAmulet();
  const step = STEPS[index];
  const wall = WALLS.find((w) => w.id === wallId) ?? null;
  const name = owner.trim() || cartouche?.name || amulet?.name || '';
  const title = name ? `The tomb of ${name}` : 'My tomb';
  const shownCartouche = cartoucheOn ? cartouche : null;
  const shownAmulet = amuletOn ? amulet : null;

  // Come back to the chamber as it was left.
  useEffect(() => {
    const restore = () => {
      const k = readKept();
      if (k) {
        setIndex(k.step);
        setWallId(k.wall);
        setGoods(k.goods);
        setCartoucheOn(k.cartouche);
        setAmuletOn(k.amulet);
        setOwner(k.owner);
      }
      setLoaded(true);
    };
    restore();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      const k: Kept = { step: index, wall: wallId, goods, cartouche: cartoucheOn, amulet: amuletOn, owner };
      window.localStorage.setItem(TOMB_KEY, JSON.stringify(k));
    } catch {
      /* storage unavailable: the chamber lasts while the page is open */
    }
  }, [loaded, index, wallId, goods, cartoucheOn, amuletOn, owner]);

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setIndex(to);
    setSelected(null);
    setHolding(null);
    setStatus(`Step ${to + 1} of ${STEPS.length}: ${STEPS[to].title}.`);
    heading.current?.focus();
  };

  const nameOf = (id: GoodId) => GOODS.find((g) => g.id === id)!.name;

  // ── The things on the floor ──
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

  // ── Your name and your amulet ──
  const carveName = () => {
    if (!cartouche) return;
    setCartoucheOn(true);
    setHolding(null);
    playEgypt('chisel');
    setStatus('Your name is carved on the wall of your tomb.');
  };
  const layAmulet = () => {
    if (!amulet) return;
    setAmuletOn(true);
    setHolding(null);
    playEgypt('settle');
    setStatus('Your amulet rests in its niche.');
  };

  const svgPoint = (x: number, y: number) => {
    const svg = room.current?.querySelector<SVGSVGElement>('.egt-svg') ?? null;
    return toSvg(svg, x, y);
  };
  const { drag, carrying, start } = useDragDrop<Carry>((c, at) => {
    if ((c.kind === 'new' || c.kind === 'move') && at.target === 'floor') {
      const p = svgPoint(at.x, at.y);
      if (c.kind === 'new') putIn(c.id, p ?? undefined);
      else if (p) moveTo(c.id, p.x, p.y);
    } else if (c.kind === 'cartouche' && at.target === 'cartouche') carveName();
    else if (c.kind === 'amulet' && at.target === 'niche') layAmulet();
  });
  const held = holding ?? carrying;

  const again = () => {
    setWallId(null);
    setGoods([]);
    setCartoucheOn(false);
    setAmuletOn(false);
    setOwner('');
    go(0);
  };

  const canGoOn = step.id === 'wall' ? !!wall : step.id === 'goods' ? goods.length > 0 : true;
  const done = (i: number) => (STEPS[i].id === 'wall' ? !!wall : STEPS[i].id === 'goods' ? goods.length > 0 : STEPS[i].id === 'yours' ? cartoucheOn || amuletOn : false);
  const label = describeChamber(wall, goods, shownAmulet, shownCartouche);

  return (
    <RoomShell className="eg-my-tomb" sources={MY_TOMB_SOURCES} fit>
      {intro && <DarkIntro title="Build Your Own Tomb" lines={MY_TOMB_INTRO} voice="my-tomb-intro" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · Your burial chamber" title="Build Your Own Tomb" />

      <section className={`egt-room egr-fill is-${step.id}`} aria-labelledby="egt-title" data-carrying={held ? '' : undefined}>
        <div className="egt-strip">
          <StepDots steps={STEPS} at={index} done={done} onGo={go} label="The steps" />
          <p className="egt-name-line">{title}</p>
        </div>

        {/* ───── The chamber ───── */}
        <div className="egt-scene" ref={room}>
          <div className="egt-pic">
            <Chamber wall={wall} goods={goods} amulet={shownAmulet} cartouche={shownCartouche} selected={step.id === 'goods' ? selected : null} label={label}>
              {step.id === 'goods' && (
                <>
                  <div className="egt-floor" data-drop="floor" style={box([0, 440, CH_W, CH_H - 440])} aria-hidden="true" />
                  {goods.map((g) => {
                    const s = depthScale(g.y);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        className="egt-placed egk-carry"
                        style={box([g.x - 60 * s, g.y - 100 * s, 120 * s, 108 * s])}
                        aria-pressed={selected === g.id}
                        aria-label={`${nameOf(g.id)}, on the floor`}
                        aria-describedby="egt-move-help"
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
              {step.id === 'yours' && cartouche && !cartoucheOn && (
                <button type="button" className={`egt-spot${held?.kind === 'cartouche' ? ' is-ready' : ''}`} style={box(CARTOUCHE_BOX)} data-drop="cartouche" aria-label="The stone column on the wall: carve your name here" onClick={() => holding?.kind === 'cartouche' && carveName()} />
              )}
              {step.id === 'yours' && amulet && !amuletOn && (
                <button type="button" className={`egt-spot${held?.kind === 'amulet' ? ' is-ready' : ''}`} style={box(NICHE_BOX)} data-drop="niche" aria-label="The niche in the wall: lay your amulet here" onClick={() => holding?.kind === 'amulet' && layAmulet()} />
              )}
            </Chamber>
          </div>
        </div>

        {/* ───── The desk ───── */}
        <div className="egt-desk">
          <div className="egt-desk-head">
            <h2 id="egt-title" ref={heading} tabIndex={-1}>
              {step.title}
            </h2>
            <p className="egr-task">{step.task}</p>
          </div>

          <div className="egt-desk-body">
            {step.id === 'wall' && (
              <>
                <div className="egt-walls" role="group" aria-label="Paintings to choose from">
                  {WALLS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      className="egt-wall"
                      aria-pressed={wallId === w.id}
                      onClick={() => {
                        setWallId(w.id);
                        playEgypt('find');
                        setStatus(`${w.name} is painted on your wall.`);
                      }}
                    >
                      <img src={w.src} alt="" width={w.width} height={w.height} loading="lazy" draggable={false} />
                      <span>{w.name}</span>
                    </button>
                  ))}
                </div>
                {wall && <FactNote fact={wall.note} className="egr-fact" />}
                {wall && <FactNote fact={TOMB_NOTES.copies} className="egr-fact egt-small" />}
              </>
            )}

            {step.id === 'goods' && (
              <>
                <div className="egt-goods" role="group" aria-label="Things to take with you">
                  {GOODS.map((g) => {
                    const on = goods.some((x) => x.id === g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        className={`egt-good-tile${on ? ' is-in' : ''}${!on ? ' egk-carry' : ''}`}
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
                <p className="egt-small" id="egt-move-help">
                  Choose a thing on the floor, then move it with the arrow keys. Delete takes it out.
                </p>
                {selected && (
                  <div className="egt-move" role="group" aria-label={`Move ${nameOf(selected).toLowerCase()}`}>
                    <span className="egt-move-name">{nameOf(selected)}</span>
                    <button type="button" className="egr-button egt-arrow" aria-label="Move it back" onClick={() => nudge(selected, 0, -24)}>
                      ↑
                    </button>
                    <button type="button" className="egr-button egt-arrow" aria-label="Move it left" onClick={() => nudge(selected, -30, 0)}>
                      ←
                    </button>
                    <button type="button" className="egr-button egt-arrow" aria-label="Move it right" onClick={() => nudge(selected, 30, 0)}>
                      →
                    </button>
                    <button type="button" className="egr-button egt-arrow" aria-label="Move it forward" onClick={() => nudge(selected, 0, 24)}>
                      ↓
                    </button>
                    <button type="button" className="egr-button" onClick={() => takeOut(selected)}>
                      Take it out
                    </button>
                  </div>
                )}
              </>
            )}

            {step.id === 'yours' && (
              <>
                <div className="egt-yours">
                  <div className="egt-own">
                    <h3>Your name</h3>
                    {cartouche ? (
                      cartoucheOn ? (
                        <>
                          <p>Your name is carved on the wall.</p>
                          <button type="button" className="egr-button egr-button-quiet" onClick={() => setCartoucheOn(false)}>
                            Take it off the wall
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="egt-token egk-carry" aria-pressed={holding?.kind === 'cartouche'} aria-label={`Your cartouche${cartouche.name ? `: ${cartouche.name}` : ''}`} onPointerDown={(e) => start({ kind: 'cartouche' }, e)} onClick={() => (holding?.kind === 'cartouche' ? carveName() : setHolding({ kind: 'cartouche' }))}>
                            <Cartouche spelled={cartouche.spelled} direction="across" label="" className="egt-token-cartouche" />
                          </button>
                          <p className="egt-small">{holding?.kind === 'cartouche' ? 'Now tap the stone column on the wall, or tap your cartouche again.' : 'Drag it onto the stone column on the wall, or tap it twice.'}</p>
                        </>
                      )
                    ) : (
                      <>
                        <p>You haven’t written your name in hieroglyphs yet.</p>
                        <Link href="/exhibitions/egypt/hieroglyph-name" className="egr-button">
                          Write your name in hieroglyphs
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="egt-own">
                    <h3>Your amulet</h3>
                    {amulet ? (
                      amuletOn ? (
                        <>
                          <p>Your amulet rests in its niche.</p>
                          <button type="button" className="egr-button egr-button-quiet" onClick={() => setAmuletOn(false)}>
                            Take it out of the niche
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="egt-token egk-carry" aria-pressed={holding?.kind === 'amulet'} aria-label="Your amulet" onPointerDown={(e) => start({ kind: 'amulet' }, e)} onClick={() => (holding?.kind === 'amulet' ? layAmulet() : setHolding({ kind: 'amulet' }))}>
                            <AmuletArt shape={amulet.shape} material={amulet.material} symbols={amulet.symbols} nameGlyphs={amulet.nameGlyphs} label="" idPrefix="egt-token" className="egt-token-amulet" />
                          </button>
                          <p className="egt-small">{holding?.kind === 'amulet' ? 'Now tap the niche in the wall, or tap your amulet again.' : 'Drag it into the niche, or tap it twice.'}</p>
                        </>
                      )
                    ) : (
                      <>
                        <p>You haven’t made an amulet yet.</p>
                        <Link href="/exhibitions/egypt/amulet" className="egr-button">
                          Design an amulet
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <label className="egt-owner">
                  <span>Whose tomb is this?</span>
                  <input type="text" value={owner} maxLength={40} placeholder={cartouche?.name || amulet?.name || 'Your name'} onChange={(e) => setOwner(e.target.value)} />
                </label>
                {amuletOn && <FactNote fact={AMULET_NOTES.amulets} className="egr-fact egt-small" />}
              </>
            )}

            {step.id === 'done' && (
              <>
                <p className="egt-done">{title} is finished.</p>
                <ul className="egt-list">
                  {wall && <li>On the wall: {wall.name.toLowerCase()}</li>}
                  {goods.length > 0 && <li>On the floor: {goods.map((g) => nameOf(g.id).toLowerCase()).join(', ')}</li>}
                  {shownCartouche && <li>Your name, carved in a cartouche</li>}
                  {shownAmulet && <li>Your amulet, in its niche</li>}
                </ul>
                <div className="egr-actions">
                  <button type="button" className="egr-button egr-button-primary" onClick={() => setPrinting(true)}>
                    Print my tomb
                  </button>
                  <button type="button" className="egr-button" onClick={again}>
                    Start a new tomb
                  </button>
                </div>
                <p className="egt-small">
                  More to make: <Link href="/exhibitions/egypt/hieroglyph-name">your name in hieroglyphs</Link>, <Link href="/exhibitions/egypt/amulet">an amulet</Link>, or <Link href="/exhibitions/egypt/mummification">a mummy</Link>.
                </p>
              </>
            )}
          </div>

          <div className="egr-step-nav egt-nav">
            <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={index === STEPS.length - 1 || !canGoOn}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <DragGhost at={drag} className="egt-ghost">
        {carrying?.kind === 'new' || carrying?.kind === 'move' ? (
          <svg viewBox="-64 -110 128 118" width="96" height="90">
            <GoodArt id={carrying.id} />
          </svg>
        ) : carrying?.kind === 'cartouche' && cartouche ? (
          <Cartouche spelled={cartouche.spelled} direction="down" label="" className="egt-ghost-cartouche" ink="#2b1d12" />
        ) : carrying?.kind === 'amulet' && amulet ? (
          <AmuletArt shape={amulet.shape} material={amulet.material} symbols={amulet.symbols} nameGlyphs={amulet.nameGlyphs} label="" idPrefix="egt-ghost" className="egt-ghost-amulet" />
        ) : null}
      </DragGhost>

      <PrintSheet printing={printing} onDone={() => setPrinting(false)}>
        <div className="egt-print">
          <h1>{title}</h1>
          <Chamber wall={wall} goods={goods} amulet={shownAmulet} cartouche={shownCartouche} label={label} idPrefix="egt-print" />
          <ul>
            {wall && (
              <li>
                On the wall: {wall.title}. {wall.credit.text}
              </li>
            )}
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
