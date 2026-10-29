'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Rung } from './spin';

/*
 * A toy's ladder of speeds (spin.ts): started, it stands on the first rung,
 * holds it, and climbs a rung at a time to the top. Faster and slower step
 * by hand, and stop the climb where the visitor puts it; "Keep climbing"
 * carries on. Stopping lets the toy run down. `rung` is -1 while it is let go.
 */
export function useLadder(ladder: Rung[], onRung: (rps: number, rung: number) => void) {
  const [rung, setRung] = useState(-1);
  const [climbing, setClimbing] = useState(false);
  const report = useRef(onRung);
  useEffect(() => {
    report.current = onRung;
  }, [onRung]);

  const set = useCallback(
    (i: number) => {
      const to = Math.max(-1, Math.min(ladder.length - 1, i));
      setRung(to);
      report.current(to < 0 ? 0 : ladder[to].rps, to);
    },
    [ladder],
  );

  // While climbing, each rung is held for its time, then the next; the top is held.
  useEffect(() => {
    if (!climbing || rung < 0) return;
    const hold = ladder[rung].hold;
    if (!Number.isFinite(hold)) return;
    const id = window.setTimeout(() => set(rung + 1), hold * 1000);
    return () => window.clearTimeout(id);
  }, [climbing, rung, ladder, set]);

  const start = useCallback(() => {
    setClimbing(true);
    set(0);
  }, [set]);
  const stop = useCallback(() => {
    setClimbing(false);
    set(-1);
  }, [set]);
  const faster = useCallback(() => {
    setClimbing(false);
    set(rung + 1);
  }, [rung, set]);
  const slower = useCallback(() => {
    setClimbing(false);
    set(Math.max(0, rung - 1));
  }, [rung, set]);
  const climb = useCallback(() => setClimbing(true), []);

  return { rung, climbing, top: rung === ladder.length - 1, start, stop, faster, slower, climb };
}
