'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function PonzoRailroadIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [ponzoGuess, setPonzoGuess] = useState<'true' | 'false' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'true' | 'false') => {
    setPonzoGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setPonzoGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Ponzo Illusion (Railroad)"
      question={question || 'The red bar at the top is longer than the one at the bottom — true or false?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {ponzoGuess && <><span style={{ color: '#888' }}>You said {ponzoGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'FALSE — Both bars are identical. The converging lines create false depth perspective, making the "distant" bar appear larger.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('true')} isPoster1={isPoster1}>
              True
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('false')} isPoster1={isPoster1}>
              False
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
        <svg viewBox="0 0 300 350" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
          {/* Converging railroad lines */}
          <line x1="30" y1="320" x2="150" y2="20" stroke="#606060" strokeWidth="4" />
          <line x1="270" y1="320" x2="150" y2="20" stroke="#606060" strokeWidth="4" />

          {/* Railroad ties */}
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, i) => {
            const y = 320 - t * 300;
            const leftX = 30 + t * 120;
            const rightX = 270 - t * 120;
            return (
              <line
                key={i}
                x1={leftX}
                y1={y}
                x2={rightX}
                y2={y}
                stroke="#404040"
                strokeWidth="2"
              />
            );
          })}

          {/* Top red bar (appears larger) */}
          <rect
            x={revealed ? 100 : 100}
            y="80"
            width="100"
            height="15"
            fill="#cc4444"
            style={{ transition: 'all 0.5s ease' }}
          />

          {/* Bottom red bar (same size) */}
          <rect
            x="100"
            y="260"
            width="100"
            height="15"
            fill="#cc4444"
          />

          {/* Measurement lines when revealed */}
          {revealed && (
            <>
              <line x1="100" y1="70" x2="100" y2="55" stroke="#a8d5e5" strokeWidth="1" />
              <line x1="200" y1="70" x2="200" y2="55" stroke="#a8d5e5" strokeWidth="1" />
              <line x1="100" y1="60" x2="200" y2="60" stroke="#a8d5e5" strokeWidth="1" />
              <text x="150" y="50" fill="#a8d5e5" fontSize="10" textAnchor="middle" fontFamily="Outfit, sans-serif">100px</text>

              <line x1="100" y1="285" x2="100" y2="300" stroke="#a8d5e5" strokeWidth="1" />
              <line x1="200" y1="285" x2="200" y2="300" stroke="#a8d5e5" strokeWidth="1" />
              <line x1="100" y1="295" x2="200" y2="295" stroke="#a8d5e5" strokeWidth="1" />
              <text x="150" y="312" fill="#a8d5e5" fontSize="10" textAnchor="middle" fontFamily="Outfit, sans-serif">100px</text>
            </>
          )}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
