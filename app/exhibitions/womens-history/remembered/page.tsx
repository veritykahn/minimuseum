'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import FactNote from '@/components/exhibition/FactNote';
import { WOMENS_HISTORY } from '../womensHistory';
import { FACT_MERMAIDS, FACT_OTHERS, FACT_TOP_50, POSTER, QUESTIONS, TOP_50, WEIGHTS, WOMEN_IN_TOP_50, beamTilt, guessLine, type WeightId } from './remembered';
import './remembered.css';

/*
 * Who Gets Remembered?, on one screen, in three tabs, each with its own
 * address. "Who gets a statue?": fifty statues on their plinths, the fifty
 * people with the most public monuments in the US; the visitor guesses how
 * many are women, and the names are uncovered. "Tip the scale": poster 1's
 * own argument as a balance, the men "credited with 'shaping history'" on
 * one pan and, laid on the other one by one, what the poster says the story
 * leaves out (tapped, or carried there). "Talk about it": questions for the class, and a note that the
 * same is true of other groups. Facts from outside the poster are cited
 * (remembered.ts). Nothing moves under reduced motion.
 */

const TABS = [
  { id: 'statues', label: 'Who gets a statue?' },
  { id: 'scale', label: 'Tip the scale' },
  { id: 'talk', label: 'Talk about it' },
] as const;
type TabId = (typeof TABS)[number]['id'];

type CssVars = CSSProperties & Record<`--${string}`, string>;

