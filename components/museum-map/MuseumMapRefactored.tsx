'use client';

import { useMapState } from './hooks/useMapState';
import { MapToggleButton } from './MapToggleButton';
import { MapOverlay } from './MapOverlay';
import { MapSvg } from './MapSvg';
import { MapLegend } from './MapLegend';

/**
 * Museum Map - Interactive navigation component
 *
 * Refactored version with extracted sub-components:
 * - useMapState: State management hook
 * - MapToggleButton: Floating toggle button
 * - MapOverlay: Full-screen overlay container
 * - MapSvg: SVG visualization of rooms
 * - MapLegend: Map legend
 */
export default function MuseumMap() {
  const {
    isOpen,
    isHomePage,
    currentRoom,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    isCurrentRoom,
  } = useMapState();

  // Don't render on home page
  if (isHomePage) {
    return null;
  }

  return (
    <>
      <MapToggleButton isOpen={isOpen} onClick={toggle} />

      {isOpen && (
        <MapOverlay currentRoom={currentRoom} onClose={close}>
          <MapSvg
            hoveredRoom={hoveredRoom}
            setHoveredRoom={setHoveredRoom}
            onRoomClick={navigateToRoom}
            isCurrentRoom={isCurrentRoom}
          />
          <MapLegend />
        </MapOverlay>
      )}
    </>
  );
}
