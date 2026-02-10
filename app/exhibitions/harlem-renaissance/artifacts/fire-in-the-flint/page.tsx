'use client';

import dynamic from 'next/dynamic';

const HrArtifactViewer = dynamic(
  () => import('../hr-artifact-viewer'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#0a0a0a',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '2px solid rgba(201,169,78,0.2)',
            borderTopColor: '#C9A94E', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto',
          }} />
          <p style={{
            marginTop: '1rem', color: '#8A8070', fontSize: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '0.2em',
            fontFamily: 'Josefin Sans, sans-serif',
          }}>
            Loading 3D Viewer...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    ),
  }
);

export default function FireInTheFlintPage() {
  return <HrArtifactViewer artifactId="fire-in-the-flint" />;
}
