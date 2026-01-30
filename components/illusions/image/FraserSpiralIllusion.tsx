'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function FraserSpiralIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [fraserGuess, setFraserGuess] = useState<'spirals' | 'circles' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'spirals' | 'circles') => {
    setFraserGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setFraserGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Fraser Spiral"
      question={question || 'Is this a spiral winding inward — or a set of concentric circles?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {fraserGuess && <><span style={{ color: '#888' }}>You said {fraserGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'CIRCLES — Every line is a perfect closed loop. The twisted cord pattern creates a false sense of spiraling movement.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('spirals')} isPoster1={isPoster1}>
              Spirals
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('circles')} isPoster1={isPoster1}>
              Circles
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
      <Image
        src={revealed ? (revealSrc || '/exhibitions/seeing/fraser-reveal.jpg') : (src || '/exhibitions/seeing/fraser-spiral.jpg')}
        alt="Fraser Spiral Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
