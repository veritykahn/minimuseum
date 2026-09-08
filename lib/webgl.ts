/**
 * WebGL availability detection.
 *
 * Browsers can refuse to create a WebGL context for reasons that have nothing
 * to do with our code: hardware acceleration turned off, a blocklisted GPU
 * driver, or too many live contexts already open in the tab. Constructing a
 * THREE.WebGLRenderer in that state throws, so the 3D viewers probe first and
 * show an explanation instead of crashing to the error boundary.
 */

export type WebGLStatus = 'available' | 'unavailable';

export function getWebGLStatus(): WebGLStatus {
  if (typeof window === 'undefined') return 'unavailable';

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) return 'unavailable';

    // Release the probe context immediately so it doesn't count against the
    // browser's per-tab context limit.
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();

    return 'available';
  } catch {
    return 'unavailable';
  }
}

/** Message shown when the browser cannot give us a WebGL context. */
export const WEBGL_UNAVAILABLE_MESSAGE =
  '3D viewing is unavailable in this browser. Turn on hardware acceleration in your browser settings, then reload this page.';
