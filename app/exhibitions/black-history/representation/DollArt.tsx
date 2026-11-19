import { Fragment, useId, type ReactNode } from 'react';
import {
  ANKLE,
  ARM,
  CANVAS,
  HEAD,
  HIPS,
  KNEE,
  LEG_STANDING,
  MID,
  SHIN_SEATED,
  SOLE,
  WAIST,
  WRIST,
  arcPoints,
  armPath,
  darken,
  handPath,
  legPaths,
  lighten,
  mirror,
  mix,
  prostheticParts,
  scallop,
  shoePath,
  smoothLine,
  smoothShape,
  thighPath,
  torsoPath,
  torsoSide,
  tubePath,
  through,
  type Pose,
  type Pt,
} from './dollShapes';
import { EYE_COLOURS, clothColour, clothPaint, hairColourOf, hidesHair, skinPaint, type ClothPaint, type Doll, type HairColour, type SkinPaint } from './dollRules';

/*
 * Design a doll: the doll, drawn. One SVG, in layers from the back to the
 * front, so every part sits where it belongs and nothing is cut off:
 *
 *   the wheelchair's back and wheels; the back of the hair (and of a
 *   headscarf), behind the shoulders; the legs, the torso and the clothes
 *   on them; the arms and sleeves; the ears, the head and the face; the
 *   front of the hair, over the forehead and the shoulders; hearing aids;
 *   a head covering; glasses.
 *
 * Every shape is a closed, smooth path (dollShapes.ts), outlined in a
 * darker shade of its own colour, with a shadow and a highlight of its own:
 * blond hair has a golden shadow and a pale sheen, a deep skin tone its own
 * deeper shading. The clothes are drawn on the body's own key points, so
 * they fit it in both poses.
 *
 * `view` crops the same drawing for the picker tiles: the head and hair,
 * or the face.
 */

export type DollView = 'full' | 'body' | 'legs' | 'head' | 'face';

const SW = 2.2;
/** How far the seated doll is moved down, so the wheelchair stands on the floor. */
const SEAT_DROP = 88;

const VIEWBOX: Record<DollView, [number, number, number, number]> = {
  full: [0, 0, CANVAS.w, CANVAS.h],
  body: [92, 232, 216, 372],
  legs: [96, 430, 208, 360],
  head: [62, 4, 276, 300],
  face: [126, 104, 148, 138],
};

export function viewBoxFor(view: DollView, seated: boolean): string {
  const [x, y, w, h] = VIEWBOX[view];
  return `${x} ${y + (seated && view !== 'full' ? SEAT_DROP : 0)} ${w} ${h}`;
}

/* ───────── Hair ───────── */

type HairParts = { back?: ReactNode; front?: ReactNode; crown: number; coversEars: boolean };

/** Points along a line, about `step` apart: for small, even bumps round coils and curls. */
function resample(pts: readonly Pt[], step: number): Pt[] {
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]];
    const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}

/** The close cap of hair over the skull, down to the temples, with a hairline over the forehead. */
const capPath = (top = 62, dip = 108) =>
  `M 128 176 C 120 118 150 ${top} 200 ${top} C 250 ${top} 280 118 272 176 C 266 166 264 150 262 138 C 256 116 238 104 220 104 C 210 104 206 ${dip} 200 ${dip} C 194 ${dip} 190 104 180 104 C 162 104 144 116 138 138 C 136 150 134 166 128 176 Z`;

/** Little coils or curls, as short curved strokes, at fixed spots so the doll looks the same each time. */
function texture(spots: readonly Pt[], c: HairColour, r = 4.5, light = true) {
  return (
    <g fill="none" strokeLinecap="round" aria-hidden="true">
      {spots.map(([x, y], i) => (
        <path key={i} d={`M ${x - r} ${y} a ${r} ${r} 0 1 1 ${r * 1.4} ${r * 0.9}`} stroke={i % 3 === 0 && light ? c.light : c.shade} strokeWidth={i % 3 === 0 ? 1.6 : 1.4} opacity={i % 3 === 0 ? 0.75 : 0.6} />
      ))}
    </g>
  );
}

/** A grid of spots inside a box, every other row shifted: where curls and coils show their texture. */
function spotsIn(x0: number, y0: number, x1: number, y1: number, step: number, keep: (x: number, y: number) => boolean): Pt[] {
  const out: Pt[] = [];
  let row = 0;
  for (let y = y0; y <= y1; y += step * 0.8, row++) {
    for (let x = x0 + (row % 2 ? step / 2 : 0); x <= x1; x += step) if (keep(x, y)) out.push([x, y]);
  }
  return out;
}

/** A plait, a loc or a twist: a strand drawn as layered strokes, its outline, its body, its segments and its sheen. */
function Strand({ d, c, w, dash, sheen = true }: { d: string; c: HairColour; w: number; dash: string; sheen?: boolean }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={c.deep} strokeWidth={w + 3} />
      <path d={d} stroke={c.base} strokeWidth={w} />
      <path d={d} stroke={c.shade} strokeWidth={w} strokeDasharray={dash} />
      {sheen && <path d={d} stroke={c.light} strokeWidth={Math.max(2, w * 0.22)} strokeDasharray={dash} strokeDashoffset={-1} opacity={0.55} transform="translate(-1.5 0)" />}
    </g>
  );
}

