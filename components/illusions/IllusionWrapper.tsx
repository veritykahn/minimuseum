'use client';

import { ReactNode } from 'react';
import { useIllusionStyles } from './hooks/useIllusionStyles';
import { MuseumCard } from './MuseumCard';

type IllusionWrapperProps = {
  name: string;
  question?: string;
  isPoster1: boolean;
  scienceExplanation?: string;
  showScience: boolean;
  onCloseScience: () => void;
  children: ReactNode; // The illusion image/content
  answerContent?: ReactNode;
  buttons: ReactNode;
};

/**
 * Shared wrapper component for all illusions
 * Provides consistent layout and styling
 */
export function IllusionWrapper({
  name,
  question,
  isPoster1,
  scienceExplanation,
  showScience,
  onCloseScience,
  children,
  answerContent,
  buttons,
}: IllusionWrapperProps) {
  const styles = useIllusionStyles(isPoster1);

  return (
    <div style={styles.container}>
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Illusion name */}
      <span style={styles.nameLabel}>{name}</span>

      {/* Question */}
      {question && <p style={styles.question}>{question}</p>}

      {/* Image/Content container */}
      <div style={styles.imageContainer}>
        <div style={styles.imageWrapper}>{children}</div>
      </div>

      {/* Answer container */}
      <div style={styles.answerContainer}>{answerContent}</div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>{buttons}</div>

      {/* Science explanation modal */}
      <MuseumCard
        explanation={scienceExplanation}
        visible={showScience}
        onClose={onCloseScience}
        isPoster1={isPoster1}
      />
    </div>
  );
}
