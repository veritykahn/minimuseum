'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function EbbinghausCirclesIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [ebbinghausGuess, setEbbinghausGuess] = useState<'left' | 'right' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'left' | 'right') => {
    setEbbinghausGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setEbbinghausGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Ebbinghaus Illusion"
      question={question || 'Which orange circle is larger — the one on the left or the right?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {ebbinghausGuess && <><span style={{ color: '#888' }}>You said the {ebbinghausGuess} one.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both orange circles are exactly the same size. The surrounding circles create a relative size illusion.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('left')} isPoster1={isPoster1}>
              Left Circle
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('right')} isPoster1={isPoster1}>
              Right Circle
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/ebbinghaus-reveal.jpg') : (src || '/exhibitions/seeing/ebbinghaus-circles.jpg')}
        alt="Ebbinghaus Circles Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
