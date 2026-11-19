'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Announcer from '@/components/games/Announcer';
import GameResult from '@/components/games/GameResult';
import Magnifier, { type Callout } from '@/components/games/Magnifier';
import Verdict from '@/components/games/Verdict';
import { tierFor } from '@/components/games/scoring';
import { srOnly } from '@/lib/a11y';
import { nextSeed, useClientSeed } from '@/components/games/useClientSeed';
import { useScoredGame } from '@/components/games/useScoredGame';
import TeachToggle from '@/components/games/projector/TeachToggle';
import { useProjectorMode } from '@/components/games/projector/useProjectorMode';
import { SoundSwitch, isGoodScore } from '@/components/games/feedback/FeedbackKit';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { CLOSING, OWN_CASE, REPLICA_CLUES, REPLICA_SOURCES, ROUNDS, TIERS, fakeSides, shortExplanation, type ReplicaRound, type Side } from './data';
import RealOrReplicaProjector from './RealOrReplicaProjector';

/** Numbered markers for one photograph, numbered in the order of the round's list. */
function calloutsFor(round: ReplicaRound, on: 'fake' | 'real'): Callout[] {
  return round.callouts
    .map((c, i) => ({ ...c, n: i + 1 }))
    .filter((c) => c.on === on)
    .map(({ n, x, y }) => ({ n, x, y }));
}

/*
 * Real or Replica?: two photographs of the same ancient coin, one genuine and
 * one a fake; the student looks through the magnifier for the three things
 * an expert checks (the surface, the sharpness, the wear and the edge) and
 * says which is the fake. The answer marks what gave it away on both coins.
 * The fake's side is shuffled each game (and is never the same side every
 * round). Last, the room's own three replicas, honestly labelled.
 *
 * The point (what the poster alone can't give): the child practises looking
 * like a numismatist, comparing two coins side by side for evidence, and
 * learns why a museum says plainly which of its coins are replicas. Verity
 * likes it as it is (walkthrough, Nov 18): kept, bug-checked only.
 */

const THEME = {
  '--game-accent': '#C9A84C',
  '--game-text': '#e8e0d0',
  '--game-muted': '#a8a08e',
  '--game-right': '#7cc98a',
  '--game-wrong': '#e0b45c',
  '--game-surface': '#1C1409',
  '--game-display': "'Cormorant Garamond', serif",
  '--game-body': "'Outfit', sans-serif",
  // Projector-sized labels: 14px on a phone, up to 18px on a wide screen.
  '--game-small': 'clamp(14px, 0.6vw + 8px, 18px)',
} as CSSProperties;

