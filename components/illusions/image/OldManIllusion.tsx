'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function OldManIllusion({
  src,
  revealSrc,
  altRevealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [oldManView, setOldManView] = useState<'main' | 'old' | 'young'>('main');
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const getImage = () => {
    if (oldManView === 'old') return revealSrc || '/exhibitions/seeing/old-man-highlight.jpg';
    if (oldManView === 'young') return altRevealSrc || '/exhibitions/seeing/young-woman-highlight.jpg';
    return src || '/exhibitions/seeing/old-man.jpg';
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="My Wife and My Mother-in-Law"
      question={question || 'What do you see — an old woman or a young woman?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={oldManView !== 'main' ? styles.answerVisible : styles.answerHidden}>
          {answer || "BOTH — This classic ambiguous image contains two faces. The old woman's nose is the young woman's chin. Once you see both, your brain will flip between them."}
        </p>
      }
      buttons={
        <>
          <IllusionButton
            onClick={() => setOldManView(oldManView === 'old' ? 'main' : 'old')}
            isPoster1={isPoster1}
            active={oldManView === 'old'}
          >
            Old Woman
          </IllusionButton>
          <IllusionButton
            onClick={() => setOldManView(oldManView === 'young' ? 'main' : 'young')}
            isPoster1={isPoster1}
            active={oldManView === 'young'}
          >
            Young Woman
          </IllusionButton>
          {oldManView !== 'main' && (
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          )}
        </>
      }
    >
      <Image
        src={getImage()}
        alt="Old Man / Young Woman Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
