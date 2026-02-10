'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════
   WORD BANK DATA
   ═══════════════════════════════════════════════════════════ */
type WordCategory = 'dream' | 'nature' | 'music' | 'emotion' | 'action' | 'harlem';

const CATEGORY_META: Record<WordCategory, { label: string; dot: string }> = {
  dream:   { label: 'Dreams',  dot: 'rgba(147,112,219,0.6)' },
  nature:  { label: 'Nature',  dot: 'rgba(76,145,100,0.6)' },
  music:   { label: 'Music',   dot: 'rgba(201,169,78,0.7)' },
  emotion: { label: 'Emotion', dot: 'rgba(178,60,60,0.6)' },
  action:  { label: 'Action',  dot: 'rgba(70,130,180,0.6)' },
  harlem:  { label: 'Harlem',  dot: 'rgba(201,120,50,0.6)' },
};

const CATEGORY_ORDER: WordCategory[] = ['dream', 'nature', 'music', 'emotion', 'action', 'harlem'];

const CATEGORY_WORDS: Record<WordCategory, string[]> = {
  dream: [
    'dream', 'dreaming', 'hope', 'wish', 'tomorrow', 'someday', 'freedom', 'rising',
    'awake', 'imagine', 'vision', 'promise', 'believe', 'bright', 'new', 'waiting',
    'becoming', 'wings', 'sky', 'beyond', 'possible', 'future', 'light', 'open',
  ],
  nature: [
    'river', 'rain', 'sun', 'moon', 'star', 'night', 'morning', 'shadow',
    'stone', 'dust', 'wind', 'sea', 'fire', 'earth', 'water', 'tree',
    'flower', 'root', 'dawn', 'dark', 'deep', 'wild', 'golden', 'winter',
  ],
  music: [
    'jazz', 'blues', 'rhythm', 'drum', 'song', 'trumpet', 'piano', 'swing',
    'dance', 'beat', 'melody', 'sound', 'voice', 'sing', 'note', 'horn',
    'loud', 'soft', 'slow', 'sweet', 'low', 'cry', 'hum', 'riff',
  ],
  emotion: [
    'love', 'sorrow', 'proud', 'weary', 'beautiful', 'lonely', 'angry', 'gentle',
    'fierce', 'tender', 'aching', 'joyful', 'broken', 'whole', 'strong', 'quiet',
    'burning', 'still', 'heavy', 'warm', 'cold', 'lost', 'found', 'free',
  ],
  action: [
    'rise', 'fall', 'run', 'walk', 'hold', 'let go', 'build', 'break',
    'carry', 'remember', 'forget', 'speak', 'whisper', 'shout', 'stand', 'fly',
    'stay', 'leave', 'return', 'reach', 'keep', 'give', 'take',
  ],
  harlem: [
    'Harlem', 'Lenox', 'Beale Street', 'South Side', 'uptown', 'corner',
    'stoop', 'avenue', 'church', 'club', 'rent', 'room', 'train', 'north',
    'south', 'home', 'stranger', 'neighbor', 'crowd', 'street', 'door',
    'window', 'roof', 'basement',
  ],
};

const CONNECTORS = [
  'a', 'always', 'an', 'and', 'are', 'at', 'but', 'can', 'do', 'for',
  'from', 'here', 'how', 'I', 'in', 'is', 'like', 'my', 'never', 'no',
  'not', 'of', 'on', 'or', 'our', 'so', 'still', 'that', 'the', 'there',
  'this', 'to', 'too', 'was', 'we', 'when', 'where', 'who', 'will', 'with',
  'you', 'your',
];

// Words that don't pluralise
const NO_PLURAL = new Set([
  ...CONNECTORS.map(c => c.toLowerCase()),
  // Already excluded
  'jazz', 'blues', 'north', 'south',
  // Adjectives & adverbs
  'bright', 'new', 'open', 'dark', 'deep', 'wild', 'golden', 'loud', 'soft',
  'slow', 'sweet', 'low', 'proud', 'weary', 'beautiful', 'lonely', 'angry',
  'gentle', 'fierce', 'tender', 'joyful', 'broken', 'whole', 'strong', 'quiet',
  'heavy', 'warm', 'cold', 'free', 'possible',
  // Verb forms / -ing words
  'dreaming', 'rising', 'awake', 'waiting', 'becoming', 'aching', 'burning',
  'imagine',
  // Verbs
  'rise', 'fall', 'run', 'walk', 'hold', 'let go', 'build', 'break', 'carry',
  'remember', 'forget', 'speak', 'whisper', 'shout', 'stand', 'fly', 'stay',
  'leave', 'return', 'reach', 'keep', 'give', 'take', 'sing', 'cry', 'hum',
  'believe',
  // Proper nouns / places
  'harlem', 'lenox', 'beale street', 'south side', 'uptown',
  // Already plural or uncountable
  'dust', 'water', 'earth', 'rain', 'found', 'lost', 'still',
]);

function pluralise(word: string): string | null {
  if (word.length < 2) return null;
  if (NO_PLURAL.has(word.toLowerCase())) return null;
  const lower = word.toLowerCase();
  if (lower.endsWith('y') && !/[aeiou]/.test(lower.charAt(lower.length - 2))) {
    return word.slice(0, -1) + 'ies';
  }
  if (/(?:s|x|z|ch|sh)$/.test(lower)) {
    return word + 'es';
  }
  return word + 's';
}

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
type PoemEntry = {
  uid: string;
  text: string;
  category: WordCategory | 'connector';
  sourceWord?: string; // original word (for returning to bank)
  isLineBreak?: boolean;
};

