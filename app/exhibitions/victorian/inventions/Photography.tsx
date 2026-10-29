'use client';

import { useEffect, useState } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { NOTES, POSTER, WORKSHOP_TEXT } from './inventionsText';

/*
 * The photography bench: a latticed window, a camera aimed at it, and a
 * sheet of sensitive paper. Uncover the lens and the window darkens onto
 * the paper the wrong way round, the bright panes dark and the dark stone
 * light: a negative. Then lay the negative on fresh paper in the light and
 * the window comes back the right way round: a print, and another, as many
 * as the visitor likes. The window is drawn for the room, not Talbot's.
 * Under reduced motion each sheet appears at once.
 */

const EXPOSE_MS = 4000;
const PRINT_MS = 2500;
const MAX_SHOWN = 6;

type Stage = 'ready' | 'exposing' | 'negative' | 'printing';

export default function Photography({ reduced, footer }: { reduced: boolean; footer?: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>('ready');
  const [prints, setPrints] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (stage !== 'exposing' && stage !== 'printing') return;
    const id = window.setTimeout(
      () => {
        if (stage === 'exposing') {
          setStage('negative');
          setStatus('A negative: the bright panes have come out dark, and the dark stone light.');
        } else {
          setStage('negative');
          setPrints((n) => n + 1);
          setStatus('A print: the window the right way round.');
        }
      },
      reduced ? 0 : stage === 'exposing' ? EXPOSE_MS : PRINT_MS,
    );
    return () => window.clearTimeout(id);
  }, [stage, reduced]);

  const expose = () => {
    setStage('exposing');
    setPrints(0);
    setStatus('The lens is uncovered. The light from the window falls on the paper.');
  };
  const print = () => {
    setStage('printing');
    setStatus('The negative is laid on fresh paper, in the light.');
  };

  const hasNegative = stage === 'negative' || stage === 'printing';
  const sheetLabel =
    stage === 'ready' ? 'A sheet of sensitive paper, still blank'
    : stage === 'exposing' ? 'The paper darkening where the light falls'
    : stage === 'printing' ? 'A print coming up under the negative'
    : 'The negative: the window, light and dark the wrong way round';

  return (
    <div className="vbi-bench">
      <div className="vbr-scene vbi-scene">
        <div className="vbi-photo" data-stage={stage} data-reduced={reduced || undefined}>
          <figure className="vbi-photo-subject">
            <div className="vbi-photo-frame" role="img" aria-label="The window: a latticed window of small diamond panes in a stone wall, the sky bright beyond it">
              <WindowArt />
            </div>
            <figcaption>The window</figcaption>
          </figure>
          <div className="vbi-camera" aria-hidden="true">
            <CameraArt open={stage === 'exposing'} />
          </div>
          <figure className="vbi-photo-sheet">
            <div className="vbi-photo-frame vbi-paper" role="img" aria-label={sheetLabel}>
              <div className="vbi-neg">
                <WindowArt />
              </div>
              <div className="vbi-pos">
                <WindowArt />
              </div>
            </div>
            <figcaption>{stage === 'printing' ? 'Printing' : hasNegative ? 'The negative' : 'The paper'}</figcaption>
          </figure>
          <ol className="vbi-prints" aria-label={prints === 1 ? '1 print' : `${prints} prints`}>
            {Array.from({ length: Math.min(prints, MAX_SHOWN) }, (_, i) => (
              <li key={i} className="vbi-print" style={{ transform: `rotate(${((i * 37) % 9) - 4}deg)` }} aria-hidden="true">
                <WindowArt />
              </li>
            ))}
            {prints > MAX_SHOWN && <li className="vbi-print-more">+{prints - MAX_SHOWN}</li>}
          </ol>
        </div>
      </div>

      <div className="vbr-card">
        <p className="vbr-intro">{WORKSHOP_TEXT.photoIntro}</p>
        <ol className="vbi-steps">
          <li data-done={hasNegative || undefined}>Uncover the lens: the light makes a negative.</li>
          <li data-done={prints > 0 || undefined}>Print from the negative: the window the right way round.</li>
        </ol>
        <div className="vbr-actions">
          <button type="button" className="vbr-button vbr-button-primary" onClick={expose} disabled={stage === 'exposing' || stage === 'printing'}>
            {hasNegative ? 'A new negative' : 'Uncover the lens'}
          </button>
          <button type="button" className="vbr-button" onClick={print} disabled={stage !== 'negative'}>
            {prints ? 'Print another' : 'Print from it'}
          </button>
        </div>
        <p className="vbi-readout" aria-live="polite">{prints === 0 ? 'No prints yet.' : prints === 1 ? 'One print from the negative.' : `${prints} prints from the one negative.`}</p>
        <FactNote fact={NOTES.negative} className="vbr-fact" />
        {prints > 0 && <FactNote fact={NOTES.positives} className="vbr-fact" />}
        <p className="vbr-poster">{POSTER.innovations}</p>
        {footer}
      </div>
      <p className="vbr-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

/** A latticed window of three lights, diamond panes in lead, in a stone wall. */
function WindowArt() {
  const panes: string[] = [];
  for (const x0 of [30, 110, 190]) {
    for (let i = -6; i < 14; i++) {
      panes.push(`M${x0} ${30 + i * 16} l70 70`, `M${x0 + 70} ${30 + i * 16} l-70 70`);
    }
  }
  return (
    <svg viewBox="0 0 290 260" className="vbi-window-svg" aria-hidden="true">
      <defs>
        {[30, 110, 190].map((x) => (
          <clipPath key={x} id={`vbi-light-${x}`}>
            <path d={`M${x} 230 V60 Q${x + 35} 20 ${x + 70} 60 V230Z`} />
          </clipPath>
        ))}
      </defs>
      <rect width="290" height="260" fill="#5e5650" />
      <rect width="290" height="260" fill="#7a7068" opacity="0.6" />
      {[30, 110, 190].map((x) => (
        <g key={x}>
          <path d={`M${x} 230 V60 Q${x + 35} 20 ${x + 70} 60 V230Z`} fill="#f4f1e6" />
          <g clipPath={`url(#vbi-light-${x})`} stroke="#3a3430" strokeWidth="2.2">
            {panes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <path d={`M${x} 230 V60 Q${x + 35} 20 ${x + 70} 60 V230Z`} fill="none" stroke="#2a2522" strokeWidth="6" />
        </g>
      ))}
      <rect x="18" y="230" width="254" height="14" fill="#3a3430" />
    </svg>
  );
}

/** A wooden box camera, its lens capped or uncovered. */
function CameraArt({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="vbi-camera-svg">
      <rect x="22" y="18" width="80" height="62" rx="4" fill="#7a4a34" stroke="#3f2218" strokeWidth="2" />
      <rect x="28" y="24" width="68" height="50" rx="2" fill="none" stroke="#c9a24a" strokeWidth="1.2" />
      <rect x="2" y="36" width="22" height="26" rx="3" fill="#c9a24a" stroke="#6e4f1e" strokeWidth="1.5" />
      <circle cx="4" cy="49" r="10" fill={open ? '#1a1a1a' : '#3f2218'} stroke="#6e4f1e" strokeWidth="2" />
      {!open && <rect x="-8" y="40" width="10" height="18" rx="2" fill="#2a2522" />}
      <rect x="40" y="80" width="44" height="16" fill="#5a3324" />
    </svg>
  );
}
