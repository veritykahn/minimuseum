'use client';

import { MapRoom } from './types';
import { MUSEUM_ROOMS } from './data/rooms';
import { CONNECTIONS } from './data/connections';

type MapSvgProps = {
  hoveredRoom: string | null;
  setHoveredRoom: (id: string | null) => void;
  onRoomClick: (room: MapRoom) => void;
  isCurrentRoom: (room: MapRoom) => boolean;
};

/**
 * SVG map visualization of museum rooms
 */
export function MapSvg({
  hoveredRoom,
  setHoveredRoom,
  onRoomClick,
  isCurrentRoom,
}: MapSvgProps) {
  const getRoomCenter = (room: MapRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2,
  });

  return (
    <>
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
              onClick={() => onRoomClick(room)}
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

      <style jsx>{`
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
      `}</style>
    </>
  );
}
