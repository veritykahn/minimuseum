'use client';

import { useState } from 'react';

// ============================================
// ILLUSION RENDERER COMPONENT
// Integrates with the Seeing Is Deceiving exhibition
// Uses actual image files from /public/exhibitions/seeing/
// ============================================

type IllusionProps = {
  illusionType: string;
  src?: string;
  revealSrc?: string;
  altRevealSrc?: string;
  question?: string;
  answer?: string;
  scienceExplanation?: string;
  isPoster1: boolean;
};

export default function IllusionRenderer({
  illusionType,
  src,
  revealSrc,
  altRevealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1
}: IllusionProps) {
  const [revealed, setRevealed] = useState(false);
  const [balconyView, setBalconyView] = useState<'main' | 'out' | 'over'>('main');
  const [ponzoGuess, setPonzoGuess] = useState<'back' | 'front' | null>(null);
  const [showScience, setShowScience] = useState(false);

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  // Shared styles - RESPONSIVE LAYOUT for mobile/tablet
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 'clamp(70px, 10vh, 80px) clamp(16px, 5vw, 40px) clamp(80px, 12vh, 100px)',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    overflowY: 'auto'
  };

  // Illusion name label style
  const nameLabelStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: textColor,
    opacity: 0.5,
    marginBottom: '8px',
    flexShrink: 0,
    height: '16px'
  };

  const questionStyle: React.CSSProperties = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
    fontStyle: 'italic',
    color: textColor,
    textAlign: 'center',
    maxWidth: '600px',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: 0,
    padding: '0 10px'
  };

  // Responsive image container
  const imageContainerStyle: React.CSSProperties = {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    height: 'clamp(200px, 45vh, 400px)',
    margin: '12px 0'
  };

  const imageWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    borderRadius: '4px'
  };

  // Answer space - responsive height for longer text on mobile
  const answerContainerStyle: React.CSSProperties = {
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '8px 0'
  };

  const answerStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    color: textColor,
    textAlign: 'center',
    maxWidth: '90vw',
    lineHeight: 1.6,
    padding: '0 16px'
  };

  const answerVisibleStyle: React.CSSProperties = {
    ...answerStyle,
    opacity: 1,
    animation: 'fadeInUp 0.5s ease forwards'
  };

  const answerHiddenStyle: React.CSSProperties = {
    ...answerStyle,
    opacity: 0,
    visibility: 'hidden'
  };

  // Button area - responsive
  const buttonContainerStyle: React.CSSProperties = {
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 12px)',
    flexWrap: 'wrap',
    flexShrink: 0,
    padding: '8px 0',
    marginTop: '4px'
  };

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(10px, 2.5vw, 11px)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    background: 'transparent',
    border: `1px solid ${textColor}`,
    color: textColor,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  };

  // "How does this work?" button style - same as other buttons
  const scienceButtonStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(10px, 2.5vw, 11px)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    background: 'transparent',
    border: `1px solid ${textColor}`,
    color: textColor,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0.7,
    whiteSpace: 'nowrap'
  };

  // Museum card modal component
  const MuseumCard = () => {
    if (!scienceExplanation) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          onClick={() => setShowScience(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            opacity: showScience ? 1 : 0,
            visibility: showScience ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
            zIndex: 1000
          }}
        />

        {/* Card */}
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: showScience
              ? 'translate(-50%, -50%) rotate(0deg)'
              : 'translate(-50%, -40%) rotate(-2deg) scale(0.95)',
            opacity: showScience ? 1 : 0,
            visibility: showScience ? 'visible' : 'hidden',
            background: isPoster1 ? '#f8f7f4' : '#1c1c1c',
            borderRadius: '8px',
            padding: 'clamp(20px, 5vw, 32px)',
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 1001
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowScience(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'transparent',
              border: `1px solid ${textColor}`,
              color: textColor,
              opacity: 0.5,
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
          >
            ×
          </button>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: textColor,
              opacity: 0.4,
              marginBottom: '20px'
            }}
          >
            The Science
          </h3>

          {/* Explanation */}
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(15px, 3.5vw, 17px)',
              lineHeight: 1.8,
              color: textColor,
              opacity: 0.9,
              margin: 0
            }}
          >
            {scienceExplanation}
          </p>
        </div>
      </>
    );
  };

  // Science button component (shows alongside other buttons)
  const ScienceButton = () => {
    if (!scienceExplanation) return null;

    return (
      <button
        onClick={() => setShowScience(true)}
        style={scienceButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        How Does This Work?
      </button>
    );
  };

  // ============================================
  // CHECKER SHADOW (Adelson's Checker Shadow)
  // ============================================
  if (illusionType === 'checker-shadow') {
    const [checkerTrueFalse, setCheckerTrueFalse] = useState<'true' | 'false' | null>(null);

    const handleCheckerGuess = (guess: 'true' | 'false') => {
      setCheckerTrueFalse(guess);
      setRevealed(true);
    };

    const resetChecker = () => {
      setCheckerTrueFalse(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Adelson's Checker Shadow</span>
        <p style={questionStyle}>{question || 'A is darker than B — true or false?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/checker-reveal.jpg') : (src || '/exhibitions/seeing/checker-shadow.jpg')}
              alt="Checker Shadow Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {checkerTrueFalse && <><span style={{ color: '#888' }}>You said {checkerTrueFalse}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both squares are the exact same shade. Your brain "corrects" for the shadow.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleCheckerGuess('true')} style={buttonStyle}>
                True
              </button>
              <button onClick={() => handleCheckerGuess('false')} style={buttonStyle}>
                False
              </button>
            </>
          ) : (
            <>
              <button onClick={resetChecker} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // BALCONY (Bistable Perception)
  // ============================================
  if (illusionType === 'balcony') {
    const getImage = () => {
      if (balconyView === 'out') return revealSrc || '/exhibitions/seeing/balcony-out.jpg';
      if (balconyView === 'over') return altRevealSrc || '/exhibitions/seeing/balcony-over.jpg';
      return src || '/exhibitions/seeing/balcony.jpg';
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Bistable Figure</span>
        <p style={questionStyle}>
          {question || 'What do you see? A man on a balcony looking out — or looking over a ledge from inside?'}
        </p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img src={getImage()} alt="Balcony Illusion" style={imageStyle} />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={balconyView !== 'main' ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'Both interpretations are equally valid—this is a "bistable" image. Your brain can\'t hold both views at once, so it picks one. The same visual information, two completely different realities.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={() => setBalconyView(balconyView === 'out' ? 'main' : 'out')}
            style={{
              ...buttonStyle,
              background: balconyView === 'out' ? textColor : 'transparent',
              color: balconyView === 'out' ? (isPoster1 ? '#e0dede' : '#0a0a0a') : textColor
            }}
          >
            Looking Out
          </button>
          <button
            onClick={() => setBalconyView(balconyView === 'over' ? 'main' : 'over')}
            style={{
              ...buttonStyle,
              background: balconyView === 'over' ? textColor : 'transparent',
              color: balconyView === 'over' ? (isPoster1 ? '#e0dede' : '#0a0a0a') : textColor
            }}
          >
            Looking In
          </button>
          {balconyView !== 'main' && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // FRASER SPIRAL
  // ============================================
  if (illusionType === 'fraser-spiral') {
    const [fraserGuess, setFraserGuess] = useState<'spirals' | 'circles' | null>(null);

    const handleFraserGuess = (guess: 'spirals' | 'circles') => {
      setFraserGuess(guess);
      setRevealed(true);
    };

    const resetFraser = () => {
      setFraserGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Fraser Spiral Illusion</span>
        <p style={questionStyle}>{question || 'What shape is this — spirals or circles?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/fraser-spiral.gif') : (src || '/exhibitions/seeing/fraser-spiral.jpg')}
              alt="Fraser Spiral Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {fraserGuess && <><span style={{ color: '#888' }}>You said {fraserGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'CIRCLES — These are perfect concentric circles. The tilted black and white segments create a "twisted cord" effect that your brain interprets as a spiral path.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleFraserGuess('spirals')} style={buttonStyle}>
                Spirals
              </button>
              <button onClick={() => handleFraserGuess('circles')} style={buttonStyle}>
                Circles
              </button>
            </>
          ) : (
            <>
              <button onClick={resetFraser} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // BULGING GRID
  // ============================================
  if (illusionType === 'bulging-grid') {
    const [bulgeGuess, setBulgeGuess] = useState<'true' | 'false' | null>(null);

    const handleBulgeGuess = (guess: 'true' | 'false') => {
      setBulgeGuess(guess);
      setRevealed(true);
    };

    const resetBulge = () => {
      setBulgeGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Bulge Effect</span>
        <p style={questionStyle}>{question || 'The center of this grid bulges outward — true or false?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/grid.jpg') : (src || '/exhibitions/seeing/bulging-grid.jpg')}
              alt="Bulging Grid Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {bulgeGuess && <><span style={{ color: '#888' }}>You said {bulgeGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'FALSE — It\'s perfectly flat. Every line is straight and parallel. The progressively sized squares exploit your brain\'s perspective processing, creating a phantom 3D bulge.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleBulgeGuess('true')} style={buttonStyle}>
                True
              </button>
              <button onClick={() => handleBulgeGuess('false')} style={buttonStyle}>
                False
              </button>
            </>
          ) : (
            <>
              <button onClick={resetBulge} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // ROTATING SNAKES (Static display - no reveal)
  // ============================================
  if (illusionType === 'rotating-snakes') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Rotating Snakes · Akiyoshi Kitaoka, 2003</span>
        <p style={questionStyle}>{question || 'Look around the image. Do you see movement?'}</p>

        <div style={{ ...imageContainerStyle, maxWidth: '600px' }}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/rotating-snakes.jpg'}
              alt="Rotating Snakes Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'This image is completely static—nothing moves. The specific color sequence (black → blue → white → yellow) triggers motion-detecting neurons in your peripheral vision. Your brain literally sees movement that doesn\'t exist.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // MUNKER HEARTS (Display only - complex to animate)
  // ============================================
  if (illusionType === 'munker-hearts') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Munker-White Illusion</span>
        <p style={questionStyle}>{question || 'What colors are the hearts?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/munker-hearts.jpg'}
              alt="Munker Hearts Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'Both hearts are the EXACT SAME COLOR. The surrounding stripes alter your perception—your brain "mixes" the heart color with the stripe color, shifting what you see. This is called color assimilation.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // PONZO CORRIDOR
  // ============================================
  if (illusionType === 'ponzo-corridor') {
    const handlePonzoGuess = (guess: 'back' | 'front') => {
      setPonzoGuess(guess);
      setRevealed(true);
    };

    const resetPonzo = () => {
      setPonzoGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Ponzo Illusion</span>
        <p style={questionStyle}>{question || 'Which checkered ball is larger?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? '/exhibitions/seeing/ponzo-corridor-reveal.png' : (src || '/exhibitions/seeing/ponzo-corridor.jpg')}
              alt="Ponzo Corridor Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {ponzoGuess && <><span style={{ color: '#888' }}>You chose {ponzoGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — The converging lines trick your brain into applying perspective correction—objects "farther away" should be smaller, so your brain inflates the distant one.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handlePonzoGuess('back')} style={buttonStyle}>
                Back is Larger
              </button>
              <button onClick={() => handlePonzoGuess('front')} style={buttonStyle}>
                Front is Larger
              </button>
            </>
          ) : (
            <>
              <button onClick={resetPonzo} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // JASTROW
  // ============================================
  if (illusionType === 'jastrow') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Jastrow Illusion</span>
        <p style={questionStyle}>{question || 'Which curved shape is larger?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? '/exhibitions/seeing/jastrow-tracks-reveal.gif' : (src || '/exhibitions/seeing/jastrow-tracks.jpg')}
              alt="Jastrow Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL. Your brain automatically compares adjacent edges: the short inner curve of one shape sits next to the long outer curve of the other, making it seem smaller. Discovered by Joseph Jastrow in 1889.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Reveal the Truth'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // KANIZSA TRIANGLE
  // ============================================
  if (illusionType === 'kanizsa') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Kanizsa Triangle</span>
        <p style={questionStyle}>{question || 'Do you see a white triangle?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/kanizsa-triangle.jpg'}
              alt="Kanizsa Triangle"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'There IS no white triangle—no edges are drawn. Your brain creates "illusory contours" to complete shapes from incomplete information. Created by Italian psychologist Gaetano Kanizsa in 1955.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // TROXLER FADING
  // ============================================
  if (illusionType === 'troxler') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Troxler's Fading</span>
        <p style={questionStyle}>{question || 'Stare at the center cross for 20 seconds. What happens?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/troxler-fading.jpg'}
              alt="Troxler's Fading"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'The blobs fade and disappear. Your neurons stop responding to unchanging stimuli in peripheral vision—a process called "neural adaptation." Your brain prioritizes change over stability. Discovered in 1804.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // PARIS IN THE SPRINGTIME
  // ============================================
  if (illusionType === 'paris-springtime') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Predictive Processing</span>
        <p style={questionStyle}>{question || 'Read this carefully. What does it say?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/paris-springtime.jpg'}
              alt="Paris in the Springtime"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : { ...answerVisibleStyle }}>
            {revealed
              ? (answer || '"THE" appears TWICE! Your brain predicts familiar phrases and skips what it expects—you read what should be there, not what is. This is "top-down processing" in action.')
              : 'Read it again. Slowly.'
            }
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'Read Again' : 'Show Me'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // OLD MAN / HIDDEN FIGURES
  // ============================================
  if (illusionType === 'old-man') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Hidden Figure</span>
        <p style={questionStyle}>{question || 'What do you see in this image?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/old-man-hidden.jpg'}
              alt="Old Man Hidden Figures"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'An old bearded man emerges—but hidden figures lurk in the leaves. Your brain groups visual elements into recognizable patterns, sometimes seeing faces where none were intended.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // CONCAVE / CONVEX
  // ============================================
  if (illusionType === 'concave-convex') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Light from Above</span>
        <p style={questionStyle}>{question || 'Are these bumps or dents?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, transform: revealed ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s ease' }}>
            <img
              src={src || '/exhibitions/seeing/concave-convex.jpg'}
              alt="Concave Convex Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'Your brain has a built-in assumption: light comes from above (like the sun). Shadows on the bottom = bump. Shadows on top = dent. Flip the image and watch your perception reverse instantly.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'Flip Back' : 'Flip Upside Down'}
          </button>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // IMPOSSIBLE TRIDENT
  // ============================================
  if (illusionType === 'impossible-trident') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Impossible Trident / Blivet</span>
        <p style={questionStyle}>{question || 'How many prongs does this object have?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/impossible-trident.jpg'}
              alt="Impossible Trident"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'Two prongs at the top become three at the bottom. This "impossible object" exploits how your brain interprets 2D drawings as 3D shapes. Each end makes sense alone, but they can\'t connect in real space.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // POGGENDORFF (Image-based)
  // ============================================
  if (illusionType === 'poggendorff') {
    const [poggGuess, setPoggGuess] = useState<'grey' | 'purple' | null>(null);

    const handlePoggGuess = (guess: 'grey' | 'purple') => {
      setPoggGuess(guess);
      setRevealed(true);
    };

    const resetPogg = () => {
      setPoggGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Poggendorff Illusion</span>
        <p style={questionStyle}>{question || 'Which line does the yellow line connect to — grey or purple?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/poggendorf-reveal.jpg') : (src || '/exhibitions/seeing/poggendorf.jpg')}
              alt="Poggendorff Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {poggGuess && <><span style={{ color: '#888' }}>You chose {poggGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'PURPLE — When a diagonal line passes behind a rectangle, your brain misjudges where it should emerge. The bar disrupts your ability to track the line\'s true trajectory.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handlePoggGuess('grey')} style={buttonStyle}>
                Grey
              </button>
              <button onClick={() => handlePoggGuess('purple')} style={buttonStyle}>
                Purple
              </button>
            </>
          ) : (
            <>
              <button onClick={resetPogg} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // CUBE SHADOW
  // ============================================
  if (illusionType === 'cube-shadow') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Simultaneous Contrast</span>
        <p style={questionStyle}>{question || 'Which cube face is darker — A or B?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/cube-shadow.jpg'}
              alt="Cube Shadow Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'IDENTICAL. Like the checker shadow, your visual system automatically compensates for lighting conditions. The same gray appears lighter in shadow and darker in light—helping you recognize objects in varied lighting.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // HERMANN GRID
  // ============================================
  if (illusionType === 'hermann-grid') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Hermann Grid</span>
        <p style={questionStyle}>{question || 'Do you see gray dots at the intersections?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/ghost-dots.jpg'}
              alt="Hermann Grid"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'Ghost dots appear where you\'re NOT looking—look directly and they vanish. Your retinal cells inhibit their neighbors ("lateral inhibition"), causing intersections in peripheral vision to appear darker. Discovered by Ludimar Hermann in 1870.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // MÜLLER-LYER (SVG)
  // ============================================
  if (illusionType === 'muller-lyer') {
    const [mullerGuess, setMullerGuess] = useState<'1' | '2' | null>(null);

    const handleMullerGuess = (guess: '1' | '2') => {
      setMullerGuess(guess);
      setRevealed(true);
    };

    const resetMuller = () => {
      setMullerGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Müller-Lyer Illusion</span>
        <p style={questionStyle}>{question || 'Which line is longer — 1 or 2?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 200"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {/* Line 1: with outward arrows (appears shorter) - centered */}
              <g transform="translate(100, 60)">
                {/* Number label */}
                <text x="-30" y="5" fill="#a8d5e5" fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">1</text>
                <line
                  x1="0"
                  y1="0"
                  x2="200"
                  y2="0"
                  stroke="#a8d5e5"
                  strokeWidth="3"
                />
                {!revealed && (
                  <>
                    {/* Left outward arrow - longer */}
                    <polyline points="50,-30 0,0 50,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                    {/* Right outward arrow - longer */}
                    <polyline points="150,-30 200,0 150,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                  </>
                )}
                {revealed && (
                  <text x="100" y="-15" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
                )}
              </g>

              {/* Line 2: with inward arrows (appears longer) - centered */}
              <g transform="translate(100, 140)">
                {/* Number label */}
                <text x="-30" y="5" fill="#a8d5e5" fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">2</text>
                <line
                  x1="0"
                  y1="0"
                  x2="200"
                  y2="0"
                  stroke="#a8d5e5"
                  strokeWidth="3"
                />
                {!revealed && (
                  <>
                    {/* Left inward arrow - longer */}
                    <polyline points="-50,-30 0,0 -50,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                    {/* Right inward arrow - longer */}
                    <polyline points="250,-30 200,0 250,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                  </>
                )}
                {revealed && (
                  <text x="100" y="-15" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
                )}
              </g>

              {/* Alignment guide when revealed */}
              {revealed && (
                <>
                  <line x1="100" y1="45" x2="100" y2="155" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <line x1="300" y1="45" x2="300" y2="155" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {mullerGuess && <><span style={{ color: '#888' }}>You chose line {mullerGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — The arrows create a false sense of depth — outward arrows suggest the line recedes, inward arrows suggest it projects toward you.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleMullerGuess('1')} style={buttonStyle}>
                Line 1
              </button>
              <button onClick={() => handleMullerGuess('2')} style={buttonStyle}>
                Line 2
              </button>
            </>
          ) : (
            <>
              <button onClick={resetMuller} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // EBBINGHAUS CIRCLES (Image-based)
  // ============================================
  if (illusionType === 'ebbinghaus-circles') {
    const [ebbinghausGuess, setEbbinghausGuess] = useState<'left' | 'right' | null>(null);

    const handleEbbinghausGuess = (guess: 'left' | 'right') => {
      setEbbinghausGuess(guess);
      setRevealed(true);
    };

    const resetEbbinghaus = () => {
      setEbbinghausGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Ebbinghaus Illusion</span>
        <p style={questionStyle}>{question || 'Which orange circle is larger — left or right?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/ebbinghaus-reveal.jpg') : (src || '/exhibitions/seeing/ebbinghaus.jpg')}
              alt="Ebbinghaus Illusion"
              style={{ ...imageStyle, transition: 'opacity 2.5s ease' }}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {ebbinghausGuess && <><span style={{ color: '#888' }}>You chose {ebbinghausGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Size is relative. Surrounded by large circles, the center looks small; surrounded by small circles, it looks large.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleEbbinghausGuess('left')} style={buttonStyle}>
                Left
              </button>
              <button onClick={() => handleEbbinghausGuess('right')} style={buttonStyle}>
                Right
              </button>
            </>
          ) : (
            <>
              <button onClick={resetEbbinghaus} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // SIMULTANEOUS CONTRAST (SVG)
  // ============================================
  if (illusionType === 'simultaneous-contrast') {
    const [contrastGuess, setContrastGuess] = useState<'A' | 'B' | null>(null);

    const handleContrastGuess = (guess: 'A' | 'B') => {
      setContrastGuess(guess);
      setRevealed(true);
    };

    const resetContrast = () => {
      setContrastGuess(null);
      setRevealed(false);
    };

    // Colors: middle-value cyan/teal center on orange vs purple backgrounds (hue shift)
    const centerColor = '#5fb8b8'; // mid-value cyan/teal
    const orangeBg = '#e07830'; // vivid orange background
    const purpleBg = '#7040a0'; // rich purple background

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Simultaneous Contrast</span>
        <p style={questionStyle}>{question || 'Which is darker — A or B?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 220"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {/* Left: cyan square on orange background */}
              <rect
                x="20"
                y="10"
                width="160"
                height="160"
                fill={revealed ? '#1a1a1a' : orangeBg}
                style={{ transition: 'fill 0.5s ease' }}
              />
              <rect
                x="60"
                y="50"
                width="80"
                height="80"
                fill={centerColor}
              />

              {/* Right: cyan square on purple background */}
              <rect
                x="220"
                y="10"
                width="160"
                height="160"
                fill={revealed ? '#1a1a1a' : purpleBg}
                style={{ transition: 'fill 0.5s ease' }}
              />
              <rect
                x="260"
                y="50"
                width="80"
                height="80"
                fill={centerColor}
              />

              {/* Labels - below the squares */}
              <text x="100" y="195" fill="#a8d5e5" fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">A</text>
              <text x="300" y="195" fill="#a8d5e5" fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">B</text>

              {/* Color value label when revealed */}
              {revealed && (
                <>
                  <text x="100" y="95" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#5fb8b8</text>
                  <text x="300" y="95" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#5fb8b8</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {contrastGuess && <><span style={{ color: '#888' }}>You said {contrastGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Your brain judges color by comparison. The same cyan appears more blue-green on orange and more greenish on purple.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleContrastGuess('A')} style={buttonStyle}>
                A
              </button>
              <button onClick={() => handleContrastGuess('B')} style={buttonStyle}>
                B
              </button>
            </>
          ) : (
            <>
              <button onClick={resetContrast} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // PONZO RAILROAD (SVG)
  // ============================================
  if (illusionType === 'ponzo-railroad') {
    const [ponzoRailGuess, setPonzoRailGuess] = useState<'true' | 'false' | null>(null);

    const handlePonzoRailGuess = (guess: 'true' | 'false') => {
      setPonzoRailGuess(guess);
      setRevealed(true);
    };

    const resetPonzoRail = () => {
      setPonzoRailGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Ponzo Illusion</span>
        <p style={questionStyle}>{question || 'The top yellow bar is longer than the bottom — true or false?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 300 300"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Converging railroad lines */}
              {!revealed && (
                <>
                  <line x1="50" y1="280" x2="150" y2="20" stroke="#666" strokeWidth="3" />
                  <line x1="250" y1="280" x2="150" y2="20" stroke="#666" strokeWidth="3" />
                  {/* Railroad ties */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const y = 260 - i * 30;
                    const spread = 100 - i * 10;
                    return (
                      <line
                        key={i}
                        x1={150 - spread}
                        y1={y}
                        x2={150 + spread}
                        y2={y}
                        stroke="#555"
                        strokeWidth="2"
                      />
                    );
                  })}
                </>
              )}

              {/* Top yellow bar - centered */}
              <rect
                x={revealed ? 100 : 100}
                y={revealed ? 120 : 60}
                width="100"
                height="20"
                fill="#e8c85f"
                rx="2"
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Bottom yellow bar - centered */}
              <rect
                x={revealed ? 100 : 100}
                y={revealed ? 160 : 200}
                width="100"
                height="20"
                fill="#e8c85f"
                rx="2"
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Measurement guides when revealed */}
              {revealed && (
                <>
                  <line x1="100" y1="110" x2="100" y2="190" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <line x1="200" y1="110" x2="200" y2="190" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <text x="150" y="210" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">Same length</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {ponzoRailGuess && <><span style={{ color: '#888' }}>You said {ponzoRailGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'FALSE — They\'re identical. The converging lines create false depth cues. Your brain assumes the "distant" bar must be larger to appear the same size.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handlePonzoRailGuess('true')} style={buttonStyle}>
                True
              </button>
              <button onClick={() => handlePonzoRailGuess('false')} style={buttonStyle}>
                False
              </button>
            </>
          ) : (
            <>
              <button onClick={resetPonzoRail} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // CAFÉ WALL (SVG)
  // ============================================
  if (illusionType === 'cafe-wall') {
    const [cafeGuess, setCafeGuess] = useState<'left' | 'right' | null>(null);
    const rows = 8;
    const cols = 10;
    const tileSize = 30;
    const mortarHeight = 3;

    const handleCafeGuess = (guess: 'left' | 'right') => {
      setCafeGuess(guess);
      setRevealed(true);
    };

    const resetCafe = () => {
      setCafeGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Café Wall Illusion</span>
        <p style={questionStyle}>{question || 'Which way do the gray lines tilt — left or right?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '20px' }}>
            <svg
              viewBox={`0 0 ${cols * tileSize} ${rows * (tileSize + mortarHeight)}`}
              style={{ width: '100%', height: '100%', maxWidth: '350px' }}
            >
              {/* Gray mortar lines */}
              {Array.from({ length: rows + 1 }).map((_, i) => (
                <rect
                  key={`mortar-${i}`}
                  x="0"
                  y={i * (tileSize + mortarHeight)}
                  width={cols * tileSize}
                  height={mortarHeight}
                  fill={revealed ? '#ff6b6b' : '#808080'}
                  style={{ transition: 'fill 0.3s ease' }}
                />
              ))}

              {/* Tiles */}
              {Array.from({ length: rows }).map((_, row) => (
                <g key={`row-${row}`}>
                  {Array.from({ length: cols }).map((_, col) => {
                    const isBlack = (row + col) % 2 === 0;
                    // Offset each row by half a tile width, alternating direction
                    const offset = revealed ? 0 : (row % 2 === 0 ? tileSize / 2 : 0);
                    return (
                      <rect
                        key={`tile-${row}-${col}`}
                        x={col * tileSize + offset - (revealed ? 0 : tileSize / 4)}
                        y={row * (tileSize + mortarHeight) + mortarHeight}
                        width={tileSize}
                        height={tileSize}
                        fill={isBlack ? '#1a1a1a' : '#f0f0f0'}
                        style={{ transition: 'all 0.5s ease' }}
                      />
                    );
                  })}
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {cafeGuess && <><span style={{ color: '#888' }}>You said {cafeGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'NEITHER — They\'re perfectly parallel. The offset black and white tiles create a wedge-like appearance that tricks your visual cortex into perceiving tilt.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleCafeGuess('left')} style={buttonStyle}>
                Left
              </button>
              <button onClick={() => handleCafeGuess('right')} style={buttonStyle}>
                Right
              </button>
            </>
          ) : (
            <>
              <button onClick={resetCafe} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // SANDER PARALLELOGRAM (Image-based)
  // ============================================
  if (illusionType === 'sander-parallelogram') {
    const [userGuess, setUserGuess] = useState<'ab' | 'bc' | null>(null);

    const handleGuess = (guess: 'ab' | 'bc') => {
      setUserGuess(guess);
      setRevealed(true);
    };

    const resetSander = () => {
      setUserGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Sander Illusion</span>
        <p style={questionStyle}>{question || 'Which line is longer — A-B or B-C?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/line-comparison-reveal.gif') : (src || '/exhibitions/seeing/line-comparison.jpg')}
              alt="Sander Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {userGuess && <><span style={{ color: '#888' }}>You chose {userGuess === 'ab' ? 'A-B' : 'B-C'}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both lines are exactly the same length. The angled lines create a false sense of perspective.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleGuess('ab')} style={buttonStyle}>
                A-B
              </button>
              <button onClick={() => handleGuess('bc')} style={buttonStyle}>
                B-C
              </button>
            </>
          ) : (
            <>
              <button onClick={resetSander} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // POGGENDORFF SVG
  // ============================================
  if (illusionType === 'poggendorff-svg') {
    const [userGuess, setUserGuess] = useState<'top' | 'bottom' | null>(null);

    const handleGuess = (guess: 'top' | 'bottom') => {
      setUserGuess(guess);
      setRevealed(true);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Poggendorff Illusion</span>
        <p style={questionStyle}>{question || 'Which line on the right continues the diagonal on the left?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 300 250"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Vertical bar */}
              <rect x="120" y="20" width="60" height="210" fill="#4a4a4a" />

              {/* Left diagonal line */}
              <line x1="40" y1="180" x2="120" y2="120" stroke="#e89b5f" strokeWidth="3" />

              {/* Top option line (incorrect) */}
              <line
                x1="180"
                y1="100"
                x2="260"
                y2="40"
                stroke={revealed && userGuess === 'top' ? '#ff6b6b' : '#a8d5e5'}
                strokeWidth="3"
                style={{ transition: 'stroke 0.3s ease' }}
              />

              {/* Bottom option line (correct) */}
              <line
                x1="180"
                y1="140"
                x2="260"
                y2="80"
                stroke={revealed ? '#4ade80' : '#a8d5e5'}
                strokeWidth="3"
                style={{ transition: 'stroke 0.3s ease' }}
              />

              {/* True continuation line (shown when revealed) */}
              {revealed && (
                <line
                  x1="40"
                  y1="180"
                  x2="260"
                  y2="80"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeDasharray="6"
                  opacity="0.7"
                />
              )}

              {/* Labels */}
              {!revealed && (
                <>
                  <text x="270" y="45" fill="#a8d5e5" fontSize="14" fontFamily="Outfit, sans-serif">A</text>
                  <text x="270" y="85" fill="#a8d5e5" fontSize="14" fontFamily="Outfit, sans-serif">B</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {userGuess && <><span style={{ color: '#888' }}>You chose {userGuess === 'top' ? 'A' : 'B'}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'B (BOTTOM) — When a diagonal passes behind a rectangle, your brain misjudges where it emerges. The vertical edge disrupts your ability to track the true trajectory.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleGuess('top')} style={buttonStyle}>
                Line A (Top)
              </button>
              <button onClick={() => handleGuess('bottom')} style={buttonStyle}>
                Line B (Bottom)
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setRevealed(false); setUserGuess(null); }} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // GRADIENT BAR (Image-based)
  // ============================================
  if (illusionType === 'gradient-bar') {
    const [gradientGuess, setGradientGuess] = useState<'gradient' | 'solid' | null>(null);

    const handleGradientGuess = (guess: 'gradient' | 'solid') => {
      setGradientGuess(guess);
      setRevealed(true);
    };

    const resetGradient = () => {
      setGradientGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Gradient Illusion</span>
        <p style={questionStyle}>{question || 'Is the bar a gradient or solid color?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/gradient-reveal.jpg') : (src || '/exhibitions/seeing/gradient.jpg')}
              alt="Gradient Bar Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {gradientGuess && <><span style={{ color: '#888' }}>You said {gradientGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'SOLID — The bar is uniform throughout. The gradient background creates simultaneous contrast — making the left side appear lighter and the right side darker.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleGradientGuess('gradient')} style={buttonStyle}>
                Gradient
              </button>
              <button onClick={() => handleGradientGuess('solid')} style={buttonStyle}>
                Solid
              </button>
            </>
          ) : (
            <>
              <button onClick={resetGradient} style={buttonStyle}>
                See Illusion Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // KANIZSA TRIANGLE SVG
  // ============================================
  if (illusionType === 'kanizsa-triangle-svg') {
    const pacmanRadius = 45;

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Kanizsa Triangle</span>
        <p style={questionStyle}>{question || 'Do you see a white triangle?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 300 280"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Three pac-man shapes - mouth points toward center when not revealed */}
              {/* Top pac-man - mouth points down */}
              <path
                d={`M 150 55
                    L ${150 + pacmanRadius * Math.cos(Math.PI / 3)} ${55 + pacmanRadius * Math.sin(Math.PI / 3)}
                    A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${150 + pacmanRadius * Math.cos(2 * Math.PI / 3)} ${55 + pacmanRadius * Math.sin(2 * Math.PI / 3)}
                    Z`}
                fill="#a8d5e5"
                style={{
                  transition: 'transform 0.5s ease',
                  transformOrigin: '150px 55px',
                  transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />

              {/* Bottom-left pac-man - mouth points toward top-right */}
              <path
                d={`M 75 215
                    L ${75 + pacmanRadius * Math.cos(-Math.PI / 3)} ${215 + pacmanRadius * Math.sin(-Math.PI / 3)}
                    A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${75 + pacmanRadius * Math.cos(0)} ${215 + pacmanRadius * Math.sin(0)}
                    Z`}
                fill="#a8d5e5"
                style={{
                  transition: 'transform 0.5s ease',
                  transformOrigin: '75px 215px',
                  transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />

              {/* Bottom-right pac-man - mouth points toward top-left */}
              <path
                d={`M 225 215
                    L ${225 + pacmanRadius * Math.cos(Math.PI)} ${215 + pacmanRadius * Math.sin(Math.PI)}
                    A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${225 + pacmanRadius * Math.cos(-2 * Math.PI / 3)} ${215 + pacmanRadius * Math.sin(-2 * Math.PI / 3)}
                    Z`}
                fill="#a8d5e5"
                style={{
                  transition: 'transform 0.5s ease',
                  transformOrigin: '225px 215px',
                  transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'There IS no white triangle — no edges are drawn. Your brain creates "illusory contours" from the pac-man shapes, completing a triangle that exists only in your perception.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Break the Illusion'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // RUBIN'S VASE (Image-based)
  // ============================================
  if (illusionType === 'rubins-vase') {
    const [rubinChoice, setRubinChoice] = useState<'vase' | 'faces' | null>(null);
    const [rubinView, setRubinView] = useState<'main' | 'vase' | 'faces'>('main');

    const handleRubinChoice = (choice: 'vase' | 'faces') => {
      setRubinChoice(choice);
      setRevealed(true);
    };

    const resetRubin = () => {
      setRubinChoice(null);
      setRubinView('main');
      setRevealed(false);
    };

    const getRubinImage = () => {
      if (rubinView === 'vase') return revealSrc || '/exhibitions/seeing/rubins-vase-vase.jpg';
      if (rubinView === 'faces') return altRevealSrc || '/exhibitions/seeing/rubins-vase-face.jpg';
      return src || '/exhibitions/seeing/rubins-vase.jpg';
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Rubin's Vase</span>
        <p style={questionStyle}>{question || 'Do you see a vase or two faces?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={getRubinImage()}
              alt="Rubin's Vase"
              style={{ ...imageStyle, transition: 'opacity 0.8s ease' }}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {rubinChoice && <><span style={{ color: '#888' }}>You saw {rubinChoice === 'vase' ? 'a vase' : 'faces'}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'BOTH — This is a "bistable" image. Your brain can interpret the same contour as either the edge of a vase or the profile of two faces. Press the buttons to see each interpretation.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleRubinChoice('vase')} style={buttonStyle}>
                Vase
              </button>
              <button onClick={() => handleRubinChoice('faces')} style={buttonStyle}>
                Faces
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setRubinView(rubinView === 'vase' ? 'main' : 'vase')}
                style={{
                  ...buttonStyle,
                  background: rubinView === 'vase' ? textColor : 'transparent',
                  color: rubinView === 'vase' ? '#0a0a0a' : textColor
                }}
              >
                See Vase
              </button>
              <button
                onClick={() => setRubinView(rubinView === 'faces' ? 'main' : 'faces')}
                style={{
                  ...buttonStyle,
                  background: rubinView === 'faces' ? textColor : 'transparent',
                  color: rubinView === 'faces' ? '#0a0a0a' : textColor
                }}
              >
                See Faces
              </button>
              <button onClick={resetRubin} style={buttonStyle}>
                Start Over
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // LILAC CHASER (CSS Animation)
  // ============================================
  if (illusionType === 'lilac-chaser') {
    const [isRunning, setIsRunning] = useState(true);
    const dotCount = 12;
    const radius = 80;

    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes lilacFade {
            0%, 8.33% { opacity: 0; }
            8.34%, 100% { opacity: 1; }
          }
          .lilac-dot {
            animation: lilacFade 1.2s infinite;
          }
        `}</style>
        <span style={nameLabelStyle}>Lilac Chaser / Pac-Man Effect</span>
        <p style={questionStyle}>{question || 'Stare at the center cross for 15 seconds. What do you see?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#909090', padding: '40px', position: 'relative' }}>
            <svg
              viewBox="0 0 250 250"
              style={{ width: '100%', height: '100%', maxWidth: '250px' }}
            >
              {/* Blur filter for fuzzy edges */}
              <defs>
                <filter id="fuzzy" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
              </defs>

              {/* Center fixation cross */}
              <line x1="115" y1="125" x2="135" y2="125" stroke="#2a2a2a" strokeWidth="2" />
              <line x1="125" y1="115" x2="125" y2="135" stroke="#2a2a2a" strokeWidth="2" />

              {/* Lilac dots in a circle with fuzzy edges */}
              {Array.from({ length: dotCount }).map((_, i) => {
                const angle = (i * 360 / dotCount) * (Math.PI / 180);
                const cx = 125 + radius * Math.cos(angle);
                const cy = 125 + radius * Math.sin(angle);
                const delay = (i / dotCount) * 1.2;

                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="15"
                    fill="#e0a0d0"
                    filter="url(#fuzzy)"
                    className={isRunning ? 'lilac-dot' : ''}
                    style={{
                      animationDelay: isRunning ? `${delay}s` : '0s',
                      opacity: isRunning ? undefined : 1
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'A GREEN DOT appears to chase the gap! With prolonged fixation, the lilac dots may fade entirely. This combines Troxler\'s fading with afterimage effects — your brain fills the gap with the complementary color.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setIsRunning(!isRunning)} style={buttonStyle}>
            {isRunning ? 'Pause Animation' : 'Resume Animation'}
          </button>
          <ScienceButton />
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // PARIS IN THE SPRINGTIME SVG
  // ============================================
  if (illusionType === 'paris-springtime-svg') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Predictive Processing</span>
        <p style={questionStyle}>{question || 'Read the text inside the triangle carefully.'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 300 280"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Triangle - lilac filled */}
              <polygon
                points="150,15 15,265 285,265"
                fill="#c9a0dc"
                stroke="#c9a0dc"
                strokeWidth="2"
              />

              {/* Text inside - centered vertically and horizontally in triangle */}
              {/* Triangle centroid is at y ≈ 182, text block centered around that */}
              <text x="150" y="120" fill="#1a1a1a" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">
                I love
              </text>
              <text x="150" y="160" fill="#1a1a1a" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">
                Paris in{' '}
                <tspan fill={revealed ? '#cc3333' : '#1a1a1a'} fontWeight={revealed ? '700' : '500'} style={{ transition: 'fill 0.3s ease' }}>the</tspan>
              </text>
              <text x="150" y="200" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">
                <tspan fill={revealed ? '#cc3333' : '#1a1a1a'} fontWeight={revealed ? '700' : '500'} style={{ transition: 'fill 0.3s ease' }}>the</tspan>
                <tspan fill="#1a1a1a"> springtime</tspan>
              </text>
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : { ...answerStyle, opacity: 0.7 }}>
            {revealed
              ? (answer || '"THE" appears TWICE! Your brain predicts familiar phrases and skips what it expects. You read what should be there, not what is. This is "top-down processing" — expectation overriding perception.')
              : 'Read it again. Very slowly.'
            }
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'Read Again' : 'Show Me'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // CHROMOSTEREOPSIS (Image-based - Observational)
  // ============================================
  if (illusionType === 'chromostereopsis') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Chromostereopsis</span>
        <p style={questionStyle}>{question || 'Does the red appear to float above the blue?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/chromostereopsis.jpg'}
              alt="Chromostereopsis"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            <span style={{ color: '#a8d5e5' }}>{answer || 'This image is completely flat — yet it appears 3D. Red and blue light focus at different depths in your eye, creating a false sense of depth where none exists.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'View Again' : 'Reveal'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // SEESAW ILLUSION (Image-based)
  // ============================================
  if (illusionType === 'seesaw') {
    const [seesawGuess, setSeesawGuess] = useState<'left' | 'right' | 'balanced' | null>(null);

    const handleSeesawGuess = (guess: 'left' | 'right' | 'balanced') => {
      setSeesawGuess(guess);
      setRevealed(true);
    };

    const resetSeesaw = () => {
      setSeesawGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Seesaw Illusion</span>
        <p style={questionStyle}>{question || 'Which side is heavier?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={revealed ? (revealSrc || '/exhibitions/seeing/seesaw-reveal.jpg') : (src || '/exhibitions/seeing/seesaw.jpg')}
              alt="Seesaw Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {seesawGuess && <><span style={{ color: '#888' }}>You chose {seesawGuess}.</span> </>}
            <span style={{ color: '#a8d5e5' }}>{answer || 'BALANCED — Your brain uses visual cues like size and position to estimate weight, but these cues can be deceiving.'}</span>
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleSeesawGuess('left')} style={buttonStyle}>
                Left
              </button>
              <button onClick={() => handleSeesawGuess('right')} style={buttonStyle}>
                Right
              </button>
              <button onClick={() => handleSeesawGuess('balanced')} style={buttonStyle}>
                Balanced
              </button>
            </>
          ) : (
            <>
              <button onClick={resetSeesaw} style={buttonStyle}>
                Try Again
              </button>
              <ScienceButton />
            </>
          )}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // FALLBACK
  // ============================================
  return (
    <div style={containerStyle}>
      <p style={questionStyle}>Unknown illusion type: {illusionType}</p>
      <div style={imageContainerStyle} />
      <div style={answerContainerStyle} />
      <div style={buttonContainerStyle} />
    </div>
  );
}
