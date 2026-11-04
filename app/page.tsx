'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { useMuseumSound } from '@/lib/museumSound';
import { unlockHallSound } from '@/components/HallSound';

// REVIEW (Verity): the question Enter asks, and its two answers.
const DOOR_SOUND_TITLE = 'Sound on?';
const DOOR_SOUND_HINT = 'The museum is best with sound on: the halls and rooms are heard as you walk through.';
const DOOR_SOUND_YES = 'Enter with sound';
const DOOR_SOUND_NO = 'Enter without sound';

const doorChoice = (primary: boolean): CSSProperties => ({
  display: 'block',
  width: '100%',
  minHeight: '44px',
  padding: '12px 24px',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '11px',
  fontWeight: 300,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: primary ? '#0a0a0a' : '#fafafa',
  background: primary ? '#fafafa' : 'transparent',
  border: '1px solid rgba(250, 250, 250, ' + (primary ? '1' : '0.3') + ')',
  borderRadius: 0,
  cursor: 'pointer',
});

export default function Home() {
  const reduceMotion = usePrefersReducedMotion();
  // The museum's one sound switch (lib/museumSound.ts): turned on here, the halls and the rooms are heard from the Great Hall on.
  const [sound, setSound] = useMuseumSound();
  const router = useRouter();
  // Enter asks once, in a small window, whether to bring the sound; with sound already on it simply opens.
  const [asking, setAsking] = useState(false);
  const enterRef = useRef<HTMLAnchorElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const enter = (withSound: boolean) => {
    // The press itself unlocks the hall's sound, for browsers that ask for one on the sound itself.
    if (withSound) unlockHallSound();
    setSound(withSound);
    router.push('/greathall');
  };
  const closeAsking = () => {
    setAsking(false);
    enterRef.current?.focus();
  };
  useEffect(() => {
    if (asking) yesRef.current?.focus();
  }, [asking]);
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
            ref={enterRef}
            href="/greathall"
            aria-haspopup={sound ? undefined : 'dialog'}
            onClick={(e) => {
              if (sound) return;
              e.preventDefault();
              setAsking(true);
            }}
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

      {asking && (
        <div
          onClick={closeAsking}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="door-sound-title"
            aria-describedby="door-sound-hint"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                closeAsking();
              } else if (e.key === 'Tab') {
                // Two answers, and focus keeps between them.
                e.preventDefault();
                (document.activeElement === yesRef.current ? noRef : yesRef).current?.focus();
              }
            }}
            style={{ width: '100%', maxWidth: '360px', padding: '32px 28px 28px', background: '#0a0a0a', border: '1px solid rgba(250, 250, 250, 0.2)', textAlign: 'center' }}
          >
            <h2
              id="door-sound-title"
              style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '12px', fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fafafa' }}
            >
              {DOOR_SOUND_TITLE}
            </h2>
            <p
              id="door-sound-hint"
              className="font-serif"
              style={{ margin: '16px 0 24px', fontStyle: 'italic', fontWeight: 300, fontSize: '16px', lineHeight: 1.5, color: '#a0a0a0' }}
            >
              {DOOR_SOUND_HINT}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button ref={yesRef} type="button" onClick={() => enter(true)} style={doorChoice(true)}>
                {DOOR_SOUND_YES}
              </button>
              <button ref={noRef} type="button" onClick={() => enter(false)} style={doorChoice(false)}>
                {DOOR_SOUND_NO}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}