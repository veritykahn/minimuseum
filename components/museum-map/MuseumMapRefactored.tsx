'use client';

import { useEffect } from 'react';
import { useMapState } from './hooks/useMapState';
import { useMapLevel } from './hooks/useMapLevel';
import { useMapZoom } from './hooks/useMapZoom';
import { MapToggleButton } from './MapToggleButton';
import { MapOverlay } from './MapOverlay';
import { MapSvg } from './MapSvg';
import { MapLegend } from './MapLegend';

/**
 * Museum Map — Interactive hierarchical navigation component.
 *
 * Three zoom levels auto-determined by the current route:
 * 1. Museum Overview (Great Hall, floors)
 * 2. Floor View (exhibitions within a floor)
 * 3. Exhibition View (sub-rooms as a floor plan)
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
    navigateBack,
    isCurrentRoom,
  } = useMapState();

  const { config, level, transition } = useMapLevel(currentPath);

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

  // Reset manual zoom/pan when the level changes
  useEffect(() => {
    resetZoom();
  }, [level, config.title, resetZoom]);

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
          levelConfig={config}
          onBack={config.backTarget ? () => navigateBack(config.backTarget!.path) : undefined}
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
            config={config}
            hoveredRoom={hoveredRoom}
            setHoveredRoom={setHoveredRoom}
            onRoomClick={navigateToRoom}
            isCurrentRoom={isCurrentRoom}
            transition={transition}
          />
          <MapLegend />
        </MapOverlay>
      )}
    </>
  );
}
