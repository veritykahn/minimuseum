'use client';

import { useMemo } from 'react';
import { nibPath, scribbleBlock, scribbleLine, tracePath, type Stroke } from './signing';
import { DECLARATION_BODY, DECLARATION_HEAD, DECLARATION_TITLE, SELF_EVIDENT } from './declaration';
import type { CopyStageId } from './signText';

/*
 * The sheet on the desk, drawn in SVG: each copy of the Declaration in turn
 * (draft, fair copy, engrossed parchment, Stone's engraving, the printed
 * transcription), with the visitor's signature copied onto it. The draft's
 * and the fair copy's lines of handwriting are drawn, not written, except
 * the one line the posters give: "We hold these truths to be self-evident",
 * once "sacred and undeniable". From the Engrossed Copy on, the sheet
 * carries the Declaration's own words (FairText, below).
 */

/** The sheet's drawing space, and the signature box in it. */
export const SHEET = { w: 1000, h: 1250 };
export const SIG_BOX = { x: 150, y: 930, w: 700, h: 210 };

export type SheetStage = CopyStageId;

type Props = {
  stage: SheetStage;
  strokes: Stroke[];
  typed: string;
  address: string;
  printedName: string;
  /** While signing, the live canvas draws the signature over the sheet. */
  live?: boolean;
};

// The legible line sits sixth in the body.
const BODY_TOP = 300;
const LEGIBLE = 5;

const INK = {
  rough: '#3d2b1d',
  fair: '#33241a',
  engrossed: '#2b1d14',
  stone: '#141312',
  transcription: '#2a2724',
};

