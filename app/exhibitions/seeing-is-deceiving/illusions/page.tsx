'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import IllusionRenderer, { judge } from '@/components/IllusionRenderer';
import ExhibitionNav from '@/components/ExhibitionNav';
import Announcer from '@/components/games/Announcer';
import GameResult from '@/components/games/GameResult';
import { ILLUSION_CONTENT } from './data';
import { useCarousel, useSwipeNavigation } from './hooks';
import { perceptionTally, PERCEPTION_TIERS, shortcutsTitle } from './scoring';
import { tierFor } from '@/components/games/scoring';
import TeachToggle from '@/components/games/projector/TeachToggle';
import { useProjectorMode } from '@/components/games/projector/useProjectorMode';
import PerceptionLabProjector from './PerceptionLabProjector';

const RESULT_THEME = {
  '--game-accent': '#a8d5e5',
  '--game-text': '#cfe5ee',
  '--game-muted': '#8fb3c0',
  '--game-right': '#8fe0a5',
  '--game-wrong': '#f2b880',
  '--game-surface': '#0a0a0a',
  '--game-display': "'Cormorant Garamond', serif",
  '--game-body': "'Outfit', sans-serif",
  '--game-radius': '0',
  // Cormorant's figures read as letters at this size ("11" looks like "I I").
  '--game-number': "'Outfit', sans-serif",
  '--game-number-weight': '200',
} as CSSProperties;

