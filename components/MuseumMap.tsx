'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface MapRoom {
  id: string;
  label: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  comingSoon?: boolean;
  parent?: string;
  children?: string[];
}

const MUSEUM_ROOMS: MapRoom[] = [
  // Main Hub
  {
    id: 'greathall',
    label: 'Great Hall',
    path: '/greathall',
    x: 200,
    y: 30,
    width: 100,
    height: 50,
    accentColor: '#7D8471',
  },
  // Side rooms off Great Hall
  {
    id: 'about',
    label: 'About',
    path: '/about',
    x: 70,
    y: 30,
    width: 70,
    height: 50,
    accentColor: '#7D8471',
    parent: 'greathall',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    x: 360,
    y: 30,
    width: 70,
    height: 50,
    accentColor: '#7D8471',
    comingSoon: true,
    parent: 'greathall',
  },
  // Floors
  {
    id: 'first-floor',
    label: '1st Floor: Horizons',
    path: '/exhibitions/first-floor',
    x: 130,
    y: 120,
    width: 240,
    height: 40,
    accentColor: '#a8d5e5',
    parent: 'greathall',
    children: ['seeing-is-deceiving', 'writing-revolution', 'fear-lab', 'great-war'],
  },
  {
    id: 'ground-floor',
    label: 'Ground Floor: Origins',
    path: '/exhibitions/ground-floor',
    x: 130,
    y: 340,
    width: 240,
    height: 40,
    accentColor: '#7D8471',
    comingSoon: true,
    parent: 'greathall',
    children: ['egypt', 'victorian', 'holocaust', 'black-barbie', 'womens-history'],
  },
  // First Floor Exhibitions
  {
    id: 'seeing-is-deceiving',
    label: 'Seeing is Deceiving',
    path: '/exhibitions/seeing-is-deceiving',
    x: 40,
    y: 190,
    width: 110,
    height: 50,
    accentColor: '#a8d5e5',
    parent: 'first-floor',
    children: ['illusions', 'artifacts', 'resources'],
  },
  {
    id: 'writing-revolution',
    label: 'Writing Revolution',
    path: '/exhibitions/writing-revolution',
    x: 165,
    y: 190,
    width: 110,
    height: 50,
    accentColor: '#DC2626',
    comingSoon: true,
    parent: 'first-floor',
  },
  {
    id: 'fear-lab',
    label: 'Fear Lab',
    path: '/exhibitions/fear-lab',
    x: 290,
    y: 190,
    width: 80,
    height: 50,
    accentColor: '#1E3A5F',
    comingSoon: true,
    parent: 'first-floor',
  },
  {
    id: 'great-war',
    label: 'Great War',
    path: '/exhibitions/great-war',
    x: 385,
    y: 190,
    width: 80,
    height: 50,
    accentColor: '#9B2226',
    comingSoon: true,
    parent: 'first-floor',
  },
  // Seeing is Deceiving sub-rooms
  {
    id: 'illusions',
    label: 'Illusions',
    path: '/exhibitions/seeing-is-deceiving/illusions',
    x: 20,
    y: 270,
    width: 80,
    height: 40,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'artifacts',
    label: 'Artifacts',
    path: '/exhibitions/seeing-is-deceiving/artifacts',
    x: 115,
    y: 270,
    width: 80,
    height: 40,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/exhibitions/seeing-is-deceiving/resources',
    x: 210,
    y: 270,
    width: 80,
    height: 40,
    accentColor: '#a8d5e5',
    parent: 'seeing-is-deceiving',
  },
  // Ground Floor Exhibitions
  {
    id: 'egypt',
    label: 'Ancient Egypt',
    path: '/exhibitions/egypt',
    x: 15,
    y: 410,
    width: 80,
    height: 45,
    accentColor: '#E85D04',
    comingSoon: true,
    parent: 'ground-floor',
  },
  {
    id: 'victorian',
    label: 'Victorian Britain',
    path: '/exhibitions/victorian',
    x: 110,
    y: 410,
    width: 90,
    height: 45,
    accentColor: '#7D8471',
    comingSoon: true,
    parent: 'ground-floor',
  },
  {
    id: 'holocaust',
    label: 'The Holocaust',
    path: '/exhibitions/holocaust',
    x: 215,
    y: 410,
    width: 80,
    height: 45,
    accentColor: '#78716C',
    comingSoon: true,
    parent: 'ground-floor',
  },
  {
    id: 'black-barbie',
    label: 'Black Barbie',
    path: '/exhibitions/black-barbie',
    x: 310,
    y: 410,
    width: 75,
    height: 45,
    accentColor: '#EC4899',
    comingSoon: true,
    parent: 'ground-floor',
  },
  {
    id: 'womens-history',
    label: "Women's History",
    path: '/exhibitions/womens-history',
    x: 400,
    y: 410,
    width: 90,
    height: 45,
    accentColor: '#1D3557',
    comingSoon: true,
    parent: 'ground-floor',
  },
];

