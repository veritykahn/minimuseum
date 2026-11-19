'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Glyphs } from '../RoomShell';
import { DragGhost, useDragDrop } from '../dragKit';
import AmuletArt from '../amulet/AmuletArt';
import { describeAmulet } from '../amulet/savedAmulet';
import { playEgypt } from '../egyptSound';
import MummyScene, { CUT, VIEWBOX, type BodyLook } from './MummyScene';
import { KeyHandle, Picture, Task, Tray, boxIn, usePicturePointer, type StepKit } from './kit';
import { ALL_PASSES, NATRON_PLACES, PASSES, RUB_NEEDED, ZONES, canTuck, coated, natronDamp, natronResult, passX, rubInto, wrapState, zoneAt } from './mummyGame';
import { WRAP_AMULETS, stepNotes } from './steps';

/*
 * The four steps done on the whole body, on the embalming bed:
 *
 *   Washing   pour water from the jar along the body (drag it, or move it
 *             with the arrow keys) until no dust is left.
 *   Natron    carry bags of natron onto the body (drag them, or pick up the
 *             pile and tap where each goes) until every part is covered,
 *             inside and out, then leave it for forty days. Started too
 *             soon, the forty days show the parts still damp.
 *   Oils      rub oil and resin into each part of the body with the cloth;
 *             the tray says which parts are still dry.
 *   Linen     take the roll round the body, over and under, pass after
 *             pass, head to feet; tuck amulets onto the first layer; then
 *             the second layer, feet to head, over them.
 *
 * The body keeps what earlier steps did to it (`base`).
 */

const box = boxIn(VIEWBOX);
const ASPECT = `${VIEWBOX.w} / ${VIEWBOX.h}`;
const BODY_TOP = 236;
const BODY_BOTTOM = 290;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/* ───────────────────────── 1. Washing ───────────────────────── */

const JUG_REST = { x: 690, y: 200 };

export function WashStep({ kit, base }: { kit: StepKit; base: BodyLook }) {
  const [dust, setDust] = useState<number[]>(kit.done ? [] : ZONES.map((_, i) => i));
  const [jug, setJug] = useState({ ...JUG_REST, pouring: false });
  const clean = dust.length === 0;

  const pourAt = (x: number, y: number) => {
    const at = { x: clamp(x, 170, 700), y: clamp(y, 170, 232) };
    // The water falls from the spout, a little to the left of the jar.
    const over = zoneAt(at.x - 14);
    const pouring = over >= 0;
    setJug({ ...at, pouring });
    if (pouring && dust.includes(over)) {
      const left = dust.filter((i) => i !== over);
      setDust(left);
      playEgypt('water');
      if (!left.length) {
        kit.say('The body is washed clean.');
        kit.finish();
      } else kit.say(`${cap(ZONES[over].name)} is clean. ${left.length} dusty ${left.length === 1 ? 'part' : 'parts'} left.`);
    }
  };
  const { svg, on } = usePicturePointer({
    down: (p) => {
      if (clean) return false;
      pourAt(p.x + 14, p.y - 40);
      return true;
    },
    move: (p) => pourAt(p.x + 14, p.y - 40),
    up: () => setJug((j) => ({ ...j, pouring: false })),
  });

  return (
    <>
      <Task done={clean}>{clean ? 'Washed clean.' : 'Pick up the jar of water and pour it all along the body, until no dust is left.'}</Task>
      <Picture
        label={clean ? 'The body on the embalmers’ bed, washed clean' : `The body on the embalmers’ bed, ${dust.length} dusty ${dust.length === 1 ? 'part' : 'parts'} still to wash; a jar of water beside it`}
        aspect={ASPECT}
        over={
          !clean && (
            <KeyHandle
              at={box(jug.x - 30, jug.y - 50, 60, 60)}
              label="The jar of water"
              value={(jug.x - 170) / 530}
              valueText={`Over ${zoneAt(jug.x - 14) >= 0 ? ZONES[zoneAt(jug.x - 14)].name : 'the floor'}. Use the left and right arrow keys to pour along the body.`}
              onKey={(k) => {
                if (k !== 'ArrowLeft' && k !== 'ArrowRight') return false;
                const x = jug.x === JUG_REST.x && k === 'ArrowLeft' ? ZONES[ZONES.length - 1].x1 - 26 : jug.x + (k === 'ArrowLeft' ? -78 : 78);
                pourAt(x, 196);
                return true;
              }}
            />
          )
        }
      >
        <MummyScene ref={svg} onPointer={on} look={{ ...base, dust }} tools={{ jug: clean ? null : jug }} />
      </Picture>
      <Tray tools={!clean && <p className="egm-small">{ZONES.length - dust.length} of {ZONES.length} parts clean.</p>} notes={clean ? stepNotes('wash') : []} />
    </>
  );
}

