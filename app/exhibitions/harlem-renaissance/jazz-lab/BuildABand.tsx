'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/a11y';
import { BAND_INSTRUMENTS, BAND_INSTRUMENT_MAP, SECTIONS } from './data';
import type { useBandBuilder } from './hooks';
import InstrumentIcon from './InstrumentIcon';
import StagePlayers from './StagePlayers';

type Band = ReturnType<typeof useBandBuilder>;

/**
 * The Build a Band tab. Shares the page's jl- styles; the few rules it adds
 * (remove control, section note) live at the bottom of this file.
 */
export default function BuildABand({ band }: { band: Band }) {
  const factInstrument = band.lastTouched ? BAND_INSTRUMENT_MAP[band.lastTouched] : null;
  const currentSection = SECTIONS.find(s => s.number === band.section);

  // Compute spotlight position for stage glow
  const spotlightIdx = band.spotlight ? BAND_INSTRUMENTS.findIndex(i => i.id === band.spotlight) : -1;
  const spotlightX = spotlightIdx >= 0 ? `${((spotlightIdx + 0.5) / BAND_INSTRUMENTS.length) * 100}%` : '50%';

  // On a phone the fact card sits below the fold: bring it up into view
  // whenever a tap changes it (but only as far as needed).
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollPending = useRef(false);
  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight || r.top < 0) {
      el.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
  const tap = (id: Parameters<Band['tapInstrument']>[0]) => {
    scrollPending.current = true;
    band.tapInstrument(id);
  };

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
        .jl-info-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--jl-gold);
          margin-bottom: 8px;
        }
        .jl-info-card .jl-info-kicker {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #a8904a;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .jl-info-card p { color: #b9ae9a; }
        .jl-info-empty {
          text-align: center;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          color: #9a907f;
          letter-spacing: 1px;
          padding: 12px 0;
        }
        @media (max-width: 600px) {
          .jl-slot-icon svg { width: 38px; height: 38px; }
          .jl-slot-remove { right: calc(50% - 44px); }
        }

        /* The players on the stage floor: they walk on from the wings, and off again. */
        .jl-stage-floor {
          --floor: clamp(96px, 16vw, 150px);
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          align-items: end;
          height: var(--floor);
          margin: 30px 0 0;
        }
        /* The instruments sit closer under the players. */
        #jl-panel-band .jl-band-slots { min-height: 0; padding-top: 18px; }
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
          .jl-stage-floor { margin-top: 30px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jl-player, .jl-player.is-leaving, .jl-player:not(.is-leaving) .jl-player-legs { animation: none; }
          .jl-player.is-leaving { display: none; }
        }
      `}</style>

      <div className="jl-instructions">
        Tap an instrument to <em>bring it on stage and give it the spotlight</em>.<br />
        Tap another player to <em>pass the spotlight</em>, or tap the soloist to let the <em>whole band</em> play evenly.<br />
        Use <em>{'×'}</em> to send a player off stage.
      </div>

      {/* Section Selector */}
      <div className="jl-section-container">
        <div className="jl-section-label">{'\u{25C6}'} Song Section {'\u{25C6}'}</div>
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

      <div className="jl-info-panel" ref={cardRef}>
        {factInstrument ? (
          <div className="jl-info-card" key={factInstrument.id}>
            <p className="jl-info-kicker">
              {band.spotlight === factInstrument.id
                ? 'In the spotlight'
                : band.active.has(factInstrument.id)
                  ? 'On stage'
                  : 'Off stage'}
            </p>
            <h2>{factInstrument.fact.title}</h2>
            <p>{factInstrument.fact.text}</p>
            {factInstrument.fact.quote && <div className="jl-fact">{factInstrument.fact.quote}</div>}
          </div>
        ) : (
          <p className="jl-info-empty">Tap an instrument to meet it.</p>
        )}
      </div>

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
