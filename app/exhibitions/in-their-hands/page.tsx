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
import { ITH_TALK } from '@/components/projector/posterTalk';
import { ITH_POSTER_THEME, ITH_POSTER_LINKS } from '@/components/projector/themes';
import { FxText, FxVeil, PosterProgress, chapterMarks, usePosterFxStage } from '@/components/poster-fx/PosterFx';
import AtmosphereLayer from '@/components/exhibition/AtmosphereLayer';
import { EntranceCopy } from '@/components/exhibition/EntranceCopy';
import { effectClass, panelEntrance } from '@/components/exhibition/helpers';
import '@/components/exhibition/poster-exhibition.css';
import { ITH_ATMOSPHERES, poster1Content, poster2Content, type IthItem } from './posters';
import './in-their-hands.css';

const poster1Marks = chapterMarks(poster1Content);
const poster2Marks = chapterMarks(poster2Content);

/* Teacher projector mode: the two posters, their chapter questions and the picker images. */
const POSTER_IDS = ['poster1', 'poster2'] as const;
const POSTER_LENGTHS = { poster1: poster1Content.length, poster2: poster2Content.length };
const PROJECTOR_POSTERS: ProjectorPoster<'poster1' | 'poster2'>[] = [
  { id: 'poster1', title: 'Faith and Reason', thumb: '/exhibitions/in-their-hands/poster1-hero.jpg', items: poster1Content, talk: ITH_TALK.poster1 },
  { id: 'poster2', title: 'The Weight of Thirty Pieces', thumb: '/exhibitions/in-their-hands/poster2-hero.jpg', items: poster2Content, talk: ITH_TALK.poster2 },
];

// ============================================
// MAIN COMPONENT
// ============================================
/** The top-left link back to this exhibition's floor, at its card. */
const FLOOR_RETURN = floorReturnFor('in-their-hands');

