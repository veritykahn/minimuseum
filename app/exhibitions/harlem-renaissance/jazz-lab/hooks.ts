'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import {
  type InstrumentId,
  INSTRUMENTS,
  INSTRUMENT_MAP,
  QUIZ_AUDIO_POOL,
  TOTAL_QUIZ_ROUNDS,
  SCORE_RATINGS,
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
    gainNode.gain.value = volume;

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
      entry.gain.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1);
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

  return { ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, stopAll, isPlaying };
}

// ─── useBandBuilder ─────────────────────────────────────────────────────────

type AudioEngine = ReturnType<typeof useAudioEngine>;

export function useBandBuilder(audio: AudioEngine) {
  const [playing, setPlaying] = useState<Map<InstrumentId, number>>(new Map());
  const [spotlight, setSpotlight] = useState<InstrumentId | null>(null);

  const addInstrument = useCallback((id: InstrumentId, variantIndex: number = 0) => {
    const instrument = INSTRUMENT_MAP[id];
    const variant = instrument.variants[variantIndex];
    audio.playLoop(id, variant.audioSrc, 0.5);
    setPlaying(prev => new Map(prev).set(id, variantIndex));
  }, [audio]);

  const removeInstrument = useCallback((id: InstrumentId) => {
    audio.stopSource(id);
    setPlaying(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setSpotlight(prev => prev === id ? null : prev);
  }, [audio]);

  const setSpotlightInstrument = useCallback((id: InstrumentId | null, currentPlaying: Map<InstrumentId, number>) => {
    setSpotlight(id);
    if (id) {
      audio.setVolume(id, 0.8);
      currentPlaying.forEach((_, instId) => {
        if (instId !== id) audio.setVolume(instId, 0.15);
      });
    } else {
      currentPlaying.forEach((_, instId) => {
        audio.setVolume(instId, 0.5);
      });
    }
  }, [audio]);

  const tapInstrument = useCallback((id: InstrumentId) => {
    if (!playing.has(id)) {
      // Not playing -> add it AND spotlight it
      addInstrument(id, 0);
      // Spotlight the newly added instrument
      setTimeout(() => {
        const newPlaying = new Map(playing).set(id, 0);
        setSpotlightInstrument(id, newPlaying);
      }, 50);
    } else if (spotlight !== id) {
      // Playing but not spotlighted -> move spotlight to it
      setSpotlightInstrument(id, playing);
    } else {
      // Already spotlighted -> remove it
      removeInstrument(id);
      // Restore volumes for remaining instruments
      playing.forEach((_, instId) => {
        if (instId !== id) audio.setVolume(instId, 0.5);
      });
    }
  }, [playing, spotlight, addInstrument, removeInstrument, setSpotlightInstrument, audio]);

  const changeVariant = useCallback((id: InstrumentId, variantIndex: number) => {
    if (!playing.has(id)) return;
    const instrument = INSTRUMENT_MAP[id];
    const variant = instrument.variants[variantIndex];
    const volume = spotlight === id ? 0.8 : spotlight ? 0.15 : 0.5;
    audio.playLoop(id, variant.audioSrc, volume);
    setPlaying(prev => new Map(prev).set(id, variantIndex));
  }, [playing, spotlight, audio]);

  const surpriseMe = useCallback(() => {
    const toAdd = INSTRUMENTS.filter(inst => !playing.has(inst.id));
    // Add 2-4 random instruments
    const shuffled = [...toAdd].sort(() => Math.random() - 0.5);
    const count = Math.min(shuffled.length, 2 + Math.floor(Math.random() * 3));
    for (let i = 0; i < count; i++) {
      const inst = shuffled[i];
      const variantIdx = Math.floor(Math.random() * inst.variants.length);
      addInstrument(inst.id, variantIdx);
    }
    // Clear spotlight so all play equally
    if (spotlight) {
      setSpotlightInstrument(null, playing);
    }
  }, [playing, spotlight, addInstrument, setSpotlightInstrument]);

  const stopAll = useCallback(() => {
    audio.stopAll();
    setPlaying(new Map());
    setSpotlight(null);
  }, [audio]);

  return {
    playing,
    spotlight,
    tapInstrument,
    changeVariant,
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
  const shuffled = [...QUIZ_AUDIO_POOL].sort(() => Math.random() - 0.5);
  return shuffled.map(item => ({
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
    audio.stopAll();
    const newRounds = generateRounds();
    setRounds(newRounds);
    setCurrentRound(0);
    setScore(0);
    setTotalAnswered(0);
    setLastAnswer(null);
    setGameState('playing');
    setIsQuizPlaying(true);
    audio.playOnce('quiz', newRounds[0].audioSrc);
  }, [audio]);

  const replaySound = useCallback(() => {
    if (rounds[currentRound]) {
      setIsQuizPlaying(true);
      audio.playOnce('quiz', rounds[currentRound].audioSrc);
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

    timeoutRef.current = setTimeout(() => {
      if (currentRound + 1 >= TOTAL_QUIZ_ROUNDS) {
        setGameState('gameover');
      } else {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setLastAnswer(null);
        setGameState('playing');
        setIsQuizPlaying(true);
        audio.playOnce('quiz', rounds[nextRound].audioSrc);
      }
    }, 1500);
  }, [gameState, rounds, currentRound, audio]);

  const getRating = useCallback(() => {
    return SCORE_RATINGS.find(r => score >= r.min) || SCORE_RATINGS[SCORE_RATINGS.length - 1];
  }, [score]);

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
