'use client';

/**
 * A small first-open tip for the poster walkthroughs. It is hidden from
 * assistive technology because the same guidance is spoken once through the
 * page's live region (see usePosterWalkthrough), so it is never read twice.
 * Any navigation dismisses it, as does the close button.
 */
export default function PosterNavHint({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  if (!visible) return null;
  return (
    <div className="poster-nav-hint" aria-hidden="true">
      <span>Use ← →, swipe or tap to explore</span>
      <button type="button" className="poster-nav-hint-close" tabIndex={-1} onClick={onDismiss} title="Dismiss tip">
        ×
      </button>
    </div>
  );
}
