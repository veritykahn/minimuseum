'use client';

/*
 * A small celebration for a right answer in the Victorian rooms: gold stars
 * and holly-red sparks bursting out from the middle of whatever holds it
 * (the holder sets `position: relative`). Pass a new `burst` number to set
 * it off again. Under reduced motion it shows nothing; the green and the
 * words say it instead. Decorative only, so hidden from screen readers.
 */

const SPARKS = 14;

export default function Celebrate({ burst, reduced }: { burst: number; reduced: boolean }) {
  if (!burst || reduced) return null;
  return (
    <span className="vbr-celebrate" key={burst} aria-hidden="true" data-burst={burst}>
      {Array.from({ length: SPARKS }, (_, i) => {
        const a = (i / SPARKS) * Math.PI * 2;
        const d = 70 + ((i * 37) % 50);
        return (
          <span
            key={i}
            className="vbr-spark"
            style={{ '--dx': `${Math.round(Math.cos(a) * d)}px`, '--dy': `${Math.round(Math.sin(a) * d)}px`, animationDelay: `${(i % 3) * 40}ms` } as React.CSSProperties}
          >
            {i % 2 ? '✦' : '★'}
          </span>
        );
      })}
    </span>
  );
}
