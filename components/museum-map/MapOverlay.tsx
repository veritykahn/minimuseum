'use client';

import { ReactNode } from 'react';
import { MapRoom } from './types';

type MapOverlayProps = {
  currentRoom: MapRoom | undefined;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Full-screen overlay containing the map
 */
export function MapOverlay({ currentRoom, onClose, children }: MapOverlayProps) {
  return (
    <>
      <div className="map-overlay" onClick={onClose}>
        <div className="map-container" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="map-header">
            <h2>Museum Map</h2>
            {currentRoom && (
              <p className="current-location">
                <span className="you-are-here-dot" />
                You are here: {currentRoom.label}
              </p>
            )}
          </div>

          {children}

          {/* Close hint */}
          <p className="close-hint">Click anywhere outside or press ESC to close</p>
        </div>
      </div>

      <style jsx>{`
        .map-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .map-container {
          background: linear-gradient(145deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98));
          border: 1px solid rgba(125, 132, 113, 0.3);
          border-radius: 12px;
          padding: 24px;
          max-width: 560px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .map-header {
          margin-bottom: 16px;
          text-align: center;
        }

        .map-header h2 {
          font-family: var(--font-cormorant), serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #fafafa;
          margin: 0 0 8px 0;
          letter-spacing: 0.05em;
        }

        .current-location {
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.875rem;
          color: rgba(250, 250, 250, 0.7);
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .you-are-here-dot {
          width: 8px;
          height: 8px;
          background: #a8d5e5;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        .close-hint {
          text-align: center;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.7rem;
          color: rgba(250, 250, 250, 0.3);
          margin: 12px 0 0 0;
        }

        @media (max-width: 480px) {
          .map-container {
            padding: 16px;
            margin: 12px;
          }

          .map-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
