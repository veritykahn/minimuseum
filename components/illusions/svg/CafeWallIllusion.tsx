'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function CafeWallIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [cafeGuess, setCafeGuess] = useState<'left' | 'right' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const rows = 8;
  const cols = 10;
  const tileSize = 30;
  const mortarHeight = 3;

  const handleGuess = (guess: 'left' | 'right') => {
    setCafeGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setCafeGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Café Wall Illusion"
      question={question || 'Which way do the gray lines tilt — left or right?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {cafeGuess && <><span style={{ color: '#888' }}>You said {cafeGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || "NEITHER — They're perfectly parallel. The offset black and white tiles create a wedge-like appearance that tricks your visual cortex into perceiving tilt."}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('left')} isPoster1={isPoster1}>
              Left
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('right')} isPoster1={isPoster1}>
              Right
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
      <div style={{ background: '#1a1a1a', padding: '20px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox={`0 0 ${cols * tileSize} ${rows * (tileSize + mortarHeight)}`} style={{ width: '100%', height: '100%', maxWidth: '350px' }}>
          {/* Gray mortar lines */}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <rect
              key={`mortar-${i}`}
              x="0"
              y={i * (tileSize + mortarHeight)}
              width={cols * tileSize}
              height={mortarHeight}
              fill={revealed ? '#ff6b6b' : '#808080'}
              style={{ transition: 'fill 0.3s ease' }}
            />
          ))}

          {/* Tiles */}
          {Array.from({ length: rows }).map((_, row) => (
            <g key={`row-${row}`}>
              {Array.from({ length: cols }).map((_, col) => {
                const isBlack = (row + col) % 2 === 0;
                const offset = revealed ? 0 : (row % 2 === 0 ? tileSize / 2 : 0);
                return (
                  <rect
                    key={`tile-${row}-${col}`}
                    x={col * tileSize + offset - (revealed ? 0 : tileSize / 4)}
                    y={row * (tileSize + mortarHeight) + mortarHeight}
                    width={tileSize}
                    height={tileSize}
                    fill={isBlack ? '#1a1a1a' : '#f0f0f0'}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </IllusionWrapper>
  );
}
