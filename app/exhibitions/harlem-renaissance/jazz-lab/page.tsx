'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAudioEngine, useBandBuilder, useQuiz } from './hooks';
import { INSTRUMENTS, INSTRUMENT_MAP, ALL_INSTRUMENT_IDS, type InstrumentId } from './data';

export default function JazzLabPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'band' | 'quiz'>('band');
  const [loaded, setLoaded] = useState(false);
  const audioEngine = useAudioEngine();
  const band = useBandBuilder(audioEngine);
  const quiz = useQuiz(audioEngine);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    band.stopAll();
    audioEngine.stopAll();
    router.push('/exhibitions/harlem-renaissance');
  };

  const handleTabChange = (tab: 'band' | 'quiz') => {
    band.stopAll();
    audioEngine.stopAll();
    setActiveTab(tab);
  };

  // Spotlight instrument for info card
  const spotlightInstrument = band.spotlight ? INSTRUMENT_MAP[band.spotlight] : null;

  // Compute spotlight position for stage glow
  const spotlightIdx = band.spotlight ? INSTRUMENTS.findIndex(i => i.id === band.spotlight) : -1;
  const spotlightX = spotlightIdx >= 0 ? `${((spotlightIdx + 0.5) / INSTRUMENTS.length) * 100}%` : '50%';

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
        .jl-nav:hover .jl-nav-label { opacity: 1; max-width: 150px; }
        .jl-nav:hover .jl-nav-arrow { transform: translateX(-4px); }
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

        /* ── Variant Dots ── */
        .jl-variant-dots { display: flex; gap: 6px; margin-top: 2px; }
        .jl-variant-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,169,78,0.3);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
          padding: 0;
        }
        .jl-variant-dot:hover { border-color: var(--jl-gold); }
        .jl-variant-dot.selected { background: var(--jl-gold); border-color: var(--jl-gold); }

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

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .jl-nav { left: 20px; top: 20px; }
          .jl-nav-text { font-size: 24px; }
        }
        @media (max-width: 600px) {
          .jl-band-slots { gap: 8px; }
          .jl-slot { width: 85px; }
          .jl-slot-icon { width: 64px; height: 64px; font-size: 28px; }
          .jl-slot-name { font-size: 9px; letter-spacing: 1px; }
          .jl-variant-dot { width: 12px; height: 12px; }
          .jl-controls { gap: 10px; }
          .jl-btn { padding: 10px 16px; font-size: 10px; letter-spacing: 2px; }
          .jl-quiz-answers { grid-template-columns: repeat(2, 1fr); }
          .jl-tab { padding: 12px 18px; font-size: 10px; letter-spacing: 2px; }
        }
      `}</style>

      {/* Loading overlay */}
      <div className={`jl-loading ${loaded ? 'hidden' : ''}`}>
        <div className="jl-loading-text">Loading instruments...</div>
      </div>

      {/* Navigation */}
      <div className="jl-nav" onClick={handleBack}>
        <span className="jl-nav-text">M</span>
        <span className="jl-nav-arrow">{'\u2190'}</span>
        <span className="jl-nav-label">Exhibition</span>
      </div>

      {/* Header */}
      <div className="jl-header">
        <h1>The Jazz Lab</h1>
      </div>

      {/* Tabs */}
      <div className="jl-tabs">
        <button
          className={`jl-tab ${activeTab === 'band' ? 'active' : ''}`}
          onClick={() => handleTabChange('band')}
        >
          Build a Band
        </button>
        <button
          className={`jl-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => handleTabChange('quiz')}
        >
          Name That Instrument
        </button>
      </div>

      {/* ── BUILD A BAND ── */}
      {activeTab === 'band' && (
        <div>
          <div className="jl-instructions">
            Tap to <em>add an instrument</em>. Tap a playing instrument to <em>give it the solo</em>.<br />
            Tap the soloist again to <em>take it off stage</em>.
          </div>

          <div className="jl-stage-container">
            <div
              className={`jl-stage ${band.spotlight ? 'has-spotlight' : ''}`}
              style={{ '--spotlight-x': spotlightX } as React.CSSProperties}
            >
              <div className="jl-stage-label">{'\u{25C6}'} The Stage {'\u{25C6}'}</div>
              <div className="jl-band-slots">
                {INSTRUMENTS.map((inst) => {
                  const isActive = band.playing.has(inst.id);
                  const isSpotlight = band.spotlight === inst.id;
                  const isBacking = isActive && band.spotlight !== null && !isSpotlight;
                  const isDimmed = !isActive && band.playing.size > 0 && band.spotlight !== null;
                  const currentVariant = band.playing.get(inst.id) ?? 0;

                  return (
                    <div
                      key={inst.id}
                      className={`jl-slot ${isActive ? 'active' : ''} ${isSpotlight ? 'spotlight' : ''} ${isBacking ? 'backing' : ''} ${isDimmed ? 'dimmed' : ''}`}
                      onClick={() => band.tapInstrument(inst.id)}
                    >
                      <div className="jl-slot-icon">
                        {inst.emoji}
                      </div>
                      <div className="jl-slot-name">{inst.name}</div>
                      {isActive && inst.variants.length > 1 && (
                        <div className="jl-variant-dots">
                          {inst.variants.map((v, vi) => (
                            <button
                              key={v.id}
                              className={`jl-variant-dot ${vi === currentVariant ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                band.changeVariant(inst.id, vi);
                              }}
                              aria-label={v.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="jl-now-playing">
            <EqBars isPlaying={band.playing.size > 0} />
            <div>
              {band.playing.size === 0
                ? 'Tap an instrument to begin'
                : band.spotlight
                  ? <><span>{INSTRUMENT_MAP[band.spotlight].name}</span> soloing</>
                  : <><span>{band.playing.size}</span> instrument{band.playing.size > 1 ? 's' : ''} playing</>
              }
            </div>
          </div>

          <div className="jl-controls">
            <button className="jl-btn jl-btn-stop" onClick={band.stopAll}>
              Stop All
            </button>
            <button className="jl-btn" onClick={band.surpriseMe}>
              Surprise Me
            </button>
          </div>

          <div className="jl-info-panel">
            {spotlightInstrument && (
              <div className="jl-info-card" key={spotlightInstrument.id}>
                <h3>{spotlightInstrument.fact.title}</h3>
                <p>{spotlightInstrument.fact.text}</p>
                <div className="jl-fact">{spotlightInstrument.fact.quote}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NAME THAT INSTRUMENT ── */}
      {activeTab === 'quiz' && (
        <div>
          <div className="jl-instructions">
            Listen to the sound and <em>tap the instrument</em> you think it is.
          </div>

          <div className="jl-quiz-container">
            {quiz.gameState !== 'gameover' ? (
              <>
                <div className="jl-quiz-stage">
                  <button
                    className={`jl-quiz-play-btn ${quiz.isQuizPlaying ? 'playing' : ''}`}
                    onClick={() => {
                      if (quiz.gameState === 'idle') {
                        quiz.startGame();
                      } else {
                        quiz.replaySound();
                      }
                    }}
                  >
                    {quiz.isQuizPlaying ? '\u{266A}' : '\u{25B6}'}
                  </button>
                  <div className="jl-quiz-prompt">
                    {quiz.gameState === 'idle'
                      ? 'Tap play to start the quiz'
                      : quiz.gameState === 'answered'
                        ? quiz.lastAnswer?.correct ? 'Correct!' : `That was the ${INSTRUMENT_MAP[quiz.lastAnswer?.correctAnswer ?? 'piano'].name}`
                        : 'What instrument is this?'
                    }
                  </div>
                  <div className="jl-quiz-hint">
                    {quiz.gameState === 'idle' ? '10 rounds' : 'Listen carefully...'}
                  </div>
                  {quiz.gameState !== 'idle' && (
                    <div className="jl-quiz-progress">
                      Round {quiz.currentRound + 1} of {quiz.totalRounds}
                    </div>
                  )}
                </div>

                {quiz.gameState !== 'idle' && (
                  <div className="jl-quiz-answers">
                    {INSTRUMENTS.map((inst) => {
                      const isAnswered = quiz.gameState === 'answered';
                      const isChosen = quiz.lastAnswer?.chosen === inst.id;
                      const isCorrectAnswer = quiz.lastAnswer?.correctAnswer === inst.id;
                      let className = 'jl-quiz-answer';
                      if (isAnswered) {
                        if (isChosen && quiz.lastAnswer?.correct) className += ' correct';
                        else if (isChosen && !quiz.lastAnswer?.correct) className += ' wrong';
                        else if (isCorrectAnswer) className += ' correct';
                        else className += ' disabled';
                      }

                      return (
                        <div
                          key={inst.id}
                          className={className}
                          onClick={() => {
                            if (quiz.gameState === 'playing') {
                              quiz.submitAnswer(inst.id);
                            }
                          }}
                        >
                          <span className="jl-answer-emoji">{inst.emoji}</span>
                          <span className="jl-answer-name">{inst.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="jl-quiz-score-bar">
                  <div className="jl-score-item">
                    <div className="jl-score-number">{quiz.score}</div>
                    <div className="jl-score-label">Correct</div>
                  </div>
                  <div className="jl-score-item">
                    <div className="jl-score-number">{quiz.totalAnswered}</div>
                    <div className="jl-score-label">Played</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="jl-gameover">
                <div className="jl-gameover-title">{quiz.getRating()?.label}</div>
                <div className="jl-gameover-score">
                  You got <span>{quiz.score}</span> out of <span>{quiz.totalRounds}</span> correct.<br />
                  {quiz.getRating()?.message}
                </div>
                <button className="jl-btn" onClick={quiz.startGame}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="jl-deco-line"><div className="jl-deco-diamond" /></div>

      <div className="jl-footer">
        The Mini Museum &mdash; Harlem Renaissance Exhibition
      </div>
    </div>
  );
}

// ── EQ Bars sub-component ──
function EqBars({ isPlaying }: { isPlaying: boolean }) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || !barsRef.current) return;
    const bars = barsRef.current.children;
    let animId: number;

    const animate = () => {
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i] as HTMLDivElement;
        const h = 4 + Math.random() * 18;
        bar.style.height = `${h}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    // Throttle to ~15fps for performance
    const interval = setInterval(() => {
      animId = requestAnimationFrame(animate);
    }, 66);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div ref={barsRef} className={`jl-eq-bars ${isPlaying ? 'playing' : ''}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="jl-eq-bar" style={{ height: '4px' }} />
      ))}
    </div>
  );
}