function hairParts(style: string, c: HairColour, bead: string): HairParts {
  const fill = { fill: c.base, stroke: c.deep, strokeWidth: SW, strokeLinejoin: 'round' as const };
  const back = { fill: c.shade, stroke: c.deep, strokeWidth: SW, strokeLinejoin: 'round' as const };
  const sheen = (d: string, w = 7, o = 0.6) => <path d={d} fill="none" stroke={c.light} strokeWidth={w} strokeLinecap="round" opacity={o} />;
  const line = (d: string, o = 0.7, w = 1.6) => <path d={d} fill="none" stroke={c.shade} strokeWidth={w} strokeLinecap="round" opacity={o} />;
  const cap = (top?: number, dip?: number) => <path d={capPath(top, dip)} {...fill} />;

  switch (style) {
    case 'straight': {
      const left = 'M 201 60 C 150 60 124 98 120 160 C 116 222 120 292 112 352 C 122 359 138 359 147 352 C 142 300 140 240 142 190 C 144 140 152 112 174 104 C 186 100 194 102 201 104 Z';
      return {
        crown: 60,
        coversEars: true,
        back: <path d="M 200 58 C 128 58 112 118 114 196 C 116 262 108 330 104 392 C 150 405 250 405 296 392 C 292 330 284 262 286 196 C 288 118 272 58 200 58 Z" {...back} />,
        front: (
          <g>
            <path d={left} {...fill} />
            <path d={left} {...fill} transform={`matrix(-1 0 0 1 ${2 * MID} 0)`} />
            {line('M 168 70 C 140 92 130 140 130 200 C 130 260 128 310 124 346')}
            {line('M 232 70 C 260 92 270 140 270 200 C 270 260 272 310 276 346')}
            {line('M 186 64 C 156 90 146 140 144 190', 0.5)}
            {line('M 214 64 C 244 90 254 140 256 190', 0.5)}
            {sheen('M 150 92 C 168 74 186 68 196 68')}
            {sheen('M 250 92 C 232 74 214 68 204 68')}
            {sheen('M 127 214 C 126 250 126 286 123 322', 3.5, 0.5)}
            {sheen('M 273 214 C 274 250 274 286 277 322', 3.5, 0.5)}
            <path d="M 200 61 L 200 104" stroke={c.deep} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        ),
      };
    }
    case 'wavy': {
      const left = 'M 201 60 C 150 58 122 96 118 156 C 115 194 132 220 121 252 C 110 282 128 306 117 334 C 128 345 147 341 153 328 C 143 304 157 280 149 252 C 141 222 147 196 147 170 C 149 132 168 108 201 104 Z';
      const wave = 'M 170 72 C 142 96 134 140 136 172 C 138 204 128 226 132 252 C 136 280 128 300 130 322';
      return {
        crown: 60,
        coversEars: true,
        back: <path d="M 200 58 C 126 58 108 120 112 190 C 114 232 100 262 108 300 C 114 330 102 350 112 368 C 150 380 250 380 288 368 C 298 350 286 330 292 300 C 300 262 286 232 288 190 C 292 120 274 58 200 58 Z" {...back} />,
        front: (
          <g>
            <path d={left} {...fill} />
            <path d={left} {...fill} transform={`matrix(-1 0 0 1 ${2 * MID} 0)`} />
            {line(wave)}
            <g transform={`matrix(-1 0 0 1 ${2 * MID} 0)`}>{line(wave)}</g>
            {sheen('M 148 96 C 166 76 186 68 196 68')}
            {sheen('M 252 96 C 234 76 214 68 204 68')}
            {sheen('M 128 230 C 136 246 134 262 128 276', 3.5, 0.5)}
            {sheen('M 272 230 C 264 246 266 262 272 276', 3.5, 0.5)}
            <path d="M 200 61 L 200 104" stroke={c.deep} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        ),
      };
    }
    case 'curly': {
      const outline: Pt[] = [
        [200, 42],
        [250, 50],
        [290, 86],
        [308, 140],
        [312, 196],
        [316, 250],
        [306, 300],
        [284, 334],
        [244, 350],
        [200, 346],
        [156, 350],
        [116, 334],
        [94, 300],
        [84, 250],
        [88, 196],
        [92, 140],
        [110, 86],
        [150, 50],
      ];
      const front: Pt[] = [
        [112, 252],
        [108, 204],
        [111, 152],
        [124, 106],
        [152, 72],
        [200, 58],
        [248, 72],
        [276, 106],
        [289, 152],
        [292, 204],
        [288, 252],
        [266, 240],
        [262, 198],
        [261, 160],
        [254, 126],
        [234, 106],
        [212, 102],
        [200, 110],
        [188, 102],
        [166, 106],
        [146, 126],
        [139, 160],
        [138, 198],
        [134, 240],
      ];
      const inFront = (x: number, y: number) => (y < 100 && Math.hypot((x - 200) / 80, (y - 100) / 40) < 1) || ((x < 136 || x > 264) && y > 110 && y < 240);
      return {
        crown: 48,
        coversEars: true,
        back: (
          <g>
            <path d={scallop(outline, 6)} {...back} />
            {texture(spotsIn(96, 120, 304, 330, 26, (x, y) => (x < 140 || x > 260) && y < 330 + Math.abs(x - 200) * 0), c, 5)}
          </g>
        ),
        front: (
          <g>
            <path d={scallop(front, 5)} {...fill} />
            {texture(spotsIn(112, 70, 288, 236, 22, inFront), c, 4.5)}
            {sheen('M 156 84 C 174 70 190 66 200 66', 6, 0.5)}
            {sheen('M 244 84 C 226 70 210 66 200 66', 6, 0.5)}
          </g>
        ),
      };
    }
    case 'coily': {
      const dome: Pt[] = [...arcPoints(200, 132, 76, 82, 180, 360, 14).map(([x, y]) => [x, Math.min(y, 132)] as Pt)];
      const outer: Pt[] = [[126, 174], ...dome.slice(1, -1), [274, 174]];
      const inner: Pt[] = [
        [262, 150],
        [256, 124],
        [238, 108],
        [218, 103],
        [200, 106],
        [182, 103],
        [162, 108],
        [144, 124],
        [138, 150],
      ];
      const pts = resample([...outer, ...inner], 9);
      return {
        crown: 50,
        coversEars: false,
        front: (
          <g>
            <path d={scallop(pts, 2.4)} {...fill} />
            {texture(spotsIn(130, 60, 270, 166, 12, (x, y) => Math.hypot((x - 200) / 70, (y - 132) / 76) < 1 && (y < 104 || x < 140 || x > 260)), c, 3, true)}
            {sheen('M 160 78 C 176 66 192 62 200 62', 5, 0.35)}
          </g>
        ),
      };
    }
    case 'afro': {
      const ring = arcPoints(200, 124, 112, 104, -90, 270, 30).slice(0, -1);
      // The front: the top of the afro down to the temples, over the forehead, so it has no edge of its own across the crown.
      const crownArc = arcPoints(200, 124, 104, 96, 160, 380, 24);
      const hairline: Pt[] = [
        [262, 160],
        [260, 134],
        [246, 114],
        [222, 104],
        [200, 108],
        [178, 104],
        [154, 114],
        [140, 134],
        [138, 160],
      ];
      return {
        crown: 22,
        coversEars: true,
        back: (
          <g>
            <path d={scallop(ring, 3.5)} {...fill} />
            {texture(spotsIn(94, 120, 306, 222, 18, (x, y) => Math.hypot((x - 200) / 104, (y - 124) / 96) < 1 && Math.abs(x - 200) > 66), c, 4)}
          </g>
        ),
        front: (
          <g>
            <path d={`${smoothLine(crownArc)} L ${hairline[0][0]} ${hairline[0][1]}${scallop(resample(hairline, 9), 2, false).replace(/^M [^Q]*/, ' ')} Z`} fill={c.base} />
            <path d={scallop(resample(hairline, 9), 2, false)} fill="none" stroke={c.deep} strokeWidth={SW} strokeLinejoin="round" />
            {texture(spotsIn(98, 30, 302, 150, 18, (x, y) => Math.hypot((x - 200) / 104, (y - 124) / 96) < 0.92 && !(Math.abs(x - 200) < 64 && y > 98)), c, 4)}
            {sheen('M 140 70 C 160 46 186 36 206 34', 6, 0.35)}
          </g>
        ),
      };
    }
    case 'puffs': {
      const puff = (cx: number, cy: number) => scallop(arcPoints(cx, cy, 46, 44, -90, 270, 18).slice(0, -1), 3);
      return {
        crown: 62,
        coversEars: false,
        front: (
          <g>
            <path d={puff(130, 70)} {...fill} />
            <path d={puff(270, 70)} {...fill} />
            {texture(spotsIn(90, 32, 172, 108, 14, (x, y) => Math.hypot(x - 130, y - 70) < 40), c, 3.5)}
            {texture(spotsIn(228, 32, 310, 108, 14, (x, y) => Math.hypot(x - 270, y - 70) < 40), c, 3.5)}
            {cap()}
            {line('M 200 63 L 200 107', 0.9, 1.8)}
            {line('M 192 72 C 176 76 164 86 158 96', 0.55)}
            {line('M 208 72 C 224 76 236 86 242 96', 0.55)}
            {line('M 186 92 C 168 96 156 106 150 118', 0.5)}
            {line('M 214 92 C 232 96 244 106 250 118', 0.5)}
            {sheen('M 158 82 C 170 72 184 67 194 66', 5, 0.5)}
            {sheen('M 242 82 C 230 72 216 67 206 66', 5, 0.5)}
            <path d="M 146 98 C 156 90 166 84 176 82" fill="none" stroke={darken(bead, 0.35)} strokeWidth={9} strokeLinecap="round" />
            <path d="M 146 98 C 156 90 166 84 176 82" fill="none" stroke={bead} strokeWidth={6} strokeLinecap="round" />
            <path d="M 254 98 C 244 90 234 84 224 82" fill="none" stroke={darken(bead, 0.35)} strokeWidth={9} strokeLinecap="round" />
            <path d="M 254 98 C 244 90 234 84 224 82" fill="none" stroke={bead} strokeWidth={6} strokeLinecap="round" />
          </g>
        ),
      };
    }
    case 'braids':
    case 'locs':
    case 'twists': {
      const kind = style;
      const w = kind === 'locs' ? 12 : kind === 'braids' ? 10 : 8.5;
      const dash = kind === 'locs' ? '7 3 5 3' : kind === 'braids' ? '2.6 4.2' : '2.2 2.8';
      const end = kind === 'twists' ? 300 : kind === 'locs' ? 372 : 404;
      // Behind the shoulders: strands from the back of the head, falling straight down and a little out.
      const backs: string[] = [];
      for (let i = 0; i < 11; i++) {
        const x0 = 132 + i * 13.6;
        const spread = (x0 - 200) * 0.32;
        const y0 = 96 + Math.abs(x0 - 200) * 0.25;
        backs.push(smoothLine([[x0, y0], [x0 + spread * 0.6, (y0 + end) / 2], [x0 + spread, end - Math.abs(x0 - 200) * 0.12]]));
      }
      // Framing the face: three strands each side, over the shoulders.
      const fronts: string[] = [];
      for (const s of [-1, 1]) {
        for (let k = 0; k < 3; k++) {
          const x0 = 200 + s * (58 + k * 7);
          const y0 = 108 + k * 18;
          const y1 = (kind === 'twists' ? 250 : kind === 'locs' ? 330 : 350) + k * 10;
          fronts.push(smoothLine([[x0, y0], [200 + s * (72 + k * 8), y0 + 60], [200 + s * (76 + k * 9), (y0 + y1) / 2], [200 + s * (72 + k * 11), y1]]));
        }
      }
      const tips = (paths: string[]) =>
        kind === 'braids'
          ? paths.map((d, i) => {
              const m = d.match(/(-?[\d.]+) (-?[\d.]+)$/);
              return m ? <rect key={i} x={+m[1] - 5} y={+m[2] - 1} width={10} height={9} rx={4} fill={bead} stroke={darken(bead, 0.4)} strokeWidth={1.4} /> : null;
            })
          : null;
      return {
        crown: kind === 'twists' ? 58 : 62,
        coversEars: kind !== 'twists',
        back: (
          <g>
            <path d="M 200 64 C 140 64 120 104 122 150 L 278 150 C 280 104 260 64 200 64 Z" fill={c.shade} />
            {backs.map((d, i) => (
              <Strand key={i} d={d} c={c} w={w} dash={dash} sheen={false} />
            ))}
            {tips(backs)}
          </g>
        ),
        front: (
          <g>
            {fronts.map((d, i) => (
              <Strand key={i} d={d} c={c} w={w} dash={dash} />
            ))}
            {tips(fronts)}
            {cap(kind === 'twists' ? 58 : 62)}
            {/* The parts between the rows, on the scalp. */}
            <g fill="none" stroke={c.deep} strokeWidth={1.3} strokeLinecap="round" opacity={0.75}>
              <path d="M 200 64 L 200 108" />
              <path d="M 170 70 C 168 84 166 96 164 106" />
              <path d="M 230 70 C 232 84 234 96 236 106" />
              <path d="M 146 92 C 162 92 180 90 200 88 C 220 90 238 92 254 92" />
            </g>
            {sheen('M 156 84 C 170 72 186 68 194 68', 4, 0.45)}
            {sheen('M 244 84 C 230 72 214 68 206 68', 4, 0.45)}
          </g>
        ),
      };
    }
    case 'bun': {
      const bun = smoothShape(arcPoints(200, 46, 32, 28, 0, 330, 11).slice(0, -1).concat([[232, 46]]), 1);
      return {
        crown: 68,
        coversEars: false,
        front: (
          <g>
            {cap(64)}
            {line('M 170 104 C 172 88 182 74 196 66', 0.6)}
            {line('M 230 104 C 228 88 218 74 204 66', 0.6)}
            {line('M 146 128 C 152 100 170 80 190 70', 0.5)}
            {line('M 254 128 C 248 100 230 80 210 70', 0.5)}
            {sheen('M 152 96 C 164 80 180 72 192 70', 5, 0.5)}
            <path d={bun} {...fill} />
            {line('M 178 42 C 186 30 214 28 222 40 C 228 50 214 62 200 58 C 190 56 188 46 198 42', 0.75, 1.8)}
            {sheen('M 182 34 C 190 26 206 24 214 28', 4, 0.6)}
            <path d="M 172 64 C 184 72 216 72 228 64" fill="none" stroke={bead} strokeWidth={6} strokeLinecap="round" />
            {/* Edges at the temples. */}
            <path d="M 140 140 c -4 6 2 12 7 8" fill="none" stroke={c.base} strokeWidth={1.8} strokeLinecap="round" />
            <path d="M 260 140 c 4 6 -2 12 -7 8" fill="none" stroke={c.base} strokeWidth={1.8} strokeLinecap="round" />
          </g>
        ),
      };
    }
    case 'crop': {
      const crop = 'M 129 170 C 120 112 146 52 200 52 C 254 52 280 112 271 170 C 266 162 264 148 262 136 C 256 114 236 102 214 100 C 196 98 176 100 160 108 C 146 116 138 132 136 146 C 134 156 132 164 129 170 Z';
      return {
        crown: 52,
        coversEars: false,
        front: (
          <g>
            <path d={crop} {...fill} />
            {line('M 168 58 C 170 74 172 88 176 100', 0.85, 1.8)}
            {line('M 180 62 C 200 66 230 76 252 98', 0.5)}
            {line('M 184 74 C 206 78 230 88 248 108', 0.45)}
            {sheen('M 192 58 C 216 58 240 70 254 88', 5, 0.5)}
            {texture(
              [
                [150, 80],
                [140, 100],
                [226, 64],
                [246, 76],
              ],
              c,
              2.6,
            )}
          </g>
        ),
      };
    }
    default:
      return { crown: 70, coversEars: false };
  }
}

