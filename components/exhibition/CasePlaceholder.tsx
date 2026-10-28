/*
 * A display case still waiting for its photographs: an empty case drawn in
 * outline on its plinth, softly lit from within, with a quiet label. It
 * stands in for the photograph on a landing page's case card and at the head
 * of a case page. It is drawn in the exhibition's colors: the case in
 * --pe-case-frame and its light in --pe-case-glow (both default to the
 * exhibition's accent), set in its own stylesheet.
 */

export const CASE_PLACEHOLDER_LABEL = 'Display case — photographs to come';

export default function CasePlaceholder({ size = 'page', className = '' }: { size?: 'card' | 'page'; className?: string }) {
  return (
    <span className={`pe-case-placeholder pe-case-placeholder-${size} ${className}`.trim()}>
      <span className="pe-case-placeholder-art">
        <svg viewBox="0 0 240 190" aria-hidden="true" focusable="false">
          {/* the plinth */}
          <polygon className="pe-cp-plinth" points="36,160 62,142 214,142 188,160" />
          <rect className="pe-cp-plinth" x="36" y="160" width="152" height="20" />
          <polygon className="pe-cp-plinth" points="188,160 214,142 214,162 188,180" />
          {/* the light, falling from the lamp in the lid */}
          <polygon className="pe-cp-light" points="84,38 176,38 166,150 62,150" />
          {/* the case's back edges, seen through the glass */}
          <polyline className="pe-cp-hidden" points="70,32 70,140 192,140" />
          <line className="pe-cp-hidden" x1="70" y1="140" x2="48" y2="154" />
          {/* an empty riser on the floor of the case */}
          <polygon className="pe-cp-riser" points="98,146 108,140 150,140 140,146" />
          <rect className="pe-cp-riser" x="98" y="146" width="42" height="6" />
          {/* the glass: front, lid and side */}
          <rect className="pe-cp-glass" x="48" y="46" width="122" height="108" />
          <polygon className="pe-cp-glass" points="48,46 70,32 192,32 170,46" />
          <polygon className="pe-cp-glass" points="170,46 192,32 192,140 170,154" />
          {/* the lamp */}
          <line className="pe-cp-lamp" x1="84" y1="38" x2="176" y2="38" />
          {/* reflections on the glass */}
          <line className="pe-cp-glint" x1="58" y1="138" x2="86" y2="62" />
          <line className="pe-cp-glint pe-cp-glint-faint" x1="68" y1="140" x2="92" y2="76" />
        </svg>
      </span>
      <span className="pe-case-placeholder-label">{CASE_PLACEHOLDER_LABEL}</span>
    </span>
  );
}
