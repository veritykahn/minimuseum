'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMapState } from './hooks/useMapState';
import { useMapLevel } from './hooks/useMapLevel';
import { useMapZoom } from './hooks/useMapZoom';
import { MapToggleButton } from './MapToggleButton';
import { MapOverlay } from './MapOverlay';
import { MapSvg } from './MapSvg';
import { MapLegend } from './MapLegend';
import { mapButtonPlacement } from './placement';
import { useProjectorScreenUp } from '@/components/projector/useProjectorMode';

/**
 * Museum Map — Interactive hierarchical navigation component.
 *
 * Three zoom levels auto-determined by the current route:
 * 1. Museum Overview (Great Hall, floors)
 * 2. Floor View (exhibitions within a floor)
 * 3. Exhibition View (architectural floor plan)
 *
 * The map has its own internal browsing state — clicking ancestors
 * or rooms with children changes what the map displays without
 * navigating the page. Only leaf rooms trigger actual navigation.
 */
export default function MuseumMap() {
  const {
    isOpen,
    isHomePage,
    currentRoom,
    viewPath,
    hoveredRoom,
    setHoveredRoom,
    toggle,
    close,
    navigateToRoom,
    navigateInMap,
    isCurrentRoom,
  } = useMapState();

  const { config, level, transition } = useMapLevel(viewPath);

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

  // A lesson on the classroom screen, or its presenter view, is a full-screen
  // tool: no floating map button over the projector.
  const pathname = usePathname();
  const isLessonScreen = /\/lessons\/[^/]+/.test(pathname ?? '');
  const placement = mapButtonPlacement(pathname);

  // Tell the page's CSS where the button is, so a page that scrolls can
  // leave room for it (html[data-map-fab='clear'] in globals.css).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mapFab = placement;
    return () => { delete root.dataset.mapFab; };
  }, [placement]);

  // The same for a teacher projector screen (a game or a poster walkthrough).
  const projectorUp = useProjectorScreenUp();

  if (isHomePage || isLessonScreen || projectorUp) {
    return null;
  }

  return (
    <>
      <MapToggleButton isOpen={isOpen} onClick={toggle} placement={placement} />

      {isOpen && (
        <MapOverlay
          currentRoom={currentRoom}
          onClose={close}
          levelConfig={config}
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
            onAncestorClick={(ancestor) => navigateInMap(ancestor.viewPath)}
            isCurrentRoom={isCurrentRoom}
            transition={transition}
          />
          <MapLegend hereColor={currentRoom?.accentColor} />
        </MapOverlay>
      )}
    </>
  );
}
