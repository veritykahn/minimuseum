/**
 * Illusion components library
 *
 * This module exports the refactored illusion infrastructure.
 * Individual illusion components are organized by type:
 * - image/ - Image-based illusions with reveal mechanics
 * - svg/ - SVG-based interactive illusions
 * - static/ - Display-only illusions
 */

// Types
export * from './types';

// Hooks
export { useIllusionState } from './hooks/useIllusionState';
export { useIllusionStyles } from './hooks/useIllusionStyles';

// Shared components
export { IllusionWrapper } from './IllusionWrapper';
export { MuseumCard } from './MuseumCard';
export { ScienceButton } from './ScienceButton';
export { IllusionButton } from './IllusionButton';

// Image-based illusions
export * from './image';

// SVG-based illusions
export * from './svg';

// Static/display illusions
export * from './static';
