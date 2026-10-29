'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { focusElement } from '@/lib/a11y/focus';
import { type Floor, type StudioFloor, ALL_FLOORS } from '@/lib/floors';

const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** "Four Exhibitions": how many of a floor's exhibitions are open; on the Studio, how many tools. */
function openCount(floor: Floor | StudioFloor): string {
  const [n, noun] = 'tools' in floor ? [floor.tools.length, 'Tool'] : [floor.exhibitions.filter((e) => e.active).length, 'Exhibition'];
  return `${COUNT_WORDS[n] ?? n} ${noun}${n === 1 ? '' : 's'}`;
}

/** The floors as the stairs climb them: the top floor first. */
const FLOORS_TOP_FIRST = [...ALL_FLOORS].reverse();

export default function GreatHall() {
  const [showExplore, setShowExplore] = useState(true);
  const floorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowExplore(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFloors = () => {
    floorsRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Keyboard users follow the scroll rather than staying on the (now hidden) hint
    focusElement(floorsRef.current);
  };

  return (
    <div className="great-hall-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: #0a0a0a;
          color: #fafafa;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }

        .fade-in-up {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.2s; opacity: 0; }
        .delay-2 { animation-delay: 0.4s; opacity: 0; }
        .delay-3 { animation-delay: 0.6s; opacity: 0; }
        .delay-4 { animation-delay: 0.8s; opacity: 0; }
        .delay-5 { animation-delay: 1s; opacity: 0; }
        .delay-6 { animation-delay: 1.2s; opacity: 0; }

        .great-hall-container {
          background: #0a0a0a;
          min-height: 100vh;
        }

        /* Hero Section */
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Title */
        .title-container {
          text-align: center;
        }

        .title-the {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(14px, 2vw, 18px);
          font-weight: 300;
          letter-spacing: 0.3em;
          color: #808080;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .title-main {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3.5rem, 12vw, 9rem);
          font-weight: 300;
          line-height: 0.9;
          color: #fafafa;
          letter-spacing: -0.02em;
        }

        .title-main .title-word {
          display: inline;
        }

        @media (max-width: 480px) {
          .title-main .title-word {
            display: block;
          }
          .title-main {
            line-height: 1;
          }
        }

        /* Side Navigation */
        .side-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 20px;
        }

        .side-nav:hover .nav-label, .side-nav:focus-visible .nav-label {
          opacity: 1;
          max-width: 100px;
        }

        .side-nav:hover .nav-m, .side-nav:focus-visible .nav-m {
          color: #fafafa;
        }

        .side-nav-left {
          left: 24px;
          flex-direction: row;
        }

        .side-nav-right {
          right: 24px;
          flex-direction: row-reverse;
        }

        @media (max-width: 768px) {
          .side-nav-left {
            left: 12px;
            padding: 16px;
          }
          .side-nav-right {
            right: 12px;
            padding: 16px;
          }
          .nav-m {
            font-size: 26px;
          }
          .nav-arrow {
            font-size: 14px;
          }
        }

        .nav-m {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 300;
          color: #525252;
          transition: color 0.3s ease;
        }

        .nav-arrow {
          font-size: 18px;
          color: #525252;
          transition: all 0.3s ease;
        }

        .side-nav-left:hover .nav-arrow, .side-nav-left:focus-visible .nav-arrow {
          transform: translateX(-4px);
          color: #7D8471;
        }

        .side-nav-right:hover .nav-arrow, .side-nav-right:focus-visible .nav-arrow {
          transform: translateX(4px);
          color: #7D8471;
        }

        .nav-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 14px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
          letter-spacing: 0.05em;
        }

        /* Explore hint */
        .explore-hint {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.5s ease;
          z-index: 100;
        }

        .explore-hint.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .explore-hint:hover .explore-text, .explore-hint:focus-visible .explore-text {
          color: #fafafa;
        }

        .explore-line {
          display: block;
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #525252, transparent);
        }

        .explore-text {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #808080;
          transition: color 0.3s ease;
        }

        .explore-arrow {
          font-size: 16px;
          color: #808080;
          animation: float 2.5s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .explore-hint {
            bottom: 32px;
            gap: 12px;
          }
          .explore-line {
            height: 40px;
          }
        }

        /* Floors Section */
        .floors-section {
          min-height: 100vh;
          padding: 120px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .floors-title {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #808080;
          margin-bottom: 60px;
        }

        /* Floors container */
        .floors-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 700px;
        }

        /* Individual floor row */
        .floor-row {
          position: relative;
          width: 100%;
          cursor: pointer;
        }

        /* Floor card - hidden by default, appears on hover */
        .floor-card {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          padding: 32px 40px;
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.4s ease;
        }

        /* The Studio - warm brass background on hover */
        .floor-row.third-floor:hover .floor-card, .floor-row.third-floor:focus-visible .floor-card {
          border-color: #a8794a;
          background: rgba(224, 164, 88, 0.1);
        }

        /* Second floor - slate blue background on hover */
        .floor-row.second-floor:hover .floor-card, .floor-row.second-floor:focus-visible .floor-card {
          border-color: #6b7a8f;
          background: rgba(147, 163, 184, 0.12);
        }

        /* First floor - lighter green background on hover */
        .floor-row.first-floor:hover .floor-card, .floor-row.first-floor:focus-visible .floor-card {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.15);
        }

        /* Ground floor - deeper green background on hover */
        .floor-row.ground-floor:hover .floor-card, .floor-row.ground-floor:focus-visible .floor-card {
          border-color: #5a6350;
          background: rgba(90, 99, 80, 0.2);
        }

        /* Left side - text content */
        .floor-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }

        .floor-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 300;
          color: #fafafa;
          line-height: 1;
          transition: color 0.3s ease;
        }

        .floor-row:hover .floor-name {
          color: #fff;
        }

        .floor-subtitle {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-style: italic;
          font-weight: 300;
          color: #919191;
          transition: color 0.3s ease;
        }

        .floor-row:hover .floor-subtitle {
          color: #999;
        }

        .floor-year {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #858585;
          margin-top: 4px;
        }

        .floor-status {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7D8471;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .floor-status-open {
          color: #a9b39c;
        }

        .floor-status-open .status-dot {
          background: #a9b39c;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7D8471;
          animation: pulse 2s ease-in-out infinite;
        }

        /* Right side - stairs icon and floor number */
        .floor-indicator {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stairs-icon {
          height: clamp(4rem, 10vw, 6rem);
          width: auto;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .floor-row:hover .stairs-icon {
          opacity: 1;
        }

        .floor-letter {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(4rem, 10vw, 6rem);
          font-weight: 300;
          color: #7D8471;
          line-height: 1;
          transition: color 0.3s ease;
        }

        /* The Studio - brass on hover */
        .floor-row.third-floor:hover .floor-letter {
          color: #f0c99a;
        }

        /* Second floor - slate blue on hover */
        .floor-row.second-floor:hover .floor-letter {
          color: #c3cede;
        }

        /* First floor - lighter green on hover */
        .floor-row.first-floor:hover .floor-letter {
          color: #c8d4bc;
        }

        /* Ground floor - darker green on hover */
        .floor-row.ground-floor:hover .floor-letter {
          color: #9aa78f;
        }

        @media (max-width: 768px) {
          .floor-card {
            padding: 24px;
          }
          
          .floor-indicator {
            gap: 12px;
          }

          .stairs-icon {
            height: clamp(3rem, 8vw, 4rem);
          }
        }

        /* Scroll indicator on side */
        .scroll-indicator {
          position: fixed;
          right: 32px;
          bottom: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 100;
        }

        .scroll-indicator.visible {
          opacity: 1;
        }

        .scroll-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #333;
          transition: all 0.3s ease;
        }

        .scroll-dot.active {
          background: #7D8471;
        }

        @media (max-width: 768px) {
          .floors-section {
            padding: 80px 16px;
          }
          
          .stair-step {
            padding: 32px 24px;
          }

          .stair:nth-child(3) {
            width: 92%;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        {/* Title */}
        <div className="title-container fade-in-up">
          <p className="title-the">The</p>
          <h1 className="title-main"><span className="title-word">Great</span> <span className="title-word">Hall</span></h1>
        </div>

        {/* Left Navigation - About */}
        <Link href="/about" className="side-nav side-nav-left fade-in delay-3">
          <span className="nav-m" aria-hidden="true">M</span>
          <span className="nav-arrow" aria-hidden="true">←</span>
          <span className="nav-label">About</span>
        </Link>

        {/* Right Navigation - Contact */}
        <Link href="/contact" className="side-nav side-nav-right fade-in delay-3">
          <span className="nav-m" aria-hidden="true">M</span>
          <span className="nav-arrow" aria-hidden="true">→</span>
          <span className="nav-label">Contact</span>
        </Link>

        {/* Explore hint */}
        <button
          type="button"
          className={`btn-reset explore-hint fade-in delay-5 ${!showExplore ? 'hidden' : ''}`}
          onClick={scrollToFloors}
          aria-label="Explore the floors"
          tabIndex={showExplore ? 0 : -1}
          aria-hidden={showExplore ? undefined : true}
        >
          <span className="explore-line"></span>
          <span className="explore-text">Explore</span>
          <span className="explore-arrow">↓</span>
        </button>
      </section>

      {/* Floors Section */}
      <section ref={floorsRef} className="floors-section" aria-label="Select a Floor">
        <p className="floors-title fade-in delay-6">Select a Floor</p>

        <div className="floors-container">
          {FLOORS_TOP_FIRST.map((floor) => (
            <Link key={floor.path} href={floor.path} className={`floor-row ${floor.path.split('/').pop()}`}>
              <div className="floor-card">
                <div className="floor-text">
                  <h2 className="floor-name">{floor.title}</h2>
                  <p className="floor-subtitle">{floor.theme}</p>
                  <div className="floor-status floor-status-open">
                    <span className="status-dot" aria-hidden="true"></span>
                    <span>Now Open · {openCount(floor)}</span>
                  </div>
                </div>
                <div className="floor-indicator">
                  <Image src="/stairs.png" alt="" width={80} height={80} className="stairs-icon" aria-hidden="true" />
                  <span className="floor-letter">{floor.marker}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}