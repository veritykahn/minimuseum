'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react';
import { createPortal } from 'react-dom';
import FactNote from '@/components/exhibition/FactNote';
import { FEAR_LAB_COPY as C } from '../fearLab';
import { animationUrl, ownsAnimation, type OwnedAssets } from './assets';
import { BOX_COUNT, drawOpening, type Content } from './boxes';
import { AFTER_SCALE, BEFORE_SCALE, dreadLine, pulseFromTaps, type Dread } from './lab';
import { creatureSlot, type LabSound } from './sound';
import SoundPrompt from './SoundPrompt';
import SurpriseBurst, { SurpriseArt } from './Surprise';
import { surprise } from './surprises';
import Swarm from './Swarm';
import { swarmLength } from './spiderPaths';

/*
 * The point: poster 1 says the waiting is scarier than what is inside; here
 * the visitor tests it on themselves. Before each lid opens they say how
 * nervous they are (1 to 5), and once the lights are up how scary it really
 * was; the tally says in how many boxes the waiting was worse (lab.ts,
 * dreadLine). It is an honest test: a real creature can be worse than the
 * waiting, and the tally says so when it was.
 *
 * The rating (Nov 19 rework): tapping a box with no rating chosen yet holds
 * the box ("Before the lid opens: how nervous are you?"), and the rating
 * opens it; a rating chosen first opens the next box tapped. The "how
 * scary was it really" rating waits beside the reveal and is optional.
 *
 * The fear boxes (poster 1's mystery box, five times over): a row of closed
 * boxes on a shelf in the dark. A nudge to turn the sound on comes first,
 * with a warning, in a short pop-up ("I'm ready", or "Gentle mode", which
 * turns the lab's gentle mode on and starts), and the boxes wait until the
 * visitor says they are ready.
 *
 * Pick one, and the whole screen goes dark. The box creaks slowly open in a
 * thin light while the heart monitor quickens and the music tightens. Only
 * then is what is inside drawn, by chance (drawOpening, boxes.ts), so no box
 * is safe to learn: about half the time a scary sound plays and lots and
 * lots of spiders crawl out across the whole screen (Swarm.tsx), and the
 * lights come back up on a cockroach, a tarantula, a bat, a snake, a rat or
 * a centipede, with one checked creepy fact (its source, and the
 * photograph's credit, are in the lab's Sources drawer, labSources.ts).
 * Otherwise, something harmless: mostly a silly surprise that bursts out
 * with a silly sound (slime, confetti, a jack-in-the-box, a rubber chicken,
 * bubbles, a feather: Surprise.tsx) and a friendly line, sometimes the
 * poster's pinecone, or just a breath of air: nothing. Closing the box shuts
 * its lid, visibly, on the shelf, with what was inside on a little label.
 *
 * Gentle mode (a teacher's switch at the top): mostly harmless openings, and
 * never three scares in a row; a few slow, cartoon spiders, and softer
 * sounds. With motion off (or the visitor's reduced-motion setting), nothing
 * crawls, splats, jumps or shakes: the spiders fade in and out where they
 * are, and the creature or the surprise simply fades in. Skip, or Escape,
 * turns the lights straight back on. Nothing flashes and nothing is gory.
 *
 * Beside it, a pulse you take yourself, by tapping along with it, before and
 * after: it stays on this screen, and nothing is kept.
 */

/** How long a box takes to creak open, in the dark, in ms. */
export const BUILD_MS = 2600;
/** How long something harmless shows in the dark, in ms. */
export const HARMLESS_MS = 2400;
/** How long a silly surprise bursts, splats and settles in the dark, in ms. */
export const SURPRISE_MS = 3600;
/** How long the lid takes to close, in ms. */
export const CLOSE_MS = 700;
/** How long the jump lasts, in ms, before the heart starts to settle. */
export const JUMP_MS = 1100;

type Phase = 'warn' | 'pick' | 'build' | 'out' | 'reveal' | 'closing';

