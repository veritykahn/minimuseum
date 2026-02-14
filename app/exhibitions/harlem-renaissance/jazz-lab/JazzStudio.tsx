'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  SESSIONS, SESSION_MAP, TIMELINE_DURATION, loopDuration, snapToBar,
  INST_COLORS, INST_EMOJI, INST_NAMES,
  type SessionDef, type LoopDef, type InstrumentCategory,
} from './studio-data';

type PlacedBlock = { uid: string; loopId: string; lane: InstrumentCategory; startTime: number };
let _u = 0;
function nuid() { return `b${++_u}`; }

function encodeWav(buf: AudioBuffer): Blob {
  const nc = buf.numberOfChannels, sr = buf.sampleRate, len = buf.length;
  const ds = len * nc * 2, ab = new ArrayBuffer(44 + ds), v = new DataView(ab);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + ds, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * nc * 2, true); v.setUint16(32, nc * 2, true);
  v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, ds, true);
  const ch = Array.from({ length: nc }, (_, i) => buf.getChannelData(i));
  let off = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < nc; c++) {
    const s = Math.max(-1, Math.min(1, ch[c][i]));
    v.setInt16(off, s * (s < 0 ? 0x8000 : 0x7FFF), true); off += 2;
  }
  return new Blob([ab], { type: 'audio/wav' });
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function JazzStudio() {
  const [sid, setSid] = useState<string | null>(null);
  const session = sid ? SESSION_MAP[sid] ?? null : null;

  return (
    <div>
      <style jsx global>{`
        .js-select{text-align:center;padding:10px 20px 40px}
        .js-select-subtitle{font-family:'Josefin Sans',sans-serif;font-size:13px;color:var(--jl-text-dim);font-weight:300;letter-spacing:1px;margin-bottom:30px;line-height:1.6}
        .js-kits{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:28px;max-width:720px;margin:0 auto;justify-items:center}
        .js-record{display:flex;flex-direction:column;align-items:center;gap:12px;background:none;border:none;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform 0.3s}
        .js-record:hover{transform:translateY(-6px)}
        .js-record:hover .js-vinyl{animation:js-spin 3s linear infinite}
        .js-vinyl{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#1a1a1a 18%,transparent 19%),radial-gradient(circle,rgba(201,169,78,0.5) 19%,transparent 20%),radial-gradient(circle,#1a1a1a 20%,transparent 21%),repeating-radial-gradient(circle,transparent 22%,rgba(60,60,60,0.3) 24%,transparent 26%),radial-gradient(circle,#111 0%,#1a1a1a 100%);position:relative;box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:box-shadow 0.3s}
        .js-record:hover .js-vinyl{box-shadow:0 4px 30px rgba(201,169,78,0.2),0 4px 20px rgba(0,0,0,0.5)}
        @keyframes js-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .js-vinyl-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--jl-gold),var(--jl-gold-dim));display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:11px;font-weight:700;color:#0a0a0a;letter-spacing:1px}
        .js-record-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--jl-text)}
        .js-record-meta{font-family:'Josefin Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--jl-text-dim);font-weight:600}
        .js-workspace{max-width:960px;margin:0 auto;padding:0 16px 40px}
        .js-arr-header{display:flex;align-items:center;gap:14px;padding:10px 0 16px;flex-wrap:wrap}
        .js-arr-back{background:none;border:1px solid rgba(201,169,78,0.2);color:var(--jl-gold-dim);font-family:'Josefin Sans',sans-serif;font-size:14px;padding:6px 12px;cursor:pointer;border-radius:4px;transition:all 0.3s;-webkit-tap-highlight-color:transparent}
        .js-arr-back:hover{border-color:var(--jl-gold);color:var(--jl-gold)}
        .js-arr-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--jl-gold);flex:1}
        .js-arr-meta{font-family:'Josefin Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--jl-text-dim);font-weight:600}
        .js-vinyl-mini{width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,var(--jl-gold) 20%,transparent 21%),radial-gradient(circle,#111 0%,#1a1a1a 100%);flex-shrink:0}
        .js-spinning{animation:js-spin 2s linear infinite}
        .js-selected-bar{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;margin-bottom:10px;border:1px solid;border-radius:6px;background:rgba(201,169,78,0.08);font-family:'Josefin Sans',sans-serif;font-size:12px;color:var(--jl-text)}
        .js-selected-bar button{background:none;border:none;color:var(--jl-text-dim);cursor:pointer;font-size:16px;padding:0 4px}
        .js-timeline{display:flex;border:1px solid rgba(201,169,78,0.15);border-radius:8px;background:var(--jl-bg-stage);overflow:hidden}
        .js-labels{flex-shrink:0;width:80px;border-right:1px solid rgba(201,169,78,0.1)}
        .js-ruler-label{height:28px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(201,169,78,0.1);font-family:'Josefin Sans',sans-serif;font-size:7px;letter-spacing:2px;color:var(--jl-text-dim);text-transform:uppercase}
        .js-lane-label{height:52px;display:flex;align-items:center;gap:6px;padding:0 8px;border-bottom:1px solid rgba(201,169,78,0.06);border-left:3px solid}
        .js-lane-emoji{font-size:16px}
        .js-lane-name{font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--jl-text-dim);font-weight:600}
        .js-tracks{flex:1;position:relative;overflow-x:auto;min-width:0}
        .js-ruler{height:28px;position:relative;border-bottom:1px solid rgba(201,169,78,0.15)}
        .js-ruler-mark{position:absolute;top:0;bottom:0}
        .js-ruler-tick{width:1px;height:8px;background:rgba(201,169,78,0.3)}
        .js-ruler-time{position:absolute;top:10px;left:2px;font-family:'Josefin Sans',sans-serif;font-size:8px;color:var(--jl-text-dim);white-space:nowrap}
        .js-lane{height:52px;position:relative;border-bottom:1px solid rgba(201,169,78,0.06);transition:background 0.2s}
        .js-lane-active{background:rgba(201,169,78,0.06);cursor:crosshair}
        .js-lane-active::after{content:'';position:absolute;inset:0;border:1px dashed rgba(201,169,78,0.2);pointer-events:none;border-radius:2px}
        .js-block{position:absolute;top:4px;bottom:4px;border:1px solid;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;z-index:2;overflow:hidden;transition:opacity 0.15s}
        .js-block:hover{filter:brightness(1.2)}
        .js-block:active{cursor:grabbing;z-index:20}
        .js-block-label{font-family:'Josefin Sans',sans-serif;font-size:9px;font-weight:600;color:var(--jl-text);letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4px}
        .js-playhead{position:absolute;top:28px;bottom:0;width:2px;background:var(--jl-gold);z-index:10;pointer-events:none;box-shadow:0 0 8px rgba(201,169,78,0.5)}
        .js-transport{display:flex;justify-content:center;gap:10px;padding:16px 0 12px;flex-wrap:wrap}
        .js-transport .jl-btn.active{background:rgba(201,169,78,0.15);border-color:var(--jl-gold)}
        .js-transport .jl-btn:disabled{opacity:0.3;cursor:not-allowed}
        .js-crate{border:1px solid rgba(201,169,78,0.12);border-radius:8px;background:var(--jl-bg-stage);overflow:hidden;margin-top:12px}
        .js-crate-toggle{width:100%;background:none;border:none;border-bottom:1px solid rgba(201,169,78,0.08);color:var(--jl-gold-dim);font-family:'Josefin Sans',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;padding:10px;cursor:pointer;transition:color 0.2s;-webkit-tap-highlight-color:transparent}
        .js-crate-toggle:hover{color:var(--jl-gold)}
        .js-crate-body{padding:12px 14px 16px}
        .js-crate-group{margin-bottom:14px}
        .js-crate-group:last-child{margin-bottom:0}
        .js-crate-title{font-family:'Josefin Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
        .js-crate-tiles{display:flex;flex-wrap:wrap;gap:6px}
        .js-tile{background:rgba(255,255,255,0.03);border:1px solid;border-radius:4px;padding:5px 10px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s;-webkit-tap-highlight-color:transparent}
        .js-tile:hover{background:rgba(201,169,78,0.08)}
        .js-tile-sel{box-shadow:0 0 8px rgba(201,169,78,0.3)}
        .js-tile-name{font-family:'Josefin Sans',sans-serif;font-size:11px;font-weight:600;color:var(--jl-text)}
        .js-tile-info{font-family:'Josefin Sans',sans-serif;font-size:9px;color:var(--jl-text-dim)}
        .js-loading{text-align:center;padding:60px 20px}
        .js-loading-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--jl-gold);margin-bottom:16px}
        .js-loading-subtitle{font-family:'Josefin Sans',sans-serif;font-size:12px;color:var(--jl-text-dim);letter-spacing:2px;margin-bottom:24px;font-weight:300}
        .js-progress-track{width:200px;height:3px;background:rgba(201,169,78,0.15);border-radius:2px;margin:0 auto;overflow:hidden}
        .js-progress-fill{height:100%;background:var(--jl-gold);border-radius:2px;transition:width 0.3s}
        @media(max-width:600px){
          .js-kits{gap:20px;grid-template-columns:repeat(2,1fr)}
          .js-vinyl{width:100px;height:100px}
          .js-vinyl-label{width:36px;height:36px;font-size:9px}
          .js-record-name{font-size:13px}
          .js-arr-title{font-size:18px}
          .js-labels{width:60px}
          .js-lane-emoji{font-size:14px}
          .js-lane-name{font-size:7px}
        }
      `}</style>
      {!session ? (
        <div className="js-select">
          <div className="js-select-subtitle">
            Step into the recording studio. Pick a session, then select loops
            from the crate and tap the timeline to arrange your own jazz record.
          </div>
          <div className="js-kits">
            {SESSIONS.map(s => (
              <button key={s.id} className="js-record" onClick={() => setSid(s.id)}>
                <div className="js-vinyl"><div className="js-vinyl-label">{s.id.toUpperCase()}</div></div>
                <div className="js-record-name">{s.name}</div>
                <div className="js-record-meta">{s.bpm} BPM &middot; Key of {s.key}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <StudioWorkspace key={session.id} session={session} onBack={() => setSid(null)} />
      )}
    </div>
  );
}

// ─── Studio Workspace ────────────────────────────────────────────────────────

function StudioWorkspace({ session, onBack }: { session: SessionDef; onBack: () => void }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const cacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const animRef = useRef<number>(0);
  const startRef = useRef(0);
  const loopRef = useRef(false);
  const playRef = useRef<() => void>(() => {});

  const tracksRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [selected, setSelected] = useState<LoopDef | null>(null);
  const [crateOpen, setCrateOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { loopRef.current = looping; }, [looping]);

  const ensureCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new C();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const loopsByInst = useMemo(() => {
    const m = new Map<InstrumentCategory, LoopDef[]>();
    for (const l of session.loops) {
      const a = m.get(l.instrument) || [];
      a.push(l);
      m.set(l.instrument, a);
    }
    return m;
  }, [session]);

  // Preload all audio
  useEffect(() => {
    let off = false;
    const ctx = ensureCtx();
    const paths = session.loops.map(l => l.file).filter(f => !cacheRef.current.has(f));
    if (!paths.length) { setLoaded(true); setProgress(1); return; }
    let done = 0;
    Promise.all(paths.map(async src => {
      try {
        const r = await fetch(src);
        const ab = await r.arrayBuffer();
        const buf = await ctx.decodeAudioData(ab);
        cacheRef.current.set(src, buf);
      } catch (e) { console.warn(`Failed: ${src}`, e); }
      done++;
      if (!off) setProgress(done / paths.length);
    })).then(() => { if (!off) setLoaded(true); });
    return () => { off = true; };
  }, [session, ensureCtx]);

  // Cleanup
  useEffect(() => {
    return () => {
      sourcesRef.current.forEach(s => { try { s.stop(); } catch { /* noop */ } s.disconnect(); });
      cancelAnimationFrame(animRef.current);
      if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    };
  }, []);

  // ── Playback ──

  const stopPlay = useCallback(() => {
    sourcesRef.current.forEach(s => { try { s.stop(); } catch { /* noop */ } s.disconnect(); });
    sourcesRef.current = [];
    cancelAnimationFrame(animRef.current);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!blocks.length) return;
    stopPlay();
    const ctx = ensureCtx();
    const t0 = ctx.currentTime + 0.05;
    startRef.current = t0;
    const srcs: AudioBufferSourceNode[] = [];
    for (const b of blocks) {
      const l = session.loops.find(x => x.id === b.loopId);
      if (!l) continue;
      const buf = cacheRef.current.get(l.file);
      if (!buf) continue;
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.connect(ctx.destination);
      const dur = loopDuration(session.bpm, l.bars);
      s.start(t0 + b.startTime);
      s.stop(t0 + b.startTime + dur);
      srcs.push(s);
    }
    sourcesRef.current = srcs;
    setPlaying(true);

    const tick = () => {
      if (!ctxRef.current) return;
      const el = ctxRef.current.currentTime - startRef.current;
      if (el >= TIMELINE_DURATION) {
        if (loopRef.current) playRef.current();
        else stopPlay();
        return;
      }
      if (playheadRef.current) {
        playheadRef.current.style.left = `${(el / TIMELINE_DURATION) * 100}%`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [blocks, session, ensureCtx, stopPlay]);

  useEffect(() => { playRef.current = play; }, [play]);

  // ── Block Management ──

  const addBlock = useCallback((loop: LoopDef, startTime: number) => {
    const dur = loopDuration(session.bpm, loop.bars);
    const snapped = snapToBar(Math.max(0, Math.min(startTime, TIMELINE_DURATION - dur)), session.bpm);
    if (snapped < 0) return;
    setBlocks(prev => {
      const hasOverlap = prev.some(b => {
        if (b.lane !== loop.instrument) return false;
        const bl = session.loops.find(x => x.id === b.loopId);
        const bd = bl ? loopDuration(session.bpm, bl.bars) : 0;
        return snapped < b.startTime + bd && snapped + dur > b.startTime;
      });
      if (hasOverlap) return prev;
      return [...prev, { uid: nuid(), loopId: loop.id, lane: loop.instrument, startTime: snapped }];
    });
  }, [session]);

  const moveBlock = useCallback((uid: string, newStart: number) => {
    setBlocks(prev => {
      const b = prev.find(x => x.uid === uid);
      if (!b) return prev;
      const l = session.loops.find(x => x.id === b.loopId);
      if (!l) return prev;
      const dur = loopDuration(session.bpm, l.bars);
      const snapped = snapToBar(Math.max(0, Math.min(newStart, TIMELINE_DURATION - dur)), session.bpm);
      const hasOverlap = prev.some(x => {
        if (x.uid === uid || x.lane !== b.lane) return false;
        const xl = session.loops.find(ll => ll.id === x.loopId);
        const xd = xl ? loopDuration(session.bpm, xl.bars) : 0;
        return snapped < x.startTime + xd && snapped + dur > x.startTime;
      });
      if (hasOverlap) return prev;
      return prev.map(x => x.uid === uid ? { ...x, startTime: snapped } : x);
    });
  }, [session]);

  const removeBlock = useCallback((uid: string) => {
    stopPlay();
    setBlocks(prev => prev.filter(b => b.uid !== uid));
  }, [stopPlay]);

  const clearAll = useCallback(() => { stopPlay(); setBlocks([]); }, [stopPlay]);

  // ── Lane Click (tap-to-place) ──

  const handleLaneClick = useCallback((lane: InstrumentCategory, e: React.MouseEvent<HTMLDivElement>) => {
    if (!selected || selected.instrument !== lane) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const time = ((e.clientX - rect.left) / rect.width) * TIMELINE_DURATION;
    addBlock(selected, time);
    setSelected(null);
  }, [selected, addBlock]);

  // ── Block Drag (reposition) ──

  const handleBlockDown = useCallback((uid: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const laneEl = el.parentElement;
    if (!laneEl) return;
    const startX = e.clientX;
    const laneW = laneEl.clientWidth;
    const block = blocks.find(b => b.uid === uid);
    if (!block) return;
    const origTime = block.startTime;

    const onMove = (ev: PointerEvent) => {
      el.style.transform = `translateX(${ev.clientX - startX}px)`;
      el.style.opacity = '0.7';
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.style.transform = '';
      el.style.opacity = '';
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 3) {
        moveBlock(uid, origTime + (dx / laneW) * TIMELINE_DURATION);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [blocks, moveBlock]);

  // ── Download WAV ──

  const download = useCallback(async () => {
    if (!blocks.length) return;
    setDownloading(true);
    try {
      let end = 0;
      for (const b of blocks) {
        const l = session.loops.find(x => x.id === b.loopId);
        if (l) end = Math.max(end, b.startTime + loopDuration(session.bpm, l.bars));
      }
      if (end <= 0) return;
      const sr = 44100;
      const offline = new OfflineAudioContext(2, Math.ceil(end * sr), sr);
      for (const b of blocks) {
        const l = session.loops.find(x => x.id === b.loopId);
        if (!l) continue;
        const buf = cacheRef.current.get(l.file);
        if (!buf) continue;
        const s = offline.createBufferSource();
        s.buffer = buf;
        s.connect(offline.destination);
        s.start(b.startTime);
        s.stop(b.startTime + loopDuration(session.bpm, l.bars));
      }
      const rendered = await offline.startRendering();
      const blob = encodeWav(rendered);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jazz-studio-${session.name.toLowerCase().replace(/\s+/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setDownloading(false);
    }
  }, [blocks, session]);

  // ── Ruler Marks ──

  const rulerMarks = useMemo(() => {
    const marks: { t: number; label: string }[] = [];
    for (let t = 0; t <= TIMELINE_DURATION; t += 30) {
      const m = Math.floor(t / 60), s = t % 60;
      marks.push({ t, label: `${m}:${s.toString().padStart(2, '0')}` });
    }
    return marks;
  }, []);

  // ── Loading ──

  if (!loaded) {
    return (
      <div className="js-loading">
        <div className="js-loading-title">{session.name}</div>
        <div className="js-loading-subtitle">Loading loops&hellip;</div>
        <div className="js-progress-track">
          <div className="js-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="js-workspace">
      <div className="js-arr-header">
        <button className="js-arr-back" onClick={() => { stopPlay(); onBack(); }}>{'\u2190'}</button>
        <div className="js-arr-title">{session.name}</div>
        {playing && <div className="js-vinyl-mini js-spinning" />}
        <div className="js-arr-meta">{session.bpm} BPM &middot; Key of {session.key}</div>
      </div>

      {selected && (
        <div className="js-selected-bar" style={{ borderColor: INST_COLORS[selected.instrument] }}>
          <span>
            Tap the <strong>{INST_NAMES[selected.instrument]}</strong> lane to
            place <strong>{selected.label}</strong> ({selected.bars} bars)
          </span>
          <button onClick={() => setSelected(null)}>{'\u2715'}</button>
        </div>
      )}

      <div className="js-timeline">
        <div className="js-labels">
          <div className="js-ruler-label">TIME</div>
          {session.instruments.map(inst => (
            <div key={inst} className="js-lane-label" style={{ borderLeftColor: INST_COLORS[inst] }}>
              <span className="js-lane-emoji">{INST_EMOJI[inst]}</span>
              <span className="js-lane-name">{INST_NAMES[inst]}</span>
            </div>
          ))}
        </div>

        <div className="js-tracks" ref={tracksRef}>
          <div className="js-ruler">
            {rulerMarks.map(m => (
              <div key={m.t} className="js-ruler-mark" style={{ left: `${(m.t / TIMELINE_DURATION) * 100}%` }}>
                <div className="js-ruler-tick" />
                <span className="js-ruler-time">{m.label}</span>
              </div>
            ))}
          </div>

          {session.instruments.map(inst => (
            <div
              key={inst}
              className={`js-lane${selected?.instrument === inst ? ' js-lane-active' : ''}`}
              data-lane={inst}
              onClick={(e) => handleLaneClick(inst, e)}
            >
              {blocks.filter(b => b.lane === inst).map(block => {
                const loop = session.loops.find(x => x.id === block.loopId);
                if (!loop) return null;
                const dur = loopDuration(session.bpm, loop.bars);
                return (
                  <div
                    key={block.uid}
                    className="js-block"
                    style={{
                      left: `${(block.startTime / TIMELINE_DURATION) * 100}%`,
                      width: `${(dur / TIMELINE_DURATION) * 100}%`,
                      background: `${INST_COLORS[inst]}35`,
                      borderColor: INST_COLORS[inst],
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => handleBlockDown(block.uid, e)}
                    onDoubleClick={() => removeBlock(block.uid)}
                    title={`${loop.label} (${loop.bars} bars) \u2014 drag to move, double-click to remove`}
                  >
                    <span className="js-block-label">{loop.label}</span>
                  </div>
                );
              })}
            </div>
          ))}

          <div
            ref={playheadRef}
            className="js-playhead"
            style={{ display: playing ? 'block' : 'none', left: '0%' }}
          />
        </div>
      </div>

      <div className="js-transport">
        {!playing ? (
          <button className="jl-btn" onClick={play} disabled={!blocks.length}>{'\u25B6'} Play</button>
        ) : (
          <button className="jl-btn jl-btn-stop" onClick={stopPlay}>{'\u25A0'} Stop</button>
        )}
        <button className={`jl-btn${looping ? ' active' : ''}`} onClick={() => setLooping(p => !p)}>{'\u27F3'} Loop</button>
        <button className="jl-btn" onClick={clearAll} disabled={!blocks.length}>Clear All</button>
        <button className="jl-btn" onClick={download} disabled={!blocks.length || downloading}>
          {downloading ? 'Preparing\u2026' : '\u2913 Download'}
        </button>
      </div>

      <div className="js-crate">
        <button className="js-crate-toggle" onClick={() => setCrateOpen(p => !p)}>
          {crateOpen ? '\u25BE' : '\u25B4'} Sample Crate
        </button>
        {crateOpen && (
          <div className="js-crate-body">
            {session.instruments.map(inst => (
              <div key={inst} className="js-crate-group">
                <div className="js-crate-title" style={{ color: INST_COLORS[inst] }}>
                  {INST_EMOJI[inst]} {INST_NAMES[inst]}
                </div>
                <div className="js-crate-tiles">
                  {(loopsByInst.get(inst) || []).map(loop => {
                    const isSel = selected?.id === loop.id;
                    return (
                      <button
                        key={loop.id}
                        className={`js-tile${isSel ? ' js-tile-sel' : ''}`}
                        style={{
                          borderColor: INST_COLORS[inst],
                          background: isSel ? `${INST_COLORS[inst]}25` : undefined,
                        }}
                        onClick={() => setSelected(isSel ? null : loop)}
                      >
                        <span className="js-tile-name">{loop.label}</span>
                        <span className="js-tile-info">{loop.bars}b</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
