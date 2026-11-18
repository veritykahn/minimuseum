'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { Celebration, isGoodScore, SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import { playCue } from '@/components/games/feedback/sound';
import RoomShell from '../RoomShell';
import { COPIES_HREF, FLAG_MAX, FLAG_MILESTONES, FLAG_MIN, FLAG_TEXT, SIGN_HREF, SIGN_TEXT } from '../sign/signText';
import { FLAG_SOURCES } from '../sign/sources';
import Flag from './Flag';
import { DECADES, MAX_SCORE, POINTS, ROUNDS, decadeOf, judge, milestoneBetween, namesOf, verdictLine, type Verdict } from './game';
import './flag.css';

/*
 * Add a Star: the flag under a night sky, growing from 13 stars to 50. It
 * opens on the 13 stars and the states they stood for, and how to play.
 * Then the states come one at a time, in the order they joined the Union
 * (several at once where they joined in the same year), each named on a
 * ticket under the flag: before its star goes on, the player taps the
 * decade it joined on the ruler of decades below (1790s to 1950s). The star
 * pops onto the flag, the flag says when the state really joined (a
 * bullseye scores 3, a decade out 1), a pin marks that year's decade on the
 * ruler, and the flag's milestones appear as it passes them (15 stars and 15
 * stripes in 1795; back to 13 stripes in 1818; 50 stars in 1960). At 50
 * stars: the score, and every milestone.
 *
 * Each state's year is as "Our Flag" (U.S. House of Representatives) has it,
 * fact-checked and owner-approved (../sign/signText.ts); the sources are in
 * the room's Sources drawer (../sign/sources.ts), none cited inline.
 */

type Phase = 'intro' | 'play' | 'done';
type Last = { verdict: Verdict; round: number; guess: number; milestone?: (typeof FLAG_MILESTONES)[number] };

