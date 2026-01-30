'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function SimultaneousContrastIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [contrastGuess, setContrastGuess] = useState<'A' | 'B' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'A' | 'B') => {
    setContrastGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setContrastGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';
  const centerColor = '#5fb8b8';
  const orangeBg = '#e07830';
  const purpleBg = '#7040a0';

  return (
    <IllusionWrapper
      name="Simultaneous Contrast"
      question={question || 'Which is darker — A or B?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {contrastGuess && <><span style={{ color: '#888' }}>You said {contrastGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Your brain judges color by comparison. The same cyan appears more blue-green on orange and more greenish on purple.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('A')} isPoster1={isPoster1}>
              A
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('B')} isPoster1={isPoster1}>
              B
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
        <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', maxWidth: '400px' }}>
          {/* Left: cyan square on orange background */}
          <rect x="20" y="10" width="160" height="160" fill={revealed ? '#1a1a1a' : orangeBg} style={{ transition: 'fill 0.5s ease' }} />
          <rect x="60" y="50" width="80" height="80" fill={centerColor} />

          {/* Right: cyan square on purple background */}
          <rect x="220" y="10" width="160" height="160" fill={revealed ? '#1a1a1a' : purpleBg} style={{ transition: 'fill 0.5s ease' }} />
          <rect x="260" y="50" width="80" height="80" fill={centerColor} />

          {/* Labels */}
          <text x="100" y="195" fill="#a8d5e5" fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">A</text>
          <text x="300" y="195" fill="#a8d5e5" fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">B</text>

          {/* Color value when revealed */}
          {revealed && (
            <>
              <text x="100" y="95" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#5fb8b8</text>
              <text x="300" y="95" fill="#a8d5e5" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">#5fb8b8</text>
            </>
          )}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
