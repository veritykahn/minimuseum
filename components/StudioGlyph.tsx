/**
 * A Studio tool drawn in outline, in its exhibition's color (currentColor):
 * a quill for the declarations, a folded card, a memorial card with its
 * poppy, a record, lines of verse, a thread of moments, a doll, books on a
 * shelf, a board of pinned notes. Chosen by the tool's address. Decorative.
 */

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Quill() {
  return (
    <>
      <path d="M50 8 C34 12 22 26 16 46 L20 48 C28 32 38 20 50 8 Z" />
      <path d="M16 46 L11 56" />
      <path d="M24 36 L34 28" opacity="0.5" />
      <path d="M8 56 H40" opacity="0.5" />
    </>
  );
}

function FoldedCard() {
  return (
    <>
      <path d="M10 14 L30 18 V52 L10 48 Z" />
      <path d="M30 18 L50 14 V48 L30 52" />
      <path d="M20 26 L24 36 H16 Z" opacity="0.7" />
      <path d="M20 36 V40" opacity="0.7" />
      <path d="M36 28 H45 M36 33 H45 M36 38 H42" opacity="0.5" />
    </>
  );
}

function MemorialCard() {
  return (
    <>
      <rect x="14" y="8" width="32" height="44" rx="2" />
      <circle cx="30" cy="22" r="5" />
      <circle cx="30" cy="22" r="1.2" />
      <path d="M30 27 V33" />
      <path d="M20 38 H40 M22 43 H38" opacity="0.5" />
    </>
  );
}

function Record() {
  return (
    <>
      <circle cx="30" cy="30" r="22" />
      <circle cx="30" cy="30" r="15" opacity="0.5" />
      <circle cx="30" cy="30" r="9" opacity="0.5" />
      <circle cx="30" cy="30" r="2" />
    </>
  );
}

function Verse() {
  return (
    <>
      <path d="M10 16 H38 M10 24 H32 M10 32 H40 M10 40 H28" />
      <path d="M48 12 L52 16 L40 44 L35 47 L36 41 Z" opacity="0.8" />
    </>
  );
}

function Thread() {
  return (
    <>
      <path d="M6 32 C14 24 20 40 28 32 C36 24 42 40 54 30" />
      <circle cx="12" cy="28" r="3" />
      <circle cx="28" cy="32" r="3" />
      <circle cx="44" cy="32" r="3" />
      <path d="M12 24 V14 M28 28 V18 M44 28 V12" opacity="0.5" />
    </>
  );
}

function Doll() {
  return (
    <>
      <circle cx="30" cy="14" r="7" />
      <path d="M23 12 C24 4 36 4 37 12" opacity="0.6" />
      <path d="M30 21 L20 46 H40 Z" />
      <path d="M24 28 L14 36 M36 28 L46 36" />
      <path d="M26 46 V54 M34 46 V54" />
    </>
  );
}

function Books() {
  return (
    <>
      <rect x="10" y="14" width="9" height="36" />
      <rect x="21" y="10" width="9" height="40" />
      <path d="M33 16 L41 14 L48 48 L40 50 Z" />
      <path d="M6 52 H54" opacity="0.6" />
    </>
  );
}

function Board() {
  return (
    <>
      <rect x="6" y="10" width="48" height="38" rx="2" />
      <rect x="12" y="16" width="14" height="11" opacity="0.7" />
      <rect x="32" y="15" width="16" height="10" opacity="0.7" />
      <rect x="16" y="32" width="18" height="10" opacity="0.7" />
      <circle cx="19" cy="16" r="1.2" />
      <circle cx="40" cy="15" r="1.2" />
      <circle cx="25" cy="32" r="1.2" />
      <path d="M22 48 L18 56 M38 48 L42 56" opacity="0.5" />
    </>
  );
}

function drawingFor(href: string) {
  if (href.includes('/sign')) return <Quill />;
  if (href.includes('christmas-card')) return <FoldedCard />;
  if (href.includes('/memorial')) return <MemorialCard />;
  if (href.includes('jazz-lab')) return <Record />;
  if (href.includes('harlem-in-words')) return <Verse />;
  if (href.includes('/violet')) return <Thread />;
  if (href.endsWith('#design')) return <Doll />;
  if (href.endsWith('#books')) return <Books />;
  if (href.endsWith('#board')) return <Board />;
  return <Verse />;
}

export default function StudioGlyph({ href }: { href: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" focusable="false">
      <g {...STROKE}>{drawingFor(href)}</g>
    </svg>
  );
}
