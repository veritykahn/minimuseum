'use client';

import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { STUDIO_KITS, type StudioKit } from './studio-data';

// ─── Types ──────────────────────────────────────────────────────────────────

type SlotState = {
  section: number;
  activeTracks: Set<string>;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function createDefaultSlots(kit: StudioKit): SlotState[] {
  return kit.defaultArrangement.map(section => ({
    section,
    activeTracks: new Set(
      kit.tracks
        .filter(t => t.sections[section] !== undefined)
        .map(t => t.id)
    ),
  }));
}

function encodeWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const len = buffer.length;
  const dataSize = len * numCh * 2;
  const buf = new ArrayBuffer(44 + dataSize);
  const v = new DataView(buf);

  const w = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  w(0, 'RIFF');
  v.setUint32(4, 36 + dataSize, true);
  w(8, 'WAVE');
  w(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, numCh, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * numCh * 2, true);
  v.setUint16(32, numCh * 2, true);
  v.setUint16(34, 16, true);
  w(36, 'data');
  v.setUint32(40, dataSize, true);

  const channels = Array.from({ length: numCh }, (_, i) => buffer.getChannelData(i));
  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, channels[ch][i]));
      v.setInt16(offset, s * (s < 0 ? 0x8000 : 0x7FFF), true);
      offset += 2;
    }
  }
  return new Blob([buf], { type: 'audio/wav' });
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function JazzStudio() {
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const kit = selectedKitId ? STUDIO_KITS.find(k => k.id === selectedKitId) ?? null : null;

  return (
    <div>
      <style jsx global>{`
        /* ── Kit Selector ── */
        .js-select {
          text-align: center;
          padding: 10px 20px 40px;
        }
        .js-select-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          color: var(--jl-text-dim);
          font-weight: 300;
          letter-spacing: 1px;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .js-kits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 28px;
          max-width: 720px;
          margin: 0 auto;
          justify-items: center;
        }
        .js-record {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.3s;
        }
        .js-record:hover { transform: translateY(-6px); }
        .js-record:hover .js-vinyl { animation: js-spin 3s linear infinite; }
        .js-vinyl {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background:
            radial-gradient(circle, #1a1a1a 18%, transparent 19%),
            radial-gradient(circle, rgba(201,169,78,0.5) 19%, transparent 20%),
            radial-gradient(circle, #1a1a1a 20%, transparent 21%),
            repeating-radial-gradient(circle, transparent 22%, rgba(60,60,60,0.3) 24%, transparent 26%),
            radial-gradient(circle, #111 0%, #1a1a1a 100%);
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          transition: box-shadow 0.3s;
        }
        .js-record:hover .js-vinyl {
          box-shadow: 0 4px 30px rgba(201,169,78,0.2), 0 4px 20px rgba(0,0,0,0.5);
        }
        @keyframes js-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .js-vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--jl-gold), var(--jl-gold-dim));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 1px;
        }
        .js-record-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--jl-text);
        }
        .js-record-meta {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
        }

        /* ── Arranger ── */
        .js-arranger {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px 40px;
        }
        .js-arr-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 0 20px;
          flex-wrap: wrap;
        }
        .js-arr-back {
          background: none;
          border: 1px solid rgba(201,169,78,0.2);
          color: var(--jl-gold-dim);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
        }
        .js-arr-back:hover { border-color: var(--jl-gold); color: var(--jl-gold); }
        .js-arr-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--jl-gold);
          flex: 1;
        }
        .js-arr-meta {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
        }

        /* ── Grid ── */
        .js-grid-wrap {
          position: relative;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid rgba(201,169,78,0.15);
          border-radius: 8px;
          background: var(--jl-bg-stage);
        }
        .js-grid {
          display: grid;
          min-width: max-content;
        }
        .js-grid-corner {
          position: sticky;
          left: 0;
          z-index: 4;
          background: var(--jl-bg-stage);
          border-right: 1px solid rgba(201,169,78,0.1);
          border-bottom: 1px solid rgba(201,169,78,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .js-grid-slot-header {
          border-bottom: 1px solid rgba(201,169,78,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 6px;
          min-width: 80px;
        }
        .js-grid-slot-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
        }
        .js-section-stepper {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .js-section-arrow {
          background: none;
          border: 1px solid rgba(201,169,78,0.2);
          color: var(--jl-gold-dim);
          width: 22px;
          height: 22px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .js-section-arrow:hover { border-color: var(--jl-gold); color: var(--jl-gold); }
        .js-section-num {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--jl-gold);
          min-width: 22px;
          text-align: center;
        }
        .js-grid-track-label {
          position: sticky;
          left: 0;
          z-index: 3;
          background: var(--jl-bg-stage);
          border-right: 1px solid rgba(201,169,78,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          min-width: 110px;
        }
        .js-track-emoji { font-size: 20px; }
        .js-track-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--jl-text-dim);
          font-weight: 600;
          white-space: nowrap;
        }
        .js-cell {
          min-width: 80px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          margin: 2px;
          border-radius: 4px;
          -webkit-tap-highlight-color: transparent;
        }
        .js-cell:hover { border-color: rgba(201,169,78,0.3); }
        .js-cell.active {
          background: rgba(201,169,78,0.15);
          border-color: rgba(201,169,78,0.3);
          box-shadow: inset 0 0 12px rgba(201,169,78,0.1);
        }
        .js-cell.active .js-cell-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--jl-gold);
          box-shadow: 0 0 8px rgba(201,169,78,0.4);
        }
        .js-cell.inactive {
          background: rgba(255,255,255,0.02);
        }
        .js-cell.inactive .js-cell-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,78,0.2);
        }
        .js-cell.unavailable {
          opacity: 0.12;
          cursor: not-allowed;
          pointer-events: none;
          background: repeating-linear-gradient(
            45deg, transparent, transparent 4px, rgba(201,169,78,0.05) 4px, rgba(201,169,78,0.05) 8px
          );
        }
        .js-cell.playing-now {
          background: rgba(201,169,78,0.25);
          box-shadow: inset 0 0 20px rgba(201,169,78,0.15);
        }

        /* ── Add/Remove Slot ── */
        .js-grid-add {
          border-bottom: 1px solid rgba(201,169,78,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 44px;
        }
        .js-add-btn, .js-remove-btn {
          background: none;
          border: 1px solid rgba(201,169,78,0.15);
          color: var(--jl-gold-dim);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .js-add-btn:hover, .js-remove-btn:hover {
          border-color: var(--jl-gold);
          color: var(--jl-gold);
        }
        .js-remove-btn { font-size: 14px; }
        .js-grid-add-spacer {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
        }

        /* ── Playhead ── */
        .js-playhead {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--jl-gold);
          z-index: 5;
          pointer-events: none;
          box-shadow: 0 0 8px rgba(201,169,78,0.5);
          transition: left 60ms linear;
        }

        /* ── Transport ── */
        .js-transport {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 24px 0 10px;
          flex-wrap: wrap;
        }
        .js-transport .jl-btn.active {
          background: rgba(201,169,78,0.15);
          border-color: var(--jl-gold);
        }
        .js-transport .jl-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* ── Loading ── */
        .js-loading {
          text-align: center;
          padding: 60px 20px;
        }
        .js-loading-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: var(--jl-gold);
          margin-bottom: 16px;
        }
        .js-loading-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          color: var(--jl-text-dim);
          letter-spacing: 2px;
          margin-bottom: 24px;
          font-weight: 300;
        }
        .js-progress-track {
          width: 200px;
          height: 3px;
          background: rgba(201,169,78,0.15);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }
        .js-progress-fill {
          height: 100%;
          background: var(--jl-gold);
          border-radius: 2px;
          transition: width 0.3s;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .js-kits { gap: 20px; grid-template-columns: repeat(2, 1fr); }
          .js-vinyl { width: 100px; height: 100px; }
          .js-vinyl-label { width: 36px; height: 36px; font-size: 9px; }
          .js-record-name { font-size: 13px; }
          .js-arr-title { font-size: 18px; }
          .js-grid-track-label { min-width: 90px; padding: 8px; }
          .js-track-emoji { font-size: 16px; }
          .js-track-name { font-size: 8px; }
          .js-cell { min-width: 64px; height: 40px; }
          .js-grid-slot-header { min-width: 64px; }
        }
      `}</style>

      {!kit ? (
        <div className="js-select">
          <div className="js-select-subtitle">
            Pick a song, arrange the sections, and create your own jazz recording.
          </div>
          <div className="js-kits">
            {STUDIO_KITS.map(k => (
              <button key={k.id} className="js-record" onClick={() => setSelectedKitId(k.id)}>
                <div className="js-vinyl">
                  <div className="js-vinyl-label">
                    {k.id.toUpperCase()}
                  </div>
                </div>
                <div className="js-record-name">{k.name}</div>
                <div className="js-record-meta">{k.bpm} BPM &middot; {k.musicalKey}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <StudioArranger
          key={kit.id}
          kit={kit}
          onBack={() => setSelectedKitId(null)}
        />
      )}
    </div>
  );
}

// ─── Studio Arranger ────────────────────────────────────────────────────────

function StudioArranger({ kit, onBack }: { kit: StudioKit; onBack: () => void }) {
  // Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const scheduledRef = useRef<AudioBufferSourceNode[]>([]);
  const animRef = useRef<number>(0);
  const isLoopingRef = useRef(false);
  const lastSlotRef = useRef(-1);

  // DOM refs for playhead
  const gridRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // State
  const [slots, setSlots] = useState<SlotState[]>(() => createDefaultSlots(kit));
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(-1);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync loop ref
  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);

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

  // Stop helper (no state reset)
  const stopSources = useCallback(() => {
    scheduledRef.current.forEach(source => {
      try { source.stop(); } catch { /* already stopped */ }
      source.disconnect();
    });
    scheduledRef.current = [];
    cancelAnimationFrame(animRef.current);
  }, []);

  // Full stop
  const stop = useCallback(() => {
    stopSources();
    setIsPlaying(false);
    setCurrentSlot(-1);
    lastSlotRef.current = -1;
    if (playheadRef.current) playheadRef.current.style.display = 'none';
  }, [stopSources]);

  // Preload all audio for the kit
  useEffect(() => {
    let cancelled = false;
    const ctx = ensureContext();
    const allPaths: string[] = [];

    kit.tracks.forEach(track => {
      Object.values(track.sections).forEach(path => {
        if (!bufferCacheRef.current.has(path)) allPaths.push(path);
      });
    });

    if (allPaths.length === 0) {
      setIsLoaded(true);
      setLoadProgress(1);
      return;
    }

    let loaded = 0;
    Promise.all(allPaths.map(async (src) => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        bufferCacheRef.current.set(src, audioBuffer);
      } catch (e) {
        console.warn(`Failed to load ${src}`, e);
      }
      loaded++;
      if (!cancelled) setLoadProgress(loaded / allPaths.length);
    })).then(() => {
      if (!cancelled) setIsLoaded(true);
    });

    return () => { cancelled = true; };
  }, [kit, ensureContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSources();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopSources]);

  // ── Slot duration helper ──
  const getSlotDuration = useCallback((slot: SlotState): number => {
    let maxDur = 0;
    for (const trackId of slot.activeTracks) {
      const track = kit.tracks.find(t => t.id === trackId);
      if (!track) continue;
      const src = track.sections[slot.section];
      if (!src) continue;
      const buffer = bufferCacheRef.current.get(src);
      if (buffer) maxDur = Math.max(maxDur, buffer.duration);
    }
    return maxDur || 2;
  }, [kit]);

  // ── Play ──
  const play = useCallback(() => {
    stopSources();
    const ctx = ensureContext();
    const sources: AudioBufferSourceNode[] = [];
    const slotDurations: number[] = [];

    let time = ctx.currentTime + 0.05;
    const startTime = time;

    for (const slot of slots) {
      const dur = getSlotDuration(slot);
      slotDurations.push(dur);

      for (const trackId of slot.activeTracks) {
        const track = kit.tracks.find(t => t.id === trackId);
        if (!track) continue;
        const srcPath = track.sections[slot.section];
        if (!srcPath) continue;
        const buffer = bufferCacheRef.current.get(srcPath);
        if (!buffer) continue;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(time);
        sources.push(source);
      }
      time += dur;
    }

    scheduledRef.current = sources;
    const totalDuration = time - startTime;
    setIsPlaying(true);

    // Show playhead
    if (playheadRef.current) playheadRef.current.style.display = 'block';

    // Playhead animation
    const animate = () => {
      if (!audioCtxRef.current) return;
      const elapsed = audioCtxRef.current.currentTime - startTime;

      if (elapsed >= totalDuration) {
        if (isLoopingRef.current) {
          play(); // re-schedule
        } else {
          stop();
        }
        return;
      }

      let accum = 0;
      for (let i = 0; i < slotDurations.length; i++) {
        if (elapsed < accum + slotDurations[i]) {
          // Update current slot state only when it changes
          if (i !== lastSlotRef.current) {
            setCurrentSlot(i);
            lastSlotRef.current = i;
          }
          // Update playhead position via ref (no re-render)
          if (playheadRef.current && gridRef.current) {
            const gridWidth = gridRef.current.scrollWidth;
            const trackLabelW = 110;
            const addBtnW = 44;
            const slotAreaWidth = gridWidth - trackLabelW - addBtnW;
            const pct = (i + (elapsed - accum) / slotDurations[i]) / slots.length;
            playheadRef.current.style.left = `${trackLabelW + pct * slotAreaWidth}px`;
          }
          break;
        }
        accum += slotDurations[i];
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, [slots, kit, ensureContext, stopSources, stop, getSlotDuration]);

  // ── Download ──
  const download = useCallback(async () => {
    setIsDownloading(true);
    try {
      const slotDurations = slots.map(s => getSlotDuration(s));
      const totalDuration = slotDurations.reduce((a, b) => a + b, 0);
      if (totalDuration <= 0) return;

      const sampleRate = 44100;
      const offline = new OfflineAudioContext(2, Math.ceil(totalDuration * sampleRate), sampleRate);

      let time = 0;
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        for (const trackId of slot.activeTracks) {
          const track = kit.tracks.find(t => t.id === trackId);
          if (!track) continue;
          const srcPath = track.sections[slot.section];
          if (!srcPath) continue;
          const buffer = bufferCacheRef.current.get(srcPath);
          if (!buffer) continue;

          const source = offline.createBufferSource();
          source.buffer = buffer;
          source.connect(offline.destination);
          source.start(time);
        }
        time += slotDurations[i];
      }

      const rendered = await offline.startRendering();
      const blob = encodeWav(rendered);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jazz-studio-${kit.name.toLowerCase().replace(/\s+/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setIsDownloading(false);
    }
  }, [slots, kit, getSlotDuration]);

  // ── Slot mutations (stop playback on change) ──
  const changeSection = useCallback((index: number, direction: 1 | -1) => {
    stop();
    setSlots(prev => prev.map((slot, i) => {
      if (i !== index) return slot;
      const secs = kit.allSections;
      const cur = secs.indexOf(slot.section);
      const next = (cur + direction + secs.length) % secs.length;
      const newSection = secs[next];
      // Keep tracks that are available in new section
      const newActive = new Set<string>();
      slot.activeTracks.forEach(trackId => {
        const track = kit.tracks.find(t => t.id === trackId);
        if (track && track.sections[newSection] !== undefined) newActive.add(trackId);
      });
      return { section: newSection, activeTracks: newActive };
    }));
  }, [kit, stop]);

  const toggleTrack = useCallback((slotIndex: number, trackId: string) => {
    stop();
    setSlots(prev => prev.map((slot, i) => {
      if (i !== slotIndex) return slot;
      const next = new Set(slot.activeTracks);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return { ...slot, activeTracks: next };
    }));
  }, [stop]);

  const addSlot = useCallback(() => {
    if (slots.length >= 8) return;
    stop();
    const section = kit.allSections[0];
    setSlots(prev => [...prev, {
      section,
      activeTracks: new Set(kit.tracks.filter(t => t.sections[section] !== undefined).map(t => t.id)),
    }]);
  }, [slots.length, kit, stop]);

  const removeSlot = useCallback(() => {
    if (slots.length <= 2) return;
    stop();
    setSlots(prev => prev.slice(0, -1));
  }, [slots.length, stop]);

  // ── Loading screen ──
  if (!isLoaded) {
    return (
      <div className="js-loading">
        <div className="js-loading-title">{kit.name}</div>
        <div className="js-loading-subtitle">Loading tracks...</div>
        <div className="js-progress-track">
          <div className="js-progress-fill" style={{ width: `${loadProgress * 100}%` }} />
        </div>
      </div>
    );
  }

  // ── Grid column template ──
  const gridCols = `110px repeat(${slots.length}, minmax(80px, 1fr)) 44px`;

  return (
    <div className="js-arranger">
      {/* Header */}
      <div className="js-arr-header">
        <button className="js-arr-back" onClick={() => { stop(); onBack(); }}>{'\u2190'}</button>
        <div className="js-arr-title">{kit.name}</div>
        <div className="js-arr-meta">{kit.bpm} BPM &middot; Key of {kit.musicalKey}</div>
      </div>

      {/* Grid */}
      <div className="js-grid-wrap">
        {/* Playhead */}
        <div ref={playheadRef} className="js-playhead" style={{ display: 'none' }} />

        <div ref={gridRef} className="js-grid" style={{ gridTemplateColumns: gridCols }}>
          {/* Header row */}
          <div className="js-grid-corner">
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '8px', letterSpacing: '2px', color: 'var(--jl-gold-dim)', fontWeight: 600, textTransform: 'uppercase' as const }}>
              Tracks
            </span>
          </div>
          {slots.map((slot, si) => (
            <div key={si} className="js-grid-slot-header">
              <div className="js-grid-slot-label">Slot {si + 1}</div>
              <div className="js-section-stepper">
                <button className="js-section-arrow" onClick={() => changeSection(si, -1)}>{'\u2039'}</button>
                <span className="js-section-num">{slot.section}</span>
                <button className="js-section-arrow" onClick={() => changeSection(si, 1)}>{'\u203A'}</button>
              </div>
            </div>
          ))}
          <div className="js-grid-add">
            <button className="js-add-btn" onClick={addSlot} title="Add slot">+</button>
            <button className="js-remove-btn" onClick={removeSlot} title="Remove slot">&minus;</button>
          </div>

          {/* Track rows */}
          {kit.tracks.map(track => (
            <Fragment key={track.id}>
              <div className="js-grid-track-label">
                <span className="js-track-emoji">{track.emoji}</span>
                <span className="js-track-name">{track.name}</span>
              </div>
              {slots.map((slot, si) => {
                const available = track.sections[slot.section] !== undefined;
                const active = slot.activeTracks.has(track.id);
                const playingNow = isPlaying && currentSlot === si && active;
                return (
                  <div
                    key={`${track.id}-${si}`}
                    className={`js-cell ${!available ? 'unavailable' : active ? 'active' : 'inactive'} ${playingNow ? 'playing-now' : ''}`}
                    onClick={() => available && toggleTrack(si, track.id)}
                  >
                    <div className="js-cell-dot" />
                  </div>
                );
              })}
              <div className="js-grid-add-spacer" />
            </Fragment>
          ))}
        </div>
      </div>

      {/* Transport */}
      <div className="js-transport">
        {!isPlaying ? (
          <button className="jl-btn" onClick={play}>{'\u25B6'} Play</button>
        ) : (
          <button className="jl-btn jl-btn-stop" onClick={stop}>{'\u25A0'} Stop</button>
        )}
        <button
          className={`jl-btn ${isLooping ? 'active' : ''}`}
          onClick={() => setIsLooping(prev => !prev)}
        >
          {'\u27F3'} Loop
        </button>
        <button
          className="jl-btn"
          onClick={download}
          disabled={isDownloading}
        >
          {isDownloading ? 'Preparing...' : '\u2913 Download'}
        </button>
      </div>
    </div>
  );
}
