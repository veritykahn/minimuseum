'use client';

import { useState } from 'react';
import { Disc, PAIRS, type PairId } from './printArt';

/*
 * Make your own thaumatrope: a printable sheet for each pair of pictures
 * (bird and cage, fish and bowl, flower and pot) and a blank one to draw
 * on, each with what you need and what to do. Each sheet is one US Letter
 * page (8.5" × 11", 0.5" margins); the discs print 3.25" across. Printing
 * shows only the sheets that are ticked.
 */

export const MATERIALS = [
  'This sheet, printed (on card stock if you have it)',
  'Thin card, like the side of a cereal box (if you printed on plain paper)',
  'Scissors',
  'A glue stick',
  'Two pieces of string, or two rubber bands, each about 12 inches (30 cm) long',
  'A hole punch, or a sharp pencil to poke the holes (ask a grown-up to help)',
  'Crayons, coloured pencils or markers',
];

export function steps(blank: boolean) {
  return [
    blank
      ? 'Draw a picture on each circle. Draw the one on the back circle upside down, with its top towards the bottom of the circle, away from the star.'
      : 'Colour in the two pictures.',
    'Cut out both circles along the solid line.',
    'If your paper is thin, glue one circle onto thin card, and cut the card to match.',
    'Glue the two circles back to back, with both stars at the top, together. (The back picture is upside down on purpose.)',
    'Punch or poke a hole at each of the two dots. Tie a string through each hole.',
    'Hold one string in each hand. Roll the strings between your fingers and thumbs so the disc flips over and over, as fast as you can.',
    'Watch the two pictures become one.',
  ];
}

type SheetId = PairId | 'blank';
const SHEETS: { id: SheetId; name: string }[] = [...PAIRS.map((p) => ({ id: p.id as SheetId, name: p.name })), { id: 'blank', name: 'Blank discs to draw on' }];

export default function MakeThaumatrope() {
  const [chosen, setChosen] = useState<Record<SheetId, boolean>>({ bird: true, fish: true, flower: true, blank: true });
  const picked = SHEETS.filter((s) => chosen[s.id]);

  return (
    <div className="vmt">
      {/* Letter paper, half-inch margins: only while this tab is open. */}
      <style>{'@page { size: 8.5in 11in; margin: 0.5in; }'}</style>
      <div className="vmt-intro">
        <h2 className="vmt-heading">Make a thaumatrope</h2>
        <p className="vmt-lead">Two pictures, one on each side of a card disc. Twirl it fast, and see what your eyes make of them.</p>
        <fieldset className="vmt-pick">
          <legend>Sheets to print (one page each)</legend>
          {SHEETS.map((s) => (
            <label key={s.id} className="vmt-check">
              <input type="checkbox" checked={chosen[s.id]} onChange={(e) => setChosen({ ...chosen, [s.id]: e.currentTarget.checked })} />
              <span>{s.name}</span>
            </label>
          ))}
        </fieldset>
        <div className="vto-actions">
          <button type="button" className="vto-button vto-button-primary" onClick={() => window.print()} disabled={!picked.length}>
            Print {picked.length === 1 ? 'the sheet' : `${picked.length} sheets`}
          </button>
        </div>
        <p className="vmt-paper">Prints on US Letter paper. Card stock works best.</p>
      </div>

      <div className="vmt-print" aria-label="The sheets to print">
        {picked.map((s) => (
          <Sheet key={s.id} id={s.id} />
        ))}
      </div>
    </div>
  );
}

function Sheet({ id }: { id: SheetId }) {
  const pair = id === 'blank' ? null : PAIRS.find((p) => p.id === id)!;
  return (
    <article className="vmt-sheet" aria-label={`Sheet: ${pair ? pair.name : 'blank discs'}`}>
      <header className="vmt-sheet-head">
        <p className="vmt-sheet-kicker">The Mini Museum · Seeing is Deceiving</p>
        <h3 className="vmt-sheet-title">Make a thaumatrope: {pair ? pair.name.toLowerCase() : 'draw your own'}</h3>
      </header>
      <div className="vmt-discs">
        <figure>
          <Disc pair={pair?.id ?? null} side="front" label={pair ? `Front: ${pair.front}` : 'Front: a blank circle to draw on'} />
          <figcaption>Front</figcaption>
        </figure>
        <figure>
          <Disc pair={pair?.id ?? null} side="back" label={pair ? `Back: ${pair.back}, printed upside down` : 'Back: a blank circle to draw on, upside down'} />
          <figcaption>Back (upside down on purpose)</figcaption>
        </figure>
      </div>
      <div className="vmt-how">
        <section>
          <h4>You will need</h4>
          <ul>
            {MATERIALS.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>What to do</h4>
          <ol>
            {steps(!pair).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
