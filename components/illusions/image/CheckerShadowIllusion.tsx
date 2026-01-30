'use client';

import Image from 'next/image';
import { IllusionProps } from '../types';
import { useIllusionState, useIllusionStyles } from '../hooks';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';

/**
 * Adelson's Checker Shadow Illusion
 * Demonstrates lightness constancy - the brain's automatic adjustment for lighting
 */
export function CheckerShadowIllusion({
  src,
  revealSrc,
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const { revealed, guess, showScience, handleGuess, reset, openScience, closeScience } =
    useIllusionState<'true' | 'false'>();
  const styles = useIllusionStyles(isPoster1);

  const imageSrc = revealed
    ? revealSrc || '/exhibitions/seeing/checker-reveal.jpg'
    : src || '/exhibitions/seeing/checker-shadow.jpg';

  return (
    <IllusionWrapper
      name="Adelson's Checker Shadow"
      question={question || 'A is darker than B — true or false?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={closeScience}
      answerContent={
        revealed && (
          <p style={styles.answerVisible}>
            <span style={{ color: '#888' }}>You said {guess}. </span>
            <span style={{ color: styles.textColor }}>
              {answer || 'The answer is: IDENTICAL — Both squares are the exact same shade.'}
            </span>
          </p>
        )
      }
      buttons={
        !revealed ? (
          <>
            <IllusionButton onClick={() => handleGuess('true')} isPoster1={isPoster1}>
              True
            </IllusionButton>
            <IllusionButton onClick={() => handleGuess('false')} isPoster1={isPoster1}>
              False
            </IllusionButton>
          </>
        ) : (
          <>
            <IllusionButton onClick={reset} isPoster1={isPoster1}>
              Try Again
            </IllusionButton>
            <ScienceButton
              onClick={openScience}
              isPoster1={isPoster1}
              hasExplanation={!!scienceExplanation}
            />
          </>
        )
      }
    >
      <Image
        src={imageSrc}
        alt="Checker Shadow Illusion showing squares A and B"
        width={550}
        height={450}
        style={styles.image}
        priority
      />
    </IllusionWrapper>
  );
}
