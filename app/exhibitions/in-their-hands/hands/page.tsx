'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const handsCharacters = [
  {
    id: 1,
    character: "The Roman Soldier",
    coinName: "Pontius Pilate Prutah",
    coinDate: "26–36 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/roman-soldier-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/roman-soldier-hands-v1.jpg",
    story: "A Roman prefect's treasury in Jerusalem, 30 AD. This coin was minted here, in this city, in the year of the trial. A soldier received it as pay. A merchant passed it in change. A priest handled it in the Temple precincts that the man who minted it deliberately provoked. How many hands between then and now?"
  },
  {
    id: 2,
    character: "The Temple Priest",
    coinName: "Tyrian Shekel",
    coinDate: "1st century BC–1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/temple-priest-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/temple-priest-hands-v2.jpg",
    story: "The Temple treasury, Jerusalem. The High Priest's hands counted these out: thirty of them, one by one. The coin required for worship — the purest silver in circulation — became the price of betrayal. It may also have been the coin a fisherman found in a fish's mouth by the Sea of Galilee."
  },
  {
    id: 3,
    character: "The Widow",
    coinName: "Widow's Mite — Lepton",
    coinDate: "1st century BC, circulating 1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/widow-full-v4.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/widow-hands-v2.jpg",
    story: "A widow at the Temple treasury, Jerusalem. She held both of them — two leptons, the smallest coins in circulation, worth almost nothing. She dropped them into the treasury and walked away. Jesus watched. He said she had given more than anyone. These are her coins."
  },
  {
    id: 4,
    character: "The Merchant",
    coinName: "Augustus AE As",
    coinDate: "5–4 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/merchant-hands-v2.jpg",
    story: "An imperial administrator in Rome, 5 BC. He was processing census returns from across the empire — from Egypt, from Gaul, from Judaea. Somewhere in the returns: a carpenter and his pregnant wife, registered in Bethlehem. The administrator never looked up from his ledger."
  },
  {
    id: 5,
    character: "The Mother",
    coinName: "Herod the Great Prutah",
    coinDate: "40–4 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/mother-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/mother-hands-v1.jpg",
    story: "A soldier in Herod's service, Bethlehem, 4 BC. He was given orders he did not question. He was paid in these. The coin carries no human face — Jewish law forbade it — but it carries the weight of everything Herod built and everything Herod destroyed."
  },
  {
    id: 6,
    character: "Paul of Tarsus",
    coinName: "Porcius Festus Prutah",
    coinDate: "59–62 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/paul-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/paul-hands-v1.jpg",
    story: "A Roman court in Caesarea, 59 AD. A prisoner stands before the procurator. He is a Roman citizen. He invokes the law. 'I appeal to Caesar.' The procurator's hands hold this coin — his own coin, his authority made metal — as he renders his decision. 'To Caesar you will go.'"
  },
  {
    id: 7,
    character: "The Daughter of Aretas",
    coinName: "Aretas IV Prutah",
    coinDate: "9 BC–40 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-full-v2.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-hands-v1.jpg",
    story: "A Nabataean princess at Petra, returned from Judaea. Her husband Herod Antipas divorced her to marry another woman. John the Baptist condemned the marriage and was beheaded. Her father went to war. She is never named in the Gospels. She is the invisible figure whose humiliation set everything in motion. This is her father's coin — the coin of the kingdom she came home to."
  }
];

