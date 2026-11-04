import AmuletArt from '../amulet/AmuletArt';
import { SYMBOLS, type SymbolId } from '../amulet/amulets';
import Cartouche from '../hieroglyph-name/Cartouche';
import { spell } from '../hieroglyph-name/alphabet';
import { GLYPHS } from '../rooms';
import type { TombState } from '../tombState';
import { CHAMBER } from './things';

/*
 * The burial chamber, drawn in SVG in the rooms' gold and orange-red on
 * near-black: a ceiling of gold stars on blue, a painted frieze, and in the
 * walls a painted doorway (left), the doorway of the Hall of Judgement with
 * the scales beyond it (centre), a carved cartouche and an amulet niche
 * (right); on the floor the embalmers' lion-legged table and a broken stone.
 *
 * What the visitor has made is left here: their mummy wrapped on the table
 * with its jars filled, the scales level, their name in the cartouche,
 * their amulet in its niche, the names lit on the stone, the painted doorway
 * glowing once every wall is searched.
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";
const GOLD = '#d9a441';
const INK = '#efebe5';

const STARS = Array.from({ length: 22 }, (_, i) => ({ x: 40 + i * 72 + (i % 2) * 18, y: i % 2 ? 58 : 30 }));

function Star({ x, y }: { x: number; y: number }) {
  // The five-pointed star of tomb ceilings.
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 ? 4.5 : 11;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <polygon points={pts} fill={GOLD} />;
}

export default function Chamber({ tomb }: { tomb: TombState }) {
  const done = tomb.done;
  const name = tomb.cartouche ? spell(tomb.cartouche) : [];
  const amulet = tomb.amulet;
  const symbols = (amulet?.symbols ?? []).filter((s): s is SymbolId => SYMBOLS.some((x) => x.id === s));

  return (
    <svg data-picture className="egt-chamber" viewBox={`0 0 ${CHAMBER.width} ${CHAMBER.height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="egt-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3824" />
          <stop offset="1" stopColor="#2c2117" />
        </linearGradient>
        <linearGradient id="egt-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2016" />
          <stop offset="1" stopColor="#140f0a" />
        </linearGradient>
        <radialGradient id="egt-hall-glow" cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor={done.weighing ? 'rgba(217,164,65,0.55)' : 'rgba(217,164,65,0.12)'} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <pattern id="egt-blocks" width="160" height="80" patternUnits="userSpaceOnUse">
          <path d="M0 0 H160 M0 40 H160 M40 0 V40 M120 40 V80" stroke="rgba(0,0,0,0.28)" strokeWidth="2" fill="none" />
        </pattern>
        <pattern id="egt-linen" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="14" height="14" fill="#e9dfc6" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#c8b892" strokeWidth="3" />
        </pattern>
      </defs>

      {/* The walls and ceiling */}
      <rect width="1600" height="900" fill="url(#egt-wall)" />
      <rect width="1600" height="760" fill="url(#egt-blocks)" />
      <rect width="1600" height="88" fill="#16233a" />
      {STARS.map((s, i) => (
        <Star key={i} {...s} />
      ))}
      <g>
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={i * 40} y="88" width="40" height="22" fill={['#b9370e', '#d9a441', '#2f6b6b', '#e9dfc6'][i % 4]} opacity="0.85" />
        ))}
        <rect y="110" width="1600" height="4" fill="#120d08" />
      </g>
      <rect y="760" width="1600" height="140" fill="url(#egt-floor)" />
      <line x1="0" y1="760" x2="1600" y2="760" stroke="#120d08" strokeWidth="4" />

      {/* The painted doorway, to the walls */}
      <g className="egt-c-corridor">
        <rect x="120" y="300" width="220" height="460" fill="#0b0806" />
        <g opacity={done.walls ? 1 : 0.55}>
          <rect x="150" y="340" width="160" height="40" fill="#e9dfc6" />
          <rect x="150" y="390" width="160" height="70" fill="#d9b37a" />
          <path d="M170 450 q20 -40 40 0 M230 450 q20 -40 40 0" stroke="#7a3b1c" strokeWidth="6" fill="none" />
          <rect x="150" y="470" width="160" height="60" fill="#5b8f8a" />
          <path d="M160 500 h140" stroke="#e9dfc6" strokeWidth="3" strokeDasharray="10 8" />
        </g>
        {done.walls && <rect x="120" y="300" width="220" height="460" fill="none" stroke={GOLD} strokeWidth="6" />}
        <rect x="100" y="270" width="260" height="32" fill={GOLD} opacity="0.85" />
      </g>

      {/* The Hall of Judgement through its doorway, the scales beyond */}
      <g className="egt-c-hall">
        <rect x="660" y="250" width="280" height="510" fill="#0c0907" />
        <rect x="660" y="250" width="280" height="510" fill="url(#egt-hall-glow)" />
        <rect x="640" y="220" width="320" height="34" fill={GOLD} opacity="0.85" />
        <path d="M640 220 L800 170 L960 220 Z" fill={GOLD} opacity="0.45" />
        {/* The scales: level once the heart has balanced, tipped a little before */}
        <g stroke={GOLD} strokeWidth="5" fill="none" transform={done.weighing ? undefined : 'rotate(-6 800 420)'}>
          <line x1="700" y1="420" x2="900" y2="420" />
          <line x1="710" y1="420" x2="690" y2="500" />
          <line x1="710" y1="420" x2="730" y2="500" />
          <line x1="890" y1="420" x2="870" y2="500" />
          <line x1="890" y1="420" x2="910" y2="500" />
          <path d="M680 500 Q710 522 740 500 Z M860 500 Q890 522 920 500 Z" fill={GOLD} />
        </g>
        <rect x="796" y="400" width="8" height="330" fill={GOLD} />
        <path d="M760 740 L800 720 L840 740 Z" fill={GOLD} />
        <text x={done.weighing ? 710 : 716} y={done.weighing ? 494 : 512} fontFamily={FONT} fontSize="40" fill="#e0573a" textAnchor="middle">
          {GLYPHS.F34}
        </text>
        <text x={done.weighing ? 890 : 884} y={done.weighing ? 494 : 476} fontFamily={FONT} fontSize="44" fill={INK} textAnchor="middle">
          {GLYPHS.H6}
        </text>
      </g>

      {/* The carved cartouche: empty, or carved with the visitor's name */}
      <g className="egt-c-cartouche">
        {name.length > 0 ? (
          <svg x="1050" y="140" width="120" height="320">
            <Cartouche spelled={name} direction="down" label="" ink={GOLD} />
          </svg>
        ) : (
          <g fill="none" stroke="rgba(217,164,65,0.55)" strokeWidth="5">
            <rect x="1060" y="160" width="100" height="260" rx="50" />
            <line x1="1060" y1="436" x2="1160" y2="436" strokeWidth="8" />
          </g>
        )}
      </g>

      {/* The niche, and the visitor's amulet in it */}
      <g className="egt-c-niche">
        <path d="M1345 520 V350 Q1345 300 1420 300 Q1495 300 1495 350 V520 Z" fill="#0d0a07" stroke="#5a4630" strokeWidth="4" />
        <rect x="1335" y="520" width="170" height="16" fill="#5a4630" />
        {amulet ? (
          <svg x="1368" y="318" width="104" height="200">
            <AmuletArt shape={amulet.shape} material={amulet.material} symbols={symbols} nameGlyphs="" label="" idPrefix="egt-niche" />
          </svg>
        ) : (
          <ellipse cx="1420" cy="430" rx="34" ry="46" fill="none" stroke="rgba(217,164,65,0.35)" strokeWidth="3" strokeDasharray="8 8" />
        )}
      </g>

      {/* The embalmers' table, with lion legs, and the four canopic jars */}
      <g className="egt-c-table">
        <rect x="380" y="640" width="330" height="18" rx="5" fill="#8a5a2b" />
        <path d="M400 658 L400 740 L420 740 L428 658 Z M664 658 L672 740 L692 740 L692 658 Z" fill="#8a5a2b" />
        <path d="M700 636 C722 626 736 634 734 650 L712 650 Z" fill="#8a5a2b" />
        {done.mummification && (
          <g>
            <path d="M400 640 C400 606 430 596 456 600 L660 610 C690 614 700 626 696 640 Z" fill="url(#egt-linen)" stroke="#a8956b" strokeWidth="2" />
            <ellipse cx="440" cy="612" rx="34" ry="22" fill="#c99a3d" stroke="#6b4a10" strokeWidth="2" />
          </g>
        )}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${430 + i * 70} 700 c-10 30 -2 52 22 52 c24 0 32 -22 22 -52 Z`}
            fill={done.mummification ? '#e9c97a' : '#6f6250'}
            stroke="#3a2f22"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* The broken stone, with its three bands of writing */}
      <g className="egt-c-stone">
        <path d="M1185 780 L1180 600 L1222 562 L1290 580 L1340 550 L1392 596 L1400 780 Z" fill="#3c3f44" stroke="#1d1f22" strokeWidth="4" />
        {[620, 640, 660, 690, 708, 726, 744].map((y) => (
          <line key={y} x1="1200" y1={y} x2="1384" y2={y} stroke="#6c7076" strokeWidth="3" strokeDasharray={y < 670 ? '6 6' : y < 730 ? '3 4' : '10 3'} />
        ))}
        {done.rosetta && (
          <g fill="none" stroke={GOLD} strokeWidth="4">
            <rect x="1214" y="608" width="70" height="26" rx="13" />
            <rect x="1298" y="608" width="78" height="26" rx="13" />
          </g>
        )}
      </g>
    </svg>
  );
}
