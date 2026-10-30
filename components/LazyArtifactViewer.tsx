'use client';

import dynamic from 'next/dynamic';
import { ContentLoading } from '@/components/ui/Loading';
import { ModelErrorBoundary } from '@/components/exhibition/ModelFallback';

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
 * 3. Shows the object's still photograph if the viewer throws (no WebGL,
 *    a failed chunk or model load), instead of an error page
 */
export default function LazyArtifactViewer({ artifactId }: LazyArtifactViewerProps) {
  return (
    <ModelErrorBoundary id={artifactId}>
      <ArtifactViewer artifactId={artifactId} />
    </ModelErrorBoundary>
  );
}