/* ───────── Head coverings ───────── */

function coveringParts(id: string, cloth: ClothPaint, crown: number): { back?: ReactNode; front?: ReactNode } {
  const fill = { fill: cloth.base, stroke: cloth.line, strokeWidth: SW, strokeLinejoin: 'round' as const };
  const fold = (d: string, o = 0.7, w = 2) => <path d={d} fill="none" stroke={cloth.shade} strokeWidth={w} strokeLinecap="round" opacity={o} />;
  const glint = (d: string) => <path d={d} fill="none" stroke={cloth.light} strokeWidth={4} strokeLinecap="round" opacity={0.6} />;
  switch (id) {
    case 'hijab':
      return {
        front: (
          <g>
            <path
              fillRule="evenodd"
              d="M 200 50 C 128 50 106 112 110 182 C 112 232 116 262 94 320 C 130 346 270 346 306 320 C 284 262 288 232 290 182 C 294 112 272 50 200 50 Z M 200 94 C 236 94 254 124 254 160 C 254 200 230 227 200 227 C 170 227 146 200 146 160 C 146 124 164 94 200 94 Z"
              {...fill}
            />
            <path d="M 148 150 C 150 108 250 108 252 150 C 250 118 236 98 200 96 C 164 98 150 118 148 150 Z" fill={cloth.shade} />
            {fold('M 150 228 C 170 250 230 250 250 228')}
            {fold('M 126 250 C 150 290 180 300 210 300', 0.55)}
            {fold('M 280 250 C 262 286 244 300 226 306', 0.55)}
            {fold('M 128 120 C 122 160 124 200 132 232', 0.5)}
            {glint('M 150 74 C 168 62 186 58 200 58')}
          </g>
        ),
      };
    case 'wrap':
      return {
        front: (
          <g>
            <path d="M 132 156 C 118 100 150 58 200 56 C 250 58 282 100 268 156 C 252 134 230 120 200 120 C 170 120 148 134 132 156 Z" {...fill} />
            <path d={smoothShape([[150, 70], [168, 22], [206, 14], [212, 52], [190, 74]], 1)} {...fill} />
            <path d={smoothShape([[196, 64], [214, 18], [252, 22], [252, 64], [224, 80]], 1)} {...fill} />
            {fold('M 172 60 C 178 42 190 30 204 24')}
            {fold('M 214 64 C 222 46 234 34 246 30')}
            {fold('M 136 140 C 150 112 176 98 204 96 C 232 96 254 110 266 138', 0.6)}
            {fold('M 140 118 C 160 92 190 82 222 84', 0.5)}
            {glint('M 158 82 C 168 70 182 64 196 62')}
          </g>
        ),
      };
    case 'scarf':
      return {
        back: (
          <g>
            <path d={smoothShape([[256, 176], [282, 196], [298, 260], [288, 300], [272, 262], [258, 214]], 0.9)} {...fill} />
            <path d={smoothShape([[262, 182], [304, 200], [324, 248], [312, 278], [294, 240], [270, 214]], 0.9)} {...fill} />
            <circle cx={262} cy={180} r={13} {...fill} />
          </g>
        ),
        front: (
          <g>
            <path d="M 130 164 C 118 102 152 58 200 56 C 248 58 282 102 270 164 C 264 142 250 118 230 110 C 212 104 188 104 170 110 C 150 118 136 142 130 164 Z" {...fill} />
            <path d="M 136 150 C 148 116 172 104 200 104 C 228 104 252 116 264 150 C 254 124 230 112 200 112 C 170 112 146 124 136 150 Z" fill={cloth.shade} />
            {fold('M 150 84 C 176 72 220 72 252 88', 0.55)}
            {fold('M 140 120 C 168 92 232 90 262 120', 0.45)}
            {glint('M 162 72 C 176 64 190 62 200 62')}
          </g>
        ),
      };
    case 'turban':
      return {
        front: (
          <g>
            <path d="M 134 146 C 120 98 150 50 200 42 C 250 50 280 98 266 146 C 246 128 222 120 200 130 C 178 120 154 128 134 146 Z" {...fill} />
            {fold('M 140 128 C 160 96 182 70 200 48')}
            {fold('M 260 128 C 240 96 218 70 200 48')}
            {fold('M 150 140 C 168 112 186 90 200 76', 0.6)}
            {fold('M 250 140 C 232 112 214 90 200 76', 0.6)}
            {fold('M 160 146 C 176 128 190 112 200 104', 0.5)}
            {fold('M 240 146 C 224 128 210 112 200 104', 0.5)}
            {glint('M 160 72 C 172 60 186 52 196 50')}
          </g>
        ),
      };
    case 'kippah': {
      const y = crown + 6;
      return {
        front: (
          <g>
            <path d={`M 168 ${y} C 172 ${y - 22} 228 ${y - 22} 232 ${y} C 216 ${y + 6} 184 ${y + 6} 168 ${y} Z`} {...fill} />
            <path d={`M 172 ${y - 4} C 190 ${y} 210 ${y} 228 ${y - 4}`} fill="none" stroke={cloth.light} strokeWidth={2.5} opacity={0.8} />
          </g>
        ),
      };
    }
    case 'kufi': {
      const y = crown + 14;
      return {
        front: (
          <g>
            <path d={`M 150 ${y} C 148 ${y - 44} 252 ${y - 44} 250 ${y} C 222 ${y + 9} 178 ${y + 9} 150 ${y} Z`} {...fill} />
            <path d={`M 153 ${y - 10} C 180 ${y - 4} 220 ${y - 4} 247 ${y - 10}`} fill="none" stroke={cloth.light} strokeWidth={3} strokeDasharray="5 4" opacity={0.85} />
            <path d={`M 162 ${y - 24} C 186 ${y - 19} 214 ${y - 19} 238 ${y - 24}`} fill="none" stroke={cloth.shade} strokeWidth={2} strokeDasharray="2 5" />
          </g>
        ),
      };
    }
    default:
      return {};
  }
}

