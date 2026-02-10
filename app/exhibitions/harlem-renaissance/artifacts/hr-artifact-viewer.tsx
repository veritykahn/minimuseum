'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const AUDIO_BASE = '/exhibitions/harlem/artifacts/audio/';

type HrArtifactData = {
  title: string;
  date: string;
  subtitle: string;
  model: string;
  description: string[];
  accession: string;
  collection: string;
  audio?: {
    sideA: { file: string; title: string };
    sideB: { file: string; title: string };
  };
  portrait?: { src: string; caption: string };
};

type Props = {
  artifactId: 'phonograph' | 'fire-in-the-flint';
};

const artifactsData: Record<string, HrArtifactData> = {
  'phonograph': {
    title: 'Electric Phonograph & Bessie Smith 78',
    date: 'c. 1924\u20131930s',
    subtitle: 'The Empress of the Blues \u2014 Now Playing',
    model: '/exhibitions/harlem/artifacts/phonograph.glb',
    description: [
      'This 1930s electric phonograph sits exactly as it would have in a Harlem apartment or a Chicago barbershop \u2014 with a record on the turntable, ready to play. The record is an original Columbia 78 RPM pressing by Bessie Smith, the highest-paid Black entertainer in America during the 1920s.',
      'Side A: \u201CWoman\u2019s Trouble Blues.\u201D Side B: \u201CLove Me Daddy Blues.\u201D Each side runs about three minutes \u2014 that was all a 78 RPM disc could hold. Three minutes to tell a story. Three minutes to make you feel something you didn\u2019t have words for. Smith didn\u2019t need more time than that.',
      'Bessie Smith was born in poverty in Chattanooga, Tennessee. She died in a car accident in Mississippi in 1937. In between, she became the most commanding vocalist in American popular music. Her voice could fill a theater without a microphone. Columbia Records signed her in 1923, and her first recording sold 780,000 copies in six months.',
      'Smith\u2019s recordings reached audiences through what the industry called \u201Crace records\u201D \u2014 a separate catalog marketed to Black listeners. The term was the industry\u2019s, not the community\u2019s. But the catalog itself proved something the music business hadn\u2019t believed: Black artists had a massive, loyal, paying audience that had been completely ignored.',
      'The phonograph was the technology that made this possible. A performance that happened once in a recording studio could be heard a thousand times in a thousand different rooms. Music that had been local \u2014 tied to a specific club, a specific city, a specific night \u2014 became portable. And the culture changed.',
    ],
    accession: 'HFL.2025.HR.004\u2013005',
    collection: 'Holy Family Library Collection',
    audio: {
      sideA: { file: 'womans-trouble-blues.mp3', title: 'Woman\u2019s Trouble Blues' },
      sideB: { file: 'love-me-daddy-blues.mp3', title: 'Love Me Daddy Blues' },
    },
  },
  'fire-in-the-flint': {
    title: 'The Fire in the Flint',
    date: '1924',
    subtitle: 'Walter F. White \u2014 First Edition, Third Printing',
    model: '/exhibitions/harlem/artifacts/flint.glb',
    description: [
      'He had blond hair, blue eyes, and fair skin. He was also one of the most important Black leaders of the twentieth century. Walter Francis White could have lived his entire life as a white man. Instead, he chose to become the NAACP\u2019s most dangerous weapon.',
      'White grew up in Atlanta, where the 1906 race riots defined his childhood. He watched a white mob set fire to Black homes while his family crouched in the dark. He was twelve. He decided that night who he was \u2014 and who he would fight for.',
      'His light skin became his greatest investigative tool. White traveled across the Deep South posing as a white reporter, infiltrating lynch mobs and Klan rallies. Men who had murdered Black citizens bragged to him openly, never suspecting the well-dressed stranger was Black. He brought their confessions back to New York and published them in The Crisis and in national newspapers.',
      'This novel, published by Alfred A. Knopf in 1924, drew directly from those investigations. The Fire in the Flint tells the story of Kenneth Harper, a Black physician who returns to his small Georgia hometown after studying medicine in the North, only to confront racial violence he cannot escape. The novel was banned in several Southern states \u2014 which only increased its readership.',
      'White went on to lead the NAACP for twenty-four years, advising five presidents and helping architect the legal strategy that would eventually overturn segregation in Brown v. Board of Education. He died in 1955, just months before the movement he had spent his life building began to reshape America.',
      'This first edition sits in your school library\u2019s collection as proof of a simple truth: a single person, armed with courage and a pen, can change history.',
    ],
    accession: 'HFL.2025.HR.001',
    collection: 'Holy Family Library Collection',
    portrait: {
      src: '/exhibitions/harlem/artifacts/white.jpeg',
      caption: 'Walter Francis White, c.\u20091920s. White\u2019s fair complexion allowed him to pass as white during undercover investigations of lynchings across the South.',
    },
  },
};

