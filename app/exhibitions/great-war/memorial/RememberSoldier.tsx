'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import MemorialCard from './MemorialCard';
import type { Fallen } from './fallen';
import { announcement, buildIndex, createPicker, search, summary, type Picker } from './remember';
import { printCss } from './printLayout';
import { cardToPng, downloadDataUrl } from './exportCard';

/*
 * "Remember a soldier": the visitor draws one of the fallen (no one comes
 * twice until all have come), or finds one by name or state, and can keep the
 * card: save it as an image, print it, or print it with three more on one
 * Letter page as the installation printed them.
 *
 * The records are loaded when this section mounts, and only the drawn card
 * and at most twelve search results are ever on the page.
 */

const RESULT_LIMIT = 12;

export default function RememberSoldier() {
  const [pool, setPool] = useState<Fallen[] | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [printing, setPrinting] = useState<Fallen[] | null>(null);
  const [saving, setSaving] = useState(false);
  const picker = useRef<Picker | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let alive = true;
    import('./fallen').then((m) => {
      if (!alive) return;
      picker.current = createPicker(m.FALLEN.length);
      setPool(m.FALLEN);
    });
    return () => {
      alive = false;
    };
  }, []);

  const index = useMemo(() => (pool ? buildIndex(pool) : null), [pool]);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => (index && deferredQuery.trim() ? search(index, deferredQuery, RESULT_LIMIT) : []),
    [index, deferredQuery],
  );
  const listOpen = open && query.trim().length > 0;
  const soldier = pool && current !== null ? pool[current] : null;

  const show = useCallback(
    (i: number) => {
      if (!pool) return;
      setCurrent(i);
      setMessage(announcement(pool[i]));
    },
    [pool],
  );

  const remember = () => {
    const i = picker.current?.next() ?? -1;
    if (i >= 0) show(i);
  };

  const choose = (i: number) => {
    show(i);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a <= 0 ? results.length - 1 : a - 1) : -1));
    } else if (e.key === 'Enter') {
      if (listOpen && active >= 0 && results[active] !== undefined) {
        e.preventDefault();
        choose(results[active]);
      } else if (listOpen && results.length === 1) {
        e.preventDefault();
        choose(results[0]);
      }
    } else if (e.key === 'Escape') {
      if (listOpen) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  };

  /* ───────── Keeping the card ───────── */

  const save = async () => {
    if (!soldier || !cardRef.current) return;
    setSaving(true);
    setMessage('Making the image…');
    try {
      const url = await cardToPng(cardRef.current);
      downloadDataUrl(url, `in-memory-${soldier.id}.png`);
      setMessage(`The card for ${soldier.name} is saved as an image.`);
    } catch {
      setMessage('The image could not be made. Printing the card still works.');
    } finally {
      setSaving(false);
    }
  };

  const printOne = () => soldier && setPrinting([soldier]);

  const printFour = () => {
    if (!soldier || !pool || !picker.current) return;
    const cards = [soldier];
    const want = Math.min(4, pool.length);
    // Three more from the same draw, so they too are new to this visit.
    for (let tries = 0; cards.length < want && tries < pool.length * 2 + 8; tries++) {
      const f = pool[picker.current.next()];
      if (!cards.includes(f)) cards.push(f);
    }
    setPrinting(cards);
  };

  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    const done = () => setPrinting(null);
    window.addEventListener('afterprint', done);
    (async () => {
      const root = document.querySelector('.gwm-print-root');
      const imgs = root ? Array.from(root.querySelectorAll('img')) : [];
      // The still candles must be drawn before the page goes to the printer.
      await Promise.all(imgs.map((img) => (typeof img.decode === 'function' ? img.decode().catch(() => undefined) : undefined)));
      await document.fonts?.ready;
      if (!cancelled) window.print();
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', done);
    };
  }, [printing]);

  const optionId = (i: number) => `gwm-find-opt-${i}`;

  return (
    <div className="gwm-remember">
      <button type="button" className="gw-button gw-button-primary gwm-remember-draw" onClick={remember} disabled={!pool}>
        Remember a soldier
      </button>

      <div className="gwm-remember-card">
        <MemorialCard ref={cardRef} fallen={soldier} live={!reduced} />
      </div>

      {soldier && (
        <div className="gwm-keep" role="group" aria-label="Keep this card">
          <button type="button" className="gw-button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save as image'}
          </button>
          <button type="button" className="gw-button" onClick={printOne}>
            Print this card
          </button>
          <button type="button" className="gw-button" onClick={printFour} disabled={!pool || pool.length < 2}>
            Print four
          </button>
          <p className="gwm-keep-note">“Print four” prints this card and three more soldiers on one Letter page, at the size of the installation’s cards.</p>
        </div>
      )}

      <div className="gwm-find">
        <label htmlFor="gwm-find-input" className="gwm-find-label">
          Or find a soldier by name or state
        </label>
        <input
          id="gwm-find-input"
          className="gwm-find-input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={listOpen && results.length > 0}
          aria-controls="gwm-find-list"
          aria-activedescendant={listOpen && active >= 0 && results[active] !== undefined ? optionId(results[active]) : undefined}
          aria-describedby="gwm-find-status"
          value={query}
          disabled={!pool}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        />
        <ul id="gwm-find-list" role="listbox" aria-label="Soldiers found" className="gwm-find-list" hidden={!listOpen || results.length === 0}>
          {listOpen &&
            results.map((i, n) => {
              const f = pool![i];
              return (
                <li
                  key={f.id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={n === active}
                  className={`gwm-find-option${n === active ? ' is-active' : ''}`}
                  // mousedown, not click, so the choice lands before the input blurs
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(i);
                  }}
                >
                  <span className="gwm-find-name">{f.name}</span>
                  <span className="gwm-find-meta">{summary(f)}</span>
                </li>
              );
            })}
        </ul>
        <p id="gwm-find-status" className="gwm-find-status" aria-live="polite">
          {query.trim() && index
            ? results.length === 0
              ? 'No soldier found by that name or state.'
              : results.length === RESULT_LIMIT
                ? `The first ${RESULT_LIMIT} found. Type more to narrow it.`
                : `${results.length} found.`
            : ''}
        </p>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {message}
      </p>

      {printing &&
        createPortal(
          <div className="gwm-print-root" aria-hidden="true">
            <style>{printCss()}</style>
            <div className="gwm-print-sheet">
              {printing.map((f) => (
                <MemorialCard key={f.id} fallen={f} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
