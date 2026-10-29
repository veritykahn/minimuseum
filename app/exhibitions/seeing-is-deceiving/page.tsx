'use client';

import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import { floorReturnFor } from '@/lib/floors';
import PosterNavHint from '@/components/PosterNavHint';
import { usePosterWalkthrough } from '@/lib/usePosterNavigation';
import PosterProjector, { PosterProjectorEnd, type ProjectorPoster } from '@/components/projector/PosterProjector';
import TeachToggle from '@/components/projector/TeachToggle';
import LessonsLink from '@/components/lesson/LessonsLink';
import PosterLessons from '@/components/lesson/PosterLessons';
import { usePosterDeepLink, useProjectorMode } from '@/components/projector/useProjectorMode';
import { SEEING_TALK } from '@/components/projector/posterTalk';
import { SEEING_POSTER_THEME, SEEING_POSTER_LINKS } from '@/components/projector/themes';
import { FxChannelGhosts, FxDefs, FxText, FxVeil, PosterProgress, chapterMarks, usePosterFxStage } from '@/components/poster-fx/PosterFx';
import AtmosphereLayer from '@/components/exhibition/AtmosphereLayer';
import { EntranceCopy } from '@/components/exhibition/EntranceCopy';
import { effectClass, panelEntrance } from '@/components/exhibition/helpers';
import '@/components/exhibition/poster-exhibition.css';
import { SEEING_ATMOSPHERES, poster1Content, poster2Content } from './posters';
import './seeing.css';

