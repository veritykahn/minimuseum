'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell, { Glyphs, RoomHeader } from '../RoomShell';
import { GLYPHS } from '../rooms';
import MummyScene from './MummyScene';
import { ANUBIS_POSTER, JARS, LAYERS, ORGANS, STEPS, WRAP_AMULETS, jarFor } from './steps';
import './mummy.css';

/*
 * Mummification, step by step: seven steps across the seventy days, each a
 * tab (and #address) with Back and Next. The embalmers' table shows the
 * step; the visitor does a little of the work: matches each organ to its
 * canopic jar, sets the forty days of natron going, and wraps the linen,
 * tucking amulets between the layers. The facts are museum notes with their
 * sources (steps.ts).
 */

export default function Mummification() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [organ, setOrgan] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[]>([]);
  const [days, setDays] = useState(0);
  const [layers, setLayers] = useState(0);
  const [amulets, setAmulets] = useState<{ id: string; glyph: string; layer: number }[]>([]);
  const [status, setStatus] = useState('');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const step = STEPS[index];

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
    window.history.replaceState(null, '', `#${STEPS[to].id}`);
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

  // The canopic jars: choose an organ, then the jar of the god who protects it.
  const pickJar = (god: string) => {
    if (!organ) {
      setStatus('First choose an organ.');
      return;
    }
    const jar = jarFor(organ);
    if (jar.god === god) {
      setFilled((f) => (f.includes(god) ? f : [...f, god]));
      setStatus(`Yes: ${jar.head}-headed ${jar.god} protects the ${organ}.`);
      setOrgan(null);
    } else {
      setStatus(`Not that jar. Which god protects the ${organ}?`);
    }
  };

  const startNatron = () => {
    if (timer.current) clearInterval(timer.current);
    if (reduced) {
      setDays(40);
      setStatus('Forty days have passed.');
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
        setStatus('Forty days have passed.');
      }
    }, 70);
  };

  const wrapLayer = () => {
    const n = Math.min(LAYERS, layers + 1);
    setLayers(n);
    setStatus(n >= LAYERS ? 'The last layer of linen is on.' : `Layer ${n} of ${LAYERS} of linen.`);
  };
  const tuck = (id: string) => {
    const a = WRAP_AMULETS.find((x) => x.id === id)!;
    setAmulets((list) => [...list, { id, glyph: a.glyph, layer: layers }]);
    setStatus(`A ${a.name.toLowerCase()} is tucked into the wrappings.`);
  };
  const lastAmulet = WRAP_AMULETS.find((a) => a.id === amulets[amulets.length - 1]?.id);

  return (
    <RoomShell className="eg-mummy">
      <RoomHeader kicker="Interactive · Seventy days" title="Mummification, Step by Step">
        <p className="egr-lede">Follow the embalmers through the seventy days, one step at a time.</p>
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
          <div
            role="img"
            aria-label={
              step.id === 'coffin'
                ? 'The wrapped body inside a coffin shaped like a person, with a painted face'
                : step.id === 'wrap'
                  ? `The body on the embalmers’ bed, wrapped in ${layers} of ${LAYERS} layers of linen`
                  : step.id === 'natron'
                    ? 'The body on the embalmers’ bed, heaped over with white natron salt'
                    : 'A body lying on the embalmers’ lion-legged bed, under a sheet'
            }
          >
            <MummyScene step={step.id} filled={filled} layers={layers} amulets={amulets} />
          </div>
          {step.id === 'natron' && (
            <p className="egm-days" aria-hidden="true">
              <span>{days}</span> {days === 1 ? 'day' : 'days'} in natron
            </p>
          )}
        </div>

        <section className="egr-panel" aria-labelledby="egm-title">
          <p className="egr-label">
            Step {index + 1} of {STEPS.length} · {step.when}
          </p>
          <h2 id="egm-title">{step.title}</h2>

          {step.id === 'why' && <p className="egr-poster">{ANUBIS_POSTER}</p>}

          {step.notes.map((n) => (
            <FactNote key={n.text} fact={n} className="egr-fact" />
          ))}

          {step.id === 'organs' && (
            <div className="egm-match">
              <fieldset className="egr-choice">
                <legend>1. Choose an organ</legend>
                <div className="egr-options">
                  {ORGANS.map((o) => {
                    const done = filled.includes(jarFor(o).god);
                    return (
                      <button key={o} type="button" className="egr-option" aria-pressed={organ === o} disabled={done} onClick={() => setOrgan(o)}>
                        {o[0].toUpperCase() + o.slice(1)}
                        {done && <span aria-label=" (in its jar)"> ✓</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="egr-choice">
                <legend>2. Choose its jar</legend>
                <div className="egr-options">
                  {JARS.map((j) => (
                    <button key={j.god} type="button" className="egr-option egm-jar-button" onClick={() => pickJar(j.god)} aria-label={`${j.god}, the ${j.head}-headed jar`}>
                      <Glyphs text={GLYPHS[j.glyph]} className="egm-jar-glyph" />
                      <span aria-hidden="true">{j.god}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {filled.length === JARS.length && <p className="egm-done">All four organs are safe in their jars.</p>}
            </div>
          )}

          {step.id === 'natron' && (
            <div className="egr-actions">
              <button type="button" className="egr-button" onClick={startNatron}>
                {days >= 40 ? 'Count the 40 days again' : 'Start the 40 days'}
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
                <legend>Tuck in an amulet</legend>
                <div className="egr-options">
                  {WRAP_AMULETS.map((a) => (
                    <button key={a.id} type="button" className="egr-option" onClick={() => tuck(a.id)} disabled={layers >= LAYERS || amulets.length >= 6}>
                      <Glyphs text={a.glyph} className="egm-amulet-glyph" />
                      {a.name}
                    </button>
                  ))}
                </div>
              </fieldset>
              {lastAmulet && <FactNote fact={lastAmulet.note} className="egr-fact" />}
            </>
          )}

          <div className="egr-actions egm-nav">
            <button type="button" className="egr-button" onClick={() => go(index - 1)} disabled={index === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(index + 1)} disabled={index === STEPS.length - 1}>
              Next step <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
