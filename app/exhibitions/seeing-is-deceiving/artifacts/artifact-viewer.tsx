'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ArtifactData = {
  title: string;
  date: string;
  subtitle: string;
  model: string;
  available: boolean;
  description: string[];
};

type Props = {
  artifactId: 'victorian-cards' | 'stereoscope';
};

const artifactsData: Record<string, ArtifactData> = {
  'victorian-cards': {
    title: 'Victorian Optical Illusion Puzzle Cards',
    date: 'c.1890-1900',
    subtitle: 'Parlor Magic: When Reality Transforms',
    model: '/exhibitions/seeing/victorian-cards.glb',
    available: true,
    description: [
      `Before television, before radio, before electric lights, Victorian families gathered for parlor entertainment. These optical illusion cards—called "transformation" or "metamorphic" cards—were popular amusements that challenged perception and sparked conversation.`,
      `Slide the card one direction and see one image. Slide it back and watch reality transform into something completely different. The picture doesn't change—what changes is which patterns your brain emphasizes, which lines it groups together, what story it decides to construct from the shapes.`,
      `These cards were considered harmless fun, proof that your eyes could be easily tricked. But they also demonstrated something more significant: human brains are pattern-finding machines, constantly interpreting ambiguous information, filling in gaps, making assumptions. Sometimes those assumptions are correct. Sometimes they create illusions that feel absolutely real.`,
      `The Victorians who marveled at these cards understood they were being fooled—that was part of the entertainment. The question for us, 130 years later: Do we recognize when modern images and videos are fooling us? Or do we believe everything that looks real must be real?`
    ]
  },
  'stereoscope': {
    title: 'Monarch Stereoscope & Keystone View Cards',
    date: '1904',
    subtitle: 'Victorian Virtual Reality: The Original 3D Experience',
    model: '/exhibitions/seeing/stereoscope.glb',
    available: false,
    description: [
      `This Monarch Stereoscope, manufactured in 1904 by the Keystone View Company, was the cutting-edge entertainment technology of its time—the Victorian equivalent of today's VR headsets. By presenting each eye with a slightly different photographic image, it tricks your brain into perceiving depth and dimension that doesn't exist on the flat cards.`,
      `The 42 view cards in this collection allowed families to "travel" without leaving home. You could stand at Niagara Falls, explore the Grand Canyon, walk through Parisian streets, or witness historical events—all through the magic of binocular vision.`,
      `But stereoscopes weren't just entertainment. They were also tools of education, propaganda, and occasionally deception. Publishers could stage scenes, manipulate images, or present entirely fabricated "views" as authentic documentation. The device that brought the world into your parlor could also bring you a world that never existed.`,
      `The principle behind this 120-year-old device is exactly the same technology that powers modern VR: show each eye a different image, and let the brain create depth. The more things change, the more your brain stays the same.`
    ]
  }
};

