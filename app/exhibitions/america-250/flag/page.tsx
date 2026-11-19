'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { Celebration, isGoodScore, SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import { playCue } from '@/components/games/feedback/sound';
import { nextSeed, useClientSeed } from '@/components/games/useClientSeed';
import RoomShell from '../RoomShell';
import { COPIES_HREF, FLAG_MAX, FLAG_MILESTONES, FLAG_MIN, FLAG_STATES, FLAG_TEXT, SIGN_HREF, SIGN_TEXT } from '../sign/signText';
import { FLAG_SOURCES } from '../sign/sources';
import Flag from './Flag';
import {
  DECADES,
  ERAS,
  MAX_SCORE,
  POINTS,
  decadeOf,
  joinedBefore,
  judge,
  listOf,
  milestonesBetween,
  namesOf,
  pickRounds,
  verdictLine,
  type Round,
  type Verdict,
} from './game';
import './flag.css';

/*
 * Add a Star: the flag under a night sky, growing from 13 stars to 50. It
 * opens on the 13 stars and the states they stood for, and how to play.
 * Then the flag grows in seven jumps, one for each stretch of the country's
 * growth (game.ts, ERAS). Before each jump a state is named on a ticket
 * under the flag (or several, where they joined in the same year), with the
 * star it will be: the player taps the decade they think it joined on the
 * ruler of decades below (1790s to 1950s). Then its star pops onto the flag
 * with the stars of every state that joined since the last jump, named; the
 * flag says when the state really joined (a bullseye scores 3, a decade out
 * 1); a pin for every state so far marks its decade on the ruler, so the
 * bursts of joining show; and the flag's milestones appear as it passes
 * them. At 50 stars: the score, and every milestone. Which state is asked in
 * each stretch is drawn afresh each game (useClientSeed).
 *
 * The point (what the poster alone can't give): the child predicts, then
 * sees, how the country grew, state by state, in bursts (the 1810s, the
 * 1840s to 60s, 1889 and 1890) and then not at all for 47 years until Alaska
 * and Hawaii; and learns that the flag's stars count the states, so a flag
 * can be dated by its stars.
 *
 * Each state's year is as "Our Flag" (U.S. House of Representatives) has it,
 * fact-checked and owner-approved (../sign/signText.ts); the sources are in
 * the room's Sources drawer (../sign/sources.ts), none cited inline.
 */

type Phase = 'intro' | 'play' | 'done';
type Last = {
  verdict: Verdict;
  round: Round;
  guess: number;
  /** The states that joined since the last jump, whose stars went on with this one. */
  along: string[];
  milestones: (typeof FLAG_MILESTONES)[number][];
};

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
  // Which state each stretch asks about: drawn in the browser, afresh each game.
  const seed = useClientSeed();
  const [play, setPlay] = useState(0);
  const rounds = useMemo(() => (seed === null ? null : pickRounds(nextSeed(seed, play))), [seed, play]);

  useEffect(() => {
    if (phase !== 'intro') heading.current?.focus({ preventScroll: true });
  }, [phase]);

  const start = (fresh: boolean) => {
    // Play again draws new states; the first game uses the first draw.
    const next = fresh ? play + 1 : play;
    if (fresh) setPlay(next);
    const first = seed === null ? null : pickRounds(nextSeed(seed, next))[0];
    setR(0);
    setStars(FLAG_MIN);
    setFresh(0);
    setScore(0);
    setBullseyes(0);
    setLast(null);
    setStatus(first ? `${namesOf(first)}. ${FLAG_TEXT.ask}` : '');
    setPhase('play');
  };

  const guess = (decade: number) => {
    if (!rounds) return;
    const round = rounds[r];
    const verdict = judge(decade, round.year);
    const along = joinedBefore(stars, round).map((s) => s.state);
    const to = round.states[round.states.length - 1].stars;
    const milestones = milestonesBetween(stars, to);
    setScore((s) => s + POINTS[verdict]);
    if (verdict === 'bullseye') setBullseyes((b) => b + 1);
    setStars(to);
    setFresh(to - stars);
    setLast({ verdict, round, guess: decade, along, milestones });
    playCue(to === FLAG_MAX ? 'finale' : verdict === 'bullseye' || verdict === 'close' ? 'right' : 'wrong');
    const told = [
      verdictLine(verdict, round),
      along.length ? `${alongLine(along)}` : '',
      `${to} stars.`,
      ...milestones.map((m) => `${m.year}: ${m.text}`),
    ]
      .filter(Boolean)
      .join(' ');
    if (r === rounds.length - 1) {
      setStatus(told);
      setPhase('done');
    } else {
      setR(r + 1);
      setStatus(`${told} Next: ${namesOf(rounds[r + 1])}. ${FLAG_TEXT.ask}`);
    }
  };

  // The pins on the ruler: a pin for every state on the flag so far, at the decade it joined.
  const onFlag = FLAG_STATES.filter((s) => s.stars <= stars);
  const pins = (d: number) => onFlag.filter((x) => decadeOf(x.year) === d).length;
  const round = rounds?.[r] ?? null;
  const first = round?.states[0].stars ?? 0;
  const lastStar = round?.states[round.states.length - 1].stars ?? 0;
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
              <button type="button" className="apf-button apf-button-primary" onClick={() => start(false)} disabled={!rounds}>
                {FLAG_TEXT.start}
              </button>
            </section>
          )}

          {phase === 'play' && round && (
            <>
              <header className="apf-bar">
                <p className="apf-bar-title">{SIGN_TEXT.flagHeading}</p>
                <p className="apf-tally">
                  <span>
                    <strong>{stars}</strong> stars
                  </span>
                  <span>
                    Jump <strong>{r + 1}</strong> of {ERAS.length}
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
                  <div className="apf-result" data-verdict={last.verdict} key={last.round.year}>
                    <p className="apf-result-line">{verdictLine(last.verdict, last.round)}</p>
                    {POINTS[last.verdict] > 0 && <span className="apf-points">+{POINTS[last.verdict]}</span>}
                    {last.along.length > 0 && <p className="apf-along">{alongLine(last.along)}</p>}
                    {last.milestones.map((m) => (
                      <p className="apf-milestone" key={m.year}>
                        <span className="apf-milestone-year">{m.year}</span> {m.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="apf-play">
                <section className="apf-ticket" aria-labelledby="apf-ticket-name">
                  <p className="apf-ticket-n">
                    {first === lastStar ? `It will be star ${first}` : `They will be stars ${first} to ${lastStar}`}
                  </p>
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
              <p className="apf-result-line">{verdictLine(last.verdict, last.round)}</p>
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
                <button type="button" className="apf-button apf-button-primary" onClick={() => start(true)}>
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

/** The states whose stars went on with this jump. */
// REVIEW: new text
function alongLine(along: string[]) {
  return `${listOf(along)} joined in between, so ${along.length === 1 ? 'its star goes' : 'their stars go'} on too.`;
}
