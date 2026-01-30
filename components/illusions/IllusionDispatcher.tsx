'use client';

import { IllusionProps } from './types';

// Image-based illusions
import { CheckerShadowIllusion } from './image/CheckerShadowIllusion';
import { BalconyIllusion } from './image/BalconyIllusion';
import { FraserSpiralIllusion } from './image/FraserSpiralIllusion';
import { BulgingGridIllusion } from './image/BulgingGridIllusion';
import { PonzoCorridorIllusion } from './image/PonzoCorridorIllusion';
import { JastrowIllusion } from './image/JastrowIllusion';
import { EbbinghausCirclesIllusion } from './image/EbbinghausCirclesIllusion';
import { SanderParallelogramIllusion } from './image/SanderParallelogramIllusion';
import { PoggendorffIllusion } from './image/PoggendorffIllusion';
import { RubinsVaseIllusion } from './image/RubinsVaseIllusion';
import { ChromostereopsisIllusion } from './image/ChromostereopsisIllusion';
import { SeesawIllusion } from './image/SeesawIllusion';
import { ParisSpringtimeIllusion } from './image/ParisSpringtimeIllusion';
import { OldManIllusion } from './image/OldManIllusion';
import { KanizsaIllusion } from './image/KanizsaIllusion';

// SVG-based illusions
import { MullerLyerIllusion } from './svg/MullerLyerIllusion';
import { SimultaneousContrastIllusion } from './svg/SimultaneousContrastIllusion';
import { CafeWallIllusion } from './svg/CafeWallIllusion';
import { PonzoRailroadIllusion } from './svg/PonzoRailroadIllusion';
import { KanizsaTriangleSvgIllusion } from './svg/KanizsaTriangleSvgIllusion';
import { LilacChaserIllusion } from './svg/LilacChaserIllusion';
import { ParisSpringtimeSvgIllusion } from './svg/ParisSpringtimeSvgIllusion';
import { PoggendorffSvgIllusion } from './svg/PoggendorffSvgIllusion';
import { GradientBarIllusion } from './svg/GradientBarIllusion';

// Static/display illusions
import { RotatingSnakesIllusion } from './static/RotatingSnakesIllusion';
import { MunkerHeartsIllusion } from './static/MunkerHeartsIllusion';
import { TroxlerFadingIllusion } from './static/TroxlerFadingIllusion';
import { HermannGridIllusion } from './static/HermannGridIllusion';
import { ImpossibleTridentIllusion } from './static/ImpossibleTridentIllusion';
import { ConcaveConvexIllusion } from './static/ConcaveConvexIllusion';
import { CubeShadowIllusion } from './static/CubeShadowIllusion';

/**
 * Map of illusion type strings to their component implementations
 */
const ILLUSION_MAP: Record<string, React.ComponentType<IllusionProps>> = {
  // Image-based
  'checker-shadow': CheckerShadowIllusion,
  'balcony': BalconyIllusion,
  'fraser-spiral': FraserSpiralIllusion,
  'bulging-grid': BulgingGridIllusion,
  'ponzo-corridor': PonzoCorridorIllusion,
  'jastrow': JastrowIllusion,
  'ebbinghaus-circles': EbbinghausCirclesIllusion,
  'sander-parallelogram': SanderParallelogramIllusion,
  'poggendorff': PoggendorffIllusion,
  'rubins-vase': RubinsVaseIllusion,
  'chromostereopsis': ChromostereopsisIllusion,
  'seesaw': SeesawIllusion,
  'paris-springtime': ParisSpringtimeIllusion,
  'old-man': OldManIllusion,
  'kanizsa': KanizsaIllusion,

  // SVG-based
  'muller-lyer': MullerLyerIllusion,
  'simultaneous-contrast': SimultaneousContrastIllusion,
  'cafe-wall': CafeWallIllusion,
  'ponzo-railroad': PonzoRailroadIllusion,
  'kanizsa-triangle-svg': KanizsaTriangleSvgIllusion,
  'lilac-chaser': LilacChaserIllusion,
  'paris-springtime-svg': ParisSpringtimeSvgIllusion,
  'poggendorff-svg': PoggendorffSvgIllusion,
  'gradient-bar': GradientBarIllusion,

  // Static/display
  'rotating-snakes': RotatingSnakesIllusion,
  'munker-hearts': MunkerHeartsIllusion,
  'troxler': TroxlerFadingIllusion,
  'hermann-grid': HermannGridIllusion,
  'impossible-trident': ImpossibleTridentIllusion,
  'concave-convex': ConcaveConvexIllusion,
  'cube-shadow': CubeShadowIllusion,
};

/**
 * IllusionDispatcher - Slim component that renders the appropriate illusion
 * based on the illusionType prop.
 *
 * This replaces the original 2,248-line IllusionRenderer.tsx with a clean
 * dispatcher pattern. Each illusion is now in its own file under:
 * - components/illusions/image/
 * - components/illusions/svg/
 * - components/illusions/static/
 */
export default function IllusionDispatcher(props: IllusionProps) {
  const { illusionType } = props;

  const IllusionComponent = ILLUSION_MAP[illusionType];

  if (!IllusionComponent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a8d5e5',
        fontFamily: 'Outfit, sans-serif',
      }}>
        Unknown illusion type: {illusionType}
      </div>
    );
  }

  return <IllusionComponent {...props} />;
}
