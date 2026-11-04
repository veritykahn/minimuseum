'use client';

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { FactSource } from './FactNote';
import './sources-drawer.css';

/*
 * One small round "i" per page, in the bottom-left corner (the museum map
 * keeps the bottom right). It opens a drawer, "Sources and credits", listing
 * every source and picture credit the page uses, grouped by step or panel,
 * so nothing is cited inline on the visitor's screen. Licence credits
 * (CC BY, CC BY-SA…) go here too, in full: one tap away, which is what
 * attribution needs. "*Title*" in a label or note is set in italics.
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

/**
 * "*Title*" set in italics (as helpers.ts emphasisRuns splits it; kept here
 * so every interactive's drawer need not load the poster engine).
 */
function Emphasis({ text }: { text: string }) {
  if (!text.includes('*')) return <>{text}</>;
  const runs = text.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <>
      {runs.map((part, i) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export const SOURCES_LABEL = 'Sources and credits';

export default function SourcesDrawer({
  groups,
  children,
  label = SOURCES_LABEL,
  hideButton = false,
  inline = false,
  buttonClassName,
}: {
  groups: readonly SourceGroup[];
  children?: React.ReactNode;
  /** The button's name and the drawer's heading. */
  label?: string;
  /** Leave the button out (projector mode, which has its own frame). */
  hideButton?: boolean;
  /** Set the button where the drawer is placed, not fixed in the corner (a lesson's tool bar). */
  inline?: boolean;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const shown = groups.filter((g) => g.items.length > 0);
  const visible = shown.length > 0 && !hideButton;

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
      {visible && (
        <>
          <button
            ref={button}
            type="button"
            className={['mm-sources-btn', inline && 'mm-sources-btn-inline', buttonClassName].filter(Boolean).join(' ')}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={label}
            title={label}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="mm-sources-i" aria-hidden="true">i</span>
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
                    <ul aria-label={g.title}>
                      {g.items.map((s, i) => (
                        <li key={`${s.label}-${i}`}>
                          {s.note && (
                            <span className="mm-sources-note">
                              <Emphasis text={s.note} />:{' '}
                            </span>
                          )}
                          {s.href ? (
                            <a href={s.href} target="_blank" rel="noopener noreferrer">
                              <Emphasis text={s.label} />
                            </a>
                          ) : (
                            <Emphasis text={s.label} />
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
