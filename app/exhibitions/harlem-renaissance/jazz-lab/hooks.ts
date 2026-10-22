'use client';

import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  type InstrumentId,
  INSTRUMENTS,
  INSTRUMENT_MAP,
  QUIZ_AUDIO_POOL,
  TOTAL_QUIZ_ROUNDS,
  SCORE_RATINGS,
  type BandInstrumentId,
  BAND_INSTRUMENTS,
  BAND_INSTRUMENT_MAP,
  SECTIONS,
  getBandAudioSrc,
} from './data';

// ─── useAudioEngine ─────────────────────────────────────────────────────────

type ActiveSource = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

/**
 * One Web Audio context for the Jazz Lab's band and quiz, with sounds keyed by
 * id ('bass', 'quiz'…). Starting a sound is asynchronous (the file may still
 * be loading), so every start takes a ticket for its id. Anything that stops
 * that id — or stopAll — tears the ticket up, and a start whose ticket is no
 * longer current when its buffer arrives never makes a sound. Every node the
 * engine starts is also kept in one set, so stopAll silences all of them even
 * if a bookkeeping slip ever lost one from the map.
 */
export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const loadingRef = useRef<Map<string, Promise<AudioBuffer>>>(new Map());
  const activeSourcesRef = useRef<Map<string, ActiveSource>>(new Map());
  /** Every node started and not yet torn down, whatever its id. */
  const allSourcesRef = useRef<Set<ActiveSource>>(new Set());
  /** The current start ticket for each id; a missing or newer one cancels. */
  const ticketsRef = useRef<Map<string, number>>(new Map());
  const ticketCounterRef = useRef(0);
  /** The volume each id should play at, kept even while it is still loading. */
  const volumesRef = useRef<Map<string, number>>(new Map());
  const aliveRef = useRef(true);
  /** Goes up on every stopAll, so a delayed start can tell it was overtaken. */
  const stopEpochRef = useRef(0);
  const stopListenersRef = useRef<Set<() => void>>(new Set());

  const ensureContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const loadAudio = useCallback((src: string): Promise<AudioBuffer> => {
    const cached = bufferCacheRef.current.get(src);
    if (cached) return Promise.resolve(cached);
    const pending = loadingRef.current.get(src);
    if (pending) return pending;

    const ctx = ensureContext();
    const p = (async () => {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      bufferCacheRef.current.set(src, audioBuffer);
      return audioBuffer;
    })();
    loadingRef.current.set(src, p);
    p.then(
      () => loadingRef.current.delete(src),
      () => loadingRef.current.delete(src),
    );
    return p;
  }, [ensureContext]);

  const kill = useCallback((entry: ActiveSource) => {
    try { entry.source.stop(); } catch { /* already stopped */ }
    try { entry.source.disconnect(); } catch { /* noop */ }
    try { entry.gain.disconnect(); } catch { /* noop */ }
    allSourcesRef.current.delete(entry);
  }, []);

  /** Stops the sound playing under this id and cancels any start still loading. */
  const stopSource = useCallback((id: string) => {
    ticketsRef.current.delete(id);
    const entry = activeSourcesRef.current.get(id);
    if (entry) {
      activeSourcesRef.current.delete(id);
      kill(entry);
    }
  }, [kill]);

  const stopAll = useCallback(() => {
    stopEpochRef.current++;
    ticketsRef.current.clear();
    activeSourcesRef.current.clear();
    allSourcesRef.current.forEach(kill);
    allSourcesRef.current.clear();
  }, [kill]);

  /**
   * Shared by playLoop and playOnce. Resolves once the sound has started, or
   * once it has been cancelled by a newer start or a stop.
   */
  const start = useCallback(async (id: string, src: string, volume: number, loop: boolean, fadeIn: boolean) => {
    stopSource(id);
    const ticket = ++ticketCounterRef.current;
    ticketsRef.current.set(id, ticket);
    volumesRef.current.set(id, volume);
    const current = () => aliveRef.current && ticketsRef.current.get(id) === ticket;

    ensureContext();
    let buffer: AudioBuffer;
    try {
      buffer = await loadAudio(src);
    } catch (err) {
      if (current()) ticketsRef.current.delete(id);
      throw err;
    }
    // Stopped, superseded, or unmounted while the file was loading.
    if (!current()) return;

    const ctx = ensureContext();
    const level = volumesRef.current.get(id) ?? volume;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;

    const gainNode = ctx.createGain();
    if (fadeIn) {
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(level, ctx.currentTime + 0.1);
    } else {
      gainNode.gain.value = level;
    }

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    const entry: ActiveSource = { source, gain: gainNode };
    source.onended = () => {
      // Only forget this id if it still points at this node: a stopped node's
      // "ended" arrives after its replacement has taken the id.
      if (activeSourcesRef.current.get(id) === entry) {
        activeSourcesRef.current.delete(id);
        ticketsRef.current.delete(id);
      }
      allSourcesRef.current.delete(entry);
    };
    activeSourcesRef.current.set(id, entry);
    allSourcesRef.current.add(entry);
    source.start(0);
  }, [ensureContext, loadAudio, stopSource]);

  const playLoop = useCallback((id: string, src: string, volume: number = 0.5) => start(id, src, volume, true, true), [start]);

  const playOnce = useCallback((id: string, src: string, volume: number = 0.8) => start(id, src, volume, false, false), [start]);

  const setVolume = useCallback((id: string, volume: number) => {
    volumesRef.current.set(id, volume);
    const entry = activeSourcesRef.current.get(id);
    if (entry && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      entry.gain.gain.cancelScheduledValues(now);
      entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
      entry.gain.gain.linearRampToValueAtTime(volume, now + 0.2);
    }
  }, []);

  /**
   * A short fade, then stop. The id is released at once, so the instrument can
   * come straight back on without the old fade's timer cutting it off.
   */
  const fadeOutAndStop = useCallback((id: string) => {
    ticketsRef.current.delete(id);
    const entry = activeSourcesRef.current.get(id);
    if (!entry) return;
    activeSourcesRef.current.delete(id);
    const ctx = audioCtxRef.current;
    if (!ctx) { kill(entry); return; }
    const now = ctx.currentTime;
    entry.gain.gain.cancelScheduledValues(now);
    entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
    entry.gain.gain.linearRampToValueAtTime(0, now + 0.1);
    setTimeout(() => kill(entry), 150);
  }, [kill]);

  /** True while the id is playing or still loading to play. */
  const isPlaying = useCallback((id: string): boolean => {
    return activeSourcesRef.current.has(id) || ticketsRef.current.has(id);
  }, []);

  /** How many times stopAll has run; compare two readings to see if one happened between. */
  const stopEpoch = useCallback(() => stopEpochRef.current, []);

  /** Called whenever the engine silences everything on its own (leaving the page). */
  const onSilenced = useCallback((fn: () => void) => {
    stopListenersRef.current.add(fn);
    return () => { stopListenersRef.current.delete(fn); };
  }, []);

  // Leaving the page (closing the tab, or going into the back-forward cache)
  // stops every sound, and says so, so the band's stage empties too.
  useEffect(() => {
    const onPageHide = () => {
      stopAll();
      stopListenersRef.current.forEach((fn) => fn());
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [stopAll]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopAll();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [stopAll]);

  // One stable object, so hooks that take the engine as a dependency don't
  // re-run on every render.
  return useMemo(
    () => ({ ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, fadeOutAndStop, stopAll, isPlaying, onSilenced, stopEpoch }),
    [ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, fadeOutAndStop, stopAll, isPlaying, onSilenced, stopEpoch],
  );
}

// ─── useBandBuilder ─────────────────────────────────────────────────────────

type AudioEngine = ReturnType<typeof useAudioEngine>;

export function useBandBuilder(audio: AudioEngine) {
  const [active, setActive] = useState<Set<BandInstrumentId>>(new Set());
  const [section, setSection] = useState(3); // Piano Solo — all 6 instruments available
  const [spotlight, setSpotlight] = useState<BandInstrumentId | null>(null);

  // Preload audio for the current section
  useEffect(() => {
    BAND_INSTRUMENTS.forEach(inst => {
      if (inst.sections.includes(section)) {
        audio.loadAudio(getBandAudioSrc(inst.id, section)).catch(() => {});
      }
    });
  }, [section, audio]);

  // If the engine silences everything itself (the page is going away), the
  // stage empties with it rather than showing players who make no sound.
  useEffect(() => audio.onSilenced(() => {
    setActive(new Set());
    setSpotlight(null);
  }), [audio]);

  const tapInstrument = useCallback((id: BandInstrumentId) => {
    const inst = BAND_INSTRUMENT_MAP[id];
    if (!inst.sections.includes(section)) return;

    if (!active.has(id)) {
      // Not active → activate + spotlight
      const src = getBandAudioSrc(id, section);
      audio.playLoop(id, src, 1.0);
      // Duck all currently active instruments
      active.forEach(otherId => audio.setVolume(otherId, 0.4));
      const next = new Set(active);
      next.add(id);
      setActive(next);
      setSpotlight(id);
    } else if (spotlight === id) {
      // Currently spotlighted → un-solo but keep playing
      setSpotlight(null);
      active.forEach(otherId => audio.setVolume(otherId, 0.7));
    } else {
      // Active but not spotlight → remove from stage
      audio.fadeOutAndStop(id);
      const next = new Set(active);
      next.delete(id);
      setActive(next);
      if (spotlight) {
        // Keep spotlight volumes intact
        next.forEach(otherId => audio.setVolume(otherId, otherId === spotlight ? 1.0 : 0.4));
      } else {
        next.forEach(otherId => audio.setVolume(otherId, 0.7));
      }
    }
  }, [active, section, spotlight, audio]);

  const changeSection = useCallback((newSection: number) => {
    setSection(newSection);

    // Determine which active instruments are still available
    const stillActive = new Set<BandInstrumentId>();
    active.forEach(id => {
      const inst = BAND_INSTRUMENT_MAP[id];
      if (inst.sections.includes(newSection)) {
        stillActive.add(id);
      } else {
        audio.fadeOutAndStop(id);
      }
    });

    // Update spotlight
    const newSpotlight = spotlight && stillActive.has(spotlight) ? spotlight : null;

    // Restart all remaining instruments with new section audio (synchronized)
    stillActive.forEach(id => {
      const vol = newSpotlight ? (id === newSpotlight ? 1.0 : 0.4) : 0.7;
      audio.playLoop(id, getBandAudioSrc(id, newSection), vol);
    });

    setActive(stillActive);
    setSpotlight(newSpotlight);
  }, [active, spotlight, audio]);

  const surpriseMe = useCallback(() => {
    audio.stopAll();

    // Pick a random section
    const randomSection = SECTIONS[Math.floor(Math.random() * SECTIONS.length)].number;

    // Get available instruments for this section
    const available = BAND_INSTRUMENTS.filter(i => i.sections.includes(randomSection));

    // Pick 3-4 random instruments
    const count = 3 + Math.floor(Math.random() * 2);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(count, available.length));

    const newActive = new Set<BandInstrumentId>();
    chosen.forEach(inst => {
      newActive.add(inst.id);
      audio.playLoop(inst.id, getBandAudioSrc(inst.id, randomSection), 0.7);
    });

    setSection(randomSection);
    setActive(newActive);
    setSpotlight(null);
  }, [audio]);

  const stopAll = useCallback(() => {
    audio.stopAll();
    setActive(new Set());
    setSpotlight(null);
  }, [audio]);

  return {
    active,
    section,
    spotlight,
    tapInstrument,
    changeSection,
    surpriseMe,
    stopAll,
  };
}

