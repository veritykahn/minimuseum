'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function PoggendorffSvgIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [poggGuess, setPoggGuess] = useState<'A' | 'B' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'A' | 'B') => {
    setPoggGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setPoggGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Poggendorff Illusion"
      question={question || 'Which line on the right continues the diagonal — A or B?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {poggGuess && <><span style={{ color: '#888' }}>You chose line {poggGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'LINE A — The obscuring rectangle shifts your perception of the diagonal\'s trajectory, making B appear to be the continuation.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('A')} isPoster1={isPoster1}>
              Line A
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('B')} isPoster1={isPoster1}>
              Line B
            </IllusionButton>
          </>
        ) : (
          <>
            <IllusionButton onClick={reset} isPoster1={isPoster1}>
              Try Again
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <div style={{ background: '#1a1a1a', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 250" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
          {/* Obscuring rectangle */}
          <rect x="100" y="20" width="100" height="210" fill="#4a4a4a" />

          {/* Left diagonal line */}
          <line x1="30" y1="180" x2="100" y2="130" stroke="#a8d5e5" strokeWidth="3" />

          {/* Right line A (correct continuation) */}
          <line
            x1="200"
            y1="80"
            x2="270"
            y2="30"
            stroke={revealed ? '#4ade80' : '#a8d5e5'}
            strokeWidth="3"
            style={{ transition: 'stroke 0.3s ease' }}
          />

          {/* Right line B (incorrect - appears correct) */}
          <line
            x1="200"
            y1="140"
            x2="270"
            y2="90"
            stroke={revealed ? '#888' : '#a8d5e5'}
            strokeWidth="3"
            style={{ transition: 'stroke 0.3s ease' }}
          />

          {/* Labels */}
          <text x="280" y="35" fill="#a8d5e5" fontSize="14" fontFamily="Outfit, sans-serif" fontWeight="500">A</text>
          <text x="280" y="95" fill="#a8d5e5" fontSize="14" fontFamily="Outfit, sans-serif" fontWeight="500">B</text>

          {/* Show true alignment when revealed */}
          {revealed && (
            <line
              x1="30"
              y1="180"
              x2="270"
              y2="30"
              stroke="#4ade80"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.7"
            />
          )}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
