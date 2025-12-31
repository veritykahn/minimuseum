'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GreatHall() {
  const [currentFloor, setCurrentFloor] = useState(0);

  const floors = [
    { id: 0, name: 'Ground Floor', year: '2024–2025', href: '/exhibitions' },
    { id: 1, name: 'First Floor', year: 'Coming Soon', href: '#' },
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflow: 'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          overflow: hidden;
          height: 100%;
          background: #000;
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

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }

        .fade-in {
          animation: fadeIn 2s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.3s; opacity: 0; }
        .delay-2 { animation-delay: 0.6s; opacity: 0; }
        .delay-3 { animation-delay: 1s; opacity: 0; }
        .delay-4 { animation-delay: 1.5s; opacity: 0; }

        /* Main container */
        .great-hall {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Background Image */
        .hall-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hall-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* Subtle vignette overlay */
        .hall-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* Side navigation */
        .side-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 20px;
        }

        .side-nav:hover .nav-label {
          opacity: 1;
          transform: translateY(0);
        }

        .side-nav:hover .nav-arrow {
          color: #d4af37;
        }

        .side-nav-left {
          left: 24px;
        }

        .side-nav-right {
          right: 24px;
        }

        @media (max-width: 768px) {
          .side-nav-left {
            left: 12px;
          }
          .side-nav-right {
            right: 12px;
          }
          .side-nav {
            padding: 12px;
          }
        }

        .nav-arrow {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          color: rgba(212, 175, 55, 0.5);
          transition: all 0.3s ease;
        }

        .nav-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: #d4af37;
          opacity: 0;
          transform: translateY(-5px);
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
        }

        /* Floor navigation - vertical on right */
        .floor-nav {
          position: fixed;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .floor-nav {
            right: 16px;
          }
        }

        .floor-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1));
        }

        .floor-dot {
          width: 10px;
          height: 10px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .floor-dot:hover {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.2);
        }

        .floor-dot.active {
          border-color: #d4af37;
          background: #d4af37;
        }

        .floor-dot-label {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          color: rgba(212, 175, 55, 0.6);
          letter-spacing: 0.2em;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .floor-dot:hover .floor-dot-label,
        .floor-dot.active .floor-dot-label {
          opacity: 1;
          color: #d4af37;
        }

        /* Bottom explore/enter */
        .explore-hint {
          position: fixed;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          z-index: 100;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .explore-hint:hover {
          transform: translateX(-50%) translateY(-5px);
        }

        .explore-hint:hover .explore-text {
          color: #d4af37;
        }

        .explore-hint:hover .explore-arrow {
          color: #d4af37;
        }

        .explore-text {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.5);
          transition: color 0.3s ease;
        }

        .explore-arrow {
          font-size: 18px;
          color: rgba(212, 175, 55, 0.5);
          animation: float 2.5s ease-in-out infinite;
          transition: color 0.3s ease;
        }

        /* Floor info - bottom right */
        .floor-info {
          position: fixed;
          bottom: 48px;
          right: 32px;
          text-align: right;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .floor-info {
            bottom: 100px;
            right: 16px;
          }
        }

        .floor-name {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.4);
          margin-bottom: 4px;
        }

        .floor-year {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: rgba(212, 175, 55, 0.7);
        }

        /* Home link - top left */
        .home-link {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 100;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          color: rgba(212, 175, 55, 0.5);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home-link:hover {
          color: #d4af37;
        }

        .home-link-arrow {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .home-link:hover .home-link-arrow {
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .home-link {
            top: 20px;
            left: 20px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className="great-hall">
        {/* Background Image */}
        <div className="hall-background fade-in">
          <img 
            src="/images/thegreathall.jpg" 
            alt="The Great Hall"
          />
        </div>
        <div className="hall-vignette"></div>

        {/* Home Link - Top Left */}
        <Link href="/" className="home-link fade-in delay-2">
          <span className="home-link-arrow">←</span>
          <span>M</span>
        </Link>

        {/* Left Navigation - About */}
        <Link href="/about" className="side-nav side-nav-left fade-in delay-3">
          <span className="nav-arrow">←</span>
          <span className="nav-label">About</span>
        </Link>

        {/* Right Navigation - Contact (positioned before floor nav) */}
        <div style={{ 
          position: 'fixed', 
          right: '80px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 100 
        }}>
          <Link href="/contact" className="side-nav fade-in delay-3" style={{ position: 'relative', right: 'auto' }}>
            <span className="nav-arrow">→</span>
            <span className="nav-label">Contact</span>
          </Link>
        </div>

        {/* Floor Navigation - Right Side */}
        <div className="floor-nav fade-in delay-4">
          <div 
            className={`floor-dot ${currentFloor === 1 ? 'active' : ''}`}
            onClick={() => setCurrentFloor(1)}
          >
            <span className="floor-dot-label">1st Floor · Coming Soon</span>
          </div>
          <div className="floor-line"></div>
          <div 
            className={`floor-dot ${currentFloor === 0 ? 'active' : ''}`}
            onClick={() => setCurrentFloor(0)}
          >
            <span className="floor-dot-label">Ground Floor · 2024–2025</span>
          </div>
        </div>

        {/* Explore Hint - Bottom Center */}
        <Link href={floors[currentFloor].href} className="explore-hint fade-in delay-4">
          <span className="explore-text">Enter</span>
          <span className="explore-arrow">↓</span>
        </Link>

        {/* Current Floor Info - Bottom Right */}
        <div className="floor-info fade-in delay-4">
          <p className="floor-name">{floors[currentFloor].name}</p>
          <p className="floor-year">{floors[currentFloor].year}</p>
        </div>
      </div>
    </div>
  );
}