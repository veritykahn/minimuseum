'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import FactNote from '@/components/exhibition/FactNote';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import ParlourScene from './ParlourScene';
import { PARLOUR_TEXT, PARTS, type PartId } from './parlourText';
import './parlour.css';

/*
 * Dickens' Christmas parlour, on one screen: a parlour on Christmas Eve
 * (the owner's paintings, ParlourScene), cold at first, and beside it the green linen card. Open the parts of a
 * Victorian Christmas the poster names (the clock, the tree, the cards, the
 * book, the window, the fire), in the room or from the card's list, in any
 * order: each comes to life, the room grows warmer, and the card sets the
 * poster's line for it. With all six open, the poster's last word.
 */

export default function VictorianChristmasParlour() {
  const t = PARLOUR_TEXT;
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<Set<PartId>>(() => new Set());
  const [current, setCurrent] = useState<PartId | null>(null);
  const [status, setStatus] = useState('');

  const part = PARTS.find((p) => p.id === current);
  const all = open.size === PARTS.length;

  // With the sixth part open, the card scrolls down to the poster's last word, wherever the card was left.
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = card.current;
    if (all && el && el.scrollHeight > el.clientHeight) el.scrollTo?.({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [all, reduced]);

  const openPart = (id: PartId) => {
    const p = PARTS.find((x) => x.id === id)!;
    const next = new Set(open).add(id);
    setOpen(next);
    setCurrent(id);
    setStatus(`${p.opened}${next.size === PARTS.length && open.size < PARTS.length ? ' Every part of the parlour is open.' : ` ${next.size} of ${PARTS.length} open.`}`);
  };

  const startAgain = () => {
    setOpen(new Set());
    setCurrent(null);
    setStatus('The parlour is dark again.');
  };

  return (
    <RoomShell className="vb-parlour">
      <div className="vbr-stage vcp-stage" data-warm={all || undefined}>
        <div className="vbr-room" aria-hidden="true">
          <div className="vbr-paper" />
          <div className="vbr-light" />
        </div>

        <header className="vbr-bar">
          <h1 className="vbr-title">{t.title}</h1>
        </header>

        <div className="vbr-scene vcp-scene-wrap">
          <ParlourScene open={open} current={current} onPart={openPart} reduced={reduced} />
        </div>

        <section ref={card} className="vbr-card vcp-card" aria-label="The parts of a Victorian Christmas">
          {!part ? (
            <>
              <figure className="vbr-quote">
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <Italics text={t.cite} />
                </figcaption>
              </figure>
              <p className="vbr-intro">{t.intro}</p>
            </>
          ) : (
            <div className="vcp-part" key={part.id}>
              <h2>
                <Italics text={part.name === 'A Christmas Carol' ? '*A Christmas Carol*' : part.name} />
              </h2>
              <p className="vbr-poster">
                <Italics text={part.poster} />
              </p>
              {part.note && <FactNote fact={part.note} className="vbr-fact" />}
              {part.id === 'cards' && (
                <p className="vbr-note">
                  <Link href="/exhibitions/victorian/christmas-card">Make your own Victorian Christmas card</Link>
                </p>
              )}
            </div>
          )}

          <ol className="vcp-parts" aria-label="Open each part">
            {PARTS.map((p) => (
              <li key={p.id}>
                <button type="button" className="vcp-part-button" aria-pressed={open.has(p.id)} aria-current={current === p.id ? 'true' : undefined} onClick={() => openPart(p.id)}>
                  <span className="vcp-part-mark" aria-hidden="true">{open.has(p.id) ? '✦' : '○'}</span>
                  <Italics text={p.name === 'A Christmas Carol' ? '*A Christmas Carol*' : p.name} />
                </button>
              </li>
            ))}
          </ol>

          {all && (
            <div className="vcp-closing">
              {t.closing.map((c) => (
                <p key={c}>{c}</p>
              ))}
              <button type="button" className="vbr-button vbr-button-quiet" onClick={startAgain}>
                Start again
              </button>
            </div>
          )}

          <p className="vbr-credit">{t.credit}</p>
        </section>

        <p className="vbr-status" role="status" aria-live="polite">{status}</p>
      </div>
    </RoomShell>
  );
}

/** "*…*" set in italics, as the posters set the book's title. */
function Italics({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((s, i) => (i % 2 ? <em key={i}>{s}</em> : <Fragment key={i}>{s}</Fragment>))}
    </>
  );
}
