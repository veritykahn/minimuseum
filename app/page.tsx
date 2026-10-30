'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { HOME_LOGO_SIZE, HOME_LOGO_WORDS, HOME_M_IMAGES, HOME_M_WINDOWS } from '@/lib/homeLogo';

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/**
 * "The Mini Museum": the words, with a picture showing through each big M
 * (see lib/homeLogo.ts for where the pictures go).
 */
function HomeLogo() {
  const { width, height } = HOME_LOGO_SIZE;
  return (
    <span
      role="img"
      aria-label="The Mini Museum"
      className="relative block w-[70vw] md:w-[450px] lg:w-[530px]"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {(['mini', 'museum'] as const).map((m) => {
        const w = HOME_M_WINDOWS[m];
        const mask = `url(${w.mask})`;
        return (
          <span
            key={m}
            data-m={m}
            className="absolute overflow-hidden"
            style={{
              left: pct(w.x, width),
              top: pct(w.y, height),
              width: pct(w.width, width),
              height: pct(w.height, height),
              WebkitMaskImage: mask,
              maskImage: mask,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          >
            <Image src={HOME_M_IMAGES[m]} alt="" fill priority sizes="(min-width: 1024px) 150px, (min-width: 768px) 125px, 20vw" className="object-cover" />
          </span>
        );
      })}
      <Image src={HOME_LOGO_WORDS} alt="" fill priority sizes="(min-width: 1024px) 530px, (min-width: 768px) 450px, 70vw" />
    </span>
  );
}

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
        <HomeLogo />
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