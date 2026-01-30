'use client';

import { useIllusionStyles } from './hooks/useIllusionStyles';

type ScienceButtonProps = {
  onClick: () => void;
  isPoster1: boolean;
  hasExplanation: boolean;
};

/**
 * "How does this work?" button that opens the science explanation
 */
export function ScienceButton({ onClick, isPoster1, hasExplanation }: ScienceButtonProps) {
  const styles = useIllusionStyles(isPoster1);

  if (!hasExplanation) return null;

  return (
    <button
      onClick={onClick}
      style={styles.scienceButton}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
    >
      How Does This Work?
    </button>
  );
}
