import type { BandInstrumentId, InstrumentId } from './data';

/*
 * Line drawings of the Jazz Lab's instruments, in the lab's gold. They replace
 * emoji that were wrong for two of them (the bass showed a guitar or a violin,
 * the clarinet a flute) and that drew differently on every platform.
 * Decorative: every use sits beside the instrument's written name.
 */

type IconId = InstrumentId | BandInstrumentId;

const PATHS: Record<IconId, React.ReactNode> = {
  drums: (
    <>
      <path d="M13 5.5 23 17M35 5.5 25 17" strokeWidth={2.4} />
      <ellipse cx="24" cy="21" rx="15" ry="5" />
      <path d="M9 21v12c0 2.8 6.7 5 15 5s15-2.2 15-5V21" />
      <path d="M13 25.5l4 11M21 26.5l2 11.4M27 26.5l-2 11.4M35 25.5l-4 11" strokeWidth={1.2} />
    </>
  ),
  bass: (
    <>
      {/* Scroll, neck and strings */}
      <circle cx="24" cy="4.5" r="2.2" />
      <path d="M24 6.7V17" strokeWidth={2.6} />
      {/* Upper bout, waist, lower bout */}
      <path d="M24 16c-6 0-9 2.6-9 6.4 0 2.3 2.2 3.4 2.2 5.1 0 1.8-4.2 2.9-4.2 7.4 0 5 5 7.6 11 7.6s11-2.6 11-7.6c0-4.5-4.2-5.6-4.2-7.4 0-1.7 2.2-2.8 2.2-5.1 0-3.8-3-6.4-9-6.4z" />
      {/* f-holes, bridge, endpin */}
      <path d="M19 25.5c-1.2 1.5 1.2 3-0 4.5M29 25.5c1.2 1.5-1.2 3 0 4.5" strokeWidth={1.3} />
      <path d="M21 32.5h6M22.5 17v15.5M25.5 17v15.5" strokeWidth={1} />
      <path d="M24 42.5V46.5" strokeWidth={2} />
    </>
  ),
  piano: (
    <>
      <rect x="5" y="13" width="38" height="22" rx="2" />
      <path d="M11.3 13v22M17.6 13v22M23.9 13v22M30.2 13v22M36.5 13v22" strokeWidth={1.2} />
      <path d="M9.6 13h3.4v12H9.6zM15.9 13h3.4v12h-3.4zM28.5 13h3.4v12h-3.4zM34.8 13h3.4v12h-3.4z" fill="currentColor" stroke="none" />
    </>
  ),
  trumpet: (
    <>
      <path d="M4 22h4v4H4z" />
      <path d="M8 24h22" strokeWidth={2.2} />
      <path d="M30 21.5 43 14v20l-13-7.5z" />
      <path d="M15 24v-8M19.5 24v-8M24 24v-8" strokeWidth={2} />
      <path d="M13.3 15.5h3.4M17.8 15.5h3.4M22.3 15.5h3.4" strokeWidth={1.6} />
      <path d="M12 24v5.5a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3V27" />
    </>
  ),
  saxophone: (
    <>
      <path d="M8 8.5 12.5 6 16 8.5" strokeWidth={1.8} />
      <path d="M15.5 7.5c4.2 0 6.8 2.2 7.8 5.8l.7 3.2V34a7 7 0 0 0 14 0V24.5" strokeWidth={3.6} />
      <path d="M34.6 24.5h6.8l3-7.5H31.6z" fill="currentColor" fillOpacity={0.25} />
      <circle cx="24" cy="20" r="1.4" fill="#0A0A0A" stroke="none" />
      <circle cx="24" cy="25" r="1.4" fill="#0A0A0A" stroke="none" />
      <circle cx="24" cy="30" r="1.4" fill="#0A0A0A" stroke="none" />
    </>
  ),
  clarinet: (
    <>
      <path d="M8.5 3.5 12 7" strokeWidth={2} />
      <path d="M12 7 33.5 35.5" strokeWidth={4.2} />
      <path d="M31.5 33.5 33 41l7.5 1.5-1-7.5z" />
      <circle cx="17" cy="15.2" r="1.1" fill="#0A0A0A" stroke="none" />
      <circle cx="20.6" cy="20" r="1.1" fill="#0A0A0A" stroke="none" />
      <circle cx="24.2" cy="24.8" r="1.1" fill="#0A0A0A" stroke="none" />
      <circle cx="27.8" cy="29.6" r="1.1" fill="#0A0A0A" stroke="none" />
    </>
  ),
  horns: (
    <>
      <path d="M18 33V11.5L37 7v21" strokeWidth={2.2} />
      <path d="M18 15.5 37 11" strokeWidth={4} />
      <ellipse cx="14" cy="33.5" rx="4.6" ry="3.4" transform="rotate(-20 14 33.5)" fill="currentColor" stroke="none" />
      <ellipse cx="33" cy="28.5" rx="4.6" ry="3.4" transform="rotate(-20 33 28.5)" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function InstrumentIcon({ id, size = 40 }: { id: IconId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[id]}
    </svg>
  );
}
