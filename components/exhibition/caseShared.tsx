import type { CSSProperties } from 'react';
import { emphasisRuns } from './helpers';
import type { ExhibitionConfig } from './types';

/*
 * What a display case page and an artifact page share: the exhibition's faces
 * and colors on the root, and text with its *words* set in italics.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export function caseRootStyle({ fonts, palette }: ExhibitionConfig): CssVars {
  return {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };
}

export function Emphasized({ text }: { text: string }) {
  return (
    <>
      {emphasisRuns(text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
    </>
  );
}

/**
 * A small drawing of an object on a stand, waiting to be photographed and
 * scanned: where an artifact's picture would be on its card. Decorative.
 */
export function ArtifactGlyph() {
  return (
    <svg className="pe-artifact-glyph" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <ellipse className="pe-ag-orbit" cx="60" cy="58" rx="46" ry="14" />
      <polygon className="pe-ag-form" points="60,20 84,46 60,78 36,46" />
      <line className="pe-ag-edge" x1="36" y1="46" x2="84" y2="46" />
      <line className="pe-ag-edge" x1="60" y1="20" x2="60" y2="78" />
      <polygon className="pe-ag-stand" points="40,92 50,84 82,84 72,92" />
      <rect className="pe-ag-stand" x="40" y="92" width="32" height="8" />
      <polygon className="pe-ag-stand" points="72,92 82,84 82,92 72,100" />
    </svg>
  );
}
