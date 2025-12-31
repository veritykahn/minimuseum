'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function FirstFloor() {
  const [activeExhibition, setActiveExhibition] = useState<any>(null);

  const exhibitions = [
    { id: 'writing', title: 'The Writing Revolution', subtitle: "QWERTY's Accidental Empire", accent: '#DC2626', darkAccent: '#1f0a0a', textColor: '#fff', description: 'From scribes to typewriters to AI, the democratization of the written word.', artifacts: ['Urania Typewriter', 'Printing Block', 'Quill Pen'] },
    { id: 'fear', title: 'Fear Lab', subtitle: 'Page Turners & Spine Tinglers', accent: '#1E3A5F', darkAccent: '#0a1525', textColor: '#F5F5DC', description: "The science of being scared and why we just can't put our horror books down.", artifacts: ['Gothic Novel', 'Memento Mori', 'Ouija Board'] },
    { id: 'wwi', title: 'The Great War', subtitle: 'When the Guns Fell Silent', accent: '#9B2226', darkAccent: '#1a0505', textColor: '#fff', description: 'The Doughboys, the trenches, and the armistice that came at the eleventh hour of the eleventh day.', artifacts: ['Trench Periscope', "Soldier's Letter", 'Remembrance Poppy'] },
  ];

  const enterExhibition = (e: any) => { setActiveExhibition(e); document.body.style.overflow = 'hidden'; };
  const returnToHall = () => { setActiveExhibition(null); document.body.style.overflow = 'auto'; };

  const Ticket = ({ onClick, accentColor }: { onClick: () => void; accentColor: string }) => (
    <button onClick={onClick} className="ticket">
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H52C52 6.62742 57.3726 12 64 12C70.6274 12 76 6.62742 76 0H172C176.418 0 180 3.58172 180 8V72C180 76.4183 176.418 80 172 80H76C76 73.3726 70.6274 68 64 68C57.3726 68 52 73.3726 52 80H8C3.58172 80 0 76.4183 0 72V8Z" fill="#faf8f5"/>
        <line x1="64" y1="16" x2="64" y2="64" stroke="#e5e2dc" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="32" y="38" textAnchor="middle" fill="#1a1a1a" style={{ fontFamily: 'Outfit', fontSize: '8px', fontWeight: 500, letterSpacing: '0.1em' }}>ADMIT ONE</text>
        <text x="125" y="28" textAnchor="middle" fill="#1a1a1a" style={{ fontFamily: 'Cormorant Garamond', fontSize: '10px' }}>The Mini Museum</text>
        <text x="125" y="48" textAnchor="middle" fill={accentColor} style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.08em' }}>Enter Exhibition</text>
      </svg>
    </button>
  );

  const ExhibitionCard = ({ exhibition, index }: { exhibition: any; index: number }) => (
    <div className="exhibition-card" style={{ background: `radial-gradient(ellipse at center, ${exhibition.accent}20 0%, #0a0a0a 70%)` }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: exhibition.accent, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Exhibition {String(index + 1).padStart(2, '0')}</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, lineHeight: 0.95, color: '#fafafa', marginBottom: '16px' }}>{exhibition.title}</h2>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontStyle: 'italic', fontWeight: 300, color: exhibition.accent, marginBottom: '48px' }}>{exhibition.subtitle}</p>
        <Ticket onClick={() => enterExhibition(exhibition)} accentColor={exhibition.accent} />
      </div>
    </div>
  );

  const ExhibitionRoom = ({ exhibition, onReturn }: { exhibition: any; onReturn: () => void }) => (
    <div className="exhibition-room">
      <div className="room-scroll" style={{ background: `radial-gradient(ellipse at center, ${exhibition.accent}40 0%, ${exhibition.darkAccent} 70%)` }}>
        <section className="room-section">
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: exhibition.accent, marginBottom: '24px', fontFamily: 'Outfit' }}>You are entering</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 300, lineHeight: 0.9, color: exhibition.textColor, marginBottom: '24px' }}>{exhibition.title}</h1>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontStyle: 'italic', fontWeight: 300, color: exhibition.accent, marginBottom: '60px' }}>{exhibition.subtitle}</p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 60px', fontFamily: 'Outfit' }}>{exhibition.description}</p>
            <button onClick={onReturn} className="return-button" style={{ borderColor: exhibition.accent, color: exhibition.accent }}>Return to First Floor</button>
          </div>
        </section>
      </div>
      <div className="room-nav"><button onClick={onReturn} className="nav-pill">← Return to First Floor</button></div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; overflow-x: hidden; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(-1deg); } }
        .ticket { background: none; border: none; cursor: pointer; animation: float 4s ease-in-out infinite; }
        .ticket:hover { animation-play-state: paused; transform: translateY(-8px) scale(1.05); }
        .back-link { position: fixed; top: 32px; left: 32px; z-index: 1000; display: flex; align-items: center; gap: 8px; color: #525252; text-decoration: none; font-size: 14px; font-family: 'Cormorant Garamond'; transition: all 0.3s ease; }
        .back-link:hover { color: #fafafa; }
        .floor-indicator { position: fixed; top: 32px; right: 32px; z-index: 1000; text-align: right; }
        .floor-indicator-name { font-family: 'Outfit'; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #525252; margin-bottom: 4px; }
        .floor-indicator-year { font-family: 'Cormorant Garamond'; font-size: 13px; font-style: italic; color: #7D8471; }
        .exhibitions-scroll { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; height: 100vh; }
        .exhibitions-scroll::-webkit-scrollbar { height: 4px; }
        .exhibitions-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .exhibition-card { flex: 0 0 100vw; min-width: 100vw; height: 100vh; scroll-snap-align: center; display: flex; align-items: center; justify-content: center; }
        .exhibition-room { position: fixed; inset: 0; z-index: 500; background: #0a0a0a; }
        .room-scroll { height: 100vh; display: flex; align-items: center; justify-content: center; }
        .room-section { display: flex; align-items: center; justify-content: center; padding: 40px; }
        .return-button { padding: 20px 48px; font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; background: transparent; border: 1px solid; cursor: pointer; font-family: 'Outfit'; }
        .return-button:hover { background: currentColor; color: #fff; }
        .room-nav { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 600; }
        .nav-pill { padding: 12px 24px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 100px; cursor: pointer; font-family: 'Outfit'; }
        .scroll-hint { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; color: #525252; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-family: 'Outfit'; z-index: 100; }
        .scroll-hint-line { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #525252); }
      `}</style>

      <Link href="/greathall" className="back-link"><span>←</span><span>Great Hall</span></Link>
      <div className="floor-indicator"><p className="floor-indicator-name">First Floor</p><p className="floor-indicator-year">2025–2026</p></div>

      {!activeExhibition && (
        <>
          <div className="exhibitions-scroll">
            {exhibitions.map((exhibition, index) => (<ExhibitionCard key={exhibition.id} exhibition={exhibition} index={index} />))}
          </div>
          <div className="scroll-hint"><div className="scroll-hint-line" style={{ transform: 'rotate(180deg)' }}></div><span>Swipe to explore</span><div className="scroll-hint-line"></div></div>
        </>
      )}

      {activeExhibition && <ExhibitionRoom exhibition={activeExhibition} onReturn={returnToHall} />}
    </div>
  );
}