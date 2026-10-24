import { memo } from 'react';
import { RECORD } from './film';
import { seeded } from './armisticeSound';

/*
 * The 1918 sound-ranging record, redrawn in SVG: a strip of film with
 * sprocket holes along both edges, a timing line, and six traces (one per
 * microphone) that are jagged with gunfire before the hour and flat after
 * it, with the record's own time marks beneath. Drawn by us from IWM's
 * photograph of the record (Q 47886); it is not the photograph.
 */

export const STRIP = {
  width: 2100,
  height: 340,
  tickX: (i: number) => 140 + i * 260,
  /** Where the gunfire ends and the blank film begins. */
  gapStart: 140 + 3 * 260 + 40,
  /** The splice at the hour. */
  hourX: 1168,
  /** Where the silent traces begin. */
  quietStart: 1180,
  filmTop: 104,
  filmBottom: 262,
} as const;

const TRACE_Y = [146, 164, 182, 200, 218, 236];

function tracePath(k: number): { before: string; after: string } {
  const rand = seeded(100 + k);
  const base = TRACE_Y[k];
  // Lower traces were busier on the record.
  const busy = 0.55 + k * 0.12;
  const pts: string[] = [];
  let burst = 0;
  let phase = 0;
  for (let x = 0; x <= STRIP.gapStart; x += 4) {
    if (rand() < 0.035 * busy) {
      burst = 4 + rand() * 7 * busy;
      phase = 0;
    }
    phase += 1.3 + rand() * 0.6;
    const wobble = (rand() - 0.5) * 1.8;
    const y = base + wobble + Math.sin(phase) * burst;
    burst *= 0.82;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const quiet: string[] = [];
  for (let x = STRIP.quietStart; x <= STRIP.width; x += 12) {
    quiet.push(`${x},${(base + (rand() - 0.5) * 0.7).toFixed(1)}`);
  }
  return { before: `M${pts.join(' L')}`, after: `M${quiet.join(' L')}` };
}

const TRACES = TRACE_Y.map((_, k) => tracePath(k));

function sprockets(y: number) {
  const holes = [];
  for (let x = 8; x < STRIP.width; x += 26) {
    holes.push(<rect key={x} x={x} y={y} width={13} height={11} rx={2.5} />);
  }
  return holes;
}

function timingLine() {
  const marks = [];
  for (let x = 20; x < STRIP.width; x += 52) {
    if (x > STRIP.gapStart && x < STRIP.quietStart) continue;
    marks.push(<line key={x} x1={x} y1={124} x2={x} y2={133} />);
  }
  return marks;
}

function RecordStripSvg({ id }: { id: string }) {
  const { width, height, filmTop, filmBottom, gapStart, hourX, quietStart } = STRIP;
  return (
    <svg
      className="gws-strip-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title`}
      preserveAspectRatio="xMinYMid meet"
    >
      <title id={`${id}-title`}>
        {`A redrawing of the 1918 sound-ranging record, “The End of the War. A Graphic Record.”, Nov. 11, 1918, 11 A.M. On the left, one minute before the hour, all guns firing: six jagged trace lines. After the hour, all guns silent: the six lines run flat.`}
      </title>
      {/* the paper */}
      <rect x={0} y={0} width={width} height={height} fill="var(--gws-paper)" />

      {/* the printed words above the film */}
      <g className="gws-strip-print" fill="var(--gws-print)">
        <text x={hourX} y={26} textAnchor="middle" className="gws-strip-head">{RECORD.heading}</text>
        <text x={hourX} y={50} textAnchor="middle" className="gws-strip-sub">{RECORD.subheading}</text>
        {RECORD.before.map((l, i) => (
          <text key={l} x={STRIP.tickX(1) + 40} y={60 + i * 15} textAnchor="middle" className="gws-strip-note">{l}</text>
        ))}
        {RECORD.date.map((l, i) => (
          <text key={l} x={hourX} y={75 + i * 15} textAnchor="middle" className="gws-strip-note">{l}</text>
        ))}
        {RECORD.after.map((l, i) => (
          <text key={l} x={STRIP.tickX(6) + 40} y={60 + i * 15} textAnchor="middle" className="gws-strip-note">{l}</text>
        ))}
      </g>

      {/* the film */}
      <rect x={0} y={filmTop} width={width} height={filmBottom - filmTop} fill="var(--gws-film)" />
      <rect x={gapStart} y={filmTop + 16} width={quietStart - gapStart} height={filmBottom - filmTop - 32} fill="var(--gws-gap)" />
      <g fill="var(--gws-paper)">
        {sprockets(filmTop + 3)}
        {sprockets(filmBottom - 14)}
      </g>
      <g stroke="var(--gws-trace)" strokeWidth={1.4} opacity={0.85}>
        <line x1={0} y1={128} x2={gapStart} y2={128} />
        <line x1={quietStart} y1={128} x2={width} y2={128} />
        {timingLine()}
      </g>
      <g fill="none" stroke="var(--gws-trace)" strokeWidth={1.6} strokeLinejoin="round">
        {TRACES.map((t, k) => (
          <g key={k}>
            <path d={t.before} />
            <path d={t.after} />
          </g>
        ))}
      </g>
      {/* the splice at the hour */}
      <rect x={hourX - 3} y={filmTop + 16} width={5} height={filmBottom - filmTop - 32} fill="var(--gws-film)" />

      {/* the time marks */}
      <g className="gws-strip-ticks" fill="var(--gws-print)" stroke="var(--gws-print)">
        {RECORD.ticks.map((label, i) => {
          const x = STRIP.tickX(i);
          return (
            <g key={label}>
              <line x1={x} y1={292} x2={x} y2={272} strokeWidth={1.4} />
              <path d={`M${x - 4},${279} L${x},${270} L${x + 4},${279}`} fill="none" strokeWidth={1.4} />
              <text x={x} y={312} textAnchor="middle" stroke="none" className="gws-strip-tick">{label}</text>
            </g>
          );
        })}
        <text x={STRIP.tickX(0) - 6} y={332} stroke="none" className="gws-strip-tick gws-strip-tick-caption">{RECORD.tickCaption}</text>
      </g>
    </svg>
  );
}

export default memo(RecordStripSvg);
