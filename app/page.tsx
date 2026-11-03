'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { useMuseumSound } from '@/lib/museumSound';
import { unlockHallSound } from '@/components/HallSound';

// REVIEW (Verity): the sound switch at the door, and its recommendation.
const DOOR_SOUND_OFF = 'Turn the museum’s sound on';
const DOOR_SOUND_ON = 'Museum sound on';
const DOOR_SOUND_HINT = 'Best with sound on: the halls and rooms are heard as you walk through.';

export default function Home() {
  const reduceMotion = usePrefersReducedMotion();
  // The museum's one sound switch (lib/museumSound.ts): turned on here, the halls and the rooms are heard from the Great Hall on.
  const [sound, setSound] = useMuseumSound();
  const toggleSound = () => {
    // The press itself unlocks the hall's sound, for browsers that ask for one on the sound itself.
    if (!sound) unlockHallSound();
    setSound(!sound);
  };
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

        {/* Below Enter, in a box of its own (Enter's own box keeps Enter's width): the museum's sound, recommended on. */}
        <div
          className={`flex flex-col items-center transition-all duration-1000 ease-out ${
            detailsVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
          }`}
          style={{ marginTop: '28px', gap: '10px' }}
        >
          <button
            type="button"
            aria-pressed={sound}
            onClick={toggleSound}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
              padding: '0 18px',
              border: '1px solid rgba(250, 250, 250, 0.3)',
              borderRadius: '999px',
              background: sound ? 'rgba(250, 250, 250, 0.05)' : 'transparent',
              color: '#fafafa',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: sound ? 1 : 0.8,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = sound ? '1' : '0.8';
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1px solid currentColor', background: sound ? 'currentColor' : 'transparent' }}
            />
            {sound ? DOOR_SOUND_ON : DOOR_SOUND_OFF}
          </button>
          <p
            className="font-serif"
            style={{ margin: 0, maxWidth: '22em', padding: '0 16px', textAlign: 'center', fontStyle: 'italic', fontWeight: 300, fontSize: '15px', lineHeight: 1.5, color: '#808080' }}
          >
            {DOOR_SOUND_HINT}
          </p>
        </div>
      </div>
    </div>
  );
}