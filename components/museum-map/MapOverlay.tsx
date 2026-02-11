'use client';

import { ReactNode, RefObject } from 'react';
import { MapRoom, MapLevelConfig } from './types';

type ZoomState = {
  scale: number;
  translateX: number;
  translateY: number;
};

type ZoomHandlers = {
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onDoubleClick: (e: React.MouseEvent | React.TouchEvent) => void;
};

type MapOverlayProps = {
  currentRoom: MapRoom | undefined;
  onClose: () => void;
  children: ReactNode;
  levelConfig: MapLevelConfig;
  onBack?: () => void;
  zoom?: ZoomState;
  zoomHandlers?: ZoomHandlers;
  containerRef?: RefObject<HTMLDivElement | null>;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  isZoomed?: boolean;
};

/**
 * Full-screen overlay containing the map with zoom/pan support.
 * Shows dynamic title, back navigation, and breadcrumb based on level.
 */
export function MapOverlay({
  currentRoom,
  onClose,
  children,
  levelConfig,
  onBack,
  zoom,
  zoomHandlers,
  containerRef,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn = true,
  canZoomOut = false,
  isZoomed = false,
}: MapOverlayProps) {
  const hasZoom = zoom && zoomHandlers;

  // Build breadcrumb based on level
  const breadcrumb = (() => {
    if (levelConfig.level === 'museum') return null;
    if (levelConfig.level === 'floor') {
      return [{ label: 'Museum', path: '/greathall' }];
    }
    // exhibition level
    return [
      { label: 'Museum', path: '/greathall' },
      { label: '1st Floor', path: '/exhibitions/first-floor' },
    ];
  })();

  return (
    <>
      <div className="map-overlay" onClick={onClose}>
        <div className="map-container" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="map-header">
            {/* Back button */}
            {levelConfig.backTarget && onBack && (
              <button className="map-back-btn" onClick={onBack}>
                <span aria-hidden="true">&larr;</span> {levelConfig.backTarget.label}
              </button>
            )}

            <h2>{levelConfig.title || 'Museum Map'}</h2>

            {/* Breadcrumb */}
            {breadcrumb && (
              <div className="map-breadcrumb">
                {breadcrumb.map((crumb, i) => (
                  <span key={crumb.path}>
                    {i > 0 && <span className="breadcrumb-sep">&rsaquo;</span>}
                    <span className="breadcrumb-label">{crumb.label}</span>
                  </span>
                ))}
                <span className="breadcrumb-sep">&rsaquo;</span>
                <span className="breadcrumb-current">{levelConfig.title}</span>
              </div>
            )}

            {currentRoom && (
              <p className="current-location">
                <span className="you-are-here-dot" />
                You are here: {currentRoom.label}
              </p>
            )}
          </div>

          {/* Zoomable map area */}
          {hasZoom ? (
            <div
              ref={containerRef}
              className={`map-viewport ${isZoomed ? 'zoomed' : ''}`}
              {...zoomHandlers}
            >
              <div
                className="map-content"
                style={{
                  transform: `scale(${zoom.scale}) translate(${zoom.translateX / zoom.scale}px, ${zoom.translateY / zoom.scale}px)`,
                }}
              >
                {children}
              </div>
            </div>
          ) : (
            children
          )}

          {/* Zoom controls */}
          {hasZoom && (
            <div className="zoom-controls">
              <button
                className="zoom-btn"
                onClick={onZoomIn}
                disabled={!canZoomIn}
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                className="zoom-btn"
                onClick={onZoomOut}
                disabled={!canZoomOut}
                aria-label="Zoom out"
              >
                −
              </button>
              {isZoomed && (
                <button
                  className="zoom-btn reset"
                  onClick={onResetZoom}
                  aria-label="Reset zoom"
                >
                  ⟲
                </button>
              )}
            </div>
          )}

          {/* Instructions */}
          <p className="zoom-hint">
            {isZoomed ? 'Drag to pan • Pinch or scroll to zoom' : 'Pinch or scroll to zoom • Double-tap to zoom in'}
          </p>
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.3s ease;
          position: relative;
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

        .map-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: rgba(250, 250, 250, 0.5);
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          margin-bottom: 6px;
        }

        .map-back-btn:hover {
          color: #fafafa;
          background: rgba(125, 132, 113, 0.2);
        }

        .map-header h2 {
          font-family: var(--font-cormorant), serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #fafafa;
          margin: 0 0 4px 0;
          letter-spacing: 0.05em;
        }

        .map-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 8px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.7rem;
          color: rgba(250, 250, 250, 0.35);
        }

        .breadcrumb-sep {
          color: rgba(250, 250, 250, 0.2);
        }

        .breadcrumb-label {
          color: rgba(250, 250, 250, 0.35);
        }

        .breadcrumb-current {
          color: rgba(250, 250, 250, 0.6);
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

        /* Zoomable viewport */
        .map-viewport {
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.3);
          touch-action: none;
          user-select: none;
          cursor: grab;
        }

        .map-viewport.zoomed {
          cursor: grab;
        }

        .map-viewport:active {
          cursor: grabbing;
        }

        .map-content {
          transform-origin: center center;
          transition: transform 0.1s ease-out;
        }

        /* Zoom controls */
        .zoom-controls {
          position: absolute;
          right: 16px;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 10;
        }

        .zoom-btn {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(125, 132, 113, 0.4);
          border-radius: 6px;
          background: rgba(20, 20, 20, 0.9);
          color: #fafafa;
          font-size: 18px;
          font-weight: 300;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .zoom-btn:hover:not(:disabled) {
          background: rgba(125, 132, 113, 0.3);
          border-color: rgba(125, 132, 113, 0.6);
        }

        .zoom-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .zoom-btn.reset {
          font-size: 14px;
        }

        .zoom-hint {
          text-align: center;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.65rem;
          color: rgba(250, 250, 250, 0.4);
          margin: 8px 0 0 0;
        }

        .close-hint {
          text-align: center;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.7rem;
          color: rgba(250, 250, 250, 0.3);
          margin: 4px 0 0 0;
        }

        @media (max-width: 480px) {
          .map-container {
            padding: 16px;
            margin: 12px;
            max-height: 85vh;
          }

          .map-header h2 {
            font-size: 1.5rem;
          }

          .zoom-controls {
            right: 8px;
            top: 70px;
          }

          .zoom-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}
