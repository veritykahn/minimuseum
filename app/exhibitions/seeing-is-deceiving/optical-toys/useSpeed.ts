'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { allowedStep, CLIMB_RATE, flickerFreeStep, SPEED_STEPS, speedAt, type ToyId } from './spin';

/*
 * A toy's speed: a step on the smooth control (spin.ts), set by hand, or
 * climbing by itself from the slowest step after "Twirl" or "Spin". The
 * climb, or a hand, stops at the flicker-free step until the visitor says
 * the toy may flicker (asked once, for both toys, for this visit).
 */

let flickerOk = false;
const listeners = new Set<() => void>();
function readFlicker() {
  return flickerOk;
}
function subscribe(f: () => void) {
  listeners.add(f);
  return () => listeners.delete(f);
}
/** The visitor's yes (or no) to the flicker, kept for this visit only. */
export function setFlickerOk(ok: boolean) {
  flickerOk = ok;
  try {
    if (ok) sessionStorage.setItem('sid-flicker-ok', '1');
    else sessionStorage.removeItem('sid-flicker-ok');
  } catch {
    /* no storage: the yes lasts while the page is open */
  }
  listeners.forEach((f) => f());
}
function loadFlicker() {
  try {
    if (sessionStorage.getItem('sid-flicker-ok') === '1' && !flickerOk) {
      flickerOk = true;
      listeners.forEach((f) => f());
    }
  } catch {
    /* nothing kept */
  }
}

export function useFlickerOk() {
  useEffect(loadFlicker, []);
  return useSyncExternalStore(subscribe, readFlicker, () => false);
}

export function useSpeed(toy: ToyId, onSpeed: (rps: number, step: number) => void) {
  const ok = useFlickerOk();
  const [step, setStepState] = useState(0);
  const [climbing, setClimbing] = useState(false);
  /** True while the visitor is held at the flicker-free step, and asked. */
  const [asking, setAsking] = useState(false);
  const report = useRef(onSpeed);
  useEffect(() => {
    report.current = onSpeed;
  }, [onSpeed]);
  const stepRef = useRef(0);
  const okRef = useRef(ok);
  useEffect(() => {
    okRef.current = ok;
  }, [ok]);

  const set = useCallback(
    (v: number) => {
      const want = Math.max(0, Math.min(SPEED_STEPS, v));
      const to = allowedStep(toy, want, okRef.current);
      if (to < Math.round(want)) {
        setAsking(true);
        setClimbing(false);
      }
      if (to === stepRef.current) return;
      stepRef.current = to;
      setStepState(to);
      report.current(speedAt(toy, to), to);
    },
    [toy],
  );

  // Climbing: a step at a time, CLIMB_RATE steps a second, to the top (or the flicker-free step).
  useEffect(() => {
    if (!climbing) return;
    const id = window.setInterval(() => {
      if (stepRef.current >= SPEED_STEPS) {
        setClimbing(false);
        return;
      }
      set(stepRef.current + 1);
    }, 1000 / CLIMB_RATE);
    return () => window.clearInterval(id);
  }, [climbing, set]);

  const start = useCallback(() => {
    setAsking(false);
    set(Math.max(1, stepRef.current));
    setClimbing(true);
  }, [set]);
  const stop = useCallback(() => {
    setClimbing(false);
    setAsking(false);
    set(0);
  }, [set]);
  /** By hand: holds the climb. */
  const setByHand = useCallback(
    (v: number) => {
      setClimbing(false);
      if (v <= flickerFreeStep(toy)) setAsking(false);
      set(v);
    },
    [set, toy],
  );
  const yes = useCallback(() => {
    setFlickerOk(true);
    okRef.current = true;
    setAsking(false);
    setClimbing(true);
  }, []);
  const no = useCallback(() => setAsking(false), []);

  return { step, climbing, asking, flickerOk: ok, start, stop, setByHand, yes, no, gate: flickerFreeStep(toy) };
}
