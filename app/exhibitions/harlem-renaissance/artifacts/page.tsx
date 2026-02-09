'use client';

import { useRouter } from 'next/navigation';

type Artifact = {
  id: string;
  title: string;
  subtitle: string;
  status: 'available' | 'coming-soon';
  type: '3d' | 'interactive';
  route: string;
  emoji: string;
};

const artifacts: Artifact[] = [
  {
    id: 'phonograph',
    title: 'Harlem Jazz Recordings',
    subtitle: 'Sounds of the Savoy & Cotton Club',
    status: 'coming-soon',
    type: '3d',
    route: '',
    emoji: '\u{1F4FB}',
  },
  {
    id: 'walter-white-book',
    title: 'A Man Called White',
    subtitle: 'Walter White\u2019s Autobiography, 1948',
    status: 'coming-soon',
    type: '3d',
    route: '',
    emoji: '\u{1F4D6}',
  },
  {
    id: 'blackbirds-sheet-music',
    title: 'Blackbirds of 1928',
    subtitle: 'Original Sheet Music',
    status: 'coming-soon',
    type: '3d',
    route: '',
    emoji: '\u{1F3B5}',
  },
  {
    id: 'jazz-lab',
    title: 'The Jazz Lab',
    subtitle: 'Build a Band & Test Your Ear',
    status: 'available',
    type: 'interactive',
    route: '/exhibitions/harlem-renaissance/jazz-lab',
    emoji: '\u{1F3B7}',
  },
  {
    id: 'migration-map',
    title: 'The Great Migration Map',
    subtitle: 'Trace the Journey North',
    status: 'available',
    type: 'interactive',
    route: '/exhibitions/harlem-renaissance/migration-map',
    emoji: '\u{1F5FA}\u{FE0F}',
  },
  {
    id: 'harlem-in-words',
    title: 'Harlem in Words',
    subtitle: 'Poetry of the Renaissance',
    status: 'coming-soon',
    type: 'interactive',
    route: '',
    emoji: '\u{270D}\u{FE0F}',
  },
];

export default function ArtifactsCollection() {
  const router = useRouter();

  const handleArtifactClick = (artifact: Artifact) => {
    if (artifact.status === 'available') {
      router.push(artifact.route);
    }
  };

  return (
    <div className="hr-artifacts-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hr-artifacts-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          padding: 120px 40px 80px;
        }

        .hr-art-nav-header {
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

        .hr-art-back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #b485d2;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hr-art-back-btn:hover { color: #fff; }
        .hr-art-back-btn span { font-size: 18px; }

        .hr-art-page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .hr-art-page-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 16px;
        }

        .hr-art-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }

        .hr-art-page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-style: italic;
          color: #b485d2;
          max-width: 500px;
          margin: 0 auto;
        }

        .hr-art-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 960px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .hr-art-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            max-width: 500px;
          }
        }

        @media (max-width: 600px) {
          .hr-artifacts-page { padding: 100px 24px 60px; }
          .hr-art-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            max-width: 320px;
          }
        }

        .hr-art-card {
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

        .hr-art-card.available {
          cursor: pointer;
        }

        .hr-art-card.available:hover {
          border-color: rgba(180, 133, 210, 0.3);
          background: linear-gradient(145deg, rgba(180, 133, 210, 0.06), rgba(180, 133, 210, 0.02));
          transform: translateY(-8px);
        }

        .hr-art-card.available:hover .hr-art-image-container {
          box-shadow: 0 20px 60px rgba(180, 133, 210, 0.15);
        }

        .hr-art-card.coming-soon {
          opacity: 0.6;
        }

        .hr-art-image-container {
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
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }

        @media (max-width: 1024px) {
          .hr-art-image-container {
            width: 140px;
            height: 140px;
          }
        }

        @media (max-width: 600px) {
          .hr-art-image-container {
            width: 160px;
            height: 160px;
          }
        }

        .hr-art-info {
          text-align: center;
        }

        .hr-art-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #fafafa;
          margin-bottom: 4px;
        }

        .hr-art-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: #737373;
          margin-bottom: 10px;
        }

        @media (max-width: 600px) {
          .hr-art-title { font-size: 1.25rem; }
          .hr-art-subtitle { font-size: 0.95rem; }
        }

        .hr-art-status {
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

        .hr-art-status-available {
          background: rgba(180, 133, 210, 0.1);
          color: #b485d2;
          border: 1px solid rgba(180, 133, 210, 0.3);
        }

        .hr-art-status-coming-soon {
          background: rgba(255, 255, 255, 0.03);
          color: #525252;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hr-art-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .hr-art-status-dot.active {
          background: #b485d2;
          box-shadow: 0 0 8px rgba(180, 133, 210, 0.6);
          animation: hr-art-pulse 2s ease-in-out infinite;
        }

        .hr-art-status-dot.inactive {
          background: #525252;
        }

        @keyframes hr-art-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hr-art-hover-arrow {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(180, 133, 210, 0.1);
          border: 1px solid rgba(180, 133, 210, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #b485d2;
          font-size: 14px;
        }

        .hr-art-card.available:hover .hr-art-hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .hr-art-return-btn {
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

        .hr-art-return-btn:hover {
          border-color: #b485d2;
          color: #b485d2;
        }
      `}</style>

      <header className="hr-art-nav-header">
        <button className="hr-art-back-btn" onClick={() => router.push('/exhibitions/harlem-renaissance')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
      </header>

      <div className="hr-art-page-header">
        <p className="hr-art-page-label">Gallery II, Case 5</p>
        <h1 className="hr-art-page-title">Voices of Harlem</h1>
        <p className="hr-art-page-subtitle">
          Artifacts & Experiences from the Renaissance
        </p>
      </div>

      <div className="hr-art-grid">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className={`hr-art-card ${artifact.status}`}
            onClick={() => handleArtifactClick(artifact)}
          >
            {artifact.status === 'available' && (
              <div className="hr-art-hover-arrow">{'\u2197'}</div>
            )}

            <div className="hr-art-image-container">
              {artifact.emoji}
            </div>

            <div className="hr-art-info">
              <h3 className="hr-art-title">{artifact.title}</h3>
              <p className="hr-art-subtitle">{artifact.subtitle}</p>

              <div className={`hr-art-status ${artifact.status === 'available' ? 'hr-art-status-available' : 'hr-art-status-coming-soon'}`}>
                <span className={`hr-art-status-dot ${artifact.status === 'available' ? 'active' : 'inactive'}`}></span>
                {artifact.status === 'available' ? 'Explore' : 'Coming Soon'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="hr-art-return-btn" onClick={() => router.push('/exhibitions/harlem-renaissance')}>
        Return to Exhibition
      </button>
    </div>
  );
}
