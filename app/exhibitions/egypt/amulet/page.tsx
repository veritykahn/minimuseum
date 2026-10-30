'use client';

import { useCallback, useMemo, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import RoomShell, { Glyphs, RoomHeader } from '../RoomShell';
import PrintSheet from '../PrintSheet';
import { spell } from '../hieroglyph-name/alphabet';
import AmuletArt from './AmuletArt';
import { AMULET_NOTES, MATERIALS, MAX_SYMBOLS, SHAPES, SYMBOLS, toggleSymbol, type MaterialId, type ShapeId, type SymbolId } from './amulets';
import './amulet.css';

/*
 * Design an Amulet: choose a shape, a material and up to three symbols; each
 * symbol's meaning appears as it is chosen, with its source. Add your name
 * (spelled with the name room's chart) and print the amulet on a Letter
 * page with what its symbols meant. Nothing typed is stored or sent.
 */

export default function AmuletMaker() {
  const [shape, setShape] = useState<ShapeId>('scarab');
  const [material, setMaterial] = useState<MaterialId>('faience');
  const [chosen, setChosen] = useState<SymbolId[]>(['ankh']);
  const [owner, setOwner] = useState('');
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const nameGlyphs = useMemo(() => spell(owner).map((s) => s.glyphs).join(''), [owner]);
  const picked = chosen.map((id) => SYMBOLS.find((s) => s.id === id)!);
  const shapeName = SHAPES.find((s) => s.id === shape)!.name.toLowerCase();
  const materialName = MATERIALS.find((m) => m.id === material)!.name.toLowerCase();
  const label = `Your amulet: a ${shapeName} of ${materialName}${picked.length ? `, carved with ${picked.map((p) => `the ${p.name.toLowerCase()}`).join(' and ')}` : ''}${owner.trim() ? `, and the name ${owner.trim()} in hieroglyphs` : ''}`;
  const done = useCallback(() => setPrinting(false), []);

  const toggle = (id: SymbolId) => {
    const next = toggleSymbol(chosen, id);
    const name = SYMBOLS.find((s) => s.id === id)!.name;
    if (next === chosen) setStatus(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
    else setStatus(next.includes(id) ? `${name} added.` : `${name} taken off.`);
    setChosen(next);
  };

  return (
    <RoomShell className="eg-amulet">
      <RoomHeader kicker="Interactive · The amulet maker" title="Design an Amulet">
        <p className="egr-lede">Choose a shape, a material and the symbols to carve on it. Find out what each one meant, then print your amulet.</p>
      </RoomHeader>

      <div className="egr-layout">
        <div className="egr-scene ega-bench">
          <AmuletArt className="ega-art" shape={shape} material={material} symbols={chosen} nameGlyphs={nameGlyphs} label={label} />
        </div>

        <section className="egr-panel" aria-label="Design your amulet">
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
                <button key={s.id} type="button" className="egr-option ega-symbol" aria-pressed={chosen.includes(s.id)} onClick={() => toggle(s.id)}>
                  <Glyphs text={s.glyph} className="ega-symbol-glyph" />
                  {s.name}
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
          <p className="egr-credit">The name is spelled with the Egypt Exploration Society’s chart, as in “Your Name in Hieroglyphs”: a modern sound-alike.</p>

          <FactNote fact={AMULET_NOTES.amulets} className="egr-fact" />

          <div className="egr-actions">
            <button type="button" className="egr-button egr-button-primary" onClick={() => setPrinting(true)}>
              Print my amulet
            </button>
          </div>
          <p className="egr-credit">Hieroglyphs set in Noto Sans Egyptian Hieroglyphs (SIL Open Font License). Nothing you type is stored or sent.</p>
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>

      <PrintSheet printing={printing} onDone={done}>
        <div className="ega-print">
          <h1>{owner.trim() ? `${owner.trim()}’s amulet` : 'My amulet'}</h1>
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
