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
    padding: '70px 40px 140px',
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
    height: 'calc(100vh - 380px)',  // FIXED height
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