/* ───────────────────────── 5. Natron ───────────────────────── */

const PLACE_BOX: Record<string, [number, number, number, number]> = {
  ...Object.fromEntries(ZONES.map((z) => [z.id, [z.x0, 206, z.x1 - z.x0, 92] as [number, number, number, number]])),
  inside: [CUT.x - 30, CUT.y - 14, 60, 26],
};
const placeName = (p: string) => (p === 'inside' ? 'inside the body, through the cut' : `on ${ZONES.find((z) => z.id === p)!.name}`);

export function NatronStep({ kit, base }: { kit: StepKit; base: BodyLook }) {
  const [bags, setBags] = useState<string[]>(kit.done ? NATRON_PLACES : []);
  const [holding, setHolding] = useState(false);
  const [days, setDays] = useState<number | null>(kit.done ? 40 : null);
  const [dry, setDry] = useState(kit.done ? 1 : 0);
  const [result, setResult] = useState<{ dry: boolean; message: string } | null>(kit.done ? natronResult(NATRON_PLACES) : null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const running = days !== null && days < 40;
  const finished = !!result?.dry;

  const pack = (place: string) => {
    if (running || finished) return;
    if (bags.includes(place)) {
      kit.say(`There is natron ${placeName(place)} already.`);
      return;
    }
    const next = [...bags, place];
    setBags(next);
    setResult(null);
    playEgypt('grind');
    kit.say(`A bag of natron ${placeName(place)}.`);
  };

  const leave = () => {
    if (!bags.length || running) return;
    const outcome = natronResult(bags);
    const covered = bags.length / NATRON_PLACES.length;
    const from = dry;
    const to = outcome.dry ? 1 : Math.max(from, 0.6 * covered);
    const end = () => {
      setDays(40);
      setDry(to);
      setResult(outcome);
      kit.say(outcome.message);
      playEgypt(outcome.dry ? 'settle' : 'miss');
      if (outcome.dry) kit.finish();
    };
    setHolding(false);
    setResult(null);
    if (kit.reduced) {
      end();
      return;
    }
    let d = 0;
    setDays(0);
    timer.current = setInterval(() => {
      d += 1;
      setDays(d);
      setDry(from + (to - from) * (d / 40));
      if (d >= 40) {
        clearInterval(timer.current!);
        timer.current = null;
        end();
      }
    }, 70);
  };

  const { drag, carrying, start } = useDragDrop<'bag'>((_, at) => {
    if (at.target.startsWith('nat-')) pack(at.target.slice(4));
  });
  const damp = days === null || days >= 40 ? natronDamp(bags) : [];

  return (
    <>
      <Task done={finished}>
        {finished
          ? 'Forty days: dry, and a little shrunken.'
          : running
            ? 'The forty days are passing. Watch the body dry.'
            : result
              ? 'Still damp in places. Pack more natron where it glistens, then leave it again.'
              : 'Cover the body with bags of natron: every part of it, and inside it too. Then leave it for forty days.'}
      </Task>
      <Picture
        label={
          finished
            ? 'The natron is taken off: the body is dried, darker, and shrunken inside the dashed line of its old size'
            : `The body on the embalmers’ bed, the cut in its side held open; natron packed ${bags.length ? bags.map(placeName).join('; ') : 'nowhere yet'}${damp.length ? `; still damp: ${damp.map((p) => (p === 'inside' ? 'inside' : ZONES.find((z) => z.id === p)!.name)).join(', ')}` : ''}`
        }
        aspect={ASPECT}
        carrying={!!carrying || holding}
        over={
          <>
            {!running &&
              !finished &&
              NATRON_PLACES.map((p) => (
                <button
                  key={p}
                  type="button"
                  data-drop={`nat-${p}`}
                  className={`egm-place ${p === 'inside' ? 'egm-place-inside' : ''}`}
                  style={box(...PLACE_BOX[p])}
                  aria-label={`Pack natron ${placeName(p)}${bags.includes(p) ? ' (packed)' : ''}`}
                  onClick={() => (holding ? pack(p) : kit.say('First pick up a bag of natron from the pile.'))}
                />
              ))}
            {days !== null && (
              <p className="egm-days" aria-hidden="true">
                <span>{days}</span> {days === 1 ? 'day' : 'days'} in natron
              </p>
            )}
          </>
        }
      >
        <MummyScene look={{ ...base, open: !finished, bags: finished ? [] : bags, damp, dry, ghost: finished }} tools={{ days: running ? days : null }} />
      </Picture>
      <Tray
        tools={
          !finished && (
            <>
              <div className="egm-organs" role="group" aria-label="Natron">
                <button
                  type="button"
                  className="egm-thing egm-bagpile egk-carry"
                  aria-pressed={holding}
                  disabled={running}
                  onPointerDown={(e) => start('bag', e)}
                  onClick={() => setHolding((h) => !h)}
                >
                  <svg viewBox="-30 -20 60 40" aria-hidden="true">
                    <rect x="-24" y="-15" width="48" height="30" rx="11" fill="#f2f0ea" stroke="#bdb6a4" strokeWidth="2" />
                    <path d="M-6 -15 q6 -6 12 0" fill="none" stroke="#a89a7a" strokeWidth="2" />
                  </svg>
                  {holding ? 'Holding natron: tap where it goes' : 'Bags of natron'}
                </button>
                <button type="button" className="egr-button egr-button-primary" disabled={!bags.length || running} onClick={leave}>
                  Leave it for forty days
                </button>
              </div>
              {result && !result.dry && <p className="egm-hint">{result.message}</p>}
              {!result && <p className="egm-small">{bags.length ? `${bags.length} ${bags.length === 1 ? 'bag' : 'bags'} packed.` : 'Drag a bag onto the body, or tap the pile and then the body.'}</p>}
            </>
          )
        }
        notes={finished ? stepNotes('natron') : []}
      />
      <DragGhost at={drag}>
        <svg className="egm-ghost" viewBox="-30 -20 60 40" width="72" height="48" aria-hidden="true">
          <rect x="-24" y="-15" width="48" height="30" rx="11" fill="#f2f0ea" stroke="#bdb6a4" strokeWidth="2" />
        </svg>
      </DragGhost>
    </>
  );
}

/* ───────────────────────── 6. Oils and resin ───────────────────────── */

export function OilsStep({ kit, base }: { kit: StepKit; base: BodyLook }) {
  const [coats, setCoats] = useState<number[]>(ZONES.map(() => (kit.done ? 1 : 0)));
  const [cloth, setCloth] = useState<{ x: number; y: number } | null>(null);
  const [keyAt, setKeyAt] = useState(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const finished = coated(coats);

  const rub = (zone: number, distance: number) => {
    if (zone < 0 || coats[zone] >= 1) return;
    const n = rubInto(coats, zone, distance);
    setCoats(n);
    if (n[zone] >= 1) {
      playEgypt('find');
      if (coated(n)) {
        kit.say('The body is coated in oils and resin, all over.');
        kit.finish();
      } else kit.say(`${cap(ZONES[zone].name)} is coated.`);
    }
  };
  const { svg, on } = usePicturePointer({
    down: (p) => {
      if (finished || p.y < BODY_TOP - 20 || p.y > BODY_BOTTOM + 10) return false;
      last.current = p;
      setCloth(p);
      return true;
    },
    move: (p) => {
      const from = last.current ?? p;
      last.current = p;
      setCloth(p);
      if (p.y >= BODY_TOP - 20 && p.y <= BODY_BOTTOM + 10) rub(zoneAt(p.x), Math.hypot(p.x - from.x, p.y - from.y));
    },
    up: () => {
      last.current = null;
      setCloth(null);
    },
  });
  const dryParts = ZONES.filter((_, i) => coats[i] < 1).map((z) => z.name);
  const started = coats.some((c) => c > 0);

  return (
    <>
      <Task done={finished}>{finished ? 'Oiled all over, and ready to wrap.' : 'Rub oil and resin into the body with the cloth: press and rub back and forth over every part.'}</Task>
      <Picture
        label={finished ? 'The dried body, glossy with oil and resin all over' : `The dried body on the bed; still to oil: ${dryParts.join(', ')}`}
        aspect={ASPECT}
        over={
          !finished && (
            <KeyHandle
              at={box(ZONES[keyAt].x0, 220, ZONES[keyAt].x1 - ZONES[keyAt].x0, 70)}
              label="The oil cloth"
              value={keyAt / (ZONES.length - 1)}
              valueText={`On ${ZONES[keyAt].name}${coats[keyAt] >= 1 ? ', coated' : ''}. Left and right arrows move the cloth; up and down arrows rub.`}
              shape="wide"
              onKey={(k) => {
                if (k === 'ArrowLeft' || k === 'ArrowRight') {
                  setKeyAt((i) => clamp(i + (k === 'ArrowLeft' ? -1 : 1), 0, ZONES.length - 1));
                  return true;
                }
                if (k === 'ArrowUp' || k === 'ArrowDown') {
                  rub(keyAt, RUB_NEEDED / 2);
                  return true;
                }
                return false;
              }}
            />
          )
        }
      >
        <MummyScene ref={svg} onPointer={on} look={{ ...base, oil: coats }} tools={{ cloth }} />
      </Picture>
      <Tray
        tools={
          !finished && (
            <div className="egm-meter-row">
              <svg className="egm-oilpot" viewBox="-30 -30 60 60" aria-hidden="true">
                <path d="M-18 -14 C-26 0 -20 22 0 24 C20 22 26 0 18 -14 Z" fill="#c99a3d" stroke="#4a2c12" strokeWidth="2" />
                <ellipse cx="0" cy="-14" rx="18" ry="5" fill="#7a4a12" stroke="#4a2c12" strokeWidth="2" />
                <ellipse cx="0" cy="-14" rx="13" ry="3" fill="#e8b04a" />
              </svg>
              <p className="egm-small">{started ? `Still dry: ${dryParts.join(', ')}.` : 'The oil and resin are warm and ready.'}</p>
            </div>
          )
        }
        notes={finished ? stepNotes('oils') : []}
      />
    </>
  );
}

/* ───────────────────────── 7. Linen, with amulets ───────────────────────── */

const ABOVE = 212;
const BELOW = 316;
type Tucked = { id: string; glyph: string };

export function WrapStep({ kit, base }: { kit: StepKit; base: BodyLook }) {
  const [passes, setPasses] = useState(kit.done ? ALL_PASSES : 0);
  const [y, setY] = useState(ABOVE);
  const [tucked, setTucked] = useState<Tucked[]>(kit.done ? [{ id: 'wedjat', glyph: WRAP_AMULETS[0].glyph }] : []);
  // Which side of the body the roll is on: state for the drawing, a ref for the gesture between renders.
  const [sideNow, setSide] = useState<'above' | 'below'>(kit.done ? 'below' : 'above');
  const side = useRef<'above' | 'below'>(sideNow);
  const w = wrapState(passes, tucked.length);
  const own = kit.own;
  const choices = [...(own ? [{ id: 'own', name: 'Your amulet', glyph: '' }] : []), ...WRAP_AMULETS.map((a) => ({ id: a.id, name: a.name, glyph: a.glyph }))];

  const pass = (to: 'above' | 'below') => {
    if (w.waitsForAmulet || w.done) return;
    side.current = to;
    setSide(to);
    setY(to === 'above' ? ABOVE : BELOW);
    const n = passes + 1;
    setPasses(n);
    playEgypt('settle');
    if (n >= ALL_PASSES) {
      kit.say('The second layer is on. The body is wrapped, with the amulets safe inside.');
      kit.finish();
    } else if (n === PASSES) kit.say('The first layer of linen is on. Now tuck amulets onto it, before the second layer.');
    else kit.say(`Layer ${Math.floor(n / PASSES) + 1}: ${n % PASSES} of ${PASSES} passes round the body.`);
  };
  const { svg, on } = usePicturePointer({
    down: (p) => {
      if (w.waitsForAmulet || w.done) return false;
      return Math.abs(p.x - passX(passes)) < 48 && Math.abs(p.y - y) < 48;
    },
    move: (p) => {
      const ny = clamp(p.y, 196, 330);
      if (side.current === 'above' && ny > BODY_BOTTOM + 4) pass('below');
      else if (side.current === 'below' && ny < BODY_TOP - 6) pass('above');
      else setY(ny);
    },
    up: () => setY(side.current === 'above' ? ABOVE : BELOW),
  });

  const tuck = (id: string) => {
    if (!canTuck(passes, tucked.length) || tucked.some((t) => t.id === id)) return;
    const a = choices.find((c) => c.id === id)!;
    setTucked((t) => [...t, { id, glyph: a.glyph }]);
    playEgypt('find');
    kit.say(`${a.name} is tucked onto the linen. Tuck in another, or go on with the second layer.`);
  };
  const { drag, carrying, start } = useDragDrop<string>((id, at) => {
    if (at.target === 'body') tuck(id);
  });
  const lastNote = WRAP_AMULETS.find((a) => a.id === tucked[tucked.length - 1]?.id)?.note;
  const tucking = canTuck(passes, tucked.length) || (passes === PASSES && tucked.length > 0);

  return (
    <>
      <Task done={w.done}>
        {w.done
          ? 'Wrapped, with amulets inside.'
          : w.waitsForAmulet
            ? 'The first layer is on. Now tuck at least one amulet onto the linen, to lie between the layers.'
            : passes === 0
              ? 'Take the roll of linen round and round the body: drag it down over the body, then up under it, and again, from head to feet.'
              : passes < PASSES
                ? 'Keep going round: down over the body, up under it.'
                : 'Now the second layer, from the feet back to the head, over the amulets.'}
      </Task>
      <Picture
        label={`The dried, oiled body ${passes ? `wrapped in ${passes} of ${ALL_PASSES} passes of linen` : 'on the bed, a roll of linen beside its head'}${tucked.length ? `, with ${tucked.length} ${tucked.length === 1 ? 'amulet' : 'amulets'} on the first layer` : ''}`}
        aspect={ASPECT}
        carrying={!!carrying}
        over={
          <>
            {canTuck(passes, tucked.length) && <div data-drop="body" className="egm-body-drop" style={box(190, 228, 450, 64)} aria-hidden="true" />}
            {!w.done && !w.waitsForAmulet && (
              <KeyHandle
                at={box(passX(passes) - 26, y - 26, 52, 52)}
                label="The roll of linen"
                value={passes / ALL_PASSES}
                valueText={`Layer ${w.layers + 1}, pass ${w.pass + 1} of ${PASSES}. The roll is ${sideNow === 'above' ? 'above the body: press the down arrow to take it over' : 'under the body: press the up arrow to bring it round'}.`}
                onKey={(k) => {
                  if (k === 'ArrowDown' && sideNow === 'above') pass('below');
                  else if (k === 'ArrowUp' && sideNow === 'below') pass('above');
                  else return k === 'ArrowDown' || k === 'ArrowUp';
                  return true;
                }}
              />
            )}
          </>
        }
      >
        <MummyScene ref={svg} onPointer={on} look={{ ...base, passes, amulets: tucked, own }} tools={{ roll: w.done ? null : { x: passX(passes), y, waiting: w.waitsForAmulet } }} />
      </Picture>
      <Tray
        tools={
          !w.done && (
            <>
              <span className="egm-layers" aria-hidden="true">
                {Array.from({ length: ALL_PASSES }, (_, i) => (
                  <span key={i} data-on={i < passes || undefined} data-gap={i === PASSES - 1 || undefined} />
                ))}
              </span>
              {tucking ? (
                <div className="egm-organs" role="group" aria-label="Amulets to tuck in">
                  {choices.map((a) => {
                    const isIn = tucked.some((t) => t.id === a.id);
                    return (
                      <button key={a.id} type="button" className="egm-thing egk-carry" disabled={isIn || !canTuck(passes, tucked.length)} onClick={() => tuck(a.id)} onPointerDown={(e) => start(a.id, e)}>
                        {a.id === 'own' && own ? (
                          <AmuletArt className="egm-own-amulet" idPrefix="egm-tray-own" shape={own.shape} material={own.material} symbols={own.symbols} nameGlyphs={own.nameGlyphs} label={`Your amulet: ${describeAmulet(own)}`} />
                        ) : (
                          <Glyphs text={a.glyph} className="egm-amulet-glyph" />
                        )}
                        {a.name}
                        {isIn && <span className="egm-small"> (tucked in)</span>}
                      </button>
                    );
                  })}
                  {!own && (
                    <p className="egm-small">
                      Want to tuck in your own? <Link href="/exhibitions/egypt/amulet">Design an amulet</Link>, then come back.
                    </p>
                  )}
                </div>
              ) : (
                <p className="egm-small">
                  Layer {w.layers + 1} of 2 · pass {w.pass + 1} of {PASSES}
                </p>
              )}
            </>
          )
        }
        notes={[...(lastNote && !w.done ? [lastNote] : []), ...(w.done ? stepNotes('wrap') : [])]}
      />
      <DragGhost at={drag}>
        {drag && <span className="egm-ghost egm-ghost-amulet">{drag.item === 'own' ? '' : <Glyphs text={WRAP_AMULETS.find((a) => a.id === drag.item)?.glyph ?? ''} />}</span>}
      </DragGhost>
    </>
  );
}
