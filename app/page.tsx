'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoVisible(true), 300);
    const taglineTimer = setTimeout(() => setTaglineVisible(true), 5000);
    const detailsTimer = setTimeout(() => setDetailsVisible(true), 6500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(detailsTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] -top-[10%] -left-[10%]"
          style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] -bottom-[5%] -right-[5%]"
          style={{ background: 'radial-gradient(circle, rgba(123,44,191,0.25) 0%, transparent 70%)' }}
        />
      </div>

      {/* Logo */}
      <div 
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 6s ease-out, transform 6s ease-out',
        }}
        className="relative z-10"
      >
        <Image
          src="/logo.png"
          alt="The Mini Museum"
          width={600}
          height={450}
          className="w-auto h-auto max-w-[70vw] md:max-w-[450px] lg:max-w-[530px]"
          priority
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center mt-6">
        <p
          className={`font-serif text-lg md:text-xl text-[#737373] italic font-light tracking-wide transition-all duration-1000 ease-out ${
            taglineVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Big History. Small Spaces.
        </p>

        {/* Enter Button */}
        <Link
          href="/greathall"
          className={`transition-all duration-1000 ease-out block ${
            detailsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{ marginTop: '32px' }}
        >
          <button
            style={{
              padding: '12px 48px',
              fontSize: '11px',
              letterSpacing: '0.3em',
              fontWeight: 300,
              textTransform: 'uppercase',
              color: '#fafafa',
              background: 'transparent',
              border: '1px solid rgba(250, 250, 250, 0.3)',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              fontFamily: 'Outfit, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 250, 250, 0.6)';
              e.currentTarget.style.background = 'rgba(250, 250, 250, 0.05)';
              e.currentTarget.style.letterSpacing = '0.4em';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 250, 250, 0.3)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.letterSpacing = '0.3em';
            }}
          >
            Enter
          </button>
        </Link>
      </div>
    </main>
  );
}