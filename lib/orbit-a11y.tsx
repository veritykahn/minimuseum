'use client';

import { useCallback, useEffect, useState, type KeyboardEvent, type RefObject } from 'react';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useReducedMotion } from './a11y';

type OrbitScene = { camera: THREE.PerspectiveCamera; controls: OrbitControls } | null;

const ROTATE_STEP = Math.PI / 12; // 15 degrees
const ZOOM_STEP = 1.2;

/**
 * Keyboard and single-pointer alternatives to dragging a three.js model:
 * rotate, tilt, zoom and reset by key or button, plus an auto-rotate toggle
 * that starts off when the visitor prefers reduced motion.
 *
 * Keys (with the model focused): arrows rotate and tilt, + and − zoom,
 * 0 or Home resets the view, R pauses or resumes the slow turn.
 */
export function useOrbitA11y(
  sceneRef: RefObject<OrbitScene>,
  containerRef: RefObject<HTMLElement | null>,
  homePosition: [number, number, number] = [0, 0.5, 4]
) {
  // Reduced motion: no turning until the visitor asks for it. Otherwise
  // the model turns until the visitor stops it (button, R key or a drag).
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const autoRotate = choice ?? !reduced;
  const setAutoRotate = useCallback((on: boolean) => setChoice(on), []);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.controls.autoRotate = autoRotate;
  });

  // Keep the button in step when a drag stops the turn.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = () => setAutoRotate(false);
    el.addEventListener('mousedown', stop);
    el.addEventListener('touchstart', stop, { passive: true });
    return () => {
      el.removeEventListener('mousedown', stop);
      el.removeEventListener('touchstart', stop);
    };
  }, [containerRef, setAutoRotate]);

  const orbit = useCallback((dTheta: number, dPhi: number) => {
    const s = sceneRef.current;
    if (!s) return;
    const { camera, controls } = s;
    const offset = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(offset);
    sph.theta += dTheta;
    sph.phi = Math.min(Math.max(sph.phi + dPhi, Math.max(0.05, controls.minPolarAngle)), Math.min(Math.PI - 0.05, controls.maxPolarAngle));
    offset.setFromSpherical(sph);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
  }, [sceneRef]);

  const zoom = useCallback((factor: number) => {
    const s = sceneRef.current;
    if (!s) return;
    const { camera, controls } = s;
    const offset = camera.position.clone().sub(controls.target);
    const len = Math.min(Math.max(offset.length() * factor, controls.minDistance), controls.maxDistance);
    offset.setLength(len);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }, [sceneRef]);

  const rotateLeft = useCallback(() => { setAutoRotate(false); orbit(ROTATE_STEP, 0); }, [orbit, setAutoRotate]);
  const rotateRight = useCallback(() => { setAutoRotate(false); orbit(-ROTATE_STEP, 0); }, [orbit, setAutoRotate]);
  const zoomIn = useCallback(() => zoom(1 / ZOOM_STEP), [zoom]);
  const zoomOut = useCallback(() => zoom(ZOOM_STEP), [zoom]);
  const reset = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.camera.position.set(...homePosition);
    s.controls.target.set(0, 0, 0);
    s.controls.update();
  }, [sceneRef, homePosition]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    let handled = true;
    switch (e.key) {
      case 'ArrowLeft': rotateLeft(); break;
      case 'ArrowRight': rotateRight(); break;
      case 'ArrowUp': setAutoRotate(false); orbit(0, -ROTATE_STEP); break;
      case 'ArrowDown': setAutoRotate(false); orbit(0, ROTATE_STEP); break;
      case '+': case '=': zoomIn(); break;
      case '-': case '_': zoomOut(); break;
      case '0': case 'Home': reset(); break;
      case 'r': case 'R': setAutoRotate(!autoRotate); break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  }, [rotateLeft, rotateRight, orbit, zoomIn, zoomOut, reset, setAutoRotate, autoRotate]);

  return { autoRotate, setAutoRotate, rotateLeft, rotateRight, zoomIn, zoomOut, reset, onKeyDown };
}

export type OrbitHint = { icon: string; label: string };

/**
 * The on-screen hints for handling a model, in two versions: one for a mouse
 * or trackpad and one for touch, where there is no scroll wheel or Shift key.
 * Render both and give the lists the classes `orbit-hints-pointer` and
 * `orbit-hints-touch`; globals.css shows whichever suits the device's
 * primary pointer, so the server and client render the same markup.
 */
export const ORBIT_HINTS: { pointer: OrbitHint[]; touch: OrbitHint[] } = {
  pointer: [
    { icon: '\u2194', label: 'Drag to rotate' },
    { icon: '\u2295', label: 'Scroll to zoom' },
    { icon: '\u21E7', label: 'Shift+drag to pan' },
  ],
  touch: [
    { icon: '\u2194', label: 'Drag to rotate' },
    { icon: '\u2295', label: 'Pinch to zoom' },
    { icon: '\u21C4', label: 'Two-finger drag to pan' },
  ],
};

export const ORBIT_KEY_HELP =
  'Use the arrow keys to rotate, plus and minus to zoom, 0 to reset, and R to pause or resume turning.';

type ControlsProps = {
  orbit: ReturnType<typeof useOrbitA11y>;
  label: string;
  className?: string;
};

/** Visible buttons for the same actions: the single-pointer alternative to dragging. */
export function OrbitButtons({ orbit, label, className = '' }: ControlsProps) {
  return (
    <div className={`orbit-btns ${className}`} role="group" aria-label={`${label} view controls`}>
      <button type="button" className="orbit-btn" onClick={orbit.rotateLeft} aria-label="Rotate left" title="Rotate left">
        <span aria-hidden="true">{'↺'}</span>
      </button>
      <button type="button" className="orbit-btn" onClick={orbit.rotateRight} aria-label="Rotate right" title="Rotate right">
        <span aria-hidden="true">{'↻'}</span>
      </button>
      <button type="button" className="orbit-btn" onClick={orbit.zoomIn} aria-label="Zoom in" title="Zoom in">
        <span aria-hidden="true">+</span>
      </button>
      <button type="button" className="orbit-btn" onClick={orbit.zoomOut} aria-label="Zoom out" title="Zoom out">
        <span aria-hidden="true">{'−'}</span>
      </button>
      <button type="button" className="orbit-btn" onClick={orbit.reset} aria-label="Reset view" title="Reset view">
        <span aria-hidden="true">{'⌂'}</span>
      </button>
      <button
        type="button"
        className="orbit-btn"
        onClick={() => orbit.setAutoRotate(!orbit.autoRotate)}
        aria-label="Turn slowly"
        aria-pressed={orbit.autoRotate}
        title={orbit.autoRotate ? 'Pause turning' : 'Turn slowly'}
      >
        <span aria-hidden="true">{orbit.autoRotate ? '❚❚' : '▶'}</span>
      </button>
      <style jsx>{`
        .orbit-btns {
          position: fixed;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 20;
        }
        .orbit-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--orbit-accent, #a8d5e5) 35%, transparent);
          background: rgba(10, 10, 10, 0.6);
          color: var(--orbit-accent, #a8d5e5);
          font-size: 15px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .orbit-btn:hover {
          border-color: var(--orbit-accent, #a8d5e5);
          background: color-mix(in srgb, var(--orbit-accent, #a8d5e5) 12%, transparent);
        }
        .orbit-btn[aria-pressed='true'] {
          border-color: var(--orbit-accent, #a8d5e5);
        }
        .orbit-btn span { font-size: inherit; }
        @media (max-width: 768px) {
          .orbit-btns { right: 12px; gap: 6px; }
        }
      `}</style>
    </div>
  );
}