// ─── useQuiz ────────────────────────────────────────────────────────────────

type QuizState = 'idle' | 'playing' | 'answered' | 'gameover';

type QuizRound = {
  audioSrc: string;
  correctAnswer: InstrumentId;
};

function generateRounds(): QuizRound[] {
  // Group samples by instrument, then pick 2 random samples from each
  // This gives 12 rounds with a different subset every playthrough
  const byInstrument = new Map<InstrumentId, typeof QUIZ_AUDIO_POOL>();
  for (const item of QUIZ_AUDIO_POOL) {
    const arr = byInstrument.get(item.instrument) || [];
    arr.push(item);
    byInstrument.set(item.instrument, arr);
  }

  const picked: typeof QUIZ_AUDIO_POOL = [];
  for (const samples of byInstrument.values()) {
    const shuffled = [...samples].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, 2));
  }

  // Shuffle the picked items, ensuring no two consecutive share the same instrument
  for (let attempt = 0; attempt < 100; attempt++) {
    picked.sort(() => Math.random() - 0.5);
    let valid = true;
    for (let i = 1; i < picked.length; i++) {
      if (picked[i].instrument === picked[i - 1].instrument) {
        valid = false;
        break;
      }
    }
    if (valid) break;
  }

  return picked.map(item => ({
    audioSrc: item.src,
    correctAnswer: item.instrument,
  }));
}

