'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAudioEngine, useBandBuilder, useQuiz } from './hooks';
import JazzStudio from './JazzStudio';
import BuildABand from './BuildABand';
import NameThatInstrument from './NameThatInstrument';
import ExhibitionNav from '@/components/ExhibitionNav';

const TABS = [
  { id: 'band', label: 'Build a Band' },
  { id: 'studio', label: 'Jazz Studio' },
  { id: 'quiz', label: 'Name That Instrument' },
] as const;

export default function JazzLabPage() {
  const router = useRouter();
  const [view, setView] = useState<'welcome' | 'lab'>('welcome');
  const [activeTab, setActiveTab] = useState<'band' | 'studio' | 'quiz'>('band');
  const [loaded, setLoaded] = useState(false);
  const audioEngine = useAudioEngine();
  const band = useBandBuilder(audioEngine);
  const quiz = useQuiz(audioEngine);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const stopAudio = () => {
    band.stopAll();
    audioEngine.stopAll();
  };

  const handleTabChange = (tab: 'band' | 'studio' | 'quiz') => {
    band.stopAll();
    audioEngine.stopAll();
    setActiveTab(tab);
  };

  // Tabs follow the ARIA pattern: arrows, Home and End move between them.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleTabKey = (e: React.KeyboardEvent, idx: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    handleTabChange(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  // Entering the lab removes the Enter button; put focus on the lab heading.
  const labHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (view === 'lab') labHeadingRef.current?.focus({ preventScroll: true });
  }, [view]);

  return (
    <div style={{ background: 'var(--jl-bg)', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }

        :root {
          --jl-gold: #C9A94E;
          --jl-gold-light: #E8D48B;
          --jl-gold-dim: #8B7535;
          --jl-bg: #0A0A0A;
          --jl-bg-stage: #111111;
          --jl-text: #E8E0D0;
          --jl-text-dim: #8A8070;
          --jl-red: #8B2020;
          --jl-green: #4E8B4E;
        }

        /* ── Loading ── */
        .jl-loading {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--jl-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          transition: opacity 0.6s;
        }
        .jl-loading.hidden { opacity: 0; pointer-events: none; }
        .jl-loading-text {
          font-family: 'Playfair Display', serif;
          color: var(--jl-gold);
          font-size: 18px;
          letter-spacing: 4px;
          animation: jl-fade-pulse 1.5s ease-in-out infinite;
        }
        @keyframes jl-fade-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

        /* ── Navigation ── */
        .jl-nav {
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
        }
        .jl-nav:hover .jl-nav-label, .jl-nav:focus-visible .jl-nav-label { opacity: 1; max-width: 150px; }
        .jl-nav:hover .jl-nav-arrow, .jl-nav:focus-visible .jl-nav-arrow { transform: translateX(-4px); }
        .jl-nav-text { font-size: 28px; font-weight: 300; color: #525252; transition: color 0.3s ease; }
        .jl-nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .jl-nav-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* ── Header ── */
        .jl-header {
          text-align: center;
          padding: 40px 20px 15px;
        }
        .jl-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 900;
          color: var(--jl-gold);
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 0 0 40px rgba(201,169,78,0.3);
        }

        /* ── Tabs ── */
        .jl-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          max-width: 500px;
          margin: 20px auto 0;
          border-bottom: 1px solid rgba(201,169,78,0.2);
        }
        .jl-tab {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 28px;
          border: none;
          background: transparent;
          color: var(--jl-text-dim);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          -webkit-tap-highlight-color: transparent;
        }
        .jl-tab:hover { color: var(--jl-gold-light); }
        .jl-tab.active { color: var(--jl-gold); }
        .jl-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: var(--jl-gold);
        }

        /* ── Instructions ── */
        .jl-instructions {
          text-align: center;
          padding: 20px 20px 25px;
          color: var(--jl-text-dim);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 300;
          line-height: 1.8;
        }
        .jl-instructions em { color: var(--jl-gold-light); font-style: normal; }

        /* ── Stage ── */
        .jl-stage-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        .jl-stage {
          background: var(--jl-bg-stage);
          border: 1px solid rgba(201,169,78,0.2);
          border-radius: 12px;
          padding: 30px 20px 40px;
          position: relative;
          overflow: hidden;
          min-height: 320px;
        }
        .jl-stage::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at center, rgba(201,169,78,0.08) 0%, transparent 70%);
          pointer-events: none;
          transition: all 0.6s ease;
        }
        .jl-stage.has-spotlight::before {
          background: radial-gradient(ellipse at var(--spotlight-x, 50%) 60%, rgba(201,169,78,0.15) 0%, rgba(201,169,78,0.03) 30%, transparent 60%);
        }
        .jl-stage::after {
          content: '';
          position: absolute;
          top: 8px; left: 8px; right: 8px; bottom: 8px;
          border: 1px solid rgba(201,169,78,0.08);
          border-radius: 8px;
          pointer-events: none;
        }
        .jl-stage-label {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--jl-gold-dim);
          font-weight: 600;
          z-index: 2;
        }

        /* ── Instrument Slots ── */
        .jl-band-slots {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 30px;
          min-height: 240px;
          position: relative;
          z-index: 2;
        }
        .jl-slot {
          font: inherit; color: inherit; border: none; background: none; padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          width: 110px;
          -webkit-tap-highlight-color: transparent;
        }
        .jl-slot:hover { transform: translateY(-4px); }
        .jl-slot-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          transition: all 0.4s ease;
          position: relative;
          border: 2px solid rgba(201,169,78,0.15);
          background: rgba(201,169,78,0.03);
          user-select: none;
        }
        .jl-slot.active .jl-slot-icon {
          border-color: rgba(201,169,78,0.5);
          background: rgba(201,169,78,0.05);
          box-shadow: 0 0 15px rgba(201,169,78,0.1);
        }
        .jl-slot.spotlight .jl-slot-icon {
          border-color: var(--jl-gold);
          background: rgba(201,169,78,0.15);
          box-shadow: 0 0 40px rgba(201,169,78,0.35), inset 0 0 25px rgba(201,169,78,0.08);
          animation: jl-pulse-glow 2s ease-in-out infinite;
          transform: scale(1.1);
        }
        @keyframes jl-pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(201,169,78,0.25), inset 0 0 20px rgba(201,169,78,0.05); }
          50% { box-shadow: 0 0 50px rgba(201,169,78,0.4), inset 0 0 30px rgba(201,169,78,0.1); }
        }
        .jl-slot.spotlight .jl-slot-icon::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(201,169,78,0.3);
          animation: jl-sound-wave 1.5s ease-out infinite;
        }
        @keyframes jl-sound-wave {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .jl-slot.dimmed { opacity: 0.4; }
        .jl-slot.dimmed:hover { opacity: 0.7; }
        .jl-slot.active.backing { opacity: 0.65; }
        .jl-slot-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
          transition: all 0.4s;
          user-select: none;
        }
        .jl-slot.active .jl-slot-name { color: rgba(201,169,78,0.7); }
        .jl-slot.spotlight .jl-slot-name { color: var(--jl-gold); font-weight: 700; }

        /* ── Section Selector ── */
        .jl-section-container {
          max-width: 900px;
          margin: 0 auto 20px;
          padding: 0 20px;
          text-align: center;
        }
        .jl-section-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--jl-gold-dim);
          font-weight: 600;
          margin-bottom: 14px;
        }
        .jl-section-selector {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .jl-section-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 6px 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
          min-width: 65px;
        }
        .jl-section-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(201,169,78,0.2);
          background: rgba(201,169,78,0.03);
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--jl-text-dim);
          transition: all 0.3s;
        }
        .jl-section-btn:hover .jl-section-num {
          border-color: rgba(201,169,78,0.5);
          color: var(--jl-gold-light);
        }
        .jl-section-btn.active .jl-section-num {
          border-color: var(--jl-gold);
          background: rgba(201,169,78,0.15);
          color: var(--jl-gold);
          box-shadow: 0 0 20px rgba(201,169,78,0.3), 0 0 40px rgba(201,169,78,0.1);
        }
        .jl-section-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
          white-space: nowrap;
          transition: color 0.3s;
        }
        .jl-section-btn.active .jl-section-name {
          color: var(--jl-gold-light);
        }

        /* ── Unavailable instrument ── */
        .jl-slot.unavailable {
          opacity: 0.15;
          cursor: not-allowed;
          pointer-events: none;
        }
        .jl-slot.unavailable .jl-slot-icon {
          filter: grayscale(100%);
          border-color: rgba(201,169,78,0.06);
        }

        /* ── Now Playing / EQ ── */
        .jl-now-playing {
          text-align: center;
          padding: 15px 20px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .jl-now-playing span { color: var(--jl-gold); font-weight: 600; }
        .jl-eq-bars {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 25px;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .jl-eq-bars.playing { opacity: 1; }
        .jl-eq-bar {
          width: 3px;
          background: var(--jl-gold);
          border-radius: 2px 2px 0 0;
          opacity: 0.6;
        }

        /* ── Controls ── */
        .jl-controls {
          max-width: 900px;
          margin: 25px auto;
          padding: 0 20px;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .jl-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 24px;
          border: 1px solid var(--jl-gold-dim);
          background: transparent;
          color: var(--jl-gold);
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 4px;
          -webkit-tap-highlight-color: transparent;
        }
        .jl-btn:hover { background: rgba(201,169,78,0.1); border-color: var(--jl-gold); }
        .jl-btn-stop { border-color: var(--jl-red); color: #cc4444; }
        .jl-btn-stop:hover { background: rgba(139,32,32,0.15); border-color: #cc4444; }

        /* ── Info Card ── */
        .jl-info-panel { max-width: 900px; margin: 20px auto; padding: 0 20px; }
        .jl-info-card {
          background: rgba(201,169,78,0.03);
          border: 1px solid rgba(201,169,78,0.1);
          border-radius: 8px;
          padding: 24px 28px;
          animation: jl-fadeIn 0.4s ease;
        }
        @keyframes jl-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .jl-info-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--jl-gold);
          margin-bottom: 8px;
        }
        .jl-info-card p {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: var(--jl-text-dim);
          font-weight: 300;
        }
        .jl-info-card .jl-fact {
          font-style: italic;
          color: var(--jl-gold-light);
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(201,169,78,0.1);
        }

        /* ── Quiz ── */
        .jl-quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .jl-quiz-stage {
          background: var(--jl-bg-stage);
          border: 1px solid rgba(201,169,78,0.2);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .jl-quiz-stage::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at center, rgba(201,169,78,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .jl-quiz-play-btn {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid var(--jl-gold);
          background: rgba(201,169,78,0.08);
          color: var(--jl-gold);
          font-size: 40px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          z-index: 2;
        }
        .jl-quiz-play-btn:hover {
          background: rgba(201,169,78,0.15);
          box-shadow: 0 0 30px rgba(201,169,78,0.2);
        }
        .jl-quiz-play-btn.playing { animation: jl-pulse-glow 1.5s ease-in-out infinite; }
        .jl-quiz-prompt {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--jl-text);
          margin-bottom: 5px;
          position: relative;
          z-index: 2;
        }
        .jl-quiz-hint {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          color: var(--jl-text-dim);
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 300;
          position: relative;
          z-index: 2;
        }
        .jl-quiz-progress {
          font-family: 'Josefin Sans', sans-serif;
          text-align: center;
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--jl-text-dim);
          font-weight: 300;
          position: relative;
          z-index: 2;
        }

        /* ── Quiz Answers ── */
        .jl-quiz-answers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .jl-quiz-answer {
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 10px;
          border: 1.5px solid rgba(201,169,78,0.15);
          border-radius: 10px;
          background: rgba(201,169,78,0.02);
          cursor: pointer;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
          font-family: 'Josefin Sans', sans-serif;
        }
        .jl-quiz-answer:hover {
          border-color: rgba(201,169,78,0.4);
          background: rgba(201,169,78,0.06);
        }
        .jl-quiz-answer .jl-answer-emoji { font-size: 32px; }
        .jl-quiz-answer .jl-answer-name {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
        }
        .jl-quiz-answer.correct {
          border-color: var(--jl-green);
          background: rgba(78,139,78,0.15);
          animation: jl-correct-pop 0.4s ease;
        }
        .jl-quiz-answer.correct .jl-answer-name { color: #7BC67B; }
        @keyframes jl-correct-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .jl-quiz-answer.wrong {
          border-color: var(--jl-red);
          background: rgba(139,32,32,0.1);
          animation: jl-wrong-shake 0.4s ease;
        }
        @keyframes jl-wrong-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .jl-quiz-answer.disabled { pointer-events: none; opacity: 0.4; }

        /* ── Quiz Score ── */
        .jl-quiz-score-bar {
          text-align: center;
          margin-top: 25px;
          display: flex;
          justify-content: center;
          gap: 30px;
        }
        .jl-score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .jl-score-number {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: var(--jl-gold);
          font-weight: 700;
        }
        .jl-score-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
        }

        /* ── Game Over ── */
        .jl-gameover {
          text-align: center;
          padding: 40px 20px;
          animation: jl-fadeIn 0.6s ease;
        }
        .jl-gameover-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: var(--jl-gold);
          margin-bottom: 8px;
        }
        .jl-gameover-score {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          color: var(--jl-text-dim);
          font-weight: 300;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .jl-gameover-score span { color: var(--jl-gold); font-weight: 600; }

        /* ── Deco ── */
        .jl-deco-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 0;
          max-width: 400px;
          margin: 0 auto;
        }
        .jl-deco-line::before, .jl-deco-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.3), transparent);
        }
        .jl-deco-diamond {
          width: 6px;
          height: 6px;
          background: var(--jl-gold-dim);
          transform: rotate(45deg);
        }

        /* ── Footer ── */
        .jl-footer {
          text-align: center;
          padding: 20px 20px 40px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          color: var(--jl-text-dim);
          letter-spacing: 2px;
          font-weight: 300;
        }

        /* ── Welcome Screen ── */
        .jl-welcome {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0A0A0A;
        }
        .jl-welcome::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(201,169,78,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(139,32,32,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .jl-welcome-deco-top,
        .jl-welcome-deco-bottom {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          width: 300px;
        }
        .jl-welcome-deco-top { top: 60px; }
        .jl-welcome-deco-bottom { bottom: 60px; }
        .jl-welcome-deco-top::before, .jl-welcome-deco-top::after,
        .jl-welcome-deco-bottom::before, .jl-welcome-deco-bottom::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,78,0.4), transparent);
        }
        .jl-welcome-deco-diamond {
          width: 8px;
          height: 8px;
          background: var(--jl-gold-dim);
          transform: rotate(45deg);
        }
        .jl-welcome-content {
          position: relative;
          z-index: 2;
          text-align: center;
          animation: jl-fadeIn 1s ease;
        }
        .jl-welcome-subtitle-top {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--jl-gold-dim);
          margin-bottom: 20px;
          font-weight: 600;
        }
        .jl-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 900;
          color: var(--jl-gold);
          letter-spacing: 6px;
          text-transform: uppercase;
          text-shadow: 0 0 60px rgba(201,169,78,0.25);
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .jl-welcome-premise {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 2.5vw, 17px);
          line-height: 1.8;
          color: rgba(232,224,208,0.65);
          font-weight: 300;
          max-width: 460px;
          margin: 0 auto 24px;
        }
        .jl-welcome-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 3vw, 22px);
          font-style: italic;
          color: var(--jl-text-dim);
          font-weight: 400;
          margin-bottom: 50px;
        }
        .jl-welcome-enter {
          display: inline-block;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 5px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 16px 48px;
          border: 1.5px solid var(--jl-gold);
          background: transparent;
          color: var(--jl-gold);
          cursor: pointer;
          transition: all 0.4s ease;
          border-radius: 2px;
        }
        .jl-welcome-enter:hover {
          background: rgba(201,169,78,0.12);
          box-shadow: 0 0 40px rgba(201,169,78,0.15);
          letter-spacing: 7px;
        }
        .jl-welcome-back {
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
        .jl-welcome-back-text { font-size: 28px; font-weight: 300; color: #525252; }
        .jl-welcome-back-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .jl-welcome-back-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }
        .jl-welcome-back:hover .jl-welcome-back-label { opacity: 1; max-width: 150px; }
        .jl-welcome-back:hover .jl-welcome-back-arrow { transform: translateX(-4px); }

        @media (max-width: 768px) {
          .jl-welcome-back { left: 20px; top: 20px; }
          .jl-welcome-back-text { font-size: 24px; }
          .jl-welcome-deco-top, .jl-welcome-deco-bottom { width: 200px; }
        }

        /* ── Responsive ── */
        /* Tablet */
        @media (max-width: 768px) {
          .jl-nav { left: 20px; top: 20px; }
          .jl-nav-text { font-size: 24px; }
          .jl-band-slots {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px 12px;
            justify-items: center;
          }
          .jl-slot { width: 100%; max-width: 130px; }
        }
        /* Phone */
        @media (max-width: 600px) {
          .jl-band-slots { gap: 14px 8px; }
          .jl-slot { max-width: 110px; }
          .jl-slot-icon { width: 64px; height: 64px; font-size: 28px; }
          .jl-slot-name { font-size: 9px; letter-spacing: 1px; }
          .jl-controls { gap: 10px; }
          .jl-btn { padding: 10px 16px; font-size: 10px; letter-spacing: 2px; }
          .jl-quiz-answers { grid-template-columns: repeat(2, 1fr); }
          .jl-tab { padding: 12px 18px; font-size: 10px; letter-spacing: 2px; }
          .jl-section-selector {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
          }
          .jl-section-btn { min-width: unset; padding: 8px 4px; }
          .jl-section-num { width: 32px; height: 32px; font-size: 14px; }
          .jl-section-name { font-size: 7px; }
        }
      `}</style>

      {/* ── WELCOME SCREEN ── */}
      {view === 'welcome' && (
        <div className="jl-welcome">
          <button className="jl-welcome-back" onClick={() => router.push('/exhibitions/harlem-renaissance/artifacts')}>
            <span className="jl-welcome-back-text">M</span>
            <span className="jl-welcome-back-arrow">{'\u2190'}</span>
            <span className="jl-welcome-back-label">Collection</span>
          </button>
          <div className="jl-welcome-deco-top">
            <div className="jl-welcome-deco-diamond" />
          </div>
          <div className="jl-welcome-content">
            <div className="jl-welcome-subtitle-top">The Mini Museum Presents</div>
            <h1 className="jl-welcome-title">The Jazz Lab</h1>
            <p className="jl-welcome-premise">Born from the genius of Black musicians in the clubs and dance halls of Harlem, jazz became America{'\u2019'}s great art form.</p>
            <p className="jl-welcome-tagline">Step inside. The band is waiting.</p>
            <button className="jl-welcome-enter" onClick={() => setView('lab')}>
              Enter
            </button>
          </div>
          <div className="jl-welcome-deco-bottom">
            <div className="jl-welcome-deco-diamond" />
          </div>
        </div>
      )}

      {/* ── LAB VIEW ── */}
      {view === 'lab' && <>
      {/* Loading overlay */}
      <div className={`jl-loading ${loaded ? 'hidden' : ''}`} role="status" aria-live="polite">
        <div className="jl-loading-text">{loaded ? '' : 'Loading instruments...'}</div>
      </div>

      {/* Navigation */}
      <ExhibitionNav className="jl-nav" href="/exhibitions/harlem-renaissance/artifacts" onClick={stopAudio}>
        <span className="jl-nav-text" aria-hidden="true">M</span>
        <span className="jl-nav-arrow" aria-hidden="true">{'\u2190'}</span>
        <span className="jl-nav-label">Collection</span>
      </ExhibitionNav>

      {/* Header */}
      <div className="jl-header">
        <h1 tabIndex={-1} ref={labHeadingRef} style={{ outline: 'none' }}>The Jazz Lab</h1>
      </div>

      {/* Tabs */}
      <div className="jl-tabs" role="tablist" aria-label="Jazz Lab activities">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`jl-tab-${t.id}`}
            aria-selected={activeTab === t.id}
            aria-controls={`jl-panel-${t.id}`}
            tabIndex={activeTab === t.id ? 0 : -1}
            className={`jl-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTabChange(t.id)}
            onKeyDown={(e) => handleTabKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BUILD A BAND ── */}
      {activeTab === 'band' && <BuildABand band={band} />}

      {/* ── JAZZ STUDIO ── */}
      {activeTab === 'studio' && (
        <div role="tabpanel" id="jl-panel-studio" aria-labelledby="jl-tab-studio"><JazzStudio /></div>
      )}

      {/* ── NAME THAT INSTRUMENT ── */}
      {activeTab === 'quiz' && <NameThatInstrument quiz={quiz} />}

      <div className="jl-deco-line"><div className="jl-deco-diamond" /></div>

      <div className="jl-footer">
        The Mini Museum &mdash; Harlem Renaissance Exhibition
      </div>
      </>}
    </div>
  );
}
