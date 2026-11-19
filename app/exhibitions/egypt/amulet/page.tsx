'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, StepDots } from '../RoomShell';
import PutInTomb from '../PutInTomb';
import DarkIntro from '../DarkIntro';
import PrintSheet from '../PrintSheet';
import { DragGhost, useDragDrop } from '../dragKit';
import { spell } from '../hieroglyph-name/alphabet';
import AmuletArt, { Beetle } from './AmuletArt';
import { saveAmulet } from './savedAmulet';
import {
  AMULET_INTRO,
  AMULET_NOTES,
  AMULET_SOURCES,
  AMULET_STEPS,
  FOR_WHOM,
  MATERIALS,
  MAX_SYMBOLS,
  NEEDS,
  SHAPES,
  SYMBOLS,
  carveFeedback,
  fitSummary,
  toggleSymbol,
  type ForWhomId,
  type MaterialId,
  type ShapeId,
  type SymbolId,
} from './amulets';
import './amulet.css';
import { playEgypt } from '../egyptSound';

/*
 * The point: you read what each symbol meant to the Egyptians, and choose
 * the ones that fit what your amulet should protect.
 *
 * Design an Amulet, as a craft at a workbench: the amulet sits in the
 * middle on its cloth, always in view; the tools for the step are on one
 * side and what the visitor has just learned on the other, with Back and
 * Next in their own bar beneath (so nothing ever slides under them). Four
 * steps (it was five, and "a lot of clicking"): who it is for, their name
 * (or the visitor's own) and what it should protect, all on one bench; the
 * blank (its shape and its material); carving, the challenge: tap a symbol
 * to pick it up and read what it meant, then tap the amulet to carve it
 * (or drag it there); the room says whether its meaning fits, with a hint
 * if not (nothing is marked in advance); and the finished amulet, with
 * how its symbols fit, to print and to put in the visitor's tomb.
 * It opens with the Egypt rooms' dark intro.
 *
 * The finished amulet is saved in this browser (savedAmulet.ts), so that
 * Mummification can tuck it into the wrappings and Build Your Own Tomb can
 * lay it in the chamber's niche. Nothing typed is sent anywhere.
 */

const STEPS = AMULET_STEPS;
type StepId = (typeof STEPS)[number]['id'];

/** A symbol as it shows on a tile: its hieroglyph, or for the scarab a small drawn beetle. */
function SymbolMark({ id, size = 34 }: { id: SymbolId; size?: number }) {
  if (id === 'scarab')
    return (
      <svg className="ega-mark ega-mark-beetle" width={size} height={size} viewBox="-210 -210 420 420" aria-hidden="true">
        <Beetle fill="currentColor" line="currentColor" lineWidth={10} />
      </svg>
    );
  return <Glyphs text={SYMBOLS.find((s) => s.id === id)!.glyph} className="ega-mark" />;
}

