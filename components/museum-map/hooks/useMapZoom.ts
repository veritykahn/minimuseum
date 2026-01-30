'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type ZoomState = {
  scale: number;
  translateX: number;
  translateY: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.5;

export function useMapZoom() {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  // Clamp translate values to keep map in bounds
  const clampTranslate = useCallback((x: number, y: number, scale: number) => {
    if (scale <= 1) return { x: 0, y: 0 };

    const container = containerRef.current;
    if (!container) return { x, y };

    const bounds = container.getBoundingClientRect();
    const maxTranslate = (scale - 1) * Math.min(bounds.width, bounds.height) / 2;

    return {
      x: Math.max(-maxTranslate, Math.min(maxTranslate, x)),
      y: Math.max(-maxTranslate, Math.min(maxTranslate, y)),
    };
  }, []);

  // Zoom in
  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const newScale = Math.min(MAX_SCALE, prev.scale + ZOOM_STEP);
      const clamped = clampTranslate(prev.translateX, prev.translateY, newScale);
      return { scale: newScale, translateX: clamped.x, translateY: clamped.y };
    });
  }, [clampTranslate]);

  // Zoom out
  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const newScale = Math.max(MIN_SCALE, prev.scale - ZOOM_STEP);
      const clamped = clampTranslate(prev.translateX, prev.translateY, newScale);
      return { scale: newScale, translateX: clamped.x, translateY: clamped.y };
    });
  }, [clampTranslate]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setZoom({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP / 2 : ZOOM_STEP / 2;

    setZoom((prev) => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale + delta));
      const clamped = clampTranslate(prev.translateX, prev.translateY, newScale);
      return { scale: newScale, translateX: clamped.x, translateY: clamped.y };
    });
  }, [clampTranslate]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom.scale <= 1) return;
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, [zoom.scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || zoom.scale <= 1) return;

    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };

    setZoom((prev) => {
      const clamped = clampTranslate(
        prev.translateX + deltaX,
        prev.translateY + deltaY,
        prev.scale
      );
      return { ...prev, translateX: clamped.x, translateY: clamped.y };
    });
  }, [zoom.scale, clampTranslate]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch handlers for pinch-to-zoom and drag
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastTouchDistance.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1 && zoom.scale > 1) {
      isDragging.current = true;
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [zoom.scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Pinch to zoom
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      if (newDistance !== null) {
        const scaleDelta = (newDistance - lastTouchDistance.current) / 200;
        lastTouchDistance.current = newDistance;

        setZoom((prev) => {
          const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale + scaleDelta));
          const clamped = clampTranslate(prev.translateX, prev.translateY, newScale);
          return { scale: newScale, translateX: clamped.x, translateY: clamped.y };
        });
      }
    }
    // Drag to pan
    else if (e.touches.length === 1 && isDragging.current && zoom.scale > 1) {
      const deltaX = e.touches[0].clientX - lastPosition.current.x;
      const deltaY = e.touches[0].clientY - lastPosition.current.y;
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      setZoom((prev) => {
        const clamped = clampTranslate(
          prev.translateX + deltaX,
          prev.translateY + deltaY,
          prev.scale
        );
        return { ...prev, translateX: clamped.x, translateY: clamped.y };
      });
    }
  }, [zoom.scale, clampTranslate]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastTouchDistance.current = null;
  }, []);

  // Double tap/click to zoom
  const handleDoubleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (zoom.scale >= MAX_SCALE) {
      resetZoom();
    } else {
      zoomIn();
    }
  }, [zoom.scale, zoomIn, resetZoom]);

  // Cleanup dragging state on mouse leave
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
    zoom,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    canZoomIn: zoom.scale < MAX_SCALE,
    canZoomOut: zoom.scale > MIN_SCALE,
    isZoomed: zoom.scale > 1,
    handlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onDoubleClick: handleDoubleClick,
    },
  };
}
