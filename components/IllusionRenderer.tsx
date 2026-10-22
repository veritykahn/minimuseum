'use client';

import { useCallback, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus, useReducedMotion } from '@/lib/a11y';
import Verdict from '@/components/games/Verdict';
import type { IllusionItem } from '@/app/exhibitions/seeing-is-deceiving/illusions/data';

// ============================================
// ILLUSION RENDERER
// One illusion of the Seeing Is Deceiving Perception Lab: the picture, the
// question, the choices, a verdict once answered, a "test it yourself"
// control where one is cheap, and "The Science" card.
//
// All state lives at the top of the component and every hook runs on every
// render. Each illusion only differs in how it is drawn (renderVisual) and in
// its data (illusion-content.ts).
// ============================================

type IllusionProps = {
  item: IllusionItem;
  /** The choice id already given for this illusion, or null. */
  answer: string | null;
  onAnswer: (choiceId: string) => void;
};

/** Whether a choice saw through the illusion; null for unscored items. */
export function judge(item: IllusionItem, choiceId: string): 'sharp' | 'fooled' | null {
  if (!item.scored) return null;
  return (item.truth ?? []).includes(choiceId) ? 'sharp' : 'fooled';
}

const TEXT = '#a8d5e5';
const DIM = 'rgba(168, 213, 229, 0.75)';

// Colors for the simultaneous-contrast squares: one gray on a light and a dark field.
const CONTRAST_GRAY = '#8a8a8a';
const CONTRAST_LIGHT = '#f2b880';
const CONTRAST_DARK = '#3d2560';

const subscribeNoop = () => () => {};

