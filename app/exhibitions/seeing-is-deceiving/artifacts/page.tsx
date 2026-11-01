'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CaseViewTabs, caseViewIds, useCaseView } from '@/components/exhibition/CaseViews';
import { SEEING_ROOMS } from '../rooms';

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
    title: 'Keystone View Card #13399',
    subtitle: 'Norway in Your Parlor',
    image: '/exhibitions/seeing/artifacts/stereoscope-card-thumb.jpg',
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
  // The rooms, from the list the landing page's Explore row shares (rooms.ts).
  ...SEEING_ROOMS.map((r): Artifact => ({
    id: r.href.split('/').pop() ?? r.href,
    title: r.title,
    subtitle: r.subtitle ?? '',
    image: r.image?.src ?? '',
    status: 'available',
    type: 'interactive',
    route: r.href,
  })),
];

export default function ArtifactsCollection() {
  const router = useRouter();
  const [view, setView] = useCaseView();
  const objects = artifacts.filter((a) => a.type === '3d');
  const rooms = artifacts.filter((a) => a.type === 'interactive');

  // A card for an object or a room, each opening its own page.
  const card = (artifact: Artifact) => {
    const content = (
      <>
        {/* Hover arrow for available items */}
        {artifact.status === 'available' && (
          <div className="hover-arrow" aria-hidden="true">↗</div>
        )}

        {/* Image container */}
        <div className="artifact-image-container" aria-hidden="true">
          <Image
            src={artifact.image}
            alt={artifact.title}
            className="artifact-image"
            width={300}
            height={200}
            style={{ width: '100%', height: 'auto' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Info */}
        <div className="artifact-info">
          <h2 className="artifact-title">{artifact.title}</h2>
          <p className="artifact-subtitle">{artifact.subtitle}</p>

          {/* Status */}
          <div className={`artifact-status ${artifact.status === 'available' ? 'status-available' : 'status-coming-soon'}`}>
            <span className={`status-dot ${artifact.status === 'available' ? 'active' : 'inactive'}`}></span>
            {artifact.status === 'available' ? 'Explore' : 'Coming Soon'}
          </div>
        </div>
      </>
    );
    return artifact.status === 'available' ? (
      <Link key={artifact.id} href={artifact.route} className={`artifact-card ${artifact.status}`}>
        {content}
      </Link>
    ) : (
      <div key={artifact.id} className={`artifact-card ${artifact.status}`}>
        {content}
      </div>
    );
  };

  return (
    <div className="artifacts-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .artifacts-page {
          min-height: 100vh;
          background: #e0dede;
          color: #0a0a0a;
          padding: clamp(80px, 11dvh, 110px) 40px 64px;
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
          background: linear-gradient(to bottom, rgba(224,222,222,0.98) 0%, rgba(224,222,222,0) 100%);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #1f5a6e;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .back-btn:hover { color: #0a0a0a; }
        .back-btn span { font-size: 18px; }

        /* Page header */
        .page-header {
          text-align: center;
          margin-bottom: clamp(20px, 3.4dvh, 32px);
        }

        /* Artifacts | Interactives (CaseViews), in the page's ink and blue. */
        .sid-case-views { display: flex; width: max-content; margin: 0 auto clamp(24px, 4dvh, 40px); --pe-case-ink: #0a0a0a; --pe-accent: #1f5a6e; --pe-case-tab-on-ink: #fff; --pe-ui: 'Outfit', sans-serif; }
        .sid-case-view[hidden] { display: none; }
        /* A room's card shows the room itself, a screenshot, landscape. */
        .artifacts-grid-rooms { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 820px; }
        .artifacts-grid-rooms .artifact-image-container { width: 100%; height: auto; aspect-ratio: 16 / 10; border-radius: 10px; }

        .page-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #3d3d3d;
          margin-bottom: 16px;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 300;
          color: #0a0a0a;
          margin-bottom: 12px;
        }

        .page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-style: italic;
          color: #1f5a6e;
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

        /* The objects three to a row; the rooms that open from the case two */
        .artifacts-grid-objects { grid-template-columns: repeat(3, 1fr); max-width: 900px; }
        .artifacts-grid-rooms { grid-template-columns: repeat(2, 1fr); max-width: 600px; }

        /* "Interactives": the rooms that open from the case */
        .section-title {
          text-align: center;
          margin: 72px 0 36px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #1f5a6e;
        }
        .section-title::after {
          content: '';
          display: block;
          width: 48px;
          height: 1px;
          margin: 16px auto 0;
          background: rgba(31, 90, 110, 0.5);
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
          background: linear-gradient(145deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25));
          border: 1px solid rgba(10,10,10,0.1);
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .artifact-card.available {
          cursor: pointer;
        }

        .artifact-card.available:hover, .artifact-card.available:focus-visible {
          border-color: rgba(31, 90, 110, 0.3);
          background: linear-gradient(145deg, rgba(31, 90, 110, 0.06), rgba(31, 90, 110, 0.02));
          transform: translateY(-8px);
        }

        .artifact-card.available:hover .artifact-image-container, .artifact-card.available:focus-visible .artifact-image-container {
          box-shadow: 0 20px 60px rgba(31, 90, 110, 0.15);
        }

        .artifact-card.available:hover .artifact-image, .artifact-card.available:focus-visible .artifact-image {
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
            0 10px 30px rgba(0,0,0,0.22),
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
          color: #0a0a0a;
          margin-bottom: 4px;
        }

        .artifact-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          color: #3d3d3d;
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
          background: rgba(31, 90, 110, 0.1);
          color: #1f5a6e;
          border: 1px solid rgba(31, 90, 110, 0.3);
        }

        .status-coming-soon {
          background: rgba(10, 10, 10, 0.04);
          color: #555;
          border: 1px solid rgba(10, 10, 10, 0.12);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.active {
          background: #1f5a6e;
          box-shadow: 0 0 8px rgba(31, 90, 110, 0.6);
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
          background: rgba(31, 90, 110, 0.1);
          border: 1px solid rgba(31, 90, 110, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #1f5a6e;
          font-size: 14px;
        }

        .artifact-card.available:hover .hover-arrow, .artifact-card.available:focus-visible .hover-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Return button */
        .return-btn {
          display: block;
          margin: 60px auto 0;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid rgba(10,10,10,0.3);
          border-radius: 100px;
          color: #3d3d3d;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .return-btn:hover {
          border-color: #1f5a6e;
          color: #1f5a6e;
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
        <p className="page-label">Gallery II, Case 4</p>
        <h1 className="page-title">Instruments of Illusion</h1>
        <p className="page-subtitle">
          Including Interactive Perception Lab
        </p>
      </div>

      <CaseViewTabs
        view={view}
        onChange={setView}
        idPrefix="sid-case"
        className="sid-case-views"
        counts={{ artifacts: objects.length, interactives: rooms.length }}
      />

      {/* The objects in the case */}
      <div className="sid-case-view" role="tabpanel" id={caseViewIds('sid-case', 'artifacts').panel} aria-labelledby={caseViewIds('sid-case', 'artifacts').tab} hidden={view !== 'artifacts'}>
        <div className="artifacts-grid artifacts-grid-objects">{objects.map(card)}</div>
      </div>

      {/* The rooms that open from the case */}
      <div className="sid-case-view" role="tabpanel" id={caseViewIds('sid-case', 'interactives').panel} aria-labelledby={caseViewIds('sid-case', 'interactives').tab} hidden={view !== 'interactives'}>
        <div className="artifacts-grid artifacts-grid-rooms">{rooms.map(card)}</div>
      </div>

      {/* Return button */}
      <button className="return-btn" onClick={() => router.push('/exhibitions/seeing-is-deceiving')}>
        Return to Exhibition
      </button>
    </div>
  );
}
