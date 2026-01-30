'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function MunkerHeartsIllusion({
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
      name="Munker Illusion"
      question={question || 'Are the hearts different colors?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || 'IDENTICAL — All the hearts are exactly the same color. The surrounding stripes shift your perception of hue through a phenomenon called color assimilation.'}
        </p>
      }
      buttons={
        <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
      }
    >
      <Image
        src={src || '/exhibitions/seeing/munker-hearts.jpg'}
        alt="Munker Hearts Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
