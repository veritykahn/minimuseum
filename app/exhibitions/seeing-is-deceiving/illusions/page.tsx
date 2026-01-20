'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import IllusionRenderer from '@/components/IllusionRenderer';

type IllusionItem = {
  type: 'intro' | 'illusion' | 'closing';
  title?: string;
  subtitle?: string;
  text?: string;
  illusionType?: string;
  src?: string;
  revealSrc?: string;
  altRevealSrc?: string;
  question?: string;
  answer?: string;
  scienceExplanation?: string;
};

// Illusion content entries
const illusionContent: IllusionItem[] = [
  // SECTION INTRO
  {
    type: 'intro',
    title: 'Test Your Perception',
    subtitle: 'Interactive optical illusions that reveal how your brain interprets reality'
  },

  // 1. CHECKER SHADOW
  {
    type: 'illusion',
    illusionType: 'checker-shadow',
    src: '/exhibitions/seeing/checker-shadow.jpg',
    revealSrc: '/exhibitions/seeing/checker-reveal.jpg',
    question: 'Which square is darker — A or B?',
    answer: 'IDENTICAL — Both squares are the exact same shade. Your brain "corrects" for the shadow.',
    scienceExplanation: 'This is called "lightness constancy" — your visual system automatically adjusts for lighting conditions so you can recognize objects whether they\'re in shadow or sunlight. The cylinder casts a shadow over square B, so your brain assumes B must actually be lighter than it appears (otherwise it would look even darker in the shadow). This compensation is so automatic you can\'t turn it off, even knowing the trick. MIT professor Edward Adelson created this illusion in 1995 to demonstrate that perception isn\'t about measuring light — it\'s about interpreting scenes.'
  },

  // 2. BALCONY
  {
    type: 'illusion',
    illusionType: 'balcony',
    src: '/exhibitions/seeing/balcony.jpg',
    revealSrc: '/exhibitions/seeing/balcony-out.jpg',
    altRevealSrc: '/exhibitions/seeing/balcony-over.jpg',
    question: 'What do you see? A man on a balcony looking out — or looking over a ledge from inside?',
    answer: 'Both interpretations are valid. The image supports both equally — your brain picks one.',
    scienceExplanation: 'This is a "bistable" or "reversible" figure — an image with two equally valid interpretations that your brain cannot hold simultaneously. Your visual cortex must commit to one 3D interpretation of the 2D image. The switch happens in your brain\'s "dorsal stream," which processes spatial relationships. Interestingly, once you see both interpretations, you can often voluntarily switch between them, but you\'ll never see both at once. Your brain literally cannot perceive ambiguity — it must decide.'
  },

  // 3. FRASER SPIRAL
  {
    type: 'illusion',
    illusionType: 'fraser-spiral',
    src: '/exhibitions/seeing/fraser-spiral.jpg',
    revealSrc: '/exhibitions/seeing/fraser-spiral.gif',
    question: 'Is this a spiral — or something else?',
    answer: 'CONCENTRIC CIRCLES — There is no spiral. The twisted cord pattern tricks your brain.',
    scienceExplanation: 'The "twisted cord" elements create local tilt signals that your brain integrates into a global spiral percept. Each small segment appears tilted due to the black and white pattern, and your visual system — trying to find continuous contours — links these tilts into a spiral that doesn\'t exist. This reveals how your brain constructs edges: it doesn\'t just trace lines, it interprets local orientation cues and sometimes gets fooled when those cues conflict with the actual geometry. Discovered by British psychologist James Fraser in 1908.'
  },

  // 4. BULGING GRID
  {
    type: 'illusion',
    illusionType: 'bulging-grid',
    src: '/exhibitions/seeing/bulging-grid.jpg',
    revealSrc: '/exhibitions/seeing/grid.jpg',
    question: 'Does the center of this grid bulge outward?',
    answer: 'PERFECTLY FLAT — The varying square sizes create the illusion of depth.',
    scienceExplanation: 'Your brain uses size gradients as depth cues — in the real world, objects appear smaller as they recede. Here, the squares get progressively smaller toward the center, triggering your depth perception system to interpret this as a surface curving away from you. The high contrast and regular geometry amplify the effect. This exploits the same neural mechanisms that let you perceive depth in photographs and paintings — mechanisms so fundamental they activate even when you know they\'re being tricked.'
  },

  // 5. ROTATING SNAKES
  {
    type: 'illusion',
    illusionType: 'rotating-snakes',
    src: '/exhibitions/seeing/rotating-snakes.jpg',
    question: 'Look around the image. Do you see movement?',
    answer: 'Nothing is moving. This is a static image. Your peripheral vision sees motion that isn\'t there.',
    scienceExplanation: 'Created by Akiyoshi Kitaoka in 2003, this illusion exploits how your brain processes motion. The specific color sequence (black → dark blue → white → yellow) creates asymmetric neural responses in your retina and visual cortex. When your eyes make tiny involuntary movements called "microsaccades," different parts of the pattern activate at slightly different times, and your motion-detection neurons interpret this as rotation. The effect is strongest in peripheral vision because those neurons are more sensitive to motion than to fine detail.'
  },

  // 6. PONZO CORRIDOR
  {
    type: 'illusion',
    illusionType: 'ponzo-corridor',
    src: '/exhibitions/seeing/ponzo-corridor.jpg',
    question: 'Which checkered ball is larger?',
    answer: 'IDENTICAL — Depth cues from the corridor make the back ball seem larger.',
    scienceExplanation: 'Named after Italian psychologist Mario Ponzo (1911), this illusion demonstrates "size constancy" — your brain\'s automatic adjustment for distance. The converging lines signal depth (like railway tracks receding), telling your brain the upper ball is "farther away." Since it takes up the same space on your retina as the "closer" ball, your brain concludes it must be physically larger. This compensation is essential for real-world perception — without it, people would appear to shrink as they walked away from you.'
  },

  // 7. JASTROW
  {
    type: 'illusion',
    illusionType: 'jastrow',
    src: '/exhibitions/seeing/jastrow-tracks.jpg',
    question: 'Which curved shape is larger?',
    answer: 'IDENTICAL — Your brain compares the short inner edge of one to the long outer edge of the other.',
    scienceExplanation: 'Discovered by Joseph Jastrow in 1889, this illusion occurs because your brain judges size by comparing adjacent edges rather than measuring absolute dimensions. The short inner curve of one shape sits directly against the long outer curve of the other, making the first seem smaller by comparison. Your visual system evolved to make quick relative judgments (is that predator bigger than me?) rather than precise measurements — usually helpful, but exploitable by the right geometry.'
  },

  // 8. IMPOSSIBLE TRIDENT
  {
    type: 'illusion',
    illusionType: 'impossible-trident',
    src: '/exhibitions/seeing/impossible-trident.jpg',
    question: 'How many prongs does this object have?',
    answer: 'Two at the top, three at the bottom. This object cannot exist in 3D space.',
    scienceExplanation: 'Also called a "blivet," this impossible figure exploits how your brain interprets 2D line drawings as 3D objects. Each local region of the drawing is valid — you can trace any small section and it makes sense. But globally, the figure contradicts itself. Your brain uses "non-accidental properties" (junctions, parallel lines) to infer 3D structure, and here those cues create an object that violates physical law. First published in 1964, it reveals the assumptions your visual system makes — and how easily they break.'
  },

  // 9. HERMANN GRID
  {
    type: 'illusion',
    illusionType: 'hermann-grid',
    src: '/exhibitions/seeing/ghost-dots.jpg',
    question: 'Do you see gray dots at the intersections?',
    answer: 'Ghost dots appear where you\'re NOT looking. Look directly — they vanish!',
    scienceExplanation: 'Discovered by Ludimar Hermann in 1870, this illusion was long attributed to "lateral inhibition" — retinal cells suppressing their neighbors. At intersections, more white surrounds each point, so more inhibition occurs, making those spots appear darker. However, recent research suggests the effect also involves neurons in your visual cortex that respond to specific spatial frequencies. The dots vanish when you look directly because your central vision (fovea) has much finer resolution than your peripheral vision, resolving the true brightness.'
  },

  // CLOSING
  {
    type: 'closing',
    text: 'These aren\'t tricks — they\'re features. Your brain takes shortcuts to process 11 million bits of information per second. Usually it works. Sometimes it doesn\'t.'
  }
];

