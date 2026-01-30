'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function RubinsVaseIllusion({
  src,
  revealSrc,
  altRevealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [rubinsView, setRubinsView] = useState<'main' | 'vase' | 'faces'>('main');
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const getImage = () => {
    if (rubinsView === 'vase') return revealSrc || '/exhibitions/seeing/rubins-vase-highlight.jpg';
    if (rubinsView === 'faces') return altRevealSrc || '/exhibitions/seeing/rubins-faces-highlight.jpg';
    return src || '/exhibitions/seeing/rubins-vase.jpg';
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Rubin&apos;s Vase"
      question={question || 'What do you see first — a vase or two faces?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={rubinsView !== 'main' ? styles.answerVisible : styles.answerHidden}>
          {answer || 'BOTH — This is a classic figure-ground illusion. Your brain must decide what is the "figure" (object) and what is the "ground" (background). It cannot perceive both simultaneously.'}
        </p>
      }
      buttons={
        <>
          <IllusionButton
            onClick={() => setRubinsView(rubinsView === 'vase' ? 'main' : 'vase')}
            isPoster1={isPoster1}
            active={rubinsView === 'vase'}
          >
            See Vase
          </IllusionButton>
          <IllusionButton
            onClick={() => setRubinsView(rubinsView === 'faces' ? 'main' : 'faces')}
            isPoster1={isPoster1}
            active={rubinsView === 'faces'}
          >
            See Faces
          </IllusionButton>
          {rubinsView !== 'main' && (
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          )}
        </>
      }
    >
      <Image
        src={getImage()}
        alt="Rubin's Vase Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
