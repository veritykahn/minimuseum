'use client';

import { useMemo, CSSProperties } from 'react';

/**
 * Hook for generating illusion styles based on poster theme
 */
export function useIllusionStyles(isPoster1: boolean) {
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  const styles = useMemo(
    () => ({
      textColor,

      container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(70px, 8vh, 100px) clamp(16px, 5vw, 40px) clamp(80px, 10vh, 120px)',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
      } as CSSProperties,

      nameLabel: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(10px, 1.5vw, 12px)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: textColor,
        opacity: 0.5,
        marginBottom: '12px',
        flexShrink: 0,
        height: '18px',
      } as CSSProperties,

      question: {
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
        fontStyle: 'italic',
        color: textColor,
        textAlign: 'center',
        maxWidth: '650px',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        margin: 0,
        padding: '0 16px',
      } as CSSProperties,

      imageContainer: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 'clamp(300px, 70vw, 550px)',
        height: 'clamp(220px, 50vh, 450px)',
        margin: '16px 0',
      } as CSSProperties,

      imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      } as CSSProperties,

      image: {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
        borderRadius: '4px',
      } as CSSProperties,

      answerContainer: {
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: '8px 0',
      } as CSSProperties,

      answer: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        color: textColor,
        textAlign: 'center',
        maxWidth: '85vw',
        lineHeight: 1.7,
        padding: '0 20px',
      } as CSSProperties,

      answerVisible: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        color: textColor,
        textAlign: 'center',
        maxWidth: '85vw',
        lineHeight: 1.7,
        padding: '0 20px',
        opacity: 1,
        animation: 'fadeInUp 0.5s ease forwards',
      } as CSSProperties,

      answerHidden: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        color: textColor,
        textAlign: 'center',
        maxWidth: '85vw',
        lineHeight: 1.7,
        padding: '0 20px',
        opacity: 0,
        visibility: 'hidden',
      } as CSSProperties,

      buttonContainer: {
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(8px, 2vw, 12px)',
        flexWrap: 'wrap',
        flexShrink: 0,
        padding: '8px 0',
        marginTop: '4px',
      } as CSSProperties,

      button: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(11px, 2.5vw, 12px)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 5vw, 28px)',
        background: 'transparent',
        border: `1px solid ${textColor}`,
        color: textColor,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
      } as CSSProperties,

      scienceButton: {
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(11px, 2.5vw, 12px)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: 'clamp(12px, 2.5vw, 14px) clamp(20px, 5vw, 28px)',
        background: 'transparent',
        border: `1px solid ${textColor}`,
        color: textColor,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: 0.7,
        whiteSpace: 'nowrap',
      } as CSSProperties,

      // Card modal styles
      cardBackground: isPoster1 ? '#f8f7f4' : '#1c1c1c',
    }),
    [isPoster1, textColor]
  );

  return styles;
}