export default function ArtifactViewer({ artifactId }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    model: THREE.Group | null;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showDisplayCard, setShowDisplayCard] = useState(false);

  const artifact = artifactsData[artifactId];

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xa8d5e5, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Subtle rim light from below
    const rimLight = new THREE.PointLight(0xa8d5e5, 0.2);
    rimLight.position.set(0, -3, 2);
    scene.add(rimLight);

    // Store refs
    sceneRef.current = { scene, camera, renderer, controls, model: null };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Load model
  useEffect(() => {
    if (!sceneRef.current || !artifact) return;

    const { scene, camera, controls } = sceneRef.current;

    if (!artifact.available) {
      setIsLoading(false);
      setLoadError('3D model coming soon');
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    const loader = new GLTFLoader();
    loader.load(
      artifact.model,
      (gltf) => {
        const model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);
        sceneRef.current!.model = model;

        camera.position.set(0, 0.5, 4);
        controls.target.set(0, 0, 0);
        controls.update();

        setIsLoading(false);
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
        setLoadError('Failed to load 3D model');
      }
    );
  }, [artifact]);

  // Stop auto-rotate on user interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sceneRef.current) return;

    const stopAutoRotate = () => {
      if (sceneRef.current) {
        sceneRef.current.controls.autoRotate = false;
      }
    };

    container.addEventListener('mousedown', stopAutoRotate);
    container.addEventListener('touchstart', stopAutoRotate);

    return () => {
      container.removeEventListener('mousedown', stopAutoRotate);
      container.removeEventListener('touchstart', stopAutoRotate);
    };
  }, []);

  if (!artifact) {
    return <div>Artifact not found</div>;
  }

  return (
    <div className="artifact-viewer">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .artifact-viewer {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Header */
        .viewer-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #a8d5e5;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .back-btn:hover { color: #fff; }
        .back-btn span { font-size: 18px; }

        .header-center {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #525252;
        }

        /* Main content */
        .viewer-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-top: 80px;
        }

        /* 3D viewport */
        .model-viewport {
          flex: 1;
          position: relative;
          min-height: 50vh;
        }

        .model-viewport canvas {
          cursor: grab;
        }
        .model-viewport canvas:active {
          cursor: grabbing;
        }

        /* Loading overlay */
        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(10, 10, 10, 0.9);
          z-index: 10;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(168, 213, 229, 0.2);
          border-top-color: #a8d5e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #737373;
        }

        /* Error state */
        .error-state {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .error-icon {
          font-size: 48px;
          color: #525252;
        }

        .error-text {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #737373;
        }

        /* Bottom info bar */
        .info-bar {
          padding: 24px 32px 32px;
          background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.95) 50%, rgba(10,10,10,0) 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .artifact-info {
          flex: 1;
        }

        .artifact-date {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #525252;
          margin-bottom: 6px;
        }

        .artifact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 4vw, 1.6rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 4px;
        }

        .artifact-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-style: italic;
          color: #a8d5e5;
        }

        /* Display card button - BIGGER */
        .display-card-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 28px;
          background: transparent;
          border: 1px solid rgba(168, 213, 229, 0.4);
          border-radius: 8px;
          color: #a8d5e5;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .display-card-btn:hover {
          background: rgba(168, 213, 229, 0.1);
          border-color: #a8d5e5;
        }

        .display-card-btn .icon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 500;
        }

        /* Controls hint */
        .controls-hint {
          position: absolute;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 24px;
          padding: 12px 20px;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #525252;
          backdrop-filter: blur(8px);
        }

        .control-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ==========================================
           MUSEUM DISPLAY CARD
           ========================================== */
        .display-card-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }

        .display-card-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .display-card-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
        }

        /* The actual museum card */
        .museum-card {
          position: relative;
          max-width: 560px;
          width: 100%;
          background: linear-gradient(145deg, #f5f3ef 0%, #ebe8e2 100%);
          border-radius: 4px;
          padding: 48px 44px;
          box-shadow:
            0 25px 80px rgba(0,0,0,0.5),
            0 10px 30px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transform: translateY(30px) scale(0.95);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .display-card-overlay.open .museum-card {
          transform: translateY(0) scale(1);
        }

        /* Card texture overlay */
        .museum-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23paper)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          border-radius: 4px;
        }

        /* Close button */
        .card-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #8a8680;
          font-size: 24px;
          cursor: pointer;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-close:hover {
          color: #2a2a2a;
        }

        /* Museum label styling */
        .card-museum-label {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #a09a92;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: #2a2a2a;
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .card-date {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #8a8680;
          margin-bottom: 16px;
        }

        .card-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #5a5550;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .card-description {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 45vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .card-description::-webkit-scrollbar {
          width: 4px;
        }

        .card-description::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 2px;
        }

        .card-description::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.15);
          border-radius: 2px;
        }

        .card-description p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.75;
          color: #3a3835;
          text-align: justify;
        }

        .card-description p:first-of-type::first-letter {
          font-size: 2.2em;
          float: left;
          line-height: 1;
          margin-right: 8px;
          margin-top: 4px;
          color: #2a2a2a;
        }

        /* Card footer */
        .card-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-collection {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a09a92;
        }

        .card-id {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #c5c0b8;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .viewer-header { padding: 16px 20px; }
          .header-center { display: none; }
          .info-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 20px 24px 28px;
          }
          .display-card-btn {
            justify-content: center;
          }
          .controls-hint {
            bottom: 180px;
            gap: 16px;
            font-size: 9px;
          }
          .display-card-overlay {
            padding: 20px;
          }
          .museum-card {
            padding: 32px 28px;
          }
          .card-title { font-size: 1.4rem; }
          .card-description { max-height: 50vh; }
        }
      `}</style>

      {/* Header */}
      <header className="viewer-header">
        <button className="back-btn" onClick={() => router.push('/exhibitions/seeing-is-deceiving/artifacts')}>
          <span>←</span>
          Collection
        </button>
        <span className="header-center">Artifact Viewer</span>
        <div style={{ width: 100 }}></div>
      </header>

      {/* Main content */}
      <main className="viewer-content">
        {/* 3D viewport */}
        <div className="model-viewport" ref={containerRef}>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading artifact...</span>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="error-state">
              <div className="error-icon">◇</div>
              <div className="error-text">{loadError}</div>
            </div>
          )}

          {/* Controls hint */}
          {!isLoading && !loadError && (
            <div className="controls-hint">
              <span className="control-item">Drag to rotate</span>
              <span className="control-item">Scroll to zoom</span>
              <span className="control-item">Shift+drag to pan</span>
            </div>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="info-bar">
          <div className="artifact-info">
            <p className="artifact-date">{artifact.date}</p>
            <h1 className="artifact-title">{artifact.title}</h1>
            <p className="artifact-subtitle">{artifact.subtitle}</p>
          </div>

          <button className="display-card-btn" onClick={() => setShowDisplayCard(true)}>
            <span className="icon">i</span>
            Display Card
          </button>
        </div>
      </main>

      {/* Museum Display Card Overlay */}
      <div
        className={`display-card-overlay ${showDisplayCard ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowDisplayCard(false);
        }}
      >
        <div className="display-card-backdrop" onClick={() => setShowDisplayCard(false)} />

        <div className="museum-card">
          <button className="card-close" onClick={() => setShowDisplayCard(false)}>×</button>

          <p className="card-museum-label">Mini Museum · Seeing is Deceiving</p>

          <h2 className="card-title">{artifact.title}</h2>
          <p className="card-date">{artifact.date}</p>
          <p className="card-subtitle">{artifact.subtitle}</p>

          <div className="card-description">
            {artifact.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="card-footer">
            <span className="card-collection">Holy Family Library Collection</span>
            <span className="card-id">HFL.2024.{artifactId === 'victorian-cards' ? '042' : '041'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
