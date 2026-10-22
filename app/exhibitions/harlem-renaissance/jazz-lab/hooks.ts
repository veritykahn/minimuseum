'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { shuffle } from '@/components/games/scoring';
import {
  type InstrumentId,
  QUIZ_AUDIO_POOL,
  type QuizAudioItem,
  TOTAL_QUIZ_ROUNDS,
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

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const activeSourcesRef = useRef<Map<string, ActiveSource>>(new Map());

  const ensureContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const loadAudio = useCallback(async (src: string): Promise<AudioBuffer> => {
    const cached = bufferCacheRef.current.get(src);
    if (cached) return cached;

    const ctx = ensureContext();
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCacheRef.current.set(src, audioBuffer);
    return audioBuffer;
  }, [ensureContext]);

  const stopSource = useCallback((id: string) => {
    const entry = activeSourcesRef.current.get(id);
    if (entry) {
      try { entry.source.stop(); } catch { /* already stopped */ }
      entry.source.disconnect();
      entry.gain.disconnect();
      activeSourcesRef.current.delete(id);
    }
  }, []);

  const stopAll = useCallback(() => {
    activeSourcesRef.current.forEach((_, id) => stopSource(id));
  }, [stopSource]);

  const playLoop = useCallback(async (id: string, src: string, volume: number = 0.5) => {
    stopSource(id);
    const ctx = ensureContext();
    const buffer = await loadAudio(src);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);

    activeSourcesRef.current.set(id, { source, gain: gainNode });
  }, [ensureContext, loadAudio, stopSource]);

  const playOnce = useCallback(async (id: string, src: string, volume: number = 0.8) => {
    stopSource(id);
    const ctx = ensureContext();
    const buffer = await loadAudio(src);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);

    source.onended = () => {
      activeSourcesRef.current.delete(id);
    };

    activeSourcesRef.current.set(id, { source, gain: gainNode });
  }, [ensureContext, loadAudio, stopSource]);

  const setVolume = useCallback((id: string, volume: number) => {
    const entry = activeSourcesRef.current.get(id);
    if (entry && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      entry.gain.gain.cancelScheduledValues(now);
      entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
      entry.gain.gain.linearRampToValueAtTime(volume, now + 0.2);
    }
  }, []);

  const fadeOutAndStop = useCallback((id: string) => {
    const entry = activeSourcesRef.current.get(id);
    if (entry && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      entry.gain.gain.cancelScheduledValues(now);
      entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
      entry.gain.gain.linearRampToValueAtTime(0, now + 0.1);
      setTimeout(() => {
        try { entry.source.stop(); } catch { /* already stopped */ }
        entry.source.disconnect();
        entry.gain.disconnect();
        activeSourcesRef.current.delete(id);
      }, 150);
    }
  }, []);

  const isPlaying = useCallback((id: string): boolean => {
    return activeSourcesRef.current.has(id);
  }, []);

  useEffect(() => {
    return () => {
      activeSourcesRef.current.forEach((entry) => {
        try { entry.source.stop(); } catch { /* noop */ }
        entry.source.disconnect();
        entry.gain.disconnect();
      });
      activeSourcesRef.current.clear();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  return { ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, fadeOutAndStop, stopAll, isPlaying };
}

// ─── useBandBuilder ─────────────────────────────────────────────────────────

type AudioEngine = ReturnType<typeof useAudioEngine>;

/** Loudness of each player: the soloist up front, the rest backing, or all even. */
export function bandVolume(id: BandInstrumentId, spotlight: BandInstrumentId | null): number {
  if (!spotlight) return 0.7;
  return id === spotlight ? 1.0 : 0.4;
}

/**
 * Build a Band. Tapping an instrument always does one thing — gives it the
 * spotlight — bringing it on stage first if it isn't playing. Tapping the
 * soloist again hands the music back to the whole band. Players leave the
 * stage only through their own remove control. `lastTouched` drives the fact
 * card, so it shows whatever the visitor last tapped, solo or not.
 */
export function useBandBuilder(audio: AudioEngine) {
  const [active, setActive] = useState<Set<BandInstrumentId>>(new Set());
  const [section, setSection] = useState(3); // Piano Solo — all 6 instruments available
  const [spotlight, setSpotlight] = useState<BandInstrumentId | null>(null);
  const [lastTouched, setLastTouched] = useState<BandInstrumentId | null>(null);

  // Preload audio for the current section
  useEffect(() => {
    BAND_INSTRUMENTS.forEach(inst => {
      if (inst.sections.includes(section)) {
        audio.loadAudio(getBandAudioSrc(inst.id, section));
      }
    });
  }, [section, audio]);

  const applyVolumes = useCallback((players: Set<BandInstrumentId>, spot: BandInstrumentId | null) => {
    players.forEach(id => audio.setVolume(id, bandVolume(id, spot)));
  }, [audio]);

  const tapInstrument = useCallback((id: BandInstrumentId) => {
    const inst = BAND_INSTRUMENT_MAP[id];
    if (!inst.sections.includes(section)) return;
    setLastTouched(id);

    if (!active.has(id)) {
      // Not playing → bring it on stage, in the spotlight.
      audio.playLoop(id, getBandAudioSrc(id, section), bandVolume(id, id));
      applyVolumes(active, id);
      const next = new Set(active);
      next.add(id);
      setActive(next);
      setSpotlight(id);
    } else if (spotlight === id) {
      // The soloist again → the whole band plays evenly.
      setSpotlight(null);
      applyVolumes(active, null);
    } else {
      // Another player → it takes the spotlight.
      setSpotlight(id);
      applyVolumes(active, id);
    }
  }, [active, section, spotlight, audio, applyVolumes]);

  const removeInstrument = useCallback((id: BandInstrumentId) => {
    if (!active.has(id)) return;
    audio.fadeOutAndStop(id);
    const next = new Set(active);
    next.delete(id);
    const nextSpot = spotlight === id ? null : spotlight;
    applyVolumes(next, nextSpot);
    setActive(next);
    setSpotlight(nextSpot);
  }, [active, spotlight, audio, applyVolumes]);

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
      audio.playLoop(id, getBandAudioSrc(id, newSection), bandVolume(id, newSpotlight));
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
    const chosen = shuffle(available).slice(0, Math.min(count, available.length));

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
    lastTouched,
    tapInstrument,
    removeInstrument,
    changeSection,
    surpriseMe,
    stopAll,
  };
}

// ─── useQuiz ────────────────────────────────────────────────────────────────

type QuizState = 'idle' | 'playing' | 'answered' | 'gameover';

export type QuizRound = {
  id: string;
  audioSrc: string;
  correctAnswer: InstrumentId;
};

export type QuizRecord = {
  round: QuizRound;
  chosen: InstrumentId;
  correct: boolean;
};

/**
 * Twelve rounds: two different clips of each instrument, in an order where
 * the same instrument never plays twice running. Pass a seeded rng to test.
 */
export function generateRounds(rng: () => number = Math.random, pool: readonly QuizAudioItem[] = QUIZ_AUDIO_POOL): QuizRound[] {
  const byInstrument = new Map<InstrumentId, QuizAudioItem[]>();
  for (const item of pool) {
    const arr = byInstrument.get(item.instrument) || [];
    arr.push(item);
    byInstrument.set(item.instrument, arr);
  }

  const picked: QuizAudioItem[] = [];
  for (const samples of byInstrument.values()) {
    picked.push(...shuffle(samples, rng).slice(0, 2));
  }

  return noRepeats(picked, rng).map(item => ({
    id: item.src,
    audioSrc: item.src,
    correctAnswer: item.instrument,
  }));
}

/** Shuffles until no two neighbors share an instrument (or gives the last try). */
function noRepeats(items: QuizAudioItem[], rng: () => number): QuizAudioItem[] {
  let order = shuffle(items, rng);
  for (let attempt = 0; attempt < 200; attempt++) {
    if (order.every((it, i) => i === 0 || it.instrument !== order[i - 1].instrument)) return order;
    order = shuffle(items, rng);
  }
  return order;
}

/** The rounds a player missed, reshuffled for "Replay the ones you missed". */
export function missedRounds(records: readonly QuizRecord[], rng: () => number = Math.random): QuizRound[] {
  return shuffle(records.filter(r => !r.correct).map(r => r.round), rng);
}

/** Per-instrument tally for the ending, in the order the answer buttons use. */
export function instrumentBreakdown(records: readonly QuizRecord[], order: readonly InstrumentId[]) {
  return order
    .map(id => {
      const mine = records.filter(r => r.round.correctAnswer === id);
      return { id, correct: mine.filter(r => r.correct).length, total: mine.length };
    })
    .filter(row => row.total > 0);
}

export function useQuiz(audio: AudioEngine) {
  const [gameState, setGameState] = useState<QuizState>('idle');
  const [rounds, setRounds] = useState<QuizRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [records, setRecords] = useState<QuizRecord[]>([]);
  /** 'replay' while replaying only the rounds missed in the last full game. */
  const [mode, setMode] = useState<'full' | 'replay'>('full');
  const [isQuizPlaying, setIsQuizPlaying] = useState(false);
  const lastFullRecords = useRef<QuizRecord[]>([]);

  const playRound = useCallback((round: QuizRound) => {
    setIsQuizPlaying(true);
    audio.playOnce('quiz', round.audioSrc);
  }, [audio]);

  const begin = useCallback((newRounds: QuizRound[], newMode: 'full' | 'replay') => {
    audio.stopAll();
    setRounds(newRounds);
    setCurrentRound(0);
    setRecords([]);
    setMode(newMode);
    setGameState('playing');
    playRound(newRounds[0]);
  }, [audio, playRound]);

  const startGame = useCallback(() => begin(generateRounds(), 'full'), [begin]);

  const replayMissed = useCallback(() => {
    const again = missedRounds(lastFullRecords.current);
    if (again.length > 0) begin(again, 'replay');
  }, [begin]);

  const replaySound = useCallback(() => {
    if (rounds[currentRound]) playRound(rounds[currentRound]);
  }, [rounds, currentRound, playRound]);

  const submitAnswer = useCallback((answer: InstrumentId) => {
    if (gameState !== 'playing') return;
    const round = rounds[currentRound];
    const next = [...records, { round, chosen: answer, correct: answer === round.correctAnswer }];
    setRecords(next);
    if (mode === 'full' && currentRound + 1 >= rounds.length) lastFullRecords.current = next;
    setGameState('answered');
    setIsQuizPlaying(false);
    audio.stopSource('quiz');
  }, [gameState, rounds, currentRound, records, mode, audio]);

  // The player decides when to move on: no timer races the feedback.
  const nextRound = useCallback(() => {
    if (gameState !== 'answered') return;
    if (currentRound + 1 >= rounds.length) {
      setGameState('gameover');
      return;
    }
    const n = currentRound + 1;
    setCurrentRound(n);
    setGameState('playing');
    playRound(rounds[n]);
  }, [gameState, currentRound, rounds, playRound]);

  const score = records.filter(r => r.correct).length;
  const lastRecord = gameState === 'answered' ? records[records.length - 1] ?? null : null;

  return {
    gameState,
    mode,
    currentRound,
    totalRounds: rounds.length || TOTAL_QUIZ_ROUNDS,
    score,
    records,
    lastRecord,
    currentQuestion: rounds[currentRound] || null,
    isQuizPlaying,
    startGame,
    replayMissed,
    replaySound,
    submitAnswer,
    nextRound,
  };
}
