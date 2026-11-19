'use client';

import { useState } from 'react';
import { DragGhost, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import MummyScene, { VIEWBOX, type BodyLook } from './MummyScene';
import { Picture, Task, Tray, boxIn, type StepKit } from './kit';
import { judgeTool, shelfAt, type ToolId } from './mummyGame';
import type { StepId } from './steps';

/*
 * "What comes next?": the start of most steps. The embalmers' tools stand
 * on a shelf (only those not yet used), and the visitor picks the one the
 * body needs now, by carrying it to the body or tapping it. A wrong pick
 * says why not yet (only from the order of the steps); after two wrong
 * picks the right tool glows. So the order of the seventy days is worked
 * out, not just clicked through, and the step's name stays hidden until
 * the right tool is in hand.
 */

const box = boxIn(VIEWBOX);

/** A small picture of each tool, for the shelf. */
export function ToolIcon({ id }: { id: ToolId }) {
  switch (id) {
    case 'water':
      return (
        <g>
          <path d="M-12 18 C-22 10 -22 -10 -12 -18 L-10 -24 L10 -24 L12 -18 C22 -10 22 10 12 18 Z" fill="#b8693a" stroke="#4a2c12" strokeWidth="2" />
          <path d="M-17 -8 L17 -8" stroke="#1d3f7c" strokeWidth="3" />
        </g>
      );
    case 'hook':
      return (
        <g transform="rotate(-30)">
          <path d="M0 22 L0 -16" stroke="#c99a3d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M0 22 q-6 2 -7 -4" fill="none" stroke="#c99a3d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="-21" r="5" fill="none" stroke="#c99a3d" strokeWidth="3" />
        </g>
      );
    case 'jars':
      return (
        <g>
          {[-15, 0, 15].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -2 : 4})`}>
              <path d="M-6 18 C-10 12 -10 -2 -6 -8 L6 -8 C10 -2 10 12 6 18 Z" fill="#e6dabd" stroke="#2a1a0c" strokeWidth="1.5" />
              <circle cx="0" cy="-12" r="5" fill={['#c98b5a', '#1b1512', '#5f7291'][i]} stroke="#2a1a0c" strokeWidth="1.2" />
            </g>
          ))}
        </g>
      );
    case 'natron':
      return (
        <g>
          <rect x="-22" y="-2" width="40" height="22" rx="9" fill="#f2f0ea" stroke="#bdb6a4" strokeWidth="2" />
          <rect x="-14" y="-18" width="36" height="20" rx="8" fill="#ece8de" stroke="#bdb6a4" strokeWidth="2" />
        </g>
      );
    case 'oil':
      return (
        <g>
          <path d="M-16 -8 C-24 4 -18 22 0 22 C18 22 24 4 16 -8 Z" fill="#c99a3d" stroke="#4a2c12" strokeWidth="2" />
          <ellipse cx="0" cy="-8" rx="16" ry="5" fill="#7a4a12" stroke="#4a2c12" strokeWidth="2" />
          <ellipse cx="0" cy="-8" rx="11" ry="3" fill="#e8b04a" />
        </g>
      );
    case 'linen':
      return (
        <g>
          <rect x="-20" y="-12" width="40" height="24" rx="11" fill="#efe5cc" stroke="#a89a7a" strokeWidth="2" />
          <ellipse cx="-20" cy="0" rx="5" ry="12" fill="#e9dfc6" stroke="#a89a7a" strokeWidth="1.5" />
          <path d="M20 4 C24 12 18 20 10 22" fill="none" stroke="#e9dfc6" strokeWidth="5" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M0 -24 C10 -24 15 -16 15 -6 C15 6 12 16 9 24 L-9 24 C-12 16 -15 6 -15 -6 C-15 -16 -10 -24 0 -24 Z" fill="#e7c46a" stroke="#2a1a0c" strokeWidth="2" />
          <ellipse cx="0" cy="-13" rx="6" ry="7" fill="#f3d98c" stroke="#2a1a0c" strokeWidth="1.2" />
          <path d="M-15 -4 Q0 6 15 -4" fill="none" stroke="#1f4f8f" strokeWidth="3" />
        </g>
      );
  }
}

export default function ToolChoice({ step, kit, base, onChosen }: { step: StepId; kit: StepKit; base: BodyLook; onChosen: () => void }) {
  const shelf = shelfAt(step);
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState('');
  const [glow, setGlow] = useState(false);

  const pick = (tool: ToolId) => {
    const v = judgeTool(step, tool, misses);
    kit.say(v.message);
    if (v.ok) {
      playEgypt('find');
      onChosen();
      return;
    }
    playEgypt('miss');
    setMisses((m) => m + 1);
    setMessage(v.message);
    if (v.showRight) setGlow(true);
  };
  const { drag, carrying, start } = useDragDrop<ToolId>((tool, at) => {
    if (at.target === 'body') pick(tool);
  });
  const right = shelf.find((t) => t.step === step)!;

  return (
    <>
      {/* REVIEW: new text. */}
      <Task>What does the body need next? Choose the embalmers’ next tool from the shelf, and carry it to the body.</Task>
      <Picture label="The body on the embalmers’ bed, waiting for the next step" aspect={`${VIEWBOX.w} / ${VIEWBOX.h}`} carrying={!!carrying} over={<div data-drop="body" className="egm-body-drop egm-body-drop-quiet" style={box(170, 206, 480, 100)} aria-hidden="true" />}>
        <MummyScene look={base} />
      </Picture>
      <Tray
        tools={
          <>
            <div className="egm-shelf" role="group" aria-label="The embalmers’ shelf">
              {shelf.map((t) => (
                <button key={t.id} type="button" className={`egm-thing egm-tool egk-carry ${glow && t.id === right.id ? 'is-hint' : ''}`} onClick={() => pick(t.id)} onPointerDown={(e) => start(t.id, e)}>
                  <svg viewBox="-28 -28 56 56" aria-hidden="true">
                    <ToolIcon id={t.id} />
                  </svg>
                  {t.name}
                </button>
              ))}
            </div>
            <p className="egm-hint">{message}</p>
          </>
        }
        notes={[]}
      />
      <DragGhost at={drag}>
        {drag && (
          <svg className="egm-ghost" viewBox="-28 -28 56 56" width="64" height="64" aria-hidden="true">
            <ToolIcon id={drag.item} />
          </svg>
        )}
      </DragGhost>
    </>
  );
}
