'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function BalconyIllusion({
  src,
  revealSrc,
  altRevealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [balconyView, setBalconyView] = useState<'main' | 'out' | 'over'>('main');
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);

  const getImage = () => {
    if (balconyView === 'out') return revealSrc || '/exhibitions/seeing/balcony-out.jpg';
    if (balconyView === 'over') return altRevealSrc || '/exhibitions/seeing/balcony-over.jpg';
    return src || '/exhibitions/seeing/balcony.jpg';
  };

  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Bistable Figure"
      question={question || 'What do you see? A man on a balcony looking out — or looking over a ledge from inside?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={balconyView !== 'main' ? styles.answerVisible : styles.answerHidden}>
          {answer || "Both interpretations are equally valid—this is a \"bistable\" image. Your brain can't hold both views at once, so it picks one. The same visual information, two completely different realities."}
        </p>
      }
      buttons={
        <>
          <IllusionButton
            onClick={() => setBalconyView(balconyView === 'out' ? 'main' : 'out')}
            isPoster1={isPoster1}
            active={balconyView === 'out'}
          >
            Looking Out
          </IllusionButton>
          <IllusionButton
            onClick={() => setBalconyView(balconyView === 'over' ? 'main' : 'over')}
            isPoster1={isPoster1}
            active={balconyView === 'over'}
          >
            Looking In
          </IllusionButton>
          {balconyView !== 'main' && (
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          )}
        </>
      }
    >
      <Image
        src={getImage()}
        alt="Balcony Illusion"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 70vw, 550px"
      />
    </IllusionWrapper>
  );
}
