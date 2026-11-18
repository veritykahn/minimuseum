'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell, { Glyphs, RoomHeader, StepDots } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import { DragGhost, toSvg, useDragDrop } from '../dragKit';
import AmuletArt from '../amulet/AmuletArt';
import { describeAmulet, useSavedAmulet } from '../amulet/savedAmulet';
import MummyScene, { JAR_BASE, JAR_SCALE, JAR_X, MUMMY_DROP, LID_DROP, NATRON_SPOTS, WASH_PATCHES, WRAP_FROM, WRAP_TO, type Grab, type MummyState } from './MummyScene';
import { Jar, JarHead, Organ, type HeadKind } from './JarArt';
import { CHECK, HEART_NOTE, JARS, JARS_ANSWER, LAYERS, MUMMY_INTRO, ORGANS, STEPS, WRAP_AMULETS, jarFor, stepNotes, type StepId } from './steps';
import './mummy.css';
import { playEgypt } from '../egyptSound';

/*
 * Mummification, step by step: eight steps across the seventy days, in the
 * embalmers' workshop. Every step is done with the hands, not a button:
 * rub the dust off; push the bronze hook up the nose and draw the brain
 * out; meet the four gods on the canopic jars' lids (taught first: who
 * guards which organ); lift each organ out of the body into its god's jar,
 * and notice the heart left inside; drag the bags of natron onto the body
 * and watch the forty days pass as it dries and shrinks; rub in the oils
 * and resin; wind the linen from head to feet, layer on layer, laying
 * amulets between the layers (the visitor's own, if they made one in
 * Design an Amulet); lower the mummy into its painted coffin and bring the
 * lid down. Then three quick questions, one at a time.
 *
 * The room has its own layout: the step and its one instruction across the
 * top, the workshop filling the middle, the tools and what the step has
 * just taught in a tray beneath, and Back and Next at the foot. Every drag
 * has a tap or keyboard way too (the quiet buttons in the tray, or tap a
 * thing and then where it goes). Each step teaches one short thing, shown
 * as soon as its work is done. It opens with the Egypt rooms' dark intro.
 * The facts are museum notes; their sources are in the Sources drawer.
 */

