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

        <span 
          className={`text-center transition-all duration-1000 ease-out ${
            detailsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#3a3a3a]">Monthly Curated Exhibitions</span>
          <br />
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#525252] font-light">Coming January 2026</span>
        </span>

        {/* About Button */}
        <Link
          href="/about"
          className={`mt-8 transition-all duration-1000 ease-out block ${
            detailsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            style={{
              padding: '8px 28px',
              fontSize: '11px',
              letterSpacing: '0.03em',
              fontWeight: 400,
              color: '#ffffff',
              background: 'linear-gradient(145deg, #7a7a7a, #5a5a5a)',
              border: 'none',
              borderRadius: '50px',
              boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.35), -1px -1px 5px rgba(100, 100, 100, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              WebkitTextFillColor: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(145deg, #8a8a8a, #6a6a6a)';
              e.currentTarget.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.25), -1px -1px 3px rgba(100, 100, 100, 0.1), inset 1px 1px 2px rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(145deg, #7a7a7a, #5a5a5a)';
              e.currentTarget.style.boxShadow = '3px 3px 8px rgba(0, 0, 0, 0.35), -1px -1px 5px rgba(100, 100, 100, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Learn More
          </button>
        </Link>
      </div>
    </main>
  );
}