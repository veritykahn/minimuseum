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
  isPoster1: boolean;
};

export default function IllusionRenderer({
  illusionType,
  src,
  revealSrc,
  altRevealSrc,
  question,
  answer,
  isPoster1
}: IllusionProps) {
  const [revealed, setRevealed] = useState(false);
  const [balconyView, setBalconyView] = useState<'main' | 'out' | 'over'>('main');

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';
  const btnBg = isPoster1 ? '#2a2a2a' : '#a8d5e5';
  const btnText = isPoster1 ? '#e0dede' : '#0a0a0a';

  // Shared styles - fixed layout to prevent shifts
  const containerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '80px 40px 140px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const questionStyle: React.CSSProperties = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
    fontStyle: 'italic',
    color: textColor,
    textAlign: 'center',
    maxWidth: '600px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  // Fixed-size image container that doesn't change on reveal
  const imageContainerStyle: React.CSSProperties = {
    flex: '1 1 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    minHeight: 0,
    overflow: 'visible',
    margin: '16px 0'
  };

  const imageWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    maxHeight: '100%',
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

  // Reserved answer space - always present, visibility controlled
  const answerContainerStyle: React.CSSProperties = {
    minHeight: '50px',
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

  // Button area - fixed position above nav
  const buttonContainerStyle: React.CSSProperties = {
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
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

  // ============================================
  // CHECKER SHADOW
  // ============================================
  if (illusionType === 'checker-shadow') {
    return (
      <div style={containerStyle}>
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
            {answer || 'IDENTICAL — Both squares are the exact same shade. Your brain "corrects" for the shadow.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Reveal the Truth'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // BALCONY (Three-way choice)
  // ============================================
  if (illusionType === 'balcony') {
    const getImage = () => {
      if (balconyView === 'out') return revealSrc || '/exhibitions/seeing/balcony-out.jpg';
      if (balconyView === 'over') return altRevealSrc || '/exhibitions/seeing/balcony-over.jpg';
      return src || '/exhibitions/seeing/balcony.jpg';
    };

    return (
      <div style={containerStyle}>
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
            {answer || 'Both interpretations are valid. The image supports both equally — your brain picks one.'}
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
        </div>
      </div>
    );
  }

  // ============================================
  // FRASER SPIRAL
  // ============================================
  if (illusionType === 'fraser-spiral') {
    return (
      <div style={containerStyle}>
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
            {answer || 'CONCENTRIC CIRCLES — There is no spiral. The twisted cord pattern tricks your brain into seeing one.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Trace the Path'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // BULGING GRID
  // ============================================
  if (illusionType === 'bulging-grid') {
    return (
      <div style={containerStyle}>
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
            {answer || 'PERFECTLY FLAT — The varying square sizes create the illusion of depth where none exists.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Reveal the Truth'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // ROTATING SNAKES (Static display - no reveal)
  // ============================================
  if (illusionType === 'rotating-snakes') {
    return (
      <div style={containerStyle}>
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
            {answer || 'Nothing is moving. This is a completely static image. Your peripheral vision interprets the high-contrast patterns as motion.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: textColor,
            opacity: 0.6,
            margin: 0
          }}>
            "Rotating Snakes" by Akiyoshi Kitaoka, 2003
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // MUNKER HEARTS (Display only - complex to animate)
  // ============================================
  if (illusionType === 'munker-hearts') {
    return (
      <div style={containerStyle}>
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
            {answer || 'SAME COLOR — Both hearts are identical. The colored stripes shift how you perceive the hue.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // PONZO CORRIDOR
  // ============================================
  if (illusionType === 'ponzo-corridor') {
    return (
      <div style={containerStyle}>
        <p style={questionStyle}>{question || 'Which checkered ball is larger?'}</p>

        <div style={imageContainerStyle}>
          <div style={{ ...imageWrapperStyle, position: 'relative' }}>
            <img
              src={src || '/exhibitions/seeing/ponzo-corridor.jpg'}
              alt="Ponzo Corridor Illusion"
              style={imageStyle}
            />
            {revealed && (
              <svg
                viewBox="0 0 300 400"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              >
                <circle cx="150" cy="85" r="28" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4" />
                <circle cx="98" cy="305" r="28" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4" />
                <line x1="150" y1="113" x2="98" y2="277" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" />
                <text x="200" y="200" fill="#fbbf24" fontSize="14" fontWeight="bold">SAME SIZE</text>
              </svg>
            )}
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={revealed ? answerVisibleStyle : answerHiddenStyle}>
            {answer || 'IDENTICAL — Depth cues from the corridor make the back ball seem larger.'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'See Illusion Again' : 'Reveal the Truth'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // JASTROW
  // ============================================
  if (illusionType === 'jastrow') {
    return (
      <div style={containerStyle}>
        <p style={questionStyle}>{question || 'Which curved shape is larger?'}</p>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={src || '/exhibitions/seeing/jastrow-tracks.jpg'}
              alt="Jastrow Illusion"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={answerContainerStyle}>
          <p style={answerVisibleStyle}>
            {answer || 'IDENTICAL — Your brain compares the short inner edge of one to the long outer edge of the other.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // KANIZSA TRIANGLE
  // ============================================
  if (illusionType === 'kanizsa') {
    return (
      <div style={containerStyle}>
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
            {answer || 'There is no white triangle. Your brain creates illusory contours to complete the shape.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // TROXLER FADING
  // ============================================
  if (illusionType === 'troxler') {
    return (
      <div style={containerStyle}>
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
            {answer || 'The colored blobs fade and disappear. Your brain stops paying attention to unchanging peripheral information.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // PARIS IN THE SPRINGTIME
  // ============================================
  if (illusionType === 'paris-springtime') {
    return (
      <div style={containerStyle}>
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
              ? (answer || '"THE" appears TWICE! "Paris in the THE Springtime" — your brain predicts what should be there and skips the duplicate.')
              : 'Read it again. Slowly.'
            }
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'Read Again' : 'Show Me'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // OLD MAN / HIDDEN FIGURES
  // ============================================
  if (illusionType === 'old-man') {
    return (
      <div style={containerStyle}>
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
            {answer || 'An old bearded man — but look closer. Can you find the hidden figures in the leaves?'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // CONCAVE / CONVEX
  // ============================================
  if (illusionType === 'concave-convex') {
    return (
      <div style={containerStyle}>
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
            {answer || 'Your brain assumes light comes from above. Flip the image and bumps become dents!'}
          </p>
        </div>

        <div style={buttonContainerStyle}>
          <button onClick={() => setRevealed(!revealed)} style={buttonStyle}>
            {revealed ? 'Flip Back' : 'Flip Upside Down'}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // IMPOSSIBLE TRIDENT
  // ============================================
  if (illusionType === 'impossible-trident') {
    return (
      <div style={containerStyle}>
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
            {answer || 'Three at the top, two at the bottom. This object cannot exist in 3D space.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // POGGENDORFF
  // ============================================
  if (illusionType === 'poggendorff') {
    return (
      <div style={containerStyle}>
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
            {answer || 'The bar disrupts your brain\'s ability to track the line\'s true trajectory.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // CUBE SHADOW
  // ============================================
  if (illusionType === 'cube-shadow') {
    return (
      <div style={containerStyle}>
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
            {answer || 'IDENTICAL — Like the checker shadow, your brain compensates for perceived lighting.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
      </div>
    );
  }

  // ============================================
  // HERMANN GRID
  // ============================================
  if (illusionType === 'hermann-grid') {
    return (
      <div style={containerStyle}>
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
            {answer || 'Ghostly dots appear at intersections you\'re NOT looking at. Look directly — they vanish. This is lateral inhibition in your retina.'}
          </p>
        </div>

        <div style={buttonContainerStyle} />
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
