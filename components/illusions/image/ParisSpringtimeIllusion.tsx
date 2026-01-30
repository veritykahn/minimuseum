'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function ParisSpringtimeIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Predictive Processing"
      question={question || 'Read the text inside the triangle carefully.'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : { ...styles.answerHidden, opacity: 0.7, visibility: 'visible' }}>
          {revealed
            ? (answer || '"THE" appears TWICE! Your brain predicts familiar phrases and skips what it expects. You read what should be there, not what is.')
            : 'Read it again. Very slowly.'}
        </p>
      }
      buttons={
        !revealed ? (
          <IllusionButton onClick={() => setRevealed(true)} isPoster1={isPoster1}>
            I&apos;ve Read It
          </IllusionButton>
        ) : (
          <>
            <IllusionButton onClick={() => setRevealed(false)} isPoster1={isPoster1}>
              Read Again
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <Image
        src={revealed ? (revealSrc || '/exhibitions/seeing/paris-reveal.jpg') : (src || '/exhibitions/seeing/paris-springtime.jpg')}
        alt="Paris in the Springtime Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