export default function HandsOfHistory() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const character = handsCharacters[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === handsCharacters.length - 1;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= handsCharacters.length || transitioning) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setTransitioning(true);
    setRevealed(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setTransitioning(false), 50);
    }, 400);
  }, [currentIndex, transitioning]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setRevealed(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Preload adjacent images
  useEffect(() => {
    const preload = (src: string) => { const img = new Image(); img.src = src; };
    if (currentIndex > 0) {
      preload(handsCharacters[currentIndex - 1].fullImage);
      preload(handsCharacters[currentIndex - 1].handsImage);
    }
    if (currentIndex < handsCharacters.length - 1) {
      preload(handsCharacters[currentIndex + 1].fullImage);
      preload(handsCharacters[currentIndex + 1].handsImage);
    }
  }, [currentIndex]);

  return (
    <div
      className={`hh-page ${loaded ? 'hh-loaded' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hh-page {
          position: fixed;
          inset: 0;
          background: #000;
          color: #fafafa;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hh-page.hh-loaded { opacity: 1; }

        /* ========== BACKGROUND IMAGES ========== */
        .hh-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hh-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.6s ease;
        }
        .hh-bg-img.hidden { opacity: 0; }
        .hh-bg-img.visible { opacity: 1; }

        .hh-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.1) 40%,
            rgba(0,0,0,0.05) 60%,
            rgba(0,0,0,0.4) 100%
          );
          z-index: 1;
        }

        /* ========== HEADER ========== */
        .hh-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 20px 32px;
        }
        .hh-back-btn {
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
        .hh-back-btn:hover { color: #fafafa; }
        .hh-back-btn span { font-size: 18px; }

        /* ========== BOTTOM CAPTION (State 1) ========== */
        .hh-caption {
          position: fixed;
          bottom: 70px;
          left: 32px;
          z-index: 20;
          transition: opacity 0.4s ease;
        }
        .hh-caption.hidden { opacity: 0; pointer-events: none; }

        .hh-caption-coin {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #C9A84C;
          margin-bottom: 4px;
        }
        .hh-caption-date {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.6);
        }

        /* ========== TAP PROMPT ========== */
        .hh-tap-prompt {
          position: fixed;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A84C;
          animation: hh-pulse 2.5s ease-in-out infinite;
          cursor: pointer;
          transition: opacity 0.4s ease;
        }
        .hh-tap-prompt.hidden { opacity: 0; pointer-events: none; }

        @keyframes hh-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.4; }
        }

        /* ========== CLICK AREA (State 1) ========== */
        .hh-click-area {
          position: absolute;
          inset: 0;
          z-index: 15;
          cursor: pointer;
        }

        /* ========== STORY CARD (State 2) ========== */
        .hh-card-backdrop {
          position: fixed;
          inset: 0;
          z-index: 30;
          background: transparent;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .hh-card-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        .hh-card {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: #F5EDD8;
          border-radius: 20px 20px 0 0;
          padding: 36px 40px 40px;
          max-height: 65vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 -10px 60px rgba(0,0,0,0.4);
        }
        .hh-card.open {
          transform: translateY(0);
        }
        .hh-card::-webkit-scrollbar { width: 4px; }
        .hh-card::-webkit-scrollbar-track { background: transparent; }
        .hh-card::-webkit-scrollbar-thumb { background: rgba(139,125,107,0.3); border-radius: 2px; }

        .hh-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .hh-card-character {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8B7D6B;
          margin-bottom: 6px;
        }

        .hh-card-coin-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 400;
          color: #C9A84C;
          line-height: 1.2;
        }

        .hh-card-coin-date {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #8B7D6B;
          margin-top: 6px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.2);
        }

        .hh-card-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(139, 125, 107, 0.3);
          background: transparent;
          color: #8B7D6B;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-left: 16px;
        }
        .hh-card-close:hover {
          background: rgba(139, 125, 107, 0.1);
          color: #3D3428;
        }

        .hh-card-story {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          line-height: 1.9;
          color: #3D3428;
          margin-bottom: 28px;
        }

        .hh-card-next {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          float: right;
        }
        .hh-card-next:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== NAVIGATION ========== */
        .hh-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px 32px;
        }
        .hh-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(245, 237, 216, 0.3);
        }
        .hh-dot:hover {
          background: rgba(245, 237, 216, 0.6);
          transform: scale(1.3);
        }
        .hh-dot.active {
          background: #C9A84C;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
          transform: scale(1.2);
        }

        /* ========== MOBILE ========== */
        @media (max-width: 768px) {
          .hh-header { padding: 16px 20px; }
          .hh-caption { left: 20px; bottom: 60px; }
          .hh-tap-prompt { bottom: 60px; }
          .hh-card {
            padding: 28px 24px 32px;
            max-height: 70vh;
          }
          .hh-nav { padding: 14px 20px; }
        }
      `}</style>

      {/* Background images */}
      <div className="hh-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`hh-bg-img ${revealed ? 'hidden' : 'visible'}`}
          src={character.fullImage}
          alt={character.character}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`hh-bg-img ${revealed ? 'visible' : 'hidden'}`}
          src={character.handsImage}
          alt={`${character.character} — hands`}
        />
        <div className="hh-bg-gradient" />
      </div>

      {/* Header */}
      <header className="hh-header">
        <button className="hh-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
      </header>

      {/* Click area for State 1 */}
      {!revealed && (
        <div className="hh-click-area" onClick={() => setRevealed(true)} />
      )}

      {/* Caption (State 1) */}
      <div className={`hh-caption ${revealed ? 'hidden' : ''}`}>
        <p className="hh-caption-coin">{character.coinName}</p>
        <p className="hh-caption-date">{character.coinDate}</p>
      </div>

      {/* Tap prompt (State 1) */}
      <div
        className={`hh-tap-prompt ${revealed ? 'hidden' : ''}`}
        onClick={() => setRevealed(true)}
      >
        Tap to discover
      </div>

      {/* Card backdrop (State 2) */}
      <div
        className={`hh-card-backdrop ${revealed ? 'open' : ''}`}
        onClick={() => setRevealed(false)}
      />

      {/* Story card (State 2) */}
      <div className={`hh-card ${revealed ? 'open' : ''}`}>
        <div className="hh-card-top">
          <div>
            <p className="hh-card-character">{character.character}</p>
            <h2 className="hh-card-coin-name">{character.coinName}</h2>
          </div>
          <button className="hh-card-close" onClick={() => setRevealed(false)}>{'\u00D7'}</button>
        </div>
        <p className="hh-card-coin-date">{character.coinDate}</p>
        <p className="hh-card-story">{character.story}</p>

        {isLast ? (
          <button className="hh-card-next" onClick={() => router.push('/exhibitions/in-their-hands')}>
            Back to Exhibition {'\u2192'}
          </button>
        ) : (
          <button className="hh-card-next" onClick={() => { setRevealed(false); setTimeout(() => goNext(), 300); }}>
            Next {'\u2192'}
          </button>
        )}
      </div>

      {/* Navigation dots */}
      <nav className="hh-nav">
        {handsCharacters.map((_, i) => (
          <button
            key={i}
            className={`hh-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to character ${i + 1}`}
          />
        ))}
      </nav>
    </div>
  );
}
