'use client';

import Image from 'next/image';
import { useWalkthrough } from './hooks';
import { TypewriterText, LineByLine, FilmOverlay } from './components';

export default function SeeingIsDeceiving() {
  const {
    activeView,
    posterStep,
    fadeIn,
    animationKey,
    currentItem,
    currentPosterContent,
    isPoster1,
    bgColor,
    textColor,
    handleBack,
    openPoster,
    nextStep,
    prevStep,
    returnToMain,
    getPositionClass,
    getEffectClass,
    router,
  } = useWalkthrough();

  return (
    <div style={{ background: activeView === 'main' ? '#0a0a0a' : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* Navigation */
        .nav-m {
          position: fixed;
          top: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-m-left { left: 32px; }
        .nav-m-right { right: 32px; }
        .nav-m:hover .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left { transform: translateX(-4px); }
        .nav-m:hover .nav-arrow-right { transform: translateX(4px); }
        .nav-m-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .nav-label {
          font-size: 13px;
          font-style: italic;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* Typewriter cursor */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typewriter-cursor {
          animation: blink 0.8s infinite;
          margin-left: 2px;
        }

        /* Simple paragraph fade-in */
        @keyframes paragraphFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .effect-fade-in {
          animation: paragraphFade 0.8s ease forwards;
        }

        /* Line by line fade */
        @keyframes lineFade {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .line-fade {
          opacity: 0;
          animation: lineFade 0.6s ease forwards;
          margin-bottom: 16px;
        }
        .line-by-line-container {
          text-align: left;
        }

        /* Blur to sharp */
        @keyframes blurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .effect-blur-sharp {
          animation: blurToSharp 1.2s ease forwards;
        }

        /* Split reveal */
        @keyframes splitReveal {
          from { clip-path: inset(0 50% 0 50%); opacity: 0; }
          to { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .effect-split-reveal {
          animation: splitReveal 0.8s ease forwards;
        }

        /* Glitch effect */
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); filter: hue-rotate(90deg); }
          40% { transform: translate(-3px, -3px); filter: hue-rotate(180deg); }
          60% { transform: translate(3px, 3px); filter: hue-rotate(270deg); }
          80% { transform: translate(3px, -3px); filter: hue-rotate(360deg); }
          100% { transform: translate(0); filter: hue-rotate(0); }
        }
        .effect-glitch {
          animation: glitch 0.4s ease forwards, blurToSharp 0.8s ease forwards;
        }

        /* Film credits slide */
        @keyframes filmCredits {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .effect-film-credits {
          animation: filmCredits 1s ease forwards;
        }

        /* Ken Burns zoom in */
        @keyframes kenburnIn {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .effect-kenburns-in {
          animation: kenburnIn 8s ease forwards;
        }

        /* Mega zoom out */
        @keyframes megaZoomOut {
          from { transform: scale(1.2); }
          to { transform: scale(1); }
        }
        .effect-mega-zoom-out {
          animation: megaZoomOut 2s ease forwards;
        }

        /* Waves drift */
        @keyframes wavesDrift {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .effect-waves-drift {
          animation: wavesDrift 4s ease-in-out infinite;
        }

        /* Drift */
        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .effect-drift {
          animation: drift 6s ease-in-out infinite;
        }

        /* Static noise overlay */
        .static-overlay {
          position: relative;
        }
        .static-overlay::before {
          content: '';
          position: absolute;
          inset: -50%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.18;
          pointer-events: none;
          animation: staticNoise 0.2s steps(10) infinite;
          z-index: 1;
        }
        @keyframes staticNoise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }

        /* RGB split */
        .rgb-split {
          text-shadow: -2px 0 #ff0000, 2px 0 #00ffff;
          animation: rgbPulse 2s ease infinite;
        }
        @keyframes rgbPulse {
          0%, 100% { text-shadow: -2px 0 #ff000033, 2px 0 #00ffff33; }
          50% { text-shadow: -3px 0 #ff000066, 3px 0 #00ffff66; }
        }

        /* Blind spot effect */
        .blind-spot-container { position: relative; }
        .blind-spot-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224,222,222,1) 0%, rgba(224,222,222,0.9) 40%, rgba(224,222,222,0) 70%);
          pointer-events: none;
          animation: blindSpotFill 3s ease forwards 1s;
          z-index: 10;
        }
        @keyframes blindSpotFill {
          to { opacity: 0; }
        }

        /* Vintage film effect */
        .vintage-film {
          position: relative;
          overflow: hidden;
        }

        .film-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          overflow: hidden;
        }

        .film-scratch {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent 100%);
          animation: filmScratchMove 0.3s steps(3) infinite;
        }
        .scratch-1 { left: 15%; animation-delay: 0s; }
        .scratch-2 { left: 45%; animation-delay: 0.1s; }
        .scratch-3 { left: 75%; animation-delay: 0.2s; }

        @keyframes filmScratchMove {
          0% { transform: translateY(-100%); opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        .film-dust {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          animation: filmDustFlicker 0.5s steps(2) infinite;
        }
        .dust-1 { top: 10%; left: 20%; animation-delay: 0s; }
        .dust-2 { top: 30%; left: 60%; animation-delay: 0.1s; }
        .dust-3 { top: 50%; left: 40%; animation-delay: 0.2s; }
        .dust-4 { top: 70%; left: 80%; animation-delay: 0.15s; }
        .dust-5 { top: 85%; left: 25%; animation-delay: 0.25s; }
        .dust-6 { top: 20%; left: 90%; animation-delay: 0.05s; }

        @keyframes filmDustFlicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0; }
        }

        .film-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%);
        }

        .film-sepia {
          position: absolute;
          inset: 0;
          background: rgba(112, 66, 20, 0.08);
          mix-blend-mode: multiply;
        }

        /* Depth parallax */
        .depth-parallax {
          position: relative;
          overflow: hidden;
        }

        .depth-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(168,213,229,0.3), rgba(168,213,229,0.1), transparent);
          pointer-events: none;
          animation: orbFloat 4s ease-in-out infinite;
        }

        .depth-orb-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .depth-orb-2 {
          width: 100px;
          height: 100px;
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }
        .depth-orb-3 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 30%;
          animation-delay: 2s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(15px) translateX(10px); }
        }

        /* Color shift */
        .color-shift {
          animation: colorPulse 3s ease-in-out infinite;
        }
        @keyframes colorPulse {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(15deg); }
        }

        /* Peripheral drift */
        .peripheral-drift {
          position: relative;
        }
        .peripheral-drift::before {
          content: '';
          position: absolute;
          inset: -20%;
          background: repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(168,213,229,0.05) 10deg 20deg);
          animation: peripheralSpin 20s linear infinite;
          pointer-events: none;
          opacity: 0.5;
        }
        @keyframes peripheralSpin {
          to { transform: rotate(360deg); }
        }

        /* Glitch persistent */
        .glitch-persistent {
          position: relative;
        }
        .glitch-persistent::before,
        .glitch-persistent::after {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          animation: glitchPersistent 2s steps(2) infinite;
          pointer-events: none;
          opacity: 0.05;
        }
        .glitch-persistent::before {
          animation-delay: 0.1s;
          clip-path: inset(20% 0 40% 0);
        }
        .glitch-persistent::after {
          animation-delay: 0.2s;
          clip-path: inset(60% 0 10% 0);
        }
        @keyframes glitchPersistent {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        /* Exhibition main view */
        .exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .exhibition-title {
          text-align: center;
          margin-bottom: 60px;
        }
        .exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 300;
          color: #e0dede;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }
        .exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          font-style: italic;
          font-weight: 300;
          color: #7D8471;
        }

        .exhibition-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 1200px;
          width: 100%;
        }

        @media (max-width: 900px) {
          .exhibition-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }

        .poster-frame {
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
          overflow: hidden;
          border-radius: 4px;
        }
        .poster-frame:hover {
          transform: scale(1.02);
        }
        .poster-frame img {
          display: block;
          width: 100%;
          height: auto;
        }
        .poster-hint {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #fff;
          background: rgba(0,0,0,0.6);
          padding: 8px 16px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .poster-frame:hover .poster-hint {
          opacity: 1;
        }

        .display-case {
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          border: 1px solid #333;
          border-radius: 8px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .display-case:hover {
          border-color: #7D8471;
          transform: scale(1.02);
        }
        .case-image {
          width: 100%;
          height: auto;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }
        .case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #e0dede;
          margin-bottom: 4px;
        }
        .case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-style: italic;
          font-weight: 300;
          color: #7D8471;
        }

        /* Poster walkthrough view */
        .poster-walkthrough {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .poster-walkthrough.fade-out {
          opacity: 0;
        }

        .walkthrough-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
        }

        .full-bleed-image {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        .full-bleed-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .title-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .face-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .face-image img {
          width: 80%;
          max-width: 600px;
          height: auto;
          object-fit: contain;
        }

        .text-content-wrapper {
          max-width: 800px;
          padding: 40px;
          position: relative;
          z-index: 10;
        }

        .pos-center {
          text-align: center;
          margin: 0 auto;
        }
        .pos-top-left {
          align-self: flex-start;
          text-align: left;
        }
        .pos-top-right {
          align-self: flex-start;
          text-align: right;
          margin-left: auto;
        }
        .pos-bottom-left {
          align-self: flex-end;
          text-align: left;
        }
        .pos-bottom-right {
          align-self: flex-end;
          text-align: right;
          margin-left: auto;
        }
        .pos-bottom-center {
          align-self: flex-end;
          text-align: center;
          margin: 0 auto;
        }
        .pos-full-width {
          max-width: none;
          width: 100%;
          text-align: center;
        }

        .section-title-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 300;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }

        .paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 300;
          line-height: 1.8;
        }

        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.8;
          border-left: 3px solid;
          padding-left: 24px;
        }

        .content-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2vw, 1.2rem);
          text-decoration: none;
          border-bottom: 1px solid;
          padding-bottom: 4px;
          transition: opacity 0.3s ease;
        }
        .content-link:hover {
          opacity: 0.7;
        }

        .content-end {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2vw, 1.2rem);
          background: transparent;
          border: 1px solid;
          padding: 16px 32px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .content-end:hover {
          background: rgba(255,255,255,0.1);
        }

        .walkthrough-nav {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .nav-arrow-btn {
          background: transparent;
          border: 1px solid;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-arrow-btn:not(:disabled):hover {
          background: rgba(255,255,255,0.1);
        }

        .step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.1em;
        }
      `}</style>

      {/* Navigation */}
      <div
        className="nav-m nav-m-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
      >
        <span className="nav-m-text" style={{ color: '#525252' }}>M</span>
        <span className="nav-arrow nav-arrow-left" style={{ color: '#7D8471' }}>←</span>
        <span className="nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      <div className="nav-m nav-m-right" onClick={() => router.push('/exhibitions/seeing-is-deceiving/resources')}>
        <span className="nav-label" style={{ color: '#7D8471' }}>Resources</span>
        <span className="nav-arrow nav-arrow-right" style={{ color: '#7D8471' }}>→</span>
        <span className="nav-m-text" style={{ color: '#525252' }}>M</span>
      </div>

      {/* Main Exhibition View */}
      {activeView === 'main' && (
        <div className="exhibition-main">
          <div className="exhibition-title">
            <h1>Seeing is Deceiving</h1>
            <p>The Science of How We See</p>
          </div>

          <div className="exhibition-grid">
            <div className="poster-frame" onClick={() => openPoster('poster1')}>
              <Image src="/exhibitions/seeing/poster1.jpg" alt="Seeing is Deceiving poster" width={400} height={600} style={{ width: '100%', height: 'auto' }} />
              <span className="poster-hint">Click to explore</span>
            </div>

            <div className="display-case" onClick={() => router.push('/exhibitions/seeing-is-deceiving/artifacts')}>
              <Image
                src="/exhibitions/seeing/artifacts/display-case.png"
                alt="Artifact Display Case"
                className="case-image"
                width={400}
                height={300}
                style={{ width: '100%', height: 'auto' }}
              />
              <p className="case-label">Gallery II, Case 4</p>
              <p className="case-title">Instruments of Illusion</p>
              <p className="case-subtitle">Including Interactive Perception Lab</p>
            </div>

            <div className="poster-frame" onClick={() => openPoster('poster2')}>
              <Image src="/exhibitions/seeing/poster2.jpg" alt="A History of Lies poster" width={400} height={600} style={{ width: '100%', height: 'auto' }} />
              <span className="poster-hint">Click to explore</span>
            </div>
          </div>
        </div>
      )}

      {/* Poster Walkthrough View */}
      {(activeView === 'poster1' || activeView === 'poster2') && (
        <div className={`poster-walkthrough ${fadeIn ? '' : 'fade-out'}`} key={animationKey}>
          <div className="walkthrough-content">

            {/* Title Image - Full Bleed */}
            {currentItem.type === 'title-image' && (
              <div className={`full-bleed-image title-image ${isPoster1 ? 'poster1-title' : 'poster2-title'} ${currentItem.effect === 'kenburns-in' ? 'effect-kenburns-in' : ''} ${currentItem.effect === 'drift' ? 'effect-drift' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt || ''} />
              </div>
            )}

            {/* Full Image - Mega Zoom */}
            {currentItem.type === 'full-image' && (
              <div className={`full-bleed-image ${currentItem.effect === 'mega-zoom-out' ? 'face-image' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentItem.src}
                  alt={currentItem.alt || ''}
                  className={currentItem.effect === 'mega-zoom-out' ? 'effect-mega-zoom-out' : currentItem.effect === 'waves-drift' ? 'effect-waves-drift' : ''}
                />
              </div>
            )}

            {/* Section Title */}
            {currentItem.type === 'section-title' && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                {currentItem.special === 'vintage-film' && <FilmOverlay />}
                {currentItem.special === 'depth-parallax' && (
                  <>
                    <div className="depth-orb depth-orb-1"></div>
                    <div className="depth-orb depth-orb-2"></div>
                    <div className="depth-orb depth-orb-3"></div>
                  </>
                )}
                <h2
                  className={`section-title-text ${getEffectClass(currentItem.effect)} ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''}`}
                  style={{ color: textColor, position: 'relative', zIndex: 10 }}
                >
                  {currentItem.text}
                </h2>
              </div>
            )}

            {/* Paragraph */}
            {currentItem.type === 'paragraph' && currentItem.text && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                {currentItem.special === 'vintage-film' && <FilmOverlay />}
                {currentItem.special === 'depth-parallax' && (
                  <>
                    <div className="depth-orb depth-orb-1"></div>
                    <div className="depth-orb depth-orb-2"></div>
                    <div className="depth-orb depth-orb-3"></div>
                  </>
                )}
                <p
                  className={`paragraph-text ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''} ${currentItem.effect === 'fade-in' ? 'effect-fade-in' : ''} ${currentItem.effect === 'blur-to-sharp' ? 'effect-blur-sharp' : ''} ${currentItem.effect === 'glitch' ? 'effect-glitch' : ''}`}
                  style={{ color: textColor, position: 'relative', zIndex: 10 }}
                >
                  {currentItem.effect === 'typewriter' ? (
                    <TypewriterText text={currentItem.text} color={textColor} />
                  ) : (
                    currentItem.text
                  )}
                </p>
              </div>
            )}

            {/* Blind Spot */}
            {currentItem.type === 'blind-spot' && currentItem.text && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} blind-spot-container`}>
                <div className="blind-spot-hole"></div>
                <p className="paragraph-text effect-fade-in" style={{ color: textColor }}>
                  {currentItem.text}
                </p>
              </div>
            )}

            {/* Timeline */}
            {currentItem.type === 'timeline' && currentItem.items && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)}`}>
                <LineByLine items={currentItem.items} color={textColor} />
              </div>
            )}

            {/* Quote */}
            {currentItem.type === 'quote' && currentItem.text && (
              <div className={`text-content-wrapper pos-center`}>
                <blockquote
                  className={`quote-text ${currentItem.effect === 'blur-to-sharp' ? 'effect-blur-sharp' : ''}`}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </blockquote>
              </div>
            )}

            {/* Link */}
            {currentItem.type === 'link' && (
              <div className="text-content-wrapper pos-center">
                <a
                  href={currentItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="content-link"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </a>
              </div>
            )}

            {/* End */}
            {currentItem.type === 'end' && (
              <div className="text-content-wrapper pos-center">
                <button
                  className="content-end"
                  onClick={returnToMain}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentItem.type !== 'end' && (
            <div className="walkthrough-nav">
              <button
                className="nav-arrow-btn"
                onClick={prevStep}
                disabled={posterStep === 0}
                style={{ color: textColor, borderColor: textColor }}
              >
                ←
              </button>
              <span className="step-indicator" style={{ color: textColor }}>
                {posterStep + 1} / {currentPosterContent.length}
              </span>
              <button
                className="nav-arrow-btn"
                onClick={nextStep}
                disabled={posterStep === currentPosterContent.length - 1}
                style={{ color: textColor, borderColor: textColor }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