/* ───────── The face ───────── */

function Eye({ cx, cy, out, shape, iris, skin, clip }: { cx: number; cy: number; out: -1 | 1; shape: string; iris: string; skin: SkinPaint; clip: string }) {
  // `out` is the side the outer corner is on: -1 for the doll's right eye (on our left).
  const x = (dx: number) => cx + dx * out * -1;
  const white =
    shape === 'round'
      ? `M ${cx - 14} ${cy} a 14 13 0 1 0 28 0 a 14 13 0 1 0 -28 0 Z`
      : shape === 'almond'
        ? `M ${x(-17)} ${cy + 1} C ${x(-9)} ${cy - 13} ${x(9)} ${cy - 13} ${x(17)} ${cy - 1} C ${x(9)} ${cy + 10} ${x(-9)} ${cy + 10} ${x(-17)} ${cy + 1} Z`
        : `M ${x(-17)} ${cy + 1} C ${x(-10)} ${cy - 8} ${x(10)} ${cy - 9} ${x(17)} ${cy - 2} C ${x(10)} ${cy + 8} ${x(-10)} ${cy + 9} ${x(-17)} ${cy + 1} Z`;
  const lash =
    shape === 'round'
      ? `M ${x(-15)} ${cy - 1} C ${x(-12)} ${cy - 16} ${x(12)} ${cy - 16} ${x(15)} ${cy - 2} L ${x(19)} ${cy - 6}`
      : shape === 'almond'
        ? `M ${x(-17)} ${cy + 1} C ${x(-9)} ${cy - 13} ${x(9)} ${cy - 13} ${x(17)} ${cy - 1} L ${x(21)} ${cy - 5}`
        : `M ${x(-17)} ${cy + 1} C ${x(-10)} ${cy - 8} ${x(10)} ${cy - 9} ${x(17)} ${cy - 2} L ${x(20)} ${cy - 4}`;
  const r = shape === 'monolid' ? 8.5 : 9.5;
  const iy = shape === 'monolid' ? cy + 0.5 : cy + 1;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={white} />
        </clipPath>
      </defs>
      <path d={white} fill="#fbf8f4" />
      <g clipPath={`url(#${clip})`}>
        <circle cx={cx} cy={iy} r={r} fill={iris} />
        <circle cx={cx} cy={iy} r={r} fill="none" stroke={darken(iris, 0.45)} strokeWidth={1.6} />
        <circle cx={cx} cy={iy + 1} r={r * 0.62} fill={mix(iris, '#ffffff', 0.18)} opacity={0.5} />
        <circle cx={cx} cy={iy} r={r * 0.5} fill="#16100e" />
        {/* The lid's shadow across the top of the eye. */}
        <path d={`M ${cx - 20} ${cy - 16} L ${cx + 20} ${cy - 16} L ${cx + 20} ${cy - 6} Q ${cx} ${cy - 1} ${cx - 20} ${cy - 6} Z`} fill={skin.shade} opacity={0.35} />
      </g>
      <circle cx={cx + 3.2} cy={iy - 3.4} r={2.8} fill="#fff" />
      <circle cx={cx - 3} cy={iy + 3.6} r={1.2} fill="#fff" opacity={0.85} />
      <path d={lash} fill="none" stroke="#1f1512" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      {shape !== 'monolid' && <path d={`M ${x(-12)} ${cy - (shape === 'round' ? 19 : 16)} C ${x(-4)} ${cy - 23} ${x(6)} ${cy - 23} ${x(13)} ${cy - (shape === 'round' ? 17 : 14)}`} fill="none" stroke={skin.line} strokeWidth={1.4} strokeLinecap="round" opacity={0.55} />}
      <path d={`M ${x(-12)} ${cy + 9} C ${x(-4)} ${cy + 12} ${x(6)} ${cy + 12} ${x(13)} ${cy + 7}`} fill="none" stroke={skin.line} strokeWidth={1.1} strokeLinecap="round" opacity={0.35} />
    </g>
  );
}

function Face({ d, skin, uid, brow }: { d: Doll; skin: SkinPaint; uid: string; brow: string }) {
  const iris = (EYE_COLOURS.find((e) => e.id === d.eyeColour) ?? EYE_COLOURS[0]).color;
  const { x: ex, y: ey } = HEAD.eyes;
  const nose =
    d.nose === 'broad'
      ? 'M 187 190 C 186 197 193 199 197 196 M 213 190 C 214 197 207 199 203 196 M 194 197 Q 200 200 206 197'
      : d.nose === 'long'
        ? 'M 197 160 C 195 174 193 186 194 192 Q 200 197 207 193'
        : 'M 194 192 Q 200 197 206 192';
  const lips =
    d.lips === 'full'
      ? { up: 'M 183 208 C 189 201 196 202 200 205 C 204 202 211 201 217 208 C 210 211 190 211 183 208 Z', low: 'M 184 209 C 189 222 211 222 216 209 C 208 212 192 212 184 209 Z', mid: 'M 182 208 Q 200 212.5 218 208' }
      : d.lips === 'medium'
        ? { up: 'M 187 209 C 192 204 197 205 200 206.5 C 203 205 208 204 213 209 C 207 211 193 211 187 209 Z', low: 'M 188 210 C 192 218 208 218 212 210 C 206 212 194 212 188 210 Z', mid: 'M 186 209 Q 200 212.5 214 209' }
        : { up: 'M 189 210 C 195 207 205 207 211 210 C 205 211.5 195 211.5 189 210 Z', low: 'M 190 211 C 195 215.5 205 215.5 210 211 C 205 212.5 195 212.5 190 211 Z', mid: 'M 188 210 Q 200 213 212 210' };
  const freckles: Pt[] = [
    [168, 186],
    [176, 182],
    [162, 192],
    [172, 192],
    [183, 186],
    [217, 186],
    [224, 182],
    [238, 192],
    [228, 192],
    [232, 184],
    [193, 178],
    [207, 178],
  ];
  return (
    <g>
      {d.vitiligo && (
        <g fill={skin.patch}>
          <path d={smoothShape([[146, 140], [160, 134], [168, 146], [166, 168], [156, 178], [144, 170], [140, 154]], 0.9)} />
          <path d={smoothShape([[210, 212], [222, 208], [226, 218], [218, 228], [206, 226]], 0.9)} />
          <path d={smoothShape([[218, 104], [236, 102], [244, 114], [234, 124], [220, 120]], 0.9)} />
        </g>
      )}
      <ellipse cx={160} cy={194} rx={13} ry={8} fill={skin.blush} opacity={0.45} />
      <ellipse cx={240} cy={194} rx={13} ry={8} fill={skin.blush} opacity={0.45} />
      <Eye cx={ex} cy={ey} out={-1} shape={d.eyes} iris={iris} skin={skin} clip={`${uid}-el`} />
      <Eye cx={2 * MID - ex} cy={ey} out={1} shape={d.eyes} iris={iris} skin={skin} clip={`${uid}-er`} />
      <g fill="none" stroke={brow} strokeLinecap="round">
        <path d={`M ${ex - 15} ${ey - 22} C ${ex - 8} ${ey - 30} ${ex + 4} ${ey - 30} ${ex + 13} ${ey - 24}`} strokeWidth={4.6} />
        <path d={`M ${2 * MID - ex + 15} ${ey - 22} C ${2 * MID - ex + 8} ${ey - 30} ${2 * MID - ex - 4} ${ey - 30} ${2 * MID - ex - 13} ${ey - 24}`} strokeWidth={4.6} />
      </g>
      <path d={nose} fill="none" stroke={skin.line} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <ellipse cx={200} cy={184} rx={3} ry={5} fill="#fff" opacity={0.18} />
      <path d={lips.up} fill={skin.lip} />
      <path d={lips.low} fill={mix(skin.lip, '#ffffff', 0.12)} />
      <ellipse cx={203} cy={214} rx={4} ry={1.6} fill="#fff" opacity={0.28} />
      <path d={lips.mid} fill="none" stroke={skin.lipLine} strokeWidth={1.8} strokeLinecap="round" />
      {d.freckles && (
        <g fill={skin.freckle} opacity={0.85}>
          {freckles.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.9 : 1.5} />
          ))}
        </g>
      )}
    </g>
  );
}