export function useQuiz(audio: AudioEngine) {
  const [gameState, setGameState] = useState<QuizState>('idle');
  const [rounds, setRounds] = useState<QuizRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{ chosen: InstrumentId; correct: boolean; correctAnswer: InstrumentId } | null>(null);
  const [isQuizPlaying, setIsQuizPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    audio.stopAll();
    const newRounds = generateRounds();
    setRounds(newRounds);
    setCurrentRound(0);
    setScore(0);
    setTotalAnswered(0);
    setLastAnswer(null);
    setGameState('playing');
    setIsQuizPlaying(true);
    audio.playOnce('quiz', newRounds[0].audioSrc).catch(() => setIsQuizPlaying(false));
  }, [audio]);

  const replaySound = useCallback(() => {
    if (rounds[currentRound]) {
      setIsQuizPlaying(true);
      audio.playOnce('quiz', rounds[currentRound].audioSrc).catch(() => setIsQuizPlaying(false));
    }
  }, [audio, rounds, currentRound]);

  const submitAnswer = useCallback((answer: InstrumentId) => {
    if (gameState !== 'playing') return;

    const correct = answer === rounds[currentRound].correctAnswer;
    if (correct) setScore(prev => prev + 1);
    setTotalAnswered(prev => prev + 1);
    setLastAnswer({ chosen: answer, correct, correctAnswer: rounds[currentRound].correctAnswer });
    setGameState('answered');
    setIsQuizPlaying(false);
    audio.stopSource('quiz');
    // A tab change or Stop inside the pause (anything that ran stopAll) means
    // the visitor has moved on: the next round still comes up, but silently.
    const epoch = audio.stopEpoch();

    timeoutRef.current = setTimeout(() => {
      if (currentRound + 1 >= TOTAL_QUIZ_ROUNDS) {
        setGameState('gameover');
      } else {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setLastAnswer(null);
        setGameState('playing');
        if (audio.stopEpoch() !== epoch) {
          setIsQuizPlaying(false);
          return;
        }
        setIsQuizPlaying(true);
        audio.playOnce('quiz', rounds[nextRound].audioSrc).catch(() => setIsQuizPlaying(false));
      }
    }, 1500);
  }, [gameState, rounds, currentRound, audio]);

  const getRating = useCallback(() => {
    return SCORE_RATINGS.find(r => score >= r.min) || SCORE_RATINGS[SCORE_RATINGS.length - 1];
  }, [score]);

  useEffect(() => audio.onSilenced(() => setIsQuizPlaying(false)), [audio]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    gameState,
    currentRound,
    totalRounds: TOTAL_QUIZ_ROUNDS,
    score,
    totalAnswered,
    lastAnswer,
    currentQuestion: rounds[currentRound] || null,
    isQuizPlaying,
    startGame,
    replaySound,
    submitAnswer,
    getRating,
  };
}
