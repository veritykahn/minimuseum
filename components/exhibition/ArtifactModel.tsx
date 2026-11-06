'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { srOnly } from '@/lib/a11y';
import { useOrbitA11y, OrbitButtons, ORBIT_KEY_HELP, ORBIT_HINTS } from '@/lib/orbit-a11y';
import { createRenderer, startRenderLoop, disposeRenderer } from '@/lib/three-viewer';

/*
 * An artifact's photogrammetry model on its page in a poster exhibition's
 * display case (ArtifactPage), from the owner's scan dropped in beside its
 * photograph (casePhotoPaths.ts): public/exhibitions/<slug>/case/<id>.glb,
 * Draco-compressed as the original exhibitions' scans are. It turns slowly
 * (not under reduced motion), and can be dragged, zoomed, and handled from
 * the keyboard or the buttons beside it (orbit-a11y). Where it cannot be
 * shown in 3D (no WebGL, the context lost, the scan not loading), the
 * photograph of the object stands in, or nothing but the words if there is
 * none. three.js is loaded with this, only on a page with a model.
 */

let draco: DRACOLoader | null = null;
function dracoLoader() {
  if (!draco) {
    draco = new DRACOLoader();
    draco.setDecoderPath('/draco/gltf/');
  }
  return draco;
}

const HOME: [number, number, number] = [0, 0.5, 4];

type Scene = { camera: THREE.PerspectiveCamera; controls: OrbitControls } | null;

export default function ArtifactModel({ src, name, photo }: { src: string; name: string; photo?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(...HOME);

    const renderer = createRenderer({ antialias: true, alpha: true });
    if (!renderer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL refused: the photograph stands in
      setFailed(true);
      setLoading(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = true;
    controls.autoRotateSpeed = 0.5;

    // The original viewers' lighting, so a scan looks the same in every exhibition.
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(5, 5, 5);
    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(-5, 3, -5);
    const top = new THREE.PointLight(0xffffff, 1.2);
    top.position.set(0, 5, 0);
    const front = new THREE.PointLight(0xffffff, 1.0);
    front.position.set(0, 0, 5);
    const bottom = new THREE.PointLight(0xffffff, 0.6);
    bottom.position.set(0, -3, 2);
    const back = new THREE.DirectionalLight(0xffffff, 0.8);
    back.position.set(0, 2, -5);
    scene.add(key, fill, top, front, bottom, back);

    sceneRef.current = { camera, controls };

    let cancelled = false;
    const fail = (err?: unknown) => {
      if (err) console.warn('3D model stopped:', err);
      if (cancelled) return;
      setFailed(true);
      setLoading(false);
    };
    const stopLoop = startRenderLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    }, fail);
    const onContextLost = () => fail();
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // The scan fills the stage's height when it is wide, and its width when it is narrow (a phone).
    let placed: { model: THREE.Object3D; center: THREE.Vector3; scale: number } | null = null;
    const fit = () => {
      if (!placed) return;
      const k = Math.min(1, camera.aspect * 1.1);
      placed.model.scale.setScalar(placed.scale * k);
      placed.model.position.copy(placed.center).multiplyScalar(-placed.scale * k);
    };
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      fit();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader());
    loader.load(
      src,
      (gltf) => {
        if (cancelled) return;
        try {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model, true);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          placed = { model, center, scale: 2.5 / Math.max(size.x, size.y, size.z) };
          fit();
          scene.add(model);
          controls.target.set(0, 0, 0);
          controls.update();
          setLoading(false);
        } catch (err) {
          fail(err);
        }
      },
      undefined,
      (err) => fail(err),
    );

    return () => {
      cancelled = true;
      stopLoop();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      observer.disconnect();
      controls.dispose();
      disposeRenderer(renderer);
      sceneRef.current = null;
    };
  }, [src]);

  const orbit = useOrbitA11y(sceneRef, containerRef, HOME);

  return (
    <div className="pe-artifact-model">
      <div
        ref={containerRef}
        className="pe-artifact-model-view"
        {...(!failed
          ? { tabIndex: 0, role: 'img', 'aria-label': `${name}. Interactive 3D model.`, 'aria-describedby': 'pe-artifact-orbit-help', onKeyDown: orbit.onKeyDown }
          : {})}
      >
        {loading && !failed && <p className="pe-artifact-soon pe-artifact-model-loading">Loading the 3D model…</p>}
        {failed && photo && (
          <figure className="pe-artifact-stage-photo pe-artifact-model-still">
            {/* eslint-disable-next-line @next/next/no-img-element -- the photograph stands in for the model */}
            <img src={photo} alt={name} />
            <figcaption className="pe-artifact-soon">A still of the object. The 3D view could not start on this device.</figcaption>
          </figure>
        )}
      </div>
      {!failed && (
        <>
          <span id="pe-artifact-orbit-help" style={srOnly}>
            {ORBIT_KEY_HELP}
          </span>
          <OrbitButtons orbit={orbit} label={name} className="pe-artifact-orbit" />
          <div className="pe-artifact-model-hints" aria-hidden="true">
            {(['pointer', 'touch'] as const).map((kind) => (
              <ul key={kind} className={`orbit-hints-${kind}`}>
                {ORBIT_HINTS[kind].map((h) => (
                  <li key={h.label}>
                    <span>{h.icon}</span> {h.label}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
