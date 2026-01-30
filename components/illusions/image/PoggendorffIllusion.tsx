'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function PoggendorffIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [poggendorffGuess, setPoggendorffGuess] = useState<'a' | 'b' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'a' | 'b') => {
    setPoggendorffGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setPoggendorffGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Poggendorff Illusion"
      question={question || 'Which line on the right continues the line on the left — A or B?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {poggendorffGuess && <><span style={{ color: '#888' }}>You chose line {poggendorffGuess.toUpperCase()}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'LINE A — The bar creates a misalignment illusion, making line B appear to be the continuation.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('a')} isPoster1={isPoster1}>
              Line A
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('b')} isPoster1={isPoster1}>
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
      <Image
        src={revealed ? (revealSrc || '/exhibitions/seeing/poggendorff-reveal.jpg') : (src || '/exhibitions/seeing/poggendorff.jpg')}
        alt="Poggendorff Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
