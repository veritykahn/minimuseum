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
  const [checkerGuess, setCheckerGuess] = useState<'A' | 'B' | null>(null);
  const [ponzoGuess, setPonzoGuess] = useState<'back' | 'front' | null>(null);
  const [showScience, setShowScience] = useState(false);

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  // Shared styles - FIXED LAYOUT to prevent any shifts on reveal
  const containerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '80px 40px 40px',  // More top padding for nav, less bottom
    boxSizing: 'border-box',
    overflow: 'hidden'
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
    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
    fontStyle: 'italic',
    color: textColor,
    textAlign: 'center',
    maxWidth: '600px',
    height: '60px',  // FIXED height, not minHeight
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: 0
  };

  // FIXED-size image container - absolutely no flex growth/shrink
  const imageContainerStyle: React.CSSProperties = {
    flex: '0 0 auto',  // No grow, no shrink
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    height: 'calc(100vh - 340px)',  // FIXED height (more space with top nav)
    minHeight: '200px',
    margin: '16px 0'
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

  // Answer space - FIXED height, visibility controlled
  const answerContainerStyle: React.CSSProperties = {
    height: '60px',  // FIXED height, not minHeight
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const answerStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '13px',
    color: textColor,
    textAlign: 'center',
    maxWidth: '450px',
    lineHeight: 1.5,
    padding: '0 20px'
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

  // Button area - FIXED height
  const buttonContainerStyle: React.CSSProperties = {
    height: '50px',  // FIXED height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    flexShrink: 0
  };

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '12px 24px',
    background: 'transparent',
    border: `1px solid ${textColor}`,
    color: textColor,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // "How does this work?" button style - same as other buttons
  const scienceButtonStyle: React.CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '12px 24px',
    background: 'transparent',
    border: `1px solid ${textColor}`,
    color: textColor,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0.7
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
            padding: '32px',
            width: 'calc(100% - 48px)',
            maxWidth: '420px',
            maxHeight: '70vh',
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
              fontSize: '17px',
              lineHeight: 1.9,
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
    const handleGuess = (guess: 'A' | 'B') => {
      setCheckerGuess(guess);
      setRevealed(true);
    };

    const resetChecker = () => {
      setCheckerGuess(null);
      setRevealed(false);
    };

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Adelson's Checker Shadow</span>
        <p style={questionStyle}>{question || 'Which square is darker — A or B?'}</p>

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
            {checkerGuess && `You chose ${checkerGuess}. `}
            {answer || 'They\'re IDENTICAL. Your visual system automatically compensates for shadows, making B appear lighter than it actually is. This "lightness constancy" helps you recognize objects under varying lighting—but here it deceives you.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          {!revealed ? (
            <>
              <button onClick={() => handleGuess('A')} style={buttonStyle}>
                A is Darker
              </button>
              <button onClick={() => handleGuess('B')} style={buttonStyle}>
                B is Darker
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
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Fraser Spiral Illusion</span>
        <p style={questionStyle}>{question || 'Is this a spiral — or something else?'}</p>

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
            {answer || 'These are perfect CONCENTRIC CIRCLES—no spiral exists. The tilted black and white segments create a "twisted cord" effect that your brain interprets as a continuous spiral path. Discovered by psychologist James Fraser in 1908.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Trace the Path'}
          </button>
          {revealed && <ScienceButton />}
        </div>

        <MuseumCard />
      </div>
    );
  }

  // ============================================
  // BULGING GRID
  // ============================================
  if (illusionType === 'bulging-grid') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Bulge Effect</span>
        <p style={questionStyle}>{question || 'Does the center of this grid bulge outward?'}</p>

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
            {answer || 'PERFECTLY FLAT. Every line is straight and parallel. The progressively sized squares exploit your brain\'s perspective processing—larger shapes appear closer, creating a phantom 3D bulge from a 2D image.'}
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
            {ponzoGuess && `You chose the ${ponzoGuess} ball. `}
            {answer || 'They\'re IDENTICAL. The converging lines trick your brain into applying perspective correction—objects "farther away" should be smaller, so your brain inflates the distant one. Named after Mario Ponzo (1911).'}
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
  // POGGENDORFF
  // ============================================
  if (illusionType === 'poggendorff') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Poggendorff Illusion</span>
        <p style={questionStyle}>{question || 'Which line on the right continues the line on the left?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/poggendorff.jpg'}
              alt="Poggendorff Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'When a diagonal line passes behind a rectangle, your brain misjudges where it should emerge. The bar disrupts your ability to track the line\'s true trajectory. Discovered by physicist Johann Poggendorff in 1860.'}
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
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Müller-Lyer Illusion</span>
        <p style={questionStyle}>{question || 'Which horizontal line is longer?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 200"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {/* Top line with outward arrows (appears shorter) */}
              <g transform="translate(50, 60)">
                <line
                  x1="0"
                  y1="0"
                  x2={revealed ? 200 : 150}
                  y2="0"
                  stroke="#a8d5e5"
                  strokeWidth="3"
                  style={{ transition: 'all 0.5s ease' }}
                />
                {!revealed && (
                  <>
                    {/* Left outward arrow */}
                    <polyline points="30,-20 0,0 30,20" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                    {/* Right outward arrow */}
                    <polyline points="120,-20 150,0 120,20" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                  </>
                )}
                {revealed && (
                  <text x="100" y="-10" fill="#a8d5e5" fontSize="14" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
                )}
              </g>

              {/* Bottom line with inward arrows (appears longer) */}
              <g transform="translate(50, 140)">
                <line
                  x1={revealed ? 50 : 0}
                  y1="0"
                  x2={revealed ? 250 : 150}
                  y2="0"
                  stroke="#a8d5e5"
                  strokeWidth="3"
                  style={{ transition: 'all 0.5s ease' }}
                />
                {!revealed && (
                  <>
                    {/* Left inward arrow */}
                    <polyline points="-30,-20 0,0 -30,20" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                    {/* Right inward arrow */}
                    <polyline points="180,-20 150,0 180,20" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                  </>
                )}
                {revealed && (
                  <text x="150" y="-10" fill="#a8d5e5" fontSize="14" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
                )}
              </g>

              {/* Alignment guide when revealed */}
              {revealed && (
                <>
                  <line x1="50" y1="50" x2="50" y2="150" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <line x1="250" y1="50" x2="250" y2="150" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL. The arrows create a false sense of depth — outward arrows suggest the line recedes, inward arrows suggest it projects toward you. Your brain adjusts for "distance" that isn\'t there.'}
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
  // EBBINGHAUS CIRCLES (SVG)
  // ============================================
  if (illusionType === 'ebbinghaus-circles') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Ebbinghaus Illusion</span>
        <p style={questionStyle}>{question || 'Which orange circle is larger?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 200"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {/* Left group: center circle surrounded by large circles */}
              <g transform="translate(100, 100)">
                {/* Surrounding large circles - animate away when revealed */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <circle
                    key={`large-${i}`}
                    cx={Math.cos((angle * Math.PI) / 180) * (revealed ? 80 : 55)}
                    cy={Math.sin((angle * Math.PI) / 180) * (revealed ? 80 : 55)}
                    r={revealed ? 20 : 25}
                    fill="#4a7c8f"
                    style={{ transition: 'all 0.6s ease' }}
                  />
                ))}
                {/* Center circle */}
                <circle cx="0" cy="0" r="20" fill="#e89b5f" />
              </g>

              {/* Right group: center circle surrounded by small circles */}
              <g transform="translate(300, 100)">
                {/* Surrounding small circles - animate to same size when revealed */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <circle
                    key={`small-${i}`}
                    cx={Math.cos((angle * Math.PI) / 180) * (revealed ? 80 : 40)}
                    cy={Math.sin((angle * Math.PI) / 180) * (revealed ? 80 : 40)}
                    r={revealed ? 20 : 8}
                    fill="#4a7c8f"
                    style={{ transition: 'all 0.6s ease' }}
                  />
                ))}
                {/* Center circle */}
                <circle cx="0" cy="0" r="20" fill="#e89b5f" />
              </g>

              {/* Comparison line when revealed */}
              {revealed && (
                <line
                  x1="100"
                  y1="100"
                  x2="300"
                  y2="100"
                  stroke="#a8d5e5"
                  strokeWidth="1"
                  strokeDasharray="4"
                  opacity="0.5"
                />
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL. Size is relative — surrounded by large circles, the center looks small; surrounded by small circles, it looks large. Your brain judges size by comparison, not measurement.'}
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
  // SIMULTANEOUS CONTRAST (SVG)
  // ============================================
  if (illusionType === 'simultaneous-contrast') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Simultaneous Contrast</span>
        <p style={questionStyle}>{question || 'Which gray square is darker?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 200"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {/* Left: gray square on dark background */}
              <rect
                x="20"
                y="20"
                width="160"
                height="160"
                fill={revealed ? '#1a1a1a' : '#2a2a2a'}
                style={{ transition: 'fill 0.5s ease' }}
              />
              <rect
                x="55"
                y="55"
                width="90"
                height="90"
                fill="#808080"
              />

              {/* Right: gray square on light background */}
              <rect
                x="220"
                y="20"
                width="160"
                height="160"
                fill={revealed ? '#1a1a1a' : '#d0d0d0'}
                style={{ transition: 'fill 0.5s ease' }}
              />
              <rect
                x="255"
                y="55"
                width="90"
                height="90"
                fill="#808080"
              />

              {/* Labels */}
              <text x="100" y="190" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif" opacity="0.7">A</text>
              <text x="300" y="190" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif" opacity="0.7">B</text>

              {/* Color value label when revealed */}
              {revealed && (
                <>
                  <text x="100" y="105" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#808080</text>
                  <text x="300" y="105" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#808080</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL. Your brain judges brightness by comparison, not absolute value. The same gray looks darker on white and lighter on black — helping you see consistent colors under varied lighting.'}
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
  // PONZO RAILROAD (SVG)
  // ============================================
  if (illusionType === 'ponzo-railroad') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Ponzo Illusion</span>
        <p style={questionStyle}>{question || 'Which yellow bar is longer?'}</p>

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

              {/* Top yellow bar */}
              <rect
                x={revealed ? 75 : 100}
                y={revealed ? 80 : 60}
                width="100"
                height="20"
                fill="#e8c85f"
                rx="2"
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Bottom yellow bar */}
              <rect
                x={revealed ? 75 : 75}
                y={revealed ? 120 : 200}
                width="100"
                height="20"
                fill="#e8c85f"
                rx="2"
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Measurement guides when revealed */}
              {revealed && (
                <>
                  <line x1="75" y1="70" x2="75" y2="150" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <line x1="175" y1="70" x2="175" y2="150" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                  <text x="125" y="170" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">100px each</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL. The converging lines create false depth cues — like railroad tracks receding. Your brain assumes the "distant" bar must be larger to appear the same size. Mario Ponzo, 1911.'}
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
  // CAFÉ WALL (SVG)
  // ============================================
  if (illusionType === 'cafe-wall') {
    const rows = 8;
    const cols = 10;
    const tileSize = 30;
    const mortarHeight = 3;

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Café Wall Illusion</span>
        <p style={questionStyle}>{question || 'Are the horizontal gray lines parallel or tilted?'}</p>

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
            {answer || 'PERFECTLY PARALLEL. The offset black and white tiles create a wedge-like appearance that tricks your visual cortex into perceiving tilt. Discovered on a café wall in Bristol, 1979.'}
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
  // SANDER PARALLELOGRAM (SVG)
  // ============================================
  if (illusionType === 'sander-parallelogram') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Sander Illusion</span>
        <p style={questionStyle}>{question || 'Which diagonal line is longer?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 400 200"
              style={{ width: '100%', height: '100%', maxWidth: '400px' }}
            >
              {!revealed ? (
                <>
                  {/* Large parallelogram with diagonal */}
                  <polygon
                    points="20,150 120,50 280,50 180,150"
                    fill="none"
                    stroke="#4a7c8f"
                    strokeWidth="2"
                  />
                  <line x1="20" y1="150" x2="280" y2="50" stroke="#e89b5f" strokeWidth="3" />

                  {/* Small parallelogram with diagonal */}
                  <polygon
                    points="280,50 340,50 380,150 320,150"
                    fill="none"
                    stroke="#4a7c8f"
                    strokeWidth="2"
                  />
                  <line x1="280" y1="50" x2="380" y2="150" stroke="#a8d5e5" strokeWidth="3" />
                </>
              ) : (
                <>
                  {/* Show lines side by side for comparison */}
                  <line x1="50" y1="60" x2="310" y2="160" stroke="#e89b5f" strokeWidth="3" />
                  <line x1="90" y1="60" x2="350" y2="160" stroke="#a8d5e5" strokeWidth="3" />

                  {/* Length labels */}
                  <text x="180" y="180" fill="#e89b5f" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">Orange: 269px</text>
                  <text x="220" y="40" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">Blue: 128px</text>
                </>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'The ORANGE line is actually longer! The enclosing parallelograms distort your size judgment — the smaller shape makes its diagonal appear proportionally larger. Named after Friedrich Sander, 1926.'}
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
            {userGuess && `You chose ${userGuess === 'top' ? 'A' : 'B'}. `}
            {answer || 'The BOTTOM line (B) is correct. When a diagonal passes behind a rectangle, your brain misjudges where it emerges. The vertical edge disrupts your ability to track the true trajectory.'}
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
  // GRADIENT BAR (SVG)
  // ============================================
  if (illusionType === 'gradient-bar') {
    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Gradient Illusion</span>
        <p style={questionStyle}>{question || 'Is this bar a gradient or solid color?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 350 200"
              style={{ width: '100%', height: '100%', maxWidth: '350px' }}
            >
              {/* Gradient background definition */}
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#e0e0e0" />
                </linearGradient>
              </defs>

              {/* Background gradient (removed when revealed) */}
              <rect
                x="25"
                y="40"
                width="300"
                height="120"
                fill={revealed ? '#1a1a1a' : 'url(#bgGradient)'}
                style={{ transition: 'fill 0.5s ease' }}
              />

              {/* Solid gray bar */}
              <rect
                x="25"
                y="80"
                width="300"
                height="40"
                fill="#808080"
              />

              {/* Label when revealed */}
              {revealed && (
                <text x="175" y="105" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">Uniform #808080</text>
              )}
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'SOLID COLOR. The bar is uniform gray throughout. The gradient background creates simultaneous contrast — making the left side appear lighter and the right side darker than they actually are.'}
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
  // KANIZSA TRIANGLE SVG
  // ============================================
  if (illusionType === 'kanizsa-triangle-svg') {
    const pacmanRadius = 40;

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
              {/* Three pac-man shapes */}
              {/* Top pac-man */}
              <path
                d={revealed
                  ? `M 150 50 m -${pacmanRadius}, 0 a ${pacmanRadius},${pacmanRadius} 0 1,0 ${pacmanRadius * 2},0 a ${pacmanRadius},${pacmanRadius} 0 1,0 -${pacmanRadius * 2},0`
                  : `M 150 50 L ${150 + pacmanRadius * Math.cos(-Math.PI / 6)} ${50 + pacmanRadius * Math.sin(-Math.PI / 6)} A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${150 + pacmanRadius * Math.cos(-5 * Math.PI / 6)} ${50 + pacmanRadius * Math.sin(-5 * Math.PI / 6)} Z`
                }
                fill="#a8d5e5"
                style={{ transition: 'all 0.5s ease', transformOrigin: '150px 50px', transform: revealed ? 'rotate(60deg)' : 'rotate(0deg)' }}
              />

              {/* Bottom-left pac-man */}
              <path
                d={revealed
                  ? `M 70 220 m -${pacmanRadius}, 0 a ${pacmanRadius},${pacmanRadius} 0 1,0 ${pacmanRadius * 2},0 a ${pacmanRadius},${pacmanRadius} 0 1,0 -${pacmanRadius * 2},0`
                  : `M 70 220 L ${70 + pacmanRadius * Math.cos(Math.PI / 6)} ${220 + pacmanRadius * Math.sin(Math.PI / 6)} A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${70 + pacmanRadius * Math.cos(-Math.PI / 2)} ${220 + pacmanRadius * Math.sin(-Math.PI / 2)} Z`
                }
                fill="#a8d5e5"
                style={{ transition: 'all 0.5s ease', transformOrigin: '70px 220px', transform: revealed ? 'rotate(-60deg)' : 'rotate(0deg)' }}
              />

              {/* Bottom-right pac-man */}
              <path
                d={revealed
                  ? `M 230 220 m -${pacmanRadius}, 0 a ${pacmanRadius},${pacmanRadius} 0 1,0 ${pacmanRadius * 2},0 a ${pacmanRadius},${pacmanRadius} 0 1,0 -${pacmanRadius * 2},0`
                  : `M 230 220 L ${230 + pacmanRadius * Math.cos(Math.PI / 2)} ${220 + pacmanRadius * Math.sin(Math.PI / 2)} A ${pacmanRadius} ${pacmanRadius} 0 1 0 ${230 + pacmanRadius * Math.cos(5 * Math.PI / 6)} ${220 + pacmanRadius * Math.sin(5 * Math.PI / 6)} Z`
                }
                fill="#a8d5e5"
                style={{ transition: 'all 0.5s ease', transformOrigin: '230px 220px', transform: revealed ? 'rotate(60deg)' : 'rotate(0deg)' }}
              />

              {/* Outline triangle (incomplete) */}
              <polygon
                points="80,80 150,200 220,80"
                fill="none"
                stroke="#a8d5e5"
                strokeWidth="2"
                opacity={revealed ? 0.3 : 1}
                style={{ transition: 'opacity 0.5s ease' }}
              />
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'There IS no white triangle — no edges are drawn. Your brain creates "illusory contours" from the pac-man shapes, completing a triangle that exists only in your perception. Created by Gaetano Kanizsa, 1955.'}
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
  // RUBIN'S VASE (SVG)
  // ============================================
  if (illusionType === 'rubins-vase') {
    const [viewMode, setViewMode] = useState<'neutral' | 'vase' | 'faces'>('neutral');

    return (
      <div style={containerStyle}>
        <span style={nameLabelStyle}>Rubin's Vase</span>
        <p style={questionStyle}>{question || 'What do you see — a vase or two faces?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, background: '#1a1a1a', padding: '40px' }}>
            <svg
              viewBox="0 0 300 300"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Background */}
              <rect
                x="0"
                y="0"
                width="300"
                height="300"
                fill={viewMode === 'faces' ? '#a8d5e5' : (viewMode === 'vase' ? '#2a2a2a' : '#4a4a4a')}
                style={{ transition: 'fill 0.4s ease' }}
              />

              {/* Vase shape (or negative space between faces) */}
              <path
                d="M 150 20
                   C 120 20, 100 40, 100 60
                   C 100 80, 115 90, 115 100
                   C 115 110, 90 130, 80 160
                   C 70 190, 80 230, 100 260
                   C 110 275, 130 280, 150 280
                   C 170 280, 190 275, 200 260
                   C 220 230, 230 190, 220 160
                   C 210 130, 185 110, 185 100
                   C 185 90, 200 80, 200 60
                   C 200 40, 180 20, 150 20 Z"
                fill={viewMode === 'faces' ? '#2a2a2a' : (viewMode === 'vase' ? '#a8d5e5' : '#a8d5e5')}
                style={{ transition: 'fill 0.4s ease' }}
              />
            </svg>
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'Both! This is a "bistable" image — your brain can interpret the same contour as either the edge of a vase or the profile of two faces. You cannot see both simultaneously. Created by Edgar Rubin, 1915.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={() => setViewMode(viewMode === 'vase' ? 'neutral' : 'vase')}
            style={{
              ...buttonStyle,
              background: viewMode === 'vase' ? textColor : 'transparent',
              color: viewMode === 'vase' ? '#0a0a0a' : textColor
            }}
          >
            See Vase
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'faces' ? 'neutral' : 'faces')}
            style={{
              ...buttonStyle,
              background: viewMode === 'faces' ? textColor : 'transparent',
              color: viewMode === 'faces' ? '#0a0a0a' : textColor
            }}
          >
            See Faces
          </button>
          <ScienceButton />
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
          <div style={{ ...imageWrapperStyle, background: '#808080', padding: '40px', position: 'relative' }}>
            <svg
              viewBox="0 0 250 250"
              style={{ width: '100%', height: '100%', maxWidth: '250px' }}
            >
              {/* Center fixation cross */}
              <line x1="115" y1="125" x2="135" y2="125" stroke="#1a1a1a" strokeWidth="2" />
              <line x1="125" y1="115" x2="125" y2="135" stroke="#1a1a1a" strokeWidth="2" />

              {/* Lilac dots in a circle */}
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
                    fill="#d87bba"
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
              viewBox="0 0 300 260"
              style={{ width: '100%', height: '100%', maxWidth: '300px' }}
            >
              {/* Triangle */}
              <polygon
                points="150,20 20,240 280,240"
                fill="none"
                stroke="#a8d5e5"
                strokeWidth="3"
              />

              {/* Text inside */}
              <text x="150" y="100" fill="#a8d5e5" fontSize="20" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic">
                I love
              </text>
              <text x="150" y="140" fill="#a8d5e5" fontSize="20" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic">
                Paris in the
              </text>
              <text x="150" y="180" fill={revealed ? '#ff6b6b' : '#a8d5e5'} fontSize="20" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" style={{ transition: 'fill 0.3s ease' }}>
                the springtime
              </text>

              {/* Highlight box around duplicate THE when revealed */}
              {revealed && (
                <rect
                  x="85"
                  y="119"
                  width="45"
                  height="25"
                  fill="none"
                  stroke="#ff6b6b"
                  strokeWidth="2"
                  rx="3"
                />
              )}
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
