'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function ImpossibleTridentIllusion({
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
      name="Impossible Trident"
      question={question || 'How many prongs does this object have?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={styles.answerVisible}>
          {answer || 'IMPOSSIBLE — This object cannot exist in 3D space. The drawing exploits how your brain interprets 2D lines as 3D depth cues, creating a paradox that shifts between two and three prongs.'}
        </p>
      }
      buttons={
        <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
      }
    >
      <Image
        src={src || '/exhibitions/seeing/impossible-trident.jpg'}
        alt="Impossible Trident Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
