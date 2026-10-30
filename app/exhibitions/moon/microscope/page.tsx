'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell from '../RoomShell';
import { MICROSCOPE_NOTES, REGOLITH } from '../moon';
import Eyepiece, { type EyepieceHandle, type WipeReport } from './Eyepiece';
import Knob from './Knob';
import { EARTH_SLIDES, MOON_SLIDES, SLIDES, type EarthSample, type MoonSlide, type Slide, type SlideId } from './slides';
import { blurFor } from './focus';
import './microscope.css';

/*
 * Under the Microscope, on one screen: the view down a microscope, with
 * three tabs (Moon dust, Earth's soil, the two side by side). Turn the knob
 * to bring the slide into focus, change the power, and wipe the slide clean
 * with a cloth to feel the difference the poster describes (Moon dust clings
 * to the cloth; Earth's grains brush aside). Then place the sample on the
 * clean slide again, or take a fresh slide. Every claim on screen is
 * poster 1's, from moon.ts, but two notes: what Moon dust is made of, and the
 * meteorite in the case. Those are owner-approved and fact-checked, set apart
 * with their sources (moon.ts, MICROSCOPE_NOTES). The slides are real
 * photographs down microscopes (slides.ts), three of Moon dust and one of
 * Earth's sand for each of the poster's three words; each is captioned from
 * its own record, as a note with its source, and credited beneath the
 * eyepiece. The cloth wipes the photograph itself (wipe.ts).
 */