/* ───────── Clothes ───────── */

type Neck = 'crew' | 'scoop' | 'v' | 'high';

/** A top or the body of a dress or coat: neckline, shoulders, sides (a little wider than the torso) and hem. */
function topPath(out: number, hem: number, neck: Neck, flare = 0): string {
  const ny = 258;
  const nw = neck === 'scoop' ? 24 : neck === 'high' ? 15 : 18;
  const sides = torsoSide(out, 286, Math.min(hem, HIPS)).map(([x, y]) => [x - Math.max(0, (y - WAIST) / (HIPS - WAIST)) * flare, y] as Pt);
  if (hem > HIPS) sides.push([MID - 53 - out - flare * 1.2, hem]);
  const left: Pt[] = [[MID - nw, ny - (neck === 'high' ? 4 : 0)], [MID - 46, 266 - out * 0.4], [MID - 60 - out, 278 - out * 0.3], ...sides];
  const right = mirror(left).reverse();
  const neckline =
    neck === 'v' ? `L ${MID} ${ny + 40} Z` : neck === 'scoop' ? `Q ${MID} ${ny + 36} ${left[0][0]} ${left[0][1]} Z` : neck === 'high' ? `Q ${MID} ${ny + 3} ${left[0][0]} ${left[0][1]} Z` : `Q ${MID} ${ny + 16} ${left[0][0]} ${left[0][1]} Z`;
  const last = left[left.length - 1];
  return `M ${left[0][0]} ${left[0][1]}${through(left, 0.9)} Q ${MID} ${last[1] + 4} ${right[0][0]} ${right[0][1]}${through(right, 0.9)} ${neckline}`;
}

/** A skirt from the waist: standing it flares to its hem; seated it covers the lap and falls from the knees. */
function skirtPath(pose: Pose, hem: number, flare: number, from = WAIST): string {
  if (pose === 'standing') {
    const left: Pt[] = [...torsoSide(4, from, HIPS), [MID - 56 - flare * 0.4, (HIPS + hem) / 2], [MID - 50 - flare, hem]];
    const right = mirror(left).reverse();
    return `M ${left[0][0]} ${left[0][1]}${through(left)} Q ${MID} ${hem + 10} ${right[0][0]} ${right[0][1]}${through(right)} Z`;
  }
  // Seated, a long skirt still falls to the ankle; a knee-length one falls a little below the knee.
  const h = hem >= ANKLE.standing - 20 ? ANKLE.seated - 6 : Math.min(ANKLE.seated - 6, KNEE.seated + Math.max(12, hem - 590));
  const left: Pt[] = [...torsoSide(4, from, HIPS), [MID - 58, 490], [MID - 58, KNEE.seated], [MID - 52 - flare * 0.3, h]];
  const right = mirror(left).reverse();
  return `M ${left[0][0]} ${left[0][1]}${through(left, 0.8)} Q ${MID} ${h + 8} ${right[0][0]} ${right[0][1]}${through(right, 0.8)} Z`;
}

/** Trousers, joggers or shorts: the seat across the hips, and a leg down to `hem` (or the lap's hem, seated). */
function Trousers({ pose, hem, cloth, cuffs = false, out = 4 }: { pose: Pose; hem: number; cloth: ClothPaint; cuffs?: boolean; out?: number }) {
  const f = { fill: cloth.base, stroke: cloth.line, strokeWidth: SW, strokeLinejoin: 'round' as const };
  const hip = torsoSide(out, WAIST, HIPS);
  const seat = `M ${hip[0][0]} ${hip[0][1]}${through(hip)} Q ${MID - 30} ${484} ${MID} ${484} Q ${MID + 30} 484 ${MID + 53 + out} ${HIPS}${through(mirror(hip).reverse())} Z`;
  const legs: ReactNode[] = [];
  for (const side of ['left', 'right'] as const) {
    if (pose === 'standing') legs.push(<path key={side} d={tubePath(LEG_STANDING, side, out, 444, hem)} {...f} />);
    else {
      if (hem > KNEE.seated) legs.push(<path key={`${side}-shin`} d={tubePath(SHIN_SEATED, side, out, 504, Math.min(hem, ANKLE.seated))} {...f} />);
      legs.push(<path key={`${side}-thigh`} d={thighPath(side, out)} {...f} />);
    }
  }
  const cuffY = pose === 'standing' ? hem : Math.min(hem, ANKLE.seated);
  return (
    <g>
      {legs}
      <path d={seat} {...f} />
      {pose === 'seated' && (
        <g>
          <path d={`M 150 474 Q 174 482 198 474 M 250 474 Q 226 482 202 474`} fill="none" stroke={cloth.shade} strokeWidth={2.2} strokeLinecap="round" />
          <ellipse cx={172} cy={498} rx={16} ry={7} fill={cloth.light} opacity={0.3} />
          <ellipse cx={228} cy={498} rx={16} ry={7} fill={cloth.light} opacity={0.3} />
        </g>
      )}
      {cuffs && hem > KNEE[pose] && (
        <g fill={cloth.shade} stroke={cloth.line} strokeWidth={1.6}>
          {(['left', 'right'] as const).map((side) => (
            <path key={side} d={tubePath(pose === 'standing' ? LEG_STANDING : SHIN_SEATED, side, out + 1, cuffY - 12, cuffY)} />
          ))}
        </g>
      )}
    </g>
  );
}

function Sleeves({ hem, cloth, out = 4, cuff }: { hem: number; cloth: ClothPaint; out?: number; cuff?: string }) {
  return (
    <g fill={cloth.base} stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round">
      <path d={armPath('left', out, hem)} />
      <path d={armPath('right', out, hem)} />
      {cuff && (
        <g fill={cuff} strokeWidth={1.6}>
          <path d={tubePath(ARM, 'left', out + 0.5, hem - 11, hem)} />
          <path d={tubePath(ARM, 'right', out + 0.5, hem - 11, hem)} />
        </g>
      )}
    </g>
  );
}

function Shoes({ pose, kind, color, sole = '#f4f1ea' }: { pose: Pose; kind: 'trainer' | 'flat' | 'boot' | 'smart'; color: string; sole?: string }) {
  const s = SOLE[pose];
  return (
    <g>
      {(['left', 'right'] as const).map((side) => (
        <g key={side}>
          <path d={shoePath(pose, side, kind)} fill={color} stroke={darken(color, 0.5)} strokeWidth={SW} strokeLinejoin="round" />
          {kind === 'trainer' && (
            <path
              d={side === 'left' ? `M 155 ${s - 6} Q 174 ${s - 2} 191 ${s - 6} L 190 ${s - 1} Q 174 ${s + 2} 158 ${s - 1} Z` : `M 245 ${s - 6} Q 226 ${s - 2} 209 ${s - 6} L 210 ${s - 1} Q 226 ${s + 2} 242 ${s - 1} Z`}
              fill={sole}
              stroke={darken(sole, 0.4)}
              strokeWidth={1.4}
            />
          )}
          {kind !== 'smart' && <path d={side === 'left' ? `M 164 ${s - 18} Q 172 ${s - 22} 182 ${s - 18}` : `M 236 ${s - 18} Q 228 ${s - 22} 218 ${s - 18}`} fill="none" stroke={lighten(color, 0.45)} strokeWidth={2} strokeLinecap="round" opacity={0.8} />}
        </g>
      ))}
    </g>
  );
}

const DENIM = clothPaint('#4a73a8');
const GREY = clothPaint('#8d939b');
const WHITE = clothPaint('#f3efe6');

