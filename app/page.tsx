'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';

export default function Home() {
  const reduceMotion = usePrefersReducedMotion();
  const [logoTimerDone, setLogoVisible] = useState(false);
  const [taglineTimerDone, setTaglineVisible] = useState(false);
  const [detailsTimerDone, setDetailsVisible] = useState(false);
  // Visitors who prefer reduced motion get everything at once, no slow reveal
  const logoVisible = reduceMotion || logoTimerDone;
  const taglineVisible = reduceMotion || taglineTimerDone;
  const detailsVisible = reduceMotion || detailsTimerDone;

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
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
      <h1
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 6s ease-out, transform 6s ease-out',
          margin: 0,
          fontSize: 'inherit',
          fontWeight: 'inherit',
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
      </h1>

      {/* Text */}
      <div className="flex flex-col items-center mt-6">
        <p
          className={`font-serif text-lg md:text-xl text-[#808080] italic font-light tracking-wide transition-all duration-1000 ease-out ${
            taglineVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Big History. Small Spaces.
        </p>

        {/* Enter Button — the link itself carries the button styling. Until it
            fades in it is visibility:hidden, so it can't take focus unseen. */}
        <div
          className={`transition-all duration-1000 ease-out ${
            detailsVisible
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 translate-y-4 invisible'
          }`}
          style={{ marginTop: '32px' }}
        >
          <Link
            href="/greathall"
            className="block"
            style={{
              padding: '12px 48px',
              fontSize: '11px',
              letterSpacing: '0.3em',
              fontWeight: 300,
              lineHeight: 'normal',
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
          </Link>
        </div>
      </div>
    </div>
  );
}