'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function JastrowIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [jastrowGuess, setJastrowGuess] = useState<'top' | 'bottom' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const handleGuess = (guess: 'top' | 'bottom') => {
    setJastrowGuess(guess);
    setRevealed(true);
  };

  const reset = () => {
    setJastrowGuess(null);
    setRevealed(false);
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Jastrow Illusion"
      question={question || 'Which arc is longer — the top one or the bottom one?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {jastrowGuess && <><span style={{ color: '#888' }}>You said the {jastrowGuess} arc.</span> </>}
          <span style={{ color: '#a8d5e5' }}>{answer || 'IDENTICAL — Both arcs are exactly the same size. The shorter inner edge of the top arc sits next to the longer outer edge of the bottom arc, making the bottom appear larger.'}</span>
        </p>
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('top')} isPoster1={isPoster1}>
              Top Arc
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('bottom')} isPoster1={isPoster1}>
              Bottom Arc
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/jastrow-reveal.jpg') : (src || '/exhibitions/seeing/jastrow.jpg')}
        alt="Jastrow Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