function Outfit({ d, pose, cloth, uid }: { d: Doll; pose: Pose; cloth: ClothPaint; uid: string }) {
  const f = (c: ClothPaint) => ({ fill: c.base, stroke: c.line, strokeWidth: SW, strokeLinejoin: 'round' as const });
  const fold = (path: string, c: ClothPaint, o = 0.6) => <path d={path} fill="none" stroke={c.shade} strokeWidth={2} strokeLinecap="round" opacity={o} />;
  const ankle = ANKLE[pose];
  const knee = KNEE[pose];
  switch (d.outfit) {
    case 'tee':
      return {
        lower: (
          <g>
            <Trousers pose={pose} hem={ankle - 4} cloth={DENIM} cuffs />
            {fold(`M 200 ${pose === 'standing' ? 470 : 484} L 200 ${pose === 'standing' ? 486 : 492}`, DENIM, 0.8)}
            <Shoes pose={pose} kind="trainer" color="#f4f1ea" sole={cloth.base} />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(4, 452, 'crew')} {...f(cloth)} />
            <path d={smoothShape([[200, 302], [207, 318], [224, 320], [211, 330], [215, 346], [200, 337], [185, 346], [189, 330], [176, 320], [193, 318]], 0.4)} fill={cloth.light} opacity={0.9} />
            {fold('M 158 420 C 176 428 190 430 204 428', cloth)}
          </g>
        ),
        sleeves: <Sleeves hem={330} cloth={cloth} />,
      };
    case 'dress':
      return {
        lower: (
          <g>
            <path d={skirtPath(pose, 616, 46)} fill={`url(#${uid}-dots)`} stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round" />
            {pose === 'standing' && fold('M 176 470 C 170 520 162 560 156 604', cloth)}
            {pose === 'standing' && fold('M 224 470 C 230 520 238 560 244 604', cloth)}
            <Shoes pose={pose} kind="flat" color={cloth.shade} />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(3, WAIST + 4, 'scoop')} fill={`url(#${uid}-dots)`} stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${MID - 46} ${WAIST - 6} Q ${MID} ${WAIST + 2} ${MID + 46} ${WAIST - 6} L ${MID + 47} ${WAIST + 8} Q ${MID} ${WAIST + 16} ${MID - 47} ${WAIST + 8} Z`} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.6} />
          </g>
        ),
        sleeves: <Sleeves hem={304} cloth={cloth} out={5} />,
      };
    case 'print':
      return {
        lower: (
          <g>
            <path d={skirtPath(pose, 600, 36, WAIST - 10)} fill={`url(#${uid}-print)`} stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round" />
            <Shoes pose={pose} kind="flat" color="#d9a441" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(3, WAIST, 'crew')} fill={`url(#${uid}-print)`} stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round" />
          </g>
        ),
        sleeves: null,
      };
    case 'overalls': {
      const bib = `M ${MID - 34} 326 L ${MID + 34} 326 L ${MID + 40} ${WAIST} L ${MID - 40} ${WAIST} Z`;
      return {
        lower: (
          <g>
            <Trousers pose={pose} hem={ankle - 4} cloth={cloth} cuffs />
            <Shoes pose={pose} kind="trainer" color="#2a2a2e" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(4, 452, 'crew')} {...f(WHITE)} />
            {[300, 318, 336, 354, 372].map((y) => (
              <path key={y} d={`M ${MID - 58} ${y} L ${MID + 58} ${y}`} stroke={cloth.base} strokeWidth={4} opacity={0.45} />
            ))}
            <path d={bib} {...f(cloth)} />
            <path d={`M ${MID - 30} 330 L ${MID - 50} 276 M ${MID + 30} 330 L ${MID + 50} 276`} stroke={cloth.line} strokeWidth={11} strokeLinecap="round" />
            <path d={`M ${MID - 30} 330 L ${MID - 50} 276 M ${MID + 30} 330 L ${MID + 50} 276`} stroke={cloth.base} strokeWidth={7.5} strokeLinecap="round" />
            <circle cx={MID - 30} cy={334} r={4.5} fill="#f2cc2e" stroke="#8a6a14" strokeWidth={1.4} />
            <circle cx={MID + 30} cy={334} r={4.5} fill="#f2cc2e" stroke="#8a6a14" strokeWidth={1.4} />
            <path d={`M ${MID - 18} 350 L ${MID + 18} 350 L ${MID + 16} 374 L ${MID - 16} 374 Z`} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.4} />
          </g>
        ),
        sleeves: <Sleeves hem={326} cloth={WHITE} />,
      };
    }
    case 'hoodie':
      return {
        lower: (
          <g>
            <Trousers pose={pose} hem={ankle - 2} cloth={GREY} />
            {(['left', 'right'] as const).map((side) => (
              <path key={side} d={tubePath(pose === 'standing' ? LEG_STANDING : SHIN_SEATED, side, 5, ankle - 14, ankle - 2)} fill={GREY.shade} stroke={GREY.line} strokeWidth={1.6} />
            ))}
            <Shoes pose={pose} kind="trainer" color={cloth.base === '#f3efe6' ? '#2b6fb9' : '#f4f1ea'} sole={cloth.base} />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(6, 466, 'crew', 4)} {...f(cloth)} />
            <path d={`M ${MID - 64} ${452} L ${MID + 64} 452 L ${MID + 64} 468 Q ${MID} 474 ${MID - 64} 468 Z`} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.6} />
            <path d={`M ${MID - 40} 400 L ${MID + 40} 400 L ${MID + 50} 444 L ${MID - 50} 444 Z`} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.6} opacity={0.9} />
            {/* The hood, lying round the neck. */}
            <path d={`M ${MID - 46} 266 C ${MID - 40} 252 ${MID - 22} 246 ${MID} 246 C ${MID + 22} 246 ${MID + 40} 252 ${MID + 46} 266 C ${MID + 34} 290 ${MID + 14} 296 ${MID} 296 C ${MID - 14} 296 ${MID - 34} 290 ${MID - 46} 266 Z M ${MID - 22} 264 Q ${MID} 284 ${MID + 22} 264 Q ${MID} 256 ${MID - 22} 264 Z`} fillRule="evenodd" {...f(cloth)} />
            <path d={`M ${MID - 10} 290 L ${MID - 12} 330 M ${MID + 10} 290 L ${MID + 12} 330`} stroke={cloth.light} strokeWidth={2.6} strokeLinecap="round" />
          </g>
        ),
        sleeves: <Sleeves hem={WRIST - 2} cloth={cloth} out={6} cuff={cloth.shade} />,
      };
    case 'skirt':
      return {
        lower: (
          <g>
            <path d={skirtPath(pose, ankle - 6, 30)} {...f(cloth)} />
            {[-30, -10, 10, 30].map((dx) => (
              <Fragment key={dx}>
                {pose === 'standing'
                  ? fold(`M ${MID + dx * 0.6} ${WAIST + 20} L ${MID + dx * 1.6} ${ankle - 12}`, cloth, 0.5)
                  : fold(`M ${MID + dx * 0.9} ${KNEE.seated + 6} L ${MID + dx * 1.2} ${ankle - 100}`, cloth, 0.5)}
              </Fragment>
            ))}
            <Shoes pose={pose} kind="flat" color="#6b3b26" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(4, WAIST + 6, 'high')} {...f(WHITE)} />
            <path d={`M ${MID - 46} ${WAIST - 4} L ${MID + 46} ${WAIST - 4} L ${MID + 47} ${WAIST + 8} L ${MID - 47} ${WAIST + 8} Z`} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.6} />
          </g>
        ),
        sleeves: <Sleeves hem={WRIST - 2} cloth={WHITE} />,
      };
    case 'suit': {
      const lapel = `M ${MID - 16} 258 L ${MID - 34} 290 L ${MID - 22} 300 L ${MID - 8} 344 L ${MID} 360 L ${MID + 8} 344 L ${MID + 22} 300 L ${MID + 34} 290 L ${MID + 16} 258`;
      return {
        lower: (
          <g>
            <Trousers pose={pose} hem={ankle - 2} cloth={cloth} />
            {pose === 'standing' && fold(`M 176 490 L 176 ${ankle - 6} M 224 490 L 224 ${ankle - 6}`, cloth, 0.55)}
            <Shoes pose={pose} kind="smart" color="#2a2220" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(6, 470, 'v', 3)} {...f(cloth)} />
            <path d={`M ${MID - 16} 258 Q ${MID} 270 ${MID + 16} 258 L ${MID + 8} 344 L ${MID} 360 L ${MID - 8} 344 Z`} fill="#f7f4ee" stroke="#b9b2a4" strokeWidth={1.4} />
            <path d={lapel} fill="none" stroke={cloth.line} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${MID - 34} 290 L ${MID - 22} 300 L ${MID - 12} 330`} fill="none" stroke={cloth.shade} strokeWidth={4} opacity={0.7} />
            <path d={`M ${MID + 34} 290 L ${MID + 22} 300 L ${MID + 12} 330`} fill="none" stroke={cloth.shade} strokeWidth={4} opacity={0.7} />
            <path d={`M ${MID} 360 L ${MID} 468`} stroke={cloth.line} strokeWidth={1.6} />
            <circle cx={MID + 6} cy={380} r={3.6} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.2} />
            <circle cx={MID + 6} cy={410} r={3.6} fill={cloth.shade} stroke={cloth.line} strokeWidth={1.2} />
            <path d={`M ${MID + 30} 316 l 16 0 l -2 6 l -12 0 Z`} fill="#f2cc2e" />
          </g>
        ),
        sleeves: <Sleeves hem={WRIST - 4} cloth={cloth} out={5} />,
      };
    }
    case 'kit': {
      const shortsHem = pose === 'standing' ? 520 : 0;
      return {
        lower: (
          <g>
            {pose === 'standing' ? <Trousers pose={pose} hem={shortsHem} cloth={WHITE} out={6} /> : <Trousers pose={pose} hem={0} cloth={WHITE} out={6} />}
            {(['left', 'right'] as const).map((side) => (
              <path key={side} d={tubePath(pose === 'standing' ? LEG_STANDING : SHIN_SEATED, side, 2.5, knee + (pose === 'standing' ? 14 : -4), ankle + 2)} fill={cloth.base} stroke={cloth.line} strokeWidth={SW} />
            ))}
            {(['left', 'right'] as const).map((side) => (
              <path key={`b-${side}`} d={tubePath(pose === 'standing' ? LEG_STANDING : SHIN_SEATED, side, 3, knee + (pose === 'standing' ? 14 : -4), knee + (pose === 'standing' ? 24 : 6))} fill={cloth.light} stroke={cloth.line} strokeWidth={1.4} />
            ))}
            <Shoes pose={pose} kind="trainer" color="#2a2a2e" sole="#f2cc2e" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(5, 458, 'v', 2)} {...f(cloth)} />
            <path d={`M ${MID - 18} 258 L ${MID} 296 L ${MID + 18} 258`} fill="none" stroke={WHITE.base} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M ${MID - 52} 300 L ${MID - 52} 452 M ${MID + 52} 300 L ${MID + 52} 452`} stroke={WHITE.base} strokeWidth={4} opacity={0.85} />
            <path d={smoothShape([[MID + 24, 318], [MID + 28, 328], [MID + 38, 329], [MID + 30, 335], [MID + 33, 345], [MID + 24, 339], [MID + 15, 345], [MID + 18, 335], [MID + 10, 329], [MID + 20, 328]], 0.3)} fill={WHITE.base} />
          </g>
        ),
        sleeves: <Sleeves hem={326} cloth={cloth} out={5} cuff={WHITE.base} />,
      };
    }
    case 'lab':
      return {
        lower: (
          <g>
            <Trousers pose={pose} hem={ankle - 2} cloth={clothPaint('#2f3b5c')} />
            {pose === 'standing' ? (
              <path d={skirtPath(pose, 606, 20, 380)} {...f(WHITE)} />
            ) : (
              <path d={`M ${MID - 60} 440 L ${MID - 62} ${KNEE.seated} Q ${MID - 50} ${KNEE.seated + 6} ${MID - 38} ${KNEE.seated} L ${MID - 44} 440 Z M ${MID + 60} 440 L ${MID + 62} ${KNEE.seated} Q ${MID + 50} ${KNEE.seated + 6} ${MID + 38} ${KNEE.seated} L ${MID + 44} 440 Z`} {...f(WHITE)} />
            )}
            <Shoes pose={pose} kind="smart" color="#3a2a22" />
          </g>
        ),
        upper: (
          <g>
            <path d={topPath(3, 452, 'crew')} {...f(cloth)} />
            <path d={`M ${MID - 16} 258 L ${MID - 64} 278 L ${MID - 60} 470 L ${MID - 20} 470 L ${MID - 22} 400 L ${MID - 6} 300 Z`} {...f(WHITE)} />
            <path d={`M ${MID + 16} 258 L ${MID + 64} 278 L ${MID + 60} 470 L ${MID + 20} 470 L ${MID + 22} 400 L ${MID + 6} 300 Z`} {...f(WHITE)} />
            <path d={`M ${MID - 52} 400 L ${MID - 30} 400 L ${MID - 30} 426 L ${MID - 52} 426 Z`} fill="none" stroke={WHITE.line} strokeWidth={1.4} />
            <path d={`M ${MID + 30} 316 L ${MID + 50} 316 L ${MID + 50} 336 L ${MID + 30} 336 Z`} fill="none" stroke={WHITE.line} strokeWidth={1.4} />
            <path d={`M ${MID + 36} 306 L ${MID + 36} 322`} stroke="#2b6fb9" strokeWidth={3} strokeLinecap="round" />
          </g>
        ),
        sleeves: <Sleeves hem={WRIST - 2} cloth={WHITE} out={5} />,
      };
    default:
      return { lower: null, upper: null, sleeves: null };
  }
}

