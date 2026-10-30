'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import FactNote from '@/components/exhibition/FactNote';
import Celebrate from '../Celebrate';
import { usePrintSheet } from '../usePrintSheet';
import { CardFoot } from './Steps';
import { EXPOSURE_S, MET_CREDIT, NOTES, PHOTO_PARTS, PHOTOS, POSITIVE, POSTER, PROCESS_CLUES, blurFor, verdictFor, type PhotoId, type PhotoPart } from './inventionsText';

/*
 * The photography bench, in four parts, each with real Victorian
 * photographs from the Met's open-access collection:
 *
 * 1. Negative to print. Uncover the lens and Talbot's own paper negative of
 *    a window at Lacock Abbey comes up on the sheet, light and dark the
 *    wrong way round; lay it on fresh paper in the sun and the window comes
 *    back the right way round, as many prints as you like.
 * 2. Hold still! Sit for a daguerreotype: press and hold for the whole
 *    exposure; let go and you move, and the portrait blurs. A head clamp
 *    halves the wobble.
 * 3. Three ways. Match each clue to a daguerreotype, a print from Talbot's
 *    paper negative, and Julia Margaret Cameron's print from a wet collodion
 *    glass negative: green and a burst of stars if right, red if not.
 * 4. Print a sheet. A page of what you made, with the photographs and their
 *    credits, to take away.
 *
 * Under reduced motion each sheet appears at once and nothing shakes.
 */

const EXPOSE_MS = 3000;
const PRINT_MS = 2500;
const MAX_SHOWN = 6;
const TICK_MS = 100;

type Stage = 'ready' | 'exposing' | 'negative' | 'printing';
type Sitting = 'ready' | 'exposing' | 'done';

