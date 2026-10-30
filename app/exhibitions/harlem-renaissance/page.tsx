'use client';

import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import { floorReturnFor } from '@/lib/floors';
import PosterNavHint from '@/components/PosterNavHint';
import { usePosterWalkthrough } from '@/lib/usePosterNavigation';
import PosterProjector, { PosterProjectorEnd, type ProjectorPoster } from '@/components/projector/PosterProjector';
import TeachToggle from '@/components/projector/TeachToggle';
import type { TeachContent } from '@/components/projector/TeachSheet';
import { usePosterDeepLink, useProjectorMode } from '@/components/projector/useProjectorMode';
import { HARLEM_TALK } from '@/components/projector/posterTalk';
import { HARLEM_POSTER_THEME, HARLEM_POSTER_LINKS } from '@/components/projector/themes';
import { FxText, FxVeil, PosterProgress, chapterMarks, fxKindFor, usePosterFxStage } from '@/components/poster-fx/PosterFx';
import AtmosphereLayer from '@/components/exhibition/AtmosphereLayer';
import { EntranceCopy } from '@/components/exhibition/EntranceCopy';
import { effectClass, panelEntrance } from '@/components/exhibition/helpers';
import '@/components/exhibition/poster-exhibition.css';
import { HARLEM_ATMOSPHERES, poster1Content, poster2Content } from './posters';
import './harlem.css';

const poster1Marks = chapterMarks(poster1Content);
const poster2Marks = chapterMarks(poster2Content);

/* Teacher projector mode: the two posters, their chapter questions and the picker images. */
const POSTER_IDS = ['poster1', 'poster2'] as const;
const POSTER_LENGTHS = { poster1: poster1Content.length, poster2: poster2Content.length };
const PROJECTOR_POSTERS: ProjectorPoster<'poster1' | 'poster2'>[] = [
  { id: 'poster1', title: 'The Great Migration and the Harlem Renaissance', thumb: '/exhibitions/harlem/poster1.jpg', items: poster1Content, talk: HARLEM_TALK.poster1 },
  { id: 'poster2', title: 'Walter White: The Civil Rights Hero You’ve Never Heard Of', thumb: '/exhibitions/harlem/poster2.jpg', items: poster2Content, talk: HARLEM_TALK.poster2 },
];

/** What "Teach with this" opens: the lessons, printables and discussion questions for each role. */
const TEACH: TeachContent = { slug: 'harlem-renaissance', name: 'The Harlem Renaissance', posters: PROJECTOR_POSTERS, links: HARLEM_POSTER_LINKS };

// ============================================
// MAIN COMPONENT
// ============================================
/** The top-left link back to this exhibition's floor, at its card. */
const FLOOR_RETURN = floorReturnFor('harlem-renaissance');

