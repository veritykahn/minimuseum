'use client';

import { useMapState } from './hooks/useMapState';
import { useMapZoom } from './hooks/useMapZoom';
import { MapToggleButton } from './MapToggleButton';
import { MapOverlay } from './MapOverlay';
import { MapSvg } from './MapSvg';
import { MapLegend } from './MapLegend';

/**
 * Museum Map - Interactive navigation component
 *
 * Refactored version with extracted sub-components:
 * - useMapState: State management hook
 * - useMapZoom: Zoom/pan functionality hook
 * - MapToggleButton: Floating toggle button
 * - MapOverlay: Full-screen overlay container with zoom controls
 * - MapSvg: SVG visualization of rooms
 * - MapLegend: Map legend
 */
export default function MuseumMap() {
  const {
    isOpen,
    isHomePage,
    currentRoom,
    currentPath,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    isCurrentRoom,
  } = useMapState();

  const {
    zoom,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    canZoomIn,
    canZoomOut,
    isZoomed,
    handlers: zoomHandlers,
  } = useMapZoom();

  // Don't render on home page
  if (isHomePage) {
    return null;
  }

  return (
    <>
      <MapToggleButton isOpen={isOpen} onClick={toggle} />

      {isOpen && (
        <MapOverlay
          currentRoom={currentRoom}
          onClose={close}
          zoom={zoom}
          zoomHandlers={zoomHandlers}
          containerRef={containerRef}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          isZoomed={isZoomed}
        >
          <MapSvg
            hoveredRoom={hoveredRoom}
            setHoveredRoom={setHoveredRoom}
            onRoomClick={navigateToRoom}
            isCurrentRoom={isCurrentRoom}
            currentPath={currentPath}
          />
          <MapLegend />
        </MapOverlay>
      )}
    </>
  );
}
