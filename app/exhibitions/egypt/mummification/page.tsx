'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell, { Glyphs, RoomHeader, TombDoor } from '../RoomShell';
import { SYMBOLS } from '../amulet/amulets';
import { GLYPHS } from '../rooms';
import { fromTomb, markDone, useTomb } from '../tombState';
import MummyScene, { NATRON_SPOTS, WASH_PATCHES, type MummyState } from './MummyScene';
import { ANUBIS_POSTER, CHECK, HEART_NOTE, JARS, LAYERS, ORGANS, STEPS, WRAP_AMULETS, jarFor } from './steps';
import './mummy.css';

/*
 * Mummification, step by step: eight steps across the seventy days, each a
 * tab (and #address) with Back and Next, which stay in one place (the
 * panel keeps its size; only the step's body changes). The visitor does the
 * work: wipes the dust away, draws out the brain, drags each organ to its
 * canopic jar (and notices the heart left inside), packs the natron and
 * counts the forty days, rubs in the oils, wraps the linen with the amulets
 * they choose (their own, from the amulet maker, among them), and lays the
 * mummy in its coffin. Three quick questions, then the doorway to the Hall
 * of Judgement. The facts are museum notes; their sources are in the
 * room's Sources drawer (steps.ts).
 */

const SOURCES: SourceGroup[] = [
  ...STEPS.map((s) => ({
    title: s.title,
    items: [...new Map([...s.notes, ...(s.id === 'organs' ? [HEART_NOTE] : []), ...(s.id === 'wrap' ? WRAP_AMULETS.map((a) => a.note) : [])].flatMap((n) => n.sources).map((x) => [x.href, x])).values()],
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
  const [drag, setDrag] = useState<{ organ: string; x: number; y: number } | null>(null);
  const [packed, setPacked] = useState(0);
  const [days, setDays] = useState(0);
  const [oiled, setOiled] = useState(0);
  const [layers, setLayers] = useState(0);
  const [amulets, setAmulets] = useState<{ id: string; glyph: string; layer: number }[]>([]);
  const [inCoffin, setInCoffin] = useState(false);
  const [closed, setClosed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState('');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const step = STEPS[index];
  const dried = days >= 40;

  useEffect(() => {
    const fromHash = () => {
      const i = STEPS.findIndex((s) => s.id === window.location.hash.slice(1));
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const go = (i: number, focus = false) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setIndex(to);
    setHint('');
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${STEPS[to].id}`);
    setStatus(`Step ${to + 1} of ${STEPS.length}: ${STEPS[to].title}.`);
    if (focus) tabRefs.current[to]?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' ? (index + 1) % STEPS.length
      : e.key === 'ArrowLeft' ? (index - 1 + STEPS.length) % STEPS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? STEPS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    go(to, true);
  };

  // Washing: wipe the dust away with a finger or the mouse, or pour water a patch at a time.
  const wipeAt = (e: PointerEvent<HTMLDivElement>) => {
    if (step.id !== 'wash' || (e.pointerType === 'mouse' && e.buttons === 0 && e.type === 'pointermove')) return;
    const el = svg.current;
    const m = el?.getScreenCTM?.();
    if (!el || !m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const near = (i: number) => Math.hypot(WASH_PATCHES[i].x - p.x, (WASH_PATCHES[i].y - p.y) * 1.6) < 34;
    if (dusty.some(near)) washed((d) => d.filter((i) => !near(i)));
  };
  const washed = (update: (d: number[]) => number[]) => {
    setDusty((d) => {
      const left = update(d);
      setStatus(left.length ? `Washing: ${WASH_PATCHES.length - left.length} of ${WASH_PATCHES.length} clean.` : 'The body is washed clean.');
      return left;
    });
  };

  // The organs: drag one to its jar, or choose it and then the jar.
  const toJar = (god: string, which = organ) => {
    if (!which) {
      setHint('First choose an organ.');
      return;
    }
    const jar = jarFor(which);
    if (jar.god === god) {
      const next = filled.includes(god) ? filled : [...filled, god];
      setFilled(next);
      setHint('');
      setStatus(`Yes: ${jar.head}-headed ${jar.god} protects the ${which}.${next.length === JARS.length ? ' All four jars are full.' : ''}`);
      setOrgan(null);
    } else {
      // A gentle hint: the head of the right god.
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
  const checked = CHECK.every((_, i) => answers[i] === CHECK[i].answer);

  const scene: MummyState = {
    step: step.id,
    dusty,
    brainOut,
    filled,
    packed: step.id === 'natron' ? packed : PACK,
    dried,
    oiled,
    layers,
    amulets,
    inCoffin,
    closed,
    showHeart: step.id === 'organs' && allDone,
  };

  const sceneLabel =
    step.id === 'coffin'
      ? closed
        ? 'The coffin, closed, with a painted face'
        : inCoffin
          ? 'The wrapped mummy lying in its open coffin'
          : 'The wrapped mummy on the embalmers’ bed, beside its open coffin'
      : step.id === 'wrap'
        ? `The body on the embalmers’ bed, wrapped in ${layers} of ${LAYERS} layers of linen`
        : step.id === 'natron'
          ? dried
            ? 'The body, dried and shrunken after forty days in natron'
            : `The body on the embalmers’ bed, with ${packed} of ${PACK} bags of natron packed around it`
          : step.id === 'wash'
            ? `The body on the embalmers’ bed, ${dusty.length ? `${dusty.length} dusty patches still to wash` : 'washed clean'}`
            : step.id === 'brain'
              ? brainOut
                ? 'The body on the embalmers’ bed; the brain has been drawn out through the nose and is gone'
                : 'The body on the embalmers’ bed, a long bronze hook above the nose'
              : step.id === 'organs'
                ? `The body on the embalmers’ bed, with a cut on its left side, and four canopic jars, ${filled.length} of them filled`
                : step.id === 'oils'
                  ? `The dried body, ${oiled} of ${OILS} coats of oil rubbed in`
                  : 'A body lying face up on the embalmers’ lion-legged bed, in a white kilt';

  return (
    <RoomShell className="eg-mummy" sources={SOURCES}>
      <RoomHeader kicker="Interactive · Seventy days" title="Mummification, Step by Step">
        <p className="egr-lede">Work beside the embalmers through the seventy days, one step at a time.</p>
      </RoomHeader>

      <div className="egr-tabs" role="tablist" aria-label="The steps">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`egm-tab-${s.id}`}
            aria-controls="egm-panel"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            className="egr-tab"
            onClick={() => go(i)}
            onKeyDown={onTabKey}
          >
            <span aria-hidden="true">{i + 1}. </span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="egr-layout" id="egm-panel" role="tabpanel" aria-labelledby={`egm-tab-${step.id}`}>
        <div className="egr-scene egm-room">
          <div className="egm-timeline" aria-hidden="true">
            <span className="egm-timeline-bar">
              {step.span && <span className="egm-timeline-span" style={{ left: `${step.span[0] * 100}%`, width: `${(step.span[1] - step.span[0]) * 100}%` }} />}
            </span>
            <span className="egm-timeline-ends">
              <span>Day 1</span>
              <span className="egm-timeline-when">{step.when}</span>
              <span>Day 70</span>
            </span>
          </div>
          <div role="img" aria-label={sceneLabel} className={`egm-table ${step.id === 'wash' && dusty.length ? 'is-washing' : ''}`} onPointerDown={wipeAt} onPointerMove={wipeAt}>
            <MummyScene ref={svg} s={scene} onSpot={() => pack()} />
          </div>
          <p className="egm-days" aria-hidden="true">
            {step.id === 'natron' ? (
              <>
                <span>{days}</span> {days === 1 ? 'day' : 'days'} in natron
              </>
            ) : step.id === 'wash' && dusty.length ? (
              'Wipe the dust away with your finger or mouse'
            ) : (
              ' '
            )}
          </p>
        </div>

        <section className="egr-panel egr-stepper" aria-labelledby="egm-title">
          <div className="egr-step-body">
            <p className="egr-label">
              Step {index + 1} of {STEPS.length} · {step.when}
            </p>
            <h2 id="egm-title">{step.title}</h2>

            {step.id === 'why' && <p className="egr-poster">{ANUBIS_POSTER}</p>}

            {step.notes.map((n) => (
              <FactNote key={n.text} fact={n} className="egr-fact" />
            ))}

            {step.id === 'wash' && (
              <div className="egr-actions">
                <button type="button" className="egr-button" disabled={!dusty.length} onClick={() => washed((d) => d.slice(1))}>
                  Pour water ({WASH_PATCHES.length - dusty.length}/{WASH_PATCHES.length})
                </button>
                {!dusty.length && <p className="egm-done">Washed clean.</p>}
              </div>
            )}

            {step.id === 'brain' && (
              <div className="egr-actions">
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
                {brainOut && <p className="egm-done">Gone: the brain was not kept.</p>}
              </div>
            )}

            {step.id === 'organs' && (
              <div className="egm-match">
                <p>Drag each organ to the jar of the god who protects it, or choose an organ and then its jar.</p>
                <fieldset className="egr-choice">
                  <legend>The organs</legend>
                  <div className="egr-options">
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
                </fieldset>
                <fieldset className="egr-choice">
                  <legend>The four jars</legend>
                  <div className="egm-jars-row">
                    {JARS.map((j) => (
                      <button
                        key={j.god}
                        type="button"
                        data-jar={j.god}
                        className={`egr-option egm-jar-button ${filled.includes(j.god) ? 'is-full' : ''}`}
                        onClick={() => toJar(j.god)}
                        aria-label={`${j.god}, the ${j.head}-headed jar${filled.includes(j.god) ? ' (full)' : ''}`}
                      >
                        <Glyphs text={GLYPHS[j.glyph]} className="egm-jar-glyph" />
                        <span aria-hidden="true">{j.god}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <p className="egm-hint" aria-hidden="true">{hint}</p>
                {allDone && (
                  <fieldset className="egr-choice egm-heart-q">
                    <legend>All four jars are full. But look closely at the body: which organ is still inside?</legend>
                    <div className="egr-options">
                      {['The brain', 'The heart', 'The lungs'].map((o) => (
                        <button key={o} type="button" className="egr-option" aria-pressed={heartAnswer === o} onClick={() => setHeartAnswer(o)}>
                          {o}
                        </button>
                      ))}
                    </div>
                    {heartAnswer && heartAnswer !== 'The heart' && <p className="egm-hint">Look again: the small red shape on the chest.</p>}
                    {heartAnswer === 'The heart' && (
                      <>
                        <p className="egm-done">Yes, the heart.</p>
                        <FactNote fact={HEART_NOTE} className="egr-fact" />
                      </>
                    )}
                  </fieldset>
                )}
              </div>
            )}

            {step.id === 'natron' && (
              <div className="egr-actions">
                <button type="button" className="egr-button" onClick={pack} disabled={packed >= PACK}>
                  Pack a bag of natron ({packed}/{PACK})
                </button>
                <button type="button" className="egr-button" onClick={startNatron} disabled={packed < PACK}>
                  {dried ? 'Count the 40 days again' : 'Start the 40 days'}
                </button>
                {dried && <p className="egm-done">Dry, and a little shrunken.</p>}
              </div>
            )}

            {step.id === 'oils' && (
              <div className="egr-actions">
                <button type="button" className="egr-button" onClick={rub} disabled={oiled >= OILS}>
                  Rub in oil and resin ({oiled}/{OILS})
                </button>
              </div>
            )}

            {step.id === 'wrap' && (
              <>
                <div className="egr-actions">
                  <button type="button" className="egr-button" onClick={wrapLayer} disabled={layers >= LAYERS}>
                    Wrap a layer of linen ({layers}/{LAYERS})
                  </button>
                </div>
                <fieldset className="egr-choice">
                  <legend>Choose amulets to tuck in, between the layers</legend>
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

            {step.id === 'coffin' && (
              <>
                <div className="egr-actions">
                  <button type="button" className="egr-button" onClick={layIn} disabled={inCoffin}>
                    Lay the mummy in its coffin
                  </button>
                  <button type="button" className="egr-button" onClick={closeLid} disabled={!inCoffin || closed}>
                    Close the lid
                  </button>
                </div>
                {closed && (
                  <div className="egm-check">
                    <h3>Three quick questions</h3>
                    {CHECK.map((c, i) => (
                      <fieldset key={c.q} className="egr-choice">
                        <legend>{c.q}</legend>
                        <div className="egr-options">
                          {c.options.map((o) => (
                            <button key={o} type="button" className="egr-option" aria-pressed={answers[i] === o} onClick={() => setAnswers((a) => ({ ...a, [i]: o }))}>
                              {o}
                            </button>
                          ))}
                        </div>
                        {answers[i] && <p className={answers[i] === c.answer ? 'egm-done' : 'egm-hint'}>{answers[i] === c.answer ? `Yes! ${c.after}` : 'Not quite. Have another go.'}</p>}
                      </fieldset>
                    ))}
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
                )}
              </>
            )}
          </div>

          <div className="egr-step-nav">
            <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={index === STEPS.length - 1}>
              Next step <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

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
