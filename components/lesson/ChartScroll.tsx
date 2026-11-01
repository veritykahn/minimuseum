'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './lesson.module.css';

/*
 * The chart's parchment card. On a phone the table is wider than the card
 * and scrolls sideways inside it (lesson.module.css); then the edge that
 * has more fades out, and a hint under the card says to scroll. Both are
 * drawn only while the table overflows, so a wide screen shows neither, and
 * neither prints.
 */
export function ChartScroll({ label, mini, children }: { label?: string; mini?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const card = ref.current;
    if (!card || mini) return;
    const measure = () => {
      const over = card.scrollWidth > card.clientWidth + 2;
      setOverflows(over);
      setAtStart(card.scrollLeft <= 2);
      setAtEnd(card.scrollLeft + card.clientWidth >= card.scrollWidth - 2);
    };
    measure();
    card.addEventListener('scroll', measure, { passive: true });
    // the stage resizes with the window; pictures widen the table as they load
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    ro?.observe(card);
    if (card.firstElementChild) ro?.observe(card.firstElementChild);
    window.addEventListener('resize', measure);
    return () => {
      card.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [mini]);

  const more = overflows && !mini;

  return (
    <div className={styles.chartWrap} data-more-left={more && !atStart ? '' : undefined} data-more-right={more && !atEnd ? '' : undefined}>
      <div className={styles.chartFrame}>
        <div ref={ref} className={styles.chartCard} tabIndex={mini ? undefined : 0} role={mini ? undefined : 'region'} aria-label={mini ? undefined : label}>
          {children}
        </div>
        {more && <span className={`${styles.chartFade} ${styles.chartFadeLeft}`} aria-hidden="true" />}
        {more && <span className={`${styles.chartFade} ${styles.chartFadeRight}`} aria-hidden="true" />}
      </div>
      {more && (
        <p className={styles.chartHint} aria-hidden="true">
          {atEnd ? (
            <>
              <span className={styles.chartHintArrow}>&#8592;</span> Scroll back
            </>
          ) : (
            <>
              Scroll <span className={styles.chartHintArrow}>&#8594;</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
