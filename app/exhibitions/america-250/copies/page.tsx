'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import Magnifier from '@/components/games/Magnifier';
import { Celebration, isGoodScore, SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import { playCue } from '@/components/games/feedback/sound';
import RoomShell from '../RoomShell';
import { COPIES, FLAG_HREF, SIGN_HREF, SIGN_TEXT } from '../sign/signText';
import { COPIES_SOURCES } from '../sign/sources';
import { MISSIONS } from './missions';
import './copies.css';

/*
 * A Copy of a Copy, as a detective's case on a slate archive table: the
 * Declaration followed from copy to copy, the chain of four along the top
 * (the Dunlap broadside of July 1776, the Goddard broadside of 1777, Stone's
 * engraving of 1823 and the signed parchment as it is today), each copy
 * opened only once the one before it is solved. The copy lies in the middle
 * of the table under a magnifying lens (mouse, touch or keyboard:
 * components/games/Magnifier), and an evidence slip pinned beside it asks
 * one thing to find on it (missions.ts): look, choose, and a wrong guess
 * says where to look again. Found, the slip turns over to what that copy is
 * (its fact-checked note) and the posters' words about it; found first time,
 * it earns a star. At the end, the posters' last word on it: a copy of a copy.
 *
 * Every copy is a real photograph from the Library of Congress or the
 * National Archives; its sources and picture credit are in the room's
 * Sources drawer (../sign/sources.ts), none cited inline.
 */

type Phase = 'intro' | 'play' | 'done';

export default function ACopyOfACopy() {
  const t = SIGN_TEXT;
  const [phase, setPhase] = useState<Phase>('intro');
  const [at, setAt] = useState(0);
  const [tried, setTried] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const [stars, setStars] = useState<number[]>([]);
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const small = useSmallScreen();

  const mission = MISSIONS[at];
  const copy = COPIES.find((c) => c.id === mission.copy)!;

  useEffect(() => {
    if (phase !== 'intro') heading.current?.focus({ preventScroll: true });
  }, [phase, at]);
  useEffect(() => {
    if (found) next.current?.focus({ preventScroll: true });
  }, [found]);

  const start = () => {
    setAt(0);
    setTried([]);
    setFound(false);
    setStars([]);
    setStatus('');
    setPhase('play');
  };

  const guess = (id: string) => {
    if (found || tried.includes(id)) return;
    if (id === mission.answer) {
      const first = tried.length === 0;
      if (first) setStars((s) => [...s, at]);
      setFound(true);
      playCue('right');
      setStatus(`${t.copiesFound} ${mission.found}${first ? ' Found first time: a star!' : ''}`);
    } else {
      setTried((x) => [...x, id]);
      playCue('wrong');
      setStatus(`Not that one. ${mission.hint}`);
    }
  };

  const onward = () => {
    if (at === MISSIONS.length - 1) {
      setPhase('done');
      playCue('finale');
      setStatus('');
      return;
    }
    setAt(at + 1);
    setTried([]);
    setFound(false);
    setStatus('');
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
              <button type="button" className="apc-button apc-button-primary apc-start" onClick={start}>
                {t.copiesStart}
              </button>
            </section>
          )}

          {phase !== 'intro' && (
            <header className="apc-head">
              <p className="apc-head-title">{t.copiesHeading}</p>
              <Chain at={phase === 'done' ? MISSIONS.length : at} found={found} stars={stars} />
            </header>
          )}

          {phase === 'play' && (
            <div className="apc-board">
              <figure className="apc-copy" data-copy={copy.id}>
                <div className="apc-copy-box">
                  <Magnifier
                    key={copy.id}
                    src={copy.src}
                    alt={copy.alt}
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
                  Copy {at + 1} of {MISSIONS.length}
                </p>
                <h1 className="apc-slip-title" id="apc-slip-title" ref={heading} tabIndex={-1}>
                  {copy.name} <span className="apc-slip-date">{copy.date}</span>
                </h1>
                {!found ? (
                  <>
                    <p className="apc-task">
                      <span className="apc-task-tag" aria-hidden="true">Find it</span> {mission.task}
                    </p>
                    <ul className="apc-choices">
                      {mission.choices.map((c) => (
                        <li key={c.id}>
                          <button type="button" className="apc-choice" data-wrong={tried.includes(c.id) || undefined} disabled={tried.includes(c.id)} onClick={() => guess(c.id)}>
                            {c.label}
                            {tried.includes(c.id) && <span className="apc-sr"> (not this one)</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {tried.length > 0 && (
                      <p className="apc-hint">
                        <strong>{t.copiesAgain}</strong> {mission.hint}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="apc-reveal">
                    <p className="apc-found">
                      <span className="apc-found-mark" aria-hidden="true">✓</span>
                      <span>
                        <strong>{t.copiesFound}</strong> {mission.found}
                        {stars.includes(at) && <span className="apc-star-earned"> Found first time: a star!</span>}
                      </span>
                    </p>
                    <FactNote fact={copy.note} className="apc-fact" />
                    {copy.quote && (
                      <figure className="apc-poster-quote">
                        <blockquote>{copy.quote}</blockquote>
                      </figure>
                    )}
                    <button type="button" ref={next} className="apc-button apc-button-primary" onClick={onward}>
                      {at === MISSIONS.length - 1 ? 'Close the case' : t.copiesNextCopy} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {phase === 'done' && (
            <section className="apc-done" aria-labelledby="apc-done-title">
              {isGoodScore(stars.length, MISSIONS.length) && <Celebration />}
              <h1 className="apc-title" id="apc-done-title" ref={heading} tabIndex={-1}>
                {t.copiesEnd}
              </h1>
              <p className="apc-score">
                <span className="apc-score-stars" aria-hidden="true">
                  {MISSIONS.map((_, i) => (
                    <span key={i} data-on={stars.includes(i) || undefined}>★</span>
                  ))}
                </span>
                {stars.length} of {MISSIONS.length} found first time
              </p>
              <p className="apc-quote apc-close">{t.copiesClose}</p>
              <div className="apc-actions">
                <Link className="apc-button apc-button-primary" href={FLAG_HREF}>
                  {t.flagNext} <span aria-hidden="true">→</span>
                </Link>
                <button type="button" className="apc-button" onClick={start}>
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

/** The copy chain: each copy a ticket, linked to the next; ahead, still face down. */
function Chain({ at, found, stars }: { at: number; found: boolean; stars: number[] }) {
  return (
    <ol className="apc-chain" aria-label="The copy chain, first to last">
      {MISSIONS.map((m, i) => {
        const c = COPIES.find((x) => x.id === m.copy)!;
        const state = i < at || (i === at && found) ? 'done' : i === at ? 'now' : 'ahead';
        return (
          <li key={m.copy} className="apc-link" data-state={state} aria-current={i === at ? 'step' : undefined}>
            <span className="apc-ticket">
              {state === 'ahead' ? (
                <span className="apc-ticket-back" aria-hidden="true">?</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.src} alt="" width={60} height={Math.round(60 / c.ratio)} draggable={false} />
              )}
              {stars.includes(i) && <span className="apc-ticket-star" aria-hidden="true">★</span>}
            </span>
            <span className="apc-link-text">
              <span className="apc-link-name">{state === 'ahead' ? `Copy ${i + 1}` : c.name}</span>
              <span className="apc-link-date">{state === 'ahead' ? 'Not opened yet' : c.date}</span>
            </span>
            {state === 'done' && <span className="apc-sr"> (solved)</span>}
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