export default function HarlemRenaissance() {
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

  // Colors — drawn from the poster palettes
  const poster1Cream = '#efd9b4';
  const poster1Purple = '#714985';
  const poster2Sage = '#ced5bc';
  const poster2Slate = '#696f7f';
  const lavender = '#b485d2';
  /* The landing page stands in poster 1's purple, its type in the poster's cream (5.1:1). */
  const isMain = activeView === 'main';
  const navM = isMain ? poster1Cream : '#525252';
  const navInk = isMain ? poster1Cream : '#7D8471';
  const teachStyle = { '--teach-color': poster1Cream, '--teach-border': 'rgba(239,217,180,0.55)' } as React.CSSProperties;

  // Per-section background colors — uses all palette colours
  const getBgColor = () => {
    if (!currentItem) return isPoster1 ? poster1Purple : poster2Slate;

    // Title images keep their poster title colour
    if (currentItem.type === 'title-image') {
      return isPoster1 ? poster1Purple : poster2Slate;
    }

    // A panel with no section look of its own stands in its atmosphere's ground.
    const atmoBg = !currentItem.special && currentItem.atmosphere ? HARLEM_ATMOSPHERES[currentItem.atmosphere]?.bg : undefined;
    if (atmoBg) return atmoBg;

    if (isPoster1) {
      switch (currentItem.special) {
        case 'train-journey': return '#381a2f';   // dark wine
        case 'ink-spread':    return '#1a0f2a';   // deep purple-black
        case 'art-deco-rays': return '#714985';   // the poster's purple (cream copy reads 5.1:1 on it)
        case 'jazz-swing':    return '#381a2f';   // dark wine
        default:              return '#1a0f2a';   // deep purple-black
      }
    } else {
      switch (currentItem.special) {
        case 'dual-identity': return '#17142f';   // deep indigo
        case 'harlem-night':  return '#262a4d';   // night: dark enough for the lavender titles (4.6:1)
        case 'ink-spread':    return '#17142f';   // deep indigo
        default:              return '#4e568f';   // night blue
      }
    }
  };

  const bgColor = getBgColor();
  const textColor = isPoster1 ? poster1Cream : poster2Sage;
  const fx = usePosterFxStage('hr', direction, currentItem?.type ?? '', bgColor, textColor);
  const kind = currentItem ? fxKindFor(currentItem) : 'body';
  const marks = isPoster1 ? poster1Marks : poster2Marks;
  const veilKind =
    !currentItem ? 'media'
    : currentItem.type === 'artwork-display' ? 'art'
    : currentItem.type === 'section-title' ? 'title'
    : kind === 'body' && currentItem.type === 'paragraph' ? 'text'
    : 'media';
  /**
   * How this panel arrives. A panel with an entrance of its own (typed out,
   * set line by line, swung in) takes it in place of the exhibition's reveal;
   * the rest keep the reveal: the Deco doors at a chapter, Douglas's irises
   * round a painting. The title cards keep their own motions and the iris.
   */
  const entrance = panelEntrance(currentItem);
  const own = entrance !== 'theme' && currentItem?.type !== 'title-image';
  const atmosphere = currentItem?.atmosphere;
  const atmo = atmosphere ? HARLEM_ATMOSPHERES[atmosphere] : undefined;

  // Per-section color palette
  const getSectionColors = (special?: string) => {
    const own = !special && currentItem?.atmosphere ? HARLEM_ATMOSPHERES[currentItem.atmosphere] : undefined;
    if (own?.title && own.text) return { title: own.title, text: own.text };
    if (isPoster1) {
      switch (special) {
        case 'train-journey': return { title: '#efd9b4', text: '#efd9b4' }; // cream/gold
        case 'ink-spread': return { title: '#d992ba', text: '#efd9b4' }; // pink titles
        case 'art-deco-rays': return { title: '#efd9b4', text: '#efd9b4' }; // cream: the mauve read 1.6:1 on the purple
        case 'jazz-swing': return { title: '#d992ba', text: '#efd9b4' }; // pink titles, cream text
        default: return { title: '#efd9b4', text: '#efd9b4' };
      }
    } else {
      switch (special) {
        case 'dual-identity': return { title: '#b485d2', text: '#ced5bc' }; // lavender titles
        case 'harlem-night': return { title: '#b485d2', text: '#ced5bc' }; // lavender titles
        case 'ink-spread': return { title: '#ced5bc', text: '#9298a8' }; // blue-gray text
        default: return { title: '#ced5bc', text: '#ced5bc' };
      }
    }
  };

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'hr-pos-top-left';
      case 'top-right': return 'hr-pos-top-right';
      case 'bottom-left': return 'hr-pos-bottom-left';
      case 'bottom-right': return 'hr-pos-bottom-right';
      case 'bottom-center': return 'hr-pos-bottom-center';
      case 'full-width': return 'hr-pos-full-width';
      default: return 'hr-pos-center';
    }
  };

  // Special classes
  const getSpecialClass = (special?: string) => {
    if (!special) return '';
    const classes: string[] = [];
    if (special === 'train-journey') classes.push('hr-train-journey');
    if (special === 'ink-spread') classes.push('hr-ink-spread-bg');
    if (special === 'art-deco-rays') classes.push('hr-art-deco-rays');
    if (special === 'jazz-swing') classes.push('hr-jazz-swing');
    if (special === 'dual-identity') classes.push('hr-dual-identity');
    if (special === 'harlem-night') classes.push('hr-harlem-night');
    return classes.join(' ');
  };

  return (
    <div className="pe-root hr-root" style={{ background: isMain ? poster1Purple : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* ============================================
           NAVIGATION
           ============================================ */
        .hr-nav {
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
        .hr-nav-left { left: 32px; }
        .hr-nav-right { right: 32px; }
        .hr-nav:hover .hr-nav-label, .hr-nav:focus-visible .hr-nav-label { opacity: 1; max-width: 150px; }
        .hr-nav:hover .hr-nav-arrow-left, .hr-nav:focus-visible .hr-nav-arrow-left { transform: translateX(-4px); }
        .hr-nav:hover .hr-nav-arrow-right, .hr-nav:focus-visible .hr-nav-arrow-right { transform: translateX(4px); }
        .hr-nav-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .hr-nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .hr-nav-label {
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
        @keyframes hrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }




        @keyframes hrKenburnIn {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .hr-effect-kenburns-in {
          animation: hrKenburnIn 8s ease forwards;
        }


        /* Pan left to right — full-height image drifts across the viewport */
        @keyframes hrPanLR {
          0% { transform: translateX(-25vw); }
          100% { transform: translateX(25vw); }
        }
        .hr-full-bleed-image.hr-effect-pan-lr img {
          animation: hrPanLR 12s ease-in-out forwards;
        }

        /* Erase — rises into view then slowly scrubbed out, forgotten */
        @keyframes hrEraseReveal {
          0%   { opacity: 0; transform: translateY(30vh); filter: blur(0); }
          20%  { opacity: 1; transform: translateY(0);    filter: blur(0); }
          50%  { opacity: 1; transform: translateY(0);    filter: blur(0); }
          70%  { opacity: 0.5; transform: translateY(0);  filter: blur(2px); }
          85%  { opacity: 0.15; transform: translateY(0); filter: blur(6px); }
          100% { opacity: 0; transform: translateY(0);    filter: blur(14px); }
        }
        .hr-full-bleed-image.hr-effect-erase {
          align-items: flex-start;
        }
        .hr-full-bleed-image.hr-effect-erase img {
          animation: hrEraseReveal 10s ease forwards;
        }

        /* Rise and expand — image rises from below then scales past full width */
        @keyframes hrRiseExpand {
          0% { transform: translateY(80vh) scale(1); opacity: 0; }
          35% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(0) scale(1.4); opacity: 1; }
        }
        .hr-full-bleed-image.hr-effect-rise-expand img {
          animation: hrRiseExpand 8s ease-out forwards;
        }

        /* ============================================
           EFFECT 1: TRAIN JOURNEY — Migration sections
           Gentle rocking (the ground: trains-north, harlem.css)
           ============================================ */
        .hr-train-journey {
          position: relative;
          overflow: hidden;
        }
        .hr-train-journey .hr-section-title-text,
        .hr-train-journey .hr-paragraph-text {
          animation: hrTrainRock 3s ease-in-out infinite;
        }
        @keyframes hrTrainRock {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }

        /* ============================================
           EFFECT 2: ART DECO RAYS — Aaron Douglas inspired
           (the ground: douglas-rays, harlem.css)
           ============================================ */
        .hr-art-deco-rays {
          position: relative;
          overflow: hidden;
        }

        /* ============================================
           EFFECT 3: JAZZ SWING — Music sections
           Swaying rhythm (the ground: savoy-ballroom, harlem.css)
           ============================================ */
        .hr-jazz-swing {
          position: relative;
          overflow: hidden;
        }
        .hr-jazz-swing .hr-section-title-text {
          animation: hrSwingText 3s ease-in-out infinite;
        }
        .hr-jazz-swing .hr-paragraph-text {
          animation: hrSwingText 4s ease-in-out infinite;
          animation-delay: -1s;
        }
        @keyframes hrSwingText {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.3deg); }
          75% { transform: rotate(-0.3deg); }
        }


        /* ============================================
           EFFECT 4: DUAL IDENTITY — Walter White's passing theme
           Doubled shadow (the ground: color-line, harlem.css)
           ============================================ */
        .hr-dual-identity {
          position: relative;
          overflow: hidden;
        }
        /* Text shadow that alternates between light and dark identity */
        .hr-dual-identity .hr-paragraph-text,
        .hr-dual-identity .hr-section-title-text {
          animation: hrIdentityText 6s ease-in-out infinite;
        }
        @keyframes hrIdentityText {
          0%, 100% { text-shadow: -2px 0 rgba(255, 255, 255, 0.25), 2px 0 rgba(10, 5, 20, 0.4); }
          50% { text-shadow: 2px 0 rgba(255, 255, 255, 0.25), -2px 0 rgba(10, 5, 20, 0.4); }
        }

        /* ============================================
           EFFECT 5: HARLEM NIGHT — Deep purple atmosphere
           (the ground: atlanta-night, harlem.css)
           ============================================ */
        .hr-harlem-night {
          position: relative;
          overflow: hidden;
        }

        /* ============================================
           EFFECT 6: INK SPREAD — Literary sections
           Warm glow on the copy (the ground: ink-bloom, harlem.css)
           ============================================ */
        .hr-ink-spread-bg {
          position: relative;
        }
        .hr-ink-spread-bg .hr-paragraph-text {
          text-shadow: 0 0 20px rgba(239, 217, 180, 0.1);
        }

        /* ============================================
           POSITIONS
           ============================================ */
        .hr-pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hr-pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .hr-pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .hr-pos-bottom-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .hr-pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .hr-pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hr-pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* ============================================
           MAIN EXHIBITION VIEW
           ============================================ */
        .hr-exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          gap: 60px;
        }

        /* The lessons chip inherits its ink from here (a:link outranks its own color). */
        .hr-exhibition-title { text-align: center; margin-bottom: 20px; color: #efd9b4; }
        .hr-exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: #efd9b4;
          margin-bottom: 12px;
        }
        /* The poster's gold and pinks do not read on its purple (2–3:1); its cream does. */
        .hr-exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: #efd9b4;
        }

        .hr-exhibition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .hr-poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .hr-poster-frame:hover, .hr-poster-frame:focus-visible { transform: translateY(-8px); }
        .hr-poster-frame:hover .hr-poster-hint, .hr-poster-frame:focus-visible .hr-poster-hint { opacity: 1; }
        .hr-poster-frame img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .hr-poster-hint {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #efd9b4;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* The case stands on the page's own purple, with no card round it: the
           photograph is cut out, so the lit case sits straight on the poster's
           ground. Its type is the poster's cream (5.1:1 and up). */
        .hr-display-case {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          cursor: pointer;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .hr-display-case:hover, .hr-display-case:focus-visible {
          transform: translateY(-8px);
        }
        .hr-display-case:hover .hr-case-image {
          transform: scale(1.02);
          filter: drop-shadow(0 18px 28px rgba(0,0,0,0.35));
        }

        .hr-case-image {
          width: 100%;
          max-width: 280px;
          height: auto;
          object-fit: contain;
          margin-bottom: 20px;
          transition: transform 0.4s ease;
        }
        .hr-case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #e9d8f0;
          margin-bottom: 8px;
        }
        .hr-case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #efd9b4;
          margin-bottom: 8px;
        }
        .hr-case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #f6d6e8;
        }

        /* ============================================
           WALKTHROUGH
           ============================================ */
        .hr-poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.25s ease;
          overflow: hidden;
        }
        .hr-poster-walkthrough.fade-out { opacity: 0; }

        /* Above the atmosphere (z-index 1), which stands behind every panel. */
        .hr-walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        /* Full bleed images */
        .hr-full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Title shown full height (contain) — tall/vertical images */
        .hr-full-bleed-image.hr-title-height img {
          width: auto;
          height: 100%;
          max-height: 100vh;
          object-fit: contain;
        }
        /* Title shown full width (cover) — wide/horizontal images */
        .hr-full-bleed-image.hr-title-width img,
        .hr-full-bleed-image.hr-title-width-top img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        .hr-full-bleed-image.hr-title-width-top {
          align-items: flex-start;
        }
        /* Full image (photographs etc) */
        .hr-full-bleed-image.hr-full-image img {
          max-width: 90%;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .hr-image-caption {
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

        /* Text content wrapper */
        .hr-text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
        }

        /* Section title */
        .hr-section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          position: relative;
          z-index: 10;
        }

        /* Paragraph */
        .hr-paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
          position: relative;
          z-index: 10;
        }

        /* Quote */
        .hr-quote-text {
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

        /* Link */
        .hr-content-link {
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
        .hr-content-link:hover {
          background: #d992ba;
          color: #0a0a0a;
          border-color: #d992ba;
        }

        /* End button */
        .hr-content-end {
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
        .hr-content-end:hover {
          background: #b485d2;
          color: #0a0a0a;
          border-color: #b485d2;
        }

        /* ============================================
           ARTWORK DISPLAY — Full image + info alongside
           ============================================ */
        .hr-artwork-display {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 60px;
          position: relative;
        }
        .hr-artwork-image-side {
          flex: 1;
          max-width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hr-artwork-image-side img {
          max-height: 80vh;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: hrArtworkReveal 1.2s ease forwards;
        }
        @keyframes hrArtworkReveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .hr-artwork-info-side {
          flex: 1;
          max-width: 400px;
          position: relative;
          z-index: 10;
          animation: hrFadeIn 1s ease forwards 0.4s;
          opacity: 0;
        }
        .hr-artwork-info-side h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 300;
          font-style: italic;
          margin-bottom: 8px;
        }
        .hr-artwork-info-side .hr-artwork-meta {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hr-artwork-info-side .hr-artwork-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.8;
        }

        /* ============================================
           WALKTHROUGH NAVIGATION
           ============================================ */
        .hr-walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .hr-nav-arrow-btn {
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
        .hr-nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .hr-nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(180, 133, 210, 0.2);
        }

        .hr-step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          min-width: 50px;
          text-align: center;
        }

        /* Reduced motion: the title cards stand still at rest, not where their
           motions end (the erase ends with the lettering scrubbed out). */
        @media (prefers-reduced-motion: reduce) {
          .hr-full-bleed-image img { animation: none !important; transform: none !important; }
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 900px) {
          .hr-exhibition-grid { grid-template-columns: 1fr; gap: 32px; }
          .hr-pos-top-left, .hr-pos-top-right { padding: 15vh 24px 15vh 24px; }
          .hr-pos-bottom-left, .hr-pos-bottom-right, .hr-pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
          .hr-artwork-display {
            flex-direction: column;
            padding: 60px 24px;
            gap: 32px;
          }
          .hr-artwork-image-side {
            max-width: 100%;
          }
          .hr-artwork-image-side img {
            max-height: 50vh;
          }
          .hr-artwork-info-side {
            max-width: 100%;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .hr-nav-left { left: 20px; top: 20px; }
          .hr-nav-right { right: 20px; top: 20px; }
          .hr-nav-text { font-size: 24px; }
          .hr-exhibition-main { padding: 100px 24px 60px; }
          .hr-walkthrough-nav { bottom: 20px; gap: 16px; }
          .hr-nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .hr-text-content-wrapper { padding: 100px 24px; }
        }
      `}</style>

      {!projector && (
        <>
        {/* ============================================
            NAVIGATION
            ============================================ */}
        <ExhibitionNav
          className="hr-nav hr-nav-left"
          href={activeView === 'main' ? FLOOR_RETURN.href : undefined}
          onClick={activeView === 'main' ? rememberFloorPosition : returnToMain}
        >
          <span className="hr-nav-text" aria-hidden="true" style={{ color: navM }}>M</span>
          <span className="hr-nav-arrow hr-nav-arrow-left" aria-hidden="true" style={{ color: navInk }}>&#8592;</span>
          <span className="hr-nav-label" style={{ color: navInk }}>
            {activeView === 'main' ? FLOOR_RETURN.label : 'Exhibition'}
          </span>
        </ExhibitionNav>

        <ExhibitionNav className="hr-nav hr-nav-right" href="/exhibitions/harlem-renaissance/resources">
          <span className="hr-nav-label" style={{ color: navInk }}>Resources</span>
          <span className="hr-nav-arrow hr-nav-arrow-right" aria-hidden="true" style={{ color: navInk }}>&#8594;</span>
          <span className="hr-nav-text" aria-hidden="true" style={{ color: navM }}>M</span>
        </ExhibitionNav>
        </>
      )}

      {/* ============================================
          MAIN EXHIBITION VIEW
          ============================================ */}
      {activeView === 'main' && !projector && (
        <div className="hr-exhibition-main">
          <div className="hr-exhibition-title">
            <h1>The Harlem Renaissance</h1>
            <p>The Great Migration &amp; the Birth of a Cultural Revolution</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              <TeachToggle onClick={() => setProjector(true)} style={teachStyle} teach={TEACH} />
            </div>
          </div>

          <div className="hr-exhibition-grid">
            <button type="button" className="btn-reset hr-poster-frame" data-poster="poster1" onClick={() => openPoster('poster1')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/harlem/poster1.jpg" alt="The Great Migration and The Harlem Renaissance poster: columns of text above the title in cream and gold lettering on purple" />
              <span className="hr-poster-hint">Click to explore</span>
            </button>

            <Link href="/exhibitions/harlem-renaissance/artifacts" className="hr-display-case">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/harlem/artifacts/display-case.png" alt="Display case holding a copy of The Fire in the Flint by Walter F. White, a Vocalion 78 rpm record and sheet music for I Just Couldn't Take It Baby" className="hr-case-image" />
              <p className="hr-case-label">Gallery II, Case 5</p>
              <p className="hr-case-title">Voices of Harlem</p>
              <p className="hr-case-subtitle">Artifacts & Experiences from the Renaissance</p>
            </Link>

            <button type="button" className="btn-reset hr-poster-frame" data-poster="poster2" onClick={() => openPoster('poster2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/harlem/poster2.jpg" alt="Walter White: The Civil Rights Hero You've Never Heard Of poster: columns of text over a slate-blue painting of a lone figure on a hill" />
              <span className="hr-poster-hint">Click to explore</span>
            </button>
          </div>
        </div>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <PosterNavHint visible={hintVisible && !projector} onDismiss={dismissHint} />
      {activeView !== 'main' && (
        <h1 className="visually-hidden">{activeView === 'poster1' ? 'The Great Migration and the Harlem Renaissance' : 'Walter White: The Civil Rights Hero You’ve Never Heard Of'}</h1>
      )}

      {/* ============================================
          POSTER WALKTHROUGH VIEW
          ============================================ */}
      <PosterProjector
        on={projector}
        exhibitionSlug="harlem-renaissance"
        onExit={() => setProjector(false)}
        exhibition="The Harlem Renaissance"
        theme={HARLEM_POSTER_THEME}
        links={HARLEM_POSTER_LINKS}
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
            className={`hr-poster-walkthrough ${fx.className} ${fadeIn ? '' : 'fade-out'}`}
            data-entrance={entrance}
            data-atmosphere={atmosphere}
          >
            <div className="hr-walkthrough-content" ref={contentRef} tabIndex={-1} data-focus-target="">
              {!own && <FxVeil theme="hr" kind={veilKind} />}

              {/* Title Image — Full Bleed */}
              {currentItem.type === 'title-image' && (
                <div className={`hr-full-bleed-image pfx-media ${currentItem.special === 'height' ? 'hr-title-height' : currentItem.special === 'width-top' ? 'hr-title-width-top' : 'hr-title-width'} ${currentItem.effect ? `hr-effect-${currentItem.effect}` : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
              )}

              {/* Full Image (photograph etc) */}
              {currentItem.type === 'full-image' && (
                <div className={`hr-full-bleed-image hr-full-image pfx-media ${currentItem.effect === 'kenburns-in' ? 'hr-effect-kenburns-in' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                  {currentItem.text && (
                    <span className="hr-image-caption" style={{ color: textColor }}>{currentItem.text}</span>
                  )}
                </div>
              )}

              {/* Section Title */}
              {currentItem.type === 'section-title' && (
                <div className={`hr-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                  <h2
                    className="hr-section-title-text"
                    style={{ color: getSectionColors(currentItem.special).title }}
                    data-fx={own ? undefined : kind}
                  >
                    {own ? <EntranceCopy text={currentItem.text ?? ''} effect={entrance} /> : <FxText text={currentItem.text ?? ''} />}
                  </h2>
                </div>
              )}

              {/* Paragraph */}
              {currentItem.type === 'paragraph' && currentItem.text && (
                <div className={`hr-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                  <p
                    className="hr-paragraph-text"
                    style={{ color: getSectionColors(currentItem.special).text }}
                    data-fx={own ? undefined : kind}
                  >
                    {own ? <EntranceCopy text={currentItem.text} effect={entrance} /> : <FxText text={currentItem.text} words={kind === 'statement'} />}
                  </p>
                </div>
              )}

              {/* Artwork Display — Full image with info alongside */}
              {currentItem.type === 'artwork-display' && (
                <div className={`hr-artwork-display ${getSpecialClass(currentItem.special)}`}>
                  <div className="hr-artwork-image-side">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentItem.src} alt={currentItem.alt} className="pfx-art-img" />
                  </div>
                  <div className="hr-artwork-info-side pfx-fg pfx-fg-copy" style={{ color: textColor }}>
                    <h2>{currentItem.artworkTitle}</h2>
                    <p className="hr-artwork-meta">
                      {currentItem.artworkArtist}, {currentItem.artworkDate}
                    </p>
                    <p className="hr-artwork-desc">
                      {currentItem.artworkDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Quote */}
              {currentItem.type === 'quote' && currentItem.text && (
                <div className="hr-text-content-wrapper hr-pos-center">
                  <blockquote
                    className="hr-quote-text"
                    style={{ color: isPoster1 ? '#d992ba' : '#b485d2', borderColor: isPoster1 ? '#885a99' : '#4e568f' }}
                    data-fx={own ? undefined : 'quote'}
                  >
                    {own ? <EntranceCopy text={currentItem.text} effect={entrance} /> : <FxText text={currentItem.text} words />}
                  </blockquote>
                </div>
              )}

              {/* Link */}
              {currentItem.type === 'link' && (
                <div className="hr-text-content-wrapper hr-pos-center">
                  <a
                    href={currentItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hr-content-link ${own ? effectClass(entrance) : 'pfx-fg'}`}
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    {currentItem.text}
                  </a>
                </div>
              )}

              {/* End */}
              {currentItem.type === 'end' && projector && <PosterProjectorEnd />}
              {currentItem.type === 'end' && !projector && (
                <div className="hr-text-content-wrapper hr-pos-center" style={{ flexDirection: 'column' }}>
                  <button
                    className="hr-content-end pfx-fg"
                    onClick={returnToMain}
                    style={{ color: textColor, borderColor: textColor }}
                  >
                    {currentItem.text}
                  </button>
                </div>
              )}
            </div>

            {/* Walkthrough Navigation */}
            {currentItem.type !== 'end' && (
              <div className="hr-walkthrough-nav">
                <button
                  className="hr-nav-arrow-btn"
                  onClick={prevStep}
                  disabled={posterStep === 0}
                  aria-label="Previous panel"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  &#8592;
                </button>
                <PosterProgress
                  theme="hr"
                  step={posterStep}
                  fromStep={fromStep}
                  count={currentPosterContent.length}
                  marks={marks}
                  color={textColor}
                />
                <button
                  className="hr-nav-arrow-btn"
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