export default function Photography({ reduced }: { reduced: boolean }) {
  const [part, setPart] = useState<PhotoPart>('print');
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const cheer = () => setBurst((b) => b + 1);

  /* ── 1. Negative to print ── */
  const [stage, setStage] = useState<Stage>('ready');
  const [prints, setPrints] = useState(0);

  useEffect(() => {
    if (stage !== 'exposing' && stage !== 'printing') return;
    const id = window.setTimeout(
      () => {
        if (stage === 'exposing') {
          setStage('negative');
          setStatus('A negative: the bright window has come out dark, and the dark stone light.');
        } else {
          setStage('negative');
          setPrints((n) => n + 1);
          cheer();
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
    setStatus('The negative is laid on fresh paper, out in the sunlight.');
  };
  const hasNegative = stage === 'negative' || stage === 'printing';

  /* ── 2. Hold still! ── */
  const [sitting, setSitting] = useState<Sitting>('ready');
  const [clamp, setClamp] = useState(false);
  const [holding, setHolding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [moved, setMoved] = useState(0);
  const [blur, setBlur] = useState(0);
  const holdingRef = useRef(false);
  const clock = useRef({ elapsed: 0, moved: 0 });

  // The exposure ticks on, counting the time the sitter was not holding still; at its end, the portrait as it came out.
  useEffect(() => {
    if (sitting !== 'exposing') return;
    const id = window.setInterval(() => {
      const c = clock.current;
      if (!holdingRef.current) c.moved += TICK_MS;
      c.elapsed += TICK_MS;
      setMoved(c.moved);
      setElapsed(c.elapsed);
      if (c.elapsed >= EXPOSURE_S * 1000) {
        window.clearInterval(id);
        const b = blurFor(c.moved, clamp);
        const v = verdictFor(b);
        setBlur(b);
        setSitting('done');
        if (v.tone === 'right') setBurst((n) => n + 1);
        setStatus(`The exposure is over. ${v.words}`);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [sitting, clamp]);

  const sitDown = () => {
    holdingRef.current = true;
    setHolding(true);
    if (sitting !== 'exposing') {
      clock.current = { elapsed: 0, moved: 0 };
      setSitting('exposing');
      setElapsed(0);
      setMoved(0);
      setBlur(0);
      setStatus(`The lens is uncovered. Keep holding for ${EXPOSURE_S} seconds!`);
    }
  };
  const sitUp = () => {
    holdingRef.current = false;
    setHolding(false);
  };
  const holdKeys = {
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        sitDown();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        sitUp();
      }
    },
  };
  const left = Math.max(0, Math.ceil(EXPOSURE_S - elapsed / 1000));
  const verdict = sitting === 'done' ? verdictFor(blur) : null;
  // While the lens is open, the plate comes up; a sitter who moves shows as a shake, and the picture as it will come out.
  const liveBlur = sitting === 'exposing' ? blurFor(moved, clamp) : sitting === 'done' ? blur : 0;

  /* ── 3. Three ways ── */
  const [clue, setClue] = useState(0);
  const [matched, setMatched] = useState<PhotoId[]>([]);
  const [wrong, setWrong] = useState<PhotoId | null>(null);
  const allMatched = matched.length === PROCESS_CLUES.length;
  const current = PROCESS_CLUES[clue];

  const pick = (id: PhotoId) => {
    if (allMatched || matched.includes(id)) return;
    if (id === current.photo) {
      const next = [...matched, id];
      setMatched(next);
      setWrong(null);
      cheer();
      setStatus(`Right! That is a ${current.process.toLowerCase()}.${next.length === PROCESS_CLUES.length ? ' All three matched!' : ''}`);
    } else {
      setWrong(id);
      setStatus('Not that one. Read the clue again.');
    }
  };
  const nextClue = () => {
    setClue((c) => Math.min(PROCESS_CLUES.length - 1, c + 1));
    setWrong(null);
  };
  const resetQuiz = () => {
    setClue(0);
    setMatched([]);
    setWrong(null);
  };
  const justMatched = matched.includes(current.photo);

  /* ── 4. Print a sheet ── */
  const [name, setName] = useState('');
  const [printing, setPrinting] = useState(false);
  const donePrinting = useCallback(() => setPrinting(false), []);
  usePrintSheet(printing, donePrinting);

  // Each part's notes and the credits of its photographs, behind "Did you know?".
  const facts =
    part === 'print' ? [NOTES.negative, ...(hasNegative ? [NOTES.calotype] : []), ...(prints > 0 ? [NOTES.sunPrint, NOTES.positives] : [])]
    : part === 'still' ? [NOTES.exposure, NOTES.clamp, ...(sitting === 'done' ? [NOTES.prunes] : [])]
    : part === 'three' ? (justMatched && current.photo === 'cameron' ? [NOTES.cameron] : [])
    : [NOTES.positives];
  const credits: PhotoId[] = part === 'print' ? ['negative'] : part === 'still' ? ['daguerreotype'] : part === 'three' ? ['daguerreotype', 'openDoor', 'cameron'] : ['negative', 'daguerreotype', 'openDoor', 'cameron'];

  const choosePart = (p: PhotoPart) => {
    setPart(p);
    setStatus(PHOTO_PARTS.find((x) => x.id === p)!.label + '.');
  };

  return (
    <div className="vbi-bench vbi-photography">
      <div className="vbr-scene vbi-scene">
        {part === 'print' && (
          <div className="vbi-photo" data-stage={stage} data-reduced={reduced || undefined}>
            <figure className="vbi-photo-sheet">
              <div className="vbi-photo-frame vbi-paper" role="img" aria-label={stage === 'ready' ? 'A sheet of sensitive paper in the camera, still blank' : stage === 'exposing' ? 'The paper darkening where the light falls' : `Talbot’s negative: ${PHOTOS.negative.alt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="vbi-neg" src={PHOTOS.negative.src} alt="" width={PHOTOS.negative.w} height={PHOTOS.negative.h} />
              </div>
              <figcaption>{hasNegative ? 'The negative' : 'In the camera'}</figcaption>
            </figure>
            <div className="vbi-sun" aria-hidden="true">
              <SunArt />
            </div>
            <figure className="vbi-photo-sheet">
              <div className="vbi-photo-frame vbi-paper vbi-print-paper" role="img" aria-label={stage === 'printing' ? 'A print coming up under the negative, in the sun' : prints ? `The print: ${POSITIVE.alt}` : 'Fresh paper, waiting for the negative'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="vbi-pos" src={POSITIVE.src} alt="" width={PHOTOS.negative.w} height={PHOTOS.negative.h} data-shown={prints > 0 || stage === 'printing' || undefined} />
                <span className="vbi-print-cheer">
                  <Celebrate burst={prints > 0 && stage !== 'printing' ? burst : 0} reduced={reduced} />
                </span>
              </div>
              <figcaption>{stage === 'printing' ? 'Printing in the sun' : prints ? 'The print' : 'Fresh paper'}</figcaption>
            </figure>
            <ol className="vbi-prints" aria-label={prints === 1 ? '1 print' : `${prints} prints`}>
              {Array.from({ length: Math.min(prints, MAX_SHOWN) }, (_, i) => (
                <li key={i} className="vbi-print" style={{ transform: `rotate(${((i * 37) % 9) - 4}deg)` }} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={POSITIVE.src} alt="" />
                </li>
              ))}
              {prints > MAX_SHOWN && <li className="vbi-print-more">+{prints - MAX_SHOWN}</li>}
            </ol>
          </div>
        )}

        {part === 'still' && (
          <div className="vbi-sitter" data-sitting={sitting} data-moving={(sitting === 'exposing' && !holding) || undefined} data-reduced={reduced || undefined}>
            {clamp && (
              <div className="vbi-clamp" aria-hidden="true">
                <ClampArt />
              </div>
            )}
            <figure className="vbi-dag">
              <div className="vbi-dag-frame vbi-feedback" data-verdict={verdict ? verdict.tone : undefined} role="img" aria-label={`${PHOTOS.daguerreotype.alt}${sitting === 'done' ? `, ${blur > 0.5 ? 'blurred' : 'sharp'}` : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTOS.daguerreotype.src}
                  alt=""
                  width={PHOTOS.daguerreotype.w}
                  height={PHOTOS.daguerreotype.h}
                  style={{ filter: liveBlur ? `blur(${liveBlur}px)` : undefined, opacity: sitting === 'exposing' ? 0.35 + 0.65 * Math.min(1, elapsed / (EXPOSURE_S * 1000)) : 1 }}
                />
                {sitting === 'exposing' && (
                  <span className="vbi-countdown" aria-hidden="true">
                    {left}
                  </span>
                )}
                <Celebrate burst={verdict?.tone === 'right' ? burst : 0} reduced={reduced} />
              </div>
              <figcaption>A daguerreotype</figcaption>
            </figure>
          </div>
        )}

        {part === 'three' && (
          <ul className="vbi-three" aria-label="Three photographs">
            {PROCESS_CLUES.map((c) => {
              const ph = PHOTOS[c.photo];
              const ok = matched.includes(c.photo);
              return (
                <li key={c.photo}>
                  <button type="button" className="vbi-three-photo vbi-feedback" data-verdict={ok ? 'right' : wrong === c.photo ? 'wrong' : undefined} onClick={() => pick(c.photo)} aria-label={`${ph.title}, ${ph.maker}${ok ? `: ${c.process}` : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ph.src} alt="" width={ph.w} height={ph.h} />
                    <span className="vbi-three-label">{ok ? c.process : '?'}</span>
                    <Celebrate burst={ok && c.photo === matched[matched.length - 1] ? burst : 0} reduced={reduced} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {part === 'sheet' && (
          <div className="vbi-sheet-preview" aria-hidden="true">
            <Sheet name={name} prints={prints} blur={sitting === 'done' ? blur : null} />
          </div>
        )}
      </div>

      <div className="vbr-card vbi-card">
        <div className="vbr-options vbi-modes" role="group" aria-label="The four parts">
          {PHOTO_PARTS.map((p, i) => (
            <button key={p.id} type="button" className="vbr-option" aria-pressed={part === p.id} onClick={() => choosePart(p.id)}>
              {i + 1}. {p.label}
            </button>
          ))}
        </div>

        <div className="vbi-step-area">
          {part === 'print' && (
            <>
              <h2 className="vbi-step-title">From negative to print</h2>
              <p className="vbi-step-body">
                Light makes the paper go dark, so a bright window comes out dark: a <strong>negative</strong>. In the sun, the negative makes a <strong>print</strong> the right way round.
              </p>
              <ol className="vbi-photo-steps">
                <li data-done={hasNegative || undefined}>Uncover the lens: a negative.</li>
                <li data-done={prints > 0 || undefined}>Print from it in the sun.</li>
              </ol>
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={expose} disabled={stage === 'exposing' || stage === 'printing'}>
                  {hasNegative ? 'A new negative' : 'Uncover the lens'}
                </button>
                <button type="button" className="vbr-button vbr-button-primary" onClick={print} disabled={stage !== 'negative'}>
                  {prints ? 'Print another' : 'Print from it'}
                </button>
              </div>
              <p className="vbi-readout vbi-big-readout" aria-live="polite">
                {prints === 0 ? 'No prints yet.' : prints === 1 ? 'One print from the negative.' : `${prints} prints from the one negative.`}
              </p>
            </>
          )}

          {part === 'still' && (
            <>
              <h2 className="vbi-step-title">Hold still!</h2>
              <p className="vbi-step-body">The first photographs took so long that the sitter had to keep perfectly still. Here it takes {EXPOSURE_S} seconds.</p>
              <p className="vbi-task">
                <span className="vbi-task-mark" aria-hidden="true">▸</span> Press and hold the button the whole time. Let go, and you move!
              </p>
              <button type="button" className="vbr-option vbi-clamp-toggle" aria-pressed={clamp} onClick={() => setClamp((c) => !c)} disabled={sitting === 'exposing'}>
                {clamp ? '✓ ' : ''}Use the head clamp
              </button>
              <button
                type="button"
                className="vbi-key-button vbi-hold-button"
                data-live={holding || undefined}
                onPointerDown={(e) => {
                  try {
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                  } catch {}
                  sitDown();
                }}
                onPointerUp={sitUp}
                onPointerCancel={sitUp}
                onLostPointerCapture={sitUp}
                onContextMenu={(e) => e.preventDefault()}
                {...holdKeys}
              >
                {sitting === 'exposing' ? (holding ? `Holding still… ${left}` : `You moved! Hold on… ${left}`) : sitting === 'done' ? 'Sit again' : 'Hold still'}
              </button>
              <div className="vbi-feedback" aria-live="polite" data-verdict={verdict ? verdict.tone : undefined}>
                {verdict ? <p className="vbi-verdict">{verdict.words}</p> : <p className="vbi-verdict vbi-verdict-quiet">{sitting === 'exposing' ? `${left} seconds to go.` : 'Ready when you are.'}</p>}
              </div>
            </>
          )}

          {part === 'three' && (
            <>
              <h2 className="vbi-step-title">Three ways to make a photograph</h2>
              {!allMatched ? (
                <>
                  <p className="vbi-clue">
                    <span className="vbi-clue-n">
                      Clue {clue + 1} of {PROCESS_CLUES.length}:
                    </span>{' '}
                    “{current.clue}”
                  </p>
                  <p className="vbi-task">
                    <span className="vbi-task-mark" aria-hidden="true">▸</span> Press the photograph the clue describes.
                  </p>
                </>
              ) : (
                <p className="vbi-step-body">All three matched: a daguerreotype on silver, a print from a paper negative, and a print from a glass negative.</p>
              )}
              <div className="vbi-feedback" aria-live="polite" data-verdict={justMatched ? 'right' : wrong ? 'wrong' : undefined}>
                {justMatched ? <p className="vbi-verdict">Right! It is a {current.process.toLowerCase()}.</p> : wrong ? <p className="vbi-verdict">Not that one: read the clue again.</p> : null}
              </div>
              {justMatched && <FactNote fact={NOTES[current.note]} className="vbr-fact" />}
              <div className="vbr-actions">
                {justMatched && !allMatched && (
                  <button type="button" className="vbr-button vbr-button-primary" onClick={nextClue}>
                    Next clue <span aria-hidden="true">→</span>
                  </button>
                )}
                {allMatched && (
                  <button type="button" className="vbr-button" onClick={resetQuiz}>
                    Play again
                  </button>
                )}
              </div>
            </>
          )}

          {part === 'sheet' && (
            <>
              <h2 className="vbi-step-title">Print a sheet to take away</h2>
              <p className="vbi-step-body">Talbot’s negative and your prints, your daguerreotype sitting, and the three ways to make a photograph.</p>
              <label className="vbr-field">
                <span className="vbr-label">Your name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} maxLength={40} autoComplete="off" />
              </label>
              <div className="vbr-actions">
                <button
                  type="button"
                  className="vbr-button vbr-button-primary"
                  onClick={() => {
                    setPrinting(true);
                    setStatus('Printing your sheet.');
                  }}
                >
                  Print my sheet
                </button>
              </div>
              <p className="vbr-note">Nothing you write is saved or sent.</p>
            </>
          )}
        </div>

        <CardFoot facts={facts} poster={POSTER.innovations} reset={part}>
          {credits.map((c) => (
            <Credit key={c} id={c} extra={c === 'negative' ? POSITIVE.note : undefined} />
          ))}
        </CardFoot>
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>

      {printing &&
        createPortal(
          <div className="vbr-print-root vbi-print-root" data-exhibition="victorian">
            <Sheet name={name} prints={prints} blur={sitting === 'done' ? blur : null} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** A photograph's credit, linked to its record at the Met; `extra` for the room's own print made from it. */
function Credit({ id, extra }: { id: PhotoId; extra?: string }) {
  const p = PHOTOS[id];
  return (
    <p className="vbr-fact vbi-credit">
      <span className="vbr-fact-text">
        Photograph: {p.maker}, <em>{p.title}</em>, {p.date}. {p.medium}.{extra ? ` ${extra}` : ''}
      </span>{' '}
      <span className="vbr-fact-source">
        <a href={p.href} target="_blank" rel="noopener noreferrer">
          {MET_CREDIT}
        </a>
      </span>
    </p>
  );
}

/** The sheet to print (and its preview): a page of the bench's photographs, what the visitor made, and the credits. */
function Sheet({ name, prints, blur }: { name: string; prints: number; blur: number | null }) {
  return (
    <article className="vbi-sheet">
      <header className="vbi-sheet-head">
        <p className="vbi-sheet-kicker">Victorian Britain · Inventions Workshop</p>
        <h1>Victorian Photography</h1>
        <p className="vbi-sheet-name">By {name.trim() || '______________________'}</p>
      </header>
      <section className="vbi-sheet-row">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.negative.src} alt={PHOTOS.negative.alt} />
          <figcaption>1. The negative: light and dark the wrong way round.</figcaption>
        </figure>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={POSITIVE.src} alt={POSITIVE.alt} />
          <figcaption>2. The print, made in the sun: the right way round. {prints > 1 ? `I made ${prints} prints from one negative.` : prints === 1 ? 'I made a print.' : ''}</figcaption>
        </figure>
      </section>
      <section className="vbi-sheet-row vbi-sheet-three">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.daguerreotype.src} alt={PHOTOS.daguerreotype.alt} style={blur ? { filter: `blur(${Math.min(blur, 6)}px)` } : undefined} />
          <figcaption>
            <strong>Daguerreotype</strong>: a silver-plated sheet, one of a kind.{blur !== null ? (blur <= 0.5 ? ' I held perfectly still!' : ' I moved, so mine came out blurred.') : ''}
          </figcaption>
        </figure>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.openDoor.src} alt={PHOTOS.openDoor.alt} />
          <figcaption>
            <strong>Calotype</strong>: a paper negative, and many prints from it.
          </figcaption>
        </figure>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.cameron.src} alt={PHOTOS.cameron.alt} />
          <figcaption>
            <strong>Wet collodion</strong>: a glass negative, used while still wet.
          </figcaption>
        </figure>
      </section>
      <footer className="vbi-sheet-credits">
        <p>
          {(['negative', 'daguerreotype', 'openDoor', 'cameron'] as PhotoId[]).map((id) => `${PHOTOS[id].maker}, ${PHOTOS[id].title}, ${PHOTOS[id].date}`).join('; ')}. {MET_CREDIT}. The print of the window was made for the museum from Talbot’s negative.
        </p>
        <p>Facts: V&amp;A; Science Museum Group; Getty.</p>
      </footer>
    </article>
  );
}

/** The sun, shining on the printing frame. */
function SunArt() {
  return (
    <svg viewBox="0 0 120 120" className="vbi-sun-svg">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={60 + Math.cos(a) * 34} y1={60 + Math.sin(a) * 34} x2={60 + Math.cos(a) * 52} y2={60 + Math.sin(a) * 52} stroke="#e0a83a" strokeWidth="6" strokeLinecap="round" />;
      })}
      <circle cx="60" cy="60" r="26" fill="#f2c45a" stroke="#c98a2a" strokeWidth="3" />
      <path d="M20 108 H100" stroke="#6b4a32" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** A posing stand with its head clamp: an iron stand, and a fork that holds the back of the sitter's head. */
function ClampArt() {
  return (
    <svg viewBox="0 0 120 300" className="vbi-clamp-svg">
      <path d="M60 60 V280 M30 290 L60 270 L90 290" stroke="#3a3430" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M60 60 V40 M36 30 Q60 50 84 30" stroke="#3a3430" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="150" r="7" fill="#c9a24a" />
      <text x="60" y="16" textAnchor="middle" className="vbi-clamp-label">Head clamp</text>
    </svg>
  );
}
