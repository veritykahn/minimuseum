/**
 * Museum Map module exports
 *
 * Refactored into modular components:
 * - MuseumMapRefactored: Main component (~50 lines)
 * - MapToggleButton: Floating toggle button
 * - MapOverlay: Full-screen overlay
 * - MapSvg: SVG visualization
 * - MapLegend: Map legend
 * - useMapState: State management hook
 */

// Types
export * from './types';

// Data
export { MUSEUM_ROOMS, getRoomById, getRoomByPath } from './data/rooms';
export { CONNECTIONS } from './data/connections';

// Hooks
export { useMapState } from './hooks/useMapState';
export { useMapZoom } from './hooks/useMapZoom';

// Components
export { MapToggleButton } from './MapToggleButton';
export { MapOverlay } from './MapOverlay';
export { MapSvg } from './MapSvg';
export { MapLegend } from './MapLegend';
export { default as MuseumMapRefactored } from './MuseumMapRefactored';
