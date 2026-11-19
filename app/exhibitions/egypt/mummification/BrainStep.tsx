'use client';

import { useState, type PointerEvent, type Ref } from 'react';
import { DragGhost, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import { BODY, EAR, EYE, HAIR } from './MummyScene';
import { KeyHandle, Picture, Task, Tray, boxIn, usePicturePointer, type StepKit } from './kit';
import { ENTRIES, judgeBrain, judgeEntry, type Entry } from './mummyGame';
import { stepNotes } from './steps';

/*
 * The brain, through the nose: a close look at the head on the bed.
 *
 * First the visitor chooses the way in, by carrying the long bronze hook
 * to it: the top of the head, the ear, or the nose. Only the nose is right
 * (the British Museum: "the brain was removed through the nose"); the
 * others are turned back, and a second wrong try says where. Then the hook
 * is pushed up to the brain and drawn back out (dragged, or with the arrow
 * keys), and the brain comes out on it. Last, the visitor decides what
 * becomes of it: a jar, like the organs, or the basket? The brain was not
 * kept, so the jar is turned back.
 *
 * The head is the room's own figure (MummyScene's), drawn three times as
 * large. The brain is a soft grey shape seen through the head, as on a
 * plan, and leaves on the hook: nothing a young visitor need look away
 * from.
 */

const VIEW = { x: 0, y: 0, w: 640, h: 330 };
const box = boxIn(VIEW);
/** The figure's head, three times as large: x' = 3x - 430, y' = 3y - 570. */
const HEAD = 'translate(-430 -570) scale(3)';
const NOSTRIL = { x: 220, y: 100 };
const BRAIN = { x: 176, y: 202 };
const ENTRY_AT: Record<Entry, { x: number; y: number }> = { nose: NOSTRIL, ear: { x: 224, y: 202 }, crown: { x: 112, y: 178 } };
const DIR = (() => {
  const dx = BRAIN.x - NOSTRIL.x;
  const dy = BRAIN.y - NOSTRIL.y;
  const l = Math.hypot(dx, dy);
  return { x: dx / l, y: dy / l, l };
})();
const JAR = { x: 500, y: 296 };
const BASKET = { x: 588, y: 296 };

type Phase = 'place' | 'in' | 'dispose' | 'done';

function Hook({ x, y, a = 0, faint = false }: { x: number; y: number; a?: number; faint?: boolean }) {
  // The hook's tip at x,y, its long handle rising up and to the right.
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`} opacity={faint ? 0.45 : 1}>
      <path d="M0 0 q-6 2 -7 -5" fill="none" stroke="#c99a3d" strokeWidth="3" strokeLinecap="round" />
      <path d={`M0 0 L${-DIR.x * 84} ${-DIR.y * 84}`} stroke="#c99a3d" strokeWidth="4" strokeLinecap="round" />
      <circle cx={-DIR.x * 92} cy={-DIR.y * 92} r="8" fill="none" stroke="#c99a3d" strokeWidth="4" />
    </g>
  );
}

export function HeadScene({ phase, depth, brainOut, holdingBrain, onPointer, svgRef }: { phase: Phase; depth: number; brainOut: boolean; holdingBrain: boolean; onPointer?: (kind: 'down' | 'move' | 'up', e: PointerEvent<SVGSVGElement>) => void; svgRef?: Ref<SVGSVGElement> }) {
  const tip = { x: NOSTRIL.x + DIR.x * DIR.l * depth, y: NOSTRIL.y + DIR.y * DIR.l * depth };
  return (
    <svg
      ref={svgRef}
      className="egm-svg"
      viewBox="0 0 640 330"
      aria-hidden="true"
      onPointerDown={onPointer && ((e) => onPointer('down', e))}
      onPointerMove={onPointer && ((e) => onPointer('move', e))}
      onPointerUp={onPointer && ((e) => onPointer('up', e))}
      onPointerCancel={onPointer && ((e) => onPointer('up', e))}
    >
      <defs>
        <linearGradient id="egm-head-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b3d22" />
          <stop offset="1" stopColor="#2a1b0e" />
        </linearGradient>
        <linearGradient id="egm-head-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99066" />
          <stop offset="0.6" stopColor="#ad7448" />
          <stop offset="1" stopColor="#7d4f2e" />
        </linearGradient>
        <linearGradient id="egm-head-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a120a" stopOpacity="0" />
          <stop offset="1" stopColor="#1a120a" stopOpacity="0.92" />
        </linearGradient>
        <clipPath id="egm-head-in">
          <path d={BODY} transform={HEAD} />
        </clipPath>
        <mask id="egm-head-out">
          <rect width="640" height="330" fill="#fff" />
          <path d={BODY} transform={HEAD} fill="#000" />
        </mask>
      </defs>
      <rect width="640" height="330" fill="url(#egm-head-wall)" />
      <rect width="640" height="20" fill="#1d3f7c" />
      {Array.from({ length: 32 }, (_, i) => (
        <path key={i} d={`M${4 + i * 20} 20 L${4 + i * 20} 8 Q${14 + i * 20} -1 ${24 + i * 20} 8 L${24 + i * 20} 20 Z`} fill={['#c8402a', '#d9a441', '#2f7a4a'][i % 3]} stroke="#1a120a" strokeWidth="1" />
      ))}
      <rect y="20" width="640" height="3" fill="#d9a441" />
      {/* the bed under the head */}
      <rect x="40" y="302" width="600" height="16" rx="4" fill="#8a5a2b" stroke="#4a2c12" strokeWidth="2" />
      <rect x="0" y="318" width="640" height="12" fill="#3a2614" />

      {/* the head, close */}
      <g transform={HEAD}>
        <path d={BODY} fill="url(#egm-head-skin)" stroke="#5e3a20" strokeWidth="0.7" />
        <path d={HAIR} fill="#1c1410" />
        <path d={EYE} fill="none" stroke="#2a1a0c" strokeWidth="0.8" strokeLinecap="round" />
        <path d={EAR} fill="none" stroke="#6e4529" strokeWidth="0.9" />
        <path d="M216.2 222.6 q1.6 0.4 1.6 1.8" fill="none" stroke="#5e3a20" strokeWidth="0.6" />
        <path d="M222 231 q-2 0.6 -3.4 -0.2" fill="none" stroke="#8a3a2a" strokeWidth="0.7" />
      </g>
      {/* the brain, seen through the head as on a plan, until it is drawn out */}
      {!brainOut && (
        <g clipPath="url(#egm-head-in)">
          <path className="egm-brain-plan" d="M128 202 C126 176 150 160 176 162 C204 162 222 178 220 200 C218 222 200 236 176 236 C150 236 130 224 128 202 Z" />
          <path className="egm-brain-folds" d="M142 190 q10 -8 20 0 q10 8 20 0 q10 -8 22 2 M140 210 q12 -8 22 0 q12 8 24 -2 q8 -6 18 2" />
        </g>
      )}
      <rect x="380" y="23" width="260" height="279" fill="url(#egm-head-fade)" />

      {/* the jar and the basket, for what comes out */}
      {phase !== 'place' && phase !== 'in' && (
        <g>
          <g transform={`translate(${JAR.x} ${JAR.y})`}>
            <ellipse cx="0" cy="0" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />
            <path d="M-20 0 C-30 -12 -30 -46 -20 -62 L-16 -70 L16 -70 L20 -62 C30 -46 30 -12 20 0 Z" fill="#e6dabd" stroke="#2a1a0c" strokeWidth="2" />
            <rect x="-20" y="-78" width="40" height="9" rx="3" fill="#d8c9a6" stroke="#2a1a0c" strokeWidth="1.5" />
          </g>
          <g transform={`translate(${BASKET.x} ${BASKET.y})`}>
            <ellipse cx="0" cy="0" rx="34" ry="5" fill="rgba(0,0,0,0.35)" />
            <path d="M-30 -40 L30 -40 L24 0 L-24 0 Z" fill="#b8913f" stroke="#4a2c12" strokeWidth="2" />
            {[-30, -20, -10].map((y) => (
              <path key={y} d={`M${-29 + (y + 40) * 0.15} ${y} L${29 - (y + 40) * 0.15} ${y}`} stroke="#7d5a22" strokeWidth="2" />
            ))}
            {[-16, 0, 16].map((x) => (
              <path key={x} d={`M${x} -40 L${x * 0.8} 0`} stroke="#7d5a22" strokeWidth="1.5" />
            ))}
            <ellipse cx="0" cy="-40" rx="30" ry="6" fill="#2a1b0e" stroke="#4a2c12" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* the hook: on its tray, or in the nose (faint where it is inside the head) */}
      {phase === 'place' && (
        <g>
          <rect x="452" y="150" width="150" height="10" rx="3" fill="#6b4a24" stroke="#2a1b0e" strokeWidth="1.5" />
          <path d="M470 160 l10 22 M584 160 l-10 22" stroke="#2a1b0e" strokeWidth="3" />
          <Hook x={470} y={142} a={-64} />
        </g>
      )}
      {phase === 'in' && (
        <>
          <g mask="url(#egm-head-out)">
            <Hook x={tip.x} y={tip.y} />
          </g>
          <g clipPath="url(#egm-head-in)">
            <Hook x={tip.x} y={tip.y} faint />
          </g>
          {depth > 0.92 && <ellipse className="egm-brain-bit" cx={tip.x} cy={tip.y + 4} rx="10" ry="7" />}
          {depth < 0.5 ? (
            <path d={`M${NOSTRIL.x + 40} ${NOSTRIL.y - 6} l-8 18 l-2 -9 m2 9 l8 -4`} className="egm-hint-arrow" />
          ) : null}
        </>
      )}
      {phase === 'dispose' && !holdingBrain && (
        <g>
          <Hook x={NOSTRIL.x + 30} y={NOSTRIL.y - 6} />
          <ellipse className="egm-brain-bit" cx={NOSTRIL.x + 26} cy={NOSTRIL.y + 2} rx="12" ry="8" />
        </g>
      )}
    </svg>
  );
}

export default function BrainStep({ kit }: { kit: StepKit }) {
  const [phase, setPhase] = useState<Phase>(kit.done ? 'done' : 'place');
  const [misses, setMisses] = useState(0);
  const [hint, setHint] = useState('');
  const [holding, setHolding] = useState<'hook' | 'brain' | null>(null);
  const [depth, setDepth] = useState(0);
  const [reached, setReached] = useState(false);
  const [grab, setGrab] = useState<{ from: { x: number; y: number }; base: number } | null>(null);

  const enter = (at: Entry) => {
    const v = judgeEntry(at, misses);
    setHolding(null);
    setHint(v.ok ? '' : v.message);
    kit.say(v.message);
    if (!v.ok) {
      setMisses((m) => m + 1);
      playEgypt('miss');
      return;
    }
    playEgypt('grind');
    setPhase('in');
  };
  const push = (d: number) => {
    const next = Math.max(0, Math.min(1, d));
    setDepth(next);
    if (!reached && next >= 1) {
      setReached(true);
      playEgypt('grind');
      kit.say('The hook has reached the brain. Now pull it back out, through the nose.');
    } else if (reached && next <= 0.05) {
      playEgypt('find');
      setPhase('dispose');
      setHint('');
      kit.say('The brain is out, on the hook. Where does it go: into a jar, or into the basket?');
    }
  };
  const dispose = (to: 'jar' | 'basket') => {
    const v = judgeBrain(to);
    setHolding(null);
    kit.say(v.message);
    if (!v.ok) {
      setHint(v.message);
      playEgypt('miss');
      return;
    }
    setHint('');
    playEgypt('settle');
    setPhase('done');
    kit.finish();
  };

  const { svg, on } = usePicturePointer({
    down: (p) => {
      if (phase !== 'in') return false;
      setGrab({ from: p, base: depth });
      return true;
    },
    move: (p) => {
      if (!grab) return;
      // How far the pointer has moved along the hook's path, into the head.
      const along = ((p.x - grab.from.x) * DIR.x + (p.y - grab.from.y) * DIR.y) / DIR.l;
      push(grab.base + along * 1.3);
      if (!reached && grab.base + along * 1.3 >= 1) setGrab({ from: p, base: 1 });
    },
    up: () => setGrab(null),
  });

  const { drag, carrying, start } = useDragDrop<'hook' | 'brain'>((item, at) => {
    if (item === 'hook' && at.target.startsWith('entry-')) enter(at.target.slice(6) as Entry);
    if (item === 'brain' && (at.target === 'jar' || at.target === 'basket')) dispose(at.target);
  });

  const task =
    phase === 'place'
      ? 'The brain must come out, without cutting the head open. Carry the hook to the way in.'
      : phase === 'in'
        ? reached
          ? 'Now pull the hook back up and out, to draw the brain out.'
          : 'Push the hook up into the head, until it reaches the brain.'
        : phase === 'dispose'
          ? 'The brain is out. What do the embalmers do with it? Carry it to the jar or the basket.'
          : 'Gone: the brain was not kept.';
  const label =
    phase === 'place'
      ? 'Close up, the head on the embalmers’ bed, face up; a long bronze hook lies on a tray beside it'
      : phase === 'in'
        ? `The bronze hook is up the nose, ${reached ? 'with the brain caught on it' : `${Math.round(depth * 100)} percent of the way to the brain`}`
        : phase === 'dispose'
          ? 'The brain hangs on the hook, out of the nose; a jar and a basket stand beside the bed'
          : 'The head on the bed; the brain has been drawn out and is gone';

  return (
    <>
      <Task done={phase === 'done'}>{task}</Task>
      <Picture
        label={label}
        aspect="640 / 330"
        carrying={!!carrying || !!holding}
        over={
          <>
            {phase === 'place' && (
              <>
                <button type="button" className="egm-thing-over egk-carry" style={box(440, 60, 170, 104)} aria-pressed={holding === 'hook'} aria-label="The long bronze hook" onPointerDown={(e) => start('hook', e)} onClick={() => setHolding((h) => (h === 'hook' ? null : 'hook'))} />
                {ENTRIES.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    data-drop={`entry-${e.id}`}
                    className="egm-place egm-place-round"
                    style={box(ENTRY_AT[e.id].x - 26, ENTRY_AT[e.id].y - 26, 52, 52)}
                    aria-label={`Put the hook in through ${e.name}`}
                    onClick={() => (holding === 'hook' ? enter(e.id) : kit.say('First pick up the hook.'))}
                  />
                ))}
              </>
            )}
            {phase === 'in' && (
              <KeyHandle
                at={box(NOSTRIL.x - 34, NOSTRIL.y - 40, 68, 68)}
                label="The bronze hook, up the nose"
                value={depth}
                valueText={reached ? `It has reached the brain. Press the up arrow to pull it back out (${Math.round(depth * 100)} percent in).` : `${Math.round(depth * 100)} percent of the way to the brain. Press the down arrow to push it in.`}
                onKey={(k) => {
                  if (k === 'ArrowDown' && !reached) push(depth + 0.25);
                  else if (k === 'ArrowUp' && reached) push(depth - 0.25);
                  else return k === 'ArrowDown' || k === 'ArrowUp';
                  return true;
                }}
              />
            )}
            {phase === 'dispose' && (
              <>
                <button type="button" className="egm-thing-over egk-carry" style={box(NOSTRIL.x - 4, NOSTRIL.y - 40, 64, 60)} aria-pressed={holding === 'brain'} aria-label="The brain, on the hook" onPointerDown={(e) => start('brain', e)} onClick={() => setHolding((h) => (h === 'brain' ? null : 'brain'))} />
                <button type="button" data-drop="jar" className="egm-place" style={box(JAR.x - 34, JAR.y - 86, 68, 92)} aria-label="Put it in a jar" onClick={() => (holding === 'brain' ? dispose('jar') : kit.say('First pick up the brain.'))} />
                <button type="button" data-drop="basket" className="egm-place" style={box(BASKET.x - 38, BASKET.y - 52, 76, 58)} aria-label="Throw it in the basket" onClick={() => (holding === 'brain' ? dispose('basket') : kit.say('First pick up the brain.'))} />
              </>
            )}
          </>
        }
      >
        <HeadScene phase={phase} depth={depth} brainOut={phase === 'dispose' || phase === 'done'} holdingBrain={!!drag && drag.item === 'brain'} onPointer={on} svgRef={svg} />
      </Picture>
      <Tray
        tools={
          <>
            {phase === 'place' && <p className="egm-small">{holding === 'hook' ? 'You are holding the hook. Now tap the way in.' : 'Drag the hook, or tap it and then tap where it goes in.'}</p>}
            {phase === 'dispose' && <p className="egm-small">{holding === 'brain' ? 'You are holding the brain. Now tap where it goes.' : 'Drag the brain, or tap it and then tap where it goes.'}</p>}
            <p className="egm-hint">{hint}</p>
          </>
        }
        notes={phase === 'done' ? stepNotes('brain') : []}
      />
      <DragGhost at={drag}>
        {drag?.item === 'brain' ? (
          <svg className="egm-ghost" viewBox="-16 -12 32 24" width="56" height="42" aria-hidden="true">
            <ellipse className="egm-brain-bit" cx="0" cy="0" rx="13" ry="9" />
          </svg>
        ) : (
          <svg className="egm-ghost" viewBox="-70 -110 90 120" width="70" height="92" aria-hidden="true">
            <Hook x={0} y={0} />
          </svg>
        )}
      </DragGhost>
    </>
  );
}
