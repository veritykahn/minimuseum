'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CASE_VIEW_PARAM } from './helpers';
import './case-views.css';

/*
 * The two views of a display case page: its Artifacts and its Interactives
 * (the rooms that open from the case), switched by a pair of tabs at the top
 * of the page. The view is kept in the address as ?view=interactives, so a
 * room's "← Display Case" link (interactivesView, helpers.ts) comes back to the
 * Interactives, and a reload keeps the view. Artifacts is the default: a
 * plain case address opens on them.
 *
 * Used by CasePage and by the hand-built exhibitions' case pages, which
 * style the tabs with their own class.
 */

export type CaseView = 'artifacts' | 'interactives';

/** The view an address asks for. */
export function viewFromSearch(search: string): CaseView {
  return new URLSearchParams(search).get(CASE_VIEW_PARAM) === 'interactives' ? 'interactives' : 'artifacts';
}

/**
 * The case page's view, read from the address once the page is in the
 * browser (the server renders the Artifacts), and written back to it, in
 * place, as the visitor switches.
 */
export function useCaseView(): [CaseView, (v: CaseView) => void] {
  const [view, setView] = useState<CaseView>('artifacts');
  useEffect(() => {
    // The address is only known in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(viewFromSearch(window.location.search));
  }, []);
  const choose = useCallback((v: CaseView) => {
    setView(v);
    try {
      const url = new URL(window.location.href);
      if (v === 'interactives') url.searchParams.set(CASE_VIEW_PARAM, 'interactives');
      else url.searchParams.delete(CASE_VIEW_PARAM);
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch {
      /* the view still switches; only the address is left as it was */
    }
  }, []);
  return [view, choose];
}

const LABELS: Record<CaseView, string> = { artifacts: 'Artifacts', interactives: 'Interactives' };
const ORDER: CaseView[] = ['artifacts', 'interactives'];

/** The tab id and panel id for a view, under an id prefix, for aria-controls / aria-labelledby. */
export const caseViewIds = (prefix: string, v: CaseView) => ({ tab: `${prefix}-tab-${v}`, panel: `${prefix}-panel-${v}` });

/**
 * The pair of tabs. Arrow keys, Home and End move between them, as a tab
 * list's do; the chosen one is the only one in the tab order.
 */
export function CaseViewTabs({
  view,
  onChange,
  idPrefix,
  className = '',
  counts,
}: {
  view: CaseView;
  onChange: (v: CaseView) => void;
  idPrefix: string;
  className?: string;
  /** Shown small after each label: how many artifacts, how many rooms. */
  counts?: Partial<Record<CaseView, number>>;
}) {
  const refs = useRef<Record<CaseView, HTMLButtonElement | null>>({ artifacts: null, interactives: null });
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = ORDER.indexOf(view);
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? ORDER[(i + 1) % ORDER.length]
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? ORDER[(i + ORDER.length - 1) % ORDER.length]
          : e.key === 'Home'
            ? ORDER[0]
            : e.key === 'End'
              ? ORDER[ORDER.length - 1]
              : null;
    if (!to) return;
    e.preventDefault();
    onChange(to);
    refs.current[to]?.focus();
  };
  return (
    <div className={`pe-case-views ${className}`.trim()} role="tablist" aria-label="In this case" onKeyDown={onKeyDown}>
      {ORDER.map((v) => {
        const ids = caseViewIds(idPrefix, v);
        const on = v === view;
        return (
          <button
            key={v}
            ref={(el) => {
              refs.current[v] = el;
            }}
            type="button"
            role="tab"
            id={ids.tab}
            aria-selected={on}
            aria-controls={ids.panel}
            tabIndex={on ? 0 : -1}
            className="pe-case-view-tab"
            onClick={() => onChange(v)}
          >
            {LABELS[v]}
            {counts?.[v] !== undefined && <span className="pe-case-view-count"> {counts[v]}</span>}
          </button>
        );
      })}
    </div>
  );
}
