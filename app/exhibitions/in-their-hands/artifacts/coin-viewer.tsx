'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CoinData = {
  id: string;
  title: string;
  date: string;
  subtitle: string;
  material: string;
  reference: string;
  authenticity: 'AUTHENTIC' | 'REPLICA';
  verse: string;
  verseText: string;
  description: string[];
  frontImage: string;
  backImage: string;
  displayCard: string;
};

type Props = {
  coin: CoinData;
  backRoute: string;
  backLabel: string;
  accentColor?: string;
};

export default function CoinViewer({ coin, backRoute, backLabel, accentColor = '#C9A84C' }: Props) {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const [showBack, setShowBack] = useState(false);

  return (
    <div className="coin-viewer-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .coin-viewer-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Header */
        .cv-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: linear-gradient(to bottom, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0) 100%);
        }

        .cv-back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: ${accentColor};
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .cv-back-btn:hover { color: #fff; }
        .cv-back-btn span { font-size: 18px; }

        .cv-info-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(${accentColor === '#C9A84C' ? '201, 168, 76' : '168, 213, 229'}, 0.3);
          background: transparent;
          color: ${accentColor};
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .cv-info-btn:hover {
          background: rgba(${accentColor === '#C9A84C' ? '201, 168, 76' : '168, 213, 229'}, 0.1);
          border-color: ${accentColor};
        }
        .cv-info-btn.active {
          background: ${accentColor};
          color: #0a0a0a;
        }

        /* Main content */
        .cv-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-top: 80px;
        }

        /* Coin display area */
        .cv-coin-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          perspective: 1200px;
          cursor: pointer;
          position: relative;
        }

        .cv-coin-container {
          position: relative;
          width: min(70vh, 70vw);
          height: min(70vh, 70vw);
          max-width: 500px;
          max-height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cv-gentle-rotate 6s ease-in-out infinite;
        }

        .cv-coin-container.flipped {
          transform: rotateY(180deg);
        }

        @keyframes cv-gentle-rotate {
          0% { transform: rotateY(0deg) rotateX(2deg); }
          25% { transform: rotateY(5deg) rotateX(-1deg); }
          50% { transform: rotateY(0deg) rotateX(-2deg); }
          75% { transform: rotateY(-5deg) rotateX(1deg); }
          100% { transform: rotateY(0deg) rotateX(2deg); }
        }

        .cv-coin-container.flipped {
          animation: cv-gentle-rotate-back 6s ease-in-out infinite;
        }

        @keyframes cv-gentle-rotate-back {
          0% { transform: rotateY(180deg) rotateX(2deg); }
          25% { transform: rotateY(185deg) rotateX(-1deg); }
          50% { transform: rotateY(180deg) rotateX(-2deg); }
          75% { transform: rotateY(175deg) rotateX(1deg); }
          100% { transform: rotateY(180deg) rotateX(2deg); }
        }

        .cv-coin-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cv-coin-face img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 60px rgba(0,0,0,0.6)) drop-shadow(0 5px 15px rgba(0,0,0,0.4));
        }

        .cv-coin-back {
          transform: rotateY(180deg);
        }

        /* Flip button */
        .cv-flip-btn {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 100px;
          border: 1px solid rgba(${accentColor === '#C9A84C' ? '201, 168, 76' : '168, 213, 229'}, 0.3);
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          color: ${accentColor};
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .cv-flip-btn:hover {
          background: rgba(${accentColor === '#C9A84C' ? '201, 168, 76' : '168, 213, 229'}, 0.15);
          border-color: ${accentColor};
        }
        .cv-flip-icon {
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        .cv-flip-btn:hover .cv-flip-icon {
          transform: rotateY(180deg);
        }

        /* Bottom bar */
        .cv-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 24px 32px 32px;
          background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 60%, rgba(10,10,10,0) 100%);
        }

        .cv-artifact-info { flex: 1; }

        .cv-artifact-date {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 8px;
        }

        .cv-artifact-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 8px;
        }

        .cv-artifact-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-style: italic;
          color: ${accentColor};
        }

        .cv-authenticity {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-left: 12px;
          vertical-align: middle;
        }
        .cv-authenticity.authentic {
          background: rgba(76, 175, 80, 0.15);
          color: #66BB6A;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        .cv-authenticity.replica {
          background: rgba(255, 193, 7, 0.1);
          color: #FFC107;
          border: 1px solid rgba(255, 193, 7, 0.25);
        }

        /* Info panel */
        .cv-info-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 480px;
          max-width: 90vw;
          height: 100vh;
          background: linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.98) 100%);
          border-left: 1px solid rgba(255,255,255,0.08);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
          overflow-y: auto;
        }
        .cv-info-panel.open {
          transform: translateX(0);
        }

        .cv-info-panel-content {
          padding: 100px 40px 60px;
        }

        .cv-info-close {
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
        .cv-info-close:hover {
          background: rgba(255,255,255,0.1);
        }

        .cv-info-display-card {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 28px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .cv-info-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${accentColor};
          margin-bottom: 8px;
        }

        .cv-info-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .cv-info-date {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 4px;
        }

        .cv-info-material {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #525252;
          margin-bottom: 24px;
        }

        .cv-info-verse {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${accentColor};
          margin-bottom: 8px;
          font-weight: 500;
        }

        .cv-info-verse-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #d0d0d0;
          line-height: 1.7;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .cv-info-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: ${accentColor};
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .cv-info-description {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cv-info-description p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #d0d0d0;
        }

        .cv-info-description p::first-letter {
          font-size: 1.3em;
          color: ${accentColor};
        }

        /* Backdrop */
        .cv-info-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 150;
        }
        .cv-info-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .cv-header { padding: 16px 20px; }
          .cv-bottom-bar { padding: 20px 24px 28px; }
          .cv-info-panel { width: 100%; }
          .cv-info-panel-content { padding: 80px 24px 40px; }
          .cv-coin-container {
            width: min(80vw, 80vh);
            height: min(80vw, 80vh);
          }
        }
      `}</style>

      {/* Header */}
      <header className="cv-header">
        <button className="cv-back-btn" onClick={() => router.push(backRoute)}>
          <span>{'\u2190'}</span>
          {backLabel}
        </button>
        <button
          className={`cv-info-btn ${showInfo ? 'active' : ''}`}
          onClick={() => setShowInfo(!showInfo)}
        >
          i
        </button>
      </header>

      {/* Main content */}
      <main className="cv-content">
        {/* Coin display */}
        <div className="cv-coin-stage">
          <div className={`cv-coin-container ${showBack ? 'flipped' : ''}`}>
            <div className="cv-coin-face">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coin.frontImage} alt={`${coin.title} — obverse`} />
            </div>
            <div className="cv-coin-face cv-coin-back">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coin.backImage} alt={`${coin.title} — reverse`} />
            </div>
          </div>

          <button className="cv-flip-btn" onClick={() => setShowBack(!showBack)}>
            <span className="cv-flip-icon">{'\u21C4'}</span>
            {showBack ? 'Show Obverse' : 'Show Reverse'}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="cv-bottom-bar">
          <div className="cv-artifact-info">
            <p className="cv-artifact-date">{coin.date} &middot; {coin.material} &middot; {coin.reference}</p>
            <h1 className="cv-artifact-name">
              {coin.title}
              <span className={`cv-authenticity ${coin.authenticity.toLowerCase()}`}>
                {coin.authenticity}
              </span>
            </h1>
            <p className="cv-artifact-subtitle">{coin.subtitle}</p>
          </div>
        </div>
      </main>

      {/* Info backdrop */}
      <div
        className={`cv-info-backdrop ${showInfo ? 'open' : ''}`}
        onClick={() => setShowInfo(false)}
      />

      {/* Info panel */}
      <aside className={`cv-info-panel ${showInfo ? 'open' : ''}`}>
        <button className="cv-info-close" onClick={() => setShowInfo(false)}>{'\u00D7'}</button>
        <div className="cv-info-panel-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cv-info-display-card" src={coin.displayCard} alt={`${coin.title} display card`} />

          <p className="cv-info-label">Artifact</p>
          <h2 className="cv-info-title">{coin.title}</h2>
          <p className="cv-info-date">{coin.date} &middot; {coin.material} &middot; {coin.reference}</p>
          <p className="cv-info-material">
            {coin.authenticity === 'AUTHENTIC' ? 'Authentic ancient coin' : 'Museum-quality replica'}
          </p>

          <p className="cv-info-verse">{coin.verse}</p>
          <p className="cv-info-verse-text">&ldquo;{coin.verseText}&rdquo;</p>

          <div className="cv-info-description">
            {coin.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
