'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function KanizsaIllusion({
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
      name="Kanizsa Triangle"
      question={question || 'Do you see a white triangle?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {answer || 'NO TRIANGLE EXISTS — Your brain creates illusory contours to form a triangle that isn\'t there. This "subjective contour" appears brighter than the background, even though it\'s the same white.'}
        </p>
      }
      buttons={
        !revealed ? (
          <IllusionButton onClick={() => setRevealed(true)} isPoster1={isPoster1}>
            Reveal
          </IllusionButton>
        ) : (
          <>
            <IllusionButton onClick={() => setRevealed(false)} isPoster1={isPoster1}>
              See Illusion
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <Image
        src={revealed ? (revealSrc || '/exhibitions/seeing/kanizsa-reveal.jpg') : (src || '/exhibitions/seeing/kanizsa.jpg')}
        alt="Kanizsa Triangle Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
