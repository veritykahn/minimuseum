'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function LilacChaserIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  const dotCount = 12;
  const radius = 80;

  return (
    <IllusionWrapper
      name="Lilac Chaser / Pac-Man Effect"
      question={question || 'Stare at the center cross for 15 seconds. What do you see?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || "A GREEN DOT appears to chase the gap! With prolonged fixation, the lilac dots may fade entirely. This combines Troxler's fading with afterimage effects — your brain fills the gap with the complementary color."}
        </p>
      }
      buttons={
        <>
          <IllusionButton onClick={() => setIsRunning(!isRunning)} isPoster1={isPoster1}>
            {isRunning ? 'Pause Animation' : 'Resume Animation'}
          </IllusionButton>
          <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
        </>
      }
    >
      <style>{`
        @keyframes lilacFade {
          0%, 8.33% { opacity: 0; }
          8.34%, 100% { opacity: 1; }
        }
        .lilac-dot {
          animation: lilacFade 1.2s infinite;
        }
      `}</style>
      <div style={{ background: '#909090', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg viewBox="0 0 250 250" style={{ width: '100%', height: '100%', maxWidth: '250px' }}>
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
    </IllusionWrapper>
  );
}