/** The patterns the dresses are cut from, kept inside each picture so a saved picture keeps them. */
function Patterns({ uid, cloth }: { uid: string; cloth: ClothPaint }) {
  const accent = cloth.base === '#1e8a4e' ? '#d7262e' : '#1e8a4e';
  return (
    <defs>
      <pattern id={`${uid}-dots`} width={22} height={22} patternUnits="userSpaceOnUse">
        <rect width={22} height={22} fill={cloth.base} />
        <circle cx={5} cy={5} r={3} fill={cloth.light} />
        <circle cx={16} cy={16} r={3} fill={cloth.light} />
      </pattern>
      <pattern id={`${uid}-print`} width={34} height={34} patternUnits="userSpaceOnUse">
        <rect width={34} height={34} fill={cloth.base} />
        <path d="M 17 2 L 30 17 L 17 32 L 4 17 Z" fill={accent} />
        <path d="M 17 9 L 24 17 L 17 25 L 10 17 Z" fill="#f2cc2e" />
        <circle cx={17} cy={17} r={2.6} fill="#2a1c14" />
        <circle cx={0} cy={0} r={4} fill="#2a1c14" />
        <circle cx={34} cy={0} r={4} fill="#2a1c14" />
        <circle cx={0} cy={34} r={4} fill="#2a1c14" />
        <circle cx={34} cy={34} r={4} fill="#2a1c14" />
      </pattern>
    </defs>
  );
}

/* ───────── The wheelchair ───────── */

/** The big wheels stand on the floor, beside the seat, as the small front wheels do. */
const WHEEL = { cy: 588, r: 100, dx: 86 };

function ChairBack({ color }: { color: string }) {
  const frame = { stroke: color, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const edge = darken(color, 0.45);
  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={WHEEL.cy} r={WHEEL.r} fill="none" stroke="#2b2b2f" strokeWidth={12} />
      <circle cx={cx} cy={WHEEL.cy} r={WHEEL.r - 7} fill="none" stroke="#7d838b" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <path key={i} d={`M ${cx} ${WHEEL.cy} L ${cx + Math.cos(a) * (WHEEL.r - 8)} ${WHEEL.cy + Math.sin(a) * (WHEEL.r - 8)}`} stroke="#b7bcc3" strokeWidth={1.6} />;
      })}
      <circle cx={cx} cy={WHEEL.cy} r={WHEEL.r - 15} fill="none" stroke="#d3d7dc" strokeWidth={3.5} />
      <circle cx={cx} cy={WHEEL.cy} r={10} fill={color} stroke={edge} strokeWidth={2} />
    </g>
  );
  return (
    <g>
      {/* The back and its push handles, standing up behind the shoulders. */}
      <path d="M 150 478 L 148 292 Q 148 278 134 278 M 250 478 L 252 292 Q 252 278 266 278" {...frame} />
      <path d="M 134 278 L 122 278 M 266 278 L 278 278" stroke="#2b2b2f" strokeWidth={9} strokeLinecap="round" />
      <rect x={150} y={296} width={100} height={170} rx={6} fill="#2f3036" />
      {wheel(MID - WHEEL.dx)}
      {wheel(MID + WHEEL.dx)}
      {/* The seat, the frame down to the footplate, and the small front wheels. */}
      <rect x={134} y={468} width={132} height={42} rx={10} fill="#2f3036" />
      <path d="M 154 506 L 160 650 M 246 506 L 240 650" {...frame} />
      <path d="M 156 660 L 152 670 M 244 660 L 248 670" {...frame} strokeWidth={5} />
      <circle cx={150} cy={676} r={12} fill="#2b2b2f" />
      <circle cx={250} cy={676} r={12} fill="#2b2b2f" />
      <circle cx={150} cy={676} r={4} fill="#b7bcc3" />
      <circle cx={250} cy={676} r={4} fill="#b7bcc3" />
      <rect x={138} y={648} width={124} height={11} rx={5} fill={color} stroke={edge} strokeWidth={1.8} />
    </g>
  );
}