export default function RealOrReplica() {
  const router = useRouter();
  const seed = useClientSeed();
  const [play, setPlay] = useState(0);
  const [stage, setStage] = useState<'rounds' | 'own-case' | 'results'>('rounds');
  const game = useScoredGame(ROUNDS.length);

  const sides = useMemo(
    () => (seed === null ? null : fakeSides(nextSeed(seed, play), ROUNDS.length)),
    [seed, play],
  );

  const round = ROUNDS[game.index];
  const fakeSide = sides?.[game.index] ?? 'a';
  const imageFor = (side: Side) => (side === fakeSide ? round.fakeImage : round.realImage);
  const answered = game.phase === 'feedback';
  const chosen = game.current?.choice as Side | undefined;
  const correct = game.current?.correct ?? false;

  const choose = (side: Side) => {
    setMore(false);
    game.answer(round.id, side, side === fakeSide);
  };
  // The answer card: two sentences, the rest behind More.
  const [more, setMore] = useState(false);
  const { short: shortText, rest: restText } = shortExplanation(round.explanation);

  const next = () => {
    if (game.isLast) setStage('own-case');
    game.next();
  };

  const restart = () => {
    game.reset();
    setPlay((p) => p + 1);
    setStage('rounds');
  };

  const fakeLabel = `Coin ${fakeSide.toUpperCase()}`;
  const announcement =
    stage === 'rounds' && answered
      ? `${correct ? 'Correct!' : 'Not quite.'} ${fakeLabel} is the fake. Score: ${game.score} of ${game.records.length}.`
      : '';

  const tier = tierFor(game.score, ROUNDS.length, TIERS);

  // A new round removes the feedback that had focus: put focus on the question.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstIndex = useRef(true);
  useEffect(() => {
    if (firstIndex.current) { firstIndex.current = false; return; }
    if (game.phase === 'question') titleRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.index, play]);

  // Teacher projector mode: its own order of fakes, so the game a visitor
  // was playing is still there, unchanged, when the teacher exits.
  const [projector, setProjector] = useProjectorMode();
  const [projectorPlay, setProjectorPlay] = useState(0);
  const projectorSides = useMemo(
    () => (seed === null ? null : fakeSides(nextSeed(seed, 1000 + projectorPlay), ROUNDS.length)),
    [seed, projectorPlay],
  );

  if (projector) {
    return (
      <RealOrReplicaProjector
        sides={projectorSides}
        onExit={() => setProjector(false)}
        onRestart={() => setProjectorPlay((p) => p + 1)}
      />
    );
  }

  return (
    // The room cites nothing yet; its Sources button appears once REPLICA_SOURCES has an entry.
    <SourcesDrawer groups={REPLICA_SOURCES}>
    <div className="rr-page" style={THEME}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rr-page {
          min-height: 100vh;
          background: #1C1409;
          color: #fafafa;
          animation: rr-fade 0.6s ease both;
        }
        @keyframes rr-fade { from { opacity: 0; } to { opacity: 1; } }

        /* ========== HEADER ========== */
        .rr-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: linear-gradient(to bottom, rgba(28,20,9,0.98) 0%, rgba(28,20,9,0) 100%);
        }
        .rr-back-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s ease;
          min-height: 44px;
        }
        .rr-back-btn:hover { color: #fafafa; }
        .rr-back-btn span[aria-hidden] { font-size: 18px; }

        .rr-header-right { display: flex; align-items: center; gap: 20px; }
        .rr-score-display {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.1em;
          color: #C9A84C;
        }

        /* ========== MAIN GAME AREA ========== */
        .rr-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 84px 40px 48px;
          min-height: 100vh;
        }

        .rr-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 300;
          color: #C9A84C;
          text-align: center;
          margin-bottom: 8px;
          outline: none;
        }
        .rr-hint {
          max-width: 40em;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.08em;
          color: #a8a08e;
          text-align: center;
          margin-bottom: 32px;
        }

        .rr-coins-row {
          display: flex;
          gap: 48px;
          align-items: flex-start;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
          max-width: 960px;
        }

        .rr-coin-slot {
          flex: 1;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        /* One height for every round (the magnifier's 320px picture, its
           padding and border), so the Fake buttons below stay put from round
           to round however tall a coin's photograph is. */
        .rr-coin-img-wrap {
          width: 100%;
          height: 258px;
          box-sizing: border-box;
          border-radius: 12px;
          background: #0d0a04;
          border: 3px solid transparent;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .rr-coin-img-wrap.rr-img-correct {
          border-color: #4A7C59;
          box-shadow: 0 0 30px rgba(74, 124, 89, 0.3);
        }
        .rr-coin-img-wrap.rr-img-incorrect {
          border-color: #C9A84C;
          box-shadow: 0 0 30px rgba(201, 168, 76, 0.2);
        }

        .rr-coin-label {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8a08e;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .rr-tag {
          font-size: var(--game-small);
          padding: 3px 8px;
          border-radius: 100px;
          border: 1px solid currentColor;
          letter-spacing: 0.12em;
        }
        .rr-tag-fake { color: #e0b45c; }
        .rr-tag-real { color: #7cc98a; }

        .rr-fake-btn {
          min-height: 44px;
          padding: 10px 32px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.6);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .rr-fake-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== RESULT CARD ========== */
        .rr-result {
          width: 100%;
          max-width: 960px;
          background: #F5EDD8;
          border-radius: 12px;
          padding: 20px 28px;
          margin-top: 0;
          --game-right: #2f6b40;
          --game-wrong: #8a5a00;
          --game-accent: #8a6a1c;
          --game-muted: #6b5f4d;
          --game-text: #3D3428;
        }
        .rr-result-verdict {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 0.8vw + 1.3rem, 2.1rem);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .rr-result-coin {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 0.5vw + 1.05rem, 1.55rem);
          color: #7a5c14;
          margin-bottom: 6px;
        }
        .rr-result-method {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b5f4d;
          margin-left: 10px;
          white-space: nowrap;
        }
        .rr-result-explanation {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.15rem, 0.5vw + 0.95rem, 1.4rem);
          line-height: 1.55;
          color: #3D3428;
          margin-bottom: 12px;
        }
        .rr-look-title {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b5f4d;
          margin-bottom: 10px;
        }
        .rr-look {
          list-style: none;
          display: grid;
          gap: 8px;
          margin-bottom: 24px;
        }
        .rr-look li {
          display: flex;
          gap: 12px;
          align-items: baseline;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 0.4vw + 0.95rem, 1.35rem);
          line-height: 1.5;
          color: #3D3428;
        }
        .rr-look-n {
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          font-weight: 600;
          color: #111;
          transform: translateY(-2px);
        }
        .rr-look-n.fake { background: #e0b45c; }
        .rr-look-n.real { background: #7cc98a; }
        .rr-look-where {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b5f4d;
          margin-right: 6px;
        }
        .rr-result-foot { display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap; }
        .rr-more-btn {
          min-height: 44px; padding: 10px 22px; border-radius: 100px;
          border: 1px solid rgba(42, 31, 14, 0.5); background: transparent; color: #2a1f0e;
          font-family: 'Outfit', sans-serif; font-size: var(--game-small);
          letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
        }
        .rr-more-btn:hover { background: rgba(42, 31, 14, 0.08); }
        .rr-more-btn:focus-visible { outline: 2px solid #2a1f0e; outline-offset: 3px; }
        .rr-more { margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(139, 125, 107, 0.25); }
        .rr-more[hidden] { display: none; }

        /* ========== THE CLUES, before a guess ========== */
        .rr-clues { width: 100%; max-width: 960px; margin: -12px 0 18px; }
        .rr-clues-title {
          font-family: 'Outfit', sans-serif; font-size: var(--game-small); font-weight: 400;
          letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C;
          text-align: center; margin-bottom: 8px;
        }
        .rr-clues-list { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .rr-clues-list li {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 10px 12px; border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 10px;
          background: rgba(201, 168, 76, 0.06);
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; line-height: 1.4; color: #e8e0d0;
        }
        .rr-clues-list strong { color: #C9A84C; font-weight: 500; }
        .rr-clue-n {
          flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: #C9A84C; color: #1C1409; font-size: 0.8rem; font-weight: 600;
        }
        @media (max-width: 760px) {
          .rr-clues-list { grid-template-columns: minmax(0, 1fr); }
        }
        .rr-next-btn {
          min-height: 44px;
          padding: 12px 28px;
          border-radius: 100px;
          border: none;
          background: #2a1f0e;
          color: #F5EDD8;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .rr-next-btn:hover { background: #4a3818; }
        .rr-next-btn:focus-visible, .rr-fake-btn:focus-visible, .rr-back-btn:focus-visible, .rr-flip:focus-visible {
          outline: 2px solid #C9A84C;
          outline-offset: 3px;
        }
        .rr-result .rr-next-btn:focus-visible { outline-color: #2a1f0e; }

        /* ========== OUR OWN CASE ========== */
        .rr-own {
          max-width: 1040px;
          width: 100%;
          text-align: center;
        }
        .rr-own-kicker {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8a08e;
          margin-bottom: 10px;
        }
        .rr-own-intro {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          line-height: 1.75;
          color: #e8e0d0;
          max-width: 680px;
          margin: 0 auto 36px;
        }
        .rr-own-grid {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          text-align: left;
          margin-bottom: 40px;
        }
        .rr-own-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: rr-rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .rr-own-card:nth-child(2) { animation-delay: 0.1s; }
        .rr-own-card:nth-child(3) { animation-delay: 0.2s; }
        @keyframes rr-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .rr-own-frame {
          background: #0d0a04;
          border-radius: 12px;
          padding: 36px 18px 18px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .rr-own-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 4;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 100px;
          background: #e0b45c;
          color: #1C1409;
        }
        .rr-own-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: #C9A84C;
          line-height: 1.3;
        }
        .rr-own-meta {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.08em;
          color: #a8a08e;
          line-height: 1.6;
        }
        .rr-own-why {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #e8e0d0;
        }
        .rr-own-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .rr-flip {
          min-height: 44px;
          padding: 6px 16px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.6);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .rr-flip[aria-pressed='true'] { background: rgba(201, 168, 76, 0.15); }
        .rr-own-link {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          color: #C9A84C;
          text-underline-offset: 3px;
        }
        .rr-final {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 100px 32px 60px;
        }
        .rr-final-closing {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #c9c2b4;
          max-width: 600px;
          margin: 4px auto 32px;
        }

        /* ========== MOBILE ========== */
        @media (max-width: 860px) {
          .rr-own-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 700px) {
          .rr-header { padding: 14px 16px; }
          .rr-header-right { gap: 10px; }
          .rr-main { padding: 84px 16px 40px; }
          .rr-coins-row {
            flex-direction: column;
            gap: 28px;
            align-items: center;
          }
          .rr-coin-slot { max-width: 100%; width: 100%; }
          .rr-result { padding: 24px 20px; }
          .rr-final { padding: 90px 16px 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rr-page, .rr-own-card { animation: none; }
        }
        @media (max-width: 600px) {
          .rr-back-label {
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
          }
          .rr-back-btn { min-width: 44px; }
        }
      `}</style>

      {/* Header */}
      <header className="rr-header">
        <button className="rr-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span aria-hidden="true">{'←'}</span>
          <span className="rr-back-label">In Their Hands</span>
        </button>
        <div className="rr-header-right">
          {stage === 'rounds' && (
            <span className="rr-score-display">
              Round {game.index + 1} of {ROUNDS.length} &middot; Score: {game.score}
            </span>
          )}
          <SoundSwitch style={{ color: '#C9A84C', fontFamily: "'Outfit', sans-serif" }} />
          <TeachToggle onClick={() => setProjector(true)} style={{ color: '#C9A84C', fontFamily: "'Outfit', sans-serif" }} />
        </div>
      </header>

      <Announcer message={announcement} />

      {stage === 'rounds' && (
        <div className="rr-main">
          <h1 className="rr-title" ref={titleRef} tabIndex={-1}>Which is the fake?</h1>
          <p className="rr-hint">Hover, tap or focus a coin to look through the magnifier.</p>

          {/* Three clues to look for, before each guess. */}
          {!answered && (
            <section className="rr-clues" aria-labelledby="rr-clues-title">
              <h2 className="rr-clues-title" id="rr-clues-title">Look for 3 clues</h2>
              <ol className="rr-clues-list">
                {REPLICA_CLUES.map((c, i) => (
                  <li key={c.title}>
                    <span className="rr-clue-n" aria-hidden="true">{i + 1}</span>
                    <span><strong>{c.title}.</strong> {c.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {sides && (
            <div className="rr-coins-row">
              {(['a', 'b'] as Side[]).map((side) => {
                const isFake = side === fakeSide;
                const border = !answered ? '' : isFake ? 'rr-img-correct' : chosen === side ? 'rr-img-incorrect' : '';
                return (
                  <div className="rr-coin-slot" key={`${round.id}-${side}`}>
                    <div className={`rr-coin-img-wrap ${border}`}>
                      <Magnifier
                        maxHeight={220}
                        src={imageFor(side)}
                        alt={`Coin ${side.toUpperCase()}: ${round.coinName}, both faces`}
                        callouts={answered ? calloutsFor(round, isFake ? 'fake' : 'real') : undefined}
                        calloutTone={isFake ? 'wrong' : 'right'}
                      />
                    </div>
                    <span className="rr-coin-label">
                      Coin {side.toUpperCase()}
                      {answered && (
                        <span className={`rr-tag ${isFake ? 'rr-tag-fake' : 'rr-tag-real'}`}>
                          {isFake ? 'Fake' : 'Genuine'}
                        </span>
                      )}
                    </span>
                    {!answered && (
                      <button
                        type="button"
                        aria-label={`Coin ${side.toUpperCase()} is the fake`}
                        className="rr-fake-btn"
                        onClick={() => choose(side)}
                      >
                        Fake
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {answered && (
            <div className="rr-result">
              <Verdict
                tone={correct ? 'right' : 'wrong'}
                titleClassName="rr-result-verdict"
                title={correct ? `Correct! ${fakeLabel} is the fake.` : `Not quite — ${fakeLabel} is the fake.`}
              >
                <p className="rr-result-coin">
                  {round.coinName} <span className="rr-result-method">Method: {round.method}</span>
                </p>
                <p className="rr-result-explanation">{shortText}</p>
                <div className="rr-result-foot">
                  <button
                    type="button"
                    className="rr-more-btn"
                    aria-expanded={more}
                    aria-controls="rr-more"
                    onClick={() => setMore((m) => !m)}
                  >
                    {more ? 'Less' : 'More'} <span aria-hidden="true">{more ? '▴' : '▾'}</span>
                  </button>
                  <button type="button" className="rr-next-btn" onClick={next}>
                    {game.isLast ? 'One more case' : 'Next Round'} <span aria-hidden="true">{'→'}</span>
                  </button>
                </div>
                <div id="rr-more" className="rr-more" hidden={!more}>
                  {restText && <p className="rr-result-explanation">{restText}</p>}
                  <p className="rr-look-title" id="rr-look-title">Look closer — the numbers on the coins</p>
                  <ol className="rr-look" aria-labelledby="rr-look-title">
                    {round.callouts.map((c, i) => (
                      <li key={i}>
                        <span className={`rr-look-n ${c.on}`} aria-hidden="true">{i + 1}</span>
                        <span>
                          <span className="rr-look-where">
                            {c.on === 'fake' ? 'Fake' : 'Genuine'} (coin {(c.on === 'fake' ? fakeSide : fakeSide === 'a' ? 'b' : 'a').toUpperCase()})
                          </span>
                          {c.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Verdict>
            </div>
          )}
        </div>
      )}

      {stage === 'own-case' && <OwnCase onDone={() => setStage('results')} />}

      {stage === 'results' && (
        <div className="rr-final">
          <GameResult
            level={1}
            eyebrow="Real or Replica?"
            score={game.score}
            scoreCaption={`out of ${ROUNDS.length}`}
            title={tier.title}
            message={<p>{tier.message}</p>}
            pips={game.records.map((r) => ({
              label: ROUNDS.find((x) => x.id === r.itemId)?.coinName ?? r.itemId,
              correct: r.correct,
            }))}
            pipsLabel="Your rounds"
            celebrate={isGoodScore(game.score, ROUNDS.length)}
            actions={[
              { label: 'Play again', onClick: restart, primary: true },
              { label: 'Back to Display Case', href: '/exhibitions/in-their-hands/artifacts/case-8?view=interactives' },
            ]}
          >
            <p className="rr-final-closing">{CLOSING}</p>
          </GameResult>
        </div>
      )}
    </div>
    </SourcesDrawer>
  );
}

function OwnCase({ onDone }: { onDone: () => void }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <div className="rr-main">
      <section className="rr-own" aria-labelledby="rr-own-title">
        <p className="rr-own-kicker">Final round · Our own case</p>
        <h1
          className="rr-title"
          id="rr-own-title"
          tabIndex={-1}
          ref={headingRef}
        >
          Three replicas — and we say so
        </h1>
        <p className="rr-own-intro">
          Three coins in Case 7 of this exhibition are replicas, and their labels say so. Original
          examples are exceptionally rare, so the museum shows museum-quality replicas instead —
          and tells you which ones they are. Look closely, then turn each one over.
        </p>
        <ul className="rr-own-grid">
          {OWN_CASE.map((c) => {
            const back = !!flipped[c.id];
            return (
              <li className="rr-own-card" key={c.id}>
                <div className="rr-own-frame">
                  <span className="rr-own-badge">Replica</span>
                  <Magnifier
                    src={back ? c.backImage : c.frontImage}
                    alt={`${c.title}, ${back ? 'reverse' : 'obverse'} (replica)`}
                    lens={140}
                    maxHeight={250}
                  />
                </div>
                <h2 className="rr-own-title">{c.title}</h2>
                <p className="rr-own-meta">
                  {c.date} · {c.material} · {c.reference}
                </p>
                <p className="rr-own-why">{c.why}</p>
                <div className="rr-own-actions">
                  <button
                    type="button"
                    className="rr-flip"
                    aria-pressed={back}
                    onClick={() => setFlipped((f) => ({ ...f, [c.id]: !f[c.id] }))}
                  >
                    {back ? 'Show the front' : 'Turn it over'}
                    <span style={srOnly}>
                      {` (${c.title})`}
                    </span>
                  </button>
                  <Link className="rr-own-link" href={`/exhibitions/in-their-hands/artifacts/case-7/${c.id}`}>
                    See it in Case 7
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="rr-next-btn" style={{ background: '#C9A84C', color: '#1C1409' }} onClick={onDone}>
          See your results <span aria-hidden="true">{'→'}</span>
        </button>
      </section>
    </div>
  );
}
