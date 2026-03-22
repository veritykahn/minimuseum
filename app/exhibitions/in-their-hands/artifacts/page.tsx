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
  thumb?: string;
};

const artifacts: Artifact[] = [
  {
    id: 'tyrian-shekel',
    title: 'Tyrian Shekel',
    subtitle: 'The Thirty Pieces of Silver, c. 126 BC – 56 AD',
    status: 'available',
    type: '3d',
    route: '/exhibitions/in-their-hands/artifacts/tyrian-shekel',
    emoji: '\u{1FA99}',
    thumb: '/exhibitions/in-their-hands/coins/tyrian-shekel.jpg',
  },
  {
    id: 'widow-mite',
    title: 'Widow\'s Mite (Prutah)',
    subtitle: 'Alexander Jannaeus, c. 103–76 BC',
    status: 'available',
    type: '3d',
    route: '/exhibitions/in-their-hands/artifacts/widow-mite',
    emoji: '\u{1FA99}',
    thumb: '/exhibitions/in-their-hands/coins/widow-mite.jpg',
  },
  {
    id: 'pilate',
    title: 'Pontius Pilate Prutah',
    subtitle: 'Prefect of Judaea, 26–36 AD',
    status: 'available',
    type: '3d',
    route: '/exhibitions/in-their-hands/artifacts/pilate',
    emoji: '\u{1FA99}',
    thumb: '/exhibitions/in-their-hands/coins/pilate.jpg',
  },
  {
    id: 'tiberius',
    title: 'Tribute Penny of Tiberius',
    subtitle: 'Tiberius Caesar, 14–37 AD',
    status: 'available',
    type: '3d',
    route: '/exhibitions/in-their-hands/artifacts/tiberius',
    emoji: '\u{1FA99}',
    thumb: '/exhibitions/in-their-hands/coins/tiberius.jpg',
  },
  {
    id: 'herod-great',
    title: 'Herod the Great Prutah',
    subtitle: 'King of Judaea, 37–4 BC',
    status: 'available',
    type: '3d',
    route: '/exhibitions/in-their-hands/artifacts/herod-great',
    emoji: '\u{1FA99}',
    thumb: '/exhibitions/in-their-hands/coins/herod-great.jpg',
  },
  {
    id: 'timeline',
    title: 'The Gospel Timeline',
    subtitle: 'Follow the coins through the New Testament',
    status: 'coming-soon',
    type: 'interactive',
    route: '/exhibitions/in-their-hands/timeline',
    emoji: '\u{1F4DC}',
  },
  {
    id: 'hands',
    title: 'Hands of History',
    subtitle: 'Who held these coins — and when?',
    status: 'coming-soon',
    type: 'interactive',
    route: '/exhibitions/in-their-hands/hands',
    emoji: '\u{270B}',
  },
  {
    id: 'real-or-replica',
    title: 'Real or Replica?',
    subtitle: 'Learn to authenticate ancient coins',
    status: 'coming-soon',
    type: 'interactive',
    route: '/exhibitions/in-their-hands/real-or-replica',
    emoji: '\u{1F50D}',
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
    <div className="ith-artifacts-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ith-artifacts-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          padding: 120px 40px 80px;
        }

        .ith-art-nav-header {
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

        .ith-art-back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .ith-art-back-btn:hover { color: #fff; }
        .ith-art-back-btn span { font-size: 18px; }

        .ith-art-page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .ith-art-page-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 16px;
        }

        .ith-art-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }

        .ith-art-page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-style: italic;
          color: #C9A84C;
          max-width: 500px;
          margin: 0 auto;
        }

        .ith-art-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 24px;
          max-width: 960px;
          margin: 0 auto;
        }
        /* Row 1: 3 items (each spans 2 of 6 cols) — coins */
        .ith-art-card:nth-child(1) { grid-column: 1 / span 2; }
        .ith-art-card:nth-child(2) { grid-column: 3 / span 2; }
        .ith-art-card:nth-child(3) { grid-column: 5 / span 2; }
        /* Row 2: 2 items centered (each spans 3 of 6 cols) — coins */
        .ith-art-card:nth-child(4) { grid-column: 1 / span 3; }
        .ith-art-card:nth-child(5) { grid-column: 4 / span 3; }
        /* Row 3: 3 items (each spans 2 of 6 cols) — interactive */
        .ith-art-card:nth-child(6) { grid-column: 1 / span 2; }
        .ith-art-card:nth-child(7) { grid-column: 3 / span 2; }
        .ith-art-card:nth-child(8) { grid-column: 5 / span 2; }

        @media (max-width: 900px) {
          .ith-art-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            max-width: 500px;
          }
          .ith-art-card:nth-child(n) { grid-column: auto; }
        }

        @media (max-width: 600px) {
          .ith-artifacts-page { padding: 100px 24px 60px; }
          .ith-art-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            max-width: 320px;
          }
        }

        .ith-art-card {
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

        .ith-art-card.available {
          cursor: pointer;
        }

        .ith-art-card.available:hover {
          border-color: rgba(201, 168, 76, 0.3);
          background: linear-gradient(145deg, rgba(201, 168, 76, 0.06), rgba(201, 168, 76, 0.02));
          transform: translateY(-8px);
        }

        .ith-art-card.available:hover .ith-art-image-container {
          box-shadow: 0 20px 60px rgba(201, 168, 76, 0.15);
        }

        .ith-art-card.coming-soon {
          opacity: 0.6;
        }

        .ith-art-image-container {
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
        .ith-art-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .ith-art-card.available:hover .ith-art-thumb {
          transform: scale(1.08);
        }

        @media (max-width: 1024px) {
          .ith-art-image-container {
            width: 140px;
            height: 140px;
          }
        }

        @media (max-width: 600px) {
          .ith-art-image-container {
            width: 160px;
            height: 160px;
          }
        }

        .ith-art-info {
          text-align: center;
        }

        .ith-art-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #fafafa;
          margin-bottom: 4px;
        }

        .ith-art-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: #737373;
          margin-bottom: 10px;
        }

        @media (max-width: 600px) {
          .ith-art-title { font-size: 1.25rem; }
          .ith-art-subtitle { font-size: 0.95rem; }
        }

        .ith-art-status {
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

        .ith-art-status-available {
          background: rgba(201, 168, 76, 0.1);
          color: #C9A84C;
          border: 1px solid rgba(201, 168, 76, 0.3);
        }

        .ith-art-status-coming-soon {
          background: rgba(255, 255, 255, 0.03);
          color: #525252;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ith-art-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .ith-art-status-dot.active {
          background: #C9A84C;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.6);
          animation: ith-art-pulse 2s ease-in-out infinite;
        }

        .ith-art-status-dot.inactive {
          background: #525252;
        }

        @keyframes ith-art-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .ith-art-hover-arrow {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #C9A84C;
          font-size: 14px;
        }

        .ith-art-card.available:hover .ith-art-hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .ith-art-return-btn {
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

        .ith-art-return-btn:hover {
          border-color: #C9A84C;
          color: #C9A84C;
        }
      `}</style>

      <header className="ith-art-nav-header">
        <button className="ith-art-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
      </header>

      <div className="ith-art-page-header">
        <p className="ith-art-page-label">Gallery III, Case 1</p>
        <h1 className="ith-art-page-title">Coins of the Passion</h1>
        <p className="ith-art-page-subtitle">
          Collection &middot; Holy Family Catholic School
        </p>
      </div>

      <div className="ith-art-grid">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className={`ith-art-card ${artifact.status}`}
            onClick={() => handleArtifactClick(artifact)}
          >
            {artifact.status === 'available' && (
              <div className="ith-art-hover-arrow">{'\u2197'}</div>
            )}

            <div className="ith-art-image-container">
              {artifact.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ith-art-thumb" src={artifact.thumb} alt={artifact.title} />
              ) : artifact.emoji}
            </div>

            <div className="ith-art-info">
              <h3 className="ith-art-title">{artifact.title}</h3>
              <p className="ith-art-subtitle">{artifact.subtitle}</p>

              <div className={`ith-art-status ${artifact.status === 'available' ? 'ith-art-status-available' : 'ith-art-status-coming-soon'}`}>
                <span className={`ith-art-status-dot ${artifact.status === 'available' ? 'active' : 'inactive'}`}></span>
                {artifact.status === 'available' ? 'Explore' : 'Coming Soon'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="ith-art-return-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
        Return to Exhibition
      </button>
    </div>
  );
}