const TABS = [
  { id: 'moon', label: 'Moon Dust', short: 'Moon' },
  { id: 'earth', label: "Earth's Soil", short: 'Earth' },
  { id: 'compare', label: 'Side by Side', short: 'Compare' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const POWER_NAMES = ['Low', 'Medium', 'High'];

const EARTH_WORDS: Record<EarthSample, string> = { wind: 'wind', water: 'water', life: 'living things' };

/** A photograph's credit: its title, author and licence, each linked. */
function Credit({ slide }: { slide: Slide }) {
  const c = slide.credit;
  return (
    <span className="mo-ms-credit-line">
      Photo: <a href={c.href} target="_blank" rel="noopener noreferrer">{c.title}</a>, {c.author},{' '}
      {c.licenceHref ? <a href={c.licenceHref} target="_blank" rel="noopener noreferrer">{c.licence}</a> : c.licence}
    </span>
  );
}

/** Poster 1's sentence on Earth's soil, with the word for the slide on the stage marked. */
function Unlike({ sample }: { sample: EarthSample }) {
  const word = EARTH_WORDS[sample];
  const at = REGOLITH.unlike.indexOf(word);
  return (
    <>
      {REGOLITH.unlike.slice(0, at)}
      <mark>{word}</mark>
      {REGOLITH.unlike.slice(at + word.length)}
    </>
  );
}

export default function MoonMicroscope() {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('moon');
  const [earth, setEarth] = useState<EarthSample>('wind');
  const [moon, setMoon] = useState<MoonSlide>('soil');
  const [power, setPower] = useState(0);
  const [focus, setFocus] = useState(24);
  const [status, setStatus] = useState('');
  const [clothDust, setClothDust] = useState(0);
  const [wipedMoon, setWipedMoon] = useState(false);
  const eyepiece = useRef<EyepieceHandle>(null);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ moon: null, earth: null, compare: null });

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const t = TABS.find((x) => x.id === h);
      if (t) setTab(t.id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((id: TabId, focusTab = false) => {
    setTab(id);
    setStatus('');
    window.history.replaceState(null, '', `#${id}`);
    if (focusTab) tabRefs.current[id]?.focus();
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.findIndex((x) => x.id === tab);
    const to =
      e.key === 'ArrowRight' ? (i + 1) % TABS.length
      : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TABS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(TABS[to].id, true);
  };

  const blur = blurFor(focus, power);
  const sharp = blur === 0;
  // Say so when the knob brings the view into focus.
  const turnFocus = (v: number) => {
    if (blurFor(v, power) === 0 && !sharp) setStatus('In focus.');
    setFocus(v);
  };

  const onWiped = useCallback((r: WipeReport) => {
    if (r.already) {
      setStatus('The slide is already clean. Place a sample on it.');
      return;
    }
    if (r.moon > 0) {
      setClothDust(r.moon);
      setWipedMoon(true);
    }
    const done = !r.clean ? '' : r.moon > 0 && r.earth > 0 ? ' The slides are wiped clean.' : ' The slide is wiped clean.';
    setStatus(
      r.moon > 0 && r.earth > 0 ? `The Moon dust clings to the cloth. The Earth grains brush aside.${done}`
      : r.moon > 0 ? `The Moon dust clings to the cloth.${done}`
      : r.earth > 0 ? `The grains brush aside.${done}`
      : 'The cloth missed the grains. Try again.',
    );
  }, []);

  /** Which slides on the stage are clean glass, and whether a change is under way. */
  const [cleanIds, setCleanIds] = useState<SlideId[]>([]);
  const [busy, setBusy] = useState(false);
  const onChange = useCallback((ids: SlideId[], moving: boolean) => {
    setCleanIds(ids);
    setBusy(moving);
  }, []);

  const fresh = () => {
    eyepiece.current?.fresh();
    setClothDust(0);
    setWipedMoon(false);
    setStatus('Fresh slides and a clean cloth.');
  };

  const place = () => {
    if (busy) return;
    if (eyepiece.current?.place()) setStatus('The sample settles on the slide.');
    else setStatus('The slide has a sample on it. Wipe it clean, or take a fresh slide, first.');
  };

  const moonSlide = SLIDES[`moon-${moon}`];
  const earthSlide = SLIDES[`earth-${earth}`];
  const earthName = earthSlide.label;
  const left = tab === 'earth' ? earthSlide : moonSlide;
  const right = tab === 'compare' ? earthSlide : null;
  const viewLabel =
    tab === 'compare' ? `Side by side under the microscope. Left, Moon dust: ${moonSlide.alt}. Right, Earth's sand shaped by ${EARTH_WORDS[earth]}: ${earthSlide.alt}`
    : left.alt;
  const onStage = right ? [left, right] : [left];
  const activeTab = TABS.find((x) => x.id === tab)!;
  // A clean slide on the stage: the next thing to do is to put the sample on it.
  const anyClean = onStage.some((s) => cleanIds.includes(s.id));
  const allClean = onStage.every((s) => cleanIds.includes(s.id));
  const glassLabel = 'A clean glass slide, lit from below, with nothing on it';
  const shownLabel =
    allClean ? glassLabel
    : anyClean && right ? `Side by side under the microscope. ${cleanIds.includes(left.id) ? `Left: ${glassLabel}. Right: ${right.alt}` : `Left, Moon dust: ${left.alt}. Right: ${glassLabel}`}`
    : viewLabel;

  return (
    <RoomShell className="mo-microscope">
      <div className="mo-ms-stage" data-tab={tab}>
        <div className="mo-ms-sky" aria-hidden="true">
          <span className="mo-ms-glow" />
        </div>

        <header className="mo-ms-bar">
          <h1 className="mo-ms-title">
            Under the Microscope
            <span className="mo-ms-title-sub">Moon dust · Earth&rsquo;s soil</span>
          </h1>
          <div className="mo-ms-tabs" role="tablist" aria-label="Slides">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`mo-ms-tab-${x.id}`}
                aria-controls="mo-ms-panel"
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="mo-ms-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                <span className="mo-ms-tab-long">{x.label}</span>
                <span className="mo-ms-tab-short" aria-hidden="true">{x.short}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="mo-ms-body">
          <div className="mo-ms-scope">
            <Eyepiece
              ref={eyepiece}
              left={left}
              right={right}
              power={power}
              blur={blur}
              reduced={reduced}
              label={shownLabel}
              rightLabel="Earth"
              onWiped={onWiped}
              onChange={onChange}
            />
            <p className={sharp && !anyClean ? 'mo-ms-hint' : 'mo-ms-hint is-blurry'} aria-hidden="true">
              {!sharp ? 'Turn the focus knob' : anyClean ? 'Place a sample on the clean slide' : 'Drag across the slide to wipe it'}
            </p>
            {tab !== 'compare' && <FactNote fact={left.caption} className="mo-ms-caption" />}
            <p className="mo-ms-credit">
              {onStage.map((s) => <Credit key={s.id} slide={s} />)}
            </p>
          </div>

          <section className="mo-ms-panel" id="mo-ms-panel" role="tabpanel" aria-labelledby={`mo-ms-tab-${tab}`}>
            <p className="mo-ms-kicker">{tab === 'compare' ? 'Two slides' : 'On the stage'}</p>
            <h2 className="mo-ms-heading">{tab === 'earth' ? `Earth's soil: ${earthName}` : tab === 'compare' ? `Moon and Earth` : activeTab.label}</h2>

            {tab !== 'earth' && (
              <div className="mo-ms-samples" role="group" aria-label="Moon slide">
                <span className="mo-ms-samples-label" aria-hidden="true">Moon</span>
                {MOON_SLIDES.map((s) => (
                  <button key={s.id} type="button" className="mo-ms-chip" aria-pressed={moon === s.key} onClick={() => {
                    setMoon(s.key);
                    setStatus('');
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
            {tab !== 'moon' && (
              <div className="mo-ms-samples" role="group" aria-label="Earth slide: shaped by">
                <span className="mo-ms-samples-label" aria-hidden="true">Shaped by</span>
                {EARTH_SLIDES.map((s) => (
                  <button key={s.id} type="button" className="mo-ms-chip" aria-pressed={earth === s.key} onClick={() => {
                    setEarth(s.key);
                    setStatus('');
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mo-ms-poster">
              {tab === 'moon' && <p>{REGOLITH.unlike} {REGOLITH.jagged}</p>}
              {tab === 'earth' && <p><Unlike sample={earth} /></p>}
              {tab === 'compare' && <p>{REGOLITH.surface} {REGOLITH.differences}</p>}
              {wipedMoon && tab !== 'earth' && <p className="mo-ms-poster-more">{REGOLITH.gunpowder}</p>}
            </div>
            {tab === 'moon' && <FactNote fact={MICROSCOPE_NOTES.dust} className="mo-ms-fact" />}

            <div className="mo-ms-controls">
              <div className="mo-ms-control mo-ms-focus">
                <Knob value={focus} onChange={turnFocus} label="Focus" valueText={sharp ? 'In focus' : 'Blurry'} />
                <span className="mo-ms-control-label" aria-hidden="true">Focus</span>
              </div>

              <div className="mo-ms-control">
                <div className="mo-ms-power" role="group" aria-label="Power">
                  {POWER_NAMES.map((name, i) => (
                    <button key={name} type="button" className="mo-ms-lens" aria-pressed={power === i} onClick={() => setPower(i)}>
                      <span className="mo-ms-lens-barrel" aria-hidden="true" style={{ height: 14 + i * 7 }} />
                      {name}
                    </button>
                  ))}
                </div>
                <span className="mo-ms-control-label" aria-hidden="true">Power</span>
              </div>

              <div className="mo-ms-control mo-ms-cloth">
                <div className="mo-ms-cloth-row">
                  <span
                    className="mo-ms-swatch"
                    aria-hidden="true"
                    style={{ ['--dust' as string]: String(clothDust) }}
                  />
                  <button
                    type="button"
                    className={allClean ? 'mo-ms-button mo-ms-button-quiet' : 'mo-ms-button'}
                    aria-disabled={busy || undefined}
                    onClick={() => eyepiece.current?.sweep()}
                  >
                    Wipe the slide
                  </button>
                </div>
                <button
                  type="button"
                  className={anyClean ? 'mo-ms-button mo-ms-button-place' : 'mo-ms-button mo-ms-button-quiet'}
                  aria-disabled={busy || undefined}
                  onClick={place}
                >
                  Place sample
                </button>
                <button type="button" className="mo-ms-button mo-ms-button-quiet" onClick={fresh}>
                  Fresh slide
                </button>
              </div>
            </div>

            <p className="mo-ms-status" role="status">{status}</p>
            <div className="mo-ms-case-wrap">
              <Link href="/exhibitions/moon/artifacts/case" className="mo-ms-case">See the lunar meteorite in the display case</Link>
              <FactNote fact={MICROSCOPE_NOTES.adrar} className="mo-ms-fact" />
            </div>
          </section>
        </div>
      </div>
    </RoomShell>
  );
}
