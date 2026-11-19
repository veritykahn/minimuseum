'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { seededShuffle } from '@/components/games/scoring';
import { useClientSeed } from '@/components/games/useClientSeed';
import RoomShell, { RoomHeader, StepDots } from '../RoomShell';
import DarkIntro from '../DarkIntro';
import Modal from '../Modal';
import { DragGhost, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import PutInTomb from '../PutInTomb';
import { Feather, Heart } from './HallArt';
import Scales, { FIGURE_SPOTS, HALL_H, HALL_W, HEART_PAN, Wrong } from './Scales';
import {
  ANI_INTRO,
  CHAPTERS,
  DEEDS,
  FIGURES,
  HEART_WORDS,
  JUDGEMENT_NOTES,
  MY_CHOICES,
  PAPYRI,
  RULE,
  TEST_TEXT,
  TIP,
  WEIGHING_INTRO,
  WEIGHING_SOURCES,
  testFeedback,
  wouldTip,
  type FigureId,
} from './judgement';
import './weighing.css';

/*
 * The point: you learn the rule of the scales, then use it to predict Ani's
 * judgement before you see it.
 *
 * The Weighing of the Heart, in seven chapters, each with one plain
 * instruction and its own Back and Next. The painted papyrus fills the top
 * of the room; the desk beneath holds what the visitor works with.
 *
 *   Meet Ani      drag the roll to unroll Ani's papyrus, and learn who he was
 *   The hall      tap each figure in the painting to meet them
 *   The rule      lay a wrong on the heart's side: the scales tip; take it
 *                 off: heart and feather balance
 *   Test the rule six deeds, one card at a time, in an order of this
 *                 visit's own: predict whether each, in Ani's heart, would
 *                 tip the scales; then the scales show it, and Ani's own
 *                 words say what he swore of it (the old sort onto two
 *                 scrolls was too easy, and told nothing)
 *   The weighing  lay Ani's heart on the scales, then predict from what he
 *                 swore (the question no longer gives the answer away)
 *   The verdict   the scales balance; Thoth, Horus and the Field of Reeds
 *   Your scales   a quiet look at the visitor's own good choices, then a
 *                 heart amulet put in the visitor's tomb (PutInTomb)
 *
 * Every drag also works as "tap the thing, then tap where it goes", and by
 * keyboard. Nothing is scored, stored or frightening; a wrong guess is only
 * a guess.
 */

type Guess = 'level' | 'tip';
type Carry = { kind: 'wrong' } | { kind: 'heart' };

/** A box in the hall's units, as a percentage box for an overlay. */
function pct([x, y, w, h]: [number, number, number, number]): CSSProperties {
  return { left: `${(x / HALL_W) * 100}%`, top: `${(y / HALL_H) * 100}%`, width: `${(w / HALL_W) * 100}%`, height: `${(h / HALL_H) * 100}%` };
}
const PAN_BOX: [number, number, number, number] = [HEART_PAN.x - 58, HEART_PAN.y - 62, 116, 96];
const FIGURE_IDS = Object.keys(FIGURES) as FigureId[];

export default function WeighingOfTheHeart() {
  const seed = useClientSeed();
  const [intro, setIntro] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [reached, setReached] = useState(0);
  const [unrolled, setUnrolled] = useState(0.06);
  const [focus, setFocus] = useState<FigureId | null>(null);
  const [met, setMet] = useState<FigureId[]>([]);
  const [wrongs, setWrongs] = useState(0);
  const [tried, setTried] = useState({ on: false, off: false });
  const [holding, setHolding] = useState<Carry | null>(null);
  // Test the rule: the card in hand, and each card's prediction (true: tip).
  const [card, setCard] = useState(0);
  const [predicted, setPredicted] = useState<Record<string, boolean>>({});
  const [heartOn, setHeartOn] = useState(false);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [tilt, setTilt] = useState(0);
  const [mine, setMine] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [about, setAbout] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const rolling = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = CHAPTERS[chapter].id;
  const deck = useMemo(() => (seed === null ? DEEDS : seededShuffle(DEEDS, seed)), [seed]);
  const deed = deck[Math.min(card, deck.length - 1)];
  const shown = deed.id in predicted;
  const tested = DEEDS.every((d) => d.id in predicted);
  const rightCount = DEEDS.filter((d) => d.id in predicted && predicted[d.id] === wouldTip(d)).length;

  useEffect(() => () => {
    if (settle.current) clearTimeout(settle.current);
  }, []);

  const go = (i: number) => {
    const to = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    if (settle.current) clearTimeout(settle.current);
    const toId = CHAPTERS[to].id;
    const testTip = toId === 'test' && deed.id in predicted && wouldTip(deed);
    setTilt((toId === 'rule' && wrongs) || testTip ? TIP : 0);
    setFocus(null);
    setHolding(null);
    setChapter(to);
    setReached((r) => Math.max(r, to));
    setStatus(`Chapter ${to + 1} of ${CHAPTERS.length}: ${CHAPTERS[to].name}.`);
    heading.current?.focus();
  };

  // ── Meet Ani: unroll the papyrus ──
  const unrollTo = (p: number) => {
    const v = Math.max(0.06, Math.min(1, p));
    setUnrolled(v);
    if (v >= 0.97) {
      setUnrolled(1);
      if (unrolled < 1) {
        setStatus('The papyrus is open. There are Ani and his wife, Tutu.');
        playEgypt('find');
      }
    }
  };
  const rollFrom = (e: ReactPointerEvent) => {
    const r = pic.current?.getBoundingClientRect();
    if (!r || !r.width) return null;
    return (((e.clientX - r.left) / r.width) * HALL_W - 30) / (HALL_W - 30);
  };
  const rollKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      unrollTo(unrolled + 0.2);
    }
  };

  // ── The hall: meet each figure ──
  const meet = (f: FigureId) => {
    setFocus(f);
    setMet((m) => (m.includes(f) ? m : [...m, f]));
    setStatus(`${FIGURES[f].name}: ${FIGURES[f].fact.text}`);
  };

  // ── The rule: a wrong on the heart's side ──
  const addWrong = () => {
    if (wrongs) return;
    setWrongs(1);
    setTilt(TIP);
    setTried((t) => ({ ...t, on: true }));
    setHolding(null);
    playEgypt('creak');
    setStatus('A wrong on the heart’s side: the scales tip out of balance.');
  };
  const takeWrongOff = () => {
    setWrongs(0);
    setTilt(0);
    setTried((t) => ({ ...t, off: true }));
    playEgypt('settle');
    setStatus('The wrong is gone. The heart and the feather balance: the scales are level.');
  };

  // ── Test the rule: predict, then see ──
  const predictDeed = (tip: boolean) => {
    if (shown) return;
    setPredicted((p) => ({ ...p, [deed.id]: tip }));
    const f = testFeedback(deed, tip);
    setTilt(wouldTip(deed) ? TIP : 0);
    playEgypt(wouldTip(deed) ? 'creak' : 'settle');
    setStatus(`${f.text} Ani says: “${deed.quote}”`);
  };
  const nextCard = () => {
    setCard((c) => Math.min(deck.length - 1, c + 1));
    setTilt(0);
    setStatus('');
    heading.current?.focus();
  };

  // ── The weighing ──
  const layHeart = () => {
    setHeartOn(true);
    setHolding(null);
    playEgypt('settle');
    setStatus('Ani’s heart is on the scales, across from the feather of Maat. What will the scales do?');
  };
  const predict = (g: Guess) => {
    setGuess(g);
    if (settle.current) clearTimeout(settle.current);
    setTilt(4);
    playEgypt('creak');
    settle.current = setTimeout(() => {
      setTilt(0);
      playEgypt('settle');
      setStatus('The scales wobble, then settle perfectly level.');
    }, 1500);
    setStatus(g === 'level' ? 'You guessed it: the scales stay level.' : 'Good guess, but look: the scales stay level.');
  };

  /** Carrying a thing onto a place, by drag or by tap. */
  const place = (c: Carry, target: string) => {
    if (c.kind === 'wrong' && target === 'pan') addWrong();
    else if (c.kind === 'heart' && target === 'pan') layHeart();
  };
  const { drag, carrying, start } = useDragDrop<Carry>((c, at) => place(c, at.target));
  const hold = (c: Carry) => {
    setHolding((h) => (h && h.kind === c.kind ? null : c));
  };
  const tapTarget = (target: string) => {
    if (holding) place(holding, target);
  };

  const again = () => {
    setUnrolled(1);
    setWrongs(0);
    setTried({ on: false, off: false });
    setPredicted({});
    setCard(0);
    setHeartOn(false);
    setGuess(null);
    setMine([]);
    go(1);
  };

  const done = (i: number) => {
    const c = CHAPTERS[i].id;
    if (c === 'ani') return unrolled >= 1;
    if (c === 'hall') return met.length === FIGURE_IDS.length;
    if (c === 'rule') return tried.on && tried.off;
    if (c === 'test') return tested;
    if (c === 'weigh') return guess !== null;
    return i < reached;
  };
  const canGoOn = id === 'ani' || id === 'rule' || id === 'test' || id === 'weigh' ? done(chapter) : true;
  const balanced = id === 'verdict' || id === 'you';
  const heartShown = id === 'rule' || id === 'test' || (id === 'weigh' && heartOn) || balanced;
  const wrongsShown = id === 'rule' ? wrongs : id === 'test' && shown && wouldTip(deed) ? 1 : 0;
  const panTarget = (id === 'rule' && !wrongs) || (id === 'weigh' && !heartOn);
  const held = holding ?? carrying;
  const reading = id === 'rule' ? (wrongs ? 'Out of balance' : 'Level') : id === 'test' ? (shown ? (wrongsShown ? 'Out of balance' : 'Level') : '') : id === 'weigh' && guess ? (tilt ? '' : 'Level') : balanced ? 'Level' : '';
  const sceneLabel =
    id === 'ani' && unrolled < 1
      ? 'A rolled-up papyrus, waiting to be unrolled.'
      : 'Ani’s papyrus: Ani and his wife Tutu, heads bowed; jackal-headed Anubis at the great scales; ibis-headed Thoth with his palette; Ammit sitting by; and Maat seated at the end. ' +
        (heartShown ? `A heart is in one pan and the feather of Maat in the other. ${wrongsShown ? 'A wrong lies beside the heart, and the scales are tipped out of balance.' : 'The scales are level.'}` : 'The feather of Maat is in one pan; the other is empty.');

  return (
    <RoomShell className="eg-weighing" sources={WEIGHING_SOURCES} fit>
      {intro && <DarkIntro title="The Weighing of the Heart" lines={WEIGHING_INTRO} voice="weighing-of-the-heart-intro" onDone={() => setIntro(false)} />}
      <RoomHeader kicker="Interactive · The hall of judgement" title="The Weighing of the Heart" />

      <section className={`egw-room egr-fill is-${id}`} aria-labelledby="egw-title" data-carrying={held ? '' : undefined}>
        <div className="egw-strip">
          <StepDots steps={CHAPTERS.map((c) => ({ id: c.id, title: c.name }))} at={chapter} done={done} onGo={go} label="The story" />
          <button type="button" className="egr-button egr-button-quiet" aria-haspopup="dialog" onClick={() => setAbout(true)}>
            <span className="egr-q" aria-hidden="true">i</span>About the papyri
          </button>
        </div>

        {/* ───── The painted papyrus ───── */}
        <div className="egw-scene">
          <div className="egw-pic" ref={pic}>
            <Scales tilt={tilt} heart={heartShown} wrongs={wrongsShown} focus={id === 'hall' ? focus : null} glow={id === 'ani' ? ['ani'] : id === 'hall' ? FIGURE_IDS.filter((f) => !met.includes(f)) : []} balanced={balanced} unrolled={id === 'ani' ? unrolled : 1} label={sceneLabel} />
            {reading && (
              <p className={`egw-reading${wrongsShown ? ' is-off' : ''}`} aria-hidden="true">
                {reading}
              </p>
            )}

            {id === 'ani' && unrolled < 1 && (
              <button
                type="button"
                className="egw-unroll egk-carry"
                style={{ left: `${((30 + unrolled * (HALL_W - 30)) / HALL_W) * 100}%` }}
                aria-label="Unroll the papyrus"
                onPointerDown={(e) => {
                  rolling.current = false;
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
                  const p = rollFrom(e);
                  if (p === null) return;
                  rolling.current = true;
                  unrollTo(p);
                }}
                onClick={() => {
                  if (!rolling.current) unrollTo(1);
                  rolling.current = false;
                }}
                onKeyDown={rollKey}
              >
                <span aria-hidden="true">Drag me</span>
              </button>
            )}

            {id === 'hall' &&
              FIGURE_IDS.map((f) => (
                <button key={f} type="button" className={`egw-meet${met.includes(f) ? ' is-met' : ''}`} style={pct(FIGURE_SPOTS[f].box)} aria-pressed={focus === f} aria-label={`Meet ${FIGURES[f].name}`} onClick={() => meet(f)}>
                  <span aria-hidden="true">{met.includes(f) ? '✓' : '?'}</span>
                </button>
              ))}

            {panTarget && (
              <button type="button" className={`egw-pan-drop${held ? ' is-ready' : ''}`} style={pct(PAN_BOX)} data-drop="pan" aria-label={id === 'rule' ? 'The heart’s pan of the scales: put the wrong here' : 'The empty pan of the scales: lay the heart here'} onClick={() => tapTarget('pan')} />
            )}

          </div>
        </div>

        {/* ───── The desk ───── */}
        <div className="egw-desk">
          <div className="egw-desk-head">
            <h2 id="egw-title" ref={heading} tabIndex={-1}>
              {id === 'ani' ? 'Meet Ani' : id === 'hall' ? 'Into the Hall of Judgement' : id === 'rule' ? 'The rule of the scales' : id === 'test' ? 'Test the rule' : id === 'weigh' ? 'The weighing' : id === 'verdict' ? 'The scales balance' : 'Weigh your own choices'}
            </h2>
            <p className="egr-task">{CHAPTERS[chapter].task}</p>
          </div>

          <div className="egw-desk-body">
            {id === 'ani' && (
              <>
                <div className="egr-actions">
                  {unrolled < 1 && (
                    <button type="button" className="egr-button" onClick={() => unrollTo(1)}>
                      Or tap: unroll it
                    </button>
                  )}
                </div>
                {unrolled >= 1 && <FactNote fact={ANI_INTRO} className="egr-fact egw-big-fact" />}
              </>
            )}

            {id === 'hall' && (
              <>
                {focus ? (
                  <div className="egw-meeting" key={focus}>
                    <h3>{FIGURES[focus].name}</h3>
                    <FactNote fact={FIGURES[focus].fact} className="egr-fact" />
                  </div>
                ) : (
                  <p>Five are waiting. Each one has a part to play in Ani’s judgement.</p>
                )}
                <p className="egw-small">
                  You have met {met.length} of {FIGURE_IDS.length}.
                </p>
              </>
            )}

            {id === 'rule' && (
              <>
                <FactNote fact={RULE} className="egr-fact egw-big-fact" />
                <div className="egw-tray">
                  {!wrongs ? (
                    <button type="button" className="egw-token egk-carry" aria-pressed={holding?.kind === 'wrong'} aria-label="A wrong" onPointerDown={(e) => start({ kind: 'wrong' }, e)} onClick={() => hold({ kind: 'wrong' })}>
                      <svg viewBox="-20 -24 40 30" aria-hidden="true">
                        <Wrong />
                      </svg>
                      <span>A wrong</span>
                    </button>
                  ) : (
                    <button type="button" className="egr-button" onClick={takeWrongOff}>
                      Take the wrong off
                    </button>
                  )}
                  <p className="egw-small">{holding?.kind === 'wrong' ? 'Now tap the heart’s pan.' : wrongs ? 'See how the scales tip? Now take it off.' : 'Drag the wrong onto the heart’s pan, or tap it and then the pan.'}</p>
                </div>
                {tried.on && tried.off && <p className="egw-result is-right">That’s the rule: a true heart balances the feather, and the scales stay level.</p>}
              </>
            )}

            {id === 'test' && (
              <>
                <div className="egw-test" key={deed.id}>
                  <p className="egw-small">
                    Card {card + 1} of {deck.length}
                  </p>
                  <p className="egw-deed">{deed.label}</p>
                  {!shown ? (
                    <fieldset className="egr-choice egw-guess">
                      <legend>{TEST_TEXT.ask}</legend>
                      <div className="egr-options">
                        <button type="button" className="egr-option" onClick={() => predictDeed(false)}>
                          {TEST_TEXT.level}
                        </button>
                        <button type="button" className="egr-option" onClick={() => predictDeed(true)}>
                          {TEST_TEXT.tip}
                        </button>
                      </div>
                    </fieldset>
                  ) : (
                    <>
                      <p className={`egw-result${testFeedback(deed, predicted[deed.id]).right ? ' is-right' : ' is-look'}`}>{testFeedback(deed, predicted[deed.id]).text}</p>
                      <blockquote className="egw-quote">Ani says: “{deed.quote}”</blockquote>
                    </>
                  )}
                </div>
                {shown && !tested && (
                  <div className="egr-actions">
                    <button type="button" className="egr-button" onClick={nextCard}>
                      {TEST_TEXT.nextCard} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
                {tested && (
                  <>
                    <p className="egw-result is-right">{TEST_TEXT.score(rightCount, DEEDS.length)}</p>
                    <FactNote fact={JUDGEMENT_NOTES.confession} className="egr-fact" />
                    <FactNote fact={JUDGEMENT_NOTES.ani} className="egr-fact" />
                  </>
                )}
              </>
            )}

            {id === 'weigh' && (
              <>
                {!heartOn && (
                  <div className="egw-tray">
                    <button type="button" className="egw-token egk-carry" aria-pressed={holding?.kind === 'heart'} aria-label="Ani’s heart" onPointerDown={(e) => start({ kind: 'heart' }, e)} onClick={() => hold({ kind: 'heart' })}>
                      <svg viewBox="-20 -28 40 44" aria-hidden="true">
                        <Heart />
                      </svg>
                      <span>Ani’s heart</span>
                    </button>
                    <p className="egw-small">{holding?.kind === 'heart' ? 'Now tap the empty pan.' : 'Drag the heart onto the empty pan, or tap it and then the pan.'}</p>
                  </div>
                )}
                {heartOn && (
                  <fieldset className="egr-choice egw-guess">
                    {/* REVIEW: new text */}
                    <legend>Ani swore he never did any of those wrongs. If that is true, what will the scales do?</legend>
                    <div className="egr-options">
                      <button type="button" className="egr-option" aria-pressed={guess === 'level'} onClick={() => predict('level')}>
                        Stay level
                      </button>
                      <button type="button" className="egr-option" aria-pressed={guess === 'tip'} onClick={() => predict('tip')}>
                        Tip out of balance
                      </button>
                    </div>
                  </fieldset>
                )}
                {guess && (
                  <>
                    <p className="egw-result is-right">{guess === 'level' ? 'You guessed it!' : 'Good guess, but look: they stay level.'}</p>
                    <FactNote fact={JUDGEMENT_NOTES.level} className="egr-fact" />
                    <FactNote fact={JUDGEMENT_NOTES.heartWords} className="egr-fact" />
                    <blockquote className="egw-quote">“{HEART_WORDS}”</blockquote>
                  </>
                )}
              </>
            )}

            {id === 'verdict' && (
              <>
                <FactNote fact={JUDGEMENT_NOTES.verdict} className="egr-fact egw-big-fact" />
                <FactNote fact={JUDGEMENT_NOTES.reeds} className="egr-fact" />
                <FactNote fact={JUDGEMENT_NOTES.heart} className="egr-fact" />
              </>
            )}

            {id === 'you' && (
              <>
                {/* REVIEW: new text (a reflection). */}
                <p>Ani’s story asks a big question: did he live a good life? You can ask yourself the same thing, kindly.</p>
                <div className="egr-options egw-mine">
                  {MY_CHOICES.map((c) => (
                    <button key={c} type="button" className="egr-option" aria-pressed={mine.includes(c)} onClick={() => setMine((m) => (m.includes(c) ? m.filter((x) => x !== c) : [...m, c]))}>
                      {c}
                    </button>
                  ))}
                </div>
                {mine.length > 0 && <p className="egw-result is-right">Every one of those counts.</p>}
                <p>And if there is something you would do differently next time, that’s all right. Everyone makes mistakes, and every day is a new chance to choose again.</p>
                <p className="egw-small">Nothing you tap here is saved or sent.</p>
                <div className="egr-actions">
                  <button type="button" className="egr-button" onClick={again}>
                    Hear the story again
                  </button>
                </div>
                {/* REVIEW: new text */}
                <PutInTomb activity="weighing" what="a heart amulet, for your judgement" />
              </>
            )}
          </div>

          <div className="egr-step-nav egw-nav">
            <button type="button" className="egr-button" onClick={() => go(chapter - 1)} disabled={chapter === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(chapter + 1)} disabled={chapter === CHAPTERS.length - 1 || !canGoOn}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <DragGhost at={drag} className="egw-ghost">
        <svg viewBox="-24 -30 48 48" width="64" height="64">
          {carrying?.kind === 'heart' ? <Heart /> : <Wrong />}
        </svg>
      </DragGhost>

      <Modal open={about} onClose={() => setAbout(false)} kicker="About this story" title="Two papyri, one story">
        <p>Two famous papyri in the British Museum show the weighing of the heart. They were made for two different men.</p>
        <article className="egw-papyrus">
          <p className="egr-label">EA 10470</p>
          <h3>The Papyrus of Ani</h3>
          <FactNote fact={PAPYRI.ani} className="egr-fact" />
        </article>
        <article className="egw-papyrus">
          <p className="egr-label">EA 9901</p>
          <h3>The Book of the Dead of Hunefer</h3>
          <FactNote fact={PAPYRI.hunefer} className="egr-fact" />
          <FactNote fact={JUDGEMENT_NOTES.scales} className="egr-fact" />
        </article>
        <p className="egw-small">
          <svg viewBox="-8 -64 26 68" width="18" height="40" aria-hidden="true">
            <Feather />
          </svg>{' '}
          The pictures in this room are drawn for the Mini Museum, after the scenes in Ani’s papyrus.
        </p>
      </Modal>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
