'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import FactNote from '@/components/exhibition/FactNote';
import Celebrate from '../Celebrate';
import { usePrintSheet } from '../usePrintSheet';
import { CardFoot } from './Steps';
import { EXPOSURE, EXPOSURE_S, EXPOSURE_WORDS, MET_CREDIT, NOTES, PHOTO_PARTS, PHOTOS, POSITIVE, POSTER, PROCESS_CLUES, QUIZ_ORDER, blurFor, exposureFor, verdictFor, type ExposureResult, type PhotoId, type PhotoPart } from './inventionsText';

/*
 * The photography bench, in four parts, each with its own look and real
 * Victorian photographs from the Met's open-access collection:
 *
 * 1. Negative to print. A wooden camera, its lens capped. Lift the cap and
 *    count while the light falls on the sensitive paper inside: Talbot's
 *    own paper negative of a window at Lacock Abbey comes up on the sheet,
 *    darker each second. Put the cap back too soon and it is too faint;
 *    too late and the whole sheet goes dark (the workshop's seconds, said
 *    so). A good negative goes out in the sun on fresh paper, and the
 *    window comes back the right way round: as many prints as you like.
 *    "A new sheet" starts again with blank paper.
 * 2. Hold still! Sit for a daguerreotype. A head clamp held a sitter's head
 *    still; here, pressing and holding the clamp is holding still. The
 *    exposure starts when you first press it and runs its seconds; every
 *    moment you are not holding, your head moves and the portrait blurs.
 *    The clamp says all the time whether you are holding still or moving.
 * 3. Three ways. First learn them: tap each photograph to read how it was
 *    made (a daguerreotype, a print from Talbot's paper negative, and Julia
 *    Margaret Cameron's print from a wet collodion glass negative). Then
 *    the quiz: match each clue to its photograph, green and a burst of
 *    stars if right, red if not.
 * 4. Print a sheet. A page of what you made, with the photographs and their
 *    credits, to take away.
 *
 * Under reduced motion each print appears at once and nothing shakes.
 */

const PRINT_MS = 2500;
const MAX_SHOWN = 6;
const TICK_MS = 100;

type Sheet = 'blank' | 'exposing' | 'done';
type Sitting = 'ready' | 'exposing' | 'done';

