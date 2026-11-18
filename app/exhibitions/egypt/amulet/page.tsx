'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, StepDots, TombDoor } from '../RoomShell';
import PrintSheet from '../PrintSheet';
import { spell } from '../hieroglyph-name/alphabet';
import { useTomb } from '../tombState';
import AmuletArt from './AmuletArt';
import {
  AMULET_NOTES,
  AMULET_SOURCES,
  FOR_WHOM,
  MATERIALS,
  MAX_SYMBOLS,
  NEEDS,
  SHAPES,
  SYMBOLS,
  toggleSymbol,
  type ForWhomId,
  type MaterialId,
  type ShapeId,
  type SymbolId,
} from './amulets';
import './amulet.css';
import { playEgypt } from '../egyptSound';

/** The maker's seven steps, one choice to a screen. */
const STEPS = [
  { id: 'who', title: 'Who is it for?' },
  { id: 'need', title: 'What should it protect?' },
  { id: 'shape', title: 'Choose a shape' },
  { id: 'material', title: 'Choose a material' },
  { id: 'symbols', title: 'Choose up to three symbols' },
  { id: 'name', title: 'Carve a name on it' },
  { id: 'finish', title: 'Your amulet is ready' },
] as const;
type StepId = (typeof STEPS)[number]['id'];

/*
 * Design an Amulet, one choice to a screen ("Step 1 of 7", Back and Next),
 * with the amulet always in view beside the choice (above it, on a tablet
 * or a phone). First, who it is for and what it should protect; the
 * symbols an Egyptian might have chosen for that are marked as suggestions,
 * though any can be chosen. Then a shape, a material and up to three
 * symbols, each symbol's meaning appearing as it is chosen. Add a name
 * (spelled with the name room's chart), print the amulet on a Letter page
 * with what its symbols meant, or place it in the tomb's niche, where the
 * mummification room can tuck it into the wrappings too (kept in this
 * browser only). Nothing typed is sent anywhere.
 */

