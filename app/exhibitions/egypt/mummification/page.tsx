'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { useClientSeed } from '@/components/games/useClientSeed';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell, { RoomHeader, StepDots } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import { useSavedAmulet } from '../amulet/savedAmulet';
import type { BodyLook } from './MummyScene';
import { NatronStep, OilsStep, WashStep, WrapStep } from './BodySteps';
import BrainStep from './BrainStep';
import { GodsStep, OrgansStep } from './JarSteps';
import CoffinStep from './CoffinStep';
import ToolChoice from './ToolChoice';
import type { StepKit } from './kit';
import { ZONES, needsChoice } from './mummyGame';
import { HEART_NOTE, MUMMY_INTRO, STEPS, WRAP_AMULETS, type StepId } from './steps';
import './mummy.css';

/*
 * Mummification, step by step: eight steps across the seventy days, in the
 * embalmers' workshop.
 *
 * The point: after it, a child can put the seventy days in order and say
 * why each step comes where it does (the brain and organs out first, then
 * forty days of natron to dry the body inside and out, then oils, then
 * linen with amulets between the layers, then the coffin), and which god
 * guards which organ: things the poster names but a reader does not have
 * to work out.
 *
 * So the visitor works it out. Most steps open with "What comes next?":
 * the embalmers' tools are on a shelf and the visitor picks the one the
 * body needs now (a wrong pick says why not yet). Every step is then done
 * by hand, and each gesture means something, with mistakes possible and
 * met with a hint, never a progress bar filled by tapping:
 *
 *   1. Washing      pour water from the jar along the body.
 *   2. The brain    carry the hook to the way in (only the nose works),
 *                   push it up to the brain, draw it out, and decide what
 *                   becomes of the brain (it was not kept).
 *   3. Four gods    lift each jar's lid to meet its god: who guards what.
 *   4. The organs   the jars are mixed up and unnamed; carry each organ
 *                   out of the opened body to its god's jar. The heart is
 *                   caught if offered: it stays inside.
 *   5. Natron       cover every part of the body, inside and out, then
 *                   leave it forty days (too soon, and it is still damp);
 *                   the body dries and shrinks.
 *   6. Oils         rub oil and resin into every part.
 *   7. Linen        take the roll round and round the body, two layers,
 *                   with amulets (the visitor's own, if they made one)
 *                   tucked between.
 *   8. The coffin   carry the mummy into its upright coffin and the lid
 *                   onto it; three quick questions; then the mummy goes
 *                   into the visitor's own burial tomb.
 *
 * Next waits until a step is done, and the step dots go back, never ahead
 * of where the visitor has reached (a teacher can still open any step by
 * its #address). The room's layout: the step and its timeline across the
 * top with its one instruction, the workshop filling the middle, the tools
 * and what the step has just taught ("Did you know?") in a tray beneath,
 * Back and Next at the foot. It opens with the Egypt rooms' dark intro.
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
const OILED = ZONES.map(() => 1);

/** The body as each step finds it: what the steps before it did. */
function baseLook(id: StepId): BodyLook {
  switch (id) {
    case 'natron':
      return { cut: true };
    case 'oils':
      return { cut: true, dry: 1 };
    case 'wrap':
      return { cut: true, dry: 1, oil: OILED };
    default:
      return {};
  }
}

export default function Mummification() {
  const reduced = usePrefersReducedMotion();
  const own = useSavedAmulet();
  const seed = useClientSeed();
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(0);
  const [done, setDone] = useState<Partial<Record<StepId, true>>>({});
  const [chosen, setChosen] = useState<Partial<Record<StepId, true>>>({});
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const step = STEPS[index];
  const id = step.id;
  const choosing = needsChoice(id) && !chosen[id] && !done[id];

  // An address with a step's #id opens at that step (a teacher's way in); the old room's #why opens at the start.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const i = h === 'why' ? 0 : ORDER.indexOf(h as StepId);
      if (i >= 0) {
        setIndex(i);
        setReached((r) => Math.max(r, i));
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setIndex(to);
    setReached((r) => Math.max(r, to));
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${STEPS[to].id}`);
    setStatus(`Step ${to + 1} of ${STEPS.length}.`);
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

  const kit: StepKit = {
    done: !!done[id],
    finish: () => setDone((d) => ({ ...d, [id]: true })),
    say: setStatus,
    reduced,
    seed,
    own,
  };
  const base = baseLook(id);
  const views: Record<StepId, ReactNode> = {
    wash: <WashStep kit={kit} base={base} />,
    brain: <BrainStep kit={kit} />,
    gods: <GodsStep kit={kit} />,
    organs: <OrgansStep kit={kit} />,
    natron: <NatronStep kit={kit} base={base} />,
    oils: <OilsStep kit={kit} base={base} />,
    wrap: <WrapStep kit={kit} base={base} />,
    coffin: <CoffinStep kit={kit} />,
  };
  // The steps the visitor has not reached keep their names hidden: the order is theirs to work out.
  const dots = STEPS.map((s, i) => ({ id: s.id, title: i > reached || (i === index && choosing) ? 'still to come' : s.title }));

  return (
    <RoomShell className="eg-mummy" sources={SOURCES} fit>
      {intro && <DarkIntro title="Mummification" lines={MUMMY_INTRO} voice="mummification-intro" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · Seventy days" title="Mummification, Step by Step" />

      <section className={`egm-work egr-fill is-${id}`} aria-labelledby="egm-title">
        <div className="egm-strip">
          <StepDots steps={dots} at={index} done={(i) => !!done[STEPS[i].id]} onGo={(i) => i <= reached && go(i)} label="The steps" />
          <div className="egm-strip-title">
            <h2 id="egm-title" ref={heading} tabIndex={-1}>
              {choosing ? 'What comes next?' : step.title}
            </h2>
            <div className="egm-timeline" aria-hidden="true">
              <span className="egm-timeline-bar">
                <span className="egm-timeline-span" style={{ left: `${step.span[0] * 100}%`, width: `${(step.span[1] - step.span[0]) * 100}%` }} />
              </span>
              <span className="egm-timeline-ends">
                <span>Day 1</span>
                <span className="egm-timeline-when">{choosing ? '?' : step.when}</span>
                <span>Day 70</span>
              </span>
            </div>
          </div>
        </div>

        {choosing ? <ToolChoice key={`choose-${id}`} step={id} kit={kit} base={base} onChosen={() => setChosen((c) => ({ ...c, [id]: true }))} /> : <StepView key={id}>{views[id]}</StepView>}

        <div className="egr-step-nav egm-nav">
          <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
          {!done[id] && index < STEPS.length - 1 && (
            <span id="egm-next-why" className="egm-small egm-next-why">
              Finish this step to go on.
            </span>
          )}
          {index < STEPS.length - 1 && (
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={!done[id]} aria-describedby={done[id] ? undefined : 'egm-next-why'}>
              Next step <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}

/** One step's parts (instruction, picture, tray), set straight into the room's grid; keyed by step, so each step starts fresh. */
function StepView({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
