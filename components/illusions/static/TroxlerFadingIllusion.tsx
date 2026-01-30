'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function TroxlerFadingIllusion({
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
      name="Troxler&apos;s Fading"
      question={question || 'Stare at the center dot for 20 seconds. What happens to the colors?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || 'THEY FADE AWAY — Your visual neurons adapt to unchanging stimuli and stop responding. This "neural adaptation" causes the peripheral colors to vanish into the background.'}
        </p>
      }
      buttons={
        <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
      }
    >
      <Image
        src={src || '/exhibitions/seeing/troxler.jpg'}
        alt="Troxler Fading Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