// Line by line component
const LineByLine = ({ items, color }: { items: string[]; color: string }) => {
  return (
    <div className="line-by-line-container">
      {items.map((item, i) => (
        <p
          key={i}
          className="line-fade"
          style={{
            animationDelay: `${i * 0.4}s`,
            color
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
};

// Film dust/scratch component for old film effect
const poster1Marks = chapterMarks(poster1Content);
const poster2Marks = chapterMarks(poster2Content);

/* Teacher projector mode: the two posters, their chapter questions and the picker images. */
const POSTER_IDS = ['poster1', 'poster2'] as const;
const POSTER_LENGTHS = { poster1: poster1Content.length, poster2: poster2Content.length };
const PROJECTOR_POSTERS: ProjectorPoster<'poster1' | 'poster2'>[] = [
  { id: 'poster1', title: 'Seeing is Deceiving: The Science of How We See', thumb: '/exhibitions/seeing/poster1.jpg', items: poster1Content, talk: SEEING_TALK.poster1 },
  { id: 'poster2', title: 'A History of Lies: From Magic Lanterns to AI Deepfakes', thumb: '/exhibitions/seeing/poster2.jpg', items: poster2Content, talk: SEEING_TALK.poster2 },
];

const FilmOverlay = () => {
  return (
    <div className="film-overlay">
      {/* Traveling vertical scratches */}
      <div className="film-scratch scratch-1"></div>
      <div className="film-scratch scratch-2"></div>
      <div className="film-scratch scratch-3"></div>
      {/* Random dust specks */}
      <div className="film-dust dust-1"></div>
      <div className="film-dust dust-2"></div>
      <div className="film-dust dust-3"></div>
      <div className="film-dust dust-4"></div>
      <div className="film-dust dust-5"></div>
      <div className="film-dust dust-6"></div>
      {/* Vignette */}
      <div className="film-vignette"></div>
      {/* Sepia tint */}
      <div className="film-sepia"></div>
    </div>
  );
};

/** The top-left link back to this exhibition's floor, at its card. */
const FLOOR_RETURN = floorReturnFor('seeing-is-deceiving');
const rememberFloorPosition = () => {
  sessionStorage.setItem(FLOOR_RETURN.remember.key, FLOOR_RETURN.remember.value);
};

export default function SeeingIsDeceiving() {
  const [projector, setProjector] = useProjectorMode();
  const {
    activeView,
    posterStep,
    fromStep,
    direction,
    fadeIn,
    animationKey,
    contentRef,
    openPoster,
    goToStep,
    nextStep,
    prevStep,
    returnToMain,
    stageProps,
    hintVisible,
    dismissHint,
    announcement,
  } = usePosterWalkthrough(POSTER_LENGTHS, { hint: !projector });
  usePosterDeepLink(POSTER_IDS, POSTER_LENGTHS, openPoster);

  const currentPosterContent = activeView === 'poster1' ? poster1Content : poster2Content;

  const currentItem = currentPosterContent[posterStep];
  const isPoster1 = activeView === 'poster1';
  const marks = activeView === 'poster1' ? poster1Marks : poster2Marks;

  // Colors
  const wavesBlue = '#a8d5e5';
  const darkCharcoal = '#2a2a2a';
  const bgColor = isPoster1 ? '#e0dede' : '#0a0a0a';
  const textColor = isPoster1 ? darkCharcoal : wavesBlue;
  /* The landing page stands in poster 1's pale grey, its type in the poster's black (14.8:1) and charcoal (10.7:1). */
  const posterGrey = '#e0dede';
  const isMain = activeView === 'main';
  const navM = isMain ? '#0a0a0a' : '#525252';
  const navInk = isMain ? darkCharcoal : '#7D8471';
  const teachStyle = { '--teach-color': darkCharcoal, '--teach-border': 'rgba(42,42,42,0.55)' } as React.CSSProperties;
  const fx = usePosterFxStage('sid', direction, currentItem?.type ?? '', bgColor, isPoster1 ? 'rgba(42,42,42,0.55)' : 'rgba(168,213,229,0.6)');
  /**
   * The panels keep their own authored entrances. The chromatic slat reveal is
   * reserved for the split-reveal section titles, so it marks a new chapter
   * rather than every click.
   */
  /**
   * How this panel arrives: its own entrance (typed, set line by line,
   * glitched, filling in like the blind spot), or, for a section title with
   * none, the chromatic slat reveal. The title cards and the two full
   * pictures keep their own motions.
   */
  const entrance = panelEntrance(currentItem);
  const fxTitle = currentItem?.type === 'section-title' && entrance === 'theme';
  const atmosphere = currentItem?.atmosphere;
  const atmo = atmosphere ? SEEING_ATMOSPHERES[atmosphere] : undefined;

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'pos-top-left';
      case 'top-right': return 'pos-top-right';
      case 'bottom-left': return 'pos-bottom-left';
      case 'bottom-right': return 'pos-bottom-right';
      case 'bottom-center': return 'pos-bottom-center';
      case 'full-width': return 'pos-full-width';
      default: return 'pos-center';
    }
  };

  return (
    <div className={`pe-root sid-root ${!isMain && isPoster1 ? 'sid-light' : ''}`} style={{ background: isMain ? posterGrey : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
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
        .nav-m:hover .nav-label, .nav-m:focus-visible .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left, .nav-m:focus-visible .nav-arrow-left { transform: translateX(-4px); }
        .nav-m:hover .nav-arrow-right, .nav-m:focus-visible .nav-arrow-right { transform: translateX(4px); }
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

        /* ============================================
           VINTAGE FILM EFFECT - with animated scratches and dust
           ============================================ */
        .vintage-film {
          position: relative;
          overflow: hidden;
        }
        
        .film-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
        }
        
        /* Traveling vertical scratches */
        .film-scratch {
          position: absolute;
          top: -100%;
          width: 2px;
          height: 200%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.3) 20%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.3) 80%,
            transparent 100%
          );
          animation: scratchMove 0.8s linear infinite;
        }
        .scratch-1 { left: 15%; animation-delay: 0s; animation-duration: 0.6s; }
        .scratch-2 { left: 45%; animation-delay: 0.2s; animation-duration: 0.5s; opacity: 0.7; }
        .scratch-3 { left: 78%; animation-delay: 0.4s; animation-duration: 0.7s; opacity: 0.5; }
        
        @keyframes scratchMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }
        
        /* Random dust specks that appear and disappear */
        .film-dust {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          animation: dustFlash 0.15s ease-in-out infinite;
        }
        .dust-1 { top: 20%; left: 30%; animation-delay: 0s; }
        .dust-2 { top: 45%; left: 70%; animation-delay: 0.05s; }
        .dust-3 { top: 70%; left: 20%; animation-delay: 0.1s; }
        .dust-4 { top: 15%; left: 80%; animation-delay: 0.08s; width: 6px; height: 6px; }
        .dust-5 { top: 60%; left: 50%; animation-delay: 0.12s; width: 3px; height: 3px; }
        .dust-6 { top: 85%; left: 35%; animation-delay: 0.03s; }
        
        @keyframes dustFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        /* Vignette darkening around edges */
        .film-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0,0,0,0.3) 100%
          );
        }
        
        /* Sepia/warm tint */
        .film-sepia {
          position: absolute;
          inset: 0;
          background: rgba(112, 66, 20, 0.08);
          mix-blend-mode: multiply;
        }
        
        /* Flicker effect on content */
        .vintage-film .section-title-text,
        .vintage-film .paragraph-text {
          animation: filmFlicker 0.1s ease-in-out infinite;
        }
        @keyframes filmFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.97; }
          60% { opacity: 0.94; }
          90% { opacity: 0.98; }
        }

        /* ============================================
           DEPTH PARALLAX - Visible 3D stereoscopic effect
           ============================================ */
        .depth-parallax {
          position: relative;
        }
        
        
        
        /* Text with dramatic shadow for depth */
        .depth-parallax .section-title-text {
          text-shadow: 
            1px 1px 0 rgba(168, 213, 229, 0.3),
            2px 2px 0 rgba(168, 213, 229, 0.2),
            4px 4px 8px rgba(0,0,0,0.3),
            8px 8px 16px rgba(0,0,0,0.2);
          animation: textDepthPulse 3s ease-in-out infinite;
        }
        .depth-parallax .paragraph-text {
          text-shadow: 
            1px 1px 0 rgba(168, 213, 229, 0.2),
            2px 2px 4px rgba(0,0,0,0.2),
            4px 4px 8px rgba(0,0,0,0.15);
          animation: textDepthPulse 3s ease-in-out infinite;
          animation-delay: -1.5s;
        }
        
        @keyframes textDepthPulse {
          0%, 100% {
            transform: translateY(0);
            text-shadow: 
              1px 1px 0 rgba(168, 213, 229, 0.3),
              2px 2px 0 rgba(168, 213, 229, 0.2),
              4px 4px 8px rgba(0,0,0,0.3);
          }
          50% {
            transform: translateY(-3px);
            text-shadow: 
              2px 2px 0 rgba(168, 213, 229, 0.4),
              4px 4px 0 rgba(168, 213, 229, 0.25),
              8px 8px 16px rgba(0,0,0,0.4);
          }
        }
        
        

        /* ============================================
           COLOR SHIFT - Already working, keeping it
           ============================================ */
        .color-shift {
          position: relative;
          overflow: hidden;
        }
        .color-shift .section-title-text,
        .color-shift .paragraph-text {
          position: relative;
          z-index: 5;
        }

        /* Peripheral drift effect */
        .peripheral-drift {
          position: relative;
        }

        /* Persistent glitch effect */
        .glitch-persistent {
          position: relative;
        }
        .glitch-persistent .paragraph-text,
        .glitch-persistent .section-title-text {
          animation: glitchPersistent 4s ease-in-out infinite;
        }
        @keyframes glitchPersistent {
          0%, 90%, 100% { transform: translate(0); text-shadow: none; }
          91% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          92% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
          93% { transform: translate(0); text-shadow: none; }
          96% { transform: translate(1px, 1px); text-shadow: 1px 0 #ff0000, -1px 0 #00ffff; }
          97% { transform: translate(-1px, -1px); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
        }

        /* ============================================
           POSITIONS - Fixed to not overlap nav
           ============================================ */
        .pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .pos-bottom-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* Main Exhibition View */
        .exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          gap: 60px;
        }

        /* The lessons chip inherits its ink from here (a:link outranks its own color). */
        .exhibition-title { text-align: center; margin-bottom: 20px; color: #2a2a2a; }
        .exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: #0a0a0a;
          margin-bottom: 12px;
        }
        .exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: #2a2a2a;
        }

        .exhibition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        @media (max-width: 900px) {
          .exhibition-grid { grid-template-columns: 1fr; gap: 32px; }
          .pos-top-left, .pos-top-right { padding: 15vh 24px 15vh 24px; }
          .pos-bottom-left, .pos-bottom-right, .pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        .poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .poster-frame:hover, .poster-frame:focus-visible { transform: translateY(-8px); }
        .poster-frame:hover .poster-hint, .poster-frame:focus-visible .poster-hint { opacity: 1; }
        .poster-frame img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .poster-hint {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2a2a2a;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* The case card stands on the photograph's own ground: the white of the
           lit case, sampled from its edges (#fefdfc), so the photograph has no
           frame round it. Its type is the poster's black, grey and a deepened
           blue (5.6:1 and up). */
        .display-case {
          background: #fefdfc;
          border: none;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .display-case:hover, .display-case:focus-visible {
          transform: translateY(-8px);
        }
        .display-case:hover .case-image {
          transform: scale(1.02);
        }

        .case-image {
          width: 100%;
          max-width: 280px;
          height: auto;
          object-fit: contain;
          margin-bottom: 20px;
          transition: transform 0.4s ease;
        }
        .case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #5a5a5a;
          margin-bottom: 8px;
        }
        .case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #0a0a0a;
          margin-bottom: 8px;
        }
        .case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #2b6f86;
        }

        /* Walkthrough */
        .poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.25s ease;
          overflow: hidden;
        }
        .poster-walkthrough.fade-out { opacity: 0; }

        /* Above the atmosphere (z-index 1), which stands behind every panel. */
        .walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        /* Full bleed images */
        .full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .full-bleed-image img {
          min-width: 100%;
          min-height: 100%;
          object-fit: cover;
        }
        .full-bleed-image.title-image.poster1-title img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        .full-bleed-image.title-image.poster2-title img {
          width: auto;
          height: 100%;
          max-height: 100vh;
          object-fit: contain;
        }
        .full-bleed-image.face-image img {
          min-width: 120%;
          min-height: 120%;
        }

        /* Text content wrapper */
        .text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
        }

        /* Section title */
        .section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Paragraph */
        .paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
        }

        /* Quote */
        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          max-width: 700px;
          padding: 40px;
          border-left: 3px solid;
        }

        /* Link */
        .content-link {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .content-link:hover {
          background: #a8d5e5;
          color: #0a0a0a;
          border-color: #a8d5e5;
        }

        /* End button */
        .content-end {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .content-end:hover {
          background: #a8d5e5;
          color: #0a0a0a;
          border-color: #a8d5e5;
        }

        /* ============================================
           NAVIGATION - Minimal, transparent, no overlap
           ============================================ */
        .walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .nav-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(168, 213, 229, 0.2);
        }

        .step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          min-width: 50px;
          text-align: center;
        }

        /* Artifacts Grid */
        .artifacts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 700px;
          width: 100%;
        }
        .artifact-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .artifact-clickable { cursor: pointer; }
        .artifact-clickable:hover {
          border-color: rgba(168, 213, 229, 0.4);
          background: linear-gradient(145deg, rgba(168, 213, 229, 0.08), rgba(168, 213, 229, 0.02));
          transform: translateY(-4px);
        }
        .artifact-pedestal {
          width: 100px;
          height: 100px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .artifact-pedestal::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 4px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
        .artifact-active::after {
          background: linear-gradient(to right, transparent, rgba(168, 213, 229, 0.3), transparent);
        }
        .artifact-glass-case {
          width: 70px;
          height: 70px;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .artifact-active-glow {
          border-color: rgba(168, 213, 229, 0.5);
          box-shadow: 0 0 20px rgba(168, 213, 229, 0.2);
        }
        .artifact-3d-icon {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
        }
        .artifact-explore-icon { font-size: 20px; color: #a8d5e5; }
        .artifact-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #fafafa;
          text-align: center;
        }
        .artifact-status {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #525252;
        }
        .artifact-status-active { color: #a8d5e5; }

        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .nav-m-right { right: 20px; top: 20px; }
          .nav-m-text { font-size: 24px; }
          .exhibition-main { padding: 100px 24px 60px; }
          .walkthrough-nav { bottom: 20px; gap: 16px; }
          .nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .text-content-wrapper { padding: 100px 24px; }
          .artifacts-grid { grid-template-columns: 1fr; gap: 24px; max-width: 320px; }
          .artifact-card { padding: 20px; }
        }
      `}</style>

      {!projector && (
        <>
        {/* Navigation */}
        <ExhibitionNav
          className="nav-m nav-m-left"
          href={activeView === 'main' ? FLOOR_RETURN.href : undefined}
          onClick={activeView === 'main' ? rememberFloorPosition : returnToMain}
        >
          <span className="nav-m-text" aria-hidden="true" style={{ color: navM }}>M</span>
          <span className="nav-arrow nav-arrow-left" aria-hidden="true" style={{ color: navInk }}>←</span>
          <span className="nav-label" style={{ color: navInk }}>
            {activeView === 'main' ? FLOOR_RETURN.label : 'Exhibition'}
          </span>
        </ExhibitionNav>

        <ExhibitionNav className="nav-m nav-m-right" href="/exhibitions/seeing-is-deceiving/resources">
          <span className="nav-label" style={{ color: navInk }}>Resources</span>
          <span className="nav-arrow nav-arrow-right" aria-hidden="true" style={{ color: navInk }}>→</span>
          <span className="nav-m-text" aria-hidden="true" style={{ color: navM }}>M</span>
        </ExhibitionNav>
        </>
      )}

      {/* Main Exhibition View */}
      {activeView === 'main' && !projector && (
        <div className="exhibition-main">
          <div className="exhibition-title">
            <h1>Seeing is Deceiving</h1>
            <p>The Science of How We See</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              <TeachToggle onClick={() => setProjector(true)} style={teachStyle} />
              <LessonsLink exhibition="seeing-is-deceiving" style={teachStyle} />
            </div>
          </div>

          <div className="exhibition-grid">
            <button type="button" className="btn-reset poster-frame" data-poster="poster1" onClick={() => openPoster('poster1')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/seeing/poster1.jpg" alt="Seeing is Deceiving poster: the title in black capitals, reflected upside down, beneath a one-line drawing of a face" />
              <span className="poster-hint">Click to explore</span>
            </button>

            <Link href="/exhibitions/seeing-is-deceiving/artifacts" className="display-case">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/exhibitions/seeing/artifacts/display-case.png"
                alt="Acrylic display case holding a wooden stereoscope, a stereoview card and a small illustrated card"
                className="case-image"
              />
              <p className="case-label">Gallery II, Case 4</p>
              <p className="case-title">Instruments of Illusion</p>
              <p className="case-subtitle">Including Interactive Perception Lab</p>
            </Link>

            <button type="button" className="btn-reset poster-frame" data-poster="poster2" onClick={() => openPoster('poster2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/seeing/poster2.jpg" alt="A History of Lies: From Magic Lanterns to AI Deepfakes poster: the title wrapped around a column of rippling blue and black stripes" />
              <span className="poster-hint">Click to explore</span>
            </button>
          </div>
        </div>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <PosterNavHint visible={hintVisible && !projector} onDismiss={dismissHint} />
      {activeView !== 'main' && (
        <h1 className="visually-hidden">{activeView === 'poster1' ? 'Seeing is Deceiving: The Science of How We See' : 'A History of Lies: From Magic Lanterns to AI Deepfakes'}</h1>
      )}
      <FxDefs />

      {/* Poster Walkthrough View */}
      <PosterProjector
        on={projector}
        exhibitionSlug="seeing-is-deceiving"
        onExit={() => setProjector(false)}
        exhibition="Seeing is Deceiving"
        theme={SEEING_POSTER_THEME}
        links={SEEING_POSTER_LINKS}
        posters={PROJECTOR_POSTERS}
        activeView={activeView}
        step={posterStep}
        openPoster={openPoster}
        goToStep={goToStep}
        nextStep={nextStep}
        prevStep={prevStep}
        returnToMain={returnToMain}
      >
        <>
        {(activeView === 'poster1' || activeView === 'poster2') && atmosphere && atmo && (
          <AtmosphereLayer key={`${activeView}:${atmosphere}`} name={atmosphere} atmosphere={atmo} />
        )}
        {(activeView === 'poster1' || activeView === 'poster2') && (
          <div
            // The key comes before the spreads, so React builds the element with jsx() and not createElement().
            key={animationKey}
            {...stageProps}
            {...fx}
            className={`poster-walkthrough ${fx.className} ${fadeIn ? '' : 'fade-out'}`}
            data-tone={isPoster1 ? 'light' : 'dark'}
            data-entrance={entrance}
            data-atmosphere={atmosphere}
          >
            <div className="walkthrough-content" ref={contentRef} tabIndex={-1} data-focus-target="">
              {/* The split-colour scan runs once, as the poster opens. */}
              {posterStep === 0 && <FxVeil theme="sid" kind="media" />}

              {/* Title Image - Full Bleed */}
              {currentItem.type === 'title-image' && (
                <>
                  <div className={`full-bleed-image title-image pfx-media ${isPoster1 ? 'poster1-title' : 'poster2-title'} ${currentItem.effect === 'kenburns-in' ? 'effect-kenburns-in' : ''} ${currentItem.effect === 'drift' ? 'effect-drift' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Required for CSS animations */}
                    <img src={currentItem.src} alt={currentItem.alt} />
                  </div>
                  <FxChannelGhosts className={`full-bleed-image title-image ${isPoster1 ? 'poster1-title' : 'poster2-title'}`} src={currentItem.src} />
                </>
              )}

              {/* Full Image - Mega Zoom */}
              {currentItem.type === 'full-image' && (
                <>
                  <div className={`full-bleed-image pfx-media ${currentItem.effect === 'mega-zoom-out' ? 'face-image' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Required for CSS animations */}
                    <img
                      src={currentItem.src}
                      alt={currentItem.alt}
                      className={currentItem.effect === 'mega-zoom-out' ? 'effect-mega-zoom-out' : currentItem.effect === 'waves-drift' ? 'effect-waves-drift' : ''}
                    />
                  </div>
                  <FxChannelGhosts
                    className={`full-bleed-image ${currentItem.effect === 'mega-zoom-out' ? 'face-image' : ''}`}
                    src={currentItem.src}
                    imgClassName={currentItem.effect === 'mega-zoom-out' ? 'effect-mega-zoom-out' : ''}
                  />
                </>
              )}

              {/* Section Title */}
              {currentItem.type === 'section-title' && (
                <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                  {/* Film overlay for vintage film sections */}
                  {currentItem.special === 'vintage-film' && <FilmOverlay />}
                  <h2
                    className={`section-title-text ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''}`}
                    style={{ color: textColor, position: 'relative', zIndex: 10 }}
                    data-fx={fxTitle ? 'title' : undefined}
                  >
                    {fxTitle ? <FxText text={currentItem.text ?? ''} /> : <EntranceCopy text={currentItem.text ?? ''} effect={entrance} />}
                  </h2>
                </div>
              )}

              {/* Paragraph */}
              {currentItem.type === 'paragraph' && currentItem.text && (
                <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                  {/* Film overlay for vintage film sections */}
                  {currentItem.special === 'vintage-film' && <FilmOverlay />}
                  <p
                    className={`paragraph-text ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''}`}
                    style={{ color: textColor, position: 'relative', zIndex: 10 }}
                  >
                    <EntranceCopy text={currentItem.text} effect={entrance} />
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
                    className="quote-text"
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    <EntranceCopy text={currentItem.text} effect={entrance} />
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
                    className={`content-link ${effectClass(entrance)}`}
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    {currentItem.text}
                  </a>
                </div>
              )}

              {/* End */}
              {currentItem.type === 'end' && projector && <PosterProjectorEnd />}
              {currentItem.type === 'end' && !projector && (
                <div className="text-content-wrapper pos-center" style={{ flexDirection: 'column' }}>
                  <button
                    className="content-end"
                    onClick={returnToMain}
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    {currentItem.text}
                  </button>
                  <PosterLessons exhibition="seeing-is-deceiving" poster={activeView} color={textColor} />
                </div>
              )}
            </div>

            {/* Navigation - minimal and transparent */}
            {currentItem.type !== 'end' && (
              <div className="walkthrough-nav">
                <button
                  className="nav-arrow-btn"
                  onClick={prevStep}
                  disabled={posterStep === 0}
                  aria-label="Previous panel"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  ←
                </button>
                <PosterProgress
                  theme="sid"
                  step={posterStep}
                  fromStep={fromStep}
                  count={currentPosterContent.length}
                  marks={marks}
                  color={textColor}
                />
                <button
                  className="nav-arrow-btn"
                  onClick={nextStep}
                  disabled={posterStep === currentPosterContent.length - 1}
                  aria-label="Next panel"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
        </>
      </PosterProjector>


    </div>
  );
}