export default function IllusionRenderer({ item, answer, onAnswer }: IllusionProps) {
  const { illusionType = '', src, revealSrc, altRevealSrc, question, scienceExplanation } = item;

  const [showScience, setShowScience] = useState(false);
  // After answering: false shows the truth (reveal image, guides), true shows the illusion again.
  const [peek, setPeek] = useState(false);
  const [test, setTest] = useState(false);
  const [slide, setSlide] = useState(0);
  const [view, setView] = useState<string | null>(null);
  // The lilac chaser moves forever: it waits paused for visitors who ask for
  // reduced motion, and can be paused by anyone (WCAG 2.2.2).
  const reducedMotion = useReducedMotion();
  const [lilacChoice, setLilacRunning] = useState<boolean | null>(null);
  const lilacRunning = lilacChoice ?? !reducedMotion;
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  // "The Science" card is a modal dialog: focus moves to Close, Tab stays
  // inside, Escape closes, and focus returns to "How Does This Work?".
  const scienceCardRef = useRef<HTMLDivElement>(null);
  const scienceCloseRef = useRef<HTMLButtonElement>(null);
  const scienceTitleId = useId();
  const closeScience = useCallback(() => setShowScience(false), []);
  useDialogFocus(scienceCardRef, showScience, {
    onEscape: closeScience,
    initialFocus: scienceCloseRef,
    returnFocus: () => document.querySelector<HTMLElement>('[data-science-btn]'),
  });

  const answered = answer !== null;
  const revealed = answered && !peek;
  const outcome = answered ? judge(item, answer) : null;
  const choice = item.choices?.find((c) => c.id === answer);

  // For two-view figures the chosen reading is shown first.
  const shownView = view ?? (answered ? answer : null);

  // ── Styles ──
  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(70px, 8vh, 100px) clamp(16px, 5vw, 40px) clamp(80px, 10vh, 120px)',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  };
  const nameLabelStyle: CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: DIM,
    marginBottom: '12px',
    flexShrink: 0,
    minHeight: '18px',
    textAlign: 'center',
  };
  const questionStyle: CSSProperties = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
    fontStyle: 'italic',
    fontWeight: 400,
    color: TEXT,
    textAlign: 'center',
    maxWidth: '650px',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: 0,
    padding: '0 16px',
  };
  const imageContainerStyle: CSSProperties = {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 'clamp(300px, 70vw, 550px)',
    height: 'clamp(220px, 46vh, 430px)',
    margin: '16px 0',
  };
  const imageWrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  };
  const svgWrapperStyle: CSSProperties = { ...imageWrapperStyle, background: '#1a1a1a', padding: 'clamp(16px, 4vw, 40px)' };
  const imageStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    borderRadius: '4px',
  };
  const buttonStyle: CSSProperties = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(11px, 2.5vw, 12px)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: 'clamp(12px, 2.5vw, 14px) clamp(18px, 4.5vw, 28px)',
    minHeight: '44px',
    background: 'transparent',
    border: `1px solid ${TEXT}`,
    color: TEXT,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };
  const pressedStyle = (on: boolean): CSSProperties => ({
    ...buttonStyle,
    background: on ? TEXT : 'transparent',
    color: on ? '#0a0a0a' : TEXT,
  });

  const img = (s: string, alt: string, extra?: CSSProperties) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={s} alt={alt} style={{ ...imageStyle, ...extra }} />
  );
  const pick = (a: string | undefined, fallback: string) => a || fallback;

  // ── Visuals ──
  const renderVisual = (): ReactNode => {
    switch (illusionType) {
      case 'checker-shadow':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/checker-reveal.jpg') : pick(src, '/exhibitions/seeing/checker-shadow.jpg'),
          revealed
            ? 'Checker Shadow with a gray band joining squares A and B, showing they are the same shade'
            : 'A checkerboard with a green cylinder casting a shadow; square A sits in the light, square B in the shadow',
        );
      case 'balcony': {
        const s =
          shownView === 'out'
            ? pick(revealSrc, '/exhibitions/seeing/balcony-out.jpg')
            : shownView === 'in'
              ? pick(altRevealSrc, '/exhibitions/seeing/balcony-over.jpg')
              : pick(src, '/exhibitions/seeing/balcony.jpg');
        return img(s, shownView === 'out' ? 'The figure read as looking out from a balcony' : shownView === 'in' ? 'The figure read as looking over a ledge from inside' : 'An ambiguous drawing of a man at a balcony');
      }
      case 'rubins-vase': {
        const s =
          shownView === 'vase'
            ? pick(revealSrc, '/exhibitions/seeing/rubins-vase-vase.jpg')
            : shownView === 'faces'
              ? pick(altRevealSrc, '/exhibitions/seeing/rubins-vase-face.jpg')
              : pick(src, '/exhibitions/seeing/rubins-vase.jpg');
        return img(s, shownView === 'vase' ? 'Rubin’s figure shaded to show the vase' : shownView === 'faces' ? 'Rubin’s figure shaded to show two faces' : 'Rubin’s vase: a shape that is a vase or two faces in profile');
      }
      case 'fraser-spiral':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/fraser-spiral.gif') : pick(src, '/exhibitions/seeing/fraser-spiral.jpg'),
          revealed ? 'The Fraser figure with one ring traced, showing it is a circle' : 'The Fraser spiral: twisted-cord rings on a checked background',
        );
      case 'bulging-grid':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/grid.jpg') : pick(src, '/exhibitions/seeing/bulging-grid.jpg'),
          revealed ? 'The same grid without the small squares: every line is straight' : 'A checkerboard grid with small squares that seems to bulge in the middle',
        );
      case 'rotating-snakes':
        return img(pick(src, '/exhibitions/seeing/rotating-snakes.jpg'), 'Rotating Snakes: rings of black, blue, white and yellow shapes', { maxWidth: '600px' });
      case 'ponzo-corridor':
        return img(
          revealed ? '/exhibitions/seeing/ponzo-corridor-reveal.png' : pick(src, '/exhibitions/seeing/ponzo-corridor.jpg'),
          revealed ? 'The two balls side by side, the same size' : 'Two checkered balls in a corridor, one near the back and one at the front',
        );
      case 'jastrow':
        return img(
          revealed ? '/exhibitions/seeing/jastrow-tracks-reveal.gif' : pick(src, '/exhibitions/seeing/jastrow-tracks.jpg'),
          revealed ? 'The two curved track pieces moved over each other: the same size' : 'Two curved track pieces, a gray one above a dark one',
        );
      case 'ebbinghaus-circles':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/ebbinghaus-reveal.jpg') : pick(src, '/exhibitions/seeing/ebbinghaus.jpg'),
          revealed ? 'The two purple circles without their surrounding circles: the same size' : 'A purple circle ringed by large yellow circles, and another ringed by small ones',
        );
      case 'impossible-trident':
        return img(pick(src, '/exhibitions/seeing/impossible-trident.jpg'), 'A drawing of a trident whose prongs do not add up');
      case 'sander-parallelogram':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/line-comparison-reveal.gif') : pick(src, '/exhibitions/seeing/line-comparison.jpg'),
          revealed ? 'The two diagonals A-B and B-C rotated onto each other: the same length' : 'A parallelogram split in two, with diagonals from A to B and from B to C',
        );
      case 'poggendorff':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/poggendorf-reveal.jpg') : pick(src, '/exhibitions/seeing/poggendorf.jpg'),
          revealed ? 'The bar removed: the yellow line runs straight into the purple line' : 'A yellow line disappears behind a bar; a gray and a purple line come out the other side',
        );
      case 'gradient-bar':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/gradient-reveal.jpg') : pick(src, '/exhibitions/seeing/gradient.jpg'),
          revealed ? 'The bar on a plain background: one even gray' : 'A gray bar across a background that fades from dark to light',
        );
      case 'hermann-grid':
        return img(pick(src, '/exhibitions/seeing/ghost-dots.jpg'), 'A black grid of gray lines with white dots where the lines cross');
      case 'chromostereopsis':
        return img(pick(src, '/exhibitions/seeing/chromostereopsis.jpg'), 'A flat pattern of red shapes on a blue ground');
      case 'seesaw':
        return img(
          revealed ? pick(revealSrc, '/exhibitions/seeing/seesaw-reveal.jpg') : pick(src, '/exhibitions/seeing/seesaw.jpg'),
          revealed ? 'The seesaw settles level: balanced' : 'A seesaw with a long bar on top and a shorter block beneath',
        );
      case 'simultaneous-contrast': {
        const hideBg = answered && test;
        return (
          <div style={svgWrapperStyle}>
            <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', maxWidth: '400px' }} role="img" aria-label="Two equal gray squares, A on a light orange field and B on a dark purple field">
              <rect x="20" y="10" width="160" height="160" fill={hideBg ? '#1a1a1a' : CONTRAST_LIGHT} style={{ transition: 'fill 0.6s ease' }} />
              <rect x="60" y="50" width="80" height="80" fill={CONTRAST_GRAY} />
              <rect x="220" y="10" width="160" height="160" fill={hideBg ? '#1a1a1a' : CONTRAST_DARK} style={{ transition: 'fill 0.6s ease' }} />
              <rect x="260" y="50" width="80" height="80" fill={CONTRAST_GRAY} />
              <text x="100" y="198" fill={TEXT} fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">A</text>
              <text x="300" y="198" fill={TEXT} fontSize="16" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="500">B</text>
              {revealed && (
                <>
                  <text x="100" y="95" fill="#111" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">{CONTRAST_GRAY}</text>
                  <text x="300" y="95" fill="#111" fontSize="11" textAnchor="middle" fontFamily="Outfit, sans-serif">{CONTRAST_GRAY}</text>
                </>
              )}
            </svg>
          </div>
        );
      }
      case 'cafe-wall': {
        const rows = 8;
        const cols = 10;
        const tile = 30;
        const mortar = 3;
        return (
          <div style={{ ...svgWrapperStyle, padding: '20px' }}>
            <svg viewBox={`0 0 ${cols * tile} ${rows * (tile + mortar)}`} style={{ width: '100%', height: '100%', maxWidth: '350px' }} role="img" aria-label={revealed ? 'The café wall with its tiles lined up: the gray lines are level' : 'Rows of black and white tiles, offset row by row, between gray lines'}>
              {Array.from({ length: rows + 1 }).map((_, i) => (
                <rect key={`m-${i}`} x="0" y={i * (tile + mortar)} width={cols * tile} height={mortar} fill={revealed ? '#ff6b6b' : '#808080'} style={{ transition: 'fill 0.3s ease' }} />
              ))}
              {Array.from({ length: rows }).map((_, row) => (
                <g key={`r-${row}`}>
                  {Array.from({ length: cols }).map((_, col) => {
                    const offset = revealed ? 0 : row % 2 === 0 ? tile / 2 : 0;
                    return (
                      <rect
                        key={`t-${row}-${col}`}
                        x={col * tile + offset - (revealed ? 0 : tile / 4)}
                        y={row * (tile + mortar) + mortar}
                        width={tile}
                        height={tile}
                        fill={(row + col) % 2 === 0 ? '#1a1a1a' : '#f0f0f0'}
                        style={{ transition: 'all 0.5s ease' }}
                      />
                    );
                  })}
                </g>
              ))}
            </svg>
          </div>
        );
      }
      case 'muller-lyer': {
        const arrows = !(answered && test);
        return (
          <div style={svgWrapperStyle}>
            <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', maxWidth: '400px' }} role="img" aria-label={arrows ? 'Line 1 with arrowheads pointing in, line 2 with fins pointing out' : 'The two lines without arrowheads: the same length'}>
              <g transform="translate(100, 60)">
                <text x="-30" y="5" fill={TEXT} fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">1</text>
                <line x1="0" y1="0" x2="200" y2="0" stroke={TEXT} strokeWidth="3" />
                <g style={{ opacity: arrows ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <polyline points="50,-30 0,0 50,30" fill="none" stroke={TEXT} strokeWidth="3" />
                  <polyline points="150,-30 200,0 150,30" fill="none" stroke={TEXT} strokeWidth="3" />
                </g>
              </g>
              <g transform="translate(100, 140)">
                <text x="-30" y="5" fill={TEXT} fontSize="16" fontFamily="Outfit, sans-serif" fontWeight="500">2</text>
                <line x1="0" y1="0" x2="200" y2="0" stroke={TEXT} strokeWidth="3" />
                <g style={{ opacity: arrows ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                  <polyline points="-50,-30 0,0 -50,30" fill="none" stroke={TEXT} strokeWidth="3" />
                  <polyline points="250,-30 200,0 250,30" fill="none" stroke={TEXT} strokeWidth="3" />
                </g>
              </g>
              {revealed && (
                <>
                  <line x1="100" y1="40" x2="100" y2="160" stroke="#f2b880" strokeWidth="1.5" strokeDasharray="4" />
                  <line x1="300" y1="40" x2="300" y2="160" stroke="#f2b880" strokeWidth="1.5" strokeDasharray="4" />
                </>
              )}
            </svg>
          </div>
        );
      }
      case 'ponzo-railroad': {
        // Drag (or arrow-key) the top bar down the tracks to compare it with the bottom one.
        const topY = 60 + (slide / 100) * 112;
        return (
          <div style={svgWrapperStyle}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%', maxWidth: '300px' }} role="img" aria-label="Two equal yellow bars between converging railroad tracks, one near the top and one near the bottom">
              <line x1="50" y1="280" x2="150" y2="20" stroke="#666" strokeWidth="3" />
              <line x1="250" y1="280" x2="150" y2="20" stroke="#666" strokeWidth="3" />
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const y = 260 - i * 30;
                const spread = 100 - i * 10;
                return <line key={i} x1={150 - spread} y1={y} x2={150 + spread} y2={y} stroke="#555" strokeWidth="2" />;
              })}
              <rect x="100" y={topY} width="100" height="20" fill="#e8c85f" rx="2" />
              <rect x="100" y="200" width="100" height="20" fill="#e8c85f" rx="2" />
              {revealed && (
                <>
                  <line x1="100" y1="40" x2="100" y2="235" stroke={TEXT} strokeWidth="1" strokeDasharray="4" />
                  <line x1="200" y1="40" x2="200" y2="235" stroke={TEXT} strokeWidth="1" strokeDasharray="4" />
                </>
              )}
            </svg>
          </div>
        );
      }
      case 'lilac-chaser': {
        const dotCount = 12;
        const radius = 80;
        return (
          <div style={{ ...imageWrapperStyle, background: '#909090', padding: '40px', position: 'relative' }}>
            <style>{`
              @keyframes lilacFade { 0%, 8.33% { opacity: 0; } 8.34%, 100% { opacity: 1; } }
              .lilac-dot { animation: lilacFade 1.2s infinite; }
            `}</style>
            <svg viewBox="0 0 250 250" style={{ width: '100%', height: '100%', maxWidth: '250px' }} role="img" aria-label="Twelve blurred lilac dots in a ring around a cross, one disappearing at a time in turn">
              <defs>
                <filter id="fuzzy" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
              </defs>
              <line x1="115" y1="125" x2="135" y2="125" stroke="#2a2a2a" strokeWidth="2" />
              <line x1="125" y1="115" x2="125" y2="135" stroke="#2a2a2a" strokeWidth="2" />
              {Array.from({ length: dotCount }).map((_, i) => {
                const angle = ((i * 360) / dotCount) * (Math.PI / 180);
                return (
                  <circle
                    key={i}
                    cx={125 + radius * Math.cos(angle)}
                    cy={125 + radius * Math.sin(angle)}
                    r="15"
                    fill="#e0a0d0"
                    filter="url(#fuzzy)"
                    className={lilacRunning ? 'lilac-dot' : ''}
                    style={{ animationDelay: lilacRunning ? `${(i / dotCount) * 1.2}s` : '0s', opacity: lilacRunning ? undefined : 1 }}
                  />
                );
              })}
            </svg>
          </div>
        );
      }
      case 'kanizsa-triangle-svg': {
        const r = 45;
        const pac = (cx: number, cy: number, a1: number, a2: number) =>
          `M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 1 0 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`;
        const turn = (ox: number, oy: number): CSSProperties => ({
          transition: 'transform 0.5s ease',
          transformOrigin: `${ox}px ${oy}px`,
          transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)',
        });
        return (
          <div style={svgWrapperStyle}>
            <svg viewBox="0 0 300 280" style={{ width: '100%', height: '100%', maxWidth: '300px' }} role="img" aria-label={revealed ? 'The three pac-man shapes turned away: no triangle' : 'Three pac-man shapes whose mouths face each other'}>
              <path d={pac(150, 55, Math.PI / 3, (2 * Math.PI) / 3)} fill={TEXT} style={turn(150, 55)} />
              <path d={pac(75, 215, -Math.PI / 3, 0)} fill={TEXT} style={turn(75, 215)} />
              <path d={pac(225, 215, Math.PI, (-2 * Math.PI) / 3)} fill={TEXT} style={turn(225, 215)} />
            </svg>
          </div>
        );
      }
      case 'paris-springtime-svg':
        return (
          <div style={svgWrapperStyle}>
            <svg viewBox="0 0 300 280" style={{ width: '100%', height: '100%', maxWidth: '300px' }} role="img" aria-label={revealed ? 'The triangle reads: I love Paris in the the springtime — the word “the” appears twice' : 'A lilac triangle with a three-line phrase about Paris'}>
              <polygon points="150,15 15,265 285,265" fill="#c9a0dc" stroke="#c9a0dc" strokeWidth="2" />
              <text x="150" y="120" fill="#1a1a1a" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">I love</text>
              <text x="150" y="160" fill="#1a1a1a" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">
                Paris in{' '}
                <tspan fill={revealed ? '#b02020' : '#1a1a1a'} fontWeight={revealed ? '700' : '500'}>the</tspan>
              </text>
              <text x="150" y="200" fontSize="26" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="500">
                <tspan fill={revealed ? '#b02020' : '#1a1a1a'} fontWeight={revealed ? '700' : '500'}>the</tspan>
                <tspan fill="#1a1a1a"> springtime</tspan>
              </text>
            </svg>
          </div>
        );
      default:
        return <p style={questionStyle}>Unknown illusion type: {illusionType}</p>;
    }
  };

  // ── Test-it-yourself controls (after answering) ──
  const renderTest = (): ReactNode => {
    if (!answered) return null;
    switch (illusionType) {
      case 'simultaneous-contrast':
        return (
          <button type="button" style={pressedStyle(test)} aria-pressed={test} onClick={() => setTest((t) => !t)}>
            {test ? 'Bring back the backgrounds' : 'Hide the backgrounds'}
          </button>
        );
      case 'muller-lyer':
        return (
          <button type="button" style={pressedStyle(test)} aria-pressed={test} onClick={() => setTest((t) => !t)}>
            {test ? 'Bring back the arrows' : 'Hide the arrows'}
          </button>
        );
      case 'balcony':
        return (
          <>
            <button type="button" style={pressedStyle(shownView === 'out')} aria-pressed={shownView === 'out'} onClick={() => setView('out')}>Looking out</button>
            <button type="button" style={pressedStyle(shownView === 'in')} aria-pressed={shownView === 'in'} onClick={() => setView('in')}>Looking in</button>
          </>
        );
      case 'rubins-vase':
        return (
          <>
            <button type="button" style={pressedStyle(shownView === 'vase')} aria-pressed={shownView === 'vase'} onClick={() => setView('vase')}>See the vase</button>
            <button type="button" style={pressedStyle(shownView === 'faces')} aria-pressed={shownView === 'faces'} onClick={() => setView('faces')}>See the faces</button>
          </>
        );
      default:
        return null;
    }
  };

  // Illusions whose answer changes the picture can flip back to the original.
  const PEEKABLE = new Set([
    'checker-shadow', 'fraser-spiral', 'bulging-grid', 'ponzo-corridor', 'jastrow', 'ebbinghaus-circles',
    'sander-parallelogram', 'poggendorff', 'gradient-bar', 'seesaw', 'cafe-wall', 'kanizsa-triangle-svg',
    'paris-springtime-svg', 'muller-lyer', 'ponzo-railroad', 'simultaneous-contrast',
  ]);
  const canPeek = answered && PEEKABLE.has(illusionType);

  const verdictTitle =
    outcome === 'sharp' ? item.sharpLine : outcome === 'fooled' ? item.fooledLine : item.neutralLine;

  const scienceCard = scienceExplanation && (
    <>
      <div
        onClick={() => setShowScience(false)}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          opacity: showScience ? 1 : 0,
          visibility: showScience ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          zIndex: 2000,
        }}
      />
      <div
        ref={scienceCardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={scienceTitleId}
        inert={!showScience}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: showScience ? 'translate(-50%, -50%) rotate(0deg)' : 'translate(-50%, -40%) rotate(-2deg) scale(0.95)',
          opacity: showScience ? 1 : 0,
          visibility: showScience ? 'visible' : 'hidden',
          background: '#1c1c1c',
          borderRadius: '8px',
          padding: 'clamp(20px, 5vw, 32px)',
          width: 'calc(100% - 32px)',
          maxWidth: '440px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 2001,
        }}
      >
        <button
          type="button"
          ref={scienceCloseRef}
          aria-label="Close"
          onClick={() => setShowScience(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'transparent',
            border: `1px solid ${TEXT}`,
            color: TEXT,
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
        <h2
          id={scienceTitleId}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: DIM,
            marginBottom: '20px',
          }}
        >
          The Science
        </h2>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(15px, 3.5vw, 17px)', lineHeight: 1.8, color: TEXT, margin: 0 }}>
          {scienceExplanation}
        </p>
      </div>
    </>
  );

  const questionId = `q-${item.id ?? illusionType}`;

  return (
    <div style={containerStyle}>
      <span style={nameLabelStyle}>{item.name}</span>
      <h1 id={questionId} style={questionStyle}>{question}</h1>

      <div style={imageContainerStyle}>{renderVisual()}</div>

      {illusionType === 'ponzo-railroad' && answered && (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', fontFamily: 'Outfit, sans-serif', fontSize: '12px', letterSpacing: '0.08em', color: TEXT, marginBottom: '8px' }}>
          Test it: slide the top bar down the tracks
          <input
            type="range"
            min={0}
            max={100}
            value={slide}
            onChange={(e) => setSlide(Number(e.target.value))}
            style={{ width: 'min(260px, 70vw)', accentColor: '#e8c85f' }}
            aria-valuetext={slide >= 95 ? 'Right above the bottom bar' : `${slide}% of the way down`}
          />
        </label>
      )}

      <div style={{ minHeight: '96px', width: '100%', display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
        {answered && (
          <Verdict
            key={answer}
            tone={outcome === 'sharp' ? 'right' : outcome === 'fooled' ? 'wrong' : 'neutral'}
            mark={outcome === 'fooled' ? '!' : undefined}
            title={verdictTitle}
            style={{
              maxWidth: '640px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              ['--game-right' as string]: '#8fe0a5',
              ['--game-wrong' as string]: '#f2b880',
              ['--game-accent' as string]: TEXT,
            }}
            titleClassName="pl-verdict-line"
          >
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(13px, 2.5vw, 14px)', color: TEXT, lineHeight: 1.7, margin: '8px 0 0', padding: '0 12px' }}>
              {choice && <span style={{ color: DIM }}>You chose “{choice.label}.” </span>}
              {item.answer}
            </p>
          </Verdict>
        )}
      </div>

      <div style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap', padding: '8px 0', marginTop: '4px' }}>
        {illusionType === 'lilac-chaser' && (
          <button type="button" style={buttonStyle} onClick={() => setLilacRunning(!lilacRunning)}>
            {lilacRunning ? 'Pause Animation' : 'Start Animation'}
          </button>
        )}
        {!answered ? (
          <div role="group" aria-labelledby={questionId} style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {item.choices?.map((c) => (
              <button key={c.id} type="button" style={buttonStyle} onClick={() => onAnswer(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <>
            {canPeek && (
              <button type="button" style={pressedStyle(peek)} aria-pressed={peek} onClick={() => setPeek((p) => !p)}>
                See the illusion again
              </button>
            )}
            {renderTest()}
            {scienceExplanation && (
              <button type="button" data-science-btn="" aria-haspopup="dialog" onClick={() => setShowScience(true)} style={buttonStyle}>
                How Does This Work?
              </button>
            )}
          </>
        )}
      </div>

      {/* Portaled to <body>: inside the page it would be trapped in the
          slide's stacking context, beneath the arrows, counter and MAP. */}
      {mounted && scienceCard ? createPortal(scienceCard, document.body) : null}
    </div>
  );
}