export default function InTheirHands() {
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

  const rememberFloorPosition = () => {
    sessionStorage.setItem(FLOOR_RETURN.remember.key, FLOOR_RETURN.remember.value);
  };

  const currentItem = currentPosterContent[posterStep];
  const isPoster1 = activeView === 'poster1';

  // Colors — drawn from the exhibition palettes
  const poster1Gold = '#C9A84C';
  const poster1Cream = '#F0EDD8';
  const poster2Antique = '#C8C4A0';
  const poster2Cream = '#F0ECD8';
  const gold = '#C9A84C';
  /* The landing page stands in poster 1's sepia, its type in the gold (4.8:1) and cream (9.2:1). */
  const poster1Sepia = '#443C31';
  const isMain = activeView === 'main';
  const navM = isMain ? poster1Cream : '#525252';
  const navInk = isMain ? gold : '#7D8471';
  const teachStyle = { '--teach-color': gold, '--teach-border': 'rgba(201,168,76,0.55)' } as React.CSSProperties;

  // Per-section background colors
  const getBgColor = () => {
    if (!currentItem) return isPoster1 ? '#2C2416' : '#110b08';

    if (currentItem.type === 'title-image') {
      return isPoster1 ? '#2C2416' : '#110b08';
    }

    if (isPoster1) {
      switch (currentItem.special) {
        case 'parchment':       return '#1A1208';
        case 'scrolls':         return '#0F1A0F';
        case 'observatory':     return '#0A0A1A';
        case 'authentication':  return '#1A1208';
        default:                return '#2C2416';
      }
    } else {
      return '#110b08';
    }
  };

  const bgColor = getBgColor();
  const textColor = isPoster1 ? poster1Cream : poster2Cream;
  const fx = usePosterFxStage('ith', direction, currentItem?.type ?? '', bgColor, textColor);
  const marks = isPoster1 ? poster1Marks : poster2Marks;
  /**
   * Gilt light crosses the panel only as the poster opens and at each chapter
   * title. Every other panel keeps its own authored entrance.
   */
  const gilt = posterStep === 0 || currentItem?.type === 'section-title';
  /**
   * How this panel arrives. A panel with an entrance of its own takes it in
   * place of the exhibition's (the parchment unfolding, a portrait lifting):
   * on the copy when it is typed, set line by line or spread like ink, on the
   * picture otherwise, the other half following. The title cards keep their
   * own motions.
   */
  const entrance = panelEntrance(currentItem);
  const own = entrance !== 'theme' && currentItem?.type !== 'title-image';
  const onCopy = entrance === 'typewriter' || entrance === 'line-by-line' || entrance === 'ink-spread';
  const pictureClass = own ? (onCopy ? 'pe-follow' : effectClass(entrance)) : 'pfx-lift';
  const copyEffect = own && onCopy ? entrance : 'none';
  const copyClass = own && !onCopy ? 'pe-follow' : own ? '' : 'ith-effect-fade-in';
  const atmosphere = currentItem?.atmosphere;
  const atmo = atmosphere ? ITH_ATMOSPHERES[atmosphere] : undefined;
  /** Coins are transparent cut-outs: they get a shadow that follows the metal and a glint. */
  const isCoin = (item: IthItem) => item.special === 'thirty-pieces' && !!item.src?.endsWith('.png');

  // Per-section color palette
  const getSectionColors = (special?: string) => {
    if (isPoster1) {
      switch (special) {
        case 'parchment':       return { title: poster1Gold, text: poster1Cream };
        case 'scrolls':         return { title: '#A8C4A0', text: poster1Cream };
        case 'observatory':     return { title: '#A0B8D0', text: '#D0D8E8' };
        case 'authentication':  return { title: poster1Gold, text: poster1Cream };
        default:                return { title: poster1Gold, text: poster1Cream };
      }
    } else {
      switch (special) {
        case 'passion':         return { title: poster2Antique, text: poster2Cream };
        case 'thirty-pieces':   return { title: '#D0CCA8', text: poster2Cream };
        case 'accident':        return { title: '#B8C0A8', text: poster2Cream };
        default:                return { title: poster2Antique, text: poster2Cream };
      }
    }
  };

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'ith-pos-top-left';
      case 'top-right': return 'ith-pos-top-right';
      case 'bottom-left': return 'ith-pos-bottom-left';
      case 'bottom-right': return 'ith-pos-bottom-right';
      case 'bottom-center': return 'ith-pos-bottom-center';
      case 'full-width': return 'ith-pos-full-width';
      default: return 'ith-pos-center';
    }
  };

  // Special classes
  const getSpecialClass = (special?: string) => {
    if (!special) return '';
    const classes: string[] = [];
    if (special === 'parchment') classes.push('ith-parchment');
    if (special === 'scrolls') classes.push('ith-scrolls');
    if (special === 'observatory') classes.push('ith-observatory');
    if (special === 'authentication') classes.push('ith-parchment');
    if (special === 'passion') classes.push('ith-passion');
    if (special === 'thirty-pieces') classes.push('ith-thirty-pieces');
    if (special === 'accident') classes.push('ith-accident');
    return classes.join(' ');
  };

  return (
    <div className="pe-root ith-root" style={{ background: isMain ? poster1Sepia : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* ============================================
           NAVIGATION
           ============================================ */
        .ith-nav {
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
        .ith-nav-left { left: 32px; }
        .ith-nav-right { right: 32px; }
        .ith-nav:hover .ith-nav-label, .ith-nav:focus-visible .ith-nav-label { opacity: 1; max-width: 150px; }
        .ith-nav:hover .ith-nav-arrow-left, .ith-nav:focus-visible .ith-nav-arrow-left { transform: translateX(-4px); }
        .ith-nav:hover .ith-nav-arrow-right, .ith-nav:focus-visible .ith-nav-arrow-right { transform: translateX(4px); }
        .ith-nav-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .ith-nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .ith-nav-label {
          font-size: 13px;
          font-style: italic;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }


        /* ============================================
           BASE ANIMATIONS
           ============================================ */
        @keyframes ithFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ith-effect-fade-in {
          animation: ithFadeIn 0.8s ease forwards;
        }






        @keyframes ithShrinkBack {
          from { transform: scale(1.15); }
          to { transform: scale(0.92); }
        }
        .ith-effect-shrink-back {
          animation: ithShrinkBack 8s ease-out forwards;
        }

        /* ============================================
           SPECIAL EFFECT 1: PARCHMENT — Poster 1 base
           Gilt glow on the copy (the ground: scriptorium, in-their-hands.css)
           ============================================ */
        .ith-parchment {
          position: relative;
          overflow: hidden;
        }
        .ith-parchment .ith-paragraph-text,
        .ith-parchment .ith-section-title-text {
          text-shadow: 0 0 40px rgba(201,168,76,0.2);
        }


        /* ============================================
           SPECIAL EFFECT 2: SCROLLS — Dead Sea Scrolls
           Sage glow on the copy (the ground: qumran-cave, in-their-hands.css)
           ============================================ */
        .ith-scrolls {
          position: relative;
          overflow: hidden;
        }
        .ith-scrolls .ith-paragraph-text,
        .ith-scrolls .ith-section-title-text {
          text-shadow: 0 0 25px rgba(168,196,160,0.15);
        }


        /* ============================================
           SPECIAL EFFECT 3: OBSERVATORY — Night sky / cosmos
           Starlight on the copy (the ground: vatican-stars, in-their-hands.css)
           ============================================ */
        .ith-observatory {
          position: relative;
          overflow: hidden;
        }
        .ith-observatory .ith-paragraph-text,
        .ith-observatory .ith-section-title-text {
          text-shadow: 0 0 30px rgba(160,184,208,0.25);
        }


        /* ============================================
           SPECIAL EFFECT 4: PASSION — Pilate / Passion sections
           Crimson glow on the copy (the ground: jerusalem-dusk, in-their-hands.css)
           ============================================ */
        .ith-passion {
          position: relative;
          overflow: hidden;
        }
        .ith-passion .ith-paragraph-text,
        .ith-passion .ith-section-title-text {
          text-shadow: 0 0 35px rgba(120,20,20,0.2);
        }

        /* ============================================
           SPECIAL EFFECT 5: THIRTY PIECES — Silver shimmer
           Silver glow on the copy (the ground: tyrian-silver, in-their-hands.css)
           ============================================ */
        .ith-thirty-pieces {
          position: relative;
          overflow: hidden;
        }
        .ith-thirty-pieces .ith-paragraph-text,
        .ith-thirty-pieces .ith-section-title-text {
          text-shadow: 0 0 30px rgba(200,200,210,0.15);
        }

        /* ============================================
           SPECIAL EFFECT 6: ACCIDENT — Cave / torch flicker
           Torchlit copy (the ground: caiaphas-tomb, in-their-hands.css)
           ============================================ */
        .ith-accident {
          position: relative;
          overflow: hidden;
        }
        .ith-accident .ith-paragraph-text,
        .ith-accident .ith-section-title-text {
          text-shadow: 0 0 25px rgba(180,140,60,0.15);
        }

        /* ============================================
           POSTER 1 PERSISTENT BACKGROUND
           Tissot Jerusalem watercolour behind all text slides
           ============================================ */
        .ith-poster1-bg {
          position: fixed;
          inset: 0;
          background-image: url('/exhibitions/in-their-hands/poster1-image.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 0;
          animation: ithBgKenburns 60s ease-in-out infinite alternate;
        }
        /* Copy taking its own entrance shows at once; the entrance is on the copy. */
        .ith-artwork-text-side.ith-text-side-own { animation: none; opacity: 1; }
        @keyframes ithBgKenburns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .ith-poster1-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 6, 0.65);
          z-index: 0;
        }

        /* ============================================
           POSITIONS
           ============================================ */
        .ith-pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .ith-pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .ith-pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .ith-pos-bottom-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .ith-pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .ith-pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .ith-pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* ============================================
           MAIN EXHIBITION VIEW
           ============================================ */
        .ith-exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px 40px;
          gap: 32px;
        }

        /* The lessons chip inherits its ink from here (a:link outranks its own color). */
        .ith-exhibition-title { text-align: center; margin-bottom: 8px; color: ${gold}; }
        .ith-exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: ${gold};
          margin-bottom: 12px;
        }
        .ith-exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: ${gold};
        }

        .ith-exhibition-grid {
          display: flex;
          gap: 20px;
          max-width: 95vw;
          width: 100%;
          align-items: center;
          justify-content: center;
        }

        .ith-poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          flex-shrink: 0;
        }
        .ith-poster-frame:hover, .ith-poster-frame:focus-visible { transform: translateY(-8px); }
        .ith-poster-frame:hover .ith-poster-hint, .ith-poster-frame:focus-visible .ith-poster-hint { opacity: 1; }
        .ith-poster-frame img {
          height: 30vh;
          width: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .ith-poster-hint {
          display: block;
          text-align: center;
          margin-top: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${poster1Cream};
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* Each case stands on the page's own sepia, with no card round it: the
           photographs are cut out, so the lit cases sit straight on the poster's
           ground. Its type is cream and the poster's gold (4.7:1 and up). */
        .ith-display-case {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s ease;
          overflow: visible;
          width: 100%;
        }
        .ith-display-case:hover, .ith-display-case:focus-visible {
          transform: translateY(-8px);
        }
        .ith-display-case:hover .ith-case-image {
          transform: scale(1.02);
          filter: drop-shadow(0 18px 28px rgba(0,0,0,0.35));
        }
        .ith-case-image {
          height: 30vh;
          width: auto;
          object-fit: contain;
          margin-bottom: 12px;
          transition: transform 0.4s ease;
        }
        .ith-case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d6cbb3;
          margin-bottom: 8px;
        }
        .ith-case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #efe6d2;
          margin-bottom: 8px;
        }
        .ith-case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #C9A84C;
        }

        /* ============================================
           WALKTHROUGH
           ============================================ */
        .ith-poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.25s ease;
          overflow: hidden;
        }
        .ith-poster-walkthrough.fade-out { opacity: 0; }

        .ith-walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        /* Full bleed images */
        .ith-full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .ith-full-bleed-image.ith-title-width img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        /* Centered PNG title card — no background, transparent */
        .ith-full-bleed-image.ith-title-centered {
          z-index: 2;
        }
        .ith-full-bleed-image.ith-title-centered img {
          max-width: 60%;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        @keyframes ithBreathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .ith-effect-breathe {
          animation: ithBreathe 5s ease-in-out infinite;
        }
        /* Full image (photographs etc) */
        .ith-full-bleed-image.ith-full-image img {
          max-width: 90%;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .ith-image-caption {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          opacity: 0.6;
          text-align: center;
          white-space: nowrap;
        }

        /* Frost image — full height with frosted glass backdrop */
        .ith-frost-image {
          z-index: 2;
        }
        .ith-frost-image img {
          width: auto;
          height: 100%;
          max-height: 100vh;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }
        .ith-frost-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(20, 14, 6, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1;
        }

        /* Text content wrapper */
        .ith-text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
          position: relative;
          z-index: 2;
        }

        /* Section title */
        .ith-section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          position: relative;
          z-index: 10;
        }

        /* Paragraph */
        .ith-paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
          position: relative;
          z-index: 10;
        }

        /* Quote */
        .ith-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          max-width: 700px;
          padding: 40px;
          border-left: 3px solid;
          position: relative;
          z-index: 10;
        }

        /* Timeline */
        .ith-timeline-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${gold};
          text-align: center;
          margin-bottom: 16px;
        }
        .ith-timeline {
          position: relative;
          z-index: 10;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ith-timeline-item {
          display: flex;
          gap: 12px;
          padding: 8px 0;
          border-left: 2px solid rgba(201,168,76,0.2);
          padding-left: 18px;
          position: relative;
        }
        .ith-timeline-item::before {
          content: '';
          position: absolute;
          left: -4px;
          top: 14px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${gold};
        }
        .ith-timeline-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.8rem, 1.8vw, 1rem);
          line-height: 1.5;
          color: #F0ECD8;
        }

        /* End button */
        .ith-content-end {
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
        .ith-content-end:hover {
          background: ${gold};
          color: #0a0a0a;
          border-color: ${gold};
        }

        /* ============================================
           IMAGE-TEXT STACKED — Image above, text below
           ============================================ */
        .ith-image-text-stacked {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 40px;
          position: relative;
          z-index: 2;
        }
        .ith-stacked-image {
          max-width: 45%;
          display: flex;
          justify-content: center;
        }
        .ith-stacked-image img {
          max-width: 100%;
          max-height: 40vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: ithFadeIn 1s ease forwards;
        }

        /* ============================================
           ARTWORK DISPLAY — Full image + info alongside
           ============================================ */
        .ith-artwork-display {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 60px;
          position: relative;
        }
        .ith-artwork-reversed {
          flex-direction: row-reverse;
        }
        .ith-artwork-image-side {
          flex: 0 1 auto;
          max-width: 30%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ith-artwork-image-side img {
          max-height: 45vh;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
          animation: ithArtworkReveal 1.2s ease forwards;
        }
        @keyframes ithArtworkReveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .ith-artwork-caption {
          text-align: center;
          animation: ithFadeIn 1s ease forwards 0.6s;
          opacity: 0;
        }
        .ith-artwork-caption-title {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-style: italic;
          font-weight: 400;
          margin-bottom: 2px;
        }
        .ith-artwork-caption-meta {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .ith-artwork-text-side {
          flex: 1;
          max-width: 500px;
          position: relative;
          z-index: 10;
          animation: ithFadeIn 1s ease forwards 0.4s;
          opacity: 0;
        }

        /* ============================================
           WALKTHROUGH NAVIGATION
           ============================================ */
        .ith-walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .ith-nav-arrow-btn {
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
        .ith-nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .ith-nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(201,168,76,0.2);
        }

        .ith-step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          min-width: 50px;
          text-align: center;
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 900px) {
          .ith-exhibition-grid { flex-direction: column; gap: 32px; }
          .ith-display-case { max-width: 360px; }
          .ith-poster-frame img, .ith-case-image { height: auto; max-height: 40vh; max-width: 100%; }
          .ith-entry-cards { grid-template-columns: 1fr; gap: 20px; }
          .ith-pos-top-left, .ith-pos-top-right { padding: 15vh 24px 15vh 24px; }
          .ith-pos-bottom-left, .ith-pos-bottom-right, .ith-pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
          .ith-artwork-display {
            flex-direction: column;
            padding: 60px 24px;
            gap: 32px;
          }
          .ith-artwork-image-side {
            max-width: 100%;
          }
          /* the observatory, the scroll and the ossuary read at a phone's width */
          .ith-stacked-image { max-width: 90%; }
          .ith-artwork-image-side img {
            max-height: 50vh;
          }
          .ith-artwork-info-side {
            max-width: 100%;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .ith-nav-left { left: 20px; top: 20px; }
          .ith-nav-right { right: 20px; top: 20px; }
          .ith-nav-text { font-size: 24px; }
          .ith-exhibition-main { padding: 100px 24px 60px; }
          .ith-walkthrough-nav { bottom: 20px; gap: 16px; }
          .ith-nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .ith-text-content-wrapper { padding: 100px 24px; }
        }
      `}</style>

      {!projector && (
        <>
        {/* ============================================
            NAVIGATION
            ============================================ */}
        <ExhibitionNav
          className="ith-nav ith-nav-left"
          href={activeView === 'main' ? FLOOR_RETURN.href : undefined}
          onClick={activeView === 'main' ? rememberFloorPosition : returnToMain}
        >
          <span className="ith-nav-text" aria-hidden="true" style={{ color: navM }}>M</span>
          <span className="ith-nav-arrow ith-nav-arrow-left" aria-hidden="true" style={{ color: navInk }}>&#8592;</span>
          <span className="ith-nav-label" style={{ color: navInk }}>
            {activeView === 'main' ? FLOOR_RETURN.label : 'Exhibition'}
          </span>
        </ExhibitionNav>

        <ExhibitionNav className="ith-nav ith-nav-right" href="/exhibitions/in-their-hands/resources">
          <span className="ith-nav-label" style={{ color: navInk }}>Resources</span>
          <span className="ith-nav-arrow ith-nav-arrow-right" aria-hidden="true" style={{ color: navInk }}>&#8594;</span>
          <span className="ith-nav-text" aria-hidden="true" style={{ color: navM }}>M</span>
        </ExhibitionNav>
        </>
      )}

      {/* ============================================
          MAIN EXHIBITION VIEW
          ============================================ */}
      {activeView === 'main' && !projector && (
        <div className="ith-exhibition-main">
          <div className="ith-exhibition-title">
            <h1>In Their Hands</h1>
            <p>Coins of the New Testament</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              <TeachToggle onClick={() => setProjector(true)} style={teachStyle} />
              <LessonsLink exhibition="in-their-hands" style={teachStyle} />
            </div>
          </div>

          <div className="ith-exhibition-grid">
            <button type="button" className="btn-reset ith-poster-frame" data-poster="poster1" onClick={() => openPoster('poster1')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/in-their-hands/poster1-hero.jpg" alt="Faith and Reason poster: the title in script above panels of text, over a watercolor of the walls of Jerusalem" />
              <span className="ith-poster-hint">Click to explore</span>
            </button>

            <Link href="/exhibitions/in-their-hands/artifacts/case-6" className="ith-display-case">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ith-case-image" src="/exhibitions/in-their-hands/artifacts/case-1.png" alt="Lit display case with three coins in round holders before a printed information card" />
              <p className="ith-case-label">Gallery II, Case 6</p>
              <p className="ith-case-title">In Their Hands</p>
              <p className="ith-case-subtitle">Coins from the World of Jesus</p>
            </Link>

            <Link href="/exhibitions/in-their-hands/artifacts/case-7" className="ith-display-case">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ith-case-image" src="/exhibitions/in-their-hands/artifacts/case-2.png" alt="Lit display case with six coins in round holders before two printed information cards" />
              <p className="ith-case-label">Gallery II, Case 7</p>
              <p className="ith-case-title">In Their Hands</p>
              <p className="ith-case-subtitle">Coins from Jesus&rsquo; Ministry and Passion</p>
            </Link>

            <Link href="/exhibitions/in-their-hands/artifacts/case-8" className="ith-display-case">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ith-case-image" src="/exhibitions/in-their-hands/artifacts/Case-3.png" alt="Lit display case with two coins in round holders and a third in a sealed grading slab, before a printed information card" />
              <p className="ith-case-label">Gallery II, Case 8</p>
              <p className="ith-case-title">In Their Hands</p>
              <p className="ith-case-subtitle">Coins from the Early Church</p>
            </Link>

            <button type="button" className="btn-reset ith-poster-frame" data-poster="poster2" onClick={() => openPoster('poster2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/in-their-hands/poster2-hero.jpg" alt="The Weight of Thirty Pieces poster: the title in script above a timeline and columns of text, with paintings of the Passion" />
              <span className="ith-poster-hint">Click to explore</span>
            </button>
          </div>

        </div>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <PosterNavHint visible={hintVisible && !projector} onDismiss={dismissHint} />
      {activeView !== 'main' && (
        <h1 className="visually-hidden">{activeView === 'poster1' ? 'Faith and Reason' : 'The Weight of Thirty Pieces'}</h1>
      )}

      {/* ============================================
          POSTER WALKTHROUGH VIEW
          ============================================ */}
      <PosterProjector
        on={projector}
        exhibitionSlug="in-their-hands"
        onExit={() => setProjector(false)}
        exhibition="In Their Hands"
        theme={ITH_POSTER_THEME}
        links={ITH_POSTER_LINKS}
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
            className={`ith-poster-walkthrough ${fx.className} ${fadeIn ? '' : 'fade-out'}`}
            data-entrance={entrance}
            data-atmosphere={atmosphere}
          >

            {/* Poster 1 persistent background — Tissot Jerusalem watercolour */}
            {isPoster1 && (currentItem.type !== 'full-image' || currentItem.special === 'frost') && (
              <>
                <div className="ith-poster1-bg" />
                {currentItem.special !== 'poster1-title' && <div className="ith-poster1-overlay" />}
              </>
            )}

            <div className="ith-walkthrough-content" ref={contentRef} tabIndex={-1} data-focus-target="">
              {gilt && <FxVeil theme="ith" kind={posterStep === 0 ? 'media' : 'title'} />}

              {/* Title Image — Full Bleed or Centered PNG */}
              {currentItem.type === 'title-image' && currentItem.special === 'poster1-title' && (
                <div className="ith-full-bleed-image ith-title-centered pfx-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} className="ith-effect-breathe" />
                </div>
              )}
              {currentItem.type === 'title-image' && currentItem.special !== 'poster1-title' && (
                <div className={`ith-full-bleed-image ith-title-width pfx-media ${currentItem.effect ? `ith-effect-${currentItem.effect}` : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
              )}

              {/* Full Image — frost variant (full-height, frosted backdrop) */}
              {currentItem.type === 'full-image' && currentItem.special === 'frost' && (
                <div className="ith-full-bleed-image ith-frost-image pfx-media">
                  <div className="ith-frost-backdrop" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} className={own ? effectClass(entrance) : ''} />
                </div>
              )}

              {/* Full Image (photograph etc) */}
              {currentItem.type === 'full-image' && currentItem.special !== 'frost' && (
                <div className={`ith-full-bleed-image ith-full-image ${own ? '' : 'pfx-media'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} className={own ? effectClass(entrance) : ''} />
                  {currentItem.text && (
                    <span className="ith-image-caption" style={{ color: textColor }}>{currentItem.text}</span>
                  )}
                </div>
              )}

              {/* Section Title */}
              {currentItem.type === 'section-title' && (
                <div className={`ith-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                  <h2
                    className="ith-section-title-text"
                    style={{ color: getSectionColors(currentItem.special).title }}
                    data-fx="title"
                  >
                    <FxText text={currentItem.text ?? ''} />
                  </h2>
                </div>
              )}

              {/* Paragraph */}
              {currentItem.type === 'paragraph' && currentItem.text && (
                <div className={`ith-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                  <p className="ith-paragraph-text" style={{ color: getSectionColors(currentItem.special).text }}>
                    <EntranceCopy text={currentItem.text} effect={entrance} />
                  </p>
                </div>
              )}

              {/* Image above text — stacked vertically */}
              {currentItem.type === 'image-text-stacked' && (
                <div className={`ith-image-text-stacked ${getSpecialClass(currentItem.special)}`}>
                  <div className="ith-stacked-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentItem.src} alt={currentItem.alt} className={pictureClass} />
                  </div>
                  <p
                    className={`ith-paragraph-text ${copyClass}`}
                    style={{ color: getSectionColors(currentItem.special).text, textAlign: 'center' }}
                  >
                    <EntranceCopy text={currentItem.text ?? ''} effect={copyEffect} />
                  </p>
                </div>
              )}

              {/* Text above image — stacked vertically */}
              {currentItem.type === 'text-image-stacked' && (
                <div className={`ith-image-text-stacked ${getSpecialClass(currentItem.special)}`}>
                  <p
                    className={`ith-paragraph-text ${copyClass}`}
                    style={{ color: getSectionColors(currentItem.special).text, textAlign: 'center' }}
                  >
                    <EntranceCopy text={currentItem.text ?? ''} effect={copyEffect} />
                  </p>
                  <div className="ith-stacked-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentItem.src} alt={currentItem.alt} className={pictureClass} />
                  </div>
                </div>
              )}

              {/* Artwork Display — Image with caption on one side, paragraph text on other */}
              {currentItem.type === 'artwork-display' && (
                <div className={`ith-artwork-display ${currentItem.position === 'right' ? 'ith-artwork-reversed' : ''} ${getSpecialClass(currentItem.special)}`}>
                  <div className="ith-artwork-image-side">
                    {isCoin(currentItem) ? (
                      <span className="pfx-coin" style={{ '--pfx-mask': `url(${currentItem.src})` } as React.CSSProperties}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={currentItem.src} alt={currentItem.alt} />
                      </span>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={currentItem.src} alt={currentItem.alt} className={pictureClass} />
                    )}
                    <div className="ith-artwork-caption" style={{ color: textColor }}>
                      <span className="ith-artwork-caption-title">{currentItem.artworkTitle}</span>
                      <span className="ith-artwork-caption-meta">{currentItem.artworkArtist}, {currentItem.artworkDate}</span>
                    </div>
                  </div>
                  <div className={`ith-artwork-text-side ${own ? 'ith-text-side-own' : ''}`} style={{ color: getSectionColors(currentItem.special).text }}>
                    <p className={`ith-paragraph-text ${copyClass}`}>
                      <EntranceCopy text={currentItem.text ?? ''} effect={copyEffect} />
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {currentItem.type === 'timeline' && currentItem.items && (
                <div className={`ith-text-content-wrapper ith-pos-center ${getSpecialClass(currentItem.special)}`} style={{ flexDirection: 'column' }}>
                  {currentItem.text && (
                    <h2 className="ith-timeline-title" style={{ animation: 'ithFadeIn 0.8s ease forwards', opacity: 0 }}>{currentItem.text}</h2>
                  )}
                  <div className="ith-timeline">
                    {currentItem.items.map((item, i) => (
                      <div
                        key={i}
                        className="ith-timeline-item"
                        style={{ animation: `ithFadeIn 0.6s ease forwards ${i * 0.15}s`, opacity: 0 }}
                      >
                        <span className="ith-timeline-text">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quote */}
              {currentItem.type === 'quote' && currentItem.text && (
                <div className="ith-text-content-wrapper ith-pos-center">
                  <blockquote
                    className="ith-quote-text"
                    style={{ color: isPoster1 ? poster1Gold : poster2Antique, borderColor: isPoster1 ? 'rgba(201,168,76,0.4)' : 'rgba(200,196,160,0.3)' }}
                  >
                    <EntranceCopy text={currentItem.text} effect={entrance} />
                  </blockquote>
                </div>
              )}

              {/* End */}
              {currentItem.type === 'end' && projector && <PosterProjectorEnd />}
              {currentItem.type === 'end' && !projector && (
                <div className="ith-text-content-wrapper ith-pos-center" style={{ flexDirection: 'column' }}>
                  <button
                    className="ith-content-end"
                    onClick={returnToMain}
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    {currentItem.text}
                  </button>
                  <PosterLessons exhibition="in-their-hands" poster={activeView} color={textColor} />
                </div>
              )}
            </div>

            {/* Walkthrough Navigation */}
            {currentItem.type !== 'end' && (
              <div className="ith-walkthrough-nav">
                <button
                  className="ith-nav-arrow-btn"
                  onClick={prevStep}
                  disabled={posterStep === 0}
                  aria-label="Previous panel"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  &#8592;
                </button>
                <PosterProgress
                  theme="ith"
                  step={posterStep}
                  fromStep={fromStep}
                  count={currentPosterContent.length}
                  marks={marks}
                  color={textColor}
                />
                <button
                  className="ith-nav-arrow-btn"
                  onClick={nextStep}
                  disabled={posterStep === currentPosterContent.length - 1}
                  aria-label="Next panel"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  &#8594;
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
