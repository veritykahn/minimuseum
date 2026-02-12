'use client';

import { MapRoom, MapLevelConfig, TransitionState, FloorPlanRoom, MapAncestor } from './types';

type MapSvgProps = {
  config: MapLevelConfig;
  hoveredRoom: string | null;
  setHoveredRoom: (id: string | null) => void;
  onRoomClick: (room: MapRoom | FloorPlanRoom) => void;
  onAncestorClick: (ancestor: MapAncestor) => void;
  isCurrentRoom: (room: { path: string; id?: string }) => boolean;
  transition: TransitionState;
};

/**
 * SVG map visualization — level-aware.
 *
 * Levels 1 & 2: Box-and-line rendering (rooms as rectangles, connection lines).
 * Level 3: Architectural floor plan (shared walls, doorways, one connected shape).
 * Ancestors rendered as small navigation pills at the top.
 */
export function MapSvg({
  config,
  hoveredRoom,
  setHoveredRoom,
  onRoomClick,
  onAncestorClick,
  isCurrentRoom,
  transition,
}: MapSvgProps) {
  const getRoomCenter = (room: MapRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2,
  });

  const [, , vbWidth] = config.viewBox.split(' ').map(Number);

  // Split long labels into two lines
  const splitLabel = (label: string, width: number): string[] => {
    if (label.includes('\n')) return label.split('\n');
    if (label.length <= 14 || width > 150) return [label];
    const words = label.split(' ');
    if (words.length < 2) return [label];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  // ─── Box-and-line room rendering (Levels 1 & 2) ──────────────
  const renderBoxRoom = (room: MapRoom) => {
    const isCurrent = isCurrentRoom(room);
    const isHovered = hoveredRoom === room.id;
    const isClickable = !room.comingSoon;
    const lines = splitLabel(room.label, room.width);
    const fontSize = room.width > 120 ? 12 : 10;
    const cx = room.x + room.width / 2;
    const cy = room.y + room.height / 2;

    return (
      <g
        key={room.id}
        className="map-room"
        onClick={() => onRoomClick(room)}
        onMouseEnter={() => setHoveredRoom(room.id)}
        onMouseLeave={() => setHoveredRoom(null)}
        style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
      >
        <rect
          x={room.x} y={room.y} width={room.width} height={room.height}
          rx="4"
          fill={isCurrent ? `${room.accentColor}20` : 'rgba(10, 10, 10, 0.8)'}
          stroke={room.comingSoon ? 'rgba(125, 132, 113, 0.3)' : room.accentColor}
          strokeWidth={isCurrent ? 2 : 1}
          strokeDasharray={room.comingSoon ? '4,2' : 'none'}
          opacity={room.comingSoon ? 0.5 : 1}
          style={{
            transition: 'all 0.3s ease',
            filter: (isHovered && isClickable) || isCurrent ? 'url(#glow)' : 'none',
          }}
        />
        {lines.length === 1 ? (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
            fill={room.comingSoon ? 'rgba(250, 250, 250, 0.4)' : '#fafafa'}
            fontSize={fontSize} fontFamily="var(--font-outfit), sans-serif"
            style={{ pointerEvents: 'none' }}>
            {room.label}
          </text>
        ) : (
          <text textAnchor="middle"
            fill={room.comingSoon ? 'rgba(250, 250, 250, 0.4)' : '#fafafa'}
            fontSize={fontSize} fontFamily="var(--font-outfit), sans-serif"
            style={{ pointerEvents: 'none' }}>
            <tspan x={cx} y={cy - fontSize * 0.45}>{lines[0]}</tspan>
            <tspan x={cx} y={cy + fontSize * 0.65}>{lines[1]}</tspan>
          </text>
        )}
        {isCurrent && (
          <circle cx={room.x + 10} cy={room.y + 10} r="4"
            fill={room.accentColor} className="pulse-dot" />
        )}
        {room.comingSoon && (
          <text x={cx} y={room.y + room.height + 14}
            textAnchor="middle" fill="rgba(250, 250, 250, 0.3)"
            fontSize="9" fontFamily="var(--font-outfit), sans-serif" fontStyle="italic">
            Coming Soon
          </text>
        )}
      </g>
    );
  };

  // ─── Floor plan rendering (Level 3) ───────────────────────────
  const renderFloorPlan = () => {
    const fp = config.floorPlan;
    if (!fp) return null;

    return (
      <g className="floor-plan">
        {/* Outer boundary */}
        <rect
          x={fp.outline.x} y={fp.outline.y}
          width={fp.outline.width} height={fp.outline.height}
          rx={fp.outline.rx || 3}
          fill="rgba(10, 10, 10, 0.6)"
          stroke={fp.accentColor}
          strokeWidth="1.5"
        />

        {/* Room highlight fills (current & hovered) */}
        {fp.rooms.map(room => {
          const isCurrent = isCurrentRoom(room);
          const isHovered = hoveredRoom === room.id;
          if (!isCurrent && !isHovered) return null;

          return (
            <rect key={`fill-${room.id}`}
              x={room.x} y={room.y} width={room.width} height={room.height}
              fill={isCurrent ? `${room.accentColor}18` : `${room.accentColor}0c`}
              style={{ transition: 'fill 0.3s ease', pointerEvents: 'none' }}
            />
          );
        })}

        {/* Internal walls */}
        {fp.walls.map((wall, i) => (
          <line key={`wall-${i}`}
            x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2}
            stroke={fp.accentColor} strokeWidth="0.8" opacity="0.5"
          />
        ))}

        {/* Room labels and hit areas */}
        {fp.rooms.map(room => {
          const isCurrent = isCurrentRoom(room);
          const isClickable = !room.comingSoon;
          const lines = splitLabel(room.label, room.width);
          const fontSize = 11;

          return (
            <g key={room.id}
              onClick={() => onRoomClick(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              {/* Invisible hit area */}
              <rect
                x={room.x} y={room.y} width={room.width} height={room.height}
                fill="transparent"
              />

              {/* Label */}
              {lines.length === 1 ? (
                <text x={room.labelX} y={room.labelY}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={room.comingSoon ? 'rgba(250, 250, 250, 0.3)' : 'rgba(250, 250, 250, 0.85)'}
                  fontSize={fontSize} fontFamily="var(--font-outfit), sans-serif"
                  style={{ pointerEvents: 'none' }}>
                  {room.label}
                </text>
              ) : (
                <text textAnchor="middle"
                  fill={room.comingSoon ? 'rgba(250, 250, 250, 0.3)' : 'rgba(250, 250, 250, 0.85)'}
                  fontSize={fontSize} fontFamily="var(--font-outfit), sans-serif"
                  style={{ pointerEvents: 'none' }}>
                  <tspan x={room.labelX} y={room.labelY - fontSize * 0.5}>{lines[0]}</tspan>
                  <tspan x={room.labelX} y={room.labelY + fontSize * 0.6}>{lines[1]}</tspan>
                </text>
              )}

              {/* Coming soon label */}
              {room.comingSoon && (
                <text x={room.labelX} y={room.labelY + 18}
                  textAnchor="middle" fill="rgba(250, 250, 250, 0.2)"
                  fontSize="8" fontFamily="var(--font-outfit), sans-serif" fontStyle="italic"
                  style={{ pointerEvents: 'none' }}>
                  Coming Soon
                </text>
              )}

              {/* "You are here" dot */}
              {isCurrent && (
                <circle cx={room.x + 12} cy={room.y + 12} r="4"
                  fill={room.accentColor} className="pulse-dot" />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  // ─── Ancestor navigation pills ────────────────────────────────
  const renderAncestors = () => {
    if (!config.ancestors?.length) return null;

    const pillWidth = 90;
    const pillHeight = 28;
    const gap = 12;
    const totalWidth = config.ancestors.length * pillWidth + (config.ancestors.length - 1) * gap;
    const startX = (vbWidth - totalWidth) / 2;
    const y = 16;

    return (
      <g className="ancestors">
        {config.ancestors.map((ancestor, i) => {
          const x = startX + i * (pillWidth + gap);
          const isHovered = hoveredRoom === `ancestor-${i}`;

          return (
            <g key={ancestor.viewPath}
              onClick={() => onAncestorClick(ancestor)}
              onMouseEnter={() => setHoveredRoom(`ancestor-${i}`)}
              onMouseLeave={() => setHoveredRoom(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x} y={y} width={pillWidth} height={pillHeight}
                rx="4"
                fill={isHovered ? `${ancestor.accentColor}25` : 'rgba(10, 10, 10, 0.7)'}
                stroke={ancestor.accentColor}
                strokeWidth="0.8"
                opacity={isHovered ? 1 : 0.6}
                style={{ transition: 'all 0.2s ease' }}
              />
              <text
                x={x + pillWidth / 2} y={y + pillHeight / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill={isHovered ? '#fafafa' : 'rgba(250, 250, 250, 0.6)'}
                fontSize="9" fontFamily="var(--font-outfit), sans-serif"
                letterSpacing="0.05em"
                style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
              >
                {ancestor.label}
              </text>
            </g>
          );
        })}

        {/* Arrow from ancestors down to title area */}
        <line
          x1={vbWidth / 2} y1={y + pillHeight + 4}
          x2={vbWidth / 2} y2={y + pillHeight + 16}
          stroke="rgba(125, 132, 113, 0.25)" strokeWidth="1"
        />
      </g>
    );
  };

  const transitionClass =
    transition === 'exiting' ? 'map-level-exiting' :
    transition === 'entering' ? 'map-level-entering' : '';

  // Title Y position shifts down when ancestors are present
  const titleY = config.ancestors?.length ? 66 : 32;

  return (
    <div className={`map-level-wrapper ${transitionClass}`}>
      <svg
        viewBox={config.viewBox}
        className="map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none"
              stroke="rgba(125, 132, 113, 0.1)" strokeWidth="0.5" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Ancestor navigation pills */}
        {renderAncestors()}

        {/* Level title */}
        {config.title && (
          <text
            x={vbWidth / 2} y={titleY}
            textAnchor="middle"
            fill="rgba(250, 250, 250, 0.5)"
            fontSize="13" fontFamily="var(--font-outfit), sans-serif"
            letterSpacing="0.15em"
            style={{ textTransform: 'uppercase' } as React.CSSProperties}
          >
            {config.title}
          </text>
        )}

        {/* Connection lines (Levels 1 & 2) */}
        {config.connections.map(([fromId, toId]) => {
          const fromRoom = config.rooms.find(r => r.id === fromId);
          const toRoom = config.rooms.find(r => r.id === toId);
          if (!fromRoom || !toRoom) return null;
          const from = getRoomCenter(fromRoom);
          const to = getRoomCenter(toRoom);
          return (
            <line key={`${fromId}-${toId}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="rgba(125, 132, 113, 0.3)" strokeWidth="1"
              strokeDasharray={toRoom.comingSoon ? '4,4' : 'none'} />
          );
        })}

        {/* Box rooms (Levels 1 & 2) */}
        {config.rooms.map(room => renderBoxRoom(room))}

        {/* Floor plan (Level 3) */}
        {renderFloorPlan()}
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
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .map-level-wrapper { transition: none; }
          .map-level-entering { animation: none; opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