export default function Sheet({ stage, strokes, typed, address, printedName, live = false }: Props) {
  const body = useMemo(() => {
    const neat = stage === 'rough' ? 0.42 : stage === 'fair' ? 0.18 : 0.08;
    const lines = stage === 'rough' ? 15 : stage === 'fair' ? 17 : 21;
    const gap = (840 - BODY_TOP) / lines;
    const xh = stage === 'rough' ? 11 : stage === 'fair' ? 10 : 8;
    const seed = stage === 'rough' ? 11 : stage === 'fair' ? 23 : 37;
    return { lines: scribbleBlock(seed, 130, BODY_TOP, 740, lines, gap, xh, neat), gap, xh };
  }, [stage]);

  const sigNib = useMemo(() => nibPath(strokes, SIG_BOX.w), [strokes]);
  const sigTrace = useMemo(() => tracePath(strokes, SIG_BOX.w, 0.004, 3), [strokes]);
  const ink = INK[stage];
  const legibleY = BODY_TOP + LEGIBLE * body.gap;
  const hasSig = strokes.length > 0 || typed.trim().length > 0;
  const signedOn = stage === 'engrossed' || stage === 'stone';

  return (
    <svg className={`ap-sheet ap-sheet-${stage}`} viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} role="img" aria-label={sheetLabel(stage, hasSig)}>
      <defs>
        <filter id="ap-mottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.16  0 0 0 0.55 -0.12" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ap-ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" />
        </filter>
        <radialGradient id="ap-edge-burn" cx="50%" cy="48%" r="70%">
          <stop offset="62%" stopColor="#8a5a28" stopOpacity="0" />
          <stop offset="100%" stopColor="#7a4a1e" stopOpacity="0.45" />
        </radialGradient>
        <pattern id="ap-laid" width="1000" height="9" patternUnits="userSpaceOnUse">
          <rect width="1000" height="1" fill="#8b7350" opacity="0.07" />
        </pattern>
        <pattern id="ap-chain" width="64" height="1250" patternUnits="userSpaceOnUse">
          <rect width="1.5" height="1250" fill="#8b7350" opacity="0.09" />
        </pattern>
      </defs>

      {/* The paper */}
      <g className="ap-sheet-paper">
        <rect width={SHEET.w} height={SHEET.h} fill={PAPER[stage]} />
        {(stage === 'rough' || stage === 'fair') && (
          <>
            <rect width={SHEET.w} height={SHEET.h} fill="url(#ap-laid)" />
            <rect width={SHEET.w} height={SHEET.h} fill="url(#ap-chain)" />
          </>
        )}
        {stage !== 'transcription' && <rect width={SHEET.w} height={SHEET.h} fill="#c9a66b" filter="url(#ap-mottle)" opacity={stage === 'engrossed' ? 0.9 : 0.4} />}
        {stage === 'engrossed' && <rect width={SHEET.w} height={SHEET.h} fill="url(#ap-edge-burn)" />}
        {stage === 'stone' && (
          // The plate's mark, pressed into the paper.
          <>
            <rect x="52" y="52" width="896" height="1146" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" />
            <rect x="48" y="48" width="896" height="1146" fill="none" stroke="#6d6458" strokeOpacity="0.45" strokeWidth="2" />
          </>
        )}
      </g>

      {/* The writing, drawn in afresh at each copy */}
      <g key={stage} className="ap-sheet-ink" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        {stage === 'engrossed' || stage === 'stone' || stage === 'transcription' ? (
          <FairText stage={stage} ink={ink} />
        ) : (
          <>
            <Heading stage={stage} />
            {body.lines.map((d, i) =>
              // In the draft, the line above the legible one is left short, for Franklin's word.
              i === LEGIBLE ? null : (stage === 'rough' && i === LEGIBLE - 1) ? (
                <path key={i} d={scribbleLine(11 + i * 101, 130, BODY_TOP + i * body.gap, 300, body.xh, 0.42)} pathLength={1} strokeWidth={2.3} style={{ animationDelay: `${0.25 + i * 0.05}s` }} />
              ) : (
                <path key={i} d={d} pathLength={1} strokeWidth={stage === 'rough' ? 2.3 : 2} style={{ animationDelay: `${0.25 + i * 0.05}s` }} />
              ),
            )}
            {stage === 'rough' && <DraftEdits lines={body.lines.length} gap={body.gap} />}
            <Legible stage={stage} y={legibleY} ink={ink} />
          </>
        )}
      </g>

      {/* The line to sign on, and the signature */}
      {stage !== 'transcription' && (
        <line x1={SIG_BOX.x} x2={SIG_BOX.x + SIG_BOX.w} y1={SIG_BOX.y + 168} y2={SIG_BOX.y + 168} stroke={ink} strokeOpacity={live ? 0.4 : 0.22} strokeWidth="1.2" strokeDasharray={live ? '0' : '2 6'} />
      )}
      {/* While signing, the quill's line is the canvas; a typed name is set here at once. */}
      {(!live || (typed.trim() && !strokes.length)) && signedOn && hasSig && (
        <g key={`sig-${stage}`} className="ap-sheet-sig" transform={`translate(${SIG_BOX.x} ${SIG_BOX.y})`}>
          {typed.trim() && !strokes.length ? (
            <text x="10" y="150" className="ap-sheet-script" fontSize="132" fill={stage === 'stone' ? 'none' : ink} stroke={stage === 'stone' ? ink : 'none'} strokeWidth="1.4">
              {typed}
            </text>
          ) : stage === 'stone' ? (
            // The engraver's line: cut as an outline, traced with a small unsteadiness.
            <>
              <path d={sigTrace} fill="none" stroke={ink} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={sigTrace} fill="none" stroke={PAPER.stone} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <path d={sigNib} fill={ink} stroke={ink} strokeWidth="1.1" filter="url(#ap-ink-bleed)" />
          )}
        </g>
      )}
      {(live || signedOn) && address.trim() && (
        <text x={SIG_BOX.x + SIG_BOX.w} y={SIG_BOX.y + 236} textAnchor="end" className="ap-sheet-script" fontSize="84" fill={stage === 'stone' ? 'none' : ink} stroke={stage === 'stone' ? ink : 'none'} strokeWidth="1.2">
          of {address}
        </text>
      )}
      {stage === 'transcription' && (
        <text x={SIG_BOX.x} y={SIG_BOX.y + 140} className="ap-sheet-type" fontSize="40" fill={INK.transcription}>
          {printedName.trim() || 'Your Name'}
          {address.trim() ? `, of ${address.trim()}` : ''}
        </text>
      )}
    </svg>
  );
}

const PAPER: Record<SheetStage, string> = {
  rough: '#f1e8d2',
  fair: '#f3ead5',
  engrossed: '#ead9b4',
  stone: '#f4f0e6',
  transcription: '#fdfcf9',
};

function sheetLabel(stage: SheetStage, signed: boolean) {
  const name = {
    rough: 'A draft in handwriting, with words crossed out and others written in above',
    fair: 'A neat handwritten copy',
    engrossed: 'A parchment in a formal hand',
    stone: 'An engraved copy, in fine black lines',
    transcription: 'A printed page',
  }[stage];
  return signed && (stage === 'engrossed' || stage === 'stone') ? `${name}, with your signature` : name;
}

/** The heading: small in the draft, large and formal on the parchment. */
function Heading({ stage }: { stage: SheetStage }) {
  const big = stage === 'engrossed' || stage === 'stone';
  const d1 = scribbleLine(stage === 'rough' ? 5 : 9, big ? 160 : 280, big ? 200 : 170, big ? 680 : 440, big ? 30 : 17, stage === 'rough' ? 0.35 : 0.06);
  const d0 = scribbleLine(3, 360, big ? 112 : 110, 280, big ? 12 : 10, 0.1);
  return (
    <>
      <path d={d0} pathLength={1} strokeWidth={stage === 'stone' ? 1.3 : 2} style={{ animationDelay: '0s' }} />
      <path d={d1} pathLength={1} strokeWidth={stage === 'stone' ? 2 : big ? 5.5 : 2.6} style={{ animationDelay: '0.1s' }} />
    </>
  );
}

