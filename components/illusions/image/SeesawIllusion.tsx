'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function SeesawIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [seesawGuess, setSeesawGuess] = useState<'left' | 'right' | 'same' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'left' | 'right' | 'same') => {
    setSeesawGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setSeesawGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Seesaw Illusion"
      question={question || 'Which side of the seesaw is higher?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {seesawGuess && <><span style={{ color: '#888' }}>You said {seesawGuess === 'same' ? 'they are the same' : `the ${seesawGuess} side`}.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'PERFECTLY LEVEL — The seesaw is completely balanced. Context and surrounding visual cues create the illusion of tilt.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('left')} isPoster1={isPoster1}>
              Left Side
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('right')} isPoster1={isPoster1}>
              Right Side
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('same')} isPoster1={isPoster1}>
              Same
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/seesaw-reveal.jpg') : (src || '/exhibitions/seeing/seesaw.jpg')}
        alt="Seesaw Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
