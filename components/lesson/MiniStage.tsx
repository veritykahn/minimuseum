'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { StepStage } from './StepStage';
import styles from './lesson.module.css';

/**
 * The classroom frame exactly as the projector shows it: laid out at
 * 1920×1080 and scaled down to fit, so the presenter sees the real thing.
 */
export function MiniStage(props: Omit<ComponentProps<typeof StepStage>, 'mini'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1920));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.mini} aria-hidden="true">
      <div className={styles.miniInner} style={{ transform: `scale(${k})` }}>
        <StepStage {...props} mini />
      </div>
    </div>
  );
}
