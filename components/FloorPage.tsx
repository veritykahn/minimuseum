'use client';

import { useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Floor, type StudioFloor, GREAT_HALL_FLOORS, exhibitionPath, findExhibition, studioToolHref } from '@/lib/floors';
import { type HallLight, HALL_HINT, hallBackground, hallBody, hallText, ticketText } from '@/lib/hallLight';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import StudioGlyph from './StudioGlyph';

/**
 * A floor of the museum: a horizontal carousel of exhibition cards, one per
 * screen. Open exhibitions have an "Enter Exhibition" ticket; the rest show
 * "Installation in progress". Entering an exhibition remembers its card, so
 * its back link (see `floorReturnFor`) returns to the same place.
 *
 * The Studio (StudioFloorPage) is the same carousel with a workshop's
 * pegboard behind it: a card for each make-your-own tool, in its
 * exhibition's color, with a "Start Making" ticket that opens the tool
 * (and tells it the Studio sent the visitor, so its "M ←" comes back here).
 *
 * Behind the cards the corridor is dark, lit by each exhibition's own light
 * (lib/hallLight.ts): one layer per card, fixed behind the carousel, each
 * as bright as its card is on screen, so swiping cross-fades one exhibition
 * into the next. With reduced motion the light changes by a short fade once
 * a card has settled instead. A layer carries its exhibition's slug
 * (data-exhibition), so a faint motif of its own could be laid in later.
 *
 * "M ← Great Hall" returns to the Great Hall's stairs, not its entrance.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

/** One card on a floor: an exhibition, or a Studio tool. */
type FloorCard = {
  key: string;
  /** "Exhibition 01" */
  kicker: string;
  title: string;
  subtitle: string;
  accent: string;
  /** The hallway's light behind the card: its exhibition's. */
  hall: HallLight;
  /** The exhibition it belongs to, for its light's layer. */
  exhibition: string;
  active: boolean;
  href: string;
  /** The ticket's call: "Enter Exhibition", "Start Making". */
  ticket: string;
  /** A Studio tool's line about what you make. */
  description?: string;
  /** A Studio tool's drawing, above its name. */
  glyph?: ReactNode;
};

type FloorFrame = Pick<Floor, 'heading' | 'name' | 'theme' | 'accent' | 'storageKey'>;

export default function FloorPage({ floor }: { floor: Floor }) {
  const cards: FloorCard[] = floor.exhibitions.map((e, i) => ({
    key: e.slug,
    kicker: `Exhibition ${String(i + 1).padStart(2, '0')}`,
    title: e.title,
    subtitle: e.subtitle,
    accent: e.accent,
    hall: e.hall,
    exhibition: e.slug,
    active: e.active,
    href: exhibitionPath(e.slug),
    ticket: 'Enter Exhibition',
  }));
  return <FloorCarousel floor={floor} cards={cards} />;
}

/** The Studio: every make-your-own tool, each card a door to it in its exhibition. */
export function StudioFloorPage({ floor }: { floor: StudioFloor }) {
  const cards: FloorCard[] = floor.tools.map((t, i) => {
    const exhibition = findExhibition(t.exhibition);
    return {
      key: t.href,
      kicker: `Tool ${String(i + 1).padStart(2, '0')}`,
      title: t.title,
      subtitle: exhibition ? `From ${exhibition.title}` : '',
      accent: exhibition?.accent ?? floor.accent,
      hall: exhibition?.hall ?? { glow: floor.accent, bloom: floor.accent },
      exhibition: t.exhibition,
      active: true,
      href: studioToolHref(t.href),
      ticket: 'Start Making',
      description: t.description,
      glyph: <StudioGlyph href={t.href} />,
    };
  });
  return <FloorCarousel floor={floor} cards={cards} studio />;
}

