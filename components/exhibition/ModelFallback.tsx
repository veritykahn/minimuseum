'use client';

import { Component, type CSSProperties, type ReactNode } from 'react';
import { MODEL_STILLS, type ModelId } from '@/lib/model-stills';

/**
 * The still photograph of a 3D object, shown in the viewer's place when the
 * model cannot be shown in 3D. `fill` sizes it to its positioned parent (the
 * viewer's model area); otherwise it is a full page with the object's title
 * and a way back to the collection, in its exhibition's own page colours
 * (Seeing is Deceiving's grey, the Harlem Renaissance's black).
 */
export function ModelStillImage({ id, className = '' }: { id: ModelId; className?: string }) {
  const s = MODEL_STILLS[id];
  return (
    <figure className={`model-still ${className}`} data-testid="model-still" style={{ '--still-muted': s.page.muted } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.still} alt={s.alt} />
      <figcaption>A photograph of the object. The 3D view could not start on this device.</figcaption>
      <style jsx>{`
        .model-still {
          position: absolute;
          inset: 0;
          z-index: 1;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
        }
        .model-still img {
          max-width: 100%;
          max-height: calc(100% - 40px);
          object-fit: contain;
        }
        .model-still figcaption {
          font-family: 'Josefin Sans', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--still-muted);
          text-align: center;
        }
      `}</style>
    </figure>
  );
}

export function ModelStillPage({ id }: { id: ModelId }) {
  const s = MODEL_STILLS[id];
  const page = {
    '--still-bg': s.page.background,
    '--still-text': s.page.text,
    '--still-muted': s.page.muted,
    '--still-accent': s.page.accent,
  } as CSSProperties;
  return (
    <main className="model-still-page" style={page}>
      <div className="model-still-stage">
        <ModelStillImage id={id} />
      </div>
      {s.date && <p className="msp-date">{s.date}</p>}
      <h1 className="msp-title">{s.title}</h1>
      <a className="msp-back" href={s.backHref}>
        {'←'} {s.backLabel}
      </a>
      <style jsx>{`
        .model-still-page {
          min-height: 100vh;
          background: var(--still-bg);
          color: var(--still-text);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 16px 48px;
          text-align: center;
        }
        .model-still-stage {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 65vh;
          min-height: 280px;
        }
        .msp-date {
          font-family: 'Josefin Sans', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--still-muted);
          margin: 16px 0 8px;
        }
        .msp-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.3rem, 4vw, 2rem);
          margin: 0 0 24px;
        }
        .msp-back {
          color: var(--still-accent);
          font-family: 'Josefin Sans', system-ui, sans-serif;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-decoration: none;
          border: 1px solid color-mix(in srgb, var(--still-accent) 40%, transparent);
          padding: 10px 20px;
        }
        .msp-back:hover,
        .msp-back:focus-visible {
          background: color-mix(in srgb, var(--still-accent) 10%, transparent);
        }
      `}</style>
    </main>
  );
}

type BoundaryProps = { id: ModelId; children: ReactNode };
type BoundaryState = { failed: boolean };

/**
 * Error boundary for a 3D viewer. Anything the viewer throws while rendering
 * or in an effect (WebGL refused, a bad model, a three.js bug) shows the
 * object's still photograph instead of the site's error page.
 */
export class ModelErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn('3D viewer failed; showing a still image instead.', error);
  }

  render() {
    if (this.state.failed) return <ModelStillPage id={this.props.id} />;
    return this.props.children;
  }
}
