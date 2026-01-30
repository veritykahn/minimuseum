'use client';

import { useRef } from 'react';
import Link from 'next/link';

export default function GroundFloor() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ground Floor: All exhibitions are "Installation in Progress" for now
  const exhibitions = [
    {
      id: 'egypt',
      title: 'Ancient Egypt',
      subtitle: 'The Mysteries of the Nile',
      accent: '#E85D04',
      darkAccent: '#1a0d02',
      textColor: '#fff',
      description: 'Gods and goddesses, mummification, and the civilization that shaped human history for three thousand years.',
      active: false,
    },
    {
      id: 'victorian',
      title: 'Victorian Britain',
      subtitle: 'Revolution & Christmas',
      accent: '#7D8471',
      darkAccent: '#1a1c18',
      textColor: '#fff',
      description: 'From the V&A to Dickens, the era that invented the modern Christmas and transformed the world.',
      active: false,
    },
    {
      id: 'holocaust',
      title: 'The Holocaust',
      subtitle: 'Never Forget',
      accent: '#78716C',
      darkAccent: '#1c1917',
      textColor: '#fff',
      description: 'Remembering the six million, honoring the Righteous Among the Nations, and the imperative of memory.',
      active: false,
    },
    {
      id: 'black-history',
      title: 'Black Barbie',
      subtitle: 'The Importance of Representation',
      accent: '#EC4899',
      darkAccent: '#2d0a1f',
      textColor: '#fff',
      description: "Carter G. Woodson's vision, cultural preservation, and the revolutionary history of representation in play.",
      active: false,
    },
    {
      id: 'womens-history',
      title: "Women's History",
      subtitle: 'Moving Forward Together',
      accent: '#1D3557',
      darkAccent: '#0a1220',
      textColor: '#fff',
      description: 'From Hilma af Klimt to working women like Violet Dina Want, celebrating contributions too long overlooked.',
      active: false,
    },
    {
      id: 'space',
      title: 'Another Earth',
      subtitle: 'Our Incredible Moon',
      accent: '#7B2CBF',
      darkAccent: '#1a0a2e',
      textColor: '#fff',
      description: 'From lunar dust to exoplanets, exploring the cosmic questions that define our place in the universe.',
      active: false,
    },
  ];

  const Ticket = () => (
    <div className="ticket ticket-disabled">
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H52C52 6.62742 57.3726 12 64 12C70.6274 12 76 6.62742 76 0H172C176.418 0 180 3.58172 180 8V72C180 76.4183 176.418 80 172 80H76C76 73.3726 70.6274 68 64 68C57.3726 68 52 73.3726 52 80H8C3.58172 80 0 76.4183 0 72V8Z" fill="#2a2a2a"/>
        <line x1="64" y1="16" x2="64" y2="64" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="32" y="38" textAnchor="middle" fill="#666" style={{ fontFamily: 'Outfit', fontSize: '8px', fontWeight: 500, letterSpacing: '0.1em' }}>ADMIT ONE</text>
        <text x="125" y="28" textAnchor="middle" fill="#666" style={{ fontFamily: 'Cormorant Garamond', fontSize: '10px' }}>The Mini Museum</text>
        <text x="125" y="48" textAnchor="middle" fill="#555" style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.08em' }}>Coming Soon</text>
      </svg>
    </div>
  );

  const ExhibitionCard = ({ exhibition, index }: { exhibition: typeof exhibitions[0]; index: number }) => (
    <div
      className="exhibition-card"
      style={{
        background: `radial-gradient(ellipse at center, ${exhibition.accent}20 0%, #0a0a0a 70%)`,
        position: 'relative'
      }}
    >
      {/* Installation in Progress Overlay */}
      <div className="installation-overlay">
        <div className="installation-sign">
          <p className="installation-title">Installation in progress</p>
          <p className="installation-subtitle">Thank you for your patience</p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '40px',
        opacity: 0.4,
        filter: 'grayscale(50%)'
      }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: exhibition.accent,
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
          color: '#fafafa',
          marginBottom: '16px'
        }}>
          {exhibition.title}
        </h2>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: exhibition.accent,
          marginBottom: '48px'
        }}>
          {exhibition.subtitle}
        </p>
        <Ticket />
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; overflow-x: hidden; }

        .ticket-disabled {
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
        .back-link:hover { color: #fafafa; }
        .back-link:hover .back-arrow { transform: translateX(-4px); color: #7D8471; }
        .back-link:hover .back-label { opacity: 1; max-width: 100px; }
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
          color: #525252;
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
          color: #737373;
        }

        .scroll-hint {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          color: #525252;
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

      <Link href="/greathall" className="back-link">
        <span className="back-m">M</span>
        <span className="back-arrow">←</span>
        <span className="back-label">Great Hall</span>
      </Link>

      <div className="floor-indicator">
        <p className="floor-indicator-name">Ground Floor</p>
        <p className="floor-indicator-year">2024–2025</p>
      </div>

      <div ref={scrollRef} className="exhibitions-scroll">
        {exhibitions.map((exhibition, index) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} index={index} />
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