// Connection lines between rooms
const CONNECTIONS: [string, string][] = [
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ['greathall', 'first-floor'],
  ['greathall', 'ground-floor'],
  ['first-floor', 'seeing-is-deceiving'],
  ['first-floor', 'writing-revolution'],
  ['first-floor', 'fear-lab'],
  ['first-floor', 'great-war'],
  ['seeing-is-deceiving', 'illusions'],
  ['seeing-is-deceiving', 'artifacts'],
  ['seeing-is-deceiving', 'resources'],
  ['ground-floor', 'egypt'],
  ['ground-floor', 'victorian'],
  ['ground-floor', 'holocaust'],
  ['ground-floor', 'black-barbie'],
  ['ground-floor', 'womens-history'],
];

export default function MuseumMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show map on home/splash page
  const isHomePage = pathname === '/';

  // Find current room based on pathname
  const currentRoom = MUSEUM_ROOMS.find(room => room.path === pathname) ||
    MUSEUM_ROOMS.find(room => pathname.startsWith(room.path) && room.path !== '/');

  // Close map on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Don't render anything on home page (must be after all hooks)
  if (isHomePage) {
    return null;
  }

  const handleRoomClick = (room: MapRoom) => {
    if (!room.comingSoon) {
      router.push(room.path);
      setIsOpen(false);
    }
  };

  const getRoomCenter = (room: MapRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2,
  });

  const isCurrentRoom = (room: MapRoom) =>
    currentRoom?.id === room.id || pathname.startsWith(room.path);

  return (
    <>
      {/* Map Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="map-toggle-btn"
        aria-label={isOpen ? 'Close map' : 'Open museum map'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            // X icon when open
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            // Map icon when closed
            <>
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </>
          )}
        </svg>
        <span className="map-toggle-label">Map</span>
      </button>

      {/* Map Overlay */}
      {isOpen && (
        <div className="map-overlay" onClick={() => setIsOpen(false)}>
          <div className="map-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="map-header">
              <h2>Museum Map</h2>
              {currentRoom && (
                <p className="current-location">
                  <span className="you-are-here-dot" />
                  You are here: {currentRoom.label}
                </p>
              )}
            </div>

            {/* SVG Map */}
            <svg
              viewBox="0 0 500 470"
              className="map-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid pattern */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(125, 132, 113, 0.1)"
                    strokeWidth="0.5"
                  />
                </pattern>
                {/* Glow filter for current room */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background grid */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connection lines */}
              {CONNECTIONS.map(([fromId, toId]) => {
                const fromRoom = MUSEUM_ROOMS.find(r => r.id === fromId);
                const toRoom = MUSEUM_ROOMS.find(r => r.id === toId);
                if (!fromRoom || !toRoom) return null;

                const from = getRoomCenter(fromRoom);
                const to = getRoomCenter(toRoom);

                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(125, 132, 113, 0.3)"
                    strokeWidth="1"
                    strokeDasharray={toRoom.comingSoon ? '4,4' : 'none'}
                  />
                );
              })}

              {/* Rooms */}
              {MUSEUM_ROOMS.map((room) => {
                const isCurrent = isCurrentRoom(room);
                const isHovered = hoveredRoom === room.id;
                const isClickable = !room.comingSoon;

                return (
                  <g
                    key={room.id}
                    className={`map-room ${room.comingSoon ? 'coming-soon' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => handleRoomClick(room)}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                  >
                    {/* Room rectangle */}
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.width}
                      height={room.height}
                      rx="4"
                      fill={isCurrent ? `${room.accentColor}20` : 'rgba(10, 10, 10, 0.8)'}
                      stroke={room.comingSoon ? 'rgba(125, 132, 113, 0.3)' : room.accentColor}
                      strokeWidth={isCurrent ? 2 : 1}
                      strokeDasharray={room.comingSoon ? '4,2' : 'none'}
                      opacity={room.comingSoon ? 0.5 : 1}
                      filter={isCurrent ? 'url(#glow)' : 'none'}
                      style={{
                        transition: 'all 0.3s ease',
                        filter: isHovered && isClickable ? 'url(#glow)' : isCurrent ? 'url(#glow)' : 'none',
                      }}
                    />

                    {/* Room label */}
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={room.comingSoon ? 'rgba(250, 250, 250, 0.4)' : '#fafafa'}
                      fontSize={room.width > 100 ? '12' : '10'}
                      fontFamily="var(--font-outfit), sans-serif"
                      style={{ pointerEvents: 'none' }}
                    >
                      {room.label}
                    </text>

                    {/* "You are here" indicator */}
                    {isCurrent && (
                      <circle
                        cx={room.x + 10}
                        cy={room.y + 10}
                        r="4"
                        fill={room.accentColor}
                        className="pulse-dot"
                      />
                    )}

                    {/* Coming soon badge */}
                    {room.comingSoon && (
                      <text
                        x={room.x + room.width / 2}
                        y={room.y + room.height + 12}
                        textAnchor="middle"
                        fill="rgba(250, 250, 250, 0.3)"
                        fontSize="9"
                        fontFamily="var(--font-outfit), sans-serif"
                        fontStyle="italic"
                      >
                        Coming Soon
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-line solid" />
                <span>Open</span>
              </div>
              <div className="legend-item">
                <span className="legend-line dashed" />
                <span>Coming Soon</span>
              </div>
            </div>

            {/* Close hint */}
            <p className="close-hint">Click anywhere outside or press ESC to close</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .map-toggle-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .map-toggle-btn:hover {
          background: rgba(125, 132, 113, 0.2);
          border-color: rgba(125, 132, 113, 0.6);
          transform: scale(1.05);
        }

        .map-toggle-label {
          font-size: 9px;
          font-family: var(--font-outfit), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        .map-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .map-container {
          background: linear-gradient(145deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98));
          border: 1px solid rgba(125, 132, 113, 0.3);
          border-radius: 12px;
          padding: 24px;
          max-width: 560px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .map-header {
          margin-bottom: 16px;
          text-align: center;
        }

        .map-header h2 {
          font-family: var(--font-cormorant), serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #fafafa;
          margin: 0 0 8px 0;
          letter-spacing: 0.05em;
        }

        .current-location {
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.875rem;
          color: rgba(250, 250, 250, 0.7);
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .you-are-here-dot {
          width: 8px;
          height: 8px;
          background: #a8d5e5;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .map-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        :global(.map-room) {
          transition: all 0.3s ease;
        }

        :global(.pulse-dot) {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        .map-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(125, 132, 113, 0.2);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.75rem;
          color: rgba(250, 250, 250, 0.6);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.current {
          background: #a8d5e5;
        }

        .legend-line {
          width: 20px;
          height: 2px;
        }

        .legend-line.solid {
          background: #7D8471;
        }

        .legend-line.dashed {
          background: repeating-linear-gradient(
            90deg,
            rgba(125, 132, 113, 0.5) 0px,
            rgba(125, 132, 113, 0.5) 4px,
            transparent 4px,
            transparent 8px
          );
        }

        .close-hint {
          text-align: center;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.7rem;
          color: rgba(250, 250, 250, 0.3);
          margin: 12px 0 0 0;
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .map-toggle-btn {
            bottom: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
          }

          .map-toggle-label {
            display: none;
          }

          .map-container {
            padding: 16px;
            margin: 12px;
          }

          .map-header h2 {
            font-size: 1.5rem;
          }

          .map-legend {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
