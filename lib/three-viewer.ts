import * as THREE from 'three';

/**
 * Safe lifecycle helpers for the photogrammetry viewers.
 *
 * `new THREE.WebGLRenderer()` throws when the browser cannot give it a WebGL
 * context: WebGL switched off (iOS Lockdown Mode, some school-managed
 * devices, a blocklisted GPU), too many live contexts, or a GPU process that
 * has crashed. The viewers called it bare inside a useEffect, so the throw
 * reached the route's error page. Everything here returns null or swallows
 * instead, and the viewer shows a still photograph of the object.
 */

export function createRenderer(params: THREE.WebGLRendererParameters = {}): THREE.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer(params);
  } catch (err) {
    console.warn('3D viewer: WebGL is not available, showing a still image instead.', err);
    return null;
  }
}

/**
 * Run `frame` on every animation frame until the returned stop function is
 * called. A frame that throws (a lost context, say) stops the loop and calls
 * `onError`, rather than throwing again sixty times a second.
 */
export function startRenderLoop(frame: () => void, onError?: (err: unknown) => void): () => void {
  let id = 0;
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    try {
      frame();
    } catch (err) {
      stopped = true;
      onError?.(err);
      return;
    }
    id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => {
    stopped = true;
    cancelAnimationFrame(id);
  };
}

/**
 * Free the renderer and its WebGL context now, rather than whenever the
 * garbage collector gets to it. Browsers cap live contexts per page (Safari
 * at a handful on older iPads), so a context left behind on every visit to
 * a model eventually makes the next `new WebGLRenderer()` fail.
 */
export function disposeRenderer(renderer: THREE.WebGLRenderer): void {
  try {
    renderer.dispose();
    renderer.forceContextLoss?.();
  } catch {
    // Already gone.
  }
  renderer.domElement?.remove?.();
}
