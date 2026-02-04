'use client';

import { useRouter } from 'next/navigation';
import IllusionRenderer from '@/components/IllusionRenderer';
import { ILLUSION_CONTENT } from './data';
import { useCarousel, useSwipeNavigation } from './hooks';

export default function IllusionsPage() {
  const router = useRouter();
  const {
    currentIndex,
    fadeIn,
    animationKey,
    canGoPrev,
    next,
    prev,
    reset,
  } = useCarousel({ totalItems: ILLUSION_CONTENT.length });

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation({
    onSwipeLeft: next,
    onSwipeRight: prev,
  });

  const currentItem = ILLUSION_CONTENT[currentIndex];

  const handleBack = () => {
    router.push('/exhibitions/seeing-is-deceiving');
  };

  // Check if current item is an illusion (for showing navigation)
  const isIllusion = currentItem.type === 'illusion';

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
        .nav-m:hover .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left { transform: translateX(-4px); }
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
          width: 100vw;
          transition: opacity 0.4s ease;
        }

        .top-counter {
          position: fixed;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
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
          .nav-m-text { font-size: 24px; }
          .top-counter { top: 20px; }
          .step-indicator { font-size: 11px; }
          .side-nav-arrow { width: 36px; height: 36px; font-size: 16px; }
          .side-nav-arrow.left { left: 12px; }
          .side-nav-arrow.right { right: 12px; }
          .intro-container, .closing-container { padding: 100px 24px 80px; }
        }
      `}</style>

      {/* Navigation */}
      <div className="nav-m nav-m-left" onClick={handleBack}>
        <span className="nav-m-text">M</span>
        <span className="nav-arrow nav-arrow-left">←</span>
        <span className="nav-label">Exhibition</span>
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
            illusionType={currentItem.illusionType}
            src={currentItem.src}
            revealSrc={currentItem.revealSrc}
            altRevealSrc={currentItem.altRevealSrc}
            question={currentItem.question}
            answer={currentItem.answer}
            scienceExplanation={currentItem.scienceExplanation}
            isPoster1={false}
          />
        )}

        {/* Closing */}
        {currentItem.type === 'closing' && (
          <div className="closing-container">
            <p className="closing-text effect-blur-sharp">{currentItem.text}</p>
            <div className="closing-buttons">
              <button className="return-btn" onClick={reset}>
                Start Over
              </button>
              <button className="return-btn" onClick={handleBack}>
                Return to Exhibition
              </button>
            </div>
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
