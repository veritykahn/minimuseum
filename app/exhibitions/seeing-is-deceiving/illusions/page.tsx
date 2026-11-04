'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import TeachToggle from '@/components/games/projector/TeachToggle';
import { useProjectorMode } from '@/components/games/projector/useProjectorMode';
import { holdProjectorScreen } from '@/components/projector/useProjectorMode';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { BENCHES, ILLUSIONS, LAB_TEXT, labSourceGroups, type IllusionId } from './lab/data';
import { classFingerprint, entryLines, type LabResult, type Phase, type Results, type Votes } from './lab/results';
import { ownerPicture } from './lab/slots';
import { TaskSlot, type BenchProps, type Step } from './lab/ui';
import { Checker, Contrast, Lilac } from './lab/Brightness';
import { Ebbinghaus, Jastrow, MullerLyer, Ponzo } from './lab/Size';
import { CafeWall, Fraser, Poggendorff } from './lab/Lines';
import { BlindSpot, Kanizsa, Troxler } from './lab/Gaps';
import { Snakes, Waterfall } from './lab/Motion';
import { Ames, Paris, Rubin, Stroop } from './lab/Brain';
import Notebook, { Stamp } from './lab/Notebook';
import ClassVote from './lab/ClassVote';
import './lab/lab.css';

/*
 * The Perception Lab, rebuilt from the owner-approved proposal (B4): "You
 * are the scientist". Six benches and a bonus, in the order of the November
 * review: the brain filling gaps, size, brightness, lines, everything that
 * moves together, then brain against brain. Each illusion in three steps:
 * Try it (measure yourself), Break it (switch the trick off and measure
 * again), Why? (the science). The notebook keeps one entry per illusion,
 * before and after, and prints with "My Illusion Fingerprint". Motion
 * illusions wait behind a calm warning with a way to skip them. "Teach with
 * this" makes everything large for a projector and adds a hands-up tally to
 * each illusion, and a class fingerprint at the end. Nothing is stored or
 * sent.
 *
 * One fixed layout for every illusion (B2.4): the picture in a fixed box on
 * the left (on top, on a phone), the task in one scrolling panel beside it,
 * and Previous and Next pinned at the foot, clear of the Sources and Map
 * buttons. Only the content changes from step to step.
 *
 * Every source and picture credit is in the Sources drawer, by bench and
 * illusion: on an illusion, that illusion's; on the benches or the
 * notebook, all of them.
 *
 * Each illusion has its own address (#checker, #muller-lyer, …), and the
 * notebook has #notebook.
 */

const BACK = '/exhibitions/seeing-is-deceiving/artifacts?view=interactives';

const BENCH_PARTS: Record<IllusionId, ComponentType<BenchProps>> = {
  'blind-spot': BlindSpot,
  kanizsa: Kanizsa,
  rubin: Rubin,
  ebbinghaus: Ebbinghaus,
  'muller-lyer': MullerLyer,
  ponzo: Ponzo,
  jastrow: Jastrow,
  checker: Checker,
  contrast: Contrast,
  'cafe-wall': CafeWall,
  fraser: Fraser,
  poggendorff: Poggendorff,
  lilac: Lilac,
  waterfall: Waterfall,
  snakes: Snakes,
  troxler: Troxler,
  stroop: Stroop,
  paris: Paris,
  ames: Ames,
};

const STEPS: { id: Step; label: string }[] = [
  { id: 'try', label: 'Try it' },
  { id: 'break', label: 'Break it' },
  { id: 'why', label: 'Why?' },
];

type View = { kind: 'intro' } | { kind: 'illusion'; index: number } | { kind: 'notebook' };

