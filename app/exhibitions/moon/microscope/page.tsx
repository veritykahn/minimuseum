'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import FactNote, { type ApprovedFact } from '@/components/exhibition/FactNote';
import SourcesDrawer, { type SourceEntry, type SourceGroup } from '@/components/exhibition/SourcesDrawer';
import RoomShell from '../RoomShell';
import { MICROSCOPE_NOTES, REGOLITH } from '../moon';
import Eyepiece, { type EyepieceHandle, type StageView, type WipeReport } from './Eyepiece';
import Knob from './Knob';
import { EARTH_SLIDES, MOON_SLIDES, SLIDES, isMoon, type EarthSample, type Slide } from './slides';
import { blurFor, FOCUS_START, FOCUS_STEP } from './focus';
import { atEdge, CENTRE, clampPan, EYEPIECE, nudge, OBJECTIVES, totalPower, type Pan } from './stage';
import { PRACTICE } from './practice';
import './microscope.css';

/*
 * Under the Microscope: a real microscope's routine, one step at a time.
 *
 *   1. Wipe the slide. A fresh slide comes from the box a little dirty
 *      (dust, smudges, a fingerprint): wipe it clean with the cloth.
 *   2. Place a sample. Choose a jar from the tray, Moon or Earth; its sample
 *      is tipped onto the clean slide.
 *   3. Focus. The view starts blurred: turn the focus knob until it is sharp.
 *   4. Magnify. Turn the nosepiece to a stronger objective lens (4×, 10×,
 *      40×, under a 10× eyepiece). Each switch leaves the view a little
 *      blurry, to be refocused with a small turn.
 *   5. Explore. Move the slide on the stage (drag it, the arrow keys, or the
 *      stage buttons) to look around; compare it with a sample from the
 *      other world, side by side.
 *
 * Skip a step and a friendly line says what to do first. Wiping a sample
 * off a slide is the poster's difference, felt: Moon dust clings to the
 * cloth; Earth's grains brush aside.
 *
 * Every claim on screen is poster 1's, from moon.ts, or a note with its
 * source: each photograph's caption from its own record (slides.ts), what
 * Moon dust is made of and the meteorite in the case (moon.ts,
 * MICROSCOPE_NOTES), and the microscope tips (practice.ts). The chosen
 * sample's name and caption are set in the description panel, at reading
 * size; every source and photograph credit (title, author and licence, each
 * linked) is in the room's Sources drawer, by step.
 */

const STEPS = [
  { key: 'wipe', label: 'Wipe the slide' },
  { key: 'place', label: 'Place a sample' },
  { key: 'focus', label: 'Focus' },
  { key: 'magnify', label: 'Magnify' },
  { key: 'explore', label: 'Explore' },
] as const;
type StepKey = (typeof STEPS)[number]['key'];

const cite = (fact: ApprovedFact, note: string): SourceEntry[] => fact.sources.map((s) => ({ ...s, note }));

/** The Sources drawer, step by step: the tips, each photograph's record and credit, and the notes. */
const MICROSCOPE_SOURCES: SourceGroup[] = [
  { title: 'Wipe the slide', items: cite(PRACTICE.wipe, 'Wiping a slide clean') },
  {
    title: 'Place a sample: the photographs',
    items: [...MOON_SLIDES, ...EARTH_SLIDES].flatMap((s): SourceEntry[] => [
      ...cite(s.caption, s.name),
      { note: `${s.name}, photograph`, label: `${s.credit.title}, ${s.credit.author}`, href: s.credit.href, licence: s.credit.licence, licenceHref: s.credit.licenceHref },
    ]),
  },
  { title: 'Focus', items: cite(PRACTICE.lowFirst, 'Focusing with the lowest-power lens first') },
  { title: 'Magnify', items: [...cite(PRACTICE.total, 'Total magnification'), ...cite(PRACTICE.parfocal, 'Lenses that stay nearly in focus')] },
  { title: 'Explore', items: [...cite(PRACTICE.field, 'The field of view'), ...cite(MICROSCOPE_NOTES.dust, 'What Moon dust is made of')] },
  { title: 'In the display case', items: cite(MICROSCOPE_NOTES.adrar, 'The lunar meteorite Adrar 013') },
];

