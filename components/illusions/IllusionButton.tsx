'use client';

import { CSSProperties } from 'react';
import { useIllusionStyles } from './hooks/useIllusionStyles';

type IllusionButtonProps = {
  onClick: () => void;
  isPoster1: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  active?: boolean;
};

/**
 * Styled button for illusion interactions
 */
export function IllusionButton({
  onClick,
  isPoster1,
  children,
  variant = 'primary',
  active = false,
}: IllusionButtonProps) {
  const styles = useIllusionStyles(isPoster1);

  const buttonStyle: CSSProperties = {
    ...styles.button,
    opacity: variant === 'secondary' ? 0.7 : 1,
    background: active ? styles.textColor : 'transparent',
    color: active ? (isPoster1 ? '#e0dede' : '#0a0a0a') : styles.textColor,
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = `${styles.textColor}15`;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
}
