'use client';

import Link from 'next/link';

export default function About() {
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
        
        ::-webkit-scrollbar-thumb:hover {
          background: #8e9682;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .container {
            padding: 100px 60px;
            max-width: 850px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 80px 32px;
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 60px 24px;
          }
        }

        .inline-image {
          width: 100%;
          height: auto;
          margin: 60px 0;
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
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
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
          width: 100%;
          max-width: 100%;
        }

        .image-text-row > * {
          min-width: 0;
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .image-text-row {
            grid-template-columns: 1fr;
            gap: 32px;
            margin: 40px 0;
            display: flex;
            flex-direction: column;
          }

          /* First row: image shows first on mobile */
          .image-text-row .image-col {
            order: 1;
          }

          .image-text-row .text-col {
            order: 2;
          }

          /* Exhibition row: text shows first (between the two images) */
          .image-text-row.exhibition-row .text-col {
            order: 1;
          }

          .image-text-row.exhibition-row .image-col {
            order: 2;
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

        @media (max-width: 768px) {
          .image-caption {
            font-size: 10px;
            letter-spacing: 0.15em;
          }
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

        @media (max-width: 768px) {
          .section-title {
            font-size: 10px;
            letter-spacing: 0.25em;
          }
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

        .accent-border {
          border-left: 2px solid #7D8471;
          padding-left: 32px;
        }

        @media (max-width: 768px) {
          .accent-border {
            padding-left: 20px;
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

        @media (max-width: 480px) {
          .quote-box {
            padding: 24px 20px;
          }
        }
      `}</style>

      <div className="container">
        {/* Hero */}
        <div className="section fade-in-up">
          <h1 className="font-serif" style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            color: '#fafafa',
            marginBottom: '24px',
          }}>About</h1>
        </div>

        <div className="divider fade-in-up delay-1"></div>

        {/* Opening Statement with WWI Image */}
        <div className="image-text-row delay-2">
          <div className="text-col">
            <p style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: '#d4d4d4',
              fontWeight: 300,
              marginBottom: '28px',
            }}>
              The Mini Museum is both a place and a principle.
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: '#d4d4d4',
              fontWeight: 300,
              marginBottom: '28px',
            }}>
              The principle: discovery comes before knowledge. Wonder precedes learning. Curiosity is sparked not by explanation, but by encounter — with the real, the rare, the survived. Understanding of our world is found through history.
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: '#d4d4d4',
              fontWeight: 300,
            }}>
              The place: anywhere. A corner of a library, the back of a classroom, the lobby of a school office. History should not be refined to great halls and marble pillars.
            </p>
          </div>

          <div className="image-col">
            <img
              src="/about/wwi.jpeg"
              alt="Mini Museum exhibition display with WWI artifacts"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <p className="image-caption">The Great War Exhibition</p>
          </div>
        </div>

        <div className="divider fade-in-up delay-3"></div>

        {/* The Exhibition with Moondust Image */}
        <div className="image-text-row exhibition-row delay-4">
          <div className="image-col">
            <img
              src="/about/moondust.jpeg"
              alt="Lunar meteorite sample under microscope"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <p className="image-caption">Lunar Meteorite Adrar 013</p>
          </div>

          <div className="text-col">
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
              The objects are authentic. The scholarship is rigorous. The presentation mirrors the care of the world's great museums — only on a small scale.
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

        <div className="divider fade-in-up delay-5"></div>

        {/* Access Statement */}
        <div className="quote-box fade-in-up delay-6">
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
        <div className="section fade-in-up delay-7">
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
        </div>

        {/* Letters Image */}
        <div className="inline-image delay-8">
          <img 
            src="/about/letters.jpeg" 
            alt="Historic letters displayed in glass case"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <p className="image-caption">Victorian Letters · Mini Museum Collection</p>
        </div>

        {/* Final Call to Action */}
        <div className="section fade-in-up delay-8" style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{
            fontSize: '17px',
            lineHeight: 1.8,
            color: '#d4d4d4',
            fontWeight: 300,
            marginBottom: '20px',
          }}>
            Not everyone can get to the great museums. So the museum comes to them.
          </p>
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

        {/* Footer */}
        <footer className="fade-in-up delay-8" style={{
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