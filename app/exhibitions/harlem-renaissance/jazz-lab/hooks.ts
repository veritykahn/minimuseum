'use client';

import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
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

export type PlayOptions = {
  /** A shared clock's name: loops on it stay on the same beat. */
  sync?: string;
  /** Called when the sound plays to its end (not when it is stopped). */
  onEnded?: () => void;
};

/**
 * Where in a loop of `duration` seconds to start, `elapsed` seconds after
 * the clock's downbeat. Zero for a loop whose length is unknown.
 */
export function loopOffset(elapsed: number, duration: number): number {
  if (!(duration > 0) || !(elapsed > 0)) return 0;
  return elapsed % duration;
}

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
 *
 * Loops that must play in time with each other (the band) share a clock by
 * name (`sync`). The first loop to start on a clock sets its downbeat; every
 * loop that joins later starts part-way through its file, at the point the
 * band has reached, so a bass brought on a few seconds after the drums lands
 * on the same beat instead of a few seconds behind it. (Before, each loop
 * began at its own top whenever it finished loading: the band drifted out of
 * time with every instrument added.) A loop that replaces itself (a new song
 * section) fades its old file out over a moment rather than cutting it dead.
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
  /** Shared downbeats by clock name: the context time a synced loop's file began. */
  const clocksRef = useRef<Map<string, number>>(new Map());
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

  /** A short fade, then stop: for a loop handing over to its next section. */
  const fadeKill = useCallback((entry: ActiveSource) => {
    const ctx = audioCtxRef.current;
    if (!ctx) { kill(entry); return; }
    const now = ctx.currentTime;
    entry.gain.gain.cancelScheduledValues(now);
    entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
    entry.gain.gain.linearRampToValueAtTime(0, now + 0.12);
    setTimeout(() => kill(entry), 160);
  }, [kill]);

  /** Forgets a clock's downbeat: the next loop on it starts the music afresh. */
  const resetClock = useCallback((name: string) => {
    clocksRef.current.delete(name);
  }, []);

  const stopAll = useCallback(() => {
    clocksRef.current.clear();
    ticketsRef.current.clear();
    activeSourcesRef.current.clear();
    allSourcesRef.current.forEach(kill);
    allSourcesRef.current.clear();
  }, [kill]);

  /**
   * Shared by playLoop and playOnce. Resolves once the sound has started, or
   * once it has been cancelled by a newer start or a stop.
   */
  const start = useCallback(async (id: string, src: string, volume: number, loop: boolean, fadeIn: boolean, opts: PlayOptions = {}) => {
    const prev = activeSourcesRef.current.get(id);
    if (prev && loop) {
      // A loop handing over to its next file fades out; anything else stops.
      ticketsRef.current.delete(id);
      activeSourcesRef.current.delete(id);
      fadeKill(prev);
    } else {
      stopSource(id);
    }
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

    // When to start, and where in the file: on a shared clock, at the beat
    // the other loops have reached; otherwise now, from the top.
    let when = 0;
    let offset = 0;
    if (opts.sync) {
      when = ctx.currentTime + 0.03;
      const downbeat = clocksRef.current.get(opts.sync);
      if (downbeat === undefined) clocksRef.current.set(opts.sync, when);
      else offset = loopOffset(when - downbeat, buffer.duration);
    }

    const gainNode = ctx.createGain();
    if (fadeIn) {
      gainNode.gain.setValueAtTime(0, when || ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(level, (when || ctx.currentTime) + 0.1);
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
        // Only a sound that ran to its end says so: a stopped or replaced
        // one has already left the map.
        opts.onEnded?.();
      }
      allSourcesRef.current.delete(entry);
    };
    activeSourcesRef.current.set(id, entry);
    allSourcesRef.current.add(entry);
    if (opts.sync) source.start(when, offset);
    else source.start(0);
  }, [ensureContext, loadAudio, stopSource, fadeKill]);

  const playLoop = useCallback(
    (id: string, src: string, volume: number = 0.5, opts?: PlayOptions) => start(id, src, volume, true, true, opts),
    [start],
  );

  const playOnce = useCallback(
    (id: string, src: string, volume: number = 0.8, opts?: PlayOptions) => start(id, src, volume, false, false, opts),
    [start],
  );

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
    () => ({ ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, fadeOutAndStop, stopAll, isPlaying, onSilenced, resetClock }),
    [ensureContext, loadAudio, playLoop, playOnce, setVolume, stopSource, fadeOutAndStop, stopAll, isPlaying, onSilenced, resetClock],
  );
}

// ─── useBandBuilder ─────────────────────────────────────────────────────────

type AudioEngine = ReturnType<typeof useAudioEngine>;

/** Loudness of each player: the soloist up front, the rest backing, or all even. */
export function bandVolume(id: BandInstrumentId, spotlight: BandInstrumentId | null): number {
  if (!spotlight) return 0.7;
  return id === spotlight ? 1.0 : 0.4;
}

/** The band's shared clock: every player keeps the same beat. */
const BAND = { sync: 'band' } as const;

/**
 * Build a Band. Tapping an instrument always does one thing — gives it the
 * spotlight — bringing it on stage first if it isn't playing. Tapping the
 * soloist again hands the music back to the whole band. Players leave the
 * stage only through their own remove control. `lastTouched` drives the fact
 * card, so it shows whatever the visitor last tapped, solo or not.
 */
