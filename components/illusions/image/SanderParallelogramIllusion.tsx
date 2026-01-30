'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function SanderParallelogramIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [sanderGuess, setSanderGuess] = useState<'left' | 'right' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'left' | 'right') => {
    setSanderGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setSanderGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Sander Parallelogram"
      question={question || 'Which diagonal line is longer — the one in the left parallelogram or the right?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {sanderGuess && <><span style={{ color: '#888' }}>You chose the {sanderGuess} diagonal.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both diagonals are exactly the same length. The parallelogram shapes distort our perception of length.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('left')} isPoster1={isPoster1}>
              Left Diagonal
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('right')} isPoster1={isPoster1}>
              Right Diagonal
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
      <Image
        src={revealed ? (revealSrc || '/exhibitions/seeing/sander-reveal.jpg') : (src || '/exhibitions/seeing/sander-parallelogram.jpg')}
        alt="Sander Parallelogram Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
