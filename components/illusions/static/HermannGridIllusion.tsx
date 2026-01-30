'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function HermannGridIllusion({
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
      name="Hermann Grid"
      question={question || 'Do you see gray dots at the intersections?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || 'PHANTOM DOTS — Gray spots appear at intersections in your peripheral vision, but vanish when you look directly at them. This is caused by lateral inhibition in your retina.'}
        </p>
      }
      buttons={
        <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
      }
    >
      <Image
        src={src || '/exhibitions/seeing/hermann-grid.jpg'}
        alt="Hermann Grid Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
