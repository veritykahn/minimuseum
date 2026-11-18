'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import Link from 'next/link';
import FactNote, { type ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell, { Glyphs, RoomHeader, StepDots, TombDoor } from '../RoomShell';
import Modal from '../Modal';
import { SYMBOLS } from '../amulet/amulets';
import { GLYPHS } from '../rooms';
import { fromTomb, markDone, useTomb } from '../tombState';
import MummyScene, { NATRON_SPOTS, WASH_PATCHES, type MummyState } from './MummyScene';
import { ANUBIS_POSTER, CHECK, HEART_NOTE, JARS, JARS_ANSWER, LAYERS, ORGANS, STAGES, STEPS, WRAP_AMULETS, jarFor, stepNotes, type StageId, type StepId } from './steps';
import './mummy.css';
import { playEgypt } from '../egyptSound';

/*
 * Mummification, step by step: five steps across the seventy days, each with
 * its own #address, "Step 2 of 5" dots and Back and Next, which stay in one
 * place. The visitor does the work: wipes the dust away and draws out the
 * brain; drops each organ onto its canopic jar in the picture (a step of
 * its own, the whole screen: drag an organ, or tap it and then its jar)
 * and notices the heart left inside; packs the natron, counts the forty
 * days and rubs in the oils; wraps the linen with the amulets they choose
 * (their own, from the amulet maker, among them); and lays the mummy in its
 * coffin. Three quick questions, one at a time, then the doorway to the
 * Hall of Judgement.
 *
 * Each step shows one thing to do at a time, and what it teaches as it is
 * done; the step's other notes open over the room from "Did you know?".
 * Which organ goes in which jar is kept out of the words until the jars are
 * full. The facts are museum notes; their sources are in the room's Sources
 * drawer (steps.ts).
 */

const SOURCES: SourceGroup[] = [
  ...STAGES.map((st) => ({
    title: st.title,
    items: [
      ...new Map(
        [...st.steps.flatMap((id) => STEPS.find((s) => s.id === id)!.notes), ...(st.id === 'organs' ? [HEART_NOTE] : []), ...(st.id === 'wrap' ? WRAP_AMULETS.map((a) => a.note) : [])]
          .flatMap((n) => n.sources)
          .map((x) => [x.href, x]),
      ).values(),
    ],
  })),
  {
    title: 'Pictures',
    items: [
      { label: 'The embalmers’ table and the figure are drawn for the Mini Museum.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];

const PACK = NATRON_SPOTS.length;
const OILS = 3;
/** The picture's own box (MummyScene's viewBox), for laying the jars' drop targets over it. */
const VIEW = { x: 100, y: 150, w: 640, h: 290 };

export default function Mummification() {
  const reduced = usePrefersReducedMotion();
  const [tomb] = useTomb();
  const [index, setIndex] = useState(0);
  const [dusty, setDusty] = useState<number[]>(WASH_PATCHES.map((_, i) => i));
  const [brainOut, setBrainOut] = useState(false);
  const [organ, setOrgan] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [heartAnswer, setHeartAnswer] = useState<string | null>(null);
  const [heartCard, setHeartCard] = useState(false);
  const [drag, setDrag] = useState<{ organ: string; x: number; y: number } | null>(null);
  const [packed, setPacked] = useState(0);
  const [days, setDays] = useState(0);
  const [oiled, setOiled] = useState(0);
  const [layers, setLayers] = useState(0);
  const [amulets, setAmulets] = useState<{ id: string; glyph: string; layer: number }[]>([]);
  const [inCoffin, setInCoffin] = useState(false);
  const [closed, setClosed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [notesOpen, setNotesOpen] = useState(false);
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stage = STAGES[index];
  const dried = days >= 40;

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      // An old address (a step that is now part of a bigger one) opens that one.
      const i = STAGES.findIndex((st) => st.id === h || (st.steps as string[]).includes(h));
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STAGES.length - 1, i));
    setIndex(to);
    setHint('');
    setNotesOpen(false);
    setHeartCard(false);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${STAGES[to].id}`);
    setStatus(`Step ${to + 1} of ${STAGES.length}: ${STAGES[to].title}.`);
  };
  // A new step: the focus to its heading (not on the first render).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [index]);

  // Washing: wipe the dust away with a finger or the mouse, or pour water a patch at a time.
  const washing = stage.id === 'wash' && dusty.length > 0;
  const wipeAt = (e: PointerEvent<HTMLDivElement>) => {
    if (!washing || (e.pointerType === 'mouse' && e.buttons === 0 && e.type === 'pointermove')) return;
    const el = svg.current;
    const m = el?.getScreenCTM?.();
    if (!el || !m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const near = (i: number) => Math.hypot(WASH_PATCHES[i].x - p.x, (WASH_PATCHES[i].y - p.y) * 1.6) < 34;
    if (dusty.some(near)) washed((d) => d.filter((i) => !near(i)));
  };
  const washed = (update: (d: number[]) => number[]) => {
    // The splash is played here, not in the update (which React may run twice).
    if (update(dusty).length < dusty.length) playEgypt('water');
    setDusty((d) => {
      const left = update(d);
      setStatus(left.length ? `Washing: ${WASH_PATCHES.length - left.length} of ${WASH_PATCHES.length} clean.` : 'The body is washed clean.');
      return left;
    });
  };

  // The organs: drag one onto its jar in the picture, or choose it and then the jar.
  const toJar = (god: string, which = organ) => {
    if (!which) {
      setHint('First choose an organ, then its jar.');
      return;
    }
    const jar = jarFor(which);
    if (jar.god === god) {
      const next = filled.includes(god) ? filled : [...filled, god];
      setFilled(next);
      playEgypt('find');
      setHint('');
      setStatus(`Yes: ${jar.head}-headed ${jar.god} protects the ${which}.${next.length === JARS.length ? ' All four jars are full.' : ''}`);
      setOrgan(null);
    } else {
      // A gentle hint: the head of the right god.
      playEgypt('miss');
      const msg = `Not that jar. The ${which} was looked after by the god with a ${jar.head}’s head.`;
      setHint(msg);
      setStatus(msg);
    }
  };
  const startDrag = (o: string, e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setOrgan(o);
    setDrag({ organ: o, x: e.clientX, y: e.clientY });
  };
  useEffect(() => {
    if (!drag) return;
    const move = (e: globalThis.PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    const up = (e: globalThis.PointerEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-jar]');
      const o = drag.organ;
      setDrag(null);
      if (target) toJar(target.dataset.jar!, o);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    // toJar reads the latest state through the render it was made in; the drag's own organ is passed in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.organ]);

  const pack = () => {
    const n = Math.min(PACK, packed + 1);
    setPacked(n);
    setStatus(n === PACK ? 'All the natron is packed, inside and out. Now count the 40 days.' : `${n} of ${PACK} bags of natron packed.`);
  };

  const startNatron = () => {
    if (timer.current) clearInterval(timer.current);
    if (reduced) {
      setDays(40);
      setStatus('Forty days have passed. The body is dry.');
      return;
    }
    setDays(0);
    let d = 0;
    timer.current = setInterval(() => {
      d += 1;
      setDays(d);
      if (d >= 40) {
        clearInterval(timer.current!);
        timer.current = null;
        setStatus('Forty days have passed. The body is dry.');
      }
    }, 70);
  };

  const rub = () => {
    const n = Math.min(OILS, oiled + 1);
    setOiled(n);
    setStatus(n === OILS ? 'The body is coated in oils and resin.' : `Coat ${n} of ${OILS} of oils and resin.`);
  };

  const wrapLayer = () => {
    const n = Math.min(LAYERS, layers + 1);
    setLayers(n);
    setStatus(n >= LAYERS ? 'The last layer of linen is on.' : `Layer ${n} of ${LAYERS} of linen.`);
  };
  // The amulets to tuck in: the visitor's own (from the amulet maker), then the three the embalmers used.
  const own = tomb.amulet;
  const ownSymbols = (own?.symbols ?? []).map((id) => SYMBOLS.find((x) => x.id === id)).filter((x) => !!x);
  const choices = [
    ...(own ? [{ id: 'own', name: 'Your amulet', glyph: ownSymbols.map((x) => x.glyph).join('') || GLYPHS.L1, note: null }] : []),
    ...WRAP_AMULETS.map((a) => ({ ...a, note: a.note })),
  ];
  const tuck = (id: string) => {
    const a = choices.find((x) => x.id === id)!;
    setAmulets((list) => [...list, { id, glyph: a.glyph, layer: layers }]);
    setStatus(`${a.name} is tucked into the wrappings.`);
  };
  const lastAmulet = WRAP_AMULETS.find((a) => a.id === amulets[amulets.length - 1]?.id);

  const layIn = () => {
    setInCoffin(true);
    setStatus('The mummy is laid in its coffin.');
  };
  const closeLid = () => {
    setClosed(true);
    markDone('mummification');
    setStatus('The lid is closed. The seventy days are over.');
  };

  const allDone = filled.length === JARS.length;
  const heartFound = heartAnswer === 'The heart';
  const question = CHECK.findIndex((c, i) => answers[i] !== c.answer);
  const checked = question < 0;

  // What the picture shows: the part of this step the visitor is on.
  const sceneStep: StepId =
    stage.id === 'wash' ? (dusty.length ? 'wash' : 'brain')
    : stage.id === 'natron' ? (dried ? 'oils' : 'natron')
    : stage.id;

  const scene: MummyState = {
    step: sceneStep,
    dusty,
    brainOut,
    filled,
    packed: sceneStep === 'natron' ? packed : PACK,
    dried,
    oiled,
    layers,
    amulets,
    inCoffin,
    closed,
    showHeart: stage.id === 'organs' && allDone,
  };

  const sceneLabel =
    stage.id === 'coffin'
      ? closed
        ? 'The coffin, closed, with a painted face'
        : inCoffin
          ? 'The wrapped mummy lying in its open coffin'
          : 'The wrapped mummy on the embalmers’ bed, beside its open coffin'
      : stage.id === 'wrap'
        ? `The body on the embalmers’ bed, wrapped in ${layers} of ${LAYERS} layers of linen`
        : sceneStep === 'natron'
          ? `The body on the embalmers’ bed, with ${packed} of ${PACK} bags of natron packed around it`
          : sceneStep === 'oils'
            ? `The body, dried and shrunken after forty days in natron, ${oiled} of ${OILS} coats of oil rubbed in`
            : sceneStep === 'wash'
              ? `The body on the embalmers’ bed, ${dusty.length} dusty patches still to wash`
              : sceneStep === 'brain'
                ? brainOut
                  ? 'The body on the embalmers’ bed, washed clean; the brain has been drawn out through the nose and is gone'
                  : 'The body on the embalmers’ bed, washed clean, a long bronze hook above the nose'
                : `The body on the embalmers’ bed, with a cut on its left side, and four canopic jars, ${filled.length} of them filled`;

  // "Did you know?": every note of this step (the jars' answers only once the jars are full).
  const notes = stage.steps.flatMap(stepNotes).filter((n) => n !== JARS_ANSWER || allDone);

  const stageDone = (id: StageId) =>
    id === 'wash' ? brainOut && !dusty.length
    : id === 'organs' ? allDone && heartFound
    : id === 'natron' ? dried && oiled >= OILS
    : id === 'wrap' ? layers >= LAYERS
    : closed;

  const dots = <StepDots steps={STAGES} at={index} done={(i) => stageDone(STAGES[i].id)} onGo={go} label="The steps" />;

  const nav = (
    <div className="egr-step-nav egm-nav">
      <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
        <span aria-hidden="true">←</span> Back
      </button>
      <button type="button" className="egr-button egr-button-quiet" aria-haspopup="dialog" onClick={() => setNotesOpen(true)}>
        <span className="egr-q" aria-hidden="true">?</span>Did you know?
      </button>
      <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={index === STAGES.length - 1}>
        Next step <span aria-hidden="true">→</span>
      </button>
    </div>
  );

  const title = (
    <h2 id="egm-title" ref={heading} tabIndex={-1}>
      {stage.title}
    </h2>
  );

  return (
    <RoomShell className="eg-mummy" sources={SOURCES} fit>
      <RoomHeader kicker="Interactive · Seventy days" title="Mummification, Step by Step">
        <p className="egr-lede">Work beside the embalmers through the seventy days, one step at a time.</p>
      </RoomHeader>

      {stage.id === 'organs' ? (
        /* The canopic jars: a step of its own, the whole screen. The organs sit just above the jars in the picture. */
        <section className="egm-game egr-fill" aria-labelledby="egm-title">
          <div className="egm-game-head">
            <div className="egm-game-title">
              {dots}
              {title}
            </div>
            {!allDone ? (
              <div className="egm-tray">
                <p className="egr-task">Drag each organ onto the jar of the god who protects it. Or tap an organ, then its jar.</p>
                <div className="egr-options" role="group" aria-label="The organs">
                  {ORGANS.map((o) => {
                    const done = filled.includes(jarFor(o).god);
                    return (
                      <button
                        key={o}
                        type="button"
                        className="egr-option egm-organ"
                        aria-pressed={organ === o}
                        disabled={done}
                        onClick={() => setOrgan(o)}
                        onPointerDown={(e) => !done && startDrag(o, e)}
                      >
                        {o[0].toUpperCase() + o.slice(1)}
                        {done && <span aria-label=" (in its jar)"> ✓</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="egm-hint" aria-hidden="true">{hint}</p>
              </div>
            ) : (
              <fieldset className="egr-choice egm-tray egm-heart-q">
                <legend>All four jars are full. But look closely at the body: which organ is still inside?</legend>
                <div className="egr-options">
                  {['The brain', 'The heart', 'The lungs'].map((o) => (
                    <button
                      key={o}
                      type="button"
                      className="egr-option"
                      aria-pressed={heartAnswer === o}
                      onClick={() => {
                        setHeartAnswer(o);
                        if (o === 'The heart') {
                          playEgypt('find');
                          setHeartCard(true);
                        }
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <p className={heartFound ? 'egm-done' : 'egm-hint'}>{heartAnswer && (heartFound ? 'Yes, the heart. On to the next step.' : 'Look again: the small red shape on the chest.')}</p>
              </fieldset>
            )}
          </div>

          <div className="egm-game-scene egr-sizer">
            <div className="egm-pic">
              <div role="img" aria-label={sceneLabel} className="egm-table">
                <MummyScene ref={svg} s={scene} />
              </div>
              {/* The jars in the picture are the drop targets. */}
              {JARS.map((j, i) => {
                const x = 250 + i * 100;
                const full = filled.includes(j.god);
                return (
                  <button
                    key={j.god}
                    type="button"
                    data-jar={j.god}
                    className={`egm-drop ${full ? 'is-full' : ''} ${organ && !full ? 'is-ready' : ''}`}
                    style={{ left: `${((x - 48 - VIEW.x) / VIEW.w) * 100}%`, width: `${(96 / VIEW.w) * 100}%`, top: `${((322 - VIEW.y) / VIEW.h) * 100}%`, height: `${((438 - 322) / VIEW.h) * 100}%` }}
                    onClick={() => toJar(j.god)}
                    aria-label={`${j.god}, the ${j.head}-headed jar${full ? ' (full)' : ''}`}
                  >
                    <span className="egm-drop-name" aria-hidden="true">
                      {j.god}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {nav}
        </section>
      ) : (
        <div className="egr-layout egr-fill">
          <div className="egr-scene egm-room">
            <div className="egm-timeline" aria-hidden="true">
              <span className="egm-timeline-bar">
                <span className="egm-timeline-span" style={{ left: `${stage.span[0] * 100}%`, width: `${(stage.span[1] - stage.span[0]) * 100}%` }} />
              </span>
              <span className="egm-timeline-ends">
                <span>Day 1</span>
                <span className="egm-timeline-when">{stage.when}</span>
                <span>Day 70</span>
              </span>
            </div>
            <div className="egm-scene-cell egr-sizer">
              <div className="egm-pic">
                <div role="img" aria-label={sceneLabel} className={`egm-table ${washing ? 'is-washing' : ''}`} onPointerDown={wipeAt} onPointerMove={wipeAt}>
                  <MummyScene ref={svg} s={scene} onSpot={() => pack()} />
                </div>
              </div>
            </div>
            <p className="egm-days" aria-hidden="true">
              {sceneStep === 'natron' ? (
                <>
                  <span>{days}</span> {days === 1 ? 'day' : 'days'} in natron
                </>
              ) : washing ? (
                'Wipe the dust away with your finger or mouse'
              ) : (
                ' '
              )}
            </p>
          </div>

          <section className="egr-panel egr-stepper" aria-labelledby="egm-title">
            <div className="egr-step-body">
              {dots}
              {title}

              {stage.id === 'wash' && (
                <Task
                  todo={dusty.length ? 'Wipe the dust off the body, or pour water over it.' : !brainOut ? 'Washed clean. Now draw out the brain, through the nose, with the bronze hook.' : null}
                  done={!dusty.length && brainOut ? 'Gone: the brain was not kept.' : null}
                  note={brainOut ? stepNotes('brain')[0] : !dusty.length ? stepNotes('wash')[0] : null}
                >
                  {dusty.length > 0 ? (
                    <button type="button" className="egr-button" onClick={() => washed((d) => d.slice(1))}>
                      Pour water ({WASH_PATCHES.length - dusty.length}/{WASH_PATCHES.length})
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="egr-button"
                      disabled={brainOut}
                      onClick={() => {
                        setBrainOut(true);
                        setStatus('The brain is drawn out through the nose, and it is not kept.');
                      }}
                    >
                      Draw out the brain
                    </button>
                  )}
                </Task>
              )}

              {stage.id === 'natron' && (
                <Task
                  todo={packed < PACK ? 'Pack the bags of natron, a natural salt, around the body.' : !dried ? 'All packed. Now count the forty days.' : oiled < OILS ? 'Dry, and a little shrunken. Now rub in the oils and resin.' : null}
                  done={dried && oiled >= OILS ? 'Dried, oiled and ready to wrap.' : null}
                  note={dried ? (oiled >= OILS ? stepNotes('oils') : stepNotes('natron'))[0] : null}
                >
                  {!dried ? (
                    <>
                      <button type="button" className="egr-button" onClick={pack} disabled={packed >= PACK}>
                        Pack a bag of natron ({packed}/{PACK})
                      </button>
                      <button type="button" className="egr-button" onClick={startNatron} disabled={packed < PACK}>
                        Start the 40 days
                      </button>
                    </>
                  ) : (
                    <button type="button" className="egr-button" onClick={rub} disabled={oiled >= OILS}>
                      Rub in oil and resin ({oiled}/{OILS})
                    </button>
                  )}
                </Task>
              )}

              {stage.id === 'wrap' && (
                <>
                  <Task todo={layers < LAYERS ? 'Wrap the linen, layer by layer, and tuck amulets in between the layers.' : null} done={layers >= LAYERS ? 'The last layer of linen is on.' : null} note={null}>
                    <button type="button" className="egr-button" onClick={wrapLayer} disabled={layers >= LAYERS}>
                      Wrap a layer of linen ({layers}/{LAYERS})
                    </button>
                  </Task>
                  <fieldset className="egr-choice">
                    <legend>Amulets to tuck in</legend>
                    <div className="egr-options">
                      {choices.map((a) => (
                        <button key={a.id} type="button" className="egr-option" onClick={() => tuck(a.id)} disabled={layers >= LAYERS || amulets.length >= 6}>
                          <Glyphs text={a.glyph} className="egm-amulet-glyph" />
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  {!own && (
                    <p className="egm-small">
                      Want to tuck in your own? <Link href={fromTomb('/exhibitions/egypt/amulet')}>Design an amulet</Link>, then come back.
                    </p>
                  )}
                  {lastAmulet && <FactNote fact={lastAmulet.note} className="egr-fact" />}
                </>
              )}

              {stage.id === 'coffin' &&
                (!closed ? (
                  <Task todo={!inCoffin ? 'The mummy is ready. Lay it in its coffin.' : 'Now close the lid.'} done={null} note={null}>
                    <button type="button" className="egr-button" onClick={layIn} disabled={inCoffin}>
                      Lay the mummy in its coffin
                    </button>
                    <button type="button" className="egr-button" onClick={closeLid} disabled={!inCoffin}>
                      Close the lid
                    </button>
                  </Task>
                ) : (
                  <div className="egm-check">
                    <p className="egr-label">
                      Three quick questions · {checked ? CHECK.length : question + 1} of {CHECK.length}
                    </p>
                    {CHECK.map((c, i) =>
                      i === question ? (
                        <fieldset key={c.q} className="egr-choice">
                          <legend>{c.q}</legend>
                          <div className="egr-options">
                            {c.options.map((o) => (
                              <button key={o} type="button" className="egr-option" aria-pressed={answers[i] === o} onClick={() => setAnswers((a) => ({ ...a, [i]: o }))}>
                                {o}
                              </button>
                            ))}
                          </div>
                          {answers[i] && <p className="egm-hint">Not quite. Have another go.</p>}
                        </fieldset>
                      ) : answers[i] === c.answer ? (
                        <p key={c.q} className="egm-done egm-answered">
                          <span aria-hidden="true">✓ </span>Yes! {c.after}
                        </p>
                      ) : null,
                    )}
                    {checked && (
                      <div className="egm-ending">
                        <p>The mummy is ready. Next, its heart will be weighed in the Hall of Judgement.</p>
                        <div className="egr-actions">
                          <Link className="egr-button egr-button-primary" href={fromTomb('/exhibitions/egypt/weighing-of-the-heart')}>
                            Into the Hall of Judgement <span aria-hidden="true">→</span>
                          </Link>
                          <TombDoor />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {nav}
          </section>
        </div>
      )}

      <Modal open={notesOpen} onClose={() => setNotesOpen(false)} kicker="Did you know?" title={stage.title}>
        {stage.id === 'wash' && <p className="egr-poster">{ANUBIS_POSTER}</p>}
        {notes.map((n) => (
          <FactNote key={n.text} fact={n} className="egr-fact" />
        ))}
        {stage.id === 'organs' && !allDone && <p className="egm-small">Which god looks after which organ? Fill the jars to find out.</p>}
        {stage.id === 'organs' && heartFound && <FactNote fact={HEART_NOTE} className="egr-fact" />}
      </Modal>

      {/* The jars full and the heart noticed: what the visitor has just learned, in its own card. */}
      <Modal open={heartCard} onClose={() => setHeartCard(false)} tone="gold" kicker="Yes, the heart" title="The heart stays inside">
        <FactNote fact={HEART_NOTE} className="egr-fact" />
        <FactNote fact={JARS_ANSWER} className="egr-fact" lead="And the jars:" />
        <div className="egr-actions">
          <button
            type="button"
            className="egr-button egr-button-primary"
            onClick={() => {
              setHeartCard(false);
              go(index + 1);
            }}
          >
            On to the natron <span aria-hidden="true">→</span>
          </button>
        </div>
      </Modal>

      {drag && (
        <span className="egm-drag" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {drag.organ}
        </span>
      )}

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}

/** A step's one thing to do now (or what is done), its buttons, and what it has just taught. */
function Task({ todo, done, note, children }: { todo: string | null; done: string | null; note: ApprovedFact | null; children: ReactNode }) {
  return (
    <div className="egm-task">
      {todo && <p className="egr-task">{todo}</p>}
      {done && <p className="egm-done">{done}</p>}
      <div className="egr-actions">{children}</div>
      {note && <FactNote fact={note} className="egr-fact egm-learned" />}
    </div>
  );
}