export default function AmuletMaker() {
  const [intro, setIntro] = useState(true);
  const [forWhom, setForWhom] = useState<ForWhomId | null>(null);
  const [need, setNeed] = useState<string | null>(null);
  const [shape, setShape] = useState<ShapeId>('scarab');
  const [material, setMaterial] = useState<MaterialId>('faience');
  const [chosen, setChosen] = useState<SymbolId[]>([]);
  const [holding, setHolding] = useState<SymbolId | null>(null);
  const [owner, setOwner] = useState('');
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const [at, setAt] = useState(0);
  // The symbol last carved, whose meaning shows beside the bench.
  const [latestId, setLatestId] = useState<SymbolId | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const step: StepId = STEPS[at].id;
  const nameGlyphs = useMemo(() => spell(owner).map((s) => s.glyphs).join(''), [owner]);
  const picked = chosen.map((id) => SYMBOLS.find((s) => s.id === id)!);
  const shapeName = SHAPES.find((s) => s.id === shape)!.name.toLowerCase();
  const materialName = MATERIALS.find((m) => m.id === material)!.name.toLowerCase();
  const who = FOR_WHOM.find((f) => f.id === forWhom);
  const label = `Your amulet: a ${shapeName} of ${materialName}${picked.length ? `, carved with ${picked.map((p) => `the ${p.name.toLowerCase()}`).join(' and ')}` : ''}${owner.trim() ? `, and the name ${owner.trim()} in hieroglyphs` : ''}`;
  const printed = useCallback(() => setPrinting(false), []);
  const needName = NEEDS.find((n) => n.id === need)?.name.toLowerCase() ?? '';
  const held = holding ? SYMBOLS.find((s) => s.id === holding) : undefined;
  const title = owner.trim() ? `${owner.trim()}’s amulet` : (who?.title ?? 'My amulet');
  const latest = latestId && chosen.includes(latestId) ? SYMBOLS.find((s) => s.id === latestId) : undefined;
  const full = chosen.length >= MAX_SYMBOLS;

  const go = (i: number) => {
    const to = Math.max(0, Math.min(STEPS.length - 1, i));
    setAt(to);
    setHolding(null);
    setStatus(`Step ${to + 1} of ${STEPS.length}: ${STEPS[to].title}`);
  };
  // A new step: the focus to its heading (not on the first render).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [at]);
  // The finished amulet is kept in this browser for the other rooms.
  useEffect(() => {
    if (step === 'finish') saveAmulet({ shape, material, symbols: chosen, name: owner.trim(), nameGlyphs });
  }, [step, shape, material, chosen, owner, nameGlyphs]);

  const stepDone = (i: number) => {
    const id = STEPS[i].id;
    return id === 'who' ? forWhom !== null && need !== null : id === 'carve' ? chosen.length > 0 : i < at;
  };
  const canGoOn = step === 'who' ? forWhom !== null && need !== null : step === 'carve' ? chosen.length > 0 : true;

  const carve = (id: SymbolId) => {
    setHolding(null);
    if (chosen.includes(id)) return;
    const next = toggleSymbol(chosen, id);
    const name = SYMBOLS.find((s) => s.id === id)!.name;
    if (next === chosen) {
      setStatus(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
      return;
    }
    playEgypt('chisel');
    setLatestId(id);
    setChosen(next);
    setStatus(`${name} carved. ${carveFeedback(need, id).text}`);
  };
  const takeOff = (id: SymbolId) => {
    setChosen((c) => c.filter((s) => s !== id));
    setStatus(`${SYMBOLS.find((s) => s.id === id)!.name} taken off.`);
  };
  const { drag, carrying, start } = useDragDrop<SymbolId>((id, d) => {
    if (d.target === 'amulet') carve(id);
  });

  /* ───── The tools for each step ───── */
  const tools =
    step === 'who' ? (
      <>
        <fieldset className="egr-choice">
          <legend>Choose one</legend>
          <div className="ega-tiles">
            {FOR_WHOM.map((f) => (
              <button key={f.id} type="button" className="egr-option ega-tile" aria-pressed={forWhom === f.id} onClick={() => setForWhom(f.id)}>
                {f.name}
              </button>
            ))}
          </div>
        </fieldset>
        {who && (
          <label className="egr-field ega-name">
            <span className="egr-label">{who.ask}, to carve on it (if you like)</span>
            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} maxLength={24} autoComplete="off" spellCheck={false} placeholder={who.placeholder} />
          </label>
        )}
        {who && (
          <fieldset className="egr-choice">
            {/* REVIEW: new text */}
            <legend>What should it protect?</legend>
            <div className="ega-tiles">
              {NEEDS.map((n) => (
                <button key={n.id} type="button" className="egr-option ega-tile" aria-pressed={need === n.id} onClick={() => setNeed(n.id)}>
                  {n.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </>
    ) : step === 'blank' ? (
      <>
        <fieldset className="egr-choice">
          <legend>Its shape</legend>
          <div className="ega-blanks">
            {SHAPES.map((s) => (
              <button key={s.id} type="button" className="egr-option ega-blank" aria-pressed={shape === s.id} onClick={() => setShape(s.id)}>
                <AmuletArt className="ega-blank-art" idPrefix={`ega-blank-${s.id}`} shape={s.id} material={material} symbols={[]} nameGlyphs="" label="" />
                {s.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="egr-choice">
          <legend>Its material</legend>
          <div className="ega-tiles">
            {MATERIALS.map((m) => (
              <button key={m.id} type="button" className={`egr-option ega-tile ega-material is-${m.id}`} aria-pressed={material === m.id} onClick={() => setMaterial(m.id)}>
                <span className="ega-swatch" aria-hidden="true" />
                {m.name}
              </button>
            ))}
          </div>
        </fieldset>
      </>
    ) : step === 'carve' ? (
      <fieldset className="egr-choice">
        <legend>
          Symbols · {chosen.length} of {MAX_SYMBOLS} carved
        </legend>
        <div className="ega-tray" role="group" aria-label="The symbols">
          {SYMBOLS.map((s) => {
            const on = chosen.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className="ega-symbol egk-carry"
                aria-pressed={holding === s.id}
                disabled={on}
                aria-label={`${s.name}${on ? ' (carved)' : ''}`}
                onPointerDown={(e) => !on && !full && start(s.id, e)}
                onClick={() => {
                  if (full) {
                    setStatus(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
                    return;
                  }
                  const picking = holding !== s.id;
                  setHolding(picking ? s.id : null);
                  setStatus(picking ? `${s.name} picked up. ${s.meaning.text} Tap the amulet to carve it.` : '');
                }}
              >
                <SymbolMark id={s.id} />
                <span className="ega-symbol-name">{s.name}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    ) : (
      <div className="ega-meanings">
        <p className="egr-label">What your symbols meant</p>
        {picked.map((p) => (
          <div key={p.id} className="ega-meaning">
            <h3>
              <SymbolMark id={p.id} size={28} /> {p.name}
            </h3>
            <FactNote fact={p.meaning} className="egr-fact" />
          </div>
        ))}
      </div>
    );

  /* ───── One instruction: what to do now ───── */
  const task =
    // REVIEW: new text (the who and carve tasks).
    step === 'who'
      ? !forWhom
        ? 'Who will wear your amulet? Choose one.'
        : !need
          ? `Type ${forWhom === 'me' ? 'your' : forWhom === 'pet' ? 'your pet’s' : 'their'} name to carve on it (or leave it blank), and choose what it should protect.`
          : 'Ready? Next, its shape.'
      : step === 'blank'
        ? 'Pick a shape and a material. Watch your amulet change.'
        : step === 'carve'
          ? holding
            ? 'Does its meaning fit? Tap the amulet to carve it.'
            : full
              ? 'Your amulet is full. Take a symbol off to change it.'
              : `Tap a symbol to read what it meant. Carve the ones that fit ${needName || 'your amulet'}.`
          : 'Print it, and put it in your tomb.';

  /* ───── Beside the bench: what was just learned, or the finished amulet's actions ───── */
  const side =
    step === 'blank' && material === 'faience' ? (
      <FactNote fact={AMULET_NOTES.faience} className="egr-fact" />
    ) : step === 'carve' && held ? (
      <div className="ega-meaning" key={`held-${held.id}`}>
        <p className="egr-label">Picked up</p>
        <h3>
          <SymbolMark id={held.id} size={28} /> {held.name}
        </h3>
        <FactNote fact={held.meaning} className="egr-fact" />
        {/* REVIEW: new text */}
        <p className="ega-ask">Does it fit {needName}? Tap the amulet to carve it, or pick another.</p>
      </div>
    ) : step === 'carve' && latest ? (
      <div className="ega-meaning" key={latest.id}>
        <h3>
          <SymbolMark id={latest.id} size={28} /> {latest.name}
        </h3>
        <FactNote fact={latest.meaning} className="egr-fact" />
        <p className={`ega-verdict ${carveFeedback(need, latest.id).fits ? 'is-fit' : 'is-hint'}`}>{carveFeedback(need, latest.id).text}</p>
      </div>
    ) : step === 'finish' ? (
      <div className="ega-finish">
        {fitSummary(need, chosen) && <p className="ega-verdict is-fit">{fitSummary(need, chosen)}</p>}
        <FactNote fact={AMULET_NOTES.amulets} className="egr-fact" />
        <button type="button" className="egr-button" onClick={() => setPrinting(true)}>
          Print my amulet
        </button>
        <div className="egr-put-compact">
          {/* REVIEW: new text */}
          <PutInTomb activity="amulet" what="your amulet" onPut={() => saveAmulet({ shape, material, symbols: chosen, name: owner.trim(), nameGlyphs })} />
        </div>
        <p className="egr-credit">Your amulet is saved in this browser only. You can also tuck it into a mummy:</p>
        <div className="ega-links">
          <Link className="egr-button" href="/exhibitions/egypt/mummification">
            Tuck it into a mummy
          </Link>
        </div>
      </div>
    ) : null;

  return (
    <RoomShell className="eg-amulet" sources={AMULET_SOURCES} fit>
      {intro && <DarkIntro title="Design an Amulet" lines={AMULET_INTRO} voice="amulet-intro" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · The amulet maker" title="Design an Amulet" />

      <section className={`ega-workshop egr-fill is-${step}${side ? '' : ' no-side'}`} aria-labelledby="ega-step-title" data-carrying={carrying ? '' : undefined}>
        <div className="ega-strip">
          <StepDots steps={STEPS} at={at} done={stepDone} onGo={go} label="The amulet’s steps" />
          <h2 id="ega-step-title" ref={heading} tabIndex={-1}>
            {STEPS[at].title}
          </h2>
          <p className="egr-task">{task}</p>
        </div>

        <div className="ega-tools">{tools}</div>

        <div className="ega-bench egr-sizer">
          <div
            className={`ega-on-bench ${holding ? 'is-ready' : ''}`}
            data-drop={step === 'carve' ? 'amulet' : undefined}
            onClick={() => holding && carve(holding)}
            role={holding ? 'button' : undefined}
            tabIndex={holding ? 0 : undefined}
            aria-label={holding ? `Carve the ${SYMBOLS.find((s) => s.id === holding)!.name.toLowerCase()} on your amulet` : undefined}
            onKeyDown={(e) => {
              if (holding && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                carve(holding);
              }
            }}
          >
            <AmuletArt className="ega-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label={label} />
          </div>
          {step === 'carve' && chosen.length > 0 && (
            <div className="ega-carved" role="group" aria-label="Carved on your amulet">
              {chosen.map((id) => (
                <button key={id} type="button" className="egr-option ega-chip" onClick={() => takeOff(id)}>
                  <span aria-hidden="true">✕</span> Take off the {SYMBOLS.find((s) => s.id === id)!.name.toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {side && (
          <aside className="ega-side" aria-label="What you have learned">
            {side}
          </aside>
        )}

        <div className="egr-step-nav ega-nav">
          <button type="button" className="egr-button" onClick={() => go(at - 1)} disabled={at === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
          <button type="button" className="egr-button egr-button-primary" onClick={() => go(at + 1)} disabled={at === STEPS.length - 1 || !canGoOn}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <DragGhost at={drag}>
        {drag && (
          <span className="ega-ghost">
            <SymbolMark id={drag.item} size={48} />
          </span>
        )}
      </DragGhost>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>

      <PrintSheet printing={printing} onDone={printed}>
        <div className="ega-print">
          <h1>{title}</h1>
          <AmuletArt idPrefix="ega-print" className="ega-print-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label="" />
          <div className="ega-print-meanings">
            {picked.map((p) => (
              <p key={p.id}>
                <strong>{p.name}.</strong> {p.meaning.text}
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