/** The draft's corrections: words struck through, and a few written in above. */
function DraftEdits({ lines, gap }: { lines: number; gap: number }) {
  const edits = [
    [1, 380, 120],
    [3, 610, 90],
    [8, 210, 150],
    [10, 520, 110],
    [12, 300, 80],
  ];
  return (
    <g className="ap-draft-edits">
      {edits.filter(([l]) => l < lines).map(([l, x, w]) => {
        const y = BODY_TOP + l * gap - 6;
        return (
          <g key={l}>
            <path d={`M${x} ${y + 2}L${x + w} ${y - 3}`} pathLength={1} strokeWidth="2.2" style={{ animationDelay: '0.9s' }} />
            <path d={scribbleLine(l * 13, x + 6, y - 20, w * 0.9, 8, 0.3)} pathLength={1} strokeWidth="1.9" stroke="#7a3b1c" style={{ animationDelay: '1.1s' }} />
          </g>
        );
      })}
    </g>
  );
}

/** The one line the posters give, in each copy's hand. */
function Legible({ stage, y, ink }: { stage: SheetStage; y: number; ink: string }) {
  const outline = stage === 'stone';
  const fill = outline ? 'none' : ink;
  const stroke = outline ? ink : undefined;
  if (stage === 'rough') {
    // The struck words, and Franklin's written in above them: the line above
    // repeats the words before them, unseen, so it begins where they begin.
    return (
      <g className="ap-legible" stroke="none">
        <text x="130" y={y} className="ap-sheet-script" fontSize="50" fill={ink} stroke={ink} strokeWidth="0.6">
          We hold these truths to be <tspan className="ap-struck" textDecoration="line-through">sacred and undeniable</tspan>
        </text>
        <text x="130" y={y - 34} className="ap-sheet-script ap-insert" fontSize="50" fill="#7a3b1c" stroke="#7a3b1c" strokeWidth="0.6">
          <tspan fill="none" stroke="none">We hold these truths to be </tspan>
          self-evident
        </text>
      </g>
    );
  }
  return (
    <text x="130" y={y} className="ap-sheet-script ap-legible" fontSize={stage === 'fair' ? 52 : 48} fill={fill} stroke={stroke ?? fill} strokeWidth={outline ? 0.9 : 0.6}>
      We hold these truths to be self-evident
    </text>
  );
}

/*
 * The Engrossed Copy, Stone's engraving and the transcription carry the
 * Declaration's own words (the National Archives' transcription), as the
 * parchment does: the heading, the title across the sheet, and the whole
 * text run on in a small, close hand above the signatures, as on the
 * parchment, with "We hold these truths to be self-evident" in a darker ink
 * so the eye can find it. The draft and the fair copy keep their drawn,
 * unreadable hand: their words were not yet these.
 */
const BODY_TEXT = DECLARATION_BODY.join(' ');
const [BEFORE, AFTER] = (() => {
  const i = BODY_TEXT.indexOf(SELF_EVIDENT);
  return [BODY_TEXT.slice(0, i), BODY_TEXT.slice(i + SELF_EVIDENT.length)];
})();

function FairText({ stage, ink }: { stage: 'engrossed' | 'stone' | 'transcription'; ink: string }) {
  const typeset = stage === 'transcription';
  return (
    <g className="ap-fair" stroke="none">
      <text x="500" y="128" textAnchor="middle" className={typeset ? 'ap-sheet-type' : 'ap-sheet-fell'} fontSize={typeset ? 26 : 24} fill={ink} fillOpacity={0.85}>
        {DECLARATION_HEAD}.
      </text>
      <text
        x="500"
        y={typeset ? 200 : 214}
        textAnchor="middle"
        className={typeset ? 'ap-sheet-type' : 'ap-sheet-script'}
        fontSize={typeset ? 30 : 74}
        textLength={typeset ? 760 : 820}
        lengthAdjust="spacingAndGlyphs"
        fill={stage === 'stone' ? 'none' : ink}
        stroke={stage === 'stone' ? ink : 'none'}
        strokeWidth={stage === 'stone' ? 1.2 : 0}
      >
        {DECLARATION_TITLE}
      </text>
      <foreignObject x="96" y={typeset ? 236 : 248} width="808" height={typeset ? 660 : 640}>
        <div className={`ap-fair-body ap-fair-${stage}`} style={{ color: ink }}>
          {BEFORE}
          <span className="ap-fair-self">{SELF_EVIDENT}</span>
          {AFTER}
        </div>
      </foreignObject>
    </g>
  );
}
