'use client';

import Link from 'next/link';

export default function Contact() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; }
        a { color: inherit; text-decoration: none; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .fade-in-up { animation: fadeInUp 1s ease-out forwards; }
        .delay-1 { animation-delay: 0.2s; opacity: 0; }
        .delay-2 { animation-delay: 0.4s; opacity: 0; }
        .back-link { position: fixed; top: 32px; left: 32px; z-index: 100; display: flex; align-items: center; gap: 10px; color: #525252; font-family: 'Cormorant Garamond', Georgia, serif; transition: all 0.3s ease; }
        .back-link:hover { color: #fafafa; }
        .back-link:hover .back-arrow { transform: translateX(-4px); color: #7D8471; }
        .back-link:hover .back-label { opacity: 1; max-width: 100px; }
        .back-arrow { transition: all 0.3s ease; font-size: 16px; }
        .back-m { font-size: 28px; font-weight: 300; }
        .back-label { font-size: 13px; font-style: italic; color: #7D8471; opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap; transition: all 0.4s ease; }
        @media (max-width: 768px) {
          .back-link { top: 20px; left: 20px; }
          .back-m { font-size: 24px; }
          .back-arrow { font-size: 14px; }
        }
      `}</style>

      <Link href="/greathall" className="back-link fade-in-up">
        <span className="back-m">M</span>
        <span className="back-arrow">←</span>
        <span className="back-label">Great Hall</span>
      </Link>

      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 className="fade-in-up" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 300, color: '#fafafa', marginBottom: '24px', lineHeight: 0.95 }}>Contact</h1>
        
        <div className="fade-in-up delay-1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7D8471', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7D8471', animation: 'pulse 2s ease-in-out infinite' }}></span>
          <span>Coming Soon</span>
        </div>

        <p className="fade-in-up delay-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontStyle: 'italic', fontWeight: 300, color: '#525252', marginTop: '48px', maxWidth: '400px', lineHeight: 1.6 }}>
          We're preparing something special. Check back soon.
        </p>
      </div>
    </div>
  );
}