function viewFromHash(hash: string): View | null {
  const h = hash.replace(/^#/, '');
  if (h === 'notebook') return { kind: 'notebook' };
  const index = ILLUSIONS.findIndex((i) => i.id === h);
  return index >= 0 ? { kind: 'illusion', index } : null;
}

const ALL_IDS = ILLUSIONS.map((i) => i.id);

export default function PerceptionLab() {
  const reduced = usePrefersReducedMotion();
  const [teach, setTeach] = useProjectorMode();
  const [view, setView] = useState<View>({ kind: 'intro' });
  const [step, setStep] = useState<Step>('try');
  const [switchOn, setSwitchOn] = useState(true);
  const [more, setMore] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [votes, setVotes] = useState<Votes>({});
  const [shown, setShown] = useState<Partial<Record<IllusionId, boolean>>>({});
  const [said, setSaid] = useState('');
  const [taskSlot, setTaskSlot] = useState<HTMLDivElement | null>(null);
  const stepRefs = useRef<Record<Step, HTMLButtonElement | null>>({ try: null, break: null, why: null });
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // While in class mode, the museum map steps aside.
  useEffect(() => (teach ? holdProjectorScreen() : undefined), [teach]);

  useEffect(() => {
    const fromHash = () => {
      const v = viewFromHash(window.location.hash);
      if (!v) return;
      setView(v);
      setStep('try');
      setSwitchOn(true);
      setMore(false);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = useCallback((v: View) => {
    setView(v);
    setStep('try');
    setSwitchOn(true);
    setMore(false);
    const hash = v.kind === 'illusion' ? `#${ILLUSIONS[v.index].id}` : v.kind === 'notebook' ? '#notebook' : ' ';
    window.history.replaceState(null, '', hash === ' ' ? window.location.pathname + window.location.search : hash);
    window.scrollTo({ top: 0 });
    window.setTimeout(() => heading.current?.focus(), 0);
  }, []);

  const open = useCallback((id: IllusionId) => go({ kind: 'illusion', index: ILLUSIONS.findIndex((i) => i.id === id) }), [go]);

  /** One entry per illusion: Try it writes "before", Break it writes "after". */
  const record = useCallback((id: IllusionId, phase: Phase, r: LabResult) => {
    setResults((x) => ({ ...x, [id]: { ...x[id], [phase]: r } }));
    setSaid(`Written in your notebook: ${r.line}`);
  }, []);

  const toStep = useCallback((s: Step, focus = false) => {
    setStep(s);
    setSwitchOn(true);
    setMore(false);
    panel.current?.scrollTo?.({ top: 0 });
    if (focus) stepRefs.current[s]?.focus();
  }, []);

  const classFp = useMemo(() => (teach ? classFingerprint(votes) : undefined), [teach, votes]);

  const onStepKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = STEPS.findIndex((s) => s.id === step);
    const to = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1;
    if (to < 0) return;
    e.preventDefault();
    toStep(STEPS[to].id, true);
  };

  const illusion = view.kind === 'illusion' ? ILLUSIONS[view.index] : null;
  const Part = illusion ? BENCH_PARTS[illusion.id] : null;
  const waiting = illusion?.motion && !shown[illusion.id];
  const phase: Phase | null = step === 'try' ? 'before' : step === 'break' && switchOn ? 'after' : null;
  const noted = illusion ? entryLines(results[illusion.id]) : [];
  const groups = useMemo(() => labSourceGroups(illusion ? [illusion.id] : ALL_IDS, ownerPicture), [illusion]);
  const next = view.kind === 'illusion' && view.index < ILLUSIONS.length - 1 ? ILLUSIONS[view.index + 1] : null;

  return (
    <SourcesDrawer groups={groups}>
      <div className="pl-lab" data-teach={teach ? 'on' : undefined} data-view={view.kind}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

        <header className="pl-top">
          <ExhibitionNav className="pl-nav" href={BACK}>
            <span className="pl-nav-m" aria-hidden="true">M</span>
            <span className="pl-nav-arrow" aria-hidden="true">←</span>
            <span className="pl-nav-label">Display Case</span>
          </ExhibitionNav>
          <nav className="pl-top-links" aria-label="Perception Lab">
            <button type="button" className="pl-link" onClick={() => go({ kind: 'intro' })} aria-current={view.kind === 'intro' ? 'page' : undefined}>
              <span className="pl-top-full">The benches</span>
              <span className="pl-top-short">Benches</span>
            </button>
            <button type="button" className="pl-link" onClick={() => go({ kind: 'notebook' })} aria-current={view.kind === 'notebook' ? 'page' : undefined}>
              <span className="pl-top-full">{teach ? 'Class notebook' : 'My notebook'}</span>
              <span className="pl-top-short">Notebook</span> <span className="pl-count-badge">{teach ? Object.values(votes).filter((v) => v && Object.values(v).some((n) => n > 0)).length : Object.keys(results).length}</span>
            </button>
            {teach ? (
              <button type="button" className="pl-link" onClick={() => setTeach(false)}>
                Leave class mode
              </button>
            ) : (
              <TeachToggle onClick={() => setTeach(true)} className="pl-teach" />
            )}
          </nav>
        </header>

        <main className="pl-main">
          {view.kind === 'intro' && (
            <section className="pl-intro" aria-labelledby="pl-title">
              <p className="pl-kicker">{LAB_TEXT.kicker}</p>
              <h1 id="pl-title" className="pl-title" ref={heading} tabIndex={-1}>
                {LAB_TEXT.title}
              </h1>
              <p className="pl-lead">{LAB_TEXT.lead}</p>
              <p className="pl-rule">{LAB_TEXT.rule}</p>
              <ol className="pl-how">
                {LAB_TEXT.how.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
              <button type="button" className="pl-btn pl-btn-primary pl-start" onClick={() => go({ kind: 'illusion', index: 0 })}>
                Start at Bench 1
              </button>
              <div className="pl-benches">
                {BENCHES.map((b) => (
                  <section key={b.n} className="pl-bench-card" aria-labelledby={`pl-bench-${b.n}`}>
                    <h2 id={`pl-bench-${b.n}`}>{b.n < 7 ? `Bench ${b.n}: ${b.title}` : b.title}</h2>
                    <ul>
                      {ILLUSIONS.filter((i) => i.bench === b.n).map((i) => (
                        <li key={i.id}>
                          <button type="button" className="pl-bench-link" onClick={() => open(i.id)}>
                            <Stamp id={i.id} />
                            <span>{i.name}</span>
                            {results[i.id] && <span className="pl-tick" aria-label="(in your notebook)">✓</span>}
                            {i.motion && <span className="pl-moves">moves</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <p className="pl-tip">{LAB_TEXT.noData}</p>
            </section>
          )}

          {view.kind === 'notebook' && (
            <>
              <h1 className="pl-sr" ref={heading} tabIndex={-1}>
                {teach ? 'Class notebook' : 'My Lab Notebook'}
              </h1>
              <Notebook results={results} classFp={classFp} votes={votes} onOpen={open} />
            </>
          )}

          {illusion && Part && view.kind === 'illusion' && (
            <article className="pl-station" data-step={step} aria-labelledby="pl-name">
              <div className="pl-station-head">
                <p className="pl-bench-label">
                  {illusion.bench < 7 ? `Bench ${illusion.bench}: ${BENCHES[illusion.bench - 1].title}` : 'Bonus'} · {view.index + 1} of {ILLUSIONS.length}
                </p>
                <h1 id="pl-name" className="pl-name-h" ref={heading} tabIndex={-1}>
                  {illusion.name}
                </h1>
                {!waiting && (
                  <div className="pl-steps" role="tablist" aria-label="Steps">
                    {STEPS.map((s) => (
                      <button
                        key={s.id}
                        ref={(el) => {
                          stepRefs.current[s.id] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`pl-step-${s.id}`}
                        aria-controls="pl-step-panel"
                        aria-selected={step === s.id}
                        tabIndex={step === s.id ? 0 : -1}
                        className="pl-step"
                        onClick={() => toStep(s.id)}
                        onKeyDown={onStepKey}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {waiting ? (
                <div className="pl-stage pl-stage-wait">
                  <div className="pl-warning" role="region" aria-labelledby="pl-warn-title">
                    <h2 id="pl-warn-title">Before you look</h2>
                    <p>This illusion moves, or seems to move. If moving or flashing patterns make you feel unwell or dizzy, or if you have photosensitive epilepsy, skip this one.</p>
                    {reduced && <p>Your device is set to reduce motion, so this one waits until you choose to show it.</p>}
                    <div className="pl-choice-row">
                      <button type="button" className="pl-btn pl-btn-primary" onClick={() => setShown({ ...shown, [illusion.id]: true })}>
                        Show it
                      </button>
                      <button
                        type="button"
                        className="pl-btn"
                        onClick={() => (view.index < ILLUSIONS.length - 1 ? go({ kind: 'illusion', index: view.index + 1 }) : go({ kind: 'notebook' }))}
                      >
                        Skip this one
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pl-stage" id="pl-step-panel" role="tabpanel" aria-labelledby={`pl-step-${step}`}>
                  <TaskSlot.Provider value={taskSlot}>
                    <Part
                      key={illusion.id}
                      step={step}
                      broken={step === 'break' && switchOn}
                      phase={phase}
                      entry={results[illusion.id]}
                      record={(p, r) => record(illusion.id, p, r)}
                      teach={teach}
                      reduced={reduced}
                    />
                  </TaskSlot.Provider>
                  <div className="pl-panel" ref={panel} tabIndex={0} aria-label="Task">
                    <div className="pl-instr">
                      {step === 'try' && <p className="pl-q-big">{illusion.task}</p>}
                      {step === 'break' && (
                        <>
                          <button type="button" className="pl-btn pl-switch" aria-pressed={switchOn} onClick={() => setSwitchOn(!switchOn)}>
                            <span className="pl-switch-track" aria-hidden="true">
                              <span className="pl-switch-knob" />
                            </span>
                            {illusion.breakLabel}
                          </button>
                          <p className="pl-q-big">{switchOn ? illusion.breakText : 'The trick is back on. Switch it off to measure again.'}</p>
                        </>
                      )}
                      {step === 'why' && (
                        <div className="pl-why">
                          {illusion.why.text ? <FactNote fact={illusion.why} className="pl-fact-big" /> : <p className="pl-fact-big">{illusion.unsourced}</p>}
                          {illusion.more.length > 0 && (
                            <>
                              <button type="button" className="pl-btn pl-more" aria-expanded={more} onClick={() => setMore(!more)}>
                                {more ? 'Tell me less' : 'Tell me more'}
                              </button>
                              {more && illusion.more.map((f) => <FactNote key={f.text} fact={f} className="pl-fact" />)}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="pl-task-slot" ref={setTaskSlot} />
                    {noted.length > 0 && (
                      <div className="pl-noted">
                        <span className="pl-noted-label">In your notebook</span>
                        {noted.map((n) => (
                          <p key={n.label}>
                            <strong>{n.label}:</strong> {n.line}
                          </p>
                        ))}
                      </div>
                    )}
                    {step !== 'why' && (
                      <button type="button" className="pl-btn pl-onward" onClick={() => toStep(step === 'try' ? 'break' : 'why')}>
                        {step === 'try' ? 'Now break it' : 'Now find out why'} <span aria-hidden="true">→</span>
                      </button>
                    )}
                    {teach && <ClassVote illusion={illusion} votes={votes[illusion.id] ?? {}} onChange={(v) => setVotes({ ...votes, [illusion.id]: v })} />}
                    {teach && <p className="pl-teacher-tip">Teacher tip: {illusion.teacherTip}</p>}
                  </div>
                </div>
              )}

              <nav className="pl-pager" aria-label="Illusions">
                <button type="button" className="pl-btn" onClick={() => go({ kind: 'illusion', index: view.index - 1 })} disabled={view.index === 0} aria-label="Previous">
                  <span aria-hidden="true">←</span> <span className="pl-pager-prev-word">Previous</span>
                </button>
                {next ? (
                  <button type="button" className="pl-btn pl-btn-primary" onClick={() => go({ kind: 'illusion', index: view.index + 1 })} aria-label={`Next: ${next.name}`}>
                    <span className="pl-pager-full">Next: {next.name}</span>
                    <span className="pl-pager-short" aria-hidden="true">
                      Next
                    </span>{' '}
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button type="button" className="pl-btn pl-btn-primary" onClick={() => go({ kind: 'notebook' })} aria-label="Open my notebook">
                    <span className="pl-pager-full">
                      Open my notebook <span aria-hidden="true">→</span>
                    </span>
                    <span className="pl-pager-short" aria-hidden="true">
                      Notebook
                    </span>
                  </button>
                )}
              </nav>
            </article>
          )}
        </main>

        <p className="pl-sr" role="status" aria-live="polite">
          {said}
        </p>
        {view.kind !== 'illusion' && (
          <footer className="pl-foot">
            <Link href={BACK}>Back to the display case</Link>
          </footer>
        )}
      </div>
    </SourcesDrawer>
  );
}
