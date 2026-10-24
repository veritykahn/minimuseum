'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Floor, type FloorExhibition, exhibitionPath } from '@/lib/floors';

/**
 * A floor of the museum: a horizontal carousel of exhibition cards, one per
 * screen. Open exhibitions have an "Enter Exhibition" ticket; the rest show
 * "Installation in progress". Entering an exhibition remembers its card, so
 * its back link (see `floorReturnFor`) returns to the same place.
 */
export default function FloorPage({ floor }: { floor: Floor }) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { exhibitions, storageKey } = floor;

  useEffect(() => {
    const savedIndex = sessionStorage.getItem(storageKey);
    if (savedIndex && scrollRef.current) {
      const index = parseInt(savedIndex, 10);
      scrollRef.current.scrollTo({ left: index * window.innerWidth, behavior: 'instant' });
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const handleExhibitionClick = (exhibition: FloorExhibition, index: number) => {
    if (exhibition.active) {
      // Store the scroll position/index so we can return to it
      sessionStorage.setItem(storageKey, index.toString());
      router.push(exhibitionPath(exhibition.slug));
    }
  };

  const Ticket = ({ onClick, accentColor, isActive, title }: { onClick: () => void; accentColor: string; isActive: boolean; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`ticket ${!isActive ? 'ticket-disabled' : ''}`}
      disabled={!isActive}
    >
      <span className="visually-hidden">{isActive ? `Enter Exhibition: ${title}` : `Coming Soon: ${title}`}</span>
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H52C52 6.62742 57.3726 12 64 12C70.6274 12 76 6.62742 76 0H172C176.418 0 180 3.58172 180 8V72C180 76.4183 176.418 80 172 80H76C76 73.3726 70.6274 68 64 68C57.3726 68 52 73.3726 52 80H8C3.58172 80 0 76.4183 0 72V8Z" fill={isActive ? "#faf8f5" : "#2a2a2a"}/>
        <line x1="64" y1="16" x2="64" y2="64" stroke={isActive ? "#e5e2dc" : "#3a3a3a"} strokeWidth="1" strokeDasharray="4 3"/>
        <text x="32" y="38" textAnchor="middle" fill={isActive ? "#1a1a1a" : "#666"} style={{ fontFamily: 'Outfit', fontSize: '8px', fontWeight: 500, letterSpacing: '0.1em' }}>ADMIT ONE</text>
        <text x="125" y="28" textAnchor="middle" fill={isActive ? "#1a1a1a" : "#666"} style={{ fontFamily: 'Cormorant Garamond', fontSize: '10px' }}>The Mini Museum</text>
        <text x="125" y="48" textAnchor="middle" fill={isActive ? accentColor : "#555"} style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.08em' }}>
          {isActive ? 'Enter Exhibition' : 'Coming Soon'}
        </text>
      </svg>
    </button>
  );

  const ExhibitionCard = ({ exhibition, index }: { exhibition: FloorExhibition; index: number }) => (
    <div
      className="exhibition-card"
      style={{
        background: `radial-gradient(ellipse at center, ${exhibition.accent}20 0%, #0a0a0a 70%)`,
        position: 'relative'
      }}
    >
      {/* Installation in Progress Overlay */}
      {!exhibition.active && (
        <div className="installation-overlay">
          <div className="installation-sign">
            <p className="installation-title">Installation in progress</p>
            <p className="installation-subtitle">Thank you for your patience</p>
          </div>
        </div>
      )}

      {/* Inactive cards are dimmed with muted, still-legible colors rather than
          opacity, so "coming soon" doesn't push the text below 4.5:1 */}
      <div style={{
        textAlign: 'center',
        padding: '40px',
        filter: exhibition.active ? 'none' : 'grayscale(50%)'
      }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: exhibition.active ? exhibition.accent : '#8a8a8a',
          marginBottom: '16px',
          fontFamily: 'Outfit, sans-serif'
        }}>
          Exhibition {String(index + 1).padStart(2, '0')}
        </p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 300,
          lineHeight: 0.95,
          color: exhibition.active ? '#fafafa' : '#a3a3a3',
          marginBottom: '16px'
        }}>
          {exhibition.title}
        </h2>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: exhibition.active ? exhibition.accent : '#8a8a8a',
          marginBottom: '48px'
        }}>
          {exhibition.subtitle}
        </p>
        <Ticket
          onClick={() => handleExhibitionClick(exhibition, index)}
          accentColor={exhibition.accent}
          isActive={exhibition.active}
          title={exhibition.title}
        />
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; overflow-x: hidden; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
        }

        .ticket {
          background: none;
          border: none;
          cursor: pointer;
          animation: float 4s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .ticket:hover:not(.ticket-disabled), .ticket:focus-visible:not(.ticket-disabled) {
          animation-play-state: paused;
          transform: translateY(-8px) scale(1.05);
        }
        .ticket-disabled {
          cursor: not-allowed;
          animation: none;
          opacity: 0.6;
        }

        .back-link {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #525252;
          text-decoration: none;
          font-family: 'Cormorant Garamond';
          transition: all 0.3s ease;
        }
        .back-link:hover, .back-link:focus-visible { color: #fafafa; }
        .back-link:hover .back-arrow, .back-link:focus-visible .back-arrow { transform: translateX(-4px); color: #7D8471; }
        .back-link:hover .back-label, .back-link:focus-visible .back-label { opacity: 1; max-width: 100px; }
        .back-arrow { transition: all 0.3s ease; font-size: 16px; }
        .back-m { font-size: 28px; font-weight: 300; }
        .back-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        .floor-indicator {
          position: fixed;
          top: 32px;
          right: 32px;
          z-index: 1000;
          text-align: right;
        }
        .floor-indicator-name {
          font-family: 'Outfit';
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #808080;
          margin-bottom: 4px;
        }
        .floor-indicator-year {
          font-family: 'Cormorant Garamond';
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
        }

        .exhibitions-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          height: 100vh;
        }
        .exhibitions-scroll::-webkit-scrollbar { height: 4px; }
        .exhibitions-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

        .exhibition-card {
          flex: 0 0 100vw;
          min-width: 100vw;
          height: 100vh;
          scroll-snap-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Installation in Progress Overlay */
        .installation-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }

        .installation-sign {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px 48px;
          text-align: center;
        }

        .installation-title {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: #fafafa;
          margin-bottom: 8px;
        }

        .installation-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #8a8a8a;
        }

        .scroll-hint {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          color: #808080;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'Outfit';
          z-index: 100;
        }
        .scroll-hint-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #525252);
        }

        @media (max-width: 768px) {
          .back-link { top: 20px; left: 20px; }
          .back-m { font-size: 24px; }
          .back-arrow { font-size: 14px; }
          .floor-indicator { top: 20px; right: 20px; }
          .scroll-hint { bottom: 24px; gap: 12px; font-size: 10px; }
          .scroll-hint-line { width: 40px; }
          .installation-sign { padding: 24px 32px; }
          .installation-title { font-size: 12px; }
        }
      `}</style>

      <h1 className="visually-hidden">{floor.heading}</h1>

      <Link href="/greathall" className="back-link">
        <span className="back-m" aria-hidden="true">M</span>
        <span className="back-arrow" aria-hidden="true">←</span>
        <span className="back-label">Great Hall</span>
      </Link>

      <div className="floor-indicator">
        <p className="floor-indicator-name">{floor.name}</p>
        <p className="floor-indicator-year">{floor.years}</p>
      </div>

      <div ref={scrollRef} className="exhibitions-scroll">
        {exhibitions.map((exhibition, index) => (
          <ExhibitionCard key={exhibition.slug} exhibition={exhibition} index={index} />
        ))}
      </div>

      <div className="scroll-hint">
        <div className="scroll-hint-line" style={{ transform: 'rotate(180deg)' }}></div>
        <span>Swipe to explore</span>
        <div className="scroll-hint-line"></div>
      </div>
    </div>
  );
}