export default function IllusionsPage() {
  const {
    currentIndex,
    fadeIn,
    animationKey,
    canGoPrev,
    next,
    prev,
    goTo,
    reset,
  } = useCarousel({ totalItems: ILLUSION_CONTENT.length, minIndex: 1 });

  // The first answer to each illusion, by illusion id. Kept while the visitor
  // moves back and forth, so an answered illusion stays answered.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState('');
  const tally = useMemo(() => perceptionTally(ILLUSION_CONTENT, answers), [answers]);

  const handleAnswer = (id: string, choiceId: string) => {
    if (answers[id]) return;
    const nextAnswers = { ...answers, [id]: choiceId };
    setAnswers(nextAnswers);
    const item = ILLUSION_CONTENT.find((i) => i.id === id);
    if (!item) return;
    const outcome = judge(item, choiceId);
    const line = outcome === 'sharp' ? item.sharpLine : outcome === 'fooled' ? item.fooledLine : item.neutralLine;
    const t = perceptionTally(ILLUSION_CONTENT, nextAnswers);
    setAnnouncement(`${line ?? ''} Fooled ${t.fooled} of ${t.answered}.`);
  };

  const startOver = () => {
    setAnswers({});
    setAnnouncement('');
    reset();
  };

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation({
    onSwipeLeft: next,
    onSwipeRight: prev,
  });

  const currentItem = ILLUSION_CONTENT[currentIndex];

  // Check if current item is an illusion (for showing navigation)
  const isIllusion = currentItem.type === 'illusion';

  // Teacher projector mode (?projector=1): a separate run through the
  // illusions; the visitor's own answers here stay as they were.
  const [projector, setProjector] = useProjectorMode();
  if (projector) return <PerceptionLabProjector onExit={() => setProjector(false)} />;

  return (
    <div
      style={{ background: '#0a0a0a', minHeight: '100vh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        .nav-m {
          position: fixed;
          top: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-m-left { left: 32px; }
        .nav-m:hover .nav-label, .nav-m:focus-visible .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left, .nav-m:focus-visible .nav-arrow-left { transform: translateX(-4px); }
        .nav-m-text { font-size: 28px; font-weight: 300; color: #525252; transition: color 0.3s ease; }
        .nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .nav-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        .fade-out { opacity: 0; transition: opacity 0.4s ease; }

        @keyframes blurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .effect-blur-sharp { animation: blurToSharp 1.2s ease forwards; }

        .illusion-page {
          min-height: 100vh;
          width: 100%;
          transition: opacity 0.4s ease;
        }
        .score-indicator {
          display: block;
          margin-top: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #8fb3c0;
          text-align: center;
          white-space: nowrap;
        }
        .pl-verdict-line {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 3.4vw, 1.6rem);
          font-weight: 500;
        }
        .pl-fooled-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin: 4px auto 28px;
          max-width: 620px;
        }
        .pl-fooled-list button {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 8px 14px;
          min-height: 36px;
          border: 1px solid rgba(168, 213, 229, 0.45);
          background: transparent;
          color: #cfe5ee;
          cursor: pointer;
        }
        .pl-fooled-list button:hover { background: rgba(168, 213, 229, 0.1); }
        .pl-fooled-title {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8fb3c0;
          margin-bottom: 10px;
        }
        .pl-closing-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 3vw, 1.35rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          color: #a8d5e5;
          max-width: 600px;
          margin: 0 auto 28px;
        }
        .side-nav-arrow:focus-visible, .begin-btn:focus-visible, .return-btn:focus-visible, .pl-fooled-list button:focus-visible {
          outline: 2px solid #a8d5e5;
          outline-offset: 3px;
        }

        .pl-teach { position: fixed; top: 22px; right: 28px; z-index: 1000; }
        .top-counter {
          position: fixed;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          text-align: center;
        }
        .step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: rgba(168, 213, 229, 0.6);
        }

        .side-nav-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(168, 213, 229, 0.3);
          background: transparent;
          color: #a8d5e5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 100;
        }
        .side-nav-arrow.left { left: 20px; }
        .side-nav-arrow.right { right: 20px; }
        .side-nav-arrow:disabled { opacity: 0.15; cursor: not-allowed; }
        .side-nav-arrow:not(:disabled):hover {
          border-color: #a8d5e5;
          background: rgba(168, 213, 229, 0.1);
          transform: translateY(-50%) scale(1.05);
        }

        .begin-btn, .return-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 40px;
          background: transparent;
          border: 1px solid #a8d5e5;
          color: #a8d5e5;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 48px;
        }
        .begin-btn:hover, .return-btn:hover {
          background: #a8d5e5;
          color: #0a0a0a;
        }
        .return-btn { padding: 16px 32px; }

        .intro-container, .closing-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px 160px;
          text-align: center;
        }
        .intro-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8d5e5;
          margin-bottom: 24px;
        }
        .intro-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-style: italic;
          color: rgba(168, 213, 229, 0.7);
          max-width: 500px;
        }

        .closing-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          color: #a8d5e5;
          max-width: 600px;
        }
        .closing-buttons {
          display: flex;
          gap: 16px;
          margin-top: 48px;
        }
        .closing-buttons .return-btn { margin-top: 0; }

        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .pl-teach { top: 14px; right: 14px; }
          .nav-m-text { font-size: 24px; }
          .pl-teach { position: fixed; top: 22px; right: 28px; z-index: 1000; }
        .top-counter { top: 20px; }
          .step-indicator { font-size: 11px; }
          .side-nav-arrow { width: 36px; height: 36px; font-size: 16px; }
          .side-nav-arrow.left { left: 12px; }
          .side-nav-arrow.right { right: 12px; }
          .intro-container, .closing-container { padding: 100px 24px 80px; }
        }
      `}</style>

      <Announcer message={announcement} />

      {/* Navigation */}
      <ExhibitionNav className="nav-m nav-m-left" href="/exhibitions/seeing-is-deceiving/artifacts">
        <span className="nav-m-text" aria-hidden="true">M</span>
        <span className="nav-arrow nav-arrow-left" aria-hidden="true">←</span>
        <span className="nav-label">Display Case</span>
      </ExhibitionNav>

      <div className="pl-teach">
        <TeachToggle onClick={() => setProjector(true)} style={{ color: '#a8d5e5', fontFamily: "'Outfit', sans-serif" }} />
      </div>

      {/* Content */}
      <div className={`illusion-page ${fadeIn ? 'fade-in' : 'fade-out'}`} key={animationKey}>
        {/* Intro */}
        {currentItem.type === 'intro' && (
          <div className="intro-container">
            <h1 className="intro-title effect-blur-sharp">{currentItem.title}</h1>
            <p className="intro-subtitle effect-blur-sharp" style={{ animationDelay: '0.2s' }}>
              {currentItem.subtitle}
            </p>
            <button className="begin-btn effect-blur-sharp" style={{ animationDelay: '0.4s' }} onClick={next}>
              Begin
            </button>
          </div>
        )}

        {/* Illusion */}
        {currentItem.type === 'illusion' && currentItem.illusionType && (
          <IllusionRenderer
            item={currentItem}
            answer={answers[currentItem.id ?? ''] ?? null}
            onAnswer={(choiceId) => handleAnswer(currentItem.id ?? '', choiceId)}
          />
        )}

        {/* Closing */}
        {currentItem.type === 'closing' && (
          <div className="closing-container">
            {tally.answered === 0 ? (
              <>
                <p className="closing-text effect-blur-sharp">{currentItem.text}</p>
                <div className="closing-buttons">
                  <button className="return-btn" onClick={startOver}>
                    Start Over
                  </button>
                  <Link className="return-btn" href="/exhibitions/seeing-is-deceiving/artifacts" style={{ textDecoration: "none" }}>
                    Return to Display Case
                  </Link>
                </div>
              </>
            ) : (
              <GameResult
                level={1}
                style={RESULT_THEME}
                eyebrow="Perception Lab"
                score={tally.fooled}
                scoreCaption={`of ${tally.answered} illusions fooled you`}
                title={shortcutsTitle(tally.fooled)}
                message={<p>{tierFor(tally.fooled, tally.answered, PERCEPTION_TIERS).message}</p>}
                pips={tally.results.map((r) => ({
                  label: r.name,
                  correct: !r.fooled,
                  status: r.fooled ? 'fooled you' : 'saw through it',
                }))}
                pipsLabel="Illusion by illusion: filled dots are the ones you saw through"
                actions={[
                  { label: 'Start Over', onClick: startOver, primary: true },
                  { label: 'Return to Display Case', href: '/exhibitions/seeing-is-deceiving/artifacts' },
                ]}
              >
                {tally.results.some((r) => r.fooled) && (
                  <>
                    <p className="pl-fooled-title" id="pl-fooled-title">Look again at the ones that fooled you</p>
                    <ul className="pl-fooled-list" aria-labelledby="pl-fooled-title">
                      {tally.results.filter((r) => r.fooled).map((r) => (
                        <li key={r.index}>
                          <button type="button" onClick={() => goTo(r.index)}>{r.name}</button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="pl-closing-text">{currentItem.text}</p>
              </GameResult>
            )}
          </div>
        )}
      </div>

      {/* Navigation - show for illusions */}
      {isIllusion && (
        <>
          <div className="top-counter">
            <span className="step-indicator">
              {currentIndex} / {ILLUSION_CONTENT.length - 2}
            </span>
            {tally.answered > 0 && (
              <span className="score-indicator">
                Fooled {tally.fooled} of {tally.answered}
              </span>
            )}
          </div>

          <button
            className="side-nav-arrow left"
            onClick={prev}
            disabled={!canGoPrev || currentIndex <= 1}
            aria-label="Previous illusion"
          >
            ←
          </button>
          <button
            className="side-nav-arrow right"
            onClick={next}
            disabled={currentIndex >= ILLUSION_CONTENT.length - 1}
            aria-label="Next illusion"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
