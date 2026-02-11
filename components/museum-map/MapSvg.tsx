'use client';

import { MapRoom, MapLevelConfig, TransitionState } from './types';

type MapSvgProps = {
  config: MapLevelConfig;
  hoveredRoom: string | null;
  setHoveredRoom: (id: string | null) => void;
  onRoomClick: (room: MapRoom) => void;
  isCurrentRoom: (room: MapRoom) => boolean;
  transition: TransitionState;
};

/**
 * SVG map visualization — level-aware.
 *
 * Renders rooms, connections, title, and sibling exhibitions
 * from the provided MapLevelConfig. Transition classes drive
 * the animated fade between zoom levels.
 */
export function MapSvg({
  config,
  hoveredRoom,
  setHoveredRoom,
  onRoomClick,
  isCurrentRoom,
  transition,
}: MapSvgProps) {
  const getRoomCenter = (room: MapRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2,
  });

  // Parse viewBox dimensions for sibling positioning
  const [, , vbWidth] = config.viewBox.split(' ').map(Number);

  // Split long labels into two lines for narrow boxes
  const splitLabel = (room: MapRoom): string[] => {
    if (room.label.includes('\n')) return room.label.split('\n');
    if (room.label.length <= 14 || room.width > 150) return [room.label];
    const words = room.label.split(' ');
    if (words.length < 2) return [room.label];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  const renderRoom = (room: MapRoom, isSibling = false) => {
    const isCurrent = isCurrentRoom(room);
    const isHovered = hoveredRoom === room.id;
    const isClickable = !room.comingSoon;
    const lines = splitLabel(room);
    const fontSize = isSibling ? 8 : room.width > 120 ? 12 : 10;
    const cx = room.x + room.width / 2;
    const cy = room.y + room.height / 2;

    return (
      <g
        key={room.id}
        className={`map-room ${room.comingSoon ? 'coming-soon' : ''} ${isCurrent ? 'current' : ''}`}
        onClick={() => onRoomClick(room)}
        onMouseEnter={() => setHoveredRoom(room.id)}
        onMouseLeave={() => setHoveredRoom(null)}
        style={{
          cursor: isClickable ? 'pointer' : 'not-allowed',
          opacity: isSibling ? (isHovered ? 0.6 : 0.3) : 1,
        }}
      >
        <rect
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          rx="4"
          fill={isCurrent ? `${room.accentColor}20` : 'rgba(10, 10, 10, 0.8)'}
          stroke={room.comingSoon ? 'rgba(125, 132, 113, 0.3)' : room.accentColor}
          strokeWidth={isCurrent ? 2 : isSibling ? 0.5 : 1}
          strokeDasharray={room.comingSoon ? '4,2' : 'none'}
          opacity={room.comingSoon && !isSibling ? 0.5 : 1}
          filter={isCurrent ? 'url(#glow)' : 'none'}
          style={{
            transition: 'all 0.3s ease',
            filter: isHovered && isClickable ? 'url(#glow)' : isCurrent ? 'url(#glow)' : 'none',
          }}
        />

        {/* Room label */}
        {lines.length === 1 ? (
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={room.comingSoon ? 'rgba(250, 250, 250, 0.4)' : '#fafafa'}
            fontSize={fontSize}
            fontFamily="var(--font-outfit), sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {room.label}
          </text>
        ) : (
          <text
            textAnchor="middle"
            fill={room.comingSoon ? 'rgba(250, 250, 250, 0.4)' : '#fafafa'}
            fontSize={fontSize}
            fontFamily="var(--font-outfit), sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            <tspan x={cx} y={cy - fontSize * 0.45}>{lines[0]}</tspan>
            <tspan x={cx} y={cy + fontSize * 0.65}>{lines[1]}</tspan>
          </text>
        )}

        {/* "You are here" indicator */}
        {isCurrent && !isSibling && (
          <circle
            cx={room.x + 10}
            cy={room.y + 10}
            r="4"
            fill={room.accentColor}
            className="pulse-dot"
          />
        )}

        {/* Coming soon badge */}
        {room.comingSoon && !isSibling && (
          <text
            x={room.x + room.width / 2}
            y={room.y + room.height + 14}
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
  };

  // Sibling exhibitions rendered along the right edge (Level 3 only)
  const renderSiblings = () => {
    if (!config.siblingExhibitions?.length) return null;

    const startY = 80;
    const gap = 50;

    return (
      <g className="siblings">
        <line
          x1={vbWidth - 78}
          y1={startY - 15}
          x2={vbWidth - 78}
          y2={startY + config.siblingExhibitions.length * gap + 10}
          stroke="rgba(125, 132, 113, 0.15)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        {config.siblingExhibitions.map((sibling, i) => {
          const positioned: MapRoom = {
            ...sibling,
            x: vbWidth - 73,
            y: startY + i * gap,
            width: 68,
            height: 36,
          };
          return renderRoom(positioned, true);
        })}
      </g>
    );
  };

  const transitionClass =
    transition === 'exiting' ? 'map-level-exiting' :
    transition === 'entering' ? 'map-level-entering' : '';

  return (
    <div className={`map-level-wrapper ${transitionClass}`}>
      <svg
        viewBox={config.viewBox}
        className="map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
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

        {/* Level title (Levels 2 & 3) */}
        {config.title && (
          <text
            x={config.siblingExhibitions?.length ? (vbWidth - 80) / 2 : vbWidth / 2}
            y="32"
            textAnchor="middle"
            fill="rgba(250, 250, 250, 0.5)"
            fontSize="13"
            fontFamily="var(--font-outfit), sans-serif"
            letterSpacing="0.15em"
            style={{ textTransform: 'uppercase' } as React.CSSProperties}
          >
            {config.title}
          </text>
        )}

        {/* Connection lines */}
        {config.connections.map(([fromId, toId]) => {
          const fromRoom = config.rooms.find(r => r.id === fromId);
          const toRoom = config.rooms.find(r => r.id === toId);
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
        {config.rooms.map(room => renderRoom(room))}

        {/* Sibling exhibitions */}
        {renderSiblings()}
      </svg>

      <style jsx>{`
        .map-level-wrapper {
          transition: opacity 0.2s ease, transform 0.2s ease;
          opacity: 1;
          transform: scale(1);
        }

        .map-level-exiting {
          opacity: 0;
          transform: scale(0.95);
        }

        .map-level-entering {
          animation: levelEnter 0.3s ease forwards;
        }

        @keyframes levelEnter {
          from {
            opacity: 0;
            transform: scale(1.03);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
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

        @media (prefers-reduced-motion: reduce) {
          .map-level-wrapper {
            transition: none;
          }
          .map-level-entering {
            animation: none;
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
