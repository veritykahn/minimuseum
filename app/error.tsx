'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '2px solid #525252',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <span style={{ fontSize: '1.5rem', color: '#525252' }}>!</span>
      </div>

      <h1
        style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          fontWeight: 300,
          color: '#fafafa',
          marginBottom: '1rem',
        }}
      >
        Something went wrong
      </h1>

      <p
        style={{
          color: '#737373',
          maxWidth: '400px',
          marginBottom: '2rem',
          lineHeight: 1.6,
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        }}
      >
        We encountered an unexpected error. Please try again, or return to the Great Hall.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            border: '1px solid #a8d5e5',
            backgroundColor: 'transparent',
            color: '#a8d5e5',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(168, 213, 229, 0.1)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Try Again
        </button>

        <a
          href="/greathall"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            border: '1px solid #525252',
            color: '#737373',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#737373';
            e.currentTarget.style.color = '#a3a3a3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#525252';
            e.currentTarget.style.color = '#737373';
          }}
        >
          Great Hall
        </a>
      </div>

      {process.env.NODE_ENV === 'development' && error.message && (
        <details
          style={{
            marginTop: '3rem',
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              color: '#737373',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#0a0a0a',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.75rem',
              color: '#a8d5e5',
              textAlign: 'left',
            }}
          >
            {error.message}
            {error.digest && `\n\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </div>
  );
}
