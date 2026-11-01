'use client';

import { useCallback, useMemo, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader, TombDoor } from '../RoomShell';
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

/*
 * Design an Amulet: first, who it is for and what it should protect; the
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
  const [tomb, updateTomb] = useTomb();
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

  const toggle = (id: SymbolId) => {
    const next = toggleSymbol(chosen, id);
    const name = SYMBOLS.find((s) => s.id === id)!.name;
    if (next === chosen) setStatus(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
    else setStatus(next.includes(id) ? `${name} added.` : `${name} taken off.`);
    setChosen(next);
  };

  const place = () => {
    updateTomb((s) => ({ ...s, amulet: { shape, material, symbols: chosen, owner: owner.trim() }, done: { ...s.done, amulet: true } }));
    setStatus('Your amulet is placed in the tomb’s niche.');
  };

  return (
    <RoomShell className="eg-amulet" sources={AMULET_SOURCES}>
      <RoomHeader kicker="Interactive · The amulet maker" title="Design an Amulet">
        <p className="egr-lede">Decide who your amulet is for and what it should protect. Then choose its shape, its material and the symbols to carve on it.</p>
      </RoomHeader>

      <div className="egr-layout">
        <div className="egr-scene ega-bench">
          <AmuletArt className="ega-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label={label} />
        </div>

        <section className="egr-panel" aria-label="Design your amulet">
          <div className="ega-purpose">
            <p className="egr-label">First</p>
            <fieldset className="egr-choice">
              <legend>Who is it for?</legend>
              <div className="egr-options">
                {FOR_WHOM.map((f) => (
                  <button key={f.id} type="button" className="egr-option" aria-pressed={forWhom === f.id} onClick={() => setForWhom(f.id)}>
                    {f.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="egr-choice">
              <legend>What should it protect?</legend>
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
                An Egyptian might choose: <strong>{suggested.map((id) => SYMBOLS.find((s) => s.id === id)!.name).join(', ')}</strong>. They are marked below, but you can choose any you like.
              </p>
            )}
          </div>

          <fieldset className="egr-choice">
            <legend>Shape</legend>
            <div className="egr-options">
              {SHAPES.map((s) => (
                <button key={s.id} type="button" className="egr-option" aria-pressed={shape === s.id} onClick={() => setShape(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="egr-choice">
            <legend>Material</legend>
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
          <fieldset className="egr-choice">
            <legend>
              Symbols ({chosen.length} of {MAX_SYMBOLS})
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

          {picked.length > 0 && (
            <div className="ega-meanings">
              <h2>What your symbols meant</h2>
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

          <label className="egr-field">
            <span className="egr-label">Carve a name on it (optional)</span>
            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} maxLength={24} autoComplete="off" spellCheck={false} placeholder="Your name" />
          </label>

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
          <p className="egr-credit">Nothing you type is sent anywhere. If you place your amulet in the tomb, it is kept only in this browser.</p>
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