function tabFromHash(hash: string): TabId | null {
  const h = hash.replace(/^#/, '');
  return TABS.find((t) => t.id === h)?.id ?? null;
}

/** A statue on its plinth: a plain standing figure, the same for everyone until the names are uncovered. */
function Statue() {
  return (
    <svg className="whr-statue" viewBox="0 0 40 64" aria-hidden="true" focusable="false">
      <circle cx="20" cy="9" r="5.5" />
      <path d="M12 18c2-2 5-3 8-3s6 1 8 3l2 15-4 1-1-9v21h-4V33h-2v13h-4V25l-1 9-4-1z" />
      <rect className="whr-plinth-top" x="7" y="47" width="26" height="4" rx="0.8" />
      <rect className="whr-plinth" x="9" y="51" width="22" height="13" />
    </svg>
  );
}

export default function WhoGetsRemembered() {
  const { fonts, slug } = WOMENS_HISTORY;
  const back = roomReturn(WOMENS_HISTORY);
  const [tab, setTab] = useState<TabId>('statues');
  const [guess, setGuess] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [placed, setPlaced] = useState<WeightId[]>([]);
  const placedRef = useRef<WeightId[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ statues: null, scale: null, talk: null });

  useEffect(() => {
    const fromHash = () => {
      const h = tabFromHash(window.location.hash);
      if (h) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((id: TabId, focus = false) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.findIndex((x) => x.id === tab);
    const to =
      e.key === 'ArrowRight' ? (i + 1) % TABS.length
      : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TABS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(TABS[to].id, true);
  };

  const uncover = () => {
    setRevealed(true);
    setAnnouncement(`${guessLine(guess)} ${WOMEN_IN_TOP_50.map((w) => w.name).join(', ')}.`);
  };
  const again = () => {
    setRevealed(false);
    setAnnouncement('The names are covered again. Make a new guess.');
  };

  const place = (id: WeightId) => {
    if (placedRef.current.includes(id)) return;
    const next = [...placedRef.current, id];
    placedRef.current = next;
    setPlaced(next);
    const w = WEIGHTS.find((x) => x.id === id)!;
    setAnnouncement(next.length === WEIGHTS.length ? `${w.label}. The scale is level.` : `${w.label}, laid on the scale. ${WEIGHTS.length - next.length} more.`);
  };
  // A phrase can also be carried to the scale: picked up, it follows the pointer, and is laid on if let go over the scale.
  const scaleRef = useRef<HTMLDivElement>(null);
  const carry = useRef<{ id: WeightId; x: number; y: number; moved: boolean } | null>(null);
  // A carry let go off the scale is not also a click: only a tap lays a phrase on where it stands.
  const carryEnded = useRef(false);
  const [carried, setCarried] = useState<{ id: WeightId; dx: number; dy: number; over: boolean } | null>(null);
  const overScale = (x: number, y: number) => {
    const r = scaleRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  const onWeightDown = (e: PointerEvent<HTMLButtonElement>, id: WeightId) => {
    if (e.button !== 0) return;
    carryEnded.current = false;
    carry.current = { id, x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onWeightMove = (e: PointerEvent<HTMLButtonElement>) => {
    const c = carry.current;
    if (!c) return;
    const dx = e.clientX - c.x;
    const dy = e.clientY - c.y;
    if (!c.moved && Math.hypot(dx, dy) < 6) return;
    c.moved = true;
    setCarried({ id: c.id, dx, dy, over: overScale(e.clientX, e.clientY) });
  };
  const onWeightUp = (e: PointerEvent<HTMLButtonElement>) => {
    const c = carry.current;
    carry.current = null;
    setCarried(null);
    if (!c?.moved) return;
    // Laid on, the button is disabled and no click follows; let go elsewhere, the click that follows is not a tap.
    if (overScale(e.clientX, e.clientY)) place(c.id);
    else carryEnded.current = true;
  };
  const onWeightClick = (id: WeightId) => {
    if (carryEnded.current) {
      carryEnded.current = false;
      return;
    }
    place(id);
  };

  const tilt = beamTilt(placed.length);
  const level = placed.length === WEIGHTS.length;

  const style: CssVars = {
    background: '#e8d6cc',
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
  };

  return (
    <div className="pe-root whr-room" data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="whr-stage" data-tab={tab}>
        <span className="whr-ground" aria-hidden="true" />
        <header className="whr-bar">
          <h1 className="whr-title">Who Gets Remembered?</h1>
          <div className="whr-tabs" role="tablist" aria-label="Who gets remembered">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`whr-tab-${x.id}`}
                aria-controls={`whr-panel-${x.id}`}
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="whr-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                {x.label}
              </button>
            ))}
          </div>
        </header>

        {/* Who gets a statue? */}
        <section className="whr-panel whr-statues" id="whr-panel-statues" role="tabpanel" aria-labelledby="whr-tab-statues" hidden={tab !== 'statues'}>
          <ol className={`whr-plinths${revealed ? ' is-revealed' : ''}`} aria-label={revealed ? 'The 50 people with the most public monuments in the US' : undefined} aria-hidden={revealed ? undefined : true}>
            {TOP_50.map((p, i) => {
              const lit = revealed ? !!p.woman : i < guess;
              return (
                <li key={p.rank} className={`whr-cell${lit ? ' is-lit' : ''}${p.woman ? ' is-woman' : ''}`} style={{ '--i': String(i) } as CssVars}>
                  <Statue />
                  <span className="whr-name">{revealed ? p.name : ''}</span>
                </li>
              );
            })}
          </ol>

          <div className={`whr-side${revealed ? ' is-revealed' : ''}`}>
            <p className="whr-ask">The 50 people with the most public monuments in the United States. How many do you think are women?</p>
            {!revealed ? (
              <>
                <label className="whr-guess">
                  <span className="whr-guess-n" aria-hidden="true">{guess}</span>
                  <input type="range" min={0} max={50} value={guess} onChange={(e) => setGuess(Number(e.target.value))} aria-label="Your guess: how many are women?" aria-valuetext={`${guess} of 50`} />
                </label>
                <button type="button" className="whr-button whr-button-primary" onClick={uncover}>
                  Uncover the names
                </button>
              </>
            ) : (
              <div className="whr-result">
                <p className="whr-result-line">
                  <span className="whr-result-n">{WOMEN_IN_TOP_50.length}</span> {guessLine(guess)}
                </p>
                <FactNote fact={FACT_TOP_50} className="whr-fact" />
                <FactNote fact={FACT_MERMAIDS} className="whr-fact" />
                <button type="button" className="whr-button" onClick={again}>
                  Guess again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tip the scale */}
        <section className="whr-panel whr-scale-panel" id="whr-panel-scale" role="tabpanel" aria-labelledby="whr-tab-scale" hidden={tab !== 'scale'}>
          <blockquote className="whr-quote">{POSTER.overshadowed}</blockquote>
          <div ref={scaleRef} className={`whr-scale${carried?.over ? ' is-over' : ''}`} role="img" aria-label={level ? 'A scale, now level' : `A scale, tipped down on the men’s side, with ${placed.length} of ${WEIGHTS.length} laid on the other`}>
            <svg viewBox="0 0 600 330" aria-hidden="true" focusable="false">
              <path className="whr-scale-post" d="M296 70h8v196h-8z M240 266h120l10 18H230z" />
              <g className="whr-beam" style={{ transform: `rotate(${tilt}deg)` }}>
                <rect x="90" y="64" width="420" height="10" rx="5" />
                <circle cx="300" cy="69" r="11" />
                {/* Each pan hangs from its end of the beam, and stays upright as the beam tips. */}
                <g className="whr-pan" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '100px 69px' }}>
                  <path className="whr-cord" d="M100 69 48 186M100 69l52 117" />
                  <path className="whr-dish" d="M44 186h112c-6 22-28 32-56 32s-50-10-56-32z" />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <g key={k} className="whr-pan-statue" transform={`translate(${66 + k * 14} ${159 - (k % 2) * 5}) scale(0.45)`}>
                      <circle cx="20" cy="9" r="5.5" />
                      <path d="M12 18c2-2 5-3 8-3s6 1 8 3l2 15-4 1-1-9v21h-4V33h-2v13h-4V25l-1 9-4-1z" />
                      <rect x="9" y="47" width="22" height="14" />
                    </g>
                  ))}
                </g>
                <g className="whr-pan" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '500px 69px' }}>
                  <path className="whr-cord" d="M500 69l-52 117M500 69l52 117" />
                  <path className="whr-dish whr-dish-out" d="M444 186h112c-6 22-28 32-56 32s-50-10-56-32z" />
                  {placed.map((id, k) => (
                    <rect key={id} className="whr-weight" x={462 + (k % 3) * 26} y={170 - Math.floor(k / 3) * 18} width="24" height="16" rx="2" />
                  ))}
                </g>
              </g>
              <text className="whr-scale-label" x="100" y="304" textAnchor="middle">
                <tspan x="100">the men credited with</tspan>
                <tspan x="100" dy="16">“shaping history”</tspan>
              </text>
              <text className="whr-scale-label" x="500" y="304" textAnchor="middle">
                <tspan x="500">what the story</tspan>
                <tspan x="500" dy="16">leaves out</tspan>
              </text>
            </svg>
          </div>
          {!level ? (
            <div className="whr-weights">
              <p className="whr-weights-ask">Poster 1 names what else tells the story. Tap each one, or carry it, to lay it on the scale.</p>
              <div className="whr-weights-list">
                {WEIGHTS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={`whr-weight-button${carried?.id === w.id ? ' is-dragging' : ''}`}
                    style={carried?.id === w.id ? { transform: `translate(${carried.dx}px, ${carried.dy}px)` } : undefined}
                    aria-pressed={placed.includes(w.id)}
                    disabled={placed.includes(w.id)}
                    onClick={() => onWeightClick(w.id)}
                    onPointerDown={(e) => onWeightDown(e, w.id)}
                    onPointerMove={onWeightMove}
                    onPointerUp={onWeightUp}
                    onPointerCancel={() => {
                      carry.current = null;
                      setCarried(null);
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="whr-level">
              <blockquote className="whr-quote whr-quote-end">
                <p>{POSTER.deeper}</p>
                <p>{POSTER.households}</p>
              </blockquote>
              <button type="button" className="whr-button" onClick={() => {
                  placedRef.current = [];
                  setPlaced([]);
                  setAnnouncement('The scale is tipped again.');
                }}>
                Start again
              </button>
            </div>
          )}
        </section>

        {/* Talk about it */}
        <section className="whr-panel whr-talk" id="whr-panel-talk" role="tabpanel" aria-labelledby="whr-tab-talk" hidden={tab !== 'talk'}>
          <ol className="whr-questions">
            {QUESTIONS.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
          <aside className="whr-others" aria-label="Not only women">
            <p className="whr-others-title">Not only women</p>
            <p className="whr-others-line">The same is true of other minorities and underrepresented groups: their stories, too, are often left out of the history that gets told.</p>
            <FactNote fact={FACT_OTHERS} className="whr-fact" />
            <Link className="whr-button" href="/exhibitions/womens-history/violet#make">
              Make a timeline of a woman in your life
            </Link>
          </aside>
        </section>

        <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
      </main>
    </div>
  );
}
