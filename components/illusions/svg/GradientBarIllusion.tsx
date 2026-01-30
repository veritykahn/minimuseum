'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function GradientBarIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Gradient Bar Illusion"
      question={question || 'Is the center bar a gradient or a solid color?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {answer || 'SOLID COLOR — The center bar is a uniform gray. The surrounding gradient creates the illusion of varying brightness through simultaneous contrast.'}
        </p>
      }
      buttons={
        !revealed ? (
          <IllusionButton onClick={() => setRevealed(true)} isPoster1={isPoster1}>
            Reveal
          </IllusionButton>
        ) : (
          <>
            <IllusionButton onClick={() => setRevealed(false)} isPoster1={isPoster1}>
              See Illusion
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <div style={{ background: '#1a1a1a', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
          {/* Gradient background */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#e0e0e0" />
            </linearGradient>
          </defs>

          {/* Background gradient */}
          <rect
            x="0"
            y="0"
            width="300"
            height="200"
            fill={revealed ? '#1a1a1a' : 'url(#bgGradient)'}
            style={{ transition: 'fill 0.5s ease' }}
          />

          {/* Solid gray center bar */}
          <rect
            x="30"
            y="70"
            width="240"
            height="60"
            fill="#808080"
          />

          {/* Label when revealed */}
          {revealed && (
            <text x="150" y="105" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">
              Uniform #808080
            </text>
          )}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