const SOURCES: SourceGroup[] = [
  ...STEPS.map((st) => ({
    title: st.title,
    items: [
      ...new Map(
        [...st.notes, ...(st.id === 'organs' ? [HEART_NOTE] : []), ...(st.id === 'wrap' ? WRAP_AMULETS.map((a) => a.note) : [])].flatMap((n) => n.sources).map((x) => [x.href, x]),
      ).values(),
    ],
  })),
  {
    title: 'Pictures',
    items: [
      { label: 'The workshop, the figure, the canopic jars and the coffin are drawn for the Mini Museum.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];

const ORDER = STEPS.map((s) => s.id);
const OILED = 1;
/** The picture's own box (MummyScene's viewBox), for laying buttons over it. */
const VIEW = { x: 100, y: 130, w: 640, h: 330 };
const box = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${((x - VIEW.x) / VIEW.w) * 100}%`,
  top: `${((y - VIEW.y) / VIEW.h) * 100}%`,
  width: `${(w / VIEW.w) * 100}%`,
  height: `${(h / VIEW.h) * 100}%`,
});
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

type Carry = { kind: 'organ'; id: string } | { kind: 'bag' } | { kind: 'amulet'; id: string };

export default function Mummification() {
  const reduced = usePrefersReducedMotion();
  const own = useSavedAmulet();
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);
  const [dusty, setDusty] = useState<number[]>(WASH_PATCHES.map((_, i) => i));
  const [hook, setHook] = useState(0);
  const [hookIn, setHookIn] = useState(false);
  const [brainOut, setBrainOut] = useState(false);
  const [met, setMet] = useState<string[]>([]);
  const [meeting, setMeeting] = useState<string | null>(null);
  const [organ, setOrgan] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [heartAnswer, setHeartAnswer] = useState<string | null>(null);
  const [packed, setPacked] = useState<boolean[]>(NATRON_SPOTS.map(() => false));
  const [days, setDays] = useState(0);
  const [oil, setOil] = useState(0);
  const [cloth, setCloth] = useState<{ x: number; y: number } | null>(null);
  const [layers, setLayers] = useState(0);
  const [wrapAt, setWrapAt] = useState(0);
  const [amulets, setAmulets] = useState<{ id: string; glyph: string; layer: number }[]>([]);
  const [mummy, setMummy] = useState(0);
  const [lid, setLid] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gesture = useRef<{ kind: Grab; from: { x: number; y: number }; last: { x: number; y: number }; base: number } | null>(null);
  const step = STEPS[index];
  const id: StepId = step.id;
  const after = (s: StepId) => index > ORDER.indexOf(s);

  // An address with a step's #id opens at that step; the old room's addresses (#why, #oils…) open where they now are.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const i = h === 'why' ? 0 : ORDER.indexOf(h as StepId);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setIndex(to);
    setHint('');
    setOrgan(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${STEPS[to].id}`);
    setStatus(`Step ${to + 1} of ${STEPS.length}: ${STEPS[to].title}.`);
  };
  // A new step: the focus to its heading (not on the first render).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [index]);

  /* ───── 1. Washing: rub the dust off ───── */
  const washed = (left: number[]) => {
    if (left.length === dusty.length) return;
    playEgypt('water');
    setDusty(left);
    setStatus(left.length ? `Washing: ${WASH_PATCHES.length - left.length} of ${WASH_PATCHES.length} clean.` : 'The body is washed clean.');
  };
  const wipe = (p: { x: number; y: number }) => washed(dusty.filter((i) => Math.hypot(WASH_PATCHES[i].x - p.x, (WASH_PATCHES[i].y - p.y) * 1.6) >= 36));

  /* ───── 2. The brain: the hook in, then out ───── */
  const hookTo = (depth: number) => {
    const d = Math.max(0, Math.min(1, depth));
    if (!hookIn) {
      setHook(d);
      if (d >= 1) {
        setHookIn(true);
        playEgypt('grind');
        setStatus('The hook has reached the brain. Now pull it back up, out through the nose.');
        return 'in';
      }
    } else {
      setHook(d);
      if (d <= 0.08) {
        setBrainOut(true);
        setHook(0);
        playEgypt('find');
        setStatus('The brain is drawn out through the nose. It was not kept.');
        return 'out';
      }
    }
    return null;
  };

  /* ───── 3. The four gods ───── */
  const meet = (god: string) => {
    setMeeting(god);
    if (!met.includes(god)) setMet([...met, god]);
    const j = JARS.find((x) => x.god === god)!;
    playEgypt('find');
    setStatus(`${j.god}, with a ${j.head}’s head, guards the ${j.organ}.`);
  };
  const allMet = met.length === JARS.length;

  /* ───── 4. The organs into their jars ───── */
  const toJar = (god: string, which = organ) => {
    if (!which) {
      setHint('First pick up an organ, then tap its jar.');
      return;
    }
    const jar = jarFor(which);
    if (jar.god === god) {
      const next = filled.includes(god) ? filled : [...filled, god];
      setFilled(next);
      playEgypt('find');
      setHint('');
      setOrgan(null);
      setStatus(`Yes: ${jar.head}-headed ${jar.god} guards the ${which}.${next.length === JARS.length ? ' All four jars are full.' : ''}`);
    } else {
      playEgypt('miss');
      const msg = `Not that jar. Look for the god with a ${jar.head}’s head: he guards the ${which}.`;
      setHint(msg);
      setStatus(msg);
    }
  };
  const allFilled = filled.length === JARS.length;
  const heartFound = heartAnswer === 'The heart';

  /* ───── 5. Natron, then the forty days ───── */
  const startDays = () => {
    if (timer.current) clearInterval(timer.current);
    if (reduced) {
      setDays(40);
      setStatus('Forty days have passed. The body is dry.');
      return;
    }
    let d = 0;
    timer.current = setInterval(() => {
      d += 1;
      setDays(d);
      if (d >= 40) {
        clearInterval(timer.current!);
        timer.current = null;
        setStatus('Forty days have passed. The body is dry.');
      }
    }, 90);
  };
  const pack = (i: number) => {
    if (packed[i]) return;
    const next = packed.map((p, k) => p || k === i);
    setPacked(next);
    playEgypt('grind');
    const n = next.filter(Boolean).length;
    if (n === NATRON_SPOTS.length) {
      setStatus('All the natron is packed. Now watch the forty days pass.');
      startDays();
    } else setStatus(`${n} of ${NATRON_SPOTS.length} bags of natron packed.`);
  };
  const bagsLeft = packed.filter((p) => !p).length;
  const dried = days >= 40;

  /* ───── 6. Oils and resin: rub ───── */
  const rubBy = (amount: number) => {
    setOil((o) => {
      const n = Math.min(OILED, o + amount);
      if (n >= OILED && o < OILED) setStatus('The body is coated in oils and resin.');
      return n;
    });
  };
  const oiled = oil >= OILED;

  /* ───── 7. Linen and amulets ───── */
  const needAmulet = layers >= 2 && amulets.length === 0;
  const wrapped = layers >= LAYERS;
  const finishLayer = () => {
    const n = Math.min(LAYERS, layers + 1);
    setLayers(n);
    setWrapAt(0);
    playEgypt('settle');
    setStatus(n >= LAYERS ? 'The last layer of linen is on.' : n === 2 ? `Layer 2 of ${LAYERS} of linen. Now lay an amulet on the body, between the layers.` : `Layer ${n} of ${LAYERS} of linen.`);
  };
  const choices = [
    ...(own ? [{ id: 'own', name: 'Your amulet', glyph: '', note: null }] : []),
    ...WRAP_AMULETS.map((a) => ({ ...a, note: a.note })),
  ];
  const tuck = (aid: string) => {
    const a = choices.find((x) => x.id === aid)!;
    if (amulets.some((x) => x.id === aid) || wrapped || amulets.length >= 4) return;
    setAmulets((list) => [...list, { id: aid, glyph: a.glyph, layer: layers }]);
    playEgypt('find');
    setStatus(`${a.name} is tucked into the wrappings.`);
  };
  const lastAmulet = WRAP_AMULETS.find((a) => a.id === amulets[amulets.length - 1]?.id);

  /* ───── 8. The coffin ───── */
  const lowered = mummy >= 1;
  const closed = lid >= 1;
  const layIn = () => {
    setMummy(1);
    playEgypt('settle');
    setStatus('The mummy is laid in its coffin. Now bring the lid down.');
  };
  const closeLid = () => {
    setLid(1);
    playEgypt('grind');
    setStatus('The lid is closed. The seventy days are over.');
  };
  const question = CHECK.findIndex((c, i) => answers[i] !== c.answer);
  const checked = question < 0;

  /* ───── Dragging things about the workshop ───── */
  const onGrab = (kind: Grab, e: PointerEvent<SVGElement>) => {
    const p = toSvg(svg.current, e.clientX, e.clientY);
    if (!p) return;
    e.preventDefault();
    e.stopPropagation();
    svg.current?.setPointerCapture?.(e.pointerId);
    const base = kind === 'hook' ? hook : kind === 'roll' ? wrapAt : kind === 'mummy' ? mummy : kind === 'lid' ? lid : 0;
    gesture.current = { kind, from: p, last: p, base };
    if (kind === 'wipe') wipe(p);
    if (kind === 'rub') setCloth(p);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g) return;
    const p = toSvg(svg.current, e.clientX, e.clientY);
    if (!p) return;
    const dy = p.y - g.from.y;
    if (g.kind === 'wipe') wipe(p);
    else if (g.kind === 'hook') {
      const done = hookTo(g.base + dy / 56);
      if (done === 'in') gesture.current = { ...g, from: p, base: 1 };
      if (done === 'out') gesture.current = null;
    } else if (g.kind === 'rub') {
      setCloth(p);
      rubBy(Math.hypot(p.x - g.last.x, p.y - g.last.y) / 1500);
    } else if (g.kind === 'roll') {
      const at = Math.max(0, Math.min(1, g.base + (p.x - g.from.x) / (WRAP_TO - WRAP_FROM)));
      if (at >= 1) {
        finishLayer();
        gesture.current = null;
        return;
      }
      setWrapAt(at);
    } else if (g.kind === 'mummy') setMummy(Math.max(0, Math.min(0.99, g.base + dy / MUMMY_DROP)));
    else if (g.kind === 'lid') setLid(Math.max(0, Math.min(0.99, g.base + dy / LID_DROP)));
    if (gesture.current) gesture.current.last = p;
  };
  const onEnd = () => {
    const g = gesture.current;
    gesture.current = null;
    setCloth(null);
    if (!g) return;
    if (g.kind === 'mummy') {
      if (mummy > 0.6) layIn();
      else setMummy(0);
    }
    if (g.kind === 'lid') {
      if (lid > 0.6) closeLid();
      else setLid(0);
    }
  };

  const { drag, carrying, start } = useDragDrop<Carry>((c, d) => {
    if (c.kind === 'organ' && d.target.startsWith('jar-')) toJar(d.target.slice(4), c.id);
    if (c.kind === 'bag' && d.target.startsWith('spot-')) pack(Number(d.target.slice(5)));
    if (c.kind === 'amulet' && d.target === 'body') tuck(c.id);
  });

  /* ───── What the workshop shows ───── */
  const scene: MummyState = {
    step: id,
    dusty: id === 'wash' ? dusty : [],
    hook,
    hookIn,
    brainOut: brainOut || after('brain'),
    open: id === 'organs',
    inBody: ORGANS.filter((o) => !filled.includes(jarFor(o).god)),
    filled: after('organs') ? JARS.map((j) => j.god) : filled,
    jars: id === 'organs',
    showHeart: id === 'organs' && allFilled,
    packed: id === 'natron' ? packed : NATRON_SPOTS.map(() => true),
    days: id === 'natron' ? days : after('natron') ? 40 : 0,
    oil: id === 'oils' ? oil : after('oils') ? OILED : 0,
    cloth,
    layers: id === 'wrap' ? layers : after('wrap') ? LAYERS : 0,
    wrapAt: id === 'wrap' ? wrapAt : 0,
    rolling: id === 'wrap' && !wrapped && !needAmulet,
    amulets,
    own,
    coffin: id === 'coffin',
    mummy: id === 'coffin' ? mummy : 0,
    lid: id === 'coffin' ? lid : 0,
    closed: id === 'coffin' && closed,
  };

  const sceneLabel =
    id === 'wash'
      ? `The body on the embalmers’ bed, ${dusty.length} dusty patches still to wash`
      : id === 'brain'
        ? brainOut
          ? 'The body on the embalmers’ bed; the brain has been drawn out through the nose and is gone'
          : hookIn
            ? 'A long bronze hook is up the nose, ready to draw the brain out'
            : 'A long bronze hook above the nose of the body on the embalmers’ bed'
        : id === 'organs'
          ? `The body with a cut in its left side, the organs inside it, and four canopic jars on the floor, ${filled.length} of them filled`
          : id === 'natron'
            ? dried
              ? 'The body, dried and shrunken after forty days in natron'
              : `The body on the embalmers’ bed, ${NATRON_SPOTS.length - bagsLeft} of ${NATRON_SPOTS.length} bags of natron packed around it${days ? `, ${days} days passed` : ''}`
            : id === 'oils'
              ? `The dried body, ${Math.round(oil * 100)} percent coated in oil and resin`
              : id === 'wrap'
                ? `The body wrapped in ${layers} of ${LAYERS} layers of linen${amulets.length ? `, with ${amulets.length} amulet${amulets.length > 1 ? 's' : ''} between the layers` : ''}`
                : closed
                  ? 'The painted coffin, closed: a gold face under a striped wig, a broad collar, a winged sun and a column of signs'
                  : lowered
                    ? 'The wrapped mummy lying in its open coffin, the painted lid above it'
                    : 'The wrapped mummy on the embalmers’ bed, its open coffin on the floor in front';

  /* ───── One instruction at a time ───── */
  const task =
    id === 'wash'
      ? dusty.length
        ? 'Rub the dust off the body with your finger or mouse.'
        : null
      : id === 'brain'
        ? brainOut
          ? null
          : hookIn
            ? 'Now pull the hook back up, to draw the brain out.'
            : 'Drag the bronze hook down, into the nose.'
        : id === 'gods'
          ? allMet
            ? null
            : 'Each jar has a god on its lid. Tap each jar to meet its god.'
          : id === 'organs'
            ? !allFilled
              ? 'Lift each organ out of the body into the jar of the god who guards it.'
              : heartFound
                ? null
                : 'All four jars are full. But look at the body: which organ is still inside?'
            : id === 'natron'
              ? bagsLeft
                ? 'Drag a bag of natron onto each circle on the body.'
                : !dried
                  ? 'Watch the forty days pass. See the body dry and shrink.'
                  : null
              : id === 'oils'
                ? !oiled
                  ? 'Rub oil and resin all over the body: press and move over it.'
                  : null
                : id === 'wrap'
                  ? wrapped
                    ? null
                    : needAmulet
                      ? 'Lay an amulet on the body, between the layers.'
                      : layers >= 2
                        ? 'Wind the last layers of linen over the amulets.'
                        : 'Drag the linen roll from the head to the feet. Each pass is one layer.'
                  : !lowered
                    ? 'Drag the mummy down into its coffin.'
                    : !closed
                      ? 'Now drag the lid down onto the coffin.'
                      : checked
                        ? null
                        : 'Three quick questions about what you did.';

  const doneLine =
    id === 'wash' && !dusty.length
      ? 'Washed clean.'
      : id === 'brain' && brainOut
        ? 'Gone: the brain was not kept.'
        : id === 'gods' && allMet
          ? 'You have met all four gods.'
          : id === 'organs' && heartFound
            ? 'Yes, the heart stays inside.'
            : id === 'natron' && dried
              ? 'Forty days: dry, and a little shrunken.'
              : id === 'oils' && oiled
                ? 'Oiled, and ready to wrap.'
                : id === 'wrap' && wrapped
                  ? 'Wrapped, with amulets inside.'
                  : id === 'coffin' && checked
                    ? 'The seventy days are over.'
                    : null;

  /* ───── What the step has just taught ───── */
  const learned =
    id === 'wash' && !dusty.length
      ? stepNotes('wash')
      : id === 'brain' && brainOut
        ? stepNotes('brain')
        : id === 'gods' && allMet
          ? [JARS_ANSWER]
          : id === 'organs' && heartFound
            ? [HEART_NOTE, stepNotes('organs')[0]]
            : id === 'natron' && dried
              ? stepNotes('natron')
              : id === 'oils' && oiled
                ? stepNotes('oils')
                : id === 'wrap' && (wrapped || lastAmulet)
                  ? [...(lastAmulet ? [lastAmulet.note] : []), ...(wrapped ? stepNotes('wrap') : [])]
                  : id === 'coffin' && closed
                    ? stepNotes('coffin')
                    : [];

  const stepDone = (i: number) => {
    const s = STEPS[i].id;
    return s === 'wash'
      ? !dusty.length
      : s === 'brain'
        ? brainOut
        : s === 'gods'
          ? allMet
          : s === 'organs'
            ? allFilled && heartFound
            : s === 'natron'
              ? dried
              : s === 'oils'
                ? oiled
                : s === 'wrap'
                  ? wrapped
                  : checked && closed;
  };

  const meetingJar = JARS.find((j) => j.god === meeting);

  return (
    <RoomShell className="eg-mummy" sources={SOURCES} fit>
      {intro && <DarkIntro title="Mummification" lines={MUMMY_INTRO} voice="mummification-intro" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · Seventy days" title="Mummification, Step by Step" />

      <section className={`egm-work egr-fill is-${id}`} aria-labelledby="egm-title" data-carrying={carrying ? '' : undefined}>
        <div className="egm-strip">
          <StepDots steps={STEPS} at={index} done={stepDone} onGo={go} label="The steps" />
          <div className="egm-strip-title">
            <h2 id="egm-title" ref={heading} tabIndex={-1}>
              {step.title}
            </h2>
            <div className="egm-timeline" aria-hidden="true">
              <span className="egm-timeline-bar">
                <span className="egm-timeline-span" style={{ left: `${step.span[0] * 100}%`, width: `${(step.span[1] - step.span[0]) * 100}%` }} />
              </span>
              <span className="egm-timeline-ends">
                <span>Day 1</span>
                <span className="egm-timeline-when">{step.when}</span>
                <span>Day 70</span>
              </span>
            </div>
          </div>
          {task ? <p className="egr-task">{task}</p> : doneLine && <p className="egm-done">{doneLine}</p>}
        </div>

        {/* ───── The workshop ───── */}
        <div className="egm-scene egr-sizer">
          {id === 'gods' ? (
            <div className="egm-pic egm-gods-pic">
              <svg className="egm-svg" viewBox="0 0 800 330" aria-hidden="true">
                <rect width="800" height="330" fill="url(#egm-gods-wall)" />
                <defs>
                  <linearGradient id="egm-gods-wall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4a311b" />
                    <stop offset="1" stopColor="#24170c" />
                  </linearGradient>
                </defs>
                <rect x="0" y="292" width="800" height="38" fill="#3a2614" />
                {JARS.map((j, i) => (
                  <g key={j.god} transform={`translate(${100 + i * 200} 300) scale(1.75)`}>
                    <Jar id={`egm-god-${i}`} head={j.head as HeadKind} organ={j.organ} open={meeting === j.god} full={met.includes(j.god) && meeting !== j.god} />
                  </g>
                ))}
              </svg>
              {JARS.map((j, i) => (
                <button
                  key={j.god}
                  type="button"
                  className={`egm-drop egm-meet ${met.includes(j.god) ? 'is-full' : ''}`}
                  style={{ left: `${((100 + i * 200 - 70) / 800) * 100}%`, width: `${(140 / 800) * 100}%`, top: '18%', height: '76%' }}
                  aria-pressed={meeting === j.god}
                  onClick={() => meet(j.god)}
                  aria-label={`Meet the god on jar ${i + 1}`}
                >
                  <span className="egm-drop-name">{met.includes(j.god) ? j.god : '?'}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="egm-pic">
              <div role="img" aria-label={sceneLabel} className="egm-table">
                <MummyScene ref={svg} s={scene} onGrab={onGrab} onMove={onMove} onEnd={onEnd} />
              </div>
              {/* Places to drop things, laid over the picture */}
              {id === 'organs' &&
                JARS.map((j, i) => {
                  const full = filled.includes(j.god);
                  return (
                    <button
                      key={j.god}
                      type="button"
                      data-drop={`jar-${j.god}`}
                      className={`egm-drop ${full ? 'is-full' : ''} ${organ && !full ? 'is-ready' : ''}`}
                      style={box(JAR_X[i] - 32, JAR_BASE - 128 * JAR_SCALE, 64, 128 * JAR_SCALE)}
                      onClick={() => toJar(j.god)}
                      aria-label={`${j.god}, the ${j.head}-headed jar${full ? ' (full)' : ''}`}
                    >
                      <span className="egm-drop-name" aria-hidden="true">
                        {j.god}
                      </span>
                    </button>
                  );
                })}
              {id === 'natron' &&
                NATRON_SPOTS.map((p, i) =>
                  packed[i] ? null : (
                    <button key={i} type="button" data-drop={`spot-${i}`} className="egm-drop egm-spot-drop" style={box(p.x - 20, p.y - 20, 40, 40)} onClick={() => pack(i)} aria-label={`Pack a bag of natron here (${i + 1} of ${NATRON_SPOTS.length})`} />
                  ),
                )}
              {id === 'wrap' && needAmulet && <div data-drop="body" className="egm-body-drop" style={box(180, 222, 460, 72)} aria-hidden="true" />}
            </div>
          )}
          {id === 'natron' && bagsLeft === 0 && (
            <p className="egm-days" aria-hidden="true">
              <span>{days}</span> {days === 1 ? 'day' : 'days'} in natron
            </p>
          )}
        </div>

        {/* ───── The tray: the tools, and what the step has taught ───── */}
        <div className="egm-tray">
          <div className="egm-tools">
            {id === 'wash' && dusty.length > 0 && (
              <button type="button" className="egr-button egr-button-quiet" onClick={() => washed(dusty.slice(1))}>
                Or tap: pour water ({WASH_PATCHES.length - dusty.length}/{WASH_PATCHES.length})
              </button>
            )}
            {id === 'brain' && !brainOut && (
              <button type="button" className="egr-button egr-button-quiet" onClick={() => hookTo(hookIn ? 0 : 1)}>
                {hookIn ? 'Or tap: pull the brain out' : 'Or tap: push the hook in'}
              </button>
            )}
            {id === 'gods' && meetingJar && (
              <div className="egm-meeting" key={meetingJar.god}>
                <svg viewBox="-40 -80 80 84" className="egm-meeting-head" aria-hidden="true">
                  <g transform="scale(1.3) translate(0 -2)">
                    <JarHead kind={meetingJar.head as HeadKind} />
                  </g>
                </svg>
                <p>
                  <strong>{meetingJar.god}</strong>, with a {meetingJar.head}’s head, guards the <strong>{meetingJar.organ}</strong>.
                </p>
              </div>
            )}
            {id === 'gods' && !meetingJar && <p className="egm-small">{met.length} of 4 gods met.</p>}
            {id === 'organs' && !allFilled && (
              <>
                <div className="egm-organs" role="group" aria-label="The organs">
                  {ORGANS.map((o) => {
                    const done = filled.includes(jarFor(o).god);
                    return done ? null : (
                      <button key={o} type="button" className="egm-thing egk-carry" aria-pressed={organ === o} onClick={() => setOrgan(organ === o ? null : o)} onPointerDown={(e) => start({ kind: 'organ', id: o }, e)}>
                        <svg viewBox="-26 -22 52 44" aria-hidden="true">
                          <Organ id={o} />
                        </svg>
                        {cap(o)}
                      </button>
                    );
                  })}
                </div>
                <p className="egm-hint">{hint}</p>
              </>
            )}
            {id === 'organs' && allFilled && !heartFound && (
              <fieldset className="egr-choice egm-heart-q">
                <legend>Which organ is still inside?</legend>
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
                          setStatus('Yes: the heart stays inside the body.');
                        }
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {heartAnswer && <p className="egm-hint">Look again: the small red shape on the chest.</p>}
              </fieldset>
            )}
            {id === 'natron' && bagsLeft > 0 && (
              <div className="egm-organs" role="group" aria-label="Bags of natron">
                <button type="button" className="egm-thing egm-bagpile egk-carry" onPointerDown={(e) => start({ kind: 'bag' }, e)} onClick={() => pack(packed.findIndex((p) => !p))}>
                  <svg viewBox="-30 -20 60 40" aria-hidden="true">
                    <rect x="-24" y="-15" width="48" height="30" rx="11" fill="#f2f0ea" stroke="#bdb6a4" strokeWidth="2" />
                    <path d="M-6 -15 q6 -6 12 0" fill="none" stroke="#a89a7a" strokeWidth="2" />
                  </svg>
                  Bags of natron · {bagsLeft} left
                </button>
              </div>
            )}
            {id === 'oils' && !oiled && (
              <div className="egm-meter-row">
                <span className="egm-meter" aria-hidden="true">
                  <span style={{ width: `${Math.round(oil * 100)}%` }} />
                </span>
                <button type="button" className="egr-button egr-button-quiet" onClick={() => rubBy(0.34)}>
                  Or tap: rub in oil and resin
                </button>
              </div>
            )}
            {id === 'wrap' && !wrapped && !needAmulet && (
              <div className="egm-meter-row">
                <span className="egm-layers" aria-hidden="true">
                  {Array.from({ length: LAYERS }, (_, i) => (
                    <span key={i} data-on={i < layers || undefined} />
                  ))}
                </span>
                <button type="button" className="egr-button egr-button-quiet" onClick={finishLayer}>
                  Or tap: wrap a layer of linen ({layers}/{LAYERS})
                </button>
              </div>
            )}
            {id === 'wrap' && needAmulet && (
              <div className="egm-organs" role="group" aria-label="Amulets to tuck in">
                {choices.map((a) => (
                  <button key={a.id} type="button" className="egm-thing egk-carry" onClick={() => tuck(a.id)} onPointerDown={(e) => start({ kind: 'amulet', id: a.id }, e)}>
                    {a.id === 'own' && own ? (
                      <AmuletArt className="egm-own-amulet" idPrefix="egm-tray-own" shape={own.shape} material={own.material} symbols={own.symbols} nameGlyphs={own.nameGlyphs} label={`Your amulet: ${describeAmulet(own)}`} />
                    ) : (
                      <Glyphs text={a.glyph} className="egm-amulet-glyph" />
                    )}
                    {a.name}
                  </button>
                ))}
                {!own && (
                  <p className="egm-small">
                    Want to tuck in your own? <Link href="/exhibitions/egypt/amulet">Design an amulet</Link>, then come back.
                  </p>
                )}
              </div>
            )}
            {id === 'coffin' && !closed && (
              <button type="button" className="egr-button egr-button-quiet" onClick={lowered ? closeLid : layIn}>
                {lowered ? 'Or tap: close the lid' : 'Or tap: lay the mummy in its coffin'}
              </button>
            )}
            {id === 'coffin' && closed && (
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
                      <Link className="egr-button egr-button-primary" href="/exhibitions/egypt/weighing-of-the-heart">
                        Into the Hall of Judgement <span aria-hidden="true">→</span>
                      </Link>
                      <Link className="egr-button" href="/exhibitions/egypt/my-tomb">
                        Build your own tomb
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="egm-learned" aria-live="polite">
            {learned.length > 0 && <p className="egm-learned-kicker">Did you know?</p>}
            {learned.map((n) => (
              <FactNote key={n.text} fact={n} className="egr-fact" />
            ))}
          </div>
        </div>

        <div className="egr-step-nav egm-nav">
          <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
          <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={index === STEPS.length - 1}>
            Next step <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <DragGhost at={drag}>
        {drag?.item.kind === 'organ' ? (
          <svg className="egm-ghost" viewBox="-26 -22 52 44" width="72" height="60" aria-hidden="true">
            <Organ id={drag.item.id} />
          </svg>
        ) : drag?.item.kind === 'bag' ? (
          <svg className="egm-ghost" viewBox="-30 -20 60 40" width="72" height="48" aria-hidden="true">
            <rect x="-24" y="-15" width="48" height="30" rx="11" fill="#f2f0ea" stroke="#bdb6a4" strokeWidth="2" />
          </svg>
        ) : drag?.item.kind === 'amulet' ? (
          <span className="egm-ghost egm-ghost-amulet">{drag.item.id === 'own' ? '✦' : <Glyphs text={WRAP_AMULETS.find((a) => drag.item.kind === 'amulet' && a.id === drag.item.id)?.glyph ?? ''} />}</span>
        ) : null}
      </DragGhost>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
