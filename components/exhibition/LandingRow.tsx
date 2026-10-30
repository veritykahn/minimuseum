'use client';

import { Children, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';

/*
 * The row of posters and display cases on an exhibition's landing page,
 * sized so the whole landing page fits on one screen (poster-exhibition.css,
 * "Landing page"). On a phone the row is a swipe row instead, each item
 * snapping to the middle with the next peeking in at the edge; under it, a
 * hint that there is more to swipe and a dot for each item, the one in view
 * filled. The hint and the dots are drawn only while the row overflows, so
 * a screen wide enough to show everything shows no hint. A dot is a button
 * that brings its item into view; keyboard users can also simply tab along
 * the row, which scrolls each item in as it takes focus.
 *
 * Used by PosterExhibition and by the three hand-built exhibitions, which
 * pass their own class for the row's look.
 */

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

export default function LandingRow({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const count = items.length;
  // How many are display cases: on a tall screen (an iPad held upright) the
  // posters take one row and the cases the next (poster-exhibition.css).
  const cases = items.filter((c) => isValidElement<{ className?: string }>(c) && /\bpe-landing-case\b/.test(c.props.className ?? '')).length;
  const [active, setActive] = useState(0);
  const [overflows, setOverflows] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const measure = () => {
      setOverflows(row.scrollWidth > row.clientWidth + 2);
      // The item whose middle is nearest the row's middle is the one in view.
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      Array.from(row.children).forEach((el, i) => {
        const item = el as HTMLElement;
        const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - mid);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      setActive(best);
    };
    measure();
    row.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    // Pictures change the row's width as they load.
    const images = Array.from(row.querySelectorAll('img'));
    images.forEach((img) => img.addEventListener('load', measure));
    return () => {
      row.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      images.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [count]);

  const show = (i: number) => {
    const item = ref.current?.children[i] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  };

  const last = active >= count - 1;

  return (
    <>
      <div ref={ref} className={`pe-landing-row ${className}`.trim()} style={{ '--pe-n': count, '--pe-cases': Math.max(cases, 1), '--pe-posters': Math.max(count - cases, 1) } as CssVars}>
        {children}
      </div>
      {overflows && (
        <div className="pe-swipe-hint">
          <span className="pe-swipe-text" aria-hidden="true">
            {last ? (
              <>
                <span className="pe-swipe-arrow is-back">&#8592;</span> Swipe back
              </>
            ) : (
              <>
                Swipe for more <span className="pe-swipe-arrow">&#8594;</span>
              </>
            )}
          </span>
          <span className="pe-swipe-dots">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                className="pe-swipe-dot"
                aria-label={`Show ${i + 1} of ${count}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => show(i)}
              />
            ))}
          </span>
        </div>
      )}
    </>
  );
}
