'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function RotatingSnakesIllusion({
  src,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Rotating Snakes"
      question={question || 'Are the circles moving?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || 'COMPLETELY STILL — This image is static. The asymmetric color gradients trigger motion-detecting neurons in your visual cortex, creating phantom rotation.'}
        </p>
      }
      buttons={
        <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
      }
    >
      <Image
        src={src || '/exhibitions/seeing/rotating-snakes.jpg'}
        alt="Rotating Snakes Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
