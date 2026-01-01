'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function GroundFloor() {
  const [activeExhibition, setActiveExhibition] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ground Floor: Ancient Egypt, Victorian Britain, Holocaust, Black Barbie, Women's History, Space
  const exhibitions = [
    {
      id: 'egypt',
      title: 'Ancient Egypt',
      subtitle: 'The Mysteries of the Nile',
      accent: '#E85D04',
      darkAccent: '#1a0d02',
      textColor: '#fff',
      description: 'Gods and goddesses, mummification, and the civilization that shaped human history for three thousand years.',
      artifacts: ['Canopic Jar', 'Scarab Amulet', 'Papyrus Scroll'],
    },
    {
      id: 'victorian',
      title: 'Victorian Britain',
      subtitle: 'Revolution & Christmas',
      accent: '#7D8471',
      darkAccent: '#1a1c18',
      textColor: '#fff',
      description: 'From the V&A to Dickens, the era that invented the modern Christmas and transformed the world.',
      artifacts: ['Christmas Carol First Edition', 'Victorian Ornament', 'Mourning Brooch'],
    },
    {
      id: 'holocaust',
      title: 'The Holocaust',
      subtitle: 'Never Forget',
      accent: '#78716C',
      darkAccent: '#1c1917',
      textColor: '#fff',
      description: 'Remembering the six million, honoring the Righteous Among the Nations, and the imperative of memory.',
      artifacts: ['Yellow Star', 'Suitcase', 'Memorial Candle'],
    },
    {
      id: 'black-history',
      title: 'Black Barbie',
      subtitle: 'The Importance of Representation',
      accent: '#EC4899',
      darkAccent: '#2d0a1f',
      textColor: '#fff',
      description: "Carter G. Woodson's vision, cultural preservation, and the revolutionary history of representation in play.",
      artifacts: ['1980 Black Barbie', 'Shani Doll', 'Christie Doll'],
    },
    {
      id: 'womens-history',
      title: "Women's History",
      subtitle: 'Moving Forward Together',
      accent: '#1D3557',
      darkAccent: '#0a1220',
      textColor: '#fff',
      description: 'From Hilma af Klimt to working women like Violet Dina Want, celebrating contributions too long overlooked.',
      artifacts: ['Suffragette Sash', 'Ration Book', 'Factory Badge'],
    },
    {
      id: 'space',
      title: 'Another Earth',
      subtitle: 'Our Incredible Moon',
      accent: '#7B2CBF',
      darkAccent: '#1a0a2e',
      textColor: '#fff',
      description: 'From lunar dust to exoplanets, exploring the cosmic questions that define our place in the universe.',
      artifacts: ['Moon Rock Sample', 'Apollo Mission Patch', 'Lunar Module Model'],
    },
  ];

  const enterExhibition = (exhibition: any) => {
    setActiveExhibition(exhibition);
    document.body.style.overflow = 'hidden';
  };

  const returnToHall = () => {
    setActiveExhibition(null);
    document.body.style.overflow = 'auto';
  };

  const Ticket = ({ onClick, accentColor }: { onClick: () => void; accentColor: string }) => (
    <button onClick={onClick} className="ticket">
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H52C52 6.62742 57.3726 12 64 12C70.6274 12 76 6.62742 76 0H172C176.418 0 180 3.58172 180 8V72C180 76.4183 176.418 80 172 80H76C76 73.3726 70.6274 68 64 68C57.3726 68 52 73.3726 52 80H8C3.58172 80 0 76.4183 0 72V8Z" fill="#faf8f5"/>
        <line x1="64" y1="16" x2="64" y2="64" stroke="#e5e2dc" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="32" y="32" textAnchor="middle" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 500, letterSpacing: '0.15em', fill: '#1a1a1a' }}>ADMIT</text>
        <text x="32" y="44" textAnchor="middle" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 500, letterSpacing: '0.15em', fill: '#1a1a1a' }}>ONE</text>
        <text x="125" y="28" textAnchor="middle" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '10px', fontWeight: 400, fill: '#1a1a1a' }}>The Mini Museum</text>
        <text x="125" y="48" textAnchor="middle" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '11px', fontWeight: 400, letterSpacing: '0.08em', fill: accentColor }}>Enter Exhibition</text>
        <line x1="85" y1="58" x2="165" y2="58" stroke={accentColor} strokeWidth="0.5" opacity="0.5"/>
      </svg>
    </button>
  );

  const ExhibitionCard = ({ exhibition, index }: { exhibition: any; index: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      }, { threshold: 0.3 });
      if (cardRef.current) observer.observe(cardRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={cardRef} className="exhibition-card" style={{ background: `radial-gradient(ellipse at center, ${exhibition.accent}20 0%, #0a0a0a 70%)` }}>
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease-out', textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: exhibition.accent, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Exhibition {String(index + 1).padStart(2, '0')}</p>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, lineHeight: 0.95, color: '#fafafa', marginBottom: '16px' }}>{exhibition.title}</h2>
          <p className="font-serif" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontStyle: 'italic', fontWeight: 300, color: exhibition.accent, marginBottom: '48px' }}>{exhibition.subtitle}</p>
          <Ticket onClick={() => enterExhibition(exhibition)} accentColor={exhibition.accent} />
        </div>
      </div>
    );
  };

  const ExhibitionRoom = ({ exhibition, onReturn }: { exhibition: any; onReturn: () => void }) => {
    const roomScrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set([0]));

    useEffect(() => {
      const handleScroll = () => {
        if (!roomScrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = roomScrollRef.current;
        setScrollProgress((scrollLeft / (scrollWidth - clientWidth)) * 100);
        const currentSection = Math.floor(scrollLeft / clientWidth);
        setVisibleSections(prev => new Set([...prev, currentSection, currentSection + 1]));
      };
      const container = roomScrollRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }, []);

    return (
      <div className="exhibition-room">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${scrollProgress}%`, background: exhibition.accent }} /></div>
        <div ref={roomScrollRef} className="room-scroll" style={{ background: `linear-gradient(135deg, ${exhibition.darkAccent} 0%, ${exhibition.accent}15 50%, ${exhibition.darkAccent} 100%)` }}>
          <section className="room-section" style={{ background: `radial-gradient(ellipse at center, ${exhibition.accent}40 0%, ${exhibition.darkAccent} 70%)` }}>
            <div style={{ textAlign: 'center', opacity: visibleSections.has(0) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
              <p style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: exhibition.accent, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>You are entering</p>
              <h1 className="font-serif" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 300, lineHeight: 0.9, color: exhibition.textColor, marginBottom: '24px' }}>{exhibition.title}</h1>
              <p className="font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontStyle: 'italic', fontWeight: 300, color: exhibition.accent }}>{exhibition.subtitle}</p>
              <div style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>
                <span>Scroll to explore</span><span style={{ fontSize: '20px' }}>→</span>
              </div>
            </div>
          </section>
          <section className="room-section" style={{ background: exhibition.accent }}>
            <div style={{ maxWidth: '600px', padding: '0 40px', opacity: visibleSections.has(1) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
              <p style={{ fontSize: '20px', lineHeight: 1.8, fontWeight: 300, color: exhibition.textColor, fontFamily: 'Outfit, sans-serif' }}>{exhibition.description}</p>
            </div>
          </section>
          {exhibition.artifacts.map((artifact: string, i: number) => (
            <section key={i} className="room-section artifact-section" style={{ background: `radial-gradient(ellipse at ${30 + i * 20}% 50%, ${exhibition.accent}25 0%, ${exhibition.darkAccent} 60%)` }}>
              <div className="glass-case" style={{ opacity: visibleSections.has(2 + i) ? 1 : 0, transform: visibleSections.has(2 + i) ? 'scale(1)' : 'scale(0.9)', transition: 'all 0.8s ease-out' }}>
                <div className="artifact-placeholder" style={{ borderColor: `${exhibition.accent}50` }}><span style={{ color: exhibition.accent }}>3D Model</span></div>
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Artifact</p>
                  <h4 className="font-serif" style={{ fontSize: '24px', fontWeight: 400, color: '#fff' }}>{artifact}</h4>
                </div>
              </div>
            </section>
          ))}
          <section className="room-section" style={{ background: exhibition.darkAccent }}>
            <div style={{ textAlign: 'center', opacity: visibleSections.has(5) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
              <p style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>End of Exhibition</p>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 300, color: exhibition.textColor, marginBottom: '48px' }}>Thank you for visiting</h2>
              <button onClick={onReturn} className="return-button" style={{ borderColor: exhibition.accent, color: exhibition.accent }}>Return to Ground Floor</button>
            </div>
          </section>
        </div>
        <div className="room-nav"><button onClick={onReturn} className="nav-pill">← Return to Ground Floor</button></div>
      </div>
    );
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; overflow-x: hidden; }
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(-1deg); } }
        .ticket { background: none; border: none; cursor: pointer; transition: transform 0.3s ease; animation: float 4s ease-in-out infinite; }
        .ticket:hover { animation-play-state: paused; transform: translateY(-8px) rotate(0deg) scale(1.05); }
        .back-link { position: fixed; top: 32px; left: 32px; z-index: 1000; display: flex; align-items: center; gap: 10px; color: #525252; text-decoration: none; font-family: 'Cormorant Garamond', Georgia, serif; transition: all 0.3s ease; }
        .back-link:hover { color: #fafafa; }
        .back-link:hover .back-arrow { transform: translateX(-4px); color: #7D8471; }
        .back-link:hover .back-label { opacity: 1; max-width: 100px; }
        .back-arrow { transition: all 0.3s ease; font-size: 16px; }
        .back-m { font-size: 28px; font-weight: 300; }
        .back-label { font-size: 13px; font-style: italic; color: #7D8471; opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap; transition: all 0.4s ease; }
        .floor-indicator { position: fixed; top: 32px; right: 32px; z-index: 1000; text-align: right; }
        .floor-indicator-name { font-family: 'Outfit', sans-serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #525252; margin-bottom: 4px; }
        .floor-indicator-year { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; font-style: italic; color: #7D8471; }
        .exhibitions-scroll { display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; height: 100vh; width: 100vw; }
        .exhibitions-scroll::-webkit-scrollbar { height: 4px; }
        .exhibitions-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .exhibition-card { flex: 0 0 100vw; min-width: 100vw; height: 100vh; scroll-snap-align: center; display: flex; align-items: center; justify-content: center; }
        .exhibition-room { position: fixed; inset: 0; z-index: 500; background: #0a0a0a; }
        .progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.3); z-index: 600; }
        .progress-fill { height: 100%; transition: width 0.1s ease-out; }
        .room-scroll { display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; height: 100vh; width: 100vw; }
        .room-scroll::-webkit-scrollbar { height: 4px; }
        .room-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }
        .room-section { flex: 0 0 100vw; min-width: 100vw; height: 100vh; scroll-snap-align: start; display: flex; align-items: center; justify-content: center; }
        .artifact-section { flex: 0 0 80vw; min-width: 80vw; }
        .glass-case { padding: 40px; background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; display: flex; flex-direction: column; align-items: center; }
        .artifact-placeholder { width: 200px; height: 200px; border-radius: 50%; border: 1px dashed; display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Outfit', sans-serif; }
        .return-button { padding: 20px 48px; font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; background: transparent; border: 1px solid; cursor: pointer; transition: all 0.3s ease; font-family: 'Outfit', sans-serif; }
        .return-button:hover { background: currentColor; color: #fff; }
        .room-nav { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 600; }
        .nav-pill { padding: 12px 24px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 100px; cursor: pointer; transition: all 0.3s ease; font-family: 'Outfit', sans-serif; }
        .nav-pill:hover { background: rgba(0,0,0,0.8); border-color: rgba(255,255,255,0.4); }
        .scroll-hint { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; color: #525252; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-family: 'Outfit', sans-serif; z-index: 100; }
        .scroll-hint-line { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #525252); }
        @media (max-width: 768px) {
          .back-link { top: 20px; left: 20px; }
          .back-m { font-size: 24px; }
          .back-arrow { font-size: 14px; }
          .floor-indicator { top: 20px; right: 20px; }
          .exhibition-card { padding: 20px; }
          .room-section { padding: 24px; }
          .artifact-section { flex: 0 0 90vw; min-width: 90vw; }
          .glass-case { padding: 24px; }
          .artifact-placeholder { width: 150px; height: 150px; font-size: 12px; }
          .return-button { padding: 16px 32px; font-size: 12px; }
          .room-nav { bottom: 24px; }
          .nav-pill { padding: 10px 20px; font-size: 11px; }
          .scroll-hint { bottom: 24px; gap: 12px; font-size: 10px; }
          .scroll-hint-line { width: 40px; }
        }
        @media (max-width: 480px) {
          .artifact-placeholder { width: 120px; height: 120px; }
        }
      `}</style>

      <Link href="/greathall" className="back-link"><span className="back-m">M</span><span className="back-arrow">←</span><span className="back-label">Great Hall</span></Link>
      <div className="floor-indicator"><p className="floor-indicator-name">Ground Floor</p><p className="floor-indicator-year">2024–2025</p></div>

      {!activeExhibition && (
        <>
          <div ref={scrollRef} className="exhibitions-scroll">
            {exhibitions.map((exhibition, index) => (<ExhibitionCard key={exhibition.id} exhibition={exhibition} index={index} />))}
          </div>
          <div className="scroll-hint"><div className="scroll-hint-line" style={{ transform: 'rotate(180deg)' }}></div><span>Swipe to explore</span><div className="scroll-hint-line"></div></div>
        </>
      )}

      {activeExhibition && <ExhibitionRoom exhibition={activeExhibition} onReturn={returnToHall} />}
    </div>
  );
}