'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { srOnly, useDialogFocus } from '@/lib/a11y';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { timelineStops } from './timeline-data';
import { RIBBON_START, RIBBON_END, formatYear, ribbonPosition, windowPosition, parseStopParam } from './chronology';
import { coinHref, HANDS_HREF, HANDS_COIN_NAME, COIN_LESSON, lessonHref } from '../story-links';
import { Celebration, SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import PlaceTheCoin from './PlaceTheCoin';


// Axis labels: the two ends and the turn of the era. There is no year 0,
// so "1 AD" sits exactly one year after "1 BC" would.
// The axis runs between the centers of the first and last stop buttons, so
// its ends line up with the button row below it.
const N_STOPS = timelineStops.length;
const AXIS_LO = 0.5 / N_STOPS;
const toAxis = (p: number) => (AXIS_LO + p * (1 - 2 * AXIS_LO)) * 100;

const AXIS_TICKS = [
  { label: formatYear(RIBBON_START), pos: 0, edge: 'start' },
  { label: '1 AD', pos: ribbonPosition({ year: 1, era: 'AD' }), edge: 'era' },
  { label: '30 AD', pos: ribbonPosition({ year: 30, era: 'AD' }), edge: '' },
  { label: formatYear(RIBBON_END), pos: 1, edge: 'end' },
];

export default function GospelTimeline() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Place the coin: at each stop the coin comes first, and the student puts
  // it in its place on the ribbon before the story opens. A teacher can turn
  // it off; "Just show me the story" opens one stop without placing it.
  const [placeMode, setPlaceMode] = useState(true);
  const [placedIds, setPlacedIds] = useState<number[]>([]);
  const [skippedIds, setSkippedIds] = useState<number[]>([]);
  const [allPlaced, setAllPlaced] = useState(false);
  const focusStory = useRef(false);

  const stop = timelineStops[currentIndex];
  const opened = (id: number) => !placeMode || placedIds.includes(id) || skippedIds.includes(id);
  const placing = !opened(stop.id);
  const placingRef = useRef(placing);
  useEffect(() => { placingRef.current = placing; }, [placing]);

  const onPlaced = useCallback(() => {
    focusStory.current = true;
    if (placedIds.includes(stop.id)) return;
    const next = [...placedIds, stop.id];
    setPlacedIds(next);
    if (next.length === timelineStops.length) setAllPlaced(true);
  }, [stop.id, placedIds]);
  const onSkip = useCallback(() => {
    focusStory.current = true;
    setSkippedIds((ids) => (ids.includes(stop.id) ? ids : [...ids, stop.id]));
  }, [stop.id]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === timelineStops.length - 1;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= timelineStops.length || transitioning) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setTransitioning(false), 50);
    }, 400);
  }, [currentIndex, transitioning]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Deep link: /timeline?stop=N opens on stop N (1-based). Read once on
  // arrival; afterwards the address follows the visitor so it can be shared.
  const urlReady = useRef(false);
  useEffect(() => {
    const i = parseStopParam(new URLSearchParams(window.location.search).get('stop'), timelineStops.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off sync from the address bar
    if (i !== null) setCurrentIndex(i);
    urlReady.current = true;
  }, []);
  useEffect(() => {
    if (!urlReady.current) return;
    const url = new URL(window.location.href);
    const want = String(currentIndex + 1);
    if (url.searchParams.get('stop') === want) return;
    url.searchParams.set('stop', want);
    window.history.replaceState(window.history.state, '', url.toString());
  }, [currentIndex]);

  // The story card scrolls on larger screens. Show a cue while more text
  // waits below, and keep it in step with scrolling, resizing and new stops.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const measureBody = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    setMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 6);
  }, []);
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = 0;
    measureBody();
    window.addEventListener('resize', measureBody);
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(measureBody).catch(() => {});
    return () => window.removeEventListener('resize', measureBody);
  }, [currentIndex, placing, measureBody]);
  // When a coin is placed the story opens: keyboard focus goes to it.
  useEffect(() => {
    if (placing || !focusStory.current) return;
    focusStory.current = false;
    bodyRef.current?.focus({ preventScroll: true });
  }, [placing]);
  const scrollBodyDown = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollBy({ top: el.clientHeight * 0.8, behavior: 'smooth' });
  }, []);

  // If a ribbon stop has focus when the stop changes (arrow keys), move
  // focus to the new stop's button so keyboard users keep their place.
  const ribbonRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = ribbonRef.current;
    if (!list || !list.contains(document.activeElement)) return;
    list.querySelectorAll<HTMLButtonElement>('button')[currentIndex]?.focus();
  }, [currentIndex]);

  // Fullscreen painting is a modal dialog: focus moves to Close, Tab stays
  // inside, Escape closes, and focus returns to the painting button.
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const closeModal = useCallback(() => setShowModal(false), []);
  useDialogFocus(modalRef, showModal, { onEscape: closeModal, initialFocus: modalCloseRef });

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showModal) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, showModal]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    // While a coin is being placed, a finger moving across the screen is
    // dragging the coin, not turning the page.
    if (placingRef.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Initial load animation
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Preload adjacent images
  useEffect(() => {
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    if (currentIndex > 0) {
      preload(timelineStops[currentIndex - 1].painting);
      preload(timelineStops[currentIndex - 1].coinImage);
    }
    if (currentIndex < timelineStops.length - 1) {
      preload(timelineStops[currentIndex + 1].painting);
      preload(timelineStops[currentIndex + 1].coinImage);
    }
  }, [currentIndex]);

  return (
    <div
      className={`tl-page ${loaded ? 'tl-loaded' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tl-page {
          position: fixed;
          inset: 0;
          background: #1C1409;
          color: #fafafa;
          overflow: hidden;
          font-family: 'Cormorant Garamond', serif;
        }

        /* ========== BACKGROUND PAINTING ========== */
        .tl-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: opacity 0.6s ease;
        }
        .tl-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.18;
        }
        .tl-bg.fading { opacity: 0; }
        .tl-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(28, 20, 9, 0.3) 0%,
            rgba(28, 20, 9, 0.1) 30%,
            rgba(28, 20, 9, 0.4) 70%,
            rgba(28, 20, 9, 0.95) 100%
          );
        }

        /* ========== HEADER ========== */
        .tl-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
        }

        .tl-back-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .tl-back-btn:hover { color: #fafafa; }
        .tl-back-btn span { font-size: 18px; }

        .tl-counter {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #C9A84C;
          opacity: 0.7;
        }

        /* ========== MAIN LAYOUT ========== */
        .tl-main {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100vh;
          height: 100dvh;
          padding: 80px 35vw 130px 60px;
          gap: 48px;
        }

        /* ========== COIN ========== */
        .tl-coin-area {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tl-coin-wrapper {
          position: relative;
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tl-coin-wrapper.entering-right {
          opacity: 0;
          transform: translateX(40px) scale(0.95);
        }
        .tl-coin-wrapper.entering-left {
          opacity: 0;
          transform: translateX(-40px) scale(0.95);
        }
        .tl-coin-wrapper.visible {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .tl-coin-img {
          width: min(35vh, 35vw);
          max-width: 360px;
          height: auto;
          filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5)) drop-shadow(0 8px 20px rgba(201, 168, 76, 0.1));
          animation: tl-coin-float 5s ease-in-out infinite;
        }

        @keyframes tl-coin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ========== PARCHMENT CARD ========== */
        .tl-card-area {
          flex: 1;
          max-width: 520px;
          min-width: 0;
        }

        .tl-card {
          background: #F5EDD8;
          border-radius: 4px;
          padding: 28px 36px 22px;
          height: min(68vh, 620px);
          display: flex;
          flex-direction: column;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 2px 10px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.3);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .tl-card-header {
          flex-shrink: 0;
        }

        .tl-card-body {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 8px;
        }
        .tl-card-body::-webkit-scrollbar {
          width: 4px;
        }
        .tl-card-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .tl-card-body::-webkit-scrollbar-thumb {
          background: rgba(139, 125, 107, 0.3);
          border-radius: 2px;
        }
        .tl-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          background:
            radial-gradient(ellipse at 20% 80%, rgba(180,160,120,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(180,160,120,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .tl-card.entering-right {
          opacity: 0;
          transform: translateX(60px);
        }
        .tl-card.entering-left {
          opacity: 0;
          transform: translateX(-60px);
        }
        .tl-card.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .tl-card-ruler {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 400;
          color: #C9A84C;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .tl-card-coin {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8B7D6B;
          margin-bottom: 16px;
        }

        .tl-card-reference {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          color: #6B5D4D;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.2);
        }

        .tl-card-passage {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 1.4vw, 1.05rem);
          font-style: italic;
          line-height: 1.7;
          color: #5A4E3E;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.15);
        }

        .tl-card-story {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          line-height: 1.8;
          color: #3D3428;
        }

        /* ========== PAINTING INSET ========== */
        .tl-painting-inset {
          position: fixed;
          top: 50%;
          right: 32px;
          transform: translateY(-50%);
          z-index: 5;
          transition: opacity 0.5s ease;
        }
        .tl-painting-inset.fading { opacity: 0; }

        .tl-painting-btn {
          display: block;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 4px;
        }
        .tl-painting-inset img {
          display: block;
          height: auto;
          width: auto;
          max-height: min(55vh, 500px);
          max-width: calc(35vw - 56px);
          object-fit: contain;
          border-radius: 4px;
          box-shadow:
            0 16px 50px rgba(0,0,0,0.5),
            0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid rgba(201, 168, 76, 0.12);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .tl-painting-inset img:hover {
          transform: scale(1.02);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.6),
            0 6px 16px rgba(0,0,0,0.4);
        }

        /* ========== PAINTING MODAL ========== */
        .tl-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .tl-modal-backdrop.open {
          opacity: 1;
          visibility: visible;
        }
        .tl-modal-backdrop img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        }
        .tl-modal-close {
          position: fixed;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.5);
          color: #fafafa;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 310;
        }
        .tl-modal-close:hover {
          background: rgba(255,255,255,0.15);
        }

        /* ========== NAVIGATION ========== */
        .tl-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 28px 32px 18px;
          background: linear-gradient(to top, rgba(28, 20, 9, 0.97) 0%, rgba(28, 20, 9, 0.85) 60%, rgba(28, 20, 9, 0) 100%);
        }

        .tl-nav-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: rgba(28, 20, 9, 0.6);
          backdrop-filter: blur(8px);
          color: #C9A84C;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tl-nav-arrow:hover {
          background: rgba(201, 168, 76, 0.15);
          border-color: #C9A84C;
        }
        .tl-nav-arrow:disabled {
          opacity: 0;
          pointer-events: none;
        }

        /* ========== DATE RIBBON ========== */
        .tl-ribbon {
          flex: 1;
          max-width: 620px;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .tl-axis {
          position: relative;
          height: 26px;
        }
        .tl-axis-line {
          position: absolute;
          left: calc(50% / var(--n));
          right: calc(50% / var(--n));
          top: 19px;
          height: 1px;
          background: rgba(245, 237, 216, 0.35);
        }
        .tl-axis-tick {
          position: absolute;
          top: 15px;
          width: 1px;
          height: 9px;
          background: rgba(245, 237, 216, 0.45);
        }
        .tl-axis-label {
          position: absolute;
          bottom: 11px;
          left: 0;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(245, 237, 216, 0.75);
          white-space: nowrap;
        }
        .tl-axis-tick.start .tl-axis-label, .tl-axis-tick.era .tl-axis-label { transform: none; }
        .tl-axis-tick.end .tl-axis-label { transform: translateX(-100%); }
        .tl-axis-mark {
          position: absolute;
          top: 17px;
          height: 5px;
          border-radius: 3px;
          background: rgba(201, 168, 76, 0.55);
          transform: translateX(-1px);
        }
        .tl-axis-mark.active {
          top: 15px;
          height: 9px;
          background: #E2C36B;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.6);
        }
        .tl-leaders {
          display: block;
          width: 100%;
          height: 14px;
          overflow: visible;
        }
        .tl-leaders line {
          stroke: rgba(201, 168, 76, 0.35);
          stroke-width: 1;
        }
        .tl-leaders line.active {
          stroke: #E2C36B;
          stroke-width: 1.5;
        }
        .tl-stops {
          list-style: none;
          display: grid;
          margin: 0;
          padding: 0;
        }
        .tl-stops li { display: flex; justify-content: center; }
        .tl-stop {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid rgba(201, 168, 76, 0.5);
          background: rgba(28, 20, 9, 0.75);
          color: #F5EDD8;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .tl-stop:hover { border-color: #E2C36B; background: rgba(201, 168, 76, 0.18); }
        .tl-stop.active {
          background: #E2C36B;
          border-color: #E2C36B;
          color: #1C1409;
          font-weight: 500;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
        }
        .tl-stop:focus-visible, .tl-nav-arrow:focus-visible, .tl-link:focus-visible,
        .tl-end-btn:focus-visible, .tl-back-btn:focus-visible {
          outline: 2px solid #F5EDD8;
          outline-offset: 2px;
        }

        /* ========== CARD FOOTER: LINKS AND EXIT ========== */
        .tl-card-when {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7A5F1E;
          margin-bottom: 4px;
        }
        .tl-card-scroll {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .tl-card-more {
          position: absolute;
          left: 0;
          right: 8px;
          bottom: 0;
          height: 56px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(to bottom, rgba(245, 237, 216, 0) 0%, #F5EDD8 75%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .tl-card-more.on { opacity: 1; }
        .tl-card-more.on .tl-card-more-btn { pointer-events: auto; }
        .tl-card-more-btn {
          border: 1px solid rgba(122, 95, 30, 0.45);
          border-radius: 100px;
          background: #F5EDD8;
          color: #5E4914;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          cursor: pointer;
        }
        .tl-card-footer {
          flex-shrink: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px 16px;
          padding-top: 14px;
          margin-top: 8px;
          border-top: 1px solid rgba(139, 125, 107, 0.25);
        }
        .tl-links {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          margin: 0;
          padding: 0;
        }
        /* a:link in globals.css is (0,1,1): out-rank it */
        .tl-links a.tl-link {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #6B4F12;
          text-decoration: underline;
          text-decoration-color: rgba(107, 79, 18, 0.4);
          text-underline-offset: 3px;
          display: inline-block;
          padding: 4px 0;
        }
        .tl-links a.tl-link:hover { color: #3D2C06; text-decoration-color: currentColor; }
        .tl-card-footer a.tl-end-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: 100px;
          border: 1px solid #6B4F12;
          background: #3D3428;
          color: #F5EDD8;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .tl-card-footer a.tl-end-btn:hover { background: #1C1409; }

        /* ========== LOAD ANIMATION ========== */
        .tl-page { opacity: 0; transition: opacity 0.6s ease; }
        .tl-page.tl-loaded { opacity: 1; }

        /* ========== MOBILE ========== */
        @media (max-width: 900px) {
          .tl-main {
            flex-direction: column;
            padding: 80px 24px 120px;
            gap: 24px;
            justify-content: flex-start;
            overflow-y: auto;
          }
          .tl-coin-img {
            width: min(40vw, 30vh);
            max-width: 220px;
          }
          .tl-card {
            padding: 28px 24px;
            height: auto;
            max-height: none;
          }
          /* One scroll (the page), not a scroll inside a scroll */
          .tl-card-body { overflow: visible; padding-right: 0; }
          .tl-card-more { display: none; }
          /* The page scrolls under the header and the ribbon here: give them ground */
          .tl-header { background: linear-gradient(to bottom, #1C1409 0%, #1C1409 70%, rgba(28, 20, 9, 0) 100%); padding-bottom: 28px; }
          .tl-nav { background: linear-gradient(to top, #1C1409 0%, #1C1409 82%, rgba(28, 20, 9, 0) 100%); }
          .tl-card-area {
            max-width: 100%;
          }
          .tl-painting-inset {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .tl-main {
            padding: 70px 16px 110px;
            gap: 16px;
          }
          .tl-coin-img {
            width: min(50vw, 25vh);
            max-width: 180px;
          }
          .tl-card {
            padding: 24px 20px;
          }
          /* Sit clear of the site's MAP button in the bottom-right corner */
          .tl-main { padding-bottom: 190px; }
          .tl-nav {
            gap: 6px;
            padding: 24px 10px 76px;
          }
          .tl-nav-arrow { width: 34px; height: 34px; font-size: 16px; flex-shrink: 0; }
          .tl-stop { width: 24px; height: 24px; font-size: 10px; }
          .tl-axis-tick.era .tl-axis-label { display: none; }
        }
        /* ========== PLACE THE COIN ========== */
        .tl-sr {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
        .tl-header-right { display: flex; align-items: center; gap: 12px; }
        .tl-place-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          min-height: 44px; padding: 0 16px; border-radius: 100px;
          border: 1px solid currentColor; background: transparent;
          color: #C9A84C; font-family: 'Outfit', sans-serif;
          font-size: clamp(13px, 0.5vw + 9px, 16px); letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
        }
        .tl-place-toggle[aria-pressed='true'] { background: rgba(201, 168, 76, 0.16); }
        .tl-place-toggle:focus-visible { outline: 2px solid #F5EDD8; outline-offset: 3px; }
        .tl-place-coin {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          background: none; border: none; padding: 8px; color: inherit;
          cursor: grab; touch-action: none; border-radius: 50%;
          -webkit-user-select: none; user-select: none; -webkit-touch-callout: none;
        }
        .tl-place-coin:focus-visible { outline: 3px solid #F5EDD8; outline-offset: 6px; border-radius: 24px; }
        .tl-place-coin.picked .tl-coin-img { filter: drop-shadow(0 0 28px rgba(226, 195, 107, 0.85)); }
        .tl-place-coin.dragging { cursor: grabbing; }
        .tl-place-coin.dragging .tl-coin-img { opacity: 0.35; }
        .tl-place-coin.placed { cursor: default; }
        .tl-place-coin.placed .tl-coin-img { opacity: 0.5; }
        .tl-place-coin-cue {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(14px, 0.5vw + 10px, 18px);
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #E2C36B;
          border: 1px dashed rgba(226, 195, 107, 0.6); border-radius: 100px;
          padding: 6px 16px;
        }
        .tl-place-card { overflow-y: auto; height: auto; max-height: calc(100dvh - 210px); padding-top: 22px; }
        .tl-place-kicker {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(13px, 0.4vw + 10px, 16px);
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #7A5F1E; margin-bottom: 4px;
        }
        .tl-place-passage {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.02rem, 0.4vw + 0.88rem, 1.22rem);
          font-style: italic; line-height: 1.55; color: #5A4E3E;
          margin-bottom: 12px;
        }
        .tl-place-ask {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(15px, 0.4vw + 12px, 18px);
          line-height: 1.5; color: #3D3428; margin-bottom: 14px;
        }
        .tl-place-ribbon {
          list-style: none; margin: 0 0 12px; padding: 12px 10px;
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
          border-radius: 8px;
          background: linear-gradient(to bottom, #2a1f0e, #1C1409);
          box-shadow: inset 0 0 0 1px rgba(201, 168, 76, 0.45);
          position: relative;
        }
        .tl-place-ribbon.armed { box-shadow: inset 0 0 0 2px #E2C36B, 0 0 18px rgba(226, 195, 107, 0.45); }
        .tl-place-slot {
          width: 100%; min-height: 56px; padding: 6px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          border-radius: 6px; border: 1.5px dashed rgba(226, 195, 107, 0.55);
          background: rgba(245, 237, 216, 0.04); color: #F5EDD8;
          font-family: 'Outfit', sans-serif;
          font-size: clamp(14px, 0.4vw + 11px, 17px);
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .tl-place-slot:hover, .tl-place-slot.over { background: rgba(226, 195, 107, 0.2); border-color: #E2C36B; border-style: solid; }
        .tl-place-slot:focus-visible { outline: 3px solid #F5EDD8; outline-offset: 2px; }
        .tl-place-slot.missed {
          cursor: default; opacity: 0.5; text-decoration: line-through;
          border-color: rgba(238, 138, 42, 0.8); animation: tl-place-shake 0.4s ease;
        }
        .tl-place-slot.missed:hover { background: rgba(245, 237, 216, 0.04); }
        .tl-place-slot.here { border: 2px solid #7BC67B; background: rgba(123, 198, 123, 0.18); }
        .tl-place-slot-coins { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px; min-height: 0; }
        .tl-place-slot-coins img { width: 22px; height: 22px; object-fit: contain; }
        .tl-place-slot-coins img.tl-place-snap { width: 34px; height: 34px; animation: tl-place-snap 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
        @keyframes tl-place-snap { from { transform: scale(2.2); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes tl-place-shake {
          0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }
        }
        .tl-place-message {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(15px, 0.4vw + 12px, 18px);
          line-height: 1.45; color: #3D3428; margin: 0; flex: 1 1 14em;
        }
        .tl-place-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; min-height: 44px; }
        .tl-place-message.wrong { color: #8a4a00; }
        .tl-place-message.right { color: #2f6b40; font-weight: 500; }
        .tl-place-skip {
          flex: 0 0 auto; min-height: 44px; padding: 8px 18px; border-radius: 100px;
          border: 1px solid rgba(107, 79, 18, 0.5); background: transparent; color: #5E4914;
          font-family: 'Outfit', sans-serif; font-size: clamp(14px, 0.3vw + 11px, 16px);
          cursor: pointer;
        }
        .tl-place-skip:focus-visible { outline: 2px solid #3D3428; outline-offset: 2px; }
        .tl-place-ghost {
          position: fixed; z-index: 2147483000; width: 110px; height: auto;
          transform: translate(-50%, -50%) scale(1.05); pointer-events: none;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6));
        }
        @media (max-width: 900px) {
          .tl-place-card { overflow: visible; max-height: none; }
          /* The coin stays in view while the page scrolls down to the
             ribbon, so it can be dragged there. */
          .tl-place-coin-area {
            position: sticky; top: 56px; z-index: 4; align-self: stretch;
            background: linear-gradient(to bottom, #1C1409 0%, #1C1409 78%, rgba(28, 20, 9, 0) 100%);
            padding-bottom: 10px;
          }
          .tl-place-coin { gap: 6px; padding: 4px; }
          .tl-place-coin .tl-coin-img { width: min(30vw, 15vh); animation: none; }
        }
        @media (max-width: 600px) {
          .tl-header { padding: 14px 16px 24px; }
          .tl-header-right { gap: 8px; }
          .tl-place-toggle { width: 44px; padding: 0; justify-content: center; }
          .tl-place-toggle-label {
            position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
          }
          .tl-place-ribbon { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-place-slot.missed, .tl-place-slot-coins img.tl-place-snap { animation: none; }
        }
      `}</style>

      {/* Background painting */}
      <div className={`tl-bg ${transitioning ? 'fading' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stop.painting} alt="" aria-hidden="true" />
        <div className="tl-bg-overlay" />
      </div>

      <div style={srOnly} role="status" aria-live="polite">
        {!loaded
          ? ''
          : placing
            ? `Stop ${currentIndex + 1} of ${timelineStops.length}: ${stop.ruler}. Place the coin on the ribbon.`
            : `Stop ${currentIndex + 1} of ${timelineStops.length}: ${stop.ruler}, ${stop.when.label}`}
      </div>

      {/* Header */}
      <header className="tl-header">
        <button className="tl-back-btn" onClick={() => router.push('/exhibitions/in-their-hands/artifacts/case-6?view=interactives')}>
          <span>{'\u2190'}</span>
          Display Case
        </button>
        <div className="tl-header-right">
          <SoundSwitch className="tl-header-btn" style={{ color: '#C9A84C', fontFamily: "'Outfit', sans-serif" }} />
          <button
            type="button"
            className="tl-header-btn tl-place-toggle"
            aria-pressed={placeMode}
            onClick={() => setPlaceMode((m) => !m)}
          >
            <span aria-hidden="true">{'\u25CE'}</span> <span className="tl-place-toggle-label">Place the coins</span>
          </button>
          <span className="tl-counter">{stop.id} / {timelineStops.length}</span>
        </div>
      </header>

      {/* Main content */}
      <div className="tl-main">
        {placing ? (
          <PlaceTheCoin
            key={stop.id}
            stop={stop}
            placedStops={timelineStops.filter((s) => placedIds.includes(s.id))}
            enterClass={transitioning ? (direction === 'right' ? 'entering-right' : 'entering-left') : 'visible'}
            onPlaced={onPlaced}
            onSkip={onSkip}
          />
        ) : (<>
        {/* Coin */}
        <div className="tl-coin-area">
          <div className={`tl-coin-wrapper ${transitioning ? (direction === 'right' ? 'entering-right' : 'entering-left') : 'visible'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tl-coin-img"
              src={stop.coinImage}
              alt={stop.ruler}
            />
          </div>
        </div>

        {/* Parchment card */}
        <div className="tl-card-area">
          <div className={`tl-card ${transitioning ? (direction === 'right' ? 'entering-right' : 'entering-left') : 'visible'}`}>
            <div className="tl-card-header">
              <p className="tl-card-when">{stop.when.label}</p>
              <h2 className="tl-card-ruler">{stop.ruler}</h2>
              <p className="tl-card-coin">{stop.coin}</p>
              <p className="tl-card-reference">{stop.reference}</p>
            </div>
            <div className="tl-card-scroll">
              <div className="tl-card-body" ref={bodyRef} onScroll={measureBody} tabIndex={0} role="region" aria-label={`${stop.ruler}: passage and story`}>
                <p className="tl-card-passage">&ldquo;{stop.passage}&rdquo;</p>
                <p className="tl-card-story">{stop.story}</p>
              </div>
              <div className={`tl-card-more ${moreBelow ? 'on' : ''}`} aria-hidden="true">
                <button type="button" tabIndex={-1} className="tl-card-more-btn" onClick={scrollBodyDown}>
                  More below <span>{'\u2193'}</span>
                </button>
              </div>
            </div>

            {/* Links and the exit sit outside the scrolling text, always in view */}
            <div className="tl-card-footer">
              <ul className="tl-links" aria-label={`More about the ${stop.ruler} coin`}>
                <li><Link className="tl-link" href={coinHref(stop.coinId)}>See the coin in 3D</Link></li>
                {HANDS_COIN_NAME[stop.coinId] && (
                  <li><Link className="tl-link" href={HANDS_HREF}>Hands of History</Link></li>
                )}
                {COIN_LESSON[stop.coinId] && (
                  <li><Link className="tl-link" href={lessonHref(COIN_LESSON[stop.coinId]!.slug)}>Lesson: {COIN_LESSON[stop.coinId]!.title}</Link></li>
                )}
              </ul>
              {isLast && (
                <Link className="tl-end-btn" href="/exhibitions/in-their-hands/artifacts/case-6?view=interactives">
                  Back to Display Case <span aria-hidden="true">{'\u2192'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        </>)}
        {allPlaced && <Celebration />}
      </div>

      {/* Painting inset — right side, click for fullscreen */}
      <div className={`tl-painting-inset ${transitioning ? 'fading' : ''}`}>
        <button type="button" className="tl-painting-btn" onClick={() => setShowModal(true)}
          aria-haspopup="dialog" aria-label={`View painting full screen: ${stop.ruler}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={stop.painting} alt="" />
        </button>
      </div>

      {/* Fullscreen painting modal */}
      <div
        ref={modalRef}
        className={`tl-modal-backdrop ${showModal ? 'open' : ''}`}
        onClick={() => setShowModal(false)}
        role="dialog"
        aria-modal="true"
        aria-label={`${stop.ruler} — painting`}
        inert={!showModal}
      >
        <button type="button" ref={modalCloseRef} className="tl-modal-close" onClick={() => setShowModal(false)} aria-label="Close"><span aria-hidden="true">{'\u00D7'}</span></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stop.painting} alt={`${stop.ruler} — painting`} />
      </div>

      {/* Navigation: arrows either side of a date ribbon, 5 BC to 62 AD */}
      <nav className="tl-nav" aria-label="Timeline stops">
        <button
          className="tl-nav-arrow tl-prev"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous stop"
        >
          <span aria-hidden="true">{'\u2190'}</span>
        </button>

        <div className="tl-ribbon" style={{ '--n': N_STOPS } as React.CSSProperties}>
          <div className="tl-axis" aria-hidden="true">
            <span className="tl-axis-line" />
            {AXIS_TICKS.map(t => (
              <span key={t.label} className={`tl-axis-tick ${t.edge}`} style={{ left: `${toAxis(t.pos)}%` }}>
                <span className="tl-axis-label">{t.label}</span>
              </span>
            ))}
            {timelineStops.map((s, i) => {
              const a = ribbonPosition(s.when.from);
              const b = s.when.to ? ribbonPosition(s.when.to) : a;
              return (
                <span key={s.id}
                  className={`tl-axis-mark ${i === currentIndex && !placing ? 'active' : ''}`}
                  style={{ left: `${toAxis(a)}%`, width: `max(3px, ${toAxis(b) - toAxis(a)}%)` }} />
              );
            })}
          </div>
          <svg className="tl-leaders" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {timelineStops.map((s, i) => (
              <line key={s.id}
                className={i === currentIndex && !placing ? 'active' : ''}
                x1={toAxis(windowPosition(s.when.from, s.when.to))} y1={0}
                x2={((i + 0.5) / timelineStops.length) * 100} y2={10}
                vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <ol className="tl-stops" ref={ribbonRef} style={{ gridTemplateColumns: `repeat(${timelineStops.length}, 1fr)` }}>
            {timelineStops.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`tl-stop ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={opened(s.id) ? `Stop ${i + 1}: ${s.ruler}, ${s.when.label}` : `Stop ${i + 1}: ${s.ruler}`}
                  aria-current={i === currentIndex ? 'step' : undefined}
                >
                  <span aria-hidden="true">{i + 1}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <button
          className="tl-nav-arrow tl-next"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next stop"
        >
          <span aria-hidden="true">{'\u2192'}</span>
        </button>
      </nav>
    </div>
  );
}
