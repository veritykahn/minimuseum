'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Word bank data ─── */
type WordCategory = 'dream' | 'nature' | 'music' | 'emotion' | 'action' | 'harlem';

type WordDef = {
  word: string;
  plural?: string;
  category: WordCategory;
};

const CATEGORY_META: Record<WordCategory, { label: string; color: string }> = {
  dream:   { label: 'Dream',   color: '#C9A94E' },
  nature:  { label: 'Nature',  color: '#7BA3C7' },
  music:   { label: 'Music',   color: '#D4864A' },
  emotion: { label: 'Emotion', color: '#D4645A' },
  action:  { label: 'Action',  color: '#5CBFAA' },
  harlem:  { label: 'Harlem',  color: '#B485D2' },
};

const CATEGORY_ORDER: WordCategory[] = ['dream', 'nature', 'music', 'emotion', 'action', 'harlem'];

const WORDS_UNSORTED: WordDef[] = [
  // Dream
  { word: 'a dream', plural: 'dreams', category: 'dream' as const },
  { word: 'deferred', category: 'dream' as const },
  { word: 'freedom', category: 'dream' as const },
  { word: 'hope', plural: 'hopes', category: 'dream' as const },
  { word: 'tomorrow', plural: 'tomorrows', category: 'dream' as const },
  { word: 'vision', plural: 'visions', category: 'dream' as const },
  // Nature
  { word: 'a river', plural: 'rivers', category: 'nature' as const },
  { word: 'dawn', plural: 'dawns', category: 'nature' as const },
  { word: 'night', plural: 'nights', category: 'nature' as const },
  { word: 'rain', plural: 'rains', category: 'nature' as const },
  { word: 'stars', category: 'nature' as const },
  { word: 'the sun', category: 'nature' as const },
  // Music
  { word: 'blues', category: 'music' as const },
  { word: 'drum', plural: 'drums', category: 'music' as const },
  { word: 'jazz', category: 'music' as const },
  { word: 'rhythm', plural: 'rhythms', category: 'music' as const },
  { word: 'a song', plural: 'songs', category: 'music' as const },
  { word: 'trumpet', plural: 'trumpets', category: 'music' as const },
  // Emotion
  { word: 'beautiful', category: 'emotion' as const },
  { word: 'dark', category: 'emotion' as const },
  { word: 'deep', category: 'emotion' as const },
  { word: 'fierce', category: 'emotion' as const },
  { word: 'proud', category: 'emotion' as const },
  { word: 'weary', category: 'emotion' as const },
  // Action
  { word: 'cry', plural: 'cries', category: 'action' as const },
  { word: 'dance', plural: 'dances', category: 'action' as const },
  { word: 'hold', plural: 'holds', category: 'action' as const },
  { word: 'rise', plural: 'rises', category: 'action' as const },
  { word: 'sing', plural: 'sings', category: 'action' as const },
  { word: 'speak', plural: 'speaks', category: 'action' as const },
  // Harlem
  { word: 'America', category: 'harlem' as const },
  { word: 'Harlem', category: 'harlem' as const },
  { word: 'Lenox Avenue', category: 'harlem' as const },
  { word: 'my people', category: 'harlem' as const },
  { word: 'the Negro', category: 'harlem' as const },
  { word: 'uptown', category: 'harlem' as const },
];

const WORDS = WORDS_UNSORTED.sort((a, b) => a.word.localeCompare(b.word, 'en', { sensitivity: 'base' }));

const CONNECTORS = [
  'I', 'you', 'we', 'the', 'my', 'our',
  'is', 'was', 'are', 'of', 'in', 'and',
  'to', 'for', 'with', 'like', 'but', 'no',
  'too', 'not',
].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

type PoemWord = {
  id: string;
  text: string;
  category: WordCategory | 'connector';
  isLineBreak?: boolean;
};

const DISPLAY_THEMES = [
  { name: 'cascade', label: 'Cascade' },
  { name: 'spotlight', label: 'Spotlight' },
  { name: 'typewriter', label: 'Typewriter' },
  { name: 'wave', label: 'Wave' },
];

