'use client';

import dynamic from 'next/dynamic';
import { ContentLoading } from '@/components/ui/Loading';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Dynamically import ArtifactViewer with no SSR (Three.js requires browser environment)
const ArtifactViewer = dynamic(
  () => import('@/app/exhibitions/seeing-is-deceiving/artifacts/artifact-viewer'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <ContentLoading />
          <p
            style={{
              marginTop: '1rem',
              color: '#737373',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            Loading 3D Viewer...
          </p>
        </div>
      </div>
    ),
  }
);

type LazyArtifactViewerProps = {
  artifactId: 'victorian-cards' | 'stereoscope' | 'stereoscope-cards';
};

/**
 * Lazy-loaded wrapper for ArtifactViewer that:
 * 1. Dynamically imports Three.js only when needed
 * 2. Provides a loading state
 * 3. Wraps in an error boundary for resilience
 */
export default function LazyArtifactViewer({ artifactId }: LazyArtifactViewerProps) {
  return (
    <ErrorBoundary
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.5rem',
              color: '#fafafa',
              marginBottom: '1rem',
            }}
          >
            Unable to load 3D viewer
          </h2>
          <p style={{ color: '#737373', marginBottom: '1.5rem' }}>
            Please try refreshing the page or use a different browser.
          </p>
          <a
            href="/exhibitions/seeing-is-deceiving/artifacts"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #7D8471',
              color: '#7D8471',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            Return to Artifacts
          </a>
        </div>
      }
    >
      <ArtifactViewer artifactId={artifactId} />
    </ErrorBoundary>
  );
}