export default function AddAStar() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [r, setR] = useState(0);
  const [stars, setStars] = useState(FLAG_MIN);
  const [fresh, setFresh] = useState(0);
  const [score, setScore] = useState(0);
  const [bullseyes, setBullseyes] = useState(0);
  const [last, setLast] = useState<Last | null>(null);
  const [status, setStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase !== 'intro') heading.current?.focus({ preventScroll: true });
  }, [phase]);

  const start = () => {
    setR(0);
    setStars(FLAG_MIN);
    setFresh(0);
    setScore(0);
    setBullseyes(0);
    setLast(null);
    setStatus(`${namesOf(ROUNDS[0])}. ${FLAG_TEXT.ask}`);
    setPhase('play');
  };

  const guess = (decade: number) => {
    const round = ROUNDS[r];
    const verdict = judge(decade, round.year);
    const to = stars + round.states.length;
    const milestone = milestoneBetween(stars, to);
    setScore((s) => s + POINTS[verdict]);
    if (verdict === 'bullseye') setBullseyes((b) => b + 1);
    setStars(to);
    setFresh(round.states.length);
    setLast({ verdict, round: r, guess: decade, milestone });
    playCue(to === FLAG_MAX ? 'finale' : verdict === 'bullseye' || verdict === 'close' ? 'right' : 'wrong');
    const told = `${verdictLine(verdict, round)} ${to} stars.${milestone ? ` ${milestone.year}: ${milestone.text}` : ''}`;
    if (r === ROUNDS.length - 1) {
      setStatus(told);
      setPhase('done');
    } else {
      setR(r + 1);
      setStatus(`${told} Next: ${namesOf(ROUNDS[r + 1])}. ${FLAG_TEXT.ask}`);
    }
  };

  // The pins on the ruler: each year placed so far, at its decade.
  const placed = ROUNDS.slice(0, phase === 'done' ? ROUNDS.length : r);
  const pins = (d: number) => placed.filter((x) => decadeOf(x.year) === d).reduce((n, x) => n + x.states.length, 0);
  const round = ROUNDS[r];
  const first = round.states[0].stars;
  const lastStar = round.states[round.states.length - 1].stars;
  const flagLabel = `The flag with ${stars} stars`;

  return (
    <RoomShell className="ap-flag-room">
      <SourcesDrawer groups={FLAG_SOURCES}>
        <div className="apf-stage" data-phase={phase}>
          <div className="apf-sky" aria-hidden="true" />
          <SoundSwitch className="apf-sound" />

          {phase === 'intro' && (
            <section className="apf-intro" aria-labelledby="apf-title">
              <div className="apf-flag apf-flag-intro">
                <Flag stars={FLAG_MIN} label="The flag with 13 stars" />
              </div>
              <h1 className="apf-title" id="apf-title">{SIGN_TEXT.flagHeading}</h1>
              <p className="apf-lead">{FLAG_TEXT.intro}</p>
              <FactNote fact={FLAG_TEXT.thirteen} className="apf-fact" />
              <ul className="apf-originals" aria-label={FLAG_TEXT.originalsLabel}>
                {FLAG_TEXT.originals.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
              <p className="apf-scoring">{FLAG_TEXT.scoring}</p>
              <button type="button" className="apf-button apf-button-primary" onClick={start}>
                {FLAG_TEXT.start}
              </button>
            </section>
          )}

          {phase === 'play' && (
            <>
              <header className="apf-bar">
                <p className="apf-bar-title">{SIGN_TEXT.flagHeading}</p>
                <p className="apf-tally">
                  <span>
                    <strong>{stars}</strong> stars
                  </span>
                  <span>
                    Score <strong>{score}</strong>
                  </span>
                </p>
              </header>

              <div className="apf-flag-wrap">
                <div className="apf-flag" data-verdict={last?.verdict}>
                  <Flag stars={stars} fresh={fresh} label={flagLabel} />
                </div>
                {last && (
                  <div className="apf-result" data-verdict={last.verdict} key={last.round}>
                    <p className="apf-result-line">{verdictLine(last.verdict, ROUNDS[last.round])}</p>
                    {POINTS[last.verdict] > 0 && <span className="apf-points">+{POINTS[last.verdict]}</span>}
                    {last.milestone && (
                      <p className="apf-milestone">
                        <span className="apf-milestone-year">{last.milestone.year}</span> {last.milestone.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="apf-play">
                <section className="apf-ticket" aria-labelledby="apf-ticket-name">
                  <p className="apf-ticket-n">{first === lastStar ? `Star ${first}` : `Stars ${first} to ${lastStar}`}</p>
                  <h1 className="apf-ticket-name" id="apf-ticket-name" ref={heading} tabIndex={-1}>
                    {namesOf(round)}
                  </h1>
                  <p className="apf-ticket-ask">{FLAG_TEXT.ask}</p>
                </section>
                <Ruler pins={pins} onPick={guess} />
              </div>
            </>
          )}

          {phase === 'done' && last && (
            <section className="apf-done" aria-labelledby="apf-done-title">
              {isGoodScore(score, MAX_SCORE) && <Celebration />}
              <div className="apf-flag apf-flag-done">
                <Flag stars={FLAG_MAX} fresh={fresh} label="The flag with 50 stars" />
              </div>
              <h1 className="apf-title" id="apf-done-title" ref={heading} tabIndex={-1}>
                {FLAG_TEXT.finished}
              </h1>
              <p className="apf-result-line">{verdictLine(last.verdict, ROUNDS[last.round])}</p>
              <p className="apf-final">
                You scored <strong>{score}</strong> of {MAX_SCORE}, with {bullseyes} {bullseyes === 1 ? 'bullseye' : 'bullseyes'}.
              </p>
              <ol className="apf-milestones" aria-label="Milestones">
                {FLAG_MILESTONES.map((m) => (
                  <li key={m.year}>
                    <span className="apf-milestone-year">{m.year}</span> {m.text}
                  </li>
                ))}
              </ol>
              <div className="apf-actions">
                <button type="button" className="apf-button apf-button-primary" onClick={start}>
                  {FLAG_TEXT.again}
                </button>
                <Link className="apf-button" href={SIGN_HREF}>
                  {SIGN_TEXT.backToSign}
                </Link>
                <Link className="apf-button apf-button-quiet" href={COPIES_HREF}>
                  {SIGN_TEXT.copiesHeading}
                </Link>
              </div>
            </section>
          )}

          <p className="apf-sr" role="status" aria-live="polite">{status}</p>
        </div>
      </SourcesDrawer>
    </RoomShell>
  );
}

/** The ruler of decades: tap the one the state joined in; a pin for each state already placed. */
function Ruler({ pins, onPick }: { pins: (decade: number) => number; onPick: (decade: number) => void }) {
  return (
    <div className="apf-ruler" role="group" aria-label={FLAG_TEXT.pick}>
      <p className="apf-ruler-label" aria-hidden="true">{FLAG_TEXT.pick}</p>
      <ol className="apf-decades">
        {DECADES.map((d) => {
          const n = pins(d);
          return (
            <li key={d}>
              <button type="button" className="apf-decade" onClick={() => onPick(d)}>
                <span className="apf-pins" aria-hidden="true">
                  {Array.from({ length: n }, (_, i) => (
                    <span key={i} className="apf-pin" />
                  ))}
                </span>
                <span className="apf-decade-label">{d}s</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
