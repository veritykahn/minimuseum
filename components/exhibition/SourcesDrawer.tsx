'use client';

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { FactSource } from './FactNote';
import './sources-drawer.css';

/*
 * One small "Sources" button per interactive, in the bottom-left corner
 * (the museum map keeps the bottom right). It opens a drawer listing every
 * source and picture credit the interactive uses, grouped by step or panel,
 * so nothing is cited inline on the student's screen. Licence credits
 * (CC BY, CC BY-SA…) go here too, in full, which is what attribution needs.
 *
 * Inside a <SourcesDrawer>, FactNote and FactSources print nothing inline
 * (InlineSourcesContext); the drawer's own groups are the record.
 */

export type SourceItem = FactSource & {
  /** What this source backs, e.g. "The crocodile under Menna's boat". */
  note?: string;
  /** A picture credit's licence line, e.g. "CC BY-SA 4.0, via Wikimedia Commons". */
  licence?: string;
  /** The licence's deed, when it has one (CC BY 4.0's page, say). */
  licenceHref?: string;
};

/** Sources without a link (a printed book, the owner's own photograph). */
export type SourceEntry = SourceItem | (Omit<SourceItem, 'href'> & { href?: undefined });

export type SourceGroup = {
  /** The step, panel or bench these belong to. */
  title: string;
  items: readonly SourceEntry[];
};

export const InlineSourcesContext = createContext(true);

/** False inside a SourcesDrawer: cite in the drawer, not on the page. */
export const useInlineSources = () => useContext(InlineSourcesContext);

export default function SourcesDrawer({
  groups,
  children,
  label = 'Sources',
}: {
  groups: readonly SourceGroup[];
  children?: React.ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const shown = groups.filter((g) => g.items.length > 0);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  return (
    <InlineSourcesContext.Provider value={false}>
      {children}
      {shown.length > 0 && (
        <>
          <button
            ref={button}
            type="button"
            className="mm-sources-btn"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen((o) => !o)}
          >
            {label}
          </button>
          {open && (
            <div
              className="mm-sources-scrim"
              onClick={() => {
                setOpen(false);
                button.current?.focus();
              }}
            >
              <div
                ref={panel}
                className="mm-sources-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mm-sources-head">
                  <h2 id={titleId}>{label}</h2>
                  <button
                    type="button"
                    className="mm-sources-close"
                    onClick={() => {
                      setOpen(false);
                      button.current?.focus();
                    }}
                    aria-label="Close sources"
                  >
                    ×
                  </button>
                </div>
                {shown.map((g) => (
                  <section key={g.title} className="mm-sources-group">
                    <h3>{g.title}</h3>
                    <ul>
                      {g.items.map((s, i) => (
                        <li key={`${s.label}-${i}`}>
                          {s.note && <span className="mm-sources-note">{s.note}: </span>}
                          {s.href ? (
                            <a href={s.href} target="_blank" rel="noopener noreferrer">
                              {s.label}
                            </a>
                          ) : (
                            s.label
                          )}
                          {s.licence && (
                            <span className="mm-sources-licence">
                              {' — '}
                              {s.licenceHref ? (
                                <a href={s.licenceHref} target="_blank" rel="noopener noreferrer">
                                  {s.licence}
                                </a>
                              ) : (
                                s.licence
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </InlineSourcesContext.Provider>
  );
}
