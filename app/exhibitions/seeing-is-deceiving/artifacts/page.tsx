'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ArtifactViewer() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    model: THREE.Group | null;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'stereoscope' | 'cards'>('cards');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Artifact data
  const artifacts = {
    stereoscope: {
      title: 'Monarch Stereoscope & Keystone View Cards',
      date: '1904',
      subtitle: 'Victorian Virtual Reality: The Original 3D Experience',
      model: '/exhibitions/seeing/stereoscope.glb',
      available: false, // Mark as not available yet
      description: [
        `This Monarch Stereoscope, manufactured in 1904 by the Keystone View Company, was the cutting-edge entertainment technology of its time—the Victorian equivalent of today's VR headsets. By presenting each eye with a slightly different photographic image, it tricks your brain into perceiving depth and dimension that doesn't exist on the flat cards.`,
        `The 42 view cards in this collection allowed families to "travel" without leaving home. You could stand at Niagara Falls, explore the Grand Canyon, walk through Parisian streets, or witness historical events—all through the magic of binocular vision.`,
        `But stereoscopes weren't just entertainment. They were also tools of education, propaganda, and occasionally deception. Publishers could stage scenes, manipulate images, or present entirely fabricated "views" as authentic documentation. The device that brought the world into your parlor could also bring you a world that never existed.`,
        `The principle behind this 120-year-old device is exactly the same technology that powers modern VR: show each eye a different image, and let the brain create depth. The more things change, the more your brain stays the same.`
      ]
    },
    cards: {
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
    }
  };

  const currentArtifact = artifacts[activeTab];

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xa8d5e5, 0.5);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

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

  // Load model when tab changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const { scene, camera, controls } = sceneRef.current;

    // Remove existing model
    if (sceneRef.current.model) {
      scene.remove(sceneRef.current.model);
      sceneRef.current.model = null;
    }

    // Check if model is available
    if (!currentArtifact.available) {
      setIsLoading(false);
      setLoadError('3D model coming soon');
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    // Load new model
    const loader = new GLTFLoader();
    loader.load(
      currentArtifact.model,
      (gltf) => {
        const model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);

        // Center the model
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);
        sceneRef.current!.model = model;

        // Reset camera position
        camera.position.set(0, 0, 5);
        controls.reset();

        setIsLoading(false);
      },
      (progress) => {
        // Loading progress
        console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
        setLoadError('Failed to load 3D model');
      }
    );
  }, [activeTab, currentArtifact.model, currentArtifact.available]);

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
        }

        /* Header */
        .artifact-header {
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
        .back-btn:hover {
          color: #fff;
        }
        .back-btn span {
          font-size: 18px;
        }

        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #737373;
        }

        .info-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(168, 213, 229, 0.3);
          background: transparent;
          color: #a8d5e5;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-style: italic;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .info-btn:hover {
          background: rgba(168, 213, 229, 0.1);
          border-color: #a8d5e5;
        }
        .info-btn.active {
          background: #a8d5e5;
          color: #0a0a0a;
        }

        /* Main content area */
        .artifact-content {
          flex: 1;
          display: flex;
          padding-top: 80px;
        }

        /* 3D Viewer */
        .viewer-section {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
        }

        .model-container {
          width: 100%;
          height: 55vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-container canvas {
          cursor: grab;
        }
        .model-container canvas:active {
          cursor: grabbing;
        }

        /* Loading state */
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(10, 10, 10, 0.8);
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

        /* Error/placeholder state */
        .model-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px;
          border: 2px dashed rgba(168, 213, 229, 0.3);
          border-radius: 16px;
          z-index: 5;
        }
        .placeholder-icon {
          font-size: 48px;
          color: #525252;
        }
        .placeholder-text {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #737373;
          text-align: center;
        }

        /* Controls hint */
        .controls-hint {
          display: flex;
          gap: 32px;
          padding: 16px 0;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #525252;
        }
        .control-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .control-icon {
          width: 24px;
          height: 24px;
          border: 1px solid #525252;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        /* Artifact label */
        .artifact-label {
          text-align: center;
          padding: 24px 32px;
        }
        .artifact-date {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 8px;
        }
        .artifact-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 8px;
        }
        .artifact-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-style: italic;
          color: #a8d5e5;
        }

        /* Artifact tabs */
        .artifact-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px 32px;
        }
        .tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          color: #737373;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab-btn:hover {
          border-color: rgba(168, 213, 229, 0.3);
          color: #a8d5e5;
        }
        .tab-btn.active {
          background: rgba(168, 213, 229, 0.1);
          border-color: #a8d5e5;
          color: #a8d5e5;
        }
        .tab-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Info panel */
        .info-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 450px;
          max-width: 90vw;
          height: 100vh;
          background: linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.98) 100%);
          border-left: 1px solid rgba(255,255,255,0.08);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
          overflow-y: auto;
        }
        .info-panel.open {
          transform: translateX(0);
        }

        .info-panel-content {
          padding: 100px 40px 60px;
        }

        .info-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          background: transparent;
          color: #fafafa;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .info-close:hover {
          background: rgba(255,255,255,0.1);
        }

        .info-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8d5e5;
          margin-bottom: 8px;
        }

        .info-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .info-date {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 24px;
        }

        .info-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: #a8d5e5;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .info-description {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-description p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #d0d0d0;
        }

        .info-description p:first-letter {
          font-size: 1.3em;
          color: #a8d5e5;
        }

        /* Backdrop for mobile */
        .info-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 150;
        }
        .info-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .artifact-header {
            padding: 16px 20px;
          }
          .header-title {
            display: none;
          }
          .model-container {
            height: 45vh;
          }
          .controls-hint {
            gap: 16px;
            font-size: 9px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .info-panel {
            width: 100%;
          }
          .info-panel-content {
            padding: 80px 24px 40px;
          }
          .artifact-tabs {
            flex-wrap: wrap;
          }
          .tab-btn {
            padding: 10px 16px;
            font-size: 10px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="artifact-header">
        <button className="back-btn" onClick={() => router.back()}>
          <span>←</span>
          Back to Exhibition
        </button>
        <span className="header-title">Artifact Collection</span>
        <button
          className={`info-btn ${showInfo ? 'active' : ''}`}
          onClick={() => setShowInfo(!showInfo)}
        >
          i
        </button>
      </header>

      {/* Main content */}
      <main className="artifact-content">
        <div className="viewer-section">
          {/* 3D Model Container */}
          <div className="model-container" ref={containerRef}>
            {/* Loading overlay */}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading artifact...</span>
              </div>
            )}

            {/* Error/placeholder state */}
            {!isLoading && loadError && (
              <div className="model-placeholder">
                <div className="placeholder-icon">◇</div>
                <div className="placeholder-text">{loadError}</div>
              </div>
            )}
          </div>

          {/* Controls hint */}
          <div className="controls-hint">
            <div className="control-item">
              <div className="control-icon">↔</div>
              <span>Drag to rotate</span>
            </div>
            <div className="control-item">
              <div className="control-icon">⊕</div>
              <span>Scroll to zoom</span>
            </div>
            <div className="control-item">
              <div className="control-icon">⇧</div>
              <span>Shift+drag to pan</span>
            </div>
          </div>

          {/* Artifact label */}
          <div className="artifact-label">
            <p className="artifact-date">{currentArtifact.date}</p>
            <h1 className="artifact-name">{currentArtifact.title}</h1>
            <p className="artifact-subtitle">{currentArtifact.subtitle}</p>
          </div>

          {/* Artifact tabs */}
          <div className="artifact-tabs">
            <button
              className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveTab('cards')}
            >
              Victorian Illusion Cards
            </button>
            <button
              className={`tab-btn ${activeTab === 'stereoscope' ? 'active' : ''}`}
              onClick={() => setActiveTab('stereoscope')}
            >
              Monarch Stereoscope
            </button>
          </div>
        </div>
      </main>

      {/* Info panel backdrop */}
      <div
        className={`info-backdrop ${showInfo ? 'open' : ''}`}
        onClick={() => setShowInfo(false)}
      />

      {/* Info panel */}
      <aside className={`info-panel ${showInfo ? 'open' : ''}`}>
        <button className="info-close" onClick={() => setShowInfo(false)}>×</button>
        <div className="info-panel-content">
          <p className="info-label">Display Card</p>
          <h2 className="info-title">{currentArtifact.title}</h2>
          <p className="info-date">{currentArtifact.date}</p>
          <p className="info-subtitle">{currentArtifact.subtitle}</p>
          <div className="info-description">
            {currentArtifact.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