export default function AmuletMaker() {
  const [forWhom, setForWhom] = useState<ForWhomId | null>(null);
  const [need, setNeed] = useState<string | null>(null);
  const [shape, setShape] = useState<ShapeId>('scarab');
  const [material, setMaterial] = useState<MaterialId>('faience');
  const [chosen, setChosen] = useState<SymbolId[]>(['ankh']);
  const [owner, setOwner] = useState('');
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const [at, setAt] = useState(0);
  // The symbol last added, whose meaning shows as it is chosen.
  const [latestId, setLatestId] = useState<SymbolId | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const [tomb, updateTomb] = useTomb();
  const step: StepId = STEPS[at].id;
  const nameGlyphs = useMemo(() => spell(owner).map((s) => s.glyphs).join(''), [owner]);
  const picked = chosen.map((id) => SYMBOLS.find((s) => s.id === id)!);
  const shapeName = SHAPES.find((s) => s.id === shape)!.name.toLowerCase();
  const materialName = MATERIALS.find((m) => m.id === material)!.name.toLowerCase();
  const label = `Your amulet: a ${shapeName} of ${materialName}${picked.length ? `, carved with ${picked.map((p) => `the ${p.name.toLowerCase()}`).join(' and ')}` : ''}${owner.trim() ? `, and the name ${owner.trim()} in hieroglyphs` : ''}`;
  const done = useCallback(() => setPrinting(false), []);
  const suggested = NEEDS.find((n) => n.id === need)?.suggests ?? [];
  const title = owner.trim() ? `${owner.trim()}’s amulet` : (FOR_WHOM.find((f) => f.id === forWhom)?.title ?? 'My amulet');
  const saved = tomb.amulet;
  const placed = !!saved && saved.shape === shape && saved.material === material && saved.owner === owner.trim() && saved.symbols.join() === chosen.join();

  const latest = latestId && chosen.includes(latestId) ? SYMBOLS.find((s) => s.id === latestId) : undefined;

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setAt(to);
    setStatus(`Step ${to + 1} of ${STEPS.length}: ${STEPS[to].title}`);
  };
  // A new step: the focus to its heading (not on the first render).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [at]);
  const stepDone = (i: number) => {
    const id = STEPS[i].id;
    return id === 'who' ? forWhom !== null : id === 'need' ? need !== null : id === 'symbols' ? chosen.length > 0 : id === 'name' ? !!owner.trim() : id === 'finish' ? placed : i < at;
  };

  const toggle = (id: SymbolId) => {
    const next = toggleSymbol(chosen, id);
    const name = SYMBOLS.find((s) => s.id === id)!.name;
    if (next === chosen) setStatus(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
    else setStatus(next.includes(id) ? `${name} added.` : `${name} taken off.`);
    if (next !== chosen && next.includes(id)) {
      playEgypt('find');
      setLatestId(id);
    }
    setChosen(next);
  };

  const place = () => {
    playEgypt('grind');
    updateTomb((s) => ({ ...s, amulet: { shape, material, symbols: chosen, owner: owner.trim() }, done: { ...s.done, amulet: true } }));
    setStatus('Your amulet is placed in the tomb’s niche.');
  };

  return (
    <RoomShell className="eg-amulet" sources={AMULET_SOURCES} fit>
      <RoomHeader kicker="Interactive · The amulet maker" title="Design an Amulet">
        <p className="egr-lede">Make an amulet, one choice at a time: who it is for, what it should protect, its shape, its material and its symbols.</p>
      </RoomHeader>

      <div className="egr-layout egr-fill">
        <div className="egr-scene ega-bench egr-sizer">
          <AmuletArt className="ega-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label={label} />
        </div>

        <section className="egr-panel egr-stepper" aria-labelledby="ega-step-title">
          <div className="egr-step-body">
            <StepDots steps={STEPS} at={at} done={stepDone} onGo={go} label="The amulet’s steps" />
            <h2 id="ega-step-title" ref={heading} tabIndex={-1}>
              {STEPS[at].title}
            </h2>

            {step === 'who' && (
              <fieldset className="egr-choice">
                <legend>Choose one</legend>
                <div className="egr-options">
                  {FOR_WHOM.map((f) => (
                    <button key={f.id} type="button" className="egr-option" aria-pressed={forWhom === f.id} onClick={() => setForWhom(f.id)}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 'need' && (
              <>
                <fieldset className="egr-choice">
                  <legend>Choose one</legend>
                  <div className="egr-options">
                    {NEEDS.map((n) => (
                      <button key={n.id} type="button" className="egr-option" aria-pressed={need === n.id} onClick={() => setNeed(n.id)}>
                        {n.name}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {need && (
                  <p className="ega-suggest">
                    An Egyptian might choose: <strong>{suggested.map((id) => SYMBOLS.find((s) => s.id === id)!.name).join(', ')}</strong>. They are marked when you choose symbols, but you can choose any you like.
                  </p>
                )}
              </>
            )}

            {step === 'shape' && (
              <fieldset className="egr-choice">
                <legend>Choose one</legend>
                <div className="egr-options">
                  {SHAPES.map((s) => (
                    <button key={s.id} type="button" className="egr-option" aria-pressed={shape === s.id} onClick={() => setShape(s.id)}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 'material' && (
              <>
                <fieldset className="egr-choice">
                  <legend>Choose one</legend>
                  <div className="egr-options">
                    {MATERIALS.map((m) => (
                      <button key={m.id} type="button" className="egr-option" aria-pressed={material === m.id} onClick={() => setMaterial(m.id)}>
                        <span className="ega-swatch" style={{ background: m.face }} aria-hidden="true" />
                        {m.name}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {material === 'faience' && <FactNote fact={AMULET_NOTES.faience} className="egr-fact" />}
              </>
            )}

            {step === 'symbols' && (
              <>
                <fieldset className="egr-choice">
                  <legend>
                    Tap to add or take off · {chosen.length} of {MAX_SYMBOLS}
                  </legend>
                  <div className="egr-options">
                    {SYMBOLS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`egr-option ega-symbol ${suggested.includes(s.id) ? 'is-suggested' : ''}`}
                        aria-pressed={chosen.includes(s.id)}
                        onClick={() => toggle(s.id)}
                        aria-label={`${s.name}${suggested.includes(s.id) ? ' (suggested)' : ''}`}
                      >
                        <Glyphs text={s.glyph} className="ega-symbol-glyph" />
                        {s.name}
                        {suggested.includes(s.id) && (
                          <span className="ega-tag" aria-hidden="true">
                            suggested
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {latest && (
                  <div className="ega-meaning" key={latest.id}>
                    <h3>
                      <Glyphs text={latest.glyph} className="ega-meaning-glyph" /> {latest.name}
                    </h3>
                    <FactNote fact={latest.meaning} className="egr-fact" />
                  </div>
                )}
              </>
            )}

            {step === 'name' && (
              <>
                <label className="egr-field">
                  <span className="egr-label">Carve a name on it (optional)</span>
                  <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} maxLength={24} autoComplete="off" spellCheck={false} placeholder="Your name" />
                </label>
                <p className="egr-credit">The name is spelled with the chart from “Your Name in Hieroglyphs”. Nothing you type is sent anywhere.</p>
              </>
            )}

            {step === 'finish' && (
              <>
                {picked.length > 0 && (
                  <div className="ega-meanings">
                    <p className="egr-label">What your symbols meant</p>
                    {picked.map((p) => (
                      <div key={p.id} className="ega-meaning">
                        <h3>
                          <Glyphs text={p.glyph} className="ega-meaning-glyph" /> {p.name}
                        </h3>
                        <FactNote fact={p.meaning} className="egr-fact" />
                      </div>
                    ))}
                  </div>
                )}
                <FactNote fact={AMULET_NOTES.amulets} className="egr-fact" />
                <div className="egr-actions">
                  <button type="button" className="egr-button egr-button-primary" onClick={() => setPrinting(true)}>
                    Print my amulet
                  </button>
                  <button type="button" className="egr-button" onClick={place} disabled={placed}>
                    {placed ? 'In the tomb’s niche ✓' : 'Place it in the tomb'}
                  </button>
                </div>
                {placed && <TombDoor>See it in the tomb</TombDoor>}
                <p className="egr-credit">If you place your amulet in the tomb, it is kept only in this browser.</p>
              </>
            )}
          </div>

          <div className="egr-step-nav">
            <button type="button" className="egr-button" onClick={() => go(at - 1)} disabled={at === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(at + 1)} disabled={at === STEPS.length - 1}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>

      <PrintSheet printing={printing} onDone={done}>
        <div className="ega-print">
          <h1>{title}</h1>
          <AmuletArt idPrefix="ega-print" className="ega-print-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label="" />
          <div className="ega-print-meanings">
            {picked.map((p) => (
              <p key={p.id}>
                <strong>
                  <span className="egr-glyph">{p.glyph}</span> {p.name}.
                </strong>{' '}
                {p.meaning.text}
              </p>
            ))}
          </div>
          <p className="egr-print-sources">
            <FactSources sources={[...new Map(picked.flatMap((p) => p.meaning.sources).map((s) => [s.href, s])).values()]} className="ega-print-source" /> · The Mini Museum, Ancient Egypt
          </p>
        </div>
      </PrintSheet>
    </RoomShell>
  );
}
