'use client';

import { CSSProperties } from 'react';

type ScienceButtonProps = {
  onClick: () => void;
  textColor?: string;
  isPoster1?: boolean;
};

/**
 * "How does this work?" button that opens the science explanation
 */
export function ScienceButton({ onClick, textColor, isPoster1 }: ScienceButtonProps) {
  // Determine text color from either prop or isPoster1
  const color = textColor || (isPoster1 ? '#2a2a2a' : '#a8d5e5');

  const buttonStyle: CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(11px, 2.5vw, 12px)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 5vw, 28px)',
    background: 'transparent',
    border: `1px solid ${color}`,
    color: color,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0.7,
    whiteSpace: 'nowrap',
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
    >
      How Does This Work?
    </button>
  );
}
