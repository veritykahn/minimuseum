'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Artifact = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  status: 'available' | 'coming-soon';
  type: '3d' | 'interactive';
  route: string;
};

const artifacts: Artifact[] = [
  {
    id: 'stereoscope',
    title: 'Monarch Stereoscope',
    subtitle: 'Victorian Virtual Reality',
    image: '/exhibitions/seeing/artifacts/stereoscope-thumb.jpg',
    status: 'available',
    type: '3d',
    route: '/exhibitions/seeing-is-deceiving/artifacts/stereoscope'
  },
  {
    id: 'stereoscope-cards',
    title: 'Keystone View Cards',
    subtitle: 'The World in Your Parlor',
    image: '/exhibitions/seeing/artifacts/stereoscope-cards-thumb.jpg',
    status: 'available',
    type: '3d',
    route: '/exhibitions/seeing-is-deceiving/artifacts/stereoscope-cards'
  },
  {
    id: 'victorian-cards',
    title: 'Victorian Illusion Cards',
    subtitle: 'Parlor Magic Transformed',
    image: '/exhibitions/seeing/artifacts/victorian-cards-thumb.jpg',
    status: 'available',
    type: '3d',
    route: '/exhibitions/seeing-is-deceiving/artifacts/victorian-cards'
  },
  {
    id: 'perception-lab',
    title: 'Perception Lab',
    subtitle: 'Test Your Visual System',
    image: '/exhibitions/seeing/artifacts/perception-lab-thumb.jpg',
    status: 'available',
    type: 'interactive',
    route: '/exhibitions/seeing-is-deceiving/illusions'
  }
];

export default function ArtifactsCollection() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleArtifactClick = (artifact: Artifact) => {
    if (artifact.status === 'available') {
      router.push(artifact.route);
    }
  };

  return (
    <div className="artifacts-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .artifacts-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          padding: 120px 40px 80px;
        }

        /* Navigation */
        .nav-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: linear-gradient(to bottom, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0) 100%);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #a8d5e5;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .back-btn:hover { color: #fff; }
        .back-btn span { font-size: 18px; }

        /* Page header */
        .page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .page-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 16px;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }

        .page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-style: italic;
          color: #a8d5e5;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Artifacts grid */
        .artifacts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .artifacts-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            max-width: 600px;
          }
        }

        @media (max-width: 600px) {
          .artifacts-page { padding: 100px 24px 60px; }
          .artifacts-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            max-width: 320px;
          }
        }

        /* Artifact card */
        .artifact-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px 16px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .artifact-card.available {
          cursor: pointer;
        }

        .artifact-card.available:hover {
          border-color: rgba(168, 213, 229, 0.3);
          background: linear-gradient(145deg, rgba(168, 213, 229, 0.06), rgba(168, 213, 229, 0.02));
          transform: translateY(-8px);
        }

        .artifact-card.available:hover .artifact-image-container {
          box-shadow: 0 20px 60px rgba(168, 213, 229, 0.15);
        }

        .artifact-card.available:hover .artifact-image {
          transform: scale(1.05);
        }

        .artifact-card.coming-soon {
          opacity: 0.6;
        }

        /* Image container with circle mask */
        .artifact-image-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          box-shadow:
            0 10px 40px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.4s ease;
        }

        @media (max-width: 1024px) {
          .artifact-image-container {
            width: 140px;
            height: 140px;
          }
        }

        @media (max-width: 600px) {
          .artifact-image-container {
            width: 160px;
            height: 160px;
          }
        }

        .artifact-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }


        /* Artifact info */
        .artifact-info {
          text-align: center;
        }

        .artifact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #fafafa;
          margin-bottom: 4px;
        }

        .artifact-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: #737373;
          margin-bottom: 10px;
        }

        @media (max-width: 600px) {
          .artifact-title {
            font-size: 1.25rem;
          }
          .artifact-subtitle {
            font-size: 0.95rem;
          }
        }

        /* Status indicator */
        .artifact-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .status-available {
          background: rgba(168, 213, 229, 0.1);
          color: #a8d5e5;
          border: 1px solid rgba(168, 213, 229, 0.3);
        }

        .status-coming-soon {
          background: rgba(255, 255, 255, 0.03);
          color: #525252;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.active {
          background: #a8d5e5;
          box-shadow: 0 0 8px rgba(168, 213, 229, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        .status-dot.inactive {
          background: #525252;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Hover arrow */
        .hover-arrow {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(168, 213, 229, 0.1);
          border: 1px solid rgba(168, 213, 229, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #a8d5e5;
          font-size: 14px;
        }

        .artifact-card.available:hover .hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Return button */
        .return-btn {
          display: block;
          margin: 60px auto 0;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          color: #737373;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .return-btn:hover {
          border-color: #a8d5e5;
          color: #a8d5e5;
        }
      `}</style>

      {/* Navigation */}
      <header className="nav-header">
        <button className="back-btn" onClick={() => router.push('/exhibitions/seeing-is-deceiving')}>
          <span>←</span>
          Exhibition
        </button>
      </header>

      {/* Page header */}
      <div className="page-header">
        <p className="page-label">Seeing is Deceiving</p>
        <h1 className="page-title">The Collection</h1>
        <p className="page-subtitle">
          Authentic artifacts and interactive experiences exploring the science of visual perception
        </p>
      </div>

      {/* Artifacts grid */}
      <div className="artifacts-grid">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className={`artifact-card ${artifact.status}`}
            onClick={() => handleArtifactClick(artifact)}
            onMouseEnter={() => setHoveredId(artifact.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Hover arrow for available items */}
            {artifact.status === 'available' && (
              <div className="hover-arrow">↗</div>
            )}

            {/* Image container */}
            <div className="artifact-image-container">
              <img
                src={artifact.image}
                alt={artifact.title}
                className="artifact-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            {/* Info */}
            <div className="artifact-info">
              <h3 className="artifact-title">{artifact.title}</h3>
              <p className="artifact-subtitle">{artifact.subtitle}</p>

              {/* Status */}
              <div className={`artifact-status ${artifact.status === 'available' ? 'status-available' : 'status-coming-soon'}`}>
                <span className={`status-dot ${artifact.status === 'available' ? 'active' : 'inactive'}`}></span>
                {artifact.status === 'available' ? 'Explore' : 'Coming Soon'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Return button */}
      <button className="return-btn" onClick={() => router.push('/exhibitions/seeing-is-deceiving')}>
        Return to Exhibition
      </button>
    </div>
  );
}
