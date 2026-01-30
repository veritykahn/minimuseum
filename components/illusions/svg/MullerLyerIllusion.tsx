'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function MullerLyerIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [mullerGuess, setMullerGuess] = useState<'1' | '2' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: '1' | '2') => {
    setMullerGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setMullerGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Müller-Lyer Illusion"
      question={question || 'Which line is longer — 1 or 2?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {mullerGuess && <><span style={{ color: '#888' }}>You chose line {mullerGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — The arrows create a false sense of depth — outward arrows suggest the line recedes, inward arrows suggest it projects toward you.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('1')} isPoster1={isPoster1}>
              Line 1
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('2')} isPoster1={isPoster1}>
              Line 2
            </IllusionButton>
          </>
        ) : (
          <>
            <IllusionButton onClick={reset} isPoster1={isPoster1}>
              See Illusion Again
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <div style={{ background: '#1a1a1a', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', maxWidth: '400px' }}>
          {/* Line 1: with outward arrows (appears shorter) */}
          <g transform="translate(100, 60)">
            <text x="-30" y="5" fill="#a8d5e5" fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">1</text>
            <line x1="0" y1="0" x2="200" y2="0" stroke="#a8d5e5" strokeWidth="3" />
            {!revealed && (
              <>
                <polyline points="50,-30 0,0 50,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                <polyline points="150,-30 200,0 150,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
              </>
            )}
            {revealed && (
              <text x="100" y="-15" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
            )}
          </g>

          {/* Line 2: with inward arrows (appears longer) */}
          <g transform="translate(100, 140)">
            <text x="-30" y="5" fill="#a8d5e5" fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">2</text>
            <line x1="0" y1="0" x2="200" y2="0" stroke="#a8d5e5" strokeWidth="3" />
            {!revealed && (
              <>
                <polyline points="-50,-30 0,0 -50,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
                <polyline points="250,-30 200,0 250,30" fill="none" stroke="#a8d5e5" strokeWidth="3" />
              </>
            )}
            {revealed && (
              <text x="100" y="-15" fill="#a8d5e5" fontSize="12" textAnchor="middle" fontFamily="Outfit, sans-serif">200px</text>
            )}
          </g>

          {/* Alignment guide when revealed */}
          {revealed && (
            <>
              <line x1="100" y1="45" x2="100" y2="155" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
              <line x1="300" y1="45" x2="300" y2="155" stroke="#a8d5e5" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
            </>
          )}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
