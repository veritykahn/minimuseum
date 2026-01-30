'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function CubeShadowIllusion({
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
      name="Cube Shadow"
      question={question || 'Are the squares on the top of the cube different colors?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {answer || 'IDENTICAL — Both squares are exactly the same shade. Your brain compensates for the perceived shadow, making the "shadowed" square appear lighter than it actually is.'}
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
        src={revealed ? (revealSrc || '/exhibitions/seeing/cube-shadow-reveal.jpg') : (src || '/exhibitions/seeing/cube-shadow.jpg')}
        alt="Cube Shadow Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
