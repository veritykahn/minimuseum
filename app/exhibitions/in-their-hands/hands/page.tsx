'use client';

import { useState, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Announcer from '@/components/games/Announcer';
import GameResult from '@/components/games/GameResult';
import TeacherNote from '@/components/games/TeacherNote';
import Verdict from '@/components/games/Verdict';
import { tierFor } from '@/components/games/scoring';
import { nextSeed, useClientSeed } from '@/components/games/useClientSeed';
import { useScoredGame } from '@/components/games/useScoredGame';
import TeachToggle from '@/components/games/projector/TeachToggle';
import { useProjectorMode } from '@/components/games/projector/useProjectorMode';
import { SoundSwitch, isGoodScore } from '@/components/games/feedback/FeedbackKit';
import { CLOSING, HANDS_CHARACTERS, TIERS, buildRounds } from './data';
import HandsProjector from './HandsProjector';

const THEME = {
  '--game-accent': '#C9A84C',
  '--game-text': '#e6e1d6',
  '--game-muted': '#a3a3a3',
  '--game-right': '#6BBF7A',
  '--game-wrong': '#D9B65C',
  '--game-surface': '#000',
  '--game-display': "'Cormorant Garamond', serif",
  '--game-body': "'Outfit', sans-serif",
  // Projector-sized labels: 14px on a phone, up to 18px on a wide screen.
  '--game-small': 'clamp(14px, 0.6vw + 8px, 18px)',
} as CSSProperties;

export default function HandsOfHistory() {
  const router = useRouter();
  const seed = useClientSeed();
  const [play, setPlay] = useState(0);
  const total = HANDS_CHARACTERS.length;
  const game = useScoredGame(total);

  // Shuffled only in the browser, after hydration: the server never renders
  // a random order, so there is nothing for React to disagree with (#418).
  const rounds = useMemo(() => (seed === null ? null : buildRounds(nextSeed(seed, play))), [seed, play]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const round = rounds?.[game.index] ?? null;
  const character = round?.character ?? null;
  const roundState = game.phase === 'ended' ? 'finished' : game.phase === 'feedback' ? 'revealed' : 'guessing';
  const chosenName = game.current?.choice ?? null;
  const isCorrect = game.current?.correct ?? false;

  const handleChoice = (name: string) => {
    if (!character || roundState !== 'guessing') return;
    game.answer(character.id, name, name === character.character);
  };

  const playAgain = () => {
    game.reset();
    setPlay((p) => p + 1);
  };

  // After a guess the Verdict takes focus itself; on the next round, focus
  // the new question.
  const questionRef = useRef<HTMLHeadingElement>(null);
  // The verdict takes focus as it appears, and the browser scrolls the panel
  // to it, sometimes past its first line. Line the panel up so the verdict's
  // headline sits at the top. (A parent's effect runs after its child's.)
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (roundState !== 'revealed') return;
    const panel = panelRef.current;
    const verdict = panel?.querySelector<HTMLElement>('[data-tone]');
    if (!panel || !verdict) return;
    // offsetTop, not the bounding box: the verdict is still sliding in.
    panel.scrollTop = Math.max(0, verdict.offsetTop - 12);
  }, [roundState, game.index]);
  const firstRound = useRef(true);
  useEffect(() => {
    if (firstRound.current) { firstRound.current = false; return; }
    if (game.phase === 'question') questionRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.index, play]);

  const getOptionClass = (name: string) => {
    if (roundState !== 'revealed' || !character) return '';
    if (name === character.character) return 'hh-opt-correct';
    if (name === chosenName) return 'hh-opt-incorrect';
    return 'hh-opt-dim';
  };

  const announcement =
    roundState === 'revealed' && character
      ? `${isCorrect ? 'Correct!' : 'Not quite.'} These were the hands of ${character.character}. Score: ${game.score} of ${game.records.length}.`
      : '';

  const tier = tierFor(game.score, total, TIERS);

  // Teacher projector mode: its own shuffle, so the game a visitor was
  // playing is still there, unchanged, when the teacher exits.
  const [projector, setProjector] = useProjectorMode();
  const [projectorPlay, setProjectorPlay] = useState(0);
  const projectorRounds = useMemo(
    () => (seed === null ? null : buildRounds(nextSeed(seed, 1000 + projectorPlay))),
    [seed, projectorPlay],
  );

  if (projector) {
    return (
      <HandsProjector
        rounds={projectorRounds}
        onExit={() => setProjector(false)}
        onRestart={() => setProjectorPlay((p) => p + 1)}
      />
    );
  }

  return (
    <div className={`hh-page ${loaded ? 'hh-loaded' : ''} ${roundState === 'finished' ? 'hh-scroll' : ''}`} style={THEME}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hh-page {
          position: fixed;
          inset: 0;
          background: #000;
          color: #fafafa;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hh-page.hh-loaded { opacity: 1; }
        .hh-page.hh-scroll { overflow-y: auto; }

        .hh-clue-label {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a3a3a3;
          margin: 4px 0 6px;
        }
        .hh-clue {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 0.5vw + 1rem, 1.5rem);
          line-height: 1.6;
          color: #f0e6c8;
          margin-bottom: 20px;
          padding-left: 14px;
          border-left: 2px solid #C9A84C;
        }
        .hh-options-answered { margin-bottom: 22px; }
        .hh-options-answered .hh-option-btn { cursor: default; padding: 10px 18px; font-size: 1rem; }
        .hh-options-answered .hh-option-btn:hover { background: rgba(255,255,255,0.03); border-color: rgba(201, 168, 76, 0.3); }
        .hh-options-answered .hh-opt-correct, .hh-options-answered .hh-opt-correct:hover { background: rgba(74, 124, 89, 0.2); border-color: #4A7C59; }
        .hh-options-answered .hh-opt-incorrect, .hh-options-answered .hh-opt-incorrect:hover { background: rgba(201, 168, 76, 0.12); border-color: #C9A84C; }
        .hh-option-btn:focus-visible, .hh-next-btn:focus-visible, .hh-back-btn:focus-visible {
          outline: 2px solid #C9A84C;
          outline-offset: 3px;
        }

        /* ========== HEADER ========== */
        .hh-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
        }
        .hh-back-btn {
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
          min-height: 44px;
          transition: color 0.3s ease;
        }
        .hh-back-btn:hover { color: #fafafa; }
        .hh-back-btn span[aria-hidden] { font-size: 18px; }

        .hh-header-right { display: flex; align-items: center; gap: 20px; }
        @media (max-width: 600px) {
          .hh-header-right { gap: 10px; }
        }
        .hh-round-info {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.1em;
          color: #C9A84C;
          opacity: 0.8;
        }

        /* ========== MAIN LAYOUT ========== */
        .hh-main {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 80px 48px 40px;
          gap: 40px;
        }

        /* ========== HANDS IMAGE (left side) ========== */
        .hh-image-area {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          height: 100%;
        }
        .hh-image-frame {
          position: relative;
          flex: 1;
          min-height: 0;
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        .hh-image-frame img {
          height: 100%;
          width: auto;
          object-fit: contain;
          display: block;
          transition: opacity 0.5s ease;
        }
        .hh-image-frame .hh-img-hidden { opacity: 0; position: absolute; inset: 0; }
        .hh-image-frame .hh-img-visible { opacity: 1; }
        .hh-image-caption {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.05rem, 0.4vw + 0.9rem, 1.3rem);
          color: #C9A84C;
          opacity: 0.9;
          text-align: center;
          flex-shrink: 0;
        }

        /* ========== RIGHT PANEL ========== */
        .hh-panel {
          position: relative;
          flex: 0 1 480px;
          display: flex;
          flex-direction: column;
          padding: 16px 0;
          overflow-y: auto;
          max-height: calc(100vh - 120px);
        }

        .hh-question {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 300;
          color: #C9A84C;
          margin-bottom: 32px;
          line-height: 1.3;
        }

        /* ========== OPTIONS (guessing state) ========== */
        .hh-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hh-option-btn {
          padding: 16px 24px;
          border-radius: 12px;
          border: 1px solid rgba(201, 168, 76, 0.3);
          background: rgba(255,255,255,0.03);
          color: #fafafa;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 0.5vw + 1rem, 1.5rem);
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hh-option-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }
        .hh-option-btn:disabled {
          cursor: default;
        }
        .hh-option-btn.hh-opt-correct {
          background: rgba(74, 124, 89, 0.2);
          border-color: #4A7C59;
          color: #6BBF7A;
        }
        .hh-option-btn.hh-opt-incorrect {
          background: rgba(201, 168, 76, 0.12);
          border-color: #C9A84C;
          color: #C9A84C;
        }
        .hh-option-btn.hh-opt-dim {
          color: #8f8f8f;
          border-color: rgba(201, 168, 76, 0.12);
        }

        /* ========== REVEAL CARD ========== */
        .hh-reveal {
          animation: hh-fade-in 0.4s ease;
        }
        @keyframes hh-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hh-reveal-verdict {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 0.8vw + 1.2rem, 2rem);
          font-weight: 500;
          margin-bottom: 16px;
        }


        .hh-reveal-coin {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #C9A84C;
          margin-bottom: 4px;
        }

        .hh-reveal-date {
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.1em;
          color: #a3a3a3;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .hh-reveal-story {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.15rem, 0.5vw + 0.95rem, 1.4rem);
          line-height: 1.75;
          color: #d0d0d0;
          margin-bottom: 28px;
        }

        .hh-next-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: var(--game-small);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-end;
          min-height: 48px;
        }
        .hh-next-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== DOTS ========== */
        .hh-dots {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: auto;
          padding-top: 24px;
        }
        .hh-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(245, 237, 216, 0.2);
        }
        .hh-dot.active {
          background: #C9A84C;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
          transform: scale(1.3);
        }
        .hh-dot.right { background: #6BBF7A; }
        .hh-dot.missed { background: transparent; box-shadow: inset 0 0 0 1.5px #C9A84C; }

        /* ========== FINAL SCREEN ========== */
        .hh-final {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 90px 24px 48px;
          text-align: center;
        }




        .hh-final-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 0.4vw + 0.95rem, 1.35rem);
          line-height: 1.75;
          color: #d0d0d0;
          max-width: 640px;
          margin: 4px auto 32px;
        }


        /* ========== MOBILE ========== */
        @media (max-width: 900px) {
          .hh-main {
            flex-direction: column;
            padding: 80px 24px 32px;
            gap: 16px;
          }
          .hh-image-area {
            flex: none;
            height: 35vh;
            width: 100%;
          }
          .hh-panel {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            padding: 8px 0;
          }
        }
        @media (max-width: 600px) {
          .hh-back-label {
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
          }
          .hh-back-btn { min-width: 44px; }
        }
      `}</style>

      {/* Header */}
      <header className="hh-header">
        <button className="hh-back-btn" onClick={() => router.push('/exhibitions/in-their-hands/artifacts/case-7?view=interactives')}>
          <span aria-hidden="true">{'\u2190'}</span>
          <span className="hh-back-label">Display Case</span>
        </button>
        <div className="hh-header-right">
          {roundState !== 'finished' && (
            <span className="hh-round-info">
              Round {game.index + 1} of {total} &middot; Score: {game.score}
            </span>
          )}
          <SoundSwitch style={{ color: '#C9A84C', fontFamily: "'Outfit', sans-serif" }} />
          <TeachToggle onClick={() => setProjector(true)} style={{ color: '#C9A84C', fontFamily: "'Outfit', sans-serif" }} />
        </div>
      </header>

      <Announcer message={announcement} />

      {roundState !== 'finished' ? (
        <div className="hh-main">
          {round && character && (
            <>
              {/* Left: hands image, crossfade to full on reveal */}
              <div className="hh-image-area">
                <div className="hh-image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={roundState === 'revealed' ? 'hh-img-hidden' : 'hh-img-visible'}
                    src={character.handsImage}
                    alt={roundState === 'revealed' ? '' : 'Whose hands?'}
                    aria-hidden={roundState === 'revealed' || undefined}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={roundState === 'revealed' ? 'hh-img-visible' : 'hh-img-hidden'}
                    src={character.fullImage}
                    // Not exposed until the reveal, so the answer isn't read out early.
                    alt={roundState === 'revealed' ? character.character : ''}
                    aria-hidden={roundState !== 'revealed' || undefined}
                  />
                </div>
                <p className="hh-image-caption">{character.caption}</p>
              </div>

              {/* Right: question panel */}
              <div className="hh-panel" ref={panelRef}>
                {roundState === 'guessing' ? (
                  <>
                    <h1 className="hh-question" id="hh-question" ref={questionRef} tabIndex={-1} style={{ outline: 'none' }}>{character.prompt}</h1>
                    <div className="hh-options" role="group" aria-labelledby="hh-question">
                      {round.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          className="hh-option-btn"
                          onClick={() => handleChoice(opt.character)}
                        >
                          {opt.character}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="hh-reveal">
                    <div className="hh-options hh-options-answered" aria-hidden="true">
                      {round.options.map((opt) => (
                        <span key={opt.id} className={`hh-option-btn ${getOptionClass(opt.character)}`}>
                          {opt.character}
                        </span>
                      ))}
                    </div>
                    <Verdict
                      tone={isCorrect ? 'right' : 'wrong'}
                      titleClassName="hh-reveal-verdict"
                      title={isCorrect ? `Correct! ${character.character}.` : `Not quite — these were the hands of ${character.character}.`}
                    >
                      <p className="hh-clue-label">Why these hands</p>
                      <p className="hh-clue">{character.clue}</p>
                      <h2 className="hh-reveal-coin">{character.coinName}</h2>
                      <p className="hh-reveal-date">{character.coinDate}</p>
                      <p className="hh-reveal-story">{character.story}</p>
                      <button type="button" className="hh-next-btn" onClick={game.next}>
                        {game.isLast ? 'See Results' : 'Next'} <span aria-hidden="true">{'\u2192'}</span>
                      </button>
                    </Verdict>
                  </div>
                )}

                {character.teacherNote && <TeacherNote note={character.teacherNote} />}

                {/* Progress dots */}
                <div className="hh-dots" aria-hidden="true">
                  {rounds!.map((r, i) => {
                    const rec = game.records[i];
                    return (
                      <span
                        key={r.character.id}
                        className={`hh-dot ${i === game.index ? 'active' : ''} ${rec ? (rec.correct ? 'right' : 'missed') : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="hh-final">
          <GameResult
            level={1}
            eyebrow="Hands of History"
            score={game.score}
            scoreCaption={`out of ${total}`}
            title={tier.title}
            message={<p>{tier.message}</p>}
            pips={game.records.map((r) => ({
              label: HANDS_CHARACTERS.find((c) => c.id === r.itemId)?.character ?? r.itemId,
              correct: r.correct,
            }))}
            pipsLabel="Your rounds"
            celebrate={isGoodScore(game.score, total)}
            actions={[
              { label: 'Play again', onClick: playAgain, primary: true },
              { label: 'Back to Display Case', href: '/exhibitions/in-their-hands/artifacts/case-7?view=interactives' },
            ]}
          >
            <p className="hh-final-text">{CLOSING}</p>
          </GameResult>
        </div>
      )}
    </div>
  );
}
