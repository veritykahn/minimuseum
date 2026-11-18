'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

/*
 * A pop-up card for the Egypt rooms: what was found, what a room is about,
 * how it works. It opens over the room (the room dims behind it), takes the
 * focus to itself, keeps Tab inside it, and closes with its Close button,
 * Escape, or a tap on the dimmed room; the focus then goes back to where it
 * was. It is drawn inside the room, so the room's colours, faces and Sources
 * drawer (which keeps citations out of the card) still apply.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  kicker,
  tone,
  closeLabel = 'Close',
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** A small line above the title ("Found!", "About"). */
  kicker?: string;
  /** "gold": a find or a reward. */
  tone?: 'gold';
  closeLabel?: string;
  children: ReactNode;
}) {
  const id = useId();
  const card = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    card.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !card.current) return;
      const items = [...card.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === card.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      // Back to where the visitor was, if it is still on the page.
      if (before && document.contains(before)) before.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="egr-modal-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={card} className={`egr-modal ${tone === 'gold' ? 'is-gold' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabIndex={-1}>
        <div className="egr-modal-head">
          <div>
            {kicker && <p className="egr-modal-kicker">{kicker}</p>}
            <h2 id={`${id}-title`} className="egr-modal-title">
              {title}
            </h2>
          </div>
          <button type="button" className="egr-button egr-modal-x" onClick={onClose}>
            {closeLabel} <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="egr-modal-body">{children}</div>
      </div>
    </div>
  );
}
