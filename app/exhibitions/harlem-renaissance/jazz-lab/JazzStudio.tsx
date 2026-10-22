'use client';

import { Fragment, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  SESSIONS, SESSION_MAP, TIMELINE_DURATION, loopDuration, snapToBar,
  INST_COLORS, INST_EMOJI, INST_NAMES, TEMPLATES, checkAABA,
  type SessionDef, type LoopDef, type InstrumentCategory,
} from './studio-data';
import { srOnly } from '@/lib/a11y';

/** Mix a #rrggbb color toward white, for small text on the dark stage (AA contrast). */
function lighten(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v + (255 - v) * amount).toString(16).padStart(2, '0');
  return `#${ch(n >> 16)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}

function fmtTime(t: number) {
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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
        .js-timeline{display:flex;border:1px solid rgba(201,169,78,0.15);border-radius:8px;background:var(--jl-bg-stage);overflow:hidden}
        .js-labels{flex-shrink:0;width:80px;border-right:1px solid rgba(201,169,78,0.1)}
        .js-ruler-label{height:28px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(201,169,78,0.1);font-family:'Josefin Sans',sans-serif;font-size:7px;letter-spacing:2px;color:var(--jl-text-dim);text-transform:uppercase}
        .js-lane-label{height:52px;display:flex;align-items:center;gap:6px;padding:0 8px;border-bottom:1px solid rgba(201,169,78,0.06);border-left:3px solid}
        .js-lane-emoji{font-size:16px}
        .js-lane-name{font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--jl-text-dim);font-weight:600}
        .js-tracks{flex:1;position:relative;overflow-x:auto;min-width:0}
        .js-tracks-inner{min-width:1800px;position:relative}
        .js-ruler{height:28px;position:relative;border-bottom:1px solid rgba(201,169,78,0.15);cursor:pointer}
        .js-ruler-mark{position:absolute;top:0;bottom:0}
        .js-ruler-tick{width:1px;height:8px;background:rgba(201,169,78,0.3)}
        .js-ruler-time{position:absolute;top:10px;left:2px;font-family:'Josefin Sans',sans-serif;font-size:8px;color:var(--jl-text-dim);white-space:nowrap}
        .js-lane{height:52px;position:relative;border-bottom:1px solid rgba(201,169,78,0.06);transition:background 0.2s}
        .js-lane-drop{background:rgba(201,169,78,0.08)}
        .js-block{position:absolute;top:4px;bottom:4px;border:1px solid;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;z-index:2;overflow:visible;transition:opacity 0.15s}
        .js-block:hover{filter:brightness(1.2)}
        .js-block:active{cursor:grabbing;z-index:20}
        .js-block-inner{display:flex;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden;border-radius:3px}
        .js-block-label{font-family:'Josefin Sans',sans-serif;font-size:9px;font-weight:600;color:var(--jl-text);letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4px}
        .js-block-add{position:absolute;top:-10px;right:-10px;width:22px;height:22px;border-radius:50%;background:var(--jl-gold);color:#0a0a0a;border:2px solid var(--jl-bg-stage);font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:30;line-height:1;box-shadow:0 2px 8px rgba(0,0,0,0.4);transition:transform 0.15s}
        .js-block-add:hover{transform:scale(1.15)}
        .js-block-tools{position:absolute;top:-10px;right:-10px;display:flex;gap:3px;z-index:30}
        .js-block-tools .js-block-add{position:static}
        .js-block:focus-visible{outline:2px solid #a8d5e5;outline-offset:2px;z-index:15}
        .js-ruler:focus-visible{outline:2px solid #a8d5e5;outline-offset:-2px}
        .js-tile-wrap{display:flex;align-items:stretch}
        .js-tile-wrap .js-tile{border-top-right-radius:0;border-bottom-right-radius:0}
        .js-tile-preview{background:rgba(255,255,255,0.03);border:1px solid;border-left:none;border-radius:0 4px 4px 0;padding:0 8px;min-width:26px;cursor:pointer;color:var(--jl-text-dim);font-size:10px;transition:all 0.2s;-webkit-tap-highlight-color:transparent}
        .js-tile-preview:hover{background:rgba(201,169,78,0.08);color:var(--jl-text)}
        .js-tile-preview[aria-pressed="true"]{background:rgba(201,169,78,0.12);color:var(--jl-gold)}
        .js-block-removing{opacity:0.3;transform:translateY(-20px);transition:all 0.2s}
        .js-playhead{position:absolute;top:28px;bottom:0;width:2px;background:var(--jl-gold);z-index:10;pointer-events:none;box-shadow:0 0 8px rgba(201,169,78,0.5)}
        .js-transport{display:flex;justify-content:center;gap:10px;padding:16px 0 12px;flex-wrap:wrap}
        .js-transport .jl-btn.active{background:rgba(201,169,78,0.15);border-color:var(--jl-gold)}
        .js-transport .jl-btn:disabled{opacity:0.3;cursor:not-allowed}
        .js-crate{border:1px solid rgba(201,169,78,0.12);border-radius:8px;background:var(--jl-bg-stage);overflow:hidden;margin-top:12px}
        .js-crate-toggle{width:100%;background:none;border:none;border-bottom:1px solid rgba(201,169,78,0.08);color:var(--jl-gold);font-family:'Josefin Sans',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;padding:10px;cursor:pointer;transition:color 0.2s;-webkit-tap-highlight-color:transparent}
        .js-crate-toggle:hover{color:var(--jl-gold)}
        .js-crate-body{padding:12px 14px 16px}
        .js-crate-group{margin-bottom:14px}
        .js-crate-group:last-child{margin-bottom:0}
        .js-crate-title{font-family:'Josefin Sans',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
        .js-crate-tiles{display:flex;flex-wrap:wrap;gap:6px}
        .js-tile{background:rgba(255,255,255,0.03);border:1px solid;border-radius:4px;padding:5px 10px;cursor:grab;display:flex;align-items:center;gap:6px;transition:all 0.2s;-webkit-tap-highlight-color:transparent;touch-action:none;user-select:none}
        .js-tile:hover{background:rgba(201,169,78,0.08)}
        .js-tile-playing{box-shadow:0 0 10px rgba(201,169,78,0.4);background:rgba(201,169,78,0.12)}
        .js-tile-name{font-family:'Josefin Sans',sans-serif;font-size:12px;font-weight:600;color:var(--jl-text)}
        .js-tile-info{font-family:'Josefin Sans',sans-serif;font-size:9px;color:var(--jl-text-dim)}
        .js-drag-ghost{position:fixed;z-index:9999;pointer-events:none;border:1px solid;border-radius:4px;padding:4px 10px;font-family:'Josefin Sans',sans-serif;font-size:11px;font-weight:600;color:var(--jl-text);opacity:0.85;box-shadow:0 4px 16px rgba(0,0,0,0.4);white-space:nowrap}
        .js-loading{text-align:center;padding:60px 20px}
        .js-loading-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--jl-gold);margin-bottom:16px}
        .js-loading-subtitle{font-family:'Josefin Sans',sans-serif;font-size:12px;color:var(--jl-text-dim);letter-spacing:2px;margin-bottom:24px;font-weight:300}
        .js-progress-track{width:200px;height:3px;background:rgba(201,169,78,0.15);border-radius:2px;margin:0 auto;overflow:hidden}
        .js-progress-fill{height:100%;background:var(--jl-gold);border-radius:2px;transition:width 0.3s}
        .js-guide{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px;align-items:start}
        .js-guide-card{border:1px solid rgba(201,169,78,0.18);border-radius:8px;background:var(--jl-bg-stage);padding:12px 14px}
        .js-guide-title{font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:var(--jl-gold);margin:0 0 6px}
        .js-guide-text{font-family:'Josefin Sans',sans-serif;font-size:13px;line-height:1.55;color:var(--jl-text);margin:0 0 10px}
        .js-guide-dim{color:var(--jl-text-dim)}
        .js-guide summary{cursor:pointer;list-style:none}
        .js-guide summary::-webkit-details-marker{display:none}
        .js-guide summary .js-guide-title{display:inline}
        .js-guide summary:focus-visible,.js-guide .jl-btn:focus-visible{outline:2px solid #a8d5e5;outline-offset:2px}
        .js-checks{list-style:none;margin:0;padding:0;display:grid;gap:4px}
        .js-checks li{font-family:'Josefin Sans',sans-serif;font-size:13px;line-height:1.45;color:var(--jl-text-dim);display:flex;gap:8px}
        .js-checks li.ok{color:var(--jl-text)}
        .js-check-mark{flex-shrink:0;width:16px;text-align:center;color:var(--jl-text-dim)}
        .js-checks li.ok .js-check-mark{color:#9BC77A}
        .js-done{font-family:'Playfair Display',serif;font-size:15px;color:var(--jl-gold);margin:10px 0 0}
        @media(max-width:768px){
          .js-arr-header{padding-left:64px;min-height:56px}
          .js-guide{grid-template-columns:1fr}
        }
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
            Step into the recording studio. Pick a session, then tap or drag
            loops from the crate onto the timeline to arrange your own jazz record.
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
  const previewRef = useRef<AudioBufferSourceNode | null>(null);

  const tracksRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [crateOpen, setCrateOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [dragGhost, setDragGhost] = useState<{ loop: LoopDef; x: number; y: number } | null>(null);
  const [dropLane, setDropLane] = useState<InstrumentCategory | null>(null);
  const [seekTime, setSeekTime] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const tracksFocusRef = useRef<HTMLDivElement>(null);

  // Refs for drag state that shouldn't trigger re-renders
  const dragLoopRef = useRef<LoopDef | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingCrate = useRef(false);

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
      if (previewRef.current) { try { previewRef.current.stop(); } catch { /* noop */ } }
      if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    };
  }, []);

  // ── Preview Playback ──

  const stopPreview = useCallback(() => {
    if (previewRef.current) {
      try { previewRef.current.stop(); } catch { /* noop */ }
      previewRef.current.disconnect();
      previewRef.current = null;
    }
    setPreviewingId(null);
  }, []);

  const previewLoop = useCallback((loop: LoopDef) => {
    stopPreview();
    const ctx = ensureCtx();
    const buf = cacheRef.current.get(loop.file);
    if (!buf) return;
    const s = ctx.createBufferSource();
    s.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.8;
    s.connect(g);
    g.connect(ctx.destination);
    s.start(0);
    s.onended = () => {
      previewRef.current = null;
      setPreviewingId(null);
    };
    previewRef.current = s;
    setPreviewingId(loop.id);
  }, [ensureCtx, stopPreview]);

  const togglePreview = useCallback((loop: LoopDef) => {
    if (previewingId === loop.id) stopPreview();
    else previewLoop(loop);
  }, [previewingId, previewLoop, stopPreview]);

  // ── Playback ──

  const stopPlay = useCallback(() => {
    sourcesRef.current.forEach(s => { try { s.stop(); } catch { /* noop */ } s.disconnect(); });
    sourcesRef.current = [];
    cancelAnimationFrame(animRef.current);
    setPlaying(false);
  }, []);

  const pausePlay = useCallback(() => {
    if (!ctxRef.current) { stopPlay(); return; }
    // Capture current playhead position before stopping
    const elapsed = ctxRef.current.currentTime - startRef.current;
    const pos = Math.min(seekTime + elapsed, TIMELINE_DURATION);
    stopPlay();
    setSeekTime(pos);
    // Update playhead visual to paused position
    if (playheadRef.current) {
      playheadRef.current.style.left = `${(pos / TIMELINE_DURATION) * 100}%`;
    }
  }, [stopPlay, seekTime]);

  const play = useCallback(() => {
    if (!blocks.length) return;
    stopPlay();
    const ctx = ensureCtx();
    const t0 = ctx.currentTime + 0.05;
    startRef.current = t0;
    const srcs: AudioBufferSourceNode[] = [];
    const seek = seekTime;

    for (const b of blocks) {
      const l = session.loops.find(x => x.id === b.loopId);
      if (!l) continue;
      const buf = cacheRef.current.get(l.file);
      if (!buf) continue;
      const dur = loopDuration(session.bpm, l.bars);
      const blockEnd = b.startTime + dur;

      // Skip blocks that end at or before seek position
      if (blockEnd <= seek) continue;

      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.connect(ctx.destination);

      if (b.startTime >= seek) {
        // Block starts after seek — schedule relative to seek
        s.start(t0 + (b.startTime - seek));
        s.stop(t0 + (b.startTime - seek) + dur);
      } else {
        // Block spans the seek point — start with buffer offset
        const bufOffset = seek - b.startTime;
        s.start(t0, bufOffset, dur - bufOffset);
      }
      srcs.push(s);
    }
    sourcesRef.current = srcs;
    setPlaying(true);

    const tick = () => {
      if (!ctxRef.current) return;
      const elapsed = ctxRef.current.currentTime - startRef.current;
      const pos = seek + elapsed; // actual position on timeline
      if (pos >= TIMELINE_DURATION) {
        if (loopRef.current) playRef.current();
        else stopPlay();
        return;
      }
      if (playheadRef.current) {
        playheadRef.current.style.left = `${(pos / TIMELINE_DURATION) * 100}%`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [blocks, session, ensureCtx, stopPlay, seekTime]);

  useEffect(() => { playRef.current = play; }, [play]);

  // ── Block Management ──

  const findNextAvailable = useCallback((loop: LoopDef, blocks: PlacedBlock[]): number | null => {
    const dur = loopDuration(session.bpm, loop.bars);
    const barLen = 240 / session.bpm;
    const laneBlocks = blocks
      .filter(b => b.lane === loop.instrument)
      .sort((a, c) => a.startTime - c.startTime);
    // Walk from time 0 bar-by-bar until we find a gap
    for (let t = 0; t + dur <= TIMELINE_DURATION; t = snapToBar(t + barLen, session.bpm)) {
      const hasOverlap = laneBlocks.some(b => {
        const bl = session.loops.find(x => x.id === b.loopId);
        const bd = bl ? loopDuration(session.bpm, bl.bars) : 0;
        return t < b.startTime + bd && t + dur > b.startTime;
      });
      if (!hasOverlap) return t;
    }
    return null;
  }, [session]);

  const addBlock = useCallback((loop: LoopDef): string | null => {
    let added: string | null = null;
    setBlocks(prev => {
      const startTime = findNextAvailable(loop, prev);
      if (startTime === null) return prev;
      const uid = nuid();
      added = uid;
      return [...prev, { uid, loopId: loop.id, lane: loop.instrument, startTime }];
    });
    return added;
  }, [findNextAvailable]);

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
    setBlocks(prev => prev.filter(b => b.uid !== uid));
  }, []);

  // Single-pointer and keyboard alternative to dragging: tap or press a
  // loop in the crate and it goes into the first free space in its lane.
  const addLoopFromCrate = useCallback((loop: LoopDef) => {
    const t = findNextAvailable(loop, blocks);
    if (t === null) {
      setAnnouncement(`No room left in the ${INST_NAMES[loop.instrument]} lane.`);
      return;
    }
    addBlock(loop);
    setAnnouncement(`Added ${loop.label} to the ${INST_NAMES[loop.instrument]} lane at ${fmtTime(t)}.`);
  }, [blocks, findNextAvailable, addBlock]);

  const nudgeBlock = useCallback((uid: string, dir: -1 | 1) => {
    const b = blocks.find(x => x.uid === uid);
    const l = b && session.loops.find(x => x.id === b.loopId);
    if (!b || !l) return;
    const target = snapToBar(b.startTime + dir * (240 / session.bpm), session.bpm);
    const dur = loopDuration(session.bpm, l.bars);
    const free = target >= 0 && target + dur <= TIMELINE_DURATION + 1e-6 && !blocks.some(x => {
      if (x.uid === uid || x.lane !== b.lane) return false;
      const xl = session.loops.find(ll => ll.id === x.loopId);
      const xd = xl ? loopDuration(session.bpm, xl.bars) : 0;
      return target < x.startTime + xd && target + dur > x.startTime;
    });
    if (!free || target === b.startTime) {
      setAnnouncement(`${l.label} can't move further ${dir < 0 ? 'left' : 'right'}.`);
      return;
    }
    moveBlock(uid, target);
    setAnnouncement(`${l.label} now starts at ${fmtTime(target)}.`);
  }, [blocks, session, moveBlock]);

  const deleteBlock = useCallback((uid: string) => {
    const b = blocks.find(x => x.uid === uid);
    const l = b && session.loops.find(x => x.id === b.loopId);
    // Keep keyboard focus nearby: the next block in the lane, else the timeline.
    const sameLane = blocks.filter(x => b && x.lane === b.lane && x.uid !== uid).sort((a, c) => a.startTime - c.startTime);
    const nextUid = sameLane.find(x => b && x.startTime > b.startTime)?.uid ?? sameLane[sameLane.length - 1]?.uid;
    const hadFocus = !!(document.activeElement && blockRefs.current.get(uid)?.contains(document.activeElement));
    removeBlock(uid);
    setActiveBlockId(null);
    if (l) setAnnouncement(`Removed ${l.label}.`);
    if (hadFocus) {
      requestAnimationFrame(() => {
        const next = nextUid ? blockRefs.current.get(nextUid) : null;
        if (next) next.focus();
        else tracksFocusRef.current?.focus();
      });
    }
  }, [blocks, session, removeBlock]);

  const clearAll = useCallback(() => { stopPlay(); setBlocks([]); setActiveBlockId(null); setSeekTime(0); }, [stopPlay]);

  // ── Starter template and AABA challenge ──
  const template = TEMPLATES[session.id];
  const loadTemplate = useCallback(() => {
    if (!template) return;
    if (blocks.length && !window.confirm('Replace your arrangement with the Head \u2192 Solo \u2192 Head template?')) return;
    stopPlay();
    const bar = 240 / session.bpm;
    const next: PlacedBlock[] = [];
    for (const p of template.placements) {
      const l = session.loops.find(x => x.id === p.loopId);
      if (l) next.push({ uid: nuid(), loopId: l.id, lane: l.instrument, startTime: p.bar * bar });
    }
    setBlocks(next);
    setActiveBlockId(null);
    setSeekTime(0);
    if (playheadRef.current) playheadRef.current.style.left = '0%';
    setAnnouncement('Loaded the template: the head in bars 1 to 8, a solo in bars 9 to 16, the head again in bars 17 to 24. Press Play.');
  }, [template, blocks.length, stopPlay, session]);
  const aaba = useMemo(() => checkAABA(blocks, session), [blocks, session]);

  // ── Add another copy (tap block → "+") ──

  const addAnotherCopy = useCallback((blockUid: string) => {
    setBlocks(prev => {
      const block = prev.find(b => b.uid === blockUid);
      if (!block) return prev;
      const loop = session.loops.find(x => x.id === block.loopId);
      if (!loop) return prev;
      const dur = loopDuration(session.bpm, loop.bars);
      // Try to place right after this block
      let startTime = snapToBar(block.startTime + dur, session.bpm);
      // Find first non-overlapping position in same lane
      const laneBlocks = prev.filter(b => b.lane === block.lane).sort((a, c) => a.startTime - c.startTime);
      let placed = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        if (startTime + dur > TIMELINE_DURATION) break;
        const hasOverlap = laneBlocks.some(b => {
          const bl = session.loops.find(x => x.id === b.loopId);
          const bd = bl ? loopDuration(session.bpm, bl.bars) : 0;
          return startTime < b.startTime + bd && startTime + dur > b.startTime;
        });
        if (!hasOverlap) { placed = true; break; }
        startTime = snapToBar(startTime + 240 / session.bpm, session.bpm);
      }
      if (!placed) return prev;
      return [...prev, { uid: nuid(), loopId: block.loopId, lane: block.lane, startTime }];
    });
    setActiveBlockId(null);
  }, [session]);

  // ── Crate Drag (drag from crate to timeline) ──

  const handleCratePointerDown = useCallback((loop: LoopDef, e: React.PointerEvent) => {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    dragStartPos.current = { x: sx, y: sy };
    dragLoopRef.current = loop;
    isDraggingCrate.current = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!isDraggingCrate.current && Math.sqrt(dx * dx + dy * dy) < 6) return;

      if (!isDraggingCrate.current) {
        isDraggingCrate.current = true;
        stopPreview();
      }
      setDragGhost({ loop, x: ev.clientX, y: ev.clientY });

      // Determine which lane we're hovering over
      if (tracksRef.current) {
        const lanes = tracksRef.current.querySelectorAll<HTMLElement>('[data-lane]');
        let found: InstrumentCategory | null = null;
        lanes.forEach(lane => {
          const rect = lane.getBoundingClientRect();
          if (ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
            found = lane.dataset.lane as InstrumentCategory;
          }
        });
        // Only highlight if the loop matches this lane's instrument
        setDropLane(found === loop.instrument ? found : null);
      }
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setDragGhost(null);
      setDropLane(null);

      if (!isDraggingCrate.current) {
        // It was a tap — add the loop to its lane (the \u25B6 beside it previews)
        addLoopFromCrate(loop);
      } else {
        // It was a drag — try to drop on the matching lane
        if (tracksRef.current) {
          const lanes = tracksRef.current.querySelectorAll<HTMLElement>('[data-lane]');
          lanes.forEach(lane => {
            const rect = lane.getBoundingClientRect();
            if (ev.clientY >= rect.top && ev.clientY <= rect.bottom &&
                lane.dataset.lane === loop.instrument) {
              addBlock(loop);
            }
          });
        }
      }
      dragLoopRef.current = null;
      dragStartPos.current = null;
      isDraggingCrate.current = false;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [stopPreview, addBlock, addLoopFromCrate]);

  // ── Block Interaction (tap → "+", drag horizontal → reposition, drag off → remove) ──

  const handleBlockDown = useCallback((uid: string, e: React.PointerEvent) => {
    // Don't intercept clicks on the "+" button
    if ((e.target as HTMLElement).closest('.js-block-tools')) return;
    e.stopPropagation();
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const laneEl = el.parentElement;
    if (!laneEl) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const laneW = laneEl.clientWidth;
    const block = blocks.find(b => b.uid === uid);
    if (!block) return;
    const origTime = block.startTime;
    let moved = false;
    let removedVisual = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.sqrt(dx * dx + dy * dy) < 5) return;
      moved = true;

      // If dragged far enough vertically off the lane, show removal visual
      if (Math.abs(dy) > 40) {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.opacity = '0.3';
        removedVisual = true;
      } else {
        el.style.transform = `translateX(${dx}px)`;
        el.style.opacity = '0.7';
        removedVisual = false;
      }
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.style.transform = '';
      el.style.opacity = '';

      if (!moved) {
        // It was a tap → toggle the "+" button
        setActiveBlockId(prev => prev === uid ? null : uid);
      } else if (removedVisual || Math.abs(ev.clientY - startY) > 40) {
        // Dragged off → remove the block
        removeBlock(uid);
        setActiveBlockId(null);
      } else {
        // Horizontal drag → reposition
        const dx = ev.clientX - startX;
        if (Math.abs(dx) > 3) {
          moveBlock(uid, origTime + (dx / laneW) * TIMELINE_DURATION);
        }
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [blocks, moveBlock, removeBlock]);

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

  // Dismiss activeBlock when clicking outside
  const handleTimelineClick = useCallback(() => {
    setActiveBlockId(null);
  }, []);

  // Click ruler to set seek position
  const handleRulerClick = useCallback((e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const t = Math.max(0, Math.min(pct * TIMELINE_DURATION, TIMELINE_DURATION));
    if (playing) stopPlay();
    setSeekTime(t);
  }, [playing, stopPlay]);

  // The ruler is also a slider: arrows move a bar, Page keys 30 seconds.
  const handleRulerKey = useCallback((e: React.KeyboardEvent) => {
    const bar = 240 / session.bpm;
    let t: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') t = seekTime + bar;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') t = seekTime - bar;
    else if (e.key === 'PageUp') t = seekTime + 30;
    else if (e.key === 'PageDown') t = seekTime - 30;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = TIMELINE_DURATION;
    if (t === null) return;
    e.preventDefault();
    t = Math.max(0, Math.min(t, TIMELINE_DURATION));
    if (playing) stopPlay();
    setSeekTime(t);
    if (playheadRef.current) playheadRef.current.style.left = `${(t / TIMELINE_DURATION) * 100}%`;
  }, [session.bpm, seekTime, playing, stopPlay]);

  const handleBlockKey = useCallback((uid: string, e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return; // keys on the tool buttons act as clicks
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudgeBlock(uid, -1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nudgeBlock(uid, 1); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteBlock(uid); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveBlockId(prev => prev === uid ? null : uid); }
    else if (e.key === 'Escape') { setActiveBlockId(null); }
  }, [nudgeBlock, deleteBlock]);

  // ── Loading ──

  if (!loaded) {
    return (
      <div className="js-loading" role="status" aria-live="polite">
        <div className="js-loading-title">{session.name}</div>
        <div className="js-loading-subtitle">Loading loops&hellip;</div>
        <div className="js-progress-track" role="progressbar" aria-label="Loading loops" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="js-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="js-workspace">
      <div style={srOnly} role="status" aria-live="polite">{announcement}</div>
      <div className="js-arr-header">
        <button type="button" className="js-arr-back" aria-label="Back to sessions" onClick={() => { stopPlay(); stopPreview(); onBack(); }}><span aria-hidden="true">{'\u2190'}</span></button>
        <h2 className="js-arr-title" style={{ margin: 0 }}>{session.name}</h2>
        {playing && <div className="js-vinyl-mini js-spinning" aria-hidden="true" />}
        <div className="js-arr-meta">{session.bpm} BPM &middot; Key of {session.key}</div>
      </div>

      <div className="js-timeline" onClick={handleTimelineClick}>
        <div className="js-labels">
          <div className="js-ruler-label">TIME</div>
          {session.instruments.map(inst => (
            <div key={inst} className="js-lane-label" style={{ borderLeftColor: INST_COLORS[inst] }}>
              <span className="js-lane-emoji" aria-hidden="true">{INST_EMOJI[inst]}</span>
              <span className="js-lane-name">{INST_NAMES[inst]}</span>
            </div>
          ))}
        </div>

        <span id="js-block-hint" style={srOnly}>Enter shows buttons to move, copy or remove this loop. Arrow keys move it a bar; Delete removes it.</span>
        <div className="js-tracks" ref={(el) => { tracksRef.current = el; tracksFocusRef.current = el; }}
          tabIndex={0} role="region" aria-label={`${session.name} timeline`}>
          <div className="js-tracks-inner">
            <div className="js-ruler" onClick={handleRulerClick}
              role="slider" tabIndex={0} aria-label="Playback start position"
              aria-valuemin={0} aria-valuemax={TIMELINE_DURATION} aria-valuenow={Math.round(seekTime)}
              aria-valuetext={fmtTime(seekTime)} onKeyDown={handleRulerKey}>
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
                className={`js-lane${dropLane === inst ? ' js-lane-drop' : ''}`}
                data-lane={inst}
                role="group"
                aria-label={`${INST_NAMES[inst]} lane`}
              >
                {blocks.filter(b => b.lane === inst).map(block => {
                  const loop = session.loops.find(x => x.id === block.loopId);
                  if (!loop) return null;
                  const dur = loopDuration(session.bpm, loop.bars);
                  const isActive = activeBlockId === block.uid;
                  return (
                    <Fragment key={block.uid}>
                    <div
                      ref={(el) => { if (el) blockRefs.current.set(block.uid, el); else blockRefs.current.delete(block.uid); }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isActive}
                      aria-label={`${loop.label}, ${INST_NAMES[inst]}, starts at ${fmtTime(block.startTime)}`}
                      aria-keyshortcuts="ArrowLeft ArrowRight Delete"
                      aria-describedby="js-block-hint"
                      onKeyDown={(e) => handleBlockKey(block.uid, e)}
                      className="js-block"
                      style={{
                        left: `${(block.startTime / TIMELINE_DURATION) * 100}%`,
                        width: `${(dur / TIMELINE_DURATION) * 100}%`,
                        background: `${INST_COLORS[inst]}35`,
                        borderColor: INST_COLORS[inst],
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => handleBlockDown(block.uid, e)}
                      title={`${loop.label} (${loop.bars} bars)`}
                    >
                      <span className="js-block-inner">
                        <span className="js-block-label">{loop.label}</span>
                      </span>
                    </div>
                      {isActive && (
                        <span className="js-block-tools" role="group" aria-label={`${loop.label} tools`}
                          style={block.startTime < TIMELINE_DURATION / 2
                            ? { left: `calc(${(block.startTime / TIMELINE_DURATION) * 100}% + 2px)`, right: 'auto', top: -6 }
                            : { left: `calc(${((block.startTime + dur) / TIMELINE_DURATION) * 100}% - 2px)`, right: 'auto', top: -6, transform: 'translateX(-100%)' }}>
                          <button
                            type="button"
                            className="js-block-add"
                            onClick={(e) => { e.stopPropagation(); nudgeBlock(block.uid, -1); }}
                            aria-label={`Move ${loop.label} left`}
                            title="Move left"
                          >
                            <span aria-hidden="true">{'\u2039'}</span>
                          </button>
                          <button
                            type="button"
                            className="js-block-add"
                            onClick={(e) => { e.stopPropagation(); nudgeBlock(block.uid, 1); }}
                            aria-label={`Move ${loop.label} right`}
                            title="Move right"
                          >
                            <span aria-hidden="true">{'\u203A'}</span>
                          </button>
                          <button
                            type="button"
                            className="js-block-add"
                            onClick={(e) => { e.stopPropagation(); addAnotherCopy(block.uid); setAnnouncement(`Added another copy of ${loop.label}.`); }}
                            aria-label={`Add another copy of ${loop.label}`}
                            title="Add another copy"
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                          <button
                            type="button"
                            className="js-block-add"
                            onClick={(e) => { e.stopPropagation(); deleteBlock(block.uid); }}
                            aria-label={`Remove ${loop.label}`}
                            title="Remove"
                          >
                            <span aria-hidden="true">{'\u00D7'}</span>
                          </button>
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            ))}

            <div
              ref={playheadRef}
              className="js-playhead"
              aria-hidden="true"
              style={{ left: `${(seekTime / TIMELINE_DURATION) * 100}%`, opacity: playing ? 1 : 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="js-transport">
        {!playing ? (
          <button type="button" className="jl-btn" onClick={play} disabled={!blocks.length}><span aria-hidden="true">{'\u25B6'}</span> Play</button>
        ) : (
          <button type="button" className="jl-btn" onClick={pausePlay}><span aria-hidden="true">{'\u23F8'}</span> Pause</button>
        )}
        <button type="button" className={`jl-btn${looping ? ' active' : ''}`} aria-pressed={looping} onClick={() => setLooping(p => !p)}><span aria-hidden="true">{'\u27F3'}</span> Loop</button>
        <button className="jl-btn" onClick={clearAll} disabled={!blocks.length}>Clear All</button>
        <button className="jl-btn" onClick={download} disabled={!blocks.length || downloading}>
          {downloading ? 'Preparing\u2026' : <><span aria-hidden="true">{'\u2913'}</span> Download</>}
        </button>
      </div>

      <div className="js-guide">
        {template && (
          <div className="js-guide-card">
            <h3 className="js-guide-title">Start from a template</h3>
            <p className="js-guide-text">
              <strong>Head {'\u2192'} Solo {'\u2192'} Head</strong>: play the tune (the head), take a solo, then play the tune again.
              <span className="js-guide-dim"> Bars 1{'\u2013'}8, 9{'\u2013'}16 and 17{'\u2013'}24.</span>
            </p>
            <button type="button" className="jl-btn" onClick={loadTemplate}>Load template</button>
          </div>
        )}
        <details className="js-guide-card">
          <summary><h3 className="js-guide-title">Challenge: build a 32-bar AABA tune</h3></summary>
          <p className="js-guide-text" style={{ marginTop: 8 }}>
            AABA is the shape of many jazz standards: a tune (A) played twice, a different
            section called the bridge (B), then the tune once more. Four 8-bar sections make 32 bars.
          </p>
          <ul className="js-checks" aria-label="Challenge progress">
            {[
              { ok: aaba.firstA, text: 'A: a horn or piano loop starts in bars 1\u20138' },
              { ok: aaba.secondA, text: 'A again: the same loop starts in bars 9\u201316' },
              { ok: aaba.bridge, text: 'B, the bridge: a different horn or piano loop in bars 17\u201324' },
              { ok: aaba.lastA, text: 'A to finish: the first loop returns in bars 25\u201332' },
              { ok: aaba.rhythm, text: 'Rhythm: drums or bass playing in all four sections' },
            ].map(c => (
              <li key={c.text} className={c.ok ? 'ok' : ''}>
                <span className="js-check-mark" aria-hidden="true">{c.ok ? '\u2713' : '\u25CB'}</span>
                <span>{c.text}<span style={srOnly}>{c.ok ? ', done' : ', not yet'}</span></span>
              </li>
            ))}
          </ul>
          <div role="status">{aaba.done && <p className="js-done">You built a 32-bar AABA tune. Press Play to hear it.</p>}</div>
        </details>
      </div>

      <div className="js-crate">
        <button type="button" className="js-crate-toggle" aria-expanded={crateOpen} aria-controls="js-crate-body" onClick={() => setCrateOpen(p => !p)}>
          <span aria-hidden="true">{crateOpen ? '\u25BE' : '\u25B4'}</span> Sample Crate
        </button>
        <span id="js-tile-hint" style={srOnly}>Adds this loop to the first free space in its lane on the timeline.</span>
        {crateOpen && (
          <div className="js-crate-body" id="js-crate-body">
            {session.instruments.map(inst => (
              <div key={inst} className="js-crate-group">
                <div className="js-crate-title" style={{ color: lighten(INST_COLORS[inst], 0.25) }}>
                  <span aria-hidden="true">{INST_EMOJI[inst]}</span> {INST_NAMES[inst]}
                </div>
                <div className="js-crate-tiles">
                  {(loopsByInst.get(inst) || []).map(loop => (
                    <span key={loop.id} className="js-tile-wrap">
                      <button
                        type="button"
                        className={`js-tile${previewingId === loop.id ? ' js-tile-playing' : ''}`}
                        style={{ borderColor: INST_COLORS[inst] }}
                        aria-describedby="js-tile-hint"
                        onPointerDown={(e) => handleCratePointerDown(loop, e)}
                        onClick={(e) => { if (e.detail === 0) addLoopFromCrate(loop); }}
                      >
                        <span className="js-tile-name">{loop.label}</span>
                        <span className="js-tile-info">{loop.bars} {loop.bars === 1 ? 'bar' : 'bars'}</span>
                      </button>
                      <button
                        type="button"
                        className="js-tile-preview"
                        style={{ borderColor: INST_COLORS[inst] }}
                        aria-label={`Preview ${loop.label}, ${loop.bars} ${loop.bars === 1 ? 'bar' : 'bars'}`}
                        aria-pressed={previewingId === loop.id}
                        title="Preview"
                        onClick={() => togglePreview(loop)}
                      >
                        <span aria-hidden="true">{previewingId === loop.id ? '\u25A0' : '\u25B6'}</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drag ghost */}
      {dragGhost && (
        <div
          className="js-drag-ghost"
          style={{
            left: dragGhost.x - 30,
            top: dragGhost.y - 16,
            background: `${INST_COLORS[dragGhost.loop.instrument]}cc`,
            borderColor: INST_COLORS[dragGhost.loop.instrument],
          }}
        >
          {dragGhost.loop.label}
        </div>
      )}
    </div>
  );
}
