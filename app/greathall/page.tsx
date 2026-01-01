'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
          color: #525252;
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

        /* Side Navigation */
        .side-nav {
          position: fixed;
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

        .side-nav:hover .nav-label {
          opacity: 1;
          max-width: 100px;
        }

        .side-nav:hover .nav-m {
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
          }
          .side-nav-right {
            right: 12px;
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

        .side-nav-left:hover .nav-arrow {
          transform: translateX(-4px);
          color: #7D8471;
        }

        .side-nav-right:hover .nav-arrow {
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
          position: fixed;
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

        .explore-hint:hover .explore-text {
          color: #fafafa;
        }

        .explore-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #525252, transparent);
        }

        .explore-text {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #525252;
          transition: color 0.3s ease;
        }

        .explore-arrow {
          font-size: 16px;
          color: #525252;
          animation: float 2.5s ease-in-out infinite;
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
          color: #525252;
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

        /* First floor - lighter green background on hover */
        .floor-row.first-floor:hover .floor-card {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.15);
        }

        /* Ground floor - deeper green background on hover */
        .floor-row.ground-floor:hover .floor-card {
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
          color: #737373;
          transition: color 0.3s ease;
        }

        .floor-row:hover .floor-subtitle {
          color: #999;
        }

        .floor-year {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #525252;
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
          opacity: 0.6;
        }

        .floor-letter {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(4rem, 10vw, 6rem);
          font-weight: 300;
          color: #7D8471;
          line-height: 1;
          transition: color 0.3s ease;
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
          <h1 className="title-main">Great Hall</h1>
        </div>

        {/* Left Navigation - About */}
        <Link href="/about" className="side-nav side-nav-left fade-in delay-3">
          <span className="nav-m">M</span>
          <span className="nav-arrow">←</span>
          <span className="nav-label">About</span>
        </Link>

        {/* Right Navigation - Contact */}
        <Link href="/contact" className="side-nav side-nav-right fade-in delay-3">
          <span className="nav-m">M</span>
          <span className="nav-arrow">→</span>
          <span className="nav-label">Contact</span>
        </Link>

        {/* Explore hint */}
        <div 
          className={`explore-hint fade-in delay-5 ${!showExplore ? 'hidden' : ''}`}
          onClick={scrollToFloors}
        >
          <div className="explore-line"></div>
          <span className="explore-text">Explore</span>
          <span className="explore-arrow">↓</span>
        </div>
      </section>

      {/* Floors Section */}
      <section ref={floorsRef} className="floors-section">
        <p className="floors-title fade-in delay-6">Select a Floor</p>

        <div className="floors-container">
          {/* First Floor - Horizons */}
          <Link href="/exhibitions/first-floor" className="floor-row first-floor">
            <div className="floor-card">
              <div className="floor-text">
                <h2 className="floor-name">Horizons</h2>
                <p className="floor-subtitle">The Second Collection</p>
                <p className="floor-year">2025–2026</p>
                <div className="floor-status">
                  <span className="status-dot"></span>
                  <span>Under Construction</span>
                </div>
              </div>
              <div className="floor-indicator">
                <img src="/stairs.png" alt="" className="stairs-icon" />
                <span className="floor-letter">1</span>
              </div>
            </div>
          </Link>

          {/* Ground Floor - Origins */}
          <Link href="/exhibitions" className="floor-row ground-floor">
            <div className="floor-card">
              <div className="floor-text">
                <h2 className="floor-name">Origins</h2>
                <p className="floor-subtitle">The Founding Collection</p>
                <p className="floor-year">2024–2025</p>
                <div className="floor-status">
                  <span className="status-dot"></span>
                  <span>Under Construction</span>
                </div>
              </div>
              <div className="floor-indicator">
                <img src="/stairs.png" alt="" className="stairs-icon" />
                <span className="floor-letter">G</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}