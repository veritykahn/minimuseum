'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function BulgingGridIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [bulgingGuess, setBulgingGuess] = useState<'bulging' | 'flat' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'bulging' | 'flat') => {
    setBulgingGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setBulgingGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Bulging Grid"
      question={question || 'Is the grid bulging outward — or is it perfectly flat?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {bulgingGuess && <><span style={{ color: '#888' }}>You said {bulgingGuess}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'PERFECTLY FLAT — Every line is straight. The offset squares trick your brain into perceiving curvature and depth where none exists.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('bulging')} isPoster1={isPoster1}>
              Bulging
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('flat')} isPoster1={isPoster1}>
              Flat
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/bulging-reveal.jpg') : (src || '/exhibitions/seeing/bulging-grid.jpg')}
        alt="Bulging Grid Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
