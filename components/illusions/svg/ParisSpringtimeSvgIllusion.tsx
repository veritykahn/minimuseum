'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function ParisSpringtimeSvgIllusion({
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
      name="Predictive Processing"
      question={question || 'Read the text inside the triangle carefully.'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : { ...styles.answerHidden, opacity: 0.7, visibility: 'visible' }}>
          {revealed
            ? (answer || '"THE" appears TWICE! Your brain predicts familiar phrases and skips what it expects. You read what should be there, not what is. This is "top-down processing" — expectation overriding perception.')
            : 'Read it again. Very slowly.'
          }
        </p>
      }
      buttons={
        !revealed ? (
          <IllusionButton onClick={() => setRevealed(true)} isPoster1={isPoster1}>
            I&apos;ve Read It
          </IllusionButton>
        ) : (
          <>
            <IllusionButton onClick={() => setRevealed(false)} isPoster1={isPoster1}>
              Read Again
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <div style={{ background: '#1a1a1a', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 280" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
          {/* Triangle - lilac filled */}
          <polygon
            points="150,15 15,265 285,265"
            fill="#c9a0dc"
            stroke="#c9a0dc"
            strokeWidth="2"
          />

          {/* Text inside */}
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
    </IllusionWrapper>
  );
}