export default function Photography({ reduced }: { reduced: boolean }) {
  const [part, setPart] = useState<PhotoPart>('print');
  const [status, setStatus] = useState('');
  const [burst, setBurst] = useState(0);
  const cheer = () => setBurst((b) => b + 1);

  /* ── 1. Negative to print ── */
  const [sheet, setSheet] = useState<Sheet>('blank');
  const [exposedMs, setExposedMs] = useState(0);
  const [result, setResult] = useState<ExposureResult | null>(null);
  const [printing, setPrintingSun] = useState(false);
  const [prints, setPrints] = useState(0);
  const exposedRef = useRef(0);
  const seconds = Math.floor(exposedMs / 1000);
  const goodNegative = result === 'good';

  // While the cap is off, the seconds count up; at the most the sheet can take, the cap goes back by itself.
  useEffect(() => {
    if (sheet !== 'exposing') return;
    const id = window.setInterval(() => {
      exposedRef.current += TICK_MS;
      setExposedMs(exposedRef.current);
      if (exposedRef.current >= EXPOSURE.max * 1000) {
        window.clearInterval(id);
        finish(exposedRef.current);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const finish = (ms: number) => {
    const r = exposureFor(Math.floor(ms / 1000));
    setSheet('done');
    setResult(r);
    if (r === 'good') cheer();
    setStatus(`The cap is back on after ${Math.floor(ms / 1000)} seconds. ${EXPOSURE_WORDS[r]}`);
  };
  const liftCap = () => {
    if (sheet === 'exposing') {
      finish(exposedRef.current);
      return;
    }
    if (sheet === 'done') return;
    exposedRef.current = 0;
    setExposedMs(0);
    setSheet('exposing');
    setStatus('The cap is off. The light falls on the paper. Count the seconds!');
  };
  const newSheet = () => {
    exposedRef.current = 0;
    setExposedMs(0);
    setSheet('blank');
    setResult(null);
    setPrints(0);
    setPrintingSun(false);
    setStatus('A new sheet of sensitive paper is in the camera, still blank.');
  };

  useEffect(() => {
    if (!printing) return;
    const id = window.setTimeout(
      () => {
        setPrintingSun(false);
        setPrints((n) => n + 1);
        cheer();
        setStatus('A print: the window the right way round.');
      },
      reduced ? 0 : PRINT_MS,
    );
    return () => window.clearTimeout(id);
  }, [printing, reduced]);
  const print = () => {
    setPrintingSun(true);
    setStatus('The negative is laid on fresh paper, out in the sunlight.');
  };

  // How the negative has come up: fainter for fewer seconds, and darkening all over past the best.
  const s = exposedMs / 1000;
  const negOpacity = Math.min(1, s / EXPOSURE.best[0]);
  const fog = Math.max(0, Math.min(0.88, (s - EXPOSURE.darkAbove) / (EXPOSURE.max - EXPOSURE.darkAbove)));

  /* ── 2. Hold still! ── */
  const [sitting, setSitting] = useState<Sitting>('ready');
  const [holding, setHolding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [moved, setMoved] = useState(0);
  const [blur, setBlur] = useState(0);
  const holdingRef = useRef(false);
  const clock = useRef({ elapsed: 0, moved: 0 });

  // The exposure ticks on, counting the time the sitter was not holding the clamp; at its end, the portrait as it came out.
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
        const b = blurFor(c.moved);
        const v = verdictFor(b);
        setBlur(b);
        setSitting('done');
        if (v.tone === 'right') setBurst((n) => n + 1);
        setStatus(`The exposure is over. ${v.words}`);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [sitting]);

  const grip = () => {
    if (sitting === 'done') return;
    holdingRef.current = true;
    setHolding(true);
    if (sitting !== 'exposing') {
      clock.current = { elapsed: 0, moved: 0 };
      setSitting('exposing');
      setElapsed(0);
      setMoved(0);
      setBlur(0);
      setStatus(`The lens is open. You are holding still. Keep holding for ${EXPOSURE_S} seconds!`);
    } else setStatus('You are holding the clamp again: still.');
  };
  const release = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setHolding(false);
    if (sitting === 'exposing') setStatus('You let go of the clamp: your head is moving!');
  };
  const sitAgain = () => {
    holdingRef.current = false;
    setHolding(false);
    setSitting('ready');
    setElapsed(0);
    setMoved(0);
    setBlur(0);
    setStatus('Ready for another sitting.');
  };
  const clampProps = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {}
      grip();
    },
    onPointerUp: release,
    onPointerCancel: release,
    onLostPointerCapture: release,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
  };
  const clampKeys = {
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        grip();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        release();
      }
    },
  };
  const left = Math.max(0, Math.ceil(EXPOSURE_S - elapsed / 1000));
  const verdict = sitting === 'done' ? verdictFor(blur) : null;
  const movingNow = sitting === 'exposing' && !holding;
  // While the lens is open, the plate comes up; a sitter who moves shows as a shake, and the picture as it will come out.
  const liveBlur = sitting === 'exposing' ? blurFor(moved) : sitting === 'done' ? blur : 0;

  /* ── 3. Three ways: learn, then the quiz ── */
  const [seen, setSeen] = useState<PhotoId[]>([]);
  const [quiz, setQuiz] = useState(false);
  const [clue, setClue] = useState(0);
  const [matched, setMatched] = useState<PhotoId[]>([]);
  const [wrong, setWrong] = useState<PhotoId | null>(null);
  const allSeen = seen.length === PROCESS_CLUES.length;
  const allMatched = matched.length === PROCESS_CLUES.length;
  const quizClues = QUIZ_ORDER.map((id) => PROCESS_CLUES.find((c) => c.photo === id)!);
  const current = quizClues[clue];
  const justMatched = matched.includes(current.photo);

  const look = (id: PhotoId) => {
    const c = PROCESS_CLUES.find((x) => x.photo === id)!;
    const next = seen.includes(id) ? seen : [...seen, id];
    setSeen(next);
    setStatus(`${c.short}: ${c.teach}${next.length === PROCESS_CLUES.length ? ' You have read all three. Now try the quiz.' : ''}`);
  };
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
  const startQuiz = () => {
    setQuiz(true);
    setClue(0);
    setMatched([]);
    setWrong(null);
    setStatus('The quiz. Read the clue, and press its photograph.');
  };
  const backToLearn = () => {
    setQuiz(false);
    setWrong(null);
    setStatus('Learn the three ways.');
  };

  /* ── 4. Print a sheet ── */
  const [name, setName] = useState('');
  const [printingSheet, setPrintingSheet] = useState(false);
  const donePrinting = useCallback(() => setPrintingSheet(false), []);
  usePrintSheet(printingSheet, donePrinting);

  // Each part's notes, behind "Did you know?" (their sources, and the photographs' credits, in the Sources drawer).
  const facts =
    part === 'print' ? [NOTES.negative, ...(goodNegative ? [NOTES.calotype] : []), ...(prints > 0 ? [NOTES.sunPrint, NOTES.positives] : [])]
    : part === 'still' ? [NOTES.exposure, NOTES.clamp, ...(sitting === 'done' ? [NOTES.prunes] : [])]
    : part === 'three' ? (quiz ? (justMatched && current.photo === 'cameron' ? [NOTES.cameron] : []) : PROCESS_CLUES.filter((c) => seen.includes(c.photo)).map((c) => NOTES[c.note]))
    : [NOTES.positives];

  const choosePart = (p: PhotoPart) => {
    setPart(p);
    setStatus(PHOTO_PARTS.find((x) => x.id === p)!.label + '.');
  };

  const phase = goodNegative ? 'print' : 'camera';

  return (
    <div className="vbi-bench vbi-photography" data-look={part}>
      <div className="vbr-scene vbi-scene">
        {part === 'print' && (
          <div className="vbi-photo" data-phase={phase} data-reduced={reduced || undefined}>
            {phase === 'camera' ? (
              <>
                <div className="vbi-camera" data-open={sheet === 'exposing' || undefined} onClick={sheet === 'done' ? undefined : liftCap} aria-hidden="true">
                  <CameraArt open={sheet === 'exposing'} />
                </div>
                <figure className="vbi-photo-sheet vbi-in-camera">
                  <div className="vbi-photo-frame vbi-paper" role="img" aria-label={sheet === 'blank' ? 'A sheet of sensitive paper in the camera, still blank' : sheet === 'exposing' ? `The paper darkening where the light falls: ${seconds} seconds` : result === 'faint' ? 'A faint, pale negative: hardly any picture' : 'A sheet gone dark all over'}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="vbi-neg" src={PHOTOS.negative.src} alt="" width={PHOTOS.negative.w} height={PHOTOS.negative.h} style={{ opacity: negOpacity }} />
                    <span className="vbi-fog" style={{ opacity: fog }} />
                    {sheet !== 'blank' && (
                      <span className="vbi-seconds" data-result={result ?? undefined} aria-hidden="true">
                        <strong>{seconds}</strong> {seconds === 1 ? 'second' : 'seconds'}
                      </span>
                    )}
                  </div>
                  <figcaption>The sensitive paper, inside the camera</figcaption>
                </figure>
              </>
            ) : (
              <>
                <figure className="vbi-photo-sheet">
                  <div className="vbi-photo-frame vbi-paper" role="img" aria-label={`Talbot’s negative: ${PHOTOS.negative.alt}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="vbi-neg" src={PHOTOS.negative.src} alt="" width={PHOTOS.negative.w} height={PHOTOS.negative.h} style={{ opacity: 1 }} />
                    <span className="vbi-fog" style={{ opacity: fog }} />
                  </div>
                  <figcaption>Your negative</figcaption>
                </figure>
                <div className="vbi-sun" data-on={printing || undefined} aria-hidden="true">
                  <SunArt />
                </div>
                <figure className="vbi-photo-sheet">
                  <div className="vbi-photo-frame vbi-paper vbi-print-paper" data-printing={printing || undefined} role="img" aria-label={printing ? 'A print coming up under the negative, in the sun' : prints ? `The print: ${POSITIVE.alt}` : 'Fresh paper, waiting for the negative'}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="vbi-pos" src={POSITIVE.src} alt="" width={PHOTOS.negative.w} height={PHOTOS.negative.h} data-shown={prints > 0 || printing || undefined} />
                    <span className="vbi-print-cheer">
                      <Celebrate burst={prints > 0 && !printing ? burst : 0} reduced={reduced} />
                    </span>
                  </div>
                  <figcaption>{printing ? 'Printing in the sun' : prints ? 'The print' : 'Fresh paper'}</figcaption>
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
              </>
            )}
          </div>
        )}

        {part === 'still' && (
          <div className="vbi-sitter" data-sitting={sitting} data-moving={movingNow || undefined} data-reduced={reduced || undefined}>
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
              <figcaption>A daguerreotype sitting</figcaption>
            </figure>
            <div className="vbi-clamp-stand" data-holding={holding || undefined} data-moving={movingNow || undefined} aria-hidden="true" {...clampProps}>
              <ClampArt holding={holding} />
              <span className="vbi-clamp-state">{sitting === 'done' ? 'Done' : holding ? 'Holding still' : movingNow ? 'Moving!' : 'Press and hold'}</span>
            </div>
          </div>
        )}

        {part === 'three' && (
          <ul className="vbi-three" data-quiz={quiz || undefined} aria-label={quiz ? 'Three photographs: which is which?' : 'Three ways to make a photograph'}>
            {(quiz ? QUIZ_ORDER.map((id) => PROCESS_CLUES.find((c) => c.photo === id)!) : PROCESS_CLUES).map((c) => {
              const ph = PHOTOS[c.photo];
              if (!quiz) {
                const open = seen.includes(c.photo);
                return (
                  <li key={c.photo}>
                    <button type="button" className="vbi-three-photo vbi-learn-card" aria-pressed={open} onClick={() => look(c.photo)} aria-label={`${c.short}: ${ph.title}, ${ph.maker}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ph.src} alt="" width={ph.w} height={ph.h} />
                      <span className="vbi-three-label">{c.short}</span>
                      <span className="vbi-learn-text" data-open={open || undefined}>
                        {open ? c.teach : 'Tap to read how it was made'}
                      </span>
                    </button>
                  </li>
                );
              }
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
            <SheetPage name={name} prints={prints} blur={sitting === 'done' ? blur : null} />
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
          {part === 'print' && phase === 'camera' && (
            <>
              <h2 className="vbi-step-title">Make a negative</h2>
              <p className="vbi-step-body">
                Inside the camera is paper that darkens in the light. Lift the cap off the lens, <strong>count the seconds</strong>, then put it back.
              </p>
              <p className="vbi-task">
                <span className="vbi-task-mark" aria-hidden="true">▸</span> Here, {EXPOSURE.best[0]} to {EXPOSURE.best[1]} seconds makes a good negative. Too short: too faint. Too long: too dark.
              </p>
              <div className="vbr-actions">
                {sheet === 'done' ? (
                  <button type="button" className="vbr-button vbr-button-primary" onClick={newSheet}>
                    A new sheet
                  </button>
                ) : (
                  <button type="button" className="vbr-button vbr-button-primary vbi-cap-button" aria-pressed={sheet === 'exposing'} onClick={liftCap}>
                    {sheet === 'exposing' ? 'Put the cap back' : 'Lift the lens cap'}
                  </button>
                )}
              </div>
              <div className="vbi-feedback" aria-live="polite" data-verdict={result ? (result === 'good' ? 'right' : 'wrong') : undefined}>
                {result ? <p className="vbi-verdict">{EXPOSURE_WORDS[result]}</p> : <p className="vbi-verdict vbi-verdict-quiet">{sheet === 'exposing' ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}…` : 'The cap is on. The paper is blank.'}</p>}
              </div>
              <p className="vbr-note">The workshop’s seconds: a game, not the real time.</p>
            </>
          )}
          {part === 'print' && phase === 'print' && (
            <>
              <h2 className="vbi-step-title">Print from it</h2>
              <p className="vbi-step-body">
                Light made the paper go dark, so the bright window came out dark: a <strong>negative</strong>. Lay it on fresh paper in the sun, and it makes a <strong>print</strong> the right way round.
              </p>
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={print} disabled={printing}>
                  {prints ? 'Print another' : 'Print from it'}
                </button>
                <button type="button" className="vbr-button" onClick={newSheet} disabled={printing}>
                  A new sheet
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
              <p className="vbi-step-body">The first portraits took so long that the sitter had to keep perfectly still. A head clamp on a stand held the sitter’s head.</p>
              <p className="vbi-task">
                <span className="vbi-task-mark" aria-hidden="true">▸</span> You are the sitter. <strong>Press and hold the clamp</strong> to hold your head still for {EXPOSURE_S} seconds. Let go, and your head moves!
              </p>
              {sitting === 'done' ? (
                <button type="button" className="vbr-button vbr-button-primary" onClick={sitAgain}>
                  Sit again
                </button>
              ) : (
                <button type="button" className="vbi-key-button vbi-hold-button" data-live={holding || undefined} data-moving={movingNow || undefined} aria-pressed={holding} {...clampProps} {...clampKeys}>
                  {sitting === 'exposing' ? (holding ? `Holding the clamp: still… ${left}` : `You let go! Hold on… ${left}`) : 'Press and hold the clamp'}
                </button>
              )}
              <div className="vbi-feedback" aria-live="polite" data-verdict={verdict ? verdict.tone : movingNow ? 'wrong' : undefined}>
                {verdict ? (
                  <p className="vbi-verdict">{verdict.words}</p>
                ) : (
                  <p className={movingNow ? 'vbi-verdict' : 'vbi-verdict vbi-verdict-quiet'}>
                    {sitting === 'exposing' ? (holding ? `Still. ${left} seconds to go.` : 'You let go of the clamp: your head is moving, and the picture blurs.') : 'The exposure starts when you press.'}
                  </p>
                )}
              </div>
            </>
          )}

          {part === 'three' && !quiz && (
            <>
              <h2 className="vbi-step-title">Three ways to make a photograph</h2>
              <p className="vbi-step-body">Victorian photographs were made in different ways. Tap each photograph to read how it was made.</p>
              <p className="vbi-readout vbi-big-readout" aria-live="polite">
                {seen.length} of {PROCESS_CLUES.length} read
              </p>
              <div className="vbr-actions">
                <button type="button" className="vbr-button vbr-button-primary" onClick={startQuiz} disabled={!allSeen}>
                  Take the quiz <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}
          {part === 'three' && quiz && (
            <>
              <h2 className="vbi-step-title">Which is which?</h2>
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
                  <button type="button" className="vbr-button" onClick={startQuiz}>
                    Play again
                  </button>
                )}
                <button type="button" className="vbr-button vbr-button-quiet" onClick={backToLearn}>
                  Read them again
                </button>
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
                    setPrintingSheet(true);
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

        <CardFoot facts={facts} poster={POSTER.innovations} reset={`${part}${quiz}`} />
      </div>
      <p className="vbr-status" role="status" aria-live="polite">
        {status}
      </p>

      {printingSheet &&
        createPortal(
          <div className="vbr-print-root vbi-print-root" data-exhibition="victorian">
            <SheetPage name={name} prints={prints} blur={sitting === 'done' ? blur : null} />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** A wooden box camera on its stand, its brass lens capped; lift the cap and the light goes in. */
function CameraArt({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 260 300" className="vbi-camera-svg">
      {/* light from the window, into the lens while the cap is off */}
      <g className="vbi-camera-light" opacity={open ? 1 : 0}>
        <path d="M0 40 L70 112 M0 110 L70 128 M0 190 L70 144" stroke="#f2c45a" strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M150 196 L110 296 M170 196 L170 296 M190 196 L230 296" stroke="#5a3324" strokeWidth="9" strokeLinecap="round" />
      <rect x="110" y="70" width="140" height="126" rx="8" fill="#8a5a3c" stroke="#5a3324" strokeWidth="5" />
      <rect x="124" y="84" width="112" height="98" rx="4" fill="none" stroke="#c9a24a" strokeWidth="2" opacity="0.7" />
      <rect x="70" y="104" width="44" height="58" rx="6" fill="#c9a24a" stroke="#8a6a2c" strokeWidth="3" />
      <circle cx="76" cy="133" r="20" fill="#2a2522" />
      <circle cx="76" cy="133" r="11" fill="#4f6a75" opacity={open ? 1 : 0.4} />
      {/* the cap: on the lens, or lifted off above it */}
      <g style={{ transform: open ? 'translate(-6px, -82px) rotate(-14deg)' : 'none', transformOrigin: '76px 133px', transition: 'transform 0.35s ease' }}>
        <rect x="50" y="110" width="22" height="46" rx="6" fill="#1d1612" />
        <rect x="46" y="128" width="8" height="10" rx="2" fill="#c9a24a" />
      </g>
    </svg>
  );
}

/** The sheet to print (and its preview): a page of the bench's photographs, what the visitor made, and the credits. */
function SheetPage({ name, prints, blur }: { name: string; prints: number; blur: number | null }) {
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

/** A posing stand with its head clamp: an iron stand, and a fork that holds the back of the sitter's head; gripped, it glows. */
function ClampArt({ holding }: { holding: boolean }) {
  return (
    <svg viewBox="0 0 120 300" className="vbi-clamp-svg">
      <path d="M60 60 V280 M30 290 L60 270 L90 290" stroke="#3a3430" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M60 60 V40 M36 30 Q60 50 84 30" stroke={holding ? '#3f8a4a' : '#3a3430'} strokeWidth="7" strokeLinecap="round" fill="none" />
      <rect x="40" y="132" width="40" height="40" rx="10" fill={holding ? '#3f8a4a' : '#c9a24a'} stroke="#2a2522" strokeWidth="3" />
      <text x="60" y="16" textAnchor="middle" className="vbi-clamp-label">Head clamp</text>
    </svg>
  );
}