type UndoAction = {
  type: 'add' | 'remove' | 'linebreak' | 'clear';
  entries?: PoemEntry[];
  entry?: PoemEntry;
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function HarlemInWordsPage() {
  const router = useRouter();
  const [view, setView] = useState<'welcome' | 'compose'>('welcome');
  const [poem, setPoem] = useState<PoemEntry[]>([]);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<WordCategory>('dream');
  const [shuffledOrders, setShuffledOrders] = useState<Record<WordCategory, string[]>>({} as Record<WordCategory, string[]>);
  const [displayMode, setDisplayMode] = useState(false);
  const [displayTheme, setDisplayTheme] = useState(0);
  const [displayReady, setDisplayReady] = useState(false);
  const [shimmerActive, setShimmerActive] = useState(false);
  const [pluralMode, setPluralMode] = useState(false);
  const [poetName, setPoetName] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);
  const uidCounter = useRef(0);

  const nextUid = () => {
    uidCounter.current += 1;
    return `w-${uidCounter.current}`;
  };

  // Initialise shuffled orders
  useEffect(() => {
    const orders: Record<string, string[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const arr = [...CATEGORY_WORDS[cat]];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      orders[cat] = arr;
    }
    setShuffledOrders(orders as Record<WordCategory, string[]>);
  }, []);

  const triggerShimmer = useCallback(() => {
    setShimmerActive(true);
    setTimeout(() => setShimmerActive(false), 800);
  }, []);

  // Add a category word (single-use) — respects pluralMode
  const addCategoryWord = useCallback((word: string, category: WordCategory) => {
    const text = pluralMode ? (pluralise(word) ?? word) : word;
    const entry: PoemEntry = { uid: nextUid(), text, category, sourceWord: word };
    setPoem(prev => [...prev, entry]);
    setUsedWords(prev => new Set(prev).add(word));
    setUndoStack(prev => [...prev, { type: 'add', entry }]);
    triggerShimmer();
  }, [triggerShimmer, pluralMode]);

  // Add a connector (reusable)
  const addConnector = useCallback((word: string) => {
    const entry: PoemEntry = { uid: nextUid(), text: word, category: 'connector' };
    setPoem(prev => [...prev, entry]);
    setUndoStack(prev => [...prev, { type: 'add', entry }]);
    triggerShimmer();
  }, [triggerShimmer]);

  // Add line break
  const addLineBreak = useCallback(() => {
    if (poem.length > 0 && poem[poem.length - 1].isLineBreak) return;
    const entry: PoemEntry = { uid: nextUid(), text: '\n', category: 'connector', isLineBreak: true };
    setPoem(prev => [...prev, entry]);
    setUndoStack(prev => [...prev, { type: 'linebreak', entry }]);
  }, [poem]);

  // Remove a word from the poem (immediate — no delay)
  const removeEntry = useCallback((uid: string) => {
    const entry = poem.find(e => e.uid === uid);
    if (!entry) return;
    setPoem(prev => prev.filter(e => e.uid !== uid));
    if (entry.category !== 'connector' && entry.sourceWord) {
      setUsedWords(prev => {
        const next = new Set(prev);
        next.delete(entry.sourceWord!);
        return next;
      });
    }
    setUndoStack(prev => [...prev, { type: 'remove', entry }]);
  }, [poem]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));

    if (action.type === 'add' && action.entry) {
      setPoem(prev => prev.filter(e => e.uid !== action.entry!.uid));
      if (action.entry.category !== 'connector' && action.entry.sourceWord) {
        setUsedWords(prev => {
          const next = new Set(prev);
          next.delete(action.entry!.sourceWord!);
          return next;
        });
      }
    } else if (action.type === 'remove' && action.entry) {
      setPoem(prev => [...prev, action.entry!]);
      if (action.entry.category !== 'connector' && action.entry.sourceWord) {
        setUsedWords(prev => new Set(prev).add(action.entry!.sourceWord!));
      }
    } else if (action.type === 'linebreak' && action.entry) {
      setPoem(prev => prev.filter(e => e.uid !== action.entry!.uid));
    } else if (action.type === 'clear' && action.entries) {
      setPoem(action.entries);
      const words = new Set<string>();
      action.entries.forEach(e => {
        if (e.category !== 'connector' && e.sourceWord) words.add(e.sourceWord);
      });
      setUsedWords(words);
    }
  }, [undoStack]);

  // Clear
  const handleClear = useCallback(() => {
    if (poem.length === 0) return;
    setUndoStack(prev => [...prev, { type: 'clear', entries: [...poem] }]);
    setPoem([]);
    setUsedWords(new Set());
  }, [poem]);

  // Shuffle current category
  const handleShuffle = useCallback(() => {
    setShuffledOrders(prev => {
      const arr = [...(prev[activeCategory] || CATEGORY_WORDS[activeCategory])];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return { ...prev, [activeCategory]: arr };
    });
  }, [activeCategory]);

  // Available words for active category
  const availableWords = (shuffledOrders[activeCategory] || CATEGORY_WORDS[activeCategory])
    .filter(w => !usedWords.has(w));

  // Check if current category has any pluralizable words
  const categoryHasPluralizable = availableWords.some(w => pluralise(w) !== null);

  // Display mode audio (Web Audio API)
  useEffect(() => {
    if (!displayMode) return undefined;
    setDisplayTheme(Math.floor(Math.random() * 5));
    const timer = setTimeout(() => setDisplayReady(true), 100);

    let ctx: AudioContext;
    let gain: GainNode;
    let stopped = false;

    const initAudio = async () => {
      try {
        ctx = new AudioContext();
        audioCtxRef.current = ctx;
        gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        audioGainRef.current = gain;

        const resp = await fetch('/exhibitions/harlem/audio/poetry/poem-bg.mp3');
        const buf = await resp.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(buf);
        if (stopped) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        source.loop = true;
        source.connect(gain);
        source.start();
        audioSourceRef.current = source;

        // Fade in over 2s
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2);
      } catch {
        // Audio unavailable — display works fine without it
      }
    };
    initAudio();

    return () => {
      stopped = true;
      clearTimeout(timer);
      setDisplayReady(false);
      if (audioGainRef.current && audioCtxRef.current) {
        const g = audioGainRef.current;
        const c = audioCtxRef.current;
        g.gain.linearRampToValueAtTime(0, c.currentTime + 1.5);
        setTimeout(() => {
          try {
            audioSourceRef.current?.stop();
            c.close();
          } catch { /* */ }
        }, 1600);
      }
    };
  }, [displayMode]);

  // Build poem lines for display
  const poemLines: PoemEntry[][] = [];
  let currentLine: PoemEntry[] = [];
  poem.forEach(e => {
    if (e.isLineBreak) {
      poemLines.push(currentLine);
      currentLine = [];
    } else {
      currentLine.push(e);
    }
  });
  if (currentLine.length > 0) poemLines.push(currentLine);

  // Auto-capitalise first letter of each line
  const displayLines = poemLines.map(line =>
    line.map((w, i) => {
      if (i === 0) return { ...w, text: w.text.charAt(0).toUpperCase() + w.text.slice(1) };
      return w;
    })
  );

  const hasWords = poem.some(e => !e.isLineBreak);

  // Save as image
  const handleSaveImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const W = 800;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);

    // Gold border frame
    ctx.strokeStyle = 'rgba(201,169,78,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, W - 120, H - 120);
    // Inner border
    ctx.strokeStyle = 'rgba(201,169,78,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(72, 72, W - 144, H - 144);

    // Corner squares
    const corners = [[60, 60], [W - 66, 60], [60, H - 66], [W - 66, H - 66]];
    ctx.fillStyle = 'rgba(201,169,78,0.35)';
    corners.forEach(([x, y]) => ctx.fillRect(x, y, 6, 6));

    // "Poetry Workshop" label
    ctx.fillStyle = '#8B7535';
    ctx.font = '10px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('POETRY WORKSHOP', W / 2, 120);

    // Diamond divider under label
    ctx.fillStyle = 'rgba(201,169,78,0.4)';
    ctx.save();
    ctx.translate(W / 2, 140);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();

    // Poem text
    ctx.fillStyle = '#E8D48B';
    ctx.font = '22px "Poiret One", sans-serif';
    ctx.textAlign = 'center';
    let y = 200;
    const lineHeight = 44;

    displayLines.forEach(line => {
      const lineText = line.map(w => w.text).join(' ').toUpperCase();
      ctx.fillText(lineText, W / 2, y);
      y += lineHeight;
    });

    // Divider diamond
    y += 20;
    ctx.fillStyle = 'rgba(201,169,78,0.4)';
    ctx.save();
    ctx.translate(W / 2, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();

    // Divider lines
    ctx.strokeStyle = 'rgba(201,169,78,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, y);
    ctx.lineTo(W / 2 - 10, y);
    ctx.moveTo(W / 2 + 10, y);
    ctx.lineTo(W / 2 + 80, y);
    ctx.stroke();

    // Byline
    y += 30;
    ctx.fillStyle = '#8A8070';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const byName = poetName.trim() || 'A Visitor';
    ctx.fillText(`\u2014 ${byName} \u2014`, W / 2, y);

    // Footer
    ctx.fillStyle = 'rgba(138,128,112,0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText('The Mini Museum \u2014 Harlem Renaissance Exhibition', W / 2, H - 80);

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-poem.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [displayLines, poetName]);

  // Print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

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
          --hw-burgundy: #6B1D2A;
          --hw-burgundy-deep: #4A0E1C;
          --hw-bg: #0A0A0A;
          --hw-text: #E8E0D0;
          --hw-text-dim: #8A8070;
          --hw-cream: #F5ECD7;
          --hw-cream-dark: #E0D5BC;
          --hw-ink: #1A1208;
        }

        .hw-root {
          min-height: 100vh;
          background: var(--hw-bg);
          color: var(--hw-text);
          position: relative;
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

        /* ── Compose Layout: Split Screen ── */
        .hw-compose-page {
          min-height: 100vh;
          display: flex;
          position: relative;
          background:
            radial-gradient(ellipse at 25% 30%, rgba(201,169,78,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 70%, rgba(107,29,42,0.03) 0%, transparent 50%);
        }
        .hw-compose-page::before, .hw-compose-page::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.15), transparent);
        }
        .hw-compose-page::before { top: 0; }
        .hw-compose-page::after { bottom: 0; }

        /* Nav */
        .hw-nav {
          position: fixed;
          top: 32px;
          left: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease;
        }
        .hw-nav:hover .hw-nav-label { opacity: 1; max-width: 150px; }
        .hw-nav:hover .hw-nav-arrow { transform: translateX(-4px); }
        .hw-nav-text { font-size: 28px; font-weight: 300; color: #525252; }
        .hw-nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .hw-nav-label {
          font-size: 13px; font-style: italic; color: #7D8471;
          opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* Left panel — Poem Frame (wider) */
        .hw-left-panel {
          flex: 1.4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* Workshop label above frame */
        .hw-workshop-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--hw-gold-dim);
          text-align: center;
          margin-bottom: 12px;
          z-index: 2;
        }

        /* Sunburst behind frame */
        .hw-sunburst {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          pointer-events: none;
          opacity: 0.04;
        }

        /* The ornate frame */
        .hw-frame {
          position: relative;
          width: 90%;
          max-width: 440px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          padding: 28px 24px 20px;
          border: 2px solid rgba(201,169,78,0.3);
          z-index: 2;
        }
        .hw-frame-inner-border {
          position: absolute;
          top: 8px; left: 8px; right: 8px; bottom: 8px;
          border: 1px solid rgba(201,169,78,0.15);
          pointer-events: none;
        }

        /* Corner ornaments */
        .hw-corner {
          position: absolute;
          width: 20px; height: 20px;
          pointer-events: none;
        }
        .hw-corner svg { width: 100%; height: 100%; }
        .hw-corner.tl { top: -1px; left: -1px; }
        .hw-corner.tr { top: -1px; right: -1px; transform: scaleX(-1); }
        .hw-corner.bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
        .hw-corner.br { bottom: -1px; right: -1px; transform: scale(-1,-1); }

        /* Top diamond ornament */
        .hw-top-diamond {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        /* Shimmer overlay */
        .hw-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 10;
        }
        .hw-shimmer.active::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; right: 0; bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(201,169,78,0.06) 45%,
            rgba(201,169,78,0.06) 55%,
            transparent 70%
          );
          animation: hw-shimmerSlide 0.8s ease forwards;
        }
        @keyframes hw-shimmerSlide {
          from { transform: translateX(0); }
          to { transform: translateX(200%); }
        }

        /* Frame title */
        .hw-frame-title {
          text-align: center;
          margin-bottom: 4px;
        }
        .hw-frame-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 900;
          color: var(--hw-gold);
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 0 0 20px rgba(201,169,78,0.2);
        }
        .hw-frame-title-deco {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
        }
        .hw-frame-title-deco::before, .hw-frame-title-deco::after {
          content: '';
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.3), transparent);
        }
        .hw-frame-title-deco span {
          color: var(--hw-gold-dim);
          font-size: 8px;
        }

        /* Poem area */
        .hw-poem-display {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 8px;
          min-height: 200px;
        }
        .hw-poem-text {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 3vw, 28px);
          font-weight: 400;
          color: var(--hw-gold-light);
          line-height: 2;
          width: 100%;
        }
        .hw-poem-text span {
          cursor: pointer;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-poem-text span:hover {
          color: #fff;
          text-shadow: 0 0 12px rgba(201,169,78,0.4);
        }
        .hw-poem-placeholder {
          text-align: center;
          opacity: 0.15;
        }
        .hw-poem-placeholder-icon {
          font-size: 28px;
          color: var(--hw-gold);
          margin-bottom: 8px;
        }
        .hw-poem-placeholder-text {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-style: italic;
          color: var(--hw-gold);
          line-height: 1.6;
        }

        /* Hint */
        .hw-hint {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 9px;
          font-style: italic;
          color: rgba(201,169,78,0.2);
          margin-bottom: 10px;
          transition: opacity 0.4s;
        }

        /* Frame buttons */
        .hw-frame-btns {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .hw-frame-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 6px 12px;
          border: 1px solid rgba(201,169,78,0.15);
          background: transparent;
          color: var(--hw-gold-dim);
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-frame-btn:hover {
          border-color: rgba(201,169,78,0.4);
          color: var(--hw-gold);
          background: rgba(201,169,78,0.04);
        }
        .hw-frame-btn:disabled { opacity: 0.3; cursor: default; }
        .hw-frame-btn.primary {
          border-color: rgba(201,169,78,0.3);
          background: rgba(201,169,78,0.05);
          color: var(--hw-gold);
        }
        .hw-frame-btn.primary:hover {
          background: rgba(201,169,78,0.12);
        }

        /* Divider */
        .hw-divider {
          width: 1px;
          background: rgba(201,169,78,0.15);
          align-self: stretch;
        }

        /* Right panel — Word Bank (narrower) */
        .hw-right-panel {
          flex: 0 0 320px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-y: auto;
        }

        /* Connectors strip */
        .hw-connectors {
          padding: 16px 16px 12px;
          border-bottom: 1px solid rgba(201,169,78,0.1);
        }
        .hw-connectors-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(138,128,112,0.6);
          margin-bottom: 8px;
        }
        .hw-connectors-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .hw-connector-tile {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-style: italic;
          color: var(--hw-text-dim);
          background: rgba(201,169,78,0.04);
          border: 1px solid rgba(201,169,78,0.08);
          border-radius: 3px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-connector-tile:hover {
          color: var(--hw-gold-dim);
          border-color: rgba(201,169,78,0.2);
          background: rgba(201,169,78,0.08);
        }

        /* Category tabs */
        .hw-cat-tabs {
          display: flex;
          flex-wrap: wrap;
          padding: 12px 16px 0;
          gap: 0;
        }
        .hw-cat-tab {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 8px 10px;
          border: none;
          background: transparent;
          color: var(--hw-text-dim);
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 5px;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-cat-tab:hover { color: var(--hw-gold-dim); }
        .hw-cat-tab.active {
          color: var(--hw-gold);
          border-bottom-color: var(--hw-gold);
        }
        .hw-cat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Plural toggle + shuffle row */
        .hw-tray-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          gap: 8px;
        }
        .hw-plural-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--hw-text-dim);
          font-weight: 600;
        }
        .hw-plural-toggle .active-label {
          color: var(--hw-gold);
        }
        .hw-toggle-switch {
          position: relative;
          width: 36px;
          height: 18px;
          border-radius: 9px;
          border: 1px solid rgba(201,169,78,0.25);
          background: rgba(201,169,78,0.06);
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-toggle-switch.on {
          background: rgba(201,169,78,0.15);
          border-color: rgba(201,169,78,0.5);
        }
        .hw-toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--hw-gold-dim);
          transition: all 0.3s ease;
        }
        .hw-toggle-switch.on .hw-toggle-knob {
          left: 20px;
          background: var(--hw-gold);
        }
        .hw-shuffle-sm {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 10px;
          border: 1px solid rgba(201,169,78,0.15);
          background: transparent;
          color: var(--hw-gold-dim);
          cursor: pointer;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-shuffle-sm:hover {
          border-color: rgba(201,169,78,0.3);
          color: var(--hw-gold);
        }

        /* Word tray */
        .hw-word-tray {
          flex: 1;
          padding: 8px 16px 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-content: flex-start;
          overflow-y: auto;
        }
        .hw-word-tile {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--hw-ink);
          background: linear-gradient(to bottom, var(--hw-cream), var(--hw-cream-dark));
          border: 1px solid rgba(201,169,78,0.2);
          border-left: 3px solid transparent;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4);
          -webkit-tap-highlight-color: transparent;
        }
        .hw-word-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .hw-word-tile:active {
          transform: translateY(0);
        }

        /* ── Mobile: stacked layout ── */
        @media (max-width: 900px) {
          .hw-compose-page {
            flex-direction: column;
          }
          .hw-left-panel {
            min-height: 50vh;
            flex: none;
            height: 50vh;
          }
          .hw-divider {
            width: 100%;
            height: 1px;
          }
          .hw-right-panel {
            min-height: 50vh;
            flex: none;
            height: 50vh;
          }
          .hw-nav { left: 20px; top: 20px; }
          .hw-nav-text { font-size: 24px; }
          .hw-frame { max-width: 360px; min-height: 300px; padding: 20px 16px 16px; }
        }

        @media (max-width: 600px) {
          .hw-left-panel { height: 45vh; }
          .hw-right-panel { height: 55vh; }
          .hw-frame { max-width: 300px; min-height: 240px; }
          .hw-poem-text { font-size: 16px; }
          .hw-word-tile { font-size: 13px; padding: 5px 10px; padding-left: 13px; }
          .hw-frame-btn { font-size: 8px; padding: 5px 8px; }
          .hw-connector-tile { font-size: 12px; padding: 4px 8px; }
          .hw-cat-tab { padding: 6px 8px; font-size: 7px; }
          .hw-tray-controls { padding: 6px 12px; }
        }

        /* ── Display Mode ── */
        .hw-display-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--hw-bg);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hw-displayFadeIn 1s ease;
          overflow: hidden;
        }
        @keyframes hw-displayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Display BG animations container */
        .hw-display-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* Display frame */
        .hw-display-frame {
          position: relative;
          max-width: 540px;
          width: 90%;
          padding: 48px 40px;
          z-index: 2;
          opacity: 0;
          transform: scale(0.8);
          animation: hw-frameEntrance 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
        }
        @keyframes hw-frameEntrance {
          to { opacity: 1; transform: scale(1); }
        }
        .hw-display-frame-outer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 3px solid rgba(201,169,78,0.4);
          pointer-events: none;
        }
        .hw-display-frame-inner {
          position: absolute;
          top: 12px; left: 12px; right: 12px; bottom: 12px;
          border: 1px solid rgba(201,169,78,0.2);
          pointer-events: none;
        }

        /* Display corner ornaments */
        .hw-display-corner {
          position: absolute;
          width: 44px; height: 44px;
          pointer-events: none;
        }
        .hw-display-corner svg { width: 100%; height: 100%; }
        .hw-display-corner.tl { top: -2px; left: -2px; }
        .hw-display-corner.tr { top: -2px; right: -2px; transform: scaleX(-1); }
        .hw-display-corner.bl { bottom: -2px; left: -2px; transform: scaleY(-1); }
        .hw-display-corner.br { bottom: -2px; right: -2px; transform: scale(-1,-1); }

        /* Display deco lines */
        .hw-display-deco {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          width: 200px;
          pointer-events: none;
        }
        .hw-display-deco.top { top: -2px; }
        .hw-display-deco.bottom { bottom: -2px; }
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

        /* Fan ornament */
        .hw-display-fan {
          text-align: center;
          margin-bottom: 16px;
          opacity: 0;
          animation: hw-fadeUp 0.6s ease 1.0s forwards;
        }

        /* Display content animations */
        .hw-display-label {
          text-align: center;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: var(--hw-gold-dim);
          margin-bottom: 20px;
          opacity: 0;
          animation: hw-fadeUp 0.6s ease 1.1s forwards;
        }
        .hw-display-poem {
          text-align: center;
          min-height: 80px;
          margin-bottom: 20px;
          opacity: 0;
          animation: hw-fadeUp 0.8s ease 1.3s forwards;
        }
        .hw-display-poem-line {
          margin-bottom: 4px;
        }
        .hw-display-poem-word {
          font-family: 'Poiret One', sans-serif;
          font-size: clamp(16px, 3vw, 22px);
          color: var(--hw-gold-light);
          line-height: 2.4;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-shadow: 0 0 16px rgba(201,169,78,0.15);
        }
        .hw-display-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          opacity: 0;
          animation: hw-fadeUp 0.6s ease 1.6s forwards;
        }
        .hw-display-divider::before, .hw-display-divider::after {
          content: '';
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.3), transparent);
        }
        .hw-display-divider span {
          color: var(--hw-gold-dim);
          font-size: 8px;
        }

        /* Name input in display */
        .hw-display-name-wrap {
          text-align: center;
          margin-bottom: 20px;
          opacity: 0;
          animation: hw-fadeUp 0.6s ease 1.8s forwards;
        }
        .hw-display-name-input {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--hw-gold);
          text-align: center;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(201,169,78,0.25);
          padding: 4px 12px;
          width: 220px;
          outline: none;
          font-weight: 400;
          transition: border-color 0.3s;
        }
        .hw-display-name-input:focus {
          border-bottom-color: rgba(201,169,78,0.6);
        }
        .hw-display-name-input::placeholder {
          color: rgba(138,128,112,0.5);
          font-style: italic;
          text-transform: none;
          letter-spacing: 1px;
        }
        .hw-display-name-prefix {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          color: var(--hw-text-dim);
          font-weight: 300;
          margin-right: 4px;
        }

        .hw-display-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          opacity: 0;
          animation: hw-fadeUp 0.6s ease 2.0s forwards;
        }
        .hw-display-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 8px 16px;
          border: 1px solid rgba(201,169,78,0.2);
          background: transparent;
          color: var(--hw-gold-dim);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hw-display-btn:hover {
          border-color: rgba(201,169,78,0.5);
          color: var(--hw-gold);
          background: rgba(201,169,78,0.05);
        }

        @keyframes hw-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Floating diamonds (used by themes) */
        @keyframes hw-floatDiamond {
          0% { opacity: 0; transform: rotate(45deg) scale(0.5); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: rotate(45deg) scale(0.5) translateY(-30px); }
        }
        .hw-floating-diamond {
          position: absolute;
          border: 1px solid rgba(201,169,78,0.3);
          animation: hw-floatDiamond var(--dur, 12s) ease-in-out var(--delay, 0s) infinite;
        }

        /* Theme: sunburst pulse */
        .hw-display-sunburst {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: hw-sunburstPulse 4s ease-in-out infinite;
        }
        @keyframes hw-sunburstPulse {
          0%, 100% { opacity: 0.06; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.036; transform: translate(-50%, -50%) scale(0.95); }
        }

        /* Theme: concentric circles */
        .hw-concentric-circle {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(201,169,78,0.1);
          transform: translate(-50%, -50%);
          animation: hw-concentricPulse 3s ease-in-out infinite;
        }
        @keyframes hw-concentricPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Theme: particles */
        .hw-particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: var(--hw-gold);
          animation: hw-particleFall var(--dur, 10s) linear var(--delay, 0s) infinite;
        }
        @keyframes hw-particleFall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: var(--opacity, 0.3); }
          90% { opacity: var(--opacity, 0.3); }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* Theme: chevrons */
        .hw-chevron-row {
          position: absolute;
          left: 0; right: 0;
          display: flex;
          justify-content: space-evenly;
          animation: hw-chevronWave 4s ease-in-out var(--delay, 0s) infinite;
        }
        .hw-chevron-row span {
          font-size: 14px;
          color: rgba(201,169,78,0.08);
        }
        @keyframes hw-chevronWave {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        /* Theme: spirograph petals */
        .hw-petal-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .hw-petal-ring.outer { animation: hw-spinCW 30s linear infinite; }
        .hw-petal-ring.inner { animation: hw-spinCCW 20s linear infinite; }
        @keyframes hw-spinCW { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes hw-spinCCW { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        .hw-petal {
          position: absolute;
          border: 1px solid rgba(201,169,78,0.08);
          border-radius: 50%;
        }

        @media (max-width: 600px) {
          .hw-display-frame { padding: 36px 24px; }
          .hw-display-poem-word { font-size: 16px; letter-spacing: 2px; }
          .hw-display-btn { padding: 6px 12px; font-size: 8px; }
          .hw-display-name-input { width: 180px; font-size: 10px; }
          .hw-display-actions { gap: 6px; }
        }

        /* ── Print Styles ── */
        @media print {
          body, .hw-root { background: white !important; }
          .hw-compose-page, .hw-welcome, .hw-display-bg { display: none !important; }
          .hw-display-overlay {
            position: static !important;
            background: white !important;
            animation: none !important;
          }
          .hw-display-frame {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 40px !important;
          }
          .hw-display-frame-outer { border-color: #C9A94E !important; }
          .hw-display-frame-inner { border-color: rgba(201,169,78,0.4) !important; }
          .hw-display-poem-word {
            color: #1A1208 !important;
            text-shadow: none !important;
          }
          .hw-display-label { color: #8B7535 !important; animation: none !important; opacity: 1 !important; }
          .hw-display-divider { animation: none !important; opacity: 1 !important; }
          .hw-display-divider::before, .hw-display-divider::after { background: #C9A94E !important; }
          .hw-display-divider span { color: #C9A94E !important; }
          .hw-display-name-wrap { animation: none !important; opacity: 1 !important; }
          .hw-display-name-input { color: #1A1208 !important; border-bottom-color: #C9A94E !important; }
          .hw-display-name-prefix { color: #666 !important; }
          .hw-display-fan { animation: none !important; opacity: 1 !important; }
          .hw-display-fan svg line { stroke: #C9A94E !important; }
          .hw-display-poem { animation: none !important; opacity: 1 !important; }
          .hw-display-actions { display: none !important; }
          .hw-display-corner svg path { stroke: rgba(201,169,78,0.6) !important; }
          .hw-display-corner svg rect { fill: rgba(201,169,78,0.5) !important; }
          .hw-display-deco-diamond { background: #C9A94E !important; }
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
        <div className="hw-compose-page">
          <button className="hw-nav" onClick={() => setView('welcome')}>
            <span className="hw-nav-text">M</span>
            <span className="hw-nav-arrow">{'\u2190'}</span>
            <span className="hw-nav-label">Back</span>
          </button>

          {/* LEFT PANEL: Poem Frame */}
          <div className="hw-left-panel">
            {/* Sunburst */}
            <svg className="hw-sunburst" viewBox="0 0 200 200">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1="100" y1="100"
                    x2={100 + Math.cos(rad) * 100}
                    y2={100 + Math.sin(rad) * 100}
                    stroke="var(--hw-gold)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>

            {/* Workshop label */}
            <div className="hw-workshop-label">Poetry Workshop</div>

            <div className="hw-frame">
              <div className="hw-frame-inner-border" />

              {/* Corner ornaments */}
              {['tl', 'tr', 'bl', 'br'].map(pos => (
                <div key={pos} className={`hw-corner ${pos}`}>
                  <svg viewBox="0 0 20 20">
                    <path d="M0,0 L20,0 M0,0 L0,20" stroke="rgba(201,169,78,0.4)" strokeWidth="1.5" fill="none" />
                    <path d="M2,2 L14,14" stroke="rgba(201,169,78,0.25)" strokeWidth="0.5" fill="none" />
                    <rect x="0" y="0" width="4" height="4" fill="rgba(201,169,78,0.3)" />
                  </svg>
                </div>
              ))}

              {/* Top diamond */}
              <div className="hw-top-diamond">
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <path d="M12,0 L24,8 L12,16 L0,8 Z" stroke="rgba(201,169,78,0.35)" strokeWidth="1" fill="none" />
                  <path d="M12,4 L18,8 L12,12 L6,8 Z" fill="rgba(201,169,78,0.15)" />
                </svg>
              </div>

              {/* Shimmer */}
              <div className={`hw-shimmer ${shimmerActive ? 'active' : ''}`} />

              {/* Frame title */}
              <div className="hw-frame-title">
                <h2>Harlem in Words</h2>
                <div className="hw-frame-title-deco">
                  <span>{'\u25C6'}</span>
                </div>
              </div>

              {/* Poem display */}
              <div className="hw-poem-display">
                {!hasWords ? (
                  <div className="hw-poem-placeholder">
                    <div className="hw-poem-placeholder-icon">{'\u270E'}</div>
                    <div className="hw-poem-placeholder-text">
                      Tap words to build<br />your poem here
                    </div>
                  </div>
                ) : (
                  <div className="hw-poem-text">
                    {poem.map((entry) => {
                      if (entry.isLineBreak) return <br key={entry.uid} />;
                      return (
                        <span
                          key={entry.uid}
                          onClick={() => removeEntry(entry.uid)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            removeEntry(entry.uid);
                          }}
                        >
                          {entry.text}{' '}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Hint */}
              <div className="hw-hint" style={{ opacity: hasWords ? 1 : 0 }}>
                tap a word in your poem to remove it
              </div>

              {/* Buttons */}
              <div className="hw-frame-btns">
                <button className="hw-frame-btn" onClick={addLineBreak} disabled={!hasWords}>
                  {'\u21B5'} Line
                </button>
                <button className="hw-frame-btn" onClick={handleUndo} disabled={undoStack.length === 0}>
                  {'\u21A9'} Undo
                </button>
                <button className="hw-frame-btn" onClick={handleClear} disabled={!hasWords}>
                  Clear
                </button>
                <button className="hw-frame-btn primary" onClick={() => setDisplayMode(true)} disabled={!hasWords}>
                  {'\u25C6'} Display
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hw-divider" />

          {/* RIGHT PANEL: Word Bank */}
          <div className="hw-right-panel">
            {/* Connectors */}
            <div className="hw-connectors">
              <div className="hw-connectors-label">Connectors {'\u2014'} tap to add (reusable)</div>
              <div className="hw-connectors-grid">
                {CONNECTORS.map(c => (
                  <button key={c} className="hw-connector-tile" onClick={() => addConnector(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div className="hw-cat-tabs">
              {CATEGORY_ORDER.map(cat => (
                <button
                  key={cat}
                  className={`hw-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="hw-cat-dot" style={{ background: CATEGORY_META[cat].dot }} />
                  {CATEGORY_META[cat].label}
                </button>
              ))}
            </div>

            {/* Plural toggle + shuffle */}
            <div className="hw-tray-controls">
              {categoryHasPluralizable ? (
                <div className="hw-plural-toggle">
                  <span className={!pluralMode ? 'active-label' : ''}>Singular</span>
                  <button
                    className={`hw-toggle-switch ${pluralMode ? 'on' : ''}`}
                    onClick={() => setPluralMode(!pluralMode)}
                  >
                    <span className="hw-toggle-knob" />
                  </button>
                  <span className={pluralMode ? 'active-label' : ''}>Plural</span>
                </div>
              ) : (
                <div />
              )}
              <button className="hw-shuffle-sm" onClick={handleShuffle}>
                {'\u21BB'} Shuffle
              </button>
            </div>

            {/* Word tray */}
            <div className="hw-word-tray">
              {availableWords.map(word => (
                <button
                  key={word}
                  className="hw-word-tile"
                  style={{ borderLeftColor: CATEGORY_META[activeCategory].dot }}
                  onClick={() => addCategoryWord(word, activeCategory)}
                >
                  {pluralMode && pluralise(word) ? pluralise(word) : word}
                </button>
              ))}
              {availableWords.length === 0 && (
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '11px',
                  color: 'var(--hw-text-dim)',
                  fontStyle: 'italic',
                  padding: '20px',
                  opacity: 0.5,
                }}>
                  All {CATEGORY_META[activeCategory].label.toLowerCase()} words used
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DISPLAY MODE ── */}
      {displayMode && (
        <div className="hw-display-overlay">
          {/* Background animations */}
          <div className="hw-display-bg">
            {displayTheme === 0 && <>
              {/* Sunburst + floating diamonds */}
              <svg className="hw-display-sunburst" width="120vmin" height="120vmin" viewBox="0 0 200 200" style={{ width: '120vmin', height: '120vmin' }}>
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i / 36) * 360;
                  const rad = (angle * Math.PI) / 180;
                  return <line key={i} x1="100" y1="100" x2={100 + Math.cos(rad) * 100} y2={100 + Math.sin(rad) * 100} stroke="var(--hw-gold)" strokeWidth="0.5" />;
                })}
              </svg>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="hw-floating-diamond" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${6 + Math.random() * 10}px`,
                  height: `${6 + Math.random() * 10}px`,
                  '--dur': `${8 + Math.random() * 12}s`,
                  '--delay': `${Math.random() * 3}s`,
                } as React.CSSProperties} />
              ))}
            </>}

            {displayTheme === 1 && <>
              {/* Concentric pulsing circles */}
              {[15, 30, 45, 60, 75, 90].map((size, i) => (
                <div key={i} className="hw-concentric-circle" style={{
                  width: `${size}vmin`,
                  height: `${size}vmin`,
                  animationDelay: `${i * 0.3}s`,
                }} />
              ))}
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="hw-floating-diamond" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${6 + Math.random() * 10}px`,
                  height: `${6 + Math.random() * 10}px`,
                  '--dur': `${8 + Math.random() * 12}s`,
                  '--delay': `${Math.random() * 3}s`,
                } as React.CSSProperties} />
              ))}
            </>}

            {displayTheme === 2 && <>
              {/* Gold particle rain */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="hw-particle" style={{
                  left: `${Math.random() * 100}%`,
                  '--dur': `${6 + Math.random() * 8}s`,
                  '--delay': `${Math.random() * 6}s`,
                  '--opacity': `${0.2 + Math.random() * 0.3}`,
                } as React.CSSProperties} />
              ))}
            </>}

            {displayTheme === 3 && <>
              {/* Chevron waves */}
              {Array.from({ length: 8 }).map((_, row) => (
                <div key={row} className="hw-chevron-row" style={{
                  top: `${12 + row * 12}%`,
                  '--delay': `${row * 0.4}s`,
                } as React.CSSProperties}>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <span key={j}>{'\u2303'}</span>
                  ))}
                </div>
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="hw-floating-diamond" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${6 + Math.random() * 10}px`,
                  height: `${6 + Math.random() * 10}px`,
                  '--dur': `${8 + Math.random() * 12}s`,
                  '--delay': `${Math.random() * 3}s`,
                } as React.CSSProperties} />
              ))}
            </>}

            {displayTheme === 4 && <>
              {/* Spirograph petals */}
              <div className="hw-petal-ring outer" style={{ width: '80vmin', height: '80vmin' }}>
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * 360;
                  return (
                    <div key={i} className="hw-petal" style={{
                      width: '30vmin', height: '10vmin',
                      left: '50%', top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(20vmin)`,
                    }} />
                  );
                })}
              </div>
              <div className="hw-petal-ring inner" style={{ width: '50vmin', height: '50vmin' }}>
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (i / 6) * 360 + 15;
                  return (
                    <div key={i} className="hw-petal" style={{
                      width: '20vmin', height: '7vmin',
                      left: '50%', top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(12vmin)`,
                    }} />
                  );
                })}
              </div>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="hw-floating-diamond" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${6 + Math.random() * 10}px`,
                  height: `${6 + Math.random() * 10}px`,
                  '--dur': `${8 + Math.random() * 12}s`,
                  '--delay': `${Math.random() * 3}s`,
                } as React.CSSProperties} />
              ))}
            </>}
          </div>

          {/* Frame */}
          <div className="hw-display-frame">
            <div className="hw-display-frame-outer" />
            <div className="hw-display-frame-inner" />

            {/* Large corner ornaments */}
            {['tl', 'tr', 'bl', 'br'].map(pos => (
              <div key={pos} className={`hw-display-corner ${pos}`}>
                <svg viewBox="0 0 44 44">
                  <path d="M0,0 L44,0 M0,0 L0,44" stroke="rgba(201,169,78,0.4)" strokeWidth="2" fill="none" />
                  <path d="M4,4 L30,30" stroke="rgba(201,169,78,0.2)" strokeWidth="0.5" fill="none" />
                  <rect x="0" y="0" width="6" height="6" fill="rgba(201,169,78,0.3)" />
                </svg>
              </div>
            ))}

            <div className="hw-display-deco top">
              <div className="hw-display-deco-diamond" />
            </div>
            <div className="hw-display-deco bottom">
              <div className="hw-display-deco-diamond" />
            </div>

            {/* Fan ornament */}
            <div className="hw-display-fan">
              <svg width="60" height="30" viewBox="0 0 60 30">
                {Array.from({ length: 9 }).map((_, i) => {
                  const angle = -80 + (i / 8) * 160;
                  const rad = (angle * Math.PI) / 180;
                  const opacity = 0.2 + (1 - Math.abs(i - 4) / 4) * 0.2;
                  return <line key={i} x1="30" y1="30" x2={30 + Math.cos(rad) * 28} y2={30 + Math.sin(rad) * 28} stroke="var(--hw-gold)" strokeWidth="0.5" opacity={opacity} />;
                })}
              </svg>
            </div>

            <div className="hw-display-label">Poetry Workshop</div>

            <div className="hw-display-poem">
              {displayLines.map((line, li) => (
                <div key={li} className="hw-display-poem-line">
                  {line.map((w, wi) => (
                    <span key={w.uid} className="hw-display-poem-word">
                      {w.text}{wi < line.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div className="hw-display-divider">
              <span>{'\u25C6'}</span>
            </div>

            <div className="hw-display-name-wrap">
              <span className="hw-display-name-prefix">{'\u2014'}</span>
              <input
                className="hw-display-name-input"
                type="text"
                placeholder="Your name here"
                value={poetName}
                onChange={e => setPoetName(e.target.value)}
              />
              <span className="hw-display-name-prefix">{'\u2014'}</span>
            </div>

            <div className="hw-display-actions">
              <button className="hw-display-btn" onClick={() => setDisplayMode(false)}>
                Back to Editing
              </button>
              <button className="hw-display-btn" onClick={() => {
                setDisplayMode(false);
                handleClear();
              }}>
                New Poem
              </button>
              <button className="hw-display-btn" onClick={handlePrint}>
                Print
              </button>
              <button className="hw-display-btn" onClick={handleSaveImage}>
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