export default function IllusionsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentItem = illusionContent[currentIndex];

  const handleBack = () => {
    router.push('/exhibitions/seeing-is-deceiving');
  };

  const nextStep = useCallback(() => {
    if (currentIndex < illusionContent.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  }, [currentIndex]);

  const prevStep = useCallback(() => {
    if (currentIndex > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  }, [currentIndex]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> go next
      nextStep();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> go prev
      prevStep();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

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

        /* Navigation */
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

        /* Fade animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        /* Blur to sharp */
        @keyframes blurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .effect-blur-sharp {
          animation: blurToSharp 1.2s ease forwards;
        }

        /* FadeInUp for answers */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Illusion page container */
        .illusion-page {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.4s ease;
        }

        /* Top Counter */
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

        /* Side Navigation Arrows */
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
        .side-nav-arrow:disabled {
          opacity: 0.15;
          cursor: not-allowed;
        }
        .side-nav-arrow:not(:disabled):hover {
          border-color: #a8d5e5;
          background: rgba(168, 213, 229, 0.1);
          transform: translateY(-50%) scale(1.05);
        }

        /* Begin button for intro */
        .begin-btn {
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
        .begin-btn:hover {
          background: #a8d5e5;
          color: #0a0a0a;
        }

        /* Intro styles */
        .intro-container {
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

        /* Closing styles */
        .closing-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px 160px;
          text-align: center;
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
        .return-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid #a8d5e5;
          color: #a8d5e5;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 48px;
        }
        .return-btn:hover {
          background: #a8d5e5;
          color: #0a0a0a;
        }

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
            <button className="begin-btn effect-blur-sharp" style={{ animationDelay: '0.4s' }} onClick={nextStep}>
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
            <button className="return-btn" onClick={handleBack}>
              Return to Exhibition
            </button>
          </div>
        )}
      </div>

      {/* Navigation - show for illusions (counter + both arrows) */}
      {currentItem.type === 'illusion' && (
        <>
          {/* Top counter - shows illusion number (excluding intro and closing) */}
          <div className="top-counter">
            <span className="step-indicator">
              {currentIndex} / {illusionContent.length - 2}
            </span>
          </div>

          {/* Side arrows */}
          <button
            className="side-nav-arrow left"
            onClick={prevStep}
            disabled={currentIndex <= 1}
          >
            ←
          </button>
          <button
            className="side-nav-arrow right"
            onClick={nextStep}
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
