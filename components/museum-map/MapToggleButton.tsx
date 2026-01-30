'use client';

type MapToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

/**
 * Floating button to toggle the museum map
 */
export function MapToggleButton({ isOpen, onClick }: MapToggleButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="map-toggle-btn"
        aria-label={isOpen ? 'Close map' : 'Open museum map'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            // X icon when open
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            // Map icon when closed
            <>
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </>
          )}
        </svg>
        <span className="map-toggle-label">Map</span>
      </button>

      <style jsx>{`
        .map-toggle-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .map-toggle-btn:hover {
          background: rgba(125, 132, 113, 0.2);
          border-color: rgba(125, 132, 113, 0.6);
          transform: scale(1.05);
        }

        .map-toggle-label {
          font-size: 9px;
          font-family: var(--font-outfit), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .map-toggle-btn {
            bottom: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
          }

          .map-toggle-label {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