/** The side guards, beside the hips, in front of the wheels: the arms rest on them. */
function ChairSides({ color }: { color: string }) {
  const edge = darken(color, 0.45);
  return (
    <g fill={color} stroke={edge} strokeWidth={SW} strokeLinejoin="round">
      <path d="M 122 446 Q 122 436 132 436 L 140 436 Q 146 436 146 446 L 146 504 Q 146 512 138 512 L 128 512 Q 122 512 122 504 Z" />
      <path d="M 278 446 Q 278 436 268 436 L 260 436 Q 254 436 254 446 L 254 504 Q 254 512 262 512 L 272 512 Q 278 512 278 504 Z" />
      <path d="M 126 452 L 126 500 M 274 452 L 274 500" stroke={lighten(color, 0.35)} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

/* ───────── The doll ───────── */

export default function DollArt({ doll, view = 'full', title, className }: { doll: Doll; view?: DollView; title?: string; className?: string }) {
  const uid = `d${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const pose: Pose = doll.seated ? 'seated' : 'standing';
  const skin = skinPaint(doll.tone);
  const hairC = hairColourOf(doll.hairColour);
  const cloth = clothPaint(clothColour(doll.outfitColour));
  const coverCloth = clothPaint(clothColour(doll.coveringColour));
  const bead = doll.outfitColour === 'yellow' ? '#f29a1b' : '#f2cc2e';
  const hidden = hidesHair(doll.covering);
  const hair = hairParts(doll.hair, hairC, bead);
  const covering = doll.covering ? coveringParts(doll.covering, coverCloth, hair.crown) : {};
  const outfit = Outfit({ d: doll, pose, cloth, uid });
  const skinFill = { fill: skin.base, stroke: skin.line, strokeWidth: SW, strokeLinejoin: 'round' as const };
  const showEars = hidden ? false : !hair.coversEars;
  const prosthetic = doll.prosthetic ? prostheticParts(pose) : null;
  // The head and face tiles skip what they can't show: the legs, the lower clothes, the wheelchair.
  const low = view === 'full' || view === 'body' || view === 'legs';
  const chair = clothColour(doll.chairColour);

  /** The legs' skin. With a prosthetic, the left leg stops above the knee and the prosthetic takes over. */
  const legs = (['left', 'right'] as const).flatMap((side) => {
    if (side === 'left' && prosthetic) {
      // Standing: the thigh down to just above the socket. Seated: the lap only (the shin is the prosthetic).
      return [pose === 'standing' ? tubePath(LEG_STANDING, 'left', 0, 440, KNEE.standing - 10) : thighPath('left')];
    }
    return legPaths(pose, side);
  });

  const prostheticArt = prosthetic && (
    <g>
      <path d={prosthetic.pylon} fill="#b9bfc6" stroke="#5d636b" strokeWidth={1.8} />
      <path d={prosthetic.joint} fill="#5d636b" />
      <path d={prosthetic.socket} fill={chair} stroke={darken(chair, 0.45)} strokeWidth={SW} />
      <path d={prosthetic.socket} fill="none" stroke="#fff" strokeWidth={3} opacity={0.35} strokeDasharray="0 18 26 200" />
    </g>
  );

  return (
    <svg viewBox={viewBoxFor(view, doll.seated)} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} xmlns="http://www.w3.org/2000/svg">
      <Patterns uid={uid} cloth={cloth} />
      {view === 'full' && <ellipse cx={MID} cy={doll.seated ? SOLE.seated + SEAT_DROP + 40 : SOLE.standing + 4} rx={doll.seated ? 150 : 70} ry={doll.seated ? 12 : 9} fill="#141414" opacity={0.14} />}
      <g transform={doll.seated ? `translate(0 ${SEAT_DROP})` : undefined}>
        {low && doll.seated && <ChairBack color={chair} />}
        {!hidden && hair.back}
        {covering.back}

        {/* Legs (and a prosthetic), then the neck and torso, then the clothes on them. */}
        {low && (
          <g>
            {/* Seated, the lap is in front of the socket; standing, the socket holds the leg. */}
            {pose === 'seated' && prostheticArt}
            {legs.map((d, i) => (
              <path key={i} d={d} {...skinFill} />
            ))}
            {pose === 'standing' && prostheticArt}
            {pose === 'seated' && (
              <g fill={lighten(skin.base, 0.25)} opacity={0.45}>
                <ellipse cx={172} cy={496} rx={15} ry={8} />
                <ellipse cx={228} cy={496} rx={15} ry={8} />
              </g>
            )}
          </g>
        )}
        <path d={`M ${MID - 16} 212 L ${MID + 16} 212 L ${MID + 18} 262 L ${MID - 18} 262 Z`} {...skinFill} />
        <path d={`M ${MID - 16} 226 Q ${MID} 248 ${MID + 16} 226 L ${MID + 17} 238 Q ${MID} 258 ${MID - 17} 238 Z`} fill={skin.shade} />
        <path d={torsoPath()} {...skinFill} />
        {low && outfit.lower}
        {outfit.upper}
        {low && doll.seated && <ChairSides color={chair} />}

        {/* Arms and hands, then sleeves over them. */}
        <path d={armPath('left')} {...skinFill} />
        <path d={armPath('right')} {...skinFill} />
        {outfit.sleeves}
        <path d={handPath('left')} {...skinFill} />
        <path d={handPath('right')} {...skinFill} />
        {doll.vitiligo && (
          <g fill={skin.patch}>
            <path d={smoothShape([[120, 474], [130, 470], [134, 482], [126, 490], [118, 486]], 0.9)} />
            <path d={smoothShape(mirror([[124, 492], [134, 488], [136, 498], [128, 502]]), 0.9)} />
          </g>
        )}

        {/* The head. */}
        {showEars && (
          <g {...skinFill}>
            <ellipse cx={HEAD.ears.x} cy={HEAD.ears.y} rx={9} ry={15} />
            <ellipse cx={2 * MID - HEAD.ears.x} cy={HEAD.ears.y} rx={9} ry={15} />
          </g>
        )}
        <path d={HEAD.path} {...skinFill} />
        <Face d={doll} skin={skin} uid={uid} brow={hidden || doll.hair === 'bald' ? (hairC.fun ? '#3a2a24' : hairC.brow) : hairC.brow} />
        {!hidden && hair.front}

        {doll.hearing && (
          <g>
            {[1, -1].map((s) => (
              <g key={s} transform={s === -1 ? `matrix(-1 0 0 1 ${2 * MID} 0)` : undefined}>
                <path d="M 125 140 C 114 146 113 168 120 180 L 127 178 C 121 167 122 150 131 145 Z" fill="#7d5cc6" stroke="#3e2b6e" strokeWidth={1.6} strokeLinejoin="round" />
                <path d="M 129 144 C 139 146 142 154 138 162" fill="none" stroke="#e9e6f2" strokeWidth={2} strokeLinecap="round" />
              </g>
            ))}
          </g>
        )}
        {covering.front}
        {doll.glasses !== 'none' && <Glasses kind={doll.glasses} />}
      </g>
    </svg>
  );
}

function Glasses({ kind }: { kind: 'round' | 'square' }) {
  const { x, y } = HEAD.eyes;
  const frame = kind === 'round' ? '#2b2b33' : '#c4262e';
  const lens = (cx: number) =>
    kind === 'round' ? <circle cx={cx} cy={y} r={18} /> : <rect x={cx - 20} y={y - 15} width={40} height={30} rx={8} />;
  return (
    <g fill="#ffffff" fillOpacity={0.14} stroke={frame} strokeWidth={3.4} strokeLinejoin="round">
      {lens(x)}
      {lens(2 * MID - x)}
      <path d={`M ${x + (kind === 'round' ? 18 : 20)} ${y - 2} Q ${MID} ${y - 9} ${2 * MID - x - (kind === 'round' ? 18 : 20)} ${y - 2}`} fill="none" />
      <path d={`M ${x - (kind === 'round' ? 18 : 20)} ${y - 4} L ${HEAD.ears.x + 2} ${y - 8} M ${2 * MID - x + (kind === 'round' ? 18 : 20)} ${y - 4} L ${2 * MID - HEAD.ears.x - 2} ${y - 8}`} fill="none" />
    </g>
  );
}
