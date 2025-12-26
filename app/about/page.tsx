'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [activeTab, setActiveTab] = useState<'physical' | 'virtual'>('physical');

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Home Button */}
      <Link href="/" className="home-button">
        <span className="home-arrow">←</span>
        <span>M</span>
      </Link>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * {
          box-sizing: border-box;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        a:link, a:visited, a:hover, a:active {
          color: inherit;
        }

        html {
          overflow-x: hidden;
          width: 100%;
        }

        body {
          background: #0a0a0a;
          color: #fafafa;
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        .home-button {
          position: fixed;
          top: 32px;
          right: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          text-decoration: none;
          font-size: 32px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          transition: all 0.3s ease;
          opacity: 0.7;
        }

        .home-button:hover {
          opacity: 1;
          transform: translateX(-4px);
        }

        .home-arrow {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .home-button:hover .home-arrow {
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .home-button {
            top: 20px;
            right: 20px;
            font-size: 24px;
          }

          .home-arrow {
            font-size: 16px;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        ::-webkit-scrollbar-thumb {
          background: #7D8471;
          border-radius: 4px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }
        .delay-5 { animation-delay: 1s; }
        .delay-6 { animation-delay: 1.2s; }
        .delay-7 { animation-delay: 1.4s; }
        .delay-8 { animation-delay: 1.6s; }

        .container {
          max-width: 850px;
          margin: 0 auto;
          padding: 120px 100px;
          opacity: 0;
          animation: fadeIn 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }

        @media (max-width: 1024px) {
          .container {
            padding: 100px 60px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 80px 32px;
            display: flex;
            flex-direction: column;
          }

          /* Mobile reordering */
          .mobile-order-1 { order: 1; }
          .mobile-order-2 { order: 2; }
          .mobile-order-3 { order: 3; }
          .mobile-order-4 { order: 4; }
          .mobile-order-5 { order: 5; }
          .mobile-order-6 { order: 6; }
          .mobile-order-7 { order: 7; }
          .mobile-order-8 { order: 8; }
          .mobile-order-9 { order: 9; }
          .mobile-order-10 { order: 10; }
          .mobile-order-11 { order: 11; }
          .mobile-order-12 { order: 12; }
          .mobile-order-13 { order: 13; }
          .mobile-order-14 { order: 14; }

          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: block;
          }
        }

        /* Desktop: hide mobile-only elements */
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 60px 24px;
          }
        }

        /* Tabs */
        .tabs {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .tabs {
            margin-top: 24px;
          }
        }

        .tab {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          color: #525252;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s ease;
          letter-spacing: 0.02em;
        }

        .tab:hover {
          color: #a3a3a3;
        }

        .tab.active {
          color: #fafafa;
        }

        .tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #7D8471;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .tab.active::after {
          transform: scaleX(1);
        }

        @media (max-width: 768px) {
          .tab {
            font-size: 15px;
          }
        }

        /* Content transition */
        .tab-content {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .inline-image {
          width: 100%;
          height: auto;
          margin: 60px 0;
        }

        @media (max-width: 768px) {
          .inline-image {
            margin: 40px 0;
          }
        }

        .image-text-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          margin: 60px 0;
          width: 100%;
        }

        @media (max-width: 768px) {
          .image-text-row {
            grid-template-columns: 1fr;
            gap: 32px;
            margin: 40px 0;
          }
        }

        .image-caption {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7D8471;
          text-align: center;
          margin-top: 16px;
          font-weight: 300;
        }

        .section {
          margin-bottom: 100px;
        }

        @media (max-width: 768px) {
          .section {
            margin-bottom: 60px;
          }
        }

        .section-title {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #7D8471;
          margin-bottom: 20px;
          font-weight: 400;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(125, 132, 113, 0.3), transparent);
          margin: 80px 0;
        }

        @media (max-width: 768px) {
          .divider {
            margin: 50px 0;
          }
        }

        .quote-box {
          background: linear-gradient(135deg, rgba(125, 132, 113, 0.08), rgba(125, 132, 113, 0.03));
          border-left: 3px solid #7D8471;
          padding: 48px;
          margin: 80px 0;
        }

        @media (max-width: 768px) {
          .quote-box {
            padding: 32px 24px;
            margin: 50px 0;
          }
        }
      `}</style>

      <div className="container">
        {/* Hero */}
        <div className="section fade-in-up" style={{ marginBottom: '0' }}>
          <h1 className="font-serif" style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            color: '#fafafa',
            marginBottom: '0',
          }}>About</h1>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'physical' ? 'active' : ''}`}
              onClick={() => setActiveTab('physical')}
            >
              The Physical Museum
            </button>
            <button
              className={`tab ${activeTab === 'virtual' ? 'active' : ''}`}
              onClick={() => setActiveTab('virtual')}
            >
              The Virtual Museum
            </button>
          </div>
        </div>

        {/* Physical Content */}
        {activeTab === 'physical' && (
          <div className="tab-content">
            <div className="divider" style={{ marginTop: '0' }}></div>

            {/* Desktop: Opening Statement with image */}
            <div className="image-text-row desktop-only">
              <div>
                <p style={{
                  fontSize: '17px',
                  lineHeight: 1.8,
                  color: '#d4d4d4',
                  fontWeight: 300,
                  marginBottom: '28px',
                }}>
                  The Mini Museum is both a principle and a place.
                </p>
                <p style={{
                  fontSize: '17px',
                  lineHeight: 1.8,
                  color: '#d4d4d4',
                  fontWeight: 300,
                  marginBottom: '28px',
                }}>
                  The principle: discovery comes before knowledge. Wonder precedes learning. Curiosity is sparked not by explanation, but by encounter — with the real, the rare, the survived.
                </p>
                <p style={{
                  fontSize: '17px',
                  lineHeight: 1.8,
                  color: '#d4d4d4',
                  fontWeight: 300,
                }}>
                  The place: anywhere. A corner of a library, the back of a classroom, the lobby of a school office. History should not be confined to great halls and marble pillars.
                </p>
              </div>

              <div>
                <img
                  src="/about/wwi.jpeg"
                  alt="Mini Museum exhibition display with WWI artifacts"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <p className="image-caption">The Great War Exhibition</p>
              </div>
            </div>

            {/* Mobile: Opening text */}
            <div className="mobile-only mobile-order-1" style={{ margin: '40px 0' }}>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 300,
                marginBottom: '28px',
              }}>
                The Mini Museum is both a principle and a place.
              </p>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 300,
                marginBottom: '28px',
              }}>
                The principle: discovery comes before knowledge. Wonder precedes learning. Curiosity is sparked not by explanation, but by encounter — with the real, the rare, the survived.
              </p>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 300,
              }}>
                The place: anywhere. A corner of a library, the back of a classroom, the lobby of a school office. History should not be confined to great halls and marble pillars.
              </p>
            </div>

            {/* Mobile: WWI Image */}
            <div className="mobile-only mobile-order-2" style={{ margin: '40px 0' }}>
              <img
                src="/about/wwi.jpeg"
                alt="Mini Museum exhibition display with WWI artifacts"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <p className="image-caption">The Great War Exhibition</p>
            </div>

            <div className="divider mobile-order-3"></div>

            {/* Desktop: The Exhibition with Moondust Image */}
            <div className="image-text-row desktop-only">
              <div>
                <img
                  src="/about/moondust.jpeg"
                  alt="Lunar meteorite sample under microscope"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <p className="image-caption">Lunar Meteorite Adrar 013</p>
              </div>

              <div>
                <p className="section-title">The Exhibition</p>
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#a3a3a3',
                  fontWeight: 300,
                  marginBottom: '20px',
                }}>
                  Each month, a new historical collection. Real artifacts. Primary sources. A WWI soldier's helmet. Moon dust from a lunar meteorite. A Victorian needle case. A first edition book from the Harlem Renaissance.
                </p>
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#a3a3a3',
                  fontWeight: 300,
                  marginBottom: '20px',
                }}>
                  The objects are authentic. The scholarship is rigorous. The presentation mirrors the care of the world's great museums — only on a smaller scale.
                </p>
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#d4d4d4',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}>
                  Mini exhibitions, big history.
                </p>
              </div>
            </div>

            {/* Mobile: Exhibition text (between images) */}
            <div className="mobile-only mobile-order-4" style={{ margin: '40px 0' }}>
              <p className="section-title">The Exhibition</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Each month, a new historical collection. Real artifacts. Primary sources. A WWI soldier's helmet. Moon dust from a lunar meteorite. A Victorian needle case. A first edition book from the Harlem Renaissance.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                The objects are authentic. The scholarship is rigorous. The presentation mirrors the care of the world's great museums — only on a smaller scale.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 400,
                fontStyle: 'italic',
              }}>
                Mini exhibitions, big history.
              </p>
            </div>

            {/* Mobile: Moondust Image */}
            <div className="mobile-only mobile-order-5" style={{ margin: '40px 0' }}>
              <img
                src="/about/moondust.jpeg"
                alt="Lunar meteorite sample under microscope"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <p className="image-caption">Lunar Meteorite Adrar 013</p>
            </div>

            <div className="divider mobile-order-6"></div>

            {/* Access Statement */}
            <div className="quote-box mobile-order-7">
              <p className="font-serif" style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#fafafa',
                marginBottom: '20px',
              }}>
                Every child deserves to walk into a room and feel what it's like to stand before history itself. And every school, every teacher should have the opportunity to provide this.
              </p>
              <p style={{
                fontSize: '15px',
                color: '#a3a3a3',
                fontWeight: 300,
                lineHeight: 1.8,
              }}>
                No field trip required. No admission fee. No distance between the student and the thing that survived.
              </p>
            </div>

            {/* The Vision */}
            <div className="section mobile-order-8">
              <p className="section-title">The Vision</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                The Mini Museum began in one school library in Central Texas. It was never meant to end there. Each exhibition is built to travel.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Imagine them all in motion. A network of monthly exhibitions circulating through schools and libraries across the country. A classroom in rural Oklahoma. A library in suburban Florida. A vestibule in small-town Maine.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
              }}>
                Not everyone can get to the great museums. So the museum comes to them.
              </p>
            </div>

            {/* Letters Image */}
            <div className="inline-image mobile-order-9">
              <img
                src="/about/letters.jpeg"
                alt="Historic letters displayed in glass case"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <p className="image-caption">Victorian Letters · Mini Museum Collection</p>
            </div>

            {/* Final Call to Action */}
            <div className="section mobile-order-10" style={{ textAlign: 'center', marginTop: '80px' }}>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 400,
                marginBottom: '20px',
              }}>
                Apply to host. Receive the collection. Pass it on.
              </p>
              <p className="font-serif" style={{
                fontSize: '20px',
                lineHeight: 1.8,
                color: '#fafafa',
                fontWeight: 400,
                fontStyle: 'italic',
              }}>
                History shouldn't require a plane ticket. It should be waiting in the next room.
              </p>
            </div>
          </div>
        )}

        {/* Virtual Content */}
        {activeTab === 'virtual' && (
          <div className="tab-content">
            <div className="divider" style={{ marginTop: '0' }}></div>

            {/* Opening */}
            <div className="section">
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 300,
                marginBottom: '28px',
              }}>
                Not every school can host every exhibition. Not every parent can visit with their child. Not every teacher can bring their class. The Virtual Mini Museum exists so that geography is never a barrier to discovery.
              </p>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 300,
              }}>
                This is not a substitute for the real thing — it is an extension of it. A way to prepare for a visit, to revisit after one, or to experience what distance otherwise denies.
              </p>
            </div>

            <div className="divider"></div>

            {/* For Families */}
            <div className="section">
              <p className="section-title">For Families</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Continue the conversation at home. After a child visits the Mini Museum at school, parents can explore the same exhibition online — reading the stories behind the artifacts, discovering connections, asking new questions together.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
              }}>
                Wonder doesn't end at the school door. It follows children home.
              </p>
            </div>

            <div className="divider"></div>

            {/* For Teachers */}
            <div className="section">
              <p className="section-title">For Teachers</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Each virtual exhibition provides classroom-ready resources: high-resolution images of artifacts, contextual readings, discussion prompts, and primary source documents. Use them to introduce a unit, deepen a lesson, or spark inquiry before students encounter the physical collection.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
              }}>
                The virtual museum is designed to work alongside your curriculum — whether you're teaching the Great War, the Space Race, Women's History, or any of our rotating exhibitions.
              </p>
            </div>

            <div className="divider"></div>

            {/* For Librarians */}
            <div className="section">
              <p className="section-title">For Librarians & Educators Everywhere</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Even if your school isn't hosting a physical exhibition, the virtual collection is yours to use. Share it with teachers. Embed it in your library's resources. Point students toward primary sources they can explore independently.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
              }}>
                The Mini Museum believes that history doesn't belong to one person, one school, or one nation. These resources exist to be used — widely, freely, without restriction.
              </p>
            </div>

            {/* Quote */}
            <div className="quote-box">
              <p className="font-serif" style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#fafafa',
                marginBottom: '20px',
              }}>
                A child in rural Alaska and a child in downtown Austin should have equal access to the artifacts of human history.
              </p>
              <p style={{
                fontSize: '15px',
                color: '#a3a3a3',
                fontWeight: 300,
                lineHeight: 1.8,
              }}>
                The virtual museum makes that possible.
              </p>
            </div>

            {/* What's Online */}
            <div className="section">
              <p className="section-title">What You'll Find Online</p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
                marginBottom: '20px',
              }}>
                Each exhibition includes detailed artifact pages with provenance and historical context, curated links to major museums and archives around the world, downloadable teaching guides, and suggested reading for students at every level.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#a3a3a3',
                fontWeight: 300,
              }}>
                We connect the small to the vast — from the artifact in our collection to the galleries of the Smithsonian, the British Museum, the Imperial War Museum, and beyond.
              </p>
            </div>

            {/* Final */}
            <div className="section" style={{ textAlign: 'center', marginTop: '80px' }}>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.8,
                color: '#d4d4d4',
                fontWeight: 400,
                marginBottom: '20px',
              }}>
                Explore. Share. Return.
              </p>
              <p className="font-serif" style={{
                fontSize: '20px',
                lineHeight: 1.8,
                color: '#fafafa',
                fontWeight: 400,
                fontStyle: 'italic',
              }}>
                The Mini Museum is always open.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          paddingTop: '80px',
          textAlign: 'center',
          borderTop: '1px solid rgba(125, 132, 113, 0.2)',
          marginTop: '80px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#737373',
            marginBottom: '8px',
          }}>
            Founded by Dr. Verity Kahn. Curated for everyone.
          </p>
          <p style={{
            fontSize: '11px',
            color: '#525252',
            letterSpacing: '0.1em',
          }}>
            © 2025 The Mini Museum
          </p>
        </footer>
      </div>
    </div>
  );
}
