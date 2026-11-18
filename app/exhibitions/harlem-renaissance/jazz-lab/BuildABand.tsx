'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, srOnly } from '@/lib/a11y';
import { BAND_GOALS, BAND_INSTRUMENTS, BAND_INSTRUMENT_MAP, SECTIONS } from './data';
import type { useBandBuilder } from './hooks';
import InstrumentIcon from './InstrumentIcon';
import StagePlayers from './StagePlayers';

type Band = ReturnType<typeof useBandBuilder>;

/**
 * The Build a Band tab: a goal to reach (BAND_GOALS, in turn, with "You
 * did it!" when the band on stage meets it), one line of how to play, the
 * song sections, and the stage, with the fact about the instrument last
 * tapped shown on the stage itself. Shares the page's jl- styles; the rules
 * it adds live in this file.
 */
export default function BuildABand({ band }: { band: Band }) {
  const factInstrument = band.lastTouched ? BAND_INSTRUMENT_MAP[band.lastTouched] : null;
  const currentSection = SECTIONS.find(s => s.number === band.section);

  // Compute spotlight position for stage glow
  const spotlightIdx = band.spotlight ? BAND_INSTRUMENTS.findIndex(i => i.id === band.spotlight) : -1;
  const spotlightX = spotlightIdx >= 0 ? `${((spotlightIdx + 0.5) / BAND_INSTRUMENTS.length) * 100}%` : '50%';

  // The goal, one at a time in turn, checked against the band as it stands.
  const [goalAt, setGoalAt] = useState(0);
  const goal = BAND_GOALS[goalAt];
  const goalMet = goal.check({ section: band.section, active: band.active, spotlight: band.spotlight });
  const tap = (id: Parameters<Band['tapInstrument']>[0]) => band.tapInstrument(id);

  return (
    <div role="tabpanel" id="jl-panel-band" aria-labelledby="jl-tab-band">
      <style jsx global>{`
        .jl-slot-wrap { position: relative; display: flex; justify-content: center; }
        .jl-slot-icon svg { width: 46px; height: 46px; color: var(--jl-gold-light); }
        .jl-slot.unavailable .jl-slot-icon svg { color: var(--jl-text-dim); }
        .jl-slot-remove {
          position: absolute;
          top: -6px;
          right: calc(50% - 52px);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--jl-gold-dim);
          background: #1a1712;
          color: var(--jl-gold-light);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 16px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: background 0.2s, border-color 0.2s;
        }
        .jl-slot-remove:hover { background: #3a1414; border-color: #cc4444; color: #f0b0b0; }
        .jl-slot-remove:focus-visible, .jl-slot:focus-visible { outline: 2px solid var(--jl-gold); outline-offset: 3px; border-radius: 8px; }
        .jl-section-desc {
          max-width: 560px;
          margin: 14px auto 0;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #b9ae9a;
          font-weight: 300;
        }
        .jl-section-desc strong { color: var(--jl-gold-light); font-weight: 600; letter-spacing: 1px; }
        /* Small gold labels at 10–11px need more than the page's dim gold to reach 4.5:1. */
        #jl-panel-band .jl-section-label, #jl-panel-band .jl-stage-label { color: #a8904a; }
        #jl-panel-band .jl-btn-stop { color: #e06a6a; }
        /* The goal, and the one line of how to play. */
        .jl-goal {
          max-width: 860px; margin: 12px auto 10px; padding: 10px 16px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap;
          border: 1px solid rgba(201,169,78,0.35); border-radius: 8px;
          background: rgba(201,169,78,0.06);
          font-family: 'Josefin Sans', sans-serif;
        }
        .jl-goal.is-met { border-color: var(--jl-gold); background: rgba(201,169,78,0.14); }
        .jl-goal-text { margin: 0; min-width: 0; flex: 1 1 320px; }
        .jl-goal-kicker { display: block; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c9a94e; font-weight: 600; }
        .jl-goal-name { display: block; font-family: 'Playfair Display', serif; font-size: clamp(18px, 1.6vw, 22px); color: var(--jl-gold-light); }
        .jl-goal-hint { display: block; font-size: 14px; color: #cfc4ae; margin-top: 2px; }
        .jl-goal-done { font-size: 16px; font-weight: 700; color: var(--jl-gold); }
        .jl-goal .jl-btn { padding: 8px 16px; }
        #jl-panel-band .jl-instructions { padding: 0 20px 10px; line-height: 1.5; font-size: 14px; color: #b9ae9a; }

        /* One screen: a smaller stage, the fact in the spotlight on it. */
        #jl-panel-band .jl-section-container { margin-bottom: 10px; }
        #jl-panel-band .jl-section-btn { padding: 6px 4px 4px; gap: 4px; }
        #jl-panel-band .jl-section-num { width: 32px; height: 32px; }
        #jl-panel-band .jl-section-desc { margin-top: 6px; font-size: 13.5px; line-height: 1.45; }
        #jl-panel-band .jl-stage { padding: 30px 16px 14px; }
        #jl-panel-band .jl-stage-label { top: 10px; }
        #jl-panel-band .jl-slot-icon { width: 64px; height: 64px; }
        #jl-panel-band .jl-slot { gap: 6px; width: 104px; }
        .jl-stage-fact {
          position: relative; z-index: 3;
          max-width: 640px; min-height: 58px; margin: 4px auto 0; padding: 8px 14px;
          border: 1px solid rgba(201,169,78,0.22); border-radius: 8px;
          background: rgba(10,10,10,0.6);
          text-align: center;
          font-family: 'Josefin Sans', sans-serif;
          animation: jl-fadeIn 0.4s ease;
        }
        .jl-stage-fact h2 { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--jl-gold); margin: 0 0 2px; }
        .jl-stage-fact p { margin: 0; font-size: 13.5px; line-height: 1.45; color: #cfc4ae; }
        .jl-stage-fact .jl-stage-fact-quote { margin-top: 3px; font-style: italic; color: var(--jl-gold-light); }
        .jl-stage-fact.is-empty { display: flex; align-items: center; justify-content: center; color: #9a907f; letter-spacing: 1px; font-size: 13px; }
        .jl-band-foot { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px 18px; max-width: 900px; margin: 10px auto 0; padding: 0 20px; }
        #jl-panel-band .jl-now-playing { padding: 0; flex-direction: row; }
        #jl-panel-band .jl-controls { margin: 0; padding: 0; }
        @media (max-width: 600px) {
          .jl-slot-icon svg { width: 38px; height: 38px; }
          .jl-slot-remove { right: calc(50% - 44px); }
        }

        /* The players on the stage floor: they walk on from the wings, and off again. */
        .jl-stage-floor {
          --floor: clamp(84px, 13dvh, 124px);
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          align-items: end;
          height: var(--floor);
          margin: 10px 0 0;
        }
        /* The instruments sit closer under the players. */
        #jl-panel-band .jl-band-slots { min-height: 0; padding-top: 12px; }
        #jl-panel-band .jl-stage { min-height: 0; }
        .jl-stage-boards {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 10px;
          border-top: 1px solid rgba(201,169,78,0.35);
          background: repeating-linear-gradient(90deg, rgba(201,169,78,0.10) 0 46px, rgba(201,169,78,0.04) 46px 48px);
          pointer-events: none;
        }
        .jl-player-spot { position: relative; display: flex; justify-content: center; align-items: flex-end; }
        .jl-player { width: min(100%, calc(var(--floor) * 80 / 112)); aspect-ratio: 80 / 112; animation: jl-walk-on 1s cubic-bezier(0.25, 0.8, 0.35, 1) both; }
        .jl-player.is-leaving { animation: jl-walk-off 0.65s ease-in both; }
        .jl-player-figure { display: block; width: 100%; height: 100%; overflow: visible; }
        .jl-player-body { fill: #6f5f33; stroke: none; }
        .jl-player-limb { fill: none; stroke: #6f5f33; stroke-width: 7; stroke-linecap: round; }
        .jl-player-stool { stroke-width: 3.5; }
        .jl-player-instrument { color: var(--jl-gold-light); }
        .jl-player.is-solo .jl-player-body { fill: #a38b45; }
        .jl-player.is-solo .jl-player-limb { stroke: #a38b45; }
        .jl-player-light { fill: rgba(232,212,139,0.14); }
        .jl-player:not(.is-leaving) .jl-player-legs { animation: jl-step 0.25s ease-in-out 4 alternate; transform-origin: 40px 74px; }
        @keyframes jl-walk-on {
          from { transform: translateX(calc(var(--from) * 120vw)); opacity: 0.2; }
          to { transform: none; opacity: 1; }
        }
        @keyframes jl-walk-off {
          from { transform: none; opacity: 1; }
          to { transform: translateX(calc(var(--from) * 120vw)); opacity: 0.2; }
        }
        @keyframes jl-step { from { transform: skewX(-8deg); } to { transform: skewX(8deg); } }
        @media (max-width: 600px) {
          .jl-stage-floor { margin-top: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jl-player, .jl-player.is-leaving, .jl-player:not(.is-leaving) .jl-player-legs { animation: none; }
          .jl-player.is-leaving { display: none; }
        }
      `}</style>

      <section className={`jl-goal ${goalMet ? 'is-met' : ''}`} aria-labelledby="jl-goal-name">
        <p className="jl-goal-text">
          <span className="jl-goal-kicker">Goal {goalAt + 1} of {BAND_GOALS.length}</span>
          <span className="jl-goal-name" id="jl-goal-name">{goal.goal}</span>
          <span className="jl-goal-hint">{goal.hint}</span>
        </p>
        <p className="jl-goal-done" role="status" aria-live="polite">
          {goalMet ? <><span aria-hidden="true">{'\u2714'} </span>You did it!</> : ''}
        </p>
        <button type="button" className="jl-btn" onClick={() => setGoalAt((goalAt + 1) % BAND_GOALS.length)}>
          {goalMet ? 'Next goal' : 'Another goal'}
        </button>
      </section>

      <p className="jl-instructions">
        Tap an instrument to <em>bring it on and give it the spotlight</em>; <em>{'×'}</em> sends it off.
      </p>

      {/* Section Selector */}
      <div className="jl-section-container">
        <div className="jl-section-selector" role="group" aria-label="Song section">
          {SECTIONS.map(s => (
            <button
              key={s.number}
              type="button"
              className={`jl-section-btn ${band.section === s.number ? 'active' : ''}`}
              aria-pressed={band.section === s.number}
              aria-describedby={band.section === s.number ? 'jl-section-desc' : undefined}
              onClick={() => band.changeSection(s.number)}
            >
              <span className="jl-section-num" aria-hidden="true">{s.number}</span>
              <span className="jl-section-name">{s.name}</span>
            </button>
          ))}
        </div>
        {currentSection && (
          <p className="jl-section-desc" id="jl-section-desc">
            <strong>{currentSection.name}:</strong> {currentSection.description}
          </p>
        )}
      </div>

      {/* Stage */}
      <div className="jl-stage-container">
        <div
          className={`jl-stage ${band.spotlight ? 'has-spotlight' : ''}`}
          style={{ '--spotlight-x': spotlightX } as React.CSSProperties}
        >
          <div className="jl-stage-label">{'\u{25C6}'} The Stage {'\u{25C6}'}</div>
          {/* The fact, in the spotlight on the stage. */}
          {factInstrument ? (
            <div className="jl-stage-fact" key={factInstrument.id}>
              <h2>
                <span style={srOnly}>
                  {band.spotlight === factInstrument.id ? 'In the spotlight: ' : band.active.has(factInstrument.id) ? 'On stage: ' : 'Off stage: '}
                </span>
                {factInstrument.fact.title}
              </h2>
              <p>{factInstrument.fact.text}</p>
              {factInstrument.fact.quote && <p className="jl-stage-fact-quote">{factInstrument.fact.quote}</p>}
            </div>
          ) : (
            <p className="jl-stage-fact is-empty">Tap an instrument to meet it.</p>
          )}
          <StagePlayers active={band.active} spotlight={band.spotlight} />
          <div className="jl-band-slots" role="group" aria-label="Instruments">
            {BAND_INSTRUMENTS.map((inst) => {
              const isAvailable = inst.sections.includes(band.section);
              const isActive = band.active.has(inst.id);
              const isSpotlight = band.spotlight === inst.id;
              const isBacking = isActive && band.spotlight !== null && !isSpotlight;
              const isDimmed = !isActive && band.active.size > 0 && band.spotlight !== null;
              const state = !isAvailable
                ? ', not in this section'
                : isSpotlight
                  ? ', on stage, in the spotlight'
                  : isActive
                    ? ', on stage'
                    : '';

              return (
                <div className="jl-slot-wrap" key={inst.id}>
                  <button
                    type="button"
                    className={`jl-slot ${isActive ? 'active' : ''} ${isSpotlight ? 'spotlight' : ''} ${isBacking ? 'backing' : ''} ${isDimmed ? 'dimmed' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                    aria-pressed={isSpotlight}
                    aria-disabled={!isAvailable || undefined}
                    aria-label={`${inst.name}${state}`}
                    onClick={() => isAvailable && tap(inst.id)}
                  >
                    <span className="jl-slot-icon" aria-hidden="true">
                      <InstrumentIcon id={inst.id} />
                    </span>
                    <span className="jl-slot-name">{inst.name}</span>
                  </button>
                  {isActive && (
                    <button
                      type="button"
                      className="jl-slot-remove"
                      aria-label={`Send ${inst.name} off stage`}
                      title={`Send ${inst.name} off stage`}
                      onClick={() => band.removeInstrument(inst.id)}
                    >
                      <span aria-hidden="true">{'×'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="jl-band-foot">
      <div className="jl-now-playing">
        <EqBars isPlaying={band.active.size > 0} />
        <div role="status" aria-live="polite">
          {band.active.size === 0
            ? 'Tap an instrument to begin'
            : band.spotlight
              ? <><span>{BAND_INSTRUMENT_MAP[band.spotlight].name}</span> in the spotlight &mdash; {currentSection?.name}</>
              : <><span>{band.active.size}</span> instrument{band.active.size > 1 ? 's' : ''} playing &mdash; {currentSection?.name}</>
          }
        </div>
      </div>

      <div className="jl-controls">
        <button className="jl-btn jl-btn-stop" onClick={band.stopAll}>
          Stop All
        </button>
        <button className="jl-btn" onClick={band.surpriseMe}>
          Surprise Me
        </button>
      </div>
      </div>
    </div>
  );
}

// ── EQ Bars sub-component ──
function EqBars({ isPlaying }: { isPlaying: boolean }) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || !barsRef.current) return;
    const bars = barsRef.current.children;
    // Decorative motion: hold the bars still for visitors who ask for reduced motion.
    if (prefersReducedMotion()) {
      for (let i = 0; i < bars.length; i++) {
        (bars[i] as HTMLDivElement).style.height = `${8 + ((i * 7) % 10)}px`;
      }
      return;
    }
    let animId: number;

    const animate = () => {
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i] as HTMLDivElement;
        const h = 4 + Math.random() * 18;
        bar.style.height = `${h}px`;
      }
    };

    // Throttle to ~15fps for performance
    const interval = setInterval(() => {
      animId = requestAnimationFrame(animate);
    }, 66);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div ref={barsRef} className={`jl-eq-bars ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="jl-eq-bar" style={{ height: '4px' }} />
      ))}
    </div>
  );
}
