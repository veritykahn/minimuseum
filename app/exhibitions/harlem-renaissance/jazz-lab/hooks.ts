'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
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

export function useBandBuilder(audio: AudioEngine) {
  const [active, setActive] = useState<Set<BandInstrumentId>>(new Set());
  const [section, setSection] = useState(3); // Piano Solo — all 6 instruments available
  const [spotlight, setSpotlight] = useState<BandInstrumentId | null>(null);

  // Preload audio for the current section
  useEffect(() => {
    BAND_INSTRUMENTS.forEach(inst => {
      if (inst.sections.includes(section)) {
        audio.loadAudio(getBandAudioSrc(inst.id, section));
      }
    });
  }, [section, audio]);

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
