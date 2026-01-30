'use client';

import { CSSProperties } from 'react';
import { useIllusionStyles } from './hooks/useIllusionStyles';

type IllusionButtonProps = {
  onClick: () => void;
  isPoster1: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

/**
 * Styled button for illusion interactions
 */
export function IllusionButton({
  onClick,
  isPoster1,
  children,
  variant = 'primary',
}: IllusionButtonProps) {
  const styles = useIllusionStyles(isPoster1);

  const buttonStyle: CSSProperties = {
    ...styles.button,
    opacity: variant === 'secondary' ? 0.7 : 1,
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${styles.textColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}