export default function HarlemInWordsPage() {
  const router = useRouter();
  const [view, setView] = useState<'welcome' | 'compose'>('welcome');
  const [poem, setPoem] = useState<PoemWord[]>([]);
  const [undoStack, setUndoStack] = useState<PoemWord[][]>([]);
  const [displayMode, setDisplayMode] = useState(false);
  const [displayTheme, setDisplayTheme] = useState('cascade');
  const [displayReady, setDisplayReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordIdCounter = useRef(0);

  const nextId = () => {
    wordIdCounter.current += 1;
    return `w-${wordIdCounter.current}`;
  };

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-20), poem]);
  }, [poem]);

  const addWord = useCallback((text: string, category: WordCategory | 'connector') => {
    pushUndo();
    setPoem(prev => [...prev, { id: nextId(), text, category }]);
  }, [pushUndo]);

  const addLineBreak = useCallback(() => {
    pushUndo();
    setPoem(prev => [...prev, { id: nextId(), text: '\n', category: 'connector', isLineBreak: true }]);
  }, [pushUndo]);

  const togglePlural = useCallback((id: string) => {
    setPoem(prev => prev.map(w => {
      if (w.id !== id || w.isLineBreak) return w;
      const def = WORDS.find(d => d.word === w.text || d.plural === w.text);
      if (!def || !def.plural) return w;
      return { ...w, text: w.text === def.word ? def.plural : def.word };
    }));
  }, []);

  const removeWord = useCallback((id: string) => {
    pushUndo();
    setPoem(prev => prev.filter(w => w.id !== id));
  }, [pushUndo]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setPoem(prev);
  }, [undoStack]);

  const handleClear = useCallback(() => {
    if (poem.length === 0) return;
    pushUndo();
    setPoem([]);
  }, [poem, pushUndo]);

  const handleShuffle = useCallback(() => {
    if (poem.length <= 1) return;
    pushUndo();
    setPoem(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }, [poem, pushUndo]);

  // Display mode audio
  useEffect(() => {
    if (displayMode) {
      const timer = setTimeout(() => setDisplayReady(true), 100);
      const audio = new Audio('/exhibitions/harlem/audio/poetry/poem-bg.mp3');
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio.play().then(() => {
        let vol = 0;
        const fade = setInterval(() => {
          vol = Math.min(vol + 0.05, 0.4);
          audio.volume = vol;
          if (vol >= 0.4) clearInterval(fade);
        }, 80);
      }).catch(() => {});
      return () => {
        clearTimeout(timer);
        setDisplayReady(false);
        if (audioRef.current) {
          const a = audioRef.current;
          let vol = a.volume;
          const fade = setInterval(() => {
            vol = Math.max(vol - 0.05, 0);
            a.volume = vol;
            if (vol <= 0) {
              clearInterval(fade);
              a.pause();
            }
          }, 60);
        }
      };
    }
    return undefined;
  }, [displayMode]);

  const poemText = poem.filter(w => !w.isLineBreak).map(w => w.text).join(' ');
  const poemLines: PoemWord[][] = [];
  let currentLine: PoemWord[] = [];
  poem.forEach(w => {
    if (w.isLineBreak) {
      poemLines.push(currentLine);
      currentLine = [];
    } else {
      currentLine.push(w);
    }
  });
  if (currentLine.length > 0) poemLines.push(currentLine);

  const getWordColor = (category: WordCategory | 'connector') => {
    if (category === 'connector') return 'rgba(232,224,208,0.7)';
    return CATEGORY_META[category].color;
  };

  return (
    <div className="hw-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Josefin+Sans:wght@300;400;600;700&family=Poiret+One&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }

        :root {
          --hw-gold: #C9A94E;
          --hw-gold-light: #E8D48B;
          --hw-gold-dim: #8B7535;
          --hw-bg: #0A0A0A;
          --hw-text: #E8E0D0;
          --hw-text-dim: #8A8070;
          --hw-burgundy: #8B2020;
        }

        .hw-root {
          min-height: 100vh;
          background: var(--hw-bg);
          color: var(--hw-text);
        }

        /* ── Welcome Screen ── */
        .hw-welcome {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0A0A0A;
        }
        .hw-welcome::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(201,169,78,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(139,32,32,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .hw-welcome-deco-top,
        .hw-welcome-deco-bottom {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          width: 300px;
        }
        .hw-welcome-deco-top { top: 60px; }
        .hw-welcome-deco-bottom { bottom: 60px; }
        .hw-welcome-deco-top::before, .hw-welcome-deco-top::after,
        .hw-welcome-deco-bottom::before, .hw-welcome-deco-bottom::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.4), transparent);
        }
        .hw-welcome-deco-diamond {
          width: 8px;
          height: 8px;
          background: var(--hw-gold-dim);
          transform: rotate(45deg);
        }
        .hw-welcome-content {
          position: relative;
          z-index: 2;
          text-align: center;
          animation: hw-fadeIn 1s ease;
          padding: 0 24px;
        }
        @keyframes hw-fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hw-welcome-subtitle-top {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--hw-gold-dim);
          margin-bottom: 20px;
          font-weight: 600;
        }
        .hw-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 900;
          color: var(--hw-gold);
          letter-spacing: 6px;
          text-transform: uppercase;
          text-shadow: 0 0 60px rgba(201,169,78,0.25);
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .hw-welcome-premise {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 2.5vw, 17px);
          line-height: 1.8;
          color: rgba(232,224,208,0.65);
          font-weight: 300;
          max-width: 500px;
          margin: 0 auto 24px;
        }
        .hw-welcome-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 3vw, 22px);
          font-style: italic;
          color: var(--hw-text-dim);
          font-weight: 400;
          margin-bottom: 50px;
        }
        .hw-welcome-enter {
          display: inline-block;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 16px 48px;
          border: 1.5px solid var(--hw-gold);
          background: transparent;
          color: var(--hw-gold);
          cursor: pointer;
          transition: all 0.4s ease;
          border-radius: 2px;
        }
        .hw-welcome-enter:hover {
          background: rgba(201,169,78,0.12);
          box-shadow: 0 0 40px rgba(201,169,78,0.15);
          letter-spacing: 7px;
        }
        .hw-welcome-back {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease;
        }
        .hw-welcome-back-text { font-size: 28px; font-weight: 300; color: #525252; }
        .hw-welcome-back-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .hw-welcome-back-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }
        .hw-welcome-back:hover .hw-welcome-back-label { opacity: 1; max-width: 150px; }
        .hw-welcome-back:hover .hw-welcome-back-arrow { transform: translateX(-4px); }

        @media (max-width: 768px) {
          .hw-welcome-back { left: 20px; top: 20px; }
          .hw-welcome-back-text { font-size: 24px; }
          .hw-welcome-deco-top, .hw-welcome-deco-bottom { width: 200px; }
        }

        /* ── Compose View Nav ── */
        .hw-nav {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
        }
        .hw-nav:hover .hw-nav-label { opacity: 1; max-width: 150px; }
        .hw-nav:hover .hw-nav-arrow { transform: translateX(-4px); }
        .hw-nav-text { font-size: 28px; font-weight: 300; color: #525252; transition: color 0.3s ease; }
        .hw-nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .hw-nav-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        @media (max-width: 768px) {
          .hw-nav { left: 20px; top: 20px; }
          .hw-nav-text { font-size: 24px; }
        }

        /* ── Header ── */
        .hw-header {
          text-align: center;
          padding: 40px 20px 10px;
        }
        .hw-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 5vw, 40px);
          font-weight: 900;
          color: var(--hw-gold);
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 0 0 40px rgba(201,169,78,0.3);
        }
        .hw-header-sub {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--hw-text-dim);
          margin-top: 8px;
        }

        /* ── Compose Layout ── */
        .hw-compose-layout {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        /* ── Word Bank ── */
        .hw-bank-section {
          margin-bottom: 20px;
        }
        .hw-bank-category-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 10px;
          padding-left: 2px;
        }
        .hw-bank-words {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hw-word-chip {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 20px);
          padding: 8px 18px;
          border-radius: 6px;
          border: 1.5px solid;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-word-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .hw-word-chip:active {
          transform: scale(0.96);
        }

        /* ── Connectors ── */
        .hw-connectors-section {
          margin-bottom: 24px;
        }
        .hw-connector-chip {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 2vw, 16px);
          padding: 6px 14px;
          border-radius: 4px;
          border: 1px solid rgba(232,224,208,0.15);
          background: rgba(255,255,255,0.02);
          color: rgba(232,224,208,0.7);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-connector-chip:hover {
          border-color: rgba(232,224,208,0.35);
          background: rgba(255,255,255,0.04);
          transform: translateY(-1px);
        }
        .hw-connector-chip:active {
          transform: scale(0.96);
        }

        /* ── Poem Composition ── */
        .hw-poem-area {
          position: relative;
          min-height: 180px;
          padding: 32px 24px;
          margin-top: 8px;
          margin-bottom: 20px;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(201,169,78,0.15);
          border-radius: 8px;
        }
        .hw-poem-area::before {
          content: '';
          position: absolute;
          top: 6px; left: 6px; right: 6px; bottom: 6px;
          border: 1px solid rgba(201,169,78,0.08);
          border-radius: 4px;
          pointer-events: none;
        }
        .hw-poem-corner {
          position: absolute;
          width: 16px;
          height: 16px;
        }
        .hw-poem-corner::before, .hw-poem-corner::after {
          content: '';
          position: absolute;
          background: var(--hw-gold-dim);
        }
        .hw-poem-corner::before { width: 16px; height: 1px; }
        .hw-poem-corner::after { width: 1px; height: 16px; }
        .hw-poem-corner.tl { top: -1px; left: -1px; }
        .hw-poem-corner.tl::before { top: 0; left: 0; }
        .hw-poem-corner.tl::after { top: 0; left: 0; }
        .hw-poem-corner.tr { top: -1px; right: -1px; }
        .hw-poem-corner.tr::before { top: 0; right: 0; }
        .hw-poem-corner.tr::after { top: 0; right: 0; }
        .hw-poem-corner.bl { bottom: -1px; left: -1px; }
        .hw-poem-corner.bl::before { bottom: 0; left: 0; }
        .hw-poem-corner.bl::after { bottom: 0; left: 0; }
        .hw-poem-corner.br { bottom: -1px; right: -1px; }
        .hw-poem-corner.br::before { bottom: 0; right: 0; }
        .hw-poem-corner.br::after { bottom: 0; right: 0; }

        .hw-poem-placeholder {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-style: italic;
          color: rgba(201,169,78,0.2);
          text-align: center;
          padding-top: 60px;
        }
        .hw-poem-words {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: baseline;
          position: relative;
          z-index: 2;
        }
        .hw-poem-word {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 3vw, 24px);
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: hw-wordAppear 0.3s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .hw-poem-word:hover {
          background: rgba(139,32,32,0.2);
        }
        .hw-poem-word:hover::after {
          content: '\u00D7';
          position: absolute;
          top: -6px;
          right: -6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--hw-burgundy);
          color: #fff;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
        }
        @keyframes hw-wordAppear {
          from { opacity: 0; transform: translateY(8px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hw-line-break-marker {
          width: 100%;
          height: 0;
          flex-basis: 100%;
        }
        .hw-poem-word.plural-flash {
          animation: hw-pluralFlash 0.3s ease;
        }
        @keyframes hw-pluralFlash {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        /* ── Controls ── */
        .hw-controls {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }
        .hw-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 10px 22px;
          border: 1px solid rgba(201,169,78,0.3);
          background: transparent;
          color: var(--hw-gold);
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-btn:hover {
          background: rgba(201,169,78,0.08);
          border-color: var(--hw-gold);
        }
        .hw-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .hw-btn.display {
          border-color: var(--hw-gold);
          background: rgba(201,169,78,0.08);
        }
        .hw-btn.display:hover {
          background: rgba(201,169,78,0.15);
        }

        /* ── Display Mode ── */
        .hw-display-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #050505;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: hw-displayFadeIn 1s ease;
        }
        @keyframes hw-displayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hw-display-overlay::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(201,169,78,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Display frame */
        .hw-display-frame {
          position: relative;
          max-width: 700px;
          width: 90%;
          padding: 60px 50px;
          z-index: 2;
        }
        .hw-display-frame::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 1px solid rgba(201,169,78,0.2);
        }
        .hw-display-frame::after {
          content: '';
          position: absolute;
          top: 8px; left: 8px; right: 8px; bottom: 8px;
          border: 1px solid rgba(201,169,78,0.1);
        }
        .hw-display-corner {
          position: absolute;
          width: 24px;
          height: 24px;
        }
        .hw-display-corner::before, .hw-display-corner::after {
          content: '';
          position: absolute;
          background: var(--hw-gold);
        }
        .hw-display-corner::before { width: 24px; height: 1px; }
        .hw-display-corner::after { width: 1px; height: 24px; }
        .hw-display-corner.tl { top: -1px; left: -1px; }
        .hw-display-corner.tl::before { top: 0; left: 0; }
        .hw-display-corner.tl::after { top: 0; left: 0; }
        .hw-display-corner.tr { top: -1px; right: -1px; }
        .hw-display-corner.tr::before { top: 0; right: 0; }
        .hw-display-corner.tr::after { top: 0; right: 0; }
        .hw-display-corner.bl { bottom: -1px; left: -1px; }
        .hw-display-corner.bl::before { bottom: 0; left: 0; }
        .hw-display-corner.bl::after { bottom: 0; left: 0; }
        .hw-display-corner.br { bottom: -1px; right: -1px; }
        .hw-display-corner.br::before { bottom: 0; right: 0; }
        .hw-display-corner.br::after { bottom: 0; right: 0; }

        .hw-display-deco {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          width: 200px;
        }
        .hw-display-deco.top { top: -1px; }
        .hw-display-deco.bottom { bottom: -1px; }
        .hw-display-deco::before, .hw-display-deco::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--hw-gold), transparent);
        }
        .hw-display-deco-diamond {
          width: 6px;
          height: 6px;
          background: var(--hw-gold);
          transform: rotate(45deg);
        }

        .hw-display-poem {
          text-align: center;
          min-height: 120px;
        }
        .hw-display-line {
          margin-bottom: 12px;
        }
        .hw-display-word {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 400;
          line-height: 1.6;
          display: inline;
        }

        /* Theme animations */
        .hw-theme-cascade .hw-display-word {
          opacity: 0;
          animation: hw-cascadeIn 0.6s ease forwards;
        }
        @keyframes hw-cascadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hw-theme-spotlight .hw-display-word {
          opacity: 0;
          animation: hw-spotlightIn 0.8s ease forwards;
        }
        @keyframes hw-spotlightIn {
          0% { opacity: 0; text-shadow: none; }
          50% { opacity: 1; text-shadow: 0 0 30px rgba(201,169,78,0.6); }
          100% { opacity: 1; text-shadow: none; }
        }
        .hw-theme-typewriter .hw-display-word {
          opacity: 0;
          animation: hw-typewriterIn 0.1s steps(1) forwards;
        }
        @keyframes hw-typewriterIn {
          to { opacity: 1; }
        }
        .hw-theme-wave .hw-display-word {
          opacity: 0;
          animation: hw-waveIn 0.8s ease forwards;
        }
        @keyframes hw-waveIn {
          0% { opacity: 0; transform: translateY(30px) rotate(-3deg); }
          60% { opacity: 1; transform: translateY(-5px) rotate(1deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0); }
        }

        /* Display controls */
        .hw-display-controls {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 2001;
        }
        .hw-display-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 24px;
          border: 1px solid rgba(201,169,78,0.3);
          background: rgba(5,5,5,0.8);
          color: var(--hw-gold);
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
          backdrop-filter: blur(10px);
        }
        .hw-display-btn:hover {
          background: rgba(201,169,78,0.1);
          border-color: var(--hw-gold);
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .hw-compose-layout { padding: 0 12px 40px; }
          .hw-word-chip { font-size: 15px; padding: 6px 14px; }
          .hw-connector-chip { font-size: 13px; padding: 5px 10px; }
          .hw-poem-area { padding: 24px 16px; min-height: 140px; }
          .hw-poem-word { font-size: 18px; }
          .hw-btn { padding: 8px 16px; font-size: 9px; letter-spacing: 2px; }
          .hw-display-frame { padding: 40px 24px; }
          .hw-display-word { font-size: 20px !important; }
          .hw-display-controls { bottom: 24px; gap: 8px; }
          .hw-display-btn { padding: 10px 16px; font-size: 9px; }
        }
      `}</style>

      {/* ── WELCOME SCREEN ── */}
      {view === 'welcome' && (
        <div className="hw-welcome">
          <button className="hw-welcome-back" onClick={() => router.push('/exhibitions/harlem-renaissance/artifacts')}>
            <span className="hw-welcome-back-text">M</span>
            <span className="hw-welcome-back-arrow">{'\u2190'}</span>
            <span className="hw-welcome-back-label">Collection</span>
          </button>
          <div className="hw-welcome-deco-top">
            <div className="hw-welcome-deco-diamond" />
          </div>
          <div className="hw-welcome-content">
            <div className="hw-welcome-subtitle-top">The Mini Museum Presents</div>
            <h1 className="hw-welcome-title">Harlem in Words</h1>
            <p className="hw-welcome-premise">
              During the Harlem Renaissance, poets like Langston Hughes, Claude McKay, and Countee Cullen gave voice
              to the dreams, struggles, and beauty of Black life in America. Their words became anthems of a movement.
            </p>
            <p className="hw-welcome-tagline">Now it{'\u2019'}s your turn to compose.</p>
            <button className="hw-welcome-enter" onClick={() => setView('compose')}>
              Enter
            </button>
          </div>
          <div className="hw-welcome-deco-bottom">
            <div className="hw-welcome-deco-diamond" />
          </div>
        </div>
      )}

      {/* ── COMPOSE VIEW ── */}
      {view === 'compose' && !displayMode && (
        <>
          <button className="hw-nav" onClick={() => setView('welcome')}>
            <span className="hw-nav-text">M</span>
            <span className="hw-nav-arrow">{'\u2190'}</span>
            <span className="hw-nav-label">Back</span>
          </button>

          <div className="hw-header">
            <h1>Harlem in Words</h1>
            <p className="hw-header-sub">Tap words to compose your poem</p>
          </div>

          <div className="hw-compose-layout">
            {/* Word bank by category */}
            {CATEGORY_ORDER.map(cat => {
              const meta = CATEGORY_META[cat];
              const words = WORDS.filter(w => w.category === cat);
              return (
                <div key={cat} className="hw-bank-section">
                  <div className="hw-bank-category-label" style={{ color: meta.color }}>{meta.label}</div>
                  <div className="hw-bank-words">
                    {words.map(w => (
                      <button
                        key={w.word}
                        className="hw-word-chip"
                        style={{
                          color: meta.color,
                          borderColor: `${meta.color}33`,
                        }}
                        onClick={() => addWord(w.word, cat)}
                        onMouseEnter={e => {
                          (e.target as HTMLElement).style.borderColor = meta.color;
                          (e.target as HTMLElement).style.background = `${meta.color}12`;
                        }}
                        onMouseLeave={e => {
                          (e.target as HTMLElement).style.borderColor = `${meta.color}33`;
                          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                        }}
                      >
                        {w.word}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Connectors */}
            <div className="hw-connectors-section">
              <div className="hw-bank-category-label" style={{ color: 'rgba(232,224,208,0.5)' }}>Connectors</div>
              <div className="hw-bank-words">
                {CONNECTORS.map(c => (
                  <button
                    key={c}
                    className="hw-connector-chip"
                    onClick={() => addWord(c, 'connector')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Poem composition area */}
            <div className="hw-poem-area">
              <div className="hw-poem-corner tl" />
              <div className="hw-poem-corner tr" />
              <div className="hw-poem-corner bl" />
              <div className="hw-poem-corner br" />

              {poem.length === 0 ? (
                <div className="hw-poem-placeholder">
                  Tap words above to begin your poem...
                </div>
              ) : (
                <div className="hw-poem-words">
                  {poem.map(w => {
                    if (w.isLineBreak) {
                      return <div key={w.id} className="hw-line-break-marker" />;
                    }
                    const def = WORDS.find(d => d.word === w.text || d.plural === w.text);
                    const canPlural = def && def.plural;
                    return (
                      <span
                        key={w.id}
                        className="hw-poem-word"
                        style={{ color: getWordColor(w.category) }}
                        onClick={() => removeWord(w.id)}
                        onDoubleClick={canPlural ? (e) => {
                          e.stopPropagation();
                          togglePlural(w.id);
                        } : undefined}
                      >
                        {w.text}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="hw-controls">
              <button className="hw-btn" onClick={addLineBreak} disabled={poem.length === 0}>
                Line Break
              </button>
              <button className="hw-btn" onClick={handleUndo} disabled={undoStack.length === 0}>
                Undo
              </button>
              <button className="hw-btn" onClick={handleShuffle} disabled={poem.length <= 1}>
                Shuffle
              </button>
              <button className="hw-btn" onClick={handleClear} disabled={poem.length === 0}>
                Clear
              </button>
              <button
                className="hw-btn display"
                onClick={() => setDisplayMode(true)}
                disabled={poem.filter(w => !w.isLineBreak).length === 0}
              >
                Display Poem
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DISPLAY MODE ── */}
      {displayMode && (
        <div className="hw-display-overlay">
          <div className={`hw-display-frame hw-theme-${displayTheme}`}>
            <div className="hw-display-corner tl" />
            <div className="hw-display-corner tr" />
            <div className="hw-display-corner bl" />
            <div className="hw-display-corner br" />
            <div className="hw-display-deco top">
              <div className="hw-display-deco-diamond" />
            </div>
            <div className="hw-display-deco bottom">
              <div className="hw-display-deco-diamond" />
            </div>

            <div className="hw-display-poem">
              {poemLines.map((line, li) => (
                <div key={li} className="hw-display-line">
                  {line.map((w, wi) => {
                    const globalIdx = poemLines.slice(0, li).reduce((sum, l) => sum + l.length, 0) + wi;
                    const delay = displayTheme === 'typewriter'
                      ? globalIdx * 0.15
                      : globalIdx * 0.12;
                    return (
                      <span
                        key={w.id}
                        className="hw-display-word"
                        style={{
                          color: getWordColor(w.category),
                          animationDelay: displayReady ? `${delay}s` : '99s',
                        }}
                      >
                        {w.text}{wi < line.length - 1 ? ' ' : ''}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="hw-display-controls">
            {DISPLAY_THEMES.map(t => (
              <button
                key={t.name}
                className="hw-display-btn"
                style={displayTheme === t.name ? {
                  background: 'rgba(201,169,78,0.12)',
                  borderColor: 'var(--hw-gold)',
                } : undefined}
                onClick={() => {
                  setDisplayReady(false);
                  setDisplayTheme(t.name);
                  setTimeout(() => setDisplayReady(true), 100);
                }}
              >
                {t.label}
              </button>
            ))}
            <button
              className="hw-display-btn"
              onClick={() => setDisplayMode(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