export default function HrArtifactViewer({ artifactId }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    model: THREE.Group | null;
  } | null>(null);

  const artifact = artifactsData[artifactId];

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingSide, setPlayingSide] = useState<'A' | 'B' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlayingSide(null);
  }, []);

  const playSide = useCallback((side: 'A' | 'B') => {
    if (!artifact.audio) return;
    const track = side === 'A' ? artifact.audio.sideA : artifact.audio.sideB;

    // If already playing this side, toggle pause/play
    if (playingSide === side && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // Switch sides
    stopAudio();
    const audio = new Audio(AUDIO_BASE + track.file);
    audio.volume = 0.8;
    audio.play().catch(() => {});
    audio.onended = () => { setIsPlaying(false); setPlayingSide(null); audioRef.current = null; };
    audioRef.current = audio;
    setPlayingSide(side);
    setIsPlaying(true);
  }, [artifact.audio, playingSide, isPlaying, stopAudio]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Environment map for PBR metallic materials (phonograph horn, etc.)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(5, 5, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(-5, 3, -5);
    scene.add(fill);

    const top = new THREE.PointLight(0xffffff, 1.2);
    top.position.set(0, 5, 0);
    scene.add(top);

    const front = new THREE.PointLight(0xffffff, 1.0);
    front.position.set(0, 0, 5);
    scene.add(front);

    const bottom = new THREE.PointLight(0xffffff, 0.6);
    bottom.position.set(0, -3, 2);
    scene.add(bottom);

    const back = new THREE.DirectionalLight(0xffffff, 0.8);
    back.position.set(0, 2, -5);
    scene.add(back);

    // Warm gold accent instead of blue
    const accent = new THREE.PointLight(0xc9a94e, 0.4);
    accent.position.set(-3, 2, 3);
    scene.add(accent);

    sceneRef.current = { scene, camera, renderer, controls, model: null };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

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

    setIsLoading(true);
    setLoadError(null);

    const loader = new GLTFLoader();
    loader.load(
      artifact.model,
      (gltf) => {
        const model = gltf.scene;
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
      undefined,
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

    const stop = () => { if (sceneRef.current) sceneRef.current.controls.autoRotate = false; };
    container.addEventListener('mousedown', stop);
    container.addEventListener('touchstart', stop);
    return () => {
      container.removeEventListener('mousedown', stop);
      container.removeEventListener('touchstart', stop);
    };
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!artifact) return <div>Artifact not found</div>;

  const currentTrack = playingSide
    ? (playingSide === 'A' ? artifact.audio?.sideA : artifact.audio?.sideB)
    : null;

  return (
    <div className="hr-av">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --hra-gold: #C9A94E;
          --hra-gold-light: #E8D48B;
          --hra-gold-dim: #8B7535;
          --hra-bg: #0A0A0A;
          --hra-text: #E8E0D0;
          --hra-text-dim: #8A8070;
        }

        .hr-av {
          min-height: 100vh;
          background: var(--hra-bg);
          color: var(--hra-text);
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .hra-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 32px;
          background: linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%);
        }
        .hra-back {
          display: flex; align-items: center; gap: 10px;
          background: none; border: none; cursor: pointer;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .hra-back:hover .hra-back-label { opacity: 1; max-width: 150px; }
        .hra-back:hover .hra-back-arrow { transform: translateX(-4px); }
        .hra-back-text { font-size: 28px; font-weight: 300; color: #525252; }
        .hra-back-arrow { font-size: 16px; color: var(--hra-gold-dim); transition: all 0.3s ease; }
        .hra-back-label {
          font-size: 13px; font-style: italic; color: var(--hra-gold-dim);
          opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }
        .hra-info-btn {
          width: 50px; height: 50px; border-radius: 50%;
          border: 1px solid rgba(201,169,78,0.3); background: transparent;
          color: var(--hra-gold); font-family: 'Playfair Display', serif;
          font-size: 26px; font-style: italic; cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .hra-info-btn:hover { background: rgba(201,169,78,0.1); border-color: var(--hra-gold); }
        .hra-info-btn.active { background: var(--hra-gold); color: var(--hra-bg); }

        /* Content */
        .hra-content { flex: 1; display: flex; flex-direction: column; padding-top: 80px; }

        /* 3D container */
        .hra-model { flex: 1; width: 100%; position: relative; min-height: 50vh; }
        .hra-model canvas { cursor: grab; }
        .hra-model canvas:active { cursor: grabbing; }

        /* Loading */
        .hra-loading {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          background: rgba(10,10,10,0.8); z-index: 10;
        }
        .hra-spinner {
          width: 40px; height: 40px;
          border: 2px solid rgba(201,169,78,0.2);
          border-top-color: var(--hra-gold);
          border-radius: 50%; animation: hra-spin 1s linear infinite;
        }
        @keyframes hra-spin { to { transform: rotate(360deg); } }
        .hra-loading-text {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--hra-text-dim);
        }

        /* Error */
        .hra-placeholder {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          padding: 40px; border: 2px dashed rgba(201,169,78,0.3); border-radius: 16px; z-index: 5;
        }
        .hra-placeholder-icon { font-size: 48px; color: #525252; }
        .hra-placeholder-text {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--hra-text-dim); text-align: center;
        }

        /* Bottom bar */
        .hra-bottom {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding: 24px 32px 32px;
          background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 60%, rgba(10,10,10,0) 100%);
        }
        .hra-meta { flex: 1; }
        .hra-date {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--hra-text-dim); margin-bottom: 8px;
        }
        .hra-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.2rem, 4vw, 1.8rem); font-weight: 700;
          color: var(--hra-gold); margin-bottom: 8px;
        }
        .hra-subtitle {
          font-family: 'Playfair Display', serif; font-size: 1rem;
          font-style: italic; color: var(--hra-gold-dim);
        }

        /* Controls hint */
        .hra-controls {
          display: flex; gap: 24px;
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase; color: #525252;
        }
        .hra-ctrl { display: flex; align-items: center; gap: 8px; }
        .hra-ctrl-icon {
          width: 24px; height: 24px; border: 1px solid #525252; border-radius: 4px;
          display: flex; align-items: center; justify-content: center; font-size: 12px;
        }

        /* Audio player */
        .hra-audio-player {
          display: flex; align-items: center; gap: 16px;
          background: rgba(201,169,78,0.05); border: 1px solid rgba(201,169,78,0.12);
          border-radius: 8px; padding: 14px 20px; margin-top: 16px; max-width: 440px;
        }
        .hra-side-btns { display: flex; gap: 8px; flex-shrink: 0; }
        .hra-side-btn {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid var(--hra-gold-dim); background: rgba(201,169,78,0.08);
          color: var(--hra-gold); font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          cursor: pointer; transition: all 0.3s; display: flex;
          align-items: center; justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .hra-side-btn:hover { border-color: var(--hra-gold); background: rgba(201,169,78,0.15); }
        .hra-side-btn.active {
          border-color: var(--hra-gold); background: rgba(201,169,78,0.2);
        }
        .hra-side-btn.playing {
          animation: hra-pulse 2s ease-in-out infinite;
        }
        @keyframes hra-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(201,169,78,0.1); }
          50% { box-shadow: 0 0 22px rgba(201,169,78,0.3); }
        }
        .hra-track-info { flex: 1; min-width: 0; }
        .hra-track-title {
          font-family: 'Playfair Display', serif; font-size: 14px;
          color: var(--hra-gold-light); font-style: italic;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hra-track-artist {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          color: rgba(232,224,208,0.5); margin-top: 2px; font-weight: 300;
        }
        .hra-track-idle {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          color: rgba(232,224,208,0.3); font-weight: 300; font-style: italic;
        }

        /* Info panel */
        .hra-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 150;
        }
        .hra-backdrop.open { opacity: 1; visibility: visible; }

        .hra-panel {
          position: fixed; top: 0; right: 0; width: 450px; max-width: 90vw;
          height: 100vh; overflow-y: auto;
          background: linear-gradient(135deg, rgba(20,20,20,0.98), rgba(10,10,10,0.98));
          border-left: 1px solid rgba(201,169,78,0.08);
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
        }
        .hra-panel.open { transform: translateX(0); }

        .hra-panel-inner { padding: 100px 40px 60px; }

        .hra-panel-close {
          position: absolute; top: 24px; right: 24px;
          width: 40px; height: 40px; border: 1px solid rgba(201,169,78,0.2);
          border-radius: 50%; background: transparent; color: var(--hra-text);
          font-size: 20px; cursor: pointer; transition: all 0.3s ease;
        }
        .hra-panel-close:hover { background: rgba(201,169,78,0.1); }

        .hra-panel-label {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--hra-gold); margin-bottom: 8px;
        }
        .hra-panel-title {
          font-family: 'Playfair Display', serif; font-size: 1.8rem;
          font-weight: 700; color: var(--hra-gold); margin-bottom: 8px; line-height: 1.3;
        }
        .hra-panel-date {
          font-family: 'Josefin Sans', sans-serif; font-size: 12px;
          letter-spacing: 0.1em; color: var(--hra-text-dim); margin-bottom: 24px;
        }
        .hra-panel-subtitle {
          font-family: 'Playfair Display', serif; font-size: 1.2rem;
          font-style: italic; color: var(--hra-gold-dim); margin-bottom: 32px;
          padding-bottom: 24px; border-bottom: 1px solid rgba(201,169,78,0.1);
        }
        .hra-panel-desc { display: flex; flex-direction: column; gap: 20px; }
        .hra-panel-desc p {
          font-family: 'Josefin Sans', sans-serif; font-size: 14px;
          line-height: 1.9; color: rgba(232,224,208,0.8); font-weight: 300;
        }
        .hra-panel-desc p:first-letter { font-size: 1.3em; color: var(--hra-gold); }

        .hra-panel-portrait {
          margin-bottom: 28px;
        }
        .hra-panel-portrait img {
          width: 100%; border-radius: 4px;
          filter: sepia(10%);
          border: 1px solid rgba(201,169,78,0.12);
        }
        .hra-panel-portrait-caption {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          line-height: 1.6; color: rgba(232,224,208,0.45); font-weight: 300;
          font-style: italic; margin-top: 10px;
        }

        .hra-panel-accession {
          margin-top: 32px; padding-top: 24px;
          border-top: 1px solid rgba(201,169,78,0.1);
        }
        .hra-panel-accession-label {
          font-family: 'Josefin Sans', sans-serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--hra-text-dim); margin-bottom: 4px;
        }
        .hra-panel-accession-value {
          font-family: 'Josefin Sans', sans-serif; font-size: 12px;
          color: rgba(232,224,208,0.5); font-weight: 300; margin-bottom: 16px;
        }

        @media (max-width: 1024px) {
          .hra-controls { display: none; }
        }
        @media (max-width: 768px) {
          .hra-header { padding: 16px 20px; }
          .hra-back-text { font-size: 24px; }
          .hra-bottom { padding: 20px 24px 28px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .hra-panel { width: 100%; }
          .hra-panel-inner { padding: 80px 24px 40px; }
          .hra-audio-player { max-width: 100%; }
          .hra-info-btn { width: 42px; height: 42px; font-size: 22px; }
        }
      `}</style>

      {/* Header */}
      <header className="hra-header">
        <button className="hra-back" onClick={() => { stopAudio(); router.push('/exhibitions/harlem-renaissance/artifacts'); }}>
          <span className="hra-back-text">M</span>
          <span className="hra-back-arrow">{'\u2190'}</span>
          <span className="hra-back-label">Collection</span>
        </button>
        <button
          className={`hra-info-btn ${showInfo ? 'active' : ''}`}
          onClick={() => setShowInfo(!showInfo)}
        >
          i
        </button>
      </header>

      {/* Content */}
      <main className="hra-content">
        <div className="hra-model" ref={containerRef}>
          {isLoading && (
            <div className="hra-loading">
              <div className="hra-spinner" />
              <span className="hra-loading-text">Loading artifact...</span>
            </div>
          )}
          {!isLoading && loadError && (
            <div className="hra-placeholder">
              <div className="hra-placeholder-icon">{'\u25C7'}</div>
              <div className="hra-placeholder-text">{loadError}</div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="hra-bottom">
          <div className="hra-meta">
            <p className="hra-date">{artifact.date}</p>
            <h1 className="hra-title">{artifact.title}</h1>
            <p className="hra-subtitle">{artifact.subtitle}</p>

            {/* Audio player for phonograph */}
            {artifact.audio && (
              <div className="hra-audio-player">
                <div className="hra-side-btns">
                  <button
                    className={`hra-side-btn ${playingSide === 'A' ? 'active' : ''} ${playingSide === 'A' && isPlaying ? 'playing' : ''}`}
                    onClick={() => playSide('A')}
                    title="Side A"
                  >
                    {playingSide === 'A' && isPlaying ? '\u23F8' : 'A'}
                  </button>
                  <button
                    className={`hra-side-btn ${playingSide === 'B' ? 'active' : ''} ${playingSide === 'B' && isPlaying ? 'playing' : ''}`}
                    onClick={() => playSide('B')}
                    title="Side B"
                  >
                    {playingSide === 'B' && isPlaying ? '\u23F8' : 'B'}
                  </button>
                </div>
                <div className="hra-track-info">
                  {currentTrack ? (
                    <>
                      <div className="hra-track-title">{'\u201C'}{currentTrack.title}{'\u201D'}</div>
                      <div className="hra-track-artist">Bessie Smith {'\u2014'} Columbia Records</div>
                    </>
                  ) : (
                    <div className="hra-track-idle">Choose a side to play</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hra-controls">
            <div className="hra-ctrl">
              <div className="hra-ctrl-icon">{'\u2194'}</div>
              <span>Drag to rotate</span>
            </div>
            <div className="hra-ctrl">
              <div className="hra-ctrl-icon">{'\u2295'}</div>
              <span>Scroll to zoom</span>
            </div>
            <div className="hra-ctrl">
              <div className="hra-ctrl-icon">{'\u21E7'}</div>
              <span>Shift+drag to pan</span>
            </div>
          </div>
        </div>
      </main>

      {/* Info backdrop */}
      <div className={`hra-backdrop ${showInfo ? 'open' : ''}`} onClick={() => setShowInfo(false)} />

      {/* Info panel */}
      <aside className={`hra-panel ${showInfo ? 'open' : ''}`}>
        <button className="hra-panel-close" onClick={() => setShowInfo(false)}>{'\u00D7'}</button>
        <div className="hra-panel-inner">
          <p className="hra-panel-label">Museum Label</p>
          <h2 className="hra-panel-title">{artifact.title}</h2>
          <p className="hra-panel-date">{artifact.date}</p>
          <p className="hra-panel-subtitle">{artifact.subtitle}</p>
          {artifact.portrait && (
            <div className="hra-panel-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artifact.portrait.src} alt={artifact.title} />
              <p className="hra-panel-portrait-caption">{artifact.portrait.caption}</p>
            </div>
          )}
          <div className="hra-panel-desc">
            {artifact.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="hra-panel-accession">
            <div className="hra-panel-accession-label">Accession</div>
            <div className="hra-panel-accession-value">{artifact.accession}</div>
            <div className="hra-panel-accession-label">Collection</div>
            <div className="hra-panel-accession-value">{artifact.collection}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
