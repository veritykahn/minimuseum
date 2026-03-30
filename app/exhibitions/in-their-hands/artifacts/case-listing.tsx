'use client';

import { useRouter } from 'next/navigation';
import { CoinData } from './coin-data';

type InteractiveFeature = {
  id: string;
  title: string;
  subtitle: string;
  emoji?: string;
  thumb?: string;
  route: string;
  status: 'available' | 'coming-soon';
};

type Props = {
  caseNumber: number;
  galleryLabel: string;
  title: string;
  subtitle: string;
  coins: CoinData[];
  basePath: string;
  interactive?: InteractiveFeature;
};

export default function CaseListing({ caseNumber, galleryLabel, title, subtitle, coins, basePath, interactive }: Props) {
  const router = useRouter();

  return (
    <div className="case-listing-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .case-listing-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          padding: 120px 40px 80px;
        }

        .cl-nav-header {
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

        .cl-back-btn {
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
        .cl-back-btn:hover { color: #fff; }
        .cl-back-btn span { font-size: 18px; }

        .cl-page-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .cl-page-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 16px;
        }

        .cl-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }

        .cl-page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-style: italic;
          color: #C9A84C;
          max-width: 500px;
          margin: 0 auto;
        }

        .cl-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .cl-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px 16px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 180px;
        }

        .cl-card:hover {
          border-color: rgba(201, 168, 76, 0.3);
          background: linear-gradient(145deg, rgba(201, 168, 76, 0.06), rgba(201, 168, 76, 0.02));
          transform: translateY(-8px);
        }

        .cl-card:hover .cl-card-image {
          box-shadow: 0 20px 60px rgba(201, 168, 76, 0.15);
        }

        .cl-card-image-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cl-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .cl-card:hover .cl-card-image {
          transform: scale(1.08);
        }

        .cl-card-info { text-align: center; }

        .cl-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #fafafa;
          margin-bottom: 4px;
        }

        .cl-card-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: #737373;
          margin-bottom: 10px;
        }

        .cl-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(201, 168, 76, 0.1);
          color: #C9A84C;
          border: 1px solid rgba(201, 168, 76, 0.3);
        }
        .cl-card-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9A84C;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.6);
          animation: cl-pulse 2s ease-in-out infinite;
        }
        @keyframes cl-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .cl-card-authenticity {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 6px;
        }
        .cl-card-authenticity.authentic {
          background: rgba(76, 175, 80, 0.1);
          color: #66BB6A;
          border: 1px solid rgba(76, 175, 80, 0.25);
        }
        .cl-card-authenticity.replica {
          background: rgba(255, 193, 7, 0.08);
          color: #FFC107;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }

        .cl-hover-arrow {
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
        .cl-card:hover .cl-hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .cl-card-row-break {
          flex-basis: 100%;
          height: 0;
        }

        .cl-card.cl-card-interactive {
          width: 180px;
        }

        .cl-card.coming-soon {
          opacity: 0.6;
          cursor: default;
        }
        .cl-card.coming-soon:hover {
          border-color: rgba(255,255,255,0.06);
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          transform: none;
        }

        .cl-card-emoji {
          font-size: 48px;
        }

        .cl-card-badge-coming-soon {
          background: rgba(255,255,255,0.03);
          color: #525252;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .cl-card-badge-dot.inactive {
          background: #525252;
          box-shadow: none;
          animation: none;
        }

        .cl-return-btn {
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
        .cl-return-btn:hover {
          border-color: #C9A84C;
          color: #C9A84C;
        }

        @media (max-width: 600px) {
          .case-listing-page { padding: 100px 24px 60px; }
          .cl-grid { max-width: 320px; }
          .cl-card-image-container { width: 140px; height: 140px; }
        }
      `}</style>

      <header className="cl-nav-header">
        <button className="cl-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
      </header>

      <div className="cl-page-header">
        <p className="cl-page-label">{galleryLabel}</p>
        <h1 className="cl-page-title">{title}</h1>
        <p className="cl-page-subtitle">{subtitle}</p>
      </div>

      <div className="cl-grid">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="cl-card"
            onClick={() => router.push(`${basePath}/${coin.id}`)}
          >
            <div className="cl-hover-arrow">{'\u2197'}</div>
            <div className="cl-card-image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cl-card-image" src={coin.frontImage} alt={coin.title} />
            </div>
            <div className="cl-card-info">
              <h3 className="cl-card-title">{coin.title.split(' — ')[0]}</h3>
              <p className="cl-card-subtitle">{coin.date}</p>
              <div className="cl-card-badge">
                <span className="cl-card-badge-dot" />
                Explore
              </div>
              <div className={`cl-card-authenticity ${coin.authenticity.toLowerCase()}`}>
                {coin.authenticity}
              </div>
            </div>
          </div>
        ))}

        {interactive && <div className="cl-card-row-break" />}
        {interactive && (
          <div
            className={`cl-card cl-card-interactive ${interactive.status}`}
            onClick={() => interactive.status === 'available' && router.push(interactive.route)}
          >
            {interactive.status === 'available' && (
              <div className="cl-hover-arrow">{'\u2197'}</div>
            )}
            <div className="cl-card-image-container">
              {interactive.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cl-card-image" src={interactive.thumb} alt={interactive.title} />
              ) : (
                <span className="cl-card-emoji">{interactive.emoji}</span>
              )}
            </div>
            <div className="cl-card-info">
              <h3 className="cl-card-title">{interactive.title}</h3>
              <p className="cl-card-subtitle">{interactive.subtitle}</p>
              <div className={`cl-card-badge ${interactive.status === 'coming-soon' ? 'cl-card-badge-coming-soon' : ''}`}>
                <span className={`cl-card-badge-dot ${interactive.status === 'coming-soon' ? 'inactive' : ''}`} />
                {interactive.status === 'available' ? 'Explore' : 'Coming Soon'}
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="cl-return-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
        Return to Exhibition
      </button>
    </div>
  );
}
