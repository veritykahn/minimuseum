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
        .js-timeline{display:flex;border:1px solid rgba(201,169,78,0.15);border-radius:8px;background:var(--jl-bg-stage);overflow:hidden}
        .js-labels{flex-shrink:0;width:80px;border-right:1px solid rgba(201,169,78,0.1)}
        .js-ruler-label{height:28px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(201,169,78,0.1);font-family:'Josefin Sans',sans-serif;font-size:7px;letter-spacing:2px;color:var(--jl-text-dim);text-transform:uppercase}
        .js-lane-label{height:52px;display:flex;align-items:center;gap:6px;padding:0 8px;border-bottom:1px solid rgba(201,169,78,0.06);border-left:3px solid}
        .js-lane-emoji{font-size:16px}
        .js-lane-name{font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--jl-text-dim);font-weight:600}
        .js-tracks{flex:1;position:relative;overflow-x:auto;min-width:0}
        .js-tracks-inner{min-width:1800px;position:relative}
        .js-ruler{height:28px;position:relative;border-bottom:1px solid rgba(201,169,78,0.15)}
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
        .js-block-removing{opacity:0.3;transform:translateY(-20px);transition:all 0.2s}
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
        .js-tile{background:rgba(255,255,255,0.03);border:1px solid;border-radius:4px;padding:5px 10px;cursor:grab;display:flex;align-items:center;gap:6px;transition:all 0.2s;-webkit-tap-highlight-color:transparent;touch-action:none;user-select:none}
        .js-tile:hover{background:rgba(201,169,78,0.08)}
        .js-tile-playing{box-shadow:0 0 10px rgba(201,169,78,0.4);background:rgba(201,169,78,0.12)}
        .js-tile-name{font-family:'Josefin Sans',sans-serif;font-size:11px;font-weight:600;color:var(--jl-text)}
        .js-tile-info{font-family:'Josefin Sans',sans-serif;font-size:9px;color:var(--jl-text-dim)}
        .js-drag-ghost{position:fixed;z-index:9999;pointer-events:none;border:1px solid;border-radius:4px;padding:4px 10px;font-family:'Josefin Sans',sans-serif;font-size:11px;font-weight:600;color:var(--jl-text);opacity:0.85;box-shadow:0 4px 16px rgba(0,0,0,0.4);white-space:nowrap}
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
            Step into the recording studio. Pick a session, then drag loops
            from the crate onto the timeline to arrange your own jazz record.
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

  const clearAll = useCallback(() => { stopPlay(); setBlocks([]); setActiveBlockId(null); }, [stopPlay]);

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
        // It was a tap — preview the loop
        previewLoop(loop);
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
  }, [previewLoop, stopPreview, addBlock]);

  // ── Block Interaction (tap → "+", drag horizontal → reposition, drag off → remove) ──

  const handleBlockDown = useCallback((uid: string, e: React.PointerEvent) => {
    // Don't intercept clicks on the "+" button
    if ((e.target as HTMLElement).closest('.js-block-add')) return;
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
        <button className="js-arr-back" onClick={() => { stopPlay(); stopPreview(); onBack(); }}>{'\u2190'}</button>
        <div className="js-arr-title">{session.name}</div>
        {playing && <div className="js-vinyl-mini js-spinning" />}
        <div className="js-arr-meta">{session.bpm} BPM &middot; Key of {session.key}</div>
      </div>

      <div className="js-timeline" onClick={handleTimelineClick}>
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
          <div className="js-tracks-inner">
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
                className={`js-lane${dropLane === inst ? ' js-lane-drop' : ''}`}
                data-lane={inst}
              >
                {blocks.filter(b => b.lane === inst).map(block => {
                  const loop = session.loops.find(x => x.id === block.loopId);
                  if (!loop) return null;
                  const dur = loopDuration(session.bpm, loop.bars);
                  const isActive = activeBlockId === block.uid;
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
                      title={`${loop.label} (${loop.bars} bars)`}
                    >
                      <span className="js-block-inner">
                        <span className="js-block-label">{loop.label}</span>
                      </span>
                      {isActive && (
                        <button
                          className="js-block-add"
                          onClick={(e) => { e.stopPropagation(); addAnotherCopy(block.uid); }}
                          title="Add another copy"
                        >
                          +
                        </button>
                      )}
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
                  {(loopsByInst.get(inst) || []).map(loop => (
                    <button
                      key={loop.id}
                      className={`js-tile${previewingId === loop.id ? ' js-tile-playing' : ''}`}
                      style={{ borderColor: INST_COLORS[inst] }}
                      onPointerDown={(e) => handleCratePointerDown(loop, e)}
                    >
                      <span className="js-tile-name">{loop.label}</span>
                      <span className="js-tile-info">{loop.bars}b</span>
                    </button>
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
