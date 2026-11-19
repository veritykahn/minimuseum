'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import Magnifier from '@/components/games/Magnifier';
import { Celebration, isGoodScore, SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import { playCue } from '@/components/games/feedback/sound';
import { nextSeed, useClientSeed } from '@/components/games/useClientSeed';
import RoomShell from '../RoomShell';
import { COPIES, FLAG_HREF, SIGN_HREF, SIGN_TEXT, type CopyId } from '../sign/signText';
import { COPIES_SOURCES } from '../sign/sources';
import { CASE_FILES, EXHIBIT_LETTERS, HINTS, PICTURE, exhibitAlt, exhibitOrder, fileFor } from './missions';
import './copies.css';

/*
 * A Copy of a Copy, as a detective's case on a slate archive table. The four
 * copies of the Declaration (the Dunlap broadside of July 1776, the Goddard
 * broadside of 1777, Stone's engraving of 1823 and the signed parchment as
 * it is today) come out of the box muddled up and unlabelled, Exhibit A to
 * D, in an order shuffled each game. Each lies in the middle of the table
 * under a magnifying lens (mouse, touch or keyboard: components/games/
 * Magnifier), and the evidence slip beside it holds the four case files,
 * each saying what to look for (missions.ts). The detective looks and picks
 * the file that matches; a wrong one says where on that sheet to look
 * again; a right one turns the slip over to what the copy is (its
 * fact-checked note), the posters' words about it, and puts it in its place
 * on the chain along the top, which fills in date order. Matched first
 * time, it earns a star. Last, a twist: which of the four do most people
 * picture? (Stone's engraving: "a copy of a copy".)
 *
 * The point (what the poster alone can't give): the child tells the copies
 * apart by evidence they find with their own eyes (printed type or
 * handwriting, two names or dozens, crisp or faded) and so learns that the
 * Declaration most people picture is not the signed parchment but a copy of
 * it, made in 1823. Verity, Nov 18: "make it more exciting"; before, the
 * copies came in date order with their names on, and each question's answer
 * was in its own heading.
 *
 * Every copy is a real photograph from the Library of Congress or the
 * National Archives; its sources and picture credit are in the room's
 * Sources drawer (../sign/sources.ts), none cited inline.
 */

type Phase = 'intro' | 'play' | 'picture' | 'done';

export default function ACopyOfACopy() {
  const t = SIGN_TEXT;
  const [phase, setPhase] = useState<Phase>('intro');
  const seed = useClientSeed();
  const [play, setPlay] = useState(0);
  const order = useMemo(() => (seed === null ? null : exhibitOrder(nextSeed(seed, play))), [seed, play]);
  const [at, setAt] = useState(0);
  const [tried, setTried] = useState<CopyId[]>([]);
  const [found, setFound] = useState(false);
  const [stars, setStars] = useState<CopyId[]>([]);
  const [matched, setMatched] = useState<CopyId[]>([]);
  const [picTried, setPicTried] = useState<CopyId[]>([]);
  const [picFound, setPicFound] = useState(false);
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const small = useSmallScreen();

  const copyId = order?.[at] ?? null;
  const copy = copyId ? COPIES.find((c) => c.id === copyId)! : null;
  const letter = EXHIBIT_LETTERS[at];

  useEffect(() => {
    if (phase !== 'intro') heading.current?.focus({ preventScroll: true });
  }, [phase, at]);
  useEffect(() => {
    if (found || picFound) next.current?.focus({ preventScroll: true });
  }, [found, picFound]);

  const start = (again: boolean) => {
    if (again) setPlay((p) => p + 1);
    setAt(0);
    setTried([]);
    setFound(false);
    setStars([]);
    setMatched([]);
    setPicTried([]);
    setPicFound(false);
    setStatus('');
    setPhase('play');
  };

  // REVIEW: new text, the feedback lines below.
  const guess = (file: CopyId) => {
    if (!copyId || found || tried.includes(file)) return;
    if (file === copyId) {
      const first = tried.length === 0;
      if (first) setStars((s) => [...s, copyId]);
      setMatched((m) => [...m, copyId]);
      setFound(true);
      playCue('right');
      setStatus(`${t.copiesFound} Exhibit ${letter} is ${fileFor(copyId).title.replace(/^The /, 'the ')}.${first ? ' Matched first time: a star!' : ''}`);
    } else {
      setTried((x) => [...x, file]);
      playCue('wrong');
      const taken = matched.indexOf(file);
      const why = taken >= 0 ? `That file is already matched, to Exhibit ${EXHIBIT_LETTERS[order!.indexOf(file)]}.` : 'Not that file.';
      setStatus(`${why} ${HINTS[copyId]}`);
    }
  };

  const onward = () => {
    if (!order) return;
    if (at === order.length - 1) {
      setPhase('picture');
      setStatus('');
      return;
    }
    setAt(at + 1);
    setTried([]);
    setFound(false);
    setStatus('');
  };

  const pick = (c: CopyId) => {
    if (picFound || picTried.includes(c)) return;
    if (c === PICTURE.answer) {
      setPicFound(true);
      playCue('finale');
      setStatus(`${t.copiesFound} ${PICTURE.found}`);
    } else {
      setPicTried((x) => [...x, c]);
      playCue('wrong');
      setStatus(`Not that one. ${PICTURE.hint}`);
    }
  };

  return (
    <RoomShell className="ap-copies-room">
      <SourcesDrawer groups={COPIES_SOURCES}>
        <div className="apc-stage" data-phase={phase}>
          <div className="apc-table" aria-hidden="true" />
          <SoundSwitch className="apc-sound" />

          {phase === 'intro' && (
            <section className="apc-intro" aria-labelledby="apc-title">
              <p className="apc-kicker">A detective’s case</p>
              <h1 className="apc-title" id="apc-title">{t.copiesHeading}</h1>
              <p className="apc-quote">{t.copiesIntro}</p>
              <ul className="apc-fan" aria-hidden="true">
                {COPIES.map((c) => (
                  <li key={c.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.src} alt="" width={160} height={Math.round(160 / c.ratio)} draggable={false} />
                  </li>
                ))}
              </ul>
              <p className="apc-lead">{t.copiesLead}</p>
              <button type="button" className="apc-button apc-button-primary apc-start" onClick={() => start(false)} disabled={!order}>
                {t.copiesStart}
              </button>
            </section>
          )}

          {phase !== 'intro' && (
            <header className="apc-head">
              <p className="apc-head-title">{t.copiesHeading}</p>
              <Chain matched={matched} stars={stars} order={order ?? []} />
            </header>
          )}

          {phase === 'play' && copy && copyId && (
            <div className="apc-board">
              <figure className="apc-copy" data-copy={found ? copy.id : undefined}>
                <div className="apc-copy-box">
                  <Magnifier
                    key={copy.id}
                    src={copy.src}
                    alt={found ? copy.alt : exhibitAlt(copy.id, letter)}
                    zoom={small ? 2.6 : 3}
                    lens={small ? 140 : 210}
                    maxHeight={2000}
                    className="apc-lens"
                    style={{ width: `min(100cqw, 100cqh * ${copy.ratio.toFixed(4)})`, '--game-accent': '#e8c77d' } as CSSProperties}
                  />
                </div>
                <figcaption className="apc-copy-caption">{t.lensHint}</figcaption>
              </figure>

              <section className="apc-slip" data-found={found || undefined} aria-labelledby="apc-slip-title">
                <p className="apc-slip-n">
                  Exhibit {letter} &middot; {at + 1} of {order!.length}
                </p>
                <h1 className="apc-slip-title" id="apc-slip-title" ref={heading} tabIndex={-1}>
                  {found ? (
                    <>
                      {copy.name} <span className="apc-slip-date">{copy.date}</span>
                    </>
                  ) : (
                    `Exhibit ${letter}`
                  )}
                </h1>
                {!found ? (
                  <>
                    <p className="apc-task">
                      {/* REVIEW: new text */}
                      <span className="apc-task-tag" aria-hidden="true">Which is it?</span> Look with the lens, then choose the case file that matches this copy.
                    </p>
                    <ul className="apc-choices apc-files">
                      {CASE_FILES.map((f) => (
                        <li key={f.copy}>
                          <button
                            type="button"
                            className="apc-choice apc-file"
                            data-wrong={tried.includes(f.copy) || undefined}
                            data-matched={matched.includes(f.copy) || undefined}
                            disabled={tried.includes(f.copy)}
                            onClick={() => guess(f.copy)}
                          >
                            <span className="apc-file-title">
                              {f.title} <span className="apc-file-when">{f.when}</span>
                            </span>
                            <span className="apc-file-look">{f.look}</span>
                            {matched.includes(f.copy) && (
                              <span className="apc-file-done">Matched: Exhibit {EXHIBIT_LETTERS[order!.indexOf(f.copy)]}</span>
                            )}
                            {tried.includes(f.copy) && <span className="apc-sr"> (not this one)</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {tried.length > 0 && (
                      <p className="apc-hint">
                        <strong>{t.copiesAgain}</strong> {HINTS[copyId]}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="apc-reveal">
                    <p className="apc-found">
                      <span className="apc-found-mark" aria-hidden="true">✓</span>
                      <span>
                        <strong>{t.copiesFound}</strong> {fileFor(copyId).look}
                        {stars.includes(copyId) && <span className="apc-star-earned"> Matched first time: a star!</span>}
                      </span>
                    </p>
                    <FactNote fact={copy.note} className="apc-fact" />
                    {copy.quote && (
                      <figure className="apc-poster-quote">
                        <blockquote>{copy.quote}</blockquote>
                      </figure>
                    )}
                    <button type="button" ref={next} className="apc-button apc-button-primary" onClick={onward}>
                      {at === order!.length - 1 ? 'One last question' : t.copiesNextCopy} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {phase === 'picture' && (
            <section className="apc-picture" aria-labelledby="apc-picture-title">
              <h1 className="apc-picture-ask" id="apc-picture-title" ref={heading} tabIndex={-1}>
                {PICTURE.ask}
              </h1>
              <ul className="apc-picture-row">
                {CASE_FILES.map((f) => {
                  const c = COPIES.find((x) => x.id === f.copy)!;
                  const wrong = picTried.includes(f.copy);
                  const right = picFound && f.copy === PICTURE.answer;
                  return (
                    <li key={f.copy}>
                      <button
                        type="button"
                        className="apc-picture-pick"
                        data-wrong={wrong || undefined}
                        data-right={right || undefined}
                        disabled={wrong || (picFound && !right)}
                        aria-pressed={right || undefined}
                        onClick={() => pick(f.copy)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.src} alt="" width={140} height={Math.round(140 / c.ratio)} draggable={false} />
                        <span className="apc-picture-name">{c.name}</span>
                        <span className="apc-picture-date">{c.date}</span>
                        {wrong && <span className="apc-sr"> (not this one)</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {picTried.length > 0 && !picFound && <p className="apc-hint apc-picture-hint">{PICTURE.hint}</p>}
              {picFound && (
                <div className="apc-picture-reveal">
                  <p className="apc-found">
                    <span className="apc-found-mark" aria-hidden="true">✓</span>
                    <span>
                      <strong>{t.copiesFound}</strong> {PICTURE.found}
                    </span>
                  </p>
                  <p className="apc-quote">{t.copiesIntro}</p>
                  <button type="button" ref={next} className="apc-button apc-button-primary" onClick={() => setPhase('done')}>
                    Close the case <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </section>
          )}

          {phase === 'done' && (
            <section className="apc-done" aria-labelledby="apc-done-title">
              {isGoodScore(stars.length, CASE_FILES.length) && <Celebration />}
              <h1 className="apc-title" id="apc-done-title" ref={heading} tabIndex={-1}>
                {t.copiesEnd}
              </h1>
              <p className="apc-score">
                <span className="apc-score-stars" aria-hidden="true">
                  {CASE_FILES.map((f) => (
                    <span key={f.copy} data-on={stars.includes(f.copy) || undefined}>★</span>
                  ))}
                </span>
                {stars.length} of {CASE_FILES.length} matched first time
              </p>
              <p className="apc-quote apc-close">{t.copiesClose}</p>
              <div className="apc-actions">
                <Link className="apc-button apc-button-primary" href={FLAG_HREF}>
                  {t.flagNext} <span aria-hidden="true">→</span>
                </Link>
                <button type="button" className="apc-button" onClick={() => start(true)}>
                  Play again
                </button>
                <Link className="apc-button apc-button-quiet" href={SIGN_HREF}>
                  {t.backToSign}
                </Link>
              </div>
            </section>
          )}

          <p className="apc-sr" role="status" aria-live="polite">{status}</p>
        </div>
      </SourcesDrawer>
    </RoomShell>
  );
}

/** The copy chain, in date order: each file a ticket, filled with its exhibit once matched. */
function Chain({ matched, stars, order }: { matched: CopyId[]; stars: CopyId[]; order: CopyId[] }) {
  return (
    <ol className="apc-chain" aria-label="The copy chain, first to last">
      {CASE_FILES.map((f) => {
        const c = COPIES.find((x) => x.id === f.copy)!;
        const done = matched.includes(f.copy);
        return (
          <li key={f.copy} className="apc-link" data-state={done ? 'done' : 'ahead'}>
            <span className="apc-ticket">
              {done ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.src} alt="" width={60} height={Math.round(60 / c.ratio)} draggable={false} />
              ) : (
                <span className="apc-ticket-back" aria-hidden="true">?</span>
              )}
              {stars.includes(f.copy) && <span className="apc-ticket-star" aria-hidden="true">★</span>}
            </span>
            <span className="apc-link-text">
              <span className="apc-link-name">{f.title}</span>
              <span className="apc-link-date">{done ? `Exhibit ${EXHIBIT_LETTERS[order.indexOf(f.copy)]}` : f.when}</span>
            </span>
            <span className="apc-sr">{done ? ' (matched)' : ' (not matched yet)'}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** A phone's width: a smaller lens, so it never covers the whole page. */
function useSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 760px)');
    if (!mq) return;
    const read = () => setSmall(mq.matches);
    read();
    mq.addEventListener?.('change', read);
    return () => mq.removeEventListener?.('change', read);
  }, []);
  return small;
}