function FloorCarousel({ floor, cards, studio = false }: { floor: FloorFrame; cards: FloorCard[]; studio?: boolean }) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = usePrefersReducedMotion();
  const { storageKey } = floor;

  useEffect(() => {
    const savedIndex = sessionStorage.getItem(storageKey);
    if (savedIndex && scrollRef.current) {
      const index = parseInt(savedIndex, 10);
      scrollRef.current.scrollTo({ left: index * window.innerWidth, behavior: 'instant' });
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // Each card's light is as bright as the card is on screen: half each while
  // the visitor is halfway between two. With reduced motion, only the card
  // nearest the middle is lit, and the light fades over (see .hall-light).
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let frame = 0;
    const light = () => {
      frame = 0;
      const at = scroller.scrollLeft / (scroller.clientWidth || 1);
      lightRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const on = reduceMotion ? (i === Math.round(at) ? 1 : 0) : Math.max(0, 1 - Math.abs(at - i));
        layer.style.opacity = String(on);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(light);
    };
    light();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const handleCardClick = (card: FloorCard, index: number) => {
    if (card.active) {
      // Store the scroll position/index so we can return to it
      sessionStorage.setItem(storageKey, index.toString());
      router.push(card.href);
    }
  };

  const Ticket = ({ onClick, accentColor, isActive, title, label }: { onClick: () => void; accentColor: string; isActive: boolean; title: string; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`ticket ${!isActive ? 'ticket-disabled' : ''}`}
      disabled={!isActive}
    >
      <span className="visually-hidden">{isActive ? `${label}: ${title}` : `Coming Soon: ${title}`}</span>
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H52C52 6.62742 57.3726 12 64 12C70.6274 12 76 6.62742 76 0H172C176.418 0 180 3.58172 180 8V72C180 76.4183 176.418 80 172 80H76C76 73.3726 70.6274 68 64 68C57.3726 68 52 73.3726 52 80H8C3.58172 80 0 76.4183 0 72V8Z" fill={isActive ? "#faf8f5" : "#2a2a2a"}/>
        <line x1="64" y1="16" x2="64" y2="64" stroke={isActive ? "#e5e2dc" : "#3a3a3a"} strokeWidth="1" strokeDasharray="4 3"/>
        <text x="32" y="38" textAnchor="middle" fill={isActive ? "#1a1a1a" : "#666"} style={{ fontFamily: 'Outfit', fontSize: '8px', fontWeight: 500, letterSpacing: '0.1em' }}>ADMIT ONE</text>
        <text x="125" y="28" textAnchor="middle" fill={isActive ? "#1a1a1a" : "#666"} style={{ fontFamily: 'Cormorant Garamond', fontSize: '10px' }}>The Mini Museum</text>
        <text x="125" y="48" textAnchor="middle" fill={isActive ? ticketText(accentColor) : "#555"} style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.08em' }}>
          {isActive ? label : 'Coming Soon'}
        </text>
      </svg>
    </button>
  );

  const Card = ({ card, index }: { card: FloorCard; index: number }) => (
    <div className="exhibition-card">
      {/* Installation in Progress Overlay */}
      {!card.active && (
        <div className="installation-overlay">
          <div className="installation-sign">
            <p className="installation-title">Installation in progress</p>
            <p className="installation-subtitle">Thank you for your patience</p>
          </div>
        </div>
      )}

      {/* Inactive cards are dimmed with muted, still-legible colors rather than
          opacity, so "coming soon" doesn't push the text below 4.5:1 */}
      <div style={{
        textAlign: 'center',
        padding: '40px',
        filter: card.active ? 'none' : 'grayscale(50%)'
      }}>
        {card.glyph && (
          <div className="studio-glyph" style={{ color: card.accent }} aria-hidden="true">
            {card.glyph}
          </div>
        )}
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: card.active ? hallText(card.accent, card.hall) : '#8a8a8a',
          marginBottom: '16px',
          fontFamily: 'Outfit, sans-serif'
        }}>
          {card.kicker}
        </p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: studio ? 'clamp(2.2rem, 5.5vw, 4rem)' : 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 300,
          lineHeight: 0.95,
          color: card.active ? '#fafafa' : '#a3a3a3',
          marginBottom: '16px'
        }}>
          {card.title}
        </h2>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: card.active ? hallText(card.accent, card.hall) : '#8a8a8a',
          marginBottom: card.description ? '20px' : '48px'
        }}>
          {card.subtitle}
        </p>
        {card.description && <p className="studio-description" style={{ color: hallBody(card.hall) }}>{card.description}</p>}
        <Ticket
          onClick={() => handleCardClick(card, index)}
          accentColor={card.accent}
          isActive={card.active}
          title={card.title}
          label={card.ticket}
        />
      </div>
    </div>
  );

  const rootStyle: CssVars = { background: '#0a0a0a', minHeight: '100vh', '--floor-accent': floor.accent };

  return (
    <div className={studio ? 'floor-root floor-studio' : 'floor-root'} style={rootStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #fafafa; overflow-x: hidden; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
        }

        .ticket {
          background: none;
          border: none;
          cursor: pointer;
          animation: float 4s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .ticket:hover:not(.ticket-disabled), .ticket:focus-visible:not(.ticket-disabled) {
          animation-play-state: paused;
          transform: translateY(-8px) scale(1.05);
        }
        .ticket-disabled {
          cursor: not-allowed;
          animation: none;
          opacity: 0.6;
        }

        .back-link {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #525252;
          text-decoration: none;
          font-family: 'Cormorant Garamond';
          transition: all 0.3s ease;
        }
        .back-link:hover, .back-link:focus-visible { color: #fafafa; }
        .back-link:hover .back-arrow, .back-link:focus-visible .back-arrow { transform: translateX(-4px); color: var(--floor-accent); }
        .back-link:hover .back-label, .back-link:focus-visible .back-label { opacity: 1; max-width: 100px; }
        .back-arrow { transition: all 0.3s ease; font-size: 16px; }
        .back-m { font-size: 28px; font-weight: 300; }
        .back-label {
          font-size: 13px;
          font-style: italic;
          color: var(--floor-accent);
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        .floor-indicator {
          position: fixed;
          top: 32px;
          right: 32px;
          z-index: 1000;
          text-align: right;
        }
        .floor-indicator-name {
          font-family: 'Outfit';
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #808080;
          margin-bottom: 4px;
        }
        .floor-indicator-year {
          font-family: 'Cormorant Garamond';
          font-size: 13px;
          font-style: italic;
          color: var(--floor-accent);
        }

        /* The hallway's light, behind the carousel (see the effect above). */
        .hall-light {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .hall-light-layer {
          position: absolute;
          inset: 0;
          will-change: opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .hall-light-layer { transition: opacity 0.6s ease; }
        }

        .exhibitions-scroll {
          position: relative;
          z-index: 1;
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          height: 100vh;
        }
        .exhibitions-scroll::-webkit-scrollbar { height: 4px; }
        .exhibitions-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

        .exhibition-card {
          flex: 0 0 100vw;
          min-width: 100vw;
          height: 100vh;
          scroll-snap-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* The Studio: a workshop's pegboard behind the tools, a rule with
           measuring marks along the foot of each, and the tool drawn in
           outline above its name. */
        .floor-studio .exhibitions-scroll {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1.4px, transparent 1.6px);
          background-size: 28px 28px;
          background-attachment: local;
        }
        .floor-studio .exhibition-card::after {
          content: '';
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: 96px;
          height: 10px;
          border-top: 1px solid rgba(224, 164, 88, 0.35);
          background: repeating-linear-gradient(90deg, rgba(224, 164, 88, 0.35) 0 1px, transparent 1px 24px);
          pointer-events: none;
        }
        .studio-glyph {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .studio-glyph svg { width: clamp(72px, 12vw, 104px); height: auto; overflow: visible; }
        .studio-description {
          max-width: 460px;
          margin: 0 auto 40px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.6;
          color: #c9c4bb;
        }

        /* Installation in Progress Overlay */
        .installation-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }

        .installation-sign {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px 48px;
          text-align: center;
        }

        .installation-title {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: #fafafa;
          margin-bottom: 8px;
        }

        .installation-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #8a8a8a;
        }

        .scroll-hint {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          color: ${HALL_HINT};
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'Outfit';
          white-space: nowrap;
          z-index: 100;
        }
        .scroll-hint-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #525252);
        }

        @media (max-width: 768px) {
          .back-link { top: 20px; left: 20px; }
          .back-m { font-size: 24px; }
          .back-arrow { font-size: 14px; }
          .floor-indicator { top: 20px; right: 20px; }
          .scroll-hint { bottom: 24px; gap: 12px; font-size: 10px; }
          .scroll-hint-line { width: 40px; }
          .installation-sign { padding: 24px 32px; }
          .installation-title { font-size: 12px; }
          .floor-studio .exhibition-card::after { bottom: 72px; left: 8%; right: 8%; }
          .studio-glyph { margin-bottom: 20px; }
          .studio-description { font-size: 14px; margin-bottom: 32px; }
        }
      `}</style>

      <h1 className="visually-hidden">{floor.heading}</h1>

      <Link href={GREAT_HALL_FLOORS} className="back-link">
        <span className="back-m" aria-hidden="true">M</span>
        <span className="back-arrow" aria-hidden="true">←</span>
        <span className="back-label">Great Hall</span>
      </Link>

      <div className="floor-indicator">
        <p className="floor-indicator-name">{floor.name}</p>
        <p className="floor-indicator-year">{floor.theme}</p>
      </div>

      <div className="hall-light" aria-hidden="true">
        {cards.map((card, index) => (
          <div
            key={card.key}
            ref={(el) => {
              lightRefs.current[index] = el;
            }}
            className="hall-light-layer"
            data-exhibition={card.exhibition}
            style={{ background: hallBackground(card.hall), opacity: index === 0 ? 1 : 0 }}
          />
        ))}
      </div>

      <div ref={scrollRef} className="exhibitions-scroll">
        {cards.map((card, index) => (
          <Card key={card.key} card={card} index={index} />
        ))}
      </div>

      <div className="scroll-hint">
        <div className="scroll-hint-line" style={{ transform: 'rotate(180deg)' }}></div>
        <span>Swipe to explore</span>
        <div className="scroll-hint-line"></div>
      </div>
    </div>
  );
}