const earthWord = (slide: Slide) => {
  const key = slide.id.replace('earth-', '') as EarthSample;
  return key === 'life' ? 'living things' : key;
};

/** Poster 1's sentence on Earth's soil, with the word for the sample on the stage marked. */
function Unlike({ slide }: { slide: Slide }) {
  const word = earthWord(slide);
  const at = REGOLITH.unlike.indexOf(word);
  return (
    <>
      {REGOLITH.unlike.slice(0, at)}
      <mark>{word}</mark>
      {REGOLITH.unlike.slice(at + word.length)}
    </>
  );
}

/** The tray of sample jars: choose one, and its sample goes on the slide. */
function Tray({ only, onChoose, onClose }: { only: 'moon' | 'earth' | null; onChoose: (s: Slide) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector<HTMLButtonElement>('.mo-ms-jar')?.focus();
  }, []);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep the keyboard in the tray while it is open.
    const all = [...(box.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const first = all[0];
    const last = all[all.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };
  const shelf = (title: string, note: string, slides: Slide[]) => (
    <div className="mo-ms-shelf">
      <h3 className="mo-ms-shelf-title">
        {title} <span className="mo-ms-shelf-note">{note}</span>
      </h3>
      <ul className="mo-ms-jars">
        {slides.map((s) => (
          <li key={s.id}>
            <button type="button" className="mo-ms-jar" data-world={isMoon(s) ? 'moon' : 'earth'} onClick={() => onChoose(s)}>
              <span className="mo-ms-jar-glass" aria-hidden="true">
                <span className="mo-ms-jar-lid" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" className="mo-ms-jar-sample" />
              </span>
              <span className="mo-ms-jar-label">{s.name}</span>
              {!isMoon(s) && <span className="mo-ms-jar-word">shaped by {earthWord(s)}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="mo-ms-tray-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} className="mo-ms-tray" role="dialog" aria-modal="true" aria-labelledby="mo-ms-tray-title" onKeyDown={onKeyDown}>
        <h2 id="mo-ms-tray-title" className="mo-ms-tray-title">
          {only ? 'Choose a sample to compare' : 'Choose a sample'}
        </h2>
        <p className="mo-ms-tray-lede">Pick a jar. Its sample goes on the slide.</p>
        {only !== 'earth' && shelf('Moon dust', 'brought back from the Moon', MOON_SLIDES)}
        {only !== 'moon' && shelf('Earth’s soil', 'sand from three places', EARTH_SLIDES)}
        <button type="button" className="mo-ms-button mo-ms-button-quiet mo-ms-tray-close" onClick={onClose}>
          Put the tray away
        </button>
      </div>
    </div>
  );
}

/** One sample's description: its name and what its photograph shows (its source and credit are in the Sources drawer). */
function About({ slide, heading: Heading }: { slide: Slide; heading: 'h2' | 'h3' }) {
  return (
    <div className="mo-ms-about">
      <Heading className={Heading === 'h2' ? 'mo-ms-heading' : 'mo-ms-subheading'} id={Heading === 'h2' ? 'mo-ms-heading' : undefined}>
        {slide.name}
      </Heading>
      <FactNote fact={slide.caption} className="mo-ms-caption" />
    </div>
  );
}

export default function MoonMicroscope() {
  const reduced = usePrefersReducedMotion();
  const eyepiece = useRef<EyepieceHandle>(null);
  const [stage, setStage] = useState<StageView>({ left: { sample: null, smudged: true }, right: null });
  const [busy, setBusy] = useState(false);
  const [objective, setObjective] = useState(0);
  const [focus, setFocus] = useState(FOCUS_START);
  const [pan, setPan] = useState<Pan>(CENTRE);
  const [toolChoice, setToolChoice] = useState<'auto' | 'cloth' | 'move'>('auto');
  const [status, setStatus] = useState('');
  const [clothDust, setClothDust] = useState(0);
  const [wipedMoon, setWipedMoon] = useState(false);
  /** Has this sample been brought into focus yet, and looked at with a stronger lens? */
  const [sharpSeen, setSharpSeen] = useState(false);
  const [magnified, setMagnified] = useState(false);
  const [tray, setTray] = useState<null | 'place' | 'compare'>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const left = stage.left.sample ? SLIDES[stage.left.sample] : null;
  const right = stage.right?.sample ? SLIDES[stage.right.sample] : null;
  // Bare glass shows its smudges plainly: only a sample has to be brought into focus.
  const blur = left ? blurFor(focus, objective) : 0;
  const sharp = blur === 0;
  const tool = toolChoice !== 'auto' ? toolChoice : left ? 'move' : 'cloth';

  const step: StepKey =
    stage.left.smudged ? 'wipe'
    : !left ? 'place'
    : !sharpSeen ? 'focus'
    : !magnified ? 'magnify'
    : 'explore';
  const stepAt = STEPS.findIndex((s) => s.key === step);

  const onChange = useCallback((view: StageView, moving: boolean) => {
    setStage(view);
    setBusy(moving);
  }, []);

  const onWiped = useCallback((r: WipeReport) => {
    if (r.already) {
      setStatus('The slide is already clean. Press Place sample to choose a sample.');
      return;
    }
    if (r.moon > 0) {
      setClothDust(r.moon);
      setWipedMoon(true);
    }
    const done = r.clean ? ' Now it’s clean.' : '';
    setStatus(
      r.moon > 0 && r.earth > 0 ? `The Moon dust clings to the cloth. The Earth grains brush aside.${done}`
      : r.moon > 0 ? `The Moon dust clings to the cloth.${done}`
      : r.earth > 0 ? `The grains brush aside.${done}`
      : r.smudge ? (r.clean ? 'The smudges are gone. The slide is clean.' : 'The smudges are coming off. Keep wiping.')
      : 'The cloth missed. Try again.',
    );
    if (r.clean) setToolChoice('auto');
  }, []);

  const closeTray = () => {
    setTray(null);
    requestAnimationFrame(() => opener.current?.focus());
  };

  const wipe = () => eyepiece.current?.sweep();

  /** Open the jar tray, if the slide is ready for a sample. */
  const openPlace = () => {
    if (stage.left.smudged) {
      setStatus('The slide’s smudged. Wipe it first!');
      return;
    }
    if (left) {
      setStatus('There’s a sample on this slide already. Wipe it off, or take a fresh slide.');
      return;
    }
    setTray('place');
  };
  // Pressed while the cloth is still wiping: the tray comes out as soon as it stops, so one press is enough.
  const [trayWaiting, setTrayWaiting] = useState(false);
  const placeSample = (e: { currentTarget: HTMLButtonElement }) => {
    opener.current = e.currentTarget;
    if (busy) {
      setTrayWaiting(true);
      return;
    }
    openPlace();
  };
  useEffect(() => {
    if (busy || !trayWaiting) return;
    setTrayWaiting(false);
    openPlace();
    // Only once the stage stops moving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, trayWaiting]);

  const fresh = () => {
    eyepiece.current?.fresh();
    setClothDust(0);
    setWipedMoon(false);
    setToolChoice('auto');
    setStatus('A fresh slide from the box. Look closely: it’s smudged.');
  };

  const choose = (slide: Slide) => {
    const mode = tray;
    setTray(null);
    requestAnimationFrame(() => opener.current?.focus());
    if (mode === 'compare') {
      eyepiece.current?.compare(slide);
      setStatus(`The ${slide.name} goes on a second slide, beside the first. Drag the line between them.`);
      return;
    }
    eyepiece.current?.endCompare();
    const r = eyepiece.current?.place(slide);
    if (r === 'smudged') setStatus('The slide’s smudged. Wipe it first!');
    else if (r === 'occupied') setStatus('There’s a sample on this slide already. Wipe it off, or take a fresh slide.');
    else if (r === 'ok') {
      // A new sample: back to the start of its steps, with the lowest-power lens, out of focus, the slide in the middle.
      setSharpSeen(false);
      setMagnified(false);
      setObjective(0);
      setFocus(FOCUS_START);
      setPan(CENTRE);
      setToolChoice('auto');
      setStatus(`The ${slide.name} is on the slide.`);
    }
  };

  const compare = (e: { currentTarget: HTMLButtonElement }) => {
    if (busy) return;
    opener.current = e.currentTarget;
    setTray('compare');
  };

  const turnFocus = (v: number) => {
    const to = Math.max(0, Math.min(100, v));
    setFocus(to);
    if (!left) {
      setStatus('Nothing to focus on yet. Place a sample first.');
      return;
    }
    if (blurFor(to, objective) === 0 && !sharp) {
      setStatus(
        !sharpSeen ? 'Sharp! Well focused.'
        : objective > 0 ? `Sharp at ${totalPower(objective)}×.`
        : 'Sharp again.',
      );
      setSharpSeen(true);
    }
  };

  const chooseObjective = (i: number) => {
    if (i === objective) return;
    setObjective(i);
    setPan((p) => clampPan(p, i));
    const total = `${totalPower(i)}×`;
    if (!left) {
      setStatus(`The ${OBJECTIVES[i].lens}× lens clicks into place. Place a sample first, then focus.`);
      return;
    }
    if (!sharpSeen && i > 0) {
      setStatus(`${total}. Remember to focus with the 4× lens first, then turn to a stronger one.`);
      return;
    }
    if (i > 0) setMagnified(true);
    setStatus(`Click! The ${OBJECTIVES[i].lens}× lens: ${total} in all.`);
  };

  const onPan = useCallback((p: Pan) => setPan(clampPan(p, objective)), [objective]);
  const move = (dx: number, dy: number) => {
    if (!left) setStatus('There’s nothing on the slide to look at yet.');
    setPan((p) => nudge(p, dx, dy, objective));
  };
  const edges = atEdge(pan, objective);

  const glassLabel = 'A clean glass slide, lit from below, with nothing on it';
  const smudgeLabel = 'A fresh glass slide, lit from below, smudged with dust and a fingerprint';
  const slotLabel = (s: Slide | null, smudged: boolean) => (s ? s.alt : smudged ? smudgeLabel : glassLabel);
  const shownLabel =
    stage.right ? `Side by side under the microscope. Left: ${slotLabel(left, stage.left.smudged)}. Right: ${slotLabel(right, stage.right.smudged)}`
    : slotLabel(left, stage.left.smudged);

  const prompt: Record<StepKey, string> = {
    wipe: 'This fresh slide is smudged. Wipe it clean: drag the cloth across it, or press Wipe.',
    place: 'The slide is clean. Press Place sample and choose a jar.',
    focus: 'Turn the focus knob until the sample is sharp.',
    magnify: 'Turn the nosepiece to a stronger lens: 10× or 40×.',
    explore: sharp ? 'Move the slide to look around. Compare it with a sample from the other world.' : 'A little blurry: turn the focus knob a touch.',
  };
  const tip =
    step === 'wipe' || step === 'place' ? PRACTICE.wipe
    : step === 'focus' ? PRACTICE.lowFirst
    : step === 'magnify' ? PRACTICE.total
    : !sharp ? PRACTICE.parfocal
    : PRACTICE.field;

  const moonOnStage = (left && isMoon(left)) || (right && isMoon(right));

  return (
    <SourcesDrawer groups={MICROSCOPE_SOURCES}>
      <RoomShell className="mo-microscope">
        <div className="mo-ms-stage" data-step={step}>
          <div className="mo-ms-sky" aria-hidden="true">
            <span className="mo-ms-glow" />
          </div>

          <header className="mo-ms-bar">
            <h1 className="mo-ms-title">
              Under the Microscope
              <span className="mo-ms-title-sub">Moon dust · Earth&rsquo;s soil</span>
            </h1>
            <ol className="mo-ms-steps" aria-label="Steps">
              {STEPS.map((s, i) => (
                <li
                  key={s.key}
                  className={i < stepAt ? 'mo-ms-step is-done' : i === stepAt ? 'mo-ms-step is-now' : 'mo-ms-step'}
                  aria-current={i === stepAt ? 'step' : undefined}
                >
                  <span className="mo-ms-step-num" aria-hidden="true">{i < stepAt ? '✓' : i + 1}</span>
                  <span className="mo-ms-step-label">{s.label}</span>
                  {i < stepAt && <span className="mo-ms-sr"> (done)</span>}
                </li>
              ))}
            </ol>
          </header>

          <div className="mo-ms-body">
            <div className="mo-ms-scope">
              <Eyepiece
                ref={eyepiece}
                objective={objective}
                pan={pan}
                blur={blur}
                reduced={reduced}
                label={shownLabel}
                tool={tool}
                onWiped={onWiped}
                onChange={onChange}
                onPan={onPan}
                onMove={move}
              />
              <p className="mo-ms-prompt">{prompt[step]}</p>
              <p className="mo-ms-status" role="status">{status}</p>
              <div className="mo-ms-actions">
                <span className="mo-ms-swatch" aria-hidden="true" style={{ ['--dust' as string]: String(clothDust) }} />
                <button type="button" className={step === 'wipe' ? 'mo-ms-button mo-ms-button-next' : 'mo-ms-button'} aria-disabled={busy || undefined} onClick={wipe}>
                  Wipe
                </button>
                <button
                  type="button"
                  className={step === 'place' ? 'mo-ms-button mo-ms-button-next' : 'mo-ms-button'}
                  aria-haspopup="dialog"
                  onClick={placeSample}
                >
                  Place sample
                </button>
                <button type="button" className="mo-ms-button mo-ms-button-quiet" onClick={fresh}>
                  Fresh slide
                </button>
              </div>
            </div>

            <div className="mo-ms-tools">
              <div className="mo-ms-tool mo-ms-focus" role="group" aria-labelledby="mo-ms-focus-label">
                <h2 className="mo-ms-tool-label" id="mo-ms-focus-label">Focus</h2>
                <div className="mo-ms-focus-row">
                  <button type="button" className="mo-ms-round" aria-label="Turn the focus knob down" onClick={() => turnFocus(focus - FOCUS_STEP)}>
                    −
                  </button>
                  <Knob value={focus} onChange={turnFocus} step={FOCUS_STEP} label="Focus knob" valueText={!left ? 'Nothing to focus on' : sharp ? 'Sharp' : 'Blurry'} />
                  <button type="button" className="mo-ms-round" aria-label="Turn the focus knob up" onClick={() => turnFocus(focus + FOCUS_STEP)}>
                    +
                  </button>
                </div>
                <p className={step === 'focus' || (left && !sharp) ? 'mo-ms-readout is-next' : 'mo-ms-readout'} aria-hidden="true">
                  {!left ? '—' : sharp ? 'Sharp' : 'Blurry'}
                </p>
              </div>

              <div className="mo-ms-tool" role="group" aria-labelledby="mo-ms-lens-label">
                <h2 className="mo-ms-tool-label" id="mo-ms-lens-label">Objective lens</h2>
                <div className="mo-ms-nosepiece">
                  {OBJECTIVES.map((o, i) => (
                    <button
                      key={o.lens}
                      type="button"
                      className="mo-ms-lens"
                      aria-pressed={objective === i}
                      aria-label={`${o.lens}× objective lens: ${totalPower(i)}× in all`}
                      onClick={() => chooseObjective(i)}
                    >
                      <span className="mo-ms-lens-barrel" aria-hidden="true" style={{ height: 14 + i * 9 }} />
                      <span aria-hidden="true">{o.lens}×</span>
                    </button>
                  ))}
                </div>
                <p className="mo-ms-readout">
                  {EYEPIECE}× eyepiece × {OBJECTIVES[objective].lens}× lens = <strong>{totalPower(objective)}×</strong>
                </p>
              </div>

              <div className="mo-ms-tool" role="group" aria-labelledby="mo-ms-stage-label">
                <h2 className="mo-ms-tool-label" id="mo-ms-stage-label">Move the slide</h2>
                <div className="mo-ms-pad">
                  <button type="button" className="mo-ms-round mo-ms-pad-up" aria-label="Move the slide up" aria-disabled={edges.up || undefined} onClick={() => move(0, -0.25)}>
                    ▲
                  </button>
                  <button type="button" className="mo-ms-round mo-ms-pad-left" aria-label="Move the slide left" aria-disabled={edges.left || undefined} onClick={() => move(-0.25, 0)}>
                    ◀
                  </button>
                  <button type="button" className="mo-ms-round mo-ms-pad-mid" aria-label="Move the slide back to the middle" onClick={() => setPan(CENTRE)}>
                    ●
                  </button>
                  <button type="button" className="mo-ms-round mo-ms-pad-right" aria-label="Move the slide right" aria-disabled={edges.right || undefined} onClick={() => move(0.25, 0)}>
                    ▶
                  </button>
                  <button type="button" className="mo-ms-round mo-ms-pad-down" aria-label="Move the slide down" aria-disabled={edges.down || undefined} onClick={() => move(0, 0.25)}>
                    ▼
                  </button>
                </div>
                <div className="mo-ms-hand" role="group" aria-label="Dragging on the slide">
                  <button type="button" className="mo-ms-chip" aria-pressed={tool === 'move'} onClick={() => setToolChoice('move')}>
                    Drag to move
                  </button>
                  <button type="button" className="mo-ms-chip" aria-pressed={tool === 'cloth'} onClick={() => setToolChoice('cloth')}>
                    Drag to wipe
                  </button>
                </div>
              </div>
            </div>

            <section className="mo-ms-panel" aria-labelledby="mo-ms-heading">
              <p className="mo-ms-kicker">{right ? 'Two slides, side by side' : left ? `On the stage · ${isMoon(left) ? 'Moon' : 'Earth'}` : 'On the stage'}</p>
              {right && left ? (
                <>
                  <h2 className="mo-ms-heading" id="mo-ms-heading">Moon and Earth</h2>
                  <About slide={left} heading="h3" />
                  <About slide={right} heading="h3" />
                </>
              ) : left ? (
                <About slide={left} heading="h2" />
              ) : (
                <h2 className="mo-ms-heading" id="mo-ms-heading">{stage.left.smudged ? 'A fresh slide' : 'A clean slide'}</h2>
              )}

              {left && (
                <div className="mo-ms-actions mo-ms-actions-compare">
                  {right ? (
                    <button type="button" className="mo-ms-button mo-ms-button-quiet" onClick={() => eyepiece.current?.endCompare()}>
                      Back to one slide
                    </button>
                  ) : (
                    <button type="button" className={step === 'explore' ? 'mo-ms-button mo-ms-button-next' : 'mo-ms-button'} aria-haspopup="dialog" onClick={compare}>
                      Compare with {isMoon(left) ? 'Earth’s soil' : 'Moon dust'}
                    </button>
                  )}
                </div>
              )}

              <div className="mo-ms-poster">
                {right ? <p>{REGOLITH.surface} {REGOLITH.differences}</p>
                : left && isMoon(left) ? <p>{REGOLITH.unlike} {REGOLITH.jagged}</p>
                : left ? <p><Unlike slide={left} /></p>
                : <p>{REGOLITH.study} {REGOLITH.surface}</p>}
                {wipedMoon && (moonOnStage || !left) && <p className="mo-ms-poster-more">{REGOLITH.gunpowder}</p>}
              </div>
              {moonOnStage && <FactNote fact={MICROSCOPE_NOTES.dust} className="mo-ms-fact" />}

              <div className="mo-ms-tip">
                <p className="mo-ms-tip-title">Microscope tip</p>
                <FactNote fact={tip} className="mo-ms-fact" />
              </div>

              <div className="mo-ms-case-wrap">
                <Link href="/exhibitions/moon/artifacts/case" className="mo-ms-case">See the lunar meteorite in the display case</Link>
                <FactNote fact={MICROSCOPE_NOTES.adrar} className="mo-ms-fact" />
              </div>

              <p className="mo-ms-credit mo-ms-photo-note">These are photographs taken through real microscopes; the lens buttons zoom the photo.</p>
            </section>
          </div>

          {tray && <Tray only={tray === 'compare' && left ? (isMoon(left) ? 'earth' : 'moon') : null} onChoose={choose} onClose={closeTray} />}
        </div>
      </RoomShell>
    </SourcesDrawer>
  );
}
