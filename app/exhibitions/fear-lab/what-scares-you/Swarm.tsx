'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { makeSwarm, swarmLength, type Point } from './spiderPaths';

/*
 * The spiders pouring out of a box, across the whole screen: many small SVG
 * spiders, each on its own wavering path (spiderPaths.ts), each walking with two
 * frames of legs. They move by transform alone (the Web Animations API), so
 * the browser can hand them to the graphics chip; nothing is laid out again
 * while they run.
 *
 * Gentle mode: ten round, purple, smiling cartoon spiders, walking slowly.
 * Still (reduced motion): nothing crawls. Fewer spiders simply fade in where
 * they are, and fade out.
 *
 * If the owner has dropped in her own animation (assets.ts), `video` is its
 * address, and it plays instead, full screen, muted.
 */

/** Left-side legs, two frames (the right side mirrors the other frame, so they alternate). */
const LEGS_A = ['M -6 -16 L -22 -34 L -30 -48', 'M -7 -12 L -28 -20 L -42 -30', 'M -7 -8 L -28 -2 L -42 8', 'M -6 -4 L -22 12 L -30 30'];
const LEGS_B = ['M -6 -16 L -24 -30 L -34 -42', 'M -7 -12 L -26 -24 L -38 -36', 'M -7 -8 L -30 2 L -44 14', 'M -6 -4 L -20 16 L -26 36'];
const CARTOON_A = ['M -14 -8 Q -32 -26 -40 -16', 'M -16 -2 Q -38 -8 -44 4', 'M -16 4 Q -38 10 -42 24', 'M -14 10 Q -30 26 -32 40'];
const CARTOON_B = ['M -14 -8 Q -30 -30 -42 -24', 'M -16 -2 Q -40 -2 -46 10', 'M -16 4 Q -36 16 -38 30', 'M -14 10 Q -26 30 -26 44'];

function Legs({ left, right, className }: { left: string[]; right: string[]; className: string }) {
  return (
    <g className={className}>
      {left.map((d) => <path key={d} d={d} />)}
      {right.map((d) => <path key={`r${d}`} d={d} transform="scale(-1 1)" />)}
    </g>
  );
}

export function SpiderArt({ cartoon }: { cartoon: boolean }) {
  if (cartoon)
    return (
      <svg viewBox="-50 -50 100 100" className="fl-sp-art fl-sp-cartoon" aria-hidden="true">
        <g className="fl-sp-legs">
          <Legs left={CARTOON_A} right={CARTOON_B} className="fl-sp-a" />
          <Legs left={CARTOON_B} right={CARTOON_A} className="fl-sp-b" />
        </g>
        <circle r="20" cy="2" className="fl-sp-body" />
        <circle cx="-7" cy="-4" r="6.5" fill="#fff" />
        <circle cx="7" cy="-4" r="6.5" fill="#fff" />
        <circle cx="-6" cy="-6" r="3" fill="#221a33" />
        <circle cx="8" cy="-6" r="3" fill="#221a33" />
        <path d="M -7 9 Q 0 15 7 9" fill="none" stroke="#221a33" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-13" cy="7" r="3" fill="#f39bb6" opacity="0.8" />
        <circle cx="13" cy="7" r="3" fill="#f39bb6" opacity="0.8" />
      </svg>
    );
  return (
    <svg viewBox="-50 -50 100 100" className="fl-sp-art" aria-hidden="true">
      <g className="fl-sp-legs">
        <Legs left={LEGS_A} right={LEGS_B} className="fl-sp-a" />
        <Legs left={LEGS_B} right={LEGS_A} className="fl-sp-b" />
      </g>
      <ellipse cy="14" rx="13" ry="17" className="fl-sp-body" />
      <ellipse cy="-10" rx="8.5" ry="9.5" className="fl-sp-body" />
      <path d="M -4 6 L 0 18 L 4 6" className="fl-sp-mark" />
      <circle cx="-3" cy="-16" r="1.6" className="fl-sp-eye" />
      <circle cx="3" cy="-16" r="1.6" className="fl-sp-eye" />
    </svg>
  );
}

export default function Swarm({ gentle, still, origin, video }: { gentle: boolean; still: boolean; origin?: Point; video?: string | null }) {
  const [size] = useState(() => (typeof window === 'undefined' ? { w: 1280, h: 800 } : { w: window.innerWidth, h: window.innerHeight }));
  const paths = useMemo(() => {
    const o = origin ?? { x: size.w / 2, y: size.h / 2 };
    const all = makeSwarm({ width: size.w, height: size.h, origin: o, gentle });
    return still ? all.filter((_, i) => i % 2 === 0) : all;
  }, [size, origin, gentle, still]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = !!video && !still && !videoFailed;

  useEffect(() => {
    if (still || useVideo) return;
    const running: Animation[] = [];
    paths.forEach((p, i) => {
      const el = refs.current[i];
      if (!el || typeof el.animate !== 'function') return;
      const n = p.steps.length - 1;
      running.push(
        el.animate(
          p.steps.map((s, k) => ({ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.turn}deg)`, opacity: k === 0 ? 0 : 1, offset: k / n })),
          { duration: p.duration, delay: p.delay, easing: 'linear', fill: 'both' },
        ),
      );
    });
    return () => running.forEach((a) => a.cancel());
  }, [paths, still, useVideo]);

  const total = swarmLength(gentle);

  if (useVideo)
    return (
      <div className="fl-sw" data-kind="video" aria-hidden="true">
        <video className="fl-sw-video" src={video!} autoPlay muted playsInline onError={() => setVideoFailed(true)} />
      </div>
    );

  return (
    <div
      className="fl-sw"
      data-gentle={gentle ? 'true' : undefined}
      data-still={still ? 'true' : undefined}
      aria-hidden="true"
      style={{ ['--sw-total' as string]: `${total}ms`, ['--walk' as string]: gentle ? '0.5s' : '0.14s' } as CSSProperties}
    >
      {paths.map((p, i) => {
        // Still: each spider waits partway along its path, and fades with the rest.
        const at = p.steps[Math.max(1, Math.floor(p.steps.length / 2))];
        const style: CSSProperties = {
          width: p.size,
          height: p.size,
          marginLeft: -p.size / 2,
          marginTop: -p.size / 2,
          transform: still ? `translate(${at.x}px, ${at.y}px) rotate(${at.turn}deg)` : `translate(${p.steps[0].x}px, ${p.steps[0].y}px) scale(0)`,
        };
        return (
          <div
            key={i}
            className="fl-sp"
            data-spider=""
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={style}
          >
            <SpiderArt cartoon={gentle} />
          </div>
        );
      })}
    </div>
  );
}