export function useBandBuilder(audio: AudioEngine, { preload = true }: { preload?: boolean } = {}) {
  const [active, setActive] = useState<Set<BandInstrumentId>>(new Set());
  const [section, setSection] = useState(1); // A tune starts at its Intro
  const [spotlight, setSpotlight] = useState<BandInstrumentId | null>(null);
  const [lastTouched, setLastTouched] = useState<BandInstrumentId | null>(null);

  // Preload audio for the current section, once the band is in view (not
  // behind the welcome screen or another tab: six loops are ~3 MB a phone).
  useEffect(() => {
    if (!preload) return;
    BAND_INSTRUMENTS.forEach(inst => {
      if (inst.sections.includes(section)) {
        audio.loadAudio(getBandAudioSrc(inst.id, section)).catch(() => {});
      }
    });
  }, [section, audio, preload]);

  // If the engine silences everything itself (the page is going away), the
  // stage empties with it rather than showing players who make no sound.
  useEffect(() => audio.onSilenced(() => {
    setActive(new Set());
    setSpotlight(null);
  }), [audio]);

  const applyVolumes = useCallback((players: Set<BandInstrumentId>, spot: BandInstrumentId | null) => {
    players.forEach(id => audio.setVolume(id, bandVolume(id, spot)));
  }, [audio]);

  const tapInstrument = useCallback((id: BandInstrumentId) => {
    const inst = BAND_INSTRUMENT_MAP[id];
    if (!inst.sections.includes(section)) return;
    setLastTouched(id);

    if (!active.has(id)) {
      // Not playing → bring it on stage, in the spotlight.
      // An empty stage starts the tune afresh; anyone joining comes in on the beat.
      if (active.size === 0) audio.resetClock(BAND.sync);
      audio.playLoop(id, getBandAudioSrc(id, section), bandVolume(id, id), BAND);
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
    if (next.size === 0) audio.resetClock(BAND.sync);
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

    // Every player still on stage starts the new section together, from its
    // top: a fresh downbeat on the band's clock.
    audio.resetClock(BAND.sync);
    stillActive.forEach(id => {
      audio.playLoop(id, getBandAudioSrc(id, newSection), bandVolume(id, newSpotlight), BAND);
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
      audio.playLoop(inst.id, getBandAudioSrc(inst.id, randomSection), bandVolume(inst.id, null), BAND);
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

/** 'retry': the first answer was wrong; one more listen and one more try. */
type QuizState = 'idle' | 'playing' | 'retry' | 'answered' | 'gameover';

export type QuizRound = {
  id: string;
  audioSrc: string;
  correctAnswer: InstrumentId;
};

export type QuizRecord = {
  round: QuizRound;
  /** The first answer: the one the score counts. */
  chosen: InstrumentId;
  correct: boolean;
  /** After a wrong first answer, the second try. */
  secondTry?: InstrumentId;
};

/**
 * One answer to a round. Right first time ends the round. A first miss is
 * not the end: the player hears what the instrument they picked sounds like,
 * listens again and has one more try (the score still counts the first). A
 * second answer, right or wrong, ends the round. Repeating the first miss
 * does nothing.
 */
export function answerRound(
  round: QuizRound,
  answer: InstrumentId,
  firstMiss: InstrumentId | null,
): { next: 'answered' | 'retry'; record?: QuizRecord } {
  if (firstMiss === null) {
    if (answer === round.correctAnswer) return { next: 'answered', record: { round, chosen: answer, correct: true } };
    return { next: 'retry' };
  }
  if (answer === firstMiss) return { next: 'retry' };
  return { next: 'answered', record: { round, chosen: firstMiss, correct: false, secondTry: answer } };
}

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
  /** This round's wrong first answer, while the player has a second try. */
  const [firstMiss, setFirstMiss] = useState<InstrumentId | null>(null);
  const lastFullRecords = useRef<QuizRecord[]>([]);

  // The play button shows the note while the clip sounds, and the play
  // arrow again once it ends (it used to keep the note on for good).
  const playRound = useCallback((round: QuizRound) => {
    setIsQuizPlaying(true);
    audio.playOnce('quiz', round.audioSrc, 0.8, { onEnded: () => setIsQuizPlaying(false) }).catch(() => setIsQuizPlaying(false));
  }, [audio]);

  useEffect(() => audio.onSilenced(() => setIsQuizPlaying(false)), [audio]);

  const begin = useCallback((newRounds: QuizRound[], newMode: 'full' | 'replay') => {
    audio.stopAll();
    setRounds(newRounds);
    setCurrentRound(0);
    setRecords([]);
    setFirstMiss(null);
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
    if (gameState !== 'playing' && gameState !== 'retry') return;
    const round = rounds[currentRound];
    const result = answerRound(round, answer, gameState === 'retry' ? firstMiss : null);
    if (!result.record) {
      if (gameState === 'playing') {
        // A first miss: say what that instrument sounds like, play the clip again.
        setFirstMiss(answer);
        setGameState('retry');
        playRound(round);
      }
      return;
    }
    const next = [...records, result.record];
    setRecords(next);
    if (mode === 'full' && currentRound + 1 >= rounds.length) lastFullRecords.current = next;
    setGameState('answered');
    setIsQuizPlaying(false);
    audio.stopSource('quiz');
  }, [gameState, rounds, currentRound, records, mode, audio, firstMiss, playRound]);

  // The player decides when to move on: no timer races the feedback.
  const nextRound = useCallback(() => {
    if (gameState !== 'answered') return;
    if (currentRound + 1 >= rounds.length) {
      setGameState('gameover');
      return;
    }
    const n = currentRound + 1;
    setCurrentRound(n);
    setFirstMiss(null);
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
    firstMiss: gameState === 'retry' ? firstMiss : null,
    isQuizPlaying,
    startGame,
    replayMissed,
    replaySound,
    submitAnswer,
    nextRound,
  };
}