/** The pinecone, scale by scale. */
function Pinecone() {
  const scales: { x: number; y: number; w: number }[] = [];
  const rows = 8;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const width = 30 + Math.sin(t * Math.PI * 0.9 + 0.2) * 34;
    const n = r % 2 ? 4 : 5;
    for (let k = 0; k < n; k++) {
      const x = (k - (n - 1) / 2) * (width / (n - 0.6));
      scales.push({ x: Math.round(x * 10) / 10, y: r * 13, w: Math.round((width / n) * 1.25 * 10) / 10 });
    }
  }
  return (
    <svg viewBox="-70 -40 140 160" className="fl-fb-pinecone" role="img" aria-label="A pinecone">
      <path d="M -4 -14 Q 0 -26 6 -30" stroke="#5b3a1e" strokeWidth="4" fill="none" strokeLinecap="round" />
      {scales.map((s, i) => (
        <path
          key={i}
          d={`M ${s.x - s.w / 2} ${s.y} Q ${s.x} ${s.y + 22} ${s.x + s.w / 2} ${s.y} Q ${s.x} ${s.y + 6} ${s.x - s.w / 2} ${s.y} Z`}
          fill={i % 3 === 0 ? '#8a5a2f' : i % 3 === 1 ? '#a06a38' : '#76491f'}
          stroke="#3e2410"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}

/**
 * The boxes on the shelf: a matching set of five, all the owner's chest
 * (made with Leonardo.Ai, cut out, lid shut; not credited on the page, at
 * the owner's request), each with its number. To use another of her boxes
 * (box-crate, box-hatbox, box-tin, in the same folder) or a new one, change
 * BOX_LOOK: its picture, its size, and where its lid meets the box, as a
 * share of its height.
 *
 * The box is built in 3D from the picture: the front of the body; the lid,
 * cut from the picture, with a plain top behind it; and the dark inside.
 * The lid is hinged along the back edge of the box, so it swings up and
 * back, and its dark underside shows when it is open.
 */
export const BOX_LOOK = { src: '/exhibitions/fear-lab/boxes/box-chest.webp', w: 900, h: 637, lid: 0.46 } as const;

/** A box: its body, its dark inside, its lid on a hinge at the back, and its number. */
function BoxArt({ n }: { n: number }) {
  const look = BOX_LOOK;
  const vars = { ['--box-src' as string]: `url(${look.src})`, ['--box-lid' as string]: String(look.lid), aspectRatio: `${look.w} / ${look.h}` } as CSSProperties;
  return (
    <span className="fl-fb-art" style={vars} aria-hidden="true">
      <span className="fl-fb-3d">
        <span className="fl-fb-mouth" />
        <span className="fl-fb-body" />
        <span className="fl-fb-lid">
          <span className="fl-fb-lid-back" />
          <span className="fl-fb-lid-top" />
          <span className="fl-fb-lid-front">
            <span className="fl-fb-lid-under" />
          </span>
        </span>
      </span>
      <span className="fl-fb-n">{n}</span>
    </span>
  );
}

/** What was inside, in a few words, for the closed box's label. */
export const said = (c: Content) =>
  c.kind === 'creature' ? c.name.replace('!', '') : c.kind === 'surprise' ? surprise(c.id).label : c.kind === 'pinecone' ? 'a pinecone' : 'nothing';

/** Whether a box's contents give a fright (spiders pour out) or not (something harmless, with a pleasant sound). */
export const isScary = (c: Content) => c.kind === 'creature';

/**
 * How long what comes out of the box lasts, in the dark, before the lights
 * come back up, in ms: the spiders (slower in gentle mode, shorter when
 * nothing may crawl), a silly surprise (shorter when it may not move), or
 * something harmless.
 */
export function outMs(c: Content, gentle: boolean, still: boolean): number {
  if (c.kind === 'surprise') return still ? HARMLESS_MS : SURPRISE_MS;
  if (!isScary(c)) return HARMLESS_MS;
  return still ? 2600 : swarmLength(gentle) + 300;
}

export default function FearBoxes({
  motion,
  gentle,
  soundOn,
  onSoundOn,
  sound,
  onFright,
  owned = [],
  rand = Math.random,
  onGentle,
}: {
  motion: boolean;
  gentle: boolean;
  /** Turns gentle mode on or off (the lab's own switch), from the warning's pop-up. */
  onGentle?: (on: boolean) => void;
  soundOn: boolean;
  onSoundOn: () => void;
  sound: () => LabSound | null;
  /** How frightened the scene is, 0–1, for the heart monitor and the music. */
  onFright: (f: number) => void;
  /** The owner's own files that are in place (assets.ts). */
  owned?: OwnedAssets;
  /** Where the chance comes from, as each lid opens: injectable, for the tests. */
  rand?: () => number;
}) {
  const [phase, setPhase] = useState<Phase>('warn');
  // The startle warning, in a short pop-up over the boxes until the visitor is ready.
  const [warnOpen, setWarnOpen] = useState(true);
  const warnRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLButtonElement>(null);
  // What each box turned out to hold, once opened; nothing is decided before a lid lifts.
  const [inside, setInside] = useState<(Content | null)[]>(() => Array(BOX_COUNT).fill(null));
  const opened = inside.map((c) => c !== null);
  const [current, setCurrent] = useState(-1);
  const [content, setContent] = useState<Content | null>(null);
  const history = useRef<Content[]>([]);
  const [status, setStatus] = useState('');
  const [after, setAfter] = useState(false);
  /** How nervous, chosen before the next lid opens (1–5), and a box held until it is. */
  const [nervous, setNervous] = useState<number | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  /** Each opening's ratings, in order: before, and (once rated) after. */
  const [dreads, setDreads] = useState<Dread[]>([]);
  const rateRef = useRef<HTMLDivElement>(null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearAll, []);
  // The dark covers the whole room, over the tabs and the way back, so it sits at the room's root.
  useEffect(() => setPortal(root.current?.closest<HTMLElement>('.fl-room') ?? document.body), []);
  // The owner's own animations, where she has dropped them in.
  const spiderSlot = gentle ? 'spiders-gentle' : 'spiders';
  const video = ownsAnimation(owned, spiderSlot) ? animationUrl(spiderSlot) : null;
  const surpriseVideo = (c: Content) => {
    const slot = c.kind === 'surprise' ? surprise(c.id).animation : undefined;
    return slot && ownsAnimation(owned, slot) ? animationUrl(slot) : null;
  };

  const dark = phase === 'build' || phase === 'out';

  // Keyboard: the skip button takes focus in the dark, and Escape skips too.
  useEffect(() => {
    if (!dark) return;
    skipRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') skipRef.current?.click();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dark]);
  useEffect(() => {
    if (phase === 'reveal') closeRef.current?.focus();
  }, [phase]);
  useEffect(() => {
    if (phase === 'warn' && warnOpen) readyRef.current?.focus();
  }, [phase, warnOpen, portal]);

  const ready = () => {
    setWarnOpen(false);
    setPhase('pick');
    setStatus('Five boxes. Pick one.');
    sound()?.play('tick');
    // The pop-up goes: the focus goes to the first box.
    boxRefs.current[0]?.focus();
  };
  /** The warning's keys: Esc closes it; Tab keeps to its buttons. */
  const onWarnKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setWarnOpen(false);
    } else if (e.key === 'Tab') {
      const items = [...(warnRef.current?.querySelectorAll<HTMLElement>('button') ?? [])];
      if (!items.length) return;
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : at === items.length - 1 ? 0 : at + 1;
      e.preventDefault();
      items[next].focus();
    }
  };

  const pick = (i: number) => {
    if (phase !== 'pick' || opened[i]) return;
    // First, how nervous: the box waits for the answer.
    if (nervous === null) {
      setHeld(i);
      setStatus(`Box ${i + 1}. Before the lid opens: how nervous are you?`);
      rateRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      return;
    }
    openBox(i, nervous);
  };

  /** Before a lid opens: how nervous. With a box held, it opens. */
  const rateBefore = (v: number) => {
    setNervous(v);
    if (held !== null && phase === 'pick') openBox(held, v);
  };

  /** Once the lights are up: how scary it really was, for this opening. */
  const rateAfter = (v: number) => setDreads((d) => d.map((x, k) => (k === d.length - 1 ? { ...x, after: v } : x)));

  const openBox = (i: number, before: number) => {
    setHeld(null);
    setNervous(null);
    setDreads((d) => [...d, { before }]);
    clearAll();
    // What is inside is drawn now, as the lid starts to lift, whichever box it is.
    const c = drawOpening(history.current, gentle, rand);
    history.current = [...history.current, c];
    setCurrent(i);
    setContent(c);
    setPhase('build');
    setStatus(`The lights go out. Box ${i + 1} creaks open…`);
    sound()?.play('creak', { length: BUILD_MS / 1000 });
    // The dread builds as the lid lifts.
    for (let k = 0; k <= 5; k++) later((BUILD_MS * k) / 5, () => onFright(0.3 + k * 0.12));
    later(BUILD_MS, () => comeOut(i, c));
  };

  /** What comes out, still in the dark. */
  const comeOut = (i: number, c: Content) => {
    setPhase('out');
    if (isScary(c)) {
      sound()?.play('scary');
      sound()?.play('spiders');
      onFright(gentle ? 0.7 : 1);
      setStatus(gentle ? 'A few friendly spiders wander out of the box.' : 'Spiders! Lots and lots of spiders pour out of the box!');
    } else if (c.kind === 'surprise') {
      const s = surprise(c.id);
      if (s.soundAt && motion) later(s.soundAt, () => sound()?.play(s.sound));
      else sound()?.play(s.sound);
      // The jolt: the heart jumps anyway, then settles.
      onFright(gentle ? 0.6 : 0.8);
      later(1200, () => onFright(0.4));
      setStatus(s.out);
    } else if (c.kind === 'pinecone') {
      sound()?.play('harmless');
      onFright(0.3);
      setStatus('Something rises gently out of the box…');
    } else {
      sound()?.play('empty');
      onFright(0.45);
      setStatus('A breath of air from the box…');
    }
    later(outMs(c, gentle, !motion), () => reveal(i, c));
  };

  /** The lights come back up, on what was in the box. */
  const reveal = (i: number, c: Content) => {
    clearAll();
    setInside((o) => o.map((v, k) => (k === i ? c : v)));
    setPhase('reveal');
    setAfter(true);
    if (c.kind === 'creature') {
      sound()?.play(creatureSlot(c.id));
      onFright(gentle ? 0.6 : 0.9);
      setStatus(`${c.name} It was in box ${i + 1}.`);
      later(JUMP_MS + 800, () => onFright(0.45));
    } else if (c.kind === 'surprise') {
      onFright(0.25);
      setStatus(`${surprise(c.id).name} It was in box ${i + 1}.`);
      later(1600, () => onFright(0.1));
    } else if (c.kind === 'nothing') {
      onFright(0.4);
      setStatus('Nothing. Just the dark.');
      later(1600, () => onFright(0.2));
    } else {
      onFright(0.2);
      setStatus('It’s really just a pinecone.');
      later(1800, () => onFright(0.1));
    }
  };

  const skip = () => {
    if (current >= 0 && dark && content) reveal(current, content);
  };

  const close = () => {
    clearAll();
    setPhase('closing');
    sound()?.play('lid-close');
    onFright(0);
    setStatus(`The lid of box ${current + 1} closes.`);
    later(motion ? CLOSE_MS : 0, () => {
      const left = opened.filter((o) => !o).length;
      setPhase('pick');
      setCurrent(-1);
      setContent(null);
      setStatus(left ?`${left} ${left === 1 ? 'box' : 'boxes'} still shut.` : 'Every box is open.');
      boxRefs.current[opened.findIndex((o) => !o)]?.focus();
    });
  };

  const refill = () => {
    clearAll();
    setHeld(null);
    setInside(Array(BOX_COUNT).fill(null));
    setCurrent(-1);
    setContent(null);
    setPhase('pick');
    onFright(0);
    setStatus('A new row of boxes.');
  };

  const allOpen = opened.every(Boolean);
  const showing = phase === 'reveal' && content;
  const n = current + 1;

  const overlay =
    dark && content && portal
      ? createPortal(
          <div className="fl-fb-dark" data-stage={phase} data-motion={motion ? 'on' : 'off'} data-gentle={gentle ? 'true' : undefined}>
            <div
              className="fl-fb-box fl-fb-dark-box"
              data-building={phase === 'build' ? 'true' : undefined}
              data-open={phase === 'out' ? 'true' : undefined}
              data-scary={phase === 'out' && isScary(content) ? 'true' : undefined}
              data-pop={phase === 'out' && content.kind === 'surprise' ? 'true' : undefined}
              style={{ ['--build' as string]: `${BUILD_MS}ms` } as CSSProperties}
              aria-hidden="true"
            >
              <BoxArt n={n} />
            </div>
            {phase === 'out' && content.kind === 'surprise' && <SurpriseBurst id={content.id} still={!motion} video={surpriseVideo(content)} />}
            {phase === 'out' && (content.kind === 'pinecone' || content.kind === 'nothing') && (
              <div className="fl-fb-gift" data-kind={content.kind} aria-hidden="true">
                {content.kind === 'pinecone' ? <Pinecone /> : <span className="fl-fb-nothing">…nothing.</span>}
              </div>
            )}
            {phase === 'out' && isScary(content) && <Swarm gentle={gentle} still={!motion} video={video} />}
            <button ref={skipRef} type="button" className="fl-fb-skip" onClick={skip}>
              Skip <span aria-hidden="true">(Esc)</span>
            </button>
          </div>,
          portal,
        )
      : null;

  return (
    <div ref={root} className="fl-box fl-fb" data-phase={phase} data-motion={motion ? 'on' : 'off'}>
      {overlay}
      <div className="fl-box-scene fl-fb-scene">
        <span className="fl-fb-spot" aria-hidden="true" />

        <div className="fl-fb-shelf" role="group" aria-label="Fear boxes">
          {inside.map((c, i) => {
            const isOpen = current === i && (dark || phase === 'reveal');
            return (
              <button
                key={i}
                ref={(el) => {
                  boxRefs.current[i] = el;
                }}
                type="button"
                className="fl-fb-box"
                data-open={isOpen ? 'true' : undefined}
                data-closing={current === i && phase === 'closing' ? 'true' : undefined}
                data-held={held === i && phase === 'pick' ? 'true' : undefined}
                data-done={opened[i] && !isOpen ? 'true' : undefined}
                aria-disabled={phase !== 'pick' || opened[i] ? 'true' : undefined}
                aria-label={c ? `Box ${i + 1}, opened: ${said(c)}` : `Box ${i + 1}`}
                onClick={() => pick(i)}
              >
                <BoxArt n={i + 1} />
                {c && !isOpen && (
                  <span className="fl-fb-done" aria-hidden="true">
                    {said(c)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* What was in the box, in the light. */}
        {showing && (
          <div className="fl-fb-reveal" data-kind={content.kind} aria-hidden={content.kind === 'nothing' ? 'true' : undefined}>
            {content.kind === 'creature' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={current}
                className="fl-fb-creature"
                data-id={content.id}
                src={content.src}
                width={content.width}
                height={content.height}
                alt={content.alt}
              />
            )}
            {content.kind === 'surprise' && <SurpriseArt key={current} id={content.id} className="fl-fb-surprise" />}
            {content.kind === 'pinecone' && <Pinecone />}
            {content.kind === 'nothing' && <span className="fl-fb-nothing">…nothing.</span>}
          </div>
        )}

        {phase !== 'reveal' && (
          <div className="fl-fb-veil" aria-hidden="true">
            <span>?</span>
          </div>
        )}
      </div>

      {phase === 'warn' && warnOpen && portal && createPortal(
        <div className="fl-fb-warn-scrim">
          <div
            ref={warnRef}
            className="fl-fb-warn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fl-fb-warn-title"
            onKeyDown={onWarnKey}
          >
            <button type="button" className="fl-fb-warn-close" aria-label="Close the warning" onClick={() => setWarnOpen(false)}>
              <span aria-hidden="true">×</span>
            </button>
            <h2 className="fl-lab-heading" id="fl-fb-warn-title">{gentle ? 'Gentle mode is on' : 'Startle warning'}</h2>
            <SoundPrompt soundOn={soundOn} onSoundOn={onSoundOn} why="Every box creaks as it opens, and you’ll hear what comes out." />
            <div className="fl-lab-warning" role="note">
              {gentle ? (
                <p><strong>Gentle mode is on.</strong> The room goes dark as a box opens. Mostly it’s something silly; now and then a few slow, friendly cartoon spiders, then a real animal.</p>
              ) : (
                <p><strong>Startle warning.</strong> The room goes dark as a box opens, and chance decides what comes out: maybe lots of spiders, then a real animal, or something silly. Nothing flashes and nothing is gory.</p>
              )}
              <p>Press Skip, or Esc, to turn the lights back on.</p>
            </div>
            <div className="fl-fb-warn-actions">
              <button ref={readyRef} type="button" className="fl-lab-button" onClick={ready}>
                I’m ready
              </button>
              {gentle ? (
                <button type="button" className="fl-lab-button fl-lab-button-quiet" onClick={() => onGentle?.(false)}>
                  Gentle mode off
                </button>
              ) : (
                <button type="button" className="fl-lab-button fl-lab-button-quiet" onClick={() => { onGentle?.(true); ready(); }}>
                  Gentle mode
                </button>
              )}
            </div>
          </div>
        </div>,
        portal,
      )}

      <div className="fl-lab-panel-body">
        {phase === 'warn' && (
          <>
            <h2 className="fl-lab-heading">The Fear Boxes</h2>
            <p className="fl-lab-poster">{C.box}</p>
            {!warnOpen && (
              <button type="button" className="fl-lab-button" onClick={() => setWarnOpen(true)}>
                Open the boxes
              </button>
            )}
          </>
        )}

        {(phase === 'pick' || phase === 'build' || phase === 'out' || phase === 'closing') && (
          <>
            <h2 className="fl-lab-heading">{held !== null ? `Box ${held + 1}: before it opens` : 'Pick a box'}</h2>
            <p className="fl-lab-poster">{after ? C.mysteryBox : C.box}</p>
            <p className="fl-lab-note">Nothing is in a box until its lid opens: then chance decides. Something might crawl out. Or something silly. Or nothing at all.</p>
            {phase === 'pick' && !allOpen && (
              <Scale
                refEl={rateRef}
                question={held !== null ? `Before box ${held + 1} opens: how nervous are you?` : 'Before you open one: how nervous are you?'}
                labels={BEFORE_SCALE}
                value={nervous}
                onChoose={rateBefore}
              />
            )}
            {dreadLine(dreads) && <p className="fl-lab-note fl-fb-tally">{dreadLine(dreads)}</p>}
            {allOpen && phase === 'pick' && (
              <button type="button" className="fl-lab-button" onClick={refill}>New boxes</button>
            )}
          </>
        )}

        {phase === 'reveal' && content && (
          <>
            <p className="fl-lab-kicker">Box {n}</p>
            {content.kind === 'creature' && (
              <>
                <h2 className="fl-lab-heading">{content.name}</h2>
                <FactNote fact={content.fact} className="fl-lab-fact" />
              </>
            )}
            {content.kind === 'surprise' && (
              <>
                <h2 className="fl-lab-heading">{surprise(content.id).name}</h2>
                <p className="fl-fb-line">{surprise(content.id).line}</p>
              </>
            )}
            {content.kind === 'nothing' && (
              <>
                <h2 className="fl-lab-heading">Nothing</h2>
                <p className="fl-lab-poster">{C.unknown}</p>
              </>
            )}
            {content.kind === 'pinecone' && (
              <>
                <h2 className="fl-lab-heading">Just a pinecone</h2>
                <p className="fl-lab-poster">{C.pinecone}</p>
              </>
            )}
            <Scale
              question={`You were ${BEFORE_SCALE[(dreads[dreads.length - 1]?.before ?? 1) - 1].toLowerCase()} before it opened. How scary was it, really?`}
              labels={AFTER_SCALE}
              value={dreads[dreads.length - 1]?.after ?? null}
              onChoose={rateAfter}
            />
            {dreadLine(dreads) && <p className="fl-lab-note fl-fb-tally" aria-live="polite">{dreadLine(dreads)}</p>}
            <div className="fl-fb-actions">
              <button ref={closeRef} type="button" className="fl-lab-button" onClick={allOpen ? refill : close}>
                {allOpen ? 'New boxes' : 'Close the box'}
              </button>
            </div>
          </>
        )}

        <p className="fl-lab-status" role="status">{status}</p>
        <PulseTap after={after} />
      </div>
    </div>
  );
}

/** A five-point rating, in words: how nervous before, or how scary after. */
function Scale({ question, labels, value, onChoose, refEl }: { question: string; labels: readonly string[]; value: number | null; onChoose: (v: number) => void; refEl?: Ref<HTMLDivElement> }) {
  return (
    <fieldset className="fl-fb-scale">
      <legend className="fl-lab-note">{question}</legend>
      <div className="fl-fb-scale-row" ref={refEl}>
        {labels.map((l, k) => (
          <button key={l} type="button" className="fl-fb-scale-step" aria-pressed={value === k + 1} onClick={() => onChoose(k + 1)} data-level={k + 1}>
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Take your own pulse: tap along with it, before opening a box and after. */
function PulseTap({ after }: { after: boolean }) {
  const taps = useRef<number[]>([]);
  const [before, setBefore] = useState<number | null>(null);
  const [later, setLater] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [beat, setBeat] = useState(0);

  const mode = useRef(after);

  const tap = () => {
    const now = performance.now();
    // A new run of taps for "after" once a box has opened.
    if (mode.current !== after) {
      mode.current = after;
      taps.current = [];
    }
    taps.current = [...taps.current.filter((t) => now - t < 15000), now];
    const run = taps.current;
    let n = 1;
    for (let i = run.length - 1; i > 0 && run[i] - run[i - 1] < 2500; i--) n++;
    setCount(n);
    setBeat((b) => b + 1);
    const bpm = pulseFromTaps(run);
    if (bpm !== null) (after ? setLater : setBefore)(bpm);
  };

  return (
    <details className="fl-pulse">
      <summary>Take your own pulse</summary>
      <p className="fl-lab-note">
        {/* REVIEW: new text (the first sentence). */}
        The heart monitor along the foot of the lab is a drawing, not your heartbeat. To measure yours, find your pulse on your wrist or neck, then tap the heart with each beat. {after ? 'Now take it again.' : 'Take it before you open a box.'}
      </p>
      <div className="fl-pulse-row">
        <button type="button" className="fl-pulse-heart" onClick={tap} key={beat} aria-label="Tap with each beat">
          <svg viewBox="0 0 32 30" aria-hidden="true">
            <path d="M16 28 C 6 20 1 14 1 8.5 C 1 4.4 4.3 1 8.4 1 C 11.6 1 14.3 3 16 5.8 C 17.7 3 20.4 1 23.6 1 C 27.7 1 31 4.4 31 8.5 C 31 14 26 20 16 28 Z" />
          </svg>
        </button>
        <dl className="fl-pulse-readings">
          <div>
            <dt>Before</dt>
            <dd>{before ?? '—'}</dd>
          </div>
          <div>
            <dt>After</dt>
            <dd>{later ?? '—'}</dd>
          </div>
        </dl>
      </div>
      <p className="fl-lab-note" aria-live="polite">
        {count > 0 && count < 5 ? `Keep tapping… ${5 - count} more.` : (after ? later : before) !== null ? 'Beats a minute, from your taps.' : ''}
      </p>
    </details>
  );
}
