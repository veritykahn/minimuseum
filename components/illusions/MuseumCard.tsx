'use client';

import { useIllusionStyles } from './hooks/useIllusionStyles';

type MuseumCardProps = {
  explanation: string | undefined;
  visible: boolean;
  onClose: () => void;
  isPoster1: boolean;
};

/**
 * Modal card for displaying the science explanation
 */
export function MuseumCard({ explanation, visible, onClose, isPoster1 }: MuseumCardProps) {
  const styles = useIllusionStyles(isPoster1);

  if (!explanation) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          opacity: visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          zIndex: 1000,
        }}
        aria-hidden={!visible}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="museum-card-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: visible
            ? 'translate(-50%, -50%) rotate(0deg)'
            : 'translate(-50%, -40%) rotate(-2deg) scale(0.95)',
          opacity: visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          background: styles.cardBackground,
          borderRadius: '8px',
          padding: 'clamp(20px, 5vw, 32px)',
          width: 'calc(100% - 32px)',
          maxWidth: '420px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 1001,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close explanation"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'transparent',
            border: `1px solid ${styles.textColor}`,
            color: styles.textColor,
            opacity: 0.5,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
        >
          ×
        </button>

        {/* Title */}
        <h3
          id="museum-card-title"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: styles.textColor,
            opacity: 0.4,
            marginBottom: '20px',
          }}
        >
          The Science
        </h3>

        {/* Explanation */}
        <p
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(15px, 3.5vw, 17px)',
            lineHeight: 1.8,
            color: styles.textColor,
            opacity: 0.9,
            margin: 0,
          }}
        >
          {explanation}
        </p>
      </div>
    </>
  );
}
