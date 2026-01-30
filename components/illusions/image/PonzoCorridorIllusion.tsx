'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function PonzoCorridorIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [ponzoGuess, setPonzoGuess] = useState<'back' | 'front' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'back' | 'front') => {
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
      name="Ponzo Illusion"
      question={question || 'Which figure is taller — the one in front or the one in back?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {ponzoGuess && <><span style={{ color: '#888' }}>You said the {ponzoGuess} one.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both figures are the exact same height. Linear perspective makes the "distant" one appear larger.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('back')} isPoster1={isPoster1}>
              Back Figure
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('front')} isPoster1={isPoster1}>
              Front Figure
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/ponzo-reveal.jpg') : (src || '/exhibitions/seeing/ponzo-corridor.jpg')}
        alt="Ponzo Corridor Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
